import { useState } from 'react';
import { 
  ForecastDriver, 
  ForecastScenario, 
  PnLForecastLine, 
  MonthlyForecastData,
  RollingForecastData 
} from '@/types/planVsActuals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ChevronRight, 
  ChevronDown,
  Plus,
  BarChart3,
  LineChart,
  PieChart,
  RefreshCw,
  Save,
  Copy,
  Trash2,
  Edit
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface RollingForecastProps {
  drivers: ForecastDriver[];
  onDriversChange: (drivers: ForecastDriver[]) => void;
  rollingForecastData: RollingForecastData;
  onRollingForecastChange: (data: RollingForecastData) => void;
}

const getImpactIcon = (impact: string) => {
  switch (impact) {
    case 'positive':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'negative':
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <Minus className="h-4 w-4 text-gray-400" />;
  }
};

const getVarianceColor = (variance: number) => {
  if (variance > 0) return 'text-green-600';
  if (variance < 0) return 'text-red-600';
  return 'text-gray-600';
};

const getVarianceBackground = (variance: number) => {
  if (variance > 0) return 'bg-green-50';
  if (variance < 0) return 'bg-red-50';
  return 'bg-gray-50';
};

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
};

const formatPercent = (value: number) => {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
};

// Mock data - in real app this would come from props or API
const mockScenarios: ForecastScenario[] = [
  {
    id: 'base',
    name: 'Base Case',
    description: 'Most likely scenario based on current trends',
    isBase: true,
    createdAt: '2025-01-01T00:00:00Z',
    lastModified: '2025-01-20T10:00:00Z'
  },
  {
    id: 'best',
    name: 'Best Case',
    description: 'Optimistic scenario with improved performance',
    isBase: false,
    createdAt: '2025-01-15T00:00:00Z',
    lastModified: '2025-01-20T10:00:00Z'
  },
  {
    id: 'worst',
    name: 'Worst Case',
    description: 'Conservative scenario with market challenges',
    isBase: false,
    createdAt: '2025-01-15T00:00:00Z',
    lastModified: '2025-01-20T10:00:00Z'
  }
];

const timeHorizons = ['12M', '18M', '24M'];

// Mock chart data
const chartData = [
  { month: 'Aug-25', plan: 30.2, actual: 29.3, forecast: 30.5 },
  { month: 'Sep-25', plan: 30.8, actual: 29.8, forecast: 31.2 },
  { month: 'Oct-25', plan: 31.4, actual: 30.2, forecast: 31.9 },
  { month: 'Nov-25', plan: 32.0, actual: 30.8, forecast: 32.6 },
  { month: 'Dec-25', plan: 32.6, actual: 31.4, forecast: 33.3 },
  { month: 'Jan-26', plan: 33.2, actual: 32.0, forecast: 34.0 },
  { month: 'Feb-26', plan: 33.8, actual: 32.6, forecast: 34.7 },
  { month: 'Mar-26', plan: 34.4, actual: 33.2, forecast: 35.4 },
  { month: 'Apr-26', plan: 35.0, actual: 33.8, forecast: 36.1 },
  { month: 'May-26', plan: 35.6, actual: 34.4, forecast: 36.8 },
  { month: 'Jun-26', plan: 36.2, actual: 35.0, forecast: 37.5 },
  { month: 'Jul-26', plan: 36.8, actual: 35.6, forecast: 38.2 }
];

const varianceData = [
  { department: 'Revenue', variance: -2.8, color: '#ef4444' },
  { department: 'COGS', variance: -1.6, color: '#f97316' },
  { department: 'Gross Profit', variance: -0.4, color: '#eab308' },
  { department: 'Operating Expenses', variance: -1.6, color: '#8b5cf6' },
  { department: 'EBITDA', variance: 0.8, color: '#10b981' },
  { department: 'Net Income', variance: 0.9, color: '#06b6d4' }
];

