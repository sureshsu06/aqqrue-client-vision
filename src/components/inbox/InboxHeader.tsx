import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, Upload, Square, CheckSquare } from "lucide-react";

interface InboxHeaderProps {
  unreadCount: number;
  totalCount: number;
  doneCount: number;
  selectedFilter: string;
  selectedStatus: string;
  selectedStatusOption: string;
  onFilterChange: (filter: string) => void;
  onStatusChange: (status: string) => void;
  onStatusOptionChange: (statusOption: string) => void;
  onSelectAllVisible: () => void;
  allVisibleSelected: boolean;
}

export function InboxHeader({ 
  unreadCount, 
  totalCount, 
  doneCount, 
  selectedFilter,
  selectedStatus,
  selectedStatusOption,
  onFilterChange,
  onStatusChange,
  onStatusOptionChange,
  onSelectAllVisible,
  allVisibleSelected
}: InboxHeaderProps) {
  const progressPercent = Math.round((doneCount / totalCount) * 100);

  return (
    <div className="border-b border-mobius-gray-100 bg-white">
      {/* Single toolbar with everything */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-1">
          {/* Select All Visible Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-8 w-8 p-0 rounded-xl ${
                    allVisibleSelected 
                      ? "bg-mobius-blue hover:bg-mobius-blue/90" 
                      : "hover:bg-mobius-gray-100"
                  }`}
                  onClick={onSelectAllVisible}
                >
                  {allVisibleSelected ? (
                    <CheckSquare className="w-4 h-4 text-white" />
                  ) : (
                    <Square className="w-4 h-4 text-mobius-gray-600" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select All</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="w-px h-6 bg-mobius-gray-100 mx-2" />

          {/* Status Selection Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-mobius-gray-100 rounded">
                <Filter className="w-4 h-4 text-mobius-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem 
                onClick={() => onStatusOptionChange("All")}
                className={selectedStatusOption === "All" ? "bg-mobius-gray-100" : ""}
              >
                <span>All</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusOptionChange("Unread")}
                className={selectedStatusOption === "Unread" ? "bg-mobius-gray-100" : ""}
              >
                <span>Unread</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusOptionChange("Posted")}
                className={selectedStatusOption === "Posted" ? "bg-mobius-gray-100" : ""}
              >
                <span>Posted</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusOptionChange("In Progress")}
                className={selectedStatusOption === "In Progress" ? "bg-mobius-gray-100" : ""}
              >
                <span>In Progress</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-6 bg-mobius-gray-100 mx-2" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-mobius-gray-100 rounded"
                >
                  <Upload className="w-4 h-4 text-mobius-gray-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        
        </div>
      </div>

  );
}