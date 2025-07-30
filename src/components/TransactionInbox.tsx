import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { InboxHeader } from "./inbox/InboxHeader";
import { InboxList, Transaction } from "./inbox/InboxList";
import { ReadingPane } from "./inbox/ReadingPane";
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
  Calendar,
  ChevronDown
} from "lucide-react";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    vendor: "WeWork",
    amount: 12750,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2024-07-31",
    description: "Office Space - Monthly Rent",
    client: "TechStartup Inc",
    isDuplicate: true,
    isRecurring: true,
    documentUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=1000&fit=crop"
  },
  {
    id: "2",
    vendor: "AWS",
    amount: 4847,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2024-07-28",
    description: "July Infrastructure",
    client: "StartupCo",
    confidence: 95,
    documentUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=1000&fit=crop"
  },
  {
    id: "3",
    vendor: "Farm Again",
    amount: 2450,
    source: "drive",
    type: "bill",
    status: "review",
    date: "2024-07-30",
    description: "Hardware Purchase Invoice",
    client: "TechStartup Inc",
    confidence: 98,
    documentUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1000&fit=crop"
  },
  {
    id: "4",
    vendor: "Vanta Inc",
    amount: 5550,
    source: "brex",
    type: "card",
    status: "unread",
    date: "2024-07-28",
    description: "Compliance Suite - Multi-period",
    client: "TechStartup Inc",
    confidence: 88,
    documentUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=1000&fit=crop"
  },
  {
    id: "5",
    vendor: "Zoom",
    amount: 149,
    source: "ramp",
    type: "card",
    status: "done",
    date: "2024-07-25",
    description: "Monthly Subscription",
    client: "StartupCo",
    confidence: 100,
    isRecurring: true,
    documentUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=1000&fit=crop"
  },
  {
    id: "6",
    vendor: "Slack",
    amount: 79,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2024-07-30",
    description: "Pro Plan - Monthly",
    client: "TechStartup Inc",
    confidence: 92,
    isRecurring: true,
    documentUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=1000&fit=crop"
  },
  {
    id: "7",
    vendor: "Adobe",
    amount: 239,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2024-07-29",
    description: "Creative Cloud Team License",
    client: "DesignCorp",
    confidence: 87,
    isRecurring: true,
    documentUrl: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&h=1000&fit=crop"
  },
  {
    id: "8",
    vendor: "Microsoft",
    amount: 450,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2024-07-28",
    description: "Office 365 Enterprise",
    client: "TechStartup Inc",
    confidence: 96,
    isRecurring: true,
    documentUrl: "https://images.unsplash.com/photo-1633114127408-af671c774b39?w=800&h=1000&fit=crop"
  },
  {
    id: "9",
    vendor: "GitHub",
    amount: 210,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2024-07-27",
    description: "Enterprise Plan - 50 seats",
    client: "StartupCo",
    confidence: 94,
    isRecurring: true,
    documentUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=1000&fit=crop"
  },
  {
    id: "10",
    vendor: "Figma",
    amount: 144,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2024-07-26",
    description: "Professional Team Plan",
    client: "DesignCorp",
    confidence: 91,
    isRecurring: true,
    documentUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=1000&fit=crop"
  },
  {
    id: "11",
    vendor: "Stripe",
    amount: 890,
    source: "email",
    type: "bill",
    status: "review",
    date: "2024-07-25",
    description: "Payment Processing Fees",
    client: "TechStartup Inc",
    confidence: 99,
    documentUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=1000&fit=crop"
  },
  {
    id: "12",
    vendor: "DigitalOcean",
    amount: 320,
    source: "email",
    type: "bill",
    status: "done",
    date: "2024-07-24",
    description: "Cloud Infrastructure",
    client: "StartupCo",
    confidence: 97,
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
  { id: "today", label: "Today", count: 3, icon: Calendar },
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

      {/* Gmail-style Toolbar */}
      <div className="flex items-center justify-between py-2 pl-0.5 pr-4 bg-mobius-gray-50 rounded-lg mb-4">
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[140px] justify-between bg-white">
                <div className="flex items-center space-x-2">
                  {React.createElement(filters.find(f => f.id === selectedFilter)?.icon || Check, { 
                    className: "w-4 h-4" 
                  })}
                  <span>
                    {filters.find(f => f.id === selectedFilter)?.label} 
                    ({filters.find(f => f.id === selectedFilter)?.count})
                  </span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[140px]">
              {filters.map((filter) => (
                <DropdownMenuItem 
                  key={filter.id} 
                  onClick={() => setSelectedFilter(filter.id)}
                  className="flex items-center space-x-2"
                >
                  <filter.icon className="w-4 h-4" />
                  <span>{filter.label} ({filter.count})</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[140px] justify-between bg-white">
                <div className="flex items-center space-x-2">
                  {React.createElement(statusFilters.find(f => f.id === selectedStatus)?.icon || Mail, { 
                    className: "w-4 h-4" 
                  })}
                  <span>
                    {statusFilters.find(f => f.id === selectedStatus)?.label} 
                    ({statusFilters.find(f => f.id === selectedStatus)?.count})
                  </span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[140px]">
              {statusFilters.map((filter) => (
                <DropdownMenuItem 
                  key={filter.id} 
                  onClick={() => setSelectedStatus(filter.id)}
                  className="flex items-center space-x-2"
                >
                  <filter.icon className="w-4 h-4" />
                  <span>{filter.label} ({filter.count})</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Inbox with Reading Pane */}
      <div className="flex-1 flex min-h-0">
        <div className="w-1/3">
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
          <ReadingPane
            transaction={selectedTransaction}
            onApprove={handleApprove}
            onEdit={handleEdit}
            onSeeHow={handleSeeHow}
          />
        )}
      </div>
    </div>
  );
}