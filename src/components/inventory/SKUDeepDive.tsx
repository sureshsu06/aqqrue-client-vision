import React, { useState, useEffect } from "react";
import { X, ArrowLeft, ArrowRight, Search, Filter, ExternalLink, Settings, Move, AlertTriangle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type SKUDeepDiveData = {
  sku: string;
  name: string;
  category: string;
  uom: string;
  totalAvailable: number;
  variance: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  valuation: string;
  lastUpdated: string;
  flowSummary: {
    starting: number;
    purchases: number;
    returns: number;
    returnsInTransit: number;
    writeoffs: number;
    sales: number;
    ending: number;
    physical: number;
  };
  channels: Array<{
    name: string;
    sales: number;
    returns: number;
    netMovement: number;
    avgSellingPrice: number;
    cogs: number;
    grossMargin: number;
    trend: 'up' | 'down' | 'stable';
    trendPercent: number;
  }>;
  locations: Array<{
    name: string;
    starting: number;
    inbound: number;
    outbound: number;
    adjustments: number;
    ending: number;
    inTransit: number;
    variance: number;
  }>;
  partners: Array<{
    name: string;
    shipments: number;
    returnsInTransit: number;
    lostDamaged: number;
    avgDeliveryDays: number;
    slaBreachPercent: number;
  }>;
  financial: Array<{
    type: string;
    qty: number;
    cost: number;
    account: string;
    journalLink: string;
  }>;
  auditTrail: Array<{
    timestamp: string;
    user: string;
    action: string;
    context: string;
  }>;
};

type TabType = 'channels' | 'locations' | 'partners' | 'financial';

export default function SKUDeepDive({ 
  data, 
  onClose 
}: { 
  data: SKUDeepDiveData; 
  onClose: () => void; 
}) {
  const [activeTab, setActiveTab] = useState<TabType>('channels');
  const [searchTerm, setSearchTerm] = useState("");

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextTab();
      if (e.key === 'ArrowLeft') prevTab();
      if (e.key === 'a' || e.key === 'A') {/* Open Adjust flow */};
      if (e.key === 't' || e.key === 'T') {/* Open Transfer */};
      if (e.key === 'v' || e.key === 'V') {/* Open Journals */};
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const tabs = [
    { id: 'channels', label: 'Channels', count: data.channels.length },
    { id: 'locations', label: 'Locations', count: data.locations.length },
    { id: 'partners', label: 'Partners', count: data.partners.length },
    { id: 'financial', label: 'Financial', count: data.financial.length },
  ];

  const nextTab = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex].id as TabType);
  };

  const prevTab = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    setActiveTab(tabs[prevIndex].id as TabType);
  };

  const renderFlowSummary = () => {
    const totalMovement = data.flowSummary.purchases + data.flowSummary.returns + 
                         data.flowSummary.returnsInTransit + data.flowSummary.writeoffs + data.flowSummary.sales;
    const maxValue = Math.max(data.flowSummary.starting, data.flowSummary.ending, data.flowSummary.physical, totalMovement);
    
    const getWidth = (value: number) => `${(Math.abs(value) / maxValue) * 100}%`;
    
    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Movement Map</h3>
          <div className="text-xs text-gray-500">Hover for details • Click to filter</div>
        </div>
        
        {/* Proportional Flow Bar */}
        <div className="flex items-center gap-1 mb-4">
          <div 
            className="bg-blue-100 px-3 py-2 rounded border text-sm font-medium cursor-pointer hover:bg-blue-200 transition-colors"
            title={`Starting: ${data.flowSummary.starting} units`}
          >
            {data.flowSummary.starting}
          </div>
          
          <div className="flex items-center gap-1">
            <div 
              className="bg-emerald-100 px-2 py-1 rounded text-xs cursor-pointer hover:bg-emerald-200 transition-colors"
              title={`+${data.flowSummary.purchases} Purchases → 2 POs (#PO102, #PO108)`}
              style={{ width: getWidth(data.flowSummary.purchases) }}
            >
              +{data.flowSummary.purchases}
            </div>
            <div 
              className="bg-emerald-100 px-2 py-1 rounded text-xs cursor-pointer hover:bg-emerald-200 transition-colors"
              title={`+${data.flowSummary.returns} Returns`}
              style={{ width: getWidth(data.flowSummary.returns) }}
            >
              +{data.flowSummary.returns}
            </div>
            <div 
              className="bg-amber-100 px-2 py-1 rounded text-xs cursor-pointer hover:bg-amber-200 transition-colors"
              title={`-${data.flowSummary.returnsInTransit} Returns in Transit`}
              style={{ width: getWidth(data.flowSummary.returnsInTransit) }}
            >
              -{data.flowSummary.returnsInTransit}
            </div>
            <div 
              className="bg-red-100 px-2 py-1 rounded text-xs cursor-pointer hover:bg-red-200 transition-colors"
              title={`-${data.flowSummary.writeoffs} Write-offs`}
              style={{ width: getWidth(data.flowSummary.writeoffs) }}
            >
              -{data.flowSummary.writeoffs}
            </div>
            <div 
              className="bg-red-100 px-2 py-1 rounded text-xs cursor-pointer hover:bg-red-200 transition-colors"
              title={`-${data.flowSummary.sales} Sales → 3 Channels (Amazon, Shopify, Retail)`}
              style={{ width: getWidth(data.flowSummary.sales) }}
            >
              -{data.flowSummary.sales}
            </div>
          </div>
          
          <span className="text-blue-600 font-medium">=</span>
          
          <div 
            className="bg-blue-50 px-3 py-2 rounded border text-sm font-medium cursor-pointer hover:bg-blue-100 transition-colors"
            title={`Ending: ${data.flowSummary.ending} units`}
          >
            {data.flowSummary.ending}
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-gray-400">→</span>
            <div className="border-dashed border-gray-300 w-4 h-0"></div>
          </div>
          
          <div 
            className="bg-gray-100 px-3 py-2 rounded border text-sm font-medium cursor-pointer hover:bg-gray-200 transition-colors"
            title={`Physical: ${data.flowSummary.physical} units`}
          >
            {data.flowSummary.physical}
          </div>
        </div>
        
        {/* Clickable Legends */}
        <div className="flex items-center gap-4 text-xs">
          <span className="text-gray-500">Filter by:</span>
          {['Purchases', 'Returns', 'Returns in Transit', 'Write-offs', 'Sales'].map((item, idx) => (
            <button 
              key={idx}
              className="px-2 py-1 rounded hover:bg-gray-200 transition-colors"
              onClick={() => {/* Filter logic */}}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderChannels = () => {
    const totalSales = data.channels.reduce((sum, c) => sum + c.sales, 0);
    const totalReturns = data.channels.reduce((sum, c) => sum + c.returns, 0);
    const totalNetMovement = data.channels.reduce((sum, c) => sum + c.netMovement, 0);
    const avgMargin = data.channels.reduce((sum, c) => sum + c.grossMargin, 0) / data.channels.length;
    const avgTrend = data.channels.reduce((sum, c) => sum + c.trendPercent, 0) / data.channels.length;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search channels..."
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4">Channel</th>
                <th className="text-right py-3 px-4">Sales</th>
                <th className="text-right py-3 px-4">Returns</th>
                <th className="text-right py-3 px-4">Net Movement</th>
                <th className="text-right py-3 px-4">Avg Price</th>
                <th className="text-right py-3 px-4">COGS</th>
                <th className="text-right py-3 px-4">Margin</th>
                <th className="text-center py-3 px-4">Trend</th>
              </tr>
            </thead>
            <tbody>
              {data.channels.map((channel, idx) => (
                <tr 
                  key={idx} 
                  className={`border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                    channel.trend === 'down' && Math.abs(channel.trendPercent) > 5 ? 'bg-red-50' :
                    channel.trend === 'up' && channel.trendPercent > 5 ? 'bg-green-50' : ''
                  }`}
                  title={channel.trend === 'down' ? 
                    `Amazon variance +2 aligns with delayed return posting.` :
                    channel.trend === 'up' ? 
                    `Shopify margin improved due to lower discounting.` : 
                    ''
                  }
                >
                  <td className="py-3 px-4 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center text-xs">
                        {channel.name.charAt(0)}
                      </div>
                      {channel.name}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-red-600 font-mono">{channel.sales}</td>
                  <td className="py-3 px-4 text-right text-emerald-600 font-mono">
                    {channel.returns > 0 ? `+${channel.returns}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-medium font-mono">{channel.netMovement}</td>
                  <td className="py-3 px-4 text-right font-mono">${channel.avgSellingPrice}</td>
                  <td className="py-3 px-4 text-right font-mono">${channel.cogs}</td>
                  <td className="py-3 px-4 text-right font-mono">{channel.grossMargin}%</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {channel.trend === 'up' && <span className="text-green-600">▲</span>}
                      {channel.trend === 'down' && <span className="text-red-600">▼</span>}
                      {channel.trend === 'stable' && <span className="text-gray-400">—</span>}
                      <span className="text-xs font-mono">{Math.abs(channel.trendPercent)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              
              {/* Subtotals Row */}
              <tr className="border-t-2 border-gray-300 bg-gray-100 font-semibold">
                <td className="py-3 px-4">Total</td>
                <td className="py-3 px-4 text-right text-red-600 font-mono">{totalSales}</td>
                <td className="py-3 px-4 text-right text-emerald-600 font-mono">
                  {totalReturns > 0 ? `+${totalReturns}` : '—'}
                </td>
                <td className="py-3 px-4 text-right font-mono">{totalNetMovement}</td>
                <td className="py-3 px-4 text-right font-mono">—</td>
                <td className="py-3 px-4 text-right font-mono">—</td>
                <td className="py-3 px-4 text-right font-mono">{avgMargin.toFixed(0)}% avg</td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {avgTrend > 0 && <span className="text-green-600">▲</span>}
                    {avgTrend < 0 && <span className="text-red-600">▼</span>}
                    {avgTrend === 0 && <span className="text-gray-400">—</span>}
                    <span className="text-xs font-mono">{Math.abs(avgTrend).toFixed(0)}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderLocations = () => (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Location</th>
              <th className="text-right py-2">Starting</th>
              <th className="text-right py-2">Inbound</th>
              <th className="text-right py-2">Outbound</th>
              <th className="text-right py-2">Adjustments</th>
              <th className="text-right py-2">Ending</th>
              <th className="text-right py-2">In Transit</th>
              <th className="text-right py-2">Variance</th>
            </tr>
          </thead>
          <tbody>
            {data.locations.map((location, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50 cursor-pointer">
                <td className="py-2 font-medium">{location.name}</td>
                <td className="py-2 text-right">{location.starting}</td>
                <td className="py-2 text-right text-emerald-600">+{location.inbound}</td>
                <td className="py-2 text-right text-red-600">-{location.outbound}</td>
                <td className="py-2 text-right">{location.adjustments}</td>
                <td className="py-2 text-right font-medium">{location.ending}</td>
                <td className="py-2 text-right">{location.inTransit || '—'}</td>
                <td className={`py-2 text-right ${location.variance > 0 ? 'text-emerald-600' : location.variance < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  {location.variance > 0 ? '+' : ''}{location.variance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPartners = () => (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Partner</th>
              <th className="text-right py-2">Shipments</th>
              <th className="text-right py-2">Returns in Transit</th>
              <th className="text-right py-2">Lost/Damaged</th>
              <th className="text-right py-2">Avg Days</th>
              <th className="text-right py-2">SLA Breach</th>
            </tr>
          </thead>
          <tbody>
            {data.partners.map((partner, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50 cursor-pointer">
                <td className="py-2 font-medium">{partner.name}</td>
                <td className="py-2 text-right">{partner.shipments}</td>
                <td className="py-2 text-right">{partner.returnsInTransit}</td>
                <td className="py-2 text-right">{partner.lostDamaged}</td>
                <td className="py-2 text-right">{partner.avgDeliveryDays}</td>
                <td className={`py-2 text-right ${partner.slaBreachPercent > 15 ? 'text-red-600' : partner.slaBreachPercent > 10 ? 'text-amber-600' : 'text-green-600'}`}>
                  {partner.slaBreachPercent}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFinancial = () => (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Type</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Cost</th>
              <th className="text-left py-2">Account</th>
              <th className="text-center py-2">Journal</th>
            </tr>
          </thead>
          <tbody>
            {data.financial.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="py-2 font-medium">{item.type}</td>
                <td className="py-2 text-right">{item.qty > 0 ? '+' : ''}{item.qty}</td>
                <td className="py-2 text-right">${item.cost}</td>
                <td className="py-2">{item.account}</td>
                <td className="py-2 text-center">
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {item.journalLink}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAuditTrail = () => {
    const [filter, setFilter] = useState<string>('all');
    
    const filteredTrail = data.auditTrail.filter(entry => {
      if (filter === 'all') return true;
      if (filter === 'system') return entry.user === 'System';
      if (filter === 'user') return entry.user !== 'System';
      if (filter === 'accounting') return entry.action.includes('COGS') || entry.action.includes('journal');
      if (filter === 'operational') return entry.action.includes('transfer') || entry.action.includes('adjust');
      return true;
    });

    return (
      <div className="mt-6 pt-4 border-t bg-gray-50 -mx-6 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-900">Activity Timeline</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Filter:</span>
            {['all', 'system', 'user', 'accounting', 'operational'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  filter === f ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredTrail.map((entry, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <div className="flex-shrink-0 w-16 text-gray-500 mt-1">
                🕓 {entry.timestamp}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{entry.user}</span>
                  <span className="text-gray-700">{entry.action}</span>
                </div>
                <div className="text-gray-500 mt-1">
                  ↳ {entry.context}
                  {entry.action.includes('#JV') && (
                    <button className="ml-2 text-blue-600 hover:underline">
                      View Journal
                    </button>
                  )}
                  {entry.action.includes('transfer') && (
                    <button className="ml-2 text-blue-600 hover:underline">
                      View Transfer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl w-[95vw] h-[90vh] flex flex-col max-w-[1200px]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold">{data.sku}</h2>
              <p className="text-sm text-gray-600">{data.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{data.category}</Badge>
              <Badge variant="outline">{data.uom}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center border rounded-lg">
              <Button variant="ghost" size="sm" className="rounded-r-none">
                <Settings className="w-4 h-4 mr-1" />
                Adjust
              </Button>
              <Button variant="ghost" size="sm" className="rounded-none border-x">
                <Move className="w-4 h-4 mr-1" />
                Transfer
              </Button>
              <Button variant="ghost" size="sm" className="rounded-none border-x">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Investigate
              </Button>
              <Button variant="ghost" size="sm" className="rounded-l-none">
                <FileText className="w-4 h-4 mr-1" />
                Journals
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="ml-2">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Live Snapshot */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Synced 2m ago</span>
              <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Data current as of last sync
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            {/* Availability Block */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-xs text-gray-500 mb-2">Availability</div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-lg font-semibold">{data.totalAvailable}</div>
                  <div className="text-xs text-gray-500">Total Available</div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  data.variance > 0 ? 'bg-green-100 text-green-800' : 
                  data.variance < 0 ? 'bg-red-100 text-red-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {data.variance > 0 ? '+' : ''}{data.variance} {data.variance === 0 ? '✔ balanced' : ''}
                </div>
              </div>
            </div>

            {/* Performance Block */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-xs text-gray-500 mb-2">Performance</div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-1">
                    {data.trend === 'up' && <span className="text-green-600">▲</span>}
                    {data.trend === 'down' && <span className="text-red-600">▼</span>}
                    {data.trend === 'stable' && <span className="text-gray-400">—</span>}
                    <span className="text-lg font-semibold">{Math.abs(data.trendPercent)}%</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.trend === 'down' ? 'down from 115 → 105 units' : 'trending up'}
                  </div>
                </div>
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <div className="w-8 h-4 bg-gradient-to-r from-red-400 to-green-400 rounded-sm"></div>
                </div>
              </div>
            </div>

            {/* Valuation Block */}
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-xs text-gray-500 mb-2">Valuation</div>
              <div>
                <div className="text-lg font-semibold">{data.valuation}</div>
                <div className="text-xs text-gray-500">Cost per unit</div>
              </div>
            </div>
          </div>
        </div>

        {/* Flow Summary */}
        {renderFlowSummary()}

        {/* Tabs */}
        <div className="px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span>Inventory</span>
            <span>→</span>
            <span className="font-medium">{data.name}</span>
            <span>→</span>
            <span className="text-blue-600">{tabs.find(t => t.id === activeTab)?.label}</span>
          </div>

          {/* Tab Progress Bar */}
          <div className="flex items-center gap-2 mb-4">
            {tabs.map((tab, idx) => (
              <div key={tab.id} className="flex items-center">
                <button
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    activeTab === tab.id ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
                {idx < tabs.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${
                    idx < tabs.findIndex(t => t.id === activeTab) ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={prevTab} className="hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-gray-500 font-medium">
                {tabs.findIndex(t => t.id === activeTab) + 1} of {tabs.length}
              </span>
              <Button variant="ghost" size="sm" onClick={nextTab} className="hover:bg-gray-100">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              Use ← → arrow keys to navigate
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {activeTab === 'channels' && renderChannels()}
          {activeTab === 'locations' && renderLocations()}
          {activeTab === 'partners' && renderPartners()}
          {activeTab === 'financial' && renderFinancial()}
        </div>

        {/* Audit Trail */}
        {renderAuditTrail()}
      </div>
    </div>
  );
}
