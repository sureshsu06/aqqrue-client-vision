import * as React from "react";

/* ---------- Types ---------- */
export type ModuleType = "Revenue" | "Prepaids" | "Depreciation" | "Amortization" | "Rent";

export type CloseEvent =
  | { type: "JE_POSTED"; month: string; module: ModuleType; scheduleId: string; periodId?: string; amount?: number }
  | { type: "DOC_ATTACHED"; entity: "schedule" | "je" | "invoice"; id: string }
  | { type: "EXCEPTIONS_STATUS"; open: number }                 // emit periodically from Exceptions view
  | { type: "AUDIT_PACKET_GENERATED"; scheduleId: string }
  | { type: "MANUAL_CHECKED"; id: string; done: boolean };       // for manual checklist items

export type CloseState = {
  month: string;                                 // e.g., "2025-08"
  postedByModule: Record<ModuleType, number>;    // count of JEs posted this month by module
  docsAttachedIds: Set<string>;                  // any supporting doc attachment ids
  exceptionsOpen: number;                        // current count open
  auditPackets: Set<string>;                     // scheduleIds with packets generated
  manual: Record<string, boolean>;               // manual item toggles
  lastUpdated: number;
};

/* ---------- Helpers ---------- */
const ym = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const STORAGE_KEY = (m: string) => `close-progress:${m}`;

function revive(raw: any): CloseState {
  const month = raw?.month ?? ym();
  return {
    month,
    postedByModule: raw?.postedByModule ?? { Revenue: 0, Prepaids: 0, Depreciation: 0, Amortization: 0, Rent: 0 },
    docsAttachedIds: new Set<string>(raw?.docsAttachedIds ?? []),
    exceptionsOpen: typeof raw?.exceptionsOpen === "number" ? raw.exceptionsOpen : 0,
    auditPackets: new Set<string>(raw?.auditPackets ?? []),
    manual: raw?.manual ?? {},
    lastUpdated: raw?.lastUpdated ?? Date.now(),
  };
}

function persist(s: CloseState) {
  const plain = {
    ...s,
    docsAttachedIds: Array.from(s.docsAttachedIds),
    auditPackets: Array.from(s.auditPackets),
  };
  localStorage.setItem(STORAGE_KEY(s.month), JSON.stringify(plain));
}

/* ---------- Context ---------- */
type CtxShape = {
  state: CloseState;
  emit: (e: CloseEvent) => void;
  reset: (month?: string) => void;
};
const Ctx = React.createContext<CtxShape | null>(null);

export function CloseProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<CloseState>(() => {
    const key = STORAGE_KEY(ym());
    const raw = localStorage.getItem(key);
    return revive(raw ? JSON.parse(raw) : undefined);
  });

  const emit = React.useCallback((e: CloseEvent) => {
    setState((prev) => {
      let next = { ...prev, lastUpdated: Date.now() } as CloseState;
      // auto-roll if event belongs to a different month
      const eventMonth =
        e.type === "JE_POSTED" ? e.month :
        e.type === "AUDIT_PACKET_GENERATED" ? ym() :
        e.type === "DOC_ATTACHED" ? ym() :
        e.type === "EXCEPTIONS_STATUS" ? ym() : prev.month;

      if (eventMonth !== prev.month) {
        next = revive({ month: eventMonth });
      }

      switch (e.type) {
        case "JE_POSTED": {
          const m = { ...next.postedByModule };
          m[e.module] = (m[e.module] ?? 0) + 1;
          next.postedByModule = m;
          break;
        }
        case "DOC_ATTACHED": {
          const set = new Set(next.docsAttachedIds);
          set.add(`${e.entity}:${e.id}`);
          next.docsAttachedIds = set;
          break;
        }
        case "EXCEPTIONS_STATUS":
          next.exceptionsOpen = e.open;
          break;
        case "AUDIT_PACKET_GENERATED": {
          const set = new Set(next.auditPackets);
          set.add(e.scheduleId);
          next.auditPackets = set;
          break;
        }
        case "MANUAL_CHECKED":
          next.manual = { ...next.manual, [e.id]: e.done };
          break;
      }
      persist(next);
      return next;
    });
  }, []);

  const reset = React.useCallback((month?: string) => {
    const next = revive({ month: month ?? ym() });
    persist(next);
    setState(next);
  }, []);

  // Expose on window for quick demo scripting
  React.useEffect(() => {
    (window as any)._emitCloseEvent = emit;
  }, [emit]);

  return <Ctx.Provider value={{ state, emit, reset }}>{children}</Ctx.Provider>;
}

export function useCloseProgress(): CtxShape {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useCloseProgress must be used within CloseProgressProvider");
  return ctx;
}

/* ---------- Derived percentages (for the header chip later) ---------- */
// For demo: treat 5 milestone buckets as the checklist; compute % complete.
export function percentComplete(s: CloseState) {
  let done = 0;
  const total = 5;
  if (Object.values(s.postedByModule).reduce((a, b) => a + b, 0) > 0) done++;      // some postings done
  if (s.docsAttachedIds.size > 0) done++;                                           // some evidence attached
  if (s.exceptionsOpen <= 3) done++;                                                // exceptions under control
  if (s.auditPackets.size > 0) done++;                                              // packet generated
  if (s.manual["controller-signoff"]) done++;                                       // manual signoff
  return Math.round((done / total) * 100);
} 