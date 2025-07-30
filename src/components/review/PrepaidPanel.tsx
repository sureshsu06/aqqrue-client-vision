import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, Calendar, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrepaidPanelProps {
  transaction: any;
}

export function PrepaidPanel({ transaction }: PrepaidPanelProps) {
  const [scheduleCreated, setScheduleCreated] = useState(false);
  const { toast } = useToast();

  const prepaidBreakdown = {
    lineItems: [
      {
        name: "SOC2 Monitoring",
        amount: 950,
        period: "Aug 1 - Oct 31, 2024",
        months: 3,
        monthly: 316.67
      },
      {
        name: "Full Compliance Suite", 
        amount: 4600,
        period: "Aug 1, 2024 - Jul 31, 2025",
        months: 12,
        monthly: 383.33
      }
    ],
    schedule: [
      { month: "Aug 2024", amount: 700.00, balance: 4850 },
      { month: "Sep 2024", amount: 700.00, balance: 4150 },
      { month: "Oct 2024", amount: 700.00, balance: 3450 },
      { month: "Nov 2024", amount: 383.33, balance: 3066.67 },
      { month: "Dec 2024", amount: 383.33, balance: 2683.34 },
      { month: "Jan 2025", amount: 383.33, balance: 2300.01 },
      { month: "Feb 2025", amount: 383.33, balance: 1916.68 },
      { month: "Mar 2025", amount: 383.33, balance: 1533.35 },
      { month: "Apr 2025", amount: 383.33, balance: 1150.02 },
      { month: "May 2025", amount: 383.33, balance: 766.69 },
      { month: "Jun 2025", amount: 383.33, balance: 383.36 },
      { month: "Jul 2025", amount: 383.33, balance: 0 }
    ]
  };

  const handleCreateSchedule = () => {
    setScheduleCreated(true);
    toast({
      title: "Amortization schedule created",
      description: "Monthly journal entries will be auto-generated based on the service periods."
    });
  };

  return (
    <div className="space-y-4">
      {/* Warning Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Multi-period expense identified</p>
            <p className="text-sm text-amber-700">
              We split service periods and built the amortization schedule.
            </p>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Prepaid Expense Calculation</h3>
        
        <div className="space-y-4">
          {/* Line Items Breakdown */}
          {prepaidBreakdown.lineItems.map((item, index) => (
            <div key={index} className="p-4 bg-mobius-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{item.name}</h4>
                <span className="font-semibold font-variant-numeric: tabular-nums">${item.amount.toLocaleString()}</span>
              </div>
              <div className="text-sm text-mobius-gray-600 space-y-1">
                <p>Period: {item.period} ({item.months} months)</p>
                <p>Monthly: ${item.amount.toLocaleString()} ÷ {item.months} = ${item.monthly.toFixed(2)}</p>
              </div>
            </div>
          ))}
          
          <Separator />
          
          {/* Amortization Schedule */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Monthly Expense Schedule</h4>
              {!scheduleCreated ? (
                <Button onClick={handleCreateSchedule}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Create amortization schedule
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Badge variant="outline" className="bg-status-done/10 text-status-done border-status-done/20">
                    Schedule Created ✓
                  </Badge>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Export to JE
                  </Button>
                </div>
              )}
            </div>

            {scheduleCreated && (
              <>
                {/* Balance Chart */}
                <div className="mb-4 p-4 bg-mobius-gray-50 rounded-lg">
                  <h5 className="font-medium mb-2 text-sm">Prepaid Balance Over Time</h5>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={prepaidBreakdown.schedule}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          fontSize={12}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis fontSize={12} />
                        <Tooltip 
                          formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Balance']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="balance" 
                          stroke="hsl(var(--mobius-blue))" 
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--mobius-blue))", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-mobius-gray-500 mt-2">
                    Notice the cliff when SOC2 Monitoring ends in October 2024
                  </p>
                </div>

                {/* Schedule Table */}
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  <div className="grid grid-cols-3 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide pb-2 border-b border-mobius-gray-200">
                    <div>MONTH</div>
                    <div className="text-right">EXPENSE</div>
                    <div className="text-right">BALANCE</div>
                  </div>
                  {prepaidBreakdown.schedule.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 py-2 text-sm border-b border-mobius-gray-100 last:border-0">
                      <span>{item.month}</span>
                      <span className="text-right font-variant-numeric: tabular-nums">${item.amount.toFixed(2)}</span>
                      <span className="text-right font-variant-numeric: tabular-nums">${item.balance.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}