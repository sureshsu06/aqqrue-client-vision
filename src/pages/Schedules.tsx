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
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign
} from "lucide-react";
import { 
  Panel, 
  PanelGroup, 
  PanelResizeHandle 
} from "react-resizable-panels";

// Mock revenue schedule data
const mockRevenueSchedule = [
  {
    id: "rev-1",
    customer: "Bishop Wisecarver",
    contractValue: 7020,
    startDate: "2025-10-01",
    endDate: "2026-07-31",
    monthlyRevenue: 702,
    totalRecognized: 0,
    totalDeferred: 7020,
    status: "active"
  },
  {
    id: "rev-2",
    customer: "MARKETview Technology",
    contractValue: 30000,
    startDate: "2025-07-01",
    endDate: "2028-08-31",
    monthlyRevenue: 789.47,
    totalRecognized: 2105.26,
    totalDeferred: 27894.74,
    status: "active"
  },
  {
    id: "rev-3",
    customer: "Sera",
    contractValue: 95000,
    startDate: "2025-06-01",
    endDate: "2026-05-31",
    monthlyRevenue: 7916.67,
    totalRecognized: 0,
    totalDeferred: 95000,
    status: "active"
  }
];

// Mock expense schedule data
const mockExpenseSchedule = [
  {
    id: "exp-1",
    vendor: "HubSpot Inc",
    expenseType: "Software Subscription",
    monthlyAmount: 774.70,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    totalExpensed: 3873.50,
    remainingAmount: 3873.50,
    status: "active"
  },
  {
    id: "exp-2",
    vendor: "AWS",
    expenseType: "Cloud Infrastructure",
    monthlyAmount: 156.78,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    totalExpensed: 783.90,
    remainingAmount: 1095.46,
    status: "active"
  },
  {
    id: "exp-3",
    vendor: "Google Cloud",
    expenseType: "Compute Services",
    monthlyAmount: 89.45,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    totalExpensed: 447.25,
    remainingAmount: 626.15,
    status: "active"
  }
];

