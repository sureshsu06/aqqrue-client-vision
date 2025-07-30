import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Filter, Archive, UserCheck, MailOpen, Undo2, Upload, Plus } from "lucide-react";

interface InboxHeaderProps {
  unreadCount: number;
  totalCount: number;
  doneCount: number;
  role: string;
  mode: string;
  confidenceThreshold: number;
  onRoleChange: (role: string) => void;
  onModeChange: (mode: string) => void;
  onConfidenceChange: (threshold: number) => void;
}

export function InboxHeader({ 
  unreadCount, 
  totalCount, 
  doneCount, 
  role, 
  mode, 
  confidenceThreshold,
  onRoleChange,
  onModeChange,
  onConfidenceChange
}: InboxHeaderProps) {
  const progressPercent = Math.round((doneCount / totalCount) * 100);

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-mobius-gray-600">
          {doneCount} of {totalCount} done ({progressPercent}%)
        </span>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Role Switcher */}
        <Select value={role} onValueChange={onRoleChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="accountant">Accountant</SelectItem>
            <SelectItem value="controller">Controller</SelectItem>
            <SelectItem value="partner">Partner</SelectItem>
          </SelectContent>
        </Select>

        {/* Mode Switch */}
        <Select value={mode} onValueChange={onModeChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="review-all">Review All</SelectItem>
            <SelectItem value="auto-post">Auto-post high confidence</SelectItem>
          </SelectContent>
        </Select>

        {/* Confidence Threshold */}
        {mode === "auto-post" && (
          <div className="flex items-center space-x-2">
            <Select value={confidenceThreshold.toString()} onValueChange={(value) => onConfidenceChange(Number(value))}>
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">90%</SelectItem>
                <SelectItem value="95">95%</SelectItem>
                <SelectItem value="99">99%</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="bg-status-done/10 text-status-done text-xs">
              Auto-posting ≥{confidenceThreshold}%
            </Badge>
          </div>
        )}

        {/* Action Icons */}
        <TooltipProvider>
          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Archive className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Archive</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <UserCheck className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Assign</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MailOpen className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark Unread</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Undo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Upload className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Task</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>
    </div>
  );
}