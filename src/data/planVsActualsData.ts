import { 
  BudgetVersion, 
  Entity, 
  KPI, 
  PnLLine, 
  ForecastDriver, 
  IntegrationHealth,
  DriverInputs,
  ForecastScenario,
  PnLForecastLine,
  MonthlyForecastData,
  RollingForecastData
} from '@/types/planVsActuals';

export const mockBudgetVersions: BudgetVersion[] = [
  {
    id: '1',
    name: 'Budget FY25',
    type: 'budget',
    fiscalYear: '2025',
    lastUpdated: '2024-12-15'
  },
  {
    id: '2',
    name: 'Reforecast Q1',
    type: 'reforecast',
    fiscalYear: '2025',
    lastUpdated: '2025-01-15'
  },
  {
    id: '3',
    name: 'Rolling Forecast',
    type: 'rolling',
    fiscalYear: '2025',
    lastUpdated: '2025-01-20'
  }
];

export const mockEntities: Entity[] = [
  {
    id: '1',
    name: 'Global',
    code: 'GLB',
    region: 'Global'
  },
  {
    id: '2',
    name: 'United States',
    code: 'US',
    region: 'US'
  },
  {
    id: '3',
    name: 'Europe, Middle East & Africa',
    code: 'EMEA',
    region: 'EMEA'
  },
  {
    id: '4',
    name: 'Asia Pacific',
    code: 'APAC',
    region: 'APAC'
  }
];

export const mockKPIs: KPI[] = [
  {
    name: 'ARR',
    plan: 30000000,
    actual: 29800000,
    variance: -200000,
    variancePercent: -0.7,
    trend: 'down',
    currency: 'USD'
  },
  {
    name: 'Revenue',
    plan: 30200000,
    actual: 29350000,
    variance: -850000,
    variancePercent: -2.8,
    trend: 'down',
    currency: 'USD'
  },
  {
    name: 'Gross Margin',
    plan: 85,
    actual: 82,
    variance: -3,
    variancePercent: -3.5,
    trend: 'down',
    currency: '%'
  },
  {
    name: 'EBITDA',
    plan: 11300000,
    actual: 9300000,
    variance: -2000000,
    variancePercent: -17.7,
    trend: 'down',
    currency: 'USD'
  },
  {
    name: 'Net Income',
    plan: 11400000,
    actual: 9340000,
    variance: -2060000,
    variancePercent: -18.1,
    trend: 'down',
    currency: 'USD'
  }
];

