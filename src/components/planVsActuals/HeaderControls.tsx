import { BudgetVersion, Entity } from '@/types/planVsActuals';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, MessageSquare, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderControlsProps {
  budgetVersions: BudgetVersion[];
  entities: Entity[];
  selectedBudgetVersion: BudgetVersion;
  selectedEntity: Entity;
  onBudgetVersionChange: (version: BudgetVersion) => void;
  onEntityChange: (entity: Entity) => void;
  onExport: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
}

export const HeaderControls = ({
  budgetVersions,
  entities,
  selectedBudgetVersion,
  selectedEntity,
  onBudgetVersionChange,
  onEntityChange,
  onExport,
  onToggleChat,
  isChatOpen
}: HeaderControlsProps) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2 py-0 px-2 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Budget Version Selector */}
          <div className="flex flex-col space-y-1">

            <Select
              value={selectedBudgetVersion.id}
              onValueChange={(value) => {
                const version = budgetVersions.find(v => v.id === value);
                if (version) onBudgetVersionChange(version);
              }}
            >
                          <SelectTrigger className="w-[180px] h-10 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-normal text-gray-900">{selectedBudgetVersion.name}</span>
              </div>
            </SelectTrigger>
              <SelectContent>
                {budgetVersions.map((version) => (
                  <SelectItem key={version.id} value={version.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{version.name}</span>
                      <span className="text-xs text-gray-500">{version.type}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Entity Selector */}
          <div className="flex flex-col space-y-1">

            <Select
              value={selectedEntity.id}
              onValueChange={(value) => {
                const entity = entities.find(e => e.id === value);
                if (entity) onEntityChange(entity);
              }}
            >
                          <SelectTrigger className="w-[160px] h-10 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-normal text-gray-900">{selectedEntity.name}</span>
              </div>
            </SelectTrigger>
              <SelectContent>
                {entities.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{entity.name}</span>
                      <span className="text-xs text-gray-500">{entity.code}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
                      </Select>
        </div>


      </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={onExport}
            size="sm"
            className="h-9 w-9 p-0 hover:bg-gray-100"
            title="Export Report"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            onClick={onToggleChat}
            size="sm"
            className="h-9 w-9 p-0 hover:bg-gray-100"
            title={isChatOpen ? 'Close Chat' : 'Open Chat'}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Separator */}
      <div className="border-b border-gray-200 mb-8"></div>
    </>
  );
};
