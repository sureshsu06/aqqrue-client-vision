import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Search, 
  Filter, 
  ArrowRight,
  ChevronDown,
  Bot,
  ArrowUpDown,
  Eye,
  ExternalLink,
  Calendar,
  TrendingUp,
  FileText,
  DollarSign
} from 'lucide-react';

interface ContractReconciliation {
  id: string;
  contractName: string;
  customer: string;
  contractValue: number;
  contractStartDate: string;
  contractEndDate: string;
  contractTerm: string;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  status: 'active' | 'paused' | 'ended' | 'error';
  // Scheduled side (what should be recognized)
  scheduledEntries: {
    totalScheduled: number;
    recognizedToDate: number;
    remainingDeferred: number;
    monthlyAmount: number;
    nextPostDate: string;
    lastPostedDate: string;
  };
  // Actual side (what has been recognized this month)
  actualRevenue: {
    monthlyRecognized: number;
    lastRecognitionDate: string;
    recognitionMethod: 'straight-line' | 'usage-based' | 'milestone';
    variance: number;
  };
  // Reconciliation status
  match: 'matched' | 'suggested' | 'no_match';
  variance: number;
  variancePercent: number;
  confidence?: number;
  notes?: string;
  // Monthly breakdown
  monthlyBreakdown: {
    month: string;
    scheduledAmount: number;
    actualAmount: number;
    variance: number;
    status: 'matched' | 'missing' | 'over-recognized';
  }[];
}

interface DeferredRevenueReconciliationTableProps {
  contracts: ContractReconciliation[];
  onContractClick?: (contract: ContractReconciliation) => void;
}

