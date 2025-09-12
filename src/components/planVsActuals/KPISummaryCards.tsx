import { KPI } from '@/types/planVsActuals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface KPISummaryCardsProps {
  kpis: KPI[];
}

const formatCurrency = (amount: number, currency: string) => {
  if (amount >= 1000000) {
    return `${currency} ${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${currency} ${(amount / 1000).toFixed(0)}K`;
  }
  return `${currency} ${amount.toFixed(0)}`;
};

const formatVariance = (amount: number, currency: string) => {
  if (Math.abs(amount) >= 1000000) {
    return `${currency} ${(amount / 1000000).toFixed(1)}mm`;
  } else if (Math.abs(amount) >= 1000) {
    return `${currency} ${(amount / 1000).toFixed(0)}K`;
  }
  return `${currency} ${amount.toFixed(0)}`;
};

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <Minus className="h-4 w-4 text-gray-400" />;
  }
};

const getVarianceColor = (variancePercent: number) => {
  if (Math.abs(variancePercent) <= 2) return 'bg-green-100 text-green-800';
  if (Math.abs(variancePercent) <= 5) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const KPISummaryCards = ({ kpis }: KPISummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {kpis.map((kpi) => (
        <Card key={kpi.name} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
              {kpi.name}
              {getTrendIcon(kpi.trend)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {formatCurrency(kpi.actual, kpi.currency)}
                </span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getVarianceColor(kpi.variancePercent)}`}
                >
                  {kpi.variancePercent > 0 ? '+' : ''}{kpi.variancePercent.toFixed(1)}%
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                Plan: {formatCurrency(kpi.plan, kpi.currency)}
              </div>
              <div className="text-xs text-gray-400">
                Variance: {formatVariance(kpi.variance, kpi.currency)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
