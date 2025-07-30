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
  documentUrl?: string;
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
    <Card className="flex-1 bg-white shadow-mobius-md">
      <div className="divide-y divide-mobius-gray-100">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={cn(
              "p-3 transition-colors cursor-pointer border-l-4 relative",
              transaction.status === "unread" ? "border-l-mobius-blue bg-blue-50/30" : "border-l-transparent",
              selectedTransaction?.id === transaction.id ? "bg-mobius-blue/10" : "hover:bg-mobius-gray-50"
            )}
            onClick={() => onTransactionSelect(transaction)}
            onMouseEnter={() => setHoveredRow(transaction.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <div className="flex items-center space-x-3">
              <Checkbox 
                checked={selectedTransactions.includes(transaction.id)}
                onCheckedChange={(checked) => onTransactionToggle(transaction.id, !!checked)}
                onClick={(e) => e.stopPropagation()}
              />

              <div className="flex-1 min-w-0">
                {/* First line: Vendor + badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className={cn(
                      "font-medium truncate",
                      transaction.status === "unread" ? "text-mobius-gray-900 font-semibold" : "text-mobius-gray-700"
                    )}>
                      {transaction.vendor}
                    </h3>
                    {transaction.isDuplicate && (
                      <Badge className="text-xs bg-amber-100 text-amber-800 border-amber-200">
                        Duplicate
                      </Badge>
                    )}
                    {transaction.isRecurring && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        Recurring
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={cn(
                        "font-medium font-variant-numeric: tabular-nums",
                        transaction.status === "unread" ? "text-mobius-gray-900" : "text-mobius-gray-700"
                      )}>
                        ${transaction.amount.toLocaleString()}
                      </p>
                    </div>
                    
                    {transaction.confidence && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          transaction.confidence >= 95 
                            ? 'bg-status-done/10 text-status-done border-status-done/20'
                            : transaction.confidence >= 85
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-mobius-gray-50 text-mobius-gray-600 border-mobius-gray-200'
                        }`}
                      >
                        {transaction.confidence}%
                      </Badge>
                    )}

                    {/* Quick Actions - show on hover */}
                    {hoveredRow === transaction.id && transaction.status === "unread" && (
                      <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs"
                          onClick={() => onQuickApprove(transaction.id)}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs"
                          onClick={() => onQuickAssign(transaction.id)}
                        >
                          <UserCheck className="w-3 h-3 mr-1" />
                          Assign
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Second line: meta info */}
                <div className="mt-1">
                  <p className={cn(
                    "text-sm truncate",
                    transaction.status === "unread" ? "text-mobius-gray-600" : "text-mobius-gray-500"
                  )}>
                    {transaction.description} • {transaction.client} • {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}