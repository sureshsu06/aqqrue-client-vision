export interface CFOQuestion {
  id: string;
  question: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  answer: {
    executiveSummary: string;
    detailedAnalysis: string;
    keyMetrics: {
      metric: string;
      value: string;
      change: string;
      trend: 'up' | 'down' | 'stable';
    }[];
    actionItems: {
      priority: 'immediate' | 'this_week' | 'this_month' | 'next_quarter';
      action: string;
      owner: string;
      impact: string;
    }[];
    risks: {
      risk: string;
      probability: 'high' | 'medium' | 'low';
      impact: 'high' | 'medium' | 'low';
      mitigation: string;
    }[];
    customerARBreakdown?: {
      customer: string;
      current: number;
      days30to60: number;
      days60to90: number;
      over90: number;
      total: number;
    }[];
  };
  sources: {
    system: string;
    type: string;
    id: string;
    link: string;
    lastUpdated: string;
    description: string;
  }[];
  transactionLineage: {
    id: string;
    description: string;
    amount: number;
    currency: string;
    date: string;
    type: 'debit' | 'credit';
    account: string;
    reference: string;
    entity: string;
  }[];
  confidence: number;
  lastUpdated: string;
}

export const cfoQuestions: CFOQuestion[] = [
  {
    id: 'cash_position_burn_rate',
    question: 'What is our current cash position and burn rate?',
    category: 'Cash Management',
    priority: 'high',
    answer: {
      executiveSummary: 'Our cash position stands at $2.4M across all entities, with a monthly burn rate of $180K (+15% MoM increase). While we have 13.3 months of runway, the APAC entity is critically below the $1M threshold at $480K, requiring immediate attention.',
      detailedAnalysis: 'The cash position has declined from $2.6M last month, primarily due to increased operational expenses and delayed receivables. The burn rate increase is driven by AWS infrastructure costs (+$95K) and contractor overruns (+$75K). The APAC entity\'s cash shortfall poses immediate liquidity risk and requires intercompany transfer or vendor payment negotiation.',
      keyMetrics: [
        { metric: 'Total Cash', value: '$2.4M', change: '-$200K MoM', trend: 'down' },
        { metric: 'Monthly Burn Rate', value: '$180K', change: '+15% MoM', trend: 'up' },
        { metric: 'Cash Runway', value: '13.3 months', change: '-1.2 months', trend: 'down' },
        { metric: 'APAC Cash', value: '$480K', change: 'Below threshold', trend: 'down' }
      ],
      actionItems: [
        { priority: 'immediate', action: 'Transfer $520K to APAC entity', owner: 'Treasury Team', impact: 'Resolve liquidity crisis' },
        { priority: 'this_week', action: 'Negotiate vendor payment terms', owner: 'Procurement', impact: 'Preserve cash flow' },
        { priority: 'this_month', action: 'Implement cash flow forecasting', owner: 'FP&A', impact: 'Improve visibility' }
      ],
      risks: [
        { risk: 'APAC entity insolvency', probability: 'high', impact: 'high', mitigation: 'Immediate intercompany transfer' },
        { risk: 'Vendor payment default', probability: 'medium', impact: 'high', mitigation: 'Negotiate payment terms' },
        { risk: 'Extended burn rate increase', probability: 'medium', impact: 'medium', mitigation: 'Cost optimization initiatives' }
      ]
    },
    sources: [
      {
        system: 'Treasury Management System',
        type: 'cash_position_report',
        id: 'CASH-2025-08-31',
        link: '/treasury/cash-position/2025-08-31',
        lastUpdated: '15 minutes ago',
        description: 'Real-time cash balances across all entities and currencies'
      },
      {
        system: 'Financial Planning & Analysis',
        type: 'burn_rate_analysis',
        id: 'BURN-2025-Q3',
        link: '/fp-a/burn-rate/q3-2025',
        lastUpdated: '2 hours ago',
        description: 'Monthly burn rate calculation and trend analysis'
      },
      {
        system: 'Banking Integration',
        type: 'account_balances',
        id: 'BANK-APAC-001',
        link: '/banking/accounts/apac-001',
        lastUpdated: '5 minutes ago',
        description: 'APAC entity bank account balances and transaction history'
      }
    ],
    transactionLineage: [
      {
        id: 'TXN-2025-0891',
        description: 'AWS Infrastructure Payment',
        amount: 95000,
        currency: 'USD',
        date: '2025-08-30',
        type: 'debit',
        account: 'Technology Infrastructure - AWS',
        reference: 'INV-AWS-0891',
        entity: 'US Inc'
      },
      {
        id: 'TXN-2025-0892',
        description: 'Contractor Payroll - Development Team',
        amount: 75000,
        currency: 'USD',
        date: '2025-08-30',
        type: 'debit',
        account: 'Contractor Services',
        reference: 'PAY-CONTRACT-0892',
        entity: 'US Inc'
      },
      {
        id: 'TXN-2025-0893',
        description: 'Customer Payment - Acme Corp',
        amount: 320000,
        currency: 'USD',
        date: '2025-08-29',
        type: 'credit',
        account: 'Accounts Receivable',
        reference: 'INV-2025-089',
        entity: 'US Inc'
      },
      {
        id: 'TXN-2025-0894',
        description: 'APAC Vendor Payment - Office Rent',
        amount: 45000,
        currency: 'USD',
        date: '2025-08-29',
        type: 'debit',
        account: 'Office Rent - APAC',
        reference: 'RENT-APAC-0894',
        entity: 'APAC Inc'
      }
    ],
    confidence: 0.94,
    lastUpdated: '2025-08-31T10:30:00Z'
  },
  {
    id: 'revenue_trends_analysis',
    question: 'How is our revenue trending this quarter?',
    category: 'Revenue Analysis',
    priority: 'high',
    answer: {
      executiveSummary: 'Q3 revenue shows strong growth at $4.2M (+10.5% QoQ), driven by new customer acquisitions (+$180K) and expansion revenue (+$220K). However, we face a critical renewal risk with Beta Inc ($420K ARR) due in 14 days, and a recent $120K credit memo from Northwind Corp impacts our net revenue.',
      detailedAnalysis: 'Revenue growth is primarily driven by our enterprise segment, with average deal size increasing from $42K to $45K. The sales cycle has improved from 52 to 45 days. However, customer health scores are declining, with Beta Inc at 67/100 and Northwind Corp at 45/100. Our ARR stands at $16.8M with a 3.2% monthly growth rate.',
      keyMetrics: [
        { metric: 'Q3 Revenue', value: '$4.2M', change: '+10.5% QoQ', trend: 'up' },
        { metric: 'ARR', value: '$16.8M', change: '+3.2% MoM', trend: 'up' },
        { metric: 'New Customer Revenue', value: '$180K', change: '+25% MoM', trend: 'up' },
        { metric: 'Expansion Revenue', value: '$220K', change: '+15% MoM', trend: 'up' },
        { metric: 'Churn Impact', value: '-$120K', change: 'Credit memo', trend: 'down' }
      ],
      actionItems: [
        { priority: 'immediate', action: 'Schedule Beta Inc renewal call', owner: 'Sales Team', impact: 'Secure $420K ARR' },
        { priority: 'this_week', action: 'Customer success outreach to Northwind', owner: 'Customer Success', impact: 'Restore relationship' },
        { priority: 'this_month', action: 'Implement health score monitoring', owner: 'Sales Ops', impact: 'Early risk detection' }
      ],
      risks: [
        { risk: 'Beta Inc churn', probability: 'high', impact: 'high', mitigation: 'Executive sponsor engagement' },
        { risk: 'Northwind Corp churn', probability: 'medium', impact: 'medium', mitigation: 'Service quality improvement' },
        { risk: 'Deal size compression', probability: 'low', impact: 'medium', mitigation: 'Value-based pricing' }
      ]
    },
    sources: [
      {
        system: 'Salesforce CRM',
        type: 'revenue_report',
        id: 'REV-Q3-2025',
        link: '/salesforce/reports/revenue-q3-2025',
        lastUpdated: '1 hour ago',
        description: 'Comprehensive Q3 revenue analysis and customer metrics'
      },
      {
        system: 'Billing System',
        type: 'arr_calculation',
        id: 'ARR-AUG-2025',
        link: '/billing/arr/august-2025',
        lastUpdated: '30 minutes ago',
        description: 'Monthly ARR calculation and subscription metrics'
      },
      {
        system: 'Customer Success Platform',
        type: 'health_scores',
        id: 'HEALTH-Q3-2025',
        link: '/success/health-scores/q3-2025',
        lastUpdated: '2 hours ago',
        description: 'Customer health scores and engagement metrics'
      }
    ],
    transactionLineage: [
      {
        id: 'TXN-2025-0885',
        description: 'New Customer - TechCorp Inc',
        amount: 85000,
        currency: 'USD',
        date: '2025-08-28',
        type: 'credit',
        account: 'Revenue - New Customers',
        reference: 'INV-2025-0885',
        entity: 'US Inc'
      },
      {
        id: 'TXN-2025-0886',
        description: 'Expansion - DataFlow Solutions',
        amount: 45000,
        currency: 'USD',
        date: '2025-08-27',
        type: 'credit',
        account: 'Revenue - Expansions',
        reference: 'INV-2025-0886',
        entity: 'US Inc'
      },
      {
        id: 'TXN-2025-0887',
        description: 'Credit Memo - Northwind Corp',
        amount: 120000,
        currency: 'USD',
        date: '2025-08-26',
        type: 'debit',
        account: 'Revenue - Adjustments',
        reference: 'CM-2025-089',
        entity: 'US Inc'
      }
    ],
    confidence: 0.91,
    lastUpdated: '2025-08-31T09:45:00Z'
  },
  {
    id: 'expense_analysis_optimization',
    question: 'What are our largest expense categories and optimization opportunities?',
    category: 'Expense Management',
    priority: 'high',
    answer: {
      executiveSummary: 'Total monthly expenses reached $1.8M (+8% MoM), with technology infrastructure being the largest category at $420K (+22% MoM). Key optimization opportunities include AWS cost reduction ($45K potential savings), contractor spend management ($25K savings), and vendor consolidation. Immediate action is needed to control the AWS cost spike.',
      detailedAnalysis: 'Technology infrastructure costs have increased significantly due to unoptimized EC2 instances and increased data transfer. Contractor spend is $75K over budget due to unapproved additions. Legal costs increased 12% due to compliance requirements. We have identified $90K in potential savings through infrastructure optimization, vendor negotiations, and process improvements.',
      keyMetrics: [
        { metric: 'Total Monthly Expenses', value: '$1.8M', change: '+8% MoM', trend: 'up' },
        { metric: 'Technology Infrastructure', value: '$420K', change: '+22% MoM', trend: 'up' },
        { metric: 'People Costs', value: '$680K', change: '+8% MoM', trend: 'up' },
        { metric: 'Contractor Overrun', value: '$75K', change: 'Over budget', trend: 'up' },
        { metric: 'Optimization Potential', value: '$90K', change: 'Identified', trend: 'stable' }
      ],
      actionItems: [
        { priority: 'immediate', action: 'Right-size AWS EC2 instances', owner: 'DevOps Team', impact: '$45K monthly savings' },
        { priority: 'this_week', action: 'Implement contractor approval process', owner: 'HR Team', impact: 'Control overruns' },
        { priority: 'this_month', action: 'Negotiate Snowflake contract renewal', owner: 'Procurement', impact: '$30K annual savings' }
      ],
      risks: [
        { risk: 'AWS costs continue rising', probability: 'medium', impact: 'high', mitigation: 'Immediate infrastructure optimization' },
        { risk: 'Contractor costs spiral', probability: 'low', impact: 'medium', mitigation: 'Strict approval process' },
        { risk: 'Vendor price increases', probability: 'high', impact: 'medium', mitigation: 'Multi-year contracts' }
      ]
    },
    sources: [
      {
        system: 'General Ledger',
        type: 'expense_report',
        id: 'EXP-AUG-2025',
        link: '/gl/expenses/august-2025',
        lastUpdated: '1 hour ago',
        description: 'Detailed expense breakdown by GL account and department'
      },
      {
        system: 'AWS Cost Explorer',
        type: 'cost_analysis',
        id: 'AWS-COST-AUG',
        link: '/aws/cost-explorer/august-2025',
        lastUpdated: '45 minutes ago',
        description: 'AWS cost analysis and optimization recommendations'
      },
      {
        system: 'Procurement System',
        type: 'vendor_analysis',
        id: 'VENDOR-AUG-2025',
        link: '/procurement/vendors/august-2025',
        lastUpdated: '2 hours ago',
        description: 'Vendor spend analysis and contract management'
      }
    ],
    transactionLineage: [
      {
        id: 'TXN-2025-0894',
        description: 'AWS EC2 Instances - Production',
        amount: 45000,
        currency: 'USD',
        date: '2025-08-30',
        type: 'debit',
        account: 'Technology Infrastructure - AWS',
        reference: 'AWS-INV-0894',
        entity: 'US Inc'
      },
      {
        id: 'TXN-2025-0895',
        description: 'Contractor Payment - Development Team',
        amount: 75000,
        currency: 'USD',
        date: '2025-08-30',
        type: 'debit',
        account: 'Contractor Services',
        reference: 'PAY-CONTRACT-0895',
        entity: 'US Inc'
      },
      {
        id: 'TXN-2025-0896',
        description: 'Legal Services - Compliance',
        amount: 25000,
        currency: 'USD',
        date: '2025-08-29',
        type: 'debit',
        account: 'Legal & Professional Services',
        reference: 'LEGAL-INV-0896',
        entity: 'US Inc'
      }
    ],
    confidence: 0.89,
    lastUpdated: '2025-08-31T08:30:00Z'
  },
  {
    id: 'customer_health_churn_risk',
    question: 'Which customers are at risk of churning and what are the key drivers?',
    category: 'Customer Success',
    priority: 'high',
    answer: {
      executiveSummary: 'Two high-risk customers identified: Beta Inc ($420K ARR, 67/100 health score) with contract expiring in 14 days, and Northwind Corp ($180K ARR, 45/100 health score) following a $120K credit memo. Key drivers include service quality issues, executive sponsor changes, and declining usage metrics. Immediate executive engagement required.',
      detailedAnalysis: 'Beta Inc shows declining health score (-18 points) with 2 P1 support tickets open and recent executive sponsor change. Northwind Corp experienced service quality issues leading to the credit memo. DataFlow Solutions ($320K ARR) shows 15% usage decline but remains medium risk. New customer TechCorp Inc shows low engagement metrics.',
      keyMetrics: [
        { metric: 'High Risk Customers', value: '2', change: 'Beta Inc, Northwind', trend: 'stable' },
        { metric: 'Total ARR at Risk', value: '$600K', change: '3.6% of total ARR', trend: 'up' },
        { metric: 'Average Health Score', value: '68/100', change: '-5 points MoM', trend: 'down' },
        { metric: 'Open P1 Tickets', value: '2', change: 'Beta Inc only', trend: 'stable' }
      ],
      actionItems: [
        { priority: 'immediate', action: 'Executive call with Beta Inc CEO', owner: 'CEO', impact: 'Secure renewal' },
        { priority: 'immediate', action: 'Service quality review for Northwind', owner: 'Customer Success', impact: 'Restore confidence' },
        { priority: 'this_week', action: 'Health score monitoring dashboard', owner: 'Sales Ops', impact: 'Early detection' }
      ],
      risks: [
        { risk: 'Beta Inc churn', probability: 'high', impact: 'high', mitigation: 'Executive engagement + discount' },
        { risk: 'Northwind Corp churn', probability: 'medium', impact: 'medium', mitigation: 'Service improvement plan' },
        { risk: 'Cascade effect on other customers', probability: 'low', impact: 'high', mitigation: 'Proactive communication' }
      ]
    },
    sources: [
      {
        system: 'Customer Success Platform',
        type: 'health_score_report',
        id: 'HEALTH-AUG-2025',
        link: '/success/health-scores/august-2025',
        lastUpdated: '3 hours ago',
        description: 'Customer health scores and engagement metrics'
      },
      {
        system: 'Salesforce CRM',
        type: 'renewal_risk_analysis',
        id: 'RENEWAL-RISK-Q3',
        link: '/salesforce/renewal-risk/q3-2025',
        lastUpdated: '2 hours ago',
        description: 'Renewal risk analysis and contract expiration tracking'
      },
      {
        system: 'Support Ticketing System',
        type: 'ticket_analysis',
        id: 'TICKETS-P1-AUG',
        link: '/support/tickets/p1/august-2025',
        lastUpdated: '1 hour ago',
        description: 'P1 support ticket analysis and resolution metrics'
      }
    ],
    transactionLineage: [
      {
        id: 'TXN-2025-0888',
        description: 'Beta Inc - Monthly Subscription',
        amount: 35000,
        currency: 'USD',
        date: '2025-08-01',
        type: 'credit',
        account: 'Revenue - Recurring',
        reference: 'INV-BETA-0888',
        entity: 'US Inc'
      },
      {
        id: 'TXN-2025-0889',
        description: 'Northwind Corp - Credit Memo',
        amount: 120000,
        currency: 'USD',
        date: '2025-08-26',
        type: 'debit',
        account: 'Revenue - Adjustments',
        reference: 'CM-NORTHWIND-0889',
        entity: 'US Inc'
      }
    ],
    confidence: 0.87,
    lastUpdated: '2025-08-31T07:15:00Z'
  },
  {
    id: 'month_end_close_status',
    question: 'What is the status of our month-end close process?',
    category: 'Financial Close',
    priority: 'medium',
    answer: {
      executiveSummary: 'Month-end close is 85% complete with 2 days remaining. One critical item is overdue: APAC bank reconciliation (2 days late) with 3 outstanding items. UK VAT filing is due in 5 days and ready for submission. Overall close is on track but requires immediate attention to APAC reconciliation to avoid compliance issues.',
      detailedAnalysis: 'Completed tasks include US Inc bank reconciliation, revenue recognition, payroll accruals, fixed asset depreciation, and intercompany eliminations. The APAC reconciliation delay is due to 3 outstanding items requiring bank clarification. All supporting documentation is prepared for UK VAT filing. Close metrics show 2 days to close vs 3-day target.',
      keyMetrics: [
        { metric: 'Close Progress', value: '85%', change: 'On track', trend: 'stable' },
        { metric: 'Days to Close', value: '2', change: 'Target: 3 days', trend: 'stable' },
        { metric: 'Overdue Items', value: '1', change: 'APAC reconciliation', trend: 'down' },
        { metric: 'Open Items', value: '3', change: 'All APAC related', trend: 'stable' }
      ],
      actionItems: [
        { priority: 'immediate', action: 'Complete APAC bank reconciliation', owner: 'Mike@company.com', impact: 'Close compliance gap' },
        { priority: 'this_week', action: 'File UK VAT return', owner: 'Tax@company.com', impact: 'Meet deadline' },
        { priority: 'this_month', action: 'Review close process efficiency', owner: 'Finance Team', impact: 'Improve future closes' }
      ],
      risks: [
        { risk: 'APAC compliance breach', probability: 'medium', impact: 'high', mitigation: 'Immediate reconciliation completion' },
        { risk: 'UK VAT filing delay', probability: 'low', impact: 'medium', mitigation: 'Prepared documentation' },
        { risk: 'Close process inefficiency', probability: 'low', impact: 'low', mitigation: 'Process review and automation' }
      ]
    },
    sources: [
      {
        system: 'Close Management System',
        type: 'close_checklist',
        id: 'CLOSE-AUG-2025',
        link: '/close/checklist/august-2025',
        lastUpdated: '1 hour ago',
        description: 'Real-time month-end close checklist and status tracking'
      },
      {
        system: 'Compliance Calendar',
        type: 'filing_deadlines',
        id: 'DEADLINES-Q3-2025',
        link: '/compliance/deadlines/q3-2025',
        lastUpdated: '4 hours ago',
        description: 'Regulatory filing deadlines and requirements'
      },
      {
        system: 'Banking Integration',
        type: 'reconciliation_status',
        id: 'RECON-APAC-001',
        link: '/banking/reconciliation/apac-001',
        lastUpdated: '30 minutes ago',
        description: 'APAC bank reconciliation status and outstanding items'
      }
    ],
    transactionLineage: [
      {
        id: 'TXN-2025-0897',
        description: 'Month-end Accrual - Utilities',
        amount: 8500,
        currency: 'USD',
        date: '2025-08-31',
        type: 'debit',
        account: 'Utilities Expense',
        reference: 'ACC-UTIL-0897',
        entity: 'US Inc'
      },
      {
        id: 'TXN-2025-0898',
        description: 'Depreciation - Equipment',
        amount: 12500,
        currency: 'USD',
        date: '2025-08-31',
        type: 'debit',
        account: 'Depreciation Expense',
        reference: 'DEP-EQUIP-0898',
        entity: 'US Inc'
      }
    ],
    confidence: 0.96,
    lastUpdated: '2025-08-31T06:45:00Z'
  },
  {
    id: 'vendor_spend_analysis',
    question: 'Which vendors are we spending the most with and are there optimization opportunities?',
    category: 'Vendor Management',
    priority: 'medium',
    answer: {
      executiveSummary: 'Top vendor spend totals $403K (+8% MoM) with AWS leading at $95K (+22% MoM spike), followed by Snowflake at $85K. Key optimization opportunities include AWS infrastructure rightsizing ($45K monthly savings), Snowflake contract renewal negotiation ($30K annual savings), and vendor consolidation. Two major contract renewals due this quarter.',
      detailedAnalysis: 'AWS costs increased due to unoptimized EC2 instances and increased data transfer. Snowflake usage is 15% below plan, presenting renewal negotiation opportunity. Top 5 vendors represent 70% of total spend. New vendors added this month include 3 smaller service providers. Contract renewals due: Snowflake (Sep 30) and Adobe (Oct 15).',
      keyMetrics: [
        { metric: 'Total Vendor Spend', value: '$403K', change: '+8% MoM', trend: 'up' },
        { metric: 'Top 5 Vendor Share', value: '70%', change: 'Concentrated spend', trend: 'stable' },
        { metric: 'AWS Cost Increase', value: '+22%', change: '$95K spike', trend: 'up' },
        { metric: 'Optimization Potential', value: '$75K', change: 'Identified savings', trend: 'stable' }
      ],
      actionItems: [
        { priority: 'immediate', action: 'Right-size AWS EC2 instances', owner: 'DevOps Team', impact: '$45K monthly savings' },
        { priority: 'this_month', action: 'Negotiate Snowflake renewal terms', owner: 'Procurement', impact: '$30K annual savings' },
        { priority: 'next_quarter', action: 'Vendor consolidation analysis', owner: 'Procurement', impact: 'Reduce vendor count' }
      ],
      risks: [
        { risk: 'AWS costs continue rising', probability: 'medium', impact: 'high', mitigation: 'Immediate optimization' },
        { risk: 'Vendor price increases', probability: 'high', impact: 'medium', mitigation: 'Multi-year contracts' },
        { risk: 'Vendor concentration risk', probability: 'low', impact: 'medium', mitigation: 'Diversification strategy' }
      ]
    },
    sources: [
      {
        system: 'Accounts Payable',
        type: 'vendor_spend_report',
        id: 'VENDOR-SPEND-AUG-2025',
        link: '/ap/vendor-spend/august-2025',
        lastUpdated: '2 hours ago',
        description: 'Detailed vendor spend analysis and trends'
      },
      {
        system: 'Procurement System',
        type: 'contract_management',
        id: 'CONTRACTS-Q3-2025',
        link: '/procurement/contracts/q3-2025',
        lastUpdated: '1 hour ago',
        description: 'Contract renewal tracking and vendor management'
      },
      {
        system: 'AWS Cost Explorer',
        type: 'cost_optimization',
        id: 'AWS-OPTIMIZATION-AUG',
        link: '/aws/optimization/august-2025',
        lastUpdated: '45 minutes ago',
        description: 'AWS cost optimization recommendations and savings potential'
      }
    ],
    transactionLineage: [
      {
        id: 'TXN-2025-0899',
        description: 'AWS - Infrastructure Services',
        amount: 95000,
        currency: 'USD',
        date: '2025-08-30',
        type: 'debit',
        account: 'Technology Infrastructure',
        reference: 'INV-AWS-0899',
        entity: 'US Inc'
      },
      {
        id: 'TXN-2025-0900',
        description: 'Snowflake - Data Warehouse',
        amount: 85000,
        currency: 'USD',
        date: '2025-08-30',
        type: 'debit',
        account: 'Technology Infrastructure',
        reference: 'INV-SNOWFLAKE-0900',
        entity: 'US Inc'
      },
      {
        id: 'TXN-2025-0901',
        description: 'Rippling - Payroll Services',
        amount: 45000,
        currency: 'USD',
        date: '2025-08-30',
        type: 'debit',
        account: 'Human Resources',
        reference: 'INV-RIPPLING-0901',
        entity: 'US Inc'
      }
    ],
    confidence: 0.92,
    lastUpdated: '2025-08-31T05:30:00Z'
  },
  {
    id: 'ar_collection_analysis',
    question: 'Which customers have the highest outstanding receivables and what are our collection optimization opportunities?',
    category: 'Accounts Receivable',
    priority: 'high',
    answer: {
      executiveSummary: 'Total AR outstanding is $1.2M with 45% aged over 30 days, significantly above our 25% target. Top 3 customers represent 60% of outstanding AR: Beta Inc ($420K, 45 days past due), DataFlow Solutions ($320K, 15 days past due), and TechCorp Inc ($180K, 8 days past due). Key optimization opportunities include automated payment reminders ($50K potential recovery), early payment discounts ($25K savings), and improved credit terms management.',
      detailedAnalysis: 'AR aging shows concerning trends with $540K over 30 days (45% vs 25% target). Beta Inc\'s payment delay is due to internal approval process changes, while DataFlow Solutions has disputed invoice amounts. Collection efficiency has declined from 85% to 72% this quarter. New customer TechCorp Inc shows payment pattern concerns with 8-day average delay. We have $75K in identified optimization potential through process improvements and customer engagement.',
      keyMetrics: [
        { metric: 'Total Outstanding AR', value: '$1.2M', change: '+15% MoM', trend: 'up' },
        { metric: 'Current (0-30 days)', value: '$660K', change: '55% of total', trend: 'down' },
        { metric: '31-60 days', value: '$320K', change: '27% of total', trend: 'up' },
        { metric: '61-90 days', value: '$180K', change: '15% of total', trend: 'up' },
        { metric: 'Over 90 days', value: '$40K', change: '3% of total', trend: 'stable' },
        { metric: 'Collection Efficiency', value: '72%', change: '-13% QoQ', trend: 'down' },
        { metric: 'Top 3 Customer AR', value: '$920K', change: '60% of total', trend: 'up' }
      ],
      customerARBreakdown: [
        {
          customer: 'Beta Inc',
          current: 0,
          days30to60: 420000,
          days60to90: 0,
          over90: 0,
          total: 420000
        },
        {
          customer: 'DataFlow Solutions',
          current: 0,
          days30to60: 320000,
          days60to90: 0,
          over90: 0,
          total: 320000
        },
        {
          customer: 'TechCorp Inc',
          current: 180000,
          days30to60: 0,
          days60to90: 0,
          over90: 0,
          total: 180000
        },
        {
          customer: 'Northwind Corp',
          current: 0,
          days30to60: 0,
          days60to90: 120000,
          over90: 0,
          total: 120000
        },
        {
          customer: 'Acme Corp',
          current: 0,
          days30to60: 0,
          days60to90: 0,
          over90: 40000,
          total: 40000
        },
        {
          customer: 'Other Customers',
          current: 480000,
          days30to60: 0,
          days60to90: 60000,
          over90: 0,
          total: 540000
        }
      ],
      actionItems: [
        { priority: 'immediate', action: 'Executive call with Beta Inc CFO', owner: 'CFO', impact: 'Resolve $420K payment' },
        { priority: 'this_week', action: 'Implement automated payment reminders', owner: 'AR Team', impact: '$50K recovery potential' },
        { priority: 'this_month', action: 'Review credit terms for new customers', owner: 'Credit Team', impact: 'Prevent future delays' }
      ],
      risks: [
        { risk: 'Beta Inc payment default', probability: 'medium', impact: 'high', mitigation: 'Executive engagement + payment plan' },
        { risk: 'Collection efficiency continues declining', probability: 'high', impact: 'medium', mitigation: 'Process automation' },
        { risk: 'Cash flow impact from delayed collections', probability: 'high', impact: 'high', mitigation: 'Accelerated collection efforts' }
      ]
    },
    sources: [
      {
        system: 'Accounts Receivable System',
        type: 'ar_aging_report',
        id: 'AR-AGING-AUG-2025',
        link: '/ar/aging/august-2025',
        lastUpdated: '1 hour ago',
        description: 'Detailed AR aging analysis by customer and invoice'
      },
      {
        system: 'Customer Payment Portal',
        type: 'payment_patterns',
        id: 'PAYMENT-PATTERNS-Q3',
        link: '/payments/patterns/q3-2025',
        lastUpdated: '2 hours ago',
        description: 'Customer payment behavior analysis and trends'
      },
      {
        system: 'Collection Management',
        type: 'collection_efficiency',
        id: 'COLLECTION-EFF-AUG',
        link: '/collections/efficiency/august-2025',
        lastUpdated: '30 minutes ago',
        description: 'Collection efficiency metrics and optimization opportunities'
      }
    ],
    transactionLineage: [
      {
        id: 'TXN-2025-0902',
        description: 'Beta Inc - Invoice 2025-089',
        amount: 420000,
        currency: 'USD',
        date: '2025-07-15',
        type: 'debit',
        account: 'Accounts Receivable',
        reference: 'INV-BETA-089',
        entity: 'US Inc'
      },
      {
        id: 'TXN-2025-0903',
        description: 'DataFlow Solutions - Invoice 2025-092',
        amount: 320000,
        currency: 'USD',
        date: '2025-08-15',
        type: 'debit',
        account: 'Accounts Receivable',
        reference: 'INV-DATAFLOW-092',
        entity: 'US Inc'
      },
      {
        id: 'TXN-2025-0904',
        description: 'TechCorp Inc - Invoice 2025-095',
        amount: 180000,
        currency: 'USD',
        date: '2025-08-22',
        type: 'debit',
        account: 'Accounts Receivable',
        reference: 'INV-TECHCORP-095',
        entity: 'US Inc'
      },
      {
        id: 'TXN-2025-0905',
        description: 'Acme Corp - Payment Received',
        amount: 320000,
        currency: 'USD',
        date: '2025-08-29',
        type: 'credit',
        account: 'Accounts Receivable',
        reference: 'PAY-ACME-0905',
        entity: 'US Inc'
      }
    ],
    confidence: 0.88,
    lastUpdated: '2025-08-31T04:15:00Z'
  }
];

export const getQuestionById = (id: string): CFOQuestion | undefined => {
  return cfoQuestions.find(q => q.id === id);
};

export const getQuestionsByCategory = (category: string): CFOQuestion[] => {
  return cfoQuestions.filter(q => q.category === category);
};

export const getHighPriorityQuestions = (): CFOQuestion[] => {
  return cfoQuestions.filter(q => q.priority === 'high');
};
