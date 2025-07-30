import React, { useState } from "react";
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
  Undo2
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
    pdfFile: "ASO-I_109_25-26Sign_Elire%20Global.pdf",
    documentUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=1000&fit=crop"
  },
  {
    id: "2",
    vendor: "JCSS & Associates LLP",
    amount: 70800,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2025-05-26",
    description: "Professional Fees - N-STP Condonation",
    client: "Elire",
    confidence: 95,
    pdfFile: "ASO-I_117_25-26_Elire Global.pdf",
    documentUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=1000&fit=crop"
  },
  {
    id: "3",
    vendor: "NSDL Database Management Limited",
    amount: 11800,
    source: "drive",
    type: "bill",
    status: "review",
    date: "2025-05-31",
    description: "Equity AMC",
    client: "Elire",
    confidence: 98,
    pdfFile: "EGS001.pdf",
    documentUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1000&fit=crop"
  },
  {
    id: "4",
    vendor: "Sogo Computers",
    amount: 5310,
    source: "brex",
    type: "bill",
    status: "unread",
    date: "2025-05-22",
    description: "Freight Charges",
    client: "Elire",
    confidence: 88,
    pdfFile: "Hys-1117.pdf",
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
    pdfFile: "Hys-1121.pdf",
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
    pdfFile: "INV-25260258.pdf",
    documentUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=1000&fit=crop"
  },
  {
    id: "7",
    vendor: "Clayworks Spaces Pvt Ltd",
    amount: 5251,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2025-05-08",
    description: "Parking Charges-April 2025",
    client: "Elire",
    confidence: 87,
    isRecurring: true,
    pdfFile: "INV-25260376.pdf",
    documentUrl: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&h=1000&fit=crop"
  },
  {
    id: "8",
    vendor: "Sogo Computers",
    amount: 480850,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2025-05-19",
    description: "Laptop Purchase",
    client: "Elire",
    confidence: 96,
    isRecurring: true,
    pdfFile: "PCD-143.pdf",
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
    pdfFile: "PCD-159.pdf",
    documentUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=1000&fit=crop"
  },
  {
    id: "10",
    vendor: "Sogo Computers",
    amount: 96170,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2025-05-22",
    description: "Laptop Purchase",
    client: "Elire",
    confidence: 91,
    isRecurring: true,
    pdfFile: "PCD-160.pdf",
    documentUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=1000&fit=crop"
  },
  {
    id: "11",
    vendor: "Ozone Computer Services",
    amount: 16900,
    source: "email",
    type: "bill",
    status: "review",
    date: "2025-05-10",
    description: "Monitor LG",
    client: "Mahat",
    confidence: 99,
    pdfFile: "725-MAHAT LABS (1).pdf",
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
    pdfFile: "Mahat Labs Pvt Ltd_Invoice_309_29.05.2025.pdf",
    documentUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1000&fit=crop"
  }
];

const filters = [
  { id: "all", label: "All", count: 12, icon: Check },
  { id: "bills", label: "Bills", count: 8, icon: FileText },
  { id: "cards", label: "Credit Cards", count: 4, icon: CreditCard },
  { id: "contracts", label: "Contracts", count: 0, icon: FileText }
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
  const [selectedStatus, setSelectedStatus] = useState("unread");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [role, setRole] = useState("accountant");
  const [mode, setMode] = useState("review-all");
  const [confidenceThreshold, setConfidenceThreshold] = useState(95);
  const { toast } = useToast();

  const filteredTransactions = mockTransactions.filter(transaction => {
    if (selectedFilter !== "all" && !transaction.type.includes(selectedFilter.slice(0, -1))) {
      return false;
    }
    if (selectedStatus === "unread" && transaction.status !== "unread") {
      return false;
    }
    return true;
  });

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
    <div className="h-full flex flex-col">
      
      {/* Add the InboxHeader component */}
      <InboxHeader
        unreadCount={unreadCount}
        totalCount={filteredTransactions.length}
        doneCount={doneCount}
        role="accountant"
        mode="review-all"
        confidenceThreshold={95}
        onRoleChange={() => {}}
        onModeChange={() => {}}
        onConfidenceChange={() => {}}
      />

      {/* Integrated Bills Filter Bar */}
      <div className="flex items-center justify-between py-3 px-4 bg-white border-b border-mobius-gray-200">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            {/* Bills Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 justify-between bg-white border border-mobius-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {selectedFilter === "bills" && <FileText className="w-4 h-4" />}
                    {selectedFilter === "cards" && <CreditCard className="w-4 h-4" />}
                    {selectedFilter === "all" && <Clock className="w-4 h-4" />}
                    <span>
                      {selectedFilter === "bills" && "Bills (8)"}
                      {selectedFilter === "cards" && "Cards (4)"}
                      {selectedFilter === "all" && "All (12)"}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 bg-white border border-mobius-gray-200">
                <DropdownMenuItem 
                  className="flex items-center space-x-2"
                  onClick={() => setSelectedFilter("bills")}
                >
                  <FileText className="w-4 h-4" />
                  <span>Bills (8)</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center space-x-2"
                  onClick={() => setSelectedFilter("cards")}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Cards (4)</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center space-x-2"
                  onClick={() => setSelectedFilter("all")}
                >
                  <Clock className="w-4 h-4" />
                  <span>All (12)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Sort Icon */}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowUpDown className="w-4 h-4 text-mobius-gray-600" />
            </Button>
          </div>

          {/* All/Unread Toggle */}
          <div className="flex items-center">
            <Button 
              variant={selectedStatus === "all" ? "default" : "ghost"}
              size="sm"
              className={`px-4 py-2 rounded-none border-b-2 ${
                selectedStatus === "all" 
                  ? "border-mobius-blue bg-transparent text-mobius-blue hover:bg-mobius-blue/5" 
                  : "border-transparent text-mobius-gray-600 hover:text-mobius-gray-900"
              }`}
              onClick={() => setSelectedStatus("all")}
            >
              All
            </Button>
            <Button 
              variant={selectedStatus === "unread" ? "default" : "ghost"}
              size="sm"
              className={`px-4 py-2 rounded-none border-b-2 ${
                selectedStatus === "unread" 
                  ? "border-mobius-blue bg-transparent text-mobius-blue hover:bg-mobius-blue/5" 
                  : "border-transparent text-mobius-gray-600 hover:text-mobius-gray-900"
              }`}
              onClick={() => setSelectedStatus("unread")}
            >
              Unread
            </Button>
          </div>
        </div>

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
      <div className="flex-1 flex min-h-0">
        <div className="w-1/4">
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
        
        {selectedTransaction && (
          <>
            <DocumentPane transaction={selectedTransaction} />
            <AnalysisPane 
              transaction={selectedTransaction}
              onApprove={handleApprove}
              onEdit={handleEdit}
              onSeeHow={handleSeeHow}
            />
          </>
        )}
      </div>
    </div>
  );
}