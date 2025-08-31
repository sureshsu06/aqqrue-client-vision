import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  DollarSign,
  Calendar
} from "lucide-react";

interface CashForecastData {
  date: string;
  inflows: number;
  outflows: number;
  net: number;
  risk: number;
}

interface CashForecastChartProps {
  data: CashForecastData[];
  selectedScenario: string;
  onScenarioChange: (scenario: string) => void;
  onDayClick: (day: CashForecastData) => void;
}

export function CashForecastChart({ 
  data, 
  selectedScenario, 
  onScenarioChange, 
  onDayClick 
}: CashForecastChartProps) {
  const scenarios = ["Base", "Conservative", "Aggressive"];
  const maxNet = Math.max(...data.map(d => d.net));
  const minNet = Math.min(...data.map(d => d.net));
  const range = maxNet - minNet;

  const getBarHeight = (value: number) => {
    if (range === 0) return 50;
    return Math.max(10, ((value - minNet) / range) * 80);
  };

  const getRiskColor = (risk: number) => {
    if (risk > 30) return "bg-red-500";
    if (risk > 15) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card className="border border-mobius-gray-100 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center justify-between">
          <span>Cash Forecast (90 days)</span>
          <div className="flex items-center space-x-2">
            <select 
              value={selectedScenario}
              onChange={(e) => onScenarioChange(e.target.value)}
              className="text-xs border border-mobius-gray-100 rounded px-2 py-1"
            >
              {scenarios.map(scenario => (
                <option key={scenario} value={scenario}>{scenario}</option>
              ))}
            </select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <div className="h-32 flex items-end justify-between space-x-1">
            {data.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                {/* Net Cash Bar */}
                <div 
                  className={`w-full rounded-t cursor-pointer transition-all hover:opacity-80 ${
                    day.net >= 0 ? 'bg-green-600' : 'bg-red-600'
                  }`}
                  style={{ height: `${getBarHeight(Math.abs(day.net))}px` }}
                  onClick={() => onDayClick(day)}
                  title={`${day.date}: Net $${day.net.toFixed(1)}M`}
                />
                
                {/* Risk Indicator */}
                <div 
                  className={`w-2 h-2 rounded-full mt-1 ${getRiskColor(day.risk)}`}
                  title={`${day.date}: ${day.risk}% risk`}
                />
                
                {/* Date Label */}
                <span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Positive Net</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Negative Net</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span>Risk Level:</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                ${data.reduce((sum, day) => sum + day.inflows, 0).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-500">Total Inflows</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">
                ${data.reduce((sum, day) => sum + day.outflows, 0).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-500">Total Outflows</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold ${
                data[data.length - 1].net >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${data[data.length - 1].net.toFixed(1)}M
              </div>
              <div className="text-xs text-gray-500">Ending Balance</div>
            </div>
          </div>

          {/* High Risk Warning */}
          {data.some(day => day.risk > 30) && (
            <div className="bg-red-50 border border-red-200 rounded-md p-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-3 w-3 text-red-600" />
                <span className="text-xs font-medium text-red-700">High Risk Days Detected</span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                {data.filter(day => day.risk > 30).length} days have &gt;30% risk of negative balance. 
                Click on red bars for suggested actions.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
