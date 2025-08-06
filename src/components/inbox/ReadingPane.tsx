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
import { Transaction } from "@/types/Transaction";
import { JournalEntryGenerator } from "@/lib/journalEntryGenerator";

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

  // Use the shared JournalEntryGenerator for journal entry data
  const journalEntry = JournalEntryGenerator.generateForTransaction(transaction);

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
                    <div>
                      <p className="text-mobius-gray-500">Vendor:</p>
                      <p className="font-medium">{transaction.vendor}</p>
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