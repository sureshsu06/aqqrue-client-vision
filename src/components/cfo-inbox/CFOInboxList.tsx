import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CFOInboxItem } from "@/types/cfoInbox";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  UserCheck,
  Pause,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Building2,
  ExternalLink
} from "lucide-react";

interface CFOInboxListProps {
  items: CFOInboxItem[];
  selectedItem: CFOInboxItem | null;
  selectedItems: string[];
  onItemSelect: (item: CFOInboxItem) => void;
  onItemToggle: (itemId: string, checked: boolean) => void;
  onBulkAction: (action: string) => void;
}

export function CFOInboxList({ 
  items, 
  selectedItem,
  selectedItems,
  onItemSelect,
  onItemToggle,
  onBulkAction
}: CFOInboxListProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': 
        return (
          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-green-100 border border-green-200">
            <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
          </div>
        );
      case 'in_progress': 
        return (
          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 border border-blue-200">
            <Clock className="w-2.5 h-2.5 text-blue-600" />
          </div>
        );
      case 'blocked': 
        return (
          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-red-100 border border-red-200">
            <AlertTriangle className="w-2.5 h-2.5 text-red-600" />
          </div>
        );
      case 'snoozed': 
        return (
          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 border border-gray-200">
            <Clock className="w-2.5 h-2.5 text-gray-600" />
          </div>
        );
      default: // new
        return (
          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 border border-blue-200">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
          </div>
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ARR': 
        return (
          <img 
            src="/logos/data-sources/Stripe_Logo,_revised_2016.svg.png" 
            alt="Stripe" 
            className="w-5 h-5 object-contain"
          />
        );
      case 'Cash': 
        return (
          <img 
            src="/logos/brex.png" 
            alt="Brex" 
            className="w-5 h-5 object-contain"
          />
        );
      case 'Spend': 
        return (
          <img 
            src="/logos/data-sources/Amazon_Web_Services_Logo.svg.png" 
            alt="AWS" 
            className="w-5 h-5 object-contain"
          />
        );
      case 'People': 
        return (
          <img 
            src="/logos/data-sources/rippling.jpg" 
            alt="Rippling" 
            className="w-5 h-5 object-contain"
          />
        );
      case 'Close': 
        return (
          <img 
            src="/logos/sharepoint-logo.png" 
            alt="SharePoint" 
            className="w-5 h-5 object-contain"
          />
        );
      case 'Ops': 
        return (
          <img 
            src="/logos/data-sources/4844517.png" 
            alt="Ops" 
            className="w-5 h-5 object-contain"
          />
        );
      default: 
        return (
          <img 
            src="/logos/hubspot-logo-png_seeklogo-506857.png" 
            alt="HubSpot" 
            className="w-5 h-5 object-contain"
          />
        );
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const absAmount = Math.abs(amount);
    const prefix = amount < 0 ? '-' : '+';
    return `${prefix}${currency === 'USD' ? '$' : '₹'}${absAmount.toLocaleString()}`;
  };

  const formatDueTime = (dueInDays: number, isOverdue: boolean) => {
    if (isOverdue) return 'Overdue';
    if (dueInDays === 0) return 'Due today';
    if (dueInDays === 1) return 'Due tomorrow';
    if (dueInDays <= 7) return `Due in ${dueInDays}d`;
    if (dueInDays <= 30) return `Due in ${Math.ceil(dueInDays / 7)}w`;
    return `Due in ${Math.ceil(dueInDays / 30)}m`;
  };

  const getDueTimeBucket = (dueInDays: number, isOverdue: boolean) => {
    if (isOverdue) return 'Overdue';
    if (dueInDays === 0) return 'Due Today';
    if (dueInDays <= 7) return 'This Week';
    if (dueInDays <= 30) return 'Next 30 Days';
    return 'Future';
  };

  const groupItemsByDueTime = (items: CFOInboxItem[]) => {
    const groups: { [key: string]: CFOInboxItem[] } = {
      'Overdue': [],
      'Due Today': [],
      'This Week': [],
      'Next 30 Days': [],
      'Future': []
    };

    items.forEach(item => {
      const bucket = getDueTimeBucket(item.urgency.dueInDays, item.urgency.isOverdue);
      groups[bucket].push(item);
    });

    return groups;
  };

  return (
    <div className="bg-white h-full flex flex-col overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <div className="bg-mobius-blue/5 border-b border-mobius-gray-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-mobius-gray-700">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBulkAction('assign')}
              className="h-8 px-3 text-xs"
            >
              <UserCheck className="w-3 h-3 mr-1" />
              Assign
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBulkAction('snooze')}
              className="h-8 px-3 text-xs"
            >
              <Pause className="w-3 h-3 mr-1" />
              Snooze
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBulkAction('done')}
              className="h-8 px-3 text-xs"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Mark Done
            </Button>
          </div>
        </div>
      )}

      {/* Inbox Items - Grouped by Due Time */}
      <div className="flex-1 overflow-y-auto">
        {(() => {
          const groupedItems = groupItemsByDueTime(items);
          return Object.entries(groupedItems).map(([bucket, bucketItems]) => {
            if (bucketItems.length === 0) return null;
            
            return (
              <div key={bucket}>
                {/* Section Header */}
                <div className="sticky top-0 bg-white z-10 px-4 py-2 border-b border-mobius-gray-100">
                  <h3 className={cn(
                    "text-xs font-semibold uppercase tracking-wide",
                    bucket === 'Overdue' ? 'text-red-600' :
                    bucket === 'Due Today' ? 'text-amber-600' :
                    bucket === 'This Week' ? 'text-blue-600' :
                    'text-mobius-gray-500'
                  )}>
                    {bucket} ({bucketItems.length})
                  </h3>
                </div>
                
                {/* Items in this bucket */}
                <div className="divide-y divide-mobius-gray-100">
                  {bucketItems.map((item) => (
                              <div
            key={item.id}
            className={cn(
              "p-3 transition-colors cursor-pointer relative bg-white",
              selectedItem?.id === item.id ? "bg-mobius-blue/10" : "hover:bg-mobius-gray-50"
            )}
            onClick={() => onItemSelect(item)}
            onMouseEnter={() => setHoveredRow(item.id)}
            onMouseLeave={() => setHoveredRow(null)}
          >
                                  <div className="flex items-start space-x-3">
              <div className="pt-1">
                <Checkbox 
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) => onItemToggle(item.id, !!checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              {/* Category Icon */}
              <div className="flex flex-col items-center space-y-1">
                {/* Category Icon */}
                {getCategoryIcon(item.category)}
              </div>

                        <div className="flex-1 min-w-0">
                          {/* First line: Bold Title */}
                          <div className="flex items-start justify-between">
                            <h3 className={cn(
                              "text-xs font-semibold leading-tight",
                              item.status === "new" ? "text-mobius-gray-900" : "text-mobius-gray-700"
                            )}>
                              {item.title}
                            </h3>
                            
                            <div className="flex items-center space-x-1">
                              {/* Quick Actions - show on hover */}
                              {hoveredRow === item.id && (
                                <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0"
                                    title="Mark resolved"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0"
                                    title="Open in source"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0"
                                    title="Pin/Snooze"
                                  >
                                    <Pause className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Second line: Executive Summary */}
                          <div className="mt-1.5">
                            <p className="text-xs text-mobius-gray-600 leading-relaxed">
                              {item.impact.direction === "negative" ? "Risk" : "Opportunity"}: {formatCurrency(item.impact.amount, item.impact.currency)} {item.impact.metric.toLowerCase()} • {formatDueTime(item.urgency.dueInDays, item.urgency.isOverdue)} • {Math.round(item.confidence * 100)}% confidence
                            </p>
                          </div>

                          {/* Third line: Context and Metadata */}
                          <div className="mt-1.5 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-xs text-mobius-gray-600">
                                {item.entity}
                              </span>
                              <span className="text-xs text-mobius-gray-600">
                                {item.owner.suggested.split('@')[0]}
                              </span>
                              {/* Trend Arrow for variances */}
                              {(item.title.includes('spike') || item.title.includes('variance') || item.title.includes('+') || item.title.includes('-')) && (
                                <span className="text-xs text-mobius-gray-500">
                                  {item.title.includes('+') ? '⬆️' : item.title.includes('-') ? '⬇️' : '➡️'}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-mobius-gray-500 bg-mobius-gray-100 px-2 py-1 rounded">
                                {item.sources[0]?.lastUpdated || item.dataFreshness}
                              </span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          });
        })()}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="w-16 h-16 bg-mobius-gray-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-mobius-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-mobius-gray-900 mb-2">All Clear!</h3>
          <p className="text-mobius-gray-600 max-w-md">
            No items match your current filters. Try adjusting your filters or check back later for new items.
          </p>
        </div>
      )}
    </div>
  );
}
