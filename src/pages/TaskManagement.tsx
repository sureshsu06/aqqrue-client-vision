import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MessageCircle, Paperclip, Plus, Filter, Users, Shield, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const baseClasses = "inline-flex items-center px-1 py-0.5 rounded text-xs font-normal";
  
  // Strong colors only for important work categories
  const getTagColors = (tag: string) => {
    const tagLower = tag.toLowerCase();
    if (tagLower.includes('reconciliation') || tagLower.includes('milestone')) {
      return 'bg-blue-100 text-blue-700';
    }
    if (tagLower.includes('payment') || tagLower.includes('payroll')) {
      return 'bg-purple-100 text-purple-700';
    }
    if (tagLower.includes('exception') || tagLower.includes('approval')) {
      return 'bg-red-100 text-red-700';
    }
    if (tagLower.includes('overdue') || tagLower.includes('urgent')) {
      return 'bg-orange-100 text-orange-700';
    }
    // Default neutral gray for meta tags
    return 'bg-gray-100 text-gray-600';
  };
  
  if (variant === 'milestone') {
    return (
      <span className={`${baseClasses} bg-blue-100 text-blue-700`}>
        {children}
      </span>
    );
  }
  
  return (
    <span className={`${baseClasses} ${getTagColors(children as string)}`}>
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
        flex items-center justify-between px-3 py-1.5 cursor-pointer transition-all duration-150
        hover:bg-gray-50 group border-b border-gray-100 last:border-b-0 w-full
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
      <div className="flex items-center flex-1 min-w-0 mr-2">
        {/* Status Icon */}
        <div className="flex-shrink-0 mr-2">
          <StatusIcon status={task.status} />
        </div>

        {/* Task Content - Single Line */}
        <div className="flex items-center flex-1 min-w-0 gap-2">
          <h3 className="text-xs font-medium text-gray-900 truncate">
            {task.title}
          </h3>
          {task.priority === 'high' && (
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
          )}
          {/* Tags and metadata inline */}
          <div className="flex items-center gap-1 text-xs">
            {task.tags.map((tag, index) => (
              <TagSmall key={index} variant={tag === 'Milestone' ? 'milestone' : 'default'}>
                {tag}
              </TagSmall>
            ))}
            <span className="text-gray-400">·</span>
            <span className="text-gray-400 font-normal">{task.meta}</span>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Metadata Icons */}
        {task.comments && (
          <div className="flex items-center gap-0.5 text-xs text-gray-500">
            <MessageCircle className="w-3 h-3" />
            <span>{task.comments}</span>
          </div>
        )}
        {task.attachments && (
          <Paperclip className="w-3 h-3 text-gray-400" />
        )}

        {/* Assignee */}
        {task.assignee && (
          <Avatar className="w-5 h-5 border border-white shadow-sm" title={task.assignee.name}>
            <AvatarImage 
              src={task.assignee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee.name)}&background=3b82f6&color=ffffff&size=40&bold=true&format=png`} 
              alt={task.assignee.name}
            />
            <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-medium">
              {task.assignee.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
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
      { id: 's1', title: 'Clarify date range', done: false, owner: 'Agent-1', eta: '2025-09-19', type: 'manual' as const },
      { id: 's2', title: 'Obtain Amazon report (orders + fees)', done: true, owner: 'Agent-1', eta: '2025-09-20', type: 'auto' as const, evidence: ['amazon_orders_0919.csv'] },
      { id: 's3', title: 'Obtain bank report (receipts)', done: true, owner: 'Agent-2', eta: '2025-09-20', type: 'auto' as const, evidence: ['bank_receipts_0919.csv'] },
      { id: 's4', title: 'Perform reconciliation', done: false, owner: 'Aqqrue Recon Agent', eta: '2025-09-21', type: 'auto' as const },
      { id: 's5', title: 'Flag exceptions', done: false, owner: 'Controller (R. Mehta)', eta: '2025-09-21', type: 'manual' as const }
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
        actor: { id: 'agent-1', name: 'Aqqrue Agent', avatar: '/mobius-logo.png' },
        timestamp: '2025-09-19T10:40:00Z',
        type: 'auto' as const,
        summary: 'Pulled Amazon orders.csv (3,542 rows)',
        evidence: ['amazon_orders_0919.csv']
      },
      {
        id: 'a3',
        actor: { id: 'agent-2', name: 'Aqqrue Agent', avatar: '/mobius-logo.png' },
        timestamp: '2025-09-19T11:10:00Z',
        type: 'auto' as const,
        summary: 'Imported bank_receipts.csv (3,420 entries)',
        evidence: ['bank_receipts_0919.csv']
      },
      {
        id: 'a4',
        actor: { id: 'recon', name: 'Aqqrue Agent', avatar: '/mobius-logo.png' },
        timestamp: '2025-09-19T12:05:00Z',
        type: 'auto' as const,
        summary: 'Pinged controller on Slack to clarify date range',
        details: 'Aqqrue Agent: "Hey @R.Mehta, need to clarify the date range for Amazon reconciliation. Should I include all of September or just the last week? The bank data shows some discrepancies in the date ranges."',
        evidence: ['slack_message_0919.png']
      }
    ],
    attachments: task.attachments || [
      { id: 'amazon_orders_0919.csv', name: 'amazon_orders_0919.csv', size: 234124, type: 'csv' },
      { id: 'bank_receipts_0919.csv', name: 'bank_receipts_0919.csv', size: 198234, type: 'csv' }
    ],
    createdFrom: task.createdFrom || {
      type: 'chat_request',
      source: 'Chat request (CFO)',
      confidence: 0.95,
      excerpt: '"Reconcile Amazon sales with bank receipts" — created from user chat request on 2025-09-18',
      transcriptRef: { file: 'onboarding_call_sept18.pdf', page: 3 }
    },
    dueDate: task.dueDate || '2025-12-15T00:00:00Z',
    confidence: task.confidence || 0.95
  };

  const progress = Math.round((enhancedTask.subtasks.filter(s => s.done).length / enhancedTask.subtasks.length) * 100);
  const completedSubtasks = enhancedTask.subtasks.filter(s => s.done).length;
  const totalSubtasks = enhancedTask.subtasks.length;

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
        {/* Enhanced provenance card */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-3 h-3 text-gray-600" />
            <div className="text-xs font-semibold text-gray-900">Provenance</div>
          </div>
          <div className="text-xs text-gray-700 mb-1">
            Created from <strong>{enhancedTask.createdFrom.source}</strong>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            "{enhancedTask.title}" — Aqqrue inferred subtasks and assigned agents. {Math.round(enhancedTask.createdFrom.confidence * 100)}% confidence.
          </div>
          <div className="flex gap-3">
            <a 
              href="#" 
              className="text-xs text-blue-600 hover:text-blue-800 underline font-medium"
              aria-label="Open full transcript"
            >
              Open transcript
            </a>
            <a 
              href="#" 
              className="text-xs text-gray-600 hover:text-gray-800 underline"
              aria-label="Download transcript excerpt"
            >
              Download excerpt
            </a>
            <a 
              href="#" 
              className="text-xs text-gray-600 hover:text-gray-800 underline"
              aria-label="Show audio recording"
            >
              Show audio
            </a>
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
                      <Users className="w-2.5 h-2.5" />
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
            <h3 className="text-xs font-semibold text-gray-900">Activity Timeline</h3>
            <div className="flex gap-1">
              <button className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">All</button>
              <button className="text-xs px-1.5 py-0.5 text-gray-500 hover:bg-gray-100 rounded">System</button>
              <button className="text-xs px-1.5 py-0.5 text-gray-500 hover:bg-gray-100 rounded">Agent</button>
              <button className="text-xs px-1.5 py-0.5 text-gray-500 hover:bg-gray-100 rounded">Comments</button>
            </div>
          </div>

          <div className="space-y-3">
            {enhancedTask.activity.map((ev, index) => (
              <div key={ev.id} className="flex gap-3 group">
                <div className="flex-shrink-0">
                  <img 
                    src={ev.actor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(ev.actor.name)}&background=3b82f6&color=ffffff&size=24&bold=true&format=png`} 
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

