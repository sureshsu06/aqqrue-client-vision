import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { usePanelSizes } from "@/hooks/use-panel-sizes";
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
  Eye,
  GripVertical
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DocumentPane } from "@/components/inbox/DocumentPane";
import { AnalysisPane } from "@/components/inbox/AnalysisPane";
import { InboxList, Transaction } from "@/components/inbox/InboxList";
import { 
  Panel, 
  PanelGroup, 
  PanelResizeHandle 
} from "react-resizable-panels";

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
  },
  // Credit Card transactions without invoices (pending) - moved to exceptions
  {
    id: "35",
    vendor: "Stripe Inc",
    amount: 299.00,
    currency: "USD",
    source: "brex",
    type: "credit-card",
    status: "unread",
    date: "2025-05-31",
    description: "Stripe Payment Processing - Monthly Fee",
    client: "Rhythms",
    confidence: 85,
    documentUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=1000&fit=crop",
    isRecurring: true,
    exceptionType: "no-invoice",
    exceptionReason: "Credit card transaction processed but corresponding invoice not yet available"
  },
  {
    id: "36",
    vendor: "AWS",
    amount: 156.78,
    currency: "USD",
    source: "brex",
    type: "credit-card",
    status: "unread",
    date: "2025-05-30",
    description: "Amazon Web Services - Cloud Infrastructure",
    client: "Rhythms",
    confidence: 92,
    documentUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1000&fit=crop",
    isRecurring: true,
    exceptionType: "no-invoice",
    exceptionReason: "Credit card transaction processed but corresponding invoice not yet available"
  },
  {
    id: "37",
    vendor: "Google Cloud",
    amount: 89.45,
    currency: "USD",
    source: "brex",
    type: "credit-card",
    status: "review",
    date: "2025-05-29",
    description: "Google Cloud Platform - Compute Services",
    client: "Rhythms",
    confidence: 88,
    documentUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=1000&fit=crop",
    isRecurring: true,
    exceptionType: "no-invoice",
    exceptionReason: "Credit card transaction processed but corresponding invoice not yet available"
  },
  {
    id: "38",
    vendor: "Zoom Video Communications",
    amount: 149.90,
    currency: "USD",
    source: "brex",
    type: "credit-card",
    status: "unread",
    date: "2025-05-28",
    description: "Zoom Pro - Monthly Subscription",
    client: "Rhythms",
    confidence: 90,
    documentUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=1000&fit=crop",
    isRecurring: true,
    exceptionType: "no-invoice",
    exceptionReason: "Credit card transaction processed but corresponding invoice not yet available"
  },
  {
    id: "39",
    vendor: "Slack Technologies",
    amount: 67.50,
    currency: "USD",
    source: "brex",
    type: "credit-card",
    status: "review",
    date: "2025-05-27",
    description: "Slack Standard - Monthly Plan",
    client: "Rhythms",
    confidence: 87,
    documentUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1000&fit=crop",
    isRecurring: true,
    exceptionType: "no-invoice",
    exceptionReason: "Credit card transaction processed but corresponding invoice not yet available"
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
  const { sizes, updateSizes, resetSizes } = usePanelSizes();

  const filteredTransactions = mockExceptionTransactions.filter(transaction => {
    if (selectedStatus === "all") return true;
    if (selectedStatus === "duplicate" && transaction.exceptionType === "duplicate") return true;
    if (selectedStatus === "no-invoice" && transaction.exceptionType === "no-invoice") return true;
    return false;
  });

  // Auto-select first transaction when component mounts or filters change
  useEffect(() => {
    if (filteredTransactions.length > 0 && !selectedTransaction) {
      setSelectedTransaction(filteredTransactions[0]);
    }
  }, [filteredTransactions, selectedTransaction]);

  const duplicateCount = mockExceptionTransactions.filter(t => t.exceptionType === "duplicate").length;
  const noInvoiceCount = mockExceptionTransactions.filter(t => t.exceptionType === "no-invoice").length;
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

  const handleQuickApprove = (transactionId: string) => {
    toast({
      title: "Exception resolved",
      description: "Transaction approved and moved to main dashboard"
    });
  };

  const handleQuickAssign = (transactionId: string) => {
    toast({
      title: "Exception assigned",
      description: "Assigned to Controller for review"
    });
  };

  const handleApprove = () => {
    if (selectedTransaction) {
      toast({
        title: "Exception resolved",
        description: "Transaction approved and moved to main dashboard"
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
      
      {/* Header */}
      <div className="bg-white border-b border-mobius-gray-100 p-4 flex-shrink-0">
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
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              {noInvoiceCount} No Invoice
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
              <option value="no-invoice">No Invoice</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-mobius-gray-500" />
            <span className="text-sm text-mobius-gray-500">Sort by: Date</span>
          </div>

          {/* Undo Button */}
          <div className="flex items-center ml-auto">
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
      </div>

      {/* Inbox with Reading Pane */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <PanelGroup 
          direction="horizontal" 
          className="h-full"
          onLayout={(sizes) => {
            if (sizes.length >= 3) {
              updateSizes({
                inbox: sizes[0],
                document: sizes[1],
                creditCard: sizes[2]
              });
            }
          }}
        >
          {/* Inbox List - Resizable */}
          <Panel defaultSize={sizes.inbox} minSize={15} maxSize={40} className="min-h-0">
            <div className="h-full flex flex-col border-r border-mobius-gray-100">
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
          </Panel>

          {selectedTransaction && (
            <>
              {/* Resize Handle */}
              <PanelResizeHandle className="w-1 bg-mobius-gray-100 hover:bg-mobius-gray-200 transition-colors group">
                <div className="flex items-center justify-center h-full">
                  <GripVertical className="w-3 h-3 text-mobius-gray-400 group-hover:text-mobius-gray-600" />
                </div>
              </PanelResizeHandle>

              {/* Document Pane - Resizable */}
              <Panel defaultSize={sizes.document} minSize={25} maxSize={60} className="min-h-0">
                <div className="h-full flex flex-col border-r border-mobius-gray-100">
                  <div className="flex-1 overflow-y-auto">
                    <DocumentPane transaction={selectedTransaction} />
                  </div>
                </div>
              </Panel>

              {/* Resize Handle */}
              <PanelResizeHandle className="w-1 bg-mobius-gray-100 hover:bg-mobius-gray-200 transition-colors group">
                <div className="flex items-center justify-center h-full">
                  <GripVertical className="w-3 h-3 text-mobius-gray-400 group-hover:text-mobius-gray-600" />
                </div>
              </PanelResizeHandle>

              {/* Analysis Pane - Resizable */}
              <Panel defaultSize={sizes.creditCard} minSize={25} maxSize={60} className="min-h-0">
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto">
                    <AnalysisPane 
                      transaction={selectedTransaction}
                      onApprove={handleApprove}
                      onEdit={handleEdit}
                      onSeeHow={handleSeeHow}
                    />
                  </div>
                </div>
              </Panel>
            </>
          )}
        </PanelGroup>
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