export const mockPnLLines: PnLLine[] = [
  // --- REVENUE (Expanded & Driver-Based) ---
  {
    key: 'subscription_revenue_total',
    name: 'Subscription Revenue',
    section: 'Revenue',
    subsection: 'Recurring',
    plan: 28000000,
    actual: 27200000,
    variance: -800000,
    variancePercent: -2.9,
    driver: 'ARR × (1 - churn)',
    unit: 'USD',
    hasDrilldown: true,
    trend: 'down',
    priority: 'high',
    kpiMetrics: {
      arr: 27200000,
      arpu: 850,
      churnRate: 0.08,
      customerCount: 32000
    },
    drilldownData: {
      total: 27200000,
      sources: [
        { id: '1', name: 'Enterprise SaaS', amount: 20000000, type: 'contract', confidence: 95, lastSync: '2025-01-20T10:30:00Z', source: 'hubspot' },
        { id: '2', name: 'Mid-Market SaaS', amount: 6000000, type: 'contract', confidence: 90, lastSync: '2025-01-20T10:30:00Z', source: 'hubspot' },
        { id: '3', name: 'Q1 New Bookings', amount: 1200000, type: 'estimate', confidence: 70, lastSync: '2025-01-20T10:30:00Z', source: 'hubspot' }
      ],
      explanation: 'Subscription revenue shortfall driven by: -$0.5M new ARR, -$0.3M churn. Pipeline conversion at 25% vs 30% plan.',
      assumptions: [
        { id: '1', description: 'Q1 new business conversion rate estimated at 25% vs 30% plan', confidence: 70, source: 'Sales pipeline analysis', lastUpdated: '2025-01-20' }
      ],
      actions: [
        { id: '1', type: 'slack', label: 'Slack Sales Team', description: 'Get update on Q1 pipeline conversion', priority: 'high' },
        { id: '2', type: 'review', label: 'Flag for Review', description: 'Review Q1 forecast assumptions', priority: 'medium' }
      ]
    }
  },
  {
    key: 'new_arr',
    name: '  New ARR',
    section: 'Revenue',
    subsection: 'Recurring',
    plan: 8000000,
    actual: 7500000,
    variance: -500000,
    variancePercent: -6.3,
    driver: 'New customers × ARPU',
    unit: 'USD',
    hasDrilldown: true,
    trend: 'down',
    priority: 'high',
    parentLine: 'subscription_revenue_total',
    kpiMetrics: {
      customerCount: 8824,
      arpu: 850
    },
    drilldownData: {
      total: 7500000,
      sources: [
        { id: '1', name: 'Enterprise New Business', amount: 4500000, type: 'contract', confidence: 95, lastSync: '2025-01-20T10:30:00Z', source: 'hubspot' },
        { id: '2', name: 'Mid-Market New Business', amount: 2500000, type: 'contract', confidence: 90, lastSync: '2025-01-20T10:30:00Z', source: 'hubspot' },
        { id: '3', name: 'SMB New Business', amount: 500000, type: 'contract', confidence: 85, lastSync: '2025-01-20T10:30:00Z', source: 'hubspot' }
      ],
      explanation: '',
      assumptions: [
        { id: '1', description: 'Q1 pipeline conversion rate at 25% vs 30% plan due to extended sales cycles', confidence: 80, source: 'Sales pipeline analysis', lastUpdated: '2025-01-20' },
        { id: '2', description: 'Enterprise deal cycle extended by 15-20 days due to increased approval requirements', confidence: 85, source: 'Sales team feedback', lastUpdated: '2025-01-19' }
      ],
      actions: [
        { id: '1', type: 'slack', label: 'Slack Sales Team', description: 'Review pipeline conversion strategies', priority: 'high' },
        { id: '2', type: 'review', label: 'Flag for Review', description: 'Analyze enterprise sales cycle bottlenecks', priority: 'high' }
      ]
    }
  },
  {
    key: 'expansion_arr',
    name: '  Expansion ARR',
    section: 'Revenue',
    subsection: 'Recurring',
    plan: 4000000,
    actual: 4200000,
    variance: 200000,
    variancePercent: 5.0,
    driver: 'Existing customers × expansion rate',
    unit: 'USD',
    hasDrilldown: true,
    trend: 'up',
    priority: 'medium',
    parentLine: 'subscription_revenue_total',
    kpiMetrics: {
      customerCount: 23176,
      expansionRate: 0.18
    },
    drilldownData: {
      total: 4200000,
      sources: [
        { id: '1', name: 'Enterprise Upgrades', amount: 2800000, type: 'contract', confidence: 95, lastSync: '2025-01-20T10:30:00Z', source: 'hubspot' },
        { id: '2', name: 'Feature Add-ons', amount: 900000, type: 'contract', confidence: 90, lastSync: '2025-01-20T10:30:00Z', source: 'hubspot' },
        { id: '3', name: 'Seat Expansion', amount: 500000, type: 'contract', confidence: 85, lastSync: '2025-01-20T10:30:00Z', source: 'hubspot' }
      ],
      explanation: 'Expansion ARR above plan due to strong enterprise upgrade cycle and successful feature adoption. 18% expansion rate vs 15% plan.',
      assumptions: [
        { id: '1', description: 'Enterprise customers upgrading to premium tiers at higher than expected rate', confidence: 90, source: 'Customer success data', lastUpdated: '2025-01-20' },
        { id: '2', description: 'New feature releases driving increased adoption and upsell opportunities', confidence: 85, source: 'Product analytics', lastUpdated: '2025-01-19' }
      ],
      actions: [
        { id: '1', type: 'slack', label: 'Slack Customer Success', description: 'Share expansion best practices across team', priority: 'medium' },
        { id: '2', type: 'review', label: 'Flag for Review', description: 'Analyze successful expansion patterns', priority: 'low' }
      ]
    }
  },
  {
    key: 'churned_arr',
    name: '  Churned ARR',
    section: 'Revenue',
    subsection: 'Recurring',
    plan: -2000000,
    actual: -2300000,
    variance: -300000,
    variancePercent: -15.0,
    driver: 'ARR × churn rate',
    unit: 'USD',
    hasDrilldown: true,
    trend: 'down',
    priority: 'high',
    parentLine: 'subscription_revenue_total',
    kpiMetrics: {
      churnRate: 0.08,
      customerCount: 2560
    },
    drilldownData: {
      total: -2300000,
      sources: [
        { id: '1', name: 'Mid-Market Churn', amount: -1400000, type: 'contract', confidence: 95, lastSync: '2025-01-20T10:30:00Z', source: 'hubspot' },
        { id: '2', name: 'SMB Churn', amount: -600000, type: 'contract', confidence: 90, lastSync: '2025-01-20T10:30:00Z', source: 'hubspot' },
        { id: '3', name: 'Enterprise Churn', amount: -300000, type: 'contract', confidence: 85, lastSync: '2025-01-20T10:30:00Z', source: 'hubspot' }
      ],
      explanation: '',
      assumptions: [
        { id: '1', description: 'Mid-market customers more sensitive to competitive offerings and pricing pressure', confidence: 85, source: 'Customer exit interviews', lastUpdated: '2025-01-20' },
        { id: '2', description: 'Economic uncertainty leading to delayed renewals and increased price sensitivity', confidence: 80, source: 'Market analysis', lastUpdated: '2025-01-19' }
      ],
      actions: [
        { id: '1', type: 'slack', label: 'Slack Customer Success', description: 'Implement retention strategies for at-risk accounts', priority: 'high' },
        { id: '2', type: 'review', label: 'Flag for Review', description: 'Review competitive positioning and pricing strategy', priority: 'high' }
      ]
    }
  },
  {
    key: 'professional_services',
    name: 'Professional Services',
    section: 'Revenue',
    subsection: 'Services',
    plan: 2000000,
    actual: 1900000,
    variance: -100000,
    variancePercent: -5.0,
    driver: 'Billable hours × blended rate',
    unit: 'USD',
    hasDrilldown: true,
    trend: 'down',
    priority: 'medium',
    kpiMetrics: {
      utilization: 0.75,
      headcount: 25,
      blendedRate: 150
    },
    drilldownData: {
      total: 1900000,
      sources: [
        { id: '4', name: 'Implementation Services', amount: 1200000, type: 'invoice', confidence: 90, lastSync: '2025-01-20T10:30:00Z', source: 'QBO' },
        { id: '5', name: 'Consulting Hours', amount: 500000, type: 'invoice', confidence: 85, lastSync: '2025-01-20T10:30:00Z', source: 'QBO' },
        { id: '6', name: 'Q1 PS Pipeline', amount: 200000, type: 'estimate', confidence: 60, lastSync: '2025-01-20T10:30:00Z', source: 'manual' }
      ],
      explanation: 'PS revenue below plan due to project delays and client postponements. Implementation projects taking 2-3 weeks longer than expected.',
      assumptions: [
        { id: '2', description: 'PS project completion timeline extended by 2-3 weeks', confidence: 75, source: 'PS team update', lastUpdated: '2025-01-19' }
      ],
      actions: [
        { id: '3', type: 'slack', label: 'Slack PS Team', description: 'Get update on project timelines', priority: 'medium' }
      ]
    }
  },
  {
    key: 'implementation_services',
    name: '    Implementation',
    section: 'Revenue',
    subsection: 'Services',
    plan: 1200000,
    actual: 1200000,
    variance: 0,
    variancePercent: 0.0,
    driver: 'Project hours × rate',
    unit: 'USD',
    hasDrilldown: false,
    trend: 'stable',
    parentLine: 'professional_services',
    kpiMetrics: {
      utilization: 0.80,
      headcount: 15,
      rate: 160
    }
  },
  {
    key: 'advisory_services',
    name: '    Advisory',
    section: 'Revenue',
    subsection: 'Services',
    plan: 500000,
    actual: 500000,
    variance: 0,
    variancePercent: 0.0,
    driver: 'Consulting hours × rate',
    unit: 'USD',
    hasDrilldown: false,
    trend: 'stable',
    parentLine: 'professional_services',
    kpiMetrics: {
      utilization: 0.70,
      headcount: 8,
      rate: 140
    }
  },
  {
    key: 'training_services',
    name: '    Training',
    section: 'Revenue',
    subsection: 'Services',
    plan: 300000,
    actual: 200000,
    variance: -100000,
    variancePercent: -33.3,
    driver: 'Training sessions × participants × rate',
    unit: 'USD',
    hasDrilldown: true,
    trend: 'down',
    parentLine: 'professional_services',
    kpiMetrics: {
      sessions: 40,
      participants: 800,
      rate: 250
    },
    drilldownData: {
      total: 200000,
      sources: [
        { id: '1', name: 'Customer Training', amount: 120000, type: 'invoice', confidence: 90, lastSync: '2025-01-20T10:30:00Z', source: 'QBO' },
        { id: '2', name: 'Certification Programs', amount: 60000, type: 'invoice', confidence: 85, lastSync: '2025-01-20T10:30:00Z', source: 'QBO' },
        { id: '3', name: 'Q1 Training Pipeline', amount: 20000, type: 'estimate', confidence: 60, lastSync: '2025-01-20T10:30:00Z', source: 'manual' }
      ],
      explanation: 'Training revenue below plan due to reduced demand and postponed sessions. Customers deferring non-essential training due to budget constraints.',
      assumptions: [
        { id: '1', description: 'Training sessions postponed by 2-3 weeks due to customer budget constraints', confidence: 80, source: 'Training team feedback', lastUpdated: '2025-01-20' },
        { id: '2', description: 'Reduced demand for certification programs in Q1 due to economic uncertainty', confidence: 75, source: 'Market analysis', lastUpdated: '2025-01-19' }
      ],
      actions: [
        { id: '1', type: 'slack', label: 'Slack Training Team', description: 'Review Q1 training pipeline and customer feedback', priority: 'medium' },
        { id: '2', type: 'review', label: 'Flag for Review', description: 'Assess training pricing and delivery model', priority: 'medium' }
      ]
    }
  },
  {
    key: 'other_revenue',
    name: 'Other Revenue',
    section: 'Revenue',
    subsection: 'Other',
    plan: 200000,
    actual: 250000,
    variance: 50000,
    variancePercent: 25.0,
    driver: 'Marketplace fees + partnerships',
    unit: 'USD',
    hasDrilldown: true,
    trend: 'up',
    priority: 'low',
    kpiMetrics: {
      marketplaceRevenue: 150000,
      partnershipRevenue: 100000
    },
    drilldownData: {
      total: 250000,
      sources: [
        { id: '1', name: 'Marketplace Fees', amount: 150000, type: 'invoice', confidence: 95, lastSync: '2025-01-20T10:30:00Z', source: 'QBO' },
        { id: '2', name: 'Strategic Partnerships', amount: 70000, type: 'invoice', confidence: 90, lastSync: '2025-01-20T10:30:00Z', source: 'QBO' },
        { id: '3', name: 'API Usage Fees', amount: 30000, type: 'invoice', confidence: 85, lastSync: '2025-01-20T10:30:00Z', source: 'QBO' }
      ],
      explanation: 'Other revenue above plan due to new strategic partnerships and increased marketplace activity. API usage fees higher than expected.',
      assumptions: [
        { id: '1', description: 'New strategic partnerships contributing $70K vs $50K plan', confidence: 90, source: 'Partnership team update', lastUpdated: '2025-01-20' },
        { id: '2', description: 'Marketplace adoption higher than expected due to new integrations', confidence: 85, source: 'Marketplace analytics', lastUpdated: '2025-01-19' }
      ],
      actions: [
        { id: '1', type: 'slack', label: 'Slack Partnership Team', description: 'Share partnership success stories', priority: 'low' },
        { id: '2', type: 'review', label: 'Flag for Review', description: 'Evaluate additional partnership opportunities', priority: 'low' }
      ]
    }
  },

  // --- COGS (Detailed Breakdown) ---
  {
    key: 'cogs_total',
    name: 'Cost of Goods Sold',
    section: 'COGS',
    subsection: 'Total',
    plan: 6200000,
    actual: 6800000,
    variance: 600000,
    variancePercent: 9.7,
    driver: 'Sum of all COGS components',
    unit: 'USD',
    hasDrilldown: false,
    isCalculated: true,
    calculation: 'Sum of all COGS lines',
    trend: 'down',
    priority: 'high'
  },
  {
    key: 'hosting_infrastructure',
    name: 'Hosting / Infrastructure',
    section: 'COGS',
    subsection: 'Infrastructure',
    plan: 3000000,
    actual: 3200000,
    variance: 200000,
    variancePercent: 6.7,
    driver: 'Active users × cost per user',
    unit: 'USD',
    hasDrilldown: true,
    trend: 'down',
    priority: 'medium',
    kpiMetrics: {
      activeUsers: 256000,
      costPerUser: 12.50,
      targetCostPerUser: 12.00
    },
    drilldownData: {
      total: 3200000,
      sources: [
        { id: '7', name: 'AWS Infrastructure', amount: 2000000, type: 'expense', confidence: 95, lastSync: '2025-01-20T10:30:00Z', source: 'QBO' },
        { id: '8', name: 'CDN & Edge Services', amount: 800000, type: 'expense', confidence: 95, lastSync: '2025-01-20T10:30:00Z', source: 'QBO' },
        { id: '9', name: 'Database Services', amount: 400000, type: 'expense', confidence: 90, lastSync: '2025-01-20T10:30:00Z', source: 'QBO' }
      ],
      explanation: 'Hosting costs above plan due to higher user growth and infrastructure scaling. Cost per user at $12.50 vs $12.00 plan.',
      assumptions: [],
      actions: [
        { id: '4', type: 'review', label: 'Flag for Review', description: 'Review infrastructure scaling strategy', priority: 'medium' }
      ]
    }
  },
  {
    key: 'cloud_costs',
    name: '    Cloud (AWS/GCP)',
    section: 'COGS',
    subsection: 'Infrastructure',
    plan: 2000000,
    actual: 2000000,
    variance: 0,
    variancePercent: 0.0,
    driver: 'Compute + storage + bandwidth',
    unit: 'USD',
    hasDrilldown: false,
    trend: 'stable',
    parentLine: 'hosting_infrastructure',
    kpiMetrics: {
      computeCost: 1200000,
      storageCost: 500000,
      bandwidthCost: 300000
    }
  },
  {
    key: 'software_licenses',
    name: '    Software Licenses',
    section: 'COGS',
    subsection: 'Infrastructure',
    plan: 800000,
    actual: 900000,
    variance: 100000,
    variancePercent: 12.5,
    driver: 'Per-seat licensing costs',
    unit: 'USD',
    hasDrilldown: true,
    trend: 'down',
    parentLine: 'hosting_infrastructure',
    kpiMetrics: {
      seats: 300,
      costPerSeat: 3000
    },
    drilldownData: {
      total: 900000,
      sources: [
        { id: '1', name: 'Monitoring Tools', amount: 400000, type: 'expense', confidence: 95, lastSync: '2025-01-20T10:30:00Z', source: 'QBO' },
        { id: '2', name: 'Security Software', amount: 300000, type: 'expense', confidence: 90, lastSync: '2025-01-20T10:30:00Z', source: 'QBO' },
        { id: '3', name: 'Development Tools', amount: 200000, type: 'expense', confidence: 85, lastSync: '2025-01-20T10:30:00Z', source: 'QBO' }
      ],
      explanation: 'Software license costs above plan due to additional monitoring and security tools required for compliance and operational needs.',
      assumptions: [
        { id: '1', description: 'Additional monitoring tools required for compliance with new security standards', confidence: 90, source: 'Security team update', lastUpdated: '2025-01-20' },
        { id: '2', description: 'Development team expansion requiring additional tool licenses', confidence: 85, source: 'Engineering team update', lastUpdated: '2025-01-19' }
      ],
      actions: [
        { id: '1', type: 'slack', label: 'Slack Engineering Team', description: 'Review software license optimization opportunities', priority: 'medium' },
        { id: '2', type: 'review', label: 'Flag for Review', description: 'Assess tool consolidation and licensing strategy', priority: 'medium' }
      ]
    }
  },
  {
    key: 'data_costs',
    name: '    Data Costs',
    section: 'COGS',
    subsection: 'Infrastructure',
    plan: 200000,
    actual: 300000,
    variance: 100000,
    variancePercent: 50.0,
    driver: 'Data transfer + analytics',
    unit: 'USD',
    hasDrilldown: false,
    trend: 'down',
    parentLine: 'hosting_infrastructure',
    kpiMetrics: {
      dataTransfer: 150000,
      analyticsCost: 150000
    }
  },
  {
    key: 'customer_support',
    name: 'Customer Support',
    section: 'COGS',
    subsection: 'Support',
    plan: 2000000,
    actual: 2200000,
    variance: 200000,
    variancePercent: 10.0,
    driver: 'Tickets per customer × cost per ticket',
    unit: 'USD',
    hasDrilldown: true,
    trend: 'down',
    priority: 'medium',
    kpiMetrics: {
      ticketsPerCustomer: 2.5,
      costPerTicket: 35,
      targetCostPerTicket: 32
    },
    drilldownData: {
      total: 2200000,
      sources: [
        { id: '10', name: 'Support Team Payroll', amount: 1800000, type: 'payroll', confidence: 90, lastSync: '2025-01-20T10:30:00Z', source: 'Rippling' },
        { id: '11', name: 'Support Tools & Software', amount: 400000, type: 'expense', confidence: 95, lastSync: '2025-01-20T10:30:00Z', source: 'QBO' }
      ],
      explanation: 'Support costs above plan due to higher headcount and tool licensing. Efficiency at 85% vs 90% target.',
      assumptions: [
        { id: '3', description: 'Support efficiency ratio at 85% vs 90% plan', confidence: 80, source: 'Support metrics dashboard', lastUpdated: '2025-01-18' }
      ],
      actions: [
        { id: '5', type: 'review', label: 'Flag for Review', description: 'Review support efficiency metrics', priority: 'medium' }
      ]
    }
  },
  {
    key: 'tier1_support',
    name: '    Tier 1 Support',
    section: 'COGS',
    subsection: 'Support',
    plan: 1200000,
    actual: 1300000,
    variance: 100000,
    variancePercent: 8.3,
    driver: 'Tier 1 headcount × cost',
    unit: 'USD',
    hasDrilldown: false,
    trend: 'down',
    parentLine: 'customer_support',
    kpiMetrics: {
      headcount: 20,
      costPerHead: 65000
    }
  },
  {
    key: 'tier2_support',
    name: '    Tier 2 Support',
    section: 'COGS',
    subsection: 'Support',
    plan: 600000,
    actual: 700000,
    variance: 100000,
    variancePercent: 16.7,
    driver: 'Tier 2 headcount × cost',
    unit: 'USD',
    hasDrilldown: false,
    trend: 'down',
    parentLine: 'customer_support',
    kpiMetrics: {
      headcount: 10,
      costPerHead: 70000
    }
  },
  {
    key: 'outsourced_support',
    name: '    Outsourced Support',
    section: 'COGS',
    subsection: 'Support',
    plan: 200000,
    actual: 200000,
    variance: 0,
    variancePercent: 0.0,
    driver: 'Outsourced hours × rate',
    unit: 'USD',
    hasDrilldown: false,
    trend: 'stable',
    parentLine: 'customer_support',
    kpiMetrics: {
      hours: 1000,
      rate: 200
    }
  },
  {
    key: 'ps_delivery_costs',
    name: 'Professional Services Delivery',
    section: 'COGS',
    subsection: 'Services',
    plan: 1000000,
    actual: 1200000,
    variance: 200000,
    variancePercent: 20.0,
    driver: 'PS headcount × utilization × cost',
    unit: 'USD',
    hasDrilldown: true,
    trend: 'down',
    priority: 'high',
    kpiMetrics: {
      headcount: 25,
      utilization: 0.75,
      costPerHead: 64000
    }
  },
  {
    key: 'internal_ps',
    name: '    Internal FTE',
    section: 'COGS',
    subsection: 'Services',
    plan: 800000,
    actual: 1000000,
    variance: 200000,
    variancePercent: 25.0,
    driver: 'Internal headcount × cost',
    unit: 'USD',
    hasDrilldown: false,
    trend: 'down',
    parentLine: 'ps_delivery_costs',
    kpiMetrics: {
      headcount: 20,
      costPerHead: 50000
    }
  },
  {
    key: 'contractor_ps',
    name: '    Contractors',
    section: 'COGS',
    subsection: 'Services',
    plan: 200000,
    actual: 200000,
    variance: 0,
    variancePercent: 0.0,
    driver: 'Contractor hours × rate',
    unit: 'USD',
    hasDrilldown: false,
    trend: 'stable',
    parentLine: 'ps_delivery_costs',
    kpiMetrics: {
      hours: 500,
      rate: 400
    }
  },

  // --- GROSS PROFIT (Enhanced Analysis) ---
  {
    key: 'gross_profit',
    name: 'Gross Profit',
    section: 'Gross Profit',
    subsection: 'Total',
    plan: 23800000,
    actual: 22700000,
    variance: -1100000,
    variancePercent: -4.6,
    driver: 'Revenue - COGS',
    unit: 'USD',
    hasDrilldown: false,
    isCalculated: true,
    calculation: 'Revenue - COGS',
    trend: 'down',
    priority: 'high',
    kpiMetrics: {
      margin: 0.78,
      contributionMargin: 0.72,
      recurringRevenueCoverage: 0.85
    }
  },
  {
    key: 'gross_margin_pct',
    name: 'Gross Margin %',
    section: 'Gross Profit',
    subsection: 'Metrics',
    plan: 78.0,
    actual: 77.4,
    variance: -0.6,
    variancePercent: -0.8,
    driver: 'Gross Profit / Revenue',
    unit: '%',
    hasDrilldown: false,
    isCalculated: true,
    calculation: 'Gross Profit / Revenue',
    trend: 'down',
    kpiMetrics: {
      margin: 0.774,
      targetMargin: 0.78
    }
  },
  {
    key: 'contribution_margin',
    name: 'Contribution Margin',
    section: 'Gross Profit',
    subsection: 'Metrics',
    plan: 72.0,
    actual: 71.2,
    variance: -0.8,
    variancePercent: -1.1,
    driver: 'Gross Profit - Variable OpEx',
    unit: '%',
    hasDrilldown: false,
    isCalculated: true,
    calculation: '(Gross Profit - Variable OpEx) / Revenue',
    trend: 'down',
    kpiMetrics: {
      contributionMargin: 0.712,
      targetContributionMargin: 0.72,
      variableOpEx: 1800000
    }
  },
  {
    key: 'recurring_revenue_coverage',
    name: 'Recurring Revenue Coverage',
    section: 'Gross Profit',
    subsection: 'Metrics',
    plan: 85.0,
    actual: 83.8,
    variance: -1.2,
    variancePercent: -1.4,
    driver: 'Gross Profit / Recurring Revenue',
    unit: '%',
    hasDrilldown: false,
    isCalculated: true,
    calculation: 'Gross Profit / Recurring Revenue',
    trend: 'down',
    kpiMetrics: {
      recurringRevenueCoverage: 0.838,
      targetCoverage: 0.85
    }
  },

  // --- OPERATING EXPENSES (SaaS-Style Categories) ---
  {
    key: 'opex_total',
    name: 'Operating Expenses',
    section: 'Operating Expenses',
    subsection: 'Total',
    plan: 12500000,
    actual: 13360000,
    variance: 860000,
    variancePercent: 6.9,
    driver: 'Sum of all OpEx components',
    unit: 'USD',
    hasDrilldown: false,
    isCalculated: true,
    calculation: 'Sum of all OpEx lines',
    trend: 'down',
    priority: 'high'
  },
  {
    key: 'rd_expenses',
    name: 'Research & Development',
    section: 'Operating Expenses',
    subsection: 'R&D',
    plan: 6000000,
    actual: 6400000,
    variance: 400000,
    variancePercent: 6.7,
    driver: 'Engineering headcount × cost',
    unit: 'USD',
    hasDrilldown: true,
    trend: 'down',
    priority: 'medium',
    kpiMetrics: {
      headcount: 80,
      costPerHead: 80000
    }
  },
  {
    key: 'sales_marketing',
    name: 'Sales & Marketing',
    section: 'Operating Expenses',
    subsection: 'Sales',
    plan: 4000000,
    actual: 4200000,
    variance: 200000,
    variancePercent: 5.0,
    driver: 'Sales headcount + marketing spend + commissions',
    unit: 'USD',
    hasDrilldown: true,
    trend: 'down',
    priority: 'medium',
    kpiMetrics: {
      headcount: 40,
      costPerHead: 100000,
      cac: 2500,
      pipelineCoverage: 3.2
    }
  },
  {
    key: 'direct_sales',
    name: '    Direct Sales',
    section: 'Operating Expenses',
    subsection: 'Sales',
    plan: 2500000,
    actual: 2600000,
    variance: 100000,
    variancePercent: 4.0,
    driver: 'Sales headcount × cost',
    unit: 'USD',
    hasDrilldown: false,
    trend: 'down',
    parentLine: 'sales_marketing',
    kpiMetrics: {
      headcount: 25,
      costPerHead: 104000
    }
  },
  {
    key: 'marketing_spend',
    name: '    Marketing Spend',
    section: 'Operating Expenses',
    subsection: 'Sales',
    plan: 1000000,
    actual: 1100000,
    variance: 100000,
    variancePercent: 10.0,
    driver: 'Ads + events + content',
    unit: 'USD',
    hasDrilldown: false,
    trend: 'down',
    parentLine: 'sales_marketing',
    kpiMetrics: {
      adSpend: 600000,
      events: 300000,
      content: 200000
    }
  },
  {
    key: 'sales_commissions',
    name: '    Sales Commissions',
    section: 'Operating Expenses',
    subsection: 'Sales',
    plan: 500000,
    actual: 500000,
    variance: 0,
    variancePercent: 0.0,
    driver: 'Revenue × commission rate',
    unit: 'USD',
    hasDrilldown: false,
    trend: 'stable',
    parentLine: 'sales_marketing',
    kpiMetrics: {
      commissionRate: 0.02,
      revenue: 25000000
    }
  },
  {
    key: 'ga_expenses',
    name: 'General & Administrative',
    section: 'Operating Expenses',
    subsection: 'G&A',
    plan: 2000000,
    actual: 2200000,
    variance: 200000,
    variancePercent: 10.0,
    driver: 'Finance + legal + HR + facilities',
    unit: 'USD',
    hasDrilldown: true,
    trend: 'down',
    priority: 'low',
    kpiMetrics: {
      headcount: 15,
      costPerHead: 146667
    }
  },
  {
    key: 'facilities_it',
    name: 'Facilities / IT / Other',
    section: 'Operating Expenses',
    subsection: 'Other',
    plan: 500000,
    actual: 560000,
    variance: 60000,
    variancePercent: 12.0,
    driver: 'Office + IT + miscellaneous',
    unit: 'USD',
    hasDrilldown: false,
    trend: 'down',
    priority: 'low',
    kpiMetrics: {
      officeCost: 300000,
      itCost: 200000,
      miscCost: 60000
    }
  },

  // --- OPERATING INCOME ---
  {
    key: 'operating_income',
    name: 'Operating Income',
    section: 'Operating Income',
    subsection: 'Total',
    plan: 11300000,
    actual: 9340000,
    variance: -1960000,
    variancePercent: -17.3,
    driver: 'Gross Profit - Operating Expenses',
    unit: 'USD',
    hasDrilldown: false,
    isCalculated: true,
    calculation: 'Gross Profit - Operating Expenses',
    trend: 'down',
    priority: 'high',
    kpiMetrics: {
      operatingMargin: 0.32,
      targetMargin: 0.38
    }
  },

  // --- OTHER INCOME/EXPENSE ---
  {
    key: 'other_income_expense',
    name: 'Other Income / Expense',
    section: 'Other Income/Expense',
    subsection: 'Total',
    plan: 100000,
    actual: 0,
    variance: -100000,
    variancePercent: -100.0,
    driver: 'Interest + FX + other',
    unit: 'USD',
    hasDrilldown: false,
    trend: 'down',
    priority: 'low'
  },

  // --- NET INCOME ---
  {
    key: 'net_income',
    name: 'Net Income',
    section: 'Net Income',
    subsection: 'Total',
    plan: 11400000,
    actual: 9340000,
    variance: -2060000,
    variancePercent: -18.1,
    driver: 'Operating Income + Other Income/Expense',
    unit: 'USD',
    hasDrilldown: false,
    isCalculated: true,
    calculation: 'Operating Income + Other Income/Expense',
    trend: 'down',
    priority: 'high',
    kpiMetrics: {
      netMargin: 0.32,
      targetMargin: 0.38
    }
  }
];

