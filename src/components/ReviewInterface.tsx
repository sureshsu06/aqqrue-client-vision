import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  Edit3, 
  Eye, 
  X, 
  ArrowLeft,
  AlertTriangle,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DocumentViewer } from "./review/DocumentViewer";
import { JournalEntryPanel } from "./review/JournalEntryPanel";
import { AnalysisPanel } from "./review/AnalysisPanel";
import { PrepaidPanel } from "./review/PrepaidPanel";
import { useToast } from "@/hooks/use-toast";

interface ReviewInterfaceProps {
  transaction: any;
  onClose: () => void;
}

export function ReviewInterface({ transaction, onClose }: ReviewInterfaceProps) {
  const confidence = transaction.confidence || 95;
  const { toast } = useToast();

  const isVanta = transaction.vendor === "Vanta Inc";

  const handleApprove = () => {
    toast({
      title: "Transaction approved",
      description: "Posted to QuickBooks • JE# QB-000192"
    });
    onClose();
  };

  const handleEdit = () => {
    toast({
      title: "Editing transaction",
      description: "Opening edit mode for journal entry"
    });
  };

  const handleSeeHow = () => {
    // This would open the analysis panel or switch to analysis tab
    toast({
      title: "Analysis view",
      description: "Showing how Mobius processed this transaction"
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-mobius-lg max-w-7xl w-full h-[90vh] flex flex-col overflow-hidden">
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
                {transaction.vendor} • ₹{transaction.amount.toLocaleString()}
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
        <div className="flex flex-1 min-h-0">
          {/* Left Panel - Document Viewer */}
          <DocumentViewer transaction={transaction} />

          {/* Right Panel - Analysis */}
          <div className="w-1/2 p-6 overflow-y-auto flex-shrink-0">
            <Tabs defaultValue="entry" className="h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="entry">Journal Entry</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                {isVanta && <TabsTrigger value="prepaid">Prepaid</TabsTrigger>}
              </TabsList>

              <TabsContent value="entry" className="space-y-4 mt-4">
                <JournalEntryPanel 
                  transaction={transaction}
                  onEdit={handleEdit}
                  onAssignToController={() => {
                    toast({
                      title: "Assigned to Controller",
                      description: "Transaction has been forwarded to the controller for review"
                    });
                  }}
                />
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4 mt-4">
                <AnalysisPanel transaction={transaction} />
              </TabsContent>

              {isVanta && (
                <TabsContent value="prepaid" className="space-y-4 mt-4">
                  <PrepaidPanel transaction={transaction} />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex items-center justify-between p-6 border-t border-mobius-gray-100 bg-white flex-shrink-0">
          <div className="flex items-center space-x-4">
            {/* Empty space for left side */}
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={() => {
              toast({
                title: "Assigned to Controller",
                description: "Transaction has been forwarded to the controller for review"
              });
            }}>
              <UserCheck className="w-4 h-4 mr-2" />
              Assign to Controller
            </Button>
            <Button className="bg-status-done hover:bg-status-done/90" onClick={handleApprove}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve & Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}