import { useState } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { Calendar, FileText, Settings, ArrowLeft, Search, X } from "lucide-react";
import SchedulesList from "@/components/schedules/SchedulesList";
import PeriodsList from "@/components/schedules/PeriodsList";
import RightDetails from "@/components/schedules/RightDetails";
import { ScheduleType } from "@/types/schedules";
import { listViews, saveView, deleteView, SchedulesView } from "@/lib/savedViews";
import { useToast } from "@/components/system/Toaster";

export default function SchedulesPage() {
  const [tab, setTab] = useState<ScheduleType>("Revenue");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [nextPostLabel, setNextPostLabel] = useState<string>("— —");
  const toast = useToast();
  const [statuses, setStatuses] = useState<Set<"active"|"paused"|"ended"|"error">>(new Set());
  const [nextDays, setNextDays] = useState<number | null>(null);
  const [views, setViews] = useState<SchedulesView[]>(() => listViews());
  const [viewId, setViewId] = useState<string | null>(null);

  function toggleStatus(s: "active"|"paused"|"ended"|"error") {
    setViewId(null);
    setStatuses(prev => {
      const n = new Set(prev);
      n.has(s) ? n.delete(s) : n.add(s);
      return n;
    });
  }
  function selectDays(d: number | null) { setViewId(null); setNextDays(d); }

  function onSaveView() {
    const name = prompt("Save view as:");
    if (!name) return;
    const v = saveView({ name, tab, query: search, statuses: Array.from(statuses), nextDays });
    setViews(listViews()); setViewId(v.id);
    toast("View saved");
  }
  function onLoadView(id: string) {
    const v = views.find(x => x.id === id); if (!v) return;
    setViewId(id);
    if (v.tab && v.tab !== tab) setTab(v.tab);
    setSearch(v.query); setStatuses(new Set(v.statuses)); setNextDays(v.nextDays);
    toast(`Loaded view: ${v.name}`);
  }
  function onDeleteView(id: string) {
    deleteView(id); setViews(listViews()); if (viewId === id) setViewId(null);
    toast("View deleted");
  }

  function Chip({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick: () => void }) {
    return (
      <button onClick={onClick}
        className={`rounded-full border px-2 py-[3px] text-xs ${active ? "bg-muted" : "hover:bg-muted/60"}`}>
        {children}
      </button>
    );
  }

  function ListHeader() {
    return (
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mobius-gray-500 w-4 h-4" />
            <input
              className="w-64 rounded-md border pl-10 pr-2 py-1.5 text-sm"
              placeholder="Search schedules…"
              value={search}
              onChange={(e) => { setViewId(null); setSearch(e.target.value); }}
            />
          </div>
          <div className="relative">
            <select
              className="rounded-md border bg-background px-2 py-1.5 text-sm"
              value={viewId ?? ""}
              onChange={(e)=> onLoadView(e.target.value)}
            >
              <option value="">Views…</option>
              {views.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            {viewId && (
              <button onClick={()=>onDeleteView(viewId)} className="absolute -right-6 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button className="rounded-md border px-2 py-1.5 text-sm" onClick={onSaveView}>Save</button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Status:</span>
          {(["active","paused","ended","error"] as const).map(s => (
            <Chip key={s} active={statuses.has(s)} onClick={()=>toggleStatus(s)}>{s}</Chip>
          ))}
          <span className="ml-3 text-xs text-muted-foreground">Next post:</span>
          <Chip active={nextDays===7} onClick={()=>selectDays(7)}>Next 7d</Chip>
          <Chip active={nextDays===30} onClick={()=>selectDays(30)}>Next 30d</Chip>
          <Chip active={nextDays===null} onClick={()=>selectDays(null)}>All</Chip>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Top bar – title + actions (match your app header vibe) */}
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-medium">Schedules</h1>
          <span className="text-sm text-muted-foreground">Manage recognition & deferrals</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm">
            <FileText className="h-4 w-4" /> Export
          </button>
          <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm">
            <Settings className="h-4 w-4" /> Settings
          </button>
        </div>
      </div>

      {/* Secondary nav – schedule types */}
      <div className="flex gap-2 border-b border-mobius-gray-200 px-3 pt-2">
        {(["Revenue","Prepaids","Depreciation","Amortization","Rent"] as ScheduleType[]).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setSelectedId(null); }}
            className={`relative py-3 px-6 text-sm font-medium transition-colors ${
              tab === t 
                ? "text-mobius-blue border-b-2 border-mobius-blue" 
                : "text-mobius-gray-700 hover:text-mobius-gray-900"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 2-pane layout */}
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left – list */}
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full border-r">
            <ListHeader />
            <div className="h-[calc(100%-120px)] overflow-auto p-2">
              <SchedulesList
                tab={tab}
                query={search}
                statuses={statuses}
                nextDays={nextDays}
                onSelect={(id) => setSelectedId(id)}
                selectedId={selectedId}
              />
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-white" />

        {/* Right – timeline */}
        <Panel defaultSize={60} minSize={40}>
          <div className="h-full">
            <SectionHeader title="Timeline" right={<BadgeNextPost label={nextPostLabel} />} />
            <div className="h-[calc(100%-44px)] overflow-auto p-4">
              {!selectedId ? (
                <Empty state="Select a schedule to see period postings." />
              ) : (
                <PeriodsList
                  scheduleId={selectedId}
                  module={tab}
                  onNextPostLabel={setNextPostLabel}
                />
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

/* --- tiny helpers to match your UI tone --- */
function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex h-11 items-center justify-between border-b px-3">
      <div className="text-sm font-medium">{title}</div>
      {right}
    </div>
  );
}
function BadgeNextPost({ label }: { label: string }) {
  return (
    <div className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
      Next post: {label}
    </div>
  );
}
function Empty({ state }: { state: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center text-sm text-muted-foreground">{state}</div>
    </div>
  );
}
function Card({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg border">
      <div className="flex items-center gap-2 border-b px-3 py-2 text-sm font-medium">
        {icon} <span>{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}