export const mockForecastDrivers: ForecastDriver[] = [
  {
    key: 'bookings_growth_pct',
    name: 'Bookings Growth %',
    value: 15,
    unit: '%',
    category: 'bookings',
    impact: 'positive',
    editable: true,
    description: 'Annual growth rate for new bookings',
    minValue: 0,
    maxValue: 50,
    step: 1
  },
  {
    key: 'churn_pct',
    name: 'Customer Churn %',
    value: 1.5,
    unit: '%',
    category: 'churn',
    impact: 'negative',
    editable: true,
    description: 'Annual customer churn rate',
    minValue: 0,
    maxValue: 10,
    step: 0.1
  },
  {
    key: 'arpu_usd',
    name: 'ARPU (USD)',
    value: 1200,
    unit: 'USD',
    category: 'efficiency',
    impact: 'positive',
    editable: true,
    description: 'Average Revenue Per User',
    minValue: 500,
    maxValue: 3000,
    step: 50
  },
  {
    key: 'headcount_rnd',
    name: 'R&D Headcount',
    value: 120,
    unit: 'FTE',
    category: 'headcount',
    impact: 'negative',
    editable: true,
    description: 'Research & Development team size',
    minValue: 80,
    maxValue: 200,
    step: 5
  },
  {
    key: 'headcount_sales',
    name: 'Sales Headcount',
    value: 80,
    unit: 'FTE',
    category: 'headcount',
    impact: 'negative',
    editable: true,
    description: 'Sales team size',
    minValue: 50,
    maxValue: 150,
    step: 5
  },
  {
    key: 'headcount_support',
    name: 'Support Headcount',
    value: 50,
    unit: 'FTE',
    category: 'headcount',
    impact: 'negative',
    editable: true,
    description: 'Customer support team size',
    minValue: 30,
    maxValue: 100,
    step: 5
  },
  {
    key: 'avg_salary_rnd',
    name: 'Avg R&D Salary',
    value: 110000,
    unit: 'USD',
    category: 'efficiency',
    impact: 'negative',
    editable: true,
    description: 'Average R&D team salary',
    minValue: 80000,
    maxValue: 150000,
    step: 5000
  },
  {
    key: 'avg_salary_sales',
    name: 'Avg Sales Salary',
    value: 100000,
    unit: 'USD',
    category: 'efficiency',
    impact: 'negative',
    editable: true,
    description: 'Average sales team salary',
    minValue: 70000,
    maxValue: 130000,
    step: 5000
  },
  {
    key: 'cac_per_customer',
    name: 'CAC per Customer',
    value: 15000,
    unit: 'USD',
    category: 'efficiency',
    impact: 'negative',
    editable: true,
    description: 'Customer Acquisition Cost',
    minValue: 10000,
    maxValue: 25000,
    step: 1000
  },
  {
    key: 'hosting_cost_per_user',
    name: 'Hosting Cost per User',
    value: 12,
    unit: 'USD',
    category: 'efficiency',
    impact: 'negative',
    editable: true,
    description: 'Monthly hosting cost per active user',
    minValue: 8,
    maxValue: 20,
    step: 1
  },
  {
    key: 'cash_balance',
    name: 'Cash Balance',
    value: 80000000,
    unit: 'USD',
    category: 'financial',
    impact: 'positive',
    editable: true,
    description: 'Available cash for operations',
    minValue: 50000000,
    maxValue: 150000000,
    step: 1000000
  },
  {
    key: 'debt_outstanding',
    name: 'Debt Outstanding',
    value: 10000000,
    unit: 'USD',
    category: 'financial',
    impact: 'negative',
    editable: true,
    description: 'Outstanding debt obligations',
    minValue: 0,
    maxValue: 50000000,
    step: 1000000
  }
];

