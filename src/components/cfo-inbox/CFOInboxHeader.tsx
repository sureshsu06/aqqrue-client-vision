import React from "react";
import { Button } from "@/components/ui/button";
import { CFOInboxStats } from "@/types/cfoInbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { RefreshCw, CheckCircle2, Calendar, AlertTriangle, Clock, TrendingUp, MoreHorizontal } from "lucide-react";

interface CFOInboxHeaderProps {
  stats: CFOInboxStats;
  onRefresh: () => void;
  onMarkAllRead: () => void;
}

export function CFOInboxHeader({ stats, onRefresh, onMarkAllRead }: CFOInboxHeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex items-center justify-between">
      {/* Left side - Date and Stats */}
      <div className="flex items-center space-x-6">
        <div>
          <p className="text-base font-semibold text-mobius-gray-900">{currentDate}</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-mobius-gray-700">{stats.highPriority} High Priority</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-mobius-gray-700">{stats.new} New</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-mobius-gray-700">{stats.dueToday} Due Today</span>
          </div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="h-9 px-3 text-sm text-mobius-gray-600 hover:text-mobius-gray-900 hover:bg-mobius-gray-100"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-sm text-mobius-gray-600 hover:text-mobius-gray-900 hover:bg-mobius-gray-100"
            >
              <MoreHorizontal className="w-4 h-4 mr-2" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onMarkAllRead}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark All Read
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Calendar className="w-4 h-4 mr-2" />
              Export to Calendar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
