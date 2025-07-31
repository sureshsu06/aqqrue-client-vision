import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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
  AlertTriangle,
  X,
  Eye
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DocumentPane } from "@/components/inbox/DocumentPane";
import { Transaction } from "@/components/inbox/InboxList";

interface ExceptionTransaction extends Transaction {
  exceptionType: string;
  exceptionReason: string;
  duplicateOf?: string;
}

const mockExceptionTransactions: ExceptionTransaction[] = [
  {
    id: "ex-1",
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
    documentUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=1000&fit=crop",
    exceptionType: "duplicate",
    exceptionReason: "Duplicate invoice detected - same invoice number and amount as transaction #1",
    duplicateOf: "1"
  }
];

interface ExceptionsInboxProps {
  onTransactionSelect?: (transaction: ExceptionTransaction) => void;
}

export function ExceptionsInbox({ onTransactionSelect }: ExceptionsInboxProps) {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<ExceptionTransaction | null>(null);
  const { toast } = useToast();

  const filteredTransactions = mockExceptionTransactions.filter(transaction => {
    if (selectedStatus === "all") return true;
    if (selectedStatus === "duplicate" && transaction.exceptionType === "duplicate") return true;
    return false;
  });

  const duplicateCount = mockExceptionTransactions.filter(t => t.exceptionType === "duplicate").length;
  const totalCount = mockExceptionTransactions.length;

  const handleTransactionSelect = (transaction: ExceptionTransaction) => {
    setSelectedTransaction(transaction);
    if (onTransactionSelect) {
      onTransactionSelect(transaction);
    }
  };

  const handleTransactionToggle = (transactionId: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, transactionId]);
    } else {
      setSelectedTransactions(selectedTransactions.filter(id => id !== transactionId));
    }
  };

  const handleResolveException = (transactionId: string) => {
    toast({
      title: "Exception resolved",
      description: "Duplicate transaction removed from exceptions"
    });
  };

  const handleKeepBoth = (transactionId: string) => {
    toast({
      title: "Exception resolved",
      description: "Both transactions kept - marked as separate entries"
    });
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "email":
        return <Mail className="w-6 h-6 text-blue-500" />;
      case "credit_card":
        return <CreditCard className="w-6 h-6 text-green-500" />;
      case "document":
        return <FileText className="w-6 h-6 text-purple-500" />;
      default:
        return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "duplicate":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center w-4 h-4 rounded-full bg-red-100 border border-red-200">
                  <X className="w-2.5 h-2.5 text-red-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Duplicate detected</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 border border-gray-200">
                  <Clock className="w-2.5 h-2.5 text-gray-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exception pending</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-mobius-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-mobius-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-mobius-gray-900">Exceptions</h1>
            <p className="text-mobius-gray-500 mt-1 text-sm">
              Review and resolve transaction exceptions
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {totalCount} Exceptions
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              {duplicateCount} Duplicates
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-mobius-gray-500" />
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-sm border border-mobius-gray-200 rounded-md px-3 py-1"
            >
              <option value="all">All Exceptions</option>
              <option value="duplicate">Duplicates</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-mobius-gray-500" />
            <span className="text-sm text-mobius-gray-500">Sort by: Date</span>
          </div>
        </div>
      </div>

      {/* Inbox with Reading Pane */}
      <div className="flex-1 flex min-h-0">
        <div className="w-1/5">
          <Card className="flex-1 bg-white shadow-mobius-md">
            <div className="divide-y divide-mobius-gray-100">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={cn(
                    "p-3 transition-colors cursor-pointer border-l-4 relative",
                    transaction.exceptionType === "duplicate" ? "border-l-red-500 bg-red-50/30" : "border-l-transparent",
                    selectedTransaction?.id === transaction.id ? "bg-mobius-blue/10" : "hover:bg-mobius-gray-50"
                  )}
                  onClick={() => handleTransactionSelect(transaction)}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={selectedTransactions.includes(transaction.id)}
                      onCheckedChange={(checked) => handleTransactionToggle(transaction.id, !!checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    {/* Source Logo with Status Icon Above */}
                    <div className="relative">
                      {/* Status Icon - Positioned above the source logo */}
                      <div className="absolute -top-1 -right-1 z-10">
                        {getStatusIcon(transaction.status)}
                      </div>
                      {getSourceIcon(transaction.source)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm text-mobius-gray-900 truncate">
                          {transaction.vendor}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            transaction.exceptionType === "duplicate" 
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-orange-50 text-orange-700 border-orange-200"
                          )}
                        >
                          {transaction.exceptionType}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-mobius-gray-500 mb-1">
                        ₹{transaction.amount.toLocaleString()} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                      
                      <p className="text-xs text-mobius-gray-600 truncate">
                        {transaction.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {selectedTransaction && (
          <>
            <DocumentPane transaction={selectedTransaction} />
            <ExceptionPane 
              transaction={selectedTransaction}
              onResolve={handleResolveException}
              onKeepBoth={handleKeepBoth}
            />
          </>
        )}
      </div>
    </div>
  );
}

interface ExceptionPaneProps {
  transaction: ExceptionTransaction;
  onResolve: (transactionId: string) => void;
  onKeepBoth: (transactionId: string) => void;
}

function ExceptionPane({ transaction, onResolve, onKeepBoth }: ExceptionPaneProps) {
  return (
    <div className="flex-1 flex flex-col bg-white border-l border-mobius-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-mobius-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{transaction.vendor}</h3>
          <Badge 
            variant="outline" 
            className="bg-red-50 text-red-700 border-red-200"
          >
            {transaction.exceptionType}
          </Badge>
        </div>

        <p className="text-sm text-mobius-gray-500">
          ₹{transaction.amount.toLocaleString()} • {new Date(transaction.date).toLocaleDateString()}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="summary" className="h-full flex flex-col">
          <TabsList className="grid grid-cols-1 w-[calc(100%-2rem)] mx-4 mt-4 mb-2">
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <TabsContent value="summary" className="mt-0">
              <Card className="p-4">
                <div className="space-y-4">
                  {/* Exception Details */}
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900">Duplicate Transaction Detected</h4>
                        <p className="text-sm text-red-700 mt-1">
                          This transaction appears to be a duplicate of transaction #{transaction.duplicateOf}
                        </p>
                        <p className="text-xs text-red-600 mt-2">
                          Same vendor, invoice number, and amount detected
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-mobius-gray-500">Exception Type:</p>
                      <p className="font-medium capitalize">{transaction.exceptionType}</p>
                    </div>
                    <div>
                      <p className="text-mobius-gray-500">Reason:</p>
                      <p className="font-medium">{transaction.exceptionReason}</p>
                    </div>
                    <div>
                      <p className="text-mobius-gray-500">Client:</p>
                      <p className="font-medium">{transaction.client}</p>
                    </div>
                    <div>
                      <p className="text-mobius-gray-500">Invoice #:</p>
                      <p className="font-medium">{transaction.pdfFile.replace('.pdf', '')}</p>
                    </div>
                    <div>
                      <p className="text-mobius-gray-500">Amount:</p>
                      <p className="font-medium">₹{transaction.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-mobius-gray-500">Date:</p>
                      <p className="font-medium">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4 border-t border-mobius-gray-100">
                    <Button 
                      variant="outline" 
                      className="w-full text-red-700 border-red-300 hover:bg-red-50"
                      onClick={() => onResolve(transaction.id)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove Duplicate
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => onKeepBoth(transaction.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Keep Both Transactions
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

const Exceptions = () => {
  return (
    <div className="h-full">
      <ExceptionsInbox />
    </div>
  );
};

export default Exceptions; 