export const mockDriverInputs: DriverInputs = {
  bookings_growth_pct: 15,
  churn_pct: 1.5,
  arpu_usd: 1200,
  headcount_rnd: 120,
  headcount_sales: 80,
  headcount_support: 50,
  avg_salary_rnd: 110000,
  avg_salary_sales: 100000,
  cac_per_customer: 15000,
  hosting_cost_per_user: 12,
  cash_balance: 80000000,
  debt_outstanding: 10000000
};

export const mockIntegrationHealth: IntegrationHealth[] = [
  {
    system: 'QuickBooks Online',
    status: 'healthy',
    lastSync: '2025-01-20T10:30:00Z',
    syncFrequency: 'Every 15 minutes',
    issues: []
  },
  {
    system: 'Rippling',
    status: 'warning',
    lastSync: '2025-01-20T08:45:00Z',
    syncFrequency: 'Every hour',
    issues: ['Last sync was 1h 45m ago']
  },
  {
    system: 'Pigment',
    status: 'healthy',
    lastSync: '2025-01-20T10:00:00Z',
    syncFrequency: 'Daily',
    issues: []
  },
  {
    system: 'Anaplan',
    status: 'error',
    lastSync: '2025-01-19T18:00:00Z',
    syncFrequency: 'Daily',
    issues: ['Connection timeout', 'Last sync was 16h ago']
  }
];

