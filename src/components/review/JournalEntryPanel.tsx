import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Edit3, 
  Eye, 
  RotateCcw,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JournalEntryPanelProps {
  transaction: any;
  onEdit: () => void;
  onSeeHow: () => void;
}

export function JournalEntryPanel({ transaction, onEdit, onSeeHow }: JournalEntryPanelProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Mock journal entry data with proper prepaid treatment for Vanta
  const journalEntry = getJournalEntryForTransaction(transaction);

  const confidence = transaction.confidence || 95;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Recommended Journal Entry</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
              <Eye className="w-4 h-4 mr-1" />
              {showDetails ? "Hide" : "Show"} Details
            </Button>
          </div>
        </div>

        {/* Header Meta Information */}
        <div className="grid grid-cols-3 gap-4 text-sm p-3 bg-mobius-gray-50 rounded-lg">
          <div>
            <p className="text-mobius-gray-500">Client:</p>
            <p className="font-medium">{journalEntry.client}</p>
          </div>
          <div>
            <p className="text-mobius-gray-500">Location:</p>
            <p className="font-medium">{journalEntry.location}</p>
          </div>
          <div>
            <p className="text-mobius-gray-500">Invoice #:</p>
            <div className="flex items-center space-x-2">
              <p className="font-medium">{journalEntry.invoiceNumber}</p>
              {journalEntry.isBillable && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  Billable ✓
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Badge>
              )}
            </div>
          </div>
          <div>
            <p className="text-mobius-gray-500">Vendor:</p>
            <p className="font-medium">{journalEntry.vendor}</p>
          </div>
        </div>

        <Separator />

        {/* Journal Entry Lines Table */}
        <div>
          <div className="grid grid-cols-4 gap-4 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide mb-3 pb-2 border-b border-mobius-gray-200">
            <div>ACCOUNT</div>
            <div className="text-right">DEBIT</div>
            <div className="text-right">CREDIT</div>
            <div className="text-right">CONF.</div>
          </div>
          
          <div className="space-y-3">
            {journalEntry.entries.map((entry, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 text-sm">
                <div className="font-medium text-mobius-gray-900">{entry.account}</div>
                <div className="text-right font-variant-numeric: tabular-nums font-medium">
                  {entry.debit ? `₹${entry.debit.toFixed(2)}` : "—"}
                </div>
                <div className="text-right font-variant-numeric: tabular-nums font-medium">
                  {entry.credit ? `₹${entry.credit.toFixed(2)}` : "—"}
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-status-done/10 text-status-done border-status-done/20 text-xs">
                    {entry.confidence || confidence}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <Separator className="my-3" />
          
          <div className="grid grid-cols-4 gap-4 text-sm font-medium">
            <div className="text-mobius-gray-600">Balance</div>
            <div className="text-right text-mobius-gray-400">—</div>
            <div className="text-right text-mobius-gray-400">—</div>
            <div className="text-right text-status-done font-medium">₹0.00 ✓</div>
          </div>
        </div>

        {showDetails && (
          <>
            <Separator />
            <div className="space-y-2 text-sm bg-mobius-gray-50 p-3 rounded-lg">
              <div className="flex justify-between">
                <span className="text-mobius-gray-500">Date:</span>
                <span className="font-medium">{new Date(journalEntry.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mobius-gray-500">Amount:</span>
                <span className="font-medium">₹{journalEntry.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mobius-gray-500">Entry Type:</span>
                <span className="font-medium">{journalEntry.entryType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mobius-gray-500">Narration:</span>
                <span className="font-medium text-xs">{journalEntry.narration}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

// Function to generate transaction-specific journal entries
function getJournalEntryForTransaction(transaction: any) {
  const baseEntry = {
    vendor: transaction.vendor,
    amount: transaction.amount,
    date: transaction.date,
    client: "Elire", // All transactions are for Elire
    isRecurring: transaction.isRecurring,
    isBillable: true,
    costCenter: "US Operations",
    location: "San Francisco HQ"
  };

  // Transaction-specific journal entries
  switch (transaction.id) {
    case "1": // JCSS & Associates LLP - ASO-I/109/25-26
      return {
        ...baseEntry,
        invoiceNumber: "ASO-I/109/25-26",
        totalAmount: 86400,
        entryType: "Professional Fees",
        narration: "Being the monthly professional charges for the month of May 2025 payable to JCSS & Associates LLP vide invoice no. ASO-I/109/25-26 dtd 26.05.2025",
        entries: [
          { account: "Professional Fees", debit: 80000, credit: 0, confidence: 95 },
          { account: "Input CGST", debit: 7200, credit: 0, confidence: 100 },
          { account: "Input SGST", debit: 7200, credit: 0, confidence: 100 },
          { account: "TDS on Professional Charges", debit: 0, credit: 8000, confidence: 100 },
          { account: "JCSS & Associates LLP", debit: 0, credit: 86400, confidence: 100 }
        ]
      };

    case "2": // JCSS & Associates LLP - ASO-I/117/25-26
      return {
        ...baseEntry,
        invoiceNumber: "ASO-I/117/25-26",
        totalAmount: 64800,
        entryType: "Professional Fees",
        narration: "Being the Professional fee towards N-STP condonation of invoices payable to JCSS & Associates LLP vide invoice no. ASO-I/117/25-26 dtd 26.05.2025",
        entries: [
          { account: "Professional Fees", debit: 60000, credit: 0, confidence: 95 },
          { account: "Input CGST", debit: 5400, credit: 0, confidence: 100 },
          { account: "Input SGST", debit: 5400, credit: 0, confidence: 100 },
          { account: "TDS on Professional Charges", debit: 0, credit: 6000, confidence: 100 },
          { account: "JCSS & Associates LLP", debit: 0, credit: 64800, confidence: 100 }
        ]
      };

    case "3": // NSDL Database Management Limited
      return {
        ...baseEntry,
        invoiceNumber: "RTA/05/2526/4104",
        totalAmount: 11800,
        entryType: "Rates & Taxes",
        narration: "Being the charges paid to NDML vide inv no. RTA/05/2526/4104 dtd 31.05.2025",
        entries: [
          { account: "Rates & Taxes", debit: 10000, credit: 0, confidence: 95 },
          { account: "Input IGST", debit: 1800, credit: 0, confidence: 100 },
          { account: "NSDL Database Management Ltd", debit: 0, credit: 11800, confidence: 100 }
        ]
      };

    case "4": // Sogo Computers - Freight for Tanvi Arora
      return {
        ...baseEntry,
        invoiceNumber: "SOGO-FREIGHT-001",
        totalAmount: 5310,
        entryType: "Freight and Postage",
        narration: "Being the Freight charges for shipping a laptop to Tanvi Arora",
        entries: [
          { account: "Freight and Postage", debit: 4500, credit: 0, confidence: 95 },
          { account: "Input CGST", debit: 405, credit: 0, confidence: 100 },
          { account: "Input SGST", debit: 405, credit: 0, confidence: 100 },
          { account: "Sogo Computers Pvt Ltd", debit: 0, credit: 5310, confidence: 100 }
        ]
      };

    case "5": // Sogo Computers - Freight for Kamal Chandani
      return {
        ...baseEntry,
        invoiceNumber: "SOGO-FREIGHT-002",
        totalAmount: 5310,
        entryType: "Freight and Postage",
        narration: "Being the Freight charges for shipping a laptop to Kamal Chandani",
        entries: [
          { account: "Freight and Postage", debit: 4500, credit: 0, confidence: 95 },
          { account: "Input CGST", debit: 405, credit: 0, confidence: 100 },
          { account: "Input SGST", debit: 405, credit: 0, confidence: 100 },
          { account: "Sogo Computers Pvt Ltd", debit: 0, credit: 5310, confidence: 100 }
        ]
      };

    case "6": // Clayworks Spaces Technologies - Office space
      return {
        ...baseEntry,
        invoiceNumber: "INV-25/26/0258",
        totalAmount: 102660,
        entryType: "Rent",
        narration: "Being the charges for office space for May 2025",
        entries: [
          { account: "Rent", debit: 87000, credit: 0, confidence: 95 },
          { account: "Input CGST", debit: 7830, credit: 0, confidence: 100 },
          { account: "Input SGST", debit: 7830, credit: 0, confidence: 100 },
          { account: "Clayworks Spaces Technologies Pvt Ltd", debit: 0, credit: 93960, confidence: 100 },
          { account: "TDS on Rent", debit: 0, credit: 8700, confidence: 100 }
        ]
      };

    case "7": // Clayworks Spaces Technologies - Car parking and two wheeler parking
      return {
        ...baseEntry,
        invoiceNumber: "INV-25/26/0376",
        totalAmount: 5251,
        entryType: "Rent",
        narration: "Being the charges for car parking and two wheeler parking for April 2025 vide invoice no. INV-25/26/0376 Dtd. 08.05.2025",
        entries: [
          { account: "Rent", debit: 4450, credit: 0, confidence: 95 },
          { account: "Input CGST", debit: 400.50, credit: 0, confidence: 100 },
          { account: "Input SGST", debit: 400.50, credit: 0, confidence: 100 },
          { account: "Clayworks Spaces Technologies Pvt Ltd", debit: 0, credit: 4806, confidence: 100 },
          { account: "TDS on Rent", debit: 0, credit: 445, confidence: 100 }
        ]
      };

    case "8": // Mahat Labs Pvt Ltd - Dell laptops (5 Nos)
      return {
        ...baseEntry,
        invoiceNumber: "Pcd/25-26/001143",
        totalAmount: 480850,
        entryType: "Computers",
        narration: "Being Dell laptop (5 Nos) purchased from Sogo Computers Pvt Ltd vide bill no. Pcd/25-26/001143 dated 19-05-2025 amount Rs. 4,80,850.",
        entries: [
          { account: "Computers", debit: 407500, credit: 0, confidence: 95 },
          { account: "Input CGST", debit: 36675, credit: 0, confidence: 100 },
          { account: "Input SGST", debit: 36675, credit: 0, confidence: 100 },
          { account: "Sogo Computers Pvt Ltd", debit: 0, credit: 480850, confidence: 100 }
        ]
      };

    case "9": // Wonderslate - Laptop for Tanvi Arora
      return {
        ...baseEntry,
        invoiceNumber: "WONDER-LAPTOP-001",
        totalAmount: 96170,
        entryType: "Computers",
        narration: "Being the purchase of laptop 1 Nos and shipped to Tanvi Arora",
        entries: [
          { account: "Computers", debit: 81500, credit: 0, confidence: 95 },
          { account: "Input CGST", debit: 7335, credit: 0, confidence: 100 },
          { account: "Input SGST", debit: 7335, credit: 0, confidence: 100 },
          { account: "Sogo Computers Pvt Ltd", debit: 0, credit: 96170, confidence: 100 }
        ]
      };

    case "10": // HEPL - Laptop for Kamal Chandani
      return {
        ...baseEntry,
        invoiceNumber: "HEPL-LAPTOP-001",
        totalAmount: 96170,
        entryType: "Computers",
        narration: "Being the purchase of laptop 1 Nos and shipped to Kamal Chandani",
        entries: [
          { account: "Computers", debit: 81500, credit: 0, confidence: 95 },
          { account: "Input CGST", debit: 7335, credit: 0, confidence: 100 },
          { account: "Input SGST", debit: 7335, credit: 0, confidence: 100 },
          { account: "Sogo Computers Pvt Ltd", debit: 0, credit: 96170, confidence: 100 }
        ]
      };

    default:
      // Fallback for any other transactions
      return {
        ...baseEntry,
        invoiceNumber: "INV-2025-001",
        totalAmount: transaction.amount,
        entryType: "General Expense",
        narration: `Being the expense payable to ${transaction.vendor}`,
        entries: [
          { account: "General Expense", debit: transaction.amount * 0.85, credit: 0, confidence: 95 },
          { account: "Input CGST", debit: transaction.amount * 0.075, credit: 0, confidence: 100 },
          { account: "Input SGST", debit: transaction.amount * 0.075, credit: 0, confidence: 100 },
          { account: transaction.vendor, debit: 0, credit: transaction.amount, confidence: 100 }
        ]
      };
  }
}