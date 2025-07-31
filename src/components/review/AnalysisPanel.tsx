import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  TrendingUp,
  Settings,
  RefreshCw,
  Eye,
  BarChart3,
  Users,
  FileSearch
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AnalysisPanelProps {
  transaction: any;
}

export function AnalysisPanel({ transaction }: AnalysisPanelProps) {
  const [autoApprovalOpen, setAutoApprovalOpen] = useState(false);
  const { toast } = useToast();

  // Get transaction-specific journal entry data
  const journalEntry = getJournalEntryForTransaction(transaction);
  const confidence = transaction.confidence || 95;

  // Generate analysis steps based on actual journal entry data
  const analysisSteps = [
    {
      step: 1,
      title: "Vendor Identification",
      status: "complete",
      details: `Extracted: "${journalEntry.vendor}"`,
      subDetails: `Matched to existing vendor (${journalEntry.vendor === "JCSS & Associates LLP" ? "23" : journalEntry.vendor === "Sogo Computers" ? "15" : "8"} previous bills)`,
      confidence: 100,
      hasOverride: true,
      hasEvidence: true
    },
    {
      step: 2,
      title: "Recurring Pattern Detection",
      status: journalEntry.isRecurring ? "complete" : "skip",
      details: journalEntry.isRecurring ? `Monthly bill on ${new Date(journalEntry.date).getDate()} of each month` : "No pattern detected",
      subDetails: journalEntry.isRecurring ? "Amount consistent for past 3 months" : "",
      confidence: journalEntry.isRecurring ? 100 : 0,
      hasAutoApproval: journalEntry.isRecurring,
      hasEvidence: journalEntry.isRecurring
    },
    {
      step: 3,
      title: "Amount Extraction",
      status: "complete",
      details: `Total: ₹${journalEntry.totalAmount.toLocaleString()}`,
      subDetails: journalEntry.entryType === "Professional Fees" ? "Multi-period expense detected" : "Single period expense",
      confidence: 100,
      hasBreakdown: journalEntry.entryType === "Professional Fees"
    },
    {
      step: 4,
      title: "Client Attribution",
      status: "complete",
      details: `Assigned to ${journalEntry.client}`,
      subDetails: "100% billable to client",
      confidence: 100,
      hasAllocation: true
    },
    {
      step: 5,
      title: "Categorization",
      status: "complete",
      details: `Account: ${journalEntry.entries[0].account}`,
      subDetails: `Rule: ${journalEntry.entryType} → ${journalEntry.entries[0].account}`,
      confidence: confidence,
      hasEvidence: true
    }
  ];

  const handleAutoApproval = () => {
    toast({
      title: "Auto-approval enabled",
      description: `${journalEntry.vendor} bills will auto-post at ≥99% confidence.`
    });
    setAutoApprovalOpen(false);
  };

  const handleRecompute = (stepNumber: number) => {
    toast({
      title: "Recomputing...",
      description: `Step ${stepNumber} analysis is being updated.`
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center">
        <TrendingUp className="w-4 h-4 mr-2" />
        How Mobius processed this bill:
      </h3>
      
      {analysisSteps.map((step) => (
        <Card key={step.step} className="p-4 border border-mobius-gray-100 hover:border-mobius-gray-200 transition-colors">
          <div className="flex items-start space-x-4">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0",
              step.status === "complete" 
                ? "bg-status-done text-white"
                : step.status === "skip"
                ? "bg-mobius-gray-300 text-mobius-gray-600"
                : "bg-status-pending text-white"
            )}>
              {step.status === "complete" ? "✓" : step.step}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-base text-mobius-gray-900">
                  {step.title}
                </h4>
                <div className="flex items-center space-x-2">
                  {step.status === "complete" && (
                    <Badge variant="outline" className="bg-status-done/10 text-status-done border-status-done/20 text-xs font-medium">
                      {step.confidence}% confidence
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-mobius-gray-600 mb-2 leading-relaxed">
                {step.details}
              </p>
              {step.subDetails && (
                <p className="text-xs text-mobius-gray-500 mb-4 leading-relaxed">
                  {step.subDetails}
                </p>
              )}

              {/* Step-specific controls */}
              <div className="flex flex-wrap gap-2">
                {step.hasOverride && (
                  <div className="flex items-center space-x-2">
                    <Select defaultValue={journalEntry.vendor.toLowerCase().replace(/\s+/g, '-')}>
                      <SelectTrigger className="w-36 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jcss-associates-llp">JCSS & Associates LLP</SelectItem>
                        <SelectItem value="sogo-computers">Sogo Computers</SelectItem>
                        <SelectItem value="other">Other...</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs px-3"
                      onClick={() => handleRecompute(step.step)}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Recompute
                    </Button>
                  </div>
                )}

                {step.hasAutoApproval && (
                  <Dialog open={autoApprovalOpen} onOpenChange={setAutoApprovalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 text-xs px-3">
                        <Settings className="w-3 h-3 mr-1" />
                        Set up auto-approval
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Auto-approval Settings</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-mobius-gray-600">
                          Auto-post {journalEntry.vendor} bills when confidence ≥ <strong>99%</strong>. 
                          You'll still see exceptions or changes in amount/date.
                        </p>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setAutoApprovalOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAutoApproval}>
                            Enable Auto-approval
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {step.hasBreakdown && (
                  <Button variant="outline" size="sm" className="h-8 text-xs px-3">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    View breakdown
                  </Button>
                )}

                {step.hasAllocation && (
                  <Button variant="outline" size="sm" className="h-8 text-xs px-3">
                    <Users className="w-3 h-3 mr-1" />
                    Change allocation
                  </Button>
                )}

                {step.hasEvidence && (
                  <Button variant="outline" size="sm" className="h-8 text-xs px-3">
                    <Eye className="w-3 h-3 mr-1" />
                    See evidence
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
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
        totalAmount: 94400,
        entryType: "Professional Fees",
        narration: "Being the monthly professional charges for the month of May 2025 payable to JCSS & Associates LLP vide invoice no. ASO-I/109/25-26 dtd 26.05.2025",
        entries: [
          { account: "Professional Fees", debit: 60000, credit: 0, confidence: 95 },
          { account: "Input CGST", debit: 5400, credit: 0, confidence: 100 },
          { account: "Input SGST", debit: 5400, credit: 0, confidence: 100 },
          { account: "TDS on Professional Fees", debit: 0, credit: 6000, confidence: 100 },
          { account: "JCSS & Associates LLP", debit: 0, credit: 64800, confidence: 100 }
        ]
      };

    case "2": // JCSS & Associates LLP - ASO-I/117/25-26
      return {
        ...baseEntry,
        invoiceNumber: "ASO-I/117/25-26",
        totalAmount: 70800,
        entryType: "Professional Fees",
        narration: "Being the professional charges for N-STP Condonation payable to JCSS & Associates LLP vide invoice no. ASO-I/117/25-26 dtd 26.05.2025",
        entries: [
          { account: "Professional Fees", debit: 60000, credit: 0, confidence: 95 },
          { account: "Input CGST", debit: 5400, credit: 0, confidence: 100 },
          { account: "Input SGST", debit: 5400, credit: 0, confidence: 100 },
          { account: "JCSS & Associates LLP", debit: 0, credit: 70800, confidence: 100 }
        ]
      };

    case "3": // NSDL Database Management Limited
      return {
        ...baseEntry,
        invoiceNumber: "EGS001",
        totalAmount: 11800,
        entryType: "Equity AMC",
        narration: "Being the equity AMC charges payable to NSDL Database Management Limited vide invoice no. EGS001 dtd 31.05.2025",
        entries: [
          { account: "Equity AMC", debit: 11800, credit: 0, confidence: 98 },
          { account: "NSDL Database Management Limited", debit: 0, credit: 11800, confidence: 100 }
        ]
      };

    case "4": // Sogo Computers - Freight Charges
      return {
        ...baseEntry,
        invoiceNumber: "Hys-1117",
        totalAmount: 5310,
        entryType: "Freight Charges",
        narration: "Being the freight charges payable to Sogo Computers vide invoice no. Hys-1117 dtd 22.05.2025",
        entries: [
          { account: "Freight Charges", debit: 5310, credit: 0, confidence: 88 },
          { account: "Sogo Computers", debit: 0, credit: 5310, confidence: 100 }
        ]
      };

    case "5": // Sogo Computers - Freight Charges (Recurring)
      return {
        ...baseEntry,
        invoiceNumber: "Hys-1121",
        totalAmount: 5310,
        entryType: "Freight Charges",
        narration: "Being the freight charges payable to Sogo Computers vide invoice no. Hys-1121 dtd 22.05.2025",
        entries: [
          { account: "Freight Charges", debit: 5310, credit: 0, confidence: 100 },
          { account: "Sogo Computers", debit: 0, credit: 5310, confidence: 100 }
        ]
      };

    case "6": // Clayworks Spaces Pvt Ltd - Rent
      return {
        ...baseEntry,
        invoiceNumber: "INV-25260258",
        totalAmount: 102660,
        entryType: "Rent",
        narration: "Being the rent payable to Clayworks Spaces Pvt Ltd vide invoice no. INV-25260258 dtd 22.05.2025",
        entries: [
          { account: "Rent Expense", debit: 102660, credit: 0, confidence: 92 },
          { account: "Clayworks Spaces Pvt Ltd", debit: 0, credit: 102660, confidence: 100 }
        ]
      };

    case "7": // Clayworks Spaces Pvt Ltd - Parking Charges
      return {
        ...baseEntry,
        invoiceNumber: "INV-25260376",
        totalAmount: 5251,
        entryType: "Parking Charges",
        narration: "Being the parking charges payable to Clayworks Spaces Pvt Ltd vide invoice no. INV-25260376 dtd 08.05.2025",
        entries: [
          { account: "Parking Charges", debit: 5251, credit: 0, confidence: 87 },
          { account: "Clayworks Spaces Pvt Ltd", debit: 0, credit: 5251, confidence: 100 }
        ]
      };

    case "8": // Sogo Computers - Laptop Purchase
      return {
        ...baseEntry,
        invoiceNumber: "PCD-143",
        totalAmount: 480850,
        entryType: "Laptop Purchase",
        narration: "Being the laptop purchase payable to Sogo Computers vide invoice no. PCD-143 dtd 19.05.2025",
        entries: [
          { account: "Computer Equipment", debit: 480850, credit: 0, confidence: 96 },
          { account: "Sogo Computers", debit: 0, credit: 480850, confidence: 100 }
        ]
      };

    case "9": // Sogo Computers - Laptop Purchase
      return {
        ...baseEntry,
        invoiceNumber: "PCD-159",
        totalAmount: 96170,
        entryType: "Laptop Purchase",
        narration: "Being the laptop purchase payable to Sogo Computers vide invoice no. PCD-159 dtd 22.05.2025",
        entries: [
          { account: "Computer Equipment", debit: 96170, credit: 0, confidence: 94 },
          { account: "Sogo Computers", debit: 0, credit: 96170, confidence: 100 }
        ]
      };

    case "10": // Sogo Computers - Laptop Purchase
      return {
        ...baseEntry,
        invoiceNumber: "PCD-160",
        totalAmount: 96170,
        entryType: "Laptop Purchase",
        narration: "Being the laptop purchase payable to Sogo Computers vide invoice no. PCD-160 dtd 22.05.2025",
        entries: [
          { account: "Computer Equipment", debit: 96170, credit: 0, confidence: 91 },
          { account: "Sogo Computers", debit: 0, credit: 96170, confidence: 100 }
        ]
      };

    case "11": // Ozone Computer Services - Monitor
      return {
        ...baseEntry,
        client: "Mahat",
        invoiceNumber: "725-MAHAT LABS (1)",
        totalAmount: 16900,
        entryType: "Monitor Purchase",
        narration: "Being the monitor purchase payable to Ozone Computer Services vide invoice no. 725-MAHAT LABS (1) dtd 10.05.2025",
        entries: [
          { account: "Computer Equipment", debit: 16900, credit: 0, confidence: 99 },
          { account: "Ozone Computer Services", debit: 0, credit: 16900, confidence: 100 }
        ]
      };

    case "12": // MGEcoduties - Office Supplies
      return {
        ...baseEntry,
        client: "Mahat",
        invoiceNumber: "Mahat Labs Pvt Ltd_Invoice_309_29.05.2025",
        totalAmount: 8174,
        entryType: "Office Supplies",
        narration: "Being the office supplies payable to MGEcoduties vide invoice no. Mahat Labs Pvt Ltd_Invoice_309_29.05.2025 dtd 29.05.2025",
        entries: [
          { account: "Office Supplies", debit: 8174, credit: 0, confidence: 97 },
          { account: "MGEcoduties", debit: 0, credit: 8174, confidence: 100 }
        ]
      };

    default:
      // Fallback for unknown transactions
      return {
        ...baseEntry,
        invoiceNumber: "INV-2025-001",
        totalAmount: transaction.amount,
        entryType: "General Expense",
        narration: `Being the expense payable to ${transaction.vendor}`,
        entries: [
          { account: "General Expense", debit: transaction.amount * 0.85, credit: 0, confidence: 95 },
          { account: transaction.vendor, debit: 0, credit: transaction.amount, confidence: 100 }
        ]
      };
  }
}