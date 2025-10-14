import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Transaction } from "@/types/Transaction";
import { getMatchedJournalEntry, getUnmatchedInvoices } from "@/lib/paymentsUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface MatchedJournalEntryProps {
  selectedTransaction: Transaction;
  isMatchedJECollapsed: boolean;
  onToggleCollapse: () => void;
}

export function MatchedJournalEntry({
  selectedTransaction,
  isMatchedJECollapsed,
  onToggleCollapse
}: MatchedJournalEntryProps) {
  const transactionType = (selectedTransaction as any).transactionType;
  const matchedEntry = getMatchedJournalEntry(selectedTransaction);
  
  const getHeaderTitle = () => {
    if (transactionType === "Other") {
      return "No Match Found";
    } else if (transactionType === "Payroll Payment") {
      return "No Match Found";
    } else if (transactionType === "Tax Payment") {
      return "Matched to TDS Payable";
    } else if (transactionType === "Invoice Payment") {
      return `Matched to Invoice #${(selectedTransaction as any).invoiceNumber || 'Unknown'}`;
    } else {
      return "Matched Journal Entry";
    }
  };

  const renderTDSBreakdown = () => {
    const totalAmount = Math.abs(selectedTransaction.amount);
    const salaryTDS = Math.round(totalAmount * 0.85); // 85% for salary
    const professionalTDS = Math.round(totalAmount * 0.10); // 10% for professional
    const rentTDS = Math.round(totalAmount * 0.05); // 5% for rent
    
    return (
      <>
        <div className="bg-mobius-gray-50 px-3 py-1.5 border-b border-mobius-gray-200">
          <div className="grid grid-cols-3 gap-4 text-xs font-medium text-mobius-gray-600">
            <div>TDS Section</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Rate</div>
          </div>
        </div>
        <div className="divide-y divide-mobius-gray-200">
          <div className="px-3 py-2">
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-xs font-medium text-mobius-gray-900">
                TDS on Salary (194A)
              </div>
              <div className="text-xs font-medium text-mobius-gray-900 text-right">
                {selectedTransaction.currency === 'USD' ? '$' : '₹'}{salaryTDS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-mobius-gray-600 text-right">10%</div>
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-xs font-medium text-mobius-gray-900">
                TDS on Professional Charges (194J)
              </div>
              <div className="text-xs font-medium text-mobius-gray-900 text-right">
                {selectedTransaction.currency === 'USD' ? '$' : '₹'}{professionalTDS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-mobius-gray-600 text-right">10%</div>
            </div>
          </div>
          <div className="px-3 py-2">
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-xs font-medium text-mobius-gray-900">
                TDS on Rent (194I)
              </div>
              <div className="text-xs font-medium text-mobius-gray-900 text-right">
                {selectedTransaction.currency === 'USD' ? '$' : '₹'}{rentTDS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-mobius-gray-600 text-right">10%</div>
            </div>
          </div>
          <div className="px-3 py-2 bg-mobius-gray-50 font-semibold">
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-xs text-mobius-gray-900">Total TDS Payable</div>
              <div className="text-xs font-bold text-mobius-gray-900 text-right">
                {selectedTransaction.currency === 'USD' ? '$' : '₹'}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-mobius-gray-600 text-right">—</div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderExpenseBreakdown = () => {
    if (!matchedEntry) {
      // Generate a reference number based on transaction ID
      const referenceNumber = `REF-${selectedTransaction.id.padStart(3, '0')}`;
      const monthName = new Date(selectedTransaction.date).toLocaleString('en-US', { month: 'long' });
      
      const message = (transactionType === 'Payroll Payment')
        ? `Payroll JE for ${monthName} not posted yet. Reference created for subsequent recon #${referenceNumber}`
        : `No match found. Reference created #${referenceNumber}`;
      
      return (
        <div className="px-3 py-4 text-center">
          <div className="text-xs text-mobius-gray-600">
            {message}
          </div>
        </div>
      );
    }
    
    return (
      <>
        <div className="bg-mobius-gray-50 px-3 py-1.5 border-b border-mobius-gray-200">
          <div className="grid grid-cols-3 gap-4 text-xs font-medium text-mobius-gray-600">
            <div>Account</div>
            <div className="text-right">Debit</div>
            <div className="text-right">Credit</div>
          </div>
        </div>
        <div className="divide-y divide-mobius-gray-200">
          {matchedEntry.map((entry, index) => (
            <div key={index} className="px-3 py-2">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-xs font-medium text-mobius-gray-900">
                  {entry.account}
                </div>
                <div className="text-xs font-medium text-mobius-gray-900 text-right">
                  {entry.debit > 0 ? `${selectedTransaction.currency === 'USD' ? '$' : '₹'}${entry.debit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                </div>
                <div className="text-xs font-medium text-mobius-gray-900 text-right">
                  {entry.credit > 0 ? `${selectedTransaction.currency === 'USD' ? '$' : '₹'}${entry.credit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div>
      <div 
        className="flex items-center space-x-2 mb-2 cursor-pointer hover:bg-mobius-gray-50 py-1 rounded"
        onClick={onToggleCollapse}
      >
        {isMatchedJECollapsed ? (
          <ChevronRight className="w-3 h-3 text-mobius-gray-500" />
        ) : (
          <ChevronDown className="w-3 h-3 text-mobius-gray-500" />
        )}
        <div className="flex items-center space-x-2">
          <h4 className="text-xs font-medium text-mobius-gray-700">
            {getHeaderTitle()}
          </h4>
          {transactionType === "Invoice Payment" && matchedEntry && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 px-2 text-xs text-mobius-blue-600 hover:text-mobius-blue-700"
                >
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <div className="px-2 py-1.5 text-xs font-medium text-mobius-gray-600 border-b border-mobius-gray-200">
                  Select Invoice
                </div>
                {getUnmatchedInvoices(selectedTransaction.vendor).map((invoice) => (
                  <DropdownMenuItem 
                    key={invoice.id}
                    className="px-2 py-1.5 text-xs"
                    onClick={() => {
                      // Handle invoice change
                      console.log("Changing to invoice:", invoice.id);
                    }}
                  >
                    <div className="flex justify-between w-full items-start">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-mobius-gray-900 truncate">
                          #{invoice.id}
                        </div>
                        <div className="text-xs text-mobius-gray-500">
                          {new Date(invoice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} • {selectedTransaction.currency === 'USD' ? '$' : '₹'}{invoice.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {!isMatchedJECollapsed && (
        <div className="border border-mobius-gray-200 rounded overflow-hidden">
          {transactionType === "Tax Payment" ? renderTDSBreakdown() : renderExpenseBreakdown()}
        </div>
      )}
    </div>
  );
}
