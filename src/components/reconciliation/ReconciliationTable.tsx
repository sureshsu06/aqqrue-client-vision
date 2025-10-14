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
  ExternalLink
} from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  match: 'matched' | 'suggested' | 'no_match';
  jeReference?: string;
  suggestedMatch?: string;
  notes?: string;
  confidence?: number;
  // Bank side data
  bankDate?: string;
  bankDescription?: string;
  bankAmount?: number;
  bankSource?: string;
  bankTxnId?: string;
  // GL side data
  glDate?: string;
  glEntry?: string;
  glAccount?: string;
  glAmount?: number;
  glJeId?: string;
}

interface ReconciliationTableProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
}

export function ReconciliationTable({ transactions, onTransactionClick }: ReconciliationTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'matched' | 'suggested' | 'no_match'>('all');
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.jeReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || transaction.match === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate totals for summary (scaled for 156 transactions)
  const sampleBankTotal = filteredTransactions.reduce((sum, t) => sum + (t.bankAmount || t.amount || 0), 0);
  const sampleGlTotal = filteredTransactions.reduce((sum, t) => sum + (t.glAmount || t.amount || 0), 0);
  
  // Scale up to realistic numbers for 156 transactions
  const scaleFactor = 156 / 5; // 31.2x multiplier
  const bankTotal = Math.round(sampleBankTotal * scaleFactor);
  const glTotal = Math.round(sampleGlTotal * scaleFactor * 0.97); // 3% variance for realism
  const variance = bankTotal - glTotal;
  const variancePercent = bankTotal > 0 ? (variance / bankTotal) * 100 : 0;

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
            <span className="text-xs text-slate-600">Unmatched</span>
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
            Match
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

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      {/* Enhanced Header with Filters */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-semibold text-slate-900">Bank ↔ GL Reconciliation</h3>

          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Description, JE ID, or Amount..."
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
              <option value="no_match">Unmatched</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sticky Column Headers */}
      <div className="sticky top-0 z-10 px-4 py-2 bg-slate-50 border-b border-slate-200 shadow-sm">
        <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-700">
          <div className="col-span-5">
            <div className="flex items-center space-x-2">
              <span>Bank Transactions</span>
              <span className="text-slate-500 font-normal">(External)</span>
            </div>
          </div>
          <div className="col-span-1 text-center">
            <div className="flex items-center justify-center">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
          <div className="col-span-5">
            <div className="flex items-center space-x-2">
              <span>GL Transactions</span>
              <span className="text-slate-500 font-normal">(Internal)</span>
            </div>
          </div>
          <div className="col-span-1 text-right">
            <span>Status & Action</span>
          </div>
        </div>
      </div>

      {/* Sample Indicator */}
      <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-blue-700 font-medium"></span>
            <span className="text-xs text-blue-600">Showing 15 of 156 transactions</span>
            <span className="text-xs text-slate-500">(truncated)</span>
          </div>
          <button className="text-xs text-blue-600 hover:text-blue-800 underline">
            View All 156 Transactions
          </button>
        </div>
      </div>

      {/* Enhanced Transaction List */}
      <div className="divide-y divide-slate-100">
        {filteredTransactions.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="text-slate-400 mb-2">
              <Search className="w-8 h-8 mx-auto" />
            </div>
            <div className="text-sm text-slate-500">No transactions found matching your criteria</div>
          </div>
        ) : (
          filteredTransactions.slice(0, 15).map((transaction, index) => (
            <div 
              key={transaction.id} 
              className={`group px-4 py-2 transition-all duration-150 cursor-pointer border-l-4 ${getRowBorderColor(transaction.match)} ${
                hoveredRow === transaction.id ? 'bg-slate-50' : 
                index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
              }`}
              onClick={() => onTransactionClick?.(transaction)}
              onMouseEnter={() => setHoveredRow(transaction.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Bank Side */}
                <div className="col-span-5">
                  <div className="flex items-center space-x-3">
                    <div className="text-xs text-slate-500 w-12 flex-shrink-0">
                      {transaction.bankDate || transaction.date}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-900 truncate">
                        {transaction.bankDescription || transaction.description}
                      </div>
                      {transaction.bankTxnId && (
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          ID: {transaction.bankTxnId}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-slate-800 w-20 text-right flex-shrink-0">
                      {transaction.bankAmount ? `$${transaction.bankAmount.toLocaleString()}` : 
                       transaction.amount ? `$${transaction.amount.toLocaleString()}` : ''}
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

                {/* GL Side */}
                <div className="col-span-5">
                  {transaction.match === 'no_match' ? (
                    <div className="flex items-center space-x-3">
                      <div className="text-xs text-slate-400 font-mono w-12 flex-shrink-0">
                        —
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-400 italic">
                          No GL entry found
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Requires manual review
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 w-20 text-right flex-shrink-0">
                        —
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <div className="text-xs text-slate-500 w-12 flex-shrink-0">
                        {transaction.glDate || transaction.date}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-900 truncate">
                          {transaction.glAccount || transaction.suggestedMatch}
                        </div>
                        {transaction.glJeId && (
                          <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center space-x-2">
                            <span>JE: {transaction.glJeId}</span>
                            {transaction.suggestedMatch && (
                              <span className="text-amber-600 flex items-center">
                                <Bot className="w-3 h-3 mr-1" />
                                AI suggested match
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-slate-800 w-20 text-right flex-shrink-0">
                        {transaction.glAmount ? `$${transaction.glAmount.toLocaleString()}` : 
                         transaction.amount ? `$${transaction.amount.toLocaleString()}` : ''}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status & Action */}
                <div className="col-span-1 text-right">
                  <div className="flex flex-col items-end space-y-1">
                    {getStatusBadge(transaction.match, transaction.confidence)}
                    {getActionButton(transaction.match)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Enhanced Summary Footer */}
      <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          {/* Transaction Summary */}
          <div className="flex items-center space-x-4">
            <div className="text-xs font-semibold text-slate-800">Transaction Summary</div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                {Math.round(transactions.filter(t => t.match === 'matched').length * 10.4)} matched
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 text-xs font-medium">
                {Math.round(transactions.filter(t => t.match === 'suggested').length * 10.4)} AI-suggested
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium">
                {Math.round(transactions.filter(t => t.match === 'no_match').length * 10.4)} unmatched
              </span>
              <span className="text-xs text-slate-500">
                (156 total transactions)
              </span>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="flex items-center space-x-6 text-right">
            <div className="text-xs">
              <div className="text-slate-500 mb-1">Bank Total</div>
              <div className="font-semibold text-slate-900">${bankTotal.toLocaleString()}</div>
            </div>
            <div className="text-xs">
              <div className="text-slate-500 mb-1">GL Total</div>
              <div className="font-semibold text-slate-900">${glTotal.toLocaleString()}</div>
            </div>
            <div className="text-xs">
              <div className="text-slate-500 mb-1">Variance</div>
              <div className={`font-semibold ${variance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${variance.toLocaleString()} ({variancePercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
        
        {/* Variance Breakdown */}
        {variance !== 0 && (
          <div className="mt-2 pt-2 border-t border-slate-200">
            <div className="text-xs text-slate-600">
              <span className="font-medium">Variance breakdown:</span> Unposted interest entry, Unposted Stripe fees ($4,500), Unmatched expense transactions ($3,123)
            </div>
          </div>
        )}
        
        {/* Additional Context */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Last updated 2h ago · Auto-reconciled: 89%
          </div>
          <div className="text-xs text-slate-500">
            All variances under $100 considered immaterial
          </div>
        </div>
      </div>
    </div>
  );
}
