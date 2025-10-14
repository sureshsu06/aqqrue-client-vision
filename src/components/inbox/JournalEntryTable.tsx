import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Edit3, Save, X, RotateCcw, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types/Transaction";
import { getGLAccountCode } from "@/lib/GLaccount";
import { JournalEntryGenerator } from "@/lib/journalEntryGenerator";

interface JournalEntryTableProps {
  journalEntry: any;
  transaction: Transaction;
  isEditMode: boolean;
  isFormulaMode: boolean;
  onEditClick: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onFormulaModeToggle: () => void;
  onUpdateJournalEntry: (index: number, field: string, value: any) => void;
  onEvaluateFormulaOnBlur: (index: number, field: string) => void;
  onAddRow: () => void;
  onDeleteRow: (index: number) => void;
  showToolbar?: boolean;
  showEditButton?: boolean;
  compact?: boolean;
}

export function JournalEntryTable({
  journalEntry,
  transaction,
  isEditMode,
  isFormulaMode,
  onEditClick,
  onSaveEdit,
  onCancelEdit,
  onFormulaModeToggle,
  onUpdateJournalEntry,
  onEvaluateFormulaOnBlur,
  onAddRow,
  onDeleteRow,
  showToolbar = true,
  showEditButton = true,
  compact = false
}: JournalEntryTableProps) {
  const getCurrencySymbol = (transaction: any) => {
    return transaction.currency === 'USD' ? '$' : '₹';
  };

  // Base account options used by the editor. The currently selected account
  // will be added dynamically if it's not part of this list so the dropdown
  // always displays a valid option.
  const baseAccountOptions = [
    "Cash/Accounts Receivable",
    "Deferred Revenue",
    "SaaS Revenue",
    "Professional Fees",
    "Rent",
    "Computers",
    "Freight and Postage",
    "Rates & Taxes",
    "Input CGST",
    "Input SGST",
    "Input IGST",
    "TDS on Professional Charges",
    "TDS on Rent",
    "JCSS & Associates LLP",
    "Sogo Computers Pvt Ltd",
    "Clayworks Spaces Technologies Pvt Ltd",
    "NSDL Database Management Ltd",
    "Software Subscriptions",
    "Brex Card",
    "Suspense Account",
    "Bank (1001)"
  ];

  return (
    <div className="p-0">
      {showToolbar && (
        <div className="flex justify-between mb-2">
          <h4 className="text-xs font-medium text-mobius-gray-900"></h4>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-6 w-6 p-0", isFormulaMode ? "bg-blue-100 text-blue-600" : "")}
              onClick={onFormulaModeToggle}
              title={isFormulaMode ? "Disable Formula Mode" : "Enable Formula Mode"}
            >
              <span className="text-xs font-bold">fx</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Formula Mode Instructions */}
      {showToolbar && isFormulaMode && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
          <p className="font-medium mb-1">Formula Mode Active</p>
          <p>Use Excel-like formulas: <code className="bg-blue-100 px-1 rounded">=B1*0.1</code>, <code className="bg-blue-100 px-1 rounded">=SUM(B1:B3)</code>, <code className="bg-blue-100 px-1 rounded">10%*C2</code></p>
          <p className="text-blue-600 mt-1">B = Debit column, C = Credit column, numbers = row index (1-based)</p>
        </div>
      )}

      <Separator className={cn("my-2", compact ? "my-1" : "my-2")} />

      {/* Journal Entry Table */}
      <div className="mt-2">
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className={cn("grid grid-cols-12 gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide px-4", compact ? "py-2" : "py-3") }>
            <div className="col-span-5">ACCOUNT</div>
            <div className="col-span-3 text-right">DEBIT</div>
            <div className="col-span-3 text-right">CREDIT</div>
            <div className="col-span-1"></div>
          </div>
          
          {/* Column Headers for Formula Reference */}
          {showToolbar && isFormulaMode && (
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-blue-600 py-2 px-4 border-t border-gray-200 bg-blue-50">
              <div className="col-span-5">A</div>
              <div className="col-span-3 text-right">B</div>
              <div className="col-span-3 text-right">C</div>
              <div className="col-span-1"></div>
            </div>
          )}
        </div>
        
        {/* Table Body */}
        <div className="border border-gray-200 border-t-0 overflow-hidden">
          {journalEntry.entries.map((entry: any, index: number) => (
            <div 
              key={index} 
              className={cn(
                "grid grid-cols-12 gap-2 text-xs items-center px-4 group transition-colors border-b border-gray-100 last:border-b-0",
                compact ? "py-2" : "py-3",
                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              )}
            >
              <div className="col-span-5">
                {isEditMode ? (
                  <Select 
                    value={entry.account} 
                    onValueChange={(value) => onUpdateJournalEntry(index, 'account', value)}
                  >
                    <SelectTrigger className={cn("text-xs border-mobius-gray-200 text-left justify-start bg-white", compact ? "h-7" : "h-8") }>
                      <SelectValue className="text-xs text-left" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Ensure current account is visible even if custom */}
                      {!baseAccountOptions.includes(entry.account) && (
                        <SelectItem value={entry.account}>{entry.account}</SelectItem>
                      )}
                      {baseAccountOptions.map((label) => (
                        <SelectItem key={label} value={label}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="font-semibold text-gray-900">
                    {entry.account} <span className="text-xs text-gray-500 font-normal">({getGLAccountCode(entry.account)})</span>
                  </div>
                )}
              </div>
              <div className="col-span-3 text-right">
                {isEditMode ? (
                  <Input
                    type="text"
                    value={entry.debit?.toString() || ''}
                    onChange={(e) => onUpdateJournalEntry(index, 'debit', e.target.value)}
                    onBlur={() => onEvaluateFormulaOnBlur(index, 'debit')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onEvaluateFormulaOnBlur(index, 'debit');
                        e.currentTarget.blur();
                      }
                    }}
                    className={cn(
                      "text-xs text-right border-mobius-gray-200 bg-white",
                      compact ? "h-7" : "h-8",
                      isFormulaMode ? "bg-blue-50 border-blue-300 font-mono" : "font-variant-numeric tabular-nums"
                    )}
                    placeholder={isFormulaMode ? "=B1*0.1" : "0.00"}
                    inputMode="text"
                    autoComplete="off"
                    spellCheck="false"
                    style={isFormulaMode ? { fontVariantNumeric: 'normal' } : {}}
                  />
                ) : (
                  <div className={cn(
                    "font-variant-numeric tabular-nums font-semibold",
                    entry.debit ? "text-green-700" : "text-gray-400"
                  )}>
                    {entry.debit ? `${getCurrencySymbol(transaction)}${entry.debit.toFixed(2)}` : "—"}
                  </div>
                )}
              </div>
              <div className="col-span-3 text-right">
                {isEditMode ? (
                  <Input
                    type="text"
                    value={entry.credit?.toString() || ''}
                    onChange={(e) => onUpdateJournalEntry(index, 'credit', e.target.value)}
                    onBlur={() => onEvaluateFormulaOnBlur(index, 'credit')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onEvaluateFormulaOnBlur(index, 'credit');
                        e.currentTarget.blur();
                      }
                    }}
                    className={cn(
                      "text-xs text-right border-mobius-gray-200 bg-white",
                      compact ? "h-7" : "h-8",
                      isFormulaMode ? "bg-blue-50 border-blue-300 font-mono" : "font-variant-numeric tabular-nums"
                    )}
                    placeholder={isFormulaMode ? "=C1*0.1" : "0.00"}
                    inputMode="text"
                    autoComplete="off"
                    spellCheck="false"
                    style={isFormulaMode ? { fontVariantNumeric: 'normal' } : {}}
                  />
                ) : (
                  <div className={cn(
                    "font-variant-numeric tabular-nums font-semibold",
                    entry.credit ? "text-red-700" : "text-gray-400"
                  )}>
                    {entry.credit ? `${getCurrencySymbol(transaction)}${entry.credit.toFixed(2)}` : "—"}
                  </div>
                )}
              </div>
              {/* Delete button */}
              <div className="col-span-1 flex justify-center">
                {isEditMode && journalEntry.entries.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDeleteRow(index)}
                    title="Delete row"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Add Row */}
        {isEditMode && (
          <div 
            className={cn("group relative border-2 border-dashed border-mobius-gray-200 rounded-lg hover:border-mobius-gray-300 transition-colors cursor-pointer", compact ? "mt-1 p-1" : "mt-2 p-1")}
            onClick={onAddRow}
          >
            <div className="flex items-center justify-center">
              <Plus className={cn("text-mobius-gray-400 group-hover:text-mobius-gray-600 transition-colors", compact ? "w-3 h-3" : "w-4 h-4")} />
            </div>
            <div className={cn("absolute bottom-full left-1/2 transform -translate-x-1/2 px-3 py-1 bg-mobius-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap", compact ? "mb-1" : "mb-2")}>
              Drag to add or remove rows
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-mobius-gray-800"></div>
            </div>
          </div>
        )}
        
        {/* Totals Row */}
        <div className="bg-gray-100 border-t border-gray-200">
          <div className={cn("grid grid-cols-12 gap-2 text-xs font-bold px-4", compact ? "py-2" : "py-3") }>
            <div className="col-span-5 text-gray-900">TOTALS</div>
            <div className="col-span-3 text-right text-green-700 font-variant-numeric tabular-nums">{getTotalDebit(journalEntry, transaction)}</div>
            <div className="col-span-3 text-right text-red-700 font-variant-numeric tabular-nums">{getTotalCredit(journalEntry, transaction)}</div>
            <div className="col-span-1"></div>
          </div>
        </div>
        
        {/* Balance Status */}
        <div className={cn(
          "text-center text-xs p-2 rounded-lg font-medium",
          compact ? "mt-2" : "mt-2",
          isBalanced(journalEntry) ? "text-green-700 bg-green-50 border border-green-200" : "text-red-700 bg-red-50 border border-red-200"
        )}>
          {isBalanced(journalEntry) ? "✓ Balanced" : "✗ Unbalanced"}
        </div>
        
        {/* Edit Button */}
        {showEditButton && !isEditMode && (
          <div className="flex justify-end mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2"
              onClick={onEditClick}
              title="Edit"
            >
              <Edit3 className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </div>
        )}
        
        {/* Save/Cancel Buttons */}
        {isEditMode && (
          <div className="flex justify-end gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-6 px-2"
              onClick={onCancelEdit}
              title="Cancel"
            >
              <X className="w-3 h-3 mr-1" />
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="h-6 px-2 bg-mobius-blue hover:bg-mobius-blue/90 text-white"
              onClick={onSaveEdit}
              title="Save"
            >
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
function getTotalDebit(journalEntry: any, transaction?: any) {
  const amount = journalEntry.entries.reduce((sum: number, entry: any) => sum + (entry.debit || 0), 0);
  const currency = transaction?.currency === 'USD' ? '$' : '₹';
  return `${currency}${amount.toFixed(2)}`;
}

function getTotalCredit(journalEntry: any, transaction?: any) {
  const amount = journalEntry.entries.reduce((sum: number, entry: any) => sum + (entry.credit || 0), 0);
  const currency = transaction?.currency === 'USD' ? '$' : '₹';
  return `${currency}${amount.toFixed(2)}`;
}

function isBalanced(journalEntry: any) {
  return JournalEntryGenerator.isBalanced(journalEntry);
}
