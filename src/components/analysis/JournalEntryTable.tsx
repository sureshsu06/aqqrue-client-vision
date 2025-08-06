import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { JournalEntry, JournalEntryLine } from '../../types/Transaction';
import { getGLAccountCode, getAccountOptions } from '../../data/glAccounts';
import { JournalEntryGenerator } from '../../lib/journalEntryGenerator';
import { TaxCalculator } from '../../lib/taxCalculator';

interface JournalEntryTableProps {
  journalEntry: JournalEntry;
  editedJournalEntry?: JournalEntry | null;
  isEditMode: boolean;
  isFormulaMode: boolean;
  transaction: any;
  onUpdateEntry: (index: number, field: string, value: any) => void;
  onEvaluateFormula: (index: number, field: string) => void;
  onAddRow: () => void;
  onDeleteRow: (index: number) => void;
  showAddRow?: boolean;
  showDeleteRow?: boolean;
  showTotals?: boolean;
  showBalance?: boolean;
  className?: string;
}

export function JournalEntryTable({
  journalEntry,
  editedJournalEntry,
  isEditMode,
  isFormulaMode,
  transaction,
  onUpdateEntry,
  onEvaluateFormula,
  onAddRow,
  onDeleteRow,
  showAddRow = true,
  showDeleteRow = true,
  showTotals = true,
  showBalance = true,
  className
}: JournalEntryTableProps) {
  const currentEntry = isEditMode ? editedJournalEntry : journalEntry;
  const accountOptions = getAccountOptions();

  if (!currentEntry) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Formula Mode Instructions */}
      {isFormulaMode && (
        <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
          <p className="font-medium mb-1">Formula Mode Active</p>
          <p>Use Excel-like formulas: <code className="bg-blue-100 px-1 rounded">=B1*0.1</code>, <code className="bg-blue-100 px-1 rounded">=SUM(B1:B3)</code>, <code className="bg-blue-100 px-1 rounded">10%*C2</code></p>
          <p className="text-blue-600 mt-1">B = Debit column, C = Credit column, numbers = row index (1-based)</p>
        </div>
      )}

      <Separator />

      {/* Journal Entry Table */}
      <div className="space-y-1">
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide mb-3 pt-2">
          <div className="col-span-5 pl-0">ACCOUNT</div>
          <div className="col-span-3 text-right">DEBIT</div>
          <div className="col-span-3 text-right">CREDIT</div>
          <div className="col-span-1"></div>
        </div>
        
        {/* Column Headers for Formula Reference */}
        {isFormulaMode && (
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-blue-600 mb-1">
            <div className="col-span-5 pl-0">A</div>
            <div className="col-span-3 text-right">B</div>
            <div className="col-span-3 text-right">C</div>
            <div className="col-span-1"></div>
          </div>
        )}
        
        <div className="space-y-1">
          {currentEntry.entries.map((entry: JournalEntryLine, index: number) => (
            <div key={index} className="grid grid-cols-12 gap-2 text-sm items-center group">
              <div className="col-span-5 font-medium text-sm">
                {isEditMode ? (
                  <Select 
                    value={entry.account} 
                    onValueChange={(value) => onUpdateEntry(index, 'account', value)}
                  >
                    <SelectTrigger className="h-8 text-sm border-mobius-gray-200 text-left justify-start">
                      <SelectValue className="text-sm text-left" />
                    </SelectTrigger>
                    <SelectContent>
                      {accountOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div>
                    <div className="font-medium">{entry.account} <span className="text-xs text-mobius-gray-500 font-normal">({getGLAccountCode(entry.account)})</span></div>
                  </div>
                )}
              </div>
              <div className="col-span-3 text-right">
                {isEditMode ? (
                  <Input
                    type="text"
                    value={entry.debit?.toString() || ''}
                    onChange={(e) => onUpdateEntry(index, 'debit', e.target.value)}
                    onBlur={() => onEvaluateFormula(index, 'debit')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onEvaluateFormula(index, 'debit');
                        e.currentTarget.blur();
                      }
                    }}
                    className={cn(
                      "h-8 text-sm text-right border-mobius-gray-200",
                      isFormulaMode ? "bg-blue-50 border-blue-300 font-mono" : "font-variant-numeric tabular-nums"
                    )}
                    placeholder={isFormulaMode ? "=B1*0.1" : "0.00"}
                    inputMode="text"
                    autoComplete="off"
                    spellCheck="false"
                    style={isFormulaMode ? { fontVariantNumeric: 'normal' } : {}}
                  />
                ) : (
                  entry.debit ? `${TaxCalculator.getCurrencySymbol(transaction)}${entry.debit.toFixed(2)}` : "—"
                )}
              </div>
              <div className="col-span-3 text-right">
                {isEditMode ? (
                  <Input
                    type="text"
                    value={entry.credit?.toString() || ''}
                    onChange={(e) => onUpdateEntry(index, 'credit', e.target.value)}
                    onBlur={() => onEvaluateFormula(index, 'credit')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onEvaluateFormula(index, 'credit');
                        e.currentTarget.blur();
                      }
                    }}
                    className={cn(
                      "h-8 text-sm text-right border-mobius-gray-200",
                      isFormulaMode ? "bg-blue-50 border-blue-300 font-mono" : "font-variant-numeric tabular-nums"
                    )}
                    placeholder={isFormulaMode ? "=C1*0.1" : "0.00"}
                    inputMode="text"
                    autoComplete="off"
                    spellCheck="false"
                    style={isFormulaMode ? { fontVariantNumeric: 'normal' } : {}}
                  />
                ) : (
                  entry.credit ? `${TaxCalculator.getCurrencySymbol(transaction)}${entry.credit.toFixed(2)}` : "—"
                )}
              </div>
              {/* Delete button - positioned in the last column */}
              <div className="col-span-1 flex justify-center">
                {isEditMode && showDeleteRow && currentEntry.entries.length > 1 && (
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
        
        {/* Add Row on Hover */}
        {isEditMode && showAddRow && (
          <div 
            className="group relative mt-2 p-1 border-2 border-dashed border-mobius-gray-200 rounded-lg hover:border-mobius-gray-300 transition-colors cursor-pointer"
            onClick={onAddRow}
          >
            <div className="flex items-center justify-center">
              <Plus className="w-4 h-4 text-mobius-gray-400 group-hover:text-mobius-gray-600 transition-colors" />
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-mobius-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Drag to add or remove rows
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-mobius-gray-800"></div>
            </div>
          </div>
        )}
        
        {showTotals && (
          <>
            <Separator className="my-2" />
            
            {/* Totals Row */}
            <div className="grid grid-cols-12 gap-2 text-sm font-medium">
              <div className="col-span-5">Totals</div>
              <div className="col-span-3 text-right">
                {TaxCalculator.getCurrencySymbol(transaction)}{JournalEntryGenerator.getTotalDebit(currentEntry).toFixed(2)}
              </div>
              <div className="col-span-3 text-right">
                {TaxCalculator.getCurrencySymbol(transaction)}{JournalEntryGenerator.getTotalCredit(currentEntry).toFixed(2)}
              </div>
              <div className="col-span-1"></div>
            </div>
          </>
        )}
        
        {/* Balance Status */}
        {showBalance && (
          <div className={cn(
            "text-center text-xs mt-1 p-1 rounded",
            JournalEntryGenerator.isBalanced(currentEntry) ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
          )}>
            {JournalEntryGenerator.isBalanced(currentEntry) ? "✓ Balanced" : "✗ Unbalanced"}
          </div>
        )}
      </div>
    </div>
  );
} 