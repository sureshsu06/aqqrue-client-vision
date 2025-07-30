import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { 
  Mail, 
  FolderOpen, 
  CreditCard, 
  FileText, 
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit3,
  UserCheck,
  MoreHorizontal
} from "lucide-react";

export interface Transaction {
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

interface InboxListProps {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  selectedTransactions: string[];
  onTransactionSelect: (transaction: Transaction) => void;
  onTransactionToggle: (transactionId: string, checked: boolean) => void;
  onQuickApprove: (transactionId: string) => void;
  onQuickAssign: (transactionId: string) => void;
}

export function InboxList({ 
  transactions, 
  selectedTransaction,
  selectedTransactions,
  onTransactionSelect,
  onTransactionToggle,
  onQuickApprove,
  onQuickAssign
}: InboxListProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

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

  return (
    <div className="h-full overflow-auto">
      <div className="space-y-0">
        {transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className={cn(
              "group flex items-center space-x-4 p-4 cursor-pointer transition-all duration-200",
              "border-b border-glass-border last:border-b-0",
              "hover:transform hover:-translate-y-0.5 hover:bg-white/5",
              selectedTransaction?.id === transaction.id
                ? "bg-quanta-accent/10 border-l-2 border-l-quanta-accent"
                : "",
              selectedTransactions.includes(transaction.id) && "bg-quanta-accent/5"
            )}
            onClick={() => onTransactionSelect(transaction)}
            onMouseEnter={() => setHoveredRow(transaction.id)}
            onMouseLeave={() => setHoveredRow(null)}
            style={{ height: '60px' }}
          >
            <Checkbox
              checked={selectedTransactions.includes(transaction.id)}
              onCheckedChange={(checked) => onTransactionToggle(transaction.id, checked as boolean)}
              onClick={(e) => e.stopPropagation()}
              className="data-[state=checked]:bg-quanta-accent"
            />
            
            <div className="flex-1 min-w-0 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                {/* Line 1: Vendor + Badges */}
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-base text-quanta-text">{transaction.vendor}</span>
                  {transaction.isDuplicate && (
                    <span className="pill amber">Duplicate</span>
                  )}
                  {transaction.isRecurring && (
                    <span className="pill blue">Recurring</span>
                  )}
                </div>
                
                {/* Line 2: Description + Client */}
                <p className="text-sm text-quanta-muted truncate leading-tight">
                  {transaction.description} • {transaction.client}
                </p>
              </div>
              
              {/* Right Column: Amount, Date, Confidence */}
              <div className="text-right flex flex-col items-end space-y-1 ml-4">
                {transaction.confidence && (
                  <span className={cn(
                    "pill text-xs",
                    transaction.confidence >= 95 
                      ? "green"
                      : transaction.confidence >= 85
                      ? "blue"
                      : "gray"
                  )}>
                    {transaction.confidence}%
                  </span>
                )}
                <div className="amount text-lg font-bold text-quanta-text">
                  ${transaction.amount.toLocaleString()}
                </div>
                <div className="text-xs text-quanta-label font-medium">
                  {new Date(transaction.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="ml-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="btn icon opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-card">
                    <DropdownMenuItem onClick={() => onQuickApprove(transaction.id)}>
                      Quick Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onQuickAssign(transaction.id)}>
                      Assign to Controller
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}