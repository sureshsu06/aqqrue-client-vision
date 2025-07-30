import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Mail, 
  FolderOpen, 
  CreditCard, 
  FileText, 
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";

interface Transaction {
  id: string;
  vendor: string;
  amount: number;
  source: "email" | "drive" | "brex" | "ramp";
  type: "bill" | "card" | "contract";
  status: "unread" | "review" | "approved" | "done";
  date: string;
  description: string;
  client: string;
  confidence?: number;
  isDuplicate?: boolean;
  isRecurring?: boolean;
}

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
    isRecurring: true
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
    confidence: 95
  },
  {
    id: "3",
    vendor: "Figma",
    amount: 1440,
    source: "drive",
    type: "bill",
    status: "review",
    date: "2024-07-30",
    description: "Annual Renewal",
    client: "DesignStudio",
    confidence: 100
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
    confidence: 88
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
    isRecurring: true
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
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("unread");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "email": return <Mail className="w-4 h-4" />;
      case "drive": return <FolderOpen className="w-4 h-4" />;
      case "brex":
      case "ramp": return <CreditCard className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done": return <CheckCircle2 className="w-4 h-4 text-status-done" />;
      case "approved": return <CheckCircle2 className="w-4 h-4 text-status-approved" />;
      case "review": return <AlertCircle className="w-4 h-4 text-status-review" />;
      default: return <Clock className="w-4 h-4 text-status-pending" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      unread: "bg-status-pending/10 text-status-pending border-status-pending/20",
      review: "bg-status-review/10 text-status-review border-status-review/20",
      approved: "bg-status-approved/10 text-status-approved border-status-approved/20",
      done: "bg-status-done/10 text-status-done border-status-done/20"
    };
    return variants[status as keyof typeof variants] || variants.unread;
  };

  const filteredTransactions = mockTransactions.filter(transaction => {
    if (selectedFilter !== "all" && !transaction.type.includes(selectedFilter.slice(0, -1))) {
      return false;
    }
    if (selectedStatus === "unread" && transaction.status !== "unread") {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-mobius-gray-900">Transaction Inbox</h1>
          <p className="text-mobius-gray-500 mt-1">Review and approve your transactions</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Badge variant="outline" className="bg-status-pending/10 text-status-pending">
            {filteredTransactions.length} pending
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-6">
        <div className="flex space-x-1">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
              className="flex items-center space-x-2"
            >
              <span>{filter.label}</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>
        
        <div className="flex space-x-1">
          {statusFilters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedStatus === filter.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedStatus(filter.id)}
              className="flex items-center space-x-2"
            >
              <span>{filter.label}</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <Card className="bg-white shadow-mobius-md">
        <div className="divide-y divide-mobius-gray-100">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-4 hover:bg-mobius-gray-50 transition-colors cursor-pointer"
              onClick={() => onTransactionSelect(transaction)}
            >
              <div className="flex items-center space-x-4">
                <Checkbox 
                  checked={selectedTransactions.includes(transaction.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedTransactions([...selectedTransactions, transaction.id]);
                    } else {
                      setSelectedTransactions(selectedTransactions.filter(id => id !== transaction.id));
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div className="flex items-center space-x-2 text-mobius-gray-500">
                  {getSourceIcon(transaction.source)}
                  {getStatusIcon(transaction.status)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-mobius-gray-900 truncate">
                      {transaction.vendor}
                    </h3>
                    {transaction.isDuplicate && (
                      <Badge variant="destructive" className="text-xs">
                        Duplicate
                      </Badge>
                    )}
                    {transaction.isRecurring && (
                      <Badge variant="outline" className="text-xs">
                        Recurring
                      </Badge>
                    )}
                    {transaction.confidence && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          transaction.confidence >= 95 
                            ? 'bg-status-done/10 text-status-done border-status-done/20'
                            : transaction.confidence >= 85
                            ? 'bg-status-review/10 text-status-review border-status-review/20'
                            : 'bg-status-pending/10 text-status-pending border-status-pending/20'
                        }`}
                      >
                        {transaction.confidence}% confidence
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-mobius-gray-500 mt-1">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-mobius-gray-400 mt-1">
                    Client: {transaction.client}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium text-mobius-gray-900">
                      ${transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-mobius-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={getStatusBadge(transaction.status)}
                  >
                    {transaction.status}
                  </Badge>

                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}