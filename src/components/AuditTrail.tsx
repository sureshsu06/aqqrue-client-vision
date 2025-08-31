import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Eye,
  Undo2,
  ExternalLink,
  FileText,
  ArrowLeft
} from "lucide-react";
import { ChartAccount } from "@/lib/chartOfAccounts";

interface AuditTrailProps {
  selectedAccount: ChartAccount | null;
  onBack: () => void;
}

interface AuditEvent {
  id: string;
  status: "extract" | "classification" | "gst" | "tds" | "override" | "push";
  label: string;
  actor: string;
  description: string;
  timestamp: string;
  rule?: string;
  action?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };
}

export default function AuditTrail({ selectedAccount, onBack }: AuditTrailProps) {
  // Mock audit trail data for the selected journal entry
  const getAuditTrail = (): AuditEvent[] => {
    return [
      {
        id: "1",
        status: "extract",
        label: "Extract",
        actor: "AI",
        description: "Parsed ₹12,000 from bill.pdf p2",
        timestamp: "21 Jul 25 14:12",
        action: {
          label: "View doc",
          icon: <Eye className="w-4 h-4" />,
          onClick: () => console.log("View document")
        }
      },
      {
        id: "2",
        status: "classification",
        label: "Classification",
        actor: "AI",
        description: "Classified as Operating Expense (Confidence: 92%)",
        timestamp: "21 Jul 25 14:12",
        rule: "Rule #OPEX-T2"
      },
      {
        id: "3",
        status: "gst",
        label: "GST",
        actor: "AI",
        description: "Applied 18% input IGST",
        timestamp: "21 Jul 25 14:12",
        rule: "Rule #GST-A5"
      },
      {
        id: "4",
        status: "tds",
        label: "TDS",
        actor: "AI",
        description: "TDS not applicable - below threshold",
        timestamp: "21 Jul 25 14:13",
        rule: "Rule #TDS-T1"
      },
      {
        id: "5",
        status: "override",
        label: "Override",
        actor: "Raj (Accountant)",
        description: "Changed Ledger 5103 → 6101 (Transportation)",
        timestamp: "21 Jul 25 14:18",
        action: {
          label: "Undo",
          icon: <Undo2 className="w-4 h-4" />,
          onClick: () => console.log("Undo override")
        }
      },
      {
        id: "6",
        status: "push",
        label: "Push",
        actor: "AI → ERP",
        description: "Draft JE #JE-3412 created",
        timestamp: "21 Jul 25 14:19",
        action: {
          label: "Open in ERP",
          icon: <ExternalLink className="w-4 h-4" />,
          onClick: () => console.log("Open in ERP")
        }
      }
    ];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "extract":
      case "classification":
      case "gst":
      case "tds":
        return "bg-blue-500";
      case "override":
        return "bg-orange-500";
      case "push":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getActorColor = (status: string) => {
    if (status === "override") {
      return "text-orange-600";
    }
    return "text-mobius-gray-700";
  };

  const auditEvents = getAuditTrail();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-mobius-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="text-mobius-gray-600 hover:text-mobius-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-l font-semibold text-mobius-gray-900">
                Audit Trail - JE-3412
              </h1>
              <p className="text-sm text-mobius-gray-500 mt-1">
                ACME Logistics • ₹12,000 • Transportation charges
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white">
          {/* Table Header */}
          <div className="bg-blue-50 py-3 px-4 border-b border-blue-200">
            <div className="grid grid-cols-6 gap-4 text-sm font-medium text-blue-900">
              <div>Timestamp</div>
              <div>Activity</div>
              <div>Actor</div>
              <div className="col-span-2">Description</div>
              <div className="text-center">Reference</div>
            </div>
            <div className="grid grid-cols-6 gap-4 text-xs text-blue-600 mt-1">
              <div></div>
              <div></div>
              <div></div>
              <div className="col-span-2"></div>
              <div></div>
            </div>
          </div>
          
          <div>
            {auditEvents.map((event) => (
              <div 
                key={event.id} 
                className="grid grid-cols-6 gap-4 py-2 px-4 transition-colors border-b border-gray-100 bg-white hover:bg-gray-50"
              >
                {/* Timestamp */}
                <div className="text-sm text-mobius-gray-600">
                  {event.timestamp}
                </div>
                
                {/* Activity */}
                <div className="text-sm">
                  <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                    {event.label}
                  </Badge>
                </div>
                
                {/* Actor */}
                <div className="text-sm">
                  <span className={`font-medium ${getActorColor(event.status)}`}>
                    {event.actor}
                  </span>
                </div>
                
                {/* Description */}
                <div className="col-span-2">
                  <div className="text-sm text-mobius-gray-900 mb-1">
                    {event.description}
                  </div>
                  {event.rule && (
                    <span className="text-xs text-mobius-gray-500 font-mono">
                      {event.rule}
                    </span>
                  )}
                </div>
                
                {/* Reference */}
                <div className="text-sm text-center">
                  {event.action ? (
                    <div className="flex justify-center">
                      <ExternalLink className="w-4 h-4 text-mobius-gray-600 cursor-pointer hover:text-mobius-gray-900" onClick={event.action.onClick} />
                    </div>
                  ) : (
                    <span className="text-mobius-gray-400">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 