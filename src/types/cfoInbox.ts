export interface CFOInboxItem {
  id: string;
  createdAt: string;
  category: 'ARR' | 'Cash' | 'Spend' | 'People' | 'Close' | 'Ops';
  title: string;
  entity: string;
  impact: {
    amount: number;
    currency: 'USD' | 'INR';
    metric: string;
    direction: 'positive' | 'negative';
  };
  urgency: {
    dueInDays: number;
    isOverdue: boolean;
  };
  confidence: number;
  priorityScore: number;
  status: 'new' | 'in_progress' | 'blocked' | 'snoozed' | 'done';
  owner: {
    suggested: string;
    assigned?: string;
    watchers?: string[];
  };
  why: string;
  assumptions: string[];
  sources: Source[];
  recommendations: Recommendation[];
  severity: 'high' | 'medium' | 'low';
  dataFreshness: string;
  policyBreach?: {
    threshold: number;
    current: number;
    policy: string;
  };
}

export interface Source {
  system: string;
  type: string;
  id: string;
  link: string;
  lastUpdated: string;
}

export interface Recommendation {
  id: string;
  label: string;
  estimatedImpact: number;
  probability: number;
  action: string;
  playbook: string;
}

export interface CFOInboxFilters {
  priority: 'all' | 'high' | 'medium' | 'low';
  category: 'all' | 'ARR' | 'Cash' | 'Spend' | 'People' | 'Close' | 'Ops';
  entity: 'all' | string;
  owner: 'all' | string;
  dueToday: boolean;
  status: 'all' | 'new' | 'in_progress' | 'blocked' | 'snoozed' | 'done';
}

export interface CFOInboxSort {
  field: 'priorityScore' | 'dueTime' | 'impact' | 'newest';
  direction: 'asc' | 'desc';
}

export interface CFOInboxStats {
  total: number;
  new: number;
  highPriority: number;
  dueToday: number;
  overdue: number;
  byCategory: Record<string, number>;
}
