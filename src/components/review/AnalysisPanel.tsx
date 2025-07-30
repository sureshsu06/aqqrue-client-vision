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

  const confidence = transaction.confidence || 95;

  const analysisSteps = [
    {
      step: 1,
      title: "Vendor Identification",
      status: "complete",
      details: `Extracted: "${transaction.vendor}"`,
      subDetails: `Matched to existing vendor (${transaction.vendor === "WeWork" ? "23" : "12"} previous bills)`,
      confidence: 100,
      hasOverride: true,
      hasEvidence: true
    },
    {
      step: 2,
      title: "Recurring Pattern Detection",
      status: transaction.isRecurring ? "complete" : "skip",
      details: transaction.isRecurring ? "Monthly bill on 1st of each month" : "No pattern detected",
      subDetails: transaction.isRecurring ? "Amount consistent for past 3 months" : "",
      confidence: transaction.isRecurring ? 100 : 0,
      hasAutoApproval: transaction.isRecurring,
      hasEvidence: transaction.isRecurring
    },
    {
      step: 3,
      title: "Amount Extraction",
      status: "complete",
      details: `Total: $${transaction.amount.toLocaleString()}`,
      subDetails: transaction.vendor === "Vanta Inc" ? "Multi-period expense detected" : "Single period expense",
      confidence: 100,
      hasBreakdown: transaction.vendor === "Vanta Inc"
    },
    {
      step: 4,
      title: "Client Attribution",
      status: "complete",
      details: `Assigned to ${transaction.client}`,
      subDetails: "100% billable to client",
      confidence: 100,
      hasAllocation: true
    },
    {
      step: 5,
      title: "Categorization",
      status: "complete",
      details: `Account: ${transaction.vendor === "Vanta Inc" ? "1410 - Prepaid Expenses" : transaction.vendor === "WeWork" ? "6200 - Rent Expense" : "6100 - Software Expense"}`,
      subDetails: "Rule: Monthly software subscriptions → 6100",
      confidence: confidence,
      hasEvidence: true
    }
  ];

  const handleAutoApproval = () => {
    toast({
      title: "Auto-approval enabled",
      description: "WeWork bills will auto-post at ≥99% confidence."
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
                    <Select defaultValue={transaction.vendor.toLowerCase()}>
                      <SelectTrigger className="w-36 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wework">WeWork</SelectItem>
                        <SelectItem value="aws">AWS</SelectItem>
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
                          Auto-post WeWork rent bills when confidence ≥ <strong>99%</strong>. 
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