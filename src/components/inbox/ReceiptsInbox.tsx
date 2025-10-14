import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit3,
  UserCheck,
  ArrowRight,
  MoreVertical,
  FileText,
  Download,
  TrendingUp,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Transaction } from "@/types/Transaction";
import { 
  Panel, 
  PanelGroup, 
  PanelResizeHandle 
} from "react-resizable-panels";
import { usePanelSizes } from "@/hooks/use-panel-sizes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReceiptsInboxProps {
  onTransactionSelect: (transaction: Transaction) => void;
}

const mockReceipts: Transaction[] = [
  {
    id: "39",
    vendor: "Incoming Wire Transfer",
    amount: 1635925.2,
    currency: "INR",
    source: "bank",
    type: "receipt",
    status: "done",
    date: "2025-04-25",
    description: "Incoming Wire Transfer from International Client",
    client: "Elire",
    confidence: 99,
    pdfFile: "receipts/receipt_wire_transfer_usd.pdf",
    documentUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1000&fit=crop",
    invoiceNumber: "WIRE-USD-APR-2025",
    bankId: "TXN-20250425-001",
    transactionType: "Customer Payment",
    matchSource: "Wire transfer pattern + Amount"
  },
  {
    id: "40",
    vendor: "Customer Payment - ABC Corp",
    amount: 250000,
    currency: "INR",
    source: "bank",
    type: "receipt",
    status: "done",
    date: "2025-04-28",
    description: "Customer Payment Received via NEFT",
    client: "Elire",
    confidence: 98,
    pdfFile: "receipts/receipt_abc_corp.pdf",
    documentUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1000&fit=crop",
    invoiceNumber: "INV-2025-001",
    bankId: "TXN-20250428-001",
    transactionType: "Customer Payment",
    matchSource: "Customer name + Invoice amount"
  },
  {
    id: "41",
    vendor: "Customer Payment - XYZ Ltd",
    amount: 180000,
    currency: "INR",
    source: "bank",
    type: "receipt",
    status: "done",
    date: "2025-04-30",
    description: "Customer Payment Received via RTGS",
    client: "Elire",
    confidence: 97,
    pdfFile: "receipts/receipt_xyz_ltd.pdf",
    documentUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=1000&fit=crop",
    invoiceNumber: "INV-2025-002",
    bankId: "TXN-20250430-004",
    transactionType: "Customer Payment",
    matchSource: "Customer name + Invoice amount"
  },
  {
    id: "42",
    vendor: "Refund - Vendor ABC",
    amount: 15000,
    currency: "INR",
    source: "bank",
    type: "receipt",
    status: "done",
    date: "2025-05-02",
    description: "Refund Received - Service Cancellation",
    client: "Elire",
    confidence: 95,
    pdfFile: "receipts/receipt_refund_abc.pdf",
    documentUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=1000&fit=crop",
    invoiceNumber: "REF-2025-001",
    bankId: "TXN-20250502-001",
    transactionType: "Refund",
    matchSource: "Refund pattern + Vendor name"
  },
  {
    id: "43",
    vendor: "Interest Income",
    amount: 2500,
    currency: "INR",
    source: "bank",
    type: "receipt",
    status: "done",
    date: "2025-05-05",
    description: "Bank Interest Credit - Fixed Deposit",
    client: "Elire",
    confidence: 100,
    pdfFile: "receipts/receipt_interest_income.pdf",
    documentUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=1000&fit=crop",
    invoiceNumber: "INT-APR-2025",
    bankId: "TXN-20250505-001",
    transactionType: "Interest Income",
    matchSource: "Bank interest pattern"
  },
  {
    id: "44",
    vendor: "Miscellaneous Income",
    amount: 5000,
    currency: "INR",
    source: "bank",
    type: "receipt",
    status: "review",
    date: "2025-05-08",
    description: "Miscellaneous Credit - Unknown Source",
    client: "Elire",
    confidence: 75,
    pdfFile: "receipts/receipt_misc_income.pdf",
    documentUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=1000&fit=crop",
    invoiceNumber: "MISC-2025-001",
    bankId: "TXN-20250508-001",
    transactionType: "Other",
    matchSource: "No clear pattern detected"
  },
  {
    id: "45",
    vendor: "Bank Charges Reversal",
    amount: 200,
    currency: "INR",
    source: "bank",
    type: "receipt",
    status: "done",
    date: "2025-05-10",
    description: "Bank Charges Reversal - Service Fee Refund",
    client: "Elire",
    confidence: 90,
    pdfFile: "receipts/receipt_bank_charges_reversal.pdf",
    documentUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=1000&fit=crop",
    invoiceNumber: "BCR-2025-001",
    bankId: "TXN-20250510-001",
    transactionType: "Other",
    matchSource: "Bank reversal pattern"
  }
];

