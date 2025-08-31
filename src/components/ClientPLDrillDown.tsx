import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  BarChart3,
  Calendar,
  Search,
  Filter,
  Download,
  Eye,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";

interface ClientPLDrillDownProps {
  client: {
    name: string;
    arr: string;
    margin: string;
    costs: string;
    roas: string;
    delta: string;
    trend: "up" | "down";
  };
  onBack: () => void;
  onDrillDownToJE: (accountName: string) => void;
}

// Mock P&L data
const mockPLData = [
  {
    category: "Revenue",
    items: [
      { name: "SaaS Subscriptions", amount: 3200000, margin: 100, trend: "up" as const, delta: "+12.3%" },
      { name: "Professional Services", amount: 450000, margin: 65, trend: "up" as const, delta: "+8.7%" },
      { name: "Implementation Fees", amount: 180000, margin: 45, trend: "down" as const, delta: "-3.2%" }
    ]
  },
  {
    category: "Cost of Goods Sold",
    items: [
      { name: "Cloud Infrastructure", amount: 480000, margin: 0, trend: "up" as const, delta: "+15.2%" },
      { name: "Third-party Licenses", amount: 320000, margin: 0, trend: "up" as const, delta: "+8.9%" },
      { name: "Support Personnel", amount: 896000, margin: 0, trend: "up" as const, delta: "+12.1%" }
    ]
  },
  {
    category: "Operating Expenses",
    items: [
      { name: "Sales & Marketing", amount: 640000, margin: 0, trend: "up" as const, delta: "+18.7%" },
      { name: "Research & Development", amount: 520000, margin: 0, trend: "up" as const, delta: "+22.3%" },
      { name: "General & Administrative", amount: 380000, margin: 0, trend: "up" as const, delta: "+9.8%" }
    ]
  }
];

const mockAIInsights = [
  {
    type: "alert" as const,
    severity: "high" as const,
    message: "Professional Services margin down 3.2% MoM - review pricing strategy",
    action: "Review Pricing"
  },
  {
    type: "insight" as const,
    severity: "medium" as const,
    message: "Cloud Infrastructure costs up 15.2% - consider reserved instances",
    action: "Optimize Costs"
  },
  {
    type: "opportunity" as const,
    severity: "low" as const,
    message: "R&D spend up 22.3% - track against product roadmap",
    action: "Review Roadmap"
  }
];

export function ClientPLDrillDown({ client, onBack, onDrillDownToJE }: ClientPLDrillDownProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("2025-Q1");
  const [searchTerm, setSearchTerm] = useState("");

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const getMarginColor = (margin: number) => {
    if (margin >= 70) return "text-green-600 border-green-200";
    if (margin >= 50) return "text-yellow-600 border-yellow-200";
    return "text-red-600 border-red-200";
  };

  const getTrendIcon = (trend: "up" | "down") => {
    return trend === "up" ? (
      <TrendingUp className="h-3 w-3 text-green-600" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-600" />
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Top Bar - Consistent with other pages */}
      <div className="border-b border-mobius-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-medium text-gray-900">
                {client.name} - P&L Drill-Down
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Detailed profitability analysis and journal entry drill-down
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-Q1">2025 Q1</SelectItem>
                <SelectItem value="2024-Q4">2024 Q4</SelectItem>
                <SelectItem value="2024-Q3">2024 Q3</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - P&L Table */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {/* KPI Row */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="border border-mobius-gray-100 bg-white">
              <CardContent className="p-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Revenue
                </div>
                <div className="text-lg font-medium text-gray-900 mb-1">
                  {formatCurrency(3830000)}
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+12.3%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-mobius-gray-100 bg-white">
              <CardContent className="p-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  COGS
                </div>
                <div className="text-lg font-medium text-gray-900 mb-1">
                  {formatCurrency(1696000)}
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-red-600" />
                  <span className="text-xs text-red-600">+12.1%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-mobius-gray-100 bg-white">
              <CardContent className="p-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Gross Margin
                </div>
                <div className="text-lg font-medium text-gray-900 mb-1">
                  {client.margin}
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+2.1%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-mobius-gray-100 bg-white">
              <CardContent className="p-4">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  EBITDA
                </div>
                <div className="text-lg font-medium text-gray-900 mb-1">
                  {formatCurrency(1040000)}
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+8.7%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search line items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 text-xs">
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
          </div>

          {/* P&L Table */}
          <Card className="border border-mobius-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="text-base font-medium">Profit & Loss Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPLData.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-2">
                    <div className="font-medium text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded">
                      {category.category}
                    </div>
                    {category.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => onDrillDownToJE(item.name)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm text-gray-900">{item.name}</span>
                            {item.margin > 0 && (
                              <Badge 
                                variant="outline"
                                className={`text-xs ${getMarginColor(item.margin)}`}
                              >
                                {item.margin}%
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {getTrendIcon(item.trend)} {item.delta} vs last period
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900">
                            {formatCurrency(item.amount)}
                          </span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - AI Insights & Charts */}
        <div className="w-[420px] bg-white border-l border-mobius-gray-100 p-4 space-y-4 overflow-y-auto">
          {/* Margin Trend Chart */}
          <Card className="border border-mobius-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="text-base font-medium">Margin Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-xs">Margin trend chart</p>
                  <p className="text-xs">(Chart component here)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center">
              <Lightbulb className="h-4 w-4 text-gray-600 mr-2" />
              AI Insights
            </h3>
            <div className="space-y-2">
              {mockAIInsights.map((insight, index) => (
                <Card key={index} className="border border-mobius-gray-100 bg-white">
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-2">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        insight.severity === "high" ? "bg-red-500" :
                        insight.severity === "medium" ? "bg-yellow-500" : "bg-green-500"
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {insight.type === "alert" && <AlertTriangle className="h-3 w-3 text-red-500" />}
                          {insight.type === "insight" && <Lightbulb className="h-3 w-3 text-yellow-500" />}
                          {insight.type === "opportunity" && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                          <Badge variant="outline" className="text-xs">
                            {insight.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-900 mb-2">{insight.message}</p>
                        <Button size="sm" className="w-full h-7 text-xs">
                          {insight.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Traffic Light Status */}
          <Card className="border border-mobius-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="text-base font-medium">Status Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Revenue Recognition</span>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cost Allocation</span>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Intercompany</span>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tax Compliance</span>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
