import * as React from "react";
import { useMemo, useRef, useState } from "react";
import { useReactTable, getCoreRowModel, ColumnDef } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CheckCircle2, Pause, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { ScheduleRow, ScheduleType } from "@/types/schedules";
import RightDetails from "./RightDetails";
import { fakeCall } from "@/lib/fakeApi";

type Props = {
  tab: ScheduleType;
  query: string;
  statuses: Set<"active"|"paused"|"ended"|"error">;
  nextDays: number | null;
  onSelect: (id: string) => void;
  selectedId?: string | null;
};

export default function SchedulesList({ tab, query, statuses, nextDays, onSelect, selectedId }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [state, setState] = React.useState<{data:ScheduleRow[]; loading:boolean; error:string | null}>({
    data: [], loading: true, error: null
  });
  const parentRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let alive = true;
    setState(s => ({ ...s, loading: true, error: null }));
    fakeCall(() => {
      const now = new Date();
      const within = (iso?: string) => {
        if (!nextDays || !iso) return true;
        const d = new Date(iso);
        const diff = Math.ceil((+d - +now) / (1000*60*60*24));
        return diff >= 0 && diff <= nextDays;
      };
      return demoData
        .filter(d => d.type === tab)
        .filter(d => !query || (d.name + " " + (d.ref ?? "")).toLowerCase().includes(query.toLowerCase()))
        .filter(d => statuses.size ? statuses.has(d.status) : true)
        .filter(d => within(d.nextPostDate));
    }, 0.0, 320).then(res => {
      if (!alive) return;
      setState({ data: res, loading: false, error: null });
    }).catch(e => {
      if (!alive) return;
      setState({ data: [], loading: false, error: e.message || "Error" });
    });
    return () => { alive = false; };
  }, [tab, query, nextDays, statuses]);

  // Create flattened data with expanded content as separate items
  const flattenedData = useMemo(() => {
    const result: Array<{ type: 'row', data: ScheduleRow } | { type: 'preview', data: ScheduleRow }> = [];
    state.data.forEach(row => {
      result.push({ type: 'row', data: row });
      if (expandedId === row.id) {
        result.push({ type: 'preview', data: row });
      }
    });
    return result;
  }, [state.data, expandedId]);

  const rowVirtualizer = useVirtualizer({
    count: flattenedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => {
      const item = flattenedData[i];
      return item.type === 'preview' ? 500 : 56; // Preview height vs row height - increased from 142 to 500
    }
  });

  if (state.loading) return <SkeletonList />;
  if (state.error) return <ErrorView msg={state.error} onRetry={() => setState(s=>({...s, loading:true}))} />;

  const data = state.data;

  return (
    <div ref={parentRef} className="h-[calc(100%-44px)] overflow-auto">
      {/* Column Headers */}
      <div className="sticky top-0 z-10 bg-white border-b border-mobius-gray-200">
        <div className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-mobius-gray-600">
          <div className="min-w-0 flex-1">Name</div>
          <div className="w-[92px] shrink-0 text-right">Monthly</div>
          <div className="w-[92px] shrink-0 text-right">Recog.</div>
          <div className="w-[92px] shrink-0 text-right">Remain.</div>
          <div className="w-[92px] shrink-0 text-right">Next</div>
          <div className="w-[84px] shrink-0 text-right">Status</div>
        </div>
      </div>

      <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
        {rowVirtualizer.getVirtualItems().map(vi => {
          const item = flattenedData[vi.index];
          if (!item) return null;

          if (item.type === 'preview') {
            // Preview row
            return (
              <div key={`preview-${item.data.id}`} style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${vi.start}px)` }}>
                <RightDetails scheduleId={item.data.id} />
              </div>
            );
          }

          // Regular row
          const row = item.data;
          const isOpen = expandedId === row.id;

          return (
            <div key={row.id} style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${vi.start}px)` }}>
              <div
                className={`flex cursor-pointer items-center gap-3 border-b px-3 py-3 text-sm hover:bg-white/60 ${selectedId === row.id ? "bg-white" : ""}`}
                onClick={() => onSelect(row.id)}
              >
                {/* Expand/Collapse button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedId(isOpen ? null : row.id);
                  }}
                  className="flex-shrink-0 p-1 hover:bg-mobius-gray-100 rounded"
                >
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-mobius-gray-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-mobius-gray-600" />
                  )}
                </button>

                {/* first two columns */}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{row.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {row.ref ?? "—"} • {row.type}
                  </div>
                </div>

                {/* rest as compact cells */}
                <Cell label="Monthly" value={money(row.monthly ?? 0)} />
                <Cell label="Recog." value={money(row.recognizedToDate)} />
                <Cell label="Remain." value={money(row.remaining)} />
                <Cell label="Next" value={date(row.nextPostDate)} />
                <StatusBadge s={row.status} flags={row.flags} />
              </div>
            </div>
          );
        })}
      </div>
      {data.length === 0 && !state.loading && !state.error && (
        <div className="p-6 text-center text-sm text-muted-foreground">
          No schedules match your filters.
        </div>
      )}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="divide-y">
      {Array.from({length: 8}).map((_,i)=>(
        <div key={i} className="flex items-center gap-3 px-3 py-3">
          <div className="h-4 w-4 rounded bg-muted" />
          <div className="h-4 w-40 rounded bg-muted" />
          <div className="ml-auto flex gap-4">
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorView({ msg, onRetry }: { msg: string; onRetry: () => void }) {
  return (
    <div className="p-4 text-center">
      <div className="text-sm text-red-600">Failed to load: {msg}</div>
      <button className="mt-2 rounded-md border px-2 py-1 text-xs" onClick={onRetry}>Retry</button>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-[92px] shrink-0 text-right">
      <div className="truncate">{value}</div>
    </div>
  );
}

function StatusBadge({ s, flags }: { s: ScheduleRow["status"]; flags?: string[] }) {
  const warn = (flags?.length ?? 0) > 0 || s === "error";
  return (
    <div className="flex w-[84px] shrink-0 items-center justify-end gap-1">
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-[2px] text-xs
        ${s === "active" ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : s === "paused" ? "bg-amber-50 border-amber-200 text-amber-700"
          : s === "ended" ? "bg-white text-muted-foreground"
          : "bg-red-50 border-red-200 text-red-700"}`}>
        {s === "active" && <CheckCircle2 className="h-3.5 w-3.5" />}
        {s === "paused" && <Pause className="h-3.5 w-3.5" />}
        {(s === "error" || warn) && <AlertTriangle className="h-3.5 w-3.5" />}
        {s}
      </span>
      {warn && <span className="text-[11px] text-amber-600">{flags?.length ?? 0}</span>}
    </div>
  );
}

function money(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
}
function date(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString();
}

/* ---- demo data ---- */
const demoData: ScheduleRow[] = [
  { id: "s1", type: "Revenue", name: "Bishop Wisecarver", ref: "CNTR-1001", monthly: 702, recognizedToDate: 0, remaining: 7020, nextPostDate: "2025-08-31", status: "active" },
  { id: "s2", type: "Revenue", name: "MARKETview Technology", ref: "CNTR-3021", monthly: 789.47, recognizedToDate: 2105.26, remaining: 27894.74, nextPostDate: "2025-08-31", status: "active" },
  { id: "s3", type: "Revenue", name: "Sera", ref: "CNTR-4440", monthly: 7916.67, recognizedToDate: 0, remaining: 95000, nextPostDate: "2025-08-31", status: "paused", flags: ["gap"] },
  { id: "p1", type: "Prepaids", name: "AWS Credits", ref: "PPD-100", monthly: 12000, recognizedToDate: 36000, remaining: 24000, nextPostDate: "2025-08-15", status: "active" },
  { id: "d1", type: "Depreciation", name: "Macbooks FY25 Lot A", ref: "FA-2025-17", monthly: 45000, recognizedToDate: 135000, remaining: 315000, nextPostDate: "2025-08-31", status: "active" },
]; 