export interface BudgetVersion {
  id: string;
  name: string;
  type: 'budget' | 'forecast' | 'reforecast' | 'rolling';
  fiscalYear: string;
  lastUpdated: string;
}

export interface Entity {
  id: string;
  name: string;
  code: string;
  region: 'Global' | 'US' | 'EMEA' | 'APAC';
}

export interface KPI {
  name: string;
  plan: number;
  actual: number;
  variance: number;
  variancePercent: number;
  trend: 'up' | 'down' | 'stable';
  currency: string;
}

export interface PnLLine {
  key: string;
  name: string;
  section: 'Revenue' | 'COGS' | 'Gross Profit' | 'Operating Expenses' | 'Operating Income' | 'Other Income/Expense' | 'Net Income';
  subsection?: string; // For grouping within sections (e.g., 'Subscription Revenue', 'Professional Services')
  plan: number;
  actual: number;
  variance: number;
  variancePercent: number;
  driver?: string;
  unit: 'USD' | '%';
  hasDrilldown: boolean;
  drilldownData?: DrilldownData;
  isCalculated?: boolean;
  calculation?: string;
  // New fields for enhanced P&L
  kpiMetrics?: KPIMetrics;
  trend?: 'up' | 'down' | 'stable';
  priority?: 'high' | 'medium' | 'low';
  category?: string; // For grouping similar items
  parentLine?: string; // For hierarchical relationships
}

export interface KPIMetrics {
  arr?: number;
  arpu?: number;
  churnRate?: number;
  customerCount?: number;
  utilization?: number;
  headcount?: number;
  costPerUser?: number;
  margin?: number;
  contributionMargin?: number;
  recurringRevenueCoverage?: number;
  officeCost?: number;
  itCost?: number;
  miscCost?: number;
  // Additional metrics for enhanced P&L
  expansionRate?: number;
  blendedRate?: number;
  rate?: number;
  sessions?: number;
  participants?: number;
  marketplaceRevenue?: number;
  partnershipRevenue?: number;
  activeUsers?: number;
  targetCostPerUser?: number;
  computeCost?: number;
  storageCost?: number;
  bandwidthCost?: number;
  seats?: number;
  costPerSeat?: number;
  dataTransfer?: number;
  analyticsCost?: number;
  ticketsPerCustomer?: number;
  costPerTicket?: number;
  targetCostPerTicket?: number;
  costPerHead?: number;
  hours?: number;
  targetMargin?: number;
  targetContributionMargin?: number;
  variableOpEx?: number;
  targetCoverage?: number;
  cac?: number;
  pipelineCoverage?: number;
  adSpend?: number;
  events?: number;
  content?: number;
  commissionRate?: number;
  revenue?: number;
  operatingMargin?: number;
  netMargin?: number;
}

export interface DrilldownData {
  total: number;
  sources: DataSource[];
  explanation: string;
  assumptions: Assumption[];
  actions: Action[];
}

export interface DataSource {
  id: string;
  name: string;
  amount: number;
  type: 'invoice' | 'payroll' | 'expense' | 'contract' | 'estimate' | 'calculation';
  confidence: number;
  lastSync: string;
      source: 'QBO' | 'Xero' | 'Rippling' | 'Pigment' | 'Anaplan' | 'hubspot' | 'manual';
}

export interface Assumption {
  id: string;
  description: string;
  confidence: number;
  source: string;
  lastUpdated: string;
}

export interface Action {
  id: string;
  type: 'slack' | 'sync' | 'review' | 'flag';
  label: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ForecastDriver {
  key: string;
  name: string;
  value: number;
  unit: string;
  category: 'bookings' | 'churn' | 'headcount' | 'efficiency' | 'market' | 'financial';
  impact: 'positive' | 'negative' | 'neutral';
  editable: boolean;
  description: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
}

export interface DriverInputs {
  bookings_growth_pct: number;
  churn_pct: number;
  arpu_usd: number;
  headcount_rnd: number;
  headcount_sales: number;
  headcount_support: number;
  avg_salary_rnd: number;
  avg_salary_sales: number;
  cac_per_customer: number;
  hosting_cost_per_user: number;
  cash_balance: number;
  debt_outstanding: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  relatedLine?: string;
}

export interface IntegrationHealth {
  system: string;
  status: 'healthy' | 'warning' | 'error';
  lastSync: string;
  syncFrequency: string;
  issues: string[];
}

// New types for Rolling Forecast
export interface ForecastScenario {
  id: string;
  name: string;
  description: string;
  isBase: boolean;
  createdAt: string;
  lastModified: string;
}

export interface MonthlyForecastData {
  month: string;
  value: number;
  plan: number;
  variance: number;
  variancePercent: number;
  previousForecast: number;
  previousVariance: number;
  previousVariancePercent: number;
}

export interface PnLForecastLine {
  key: string;
  name: string;
  section: 'Revenue' | 'COGS' | 'Gross Profit' | 'Operating Expenses' | 'Operating Income' | 'Other Income/Expense' | 'Net Income';
  subsection?: string;
  category?: string;
  parentLine?: string;
  isCalculated: boolean;
  calculation?: string;
  isExpanded: boolean;
  hasDrivers: boolean;
  monthlyData: MonthlyForecastData[];
  total: MonthlyForecastData;
  drivers?: ForecastDriver[];
}

export interface RollingForecastData {
  scenarios: ForecastScenario[];
  activeScenario: string;
  timeHorizon: '12M' | '18M' | '24M';
  pnlLines: PnLForecastLine[];
  lastUpdated: string;
}
