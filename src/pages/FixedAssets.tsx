import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Download, 
  Building,
  Calculator,
  Calendar,
  TrendingDown,
  Settings,
  Eye,
  ChevronDown,
  Plus
} from "lucide-react";
import { 
  Panel, 
  PanelGroup, 
  PanelResizeHandle 
} from "react-resizable-panels";
import { useClientContext } from "@/components/Layout";

// Mock fixed asset data matching the schedule format
const mockFixedAssets = [
  {
    id: "fa-1",
    siNo: 1,
    party: "Sogo Computers",
    billDate: "2025-05-19",
    billNo: "PCD-143",
    particulars: "Laptop Purchase",
    qty: 1,
    lifeMonths: 36,
    installationDate: "2025-05-19",
    grossBlock: 480850,
    monthlyDepreciation: 13357,
    depreciationByMonth: {
      "Dec-24": 0,
      "Jan-25": 0,
      "Feb-25": 0,
      "Mar-25": 0,
      "Apr-25": 0
    },
    totalDepreciation: 0,
    wdv: 480850,
    category: "Computers",
    client: "Elire",
    comment: "High-end laptop for development team"
  },
  {
    id: "fa-2",
    siNo: 2,
    party: "Sogo Computers",
    billDate: "2025-05-22",
    billNo: "PCD-159",
    particulars: "Laptop Purchase",
    qty: 1,
    lifeMonths: 36,
    installationDate: "2025-05-22",
    grossBlock: 96170,
    monthlyDepreciation: 2671,
    depreciationByMonth: {
      "Dec-24": 0,
      "Jan-25": 0,
      "Feb-25": 0,
      "Mar-25": 0,
      "Apr-25": 0
    },
    totalDepreciation: 0,
    wdv: 96170,
    category: "Computers",
    client: "Elire",
    comment: "Standard laptop for office use"
  },
  {
    id: "fa-3",
    siNo: 3,
    party: "Sogo Computers",
    billDate: "2025-05-22",
    billNo: "PCD-160",
    particulars: "Laptop Purchase",
    qty: 1,
    lifeMonths: 36,
    installationDate: "2025-05-22",
    grossBlock: 96170,
    monthlyDepreciation: 2671,
    depreciationByMonth: {
      "Dec-24": 0,
      "Jan-25": 0,
      "Feb-25": 0,
      "Mar-25": 0,
      "Apr-25": 0
    },
    totalDepreciation: 0,
    wdv: 96170,
    category: "Computers",
    client: "Elire",
    comment: "Additional laptop for new hire"
  },
  {
    id: "fa-4",
    siNo: 4,
    party: "Ozone Computer Services",
    billDate: "2025-05-10",
    billNo: "725-MAHAT LABS (1)",
    particulars: "Monitor LG",
    qty: 1,
    lifeMonths: 36,
    installationDate: "2025-05-10",
    grossBlock: 16900,
    monthlyDepreciation: 469,
    depreciationByMonth: {
      "Dec-24": 0,
      "Jan-25": 0,
      "Feb-25": 0,
      "Mar-25": 0,
      "Apr-25": 0
    },
    totalDepreciation: 0,
    wdv: 16900,
    category: "Computers",
    client: "Mahat",
    comment: "24-inch monitor for lab workstation"
  }
];

// Column configuration with visibility toggle
const columnConfig = [
  { key: 'siNo', label: 'SI No.', visible: true, width: 'w-12' },
  { key: 'client', label: 'Client', visible: true, width: 'w-20' },
  { key: 'party', label: 'Party', visible: true, width: 'w-48' },
  { key: 'billDate', label: 'Bill Dt', visible: false, width: 'w-24' },
  { key: 'billNo', label: 'Bill No', visible: true, width: 'w-24' },
  { key: 'particulars', label: 'Particulars', visible: true, width: 'w-64' },
  { key: 'comment', label: 'Comment', visible: false, width: 'w-48' },
  { key: 'qty', label: 'Qty', visible: false, width: 'w-16' },
  { key: 'lifeMonths', label: 'Life (months)', visible: false, width: 'w-24' },
  { key: 'installationDate', label: 'Date of Installation', visible: false, width: 'w-32' },
  { key: 'grossBlock', label: 'Gross Block', visible: true, width: 'w-32' },
  { key: 'monthlyDepreciation', label: 'Depreciation', visible: true, width: 'w-40' },
  { key: 'dec24', label: 'Dec-24', visible: false, width: 'w-20' },
  { key: 'jan25', label: 'Jan-25', visible: false, width: 'w-20' },
  { key: 'feb25', label: 'Feb-25', visible: false, width: 'w-20' },
  { key: 'mar25', label: 'Mar-25', visible: false, width: 'w-20' },
  { key: 'apr25', label: 'Apr-25', visible: true, width: 'w-20' },
  { key: 'totalDepreciation', label: 'Depn till date', visible: true, width: 'w-32' },
  { key: 'wdv', label: 'WDV as on', visible: true, width: 'w-32' }
];

