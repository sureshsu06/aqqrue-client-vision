import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

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

        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>
    </div>
  );
}