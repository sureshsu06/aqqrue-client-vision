import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { InboxHeader } from "./inbox/InboxHeader";
import { InboxList, Transaction } from "./inbox/InboxList";
import { DocumentPane } from "./inbox/DocumentPane";
import { AnalysisPane } from "./inbox/AnalysisPane";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Check, 
  Mail, 
  CreditCard, 
  FileText,
  Clock,
  ArrowUpDown,
  ChevronDown,
  Undo2,
  Filter,
  Upload
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    vendor: "JCSS & Associates LLP",
    amount: 94400,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2025-05-26",
    description: "Professional Fees - May 2025",
    client: "Elire",
    isRecurring: true,
    pdfFile: "bills/ASO-I_109_25-26Sign_Elire Global.pdf",
    documentUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=1000&fit=crop"
  },
  {
    id: "2",
    vendor: "JCSS & Associates LLP",
    amount: 70800,
    source: "email",
    type: "bill",
    status: "review",
    date: "2025-05-26",
    description: "Professional Fees - N-STP Condonation",
    client: "Elire",
    confidence: 95,
    pdfFile: "bills/ASO-I_117_25-26_Elire Global.pdf",
    documentUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=1000&fit=crop"
  },
  {
    id: "3",
    vendor: "NSDL Database Management Limited",
    amount: 11800,
    source: "drive",
    type: "bill",
    status: "done",
    date: "2025-05-31",
    description: "Equity AMC",
    client: "Elire",
    confidence: 98,
    pdfFile: "bills/EGS001.pdf",
    documentUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1000&fit=crop"
  },
  {
    id: "4",
    vendor: "Sogo Computers",
    amount: 5310,
    source: "brex",
    type: "bill",
    status: "review",
    date: "2025-05-22",
    description: "Freight Charges",
    client: "Elire",
    confidence: 88,
    pdfFile: "bills/Hys-1117.pdf",
    documentUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=1000&fit=crop"
  },
  {
    id: "5",
    vendor: "Sogo Computers",
    amount: 5310,
    source: "ramp",
    type: "bill",
    status: "done",
    date: "2025-05-22",
    description: "Freight Charges",
    client: "Elire",
    confidence: 100,
    isRecurring: true,
    pdfFile: "bills/Hys-1121.pdf",
    documentUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=1000&fit=crop"
  },
  {
    id: "6",
    vendor: "Clayworks Spaces Pvt Ltd",
    amount: 102660,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2025-05-22",
    description: "Rent",
    client: "Elire",
    confidence: 92,
    isRecurring: true,
    pdfFile: "bills/INV-25260258.pdf",
    documentUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=1000&fit=crop"
  },
  {
    id: "7",
    vendor: "Clayworks Spaces Pvt Ltd",
    amount: 5251,
    source: "email",
    type: "bill",
    status: "review",
    date: "2025-05-08",
    description: "Parking Charges-April 2025",
    client: "Elire",
    confidence: 87,
    isRecurring: true,
    pdfFile: "bills/INV-25260376.pdf",
    documentUrl: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&h=1000&fit=crop"
  },
  {
    id: "8",
    vendor: "Sogo Computers",
    amount: 480850,
    source: "email",
    type: "bill",
    status: "done",
    date: "2025-05-19",
    description: "Laptop Purchase",
    client: "Elire",
    confidence: 96,
    isRecurring: true,
    pdfFile: "bills/PCD-143.pdf",
    documentUrl: "https://images.unsplash.com/photo-1633114127408-af671c774b39?w=800&h=1000&fit=crop"
  },
  {
    id: "9",
    vendor: "Sogo Computers",
    amount: 96170,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2025-05-22",
    description: "Laptop Purchase",
    client: "Elire",
    confidence: 94,
    isRecurring: true,
    pdfFile: "bills/PCD-159.pdf",
    documentUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=1000&fit=crop"
  },
  {
    id: "10",
    vendor: "Sogo Computers",
    amount: 96170,
    source: "email",
    type: "bill",
    status: "review",
    date: "2025-05-22",
    description: "Laptop Purchase",
    client: "Elire",
    confidence: 91,
    isRecurring: true,
    pdfFile: "bills/PCD-160.pdf",
    documentUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=1000&fit=crop"
  },
  {
    id: "11",
    vendor: "Ozone Computer Services",
    amount: 16900,
    source: "email",
    type: "bill",
    status: "done",
    date: "2025-05-10",
    description: "Monitor LG",
    client: "Mahat",
    confidence: 99,
    pdfFile: "bills/725-MAHAT LABS (1).pdf",
    documentUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=1000&fit=crop"
  },
  {
    id: "12",
    vendor: "MGEcoduties",
    amount: 8174,
    source: "email",
    type: "bill",
    status: "done",
    date: "2025-05-29",
    description: "Office Supplies",
    client: "Mahat",
    confidence: 97,
    pdfFile: "bills/Mahat Labs Pvt Ltd_Invoice_309_29.05.2025.pdf",
    documentUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1000&fit=crop"
  },
  // Contract transactions for Revenue tab
  {
    id: "13",
    vendor: "Bishop Wisecarver",
    amount: 7020,
    currency: "USD",
    source: "email",
    type: "contract",
    status: "unread",
    date: "2025-10-01",
    description: "RhythmsAI OKR Platform - 65 Owner Users",
    client: "Rhythms",
    confidence: 85,
    pdfFile: "contracts/Bishop Wisecarver_Complete_with_Docusign_Rhythms_-_Cloud_Servi (2).pdf",
    documentUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=1000&fit=crop",
    contractStartDate: "2025-10-01",
    contractEndDate: "2026-07-31",
    billingCycle: "Annual",
    contractValue: 7020,
    contractTerm: "10 months"
  },
  {
    id: "14",
    vendor: "MARKETview Technology, LLC",
    amount: 10000,
    currency: "USD",
    source: "drive",
    type: "contract",
    status: "review",
    date: "2025-09-01",
    description: "RhythmsAI OKR Platform - 100 Permitted Users",
    client: "Rhythms",
    confidence: 92,
    pdfFile: "contracts/MARKETview_Complete_with_Docusign_Rhythms_-_Cloud_Servi (1).pdf",
    documentUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=1000&fit=crop",
    contractStartDate: "2025-07-01",
    contractEndDate: "2028-08-31",
    billingCycle: "Annual",
    contractValue: 30000,
    contractTerm: "38 months"
  },
  {
    id: "15",
    vendor: "Sera",
    amount: 95000,
    currency: "USD",
    source: "email",
    type: "contract",
    status: "done",
    date: "2025-05-15",
    description: "SaaS Cloud Services Agreement",
    client: "Rhythms",
    confidence: 98,
    pdfFile: "contracts/Sera_Complete_with_Docusign_Rhythms_-_Cloud_Servi (2).pdf",
    documentUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
    contractStartDate: "2025-06-01",
    contractEndDate: "2026-05-31",
    billingCycle: "Annual",
    contractValue: 95000,
    contractTerm: "12 months"
  },
  {
    id: "16",
    vendor: "Clipper Media Acquisition I, LLC",
    amount: 7999,
    currency: "USD",
    source: "email",
    type: "contract",
    status: "unread",
    date: "2025-06-12",
    description: "RhythmsAI OKR Platform - SaaS Subscription",
    client: "Rhythms",
    confidence: 88,
    pdfFile: "contracts/050825 Rhythms Valpak Cloud Services Agreement - signed - signed.pdf",
    documentUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=1000&fit=crop",
    contractStartDate: "2025-06-13",
    contractEndDate: "2026-05-12",
    billingCycle: "Annual",
    contractValue: 7999,
    contractTerm: "11 months"
  },
  {
    id: "17",
    vendor: "Networkology",
    amount: 110000,
    currency: "USD",
    source: "drive",
    type: "contract",
    status: "review",
    date: "2025-05-05",
    description: "SaaS Cloud Services Agreement",
    client: "Rhythms",
    confidence: 94,
    pdfFile: "contracts/Rhythms - Cloud Services Agreement - Networkology.doc.pdf",
    documentUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1000&fit=crop",
    contractStartDate: "2025-06-01",
    contractEndDate: "2026-05-31",
    billingCycle: "Annual",
    contractValue: 110000,
    contractTerm: "12 months"
  },
  {
    id: "18",
    vendor: "AlineOps",
    amount: 135000,
    currency: "USD",
    source: "email",
    type: "contract",
    status: "done",
    date: "2025-05-01",
    description: "SaaS Cloud Services Agreement",
    client: "Rhythms",
    confidence: 96,
    pdfFile: "contracts/Rhythms - Cloud Services Agreement - AlineOps.docx.pdf",
    documentUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=1000&fit=crop",
    contractStartDate: "2025-06-01",
    contractEndDate: "2026-05-31",
    billingCycle: "Annual",
    contractValue: 135000,
    contractTerm: "12 months"
  }
];

