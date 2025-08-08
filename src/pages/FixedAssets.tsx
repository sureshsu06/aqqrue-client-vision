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
  TrendingDown
} from "lucide-react";
import { 
  Panel, 
  PanelGroup, 
  PanelResizeHandle 
} from "react-resizable-panels";

// Mock fixed asset data
const mockFixedAssets = [
  {
    id: "fa-1",
    assetName: "Dell Laptop - Tanvi Arora",
    assetCode: "FA-001",
    category: "Computer Equipment",
    purchaseDate: "2025-05-19",
    purchaseCost: 480850,
    usefulLife: 3,
    salvageValue: 48085,
    depreciationMethod: "Straight Line",
    currentValue: 432765,
    accumulatedDepreciation: 48085,
    status: "In Use"
  },
  {
    id: "fa-2",
    assetName: "Dell Laptop - Kamal Chandani",
    assetCode: "FA-002",
    category: "Computer Equipment",
    purchaseDate: "2025-05-22",
    purchaseCost: 96170,
    usefulLife: 3,
    salvageValue: 9617,
    depreciationMethod: "Straight Line",
    currentValue: 86553,
    accumulatedDepreciation: 9617,
    status: "In Use"
  },
  {
    id: "fa-3",
    assetName: "LG Monitor - Mahat Labs",
    assetCode: "FA-003",
    category: "Computer Equipment",
    purchaseDate: "2025-05-10",
    purchaseCost: 16900,
    usefulLife: 5,
    salvageValue: 1690,
    depreciationMethod: "Straight Line",
    currentValue: 15210,
    accumulatedDepreciation: 1690,
    status: "In Use"
  }
];

// Mock depreciation schedule data
const mockDepreciationSchedule = [
  {
    id: "dep-1",
    assetCode: "FA-001",
    assetName: "Dell Laptop - Tanvi Arora",
    period: "2025-06",
    depreciationExpense: 13357.64,
    accumulatedDepreciation: 13357.64,
    bookValue: 467492.36
  },
  {
    id: "dep-2",
    assetCode: "FA-001",
    assetName: "Dell Laptop - Tanvi Arora",
    period: "2025-07",
    depreciationExpense: 13357.64,
    accumulatedDepreciation: 26715.28,
    bookValue: 454134.72
  },
  {
    id: "dep-3",
    assetCode: "FA-002",
    assetName: "Dell Laptop - Kamal Chandani",
    period: "2025-06",
    depreciationExpense: 2404.25,
    accumulatedDepreciation: 2404.25,
    bookValue: 93765.75
  },
  {
    id: "dep-4",
    assetCode: "FA-002",
    assetName: "Dell Laptop - Kamal Chandani",
    period: "2025-07",
    depreciationExpense: 2404.25,
    accumulatedDepreciation: 4808.50,
    bookValue: 91361.50
  }
];

