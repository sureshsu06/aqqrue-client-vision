import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  pdfFile?: string;
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

  const getAbbreviatedVendor = (vendor: string) => {
    // Create abbreviated versions of vendor names
    const abbreviations: { [key: string]: string } = {
      "JCSS & Associates LLP": "JCSS...",
      "NSDL Database Management Limited": "NSDL...",
      "Sogo Computers": "Sogo...",
      "Clayworks Spaces Pvt Ltd": "Clayworks...",
      "Ozone Computer Services": "Ozone...",
      "MGEcoduties": "MGE...",
      "Clayworks Spaces Technologies Pvt Ltd": "Clayworks..."
    };
    
    return abbreviations[vendor] || vendor.substring(0, 8) + "...";
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "email": 
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200">
                  <img 
                    src="/logos/sharepoint-logo.png" 
                    alt="Email"
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <Mail className="w-4 h-4 text-blue-600 hidden" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Email</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "drive": 
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200">
                  <img 
                    src="/logos/sharepoint-logo.png" 
                    alt="Google Drive"
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <FolderOpen className="w-4 h-4 text-green-600 hidden" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Google Drive</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "brex":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200">
                  <img 
                    src="/logos/sharepoint-logo.png" 
                    alt="Brex"
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <CreditCard className="w-4 h-4 text-purple-600 hidden" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Brex Card</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "ramp":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200">
                  <img 
                    src="/logos/sharepoint-logo.png" 
                    alt="Ramp"
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <CreditCard className="w-4 h-4 text-orange-600 hidden" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ramp Card</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default: 
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200">
                  <img 
                    src="/logos/sharepoint-logo.png" 
                    alt="File"
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <FileText className="w-4 h-4 text-gray-600 hidden" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>File</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "email": return "Email";
      case "drive": return "Google Drive";
      case "brex": return "Brex Card";
      case "ramp": return "Ramp Card";
      default: return "File";
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
              
              {/* Source Logo */}
              {getSourceIcon(transaction.source)}

              <div className="flex-1 min-w-0">
                {/* First line: Amount + badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className={cn(
                      "text-sm font-medium truncate",
                      transaction.status === "unread" ? "text-mobius-gray-900 font-semibold" : "text-mobius-gray-700"
                    )}>
                      ₹{transaction.amount.toLocaleString()}
                    </h3>
                    {transaction.isDuplicate && (
                      <Badge className="text-xs bg-amber-100 text-amber-800 border-amber-200">
                        Duplicate
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Quick Actions - show on hover */}
                    {hoveredRow === transaction.id && transaction.status === "unread" && (
                      <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => onQuickApprove(transaction.id)}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => onQuickAssign(transaction.id)}
                        >
                          <UserCheck className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Second line: Vendor + Description */}
                <div className="mt-1">
                  <p className={cn(
                    "text-sm truncate",
                    transaction.status === "unread" ? "text-mobius-gray-600" : "text-mobius-gray-500"
                  )}>
                    {getAbbreviatedVendor(transaction.vendor)} • {transaction.description}
                  </p>
                </div>

                {/* Third line: Client and Date */}
                <div className="mt-1">
                  <p className={cn(
                    "text-sm truncate",
                    transaction.status === "unread" ? "text-mobius-gray-600" : "text-mobius-gray-500"
                  )}>
                    {transaction.client} • {new Date(transaction.date).toLocaleDateString()}
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