const filters = [
  { id: "all", label: "All", count: 18, icon: Check },
  { id: "bills", label: "Bills", count: 12, icon: FileText },
  { id: "cards", label: "Credit Cards", count: 0, icon: CreditCard },
  { id: "contracts", label: "Contracts", count: 6, icon: FileText }
];

const statusFilters = [
  { id: "unread", label: "Unread", count: 7, icon: Mail },
  { id: "today", label: "Today", count: 3, icon: Clock },
  { id: "week", label: "This Week", count: 5, icon: Clock }
];

interface TransactionInboxProps {
  onTransactionSelect: (transaction: Transaction) => void;
}

export function TransactionInbox({ onTransactionSelect }: TransactionInboxProps) {
  const [selectedFilter, setSelectedFilter] = useState("bills");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTab, setSelectedTab] = useState<"expenses" | "revenue">("expenses");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [role, setRole] = useState("accountant");
  const [mode, setMode] = useState("review-all");
  const [confidenceThreshold, setConfidenceThreshold] = useState(95);
  const { toast } = useToast();

  const filteredTransactions = mockTransactions.filter(transaction => {
    // Filter by tab (expenses/revenue) - this takes priority
    if (selectedTab === "expenses" && transaction.type !== "bill") {
      return false;
    }
    if (selectedTab === "revenue" && transaction.type !== "contract") {
      return false;
    }
    
    // Filter by transaction type (only applies when not using tab filtering)
    if (selectedFilter !== "all" && selectedFilter !== "bills" && selectedFilter !== "contracts") {
      if (!transaction.type.includes(selectedFilter.slice(0, -1))) {
        return false;
      }
    }
    
    // Filter by status
    if (selectedStatus === "unread" && transaction.status !== "unread") {
      return false;
    }
    
    return true;
  });

  // Auto-select first transaction when component mounts or filters change
  useEffect(() => {
    if (filteredTransactions.length > 0 && !selectedTransaction) {
      setSelectedTransaction(filteredTransactions[0]);
    }
  }, [filteredTransactions, selectedTransaction]);

  const unreadCount = mockTransactions.filter(t => t.status === "unread").length;
  const doneCount = mockTransactions.filter(t => t.status === "done").length;
  const totalCount = mockTransactions.length;

  const handleTransactionSelect = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleTransactionToggle = (transactionId: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, transactionId]);
    } else {
      setSelectedTransactions(selectedTransactions.filter(id => id !== transactionId));
    }
  };

  const handleQuickApprove = (transactionId: string) => {
    toast({
      title: "Transaction approved",
      description: "Posted to QuickBooks • JE# QB-000192"
    });
  };

  const handleQuickAssign = (transactionId: string) => {
    toast({
      title: "Transaction assigned",
      description: "Assigned to Controller for review"
    });
  };

  const handleApprove = () => {
    if (selectedTransaction) {
      toast({
        title: "Transaction approved",
        description: "Posted to QuickBooks • JE# QB-000192"
      });
      
      // Auto-advance to next transaction
      const currentIndex = filteredTransactions.findIndex(t => t.id === selectedTransaction.id);
      if (currentIndex < filteredTransactions.length - 1) {
        setSelectedTransaction(filteredTransactions[currentIndex + 1]);
      } else {
        setSelectedTransaction(null);
      }
    }
  };

  const handleEdit = () => {
    onTransactionSelect(selectedTransaction!);
  };

  const handleSeeHow = () => {
    onTransactionSelect(selectedTransaction!);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      
      {/* Add the InboxHeader component */}
      <InboxHeader
        unreadCount={unreadCount}
        totalCount={filteredTransactions.length}
        doneCount={doneCount}
        role="accountant"
        mode="review-all"
        confidenceThreshold={95}
        selectedFilter={selectedFilter}
        selectedStatus={selectedStatus}
        onRoleChange={() => {}}
        onModeChange={() => {}}
        onConfidenceChange={() => {}}
        onFilterChange={setSelectedFilter}
        onStatusChange={setSelectedStatus}
      />

      {/* Revenue/Expenses Tabs Row */}
      <div className="flex items-center justify-between py-3 px-4 bg-white border-b border-mobius-gray-200 flex-shrink-0">
        <div className="flex items-center">
          <Button 
            variant={selectedTab === "expenses" ? "default" : "ghost"}
            size="sm"
            className={`px-4 py-2 rounded-none border-b-2 ${
              selectedTab === "expenses" 
                ? "border-mobius-blue bg-transparent text-mobius-blue hover:bg-mobius-blue/5" 
                : "border-transparent text-mobius-gray-600 hover:text-mobius-gray-900"
            }`}
            onClick={() => setSelectedTab("expenses")}
          >
            Expenses
          </Button>
          <Button 
            variant={selectedTab === "revenue" ? "default" : "ghost"}
            size="sm"
            className={`px-4 py-2 rounded-none border-b-2 ${
              selectedTab === "revenue" 
                ? "border-mobius-blue bg-transparent text-mobius-blue hover:bg-mobius-blue/5" 
                : "border-transparent text-mobius-gray-600 hover:text-mobius-gray-900"
            }`}
            onClick={() => setSelectedTab("revenue")}
          >
            Revenue
          </Button>
        </div>

        {/* Upload Button for Revenue tab */}
        {selectedTab === "revenue" && (
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-3 text-sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Contract
            </Button>
          </div>
        )}

        {/* Undo Button - positioned to the right */}
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-mobius-gray-100 rounded"
                >
                  <Undo2 className="w-4 h-4 text-mobius-gray-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Inbox with Reading Pane */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Inbox List - Independent scrolling */}
        <div className="w-1/5 flex flex-col min-h-0 border-r border-mobius-gray-100">
          <div className="flex-1 overflow-y-auto">
            <InboxList
              transactions={filteredTransactions}
              selectedTransaction={selectedTransaction}
              selectedTransactions={selectedTransactions}
              onTransactionSelect={handleTransactionSelect}
              onTransactionToggle={handleTransactionToggle}
              onQuickApprove={handleQuickApprove}
              onQuickAssign={handleQuickAssign}
            />
          </div>
        </div>
        
        {selectedTransaction && (
          <>
            {/* Document Pane - Independent scrolling */}
            <div className="w-2/5 flex flex-col min-h-0 border-l border-mobius-gray-100">
              <div className="flex-1 overflow-y-auto">
                <DocumentPane transaction={selectedTransaction} />
              </div>
            </div>
            
            {/* Analysis Pane - Independent scrolling */}
            <div className="w-2/5 flex flex-col min-h-0 border-l border-mobius-gray-100">
              <div className="flex-1 overflow-y-auto">
                <AnalysisPane 
                  transaction={selectedTransaction}
                  onApprove={handleApprove}
                  onEdit={handleEdit}
                  onSeeHow={handleSeeHow}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}