export function DeferredRevenueReconciliationTable({ contracts, onContractClick }: DeferredRevenueReconciliationTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'matched' | 'suggested' | 'no_match'>('all');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [expandedContract, setExpandedContract] = useState<string | null>(null);

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.contractName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || contract.match === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate totals for current month
  const totalScheduled = filteredContracts.reduce((sum, c) => sum + c.scheduledEntries.monthlyAmount, 0);
  const totalActual = filteredContracts.reduce((sum, c) => sum + c.actualRevenue.monthlyRecognized, 0);
  const totalVariance = totalScheduled - totalActual;
  const variancePercent = totalScheduled > 0 ? (totalVariance / totalScheduled) * 100 : 0;

  const getStatusBadge = (match: string, confidence?: number) => {
    switch (match) {
      case 'matched':
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-xs text-slate-600">Matched</span>
          </div>
        );
      case 'suggested':
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-xs text-slate-600">AI {confidence}%</span>
          </div>
        );
      case 'no_match':
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
            <span className="text-xs text-slate-600">Variance</span>
          </div>
        );
      default:
        return <span className="text-xs text-slate-500">Unknown</span>;
    }
  };

  const getActionButton = (match: string) => {
    switch (match) {
      case 'suggested':
        return (
          <button className="text-xs text-blue-600 hover:text-blue-800 underline">
            Adjust
          </button>
        );
      case 'no_match':
        return (
          <button className="text-xs text-blue-600 hover:text-blue-800 underline">
            Post JE
          </button>
        );
      default:
        return (
          <button className="text-xs text-slate-500 hover:text-slate-700 underline">
            View
          </button>
        );
    }
  };

  const getRowBorderColor = (match: string) => {
    switch (match) {
      case 'matched': return 'border-l-emerald-500';
      case 'suggested': return 'border-l-amber-500';
      case 'no_match': return 'border-l-rose-500';
      default: return 'border-l-slate-300';
    }
  };

  const getContractStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'paused': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'ended': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'error': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      {/* Enhanced Header with Filters */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-semibold text-slate-900">Deferred Revenue Reconciliation</h3>
            <Badge variant="outline" className="text-xs">
              Contract-Level
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Contract, Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="matched">Matched</option>
              <option value="suggested">Suggested</option>
              <option value="no_match">Variance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sticky Column Headers */}
      <div className="sticky top-0 z-10 px-4 py-2 bg-slate-50 border-b border-slate-200 shadow-sm">
        <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-700">
          <div className="col-span-5">
            <div className="flex items-center space-x-2">
              <span>Scheduled Revenue</span>
              <span className="text-slate-500 font-normal">(Deferred Schedule)</span>
            </div>
          </div>
          <div className="col-span-1 text-center">
            <div className="flex items-center justify-center">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
          <div className="col-span-5">
            <div className="flex items-center space-x-2">
              <span>Actual Revenue</span>
              <span className="text-slate-500 font-normal">(Recognized)</span>
            </div>
          </div>
          <div className="col-span-1 text-right">
            <span>Status & Action</span>
          </div>
        </div>
      </div>

      {/* Contract List */}
      <div className="divide-y divide-slate-100">
        {filteredContracts.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="text-slate-400 mb-2">
              <Search className="w-8 h-8 mx-auto" />
            </div>
            <div className="text-sm text-slate-500">No contracts found matching your criteria</div>
          </div>
        ) : (
          filteredContracts.map((contract, index) => (
            <div key={contract.id}>
              {/* Main Contract Row */}
              <div 
                className={`group px-4 py-3 transition-all duration-150 cursor-pointer border-l-4 ${getRowBorderColor(contract.match)} ${
                  hoveredRow === contract.id ? 'bg-slate-50' : 
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                }`}
                onClick={() => onContractClick?.(contract)}
                onMouseEnter={() => setHoveredRow(contract.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Scheduled Side */}
                  <div className="col-span-5">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium text-slate-900 truncate">
                            {contract.contractName}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getContractStatusColor(contract.status)}`}
                          >
                            {contract.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {contract.customer} • {contract.contractTerm} • ${contract.contractValue.toLocaleString()}
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="text-xs text-slate-600">
                            <span className="font-medium">This Month:</span> ${contract.scheduledEntries.monthlyAmount.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-600">
                            <span className="font-medium">Recognized:</span> ${contract.scheduledEntries.recognizedToDate.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-600">
                            <span className="font-medium">Remaining:</span> ${contract.scheduledEntries.remainingDeferred.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Indicator */}
                  <div className="col-span-1 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Actual Side */}
                  <div className="col-span-5">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-900">
                          Revenue Recognition
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Method: {contract.actualRevenue.recognitionMethod} • Last: {contract.actualRevenue.lastRecognitionDate}
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="text-xs text-slate-600">
                            <span className="font-medium">This Month:</span> ${contract.actualRevenue.monthlyRecognized.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-600">
                            <span className="font-medium">Variance:</span> 
                            <span className={`ml-1 ${contract.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${Math.abs(contract.variance).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="col-span-1 text-right">
                    <div className="flex flex-col items-end space-y-1">
                      {getStatusBadge(contract.match, contract.confidence)}
                      {getActionButton(contract.match)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable Monthly Breakdown */}
              {expandedContract === contract.id && (
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
                  <div className="text-xs font-semibold text-slate-700 mb-2">Monthly Breakdown</div>
                  <div className="space-y-2">
                    {contract.monthlyBreakdown.map((month, monthIndex) => (
                      <div key={monthIndex} className="flex items-center justify-between py-1 px-3 bg-white rounded border">
                        <div className="flex items-center space-x-4">
                          <div className="text-xs text-slate-600 w-16">{month.month}</div>
                          <div className="text-xs text-slate-600">
                            Scheduled: ${month.scheduledAmount.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-600">
                            Actual: ${month.actualAmount.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`text-xs px-2 py-1 rounded ${
                            month.status === 'matched' ? 'bg-green-50 text-green-700' :
                            month.status === 'missing' ? 'bg-red-50 text-red-700' :
                            'bg-yellow-50 text-yellow-700'
                          }`}>
                            {month.status}
                          </div>
                          <div className={`text-xs font-medium ${
                            month.variance >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${Math.abs(month.variance).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expand/Collapse Button */}
              <div className="px-4 py-2 border-t border-slate-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedContract(expandedContract === contract.id ? null : contract.id);
                  }}
                  className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-700"
                >
                  <ChevronDown className={`w-3 h-3 transition-transform ${
                    expandedContract === contract.id ? 'rotate-180' : ''
                  }`} />
                  <span>
                    {expandedContract === contract.id ? 'Hide' : 'Show'} monthly breakdown
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Enhanced Summary Footer */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          {/* Contract Summary */}
          <div className="flex items-center space-x-4">
            <div className="text-xs font-semibold text-slate-800">Contract Summary</div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                {contracts.filter(c => c.match === 'matched').length} matched
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 text-xs font-medium">
                {contracts.filter(c => c.match === 'suggested').length} AI-suggested
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium">
                {contracts.filter(c => c.match === 'no_match').length} variance
              </span>
              <span className="text-xs text-slate-500">
                ({contracts.length} total contracts)
              </span>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="flex items-center space-x-6 text-right">
            <div className="text-xs">
              <div className="text-slate-500 mb-1">Scheduled (This Month)</div>
              <div className="font-semibold text-slate-900">${totalScheduled.toLocaleString()}</div>
            </div>
            <div className="text-xs">
              <div className="text-slate-500 mb-1">Actual (This Month)</div>
              <div className="font-semibold text-slate-900">${totalActual.toLocaleString()}</div>
            </div>
            <div className="text-xs">
              <div className="text-slate-500 mb-1">Variance</div>
              <div className={`font-semibold ${totalVariance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalVariance.toLocaleString()} ({variancePercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
        
        {/* Variance Breakdown */}
        {totalVariance !== 0 && (
          <div className="mt-2 pt-2 border-t border-slate-200">
            <div className="text-xs text-slate-600">
              <span className="font-medium">Variance breakdown:</span> Unrecognized revenue from new contracts, Timing differences in recognition, Contract modifications
            </div>
          </div>
        )}
        
        {/* Additional Context */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Last updated 3h ago · Auto-reconciled: 78%
          </div>
          <div className="text-xs text-slate-500">
            All variances under $1,000 considered immaterial
          </div>
        </div>
      </div>
    </div>
  );
}
