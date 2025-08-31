import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Users, 
  BarChart3,
  FileText,
  Download,
  Eye,
  Edit,
  MessageSquare,
  Calculator,
  Calendar,
  Building,
  Globe
} from "lucide-react";

interface ClientDetailDrawerProps {
  client: {
    name: string;
    arr: string;
    margin: string;
    costs: string;
    roas: string;
    delta: string;
    trend: "up" | "down";
  } | null;
  onClose: () => void;
}

export function ClientDetailDrawer({ client, onClose }: ClientDetailDrawerProps) {
  if (!client) return null;

  const mockCampaignData = [
    { name: "Q4 Brand Campaign", media: 125000, people: 45000, tools: 15000, revenue: 320000 },
    { name: "Holiday Promo", media: 89000, people: 32000, tools: 12000, revenue: 280000 },
    { name: "Retargeting", media: 67000, people: 28000, tools: 8000, revenue: 210000 }
  ];

  const mockTransactions = [
    { id: "INV-001", type: "Invoice", amount: 125000, status: "Posted", date: "2024-01-15", confidence: 95 },
    { id: "JE-002", type: "Journal Entry", amount: -45000, status: "Draft", date: "2024-01-14", confidence: 87 },
    { id: "INV-003", type: "Invoice", amount: 89000, status: "Posted", date: "2024-01-13", confidence: 92 }
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-mobius-gray-100 shadow-xl overflow-y-auto z-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-mobius-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{client.name}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{client.arr}</div>
            <div className="text-sm text-blue-600">ARR</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{client.margin}</div>
            <div className="text-sm text-green-600">Gross Margin</div>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center justify-center mt-4">
          <Badge 
            variant={client.trend === "up" ? "default" : "destructive"}
            className="text-sm"
          >
            {client.trend === "up" ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {client.delta} vs last month
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Direct Costs</span>
                  <span className="font-medium">{client.costs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ROAS</span>
                  <span className="font-medium">{client.roas}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Client Since</span>
                  <span className="font-medium">Jan 2023</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Last invoice: 2 days ago</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-gray-400" />
                    <span>Last communication: 1 week ago</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calculator className="h-4 w-4 text-gray-400" />
                    <span>Last adjustment: 2 weeks ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            {/* Campaign Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campaign & Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCampaignData.map((campaign, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{campaign.name}</span>
                        <Badge variant="outline" className="text-xs">
                          ${(campaign.revenue / 1000).toFixed(0)}K
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Media</span>
                          <span>${(campaign.media / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>People</span>
                          <span>${(campaign.people / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Tools</span>
                          <span>${(campaign.tools / 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transactions & JEs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTransactions.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{tx.id}</span>
                          <Badge variant="outline" className="text-xs">
                            {tx.type}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {tx.date} • Confidence: {tx.confidence}%
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${
                          tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${(Math.abs(tx.amount) / 1000).toFixed(0)}K
                        </span>
                        <Badge variant={tx.status === "Posted" ? "default" : "secondary"}>
                          {tx.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t">
          <Button className="w-full" variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Create Adjustment JE
          </Button>
          <Button className="w-full" variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Client Rate Notice
          </Button>
          <Button className="w-full" variant="outline">
            <Calculator className="h-4 w-4 mr-2" />
            Tag for MRR Adjustments
          </Button>
        </div>
      </div>
    </div>
  );
}
