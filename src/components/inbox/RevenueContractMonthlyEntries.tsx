import { Transaction } from "@/types/Transaction";
import { cn } from "@/lib/utils";

interface RevenueContractMonthlyEntriesProps {
  transaction: Transaction;
}

export function RevenueContractMonthlyEntries({ transaction }: RevenueContractMonthlyEntriesProps) {
  const getCurrencySymbol = (transaction: any) => {
    return transaction.currency === 'USD' ? '$' : '₹';
  };


  return (
    <div className="p-0">
      <div className="flex justify-between mb-2">
        <h4 className="text-xs font-medium text-mobius-gray-900">Monthly Journal Entry Template:</h4>
      </div>

      {/* Monthly Journal Entry Table */}
      <div className="mt-2">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-4">
              <div>ACCOUNT</div>
              <div className="text-right">DEBIT</div>
              <div className="text-right">CREDIT</div>
            </div>
          </div>
          
          {/* Table Body */}
          <div className="border border-gray-200 border-t-0 overflow-hidden">
            <div className="grid grid-cols-3 gap-2 text-xs items-center py-3 px-4 border-b border-gray-100 bg-white">
              <div className="font-semibold text-gray-900">SaaS Revenue <span className="text-xs text-gray-500 font-normal">(4001)</span></div>
              <div className="text-right font-variant-numeric tabular-nums font-semibold text-gray-400">—</div>
              <div className="text-right font-variant-numeric tabular-nums font-semibold text-red-700">
                {getCurrencySymbol(transaction)}702
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs items-center py-3 px-4 bg-gray-50/50">
              <div className="font-semibold text-gray-900">Deferred Revenue <span className="text-xs text-gray-500 font-normal">(2001)</span></div>
              <div className="text-right font-variant-numeric tabular-nums font-semibold text-green-700">
                {getCurrencySymbol(transaction)}702
              </div>
              <div className="text-right font-variant-numeric tabular-nums font-semibold text-gray-400">—</div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
          Monthly entry made as services are delivered over the contract period.
        </div>
      </div>

  );
}
