import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { InboxHeader } from "./inbox/InboxHeader";
import { InboxList, Transaction } from "./inbox/InboxList";
import { ReadingPane } from "./inbox/ReadingPane";
import { useToast } from "@/hooks/use-toast";

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
  }
];

const filters = [
  { id: "all", label: "All", count: 12 },
  { id: "bills", label: "Bills", count: 8 },
  { id: "cards", label: "Credit Cards", count: 4 },
  { id: "contracts", label: "Contracts", count: 0 }
];

const statusFilters = [
  { id: "unread", label: "Unread", count: 7 },
  { id: "today", label: "Today", count: 3 },
  { id: "week", label: "This Week", count: 5 }
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
      <InboxHeader
        unreadCount={unreadCount}
        totalCount={totalCount}
        doneCount={doneCount}
        role={role}
        mode={mode}
        confidenceThreshold={confidenceThreshold}
        onRoleChange={setRole}
        onModeChange={setMode}
        onConfidenceChange={setConfidenceThreshold}
      />

      {/* Gmail-style Toolbar */}
      <div className="flex items-center justify-between py-2 px-4 bg-mobius-gray-50 rounded-lg mb-4">
        <div className="flex items-center space-x-1">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
              className="h-8"
            >
              <span>{filter.label}</span>
              <Badge variant="secondary" className="ml-1 text-xs h-5">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>
        
        <div className="flex items-center space-x-1">
          {statusFilters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedStatus === filter.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedStatus(filter.id)}
              className="h-8"
            >
              <span>{filter.label}</span>
              <Badge variant="secondary" className="ml-1 text-xs h-5">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Inbox with Reading Pane */}
      <div className="flex-1 flex min-h-0">
        <div className="w-1/2">
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