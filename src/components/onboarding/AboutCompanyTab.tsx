import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3, Check, X, Info } from "lucide-react";
import { InlineEditField } from "./InlineEditField";

interface BusinessOverview {
  natureOfBusiness: string;
  legalEntity: string;
  reportingCurrency: string;
  fyStart: string;
  subsidiaries: string[];
  primaryChannels: string[];
  primaryGeos: string[];
  paymentProcessors: string[];
  primaryBanks: string[];
  payrollTool: string;
  expenseTool: string;
  auditor: string;
  notes: string;
}

interface ToolStack {
  geo: string;
  crm: string;
  erp: string;
  paymentProcessor: string;
  primaryBank: string;
  payroll: string;
  expenseTool: string;
}

interface InternalControl {
  id: string;
  title: string;
  rule: string;
  severity: string;
  lastVerified: string;
}

interface AccountingPolicy {
  id: string;
  title: string;
  policy: string;
  effectiveDate: string;
}

interface Suggestion {
  id: string;
  type: string;
  text: string;
  confidence: number;
}

interface ChangeHistory {
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  actorRole: string;
}

const getRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

// Tooltip component
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export const AboutCompanyTab = () => {
  const [businessOverview, setBusinessOverview] = useState<BusinessOverview>({
    natureOfBusiness: "SaaS AI OKR software platform",
    legalEntity: "Ripple Technologies Inc.",
    reportingCurrency: "USD",
    fyStart: "April",
    subsidiaries: ["Ripple Technologies India Pvt Ltd"],
    primaryChannels: ["Direct Sales", "Partner Channel", "Self-Service", "Enterprise Sales"],
    primaryGeos: ["United States", "India"],
    paymentProcessors: ["Stripe (US)", "Razorpay (India)", "PayPal (Global)"],
    primaryBanks: ["Chase Bank (US)", "HDFC Bank (India)", "ICICI Bank (India)"],
    payrollTool: "Gusto (US), Keka (India)",
    expenseTool: "Expensify (Corporate Cards)",
    auditor: "PwC India",
    notes: "Subscription-based revenue model. Monthly and annual billing cycles. Enterprise customers with custom contracts."
  });

  const [toolStack, setToolStack] = useState<ToolStack[]>([
    { 
      geo: "US", 
      crm: "HubSpot CRM", 
      erp: "NetSuite", 
      paymentProcessor: "Stripe",
      primaryBank: "Chase Bank",
      payroll: "Gusto",
      expenseTool: "Expensify"
    },
    { 
      geo: "India", 
      crm: "HubSpot CRM", 
      erp: "Tally ERP", 
      paymentProcessor: "Razorpay",
      primaryBank: "HDFC Bank",
      payroll: "Keka",
      expenseTool: "Expensify"
    }
  ]);

  const [internalControls, setInternalControls] = useState<InternalControl[]>([
    { 
      id: "IC-001", 
      title: "Subscription revenue controls",
      rule: "All subscription revenue must be recognized in accordance with ASC 606. Monthly reconciliation between billing system and accounting system is mandatory. Revenue recognition schedules are maintained for all subscription contracts with proper deferral calculations. Contract modifications require controller approval and updated revenue schedules. Automated revenue recognition system flags discrepancies for manual review. Monthly aging analysis of deferred revenue with variance explanations. Customer contract terms are validated against revenue recognition policies. Quarterly review of revenue recognition patterns for unusual activity. All revenue adjustments require dual approval and supporting documentation. Revenue recognition training is mandatory for all finance team members.",
      severity: "high",
      lastVerified: "2025-09-23T23:58:00Z"
    },
    { 
      id: "IC-002", 
      title: "Customer data security",
      rule: "All customer data access requires proper authorization and is logged. Data encryption is mandatory for all customer information at rest and in transit. Regular security audits are performed quarterly with penetration testing. Access controls are reviewed monthly with immediate revocation of unused accounts. Customer data retention policies are strictly enforced with automated deletion. Incident response procedures are documented and tested annually. All third-party integrations undergo security assessment before implementation. Employee access to production data requires manager approval and is time-limited. Data backup and recovery procedures are tested monthly with documented results.",
      severity: "high",
      lastVerified: "2025-09-23T23:40:00Z"
    },
    { 
      id: "IC-003", 
      title: "Software development controls",
      rule: "All code changes require peer review and automated testing before deployment. Production deployments require dual approval from development and operations teams. Version control systems maintain complete audit trail of all code changes. Automated testing coverage must exceed 80% for all new features. Security scanning is mandatory for all code before production deployment. Database schema changes require DBA approval and rollback procedures. API rate limiting and authentication controls are enforced for all endpoints. Performance monitoring alerts are configured for all critical system components.",
      severity: "high",
      lastVerified: "2025-09-23T23:50:00Z"
    },
    { 
      id: "IC-004", 
      title: "Segregation of duties (SoD)",
      rule: "Person who creates customer contracts cannot approve revenue recognition. Development team cannot directly access production databases. Finance team cannot modify customer billing configurations. System administrators cannot access customer data without proper authorization. Role-based access controls are enforced across all systems with quarterly reviews. No single individual can initiate, approve, and record customer transactions. Regular SoD testing is performed quarterly with remediation of violations. Exception reporting identifies potential SoD violations for immediate investigation.",
      severity: "high",
      lastVerified: "2025-09-23T23:30:00Z"
    },
    { 
      id: "IC-005", 
      title: "Journal entry reviews",
      rule: "All month-end adjusting JEs require two approvers for amounts > $20,000. Recurring JEs reviewed quarterly. Journal entry templates are pre-approved for standard transactions. All manual journal entries require detailed supporting documentation. Automated journal entries are subject to exception reporting and review. Monthly reconciliation of all balance sheet accounts with variance analysis. Journal entry approval workflow includes automated routing and escalation. Supporting documentation must be attached to all journal entries. Quarterly review of journal entry patterns for unusual activity.",
      severity: "medium",
      lastVerified: "2025-09-01T09:00:00Z"
    }
  ]);

  const [accountingPolicies, setAccountingPolicies] = useState<AccountingPolicy[]>([
    { 
      id: "AP-001", 
      title: "Revenue recognition",
      policy: "Subscription revenue recognized ratably over the contract term using ASC 606. Performance obligations include software access, support, and updates. Contract modifications are accounted for as separate contracts or contract modifications based on substance. Setup fees are deferred and recognized over the customer relationship period. Professional services revenue recognized as services are performed using percentage-of-completion method. Revenue from multi-year contracts is recognized monthly based on contract value and term. Customer refunds and credits are recorded as contra-revenue when granted. Revenue recognition schedules are maintained for all contracts with proper deferral calculations.",
      effectiveDate: "2025-01-01"
    },
    { 
      id: "AP-002", 
      title: "Software development costs",
      policy: "Research and development costs are expensed as incurred. Software development costs are capitalized only after technological feasibility is established. Capitalized costs include direct materials, direct labor, and overhead costs directly attributable to software development. Amortization begins when the software is available for general release and is calculated using the greater of straight-line method or percentage of revenue method. Useful life is estimated at 3-5 years based on expected product lifecycle. Impairment testing is performed annually or when indicators of impairment exist. Costs related to maintenance and minor enhancements are expensed as incurred.",
      effectiveDate: "2024-01-01"
    },
    { 
      id: "AP-003", 
      title: "Deferred revenue",
      policy: "Customer prepayments and annual subscriptions are recorded as deferred revenue and recognized ratably over the service period. Deferred revenue is classified as current or non-current based on expected recognition timing. Contract liabilities are separately disclosed and reconciled monthly. Customer contract modifications may require adjustment to deferred revenue balances. Unearned revenue is reviewed quarterly for potential adjustments due to contract changes or cancellations. Revenue recognition schedules are maintained for all deferred revenue with proper aging analysis.",
      effectiveDate: "2025-01-01"
    },
    { 
      id: "AP-004", 
      title: "Foreign currency",
      policy: "Functional currency = USD for US entity, INR for India entity. Use month-end spot rate for translation of India subsidiary. FX gains/losses booked to other income/expense. All foreign currency transactions are initially recorded at the exchange rate prevailing on the transaction date. Monetary assets and liabilities denominated in foreign currencies are translated at the closing rate at each balance sheet date. Non-monetary items are carried at historical cost. Exchange differences arising on translation are recognized in profit and loss account. For subsidiaries, assets and liabilities are translated at closing rates, income and expenses at average rates.",
      effectiveDate: "2024-07-01"
    },
    { 
      id: "AP-005", 
      title: "Tax treatment",
      policy: "Income tax provisions calculated based on applicable tax rates in each jurisdiction. Current tax measured at amount expected to be paid to tax authorities. Deferred tax recognized for temporary differences between carrying amounts and tax bases. Tax credits and incentives recognized when there is reasonable certainty of utilization. Transfer pricing documentation maintained for related party transactions between US and India entities. Tax returns filed within prescribed due dates in each jurisdiction. Tax positions evaluated for uncertain tax treatments with provisions made where necessary. R&D tax credits claimed where applicable for software development activities.",
      effectiveDate: "2025-01-01"
    }
  ]);

  const [suggestions] = useState<Suggestion[]>([
    {
      id: "S-001",
      type: "Best practice",
      text: "Implement automated revenue recognition for subscription contracts to reduce manual processing by 80% and improve accuracy.",
      confidence: 0.89
    },
    {
      id: "S-002",
      type: "Policy gap",
      text: "Define clear policy for customer contract modifications and their impact on deferred revenue recognition schedules.",
      confidence: 0.76
    },
    {
      id: "S-003",
      type: "Automation",
      text: "Auto-sync billing data from Stripe/Razorpay to accounting system to eliminate manual revenue reconciliation (saves ~5 hrs/week).",
      confidence: 0.92
    },
    {
      id: "S-004",
      type: "Control",
      text: "Add automated alerts for unusual customer churn patterns to enable proactive revenue protection measures.",
      confidence: 0.71
    }
  ]);

  const [changeHistory] = useState<ChangeHistory[]>([
    {
      timestamp: "2025-09-24T00:18:00Z",
      actor: "Priya Sharma",
      action: "Updated revenue recognition policy",
      details: "Modified subscription revenue recognition to align with ASC 606 standards for multi-year contracts",
      actorRole: "CFO"
    },
    {
      timestamp: "2025-09-23T23:55:00Z",
      actor: "David Kim",
      action: "Approved India entity setup",
      details: "Approved Tally ERP configuration and HDFC bank account connections for India subsidiary",
      actorRole: "Controller"
    },
    {
      timestamp: "2025-09-23T23:40:00Z",
      actor: "Rhythms AI",
      action: "Inferred customer data security controls",
      details: "Auto-generated data security policies based on SOC 2 compliance requirements and customer data handling patterns",
      actorRole: "AI Agent"
    },
    {
      timestamp: "2025-09-23T23:00:00Z",
      actor: "Onboarding Bot",
      action: "Generated revenue recognition SOP",
      details: "Auto-generated draft SOP: 'Subscription Revenue Recognition v1.0' saved to /onboarding/sops/RevenueRecognition_v1.0.docx",
      actorRole: "Agent"
    }
  ]);

  const handleBusinessOverviewChange = (field: keyof BusinessOverview, value: string) => {
    setBusinessOverview(prev => ({ ...prev, [field]: value }));
  };

  const handleInternalControlChange = (id: string, value: string) => {
    setInternalControls(prev => 
      prev.map(control => 
        control.id === id ? { ...control, rule: value } : control
      )
    );
  };

  const handleAccountingPolicyChange = (id: string, value: string) => {
    setAccountingPolicies(prev => 
      prev.map(policy => 
        policy.id === id ? { ...policy, policy: value } : policy
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        {/* Section Header - smaller font */}
        <p className="text-sm font-medium text-blue-600 mb-2">
          Overview
        </p>
        
        {/* Sub-section Title - large and semi-bold */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Business Overview
        </h2>
        
        {/* Sub-section Description - medium grey */}
        <p className="text-base text-gray-600 mb-6">
          Company information, accounting setup, and operational details for financial management and compliance.
        </p>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Business Overview */}
          <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-[16px] leading-6 font-semibold text-[var(--text)]">Business Overview</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-[12px] text-[var(--muted)]">Entity:</span>
                    <select className="px-2 py-1 text-[12px] border border-[var(--border)] rounded bg-white hover:border-[var(--primary)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors">
                      <option value="us">United States</option>
                      <option value="canada">Canada</option>
                      <option value="uk">United Kingdom</option>
                    </select>
                  </div>
                </div>
                <button className="p-2 text-[var(--primary)] hover:bg-[var(--primary-weak)] rounded-md transition-colors">
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>

              {/* Executive Summary */}
              <div className="mb-6 p-4 bg-[var(--primary-weak)] rounded-lg border border-[var(--border)]">
                  <div className="text-[13px] text-[var(--text)] leading-relaxed">
                  Ripple Technologies Inc. is a fast-growing SaaS company building AI-powered OKR software, operating across the United States and India. The company serves enterprise customers through direct sales, partner channels, and self-service platforms. With a dual-entity structure, Ripple manages operations through region-specific ERP systems (NetSuite for US, Tally for India) and payment processors (Stripe for US, Razorpay for India) while maintaining standardized expense management through Expensify corporate cards...
                </div>
                <button className="mt-2 text-[11px] text-[var(--primary)] hover:underline font-medium">
                  Read full summary
                </button>
              </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-[13px] text-[var(--muted)]">Nature of business</div>
                    <Tooltip content="Source: Meeting transcript (Sept 18)">
                      <Info className="h-3 w-3 text-[var(--muted)] hover:text-[var(--primary)] transition-colors" />
                    </Tooltip>
                  </div>
                  <InlineEditField
                    value={businessOverview.natureOfBusiness}
                    onChange={(value) => handleBusinessOverviewChange('natureOfBusiness', value)}
                    className="text-[13px] text-[var(--text)] font-normal hover:bg-[var(--primary-weak)] rounded px-2 py-1 -mx-2 transition-all duration-200"
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-[13px] text-[var(--muted)]">Legal entity</div>
                    <Tooltip content="Source: Controller approval">
                      <Info className="h-3 w-3 text-[var(--muted)] hover:text-[var(--primary)] transition-colors" />
                    </Tooltip>
                  </div>
                  <InlineEditField
                    value={businessOverview.legalEntity}
                    onChange={(value) => handleBusinessOverviewChange('legalEntity', value)}
                    className="text-[13px] text-[var(--text)] font-normal hover:bg-[var(--primary-weak)] rounded px-2 py-1 -mx-2 transition-all duration-200"
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-[13px] text-[var(--muted)]">Reporting currency</div>
                    <Tooltip content="Source: System inference from company registration">
                      <Info className="h-3 w-3 text-[var(--muted)] hover:text-[var(--primary)] transition-colors" />
                    </Tooltip>
                  </div>
                  <InlineEditField
                    value={businessOverview.reportingCurrency}
                    onChange={(value) => handleBusinessOverviewChange('reportingCurrency', value)}
                    className="text-[13px] text-[var(--text)] font-normal hover:bg-[var(--primary-weak)] rounded px-2 py-1 -mx-2 transition-all duration-200"
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-[13px] text-[var(--muted)]">Primary channels</div>
                    <Tooltip content="Source: Meeting transcript (Sept 18)">
                      <Info className="h-3 w-3 text-[var(--muted)] hover:text-[var(--primary)] transition-colors" />
                    </Tooltip>
                  </div>
                  <div className="text-[13px] text-[var(--text)] font-normal">
                    {businessOverview.primaryChannels.join(", ")}
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-[13px] text-[var(--muted)]">Primary geos</div>
                    <Tooltip content="Source: Meeting transcript (Sept 18)">
                      <Info className="h-3 w-3 text-[var(--muted)] hover:text-[var(--primary)] transition-colors" />
                    </Tooltip>
                  </div>
                  <div className="text-[13px] text-[var(--text)] font-normal">
                    {businessOverview.primaryGeos.join(", ")}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-[13px] text-[var(--muted)]">Payment processors</div>
                    <Tooltip content="Source: Meeting transcript (Sept 18)">
                      <Info className="h-3 w-3 text-[var(--muted)] hover:text-[var(--primary)] transition-colors" />
                    </Tooltip>
                  </div>
                  <div className="text-[13px] text-[var(--text)] font-normal">
                    {businessOverview.paymentProcessors.join(", ")}
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-[13px] text-[var(--muted)]">Primary banks</div>
                    <Tooltip content="Source: Meeting transcript (Sept 18)">
                      <Info className="h-3 w-3 text-[var(--muted)] hover:text-[var(--primary)] transition-colors" />
                    </Tooltip>
                  </div>
                  <div className="text-[13px] text-[var(--text)] font-normal">
                    {businessOverview.primaryBanks.join(", ")}
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-[13px] text-[var(--muted)]">Payroll tool</div>
                    <Tooltip content="Source: Meeting transcript (Sept 18)">
                      <Info className="h-3 w-3 text-[var(--muted)] hover:text-[var(--primary)] transition-colors" />
                    </Tooltip>
                  </div>
                  <InlineEditField
                    value={businessOverview.payrollTool}
                    onChange={(value) => handleBusinessOverviewChange('payrollTool', value)}
                    className="text-[13px] text-[var(--text)] font-normal hover:bg-[var(--primary-weak)] rounded px-2 py-1 -mx-2 transition-all duration-200"
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-[13px] text-[var(--muted)]">Expense tool</div>
                    <Tooltip content="Source: Meeting transcript (Sept 18)">
                      <Info className="h-3 w-3 text-[var(--muted)] hover:text-[var(--primary)] transition-colors" />
                    </Tooltip>
                  </div>
                  <InlineEditField
                    value={businessOverview.expenseTool}
                    onChange={(value) => handleBusinessOverviewChange('expenseTool', value)}
                    className="text-[13px] text-[var(--text)] font-normal hover:bg-[var(--primary-weak)] rounded px-2 py-1 -mx-2 transition-all duration-200"
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-[13px] text-[var(--muted)]">Auditor</div>
                    <Tooltip content="Source: Controller approval">
                      <Info className="h-3 w-3 text-[var(--muted)] hover:text-[var(--primary)] transition-colors" />
                    </Tooltip>
                  </div>
                  <InlineEditField
                    value={businessOverview.auditor}
                    onChange={(value) => handleBusinessOverviewChange('auditor', value)}
                    className="text-[13px] text-[var(--text)] font-normal hover:bg-[var(--primary-weak)] rounded px-2 py-1 -mx-2 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Tool Stack */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-[16px] leading-6 font-semibold text-[var(--text)]">Tool Stack (by Geo)</h3>
              <button className="p-2 text-[var(--primary)] hover:bg-[var(--primary-weak)] rounded-md transition-colors">
                  <Edit3 className="h-4 w-4" />
              </button>
            </div>
            
              <div className="overflow-x-auto">
              <table className="w-full text-[12px] text-[var(--text)]">
                <thead className="text-[11px] text-[var(--muted)]">
                  <tr>
                    <th className="text-left py-4 w-20">Geo</th>
                    <th className="text-left py-4">CRM</th>
                    <th className="text-left py-4">ERP</th>
                    <th className="text-left py-4">Payment processor</th>
                    <th className="text-left py-4">Primary bank</th>
                    <th className="text-left py-4">Payroll</th>
                    <th className="text-left py-4">Expense tool</th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {toolStack.map((tool, index) => (
                    <tr key={index} className="hover:bg-[var(--bg)] transition-colors">
                      <td className="py-4 w-20">{tool.geo}</td>
                      <td className="py-4">{tool.crm}</td>
                      <td className="py-4">{tool.erp}</td>
                      <td className="py-4">{tool.paymentProcessor}</td>
                      <td className="py-4">{tool.primaryBank}</td>
                      <td className="py-4">{tool.payroll}</td>
                      <td className="py-4">{tool.expenseTool}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>

          {/* Internal Controls */}
          <div>
              
              {/* Group by severity */}
              <div className="space-y-6">
                {/* High severity controls */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <h4 className="text-[14px] font-semibold text-red-700">High Priority</h4>
                    <span className="text-[12px] text-red-600">({internalControls.filter(c => c.severity === 'high').length} items)</span>
                  </div>
                  <div className="space-y-3">
                    {internalControls.filter(c => c.severity === 'high').map((control) => {
                      const truncatedRule = control.rule.length > 120 
                        ? control.rule.substring(0, 120) + "..." 
                        : control.rule;
                      const isTruncated = control.rule.length > 120;
                      
                      return (
                        <div key={control.id} className="bg-white rounded-lg p-3 border border-red-100 hover:border-red-200 transition-colors">
                          <div className="flex items-start justify-between mb-1">
                            <h5 className="text-[13px] font-medium text-[var(--text)]">{control.title}</h5>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <img src="/mobius-logo.png" alt="Ripple" className="w-3 h-3" />
                                <span className="text-[9px] text-red-600">Inferred from NetSuite</span>
                              </div>
                              <span className="text-[9px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">HIGH</span>
                            </div>
                          </div>
                          <div className="text-[12px] text-[var(--text)] font-normal leading-tight">
                            {truncatedRule}
                            {isTruncated && (
                              <button className="ml-2 text-[10px] text-[var(--primary)] hover:underline font-medium">
                                Read more
                              </button>
                            )}
                          </div>
                          <div className="mt-1 flex items-center justify-end">
                            <div className="flex items-center space-x-1">
                              <span className="text-[9px] text-red-600">Meeting transcript</span>
                              <span className="text-[9px] text-red-500">•</span>
                              <span className="text-[9px] text-red-600">Sept 18, 2025</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Medium severity controls */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <h4 className="text-[14px] font-semibold text-yellow-700">Medium Priority</h4>
                    <span className="text-[12px] text-yellow-600">({internalControls.filter(c => c.severity === 'medium').length} items)</span>
                  </div>
                  <div className="space-y-3">
                    {internalControls.filter(c => c.severity === 'medium').map((control) => {
                      const truncatedRule = control.rule.length > 120 
                        ? control.rule.substring(0, 120) + "..." 
                        : control.rule;
                      const isTruncated = control.rule.length > 120;
                      
                      return (
                        <div key={control.id} className="bg-white rounded-lg p-3 border border-yellow-100 hover:border-yellow-200 transition-colors">
                          <div className="flex items-start justify-between mb-1">
                            <h5 className="text-[13px] font-medium text-[var(--text)]">{control.title}</h5>
                            <div className="flex items-center space-x-2">
                              <span className="text-[9px] text-yellow-600">📄 Meeting notes</span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">MEDIUM</span>
                            </div>
                          </div>
                          <div className="text-[12px] text-[var(--text)] font-normal leading-tight">
                            {truncatedRule}
                            {isTruncated && (
                              <button className="ml-2 text-[10px] text-[var(--primary)] hover:underline font-medium">
                                Read more
                              </button>
                            )}
                          </div>
                          <div className="mt-1 flex items-center justify-end">
                            <div className="flex items-center space-x-1">
                              <span className="text-[9px] text-yellow-600">Policy document</span>
                              <span className="text-[9px] text-yellow-500">•</span>
                              <span className="text-[9px] text-yellow-600">Sept 15, 2025</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accounting Policies */}
          <div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accountingPolicies.map((policy) => {
                const truncatedPolicy = policy.policy.length > 120 
                  ? policy.policy.substring(0, 120) + "..." 
                  : policy.policy;
                const isTruncated = policy.policy.length > 120;
                
                return (
                  <div key={policy.id} className="bg-white rounded-lg p-4 border border-blue-100 hover:border-blue-200 transition-colors group">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-[14px] font-medium text-[var(--text)]">{policy.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                          {policy.effectiveDate}
                        </span>
                      </div>
                    </div>
                    <div className="text-[12px] text-[var(--text)] font-normal leading-relaxed">
                      {truncatedPolicy}
                      {isTruncated && (
                        <button className="ml-2 text-[10px] text-[var(--primary)] hover:underline font-medium">
                          Read more
                        </button>
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-blue-600">Controller approved</span>
                        <span className="text-[10px] text-[var(--primary)] font-medium">94%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-blue-600">Accounting manual</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          </div>

  );
};
