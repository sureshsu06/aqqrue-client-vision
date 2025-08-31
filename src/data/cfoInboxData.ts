import { CFOInboxItem } from '@/types/cfoInbox';

export const mockCFOInboxItems: CFOInboxItem[] = [
  {
    id: "item_invoice_overdue",
    createdAt: "2025-08-31T09:00:00Z",
    category: "Cash",
    title: "Invoice past due: $320K from Acme Corp (45 days overdue)",
    entity: "US Inc.",
    impact: { 
      amount: -320000, 
      currency: "USD", 
      metric: "Cash",
      direction: "negative"
    },
    urgency: { dueInDays: -45, isOverdue: true },
    confidence: 0.95,
    priorityScore: 92,
    status: "new",
    owner: { suggested: "collections@company.com" },
    why: "Invoice INV-2025-089 due 45 days ago; customer unresponsive to dunning notices.",
    assumptions: ["Payment terms unchanged", "No credit hold"],
    sources: [
      { 
        system: "Billing", 
        type: "invoice", 
        id: "INV-2025-089", 
        link: "https://billing.company.com/invoice/INV-2025-089",
        lastUpdated: "2h ago"
      }
    ],
    recommendations: [
      { 
        id: "escalate_collections", 
        label: "Escalate to collections team", 
        estimatedImpact: 320000, 
        probability: 0.75,
        action: "Assign to senior collector",
        playbook: "Past due AR escalation"
      },
      { 
        id: "legal_notice", 
        label: "Send legal notice", 
        estimatedImpact: 200000, 
        probability: 0.45,
        action: "Prepare legal documentation",
        playbook: "Legal collections"
      }
    ],
    severity: "high",
    dataFreshness: "2h ago"
  },
  {
    id: "item_renewal_beta",
    createdAt: "2025-08-31T08:45:00Z",
    category: "ARR",
    title: "Large renewal due in 14d: $420K ARR (Beta Inc)",
    entity: "US Inc.",
    impact: { 
      amount: -420000, 
      currency: "USD", 
      metric: "ARR",
      direction: "negative"
    },
    urgency: { dueInDays: 14, isOverdue: false },
    confidence: 0.88,
    priorityScore: 89,
    status: "new",
    owner: { suggested: "sarah@company.com" },
    why: "Contract expires Sep 14; health score 67; 2 P1 support tickets open.",
    assumptions: ["No contract changes", "Standard renewal terms"],
    sources: [
      { 
        system: "Salesforce", 
        type: "opportunity", 
        id: "OPP-2025-156", 
        link: "https://salesforce.com/OPP-2025-156",
        lastUpdated: "1h ago"
      },
      { 
        system: "Billing", 
        type: "subscription", 
        id: "SUB-2024-089", 
        link: "https://billing.company.com/SUB-2024-089",
        lastUpdated: "30m ago"
      }
    ],
    recommendations: [
      { 
        id: "renewal_offer", 
        label: "Send renewal offer with discount", 
        estimatedImpact: 420000, 
        probability: 0.78,
        action: "Create renewal proposal",
        playbook: "ARR renewal risk"
      },
      { 
        id: "exec_outreach", 
        label: "Executive sponsor outreach", 
        estimatedImpact: 300000, 
        probability: 0.65,
        action: "Schedule executive call",
        playbook: "Strategic renewal"
      }
    ],
    severity: "high",
    dataFreshness: "SFDC 1h, Billing 30m"
  },
  {
    id: "item_aws_spike",
    createdAt: "2025-08-31T08:30:00Z",
    category: "Spend",
    title: "AWS cost spike: +22% vs last week ($95K variance)",
    entity: "US Inc.",
    impact: { 
      amount: -95000, 
      currency: "USD", 
      metric: "Gross Margin",
      direction: "negative"
    },
    urgency: { dueInDays: 7, isOverdue: false },
    confidence: 0.92,
    priorityScore: 76,
    status: "new",
    owner: { suggested: "devops@company.com" },
    why: "EC2 instances 35% over-provisioned; RDS clusters not optimized; new data pipeline deployed.",
    assumptions: ["Usage patterns continue", "No immediate rollback"],
    sources: [
      { 
        system: "AWS", 
        type: "billing_api", 
        id: "cost_report_week", 
        link: "https://aws.amazon.com/cost_report_week",
        lastUpdated: "45m ago"
      }
    ],
    recommendations: [
      { 
        id: "rightsize_instances", 
        label: "Right-size EC2 instances", 
        estimatedImpact: 45000, 
        probability: 0.85,
        action: "Optimize infrastructure",
        playbook: "AWS cost optimization"
      },
      { 
        id: "reserved_instances", 
        label: "Purchase reserved instances", 
        estimatedImpact: 30000, 
        probability: 0.70,
        action: "Contact AWS account manager",
        playbook: "Reserved instance strategy"
      }
    ],
    severity: "medium",
    dataFreshness: "AWS 45m"
  },
  {
    id: "item_bank_balance",
    createdAt: "2025-08-31T08:15:00Z",
    category: "Cash",
    title: "Bank balance below threshold: APAC entity ($480K vs $1M min)",
    entity: "APAC Inc.",
    impact: { 
      amount: -520000, 
      currency: "USD", 
      metric: "Cash",
      direction: "negative"
    },
    urgency: { dueInDays: 0, isOverdue: true },
    confidence: 0.98,
    priorityScore: 94,
    status: "new",
    owner: { suggested: "treasury@company.com" },
    why: "Balance $480K below $1M minimum threshold; large vendor payment due tomorrow.",
    assumptions: ["No incoming payments today", "Vendor payment cannot be delayed"],
    sources: [
      { 
        system: "Treasury", 
        type: "balance", 
        id: "apac_balance", 
        link: "https://treasury.company.com/apac_balance",
        lastUpdated: "15m ago"
      }
    ],
    recommendations: [
      { 
        id: "interco_transfer", 
        label: "Intercompany transfer from US", 
        estimatedImpact: 520000, 
        probability: 0.95,
        action: "Initiate transfer",
        playbook: "Liquidity management"
      },
      { 
        id: "vendor_negotiation", 
        label: "Negotiate vendor payment delay", 
        estimatedImpact: 300000, 
        probability: 0.60,
        action: "Contact vendor",
        playbook: "Vendor payment terms"
      }
    ],
    severity: "high",
    dataFreshness: "15m ago"
  },
  {
    id: "item_payroll_variance",
    createdAt: "2025-08-31T08:00:00Z",
    category: "People",
    title: "Payroll variance: Contractors +$75K MoM",
    entity: "US Inc.",
    impact: { 
      amount: -75000, 
      currency: "USD", 
      metric: "Opex",
      direction: "negative"
    },
    urgency: { dueInDays: 14, isOverdue: false },
    confidence: 0.89,
    priorityScore: 68,
    status: "new",
    owner: { suggested: "hr@company.com" },
    why: "Contractor spend $275K vs $200K budget; 3 new contractors added without approval.",
    assumptions: ["Contractors needed for project delivery", "No immediate termination"],
    sources: [
      { 
        system: "Rippling", 
        type: "payroll_report", 
        id: "payroll_august", 
        link: "https://rippling.com/payroll_august",
        lastUpdated: "2h ago"
      }
    ],
    recommendations: [
      { 
        id: "approval_process", 
        label: "Implement contractor approval process", 
        estimatedImpact: 0, 
        probability: 1.0,
        action: "Create approval workflow",
        playbook: "Contractor management"
      },
      { 
        id: "budget_review", 
        label: "Review contractor budget allocation", 
        estimatedImpact: 25000, 
        probability: 0.70,
        action: "Analyze contractor utilization",
        playbook: "Budget optimization"
      }
    ],
    severity: "medium",
    dataFreshness: "Rippling 2h"
  },
  {
    id: "item_snowflake_payment",
    createdAt: "2025-08-31T07:45:00Z",
    category: "Spend",
    title: "Upcoming vendor payment: Snowflake $600K in 30d",
    entity: "US Inc.",
    impact: { 
      amount: -600000, 
      currency: "USD", 
      metric: "Cash",
      direction: "negative"
    },
    urgency: { dueInDays: 30, isOverdue: false },
    confidence: 0.96,
    priorityScore: 58,
    status: "new",
    owner: { suggested: "procurement@company.com" },
    why: "Annual contract renewal due Sep 30; usage 15% below plan; opportunity to optimize.",
    assumptions: ["Contract renewal required", "Usage patterns continue"],
    sources: [
      { 
        system: "AP system", 
        type: "vendor_contract", 
        id: "snowflake_2025", 
        link: "https://ap.company.com/snowflake_2025",
        lastUpdated: "1h ago"
      }
    ],
    recommendations: [
      { 
        id: "usage_optimization", 
        label: "Optimize usage before renewal", 
        estimatedImpact: 90000, 
        probability: 0.80,
        action: "Review data warehouse usage",
        playbook: "Vendor optimization"
      },
      { 
        id: "negotiate_terms", 
        label: "Negotiate better payment terms", 
        estimatedImpact: 600000, 
        probability: 0.65,
        action: "Contact vendor",
        playbook: "Payment terms negotiation"
      }
    ],
    severity: "low",
    dataFreshness: "AP system 1h"
  },
  {
    id: "item_month_end_overdue",
    createdAt: "2025-08-31T07:30:00Z",
    category: "Close",
    title: "Month-end close task overdue: Bank recon (APAC entity)",
    entity: "APAC Inc.",
    impact: { 
      amount: 0, 
      currency: "USD", 
      metric: "Compliance",
      direction: "negative"
    },
    urgency: { dueInDays: -2, isOverdue: true },
    confidence: 0.94,
    priorityScore: 82,
    status: "in_progress",
    owner: { suggested: "controller@company.com" },
    why: "Bank reconciliation overdue by 2 days; 3 outstanding items need resolution.",
    assumptions: ["All supporting docs available", "No new transactions"],
    sources: [
      { 
        system: "Close mgmt system", 
        type: "close_checklist", 
        id: "apac_august_close", 
        link: "https://close.company.com/apac_august_close",
        lastUpdated: "3h ago"
      }
    ],
    recommendations: [
      { 
        id: "complete_recon", 
        label: "Complete bank reconciliation", 
        estimatedImpact: 0, 
        probability: 1.0,
        action: "Reconcile outstanding items",
        playbook: "Bank reconciliation"
      },
      { 
        id: "escalate_issues", 
        label: "Escalate unresolved items", 
        estimatedImpact: 0, 
        probability: 0.85,
        action: "Contact bank for clarification",
        playbook: "Reconciliation escalation"
      }
    ],
    severity: "high",
    dataFreshness: "Close mgmt system 3h"
  },
  {
    id: "item_fx_exposure",
    createdAt: "2025-08-31T07:15:00Z",
    category: "Cash",
    title: "FX exposure: €3.2M receivables unhedged (USD equiv $3.6M)",
    entity: "EU Inc.",
    impact: { 
      amount: -360000, 
      currency: "USD", 
      metric: "Cash",
      direction: "negative"
    },
    urgency: { dueInDays: 7, isOverdue: false },
    confidence: 0.91,
    priorityScore: 74,
    status: "new",
    owner: { suggested: "treasury@company.com" },
    why: "€3.2M receivables due in 30-60 days; no hedge protection; EUR/USD volatility high.",
    assumptions: ["Receivables will be collected", "No immediate hedge needed"],
    sources: [
      { 
        system: "Treasury/ERP", 
        type: "receivables_report", 
        id: "eur_receivables", 
        link: "https://treasury.company.com/eur_receivables",
        lastUpdated: "1h ago"
      }
    ],
    recommendations: [
      { 
        id: "hedge_receivables", 
        label: "Hedge €2M receivables", 
        estimatedImpact: 200000, 
        probability: 0.75,
        action: "Execute forward contracts",
        playbook: "FX hedging strategy"
      },
      { 
        id: "accelerate_collections", 
        label: "Accelerate collections", 
        estimatedImpact: 160000, 
        probability: 0.60,
        action: "Offer early payment discounts",
        playbook: "Collections acceleration"
      }
    ],
    severity: "medium",
    dataFreshness: "Treasury/ERP 1h"
  },
  {
    id: "item_vat_filing",
    createdAt: "2025-08-31T07:00:00Z",
    category: "Close",
    title: "VAT filing deadline in 5d: UK entity",
    entity: "UK Inc.",
    impact: { 
      amount: 0, 
      currency: "GBP", 
      metric: "Compliance",
      direction: "negative"
    },
    urgency: { dueInDays: 5, isOverdue: false },
    confidence: 0.97,
    priorityScore: 66,
    status: "new",
    owner: { suggested: "tax@company.com" },
    why: "UK VAT return due Sep 5; all data prepared; ready for filing.",
    assumptions: ["No last-minute changes", "Filing system operational"],
    sources: [
      { 
        system: "Compliance calendar", 
        type: "tax_deadline", 
        id: "uk_vat_september", 
        link: "https://compliance.company.com/uk_vat_september",
        lastUpdated: "4h ago"
      }
    ],
    recommendations: [
      { 
        id: "file_vat", 
        label: "File VAT return", 
        estimatedImpact: 0, 
        probability: 1.0,
        action: "Submit return",
        playbook: "VAT filing"
      },
      { 
        id: "review_data", 
        label: "Final data review", 
        estimatedImpact: 0, 
        probability: 0.95,
        action: "Verify calculations",
        playbook: "Tax review process"
      }
    ],
    severity: "low",
    dataFreshness: "Compliance calendar 4h"
  },
  {
    id: "item_credit_memo",
    createdAt: "2025-08-31T06:45:00Z",
    category: "ARR",
    title: "Large customer credit memo issued: $120K (Northwind)",
    entity: "US Inc.",
    impact: { 
      amount: -120000, 
      currency: "USD", 
      metric: "Revenue",
      direction: "negative"
    },
    urgency: { dueInDays: 14, isOverdue: false },
    confidence: 0.93,
    priorityScore: 71,
    status: "new",
    owner: { suggested: "billing@company.com" },
    why: "Credit memo $120K issued for service quality issues; customer satisfaction at risk.",
    assumptions: ["Credit memo justified", "Service issues resolved"],
    sources: [
      { 
        system: "Billing", 
        type: "credit_memo", 
        id: "CM-2025-089", 
        link: "https://billing.company.com/credit_memo/CM-2025-089",
        lastUpdated: "2h ago"
      }
    ],
    recommendations: [
      { 
        id: "customer_outreach", 
        label: "Customer satisfaction outreach", 
        estimatedImpact: 60000, 
        probability: 0.70,
        action: "Schedule customer call",
        playbook: "Customer retention"
      },
      { 
        id: "service_review", 
        label: "Review service quality", 
        estimatedImpact: 40000, 
        probability: 0.85,
        action: "Analyze service metrics",
        playbook: "Service improvement"
      }
    ],
    severity: "medium",
    dataFreshness: "2h ago"
  }
];

export const mockCFOInboxStats: CFOInboxStats = {
  total: 10,
  new: 10,
  highPriority: 5,
  dueToday: 2,
  overdue: 3,
  byCategory: {
    ARR: 2,
    Cash: 3,
    Spend: 2,
    People: 1,
    Close: 2,
    Ops: 0
  }
};