// Mock data for Rolling Forecast
export const mockForecastScenarios: ForecastScenario[] = [
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

const generateMonthlyData = (baseValue: number, growthRate: number, planValue: number, previousForecast: number): MonthlyForecastData[] => {
  const months = ['Aug-25', 'Sep-25', 'Oct-25', 'Nov-25', 'Dec-25', 'Jan-26', 'Feb-26', 'Mar-26', 'Apr-26', 'May-26', 'Jun-26', 'Jul-26'];
  return months.map((month, index) => {
    const value = baseValue * Math.pow(1 + growthRate / 100, index);
    const variance = value - planValue;
    const variancePercent = (variance / planValue) * 100;
    const prevVariance = value - previousForecast;
    const prevVariancePercent = (prevVariance / previousForecast) * 100;
    
    return {
      month,
      value,
      plan: planValue,
      variance,
      variancePercent,
      previousForecast,
      previousVariance: prevVariance,
      previousVariancePercent: prevVariancePercent
    };
  });
};

export const mockPnLForecastLines: PnLForecastLine[] = [
  // Revenue Section
  {
    key: 'revenue',
    name: 'Revenue',
    section: 'Revenue',
    isCalculated: true,
    calculation: 'Sum of all revenue lines',
    isExpanded: true,
    hasDrivers: false,
    monthlyData: generateMonthlyData(30000000, 2.5, 30200000, 29800000),
    total: {
      month: 'Total',
      value: 360000000,
      plan: 362400000,
      variance: -2400000,
      variancePercent: -0.7,
      previousForecast: 357600000,
      previousVariance: 2400000,
      previousVariancePercent: 0.7
    }
  },
  {
    key: 'subscription_revenue',
    name: 'Subscription Revenue',
    section: 'Revenue',
    subsection: 'Subscription',
    parentLine: 'revenue',
    isCalculated: true,
    calculation: 'Customers × ARPU × 12',
    isExpanded: false,
    hasDrivers: true,
    monthlyData: generateMonthlyData(25000000, 2.0, 25200000, 24800000),
    total: {
      month: 'Total',
      value: 300000000,
      plan: 302400000,
      variance: -2400000,
      variancePercent: -0.8,
      previousForecast: 297600000,
      previousVariance: 2400000,
      previousVariancePercent: 0.8
    },
    drivers: [
      mockForecastDrivers.find(d => d.key === 'bookings_growth_pct')!,
      mockForecastDrivers.find(d => d.key === 'arpu_usd')!
    ]
  },
  {
    key: 'new_arr',
    name: 'New ARR',
    section: 'Revenue',
    subsection: 'Subscription',
    parentLine: 'subscription_revenue',
    isCalculated: true,
    calculation: 'New customers × ARPU',
    isExpanded: false,
    hasDrivers: true,
    monthlyData: generateMonthlyData(5000000, 3.0, 5200000, 4800000),
    total: {
      month: 'Total',
      value: 60000000,
      plan: 62400000,
      variance: -2400000,
      variancePercent: -3.8,
      previousForecast: 57600000,
      previousVariance: 2400000,
      previousVariancePercent: 4.2
    },
    drivers: [
      mockForecastDrivers.find(d => d.key === 'bookings_growth_pct')!,
      mockForecastDrivers.find(d => d.key === 'arpu_usd')!
    ]
  },
  {
    key: 'expansion_arr',
    name: 'Expansion ARR',
    section: 'Revenue',
    subsection: 'Subscription',
    parentLine: 'subscription_revenue',
    isCalculated: true,
    calculation: 'Existing customers × expansion rate',
    isExpanded: false,
    hasDrivers: true,
    monthlyData: generateMonthlyData(18000000, 1.5, 18200000, 17800000),
    total: {
      month: 'Total',
      value: 216000000,
      plan: 218400000,
      variance: -2400000,
      variancePercent: -1.1,
      previousForecast: 213600000,
      previousVariance: 2400000,
      previousVariancePercent: 1.1
    },
    drivers: [
      mockForecastDrivers.find(d => d.key === 'bookings_growth_pct')!
    ]
  },
  {
    key: 'churned_arr',
    name: 'Churned ARR',
    section: 'Revenue',
    subsection: 'Subscription',
    parentLine: 'subscription_revenue',
    isCalculated: true,
    calculation: 'Churn % × base ARR',
    isExpanded: false,
    hasDrivers: true,
    monthlyData: generateMonthlyData(3000000, 0.5, 2800000, 3200000),
    total: {
      month: 'Total',
      value: 36000000,
      plan: 33600000,
      variance: 2400000,
      variancePercent: 7.1,
      previousForecast: 38400000,
      previousVariance: -2400000,
      previousVariancePercent: -6.3
    },
    drivers: [
      mockForecastDrivers.find(d => d.key === 'churn_pct')!
    ]
  },
  
  // COGS Section
  {
    key: 'cogs',
    name: 'Cost of Goods Sold',
    section: 'COGS',
    isCalculated: true,
    calculation: 'Sum of all COGS lines',
    isExpanded: true,
    hasDrivers: false,
    monthlyData: generateMonthlyData(6000000, 1.8, 6100000, 5900000),
    total: {
      month: 'Total',
      value: 72000000,
      plan: 73200000,
      variance: -1200000,
      variancePercent: -1.6,
      previousForecast: 70800000,
      previousVariance: 1200000,
      previousVariancePercent: 1.7
    }
  },
  {
    key: 'hosting_costs',
    name: 'Hosting Costs',
    section: 'COGS',
    subsection: 'Infrastructure',
    parentLine: 'cogs',
    isCalculated: true,
    calculation: 'Active users × hosting cost per user',
    isExpanded: false,
    hasDrivers: true,
    monthlyData: generateMonthlyData(1200000, 2.0, 1220000, 1180000),
    total: {
      month: 'Total',
      value: 14400000,
      plan: 14640000,
      variance: -240000,
      variancePercent: -1.6,
      previousForecast: 14160000,
      previousVariance: 240000,
      previousVariancePercent: 1.7
    },
    drivers: [
      mockForecastDrivers.find(d => d.key === 'hosting_cost_per_user')!
    ]
  },
  {
    key: 'support_costs',
    name: 'Support Costs',
    section: 'COGS',
    subsection: 'People',
    parentLine: 'cogs',
    isCalculated: true,
    calculation: 'Support headcount × avg salary × 1.3',
    isExpanded: false,
    hasDrivers: true,
    monthlyData: generateMonthlyData(4800000, 1.5, 4880000, 4720000),
    total: {
      month: 'Total',
      value: 57600000,
      plan: 58560000,
      variance: -960000,
      variancePercent: -1.6,
      previousForecast: 56640000,
      previousVariance: 960000,
      previousVariancePercent: 1.7
    },
    drivers: [
      mockForecastDrivers.find(d => d.key === 'headcount_support')!,
      mockForecastDrivers.find(d => d.key === 'avg_salary_rnd')!
    ]
  },
  
  // Gross Profit
  {
    key: 'gross_profit',
    name: 'Gross Profit',
    section: 'Gross Profit',
    isCalculated: true,
    calculation: 'Revenue - COGS',
    isExpanded: false,
    hasDrivers: false,
    monthlyData: generateMonthlyData(24000000, 2.8, 24100000, 23900000),
    total: {
      month: 'Total',
      value: 288000000,
      plan: 289200000,
      variance: -1200000,
      variancePercent: -0.4,
      previousForecast: 286800000,
      previousVariance: 1200000,
      previousVariancePercent: 0.4
    }
  },
  
  // Operating Expenses
  {
    key: 'operating_expenses',
    name: 'Operating Expenses',
    section: 'Operating Expenses',
    isCalculated: true,
    calculation: 'Sum of all operating expense lines',
    isExpanded: true,
    hasDrivers: false,
    monthlyData: generateMonthlyData(12000000, 2.2, 12200000, 11800000),
    total: {
      month: 'Total',
      value: 144000000,
      plan: 146400000,
      variance: -2400000,
      variancePercent: -1.6,
      previousForecast: 141600000,
      previousVariance: 2400000,
      previousVariancePercent: 1.7
    }
  },
  {
    key: 'sales_marketing',
    name: 'Sales & Marketing',
    section: 'Operating Expenses',
    subsection: 'Sales',
    parentLine: 'operating_expenses',
    isCalculated: true,
    calculation: 'Sales headcount × avg salary × 1.3 + (new customers × CAC)',
    isExpanded: false,
    hasDrivers: true,
    monthlyData: generateMonthlyData(6000000, 2.5, 6100000, 5900000),
    total: {
      month: 'Total',
      value: 72000000,
      plan: 73200000,
      variance: -1200000,
      variancePercent: -1.6,
      previousForecast: 70800000,
      previousVariance: 1200000,
      previousVariancePercent: 1.7
    },
    drivers: [
      mockForecastDrivers.find(d => d.key === 'headcount_sales')!,
      mockForecastDrivers.find(d => d.key === 'avg_salary_sales')!,
      mockForecastDrivers.find(d => d.key === 'cac_per_customer')!
    ]
  },
  {
    key: 'rd_costs',
    name: 'Research & Development',
    section: 'Operating Expenses',
    subsection: 'R&D',
    parentLine: 'operating_expenses',
    isCalculated: true,
    calculation: 'R&D headcount × avg salary × 1.3',
    isExpanded: false,
    hasDrivers: true,
    monthlyData: generateMonthlyData(5000000, 2.0, 5100000, 4900000),
    total: {
      month: 'Total',
      value: 60000000,
      plan: 61200000,
      variance: -1200000,
      variancePercent: -2.0,
      previousForecast: 58800000,
      previousVariance: 1200000,
      previousVariancePercent: 2.0
    },
    drivers: [
      mockForecastDrivers.find(d => d.key === 'headcount_rnd')!,
      mockForecastDrivers.find(d => d.key === 'avg_salary_rnd')!
    ]
  },
  {
    key: 'general_admin',
    name: 'General & Administrative',
    section: 'Operating Expenses',
    subsection: 'G&A',
    parentLine: 'operating_expenses',
    isCalculated: true,
    calculation: 'Total headcount × $80K × 1.3',
    isExpanded: false,
    hasDrivers: true,
    monthlyData: generateMonthlyData(1000000, 1.8, 1000000, 1000000),
    total: {
      month: 'Total',
      value: 12000000,
      plan: 12000000,
      variance: 0,
      variancePercent: 0,
      previousForecast: 12000000,
      previousVariance: 0,
      previousVariancePercent: 0
    },
    drivers: [
      mockForecastDrivers.find(d => d.key === 'headcount_rnd')!,
      mockForecastDrivers.find(d => d.key === 'headcount_sales')!,
      mockForecastDrivers.find(d => d.key === 'headcount_support')!
    ]
  },
  
  // EBITDA
  {
    key: 'ebitda',
    name: 'EBITDA',
    section: 'Operating Income',
    isCalculated: true,
    calculation: 'Gross Profit - Operating Expenses',
    isExpanded: false,
    hasDrivers: false,
    monthlyData: generateMonthlyData(12000000, 3.5, 11900000, 12100000),
    total: {
      month: 'Total',
      value: 144000000,
      plan: 142800000,
      variance: 1200000,
      variancePercent: 0.8,
      previousForecast: 145200000,
      previousVariance: -1200000,
      previousVariancePercent: -0.8
    }
  },
  
  // Net Income
  {
    key: 'net_income',
    name: 'Net Income',
    section: 'Net Income',
    isCalculated: true,
    calculation: 'EBITDA + Interest Income - Interest Expense',
    isExpanded: false,
    hasDrivers: false,
    monthlyData: generateMonthlyData(11000000, 3.8, 10900000, 11100000),
    total: {
      month: 'Total',
      value: 132000000,
      plan: 130800000,
      variance: 1200000,
      variancePercent: 0.9,
      previousForecast: 133200000,
      previousVariance: -1200000,
      previousVariancePercent: -0.9
    }
  }
];

export const mockRollingForecastData: RollingForecastData = {
  scenarios: mockForecastScenarios,
  activeScenario: 'base',
  timeHorizon: '12M',
  pnlLines: mockPnLForecastLines,
  lastUpdated: '2025-01-20T10:00:00Z'
};
