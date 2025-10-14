import { Transaction } from "@/types/Transaction";

interface MonthlyScheduledEntriesProps {
  transaction: Transaction;
}

export function MonthlyScheduledEntries({ transaction }: MonthlyScheduledEntriesProps) {
  if (!transaction.isPrepaid) return null;

  const getCurrencySymbol = (transaction: any) => {
    return transaction.currency === 'USD' ? '$' : '₹';
  };

  // For HubSpot transactions, use subtotal (2109) instead of total (2324.11)
  const getPrepaidAmount = (transaction: any) => {
    if (transaction.vendor === 'HubSpot Inc' && transaction.currency === 'USD') {
      return 2109; // Subtotal before sales tax
    }
    return transaction.prepaidAmount || transaction.amount || 0;
  };

  return (
    <div className="p-0">
      <div className="flex justify-between mb-2">
        <h4 className="text-xs font-medium text-mobius-gray-900"></h4>
      </div>

      {/* Monthly Scheduled Entries Table */}
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
              <div className="font-semibold text-gray-900">Marketing Expenses <span className="text-xs text-gray-500 font-normal">(5001)</span></div>
              <div className="text-right font-variant-numeric tabular-nums font-semibold text-green-700">
                {getCurrencySymbol(transaction)}{Math.round(getPrepaidAmount(transaction) / 3)}
              </div>
              <div className="text-right font-variant-numeric tabular-nums font-semibold text-gray-400">—</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs items-center py-3 px-4 bg-gray-50/50">
              <div className="font-semibold text-gray-900">Prepaid Software Subscriptions <span className="text-xs text-gray-500 font-normal">(1003)</span></div>
              <div className="text-right font-variant-numeric tabular-nums font-semibold text-gray-400">—</div>
              <div className="text-right font-variant-numeric tabular-nums font-semibold text-red-700">
                {getCurrencySymbol(transaction)}{Math.round(getPrepaidAmount(transaction) / 3)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
          Monthly entry made as services are consumed over the subscription period.
        </div>

      {/* Additional Monthly Entry Information */}
      <div className="mt-4 p-3 bg-mobius-gray-50 rounded-lg">
        <div className="space-y-3 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-mobius-gray-500 rounded-full"></div>
            <span className="text-mobius-gray-800 font-medium">Automated Processing:</span>
          </div>
          <p className="text-mobius-gray-700 ml-4">
            These journal entries will be automatically created in your accounting system on the first day of each month based on the amortization schedule.
          </p>
        </div>
      </div>
    </div>
  );
}