export default function FixedAssets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("assets");

  const filteredAssets = mockFixedAssets.filter(asset =>
    asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDepreciation = mockDepreciationSchedule.filter(dep =>
    dep.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dep.assetCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAssets = mockFixedAssets.reduce((sum, asset) => sum + asset.purchaseCost, 0);
  const totalDepreciation = mockFixedAssets.reduce((sum, asset) => sum + asset.accumulatedDepreciation, 0);
  const totalCurrentValue = mockFixedAssets.reduce((sum, asset) => sum + asset.currentValue, 0);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      
      {/* Compact Header */}
      <div className="border-b border-mobius-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mobius-gray-500 w-4 h-4" />
              <Input 
                placeholder="Search assets..." 
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-px h-6 bg-mobius-gray-200 mx-2" />

            {/* Filter */}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-mobius-gray-100 rounded">
              <Filter className="w-4 h-4 text-mobius-gray-600" />
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Export */}
            <Button variant="outline" size="sm" className="h-8">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            {/* Summary indicators */}
            <div className="flex items-center space-x-4 text-sm text-mobius-gray-600">
              <div className="flex items-center space-x-1">
                <Building className="w-4 h-4 text-blue-600" />
                <span>Total Assets: ₹{totalAssets.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span>Total Depreciation: ₹{totalDepreciation.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calculator className="w-4 h-4 text-green-600" />
                <span>Current Value: ₹{totalCurrentValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Assets Content */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          {/* Assets List */}
          <Panel defaultSize={60} minSize={40} className="min-h-0">
            <div className="h-full flex flex-col border-r border-mobius-gray-100">
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="assets" className="flex items-center space-x-2">
                        <Building className="w-4 h-4" />
                        <span>Fixed Assets</span>
                      </TabsTrigger>
                      <TabsTrigger value="depreciation" className="flex items-center space-x-2">
                        <Calculator className="w-4 h-4" />
                        <span>Depreciation Schedule</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="assets" className="space-y-0">
                      <div className="bg-white rounded-lg border border-mobius-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-mobius-gray-50 px-4 py-3 border-b border-mobius-gray-200">
                          <div className="grid grid-cols-7 gap-4 text-sm font-medium text-mobius-gray-700">
                            <div>Asset Code</div>
                            <div className="col-span-2">Asset Name</div>
                            <div>Purchase Cost</div>
                            <div>Current Value</div>
                            <div>Depreciation</div>
                            <div>Status</div>
                          </div>
                        </div>

                        {/* Asset Rows */}
                        <div className="divide-y divide-mobius-gray-200">
                          {filteredAssets.map((asset) => (
                            <div 
                              key={asset.id}
                              className={`px-4 py-3 hover:bg-mobius-gray-50 cursor-pointer ${
                                selectedAsset?.id === asset.id ? 'bg-mobius-blue-50' : ''
                              }`}
                              onClick={() => setSelectedAsset(asset)}
                            >
                              <div className="grid grid-cols-7 gap-4 text-sm">
                                <div className="font-medium text-mobius-gray-900">
                                  {asset.assetCode}
                                </div>
                                <div className="col-span-2 text-mobius-gray-900">
                                  {asset.assetName}
                                </div>
                                <div className="text-mobius-gray-900">
                                  ₹{asset.purchaseCost.toLocaleString()}
                                </div>
                                <div className="text-green-600 font-medium">
                                  ₹{asset.currentValue.toLocaleString()}
                                </div>
                                <div className="text-red-600">
                                  ₹{asset.accumulatedDepreciation.toLocaleString()}
                                </div>
                                <div>
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                    {asset.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="depreciation" className="space-y-0">
                      <div className="bg-white rounded-lg border border-mobius-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-mobius-gray-50 px-4 py-3 border-b border-mobius-gray-200">
                          <div className="grid grid-cols-6 gap-4 text-sm font-medium text-mobius-gray-700">
                            <div>Asset Code</div>
                            <div>Asset Name</div>
                            <div>Period</div>
                            <div>Depreciation</div>
                            <div>Accumulated</div>
                            <div>Book Value</div>
                          </div>
                        </div>

                        {/* Depreciation Rows */}
                        <div className="divide-y divide-mobius-gray-200">
                          {filteredDepreciation.map((dep) => (
                            <div 
                              key={dep.id}
                              className={`px-4 py-3 hover:bg-mobius-gray-50 cursor-pointer ${
                                selectedAsset?.assetCode === dep.assetCode ? 'bg-mobius-blue-50' : ''
                              }`}
                              onClick={() => setSelectedAsset(mockFixedAssets.find(a => a.assetCode === dep.assetCode))}
                            >
                              <div className="grid grid-cols-6 gap-4 text-sm">
                                <div className="font-medium text-mobius-gray-900">
                                  {dep.assetCode}
                                </div>
                                <div className="text-mobius-gray-900">
                                  {dep.assetName}
                                </div>
                                <div className="text-mobius-gray-900">
                                  {dep.period}
                                </div>
                                <div className="text-red-600 font-medium">
                                  ₹{dep.depreciationExpense.toLocaleString()}
                                </div>
                                <div className="text-red-600">
                                  ₹{dep.accumulatedDepreciation.toLocaleString()}
                                </div>
                                <div className="text-green-600 font-medium">
                                  ₹{dep.bookValue.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </Panel>

          {/* Asset Details Panel */}
          <PanelResizeHandle className="w-1 bg-mobius-gray-100 hover:bg-mobius-gray-200 transition-colors" />
          
          <Panel defaultSize={40} minSize={25} className="min-h-0">
            <div className="h-full flex flex-col">
              {selectedAsset ? (
                <div className="p-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-mobius-gray-900">
                        {selectedAsset.assetName}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {selectedAsset.assetCode}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-mobius-gray-500">Category</p>
                          <p className="text-sm font-medium text-mobius-gray-900">
                            {selectedAsset.category}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-mobius-gray-500">Purchase Date</p>
                          <p className="text-sm font-medium text-mobius-gray-900">
                            {new Date(selectedAsset.purchaseDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-mobius-gray-500">Purchase Cost</p>
                          <p className="text-sm font-semibold text-mobius-gray-900">
                            ₹{selectedAsset.purchaseCost.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-mobius-gray-500">Current Value</p>
                          <p className="text-sm font-semibold text-green-600">
                            ₹{selectedAsset.currentValue.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-mobius-gray-500">Useful Life</p>
                          <p className="text-sm font-medium text-mobius-gray-900">
                            {selectedAsset.usefulLife} years
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-mobius-gray-500">Salvage Value</p>
                          <p className="text-sm font-medium text-mobius-gray-900">
                            ₹{selectedAsset.salvageValue.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-mobius-gray-500">Depreciation Method</p>
                          <p className="text-sm font-medium text-mobius-gray-900">
                            {selectedAsset.depreciationMethod}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-mobius-gray-500">Accumulated Depreciation</p>
                          <p className="text-sm font-semibold text-red-600">
                            ₹{selectedAsset.accumulatedDepreciation.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-mobius-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-mobius-gray-900 mb-3">Depreciation Schedule</h4>
                        <div className="space-y-2">
                          {mockDepreciationSchedule
                            .filter(dep => dep.assetCode === selectedAsset.assetCode)
                            .slice(0, 3)
                            .map((dep) => (
                              <div key={dep.id} className="flex justify-between text-sm">
                                <span className="text-mobius-gray-600">{dep.period}</span>
                                <span className="text-red-600 font-medium">
                                  ₹{dep.depreciationExpense.toLocaleString()}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-mobius-gray-500">
                    <Building className="w-8 h-8 mx-auto mb-2" />
                    <p>Select an asset to view details</p>
                  </div>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
} 