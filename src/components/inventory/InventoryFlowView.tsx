import React, { useMemo, useState } from "react";
import SKUDeepDive from "./SKUDeepDive";
import type { SKUDeepDiveData } from "./SKUDeepDive";

export type InventoryFlowRow = {
  sku: string;
  name: string;
  category: string;
  uom: string;
  starting: number;
  purchases: number;
  returns: number;
  returnsInTransit: number;
  writeoffs: number;
  sales: number;
  ending: number;
  physical: number; // latest physical verification count
  variance: number; // physical - ending
  trend: 'up' | 'down' | 'stable'; // vs last period
  trendPercent: number; // percentage change
};

export default function InventoryFlowView({
  rows,
  dateFrom,
  dateTo,
}: {
  rows: InventoryFlowRow[];
  dateFrom: string;
  dateTo: string;
}) {
  const [selectedSKU, setSelectedSKU] = useState<SKUDeepDiveData | null>(null);
  
  // Match InventoryMaster grid behavior: repeat(NUM_COLS) with Item Name spanning 2
  const NUM_COLS = 15; // Added Variance and Trend columns

  const generateDeepDiveData = (row: InventoryFlowRow): SKUDeepDiveData => {
    const hash = Array.from(row.sku).reduce((s, ch) => s + ch.charCodeAt(0), 0);
    
    return {
      sku: row.sku,
      name: row.name,
      category: row.category,
      uom: row.uom,
      totalAvailable: row.ending,
      variance: row.variance,
      trend: row.trend,
      trendPercent: row.trendPercent,
      valuation: 'FIFO / $38.00',
      lastUpdated: new Date().toLocaleString(),
      flowSummary: {
        starting: row.starting,
        purchases: row.purchases,
        returns: row.returns,
        returnsInTransit: row.returnsInTransit,
        writeoffs: row.writeoffs,
        sales: row.sales,
        ending: row.ending,
        physical: row.physical,
      },
      channels: [
        {
          name: 'Amazon',
          sales: Math.floor(row.sales * 0.6),
          returns: Math.floor(row.returns * 0.7),
          netMovement: Math.floor(row.sales * 0.6) - Math.floor(row.returns * 0.7),
          avgSellingPrice: 45,
          cogs: 30,
          grossMargin: 33,
          trend: 'down' as const,
          trendPercent: -8,
        },
        {
          name: 'Shopify',
          sales: Math.floor(row.sales * 0.25),
          returns: Math.floor(row.returns * 0.2),
          netMovement: Math.floor(row.sales * 0.25) - Math.floor(row.returns * 0.2),
          avgSellingPrice: 47,
          cogs: 31,
          grossMargin: 34,
          trend: 'up' as const,
          trendPercent: 3,
        },
        {
          name: 'Retail',
          sales: Math.floor(row.sales * 0.15),
          returns: Math.floor(row.returns * 0.1),
          netMovement: Math.floor(row.sales * 0.15) - Math.floor(row.returns * 0.1),
          avgSellingPrice: 52,
          cogs: 33,
          grossMargin: 37,
          trend: 'stable' as const,
          trendPercent: 0,
        },
      ],
      locations: [
        {
          name: 'Amazon ONT8',
          starting: Math.floor(row.starting * 0.18),
          inbound: Math.floor(row.purchases * 0.4),
          outbound: Math.floor(row.sales * 0.6),
          adjustments: -1,
          ending: Math.floor(row.starting * 0.18) + Math.floor(row.purchases * 0.4) - Math.floor(row.sales * 0.6) - 1,
          inTransit: 0,
          variance: 0,
        },
        {
          name: 'Amazon SMF3',
          starting: Math.floor(row.starting * 0.14),
          inbound: Math.floor(row.purchases * 0.3),
          outbound: Math.floor(row.sales * 0.25),
          adjustments: 0,
          ending: Math.floor(row.starting * 0.14) + Math.floor(row.purchases * 0.3) - Math.floor(row.sales * 0.25),
          inTransit: 0,
          variance: -1,
        },
        {
          name: 'Own - NJ',
          starting: Math.floor(row.starting * 0.3),
          inbound: Math.floor(row.purchases * 0.2),
          outbound: Math.floor(row.sales * 0.1),
          adjustments: 0,
          ending: Math.floor(row.starting * 0.3) + Math.floor(row.purchases * 0.2) - Math.floor(row.sales * 0.1),
          inTransit: 5,
          variance: 2,
        },
        {
          name: 'Own - TX',
          starting: Math.floor(row.starting * 0.23),
          inbound: Math.floor(row.purchases * 0.1),
          outbound: Math.floor(row.sales * 0.05),
          adjustments: -1,
          ending: Math.floor(row.starting * 0.23) + Math.floor(row.purchases * 0.1) - Math.floor(row.sales * 0.05) - 1,
          inTransit: 0,
          variance: -1,
        },
      ],
      partners: [
        {
          name: 'Shiprocket',
          shipments: Math.floor(row.sales * 0.6),
          returnsInTransit: 2,
          lostDamaged: 0,
          avgDeliveryDays: 3.2,
          slaBreachPercent: 5,
        },
        {
          name: 'BlueDart',
          shipments: Math.floor(row.sales * 0.3),
          returnsInTransit: 1,
          lostDamaged: 0,
          avgDeliveryDays: 4.1,
          slaBreachPercent: 12,
        },
        {
          name: 'Delhivery',
          shipments: Math.floor(row.sales * 0.1),
          returnsInTransit: 2,
          lostDamaged: 1,
          avgDeliveryDays: 5.3,
          slaBreachPercent: 20,
        },
      ],
      financial: [
        {
          type: 'Purchases',
          qty: row.purchases,
          cost: row.purchases * 38,
          account: 'Inventory',
          journalLink: '#JV1204',
        },
        {
          type: 'Write-offs',
          qty: -row.writeoffs,
          cost: -row.writeoffs * 38,
          account: 'Inventory Adjustment',
          journalLink: '#JV1208',
        },
        {
          type: 'Sales',
          qty: -row.sales,
          cost: -row.sales * 38,
          account: 'COGS',
          journalLink: '#JV1209',
        },
      ],
      auditTrail: [
        {
          timestamp: 'Oct 5, 2025',
          user: 'Meera',
          action: 'Adjusted variance +2',
          context: 'Physical count audit',
        },
        {
          timestamp: 'Oct 4, 2025',
          user: 'System',
          action: 'Posted COGS for 24 sales',
          context: 'Auto journal',
        },
        {
          timestamp: 'Oct 3, 2025',
          user: 'Arjun',
          action: 'Created transfer 5 units NJ→TX',
          context: 'Transfer stepper',
        },
      ],
    };
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white" style={{ zoom: '0.8' }}>
      <div className="border-b border-mobius-gray-200 bg-white px-6 py-3">
        <div className="text-sm text-gray-600">Range: {dateFrom} to {dateTo}</div>
      </div>

      <div className="flex-1 overflow-auto overflow-x-auto">
        <div className="min-w-[1200px] text-xs">
          {/* Flow Direction Bar */}
          <div className="bg-gray-50 px-6 py-2 border-b border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">Starting</span>
                <span className="text-emerald-600">+</span>
                <span>Purchases</span>
                <span className="text-emerald-600">+</span>
                <span>Returns</span>
                <span className="text-amber-600">-</span>
                <span>RIT</span>
                <span className="text-red-600">-</span>
                <span>Write-offs</span>
                <span className="text-red-600">-</span>
                <span>Sales</span>
                <span className="text-blue-600">=</span>
                <span className="font-medium">Ending</span>
              </div>
              <div className="text-gray-500">Physical Count</div>
            </div>
          </div>

          <div className="bg-blue-50 py-3 px-6 border-b border-blue-200">
            <div
              className="grid gap-4 text-sm font-medium text-blue-900"
              style={{ gridTemplateColumns: `repeat(${NUM_COLS}, minmax(0, 1fr))` }}
            >
              <div className="whitespace-nowrap">SKU</div>
              <div className="col-span-2 whitespace-nowrap">Item Name</div>
              <div className="whitespace-nowrap">Category</div>
              <div className="whitespace-nowrap">UoM</div>
              <div className="text-right whitespace-nowrap">Starting</div>
              <div className="text-right whitespace-nowrap">Purchases</div>
              <div className="text-right whitespace-nowrap">Returns</div>
              <div className="text-right whitespace-nowrap">Returns in Transit</div>
              <div className="text-right whitespace-nowrap">Write-offs</div>
              <div className="text-right whitespace-nowrap">Sales</div>
              <div className="text-right whitespace-nowrap">Ending</div>
              <div className="text-right whitespace-nowrap">Physical (Latest)</div>
              <div className="text-right whitespace-nowrap">Variance</div>
              <div className="text-center whitespace-nowrap">Trend</div>
            </div>
          </div>

          <div>
            {rows.map((r) => (
              <div
                key={r.sku}
                className="grid gap-4 py-2 px-6 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                style={{ gridTemplateColumns: `repeat(${NUM_COLS}, minmax(0, 1fr))` }}
                onClick={() => setSelectedSKU(generateDeepDiveData(r))}
              >
                <div className="text-xs text-mobius-gray-600">{r.sku}</div>
                <div className="col-span-2 text-sm text-gray-900">{r.name}</div>
                <div className="text-sm text-gray-900">{r.category}</div>
                <div className="text-sm text-gray-900">{r.uom}</div>
                <div className="text-sm text-right whitespace-nowrap" style={{fontVariantNumeric:'tabular-nums'}}>{r.starting.toLocaleString()}</div>
                <div className="text-sm text-right text-emerald-700 whitespace-nowrap" style={{fontVariantNumeric:'tabular-nums'}}>+{r.purchases.toLocaleString()}</div>
                <div className="text-sm text-right text-emerald-700 whitespace-nowrap" style={{fontVariantNumeric:'tabular-nums'}}>+{r.returns.toLocaleString()}</div>
                <div className="text-sm text-right text-amber-700 whitespace-nowrap" style={{fontVariantNumeric:'tabular-nums'}}>-{r.returnsInTransit.toLocaleString()}</div>
                <div className="text-sm text-right text-red-700 whitespace-nowrap" style={{fontVariantNumeric:'tabular-nums'}}>-{r.writeoffs.toLocaleString()}</div>
                <div className="text-sm text-right text-red-700 whitespace-nowrap" style={{fontVariantNumeric:'tabular-nums'}}>-{r.sales.toLocaleString()}</div>
                <div className="text-sm text-right font-medium whitespace-nowrap" style={{fontVariantNumeric:'tabular-nums'}}>{r.ending.toLocaleString()}</div>
                <div className="text-sm text-right font-medium whitespace-nowrap" style={{fontVariantNumeric:'tabular-nums'}}>{r.physical.toLocaleString()}</div>
                
                {/* Variance with tolerance highlighting */}
                <div className={`text-sm text-right font-medium whitespace-nowrap ${Math.abs(r.variance) > 5 ? 'text-red-600' : 'text-gray-600'}`} 
                     style={{fontVariantNumeric:'tabular-nums'}}
                     title={Math.abs(r.variance) > 5 ? "Variance exceeds tolerance. Review physical count / write-off." : ""}>
                  {r.variance > 0 ? '+' : ''}{r.variance}
                </div>
                
                {/* Trend indicator with badges */}
                <div className="text-sm text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    {r.trend === 'up' && <span className="text-green-600">▲</span>}
                    {r.trend === 'down' && <span className="text-red-600">▼</span>}
                    {r.trend === 'stable' && <span className="text-gray-400">—</span>}
                    <span className="text-xs text-gray-500">{Math.abs(r.trendPercent)}%</span>
                  </div>
                  
                  {/* Anomaly badges */}
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {r.writeoffs > 10 && (
                      <span className="text-xs text-amber-600" title="High write-offs detected">⚠️</span>
                    )}
                    {r.returnsInTransit < 0 && (
                      <span className="text-xs text-red-600" title="Unmatched return in progress">⚠️</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {rows.length === 0 && (
              <div className="p-6 text-sm text-mobius-gray-600">No items in this view.</div>
            )}
          </div>
        </div>
      </div>
      
      {/* SKU Deep Dive Modal */}
      {selectedSKU && (
        <div className="fixed inset-0 z-[9999]">
          <SKUDeepDive 
            data={selectedSKU} 
            onClose={() => setSelectedSKU(null)} 
          />
        </div>
      )}
    </div>
  );
}


