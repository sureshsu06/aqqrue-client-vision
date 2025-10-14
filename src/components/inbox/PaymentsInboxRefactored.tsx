import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Check,
  FileText
} from "lucide-react";
import { Transaction } from "@/types/Transaction";
import { 
  Panel, 
  PanelGroup, 
  PanelResizeHandle 
} from "react-resizable-panels";
import { usePanelSizes } from "@/hooks/use-panel-sizes";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaymentJournalEntry } from "./PaymentJournalEntry";
import { MatchedJournalEntry } from "./MatchedJournalEntry";
import { PaymentActions } from "./PaymentActions";
import { mockPayments, vendorOptions } from "@/data/paymentsData";
import { 
  getUnmatchedInvoices, 
  getSuggestedMatch, 
  getAssignedVendor, 
  groupTransactionsByType 
} from "@/lib/paymentsUtils";

interface PaymentsInboxProps {
  onTransactionSelect: (transaction: Transaction) => void;
}

export function PaymentsInboxRefactored({ onTransactionSelect }: PaymentsInboxProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [vendorAssignments, setVendorAssignments] = useState<{[key: string]: string}>({});
  const [collapsedGroups, setCollapsedGroups] = useState<{[key: string]: boolean}>({});
  const [isMatchedJECollapsed, setIsMatchedJECollapsed] = useState(true);
  const [selectedMatches, setSelectedMatches] = useState<{[key: string]: string}>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedJournalEntry, setEditedJournalEntry] = useState<any>(null);
  const [isFormulaMode, setIsFormulaMode] = useState(false);
  const { sizes, updateSizes } = usePanelSizes();
  const { toast } = useToast();

  // Auto-select first transaction when component mounts
  useEffect(() => {
    if (mockPayments.length > 0 && !selectedTransaction) {
      setSelectedTransaction(mockPayments[0]);
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

  const handleMatchChange = (transactionId: string, matchId: string) => {
    setSelectedMatches(prev => ({
      ...prev,
      [transactionId]: matchId
    }));
  };

  const handleEditClick = () => {
    if (selectedTransaction) {
      // Initialize editor with the 2-line Payment JE (Vendor/Bank)
      const paymentEntry = {
        client: selectedTransaction.client || "Elire",
        invoiceNumber: (selectedTransaction as any).invoiceNumber || "PAY-" + selectedTransaction.id,
        totalAmount: Math.abs(selectedTransaction.amount),
        entryType: "Payment",
        narration: `Being payment to ${selectedTransaction.vendor}`,
        entries: [
          {
            account: `${getAssignedVendor(selectedTransaction, vendorAssignments)} (2001)`,
            debit: Math.abs(selectedTransaction.amount),
            credit: 0,
            confidence: 95
          },
          {
            account: "Bank (1001)",
            debit: 0,
            credit: Math.abs(selectedTransaction.amount),
            confidence: 95
          }
        ]
      };
      setEditedJournalEntry(JSON.parse(JSON.stringify(paymentEntry)));
      setIsEditMode(true);
    }
  };

  const handleSaveEdit = () => {
    console.log("Saving edited journal entry:", editedJournalEntry);
    setIsEditMode(false);
    setEditedJournalEntry(null);
    toast({
      title: "Journal entry updated",
      description: "Changes have been saved successfully"
    });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedJournalEntry(null);
  };

  const updateJournalEntry = (index: number, field: string, value: any) => {
    if (!editedJournalEntry) return;
    
    const updatedEntries = [...editedJournalEntry.entries];
    
    if (field === 'debit' || field === 'credit') {
      if (typeof value === 'string' && value.trim() !== '') {
        const isFormula = isFormulaMode || value.startsWith('=') || /[A-Z]\d+/.test(value) || /%/.test(value);
        
        if (isFormula) {
          updatedEntries[index] = { ...updatedEntries[index], [field]: value };
        } else {
          const numValue = parseFloat(value);
          updatedEntries[index] = { ...updatedEntries[index], [field]: isNaN(numValue) ? 0 : numValue };
        }
      } else {
        updatedEntries[index] = { ...updatedEntries[index], [field]: 0 };
      }
    } else {
      updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    }
    
    setEditedJournalEntry({
      ...editedJournalEntry,
      entries: updatedEntries
    });
  };

  const evaluateFormulaOnBlur = (index: number, field: string) => {
    if (!editedJournalEntry) return;
    
    const entry = editedJournalEntry.entries[index];
    const value = entry[field];
    
    if (typeof value === 'string' && value.trim() !== '') {
      try {
        // Simple formula evaluation - you can enhance this
        const evaluated = eval(value.replace(/[A-Z]\d+/g, '0')); // Replace account codes with 0 for evaluation
        if (!isNaN(evaluated)) {
          updateJournalEntry(index, field, evaluated);
        }
      } catch (error) {
        console.error('Formula evaluation error:', error);
      }
    }
  };

  const addRow = () => {
    if (!editedJournalEntry) return;
    
    setEditedJournalEntry({
      ...editedJournalEntry,
      entries: [
        ...editedJournalEntry.entries,
        { account: "New Account", debit: 0, credit: 0, confidence: 95 }
      ]
    });
  };

  const deleteRow = (index: number) => {
    if (!editedJournalEntry || editedJournalEntry.entries.length <= 1) return;
    
    setEditedJournalEntry({
      ...editedJournalEntry,
      entries: editedJournalEntry.entries.filter((_: any, i: number) => i !== index)
    });
  };

  const getSelectedMatch = (transaction: Transaction) => {
    const selectedMatchId = selectedMatches[transaction.id];
    const unmatchedInvoices = getUnmatchedInvoices(transaction.vendor);
    
    if (selectedMatchId && selectedMatchId !== 'no-match') {
      return unmatchedInvoices.find(inv => inv.id === selectedMatchId) || unmatchedInvoices[0];
    }
    
    // For transactions with their own invoice number, use that as the default
    if ((transaction as any).invoiceNumber) {
      const matchingInvoice = unmatchedInvoices.find(inv => inv.id === (transaction as any).invoiceNumber);
      if (matchingInvoice) {
        return matchingInvoice;
      }
    }
    
    // Map specific payment amounts to their corresponding invoices
    const amount = Math.abs(transaction.amount);
    if (transaction.vendor === "Clayworks Spaces Pvt Ltd") {
      if (amount === 93960) {
        return unmatchedInvoices.find(inv => inv.id === "INV-25260258") || unmatchedInvoices[0];
      } else if (amount === 4806) {
        return unmatchedInvoices.find(inv => inv.id === "INV-25260376") || unmatchedInvoices[0];
      }
    }
    
    // Return the first available invoice for this vendor, or null if none
    return unmatchedInvoices.length > 0 ? unmatchedInvoices[0] : null;
  };

  const toggleGroupCollapse = (groupType: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupType]: !prev[groupType]
    }));
  };

  const getRowStatusColor = (transaction: Transaction) => {
    const confidence = transaction.confidence || 95;
    if (confidence >= 95) return "border-l-green-500";
    if (confidence >= 85) return "border-l-yellow-500";
    return "border-l-red-500";
  };

  const handleApprove = () => {
    if (selectedTransaction) {
      toast({
        title: "Transaction approved",
        description: "Posted to QuickBooks • JE# QB-000192"
      });
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Review Summary Panel */}
      <div className="bg-mobius-gray-50 border-b border-mobius-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-mobius-gray-900">Today's Bank Feed (Apr 2025)</h3>
            <p className="text-xs text-mobius-gray-600">38 transactions • 27 matched automatically (≥90%) • 8 need review • 3 unlinked</p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            {selectedTransactions.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-mobius-gray-600">{selectedTransactions.length} selected</span>
                <Button 
                  size="sm" 
                  className="bg-mobius-blue hover:bg-mobius-blue/90 text-white px-3 text-xs"
                  onClick={() => {
                    const selectedCount = selectedTransactions.length;
                    toast({
                      title: "Bulk approval successful",
                      description: `${selectedCount} transaction${selectedCount !== 1 ? 's' : ''} approved and posted to QuickBooks`
                    });
                    setSelectedTransactions([]);
                  }}
                >
                  Approve All Selected
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-mobius-gray-300 px-3 text-xs"
                  onClick={() => setSelectedTransactions([])}
                >
                  Clear Selection
                </Button>
              </div>
            )}
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
          {/* Left Panel - Payments List */}
          <Panel defaultSize={66} minSize={60} maxSize={75} className="min-h-0">
            <div className="h-full flex flex-col border-r border-mobius-gray-100">
              {/* Table Header */}
              <div className="px-4 py-2 bg-mobius-gray-50 border-b border-mobius-gray-200 flex-shrink-0">
                <div className="grid grid-cols-5 gap-4 text-xs font-medium text-mobius-gray-600 items-center" style={{gridTemplateColumns: '2fr 2fr 1.5fr 1fr 2fr'}}>
                  <div className="flex items-center">
                    <Checkbox 
                      checked={selectedTransactions.length === mockPayments.length && mockPayments.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTransactions(mockPayments.map(t => t.id));
                        } else {
                          setSelectedTransactions([]);
                        }
                      }}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                    />
                    <span className="ml-2">Transaction Reference</span>
                  </div>
                  <div className="flex items-center">Narration</div>
                  <div className="flex items-center pl-2">Account Name</div>
                  <div className="flex items-center justify-end">Amount</div>
                  <div className="flex items-center pr-2">Reconciled against</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-mobius-gray-100">
                  {(() => {
                    const groupedTransactions = groupTransactionsByType(mockPayments);
                    return Object.entries(groupedTransactions).map(([groupType, transactions]) => 
                      transactions.length > 0 && (
                        <React.Fragment key={groupType}>
                          {/* Group Header */}
                          <div 
                            className={`px-4 py-2 border-b border-mobius-gray-100 cursor-pointer transition-colors ${
                              groupType === "Suspense" 
                                ? "bg-red-50 hover:bg-red-100" 
                                : "bg-mobius-gray-100 hover:bg-mobius-gray-150"
                            }`}
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
                                "group px-4 py-1.5 transition-colors cursor-pointer border-l-4 relative",
                                selectedTransaction?.id === transaction.id 
                                  ? "bg-mobius-blue/10 border-l-mobius-blue" 
                                  : selectedTransactions.includes(transaction.id)
                                    ? "bg-blue-50 border-l-blue-400"
                                    : groupType === "Suspense"
                                      ? "bg-red-50 hover:bg-red-100 border-l-red-500"
                                      : cn("hover:bg-mobius-gray-50", getRowStatusColor(transaction))
                              )}
                              onClick={() => handleTransactionSelect(transaction)}
                            >
                              <div className="grid grid-cols-5 gap-4 items-center" style={{gridTemplateColumns: '2fr 2fr 1.5fr 1fr 2fr'}}>
                                {/* Transaction Reference */}
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    checked={selectedTransactions.includes(transaction.id)}
                                    onCheckedChange={(checked) => handleTransactionToggle(transaction.id, !!checked)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-medium text-mobius-gray-900 truncate">
                                      {transaction.bankId || transaction.id}
                                    </div>
                                    <div className="text-xs text-mobius-gray-500">
                                      {new Date(transaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                  </div>
                                </div>

                                {/* Narration */}
                                <div className="min-w-0">
                                  {groupType === "Suspense" ? (
                                    <div className="text-xs text-mobius-gray-900 truncate">
                                      {transaction.description}
                                    </div>
                                  ) : (
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="text-xs text-mobius-gray-900 truncate cursor-help">
                                            {transaction.description}
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="max-w-md">
                                          <p className="text-xs">{(() => {
                                            const transactionType = (transaction as any).transactionType;
                                            const vendor = transaction.vendor.toLowerCase();
                                            
                                            if (transactionType === "Invoice Payment") {
                                              if (vendor.includes('clayworks')) return "Rent to Clayworks";
                                              if (vendor.includes('jcss')) return "Professional fees to JCSS";
                                              if (vendor.includes('sogo')) return "Equipment purchase from Sogo";
                                              return "Invoice payment";
                                            }
                                            
                                            if (transactionType === "Tax Payment") {
                                              if (vendor.includes('cbdt')) return "TDS paid to TDS Payable";
                                              return "Tax payment";
                                            }
                                            
                                            if (transactionType === "Payroll Payment") {
                                              if (vendor.includes('epfo')) return "PF contribution to PF Payable";
                                              if (vendor.includes('bharat') || vendor.includes('amit') || vendor.includes('devasankar')) return "Salary payment";
                                              return "Payroll payment";
                                            }
                                            
                                            if (transactionType === "Vendor Advance") {
                                              return "Advance payment to vendor";
                                            }
                                            
                                            if (transactionType === "Other") {
                                              if (vendor.includes('bank')) return "Bank charges";
                                              if (vendor.includes('insurance')) return "Insurance premium";
                                              if (vendor.includes('legal')) return "Legal fees";
                                              return "Miscellaneous expense";
                                            }
                                            
                                            return "Payment transaction";
                                          })()}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )}
                                </div>

                                {/* Account Name */}
                                <div className="min-w-0">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 px-2 text-xs justify-start text-left font-normal w-full"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <span className="truncate max-w-[80px] text-xs">{getAssignedVendor(transaction, vendorAssignments)}</span>
                                        <ChevronDown className="w-3 h-3 ml-1 flex-shrink-0" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" side="bottom" className="w-48">
                                      {vendorOptions.map((vendor) => (
                                        <DropdownMenuItem 
                                          key={vendor}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleVendorChange(transaction.id, vendor);
                                          }}
                                          className={`text-xs ${getAssignedVendor(transaction, vendorAssignments) === vendor ? "bg-mobius-gray-100" : ""}`}
                                        >
                                          {vendor}
                                        </DropdownMenuItem>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                {/* Amount */}
                                <div className="text-right">
                                  <div className="text-xs font-semibold text-mobius-gray-900">
                                    {transaction.currency === 'USD' ? '$' : '₹'}{Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </div>
                                </div>

                                {/* Suggested Match */}
                                <div className="min-w-0">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-auto min-h-6 px-2 py-1.5 text-xs justify-between text-left font-normal w-full"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <div className="truncate text-mobius-blue-600">
                                          {(() => {
                                            const selectedMatch = getSelectedMatch(transaction);
                                            if (selectedMatch) {
                                              return (
                                                <div>
                                                  <div className="font-medium">#{selectedMatch.id}</div>
                                                  <div className="text-xs text-mobius-gray-500">
                                                    {new Date(selectedMatch.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} • {transaction.currency === 'USD' ? '$' : '₹'}{selectedMatch.amount.toLocaleString()}
                                                  </div>
                                                </div>
                                              );
                                            }
                                            const unmatchedInvoices = getUnmatchedInvoices(transaction.vendor);
                                            return unmatchedInvoices.length > 0 ? 'Select Match' : 'No Match';
                                          })()}
                                        </div>
                                        <ChevronDown className="w-3 h-3 flex-shrink-0" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" side="bottom" className="w-56">
                                      <div className="px-2 py-1.5 text-xs font-medium text-mobius-gray-600 border-b border-mobius-gray-200">
                                        {transaction.vendor}
                                      </div>
                                      {getUnmatchedInvoices(transaction.vendor).map((invoice) => {
                                        const selectedMatch = getSelectedMatch(transaction);
                                        const isSelected = selectedMatch && selectedMatch.id === invoice.id;
                                        
                                        return (
                                          <DropdownMenuItem 
                                            key={invoice.id}
                                            className="px-2 py-1.5 text-xs"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleMatchChange(transaction.id, invoice.id);
                                            }}
                                          >
                                            <div className="flex justify-between w-full items-start">
                                              <div className="flex-1 min-w-0">
                                                <div className="font-medium text-mobius-gray-900 truncate">
                                                  {invoice.id}
                                                </div>
                                                <div className="text-xs text-mobius-gray-500">
                                                  {new Date(invoice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} • {transaction.currency === 'USD' ? '$' : '₹'}{invoice.amount.toLocaleString()}
                                                </div>
                                              </div>
                                              {isSelected && (
                                                <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                              )}
                                            </div>
                                          </DropdownMenuItem>
                                        );
                                      })}
                                      <div className="px-2 py-1.5 border-t border-mobius-gray-200">
                                        <DropdownMenuItem 
                                          className="px-0 py-1.5 text-xs"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleMatchChange(transaction.id, 'no-match');
                                          }}
                                        >
                                          <span className="text-mobius-gray-500">No Match</span>
                                        </DropdownMenuItem>
                                      </div>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
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
                  {/* Transaction Summary Header */}
                  <div className="p-5 border-b border-mobius-gray-100 flex-shrink-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-mobius-gray-900">
                          {selectedTransaction.vendor}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-mobius-gray-500 bg-mobius-gray-100 px-2 py-1 rounded">
                            {(selectedTransaction as any).transactionType || 'Payment'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <span className="font-semibold text-mobius-gray-900">
                          {selectedTransaction.currency === 'USD' ? '$' : '₹'}{Math.abs(selectedTransaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-mobius-gray-500 mx-3">•</span>
                        <span className="text-mobius-gray-600">{new Date(selectedTransaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        {(selectedTransaction as any).transactionType === 'Payroll Payment' && (
                          <Button 
                            className="ml-auto bg-mobius-blue hover:bg-mobius-blue/90 text-white px-3 h-7 text-xs"
                            onClick={handleApprove}
                          >
                            Approve
                          </Button>
                        )}
                      </div>
                      
                      <div className="border-t border-mobius-gray-100 pt-3 -mx-5 px-5">
                        <div className="flex items-center space-x-2 text-xs">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          <span className="text-mobius-gray-900">Suggested Match: {getSuggestedMatch(selectedTransaction)}</span>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        </div>
                        {(selectedTransaction as any).matchSource && (
                          <div className="text-mobius-gray-500 text-xs mt-1">
                            Matched using: {(selectedTransaction as any).matchSource}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Journal Entry Section */}
                  <div className="p-5">
                    <div className="space-y-4">
                      {/* Payment Journal Entry */}
                      <PaymentJournalEntry
                        selectedTransaction={selectedTransaction}
                        isEditMode={isEditMode}
                        editedJournalEntry={editedJournalEntry}
                        isFormulaMode={isFormulaMode}
                        vendorAssignments={vendorAssignments}
                        onEditClick={handleEditClick}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                        onFormulaModeToggle={() => setIsFormulaMode(!isFormulaMode)}
                        onUpdateJournalEntry={updateJournalEntry}
                        onEvaluateFormulaOnBlur={evaluateFormulaOnBlur}
                        onAddRow={addRow}
                        onDeleteRow={deleteRow}
                      />

                      {/* Matched Journal Entry (Collapsible) */}
                      <MatchedJournalEntry
                        selectedTransaction={selectedTransaction}
                        isMatchedJECollapsed={isMatchedJECollapsed}
                        onToggleCollapse={() => setIsMatchedJECollapsed(!isMatchedJECollapsed)}
                      />

                      {/* Separator - only show for non-payroll transactions */}
                      {(selectedTransaction as any).transactionType !== "Payroll Payment" && (
                        <>
                          <div className="border-t border-mobius-gray-100 my-4 -mx-5 px-5"></div>

                          {/* Match Info */}
                          <div>
                            <h4 className="text-xs font-medium text-mobius-gray-700 mb-2">Match Info</h4>
                            <div className="space-y-3">
                              <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-mobius-gray-600">Vendor:</span>
                                  <span className="font-medium text-mobius-gray-900">{selectedTransaction.vendor}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-mobius-gray-600">Method:</span>
                                  <span className="font-medium text-mobius-gray-900">
                                    <span className="text-mobius-blue-600">{(selectedTransaction as any).matchSource || 'Pattern matching'}</span>
                                  </span>
                                </div>
                                {(selectedTransaction as any).invoiceNumber && (
                                  <div className="flex justify-between">
                                    <span className="text-mobius-gray-600">Invoice:</span>
                                    <span className="font-medium text-pink-600">{(selectedTransaction as any).invoiceNumber}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span className="text-mobius-gray-600">Date proximity:</span>
                                  <span className="font-medium text-mobius-gray-900">
                                    <span className="text-mobius-blue-600">Same day</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions Section (hidden for Payroll Payment as it's shown near the header) */}
                  {(selectedTransaction as any).transactionType !== 'Payroll Payment' && (
                    <PaymentActions onApprove={handleApprove} />
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-mobius-gray-50">
                  <div className="text-center text-mobius-gray-500">
                    <FileText className="w-10 h-10 mx-auto mb-3 text-mobius-gray-400" />
                    <h3 className="text-sm font-medium mb-1">No payment selected</h3>
                    <p className="text-xs">Select a payment from the list to view details</p>
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
