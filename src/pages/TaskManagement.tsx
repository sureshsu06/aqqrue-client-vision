import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Users, Shield, TrendingUp, Paperclip } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MonthlyItemsView from '@/components/task-management/MonthlyItemsView';

// Types
interface Task {
  id: string;
  title: string;
  tags: string[];
  meta: string;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  status: 'in-review' | 'in-progress' | 'todo' | 'done';
  comments?: number;
  attachments?: number | Attachment[];
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string;
  confidence?: number;
  subtasks?: Subtask[];
  activity?: Activity[];
  createdFrom?: CreatedFrom;
  dependencies?: string[]; // Array of task IDs this task depends on
  blockedBy?: string[]; // Array of task IDs that are blocking this task
}

interface Subtask {
  id: string;
  title: string;
  done: boolean;
  owner: string;
  eta: string;
  type: 'auto' | 'manual';
  evidence?: string[];
}

interface Activity {
  id: string;
  actor: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  type: 'auto' | 'user' | 'comment';
  summary: string;
  details?: string;
  confidence?: number;
  source?: {
    type: string;
    file: string;
    page: number;
  };
  evidence?: string[];
}

interface CreatedFrom {
  type: string;
  source: string;
  confidence: number;
  excerpt: string;
  transcriptRef: {
    file: string;
    page: number;
  };
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface TaskGroup {
  id: string;
  title: string;
  items: Task[];
  collapsed?: boolean;
}

// Status Icon Component
const StatusIcon: React.FC<{ status: Task['status'] }> = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'in-review':
        return <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />;
      case 'in-progress':
        return <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm" />;
      case 'todo':
        return <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-300" />;
      case 'done':
        return <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>;
      default:
        return <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-300" />;
    }
  };

  return getStatusIcon();
};

// Tag Small Component with Linear-style Color Coding
const TagSmall: React.FC<{ children: React.ReactNode; variant?: 'default' | 'milestone' }> = ({ 
  children, 
  variant = 'default' 
}) => {
  const baseClasses = "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium border border-gray-300 text-gray-700";
  
  // Get dot color for different tag types - Accounting Ops System
  const getDotColor = (tag: string) => {
    const tagLower = tag.toLowerCase();
    
    // Category tags (module-based)
    if (tagLower.includes('revenue') || tagLower.includes('asc606')) {
      return 'bg-blue-500';
    }
    if (tagLower.includes('expenses') || tagLower.includes('brex')) {
      return 'bg-green-500';
    }
    if (tagLower.includes('payroll') || tagLower.includes('close')) {
      return 'bg-purple-500';
    }
    if (tagLower.includes('bank rec') || tagLower.includes('reconciliation')) {
      return 'bg-indigo-500';
    }
    if (tagLower.includes('tax') || tagLower.includes('compliance')) {
      return 'bg-red-500';
    }
    if (tagLower.includes('ap') || tagLower.includes('payments')) {
      return 'bg-orange-500';
    }
    if (tagLower.includes('stripe') || tagLower.includes('automation')) {
      return 'bg-cyan-500';
    }
    if (tagLower.includes('accruals') || tagLower.includes('prepaid')) {
      return 'bg-pink-500';
    }
    if (tagLower.includes('fixed assets') || tagLower.includes('audit')) {
      return 'bg-yellow-500';
    }
    if (tagLower.includes('reporting') || tagLower.includes('gl')) {
      return 'bg-teal-500';
    }
    
    // Role tags
    if (tagLower.includes('agent') || tagLower.includes('automation')) {
      return 'bg-cyan-500';
    }
    if (tagLower.includes('accountant') || tagLower.includes('review')) {
      return 'bg-blue-500';
    }
    if (tagLower.includes('controller') || tagLower.includes('approval')) {
      return 'bg-purple-500';
    }
    
    // Frequency tags
    if (tagLower.includes('daily') || tagLower.includes('recurring')) {
      return 'bg-green-500';
    }
    if (tagLower.includes('weekly') || tagLower.includes('monthly')) {
      return 'bg-blue-500';
    }
    if (tagLower.includes('quarterly') || tagLower.includes('annual')) {
      return 'bg-purple-500';
    }
    if (tagLower.includes('year-end') || tagLower.includes('project')) {
      return 'bg-orange-500';
    }
    
    // Status tags
    if (tagLower.includes('pending') || tagLower.includes('todo')) {
      return 'bg-yellow-500';
    }
    if (tagLower.includes('in-progress') || tagLower.includes('active')) {
      return 'bg-blue-500';
    }
    if (tagLower.includes('completed') || tagLower.includes('done')) {
      return 'bg-green-500';
    }
    
    // Default neutral gray for meta tags
    return 'bg-gray-500';
  };
  
  const dotColor = getDotColor(children as string);
  
  return (
    <span className={baseClasses}>
      <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {children}
    </span>
  );
};