export default function Schedules() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("revenue");

  const filteredRevenueSchedules = mockRevenueSchedule.filter(schedule =>
    schedule.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExpenseSchedules = mockExpenseSchedule.filter(schedule =>
    schedule.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.expenseType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenueDeferred = mockRevenueSchedule.reduce((sum, schedule) => sum + schedule.totalDeferred, 0);
  const totalRevenueRecognized = mockRevenueSchedule.reduce((sum, schedule) => sum + schedule.totalRecognized, 0);
  const totalExpenseRemaining = mockExpenseSchedule.reduce((sum, schedule) => sum + schedule.remainingAmount, 0);
  const totalExpenseExpensed = mockExpenseSchedule.reduce((sum, schedule) => sum + schedule.totalExpensed, 0);

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
                placeholder="Search schedules..." 
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
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span>Revenue Deferred: ₹{totalRevenueDeferred.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span>Expenses Remaining: ₹{totalExpenseRemaining.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedules Content */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          {/* Schedules List */}
          <Panel defaultSize={60} minSize={40} className="min-h-0">
            <div className="h-full flex flex-col border-r border-mobius-gray-100">
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="revenue" className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>Revenue Schedules</span>
                      </TabsTrigger>
                      <TabsTrigger value="expense" className="flex items-center space-x-2">
                        <TrendingDown className="w-4 h-4" />
                        <span>Expense Schedules</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="revenue" className="space-y-0">
                      <div className="bg-white rounded-lg border border-mobius-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-mobius-gray-50 px-4 py-3 border-b border-mobius-gray-200">
                          <div className="grid grid-cols-6 gap-4 text-sm font-medium text-mobius-gray-700">
                            <div>Customer</div>
                            <div>Contract Value</div>
                            <div>Monthly Revenue</div>
                            <div>Recognized</div>
                            <div>Deferred</div>
                            <div>Status</div>
                          </div>
                        </div>

                        {/* Revenue Schedule Rows */}
                        <div className="divide-y divide-mobius-gray-200">
                          {filteredRevenueSchedules.map((schedule) => (
                            <div 
                              key={schedule.id}
                              className={`px-4 py-3 hover:bg-mobius-gray-50 cursor-pointer ${
                                selectedSchedule?.id === schedule.id ? 'bg-mobius-blue-50' : ''
                              }`}
                              onClick={() => setSelectedSchedule(schedule)}
                            >
                              <div className="grid grid-cols-6 gap-4 text-sm">
                                <div className="font-medium text-mobius-gray-900">
                                  {schedule.customer}
                                </div>
                                <div className="text-mobius-gray-900">
                                  ₹{schedule.contractValue.toLocaleString()}
                                </div>
                                <div className="text-mobius-gray-900">
                                  ₹{schedule.monthlyRevenue.toLocaleString()}
                                </div>
                                <div className="text-green-600 font-medium">
                                  ₹{schedule.totalRecognized.toLocaleString()}
                                </div>
                                <div className="text-mobius-gray-900">
                                  ₹{schedule.totalDeferred.toLocaleString()}
                                </div>
                                <div>
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                    {schedule.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="expense" className="space-y-0">
                      <div className="bg-white rounded-lg border border-mobius-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-mobius-gray-50 px-4 py-3 border-b border-mobius-gray-200">
                          <div className="grid grid-cols-6 gap-4 text-sm font-medium text-mobius-gray-700">
                            <div>Vendor</div>
                            <div>Expense Type</div>
                            <div>Monthly Amount</div>
                            <div>Expensed</div>
                            <div>Remaining</div>
                            <div>Status</div>
                          </div>
                        </div>

                        {/* Expense Schedule Rows */}
                        <div className="divide-y divide-mobius-gray-200">
                          {filteredExpenseSchedules.map((schedule) => (
                            <div 
                              key={schedule.id}
                              className={`px-4 py-3 hover:bg-mobius-gray-50 cursor-pointer ${
                                selectedSchedule?.id === schedule.id ? 'bg-mobius-blue-50' : ''
                              }`}
                              onClick={() => setSelectedSchedule(schedule)}
                            >
                              <div className="grid grid-cols-6 gap-4 text-sm">
                                <div className="font-medium text-mobius-gray-900">
                                  {schedule.vendor}
                                </div>
                                <div className="text-mobius-gray-900">
                                  {schedule.expenseType}
                                </div>
                                <div className="text-mobius-gray-900">
                                  ₹{schedule.monthlyAmount.toLocaleString()}
                                </div>
                                <div className="text-red-600 font-medium">
                                  ₹{schedule.totalExpensed.toLocaleString()}
                                </div>
                                <div className="text-mobius-gray-900">
                                  ₹{schedule.remainingAmount.toLocaleString()}
                                </div>
                                <div>
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                    {schedule.status}
                                  </Badge>
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

          {/* Schedule Details Panel */}
          <PanelResizeHandle className="w-1 bg-mobius-gray-100 hover:bg-mobius-gray-200 transition-colors" />
          
          <Panel defaultSize={40} minSize={25} className="min-h-0">
            <div className="h-full flex flex-col">
              {selectedSchedule ? (
                <div className="p-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-mobius-gray-900">
                        {activeTab === "revenue" ? selectedSchedule.customer : selectedSchedule.vendor}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {activeTab === "revenue" ? "Revenue" : "Expense"}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      {activeTab === "revenue" ? (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-mobius-gray-500">Contract Value</p>
                              <p className="text-sm font-semibold text-mobius-gray-900">
                                ₹{selectedSchedule.contractValue.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-mobius-gray-500">Monthly Revenue</p>
                              <p className="text-sm font-semibold text-mobius-gray-900">
                                ₹{selectedSchedule.monthlyRevenue.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-mobius-gray-500">Total Recognized</p>
                              <p className="text-sm font-semibold text-green-600">
                                ₹{selectedSchedule.totalRecognized.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-mobius-gray-500">Total Deferred</p>
                              <p className="text-sm font-semibold text-mobius-gray-900">
                                ₹{selectedSchedule.totalDeferred.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-mobius-gray-500">Expense Type</p>
                              <p className="text-sm font-semibold text-mobius-gray-900">
                                {selectedSchedule.expenseType}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-mobius-gray-500">Monthly Amount</p>
                              <p className="text-sm font-semibold text-mobius-gray-900">
                                ₹{selectedSchedule.monthlyAmount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-mobius-gray-500">Total Expensed</p>
                              <p className="text-sm font-semibold text-red-600">
                                ₹{selectedSchedule.totalExpensed.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-mobius-gray-500">Remaining Amount</p>
                              <p className="text-sm font-semibold text-mobius-gray-900">
                                ₹{selectedSchedule.remainingAmount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="border-t border-mobius-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-mobius-gray-900 mb-3">Schedule Period</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-mobius-gray-500">Start Date</p>
                            <p className="font-medium text-mobius-gray-900">
                              {new Date(selectedSchedule.startDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-mobius-gray-500">End Date</p>
                            <p className="font-medium text-mobius-gray-900">
                              {new Date(selectedSchedule.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-mobius-gray-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2" />
                    <p>Select a schedule to view details</p>
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