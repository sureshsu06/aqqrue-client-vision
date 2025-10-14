import { Transaction } from "@/types/Transaction";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RevenueContractJournalEntryProps {
  transaction: Transaction;
  isFormulaMode: boolean;
  onFormulaModeToggle: () => void;
}

export function RevenueContractJournalEntry({ 
  transaction, 
  isFormulaMode, 
  onFormulaModeToggle 
}: RevenueContractJournalEntryProps) {
  
  const getCurrencySymbol = (transaction: any) => {
    return transaction.currency === 'USD' ? '$' : '₹';
  };

  // Generate initial journal entry for revenue contracts
  const getInitialJournalEntry = (transaction: any) => {
    if (transaction.vendor === 'Bishop Wisecarver') {
      return {
        entries: [
          { account: "Cash/Accounts Receivable", debit: 7020, credit: 0 },
          { account: "Deferred Revenue", debit: 0, credit: 7020 }
        ]
      };
    }
    
    // Default for other revenue contracts
    return {
      entries: [
        { account: "Cash/Accounts Receivable", debit: transaction.contractValue || 0, credit: 0 },
        { account: "Deferred Revenue", debit: 0, credit: transaction.contractValue || 0 }
      ]
    };
  };

  const journalEntry = getInitialJournalEntry(transaction);

  return (
    <div className="p-0">
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

      {/* Formula Mode Instructions */}
      {isFormulaMode && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
          <p className="font-medium mb-1">Formula Mode Active</p>
          <p>Use Excel-like formulas: <code className="bg-blue-100 px-1 rounded">=B1*0.1</code>, <code className="bg-blue-100 px-1 rounded">=SUM(B1:B3)</code>, <code className="bg-blue-100 px-1 rounded">10%*C2</code></p>
          <p className="text-blue-600 mt-1">B = Debit column, C = Credit column, numbers = row index (1-based)</p>
        </div>
      )}

        <Separator className="my-2" />

        {/* Journal Entry Table */}
        <div className="mt-2">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-4">
              <div className="col-span-5">ACCOUNT</div>
              <div className="col-span-3 text-right">DEBIT</div>
              <div className="col-span-3 text-right">CREDIT</div>
              <div className="col-span-1"></div>
            </div>
          </div>
          
          {/* Table Body */}
          <div className="border border-gray-200 border-t-0 overflow-hidden">
            {journalEntry.entries.map((entry: any, index: number) => (
              <div 
                key={index} 
                className={cn(
                  "grid grid-cols-12 gap-2 text-xs items-center py-3 px-4 border-b border-gray-100 last:border-b-0",
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                )}
              >
                <div className="col-span-5">
                  <div className="font-semibold text-gray-900">
                    {entry.account} <span className="text-xs text-gray-500 font-normal">({getAccountCode(entry.account)})</span>
                  </div>
                </div>
                <div className="col-span-3 text-right">
                  <div className={cn(
                    "font-variant-numeric tabular-nums font-semibold",
                    entry.debit ? "text-green-700" : "text-gray-400"
                  )}>
                    {entry.debit ? `${getCurrencySymbol(transaction)}${entry.debit.toFixed(2)}` : "—"}
                  </div>
                </div>
                <div className="col-span-3 text-right">
                  <div className={cn(
                    "font-variant-numeric tabular-nums font-semibold",
                    entry.credit ? "text-red-700" : "text-gray-400"
                  )}>
                    {entry.credit ? `${getCurrencySymbol(transaction)}${entry.credit.toFixed(2)}` : "—"}
                  </div>
                </div>
                <div className="col-span-1"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Totals Row */}
        <div className="bg-gray-100 border-t border-gray-200">
          <div className="grid grid-cols-12 gap-2 text-xs font-bold py-3 px-4">
            <div className="col-span-5 text-gray-900">TOTALS</div>
            <div className="col-span-3 text-right text-green-700 font-variant-numeric tabular-nums">
              {getCurrencySymbol(transaction)}{journalEntry.entries.reduce((sum: number, entry: any) => sum + (entry.debit || 0), 0).toFixed(2)}
            </div>
            <div className="col-span-3 text-right text-red-700 font-variant-numeric tabular-nums">
              {getCurrencySymbol(transaction)}{journalEntry.entries.reduce((sum: number, entry: any) => sum + (entry.credit || 0), 0).toFixed(2)}
            </div>
            <div className="col-span-1"></div>
          </div>
        </div>
        
        {/* Balance Status */}
        <div className="text-center text-xs mt-2 p-2 rounded-lg font-medium text-green-700 bg-green-50 border border-green-200">
          ✓ Balanced
        </div>
    </div>
  );
}

// Helper function to get account codes
function getAccountCode(accountName: string): string {
  const accountCodes: { [key: string]: string } = {
    "Cash/Accounts Receivable": "1001",
    "Deferred Revenue": "2001",
    "SaaS Revenue": "4001"
  };
  return accountCodes[accountName] || "";
}
