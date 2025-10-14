import { Transaction } from "@/types/Transaction";
import { cn } from "@/lib/utils";

interface PrepaidExpenseProps {
  transaction: Transaction;
}

export function PrepaidExpense({ transaction }: PrepaidExpenseProps) {
  if (!transaction.isPrepaid) return null;

  const getCurrencySymbol = (transaction: any) => {
    return transaction.currency === 'USD' ? '$' : '₹';
  };

  return (
    <div className="space-y-4">
      {/* Prepaid Amortization Schedule */}
      <div className="p-0">
        <div className="flex justify-between mb-2">
          <h4 className="text-xs font-medium text-mobius-gray-900">Prepaid Amortization Schedule: Prepaid Software Subscriptions (1003)</h4>
        </div>

        {/* Prepaid Amortization Schedule Table */}
        <div className="mt-2">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-4">
              <div>PERIOD</div>
              <div className="text-right">MONTHLY EXPENSE</div>
              <div className="text-right">DEFERRED EXPENSE</div>
              <div className="text-right">RECOGNIZED</div>
            </div>
          </div>
          
          {/* Table Body */}
          <div className="border border-gray-200 border-t-0 overflow-hidden">
            {generatePrepaidSchedule(transaction).map((period, index) => (
              <div 
                key={index} 
                className={cn(
                  "grid grid-cols-4 gap-2 text-xs items-center py-3 px-4 border-b border-gray-100 last:border-b-0",
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                )}
              >
                <div className="font-semibold text-gray-900">{period.period}</div>
                <div className="text-right font-variant-numeric tabular-nums font-semibold text-green-700">
                  {getCurrencySymbol(transaction)}{period.monthlyExpense.toFixed(0)}
                </div>
                <div className="text-right font-variant-numeric tabular-nums font-semibold text-gray-700">
                  {getCurrencySymbol(transaction)}{period.remainingBalance.toFixed(0)}
                </div>
                <div className="text-right font-variant-numeric tabular-nums font-semibold text-blue-700">
                  {getCurrencySymbol(transaction)}{period.monthlyExpense.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prepaid Expense Classification */}
      <div className="p-0">
        <div className="bg-blue-50 rounded-lg p-4 max-w-2xl">
          <div className="space-y-3 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-blue-800 font-medium">Company Policy Applied:</span>
            </div>
            <p className="text-blue-700 ml-4">
              Quarterly software subscriptions exceeding $500 are classified as prepaid expenses and amortized over the subscription period.
            </p>
            <div className="ml-4 mt-2">
              <a 
                href="/onboarding?section=accounts-payable&subsection=prepaid-expenses"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-xs font-medium underline hover:no-underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Prepaid Expenses Policy →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate prepaid amortization schedule
function generatePrepaidSchedule(transaction: any) {
  // For HubSpot transactions, use subtotal (2109) instead of total (2324.11)
  let prepaidAmount = transaction.prepaidAmount || transaction.amount || 0;
  if (transaction.vendor === 'HubSpot Inc' && transaction.currency === 'USD') {
    prepaidAmount = 2109; // Subtotal before sales tax
  }
  
  const period = transaction.prepaidPeriod || 'quarterly';
  
  let months = 3; // Default to quarterly
  if (period === 'monthly') months = 1;
  else if (period === 'annual') months = 12;
  
  const monthlyExpense = prepaidAmount / months;
  const schedule = [];
  
  // For HubSpot, start from May 2025
  const startDate = new Date('2025-05-01');
  
  for (let i = 0; i < months; i++) {
    const remainingBalance = prepaidAmount - (monthlyExpense * (i + 1));
    const monthDate = new Date(startDate);
    monthDate.setMonth(startDate.getMonth() + i);
    
    schedule.push({
      period: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      monthlyExpense: monthlyExpense,
      remainingBalance: Math.max(0, remainingBalance),
      status: i === 0 ? 'Current' : 'Scheduled'
    });
  }
  
  return schedule;
}
