import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface ExecutiveSummaryProps {
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

export function ExecutiveSummary({
  bankBalance,
  glBalance,
  difference,
  variancePercent,
  transactions,
  keyFindings,
  status
}: ExecutiveSummaryProps) {
  const isBalanced = difference === 0;
  const isPositiveVariance = difference > 0;
  const isSignificantVariance = Math.abs(variancePercent) > 1;

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
        return <Badge className="bg-green-100 text-green-800 border-green-200">Complete</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>;
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Balance Summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">💰 Bank Statement Balance:</span>
            <span className="font-mono text-sm font-medium">${bankBalance.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">📘 GL Cash Balance:</span>
            <span className="font-mono text-sm font-semibold text-slate-900">
              ${glBalance.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">⚖️ Difference:</span>
            <div className="flex items-center space-x-2">
              {getVarianceIcon()}
              <span className={`font-mono text-sm font-medium ${getVarianceColor()}`}>
                ${Math.abs(difference).toLocaleString()} ({variancePercent.toFixed(1)}%)
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Status:</span>
            {getStatusBadge()}
          </div>
        </div>
        
        {/* Transaction Summary */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900">Transaction Summary</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Total Imported:</span>
              <span className="font-mono">{transactions.imported}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Matched:</span>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="font-mono text-green-600">{transactions.matched}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Unmatched:</span>
              <div className="flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span className="font-mono text-red-600">{transactions.unmatched}</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span>Match Rate</span>
              <span>{Math.round((transactions.matched / transactions.imported) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(transactions.matched / transactions.imported) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Key Findings */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center space-x-1">
            <Info className="w-4 h-4" />
            <span>Key Findings</span>
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed">{keyFindings}</p>
        </div>
      </div>
    </div>
  );
}
