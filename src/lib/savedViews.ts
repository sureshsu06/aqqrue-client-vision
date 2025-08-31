import { ScheduleType } from "@/types/schedules";

export type SchedulesView = {
  id: string;
  name: string;
  tab?: ScheduleType;
  query: string;
  statuses: Array<"active"|"paused"|"ended"|"error">;
  nextDays: number | null;
};
const KEY = "schedules-views-v1";

function read(): SchedulesView[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function write(v: SchedulesView[]) { localStorage.setItem(KEY, JSON.stringify(v)); }

export function listViews(): SchedulesView[] { return read(); }
export function saveView(v: Omit<SchedulesView,"id">): SchedulesView {
  const all = read();
  const obj = { ...v, id: crypto.randomUUID() };
  write([obj, ...all]);
  return obj;
}
export function deleteView(id: string) { write(read().filter(v => v.id !== id)); } 