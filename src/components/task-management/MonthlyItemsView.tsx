import React from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Task {
  id: string;
  title: string;
  tags: string[];
  meta: string; // due date text like "Every month — 10th"
  assignee?: {
    id: string;
    name: string; // "Aqqrue Agent" or controller name
    avatar?: string;
  };
  status: 'in-review' | 'in-progress' | 'todo' | 'done';
  priority?: 'high' | 'medium' | 'low';
}

interface TaskGroup {
  id: string;
  title: string;
  items: Task[];
  collapsed?: boolean;
}

const StatusIcon: React.FC<{ status: Task['status'] }> = ({ status }) => {
  switch (status) {
    case 'in-review':
      return <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />;
    case 'in-progress':
      return <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm" />;
    case 'todo':
      return <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-300" />;
    case 'done':
      return (
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
      );
    default:
      return <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-300" />;
  }
};

const TagSmall: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium border border-gray-300 text-gray-700">
    <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
    {children}
  </span>
);

const TaskRow: React.FC<{ task: Task }> = ({ task }) => {
  const tagsLower = task.tags.map(t => t.toLowerCase());
  const isAqqrue = (task.assignee?.name || '').toLowerCase().includes('aqqrue') || tagsLower.some(t => t.includes('aqqrue') || t.includes('agent'));
  const isController = (task.assignee?.name || '').toLowerCase().includes('controller') || tagsLower.some(t => t.includes('controller'));

  const fallbackInitials = task.assignee?.name
    ? task.assignee.name.split(' ').map(n => n[0]).join('')
    : (isController ? 'CT' : '');

  return (
    <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 w-full">
      <div className="flex items-center flex-1 min-w-0 mr-4">
        <div className="flex-shrink-0 mr-3">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={task.status === 'done'}
            readOnly
          />
        </div>
        <div className="flex-shrink-0 mr-3">
          <StatusIcon status={task.status} />
        </div>
        <div className="flex items-center flex-1 min-w-0 gap-3">
          <h3 className="text-xs font-medium text-gray-900 truncate">{task.title}</h3>
          {task.priority === 'high' && (
            <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-1">
          {task.tags.slice(0, 2).map((tag, i) => (
            <TagSmall key={i}>{tag}</TagSmall>
          ))}
        </div>
        <span className="text-xs text-gray-500 w-40 text-right truncate">{task.meta}</span>
        <div>
          {isAqqrue ? (
            <img src="/Favicon_Dark(1).png" alt="Aqqrue" className="w-6 h-6 rounded-full object-cover border border-gray-200" />
          ) : (
            <Avatar className="w-6 h-6 border border-gray-200">
              <AvatarImage src={task.assignee?.avatar || '/spencer.png'} alt={task.assignee?.name || 'Controller'} />
              <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-medium">
                {fallbackInitials}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </div>
  );
};

const monthlyGroups: TaskGroup[] = [
  // 1) Revenue & Receivables (Order-to-Cash)
  {
    id: 'revenue-otc',
    title: 'Revenue & Receivables (Order-to-Cash)',
    items: [
      { id: 'rev-1', title: 'Create & send subscription invoices (renewals, usage, services)', tags: ['Billing', 'Aqqrue', 'Monthly'], meta: 'Every month — 1st–3rd', status: 'in-progress' },
      { id: 'rev-2', title: 'Validate tax treatment on invoices (US sales tax, VAT, GST)', tags: ['Billing', 'Tax', 'Controller', 'Monthly'], meta: 'Every month — 3rd', status: 'todo' },
      { id: 'rev-3', title: 'Maintain revenue recognition schedules (ASC 606)', tags: ['Revenue', 'ASC606', 'Aqqrue', 'Monthly'], meta: 'Every month — 5th', status: 'in-progress', priority: 'high' },
      { id: 'rev-4', title: 'Review deferred revenue rollforward & unbilled AR', tags: ['Revenue', 'Controller', 'Monthly'], meta: 'Every month — 6th', status: 'todo' },
      { id: 'rev-5', title: 'Reconcile revenue per GL vs billing system', tags: ['Revenue', 'Reconciliation', 'Controller', 'Monthly'], meta: 'Every month — 7th', status: 'todo' },
      { id: 'rev-6', title: 'AR aging review & collections follow-ups', tags: ['Collections', 'Controller', 'Weekly'], meta: 'Every week — Tue', status: 'in-review' },
      { id: 'rev-7', title: 'Cash application: apply customer payments', tags: ['Cash App', 'Aqqrue', 'Daily'], meta: 'Daily', status: 'in-progress' },
      { id: 'rev-8', title: 'Reconcile Stripe payouts to GL (Stripe Clearing → Bank)', tags: ['Stripe', 'Reconciliation', 'Aqqrue', 'Weekly'], meta: 'Every week — Fri', status: 'in-progress' },
    ],
  },

  // 2) Expenses & Payables (Procure-to-Pay)
  {
    id: 'expenses-ptp',
    title: 'Expenses & Payables (Procure-to-Pay)',
    items: [
      { id: 'exp-1', title: 'Capture & categorize vendor bills (OCR/email)', tags: ['AP', 'Aqqrue', 'Weekly'], meta: 'Every week — Mon/Wed', status: 'in-progress' },
      { id: 'exp-2', title: 'PO/3-way match (where applicable)', tags: ['AP', 'Controller', 'Weekly'], meta: 'Every week — Wed', status: 'todo' },
      { id: 'exp-3', title: 'Route bills for approval', tags: ['AP', 'Controller', 'Weekly'], meta: 'Every week — Thu', status: 'in-review' },
      { id: 'exp-4', title: 'Schedule & process payments (ACH/wire/card)', tags: ['AP', 'Payments', 'Controller', 'Weekly'], meta: 'Every week — Fri', status: 'todo' },
      { id: 'exp-5', title: 'Code bills to GL, departments, cost centers', tags: ['AP', 'GL', 'Aqqrue', 'Monthly'], meta: 'Every month — 8th', status: 'in-progress' },
      { id: 'exp-6', title: 'Approve employee reimbursements (Expensify/Ramp)', tags: ['T&E', 'Controller', 'Monthly'], meta: 'Every month — 9th', status: 'todo' },
      { id: 'exp-7', title: 'Record monthly expense accruals', tags: ['Accruals', 'Controller', 'Monthly'], meta: 'Every month — 11th', status: 'todo', priority: 'high' },
      { id: 'exp-8', title: 'Amortize prepaids (SaaS, insurance, etc.)', tags: ['Prepaid', 'Aqqrue', 'Monthly'], meta: 'Every month — 11th', status: 'in-progress' },
    ],
  },

  // 3) Banking, Cash & Treasury
  {
    id: 'banking-treasury',
    title: 'Banking, Cash & Treasury',
    items: [
      { id: 'bnk-1', title: 'Reconcile operating & other bank accounts', tags: ['Bank Rec', 'Aqqrue', 'Weekly'], meta: 'Every week — Mon', status: 'in-progress' },
      { id: 'bnk-2', title: 'Monitor balances, transfers, uncleared items', tags: ['Treasury', 'Controller', 'Daily'], meta: 'Daily', status: 'in-review' },
      { id: 'bnk-3', title: '13-week cash flow forecast update', tags: ['Cash Flow', 'Controller', 'Weekly'], meta: 'Every week — Thu', status: 'todo' },
      { id: 'bnk-4', title: 'Match merchant fees/refunds/disputes', tags: ['Stripe', 'Aqqrue', 'Monthly'], meta: 'Every month — 10th', status: 'in-progress' },
    ],
  },

  // 4) Payroll & People Costs
  {
    id: 'payroll-people',
    title: 'Payroll & People Costs',
    items: [
      { id: 'pay-1', title: 'Process payroll & post JEs (Gusto/Rippling/Deel)', tags: ['Payroll', 'Aqqrue', 'Monthly'], meta: 'Every month — 9th', status: 'in-progress' },
      { id: 'pay-2', title: 'Record benefits, employer taxes, commissions', tags: ['Payroll', 'Controller', 'Monthly'], meta: 'Every month — 10th', status: 'todo' },
      { id: 'pay-3', title: 'Accrue PTO/vacation & SBC expense (ASC 718)', tags: ['Payroll', 'SBC', 'Controller', 'Monthly'], meta: 'Every month — 11th', status: 'todo' },
      { id: 'pay-4', title: 'Reconcile payroll liabilities & clearing', tags: ['Payroll', 'Reconciliation', 'Controller', 'Monthly'], meta: 'Every month — 12th', status: 'todo' },
    ],
  },

  // 5) General Ledger & Month-End Close
  {
    id: 'gl-close',
    title: 'General Ledger & Month-End Close',
    items: [
      { id: 'gl-1', title: 'Record recurring JEs (depr, amort, accruals)', tags: ['GL', 'Aqqrue', 'Monthly'], meta: 'Every month — 11th', status: 'in-progress' },
      { id: 'gl-2', title: 'Reconcile AR/AP, deferred revenue/prepaid, intercompany', tags: ['GL', 'Reconciliation', 'Controller', 'Monthly'], meta: 'Every month — 12th', status: 'todo' },
      { id: 'gl-3', title: 'Investigate & clear suspense accounts', tags: ['GL', 'Controller', 'Monthly'], meta: 'Every month — 12th', status: 'todo' },
      { id: 'gl-4', title: 'Prepare trial balance; lock prior period', tags: ['Close', 'Controller', 'Monthly'], meta: 'Every month — 13th', status: 'in-review', priority: 'high' },
    ],
  },

  // 6) Financial Reporting & Management
  {
    id: 'reporting-mgmt',
    title: 'Financial Reporting & Management',
    items: [
      { id: 'fr-1', title: 'Prepare P&L, Balance Sheet, Cash Flow', tags: ['Reporting', 'Controller', 'Monthly'], meta: 'Every month — 14th', status: 'todo' },
      { id: 'fr-2', title: 'Actuals vs Budget; Dept level reporting', tags: ['Reporting', 'Controller', 'Monthly'], meta: 'Every month — 15th', status: 'todo' },
      { id: 'fr-3', title: 'Board/investor update package', tags: ['Reporting', 'Controller', 'Monthly'], meta: 'Every month — 16th', status: 'todo' },
      { id: 'fr-4', title: 'SaaS metrics (MRR/ARR/NRR/GRR, GM, CAC/LTV)', tags: ['SaaS Metrics', 'Aqqrue', 'Monthly'], meta: 'Every month — 15th', status: 'in-progress' },
    ],
  },

  // 7) Fixed Assets & CapEx
  {
    id: 'fixed-assets',
    title: 'Fixed Assets & CapEx',
    items: [
      { id: 'fa-1', title: 'Record capitalized purchases & disposals', tags: ['Fixed Assets', 'Controller', 'Monthly'], meta: 'Every month — 17th', status: 'todo' },
      { id: 'fa-2', title: 'Update fixed asset register; post depreciation', tags: ['Fixed Assets', 'Aqqrue', 'Monthly'], meta: 'Every month — 18th', status: 'in-progress' },
    ],
  },

  // 8) Tax, Compliance & Regulatory
  {
    id: 'tax-compliance',
    title: 'Tax, Compliance & Regulatory',
    items: [
      { id: 'tax-1', title: 'Sales tax/VAT/GST filings (as applicable)', tags: ['Tax', 'Controller', 'Monthly'], meta: 'Monthly/Quarterly — jurisdiction dependent', status: 'in-review' },
      { id: 'tax-2', title: 'Nexus tracking & registrations review', tags: ['Tax', 'Controller', 'Quarterly'], meta: 'Every quarter — Q-end+10d', status: 'todo' },
      { id: 'tax-3', title: 'Franchise/other statutory obligations review', tags: ['Tax', 'Controller', 'Annual'], meta: 'Annually — Mar/Apr', status: 'todo' },
    ],
  },

  // 9) Audit, Controls & Governance
  {
    id: 'audit-controls',
    title: 'Audit, Controls & Governance',
    items: [
      { id: 'aud-1', title: 'Maintain audit-ready schedules (PBC by GL account)', tags: ['Audit', 'Aqqrue', 'Monthly'], meta: 'Every month — 19th', status: 'in-progress' },
      { id: 'aud-2', title: 'Quarterly close checklist & sign-offs', tags: ['Close', 'Controller', 'Quarterly'], meta: 'Quarterly — Q-end+10d', status: 'todo' },
      { id: 'aud-3', title: 'Review internal controls & approval matrix', tags: ['Controls', 'Controller', 'Quarterly'], meta: 'Quarterly — Q-end+15d', status: 'todo' },
    ],
  },

  // 10) Automation & Systems Integration
  {
    id: 'automation-systems',
    title: 'Automation & Systems Integration',
    items: [
      { id: 'sys-1', title: 'Syncs across Stripe/Xero/QBO/Payroll/FP&A', tags: ['Systems', 'Aqqrue', 'Daily'], meta: 'Daily', status: 'in-progress' },
      { id: 'sys-2', title: 'Review failed/missing syncs & rerun jobs', tags: ['Systems', 'Aqqrue', 'Weekly'], meta: 'Every week — Daily check', status: 'in-review' },
      { id: 'sys-3', title: 'Automate JE posting where confidence > threshold', tags: ['Automation', 'Aqqrue', 'Monthly'], meta: 'Every month — 8th', status: 'todo' },
      { id: 'sys-4', title: 'Train model with user corrections', tags: ['AI', 'Aqqrue', 'Monthly'], meta: 'Every month — 20th', status: 'todo' },
    ],
  },
];

interface MonthlyItemsViewProps {
  onBack?: () => void;
}

const MonthlyItemsView: React.FC<MonthlyItemsViewProps> = ({ onBack }) => {
  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="w-full">
        <div className="space-y-0">
          {monthlyGroups.map((group) => (
            <div key={group.id} className="bg-white">
              <div className="py-2 px-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                    <h2 className="text-xs font-semibold text-gray-900">{group.title}</h2>
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-medium">
                      {group.items.length}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md flex-shrink-0">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {group.items.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyItemsView;


