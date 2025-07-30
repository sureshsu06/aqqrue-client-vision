import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  Edit3, 
  Eye, 
  AlertTriangle,
  FileText,
  Building,
  Calendar,
  RotateCcw,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction } from "./InboxList";

interface ReadingPaneProps {
  transaction: Transaction;
  onApprove: () => void;
  onEdit: () => void;
  onSeeHow: () => void;
}

export function ReadingPane({ transaction, onApprove, onEdit, onSeeHow }: ReadingPaneProps) {
  const confidence = transaction.confidence || 95;
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    // Use the pdfFile property from the transaction
    if (transaction.pdfFile) {
      const pdfUrl = `/documents/${transaction.pdfFile}`;
      setPdfUrl(pdfUrl);
    } else {
      setPdfUrl("");
    }
  }, [transaction.pdfFile]);

  // Mock journal entry data
  const journalEntry = getJournalEntryForTransaction(transaction);

  const analysisSteps = [
    {
      step: 1,
      title: "Vendor Identification",
      status: "complete",
      confidence: 100
    },
    {
      step: 2,
      title: "Recurring Pattern",
      status: transaction.isRecurring ? "complete" : "skip",
      confidence: transaction.isRecurring ? 100 : 0
    },
    {
      step: 3,
      title: "Amount Extraction",
      status: "complete",
      confidence: 100
    },
    {
      step: 4,
      title: "Client Attribution",
      status: "complete",
      confidence: 100
    },
    {
      step: 5,
      title: "Categorization",
      status: "complete",
      confidence: confidence
    }
  ];

  return (
    <div className="w-1/2 border-l border-mobius-gray-100 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-mobius-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{transaction.vendor}</h3>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                confidence >= 95 
                  ? "bg-status-done/10 text-status-done border-status-done/20"
                  : confidence >= 85
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-mobius-gray-50 text-mobius-gray-600 border-mobius-gray-200"
              )}
            >
              {confidence}%
            </Badge>
          </div>
        </div>

        {transaction.isDuplicate && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="text-amber-800 font-medium">Duplicate detected</p>
                <p className="text-amber-700">
                  WeWork sent this to joy@ and accounting@. Keep one copy to avoid double entry.
                </p>
                <Button variant="outline" size="sm" className="mt-2 text-amber-700 border-amber-300">
                  Remove this copy
                </Button>
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-mobius-gray-500">
          ₹{transaction.amount.toLocaleString()} • {new Date(transaction.date).toLocaleDateString()}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="summary" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="document">Document</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="document" className="mt-0">
              <Card className="p-4 bg-gradient-card min-h-96">
                {pdfUrl ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Original Document</h4>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    <div className="border border-mobius-gray-200 rounded-lg overflow-hidden">
                      <embed
                        src={pdfUrl}
                        type="application/pdf"
                        className="w-full h-96"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-mobius-gray-500 flex items-center justify-center h-full">
                    <div>
                      <FileText className="w-8 h-8 mx-auto mb-3 stroke-current fill-none" />
                      <p className="font-medium">No Document Available</p>
                      <p className="text-sm">Upload a document to view it here</p>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="mt-0">
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-mobius-gray-500">Client:</p>
                      <p className="font-medium">{journalEntry.client}</p>
                    </div>
                    <div>
                      <p className="text-mobius-gray-500">Invoice #:</p>
                      <p className="font-medium">{journalEntry.invoiceNumber} 
                        {journalEntry.isBillable && (
                          <Badge variant="outline" className="ml-2 text-xs">Billable ✓</Badge>
                        )}
                      </p>
                    </div>
                    {journalEntry.isRecurring && (
                      <div>
                        <p className="text-mobius-gray-500">Recurring:</p>
                        <p className="font-medium flex items-center">
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Monthly on 1st
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-mobius-gray-500">Cost Center:</p>
                      <p className="font-medium">{journalEntry.costCenter}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Journal Entry Table */}
                  <div>
                    <div className="grid grid-cols-4 gap-4 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide mb-2">
                      <div>ACCOUNT</div>
                      <div className="text-right">DEBIT</div>
                      <div className="text-right">CREDIT</div>
                      <div className="text-right">CONF.</div>
                    </div>
                    
                    <div className="space-y-2">
                      {journalEntry.entries.map((entry, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 text-sm">
                          <div className="font-medium">{entry.account}</div>
                          <div className="text-right font-variant-numeric: tabular-nums">
                            {entry.debit ? `₹${entry.debit.toFixed(2)}` : "—"}
                          </div>
                          <div className="text-right font-variant-numeric: tabular-nums">
                            {entry.credit ? `₹${entry.credit.toFixed(2)}` : "—"}
                          </div>
                          <div className="text-right">{entry.confidence || confidence}%</div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="grid grid-cols-4 gap-4 text-sm font-medium">
                      <div>Balance</div>
                      <div className="text-right">—</div>
                      <div className="text-right">—</div>
                      <div className="text-right text-status-done">₹0.00 ✓</div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="mt-0">
              <div className="space-y-3">
                {analysisSteps.map((step) => (
                  <Card key={step.step} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                          step.status === "complete" 
                            ? "bg-status-done text-white"
                            : step.status === "skip"
                            ? "bg-mobius-gray-300 text-mobius-gray-600"
                            : "bg-status-pending text-white"
                        )}>
                          {step.status === "complete" ? "✓" : step.step}
                        </div>
                        <h4 className="font-medium text-sm">{step.title}</h4>
                      </div>
                      {step.status === "complete" && (
                        <Badge variant="outline" className="bg-status-done/10 text-status-done border-status-done/20 text-xs">
                          {step.confidence}%
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-mobius-gray-100 bg-white">
        <div className="flex space-x-3">
          <Button className="bg-status-done hover:bg-status-done/90 flex-1" onClick={onApprove}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button variant="outline" onClick={onSeeHow}>
            <Eye className="w-4 h-4 mr-2" />
            See How
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
    </div>
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