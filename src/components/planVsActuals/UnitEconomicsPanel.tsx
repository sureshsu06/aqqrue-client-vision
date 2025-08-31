import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Users, DollarSign, Target, Zap } from 'lucide-react';

interface UnitEconomicsPanelProps {
  pnlLines: any[]; // Using any for now to avoid complex type issues
}

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    case 'stable':
      return <Minus className="h-4 w-4 text-gray-600" />;
    default:
      return null;
  }
};

export const UnitEconomicsPanel = ({ pnlLines }: UnitEconomicsPanelProps) => {
  // Extract key metrics from P&L lines
  const subscriptionRevenue = pnlLines.find(line => line.key === 'subscription_revenue_total');
  const grossProfit = pnlLines.find(line => line.key === 'gross_profit');
  const netIncome = pnlLines.find(line => line.key === 'net_income');
  const salesMarketing = pnlLines.find(line => line.key === 'sales_marketing');
  const rdExpenses = pnlLines.find(line => line.key === 'rd_expenses');

  // Calculate derived metrics
  const arr = subscriptionRevenue?.kpiMetrics?.arr || 0;
  const customerCount = subscriptionRevenue?.kpiMetrics?.customerCount || 0;
  const arpu = subscriptionRevenue?.kpiMetrics?.arpu || 0;
  const churnRate = subscriptionRevenue?.kpiMetrics?.churnRate || 0;
  const grossMargin = grossProfit?.kpiMetrics?.margin || 0;
  const contributionMargin = grossProfit?.kpiMetrics?.contributionMargin || 0;
  const cac = salesMarketing?.kpiMetrics?.cac || 0;
  const pipelineCoverage = salesMarketing?.kpiMetrics?.pipelineCoverage || 0;
  const rndHeadcount = rdExpenses?.kpiMetrics?.headcount || 0;

  // Calculate additional metrics
  const ltv = arpu / (churnRate || 0.01); // LTV = ARPU / Churn Rate
  const cacPayback = cac / (arpu * (1 - churnRate)); // CAC Payback = CAC / (ARPU * (1 - Churn))
  const magicNumber = (arr * 4) / (salesMarketing?.actual || 1); // Magic Number = (ARR * 4) / Sales & Marketing
  const arrPerEmployee = arr / (rndHeadcount + (salesMarketing?.kpiMetrics?.headcount || 0) + (grossProfit?.kpiMetrics?.recurringRevenueCoverage ? 1 : 0));
  const netRevenueRetention = 1 - churnRate + (subscriptionRevenue?.kpiMetrics?.expansionRate || 0);

  const metrics = [
    {
      name: 'ARR',
      value: formatCurrency(arr),
      trend: subscriptionRevenue?.trend || 'stable',
      icon: <DollarSign className="h-4 w-4" />,
      category: 'Growth'
    },
    {
      name: 'ARPU',
      value: `$${arpu}`,
      trend: 'stable',
      icon: <Users className="h-4 w-4" />,
      category: 'Efficiency'
    },
    {
      name: 'Churn Rate',
      value: `${(churnRate * 100).toFixed(1)}%`,
      trend: churnRate > 0.1 ? 'down' : 'up',
      icon: <Target className="h-4 w-4" />,
      category: 'Retention'
    },
    {
      name: 'Gross Margin',
      value: `${(grossMargin * 100).toFixed(1)}%`,
      trend: grossMargin > 0.75 ? 'up' : 'down',
      icon: <Zap className="h-4 w-4" />,
      category: 'Profitability'
    },
    {
      name: 'CAC',
      value: formatCurrency(cac),
      trend: cac < 2000 ? 'up' : 'down',
      icon: <DollarSign className="h-4 w-4" />,
      category: 'Efficiency'
    },
    {
      name: 'LTV',
      value: formatCurrency(ltv),
      trend: ltv > 10000 ? 'up' : 'down',
      icon: <Target className="h-4 w-4" />,
      category: 'Value'
    },
    {
      name: 'CAC Payback',
      value: `${cacPayback.toFixed(1)} months`,
      trend: cacPayback < 12 ? 'up' : 'down',
      icon: <Zap className="h-4 w-4" />,
      category: 'Efficiency'
    },
    {
      name: 'Magic Number',
      value: magicNumber.toFixed(1),
      trend: magicNumber > 1 ? 'up' : 'down',
      icon: <Zap className="h-4 w-4" />,
      category: 'Growth'
    },
    {
      name: 'ARR per Employee',
      value: formatCurrency(arrPerEmployee),
      trend: arrPerEmployee > 200000 ? 'up' : 'down',
      icon: <Users className="h-4 w-4" />,
      category: 'Efficiency'
    },
    {
      name: 'Net Revenue Retention',
      value: `${(netRevenueRetention * 100).toFixed(1)}%`,
      trend: netRevenueRetention > 1.1 ? 'up' : 'down',
      icon: <Target className="h-4 w-4" />,
      category: 'Retention'
    },
    {
      name: 'Pipeline Coverage',
      value: `${pipelineCoverage}x`,
      trend: pipelineCoverage > 3 ? 'up' : 'down',
      icon: <Zap className="h-4 w-4" />,
      category: 'Growth'
    },
    {
      name: 'Contribution Margin',
      value: `${(contributionMargin * 100).toFixed(1)}%`,
      trend: contributionMargin > 0.7 ? 'up' : 'down',
      icon: <Zap className="h-4 w-4" />,
      category: 'Profitability'
    }
  ];

  const categories = ['Growth', 'Efficiency', 'Retention', 'Profitability', 'Value'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <span>Unit Economics & KPIs</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categories.map(category => {
            const categoryMetrics = metrics.filter(metric => metric.category === category);
            
            return (
              <div key={category} className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoryMetrics.map(metric => (
                    <div key={metric.name} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {metric.icon}
                          <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                        </div>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
