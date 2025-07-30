import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  Edit3, 
  Eye, 
  X, 
  ArrowLeft,
  Calendar,
  Building,
  FileText,
  TrendingUp,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewInterfaceProps {
  transaction: any;
  onClose: () => void;
}

export function ReviewInterface({ transaction, onClose }: ReviewInterfaceProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [confidence] = useState(transaction.confidence || 95);

  // Mock journal entry data
  const journalEntry = {
    vendor: transaction.vendor,
    amount: transaction.amount,
    date: transaction.date,
    invoiceNumber: transaction.vendor === "WeWork" ? "SEA-BVU-2024-07-1892" : "INV-2024-0789",
    debitAccount: transaction.vendor === "WeWork" ? "6200 - Rent Expense" : "6100 - Software Expense",
    creditAccount: transaction.source === "email" ? "2100 - Accounts Payable" : "2210 - Credit Card Payable",
    client: transaction.client,
    isRecurring: transaction.isRecurring,
    isBillable: true,
    costCenter: "US Operations"
  };

  const analysisSteps = [
    {
      step: 1,
      title: "Vendor Identification",
      status: "complete",
      details: `Extracted: "${transaction.vendor}"`,
      subDetails: `Matched to existing vendor (${transaction.vendor === "WeWork" ? "23" : "12"} previous bills)`,
      confidence: 100
    },
    {
      step: 2,
      title: "Recurring Pattern Detected",
      status: transaction.isRecurring ? "complete" : "skip",
      details: transaction.isRecurring ? "Monthly bill on 1st of each month" : "No pattern detected",
      subDetails: transaction.isRecurring ? "Amount consistent for past 3 months" : "",
      confidence: transaction.isRecurring ? 100 : 0
    },
    {
      step: 3,
      title: "Amount Extraction",
      status: "complete",
      details: `Total: $${transaction.amount.toLocaleString()}`,
      subDetails: transaction.vendor === "Vanta Inc" ? "Multi-period expense detected" : "Single period expense",
      confidence: 100
    },
    {
      step: 4,
      title: "Client Attribution",
      status: "complete",
      details: `Assigned to ${transaction.client}`,
      subDetails: "100% billable to client",
      confidence: 100
    },
    {
      step: 5,
      title: "Categorization",
      status: "complete",
      details: `Account: ${journalEntry.debitAccount}`,
      subDetails: "Confidence: 100%",
      confidence: confidence
    }
  ];

  const prepaidBreakdown = transaction.vendor === "Vanta Inc" ? {
    lineItems: [
      {
        name: "SOC2 Monitoring",
        amount: 950,
        period: "Aug 1 - Oct 31, 2024",
        months: 3,
        monthly: 316.67
      },
      {
        name: "Full Compliance Suite", 
        amount: 4600,
        period: "Aug 1, 2024 - Jul 31, 2025",
        months: 12,
        monthly: 383.33
      }
    ],
    schedule: [
      { month: "Aug-Oct 2024", amount: 700.00 },
      { month: "Nov 2024-Jul 2025", amount: 383.33 }
    ]
  } : null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-mobius-lg max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-mobius-gray-100">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold text-mobius-gray-900">
                Review Transaction
              </h2>
              <p className="text-sm text-mobius-gray-500">
                {transaction.vendor} • ${transaction.amount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge 
              variant="outline" 
              className={cn(
                "flex items-center space-x-1",
                confidence >= 95 
                  ? "bg-status-done/10 text-status-done border-status-done/20"
                  : confidence >= 85
                  ? "bg-status-review/10 text-status-review border-status-review/20"
                  : "bg-status-pending/10 text-status-pending border-status-pending/20"
              )}
            >
              <span>Confidence: {confidence}%</span>
            </Badge>
            {transaction.isDuplicate && (
              <Badge variant="destructive">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Duplicate Detected
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-8rem)]">
          {/* Left Panel - Document */}
          <div className="w-1/2 p-6 border-r border-mobius-gray-100 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-mobius-gray-500">
                <FileText className="w-4 h-4" />
                <span>Original Document</span>
              </div>
              
              <Card className="p-6 bg-gradient-card">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{transaction.vendor}</h3>
                      <p className="text-mobius-gray-500">Invoice #{journalEntry.invoiceNumber}</p>
                    </div>
                    <Badge variant="outline">
                      {transaction.source.toUpperCase()}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-mobius-gray-500">Bill To:</p>
                      <p className="font-medium">{transaction.client}</p>
                    </div>
                    <div>
                      <p className="text-mobius-gray-500">Date:</p>
                      <p className="font-medium">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Description:</span>
                      <span className="font-medium">{transaction.description}</span>
                    </div>
                    {prepaidBreakdown && (
                      <div className="space-y-2 text-sm">
                        {prepaidBreakdown.lineItems.map((item, index) => (
                          <div key={index} className="flex justify-between p-2 bg-mobius-gray-50 rounded">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-mobius-gray-500">{item.period}</p>
                            </div>
                            <span className="font-medium">${item.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                      <span>Total Amount:</span>
                      <span>${transaction.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Panel - Analysis */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <Tabs defaultValue="entry" className="h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="entry">Journal Entry</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                {prepaidBreakdown && <TabsTrigger value="prepaid">Prepaid</TabsTrigger>}
              </TabsList>

              <TabsContent value="entry" className="space-y-4 mt-4">
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Recommended Journal Entry</h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
                          <Eye className="w-4 h-4 mr-1" />
                          {showDetails ? "Hide" : "Show"} Details
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-mobius-gray-500">Vendor:</p>
                          <p className="font-medium">{journalEntry.vendor}</p>
                        </div>
                        <div>
                          <p className="text-mobius-gray-500">Amount:</p>
                          <p className="font-medium">${journalEntry.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-mobius-gray-500">Date:</p>
                          <p className="font-medium">{new Date(journalEntry.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-mobius-gray-500">Client:</p>
                          <p className="font-medium">{journalEntry.client}</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Debit:</span>
                          <span className="text-mobius-gray-500">${journalEntry.amount.toLocaleString()}</span>
                        </div>
                        <div className="pl-4 text-sm text-mobius-gray-600">
                          {journalEntry.debitAccount}
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-medium">Credit:</span>
                          <span className="text-mobius-gray-500">${journalEntry.amount.toLocaleString()}</span>
                        </div>
                        <div className="pl-4 text-sm text-mobius-gray-600">
                          {journalEntry.creditAccount}
                        </div>
                      </div>

                      {showDetails && (
                        <>
                          <Separator />
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-mobius-gray-500">Invoice #:</span>
                              <span>{journalEntry.invoiceNumber} {journalEntry.isBillable && "(Billable)"}</span>
                            </div>
                            {journalEntry.isRecurring && (
                              <div className="flex justify-between">
                                <span className="text-mobius-gray-500">Recurring:</span>
                                <span className="flex items-center">
                                  <RotateCcw className="w-3 h-3 mr-1" />
                                  Monthly on 1st
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-mobius-gray-500">Cost Center:</span>
                              <span>{journalEntry.costCenter}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    How Mobius processed this bill:
                  </h3>
                  
                  {analysisSteps.map((step) => (
                    <Card key={step.step} className="p-4">
                      <div className="flex items-start space-x-3">
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
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">
                              Step {step.step}: {step.title}
                            </h4>
                            {step.status === "complete" && (
                              <Badge variant="outline" className="bg-status-done/10 text-status-done border-status-done/20 text-xs">
                                {step.confidence}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-mobius-gray-600 mt-1">
                            {step.details}
                          </p>
                          {step.subDetails && (
                            <p className="text-xs text-mobius-gray-500 mt-1">
                              {step.subDetails}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {prepaidBreakdown && (
                <TabsContent value="prepaid" className="space-y-4 mt-4">
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Prepaid Expense Calculation</h3>
                    
                    <div className="space-y-4">
                      {prepaidBreakdown.lineItems.map((item, index) => (
                        <div key={index} className="p-4 bg-mobius-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{item.name}</h4>
                            <span className="font-semibold">${item.amount.toLocaleString()}</span>
                          </div>
                          <div className="text-sm text-mobius-gray-600 space-y-1">
                            <p>Period: {item.period} ({item.months} months)</p>
                            <p>Monthly: ${item.amount} ÷ {item.months} = ${item.monthly.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-3">Monthly Expense Schedule</h4>
                        {prepaidBreakdown.schedule.map((item, index) => (
                          <div key={index} className="flex justify-between py-2 border-b border-mobius-gray-100 last:border-0">
                            <span className="text-sm">{item.month}</span>
                            <span className="font-medium">${item.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-mobius-gray-100">
          <div className="flex items-center space-x-4">
            {transaction.isDuplicate && (
              <div className="flex items-center space-x-2 text-sm text-destructive">
                <AlertTriangle className="w-4 h-4" />
                <span>Duplicate detected - recommend deletion</span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button variant="outline">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Entry
            </Button>
            <Button className="bg-status-done hover:bg-status-done/90">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Entry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}