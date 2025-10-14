import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import InventoryFlowView from "@/components/inventory/InventoryFlowView";

type WarehouseKey =
  | "Amazon ONT8"
  | "Amazon SMF3"
  | "Amazon JFK8"
  | "Own - NJ"
  | "Own - TX";

type InventoryItem = {
  sku: string;
  name: string;
  category: string;
  uom: string; // unit of measure
  warehouses: Record<WarehouseKey, { onHand: number; committed: number }>;
  cost: number; // per unit cost
};

const WAREHOUSES: WarehouseKey[] = [
  "Amazon ONT8",
  "Amazon SMF3",
  "Amazon JFK8",
  "Own - NJ",
  "Own - TX",
];

const mockInventory: InventoryItem[] = [
  {
    sku: "TB-DRS-SATIN-EMRLD-XS",
    name: "Emerald Satin Midi Dress",
    category: "Dresses",
    uom: "pcs",
    cost: 38.0,
    warehouses: {
      "Amazon ONT8": { onHand: 24, committed: 6 },
      "Amazon SMF3": { onHand: 18, committed: 4 },
      "Amazon JFK8": { onHand: 20, committed: 5 },
      "Own - NJ": { onHand: 40, committed: 8 },
      "Own - TX": { onHand: 30, committed: 7 },
    },
  },
  {
    sku: "TB-DRS-WRAP-BLK-S",
    name: "Black Wrap Dress",
    category: "Dresses",
    uom: "pcs",
    cost: 34.5,
    warehouses: {
      "Amazon ONT8": { onHand: 30, committed: 10 },
      "Amazon SMF3": { onHand: 22, committed: 6 },
      "Amazon JFK8": { onHand: 14, committed: 3 },
      "Own - NJ": { onHand: 55, committed: 11 },
      "Own - TX": { onHand: 35, committed: 5 },
    },
  },
  {
    sku: "TB-TOP-LINEN-WHT-M",
    name: "Linen Relaxed Shirt - White",
    category: "Tops",
    uom: "pcs",
    cost: 19.75,
    warehouses: {
      "Amazon ONT8": { onHand: 60, committed: 12 },
      "Amazon SMF3": { onHand: 48, committed: 9 },
      "Amazon JFK8": { onHand: 36, committed: 8 },
      "Own - NJ": { onHand: 90, committed: 15 },
      "Own - TX": { onHand: 70, committed: 10 },
    },
  },
  {
    sku: "TB-BTM-HGHRSE-JEANS-28",
    name: "High Rise Jeans - Indigo",
    category: "Bottoms",
    uom: "pcs",
    cost: 27.0,
    warehouses: {
      "Amazon ONT8": { onHand: 28, committed: 5 },
      "Amazon SMF3": { onHand: 25, committed: 4 },
      "Amazon JFK8": { onHand: 22, committed: 5 },
      "Own - NJ": { onHand: 60, committed: 12 },
      "Own - TX": { onHand: 42, committed: 8 },
    },
  },
  {
    sku: "TB-ACC-LEATH-BELT-TAN",
    name: "Leather Belt - Tan",
    category: "Accessories",
    uom: "pcs",
    cost: 11.25,
    warehouses: {
      "Amazon ONT8": { onHand: 90, committed: 20 },
      "Amazon SMF3": { onHand: 70, committed: 14 },
      "Amazon JFK8": { onHand: 65, committed: 10 },
      "Own - NJ": { onHand: 120, committed: 25 },
      "Own - TX": { onHand: 110, committed: 22 },
    },
  },
  {
    sku: "TB-FTW-SNEAKERS-WHT-8",
    name: "Classic Sneakers - White",
    category: "Footwear",
    uom: "pcs",
    cost: 29.9,
    warehouses: {
      "Amazon ONT8": { onHand: 40, committed: 10 },
      "Amazon SMF3": { onHand: 34, committed: 8 },
      "Amazon JFK8": { onHand: 26, committed: 6 },
      "Own - NJ": { onHand: 80, committed: 16 },
      "Own - TX": { onHand: 54, committed: 12 },
    },
  },
  {
    sku: "TB-OUT-TRENCH-BGE-M",
    name: "Trench Coat - Beige",
    category: "Outerwear",
    uom: "pcs",
    cost: 52.0,
    warehouses: {
      "Amazon ONT8": { onHand: 18, committed: 3 },
      "Amazon SMF3": { onHand: 16, committed: 3 },
      "Amazon JFK8": { onHand: 12, committed: 2 },
      "Own - NJ": { onHand: 30, committed: 5 },
      "Own - TX": { onHand: 22, committed: 4 },
    },
  },
  {
    sku: "TB-TOP-TEE-GRAPHIC-L",
    name: "Graphic Tee - Midnight",
    category: "Tops",
    uom: "pcs",
    cost: 9.8,
    warehouses: {
      "Amazon ONT8": { onHand: 120, committed: 25 },
      "Amazon SMF3": { onHand: 95, committed: 20 },
      "Amazon JFK8": { onHand: 80, committed: 18 },
      "Own - NJ": { onHand: 160, committed: 35 },
      "Own - TX": { onHand: 130, committed: 28 },
    },
  },
  {
    sku: "TB-BAG-CROSSBODY-BLK",
    name: "Crossbody Bag - Black",
    category: "Accessories",
    uom: "pcs",
    cost: 21.4,
    warehouses: {
      "Amazon ONT8": { onHand: 26, committed: 6 },
      "Amazon SMF3": { onHand: 22, committed: 5 },
      "Amazon JFK8": { onHand: 18, committed: 4 },
      "Own - NJ": { onHand: 45, committed: 10 },
      "Own - TX": { onHand: 36, committed: 8 },
    },
  },
  {
    sku: "TB-BTM-CHINO-KHAKI-32",
    name: "Chino Pants - Khaki",
    category: "Bottoms",
    uom: "pcs",
    cost: 23.6,
    warehouses: {
      "Amazon ONT8": { onHand: 38, committed: 7 },
      "Amazon SMF3": { onHand: 30, committed: 6 },
      "Amazon JFK8": { onHand: 28, committed: 6 },
      "Own - NJ": { onHand: 70, committed: 12 },
      "Own - TX": { onHand: 48, committed: 9 },
    },
  },
  {
    sku: "TB-HDY-FLEECE-HG-XL",
    name: "Fleece Hoodie - Heather Grey",
    category: "Sweatshirts",
    uom: "pcs",
    cost: 24.0,
    warehouses: {
      "Amazon ONT8": { onHand: 52, committed: 10 },
      "Amazon SMF3": { onHand: 40, committed: 8 },
      "Amazon JFK8": { onHand: 36, committed: 6 },
      "Own - NJ": { onHand: 85, committed: 15 },
      "Own - TX": { onHand: 64, committed: 12 },
    },
  },
  {
    sku: "TB-SKT-PLEAT-NVY-M",
    name: "Pleated Skirt - Navy",
    category: "Bottoms",
    uom: "pcs",
    cost: 22.3,
    warehouses: {
      "Amazon ONT8": { onHand: 18, committed: 3 },
      "Amazon SMF3": { onHand: 16, committed: 3 },
      "Amazon JFK8": { onHand: 14, committed: 2 },
      "Own - NJ": { onHand: 40, committed: 6 },
      "Own - TX": { onHand: 28, committed: 5 },
    },
  },
  {
    sku: "TB-JKT-DENIM-LTBLU-L",
    name: "Denim Jacket - Light Blue",
    category: "Outerwear",
    uom: "pcs",
    cost: 35.5,
    warehouses: {
      "Amazon ONT8": { onHand: 22, committed: 4 },
      "Amazon SMF3": { onHand: 20, committed: 3 },
      "Amazon JFK8": { onHand: 18, committed: 3 },
      "Own - NJ": { onHand: 48, committed: 8 },
      "Own - TX": { onHand: 34, committed: 6 },
    },
  },
  {
    sku: "TB-SHN-SLIM-OXF-WHT-41",
    name: "Slim Oxford Shirt - White",
    category: "Tops",
    uom: "pcs",
    cost: 18.4,
    warehouses: {
      "Amazon ONT8": { onHand: 58, committed: 12 },
      "Amazon SMF3": { onHand: 42, committed: 8 },
      "Amazon JFK8": { onHand: 36, committed: 7 },
      "Own - NJ": { onHand: 100, committed: 18 },
      "Own - TX": { onHand: 76, committed: 14 },
    },
  },
  {
    sku: "TB-DRS-SLIP-CHAMPAGNE-S",
    name: "Slip Dress - Champagne",
    category: "Dresses",
    uom: "pcs",
    cost: 33.2,
    warehouses: {
      "Amazon ONT8": { onHand: 20, committed: 5 },
      "Amazon SMF3": { onHand: 18, committed: 4 },
      "Amazon JFK8": { onHand: 16, committed: 3 },
      "Own - NJ": { onHand: 44, committed: 8 },
      "Own - TX": { onHand: 28, committed: 5 },
    },
  },
  {
    sku: "TB-TEE-ESS-BLK-XL",
    name: "Essential Tee - Black",
    category: "Tops",
    uom: "pcs",
    cost: 8.9,
    warehouses: {
      "Amazon ONT8": { onHand: 150, committed: 35 },
      "Amazon SMF3": { onHand: 120, committed: 26 },
      "Amazon JFK8": { onHand: 100, committed: 20 },
      "Own - NJ": { onHand: 220, committed: 45 },
      "Own - TX": { onHand: 180, committed: 36 },
    },
  },
  {
    sku: "TB-SHN-CHAMBRAY-LT-39",
    name: "Chambray Shirt - Light",
    category: "Tops",
    uom: "pcs",
    cost: 17.6,
    warehouses: {
      "Amazon ONT8": { onHand: 32, committed: 6 },
      "Amazon SMF3": { onHand: 28, committed: 5 },
      "Amazon JFK8": { onHand: 24, committed: 5 },
      "Own - NJ": { onHand: 68, committed: 10 },
      "Own - TX": { onHand: 46, committed: 9 },
    },
  },
  {
    sku: "TB-DRS-FLORAL-PRNT-M",
    name: "Floral Print Dress",
    category: "Dresses",
    uom: "pcs",
    cost: 29.7,
    warehouses: {
      "Amazon ONT8": { onHand: 26, committed: 6 },
      "Amazon SMF3": { onHand: 20, committed: 5 },
      "Amazon JFK8": { onHand: 18, committed: 4 },
      "Own - NJ": { onHand: 52, committed: 9 },
      "Own - TX": { onHand: 36, committed: 7 },
    },
  },
  {
    sku: "TB-PUL-CASHMERE-CML-M",
    name: "Cashmere Pullover - Camel",
    category: "Knitwear",
    uom: "pcs",
    cost: 44.9,
    warehouses: {
      "Amazon ONT8": { onHand: 14, committed: 3 },
      "Amazon SMF3": { onHand: 12, committed: 2 },
      "Amazon JFK8": { onHand: 10, committed: 2 },
      "Own - NJ": { onHand: 28, committed: 4 },
      "Own - TX": { onHand: 20, committed: 3 },
    },
  },
  {
    sku: "TB-BAG-TOTE-CANVAS-NAT",
    name: "Canvas Tote - Natural",
    category: "Accessories",
    uom: "pcs",
    cost: 12.2,
    warehouses: {
      "Amazon ONT8": { onHand: 80, committed: 16 },
      "Amazon SMF3": { onHand: 70, committed: 14 },
      "Amazon JFK8": { onHand: 60, committed: 12 },
      "Own - NJ": { onHand: 140, committed: 28 },
      "Own - TX": { onHand: 110, committed: 22 },
    },
  },
  {
    sku: "TB-FTW-LOAFER-BRN-9",
    name: "Leather Loafers - Brown",
    category: "Footwear",
    uom: "pcs",
    cost: 39.0,
    warehouses: {
      "Amazon ONT8": { onHand: 20, committed: 5 },
      "Amazon SMF3": { onHand: 16, committed: 4 },
      "Amazon JFK8": { onHand: 14, committed: 3 },
      "Own - NJ": { onHand: 36, committed: 7 },
      "Own - TX": { onHand: 26, committed: 5 },
    },
  },
  {
    sku: "TB-BTM-SHORT-CHINO-NVY-32",
    name: "Chino Shorts - Navy",
    category: "Bottoms",
    uom: "pcs",
    cost: 19.1,
    warehouses: {
      "Amazon ONT8": { onHand: 34, committed: 6 },
      "Amazon SMF3": { onHand: 28, committed: 5 },
      "Amazon JFK8": { onHand: 24, committed: 5 },
      "Own - NJ": { onHand: 60, committed: 10 },
      "Own - TX": { onHand: 44, committed: 8 },
    },
  },
];

