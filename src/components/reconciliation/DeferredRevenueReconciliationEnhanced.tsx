import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DollarSign,
  Download,
  RefreshCw,
  Plus,
  Settings,
  Clock,
  Target,
  BarChart3,
  Users,
  Zap,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  Check,
  X,
  Edit,
  Link,
  Unlink,
  AlertTriangle,
  Info
} from 'lucide-react';

interface ContractSchedule {
  id: string;
  contractId: string;
  customer: string;
  product: string;
  invoiceId: string;
  invoiceDate: string;
  invoiceAmount: number;
  contractValue: number;
  recognizedYTD: number;
  remainingToRecognize: number;
  expectedThisPeriod: number;
  recognitionMethod: 'straight-line' | 'milestone' | 'usage-based';
  confidence: number;
  status: 'matched' | 'suggested' | 'unreconciled' | 'cutoff-risk';
  schedule: {
    period: string;
    amount: number;
    revenueCode: string;
    confidence: number;
  }[];
  cutoffRisk?: {
    reason: string;
    suggestedAdjustment: number;
  };
}

interface GLLine {
  id: string;
  account: string;
  accountName: string;
  jeId?: string;
  balance: number;
  linkedContracts: string[];
  notes: string;
  status: 'matched' | 'suggested' | 'unreconciled';
  confidence?: number;
  cutoffRisk?: boolean;
}

interface VarianceBreakdown {
  category: string;
  amount: number;
  percentage: number;
  description: string;
  action: string;
}

interface ScorecardData {
  contractRevenue: number;
  recognizedYTD: number;
  deferredGLBalance: number;
  reconVariance: number;
  percentRecognized: number;
  openObligations: number;
}

interface DeferredRevenueReconciliationEnhancedProps {
  scorecards: ScorecardData;
  contracts: ContractSchedule[];
  glLines: GLLine[];
  varianceBreakdown: VarianceBreakdown[];
  onContractClick?: (contract: ContractSchedule) => void;
  onGLLineClick?: (glLine: GLLine) => void;
  onCreateJE?: (data: any) => void;
  onRequestReview?: () => void;
}

