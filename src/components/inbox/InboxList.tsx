import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  UserCheck
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
    <div className="h-full">
      <div className="divide-y divide-border">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={cn(
              "px-4 py-3 transition-all cursor-pointer border-l-2 relative h-14 flex items-center",
              transaction.status === "unread" ? "border-l-blue-500 bg-blue-50/30" : "border-l-transparent",
              selectedTransaction?.id === transaction.id ? "bg-blue-50" : "hover:bg-gray-50"
            )}
            onClick={() => onTransactionSelect(transaction)}
            onMouseEnter={() => setHoveredRow(transaction.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <div className="flex items-center w-full space-x-3">
              <Checkbox 
                checked={selectedTransactions.includes(transaction.id)}
                onCheckedChange={(checked) => onTransactionToggle(transaction.id, !!checked)}
                onClick={(e) => e.stopPropagation()}
                className="shrink-0"
              />
              
              <div className="flex items-center space-x-2 text-gray-400 shrink-0">
                {getSourceIcon(transaction.source)}
                {getStatusIcon(transaction.status)}
              </div>

              <div className="flex-1 min-w-0">
                {/* Two-line layout */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Line 1: Vendor + badges */}
                    <div className="flex items-center space-x-2 mb-0.5">
                      <h3 className={cn(
                        "font-semibold truncate text-sm",
                        transaction.status === "unread" ? "text-gray-900" : "text-gray-700"
                      )}>
                        {transaction.vendor}
                      </h3>
                      {transaction.isDuplicate && (
                        <span className="quanta-pill amber text-xs">Duplicate</span>
                      )}
                      {transaction.isRecurring && (
                        <span className="quanta-pill blue text-xs">Recurring</span>
                      )}
                    </div>
                    
                    {/* Line 2: meta info */}
                    <p className="text-xs quanta-muted truncate">
                      {transaction.description} • {transaction.client}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1 ml-4 shrink-0">
                    {/* Amount */}
                    <div className="text-right">
                      <p className="quanta-value text-sm">
                        ${transaction.amount.toLocaleString()}
                      </p>
                      {transaction.confidence && (
                        <span className={cn(
                          "quanta-pill text-xs mt-0.5 inline-block",
                          transaction.confidence >= 95 ? "green" : 
                          transaction.confidence >= 85 ? "blue" : "gray"
                        )}>
                          {transaction.confidence}%
                        </span>
                      )}
                    </div>
                    
                    {/* Date */}
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions - show on hover */}
              {hoveredRow === transaction.id && transaction.status === "unread" && (
                <div className="flex space-x-1 absolute right-4 bg-white rounded shadow-md p-1" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="quanta-btn ghost text-xs px-2 py-1 h-6"
                    onClick={() => onQuickApprove(transaction.id)}
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Approve
                  </button>
                  <button 
                    className="quanta-btn ghost text-xs px-2 py-1 h-6"
                    onClick={() => onQuickAssign(transaction.id)}
                  >
                    <UserCheck className="w-3 h-3 mr-1" />
                    Assign
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}