// Task Row Component
const TaskRow: React.FC<{ 
  task: Task; 
  isSelected?: boolean; 
  isHovered?: boolean;
  onSelect?: (task: Task) => void;
  onHover?: (task: Task | null) => void;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, targetTask: Task) => void;
}> = ({ task, isSelected, isHovered, onSelect, onHover, onDragStart, onDragOver, onDrop }) => {
  return (
    <div
      className={`
        flex items-center justify-between px-4 py-2 cursor-pointer transition-all duration-150
        hover:bg-gray-50 group w-full
        ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
        ${isHovered ? 'bg-gray-50' : ''}
      `}
      onClick={() => onSelect?.(task)}
      onMouseEnter={() => onHover?.(task)}
      onMouseLeave={() => onHover?.(null)}
      draggable
      onDragStart={(e) => onDragStart?.(e, task)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, task)}
    >
      {/* Left Content */}
      <div className="flex items-center flex-1 min-w-0 mr-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 mr-3">
          <input 
            type="checkbox" 
            checked={task.status === 'done'}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            onChange={() => {
              // In a real app, this would update the task status
              console.log('Toggle task:', task.id);
            }}
          />
        </div>

        {/* Status Icon */}
        <div className="flex-shrink-0 mr-3">
          <StatusIcon status={task.status} />
        </div>

        {/* Task Content */}
        <div className="flex items-center flex-1 min-w-0 gap-3">
          <h3 className="text-xs font-medium text-gray-900 truncate">
            {task.title}
          </h3>
          {task.priority === 'high' && (
            <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          )}
          {/* Dependency Indicators */}
          {task.dependencies && task.dependencies.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="text-xs text-gray-400">⚡</div>
              <span className="text-xs text-gray-500">depends on {task.dependencies.length}</span>
            </div>
          )}
          {task.blockedBy && task.blockedBy.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="text-xs text-orange-500">🔒</div>
              <span className="text-xs text-orange-600">blocked by {task.blockedBy.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Tags */}
        <div className="flex items-center gap-1">
          {task.tags.slice(0, 2).map((tag, index) => (
            <TagSmall key={index} variant={tag === 'Milestone' ? 'milestone' : 'default'}>
              {tag}
            </TagSmall>
          ))}
        </div>


        {/* Date */}
        <span className="text-xs text-gray-500 w-12 text-right">{task.meta}</span>

        {/* Assignee */}
        {task.assignee ? (
          <Avatar className="w-6 h-6 border border-gray-200" title={task.assignee.name}>
            {task.assignee.name.toLowerCase().includes('aqqrue') || task.assignee.name.toLowerCase().includes('agent') ? (
              <img 
                src="/Favicon_Dark(1).png" 
                alt="Aqqrue" 
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <>
                <AvatarImage 
                  src={task.assignee.avatar || '/spencer.png'} 
                  alt={task.assignee.name}
                />
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-medium">
                  {task.assignee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </>
            )}
          </Avatar>
        ) : (
          <div className="w-6 h-6 border border-gray-300 rounded-full bg-gray-100" />
        )}
      </div>
    </div>
  );
};