export const RollingForecast = ({ 
  drivers, 
  onDriversChange, 
  rollingForecastData, 
  onRollingForecastChange 
}: RollingForecastProps) => {
  const [activeScenario, setActiveScenario] = useState('base');
  const [timeHorizon, setTimeHorizon] = useState('12M');
  const [expandedLines, setExpandedLines] = useState<Set<string>>(new Set(['revenue', 'cogs', 'operating_expenses', 'infrastructure_costs', 'support_costs', 'sales_marketing', 'rd', 'other_items']));
  const [editableCells, setEditableCells] = useState(new Map());
  const [showNewScenarioModal, setShowNewScenarioModal] = useState(false);
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly'>('monthly');
  const [isEditMode, setIsEditMode] = useState(false);
  const [systemAssumptions, setSystemAssumptions] = useState({
    newCustomers: { base: 25, growth: 2, months: 12 },
    arrPerCustomer: 0.2,
    ndrPercentage: 0.15,
    existingRevenue: { base: 120, growth: 5, months: 12 }
  });

  const handleToggleExpanded = (lineKey: string) => {
    const newExpanded = new Set(expandedLines);
    if (newExpanded.has(lineKey)) {
      newExpanded.delete(lineKey);
    } else {
      newExpanded.add(lineKey);
    }
    setExpandedLines(newExpanded);
  };

  const handleCellEdit = (lineKey: string, monthIndex: number, value: number) => {
    const cellKey = `${lineKey}_${monthIndex}`;
    setEditableCells(new Map(editableCells.set(cellKey, value)));
  };

  const handleSaveChanges = () => {
    // In real app, this would save to backend
    console.log('Saving changes:', editableCells);
    setEditableCells(new Map());
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditableCells(new Map());
    setIsEditMode(false);
  };

  const handleCreateNewScenario = () => {
    // Create new scenario with current assumptions
    const newScenario = {
      id: `scenario_${Date.now()}`,
      name: `Scenario ${new Date().toLocaleDateString()}`,
      assumptions: { ...systemAssumptions },
      customValues: { ...editableCells }
    };
    console.log('Creating new scenario:', newScenario);
    setShowNewScenarioModal(true);
  };

  const handleCreateScenario = () => {
    setShowNewScenarioModal(true);
  };

  const getIndentLevel = (line: PnLForecastLine) => {
    if (!line.parentLine) return 0;
    if (line.subsection) return 2;
    return 1;
  };

  const isVisible = (line: PnLForecastLine) => {
    if (!line.parentLine) return true;
    if (line.parentLine && expandedLines.has(line.parentLine)) return true;
    return false;
  };

  // Helper function to get column headers based on timeframe
  const getColumnHeaders = () => {
    if (timeframe === 'monthly') {
      return [
        'Aug-25', 'Sep-25', 'Oct-25', 'Nov-25', 'Dec-25', 'Jan-26',
        'Feb-26', 'Mar-26', 'Apr-26', 'May-26', 'Jun-26', 'Jul-26'
      ];
    } else {
      return [
        'Q3-25', 'Q4-25', 'Q1-26', 'Q2-26', 'Q3-26', 'Q4-26'
      ];
    }
  };

  // Helper function to get number of columns based on timeframe
  const getColumnCount = () => {
    return timeframe === 'monthly' ? 12 : 6;
  };

  // Helper function to format quarterly data (sum of 3 months)
  const getQuarterlyValue = (baseValue: number, monthIndex: number, increment: number) => {
    const startMonth = monthIndex * 3;
    const endMonth = startMonth + 3;
    let sum = 0;
    for (let i = startMonth; i < endMonth; i++) {
      sum += baseValue + i * increment;
    }
    return sum;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
                <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          
          {/* Scenario Selector */}
          <Select value={activeScenario} onValueChange={setActiveScenario}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockScenarios.map((scenario) => (
                <SelectItem key={scenario.id} value={scenario.id}>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{scenario.name}</span>
                    {scenario.isBase && (
                      <Badge variant="outline" className="text-xs">Base</Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
              <SelectItem value="new" onClick={handleCreateScenario}>
                <div className="flex items-center space-x-2">
                  <Plus className="h-3 w-3" />
                  <span className="text-sm">New Scenario</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Time Horizon Selector */}
          <Select value={timeHorizon} onValueChange={setTimeHorizon}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeHorizons.map((horizon) => (
                <SelectItem key={horizon} value={horizon}>
                  <span className="text-sm">{horizon}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>


        </div>

                  <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Copy className="h-3 w-3 mr-1" />
            Compare Scenarios
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
          <Button onClick={handleSaveChanges} size="sm" className="text-xs">
            <Save className="h-3 w-3 mr-1" />
            Save Changes
          </Button>
        </div>
                  </div>

      {/* Summary Elements - Moved to Top */}
      <div className="grid grid-cols-4 gap-4">
        {/* Variance Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Variance Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">
                <strong>Forecast is -3.2% vs Plan</strong>, mainly due to higher churn and lower expansion rates.
              </p>
                  </div>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-xs">
                <span>Revenue Variance:</span>
                <span className="text-red-600">-0.7%</span>
                    </div>
              <div className="flex justify-between text-xs">
                <span>COGS Variance:</span>
                <span className="text-red-600">-1.6%</span>
                </div>
              <div className="flex justify-between text-xs">
                <span>EBITDA Variance:</span>
                <span className="text-green-600">+0.8%</span>
              </div>
          </div>
          </CardContent>
        </Card>

        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-lg">
                            <div className="text-xs font-medium text-gray-900 mb-1">{label}</div>
                            {payload.map((entry: any, index: number) => (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <span className="text-gray-600" style={{ color: entry.color }}>
                                  {entry.name}:
                                </span>
                                <span className="font-medium text-gray-900">
                                  ${entry.value}M
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line type="monotone" dataKey="plan" stroke="#3b82f6" strokeWidth={2} name="Plan" />
                  <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="Actual" />
                  <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} name="Forecast" />
                </RechartsLineChart>
              </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>



        {/* Scenario Comparison */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Scenario Comparison</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
              <div className="space-y-2">
              {mockScenarios.map((scenario) => (
                <div key={scenario.id} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      scenario.id === 'base' ? 'bg-blue-500' : 
                      scenario.id === 'best' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-xs font-medium">{scenario.name}</span>
                </div>
                  <Badge variant="outline" className="text-xs">
                    {scenario.id === 'base' ? 'Active' : 'View'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
          </div>

      {/* Executive Summary */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 max-w-full overflow-hidden">
        <h2 className="text-base font-medium text-blue-900 mb-3">Executive Summary</h2>
        
        {/* Timeframe Toggle for Executive Summary */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xs text-blue-700 font-medium">View:</span>
          <div className="flex bg-white border border-blue-200 rounded-md p-1">
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                timeframe === 'monthly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeframe('quarterly')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                timeframe === 'quarterly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              Quarterly
            </button>
          </div>
        </div>
        
        {/* Monthly Executive Summary */}
        {timeframe === 'monthly' && (
          <div className="space-y-4">
            <div className="mb-4">
              <p className="text-xs text-blue-800 leading-relaxed break-words max-w-full">
                <span className="font-medium">Monthly Forecast Changes:</span> Our rolling forecast has been updated based on 
                recent performance data showing <span className="font-medium text-red-600">-3.2% variance vs previous plan</span>. 
                Key changes include extended sales cycles in Q4 2025 and improved expansion rates in Q1 2026.
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-xs font-medium text-blue-900 mb-2">Key Changes vs Previous Plan</h3>
              <div className="space-y-2">
                <p className="text-xs text-blue-800 leading-relaxed break-words">
                  <span className="font-medium">Revenue:</span> <span className="text-red-600">-0.7%</span> due to lower 
                  new customer acquisition in Dec-25 (-15% vs plan) and improved expansion ARR in Jan-26 (+12% vs plan).
                </p>
                <p className="text-xs text-blue-800 leading-relaxed break-words">
                  <span className="font-medium">COGS:</span> <span className="text-red-600">-1.6%</span> driven by 
                  infrastructure cost optimization and vendor renegotiations completed in Nov-25.
                </p>
                <p className="text-xs text-blue-800 leading-relaxed break-words">
                  <span className="font-medium">EBITDA:</span> <span className="text-green-600">+0.8%</span> improvement 
                  from cost savings and operational efficiency gains, partially offsetting revenue shortfall.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-medium text-blue-900 mb-2">Updated Assumptions</h3>
              <div className="space-y-2">
                <p className="text-xs text-blue-800 leading-relaxed break-words">
                  <span className="font-medium">Sales Performance:</span> Pipeline conversion rate adjusted from 30% to 25% 
                  based on Q4 2025 actuals. New customer ARR assumption increased from $180K to $200K based on recent wins.
                </p>
                <p className="text-xs text-blue-800 leading-relaxed break-words">
                  <span className="font-medium">Expansion Rate:</span> NDR assumption increased from 12% to 15% based on 
                  Q1 2026 customer success initiatives and product feature adoption.
                </p>
                <p className="text-xs text-blue-800 leading-relaxed break-words">
                  <span className="font-medium">Cost Structure:</span> Infrastructure costs reduced by 8% due to cloud 
                  optimization and vendor consolidation completed in Q4 2025.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Quarterly Executive Summary */}
        {timeframe === 'quarterly' && (
          <div className="space-y-4">
            <div className="mb-4">
              <p className="text-xs text-blue-800 leading-relaxed break-words">
                <span className="font-medium">Quarterly Forecast Changes:</span> Our rolling forecast has been updated based on 
                recent performance data showing <span className="font-medium text-red-600">-2.8% variance vs previous plan</span>. 
                Key changes include improved Q1 2026 expansion rates and Q4 2025 cost optimization initiatives.
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-xs font-medium text-blue-900 mb-2">Key Changes vs Previous Plan</h3>
              <div className="space-y-2">
                <p className="text-xs text-blue-800 leading-relaxed break-words">
                  <span className="font-medium">Q4 2025:</span> <span className="text-red-600">-4.2%</span> revenue 
                  due to extended sales cycles and lower new customer acquisition, partially offset by +2.1% cost savings.
                </p>
                <p className="text-xs text-blue-800 leading-relaxed break-words">
                  <span className="font-medium">Q1 2026:</span> <span className="text-green-600">+1.8%</span> revenue 
                  improvement from successful expansion initiatives and improved customer retention.
                </p>
                <p className="text-xs text-blue-800 leading-relaxed break-words">
                  <span className="font-medium">Q2-Q3 2026:</span> <span className="text-green-600">+0.5%</span> 
                  cumulative improvement from operational efficiency gains and market expansion.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-medium text-blue-900 mb-2">Updated Assumptions</h3>
              <div className="space-y-2">
                <p className="text-xs text-blue-800 leading-relaxed break-words">
                  <span className="font-medium">Market Dynamics:</span> Q4 2025 sales cycle extension from 45 to 60 days 
                  due to budget approval delays. Q1 2026 recovery expected with improved pipeline quality.
                </p>
                <p className="text-xs text-blue-800 leading-relaxed break-words">
                  <span className="font-medium">Operational Improvements:</span> Q4 2025 cost optimization initiatives 
                  delivering $2.1M annualized savings. Q1 2026 expansion rate improvement from customer success programs.
                </p>
                <p className="text-xs text-blue-800 leading-relaxed break-words">
                  <span className="font-medium">Risk Mitigation:</span> Customer churn assumptions adjusted from 8% to 6% 
                  annually based on improved customer success metrics and product engagement.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Full Width Table */}
      <div className="w-full">
        <Card>
          <CardHeader className="px-4">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center gap-2">
                <span>Forecast Grid</span>
                <Badge variant="outline" className="text-xs">
                  {activeScenario === 'base' ? 'Base Case' : activeScenario === 'best' ? 'Best Case' : 'Worst Case'}
                </Badge>
              </div>
            </CardTitle>
            {/* Timeframe Toggle */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-sm text-gray-600">Timeframe:</span>
              <div className="flex bg-white border border-gray-200 rounded-md p-1">
                <button
                  onClick={() => setTimeframe('monthly')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    timeframe === 'monthly'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setTimeframe('quarterly')}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    timeframe === 'monthly'
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      : 'bg-blue-600 text-white shadow-sm'
                  }`}
                >
                  Quarterly
                </button>
              </div>
            </div>
            
            {/* Edit Controls */}
            <div className="flex items-center mt-2">
              {!isEditMode ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditMode(true)}
                  className="text-xs h-7 px-2"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              ) : (
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancelEdit}
                    className="text-xs h-7 px-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCreateNewScenario}
                    className="text-xs h-7 px-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Save as Scenario
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto w-full">
              <div className="min-w-[1200px] w-full">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[300px] min-w-[300px] text-sm">P&L Line</TableHead>
                      {getColumnHeaders().map((header, index) => (
                        <TableHead key={index} className="text-center min-w-[100px] text-xs">
                          {header}
                        </TableHead>
                      ))}
                      <TableHead className="text-center min-w-[100px] text-sm font-semibold">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Mock P&L lines - in real app this would come from data */}
                    {/* Revenue Section */}
                    <TableRow>
                      <TableCell className="font-normal text-gray-600 text-xs">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleExpanded('revenue')}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            {expandedLines.has('revenue') ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </button>
                          <span>Revenue</span>
                        </div>
                      </TableCell>
                      {Array.from({ length: getColumnCount() }, (_, i) => {
                        const monthlyValue = 30.2 + i * 0.6;
                        const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(30.2, i, 0.6);
                        const bgColor = timeframe === 'monthly' 
                          ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                          : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                        
                        return (
                          <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                            {formatCurrency(value)}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                        {formatCurrency(362.4)}
                      </TableCell>
                    </TableRow>

                  {/* Subscription Revenue (expandable) */}
                  {expandedLines.has('revenue') && (
                    <>
                      <TableRow>
                        <TableCell className="pl-8 font-normal text-gray-600 text-xs">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleExpanded('subscription_revenue')}
                              className="p-1 hover:bg-blue-100 rounded"
                            >
                              {expandedLines.has('subscription_revenue') ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </button>
                            <span>Subscription Revenue</span>
                          </div>
                        </TableCell>
                        {Array.from({ length: getColumnCount() }, (_, i) => {
                          const monthlyValue = 25.2 + i * 0.5;
                          const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(25.2, i, 0.5);
                          const bgColor = timeframe === 'monthly' 
                            ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                            : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                          
                          return (
                            <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                              {formatCurrency(value)}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                          {formatCurrency(302.4)}
                        </TableCell>
                      </TableRow>

                      {/* New ARR (expandable) */}
                      <TableRow>
                        <TableCell className="pl-16 font-normal text-gray-600 text-xs">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleExpanded('new_arr')}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              {expandedLines.has('new_arr') ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </button>
                            <span>New ARR</span>
                          </div>
                        </TableCell>
                        {Array.from({ length: getColumnCount() }, (_, i) => {
                          // New ARR = # of new customers × ARR per customer
                          const newCustomers = 25 + i * 2; // Growing new customer base
                          const arrPerCustomer = 0.2; // $200K ARR per customer
                          const monthlyValue = newCustomers * arrPerCustomer;
                          const value = timeframe === 'monthly' ? monthlyValue : monthlyValue * 3; // Simple quarterly aggregation
                          const bgColor = timeframe === 'monthly' 
                            ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                            : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                          
                          return (
                            <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                              {formatCurrency(value)}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                          {formatCurrency(62.4)}
                        </TableCell>
                      </TableRow>

                      {/* New ARR Driver Inputs (expandable) */}
                      {expandedLines.has('new_arr') && (
                        <>
                          <TableRow>
                                                      <TableCell className="pl-24 font-normal text-gray-600 text-xs">
                            <span>New Customers</span>
                          </TableCell>
                            {Array.from({ length: getColumnCount() }, (_, i) => {
                              const bgColor = timeframe === 'monthly' 
                                ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                                : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                              const isPastMonth = timeframe === 'monthly' ? i < 4 : i < 1;
                              const value = 25 + i * 2;
                              
                              return (
                                <TableCell key={i} className={`text-center ${bgColor}`}>
                                  {isPastMonth ? (
                                    <span className="text-xs font-medium">
                                      {value}
                                    </span>
                                  ) : isEditMode ? (
                                    <Input
                                      type="number"
                                      value={editableCells.get(`new_customers_${i}`) || value}
                                      onChange={(e) => handleCellEdit('new_customers', i, parseFloat(e.target.value) || 0)}
                                      className="w-16 text-center text-[11px] h-7"
                                    />
                                  ) : (
                                    <span className="text-xs font-medium">
                                      {value}
                                    </span>
                                  )}
                                </TableCell>
                              );
                            })}
                            <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                              {25 + 2 * getColumnCount()}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                                                      <TableCell className="pl-24 font-normal text-gray-600 text-xs">
                            <span>ARR per Customer ($M)</span>
                          </TableCell>
                            {Array.from({ length: getColumnCount() }, (_, i) => {
                              const bgColor = timeframe === 'monthly' 
                                ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                                : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                              const isPastMonth = timeframe === 'monthly' ? i < 4 : i < 1;
                              const value = 0.2;
                              
                              return (
                                <TableCell key={i} className={`text-center ${bgColor}`}>
                                  {isPastMonth ? (
                                    <span className="text-xs font-medium">
                                      {value}
                                    </span>
                                  ) : isEditMode ? (
                                    <Input
                                      type="number"
                                      value={editableCells.get(`arr_per_customer_${i}`) || value}
                                      onChange={(e) => handleCellEdit('arr_per_customer', i, parseFloat(e.target.value) || 0)}
                                      className="w-16 text-center text-[11px] h-7"
                                    />
                                  ) : (
                                    <span className="text-xs font-medium">
                                      {value}
                                    </span>
                                  )}
                                </TableCell>
                              );
                            })}
                            <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                              {0.2}
                            </TableCell>
                          </TableRow>
                        </>
                      )}

                      {/* Expansion ARR (expandable) */}
                      <TableRow>
                        <TableCell className="pl-16 font-normal text-gray-600 text-xs">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleExpanded('expansion_arr')}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              {expandedLines.has('expansion_arr') ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </button>
                            <span>Expansion ARR</span>
                          </div>
                        </TableCell>
                        {Array.from({ length: getColumnCount() }, (_, i) => {
                          // Expansion ARR = NDR% × Existing Revenue
                          const ndrPercentage = 0.15; // 15% Net Dollar Retention
                          const existingRevenue = 120 + i * 5; // Growing existing revenue base
                          const monthlyValue = existingRevenue * ndrPercentage;
                          const value = timeframe === 'monthly' ? monthlyValue : monthlyValue * 3; // Simple quarterly aggregation
                          const bgColor = timeframe === 'monthly' 
                            ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                            : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                          
                          return (
                            <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                              {formatCurrency(value)}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                          {formatCurrency(218.4)}
                        </TableCell>
                      </TableRow>

                      {/* Expansion ARR Driver Inputs (expandable) */}
                      {expandedLines.has('expansion_arr') && (
                        <>
                          <TableRow>
                            <TableCell className="pl-24 font-normal text-gray-600 text-xs">
                              <span>NDR %</span>
                            </TableCell>
                            {Array.from({ length: getColumnCount() }, (_, i) => {
                              const bgColor = timeframe === 'monthly' 
                                ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                                : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                              const isPastMonth = timeframe === 'monthly' ? i < 4 : i < 1;
                              const value = 0.15;
                              
                              return (
                                <TableCell key={i} className={`text-center ${bgColor}`}>
                                  {isPastMonth ? (
                                    <span className="text-xs font-medium">
                                      {(value * 100).toFixed(1)}%
                                    </span>
                                  ) : isEditMode ? (
                                    <Input
                                      type="number"
                                      value={editableCells.get(`ndr_percentage_${i}`) || value}
                                      onChange={(e) => handleCellEdit('ndr_percentage', i, parseFloat(e.target.value) || 0)}
                                      className="w-16 text-center text-[11px] h-7"
                                    />
                                  ) : (
                                    <span className="text-xs font-medium">
                                      {(value * 100).toFixed(1)}%
                                    </span>
                                  )}
                                </TableCell>
                              );
                            })}
                            <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                              15.0%
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell className="pl-24 font-normal text-gray-600 text-xs">
                              <span>Existing Revenue ($M)</span>
                            </TableCell>
                            {Array.from({ length: getColumnCount() }, (_, i) => {
                              const bgColor = timeframe === 'monthly' 
                                ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                                : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                              const isPastMonth = timeframe === 'monthly' ? i < 4 : i < 1;
                              const value = 120 + i * 5;
                              
                              return (
                                <TableCell key={i} className={`text-center ${bgColor}`}>
                                  {isPastMonth ? (
                                    <span className="text-xs font-medium">
                                      {formatCurrency(value)}
                                    </span>
                                  ) : isEditMode ? (
                                    <Input
                                      type="number"
                                      value={editableCells.get(`existing_revenue_${i}`) || value}
                                      onChange={(e) => handleCellEdit('existing_revenue', i, parseFloat(e.target.value) || 0)}
                                      className="w-16 text-center text-[11px] h-7"
                                    />
                                  ) : (
                                    <span className="text-xs font-medium">
                                      {formatCurrency(value)}
                                    </span>
                                  )}
                                </TableCell>
                              );
                            })}
                            <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                              {formatCurrency(120 + 5 * getColumnCount())}
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                    </>
                  )}

                  {/* COGS Section */}
                  <TableRow>
                    <TableCell className="font-normal text-gray-600 text-xs">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleExpanded('cogs')}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {expandedLines.has('cogs') ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </button>
                        <span>Cost of Goods Sold</span>
                      </div>
                    </TableCell>
                    {Array.from({ length: getColumnCount() }, (_, i) => {
                      const monthlyValue = 6.1 + i * 0.1;
                      const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(6.1, i, 0.1);
                      const bgColor = timeframe === 'monthly' 
                        ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                        : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                      
                      return (
                        <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                          {formatCurrency(value)}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                      {formatCurrency(73.2)}
                    </TableCell>
                  </TableRow>

                  {/* COGS Breakdown (expandable) */}
                  {expandedLines.has('cogs') && (
                    <>
                      <TableRow>
                        <TableCell className="pl-8 font-normal text-gray-600 text-xs">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleExpanded('infrastructure_costs')}
                              className="p-1 hover:bg-blue-100 rounded"
                            >
                              {expandedLines.has('infrastructure_costs') ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </button>
                            <span>Infrastructure Costs</span>
                          </div>
                        </TableCell>
                        {Array.from({ length: getColumnCount() }, (_, i) => {
                          const monthlyValue = 3.2 + i * 0.05;
                          const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(3.2, i, 0.05);
                          const bgColor = timeframe === 'monthly' 
                            ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                            : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                          
                          return (
                            <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                              {formatCurrency(value)}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                          {formatCurrency(38.4)}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="pl-8 font-normal text-gray-600 text-xs">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleExpanded('support_costs')}
                              className="p-1 hover:bg-blue-100 rounded"
                            >
                              {expandedLines.has('support_costs') ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </button>
                            <span>Support & Customer Success</span>
                          </div>
                        </TableCell>
                        {Array.from({ length: getColumnCount() }, (_, i) => {
                          const monthlyValue = 1.8 + i * 0.03;
                          const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(1.8, i, 0.03);
                          const bgColor = timeframe === 'monthly' 
                            ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                            : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                          
                          return (
                            <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                              {formatCurrency(value)}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                          {formatCurrency(21.6)}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="pl-8 font-normal text-gray-600 text-xs">
                          <span>Third-party Services</span>
                        </TableCell>
                        {Array.from({ length: getColumnCount() }, (_, i) => {
                          const monthlyValue = 1.1 + i * 0.02;
                          const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(1.1, i, 0.02);
                          const bgColor = timeframe === 'monthly' 
                            ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                            : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                          
                          return (
                            <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                              {formatCurrency(value)}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                          {formatCurrency(13.2)}
                        </TableCell>
                      </TableRow>
                    </>
                  )}

                  {/* Gross Profit */}
                  <TableRow>
                    <TableCell className="font-semibold text-gray-700 text-xs">Gross Profit</TableCell>
                    {Array.from({ length: getColumnCount() }, (_, i) => {
                      const monthlyValue = 24.1 + i * 0.5;
                      const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(24.1, i, 0.5);
                      const bgColor = timeframe === 'monthly' 
                        ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                        : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                      
                      return (
                        <TableCell key={i} className={`text-center font-semibold text-xs ${bgColor}`}>
                          {formatCurrency(value)}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                      {formatCurrency(289.2)}
                    </TableCell>
                  </TableRow>

                  {/* Operating Expenses Section */}
                  <TableRow>
                    <TableCell className="font-normal text-gray-600 text-xs">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleExpanded('operating_expenses')}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {expandedLines.has('operating_expenses') ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </button>
                        <span>Operating Expenses</span>
                      </div>
                    </TableCell>
                    {Array.from({ length: getColumnCount() }, (_, i) => {
                      const monthlyValue = 12.2 + i * 0.2;
                      const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(12.2, i, 0.2);
                      const bgColor = timeframe === 'monthly' 
                        ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                        : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                      
                      return (
                        <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                          {formatCurrency(value)}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                      {formatCurrency(146.4)}
                    </TableCell>
                  </TableRow>

                  {/* Operating Expenses Breakdown (expandable) */}
                  {expandedLines.has('operating_expenses') && (
                    <>
                      <TableRow>
                        <TableCell className="pl-8 font-normal text-gray-600 text-xs">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleExpanded('sales_marketing')}
                              className="p-1 hover:bg-blue-100 rounded"
                            >
                              {expandedLines.has('sales_marketing') ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </button>
                            <span>Sales & Marketing</span>
                          </div>
                        </TableCell>
                        {Array.from({ length: getColumnCount() }, (_, i) => {
                          const monthlyValue = 5.8 + i * 0.1;
                          const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(5.8, i, 0.1);
                          const bgColor = timeframe === 'monthly' 
                            ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                            : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                          
                          return (
                            <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                              {formatCurrency(value)}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                          {formatCurrency(69.6)}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="pl-8 font-normal text-gray-600 text-xs">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleExpanded('rd')}
                              className="p-1 hover:bg-blue-100 rounded"
                            >
                              {expandedLines.has('rd') ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </button>
                            <span>Research & Development</span>
                          </div>
                        </TableCell>
                        {Array.from({ length: getColumnCount() }, (_, i) => {
                          const monthlyValue = 4.2 + i * 0.08;
                          const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(4.2, i, 0.08);
                          const bgColor = timeframe === 'monthly' 
                            ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                            : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                          
                          return (
                            <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                              {formatCurrency(value)}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                          {formatCurrency(50.4)}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="pl-8 font-normal text-gray-600 text-xs">
                          <span>General & Administrative</span>
                        </TableCell>
                        {Array.from({ length: getColumnCount() }, (_, i) => {
                          const monthlyValue = 2.2 + i * 0.02;
                          const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(2.2, i, 0.02);
                          const bgColor = timeframe === 'monthly' 
                            ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                            : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                          
                          return (
                            <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                              {formatCurrency(value)}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                          {formatCurrency(26.4)}
                        </TableCell>
                      </TableRow>
                    </>
                  )}

                  {/* Operating Income */}
                  <TableRow>
                    <TableCell className="font-semibold text-gray-700 text-xs">Operating Income</TableCell>
                    {Array.from({ length: getColumnCount() }, (_, i) => {
                      const monthlyValue = 11.9 + i * 0.3;
                      const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(11.9, i, 0.3);
                      const bgColor = timeframe === 'monthly' 
                        ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                        : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                      
                      return (
                        <TableCell key={i} className={`text-center font-semibold text-xs ${bgColor}`}>
                          {formatCurrency(value)}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                      {formatCurrency(142.8)}
                    </TableCell>
                  </TableRow>

                  {/* Other Income/Expenses */}
                  <TableRow>
                    <TableCell className="font-normal text-gray-600 text-xs">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleExpanded('other_items')}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {expandedLines.has('other_items') ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </button>
                        <span>Other Income/(Expenses)</span>
                      </div>
                    </TableCell>
                    {Array.from({ length: getColumnCount() }, (_, i) => {
                      const monthlyValue = -0.3 + i * 0.01;
                      const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(-0.3, i, 0.01);
                      const bgColor = timeframe === 'monthly' 
                        ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                        : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                      
                      return (
                        <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                          {formatCurrency(value)}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                      {formatCurrency(-2.4)}
                    </TableCell>
                  </TableRow>

                  {/* Other Items Breakdown (expandable) */}
                  {expandedLines.has('other_items') && (
                    <>
                      <TableRow>
                        <TableCell className="pl-8 font-normal text-gray-600 text-xs">
                          <span>Interest Income</span>
                        </TableCell>
                        {Array.from({ length: getColumnCount() }, (_, i) => {
                          const monthlyValue = 0.1 + i * 0.005;
                          const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(0.1, i, 0.005);
                          const bgColor = timeframe === 'monthly' 
                            ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                            : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                          
                          return (
                            <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                              {formatCurrency(value)}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                          {formatCurrency(1.2)}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="pl-8 font-normal text-gray-600 text-xs">
                          <span>Interest Expense</span>
                        </TableCell>
                        {Array.from({ length: getColumnCount() }, (_, i) => {
                          const monthlyValue = -0.4 + i * -0.005;
                          const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(-0.4, i, -0.005);
                          const bgColor = timeframe === 'monthly' 
                            ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                            : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                          
                          return (
                            <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                              {formatCurrency(value)}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                          {formatCurrency(-3.6)}
                        </TableCell>
                      </TableRow>
                    </>
                  )}

                  {/* EBITDA */}
                  <TableRow>
                    <TableCell className="font-semibold text-gray-700 text-xs">EBITDA</TableCell>
                    {Array.from({ length: getColumnCount() }, (_, i) => {
                      const monthlyValue = 11.9 + i * 0.3;
                      const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(11.9, i, 0.3);
                      const bgColor = timeframe === 'monthly' 
                        ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                        : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                      
                      return (
                        <TableCell key={i} className={`text-center font-semibold text-xs ${bgColor}`}>
                          {formatCurrency(value)}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                      {formatCurrency(142.8)}
                    </TableCell>
                  </TableRow>

                  {/* Depreciation & Amortization */}
                  <TableRow>
                    <TableCell className="font-normal text-gray-600 text-xs">Depreciation & Amortization</TableCell>
                    {Array.from({ length: getColumnCount() }, (_, i) => {
                      const monthlyValue = 0.8 + i * 0.02;
                      const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(0.8, i, 0.02);
                      const bgColor = timeframe === 'monthly' 
                        ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                        : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                      
                      return (
                        <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                          {formatCurrency(value)}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                      {formatCurrency(9.6)}
                    </TableCell>
                  </TableRow>

                  {/* Net Income */}
                  <TableRow>
                    <TableCell className="font-semibold text-black text-xs">Net Income</TableCell>
                    {Array.from({ length: getColumnCount() }, (_, i) => {
                      const monthlyValue = 10.9 + i * 0.3;
                      const value = timeframe === 'monthly' ? monthlyValue : getQuarterlyValue(10.9, i, 0.3);
                      const bgColor = timeframe === 'monthly' 
                        ? (i < 4 ? 'bg-green-50' : i === 4 ? 'bg-blue-50' : 'bg-orange-50')
                        : (i < 1 ? 'bg-green-50' : i === 1 ? 'bg-blue-50' : 'bg-orange-50');
                      
                      return (
                        <TableCell key={i} className={`text-center font-medium text-xs ${bgColor}`}>
                          {formatCurrency(value)}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center bg-gray-100 font-semibold text-sm">
                      {formatCurrency(130.8)}
                    </TableCell>
                  </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
