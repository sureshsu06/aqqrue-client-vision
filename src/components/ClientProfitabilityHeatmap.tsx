import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Filter,
  Download,
  Eye
} from "lucide-react";

interface ClientProfitabilityHeatmapProps {
  clients: Array<{
    name: string;
    arr: string;
    margin: string;
    costs: string;
    roas: string;
    delta: string;
    trend: "up" | "down";
  }>;
  onClientClick: (clientName: string) => void;
}

export function ClientProfitabilityHeatmap({ clients, onClientClick }: ClientProfitabilityHeatmapProps) {
  const getMarginColor = (margin: string) => {
    const marginValue = parseInt(margin.replace('%', ''));
    if (marginValue >= 70) return "bg-green-50 border-green-200 hover:bg-green-100";
    if (marginValue >= 60) return "bg-yellow-50 border-yellow-200 hover:bg-yellow-100";
    return "bg-red-50 border-red-200 hover:bg-red-100";
  };

  const getMarginTextColor = (margin: string) => {
    const marginValue = parseInt(margin.replace('%', ''));
    if (marginValue >= 70) return "text-green-700";
    if (marginValue >= 60) return "text-yellow-700";
    return "text-red-700";
  };

  const getMarginBorderColor = (margin: string) => {
    const marginValue = parseInt(margin.replace('%', ''));
    if (marginValue >= 70) return "border-green-200";
    if (marginValue >= 60) return "border-yellow-200";
    return "border-red-200";
  };

  const getTrendIcon = (trend: "up" | "down") => {
    return trend === "up" ? (
      <TrendingUp className="h-3 w-3 text-green-600" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-600" />
    );
  };

  const getTrendColor = (trend: "up" | "down") => {
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  return (
    <Card className="border border-mobius-gray-100 bg-white">
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <span>Client Profitability Heatmap</span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Heatmap Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {clients.map((client, index) => (
            <div
              key={index}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${getMarginColor(client.margin)} ${getMarginBorderColor(client.margin)}
              `}
              onClick={() => onClientClick(client.name)}
            >
              {/* Client Name */}
              <div className="text-sm font-medium text-gray-900 mb-2">
                {client.name}
              </div>
              
              {/* Margin % - Big number in center */}
              <div className={`text-2xl font-bold mb-2 ${getMarginTextColor(client.margin)}`}>
                {client.margin}
              </div>
              
              {/* ARR */}
              <div className="text-xs text-gray-600 mb-2">
                {client.arr}
              </div>
              
              {/* Trend and Delta */}
              <div className="flex items-center justify-between">
                <div className={`text-xs font-medium ${getTrendColor(client.trend)}`}>
                  {getTrendIcon(client.trend)} {client.delta}
                </div>
                <div className="text-xs text-gray-500">
                  {client.roas}
                </div>
              </div>
              
              {/* Hover indicator */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="h-3 w-3 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span className="text-gray-600">High Margin (≥70%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span className="text-gray-600">Medium Margin (60-69%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
              <span className="text-gray-600">Low Margin (&lt;60%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
