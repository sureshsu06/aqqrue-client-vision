import * as React from "react";
import { useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronDown, ChevronRight, FileText, Play, PauseCircle, CheckCircle2 } from "lucide-react";
import { PeriodRow, JournalEntryPreview, ScheduleType } from "@/types/schedules";
import { useToast } from "@/components/system/Toaster";
import { fakeCall } from "@/lib/fakeApi";
import { useCloseProgress } from "@/close/closeProgress";

type Props = {
  scheduleId: string;
  module: ScheduleType;
  onNextPostLabel?: (label: string) => void;
};

export default function PeriodsList({ scheduleId, module, onNextPostLabel }: Props) {
  const rows = useMemo(() => genMockPeriods(scheduleId), [scheduleId]);
  const [rowsState, setRowsState] = useState(rows);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const parentRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const { emit } = useCloseProgress();

  const monthOf = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
  };

  // Reset local state when scheduleId changes
  React.useEffect(() => setRowsState(rows), [rows]);

  // compute "Next post: ..."
  const next = rowsState.find(r => r.status === "PENDING");
  React.useEffect(() => {
    onNextPostLabel?.(next ? `${new Date(next.periodEnd).toLocaleDateString()} • ₹${fmt(rowsState[0]?.planned ?? 0)}` : "None");
  }, [next, rowsState, onNextPostLabel]);

  // Create flattened data with expanded content as separate items
  const flattenedData = useMemo(() => {
    const result: Array<{ type: 'row', data: PeriodRow } | { type: 'preview', data: PeriodRow }> = [];
    rowsState.forEach(row => {
      result.push({ type: 'row', data: row });
      if (open[row.id]) {
        result.push({ type: 'preview', data: row });
      }
    });
    return result;
  }, [rowsState, open]);

  const rowVirtualizer = useVirtualizer({
    count: flattenedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => {
      const item = flattenedData[i];
      return item.type === 'preview' ? 142 : 56; // Preview height vs row height
    }
  });

  return (
    <div ref={parentRef} className="h-[calc(100%-0px)] overflow-auto">
      <div className="relative" style={{ height: rowVirtualizer.getTotalSize() }}>
        {rowVirtualizer.getVirtualItems().map(vi => {
          const item = flattenedData[vi.index];
          if (!item) return null;

          if (item.type === 'preview') {
            // Preview row
            return (
              <div key={`preview-${item.data.id}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${vi.start}px)` }}>
                <JEPreview je={mockJE(item.data)} />
              </div>
            );
          }

          // Regular row
          const row = item.data;
          const isOpen = !!open[row.id];
          return (
            <div key={row.id} style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${vi.start}px)` }}>
              <Row
                row={row}
                isOpen={isOpen}
                onToggle={() => setOpen(p => ({ ...p, [row.id]: !p[row.id] }))}
                onPostNow={async () => {
                  // optimistic
                  const prev = rowsState;
                  setRowsState(prev.map(x => x.id === row.id ? { ...x, status: "POSTED", posted: x.planned } : x));
                  try {
                    await fakeCall(() => true);
                    emit({
                      type: "JE_POSTED",
                      month: monthOf(row.periodEnd),
                      module,
                      scheduleId: row.scheduleId,
                      periodId: row.id,
                      amount: row.planned,
                    });
                    toast("Posted journal entry");
                  } catch (e) {
                    setRowsState(prev); // revert
                    toast("Failed to post. Try again.");
                  }
                }}
                onHoldToggle={async () => {
                  const prev = rowsState;
                  const nextStatus = row.status === "HELD" ? "PENDING" : "HELD";
                  setRowsState(prev.map(x => x.id === row.id ? { ...x, status: nextStatus } : x));
                  try {
                    await fakeCall(() => true);
                    toast(nextStatus === "HELD" ? "Period held" : "Period released");
                  } catch {
                    setRowsState(prev);
                    toast("Failed to update period");
                  }
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({ 
  row, 
  isOpen, 
  onToggle, 
  onPostNow, 
  onHoldToggle 
}: { 
  row: PeriodRow; 
  isOpen: boolean; 
  onToggle: () => void;
  onPostNow: () => Promise<void>; 
  onHoldToggle: () => Promise<void>;
}) {
  const statusChip =
    row.status === "POSTED" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : row.status === "PENDING" ? "bg-blue-50 text-blue-700 border-blue-200"
    : row.status === "HELD" ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-white text-muted-foreground";

  return (
    <div className="border-b">
      <div className="flex items-center gap-3 px-3 py-3">
        <button onClick={onToggle} className="rounded p-1 hover:bg-white" aria-label={isOpen ? "Collapse" : "Expand"}>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        <div className="w-44 shrink-0 text-sm">
          <div className="font-medium">{fmtMonth(row.periodStart)}</div>
          <div className="text-xs text-muted-foreground">{toRange(row.periodStart, row.periodEnd)}</div>
        </div>

        <div className="w-28 shrink-0 text-right">
          <div className="text-sm">{money(row.planned)}</div>
          <div className="text-[11px] text-muted-foreground">Planned</div>
        </div>

        <div className="w-28 shrink-0 text-right">
          <div className="text-sm">{row.posted ? money(row.posted) : "—"}</div>
          <div className="text-[11px] text-muted-foreground">Posted</div>
        </div>

        <div className="w-24 shrink-0 text-right">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-[2px] text-xs ${statusChip}`}>
            {row.status === "POSTED" && <CheckCircle2 className="h-3.5 w-3.5" />}
            {row.status === "PENDING" && <Play className="h-3.5 w-3.5" />}
            {row.status === "HELD" && <PauseCircle className="h-3.5 w-3.5" />}
            {row.status}
          </span>
        </div>

        <div className="ml-4 flex gap-2 shrink-0">
          <button className="rounded-md border px-2 py-1 text-xs" onClick={onToggle}>Preview JE</button>
          {row.status === "PENDING" && (
            <button className="rounded-md border px-2 py-1 text-xs" onClick={onPostNow}>Post now</button>
          )}
          <button className="rounded-md border px-2 py-1 text-xs" onClick={onHoldToggle}>
            {row.status === "HELD" ? "Release" : "Hold"}
          </button>
        </div>
      </div>
    </div>
  );
}

