import React from "react";
type Toast = { id: string; msg: string };
const Ctx = React.createContext<(m: string) => void>(() => {});

export function useToast() { return React.useContext(Ctx); }

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = React.useState<Toast[]>([]);
  const push = (msg: string) => {
    const t = { id: Math.random().toString(36).slice(2), msg };
    setList((l) => [...l, t]);
    setTimeout(() => setList((l) => l.filter((x) => x.id !== t.id)), 2200);
  };
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {list.map((t) => (
          <div key={t.id} className="pointer-events-auto rounded-md border bg-background px-3 py-2 text-sm shadow">
            {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
} 