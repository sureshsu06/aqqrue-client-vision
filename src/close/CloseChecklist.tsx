import * as React from "react";
import { percentComplete, useCloseProgress } from "./closeProgress";
import { X, CheckCircle2, Circle, AlertTriangle, ExternalLink } from "lucide-react";
import { createPortal } from "react-dom";

export function CloseStatus() {
  const { state } = useCloseProgress();
  const [open, setOpen] = React.useState(false);
  const pct = percentComplete(state);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
        title="Close progress"
      >
        <span className="font-medium">Close</span>
        <span className="rounded-full bg-muted px-2 py-[2px] text-xs">{pct}%</span>
      </button>
      <ChecklistDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function ChecklistDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, emit } = useCloseProgress();
  const pct = percentComplete(state);

  React.useEffect(() => {
    function onEsc(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const handleStatusClick = (item: Item) => {
    if (item.id === "controller-signoff") {
      // For manual items, toggle the status
      emit({ type: "MANUAL_CHECKED", id: item.id, done: !item.done });
    } else if (item.id === "exceptions") {
      // For exceptions, we can't directly change the status as it's calculated
      // But we could emit an event to reset or adjust exceptions
      console.log("Exceptions status is calculated and cannot be manually changed");
    } else {
      // For other items, we could implement status toggling if needed
      console.log(`Status change for ${item.id} not implemented`);
    }
  };

  if (!open) return null;
  const items = buildChecklist(state, emit);

  return createPortal(
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-[400px] max-w-[92vw] bg-background shadow-xl border-l">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <div className="text-sm font-medium">Month-end Close</div>
            <div className="text-xs text-muted-foreground">Progress: {pct}% • {state.month}</div>
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-muted" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((it) => (
                  <tr key={it.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium">{it.title}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleStatusClick(it)}
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors hover:opacity-80"
                          title={it.done ? "Click to mark as pending" : "Click to mark as done"}
                        >
                          {it.done ? (
                            <span className="bg-emerald-100 text-emerald-800">
                              Done
                            </span>
                          ) : it.warn ? (
                            <span className="bg-amber-100 text-amber-800">
                              Attention
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-800">
                              Pending
                            </span>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs text-muted-foreground">{it.subtitle}</div>
                      {it.footer && (
                        <div className="mt-2">{it.footer}</div>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {it.cta && (
                        <a
                          href={it.cta.href}
                          onClick={it.cta.onClick ?? undefined}
                          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
                        >
                          {it.cta.label} <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-3 text-xs text-muted-foreground">
          Tip: In demos, you can run <code>_emitCloseEvent(&#123;...&#125;)</code> in the console to advance items.
        </div>
      </aside>
    </div>,
    document.body
  );
}

/* ---------- checklist definition ---------- */
type Item = {
  id: string;
  title: string;
  subtitle?: string;
  done: boolean;
  warn?: boolean;
  cta?: { label: string; href: string; onClick?: (e: React.MouseEvent) => void };
  footer?: React.ReactNode;
};

function buildChecklist(
  s: import("./closeProgress").CloseState,
  emit: (e: import("./closeProgress").CloseEvent) => void
): Item[] {
  const posted = Object.values(s.postedByModule).reduce((a, b) => a + b, 0);
  const postings: Item = {
    id: "postings",
    title: "Post month's schedules",
    subtitle: `Revenue/Prepaids/Depn/Rent • ${posted} JE(s) posted`,
    done: posted > 0,
    cta: { label: "Open Schedules", href: "/schedules" }
  };

  const exceptions: Item = {
    id: "exceptions",
    title: "Exceptions under control",
    subtitle: s.exceptionsOpen <= 3 ? `Open: ${s.exceptionsOpen}` : `Open: ${s.exceptionsOpen} (target ≤ 3)`,
    done: s.exceptionsOpen <= 3,
    warn: s.exceptionsOpen > 3,
    cta: { label: "View Exceptions", href: "/exceptions" }
  };

  const docs: Item = {
    id: "docs",
    title: "Attach supporting documents",
    subtitle: `${s.docsAttachedIds.size} attachment(s) linked`,
    done: s.docsAttachedIds.size > 0,
    cta: { label: "Go to Documents", href: "/schedules?tab=docs" }
  };

  const packet: Item = {
    id: "packet",
    title: "Generate audit packet",
    subtitle: s.auditPackets.size > 0 ? "Generated" : "Not generated",
    done: s.auditPackets.size > 0,
    cta: { label: s.auditPackets.size ? "Open Schedules" : "Generate", href: "/schedules" }
  };

  const manualId = "controller-signoff";
  const manual: Item = {
    id: manualId,
    title: "Controller sign-off",
    subtitle: s.manual[manualId] ? "Signed" : "Pending approval",
    done: !!s.manual[manualId],
    footer: (
      <div className="mt-2">
        <button
          className="rounded-md border px-2 py-1 text-xs"
          onClick={() => emit({ type: "MANUAL_CHECKED", id: manualId, done: !s.manual[manualId] })}
        >
          {s.manual[manualId] ? "Mark as not done" : "Mark complete"}
        </button>
      </div>
    ),
  };

  return [postings, exceptions, docs, packet, manual];
} 