function JEPreview({ je }: { je: JournalEntryPreview }) {
  return (
    <div className="mx-3 mb-3 rounded-md border bg-background p-3 text-sm">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <FileText className="h-4 w-4" /> Journal Entry Preview • {new Date(je.date).toLocaleDateString()}
      </div>
      <div className="grid grid-cols-12 gap-2 text-xs">
        <div className="col-span-6 font-medium">Account</div>
        <div className="col-span-3 text-right font-medium">Debit</div>
        <div className="col-span-3 text-right font-medium">Credit</div>
        {je.lines.map((l, i) => (
          <React.Fragment key={i}>
            <div className="col-span-6">{l.account}{l.memo ? <span className="text-muted-foreground"> — {l.memo}</span> : null}</div>
            <div className="col-span-3 text-right">{l.debit ? money(l.debit) : "—"}</div>
            <div className="col-span-3 text-right">{l.credit ? money(l.credit) : "—"}</div>
          </React.Fragment>
        ))}
      </div>
      {je.memo && <div className="mt-2 text-xs text-muted-foreground">Memo: {je.memo}</div>}
    </div>
  );
}

/* ---------- mock helpers ---------- */
function genMockPeriods(sid: string): PeriodRow[] {
  const base = 700 + (sid.charCodeAt(0) % 7) * 100; // just to vary amounts
  const months = 12;
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1);
  return Array.from({ length: months }).map((_, i) => {
    const ps = new Date(start.getFullYear(), i, 1);
    const pe = new Date(start.getFullYear(), i + 1, 0);
    const posted = i < today.getMonth() ? base : 0;
    const status: PeriodRow["status"] =
      i < today.getMonth() ? "POSTED" : i === today.getMonth() ? "PENDING" : "PENDING";
    return {
      id: `${sid}-${i}`,
      scheduleId: sid,
      periodStart: ps.toISOString(),
      periodEnd: pe.toISOString(),
      planned: base,
      posted,
      status,
      journalEntryId: posted ? `JE-${sid}-${i}` : undefined,
    };
  });
}
function mockJE(r: PeriodRow): JournalEntryPreview {
  return {
    id: `PREV-${r.id}`,
    date: r.periodEnd,
    memo: "Auto-recognized via schedule",
    lines: [
      { account: "Deferred Revenue", credit: r.planned },
      { account: "Revenue", debit: r.planned, memo: fmtMonth(r.periodStart) },
    ],
  };
}
function money(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
}
function fmt(v: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(v);
}
function fmtMonth(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", year: "numeric" });
}
function toRange(a: string, b: string) {
  const s = new Date(a).toLocaleDateString();
  const e = new Date(b).toLocaleDateString();
  return `${s} – ${e}`;
}