export default function InventoryMaster() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | "all">("all");
  const [view, setView] = useState<"table" | "flow">("table");
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<string>(() => {
    const now = new Date();
    const y = now.getFullYear();
    const start = new Date(y, 8, 1); // Sep 1
    return start.toISOString().slice(0, 10);
  });
  const [dateTo, setDateTo] = useState<string>(() => {
    const now = new Date();
    const y = now.getFullYear();
    const end = new Date(y, 8 + 1, 0); // Sep last day
    return end.toISOString().slice(0, 10);
  });

  const NUM_COLS = useMemo(() => {
    // SKU(1) + Name(span2 counts toward total columns) + Category(1) + UoM(1)
    // + warehouses + Total On Hand + Committed + Available + Unit Cost + Stock Value
    return 1 + 2 + 1 + 1 + WAREHOUSES.length + 5;
  }, []);

  const categories = useMemo(() => {
    const set = new Set(mockInventory.map(i => i.category));
    return ["all", ...Array.from(set)];
  }, []);

  const currencyFmt = useMemo(() => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockInventory.filter(i => {
      const matchesQuery = !q ||
        i.sku.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q);
      const matchesCategory = category === "all" || i.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">

      {/* Filters */}
      <div className="bg-white border-b border-mobius-gray-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mobius-gray-500 w-4 h-4" />
            <Input
              placeholder="Search by SKU, name, or category"
              className="pl-10 w-80"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>
            ))}
          </select>

          <div className="ml-2 flex items-center gap-2">
            <span className="text-xs text-gray-600">Flow</span>
            <Switch
              checked={view === 'flow'}
              onCheckedChange={(checked) => setView(checked ? 'flow' : 'table')}
              className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
            />
          </div>

          {view === 'flow' && (
            <div className="ml-4 flex items-center gap-2">
              {/* Quick presets */}
              <div className="flex items-center gap-1">
                <button
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                  onClick={() => {
                    const today = new Date();
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    setDateFrom(weekAgo.toISOString().slice(0, 10));
                    setDateTo(today.toISOString().slice(0, 10));
                  }}
                >
                  7d
                </button>
                <button
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                  onClick={() => {
                    const today = new Date();
                    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    setDateFrom(monthAgo.toISOString().slice(0, 10));
                    setDateTo(today.toISOString().slice(0, 10));
                  }}
                >
                  30d
                </button>
                <button
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                  onClick={() => {
                    const today = new Date();
                    const quarterAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
                    setDateFrom(quarterAgo.toISOString().slice(0, 10));
                    setDateTo(today.toISOString().slice(0, 10));
                  }}
                >
                  90d
                </button>
              </div>
              
              {/* Navigation buttons */}
              <div className="flex items-center gap-1">
                <button
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                  onClick={() => {
                    const from = new Date(dateFrom);
                    const to = new Date(dateTo);
                    const diff = to.getTime() - from.getTime();
                    setDateFrom(new Date(from.getTime() - diff).toISOString().slice(0, 10));
                    setDateTo(from.toISOString().slice(0, 10));
                  }}
                >
                  ← Prev
                </button>
                <button
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                  onClick={() => {
                    const from = new Date(dateFrom);
                    const to = new Date(dateTo);
                    const diff = to.getTime() - from.getTime();
                    setDateFrom(to.toISOString().slice(0, 10));
                    setDateTo(new Date(to.getTime() + diff).toISOString().slice(0, 10));
                  }}
                >
                  Next →
                </button>
              </div>
              
              {/* Compact date range display */}
              <div className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded-md bg-white">
                <span>📅</span>
                <span className="font-medium">
                  {new Date(dateFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(dateTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <span className="text-gray-400">▼</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {view === 'table' ? (
      <div className="flex-1 overflow-auto overflow-x-auto">
        <div className="min-w-[1200px] text-xs">
          {/* Table Header */}
          <div className="bg-blue-50 py-3 px-6 border-b border-blue-200">
            <div
              className="grid gap-4 text-sm font-medium text-blue-900"
              style={{ gridTemplateColumns: `repeat(${NUM_COLS}, minmax(0, 1fr))` }}
            >
              <div>SKU</div>
              <div className="col-span-2">Item Name</div>
              <div>Category</div>
              <div>UoM</div>
              {WAREHOUSES.map(w => (
                <div key={w} className="text-right">{w}</div>
              ))}
              <div className="text-right">Total On Hand</div>
              <div className="text-right">Committed</div>
              <div className="text-right">Available</div>
              <div className="text-right">Unit Cost</div>
              <div className="text-right">Stock Value</div>
            </div>
          </div>

          {/* Table Rows */}
          <div>
            {filtered.map((item) => {
              const perWarehouse = WAREHOUSES.map(w => item.warehouses[w]?.onHand ?? 0);
              const totalOnHand = perWarehouse.reduce((a, b) => a + b, 0);
              const totalCommitted = WAREHOUSES.reduce((a, w) => a + (item.warehouses[w]?.committed ?? 0), 0);
              const totalAvailable = totalOnHand - totalCommitted;
              return (
                <div
                  key={item.sku}
                  className="grid gap-4 py-2 px-6 border-b border-gray-100"
                  style={{ gridTemplateColumns: `repeat(${NUM_COLS}, minmax(0, 1fr))` }}
                >
                  <div className="text-xs text-mobius-gray-600">{item.sku}</div>
                <div className="col-span-2 text-sm text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-900">{item.category}</div>
                <div className="text-sm text-gray-900">{item.uom}</div>
                  {WAREHOUSES.map((w, idx) => (
                    <div key={w} className="text-sm text-right">{perWarehouse[idx].toLocaleString()}</div>
                  ))}
                  <div className="text-sm text-right">{totalOnHand.toLocaleString()}</div>
                  <div className="text-sm text-right">{totalCommitted.toLocaleString()}</div>
                  <div className="text-sm text-right">{totalAvailable.toLocaleString()}</div>
                  <div className="text-sm text-right">{currencyFmt.format(item.cost)}</div>
                  <div className="text-sm text-right">{currencyFmt.format(totalOnHand * item.cost)}</div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="p-6 text-sm text-mobius-gray-600">No items found.</div>
            )}
          </div>
        </div>
      </div>
      ) : (
        <div className="flex-1 overflow-auto bg-white">
          {(() => {
            const rows = filtered.map(item => {
              const totalOnHand = Object.values(item.warehouses).reduce((a,b)=> a + b.onHand, 0);
              const hash = Array.from(item.sku).reduce((s, ch) => s + ch.charCodeAt(0), 0);
              const starting = Math.max(0, totalOnHand - (hash % 40));
              const purchases = 10 + (hash % 45); // 10..54
              const returns = hash % 12; // 0..11
              const returnsInTransit = hash % 7; // 0..6
              const writeoffs = hash % 5; // 0..4
              const sales = 20 + (hash % 55); // 20..74
              const endingCalc = starting + purchases + returns - returnsInTransit - writeoffs - sales;
              const ending = endingCalc < 0 ? 0 : endingCalc;
              const variance = (hash % 7) - 3; // -3..+3
              const physical = Math.max(0, ending + variance);
              
              // Generate trend data
              const trendHash = hash % 3;
              const trend = trendHash === 0 ? 'up' : trendHash === 1 ? 'down' : 'stable';
              const trendPercent = trend === 'up' ? 5 + (hash % 15) : trend === 'down' ? -(5 + (hash % 15)) : 0;
              return {
                sku: item.sku,
                name: item.name,
                category: item.category,
                uom: item.uom,
                starting,
                purchases,
                returns,
                returnsInTransit,
                writeoffs,
                sales,
                ending,
                physical,
                variance,
                trend,
                trendPercent,
              };
            });
            return <InventoryFlowView rows={rows} dateFrom={dateFrom} dateTo={dateTo} />;
          })()}
        </div>
      )}
    </div>
  );
}