export default function FixedAssets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("assets");
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [columns, setColumns] = useState(columnConfig);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [activeHeaderTab, setActiveHeaderTab] = useState("fixed-asset-register");
  const [newAssetData, setNewAssetData] = useState({
    party: "",
    billDate: "",
    billNo: "",
    particulars: "",
    grossBlock: "",
    client: "Elire",
    comment: ""
  });
  const { selectedClient } = useClientContext();

  const filteredAssets = mockFixedAssets.filter(asset => {
    // First filter by selected client
    const clientMatch = selectedClient === "All Clients" || asset.client === selectedClient;
    
    // Then filter by search term
    const searchMatch = asset.particulars.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       asset.party.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       asset.billNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return clientMatch && searchMatch;
  });

  const visibleColumns = columns.filter(col => col.visible);

  const totalGrossBlock = mockFixedAssets.reduce((sum, asset) => sum + asset.grossBlock, 0);
  const totalMonthlyDepreciation = mockFixedAssets.reduce((sum, asset) => sum + asset.monthlyDepreciation, 0);
  const totalDepreciation = mockFixedAssets.reduce((sum, asset) => sum + asset.totalDepreciation, 0);
  const totalWDV = mockFixedAssets.reduce((sum, asset) => sum + asset.wdv, 0);

  const toggleColumnVisibility = (key: string) => {
    setColumns(prev => prev.map(col => 
      col.key === key ? { ...col, visible: !col.visible } : col
    ));
  };

  const toggleAssetSelection = (assetId: string) => {
    setSelectedAssets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
      } else {
        newSet.add(assetId);
      }
      return newSet;
    });
  };

  const selectAllAssets = () => {
    const allAssetIds = filteredAssets.map(asset => asset.id);
    setSelectedAssets(new Set(allAssetIds));
  };

  const deselectAllAssets = () => {
    setSelectedAssets(new Set());
  };

  const isAllSelected = filteredAssets.length > 0 && selectedAssets.size === filteredAssets.length;
  const isIndeterminate = selectedAssets.size > 0 && selectedAssets.size < filteredAssets.length;

  const handleAddAsset = () => {
    const newAsset = {
      id: `fa-${Date.now()}`,
      siNo: mockFixedAssets.length + 1,
      party: newAssetData.party,
      billDate: newAssetData.billDate,
      billNo: newAssetData.billNo,
      particulars: newAssetData.particulars,
      qty: 1,
      lifeMonths: 36,
      installationDate: newAssetData.billDate,
      grossBlock: parseInt(newAssetData.grossBlock),
      monthlyDepreciation: Math.round(parseInt(newAssetData.grossBlock) / 36),
      depreciationByMonth: {
        "Dec-24": 0,
        "Jan-25": 0,
        "Feb-25": 0,
        "Mar-25": 0,
        "Apr-25": 0
      },
      totalDepreciation: 0,
      wdv: parseInt(newAssetData.grossBlock),
      category: "Computers",
      client: newAssetData.client,
      comment: newAssetData.comment
    };

    mockFixedAssets.push(newAsset);
    
    // Reset form and close modal
    setNewAssetData({
      party: "",
      billDate: "",
      billNo: "",
      particulars: "",
      grossBlock: "",
      client: "Elire",
      comment: ""
    });
    setShowAddAssetModal(false);
  };

  const renderCellValue = (asset: any, column: any) => {
    switch (column.key) {
      case 'siNo':
        return asset.siNo;
      case 'client':
        return asset.client;
      case 'party':
        return asset.party;
      case 'billDate':
        return new Date(asset.billDate).toLocaleDateString('en-GB');
      case 'billNo':
        return asset.billNo;
      case 'particulars':
        return asset.particulars;
      case 'comment':
        return asset.comment || '-';
      case 'qty':
        return asset.qty;
      case 'lifeMonths':
        return asset.lifeMonths;
      case 'installationDate':
        return asset.installationDate ? new Date(asset.installationDate).toLocaleDateString('en-GB') : '-';
      case 'grossBlock':
        return `₹${asset.grossBlock.toLocaleString()}`;
      case 'monthlyDepreciation':
        return `₹${asset.monthlyDepreciation.toLocaleString()}`;
      case 'dec24':
        return asset.depreciationByMonth['Dec-24'] > 0 ? `₹${asset.depreciationByMonth['Dec-24'].toLocaleString()}` : '-';
      case 'jan25':
        return asset.depreciationByMonth['Jan-25'] > 0 ? `₹${asset.depreciationByMonth['Jan-25'].toLocaleString()}` : '-';
      case 'feb25':
        return asset.depreciationByMonth['Feb-25'] > 0 ? `₹${asset.depreciationByMonth['Feb-25'].toLocaleString()}` : '-';
      case 'mar25':
        return asset.depreciationByMonth['Mar-25'] > 0 ? `₹${asset.depreciationByMonth['Mar-25'].toLocaleString()}` : '-';
      case 'apr25':
        return asset.depreciationByMonth['Apr-25'] > 0 ? `₹${asset.depreciationByMonth['Apr-25'].toLocaleString()}` : '-';
      case 'totalDepreciation':
        return asset.totalDepreciation > 0 ? `₹${asset.totalDepreciation.toLocaleString()}` : '-';
      case 'wdv':
        return `₹${asset.wdv.toLocaleString()}`;
      default:
        return '-';
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      
      {/* Compact Header */}
      <div className="border-b border-mobius-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-1">
            {/* Tabs */}
            <div className="flex space-x-8">
              <div 
                className={`pb-1 text-sm cursor-pointer transition-colors ${
                  activeHeaderTab === "fixed-asset-register" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveHeaderTab("fixed-asset-register")}
              >
                Fixed Asset Register
              </div>
              <div 
                className={`pb-1 text-sm cursor-pointer transition-colors ${
                  activeHeaderTab === "transactions" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveHeaderTab("transactions")}
              >
                Transactions
              </div>
              <div 
                className={`pb-1 text-sm cursor-pointer transition-colors ${
                  activeHeaderTab === "depreciation-schedule" 
                    ? "text-blue-600 border-b-2 border-blue-600" 
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveHeaderTab("depreciation-schedule")}
              >
                Depreciation Schedule
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Selection Summary */}
            {selectedAssets.size > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{selectedAssets.size} asset{selectedAssets.size !== 1 ? 's' : ''} selected</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-red-600 hover:bg-red-50"
                  onClick={() => setSelectedAssets(new Set())}
                >
                  Clear
                </Button>
              </div>
            )}

            {/* Column Selector */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-3 hover:bg-mobius-gray-100 rounded"
              onClick={() => setShowColumnSelector(!showColumnSelector)}
            >
              <Settings className="w-4 h-4 text-mobius-gray-600 mr-1" />
              Columns
            </Button>

            {/* Export */}
            <Button variant="outline" size="sm" className="h-8">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Column Selector Dropdown */}
        {showColumnSelector && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-4 gap-4">
              {columns.map((column) => (
                <label key={column.key} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => toggleColumnVisibility(column.key)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-gray-700">{column.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Assets Content */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          {/* Assets List */}
          <Panel defaultSize={80} minSize={60} className="min-h-0">
            <div className="h-full flex flex-col border-r border-mobius-gray-100 overflow-y-auto">
              <div className="flex-1">
                <div className="bg-white">
                  {/* Table Header */}
                  <div className="bg-gray-50 py-3 px-4 border-b border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Fixed Asset Schedule as at 30th April 2025
                    </div>
                    <div className="grid items-center" style={{ gridTemplateColumns: `20px repeat(${visibleColumns.length}, minmax(0, 1fr))` }}>
                      {/* Select All Checkbox */}
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          ref={(input) => {
                            if (input) input.indeterminate = isIndeterminate;
                          }}
                          onChange={() => isAllSelected ? deselectAllAssets() : selectAllAssets()}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </div>
                      
                      {/* Column Headers */}
                      {visibleColumns.map((column) => (
                        <div key={column.key} className={`text-xs font-medium text-gray-600 ${column.width} flex items-center pl-2`}>
                          {column.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section A: Fixed Asset - Computers */}
                  <div className="border-b border-gray-200">
                    <div className="bg-blue-50 py-2 px-4 border-b border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-blue-900">Section A: Fixed Asset - Computers</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
                          onClick={() => setShowAddAssetModal(true)}
                          title="Add new asset"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Asset Rows */}
                    {filteredAssets.filter(asset => asset.category === 'Computers').map((asset) => (
                      <div 
                        key={asset.id}
                        className={`grid py-2 px-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer items-center ${
                          selectedAsset?.id === asset.id ? 'bg-blue-50' : ''
                        }`}
                        style={{ gridTemplateColumns: `20px repeat(${visibleColumns.length}, minmax(0, 1fr))` }}
                        onClick={() => setSelectedAsset(asset)}
                      >
                        {/* Asset Selection Checkbox */}
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedAssets.has(asset.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleAssetSelection(asset.id);
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </div>

                        {/* Asset Data Cells */}
                        {visibleColumns.map((column) => (
                          <div key={column.key} className="text-sm flex items-center pl-2">
                            {renderCellValue(asset, column)}
                          </div>
                        ))}
                      </div>
                    ))}

                    {/* Section A Totals */}
                    <div className="bg-gray-100 py-2 px-4 border-b border-gray-200">
                      <div className="grid font-medium text-sm items-center" style={{ gridTemplateColumns: `20px repeat(${visibleColumns.length}, minmax(0, 1fr))` }}>
                        {/* Empty space for checkbox column */}
                        <div></div>
                        
                        {visibleColumns.map((column, index) => {
                          if (index === 0) {
                            return <div key={column.key} className="flex items-center pl-2">Total - Computers</div>;
                          } else if (column.key === 'grossBlock') {
                            return (
                              <div key={column.key} className="flex items-center pl-2">
                                ₹{filteredAssets.filter(a => a.category === 'Computers').reduce((sum, a) => sum + a.grossBlock, 0).toLocaleString()}
                              </div>
                            );
                          } else if (column.key === 'monthlyDepreciation') {
                            return (
                              <div key={column.key} className="flex items-center pl-2">
                                ₹{filteredAssets.filter(a => a.category === 'Computers').reduce((sum, a) => sum + a.monthlyDepreciation, 0).toLocaleString()}
                              </div>
                            );
                          } else if (column.key === 'apr25') {
                            return (
                              <div key={column.key} className="flex items-center pl-2">
                                ₹{filteredAssets.filter(a => a.category === 'Computers').reduce((sum, a) => sum + a.depreciationByMonth['Apr-25'], 0).toLocaleString()}
                              </div>
                            );
                          } else if (column.key === 'totalDepreciation') {
                            return (
                              <div key={column.key} className="flex items-center pl-2">
                                ₹{filteredAssets.filter(a => a.category === 'Computers').reduce((sum, a) => sum + a.totalDepreciation, 0).toLocaleString()}
                              </div>
                            );
                          } else if (column.key === 'wdv') {
                            return (
                              <div key={column.key} className="flex items-center pl-2">
                                ₹{filteredAssets.filter(a => a.category === 'Computers').reduce((sum, a) => sum + a.wdv, 0).toLocaleString()}
                              </div>
                            );
                          } else {
                            return <div key={column.key} className="flex items-center pl-2">-</div>;
                          }
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Section B: Equipment (Empty) */}
                  <div className="border-b border-gray-200">
                    <div className="bg-gray-50 py-2 px-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-700">Section B: Equipment</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-600 hover:bg-gray-100"
                          onClick={() => setShowAddAssetModal(true)}
                          title="Add new equipment"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="py-4 px-4 text-sm text-gray-500 text-center">
                      No equipment assets found
                    </div>
                  </div>

                  {/* Section C: Leasehold Improvements (Empty) */}
                  <div className="border-b border-gray-200">
                    <div className="bg-gray-50 py-2 px-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-700">Section C: Leasehold Improvements</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-600 hover:bg-gray-100"
                          onClick={() => setShowAddAssetModal(true)}
                          title="Add new leasehold improvement"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="py-4 px-4 text-sm text-gray-500 text-center">
                      No leasehold improvement assets found
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="bg-gray-200 py-3 px-4">
                    <div className="grid font-bold text-sm items-center" style={{ gridTemplateColumns: `20px repeat(${visibleColumns.length}, minmax(0, 1fr))` }}>
                      {/* Empty space for checkbox column */}
                      <div></div>
                      
                      {visibleColumns.map((column, index) => {
                        if (index === 0) {
                          return <div key={column.key} className="flex items-center pl-2">Grand Total (A+B+C)</div>;
                        } else if (column.key === 'grossBlock') {
                          return (
                            <div key={column.key} className="flex items-center pl-2">
                              ₹{totalGrossBlock.toLocaleString()}
                            </div>
                          );
                        } else if (column.key === 'monthlyDepreciation') {
                          return (
                            <div key={column.key} className="flex items-center pl-2">
                              ₹{totalMonthlyDepreciation.toLocaleString()}
                            </div>
                          );
                        } else if (column.key === 'apr25') {
                          return (
                            <div key={column.key} className="flex items-center pl-2">
                              ₹{filteredAssets.reduce((sum, a) => sum + a.depreciationByMonth['Apr-25'], 0).toLocaleString()}
                            </div>
                          );
                        } else if (column.key === 'totalDepreciation') {
                          return (
                            <div key={column.key} className="flex items-center pl-2">
                              ₹{totalDepreciation.toLocaleString()}
                            </div>
                          );
                        } else if (column.key === 'wdv') {
                          return (
                            <div key={column.key} className="flex items-center pl-2">
                              ₹{totalWDV.toLocaleString()}
                            </div>
                          );
                        } else {
                          return <div key={column.key} className="flex items-center pl-2">-</div>;
                        }
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          {/* Asset Details Panel */}
          <PanelResizeHandle className="w-1 bg-mobius-gray-100 hover:bg-mobius-gray-200 transition-colors" />
          
          <Panel defaultSize={20} minSize={15} className="min-h-0">
            <div className="h-full flex flex-col overflow-y-auto">
              {selectedAsset ? (
                <div className="p-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-mobius-gray-900">
                        {selectedAsset.particulars}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {selectedAsset.billNo}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-mobius-gray-500">Vendor</p>
                          <p className="text-sm font-medium text-mobius-gray-900">
                            {selectedAsset.party}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-mobius-gray-500">Bill Date</p>
                          <p className="text-sm font-medium text-mobius-gray-900">
                            {new Date(selectedAsset.billDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-mobius-gray-500">Gross Block</p>
                          <p className="text-sm font-semibold text-mobius-gray-900">
                            ₹{selectedAsset.grossBlock.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-mobius-gray-500">Monthly Depreciation</p>
                          <p className="text-sm font-semibold text-mobius-gray-900">
                            ₹{selectedAsset.monthlyDepreciation.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-mobius-gray-500">Total Depreciation</p>
                          <p className="text-sm font-semibold text-mobius-gray-900">
                            ₹{selectedAsset.totalDepreciation.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-mobius-gray-500">WDV</p>
                          <p className="text-sm font-semibold text-mobius-gray-900">
                            ₹{selectedAsset.wdv.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-mobius-gray-500">Asset Life</p>
                          <p className="text-sm font-medium text-mobius-gray-900">
                            {selectedAsset.lifeMonths} months
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-mobius-gray-500">Installation Date</p>
                          <p className="text-sm font-medium text-mobius-gray-900">
                            {new Date(selectedAsset.installationDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Depreciation Schedule Section */}
                      <div className="border-t border-mobius-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-mobius-gray-900 mb-3">Monthly Scheduled Entries:</h4>
                        
                        {/* Summary Stats */}
                        <div className="bg-mobius-gray-50 rounded-lg p-3 mb-4">
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <p className="text-mobius-gray-500">Remaining Life</p>
                              <p className="font-medium text-mobius-gray-900">
                                {Math.max(0, selectedAsset.lifeMonths - Math.floor(selectedAsset.totalDepreciation / selectedAsset.monthlyDepreciation))} months
                              </p>
                            </div>
                            <div>
                              <p className="text-mobius-gray-500">Depreciation Rate</p>
                              <p className="font-medium text-mobius-gray-900">
                                {((selectedAsset.monthlyDepreciation * 12 / selectedAsset.grossBlock) * 100).toFixed(2)}% p.a.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Journal Entry Table */}
                        <div className="mt-4">
                          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide mb-3 pt-2">
                            <div className="col-span-5 pl-0">ACCOUNT</div>
                            <div className="col-span-3 text-right">DEBIT</div>
                            <div className="col-span-3 text-right">CREDIT</div>
                            <div className="col-span-1"></div>
                          </div>
                          
                          <div className="space-y-1">
                            {/* Single Journal Entry Example */}
                            <div className="space-y-1">
                              {/* Debit Row - Depreciation */}
                              <div className="grid grid-cols-12 gap-2 text-sm items-center border-b border-mobius-gray-200 pb-2">
                                <div className="col-span-5">
                                  <span className="text-sm font-medium text-mobius-gray-900">
                                    Depreciation (5001)
                                  </span>
                                </div>
                                <div className="col-span-3 text-right">
                                  <span className="text-sm font-medium text-mobius-gray-900">
                                    ₹{selectedAsset.monthlyDepreciation.toLocaleString()}
                                  </span>
                                </div>
                                <div className="col-span-3 text-right">
                                  <span className="text-sm font-medium text-mobius-gray-900">—</span>
                                </div>
                                <div className="col-span-1"></div>
                              </div>
                              
                              {/* Credit Row - Accumulated Depreciation */}
                              <div className="grid grid-cols-12 gap-2 text-sm items-center border-b border-mobius-gray-200 pb-2">
                                <div className="col-span-5">
                                  <span className="text-sm font-medium text-mobius-gray-900">
                                    Accumulated Dep - {selectedAsset.party} (1001)
                                  </span>
                                </div>
                                <div className="col-span-3 text-right">
                                  <span className="text-sm font-medium text-mobius-gray-900">—</span>
                                </div>
                                <div className="col-span-3 text-right">
                                  <span className="text-sm font-medium text-mobius-gray-900">
                                    ₹{selectedAsset.monthlyDepreciation.toLocaleString()}
                                  </span>
                                </div>
                                <div className="col-span-1"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Informational Text Box */}
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                          <p>Monthly depreciation entry for {selectedAsset.party} asset</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" variant="outline" className="text-xs">
                            Generate JE
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            Export Schedule
                          </Button>
                        </div>
                      </div>

                      {/* Past Recorded Entries Section */}
                      <div className="border-t border-mobius-gray-200 pt-4">
                        <div 
                          className="flex items-center justify-between cursor-pointer hover:bg-mobius-gray-50 p-2 rounded transition-colors"
                          onClick={() => setSelectedAsset({...selectedAsset, showPastEntries: !selectedAsset.showPastEntries})}
                        >
                          <h4 className="text-sm font-medium text-mobius-gray-900">Past Recorded Entries</h4>
                          <ChevronDown 
                            className={`w-4 h-4 text-mobius-gray-500 transition-transform ${
                              selectedAsset.showPastEntries ? 'rotate-180' : ''
                            }`} 
                          />
                        </div>
                        
                        {selectedAsset.showPastEntries && (
                          <div className="mt-3 space-y-3">
                            {/* Past Entries List */}
                            {Object.entries(selectedAsset.depreciationByMonth)
                              .filter(([month, amount]) => (amount as number) > 0)
                              .map(([month, amount], index) => (
                                <div key={month} className="bg-mobius-gray-50 rounded-lg p-3 border border-mobius-gray-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-mobius-gray-900">{month}</span>
                                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                      Recorded
                                    </Badge>
                                  </div>
                                  
                                  {/* Past Entry Journal Format */}
                                  <div className="grid grid-cols-12 gap-2 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide mb-2">
                                    <div className="col-span-5 pl-0">ACCOUNT</div>
                                    <div className="col-span-3 text-right">DEBIT</div>
                                    <div className="col-span-3 text-right">CREDIT</div>
                                    <div className="col-span-1"></div>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    {/* Debit Row */}
                                    <div className="grid grid-cols-12 gap-2 text-xs items-center border-b border-mobius-gray-200 pb-1">
                                      <div className="col-span-5">
                                        <span className="text-mobius-gray-900">
                                          Depreciation (5001)
                                        </span>
                                      </div>
                                      <div className="col-span-3 text-right">
                                        <span className="text-mobius-gray-900">
                                          ₹{(amount as number).toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="col-span-3 text-right">
                                        <span className="text-mobius-gray-900">—</span>
                                      </div>
                                      <div className="col-span-1"></div>
                                    </div>
                                    
                                    {/* Credit Row */}
                                    <div className="grid grid-cols-12 gap-2 text-xs items-center">
                                      <div className="col-span-5">
                                        <span className="text-mobius-gray-900">
                                          Accumulated Dep - {selectedAsset.party} (1001)
                                        </span>
                                      </div>
                                      <div className="col-span-3 text-right">
                                        <span className="text-mobius-gray-900">—</span>
                                      </div>
                                      <div className="col-span-3 text-right">
                                        <span className="text-mobius-gray-900">
                                          ₹{(amount as number).toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="col-span-1"></div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2 text-xs text-mobius-gray-500">
                                    JE #: DEP-{month.replace('-', '')}-{selectedAsset.id.slice(-3)}
                                  </div>
                                </div>
                              ))}
                            
                            {/* No Past Entries Message */}
                            {Object.values(selectedAsset.depreciationByMonth).every(amount => (amount as number) === 0) && (
                              <div className="text-center py-4 text-sm text-mobius-gray-500">
                                <div className="w-8 h-8 mx-auto mb-2 bg-mobius-gray-100 rounded-full flex items-center justify-center">
                                  <Calendar className="w-4 h-4 text-mobius-gray-400" />
                                </div>
                                <p>No depreciation entries recorded yet</p>
                                <p className="text-xs">Entries will appear here once depreciation is posted</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-mobius-gray-500">
                    <Eye className="w-8 h-8 mx-auto mb-2" />
                    <p>Select an asset to view details</p>
                  </div>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Add Asset Modal */}
      {showAddAssetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Fixed Asset</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowAddAssetModal(false)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Upload Invoice</p>
                      <p className="text-xs text-gray-500">PDF, JPG, or PNG up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="invoice-upload"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          // Simulate auto-fill from invoice
                          const fileName = e.target.files[0].name;
                          const mockData = {
                            party: "Auto-filled from invoice",
                            billDate: new Date().toISOString().split('T')[0],
                            billNo: fileName.split('.')[0],
                            particulars: "Asset from invoice",
                            grossBlock: "50000",
                            client: "Elire",
                            comment: ""
                          };
                          setNewAssetData(mockData);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('invoice-upload')?.click()}
                      className="mt-2"
                    >
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comment Box */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment (Optional)
                </label>
                <textarea
                  value={newAssetData.comment}
                  onChange={(e) => setNewAssetData({...newAssetData, comment: e.target.value})}
                  placeholder="Add any notes or comments about this asset..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              {/* Preview of auto-filled data */}
              {newAssetData.party && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Auto-filled Details:</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Vendor:</span>
                      <p className="font-medium">{newAssetData.party}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Bill Date:</span>
                      <p className="font-medium">{newAssetData.billDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Bill No:</span>
                      <p className="font-medium">{newAssetData.billNo}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <p className="font-medium">₹{newAssetData.grossBlock}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    * All details are automatically extracted from the invoice
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddAssetModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddAsset}
                disabled={!newAssetData.party}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Asset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 