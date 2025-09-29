import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronRight, Settings } from "lucide-react";
import { WorkflowCanvas } from "./WorkflowCanvas";

interface Workflow {
  id: string;
  name: string;
  category: string;
  isExpanded: boolean;
  subWorkflows: string[];
}

export const PlaygroundTab = () => {
  const [showChat, setShowChat] = useState(false);
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "order-to-cash",
      name: "Order-to-Cash",
      category: "Order-to-Cash",
      isExpanded: true,
      subWorkflows: [
        "Shopify → Uniware Reconciliation",
        "Prepaid Payment Reconciliation",
        "COD Reconciliation"
      ]
    },
    {
      id: "procure-to-pay",
      name: "Procure-to-Pay",
      category: "Procure-to-Pay",
      isExpanded: false,
      subWorkflows: [
        "Corporate Card Posting",
        "Vendor Invoice Approval"
      ]
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("order-to-cash");

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => 
      prev.map(workflow => 
        workflow.id === workflowId 
          ? { ...workflow, isExpanded: !workflow.isExpanded }
          : { ...workflow, isExpanded: false }
      )
    );
  };

  const selectWorkflow = (workflowId: string) => {
    setSelectedWorkflow(workflowId);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      {/* Top Row - Workflows */}
      <div className="bg-white border-b border-[var(--border)] p-2">
        <div className="space-y-3">
          {/* Main Categories Row */}
          <div className="flex flex-wrap gap-2">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-[var(--primary-weak)] cursor-pointer group transition-colors min-w-[200px]"
                onClick={() => toggleWorkflow(workflow.id)}
              >
                <span className="text-[14px] font-medium text-[var(--text)]">{workflow.name}</span>
                <ChevronRight 
                  className={`h-3 w-3 text-[var(--muted)] transition-transform ${
                    workflow.isExpanded ? 'rotate-90' : ''
                  }`} 
                />
              </div>
            ))}
          </div>
          
          {/* Sub-workflows Row */}
          <div className="flex flex-wrap gap-2">
            {workflows.map((workflow) => (
              workflow.isExpanded && workflow.subWorkflows.map((subWorkflow, index) => (
                <div
                  key={`${workflow.id}-${index}`}
                  className={`p-1.5 rounded-md cursor-pointer transition-colors min-w-[200px] ${
                    selectedWorkflow === `${workflow.id}-${index}`
                      ? 'bg-[var(--primary-weak)] text-[var(--primary)] border border-[var(--primary)]/20'
                      : 'hover:bg-[var(--primary-weak)] text-[var(--text)]'
                  }`}
                  onClick={() => selectWorkflow(`${workflow.id}-${index}`)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px]">{subWorkflow}</span>
                    <Settings className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas Area - Full Width */}
      <div className="flex-1 relative">
        <WorkflowCanvas selectedWorkflow={selectedWorkflow} showChat={showChat} setShowChat={setShowChat} />
        
        {/* Chat Button - Fixed Position */}
        <div className="absolute bottom-6 right-6">
          <Button 
            onClick={() => setShowChat(!showChat)}
            className="rounded-full h-12 w-12 bg-[var(--primary)] hover:bg-[var(--primary)]/90 shadow-md hover:shadow-lg transition-all duration-200"
            size="icon"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};