// Data for different views
const agentViewData: TaskGroup[] = [
  {
    id: 'in-review',
    title: 'In Review',
    items: [
      {
        id: '2',
        title: 'Process Q4 vendor payments',
        tags: ['Payments', 'Q4'],
        meta: 'Dec 15',
        assignee: { id: 'rm', name: 'R. Mehta' },
        status: 'in-review',
        comments: 1
      },
      {
        id: '3',
        title: 'Review expense categorization for December',
        tags: ['Expenses', 'Review'],
        meta: 'Dec 15',
        assignee: { id: 'sk', name: 'S. Kumar' },
        status: 'in-review',
        attachments: 1
      },
      {
        id: '4',
        title: 'Update chart of accounts for new year',
        tags: ['GL', 'Maintenance'],
        meta: 'Dec 15',
        status: 'in-review'
      }
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    items: [
      {
        id: '5',
        title: 'Daily posting of bills in QBO',
        tags: ['QBO', 'Bills'],
        meta: 'Dec 15',
        assignee: { id: 'ap', name: 'A. Patel' },
        status: 'in-progress',
        comments: 1
      },
      {
        id: '6',
        title: 'Post December payroll entries',
        tags: ['Payroll', 'December'],
        meta: 'Dec 15',
        assignee: { id: 'ap', name: 'A. Patel' },
        status: 'in-progress',
        comments: 2
      },
      {
        id: '7',
        title: 'Bank reconciliation for HDFC current account',
        tags: ['Bank Rec', 'HDFC'],
        meta: 'Dec 15',
        assignee: { id: 'rm', name: 'R. Mehta' },
        status: 'in-progress',
        priority: 'medium'
      },
      {
        id: '8',
        title: 'Process Stripe payment reconciliations',
        tags: ['Stripe', 'Reconciliation'],
        meta: 'Dec 15',
        assignee: { id: 'sk', name: 'S. Kumar' },
        status: 'in-progress',
        comments: 1
      }
    ]
  },
  {
    id: 'todo',
    title: 'Todo',
    items: [
      {
        id: '8',
        title: 'Monthly financial close checklist',
        tags: ['Close', 'Monthly'],
        meta: 'Dec 15',
        status: 'todo',
        priority: 'high'
      },
      {
        id: '9',
        title: 'Prepare year-end tax documents',
        tags: ['Tax', 'Year-end'],
        meta: 'Dec 15',
        status: 'todo',
        priority: 'high'
      }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    items: [
      {
        id: '10',
        title: 'Process November invoices',
        tags: ['Invoices', 'November'],
        meta: 'Dec 14',
        assignee: { id: 'sk', name: 'S. Kumar' },
        status: 'done'
      },
      {
        id: '11',
        title: 'Update depreciation schedules',
        tags: ['Fixed Assets'],
        meta: 'Dec 14',
        assignee: { id: 'ap', name: 'A. Patel' },
        status: 'done'
      },
      {
        id: '12',
        title: 'Payroll verification (November)',
        tags: ['Payroll', 'Verification'],
        meta: 'Dec 13',
        assignee: { id: 'rm', name: 'R. Mehta' },
        status: 'done'
      },
      {
        id: '13',
        title: 'Auto-generate order-to-cash SOP (v0.1)',
        tags: ['SOP', 'Onboarding'],
        meta: 'Dec 12',
        assignee: { id: 'ap', name: 'A. Patel' },
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
        assignee: { id: 'rm', name: 'R. Mehta' },
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
        assignee: { id: 'rm', name: 'R. Mehta' },
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
          { id: 's3', title: 'Escalate to sales manager (S. Kumar)', done: false, owner: 'Controller (R. Mehta)', eta: '2025-09-21', type: 'manual' as const },
          { id: 's4', title: 'Flag to CFO if unpaid by Sep 30', done: false, owner: 'Controller (R. Mehta)', eta: '2025-09-30', type: 'manual' as const }
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
        assignee: { id: 'rm', name: 'R. Mehta' },
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
        meta: 'Dec 15',
        status: 'in-review',
        priority: 'high'
      },
      {
        id: '2',
        title: 'US collections ahead of plan +3%',
        tags: ['Collections', 'US'],
        meta: 'Dec 15',
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
        meta: 'Dec 15',
        status: 'in-progress',
        priority: 'high'
      },
      {
        id: '4',
        title: 'Payroll entries for August posted? (status check in progress)',
        tags: ['Payroll', 'Status'],
        meta: 'Dec 15',
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
        meta: 'Dec 15',
        status: 'todo',
        priority: 'high'
      },
      {
        id: '6',
        title: 'New chart of accounts rollout (Jan 1 target)',
        tags: ['GL', 'Rollout'],
        meta: 'Dec 15',
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
        meta: 'Dec 14',
        status: 'done'
      },
      {
        id: '8',
        title: 'Bank reconciliations for all accounts up-to-date',
        tags: ['Bank Rec', 'Complete'],
        meta: 'Dec 13',
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

  return (
    <div className="h-full flex flex-col bg-gray-50 w-full">
      <style>{`
        @keyframes loading-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
      {/* Enhanced Top Bar */}
      <div className="bg-white border-b border-gray-200 backdrop-blur-sm shadow-sm">
        <div className="px-6 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (isLoading) return;
                      
                      setIsLoading(true);
                      
                      // Demo: Add the Amazon reconciliation task after 5 seconds
                      setTimeout(() => {
                        const newTask = {
                          id: 'demo-1',
                          title: 'Reconcile Amazon sales with bank receipts',
                          tags: ['Reconciliation', 'Marketplace'],
                          meta: 'Just now',
                          assignee: { id: 'ap', name: 'A. Patel' },
                          status: 'in-review' as const,
                          comments: 0,
                          attachments: 0,
                          priority: 'high' as const,
                          dueDate: '2025-12-15T00:00:00Z',
                          confidence: 0.95,
                          createdFrom: {
                            type: 'chat_request',
                            source: 'User chat - CFO',
                            confidence: 0.95,
                            excerpt: '"Reconcile Amazon sales with bank receipts" — created from user chat request on 2025-09-18',
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
                    className="text-xs px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50"
                  >
                    <img src="/mobius-logo.png" alt="Aqqrue" className="w-4 h-4 mr-2" />
                    Ask Aqqrue "Reconcile Amazon sales with bank receipts"
                  </Button>
                  
                  {/* Loading Bar */}
                  {isLoading && (
                    <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full animate-[loading-bar_5s_linear_forwards]" />
                    </div>
                  )}
                </div>
              </div>
            <Select value={activeView} onValueChange={handleViewChange}>
              <SelectTrigger className="w-40 h-7 text-xs bg-white border-gray-300 shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent View</SelectItem>
                <SelectItem value="controller">Controller View</SelectItem>
                <SelectItem value="cfo">CFO View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="w-full">
          {/* Task Groups - Enhanced Linear-style Layout */}
          <div className="space-y-0">
            {groups.map((group) => (
              <div key={group.id} className="bg-white border-b border-gray-200 overflow-hidden">
                {/* Enhanced Section Header */}
                <div className="flex items-center justify-between py-2 px-3 bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleCollapse(group.id)}
                      className="h-5 w-5 p-0 hover:bg-gray-200 rounded-md"
                    >
                      {group.collapsed ? (
                        <ChevronRight className="w-3 h-3 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-gray-600" />
                      )}
                    </Button>
                    <h2 className="text-xs uppercase tracking-wide font-semibold text-gray-500">
                      {group.title}
                    </h2>
                    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full border-0 font-medium">
                      {group.items.length}
                    </Badge>
                  </div>
                </div>
                
                {/* Enhanced Task List */}
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
              console.log('Running task:', task.id);
              // In a real app, this would trigger the Aqqrue agent
              alert(`Running reconciliation for: ${task.title}`);
            }}
            onAssign={(task) => {
              console.log('Assigning task:', task.id);
              // In a real app, this would open an assignee picker
              alert(`Assigning task: ${task.title}`);
            }}
            onComment={(task) => {
              console.log('Commenting on task:', task.id);
              // In a real app, this would open a comment modal
              alert(`Adding comment to: ${task.title}`);
            }}
          />
        </>
      )}
    </div>
  );
};

export default TaskManagement;
