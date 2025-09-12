import React, { useState, useEffect } from "react";
import { CFOInboxList } from "@/components/cfo-inbox/CFOInboxList";
import { CFOInboxDetail } from "@/components/cfo-inbox/CFOInboxDetail";
import { CFOInboxFilters } from "@/components/cfo-inbox/CFOInboxFilters";
import { CFOInboxItem, CFOInboxFilters as FiltersType } from "@/types/cfoInbox";
import { mockCFOInboxItems } from "@/data/cfoInboxData";
import { usePanelSizes } from "@/hooks/use-panel-sizes";
import { 
  Panel, 
  PanelGroup, 
  PanelResizeHandle 
} from "react-resizable-panels";
import { GripVertical, FileText } from "lucide-react";

const CFODailyInbox = () => {
  const [selectedItem, setSelectedItem] = useState<CFOInboxItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filters, setFilters] = useState<FiltersType>({
    priority: 'all',
    category: 'all',
    entity: 'all',
    owner: 'all',
    dueToday: false,
    status: 'all'
  });
  const [sortField, setSortField] = useState<'priorityScore' | 'dueTime' | 'impact' | 'newest'>('priorityScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { sizes, updateSizes } = usePanelSizes();

  // Filter and sort items
  const filteredAndSortedItems = mockCFOInboxItems
    .filter(item => {
      if (filters.priority !== 'all' && item.severity !== filters.priority) return false;
      if (filters.category !== 'all' && item.category !== filters.category) return false;
      if (filters.entity !== 'all' && item.entity !== filters.entity) return false;
      if (filters.owner !== 'all' && item.owner.suggested !== filters.owner) return false;
      if (filters.dueToday && item.urgency.dueInDays > 0) return false;
      if (filters.status !== 'all' && item.status !== filters.status) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'priorityScore':
          comparison = a.priorityScore - b.priorityScore;
          break;
        case 'dueTime':
          comparison = a.urgency.dueInDays - b.urgency.dueInDays;
          break;
        case 'impact':
          comparison = Math.abs(a.impact.amount) - Math.abs(b.impact.amount);
          break;
        case 'newest':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const handleItemSelect = (item: CFOInboxItem) => {
    setSelectedItem(item);
  };

  const handleItemToggle = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };



  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on items:`, selectedItems);
    // In a real app, this would perform the action on selected items
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-mobius-gray-50">
      {/* Filters with Date */}
      <div className="bg-white border-b border-mobius-gray-100 px-6 py-3">
        <div className="flex items-center justify-between">
          <CFOInboxFilters 
            filters={filters}
            onFiltersChange={setFilters}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={(field, direction) => {
              setSortField(field);
              setSortDirection(direction);
            }}
          />
          <p className="text-sm text-mobius-gray-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Main Content - Two Pane Layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <PanelGroup 
          direction="horizontal" 
          className="h-full"
          onLayout={(panelSizes) => {
            if (panelSizes.length >= 2) {
              updateSizes({
                ...sizes,
                inbox: panelSizes[0],
                detail: panelSizes[1]
              });
            }
          }}
        >
          {/* Left Pane - Inbox List */}
          <Panel defaultSize={50} minSize={25} maxSize={60} className="min-h-0">
            <div className="h-full flex flex-col border-r border-mobius-gray-100 bg-white">
              <div className="flex-1 overflow-y-auto">
                <CFOInboxList
                  items={filteredAndSortedItems}
                  selectedItem={selectedItem}
                  selectedItems={selectedItems}
                  onItemSelect={handleItemSelect}
                  onItemToggle={handleItemToggle}
                  onBulkAction={handleBulkAction}
                />
              </div>
            </div>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-1 bg-mobius-gray-100 hover:bg-mobius-gray-200 transition-colors group">
            <div className="flex items-center justify-center h-full">
              <GripVertical className="w-3 h-3 text-mobius-gray-400 group-hover:text-mobius-gray-600" />
            </div>
          </PanelResizeHandle>

          {/* Right Pane - Detail View */}
          <Panel defaultSize={50} minSize={35} maxSize={75} className="min-h-0">
            <div className="h-full flex flex-col bg-white">
              <div className="flex-1 overflow-y-auto">
                {selectedItem ? (
                  <CFOInboxDetail 
                    item={selectedItem}
                    onAction={(action, itemId) => {
                      console.log(`Action: ${action} on item: ${itemId}`);
                      // In a real app, this would execute the action
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-16 h-16 bg-mobius-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-mobius-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-mobius-gray-900 mb-2">Select an Item</h3>
                    <p className="text-mobius-gray-600 max-w-md">
                      Click on any item in the inbox to see detailed information, recommendations, and take action.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default CFODailyInbox;
