import React from "react";
import { useCloseProgress, percentComplete } from "@/close/closeProgress";
import { CheckCircle2, Circle, AlertTriangle, ExternalLink, FileText, Settings, ChevronDown, Calendar } from "lucide-react";

export default function CloseChecklist() {
  const { state, emit } = useCloseProgress();
  const pct = percentComplete(state);

  const items = [
    {
      id: "postings",
      title: "Post month's schedules",
      description: `${Object.values(state.postedByModule).reduce((a, b) => a + b, 0)}/23 periods posted • Rev ${state.postedByModule["Revenue"] || 0}/10 · PPD ${state.postedByModule["Prepaids"] || 0}/5 · Depn ${state.postedByModule["Depreciation"] || 0}/6 · Rent ${state.postedByModule["Rent"] || 0}/2`,
      done: Object.values(state.postedByModule).reduce((a, b) => a + b, 0) > 0,
      owner: "Controller",
      due: "2025-08-31",
      updated: "today 1:14 pm",
      cta: { label: "Open Schedules", href: "/schedules" }
    },
    {
      id: "exceptions",
      title: "Exceptions under control",
      description: `${state.exceptionsOpen} open (target ≤3) • No invoice (4) · Duplicate (1) · Policy (1)`,
      done: state.exceptionsOpen <= 3,
      warn: state.exceptionsOpen > 3,
      owner: "Controller",
      due: "2025-08-31",
      updated: "today 1:14 pm",
      cta: { label: "View Exceptions", href: "/exceptions" }
    },
    {
      id: "docs",
      title: "Attach supporting documents",
      description: (
        <div className="text-sm text-gray-600">
          {state.docsAttachedIds.size} attachments linked to posted JEs • 
          <button className="text-blue-600 hover:text-blue-800 underline ml-1">Download all docs</button>
        </div>
      ),
      done: state.docsAttachedIds.size > 0,
      owner: "Controller",
      due: "2025-08-31",
      updated: "today 1:14 pm",
      cta: { label: "Go to Documents", href: "/schedules?tab=docs" }
    },
    {
      id: "packet",
      title: "Generate audit packet",
      description: `Audit packet: ${state.auditPackets.size > 0 ? 'generated' : 'not generated'}.`,
      done: state.auditPackets.size > 0,
      owner: "Controller",
      due: "2025-08-31",
      updated: "today 1:14 pm",
      cta: { label: state.auditPackets.size ? "Open Schedules" : "Generate", href: "/schedules" }
    },
    {
      id: "bank-reconciliation",
      title: "Bank reconciliation complete",
      description: "All bank accounts reconciled and differences resolved.",
      done: state.exceptionsOpen <= 2, // Assume bank rec is done if exceptions are low
      owner: "Accountant",
      due: "2025-08-31",
      updated: "today 2:30 pm",
      cta: { label: "Open Ledger", href: "/ledger" }
    },
    {
      id: "intercompany",
      title: "Intercompany eliminations",
      description: "Intercompany transactions identified and eliminated.",
      done: false,
      owner: "Controller",
      due: "2025-08-31",
      updated: "today 3:15 pm",
      cta: { label: "View Transactions", href: "/ledger" }
    },
    {
      id: "accruals",
      title: "Accruals and prepayments",
      description: "Month-end accruals and prepayment adjustments posted.",
      done: false,
      owner: "Accountant",
      due: "2025-08-31",
      updated: "today 4:00 pm",
      cta: { label: "Post Accruals", href: "/schedules" }
    },
    {
      id: "fixed-assets",
      title: "Fixed asset depreciation",
      description: `Depreciation: ${state.postedByModule["Depreciation"] || 0} entries posted for all asset classes.`,
      done: (state.postedByModule["Depreciation"] || 0) > 0,
      owner: "Accountant",
      due: "2025-08-31",
      updated: "today 4:45 pm",
      cta: { label: "Open Fixed Assets", href: "/fixed-assets" }
    },
    {
      id: "provisions",
      title: "Provisions and contingencies",
      description: "Bad debt, warranty, and other provisions reviewed.",
      done: false,
      owner: "Controller",
      due: "2025-08-31",
      updated: "today 5:00 pm",
      cta: { label: "Review Provisions", href: "/ledger" }
    },
    {
      id: "tax-calculations",
      title: "Tax calculations",
      description: "Current and deferred tax calculations completed.",
      done: false,
      owner: "Tax Accountant",
      due: "2025-08-31",
      updated: "today 5:30 pm",
      cta: { label: "Tax Worksheet", href: "/ledger" }
    },
    {
      id: "trial-balance",
      title: "Trial balance review",
      description: "Trial balance reviewed and unusual items investigated.",
      done: false,
      owner: "Controller",
      due: "2025-08-31",
      updated: "today 6:00 pm",
      cta: { label: "View Trial Balance", href: "/ledger" }
    },
    {
      id: "management-review",
      title: "Management review",
      description: "Financial statements reviewed by management team.",
      done: false,
      owner: "CFO",
      due: "2025-08-31",
      updated: "today 6:30 pm",
      cta: { label: "Review Statements", href: "/ledger" }
    },
    {
      id: "controller-signoff",
      title: "Controller sign-off",
      description: state.manual["controller-signoff"] ? "Signed off" : "Pending approval",
      done: !!state.manual["controller-signoff"],
      owner: "Controller",
      due: "2025-08-31",
      updated: "today 1:14 pm",
      footer: (
        <button
          className="rounded-md border px-2 py-1 text-xs"
          onClick={() => emit({ type: "MANUAL_CHECKED", id: "controller-signoff", done: !state.manual["controller-signoff"] })}
        >
          {state.manual["controller-signoff"] ? "Mark as not done" : "Mark complete"}
        </button>
      ),
    }
  ];

  const doneCount = items.filter(item => item.done).length;
  const totalCount = items.length;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top bar – title + actions (match your app header vibe) */}
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-medium">Close Checklist</h1>
          <span className="text-sm text-muted-foreground">Month-end close progress</span>
          
          {/* Month dropdown */}
          <div className="relative">
            <select className="appearance-none rounded-md border bg-background pl-8 pr-8 py-1.5 text-sm">
              <option>{state.month}</option>
              <option>Jul-2025</option>
              <option>Jun-2025</option>
            </select>
            <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Progress chip */}
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
            <span className="font-medium">Progress</span>
            <span className={`rounded-full px-2 py-[2px] text-xs ${
              doneCount === totalCount 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {doneCount === totalCount ? 'Audit-ready' : `${pct}%`}
            </span>
          </div>
          <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm">
            <FileText className="h-4 w-4" /> {doneCount === totalCount ? 'Download packet' : 'Export'}
          </button>
          <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm">
            <Settings className="h-4 w-4" /> Settings
          </button>
        </div>
      </div>

      {/* Progress bar + last updated */}
      <div className="sticky top-0 z-10 bg-white border-b px-3 py-2">
        {doneCount === totalCount && (
          <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">Audit-ready • 100%</span>
              </div>
              <span className="text-xs text-emerald-600">All checklist items completed</span>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{doneCount}/{totalCount} items complete</span>
            <span className="text-sm font-medium text-blue-600">{pct}%</span>
          </div>
          <span className="text-xs text-muted-foreground">Last updated 2m ago</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${pct}%` }}
          ></div>
        </div>
      </div>

      {/* Checklist Table */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Checklist Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Due
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[180px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item, index) => (
                <tr key={item.id} className={`h-13 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      {item.done ? (
                        <span 
                          className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800"
                          title="Task completed successfully"
                        >
                          Done
                        </span>
                      ) : item.warn ? (
                        <span 
                          className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 cursor-help"
                          title={`Exceptions open > target (${state.exceptionsOpen} > 3)`}
                        >
                          Attention
                        </span>
                      ) : (
                        <span 
                          className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800"
                          title="Task pending completion"
                        >
                          Pending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{item.description}</div>
                    {item.footer && (
                      <div className="mt-2">{item.footer}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">C</span>
                      </div>
                      <span className="text-sm text-gray-900">{item.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      new Date(item.due) < new Date() 
                        ? 'bg-red-100 text-red-800' 
                        : new Date(item.due) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {new Date(item.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600" title="today 1:14 pm">2m ago</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {item.cta && (
                      <a
                        href={item.cta.href}
                        className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        aria-label={item.cta.label}
                      >
                        {item.cta.label} <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 