export function DeferredRevenueReconciliationEnhanced({
  scorecards,
  contracts,
  glLines,
  varianceBreakdown,
  onContractClick,
  onGLLineClick,
  onCreateJE,
  onRequestReview
}: DeferredRevenueReconciliationEnhancedProps) {
  const [selectedGrouping, setSelectedGrouping] = useState('contract');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [selectedGLLine, setSelectedGLLine] = useState<string | null>(null);
  const [showJEDraft, setShowJEDraft] = useState(false);

  const getStatusBadge = (status: string, confidence?: number) => {
    switch (status) {
      case 'matched':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Matched
          </Badge>
        );
      case 'suggested':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Bot className="w-3 h-3 mr-1" />
            Suggested ({confidence}%)
          </Badge>
        );
      case 'unreconciled':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Unreconciled
          </Badge>
        );
      case 'cutoff-risk':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Cutoff Risk
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRowBorderColor = (status: string) => {
    switch (status) {
      case 'matched': return 'border-l-green-500';
      case 'suggested': return 'border-l-amber-500';
      case 'unreconciled': return 'border-l-red-500';
      case 'cutoff-risk': return 'border-l-orange-500';
      default: return 'border-l-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Deferred Revenue — September 2025</h1>
            <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
              <span>Entity: US Parent</span>
              <span>•</span>
              <span>Last synced: 2h ago (Aqqrue Agent)</span>
              <span>•</span>
              <span>Owner: Priya</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={() => setShowJEDraft(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create JE
            </Button>
            <Button variant="outline" size="sm" onClick={onRequestReview}>
              Request Controller Review
            </Button>
            <Button variant="outline" size="sm">
              Close Period
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Scorecards removed as per request */}

      {/* Filters and Search */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by contract ID, customer, JE ID, amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="matched">Reconciled</SelectItem>
                <SelectItem value="suggested">Suggested</SelectItem>
                <SelectItem value="unreconciled">Unreconciled</SelectItem>
                <SelectItem value="cutoff-risk">Cutoff Risk</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedGrouping} onValueChange={setSelectedGrouping}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Grouping" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contract">By Contract</SelectItem>
                <SelectItem value="customer">By Customer</SelectItem>
                <SelectItem value="product">By Product</SelectItem>
                <SelectItem value="asc606">By ASC 606 Performance Obligation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Side by Side */}
      <div className="flex-1 flex">
        {/* Left: Source Schedules */}
        <div className="flex-1 bg-white border-r border-slate-200">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-900">Source Schedules (Contracts / Invoices)</h3>
            <p className="text-xs text-slate-500 mt-1">Expected recognition from contracts and invoices</p>
          </div>
          <div className="divide-y divide-slate-100">
            {contracts.map((contract) => (
              <div
                key={contract.id}
                className={`p-4 cursor-pointer border-l-4 ${getRowBorderColor(contract.status)} ${
                  selectedContract === contract.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                }`}
                onClick={() => {
                  setSelectedContract(contract.id);
                  onContractClick?.(contract);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-mono text-sm font-medium">{contract.contractId}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-sm text-slate-700">{contract.customer}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-sm text-slate-700">{contract.product}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-500">Invoice:</span>
                        <span className="ml-1 font-mono">{contract.invoiceId}</span>
                        <div className="text-slate-400">{contract.invoiceDate}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Amount:</span>
                        <span className="ml-1 font-mono">${contract.invoiceAmount.toLocaleString()}</span>
                        <div className="text-slate-400">Contract: ${contract.contractValue.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Recognized YTD:</span>
                        <span className="ml-1 font-mono">${contract.recognizedYTD.toLocaleString()}</span>
                        <div className="text-slate-400">Remaining: ${contract.remainingToRecognize.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">This Period:</span>
                        <span className="ml-1 font-mono">${contract.expectedThisPeriod.toLocaleString()}</span>
                        <div className="text-slate-400">{contract.recognitionMethod}</div>
                      </div>
                    </div>
                    {contract.cutoffRisk && (
                      <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs">
                        <div className="flex items-center space-x-1 text-orange-700">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="font-medium">Cutoff Risk:</span>
                          <span>{contract.cutoffRisk.reason}</span>
                        </div>
                        <div className="text-orange-600 mt-1">
                          Suggested adjustment: ${contract.cutoffRisk.suggestedAdjustment.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(contract.status, contract.confidence)}
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Link className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Match Indicator */}
        <div className="w-12 bg-slate-50 flex items-center justify-center border-x border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
            <ArrowUpDown className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Right: GL Deferred Revenue */}
        <div className="flex-1 bg-white">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-900">GL Deferred Revenue (Balance Sheet)</h3>
            <p className="text-xs text-slate-500 mt-1">Actual GL balances and journal entries</p>
          </div>
          <div className="divide-y divide-slate-100">
            {glLines.map((glLine) => (
              <div
                key={glLine.id}
                className={`p-4 cursor-pointer border-l-4 ${getRowBorderColor(glLine.status)} ${
                  selectedGLLine === glLine.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                }`}
                onClick={() => {
                  setSelectedGLLine(glLine.id);
                  onGLLineClick?.(glLine);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-mono text-sm font-medium">{glLine.account}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-sm text-slate-700">{glLine.accountName}</span>
                      {glLine.jeId && (
                        <>
                          <span className="text-slate-500">•</span>
                          <span className="font-mono text-sm text-slate-600">{glLine.jeId}</span>
                        </>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-500">Balance:</span>
                        <span className="ml-1 font-mono">${glLine.balance.toLocaleString()}</span>
                        {glLine.cutoffRisk && (
                          <div className="text-orange-600 flex items-center space-x-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Cutoff Risk</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-slate-500">Linked Contracts:</span>
                        <div className="text-slate-600">
                          {glLine.linkedContracts.length > 0 
                            ? glLine.linkedContracts.join(', ')
                            : 'None'
                          }
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Notes:</span>
                        <div className="text-slate-600 truncate">{glLine.notes || 'None'}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(glLine.status, glLine.confidence)}
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Unlink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Variance Breakdown */}
      <div className="bg-white border-t border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Variance Breakdown</h3>
        <div className="grid grid-cols-4 gap-4">
          {varianceBreakdown.map((item, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-900">{item.category}</span>
                <span className="text-sm font-mono text-slate-600">${item.amount.toLocaleString()}</span>
              </div>
              <div className="text-xs text-slate-500 mb-2">{item.description}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{item.percentage.toFixed(1)}% of variance</span>
                <Button variant="outline" size="sm" className="text-xs">
                  {item.action}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* JE Draft Modal */}
      {showJEDraft && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-lg">Create Journal Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Memo</label>
                <Input 
                  defaultValue="Auto JE — Deferred Revenue reclassification — Aqqrue"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Effective Date</label>
                <Input type="date" defaultValue="2025-09-30" className="mt-1" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="auto-reverse" className="rounded" />
                <label htmlFor="auto-reverse" className="text-sm text-slate-700">
                  Auto-reverse next period
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowJEDraft(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  onCreateJE?.({});
                  setShowJEDraft(false);
                }}>
                  Save Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
