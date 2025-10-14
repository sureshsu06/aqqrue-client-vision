import React, { useState, useEffect, useRef } from "react";

// SKU Deep Dive Mock for Aqqrue
// Single-file React component using Tailwind CSS classes
// - Linear tab navigation
// - Flow summary proportional segments
// - Channels table with drill
// - Audit timeline

type SkuType = typeof sampleData.sku;

export default function SkuDeepDiveMock({ sku = sampleData.sku, onClose }: { sku?: SkuType; onClose?: () => void }) {
  const [activeTab, setActiveTab] = useState(0); // 0: Channels, 1: Locations, 2: Partners, 3: Financial
  const [focusedRow, setFocusedRow] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // keyboard navigation between tabs
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") setActiveTab((t) => Math.min(3, t + 1));
      if (e.key === "ArrowLeft") setActiveTab((t) => Math.max(0, t - 1));
      if (e.key === "Escape") onClose && onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // derived totals for proportional flow bar
  const flowParts = [
    { label: "Starting", value: sku.flow.starting, color: "bg-gray-100", text: "#374151" },
    { label: "Purchases", value: sku.flow.purchases, color: "bg-green-50", text: "#10B981" },
    { label: "Returns", value: sku.flow.returns, color: "bg-green-50", text: "#10B981" },
    { label: "RIT", value: Math.abs(sku.flow.returns_in_transit), color: "bg-orange-50", text: "#F97316" },
    { label: "Write-offs", value: Math.abs(sku.flow.writeoffs), color: "bg-rose-50", text: "#F43F5E" },
    { label: "Sales", value: Math.abs(sku.flow.sales), color: "bg-rose-50", text: "#F43F5E" },
  ];

  const totalFlow = flowParts.reduce((s, p) => s + p.value, 0) || 1;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-6 bg-black bg-opacity-50">
      <div ref={containerRef} className="w-[1100px] max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-black/5">
        {/* Header */}
        <div className="flex items-start justify-between border-b px-6 py-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold tracking-tight">{sku.code}</h3>
              <div className="text-sm text-slate-500">{sku.name}</div>
              <div className="ml-4 flex gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{sku.category}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{sku.uom}</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-4 text-sm text-slate-600">
              <div>
                <div className="text-xs text-slate-400">Total Available</div>
                <div className="mt-1 font-medium text-slate-800">{sku.available}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Variance</div>
                <div className={`mt-1 font-medium ${sku.variance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{sku.variance > 0 ? `+${sku.variance}` : sku.variance}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Trend</div>
                <div className="mt-1 text-sm text-rose-600">{sku.trendPct}%</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Valuation</div>
                <div className="mt-1 font-medium text-slate-800">{sku.valuation} • ${sku.unitCost}</div>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <button className="rounded-md border px-3 py-2 text-sm">Adjust</button>
            <button className="rounded-md border px-3 py-2 text-sm">Transfer</button>
            <button className="rounded-md border px-3 py-2 text-sm">Investigate</button>
            <button className="rounded-md border px-3 py-2 text-sm">View Journals</button>
            <button onClick={() => onClose && onClose()} className="ml-2 rounded px-3 py-2 text-sm text-slate-500">✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[74vh] overflow-y-auto">
          {/* Flow Summary */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-slate-700">Flow Summary</h4>
              <div className="text-xs text-slate-400">Click nodes to jump to details</div>
            </div>

            <div className="mt-3 w-full space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded border bg-white px-3 py-1 text-sm shadow-sm">{sku.flow.starting}</div>
                {flowParts.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`text-sm ${p.text} font-semibold`}>{p.value > 0 ? (p.label === 'RIT' || p.label === 'Write-offs' || p.label === 'Sales' ? `-${p.value}` : `+${p.value}`) : '—'}</div>
                  </div>
                ))}
                <div className="rounded border bg-slate-50 px-3 py-1 text-sm shadow-sm">{sku.flow.ending}</div>
                <div className="text-sm text-slate-500">→</div>
                <div className="rounded border bg-slate-50 px-3 py-1 text-sm shadow-sm">{sku.physical}</div>
              </div>

              {/* proportional bar */}
              <div className="mt-2 h-3 w-full overflow-hidden rounded bg-slate-100">
                <div className="flex h-full">
                  {flowParts.map((p, i) => (
                    <div
                      key={i}
                      title={`${p.label}: ${p.value}`}
                      className={`${p.color} h-full`} 
                      style={{ width: `${(p.value / totalFlow) * 100}%` }}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Tabs */}
          <div className="border-t px-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-6">
                {['Channels', 'Locations', 'Partners', 'Financial'].map((t, idx) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(idx)}
                    className={`py-3 text-sm ${activeTab === idx ? 'border-b-2 border-sky-500 text-sky-600' : 'text-slate-600'} `}
                  >
                    {t} <span className="ml-2 text-xs text-slate-400">({sku.metaCounts[idx]})</span>
                  </button>
                ))}
              </div>
              <div className="text-xs text-slate-400">Use ← → arrow keys to navigate</div>
            </div>

            <div className="py-4">
              {activeTab === 0 && (
                <ChannelsTable sku={sku} onRowFocus={setFocusedRow} focusedRow={focusedRow} />
              )}
              {activeTab === 1 && (
                <LocationsTable sku={sku} onRowFocus={setFocusedRow} focusedRow={focusedRow} />
              )}
              {activeTab === 2 && <PartnersTable sku={sku} />}
              {activeTab === 3 && <FinancialTable sku={sku} />}
            </div>
          </div>

          {/* Audit Trail */}
          <div className="border-t px-6 py-4">
            <h5 className="text-sm font-medium text-slate-700">Audit Trail</h5>
            <div className="mt-3 space-y-3 text-sm text-slate-600">
              {sku.audit.map((a, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-28 text-xs text-slate-400">{a.date}</div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-800">{a.user} <span className="text-xs text-slate-400">{a.action}</span></div>
                    <div className="mt-1 text-xs text-slate-500">{a.note}</div>
                  </div>
                  <div className="text-xs text-slate-400">{a.context}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ChannelsTable({ sku, onRowFocus, focusedRow }: { sku: SkuType; onRowFocus?: (name: string) => void; focusedRow: string | null }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-slate-500">
            <tr>
              <th className="pb-3">Channel</th>
              <th className="pb-3">Sales</th>
              <th className="pb-3">Returns</th>
              <th className="pb-3">Net</th>
              <th className="pb-3">Avg Price</th>
              <th className="pb-3">COGS</th>
              <th className="pb-3">Margin</th>
              <th className="pb-3">Trend</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {sku.channels.map((c, i) => (
              <tr
                key={c.name}
                tabIndex={0}
                onFocus={() => onRowFocus && onRowFocus(c.name)}
                className={`border-t ${focusedRow === c.name ? 'bg-slate-50' : ''}`}
              >
                <td className="py-3">{c.name}</td>
                <td className={`py-3 ${c.sales > 0 ? 'text-rose-600' : ''}`}>{c.sales}</td>
                <td className={`py-3 ${c.returns > 0 ? 'text-emerald-600' : ''}`}>{c.returns || '—'}</td>
                <td className="py-3">{c.net}</td>
                <td className="py-3">${c.avgPrice}</td>
                <td className="py-3">${c.cogs}</td>
                <td className="py-3">{c.margin}%</td>
                <td className="py-3">{c.trendPct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LocationsTable({ sku, onRowFocus, focusedRow }: { sku: SkuType; onRowFocus?: (name: string) => void; focusedRow: string | null }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-slate-500">
            <tr>
              <th className="pb-3">Location</th>
              <th className="pb-3">Starting</th>
              <th className="pb-3">Inbound</th>
              <th className="pb-3">Outbound</th>
              <th className="pb-3">Adjust</th>
              <th className="pb-3">Ending</th>
              <th className="pb-3">In Transit</th>
              <th className="pb-3">Variance</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {sku.locations.map((l) => (
              <tr key={l.name} tabIndex={0} onFocus={() => onRowFocus && onRowFocus(l.name)} className={`border-t ${focusedRow === l.name ? 'bg-slate-50' : ''}`}>
                <td className="py-3">{l.name}</td>
                <td className="py-3">{l.starting}</td>
                <td className="py-3 text-emerald-600">+{l.inbound}</td>
                <td className="py-3 text-rose-600">-{l.outbound}</td>
                <td className="py-3">{l.adjustments || '—'}</td>
                <td className="py-3">{l.ending}</td>
                <td className="py-3">{l.inTransit || '—'}</td>
                <td className="py-3">{l.variance >= 0 ? `+${l.variance}` : l.variance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PartnersTable({ sku }: { sku: SkuType }) {
  return (
    <div className="text-sm text-slate-700">
      <div className="grid grid-cols-3 gap-4">
        {sku.partners.map((p) => (
          <div key={p.name} className="rounded border p-3">
            <div className="text-sm font-medium">{p.name}</div>
            <div className="mt-2 text-xs text-slate-500">Shipments: {p.shipments}</div>
            <div className="text-xs text-slate-500">Returns in transit: {p.returnsInTransit}</div>
            <div className="text-xs text-slate-500">SLA breach: {p.sla}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinancialTable({ sku }: { sku: SkuType }) {
  return (
    <div>
      <div className="overflow-x-auto text-sm">
        <table className="w-full">
          <thead className="text-left text-xs text-slate-500">
            <tr>
              <th className="pb-3">Type</th>
              <th className="pb-3">Qty</th>
              <th className="pb-3">Cost</th>
              <th className="pb-3">Account</th>
              <th className="pb-3">Journal</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {sku.financial.map((f, i) => (
              <tr key={i} className="border-t">
                <td className="py-3">{f.type}</td>
                <td className="py-3">{f.qty}</td>
                <td className="py-3">${f.cost}</td>
                <td className="py-3">{f.account}</td>
                <td className="py-3 text-sky-600">{f.journal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- sample data for mock ----------
const sampleData = {
  sku: {
    code: "TB-DRS-SATIN-EMRLD-XS",
    name: "Emerald Satin Midi Dress",
    category: "Dresses",
    uom: "pcs",
    available: 105,
    variance: 2,
    trendPct: -9,
    valuation: "FIFO",
    unitCost: 38.0,
    physical: 107,
    flow: {
      starting: 123,
      purchases: 14,
      returns: 1,
      returns_in_transit: -5,
      writeoffs: -4,
      sales: -24,
      ending: 105,
    },
    metaCounts: [3, 4, 3, 3],
    channels: [
      { name: "Amazon", sales: 14, returns: 0, net: 14, avgPrice: 45, cogs: 30, margin: 33, trendPct: -8 },
      { name: "Shopify", sales: 6, returns: 0, net: 6, avgPrice: 47, cogs: 31, margin: 34, trendPct: 3 },
      { name: "Retail", sales: 3, returns: 0, net: 3, avgPrice: 52, cogs: 33, margin: 37, trendPct: 0 },
    ],
    locations: [
      { name: "Amazon ONT8", starting: 24, inbound: 6, outbound: 3, adjustments: 0, ending: 26, inTransit: 0, variance: 0 },
      { name: "Amazon SMF3", starting: 18, inbound: 4, outbound: 5, adjustments: 0, ending: 17, inTransit: 0, variance: -1 },
      { name: "Own - NJ", starting: 40, inbound: 3, outbound: 8, adjustments: 0, ending: 35, inTransit: 5, variance: 2 },
      { name: "Own - TX", starting: 30, inbound: 2, outbound: 8, adjustments: -1, ending: 23, inTransit: 0, variance: -1 },
    ],
    partners: [
      { name: "Shiprocket", shipments: 18, returnsInTransit: 2, sla: 5 },
      { name: "BlueDart", shipments: 8, returnsInTransit: 1, sla: 12 },
      { name: "Delhivery", shipments: 5, returnsInTransit: 2, sla: 20 },
    ],
    financial: [
      { type: "Purchases", qty: 14, cost: 532, account: "Inventory - 1200", journal: "#JV1204" },
      { type: "Write-offs", qty: -4, cost: 152, account: "Inventory Adj - 6200", journal: "#JV1208" },
      { type: "Sales", qty: -24, cost: 912, account: "COGS - 4000", journal: "#JV1209" },
    ],
    audit: [
      { date: "Oct 5, 2025", user: "Meera", action: "Adjusted variance +2", note: "Physical count audit", context: "Physical count audit" },
      { date: "Oct 4, 2025", user: "System", action: "Posted COGS for 24 sales", note: "Auto journal", context: "Auto journal" },
      { date: "Oct 3, 2025", user: "Arjun", action: "Created transfer 5 units NJ→TX", note: "Transfer stepper", context: "Transfer stepper" },
    ],
  },
};


