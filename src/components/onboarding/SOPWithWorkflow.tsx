import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { MessageCircle } from "lucide-react";

interface SOPWithWorkflowProps {
  sopContent: React.ReactNode;
  workflowId?: string;
  sectionTitle: string;
  subsectionTitle: string;
}

export const SOPWithWorkflow = ({ sopContent, workflowId, sectionTitle, subsectionTitle }: SOPWithWorkflowProps) => {
  const [activeTab, setActiveTab] = useState<'sop' | 'workflow'>('sop');
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <div className="flex space-x-1">
          <Button
            variant={activeTab === 'sop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('sop')}
            className="flex-1"
          >
            SOP Content
          </Button>
          {workflowId && (
            <Button
              variant={activeTab === 'workflow' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('workflow')}
              className="flex-1"
            >
              Workflow
            </Button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative">
        {activeTab === 'sop' ? (
          <div className="space-y-4">
            {sopContent}
          </div>
        ) : (
          <div className="h-[calc(100vh-200px)]">
            <WorkflowCanvas selectedWorkflow={workflowId} showChat={showChat} setShowChat={setShowChat} />
            
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
        )}
      </div>
    </div>
  );
};
