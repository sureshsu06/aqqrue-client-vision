import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  FileText, 
  Bot, 
  ArrowUpDown, 
  Eye, 
  ExternalLink,
  CreditCard,
  DollarSign,
  CheckCircle,
  XCircle,
  Brain,
  Hourglass
} from 'lucide-react';

interface StripeTransaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  match: 'matched' | 'suggested' | 'no_match';
  jeReference?: string;
  notes?: string;
  bankDate: string;
  bankDescription: string;
  bankAmount: number;
  bankSource: string;
  bankTxnId: string;
  glDate?: string;
  glEntry?: string;
  glAccount?: string;
  glAmount?: number;
  glJeId?: string;
  stripeFees: number;
  netAmount: number;
  suggestedMatch?: string;
  confidence?: number;
  // Optional enriched fields for UI
  customerName?: string;
  invoiceNumber?: string;
  contractNumber?: string;
}

interface StripeReconciliationTableSummary {
  imported: number;
  matched: number;
  unmatched: number;
  bankTotal?: number;
  glTotal?: number;
  feesTotal?: number;
  variancePercent?: number;
  varianceBreakdown?: string[];
}

interface StripeReconciliationTableProps {
  transactions: StripeTransaction[];
  onTransactionClick?: (transaction: StripeTransaction) => void;
  summary?: StripeReconciliationTableSummary;
}

