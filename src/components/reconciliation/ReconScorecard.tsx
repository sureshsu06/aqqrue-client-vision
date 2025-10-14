import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Info,
  Database
} from 'lucide-react';

interface ReconScorecardProps {
  bankBalance: number;
  glBalance: number;
  difference: number;
  variancePercent: number;
  transactions: {
    imported: number;
    matched: number;
    unmatched: number;
  };
  keyFindings: string;
  status: 'complete' | 'in_progress' | 'pending';
}

export function ReconScorecard({
  bankBalance,
  glBalance,
  difference,
  variancePercent,
  transactions,
  keyFindings,
  status
}: ReconScorecardProps) {
  const isBalanced = difference === 0;
  const isPositiveVariance = difference > 0;
  const isSignificantVariance = Math.abs(variancePercent) > 1;
  const matchRate = Math.round((transactions.matched / transactions.imported) * 100);

  const getVarianceIcon = () => {
    if (isBalanced) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (isSignificantVariance) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
    return <Info className="w-4 h-4 text-yellow-500" />;
  };

  const getVarianceColor = () => {
    if (isBalanced) return 'text-green-600';
    if (isSignificantVariance) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">🟢 Complete</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">🟡 In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">🔴 Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">Unknown</Badge>;
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3">
      {/* 3-Card Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        {/* Bank Balance Card */}
        <Card className="border-slate-200">
          <CardContent className="p-3">
            <div className="mb-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Bank Balance</span>
            </div>
            <div className="text-lg font-semibold text-slate-900">
              ${bankBalance.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">Statement</div>
          </CardContent>
        </Card>

        {/* GL Balance Card */}
        <Card className="border-slate-200">
          <CardContent className="p-3">
            <div className="mb-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">GL Balance</span>
            </div>
            <div className="text-lg font-semibold text-slate-900">
              ${glBalance.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">Books</div>
          </CardContent>
        </Card>

        {/* Variance Card */}
        <Card className={`border-2 ${isBalanced ? 'border-green-200' : isSignificantVariance ? 'border-red-200' : 'border-yellow-200'}`}>
          <CardContent className="p-3">
            <div className="mb-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Variance</span>
            </div>
            <div className={`text-lg font-semibold ${getVarianceColor()}`}>
              ${Math.abs(difference).toLocaleString()}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">({variancePercent.toFixed(1)}%)</span>
              {getStatusBadge()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Summary & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Transaction Summary */}
        <div className="space-y-2">
          <div className="mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Transaction Summary</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-medium text-green-700">{transactions.matched}</div>
              <div className="text-xs text-slate-500">Matched</div>
            </div>
            <div>
              <div className="text-xs font-medium text-red-700">{transactions.unmatched}</div>
              <div className="text-xs text-slate-500">Unmatched</div>
            </div>
          </div>
          <div className="text-xs text-slate-600">
            Total Imported: <span className="font-medium">{transactions.imported}</span>
          </div>
          
          {/* Match Rate Progress Bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span>Match Rate</span>
              <span>{matchRate}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${matchRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Key Findings */}
        <div className="bg-sky-50 border border-sky-100 rounded-lg p-3">
          <div className="mb-1">
            <span className="text-xs font-medium text-sky-700 uppercase tracking-wide">Key Findings</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{keyFindings}</p>
        </div>
      </div>
    </div>
  );
}