// Group Header Component
const GroupHeader: React.FC<{ 
  group: TaskGroup; 
  onToggleCollapse: (groupId: string) => void;
}> = ({ group, onToggleCollapse }) => {
  return (
    <div 
      className="flex items-center justify-between h-9 px-2 cursor-pointer"
      onClick={() => onToggleCollapse(group.id)}
    >
      <div className="flex items-center gap-2">
        {group.collapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
        <h2 className="text-sm font-semibold text-gray-200">
          {group.title}
        </h2>
        <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300">
          {group.items.length}
        </Badge>
      </div>
    </div>
  );
};

// Enhanced Task Detail Panel Component
const TaskDetailPanel: React.FC<{ 
  task: Task | null; 
  onClose: () => void;
  onRun?: (task: Task) => void;
  onAssign?: (task: Task) => void;
  onComment?: (task: Task) => void;
}> = ({ task, onClose, onRun, onAssign, onComment }) => {
  if (!task) return null;

  // Enhanced task data with comprehensive mock data
  const enhancedTask = {
    ...task,
    subtasks: task.subtasks || [
      { id: 's1', title: 'Clarify date range', done: true, owner: 'Aqqrue', eta: '2025-09-19', type: 'manual' as const },
      { id: 's2', title: 'Obtain Stripe report (transactions + payouts)', done: true, owner: 'Aqqrue', eta: '2025-09-20', type: 'auto' as const, evidence: ['stripe_transactions_0919.csv'] },
      { id: 's3', title: 'Obtain bank report (receipts)', done: true, owner: 'Aqqrue', eta: '2025-09-20', type: 'auto' as const, evidence: ['bank_receipts_0919.csv'] },
      { id: 's4', title: 'Perform reconciliation', done: true, owner: 'Aqqrue Recon Agent', eta: '2025-09-21', type: 'auto' as const },
      { id: 's5', title: 'Flag exceptions', done: true, owner: 'Controller (Spencer L)', eta: '2025-09-21', type: 'manual' as const }
    ],
    activity: task.activity || [
      {
        id: 'a1',
        actor: { id: 'system', name: 'Aqqrue Agent (System)', avatar: '/mobius-logo.png' },
        timestamp: '2025-09-18T08:54:00Z',
        type: 'auto' as const,
        summary: 'Task auto-created from CFO chat',
        details: 'Reconcile Amazon sales with bank receipts — subtasks inferred. Confidence 95%.',
        confidence: 0.95,
        source: { type: 'transcript', file: 'onboarding_call_sept18.pdf', page: 3 }
      },
      {
        id: 'a2',
        actor: { id: 'aqqrue', name: 'Aqqrue Agent', avatar: '/Favicon_Dark(1).png' },
        timestamp: '2025-09-19T10:40:00Z',
        type: 'auto' as const,
        summary: 'Pulled Stripe transactions.csv (247 rows)',
        evidence: ['stripe_transactions_0919.csv']
      },
      {
        id: 'a3',
        actor: { id: 'aqqrue', name: 'Aqqrue Agent', avatar: '/Favicon_Dark(1).png' },
        timestamp: '2025-09-19T11:10:00Z',
        type: 'auto' as const,
        summary: 'Imported bank_receipts.csv (241 entries)',
        evidence: ['bank_receipts_0919.csv']
      },
      {
        id: 'a4',
        actor: { id: 'recon', name: 'Aqqrue Agent', avatar: '/mobius-logo.png' },
        timestamp: '2025-09-19T12:05:00Z',
        type: 'auto' as const,
        summary: 'Pinged controller on Slack to clarify date range',
        details: 'Aqqrue Agent: "Hey @Spencer L, need to clarify the date range for Stripe reconciliation. Should I include all of September or just the last week? The bank data shows some discrepancies in the date ranges."',
        evidence: ['slack_message_0919.png']
      },
      {
        id: 'a5',
        actor: { id: 'spencer', name: 'Spencer L', avatar: '/spencer.png' },
        timestamp: '2025-09-19T14:30:00Z',
        type: 'comment' as const,
        summary: 'Clarified date range for Stripe reconciliation',
        details: 'Spencer L: "Whole of Sep" - confirmed to include all of September for the reconciliation process.',
        evidence: ['slack_message_0919.png']
      }
    ],
    attachments: task.attachments || [
      { id: 'stripe_transactions_0919.csv', name: 'stripe_transactions_0919.csv', size: 234124, type: 'csv' },
      { id: 'bank_receipts_0919.csv', name: 'bank_receipts_0919.csv', size: 198234, type: 'csv' }
    ],
    createdFrom: task.createdFrom || {
      type: 'chat_request',
      source: 'Chat request (CFO)',
      confidence: 0.95,
      excerpt: '"Reconcile Stripe transactions with bank receipts" — created from user chat request on 2025-09-18',
      transcriptRef: { file: 'onboarding_call_sept18.pdf', page: 3 }
    },
    dueDate: task.dueDate || '2025-12-15T00:00:00Z',
    confidence: task.confidence || 0.95
  };

  const progress = Math.round((enhancedTask.subtasks.filter(s => s.done).length / enhancedTask.subtasks.length) * 100);
  const completedSubtasks = enhancedTask.subtasks.filter(s => s.done).length;
  const totalSubtasks = enhancedTask.subtasks.length;
  const [isActivityCollapsed, setIsActivityCollapsed] = React.useState(true);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onRun?.(enhancedTask);
      } else if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onAssign?.(enhancedTask);
      } else if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onComment?.(enhancedTask);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enhancedTask, onClose, onRun, onAssign, onComment]);

  return (
    <aside role="dialog" aria-labelledby="task-title" className="fixed right-0 top-0 h-full w-2/3 bg-white shadow-xl z-50 overflow-y-auto">
      <div className="p-6 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h2 id="task-title" className="text-lg font-semibold text-gray-900 mb-2">{enhancedTask.title}</h2>
            
            {/* Enhanced metadata strip */}
            <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap mb-3">
              <span className="flex items-center gap-2">
                <StatusIcon status={enhancedTask.status} />
                <span className="capitalize font-medium">{enhancedTask.status.replace('_', ' ')}</span>
              </span>
              <span className="flex items-center gap-1">
                <span>Assigned to</span>
                <strong className="text-gray-900">{enhancedTask.assignee?.name || 'Unassigned'}</strong>
              </span>
              <span className="flex items-center gap-1">
                <span>Due: {new Date(enhancedTask.dueDate).toLocaleDateString()}</span>
              </span>
              <span className="px-1.5 py-0.5 text-xs bg-red-50 text-red-700 rounded font-medium">
                {enhancedTask.priority || 'medium'}
              </span>
              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded font-medium">
                {Math.round(enhancedTask.confidence * 100)}% inferred
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button 
              onClick={onClose} 
              aria-label="Close task detail panel" 
              className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Enhanced primary actions bar */}
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => onRun?.(enhancedTask)} 
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md shadow-sm hover:bg-blue-700 transition-colors font-medium text-xs"
            title="Run reconciliation now — triggers Aqqrue agent (Ctrl+R)"
            aria-label="Run reconciliation now"
          >
            Run
          </button>
          <button 
            onClick={() => onAssign?.(enhancedTask)} 
            className="border border-gray-300 px-2.5 py-1.5 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-xs"
            title="Assign to controller or agent (Ctrl+A)"
            aria-label="Assign task"
          >
            Assign
          </button>
          <button 
            onClick={() => onComment?.(enhancedTask)} 
            className="border border-gray-300 px-2.5 py-1.5 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-xs"
            title="Add comment (Ctrl+C)"
            aria-label="Add comment"
          >
            Comment
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">

        {/* Enhanced details section */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <img 
              src="/Favicon_Dark(1).png" 
              alt="Aqqrue" 
              className="w-4 h-4 rounded-full object-cover"
            />
            <div className="text-xs font-semibold text-gray-900">Reconciliation Findings</div>
          </div>
          <div className="text-xs text-gray-700 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span><strong>Stripe Transactions:</strong> 247 transactions processed in September</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span><strong>Bank Receipts:</strong> 241 matching entries found</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span><strong>Discrepancies:</strong> 6 unmatched transactions requiring review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span><strong>Total Amount:</strong> $247,392 processed through Stripe</span>
            </div>
            <div className="text-xs text-gray-600 mt-2 p-2 bg-white rounded border">
              <strong>Key Findings:</strong> 2.4% variance between Stripe transactions and bank receipts. 
              Primary discrepancies include pending payouts ($2,234) and failed transactions ($620). 
              All major transactions above $1,000 have been verified and matched.
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button 
                onClick={() => {
                  // Download the reconciliation Excel file
                  const link = document.createElement('a');
                  link.href = '/Stripe_Reconciliation_Report_Sept2025_55Txns.xlsx';
                  link.download = 'Stripe_Reconciliation_Report_Sept2025.xlsx';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Reconciliation Report
              </button>
              <button
                onClick={() => {
                  window.location.href = '/reconciliations?type=stripe';
                }}
                className="flex items-center gap-1 text-xs bg-white text-blue-700 px-3 py-1.5 rounded-md border border-blue-300 hover:bg-blue-50 transition-colors font-medium"
                title="Go to Stripe reconciliation view"
              >
                Go to Stripe Payouts Recon
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced subtasks section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-900">Subtasks</h3>
            <div className="text-xs text-gray-500">
              {completedSubtasks}/{totalSubtasks} done — {progress}%
            </div>
          </div>

          <ul className="space-y-1">
            {enhancedTask.subtasks.map(st => (
              <li key={st.id} className="group flex items-start gap-2 p-2 rounded hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={st.done} 
                  aria-label={`Mark ${st.title} as ${st.done ? 'incomplete' : 'complete'}`}
                  className="mt-0.5 w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onChange={() => {
                    // In a real app, this would update the subtask state
                    console.log('Toggle subtask:', st.id);
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-900 mb-0.5">{st.title}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 flex-wrap">
                    <span className="flex items-center gap-0.5">
                      {st.owner.toLowerCase().includes('aqqrue') ? (
                        <img 
                          src="/Favicon_Dark(1).png" 
                          alt="Aqqrue" 
                          className="w-2.5 h-2.5 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-2.5 h-2.5" />
                      )}
                      <em>{st.owner}</em>
                    </span>
                    <span>—</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {st.type}
                    </span>
                    <span>—</span>
                    <span className="text-gray-400">Due: {st.eta}</span>
                    {st.evidence && st.evidence.length > 0 && (
                      <>
                        <span>—</span>
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                          {st.evidence[0]}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Enhanced activity timeline */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsActivityCollapsed(!isActivityCollapsed)}
                className="flex items-center gap-1 text-xs font-semibold text-gray-900 hover:text-gray-700"
              >
                {isActivityCollapsed ? (
                  <ChevronRight className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
                Activity Timeline
              </button>
            </div>
            {!isActivityCollapsed && (
              <div className="flex gap-1">
                <button className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">All</button>
                <button className="text-xs px-1.5 py-0.5 text-gray-500 hover:bg-gray-100 rounded">System</button>
                <button className="text-xs px-1.5 py-0.5 text-gray-500 hover:bg-gray-100 rounded">Agent</button>
                <button className="text-xs px-1.5 py-0.5 text-gray-500 hover:bg-gray-100 rounded">Comments</button>
              </div>
            )}
          </div>

          {!isActivityCollapsed && (
            <div className="space-y-3">
              {enhancedTask.activity.map((ev, index) => (
              <div key={ev.id} className="flex gap-3 group">
                <div className="flex-shrink-0">
                  <img 
                    src={ev.actor.name.toLowerCase().includes('aqqrue') ? '/Favicon_Dark(1).png' : (ev.actor.avatar || '/spencer.png')} 
                    alt={ev.actor.name} 
                    className="h-5 w-5 rounded-full border border-gray-200"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <div className="text-xs font-medium text-gray-900">{ev.actor.name}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(ev.timestamp).toLocaleDateString()} {new Date(ev.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    {ev.type === 'auto' && (
                      <div className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded font-medium">
                        Auto
                      </div>
                    )}
                    {ev.type === 'comment' && (
                      <div className="px-1.5 py-0.5 bg-green-50 text-green-700 text-xs rounded font-medium">
                        Comment
                      </div>
                    )}
                    {ev.confidence && (
                      <div className="px-1.5 py-0.5 bg-green-50 text-green-700 text-xs rounded font-medium">
                        {Math.round(ev.confidence * 100)}% confidence
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-700">
                    {ev.summary}
                    {ev.details && (
                      <span className="text-gray-500"> {ev.details}</span>
                    )}
                  </div>
                  {ev.evidence && ev.evidence.length > 0 && (
                    <div className="mt-1 flex gap-1">
                      {ev.evidence.map((file, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {file}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced attachments section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-900 mb-2">Source Reports</h3>
          <div className="space-y-1">
            {Array.isArray(enhancedTask.attachments) ? enhancedTask.attachments.map(a => (
              <div key={a.id} className="flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-3 h-3 text-gray-400" />
                  <div className="truncate text-xs font-medium text-gray-900">{a.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500">{Math.round(a.size/1024)} KB</div>
                  <button className="opacity-0 group-hover:opacity-100 text-xs text-blue-600 hover:text-blue-800 font-medium transition-opacity">
                    Download
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-xs text-gray-500 py-2">
                {typeof enhancedTask.attachments === 'number' ? `${enhancedTask.attachments} attachments` : 'No attachments'}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

// Data for different views - Accounting Ops Workspace
const agentViewData: TaskGroup[] = [
  {
    id: 'agent-queue',
    title: 'Aqqrue Queue',
    items: [
      {
        id: 'agent-1',
        title: 'Recon Stripe transactions and payouts',
        tags: ['Stripe', 'Automation', 'Agent'],
        meta: 'Oct 10',
        assignee: { id: 'aqqrue', name: 'Aqqrue Agent' },
        status: 'done',
        comments: 0
      },
      {
        id: 'agent-2',
        title: 'Generate revenue recognition schedule for Dec',
        tags: ['Revenue', 'ASC606', 'Agent'],
        meta: 'Oct 10',
        assignee: { id: 'aqqrue', name: 'Aqqrue Agent' },
        status: 'in-progress',
        comments: 0
      },
      {
        id: 'agent-3',
        title: 'Detect missing receipts in Brex feed',
        tags: ['Expenses', 'Brex', 'Agent'],
        meta: 'Oct 10',
        assignee: { id: 'aqqrue', name: 'Aqqrue Agent' },
        status: 'in-progress',
        comments: 0
      },
      {
        id: 'agent-4',
        title: 'Suggest accrual JEs from PO tracker',
        tags: ['Accruals', 'Automation', 'Agent'],
        meta: 'Oct 10',
        assignee: { id: 'aqqrue', name: 'Aqqrue Agent' },
        status: 'in-progress',
        comments: 0
      }
    ]
  },
  {
    id: 'accountant-review',
    title: 'Accountant Review',
    items: [
      {
        id: 'review-1',
        title: 'Review expense categorization for September',
        tags: ['Expenses', 'Review', 'Accountant'],
        meta: 'Sep 15',
        assignee: { id: 'rm', name: 'Spencer L' },
        status: 'in-review',
        comments: 2
      },
      {
        id: 'review-2',
        title: 'Validate revenue recognition report',
        tags: ['Revenue', 'Close', 'Accountant'],
        meta: 'Sep 15',
        assignee: { id: 'sk', name: 'S. Kumar' },
        status: 'in-review',
        comments: 1
      },
      {
        id: 'review-3',
        title: 'Approve payroll journal entries for Dec',
        tags: ['Payroll', 'Close', 'Accountant'],
        meta: 'Oct 10',
        assignee: { id: 'ap', name: 'A. Patel' },
        status: 'in-review',
        comments: 3
      },
      {
        id: 'review-4',
        title: 'Review suspense account – Brex transactions',
        tags: ['Brex', 'Suspense', 'Accountant'],
        meta: 'Oct 10',
        assignee: { id: 'rm', name: 'Spencer L' },
        status: 'in-review',
        comments: 1
      },
      {
        id: 'review-5',
        title: 'Review Stripe reconciliation exceptions (6 transactions)',
        tags: ['Stripe', 'Reconciliation', 'Exception'],
        meta: 'Oct 10',
        assignee: { id: 'sk', name: 'S. Kumar' },
        status: 'in-review',
        comments: 0,
        priority: 'high'
      }
    ]
  },
  {
    id: 'recurring-ops',
    title: 'Recurring Tasks',
    items: [
      {
        id: 'recurring-1',
        title: 'Post daily vendor bills in QBO',
        tags: ['AP', 'Recurring', 'Daily'],
        meta: 'Daily',
        assignee: { id: 'aqqrue', name: 'Aqqrue Agent' },
        status: 'in-progress',
        comments: 0
      },
      {
        id: 'recurring-2',
        title: 'Reconcile Stripe clearing account',
        tags: ['Stripe', 'Reconciliation', 'Weekly'],
        meta: 'Weekly',
        assignee: { id: 'aqqrue', name: 'Aqqrue Agent' },
        status: 'in-progress',
        comments: 0
      },
      {
        id: 'recurring-3',
        title: 'Update chart of accounts for new year',
        tags: ['GL', 'Maintenance', 'Year-End'],
        meta: 'Dec 20',
        assignee: { id: 'aqqrue', name: 'Aqqrue Agent' },
        status: 'todo',
        comments: 0
      }
    ]
  },
  {
    id: 'month-end-close',
    title: 'Month-End Close (Current Period)',
    items: [
      {
        id: 'close-1',
        title: 'Run month-end close checklist',
        tags: ['Close', 'Checklist', 'Monthly'],
        meta: 'Oct 10',
        assignee: { id: 'rm', name: 'Spencer L' },
        status: 'in-progress',
        priority: 'high',
        comments: 1
      },
      {
        id: 'close-2',
        title: 'Bank reconciliation – Operating account (HDFC)',
        tags: ['Bank Rec', 'Close', 'Monthly'],
        meta: 'Oct 10',
        assignee: { id: 'aqqrue', name: 'Aqqrue Agent' },
        status: 'in-progress',
        comments: 0
      },
      {
        id: 'close-3',
        title: 'Post September payroll entries',
        tags: ['Payroll', 'Close', 'Monthly'],
        meta: 'Oct 10',
        assignee: { id: 'aqqrue', name: 'Aqqrue Agent' },
        status: 'in-progress',
        comments: 2
      },
      {
        id: 'close-4',
        title: 'Process Q4 vendor payments',
        tags: ['Payments', 'Q4', 'Quarterly'],
        meta: 'Oct 10',
        assignee: { id: 'ap', name: 'A. Patel' },
        status: 'in-review',
        comments: 1
      },
      {
        id: 'close-5',
        title: 'Review deferred revenue rollforward',
        tags: ['Revenue', 'Close', 'Monthly'],
        meta: 'Oct 10',
        assignee: { id: 'sk', name: 'S. Kumar' },
        status: 'todo',
        comments: 0
      },
      {
        id: 'close-6',
        title: 'Review prepaid & accrual adjustments',
        tags: ['Prepaid', 'Accruals', 'Monthly'],
        meta: 'Oct 10',
        assignee: { id: 'rm', name: 'Spencer L' },
        status: 'todo',
        comments: 0
      },
      {
        id: 'close-7',
        title: 'Prepare P&L variance analysis',
        tags: ['Reporting', 'Close', 'Monthly'],
        meta: 'Oct 10',
        assignee: { id: 'sk', name: 'S. Kumar' },
        status: 'todo',
        comments: 0
      },
      {
        id: 'close-8',
        title: 'Controller review and sign-off',
        tags: ['Close', 'Approval', 'Monthly'],
        meta: 'Oct 10',
        assignee: { id: 'rm', name: 'Spencer L' },
        status: 'todo',
        priority: 'high',
        comments: 0
      }
    ]
  },
  {
    id: 'compliance-year-end',
    title: 'Compliance & Year-End',
    items: [
      {
        id: 'compliance-1',
        title: 'Prepare year-end tax documents',
        tags: ['Tax', 'Year-End', 'Annual'],
        meta: 'Jan 10',
        assignee: { id: 'ap', name: 'A. Patel' },
        status: 'todo',
        priority: 'high',
        comments: 0
      },
      {
        id: 'compliance-2',
        title: 'Review fixed asset register and depreciation',
        tags: ['Fixed Assets', 'Audit', 'Annual'],
        meta: 'Oct 10',
        assignee: { id: 'sk', name: 'S. Kumar' },
        status: 'todo',
        comments: 0
      },
      {
        id: 'compliance-3',
        title: 'Prepare audit support pack – Dec close',
        tags: ['Audit', 'Close', 'Monthly'],
        meta: 'Dec 20',
        assignee: { id: 'rm', name: 'Spencer L' },
        status: 'todo',
        comments: 0
      },
      {
        id: 'compliance-4',
        title: 'Update deferred tax and prepaid schedules',
        tags: ['Tax', 'Deferred', 'Monthly'],
        meta: 'Dec 22',
        assignee: { id: 'ap', name: 'A. Patel' },
        status: 'todo',
        comments: 0
      }
    ]
  },
  {
    id: 'completed',
    title: 'Completed',
    collapsed: true,
    items: [
      {
        id: 'done-1',
        title: 'Process November invoices',
        tags: ['AP', 'November', 'Monthly'],
        meta: 'Oct 10',
        assignee: { id: 'aqqrue', name: 'Aqqrue Agent' },
        status: 'done'
      },
      {
        id: 'done-2',
        title: 'Update depreciation schedules',
        tags: ['Fixed Assets', 'Monthly'],
        meta: 'Oct 10',
        assignee: { id: 'aqqrue', name: 'Aqqrue Agent' },
        status: 'done'
      },
      {
        id: 'done-3',
        title: 'Payroll verification (November)',
        tags: ['Payroll', 'Verification', 'Monthly'],
        meta: 'Oct 10',
        assignee: { id: 'aqqrue', name: 'Aqqrue Agent' },
        status: 'done'
      },
      {
        id: 'done-4',
        title: 'Auto-generate order-to-cash SOP (v0.1)',
        tags: ['SOP', 'Onboarding', 'Project'],
        meta: 'Oct 10',
        assignee: { id: 'aqqrue', name: 'Aqqrue Agent' },
        status: 'done'
      }
    ]
  }
];

const controllerViewData: TaskGroup[] = [
  {
    id: 'today',
    title: 'Today',
    items: [
      {
        id: '1',
        title: '42 unmatched Stripe payments flagged for review',
        tags: ['Stripe', 'Exception'],
        meta: 'Today',
        assignee: { id: 'rm', name: 'Spencer L' },
        status: 'in-review',
        comments: 5,
        priority: 'high'
      },
      {
        id: '2',
        title: 'Expense re-categorization (5 items > ₹10k) pending confirmation',
        tags: ['Expenses', 'Exception'],
        meta: 'Today',
        assignee: { id: 'sk', name: 'S. Kumar' },
        status: 'in-review',
        comments: 2
      },
      {
        id: '3',
        title: 'Q4 vendor payments (2 require approval > ₹5L)',
        tags: ['Payments', 'Approval'],
        meta: 'Today',
        assignee: { id: 'ap', name: 'A. Patel' },
        status: 'in-review',
        priority: 'high'
      }
    ]
  },
  {
    id: 'this-week',
    title: 'This Week',
    items: [
      {
        id: '6',
        title: 'Year-end close approval checklist',
        tags: ['Close', 'Approval'],
        meta: 'This week',
        status: 'todo',
        priority: 'high'
      }
    ]
  },
  {
    id: 'overdue',
    title: 'Overdue',
    items: [
      {
        id: '4',
        title: '55 COD Orders Awaiting Payment — Blitz',
        tags: ['COD', 'Collections Risk'],
        meta: '30 days overdue',
        assignee: { id: 'rm', name: 'Spencer L' },
        status: 'in-progress',
        comments: 8,
        priority: 'high',
        dueDate: '2025-09-30T00:00:00Z',
        confidence: 0.94,
        createdFrom: {
          type: 'exception_alert',
          source: 'Collections System',
          confidence: 0.94,
          excerpt: 'COD orders from Blitz Logistics Pvt Ltd showing 30+ day payment delays',
          transcriptRef: { file: 'collections_report_sept19.pdf', page: 12 }
        },
        subtasks: [
          { id: 's1', title: 'Verify delivery confirmations with Uniware', done: true, owner: 'Aqqrue Agent', eta: '2025-09-19', type: 'auto' as const, evidence: ['uniware_confirmations.csv'] },
          { id: 's2', title: 'Send automated reminder to Blitz accounts team', done: false, owner: 'Aqqrue Agent', eta: '2025-09-20', type: 'auto' as const },
          { id: 's3', title: 'Escalate to sales manager (S. Kumar)', done: false, owner: 'Controller (Spencer L)', eta: '2025-09-21', type: 'manual' as const },
          { id: 's4', title: 'Flag to CFO if unpaid by Sep 30', done: false, owner: 'Controller (Spencer L)', eta: '2025-09-30', type: 'manual' as const }
        ],
        activity: [
          {
            id: 'a1',
            actor: { id: 'system', name: 'Aqqrue Agent (System)', avatar: '/mobius-logo.png' },
            timestamp: '2025-09-18T14:30:00Z',
            type: 'auto' as const,
            summary: 'Exception alert generated for Blitz COD orders',
            details: 'Collections system flagged 55 orders with 30+ day payment delays. Risk assessment: High cash gap potential.',
            confidence: 0.94
          },
          {
            id: 'a2',
            actor: { id: 'agent-1', name: 'Aqqrue Agent', avatar: '/mobius-logo.png' },
            timestamp: '2025-09-19T09:15:00Z',
            type: 'auto' as const,
            summary: 'Verified delivery confirmations with Uniware',
            details: '45/55 deliveries confirmed. 10 flagged as "dispatch confirmed but payment not received".',
            evidence: ['uniware_confirmations.csv']
          },
          {
            id: 'a3',
            actor: { id: 'agent-2', name: 'Aqqrue Agent', avatar: '/mobius-logo.png' },
            timestamp: '2025-09-19T11:45:00Z',
            type: 'auto' as const,
            summary: 'Sent reminder to Blitz accounts team',
            details: 'Automated reminder sent to accounts@blitzlogistics.com. No response received.',
            evidence: ['reminder_email_sept19.pdf']
          }
        ],
        attachments: [
          { id: 'blitz_summary.pdf', name: 'Blitz COD Summary Report', size: 156789, type: 'pdf' },
          { id: 'uniware_confirmations.csv', name: 'Uniware Delivery Confirmations', size: 23456, type: 'csv' },
          { id: 'reminder_email_sept19.pdf', name: 'Reminder Email (Sep 19)', size: 12345, type: 'pdf' }
        ]
      },
      {
        id: '5',
        title: 'Vendor invoice exception — MoEngage payment (> ₹5L, pending approval)',
        tags: ['Vendor', 'Approval'],
        meta: 'Overdue',
        assignee: { id: 'ap', name: 'A. Patel' },
        status: 'in-progress',
        comments: 3,
        priority: 'high'
      },
      {
        id: '7',
        title: 'November expense exceptions reviewed & closed',
        tags: ['Expenses', 'Exception'],
        meta: 'Overdue',
        assignee: { id: 'sk', name: 'S. Kumar' },
        status: 'done'
      },
      {
        id: '8',
        title: 'October vendor disputes resolved',
        tags: ['Vendor', 'Dispute'],
        meta: 'Overdue',
        assignee: { id: 'rm', name: 'Spencer L' },
        status: 'done'
      }
    ]
  }
];

const cfoViewData: TaskGroup[] = [
  {
    id: 'in-review',
    title: 'Performance Against Plan',
    items: [
      {
        id: '1',
        title: 'UAE sales running -5% MoM vs plan',
        tags: ['Sales', 'UAE'],
        meta: 'Oct 10',
        status: 'in-review',
        priority: 'high'
      },
      {
        id: '2',
        title: 'US collections ahead of plan +3%',
        tags: ['Collections', 'US'],
        meta: 'Oct 10',
        status: 'in-review'
      }
    ]
  },
  {
    id: 'in-progress',
    title: 'Operational Alerts',
    items: [
      {
        id: '3',
        title: 'April returns trending 15% above median',
        tags: ['Returns', 'Trend'],
        meta: 'Oct 10',
        status: 'in-progress',
        priority: 'high'
      },
      {
        id: '4',
        title: 'Payroll entries for August posted? (status check in progress)',
        tags: ['Payroll', 'Status'],
        meta: 'Oct 10',
        status: 'in-progress'
      }
    ]
  },
  {
    id: 'todo',
    title: 'Finance Function',
    items: [
      {
        id: '5',
        title: 'Year-end tax prep — requires advisor sync',
        tags: ['Tax', 'Advisor'],
        meta: 'Oct 10',
        status: 'todo',
        priority: 'high'
      },
      {
        id: '6',
        title: 'New chart of accounts rollout (Jan 1 target)',
        tags: ['GL', 'Rollout'],
        meta: 'Oct 10',
        status: 'todo'
      }
    ]
  },
  {
    id: 'done',
    title: 'Closed / Done',
    items: [
      {
        id: '7',
        title: 'November close completed on schedule',
        tags: ['Close', 'Schedule'],
        meta: 'Oct 10',
        status: 'done'
      },
      {
        id: '8',
        title: 'Bank reconciliations for all accounts up-to-date',
        tags: ['Bank Rec', 'Complete'],
        meta: 'Oct 10',
        status: 'done'
      }
    ]
  }
];

// Main Task Management Component
const TaskManagement: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
  const [activeView, setActiveView] = useState('agent');
  const [showMonthly, setShowMonthly] = useState(false);
  const [groups, setGroups] = useState<TaskGroup[]>(agentViewData);
  const [isLoading, setIsLoading] = useState(false);

  // Handle view switching
  const handleViewChange = (view: string) => {
    setActiveView(view);
    switch (view) {
      case 'agent':
        setGroups(agentViewData);
        break;
      case 'controller':
        setGroups(controllerViewData);
        break;
      case 'cfo':
        setGroups(cfoViewData);
        break;
      default:
        setGroups(agentViewData);
    }
  };

  const handleToggleCollapse = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, collapsed: !group.collapsed }
        : group
    ));
  };

  const handleTaskSelect = (task: Task) => {
    // Navigate to Dashboard for QBO bills task
    if (task.id === '5' && task.title === 'Daily posting of bills in QBO') {
      window.location.href = '/';
      return;
    }
    setSelectedTask(task);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetTask: Task) => {
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData('text/plain');
    
    if (draggedTaskId === targetTask.id) return;

    // Find the dragged task and move it to the same group as target task
    setGroups(prev => {
      const newGroups = [...prev];
      let draggedTask: Task | null = null;
      let draggedTaskGroupIndex = -1;
      let draggedTaskIndex = -1;
      let targetTaskGroupIndex = -1;

      // Find dragged task
      for (let i = 0; i < newGroups.length; i++) {
        const taskIndex = newGroups[i].items.findIndex(item => item.id === draggedTaskId);
        if (taskIndex !== -1) {
          draggedTask = newGroups[i].items[taskIndex];
          draggedTaskGroupIndex = i;
          draggedTaskIndex = taskIndex;
          break;
        }
      }

      // Find target task group
      for (let i = 0; i < newGroups.length; i++) {
        const taskIndex = newGroups[i].items.findIndex(item => item.id === targetTask.id);
        if (taskIndex !== -1) {
          targetTaskGroupIndex = i;
          break;
        }
      }

      if (draggedTask && draggedTaskGroupIndex !== -1 && targetTaskGroupIndex !== -1) {
        // Remove from original group
        newGroups[draggedTaskGroupIndex].items.splice(draggedTaskIndex, 1);
        
        // Add to target group
        newGroups[targetTaskGroupIndex].items.push(draggedTask);
      }

      return newGroups;
    });
  };

  // Calculate total active issues
  const totalActiveIssues = groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="h-full flex flex-col bg-white w-full">
      <style>{`
        @keyframes loading-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
      
      {/* Metrics Bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Close Progress:</span>
            <span className="font-semibold text-gray-900">72%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">Suspense Balance:</span>
            <span className="font-semibold text-gray-900">$4,230</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Variance Exceptions:</span>
            <span className="font-semibold text-gray-900">3</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Bank Recs:</span>
            <span className="font-semibold text-gray-900">3/4</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Revenue Rec Accuracy:</span>
            <span className="font-semibold text-gray-900">99.2%</span>
          </div>
        </div>
      </div>

      {/* Linear-style Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xs font-semibold text-gray-900">
                {showMonthly ? 'Monthly Items' : `Active issues ${totalActiveIssues}`}
              </h1>
              {!showMonthly && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs px-2 py-1 h-6 border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  + Filter
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Toggle Button - Always visible */}
              <Button
                variant={showMonthly ? 'default' : 'outline'}
                size="sm"
                className="text-xs px-3 py-1 h-6 font-medium"
                onClick={() => setShowMonthly(!showMonthly)}
              >
                {showMonthly ? '← Work Items' : 'Monthly Items →'}
              </Button>

              {!showMonthly && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (isLoading) return;
                      
                      setIsLoading(true);
                      
                      // Demo: Add the Stripe reconciliation task after 5 seconds
                      setTimeout(() => {
                        const newTask = {
                          id: 'demo-1',
                          title: 'Reconcile Stripe transactions with bank receipts',
                          tags: ['Reconciliation', 'Marketplace'],
                          meta: 'Just now',
                          assignee: { id: 'ap', name: 'A. Patel' },
                          status: 'done' as const,
                          comments: 0,
                          attachments: 0,
                          priority: 'high' as const,
                          dueDate: '2025-12-15T00:00:00Z',
                          confidence: 0.95,
                          createdFrom: {
                            type: 'chat_request',
                            source: 'User chat - CFO',
                            confidence: 0.95,
                            excerpt: '"Reconcile Stripe transactions with bank receipts" — created from user chat request on 2025-09-18',
                            transcriptRef: { file: 'onboarding_call_sept18.pdf', page: 3 }
                          }
                        };
                        
                        setGroups(prev => prev.map(group => 
                          group.id === 'in-review' 
                            ? { ...group, items: [newTask, ...group.items] }
                            : group
                        ));
                        
                        setIsLoading(false);
                      }, 5000);
                    }}
                    disabled={isLoading}
                    className="text-xs px-2 py-1 h-6 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                  >
                    <img src="/mobius-logo.png" alt="Aqqrue" className="w-3 h-3 mr-1" />
                    Ask Aqqrue
                  </Button>
                  
                  {/* Loading Bar */}
                  {isLoading && (
                    <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full animate-[loading-bar_5s_linear_forwards]" />
                    </div>
                  )}

                  <Select value={activeView} onValueChange={handleViewChange}>
                    <SelectTrigger className="w-28 h-6 text-xs bg-white border-gray-300">
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">Agent View</SelectItem>
                      <SelectItem value="controller">Controller View</SelectItem>
                      <SelectItem value="cfo">CFO View</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Linear-style Layout */}
      {showMonthly ? (
        <MonthlyItemsView onBack={() => setShowMonthly(false)} />
      ) : (
        <div className="flex-1 overflow-auto bg-white">
          <div className="w-full">
            {/* Task Groups - Linear-style Layout */}
            <div className="space-y-0">
              {groups.map((group) => (
                <div key={group.id} className="bg-white">
                  {/* Linear-style Group Header with Mini KPIs */}
                  <div 
                    className="py-2 px-3 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200"
                    onClick={() => handleToggleCollapse(group.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {group.collapsed ? (
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-gray-400" />
                        )}
                        <h2 className="text-xs font-semibold text-gray-900">
                          {group.title}
                        </h2>
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-medium">
                          {group.items.length}
                        </Badge>
                        
                        {/* Mini KPIs and Context - Inline */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 ml-4">
                          {(() => {
                            const completedTasks = group.items.filter(task => task.status === 'done').length;
                            const inProgressTasks = group.items.filter(task => task.status === 'in-progress').length;
                            const inReviewTasks = group.items.filter(task => task.status === 'in-review').length;
                            const completionRate = Math.round((completedTasks / group.items.length) * 100);
                            
                            // Section-specific context
                            let contextInfo = '';
                            if (group.id === 'agent-queue') {
                              const flaggedTasks = group.items.filter(task => task.tags.some(tag => tag.toLowerCase().includes('missing') || tag.toLowerCase().includes('exception'))).length;
                              contextInfo = flaggedTasks > 0 ? `${flaggedTasks} flagged` : 'all automated';
                            } else if (group.id === 'accountant-review') {
                              const highPriorityTasks = group.items.filter(task => task.priority === 'high').length;
                              contextInfo = highPriorityTasks > 0 ? `${highPriorityTasks} high priority` : 'routine review';
                            } else if (group.id === 'recurring-ops') {
                              const dailyTasks = group.items.filter(task => task.meta === 'Daily').length;
                              contextInfo = dailyTasks > 0 ? `${dailyTasks} daily tasks` : 'scheduled ops';
                            } else if (group.id === 'month-end-close') {
                              const overdueTasks = group.items.filter(task => task.status === 'todo' && task.priority === 'high').length;
                              contextInfo = overdueTasks > 0 ? `${overdueTasks} critical` : 'on track';
                            } else if (group.id === 'compliance-year-end') {
                              const annualTasks = group.items.filter(task => task.tags.some(tag => tag.toLowerCase().includes('annual'))).length;
                              contextInfo = annualTasks > 0 ? `${annualTasks} annual tasks` : 'quarterly focus';
                            } else if (group.id === 'completed') {
                              const recentTasks = group.items.filter(task => task.meta === 'Oct 10').length;
                              contextInfo = recentTasks > 0 ? `${recentTasks} completed today` : 'historical';
                            }
                            
                            return (
                              <>
                                <span className="font-medium text-gray-700">
                                  {completedTasks}/{group.items.length} complete — {completionRate}%
                                </span>
                                {contextInfo && (
                                  <span className="text-gray-500">
                                    | {contextInfo}
                                  </span>
                                )}
                                {inProgressTasks > 0 && (
                                  <span className="text-blue-600">
                                    {inProgressTasks} in progress
                                  </span>
                                )}
                                {inReviewTasks > 0 && (
                                  <span className="text-orange-600">
                                    {inReviewTasks} pending review
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add new item to this group
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Task List */}
                  {!group.collapsed && (
                    <div className="divide-y divide-gray-100">
                      {group.items.map((task, index) => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          isSelected={selectedTask?.id === task.id}
                          isHovered={hoveredTask?.id === task.id}
                          onSelect={handleTaskSelect}
                          onHover={setHoveredTask}
                          onDragStart={handleDragStart}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Panel */}
      {selectedTask && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedTask(null)}
          />
          <TaskDetailPanel 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)}
            onRun={(task) => {
              console.log('Running task:', task.id, task.title);
              // In a real app, this would trigger the Aqqrue agent
            }}
            onAssign={(task) => {
              console.log('Assigning task:', task.id, task.title);
              // In a real app, this would open an assignee picker
            }}
            onComment={(task) => {
              console.log('Commenting on task:', task.id, task.title);
              // In a real app, this would open a comment modal
            }}
          />
        </>
      )}

      {/* Floating Input Field - Chatbox */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-lg px-6 z-50">
        <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
          <div className="flex items-center p-3">
            <input
              type="text"
              placeholder="Ask a question..."
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none text-sm"
            />
            <div className="flex items-center space-x-3 ml-3">
              <div className="text-gray-500 text-xs font-medium">⌘I</div>
              <button className="w-8 h-8 bg-green-500 hover:bg-green-600 border border-gray-300 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