const vendorOptions = [
  "Incoming Wire Transfer",
  "Customer Payment - ABC Corp",
  "Customer Payment - XYZ Ltd", 
  "Refund - Vendor ABC",
  "Interest Income",
  "Miscellaneous Income",
  "Bank Charges Reversal",
  "CUSTOMER A",
  "CUSTOMER B",
  "REVENUE ACCOUNT",
  "INTEREST ACCOUNT",
  "REFUND ACCOUNT"
];

export function ReceiptsInbox({ onTransactionSelect }: ReceiptsInboxProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [vendorAssignments, setVendorAssignments] = useState<{[key: string]: string}>({});
  const [collapsedGroups, setCollapsedGroups] = useState<{[key: string]: boolean}>({});
  const { sizes, updateSizes } = usePanelSizes();

  // Auto-select first transaction when component mounts
  useEffect(() => {
    if (mockReceipts.length > 0 && !selectedTransaction) {
      setSelectedTransaction(mockReceipts[0]);
    }
  }, [selectedTransaction]);

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

  const handleVendorChange = (transactionId: string, vendor: string) => {
    setVendorAssignments(prev => ({
      ...prev,
      [transactionId]: vendor
    }));
  };

  const toggleGroupCollapse = (groupType: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupType]: !prev[groupType]
    }));
  };

  const getAssignedVendor = (transaction: Transaction) => {
    return vendorAssignments[transaction.id] || transaction.vendor;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done": 
        return (
          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-green-100 border border-green-200">
            <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
          </div>
        );
      case "review": 
        return (
          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-yellow-100 border border-yellow-200">
            <Clock className="w-2.5 h-2.5 text-yellow-600" />
          </div>
        );
      default: 
        return (
          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 border border-gray-200">
            <Clock className="w-2.5 h-2.5 text-gray-600" />
          </div>
        );
    }
  };

  const getSuggestedMatch = (transaction: Transaction) => {
    const transactionType = (transaction as any).transactionType;
    
    if (transactionType === "Customer Payment" && transaction.invoiceNumber) {
      return `Invoice #${transaction.invoiceNumber}`;
    }
    
    if (transactionType === "Refund") {
      return "Refund Income JE";
    }
    
    if (transactionType === "Interest Income") {
      return "Interest Income JE";
    }
    
    if (transactionType === "Other") {
      return "No match found — Suggest Category";
    }
    
    return "No match found";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return "bg-green-100 text-green-800";
    if (confidence >= 85) return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  const getReceiptType = (transaction: Transaction) => {
    const transactionType = (transaction as any).transactionType;
    return transactionType || "Receipt";
  };

  const getRowStatusColor = (transaction: Transaction) => {
    const confidence = transaction.confidence || 95;
    if (confidence >= 95) return "border-l-green-500";
    if (confidence >= 85) return "border-l-yellow-500";
    return "border-l-red-500";
  };

  const groupTransactionsByType = (transactions: Transaction[]) => {
    const groups = {
      "Customer Payment": transactions.filter(t => (t as any).transactionType === "Customer Payment"),
      "Refund": transactions.filter(t => (t as any).transactionType === "Refund"),
      "Interest Income": transactions.filter(t => (t as any).transactionType === "Interest Income"),
      "Other": transactions.filter(t => (t as any).transactionType === "Other"),
    };
    return groups;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-mobius-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-mobius-gray-900">Receipts</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {mockReceipts.length} receipts
            </Badge>
          </div>
        </div>
      </div>

      {/* Two Panel Layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <PanelGroup 
          direction="horizontal" 
          className="h-full"
          onLayout={(panelSizes) => {
            if (panelSizes.length >= 2) {
              updateSizes({
                ...sizes,
                inbox: panelSizes[0],
                document: panelSizes[1],
              });
            }
          }}
        >
          {/* Left Panel - Receipts List */}
          <Panel defaultSize={66} minSize={60} maxSize={75} className="min-h-0">
            <div className="h-full flex flex-col border-r border-mobius-gray-100">
              {/* Table Header */}
              <div className="px-4 py-2 bg-mobius-gray-50 border-b border-mobius-gray-200 flex-shrink-0">
                <div className="grid grid-cols-7 gap-4 text-xs font-medium text-mobius-gray-600 items-center" style={{gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1.5fr 1fr 1fr'}}>
                  <div className="flex items-center">
                    <span>Transaction Reference</span>
                  </div>
                  <div className="flex items-center">Narration</div>
                  <div className="flex items-center pl-2">Vendor</div>
                  <div className="flex items-center justify-end">Amount</div>
                  <div className="flex items-center pr-2">Suggested Match</div>
                  <div className="flex items-center justify-center">Confidence</div>
                  <div className="flex items-center">Action</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-mobius-gray-100">
                  {(() => {
                    const groupedTransactions = groupTransactionsByType(mockReceipts);
                    return Object.entries(groupedTransactions).map(([groupType, transactions]) => 
                      transactions.length > 0 && (
                        <React.Fragment key={groupType}>
                          {/* Group Header */}
                          <div 
                            className="px-4 py-2 bg-mobius-gray-25 border-b border-mobius-gray-100 cursor-pointer hover:bg-mobius-gray-50 transition-colors"
                            onClick={() => toggleGroupCollapse(groupType)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {collapsedGroups[groupType] ? (
                                  <ChevronRight className="w-4 h-4 text-mobius-gray-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-mobius-gray-500" />
                                )}
                                <h4 className="text-xs font-semibold text-mobius-gray-700 uppercase tracking-wide">
                                  {groupType}
                                </h4>
                              </div>
                              <span className="text-xs text-mobius-gray-500">
                                {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                          {/* Group Transactions */}
                          {!collapsedGroups[groupType] && transactions.map((transaction) => (
                            <div
                              key={transaction.id}
                              className={cn(
                                "group px-4 py-1.5 transition-colors cursor-pointer border-l-4 relative hover:bg-mobius-gray-50",
                                selectedTransaction?.id === transaction.id 
                                  ? "bg-mobius-blue/10 border-l-mobius-blue" 
                                  : getRowStatusColor(transaction)
                              )}
                              onClick={() => handleTransactionSelect(transaction)}
                            >
                              <div className="grid grid-cols-7 gap-4 items-center" style={{gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1.5fr 1fr 1fr'}}>
                                {/* Transaction Reference */}
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    checked={selectedTransactions.includes(transaction.id)}
                                    onCheckedChange={(checked) => handleTransactionToggle(transaction.id, !!checked)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-medium text-mobius-gray-900 truncate">
                                      {transaction.bankId || transaction.id}
                                    </div>
                                    <div className="text-xs text-mobius-gray-500">
                                      {new Date(transaction.date).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>

                                {/* Narration */}
                                <div className="min-w-0">
                                  <div className="text-xs text-mobius-gray-900 truncate">
                                    {transaction.description}
                                  </div>
                                  {(transaction as any).transactionType && (
                                    <div className="mt-1">
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-mobius-gray-100 text-mobius-gray-700">
                                        {(transaction as any).transactionType}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Vendor */}
                                <div className="min-w-0">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-7 px-2 text-xs justify-start text-left font-normal w-full"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <span className="truncate max-w-[80px]">{getAssignedVendor(transaction)}</span>
                                        <ChevronDown className="w-3 h-3 ml-1 flex-shrink-0" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-48">
                                      {vendorOptions.map((vendor) => (
                                        <DropdownMenuItem 
                                          key={vendor}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleVendorChange(transaction.id, vendor);
                                          }}
                                          className={getAssignedVendor(transaction) === vendor ? "bg-mobius-gray-100" : ""}
                                        >
                                          {vendor}
                                        </DropdownMenuItem>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                {/* Amount */}
                                <div className="text-right">
                                  <div className="text-xs font-semibold text-green-600">
                                    +{transaction.currency === 'USD' ? '$' : '₹'}{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </div>
                                </div>

                                {/* Suggested Match */}
                                <div className="min-w-0">
                                  <div className="text-xs text-mobius-blue-600 truncate">
                                    {getSuggestedMatch(transaction)}
                                  </div>
                                  <div className="text-xs text-mobius-gray-500 mt-0.5">
                                    {new Date(transaction.date).toLocaleDateString()}
                                  </div>
                                </div>

                                {/* Confidence */}
                                <div className="text-center">
                                  <Badge 
                                    variant="outline" 
                                    className={cn("text-xs", getConfidenceColor(transaction.confidence || 95))}
                                  >
                                    {transaction.confidence || 95}%
                                  </Badge>
                                </div>

                                {/* Action */}
                                <div className="text-center">
                                  <div className="flex items-center justify-center space-x-1">
                                    {getStatusIcon(transaction.status)}
                                    <span className="text-xs text-mobius-gray-500">Approve</span>
                                    <ArrowRight className="w-3 h-3 text-mobius-gray-400" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </React.Fragment>
                      )
                    );
                  })()}
                </div>
              </div>
            </div>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-1 bg-mobius-gray-100 hover:bg-mobius-gray-200 transition-colors group">
            <div className="flex items-center justify-center h-full">
              <div className="w-1 h-8 bg-mobius-gray-300 group-hover:bg-mobius-gray-400 rounded-full"></div>
            </div>
          </PanelResizeHandle>

          {/* Right Panel - Transaction Details */}
          <Panel defaultSize={34} minSize={25} maxSize={40} className="min-h-0">
            <div className="h-full flex flex-col overflow-y-auto">
              {selectedTransaction ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b border-mobius-gray-100 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-mobius-gray-900">
                          {selectedTransaction.vendor}
                        </h3>
                        <p className="text-sm text-mobius-gray-600">
                          +{selectedTransaction.currency === 'USD' ? '$' : '₹'}{selectedTransaction.amount.toLocaleString()} • {new Date(selectedTransaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Receipt Type Badge */}
                    <div className="mb-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {getReceiptType(selectedTransaction)}
                      </Badge>
                    </div>

                    {/* Suggested Match/Category */}
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox defaultChecked />
                      <span className="text-sm font-medium text-mobius-gray-900">
                        {(() => {
                          const transactionType = (selectedTransaction as any).transactionType;
                          if (transactionType === "Customer Payment") return "Suggested Match → Invoice #…";
                          if (transactionType === "Refund") return "Suggested Category → Refund";
                          if (transactionType === "Interest Income") return "Suggested Category → Interest Income";
                          if (transactionType === "Other") return "No match found — Suggest Category";
                          return "Suggested Match";
                        })()}
                      </span>
                    </div>

                    <Card className="p-3 mb-4 bg-mobius-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-mobius-gray-900">
                            {getSuggestedMatch(selectedTransaction)}
                          </p>
                          <p className="text-sm text-mobius-gray-600">
                            +{selectedTransaction.currency === 'USD' ? '$' : '₹'}{selectedTransaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          {(selectedTransaction as any).matchSource && (
                            <p className="text-xs text-mobius-gray-500 mt-1">
                              Matched using: {(selectedTransaction as any).matchSource}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>

                    {/* Confidence Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-mobius-gray-600">Confidence</span>
                        <span className="text-xs font-medium text-green-600">
                          {selectedTransaction.confidence || 95}%
                        </span>
                      </div>
                      <div className="w-full bg-mobius-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-green-500"
                          style={{ width: `${selectedTransaction.confidence || 95}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Journal Entry Section */}
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-mobius-gray-900">Journal Entry</h4>
                        <span className="text-xs text-mobius-gray-500">DNR</span>
                      </div>

                      {/* Bank Entry Table */}
                      <div className="mb-4">
                        <h5 className="text-xs font-medium text-mobius-gray-700 mb-2">Bank Entry</h5>
                        <div className="border border-mobius-gray-200 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-mobius-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-mobius-gray-600">DENOR</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-mobius-gray-600">DEBIT</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-mobius-gray-600">CREDIT</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-mobius-gray-200">
                              <tr>
                                <td className="px-3 py-2 text-sm text-mobius-gray-900">Bank</td>
                                <td className="px-3 py-2 text-right text-sm text-mobius-gray-900">
                                  {selectedTransaction.currency === 'USD' ? '$' : '₹'}{selectedTransaction.amount.toLocaleString()}
                                </td>
                                <td className="px-3 py-2 text-right text-sm text-mobius-gray-900">—</td>
                              </tr>
                              <tr className="border-t-2 border-mobius-gray-300 font-semibold">
                                <td className="px-3 py-2 text-sm text-mobius-gray-900">TOTALS</td>
                                <td className="px-3 py-2 text-right text-sm text-mobius-gray-900">
                                  {selectedTransaction.currency === 'USD' ? '$' : '₹'}{selectedTransaction.amount.toLocaleString()}
                                </td>
                                <td className="px-3 py-2 text-right text-sm text-mobius-gray-900">—</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Revenue Entry Table */}
                      <div className="mb-4">
                        <h5 className="text-xs font-medium text-mobius-gray-700 mb-2">Revenue Entry</h5>
                        <div className="border border-mobius-gray-200 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-mobius-gray-50">
                              <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-mobius-gray-600">DENOR</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-mobius-gray-600">DEBIT</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-mobius-gray-600">CREDIT</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-mobius-gray-200">
                              <tr>
                                <td className="px-3 py-2 text-sm text-mobius-gray-900">
                                  {getReceiptType(selectedTransaction) === "Customer Payment" ? "Accounts Receivable" : 
                                   getReceiptType(selectedTransaction) === "Interest Income" ? "Interest Income" :
                                   getReceiptType(selectedTransaction) === "Refund" ? "Refund Income" : "Revenue"}
                                </td>
                                <td className="px-3 py-2 text-right text-sm text-mobius-gray-900">
                                  {selectedTransaction.currency === 'USD' ? '$' : '₹'}{selectedTransaction.amount.toLocaleString()}
                                </td>
                                <td className="px-3 py-2 text-right text-sm text-mobius-gray-900">—</td>
                              </tr>
                              <tr className="border-t-2 border-mobius-gray-300 font-semibold">
                                <td className="px-3 py-2 text-sm text-mobius-gray-900">TOTALS</td>
                                <td className="px-3 py-2 text-right text-sm text-mobius-gray-900">
                                  {selectedTransaction.currency === 'USD' ? '$' : '₹'}{selectedTransaction.amount.toLocaleString()}
                                </td>
                                <td className="px-3 py-2 text-right text-sm text-mobius-gray-900">—</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Additional Receipt Details */}
                      <div className="bg-mobius-gray-50 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-mobius-gray-900 mb-3">Receipt Details</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-mobius-gray-600">Transaction Type:</span>
                            <span className="font-medium">{getReceiptType(selectedTransaction)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-mobius-gray-600">Source:</span>
                            <span className="font-medium">Bank Transfer</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-mobius-gray-600">Reference:</span>
                            <span className="font-medium">{selectedTransaction.invoiceNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-mobius-gray-600">Status:</span>
                            <span className="font-medium text-green-600">Processed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 border-t border-mobius-gray-100 flex-shrink-0">
                    <div className="flex space-x-3">
                      <Button className="bg-mobius-blue hover:bg-mobius-blue/90 text-white">
                        Approve
                      </Button>
                      {(selectedTransaction as any).transactionType === "Customer Payment" ? (
                        <Button variant="outline" className="border-mobius-gray-300">
                          Edit
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" className="border-mobius-gray-300">
                            🏷 Change Category
                          </Button>
                          <Button variant="outline" className="border-mobius-gray-300">
                            📎 Attach Document
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-mobius-gray-50">
                  <div className="text-center text-mobius-gray-500">
                    <FileText className="w-10 h-10 mx-auto mb-3 text-mobius-gray-400" />
                    <h3 className="text-sm font-medium mb-1">No receipt selected</h3>
                    <p className="text-xs">Select a receipt from the list to view details</p>
                  </div>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
