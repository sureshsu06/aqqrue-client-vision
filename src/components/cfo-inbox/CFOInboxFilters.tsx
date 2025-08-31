import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CFOInboxFilters as FiltersType } from "@/types/cfoInbox";
import { ArrowUpDown, Filter, X } from "lucide-react";

interface CFOInboxFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  sortField: 'priorityScore' | 'dueTime' | 'impact' | 'newest';
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: 'priorityScore' | 'dueTime' | 'impact' | 'newest', direction: 'asc' | 'desc') => void;
}

export function CFOInboxFilters({ 
  filters, 
  onFiltersChange, 
  sortField, 
  sortDirection, 
  onSortChange 
}: CFOInboxFiltersProps) {
  const handleFilterChange = (key: keyof FiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleSortChange = (field: 'priorityScore' | 'dueTime' | 'impact' | 'newest') => {
    const newDirection = field === sortField && sortDirection === 'desc' ? 'asc' : 'desc';
    onSortChange(field, newDirection);
  };

  const getSortIcon = (field: 'priorityScore' | 'dueTime' | 'impact' | 'newest') => {
    if (field !== sortField) return <ArrowUpDown className="w-3 h-3" />;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="flex items-center space-x-8">
      {/* Left side - Filter Drawer */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {Object.values(filters).some(v => v !== 'all' && v !== false) && (
              <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 text-xs">
                {Object.values(filters).filter(v => v !== 'all' && v !== false).length}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filter Inbox</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 mt-6">
            {/* Priority Filter */}
            <div>
              <label className="text-sm font-medium text-mobius-gray-700 mb-2 block">Priority</label>
              <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-mobius-gray-700 mb-2 block">Category</label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="ARR">ARR</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Spend">Spend</SelectItem>
                  <SelectItem value="People">People</SelectItem>
                  <SelectItem value="Close">Close</SelectItem>
                  <SelectItem value="Ops">Ops</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Entity Filter */}
            <div>
              <label className="text-sm font-medium text-mobius-gray-700 mb-2 block">Entity</label>
              <Select value={filters.entity} onValueChange={(value) => handleFilterChange('entity', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="US Inc.">US Inc.</SelectItem>
                  <SelectItem value="APAC Inc.">APAC Inc.</SelectItem>
                  <SelectItem value="EU Inc.">EU Inc.</SelectItem>
                  <SelectItem value="UK Inc.">UK Inc.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-mobius-gray-700 mb-2 block">Status</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="snoozed">Snoozed</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due Today Toggle */}
            <div>
              <label className="text-sm font-medium text-mobius-gray-700 mb-2 block">Due Today</label>
              <Button
                variant={filters.dueToday ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('dueToday', !filters.dueToday)}
                className="w-full"
              >
                {filters.dueToday ? "Yes" : "No"}
              </Button>
            </div>

            {/* Clear Filters */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onFiltersChange({
                  priority: 'all',
                  category: 'all',
                  entity: 'all',
                  owner: 'all',
                  dueToday: false,
                  status: 'all'
                });
              }}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Right side - Sorting */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-mobius-gray-700">Sort by:</span>
        
        <Button
          variant={sortField === 'priorityScore' ? "default" : "ghost"}
          size="sm"
          onClick={() => handleSortChange('priorityScore')}
          className="h-8 px-3 text-xs"
        >
          Priority {getSortIcon('priorityScore')}
        </Button>
        
        <Button
          variant={sortField === 'newest' ? "default" : "ghost"}
          size="sm"
          onClick={() => handleSortChange('newest')}
          className="h-8 px-3 text-xs"
        >
          Newest {getSortIcon('newest')}
        </Button>
      </div>
    </div>
  );
}