export function StripeReconciliationTable({ 
  transactions, 
  onTransactionClick,
  summary
}: StripeReconciliationTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);
  const [rows, setRows] = useState<StripeTransaction[]>(transactions);

  React.useEffect(() => {
    setRows(transactions);
  }, [transactions]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);

  const getCustomerName = (transactionId: number) => {
    const customers = [
      'TechStart Inc.',
      'Global Solutions Ltd.',
      'Digital Dynamics',
      'Cloud Ventures',
      'Innovation Hub',
      'Future Systems',
      'DataFlow Corp.',
      'NextGen Technologies',
      'Smart Solutions',
      'Enterprise Partners'
    ];
    return customers[(transactionId - 1) % customers.length];
  };

  const filteredTransactions = rows.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.bankTxnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.glJeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.amount.toString().includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || transaction.match === filterStatus;
    const matchesIssues = !showOnlyIssues || transaction.match !== 'matched';
    
    return matchesSearch && matchesFilter && matchesIssues;
  });

  // Calculate totals for summary using provided summary when available, otherwise compute from transactions
  const computedBankTotal = transactions.reduce((sum, t) => sum + (t.bankAmount || t.amount || 0), 0);
  const computedGlTotal = transactions.reduce((sum, t) => sum + (t.glAmount || t.amount || 0), 0);
  const computedFeesTotal = transactions.reduce((sum, t) => sum + (t.stripeFees || 0), 0);

  const bankTotal = summary?.bankTotal ?? computedBankTotal;
  const glTotal = summary?.glTotal ?? computedGlTotal;
  const feesTotal = summary?.feesTotal ?? computedFeesTotal;
  const variance = bankTotal - glTotal;
  const variancePercent = summary?.variancePercent ?? (bankTotal > 0 ? (variance / bankTotal) * 100 : 0);

  const matchedCountComputed = rows.filter(t => t.match === 'matched').length;
  const suggestedCountComputed = rows.filter(t => t.match === 'suggested').length;
  const unmatchedCountComputed = rows.filter(t => t.match === 'no_match').length;
  const pendingPostingCount = rows.filter(t => t.match === 'matched' && !t.glJeId).length;

  const totalImported = summary?.imported ?? transactions.length;
  const matchedCount = summary?.matched ?? matchedCountComputed;
  const unmatchedCount = summary?.unmatched ?? unmatchedCountComputed;
  const suggestedCount = suggestedCountComputed; // always computed from visible data

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
          <button className="text-[11px] px-2 py-1 rounded border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors">
            Accept Match
          </button>
        );
      case 'no_match':
        return (
          <button className="text-[11px] px-2 py-1 rounded border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-300 transition-colors">
            Create JE
          </button>
        );
      default:
        return (
          <button className="text-[11px] px-2 py-1 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-700 transition-colors">
            View
          </button>
        );
    }
  };

  const getRowBorderColor = (match: string) => {
    switch (match) {
      case 'matched': return 'border-emerald-500';
      case 'suggested': return 'border-amber-500';
      case 'no_match': return 'border-rose-500';
      default: return 'border-slate-300';
    }
  };

  const getRowBgColor = (match: string) => {
    switch (match) {
      case 'suggested':
        return 'bg-amber-50';
      case 'no_match':
        return 'bg-rose-50';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-semibold text-slate-900">Stripe Payouts ↔ GL Reconciliation</h3>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 pr-4 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="matched">Matched</option>
              <option value="suggested">Suggested</option>
              <option value="no_match">Unmatched</option>
            </select>
            <button
              onClick={() => setShowCustomerInfo(!showCustomerInfo)}
              className={`px-3 py-1.5 text-xs border rounded-md transition-colors ${
                showCustomerInfo 
                  ? 'bg-blue-50 border-blue-300 text-blue-700' 
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {showCustomerInfo ? 'Hide Customers' : 'Show Customers'}
            </button>
          </div>
        </div>
      </div>

      {/* Sample Indicator */}
      <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-blue-700 font-medium"></span>
            <span className="text-xs text-blue-600">Showing {Math.min(10, filteredTransactions.length)} of {totalImported} transactions</span>
            <span className="text-xs text-slate-500">(truncated)</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1 text-xs text-slate-700">
              <input type="checkbox" className="rounded" checked={showOnlyIssues} onChange={(e) => setShowOnlyIssues(e.target.checked)} />
              Show only issues
            </label>
            <button
              className="text-xs text-blue-600 hover:text-blue-800 underline"
              onClick={() => {
                // Accept all high-confidence AI suggestions locally
                setRows(prev => prev.map(t => (t.match === 'suggested' && (t.confidence || 0) >= 90) ? { ...t, match: 'matched', glJeId: t.glJeId || 'AUTO-JE' } : t));
              }}
              title="Accept all AI suggestions with confidence >= 90%"
            >
              Accept all &gt;90% AI suggestions
            </button>
            <button className="text-xs text-blue-600 hover:text-blue-800 underline">
              View All {totalImported} Transactions
            </button>
          </div>
        </div>
      </div>

      {/* Review Summary Bar (non-sticky) */}
      <div className="px-4 py-2 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-6 text-xs">
          <span className="inline-flex items-center gap-2 text-green-700 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span className="font-semibold">{matchedCount}</span>
            <span className="text-slate-700">Matched</span>
          </span>
          <span className="inline-flex items-center gap-2 text-amber-700 font-medium">
            <Brain className="w-3.5 h-3.5" />
            <span className="font-semibold">{suggestedCount}</span>
            <span className="text-slate-700">AI-Suggested</span>
          </span>
          <span className="inline-flex items-center gap-2 text-red-700 font-medium">
            <XCircle className="w-3.5 h-3.5" />
            <span className="font-semibold">{unmatchedCount}</span>
            <span className="text-slate-700">Unmatched</span>
          </span>
          <span className="inline-flex items-center gap-2 text-slate-700 font-medium">
            <Hourglass className="w-3.5 h-3.5" />
            <span className="font-semibold">{pendingPostingCount}</span>
            <span className="text-slate-700">Pending JE Posting</span>
          </span>
        </div>
      </div>

      {/* Column Headers (non-sticky) */}
      <div className="px-4 py-2 bg-white border-b border-slate-200">
        <div className="grid grid-cols-12 gap-3 text-[11px] text-slate-500">
          <div className="col-span-5">Bank</div>
          <div className="col-span-1 text-center">Match</div>
          <div className="col-span-5">GL</div>
          <div className="col-span-1 text-right">Status</div>
        </div>
      </div>

      {/* Enhanced Transaction List */}
      <div className="divide-y divide-slate-100">
        {filteredTransactions.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 mx-auto" />
            </div>
            <div className="text-sm text-slate-500">No transactions found matching your criteria</div>
          </div>
        ) : (
          filteredTransactions.slice(0, 10).map((transaction, index) => (
            <div 
              key={transaction.id} 
              className={`group px-4 py-2 transition-all duration-150 cursor-pointer border-l-4 ${getRowBorderColor(transaction.match)} hover:shadow-sm hover:ring-1 hover:ring-blue-100 ${
                hoveredRow === transaction.id ? 'bg-slate-50' : 
                getRowBgColor(transaction.match) || (index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30')
              } ${transaction.match === 'matched' ? 'opacity-75 text-slate-600' : ''}`}
              onClick={() => onTransactionClick?.(transaction)}
              onMouseEnter={() => setHoveredRow(transaction.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div className="flex items-center gap-3">
                {/* Customer Column */}
                {showCustomerInfo && (
                  <div className="w-48 flex-shrink-0">
                    <div className="text-xs font-medium text-slate-900">
                      {transaction.customerName || getCustomerName(transaction.id)}
                    </div>
                    <div className="mt-1 flex items-center space-x-2">
                      <a 
                        href="#" 
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('View invoice for transaction:', transaction.id);
                        }}
                      >
                        Invoice #{transaction.invoiceNumber || `INV-2025-${String(transaction.id).padStart(3, '0')}`}
                      </a>
                      <a 
                        href="#" 
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('View contract for transaction:', transaction.id);
                        }}
                      >
                        Contract #{transaction.contractNumber || `CT-${String(transaction.id + 100).padStart(3, '0')}`}
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Main Content */}
                <div className="flex-1 grid grid-cols-12 gap-3 items-center">
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
                    <div className="p-1 rounded-full bg-slate-100">
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* GL Side */}
                <div className="col-span-5 border-l pl-3 border-slate-200">
                  {transaction.match === 'no_match' ? (
                    <div className="flex items-center space-x-3">
                      <div className="text-xs text-slate-400 w-12 flex-shrink-0">
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
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="text-sm text-slate-900 truncate">
                            {transaction.glAccount || transaction.suggestedMatch}
                          </div>
                          {transaction.suggestedMatch && (
                            <span
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[11px] flex-shrink-0"
                              title={`Confidence: ${transaction.confidence || 0}% | Reason: Dates + amount match; vendor similarity 93% | Factors: Amount, Vendor, Description`}
                            >
                              <Bot className="w-3 h-3" /> AI suggested
                            </span>
                          )}
                        </div>
                        {transaction.glJeId && (
                          <div className="text-xs text-slate-400 font-mono mt-0.5">
                            JE: {transaction.glJeId}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-slate-800 w-20 text-right flex-shrink-0">
                        {transaction.netAmount ? `$${transaction.netAmount.toLocaleString()}` : 
                         transaction.glAmount ? `$${transaction.glAmount.toLocaleString()}` : 
                         transaction.amount ? `$${transaction.amount.toLocaleString()}` : ''}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status & Action */}
                <div className="col-span-1 text-right">
                  <div className="flex flex-col items-end space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {getStatusBadge(transaction.match, transaction.confidence)}
                    {getActionButton(transaction.match)}
                  </div>
                </div>
                </div>
              </div>

              {/* Stripe Fees Row */}
              <div className="mt-2 flex items-center gap-4">
                {showCustomerInfo && <div className="w-48 flex-shrink-0"></div>}
                <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5 flex items-center space-x-3">
                    <div className="text-xs text-slate-500 w-12 flex-shrink-0">
                      <CreditCard className="w-3 h-3 mx-auto" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-600">
                        Stripe fees ({transaction.stripeFees ? `$${transaction.stripeFees.toLocaleString()}` : '—'})
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 w-20 text-right flex-shrink-0">
                      {transaction.stripeFees ? `$${transaction.stripeFees.toLocaleString()}` : '—'}
                    </div>
                  </div>
                  <div className="col-span-1"></div>
                  <div className="col-span-5"></div>
                  <div className="col-span-1"></div>
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
                {matchedCount} matched
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 text-xs font-medium">
                {suggestedCount} AI-suggested
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium">
                {unmatchedCount} unmatched
              </span>
              <span className="text-xs text-slate-500">
                ({totalImported} total transactions)
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
              <div className="text-slate-500 mb-1">Fees Total</div>
              <div className="font-semibold text-slate-900">${feesTotal.toLocaleString()}</div>
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
              <span className="font-medium">Variance breakdown:</span> {summary?.varianceBreakdown ? summary.varianceBreakdown.join(', ') : 'Unposted Stripe fees, Fee calculation discrepancies, Unmatched payout batches'}
            </div>
          </div>
        )}
        
        {/* Additional Context */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            Last updated 30m ago · Auto-reconciled: 87%
          </div>
          <div className="text-xs text-slate-500">
            All variances under $50 considered immaterial
          </div>
        </div>
      </div>
    </div>
  );
}
