import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/Transaction";
import { PAST_JOURNAL_ENTRIES } from "@/lib/constants";

interface VendorLedgerProps {
  transaction: Transaction;
  onInvoiceClick: (invoiceNumber: string, vendorName: string) => void;
}

export function VendorLedger({ transaction, onInvoiceClick }: VendorLedgerProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-medium text-mobius-gray-900">Vendor Ledger</h4>
        <Badge variant="outline" className="text-xs">
          {transaction.vendor}
        </Badge>
      </div>
      
      {/* Past Journal Entries Table */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-mobius-gray-700">Past Journal Entries</h5>
        <div className="border border-mobius-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-mobius-gray-50">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-mobius-gray-600 uppercase tracking-wide">Date</th>
                <th className="text-left p-3 text-xs font-medium text-mobius-gray-600 uppercase tracking-wide">Reference</th>
                <th className="text-left p-3 text-xs font-medium text-mobius-gray-600 uppercase tracking-wide">Type</th>
                <th className="text-right p-3 text-xs font-medium text-mobius-gray-600 uppercase tracking-wide">Debit</th>
                <th className="text-right p-3 text-xs font-medium text-mobius-gray-600 uppercase tracking-wide">Credit</th>
                <th className="text-center p-3 text-xs font-medium text-mobius-gray-600 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mobius-gray-200">
              {getPastJournalEntries(transaction.vendor)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((entry, index) => (
                <tr key={index} className="hover:bg-mobius-gray-50 hover:border-l-2 hover:border-l-mobius-blue/30 transition-all duration-200">
                  <td className="p-3 text-sm text-mobius-gray-900">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-sm font-medium text-mobius-gray-900">
                    <button
                      onClick={() => onInvoiceClick(entry.invoiceNumber, transaction.vendor)}
                      className="text-mobius-gray-900 hover:text-mobius-gray-700 hover:underline transition-all duration-200 cursor-pointer font-medium px-2 py-1 rounded hover:bg-mobius-gray-100 border border-transparent hover:border-mobius-gray-200 text-left"
                      title={`Click to view ${entry.invoiceNumber}`}
                    >
                      {entry.invoiceNumber}
                    </button>
                  </td>
                  <td className="p-3 text-sm text-mobius-gray-700">
                    {entry.type}
                  </td>
                  <td className="p-3 text-sm text-right font-medium">
                    {entry.type === "Payment" ? `₹${Math.abs(entry.amount).toLocaleString()}` : ''}
                  </td>
                  <td className="p-3 text-sm text-right font-medium">
                    {entry.type !== "Payment" ? `₹${Math.abs(entry.amount).toLocaleString()}` : ''}
                  </td>
                  <td className="p-3 text-center">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        entry.status === "Approved" ? "bg-green-50 text-green-700 border-green-200" :
                        entry.status === "Paid" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-mobius-gray-50 text-mobius-gray-600 border-mobius-gray-200"
                      }`}
                    >
                      {entry.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-mobius-gray-50 border-t border-mobius-gray-200">
              <tr>
                <td colSpan={3} className="p-3 text-sm font-medium text-mobius-gray-900">
                  Current Balance
                </td>
                <td className="p-3 text-sm text-right font-semibold text-mobius-gray-900">
                  {getVendorBalance(transaction.vendor) < 0 ? `₹${Math.abs(getVendorBalance(transaction.vendor)).toLocaleString()}` : ''}
                </td>
                <td className="p-3 text-sm text-right font-semibold text-mobius-gray-900">
                  {getVendorBalance(transaction.vendor) > 0 ? `₹${getVendorBalance(transaction.vendor).toLocaleString()}` : ''}
                </td>
                <td className="p-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper function to get vendor balance
function getVendorBalance(vendorName: string) {
  const vendorBalances: { [key: string]: number } = {
    "JCSS & Associates LLP": 0,
    "JCSS & Associates": 0,
    "JCSS": 0,
    "Sogo Computers Pvt Ltd": 0,
    "Sogo Computers": 0,
    "Sogo": 0,
    "Clayworks Spaces Technologies Pvt Ltd": 0,
    "Clayworks Spaces Technologies": 0,
    "Clayworks Spaces Pvt Ltd": 0,
    "Clayworks Spaces": 0,
    "Clayworks": 0,
    "NSDL Database Management Ltd": 0,
    "NSDL Database Management": 0,
    "NSDL": 0,
    "Mahat Labs Pvt Ltd": 0,
    "Mahat Labs": 0,
    "Mahat": 0,
    "Wonderslate": 0,
    "HEPL": 0
  };
  
  let balance = vendorBalances[vendorName];
  
  if (balance === undefined) {
    const vendorKeys = Object.keys(vendorBalances);
    for (const key of vendorKeys) {
      if (vendorName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(vendorName.toLowerCase())) {
        balance = vendorBalances[key];
        break;
      }
    }
  }
  
  return balance || 0;
}

// Helper function to get past journal entries for a vendor
function getPastJournalEntries(vendorName: string) {
  let entries = PAST_JOURNAL_ENTRIES[vendorName];
  
  if (!entries) {
    const vendorKeys = Object.keys(PAST_JOURNAL_ENTRIES);
    for (const key of vendorKeys) {
      if (vendorName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(vendorName.toLowerCase())) {
        entries = PAST_JOURNAL_ENTRIES[key];
        break;
      }
    }
  }
  
  return entries || [];
}
