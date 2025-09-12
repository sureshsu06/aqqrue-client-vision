import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CFOInboxItem } from "@/types/cfoInbox";
import { 
  FileText, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Clock,
  DollarSign,
  CheckCircle2,
  ExternalLink,
  Target,
  BarChart3,
  Users
} from "lucide-react";

interface CFOInboxDetailProps {
  item: CFOInboxItem;
  onAction: (action: string, itemId: string) => void;
}

export function CFOInboxDetail({ item, onAction }: CFOInboxDetailProps) {
  const formatCurrency = (amount: number, currency: string) => {
    const absAmount = Math.abs(amount);
    const prefix = amount < 0 ? '-' : '+';
    return `${prefix}${currency === 'USD' ? '$' : '₹'}${absAmount.toLocaleString()}`;
  };

  const formatDueTime = (dueInDays: number, isOverdue: boolean) => {
    if (isOverdue) return 'Overdue';
    if (dueInDays === 0) return 'Due today';
    if (dueInDays === 1) return 'Due tomorrow';
    if (dueInDays <= 7) return `${dueInDays} days`;
    if (dueInDays <= 30) return `${Math.ceil(dueInDays / 7)} weeks`;
    return `${Math.ceil(dueInDays / 30)} months`;
  };

  const getUrgencyIcon = () => {
    // Return the category-based logo same as left pane
    const getCategoryIcon = (category: string) => {
      switch (category) {
        case 'ARR': 
          return (
            <img 
              src="/logos/data-sources/Stripe_Logo,_revised_2016.svg.png" 
              alt="Stripe" 
              className="w-8 h-8 object-contain"
            />
          );
        case 'Cash': 
          return (
            <img 
              src="/logos/brex.png" 
              alt="Brex" 
              className="w-8 h-8 object-contain"
            />
          );
        case 'Spend': 
          return (
            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">$</span>
            </div>
          );
        case 'People': 
          return (
            <img 
              src="/logos/data-sources/rippling.jpg" 
              alt="Rippling" 
              className="w-8 h-8 object-contain"
            />
          );
        case 'Close': 
          return (
            <img 
              src="/logos/sharepoint-logo.png" 
              alt="SharePoint" 
              className="w-8 h-8 object-contain"
            />
          );
        case 'Ops': 
          return (
            <img 
              src="/logos/data-sources/4844517.png" 
              alt="Ops" 
              className="w-8 h-8 object-contain"
            />
          );
        default: 
          return (
            <img 
              src="/logos/hubspot-logo-png_seeklogo-506857.png" 
              alt="HubSpot" 
              className="w-8 h-8 object-contain"
            />
          );
      }
    };
    
    return getCategoryIcon(item.category);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Executive Summary Header */}
              <div className="bg-white p-6 border-b border-mobius-gray-200">
        <div className="mb-4">
          <div className="flex items-center space-x-3">
            {getUrgencyIcon()}
            <div>
              <h1 className="text-sm font-semibold text-mobius-gray-900 mb-2">
                {item.title}
              </h1>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
                <Badge 
                  variant={item.severity === 'high' ? 'destructive' : item.severity === 'medium' ? 'secondary' : 'default'}
                  className="text-xs"
                >
                  {item.severity.toUpperCase()} PRIORITY
                </Badge>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Executive Summary Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Executive Summary */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <h2 className="text-sm font-medium text-blue-900 mb-3">Executive Summary</h2>
          
          {/* Performance Overview */}
          <div className="mb-4">
            <p className="text-xs text-blue-800 leading-relaxed">
              <span className="font-medium">Situation:</span> {item.why} 
              <span className="font-medium"> Financial Impact:</span> {formatCurrency(item.impact.amount, item.impact.currency)} {item.impact.metric} 
              <span className="font-medium"> Timeline:</span> {formatDueTime(item.urgency.dueInDays, item.urgency.isOverdue)} 
              <span className="font-medium"> Confidence:</span> {Math.round(item.confidence * 100)}%
              {item.policyBreach && (
                <>
                  <span className="font-medium"> Policy Breach:</span> {'$'}{Math.abs(item.policyBreach.current - item.policyBreach.threshold).toLocaleString()} below threshold of {'$'}{item.policyBreach.threshold.toLocaleString()}
                </>
              )}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-blue-700">Data powered by {item.sources[0]?.system || 'multiple sources'}</span>
            </div>
          </div>
          
          {/* Key Insights */}
          <div className="mb-4">
            <p className="text-xs text-blue-800 leading-relaxed">
              <span className="font-medium">Key Drivers:</span> Health score decline (-18 pts), P1 bugs increase (+3), exec sponsor change. 
              <span className="font-medium"> Recommended Actions:</span> {item.recommendations[0]?.label} with {Math.round(item.recommendations[0]?.probability * 100)}% probability of {formatCurrency(item.recommendations[0]?.estimatedImpact || 0, item.impact.currency)} impact.
            </p>
          </div>
          
          {/* Aqqrue Actions */}
          <div>
            <p className="text-xs text-blue-800 leading-relaxed">
              <span className="font-medium">Aqqrue:</span> Automatically flagged this item based on threshold analysis and assigned to {item.owner.suggested.split('@')[0]}. 
              {item.urgency.isOverdue && ' Escalated due to overdue status.'}
              {item.urgency.dueInDays <= 7 && ` Scheduled for review within ${item.urgency.dueInDays} days.`}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-mobius-gray-900">Details</h2>
          <div className="bg-white border border-mobius-gray-100 rounded-lg p-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-xs text-mobius-gray-700 leading-relaxed">
                <span className="font-medium">Current Situation:</span> {item.why} This item requires immediate attention due to its {item.severity} priority level and potential impact on {item.impact.metric.toLowerCase()}.
              </p>
              
              <p className="text-xs text-mobius-gray-700 leading-relaxed mt-4">
                <span className="font-medium">Financial Impact:</span> The estimated impact is {formatCurrency(item.impact.amount, item.impact.currency)} {item.impact.metric.toLowerCase()}, with a confidence level of {Math.round(item.confidence * 100)}%. 
                {item.impact.direction === "negative" ? " This represents a potential loss that could affect cash flow and profitability." : " This represents an opportunity to improve financial performance."}
              </p>
              
              <p className="text-xs text-mobius-gray-700 leading-relaxed mt-4">
                <span className="font-medium">Timeline & Urgency:</span> {formatDueTime(item.urgency.dueInDays, item.urgency.isOverdue)}. 
                {item.urgency.isOverdue && " This item is already overdue and requires immediate escalation."}
                {item.urgency.dueInDays <= 7 && ` Action is required within ${item.urgency.dueInDays} days to prevent further issues.`}
              </p>
              
              {item.policyBreach && (
                <p className="text-xs text-mobius-gray-700 leading-relaxed mt-4">
                  <span className="font-medium">Policy Breach:</span> Current levels are ${Math.abs(item.policyBreach.current - item.policyBreach.threshold).toLocaleString()} below the established threshold of ${item.policyBreach.threshold.toLocaleString()}. This indicates a significant deviation from company policies and may require immediate corrective action.
                </p>
              )}
              
              <p className="text-xs text-mobius-gray-700 leading-relaxed mt-4">
                <span className="font-medium">Recommended Actions:</span> Based on analysis, the primary recommendation is to {item.recommendations[0]?.label.toLowerCase()}, which has a {Math.round(item.recommendations[0]?.probability * 100)}% probability of achieving {formatCurrency(item.recommendations[0]?.estimatedImpact || 0, item.impact.currency)} in impact. 
                {item.recommendations.length > 1 && ` Additional options include ${item.recommendations.slice(1).map(rec => rec.label.toLowerCase()).join(', ')}.`}
              </p>
              
              <p className="text-xs text-mobius-gray-700 leading-relaxed mt-4">
                <span className="font-medium">Next Steps:</span> This item should be assigned to {item.owner.suggested.split('@')[0]} for immediate action. Consider escalating to executive leadership if resolution is not achieved within the next 48 hours. All actions should be documented and tracked through the appropriate project management systems.
              </p>
              
              {/* Sources & Documents */}
              <div className="mt-6 pt-4 border-t border-mobius-gray-100">
                <h4 className="text-xs font-medium text-mobius-gray-900 mb-3">Sources & Documents</h4>
                <div className="space-y-2">
                  {item.sources && item.sources.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-mobius-gray-500">Data Sources:</span>
                      {item.sources.map((source, index) => (
                        <a
                          key={index}
                          href={`/systems/${source.system}`}
                          className="text-xs text-mobius-blue hover:text-mobius-blue/80 underline"
                        >
                          {source.system}
                        </a>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-mobius-gray-500">Related Documents:</span>
                    <a
                      href="/documents/contracts"
                      className="text-xs text-mobius-blue hover:text-mobius-blue/80 underline"
                    >
                      Contracts
                    </a>
                    <span className="text-xs text-mobius-gray-400">•</span>
                    <a
                      href="/documents/bills"
                      className="text-xs text-mobius-blue hover:text-mobius-blue/80 underline"
                    >
                      Invoices
                    </a>
                    <span className="text-xs text-mobius-gray-400">•</span>
                    <a
                      href="/documents/bank"
                      className="text-xs text-mobius-blue hover:text-mobius-blue/80 underline"
                    >
                      Bank Statements
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-mobius-gray-500">Project Management:</span>
                    <a
                      href="https://jira.company.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-mobius-blue hover:text-mobius-blue/80 underline"
                    >
                      Jira
                    </a>
                    <span className="text-xs text-mobius-gray-400">•</span>
                    <a
                      href="https://slack.company.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-mobius-blue hover:text-mobius-blue/80 underline"
                    >
                      Slack
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
