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
  oms: string;
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
    natureOfBusiness: "E-commerce brand (fashion & essentials)",
    legalEntity: "Aqqrue Retail Pvt Ltd",
    reportingCurrency: "INR",
    fyStart: "April",
    subsidiaries: ["Aqqrue MENA FZ-LLC (UAE)", "Aqqrue Global Ltd (SG)"],
    primaryChannels: ["Shopify", "Amazon (Seller Central)", "Flipkart", "Proprietary D2C"],
    primaryGeos: ["India", "UAE", "Singapore"],
    paymentProcessors: ["Razorpay (IN)", "Stripe (INTL)", "Amazon Pay (IN)"],
    primaryBanks: ["HDFC Bank (IN)", "Standard Chartered UAE", "DBS Singapore"],
    payrollTool: "BreatheHR (India), Payoneer (Intl contractors)",
    expenseTool: "Pleo (Corporate Cards)",
    auditor: "PwC India",
    notes: "Order ingestion frequency: daily. Returns window: 30 days. Significant marketplace commissions on Amazon."
  });

  const [toolStack, setToolStack] = useState<ToolStack[]>([
    { 
      geo: "India", 
      oms: "Uniware", 
      erp: "Tally", 
      paymentProcessor: "Razorpay",
      primaryBank: "HDFC Bank",
      payroll: "BreatheHR",
      expenseTool: "Pleo"
    },
    { 
      geo: "UAE", 
      oms: "Shopify (Region storefront)", 
      erp: "QuickBooks Online", 
      paymentProcessor: "Stripe",
      primaryBank: "Standard Chartered UAE",
      payroll: "Local payroll partner (outsourced)",
      expenseTool: "Pleo (global)"
    },
    { 
      geo: "SG", 
      oms: "Shopify (SG)", 
      erp: "Xero", 
      paymentProcessor: "Stripe",
      primaryBank: "DBS Singapore",
      payroll: "Payoneer (contractors)",
      expenseTool: "Expensefy"
    }
  ]);

  const [internalControls, setInternalControls] = useState<InternalControl[]>([
    { 
      id: "IC-001", 
      title: "Corporate card policy",
      rule: "All corporate card transactions posted to suspense until invoice attached. Transactions > ₹50,000 require controller approval. All corporate card transactions must be supported by original receipts and business justification. Cardholders are required to submit expense reports within 7 days of transaction date. Transactions without proper documentation are flagged for immediate review. Monthly reconciliation of all corporate cards is mandatory with variance analysis. Card limits are set based on role and business requirements with quarterly reviews. Suspicious transactions are automatically flagged for fraud investigation. All card transactions are subject to random audit sampling. Cardholders must complete annual training on expense policies and fraud prevention.",
      severity: "high",
      lastVerified: "2025-09-23T23:58:00Z"
    },
    { 
      id: "IC-002", 
      title: "PO matching",
      rule: "PO matching required for invoices > ₹25,000. Matching tolerance for quantity/price +/- 2%. All purchase orders must be pre-approved before vendor engagement. Three-way matching (PO, receipt, invoice) is mandatory for all transactions above threshold. Variance analysis is performed for all mismatched items with detailed explanations required. Automated matching system flags discrepancies for manual review. Monthly reconciliation of unmatched items with aging analysis. Vendor master data is reviewed quarterly for accuracy. Purchase authorization matrix defines approval limits by role and department. All procurement activities are subject to competitive bidding requirements above certain thresholds.",
      severity: "medium",
      lastVerified: "2025-09-23T23:40:00Z"
    },
    { 
      id: "IC-003", 
      title: "Invoice approvals",
      rule: "Invoices > ₹5,00,000 require CFO approval. Between ₹50,000–₹5,00,000 require controller approval. All invoices must be supported by purchase orders and delivery receipts. Invoice approval workflow includes automated routing based on amount and vendor. Duplicate invoice detection system prevents payment of same invoice twice. Vendor master data validation ensures accurate payment processing. Monthly aging analysis of outstanding invoices with escalation procedures. Payment terms are strictly enforced with late payment penalties. All invoice approvals are documented with timestamps and approver details. Quarterly review of approval authority matrix and delegation of authority.",
      severity: "high",
      lastVerified: "2025-09-23T23:50:00Z"
    },
    { 
      id: "IC-004", 
      title: "Segregation of duties (SoD)",
      rule: "Person who creates PO cannot be same as approver for orders > ₹1L. Finance ops enforces role checks in Uniware. Segregation of duties matrix is maintained for all critical business processes. No single individual can initiate, approve, and record the same transaction. Regular SoD testing is performed quarterly with remediation of any violations. System access controls enforce segregation requirements automatically. Role-based access controls are reviewed annually with business process owners. Exception reporting identifies potential SoD violations for immediate investigation. Training programs ensure all employees understand their role limitations. Audit trail maintains complete record of all system access and transactions.",
      severity: "high",
      lastVerified: "2025-09-23T23:30:00Z"
    },
    { 
      id: "IC-005", 
      title: "Journal entry reviews",
      rule: "All month-end adjusting JEs require two approvers for amounts > ₹2L. Recurring JEs reviewed quarterly. Journal entry templates are pre-approved for standard transactions. All manual journal entries require detailed supporting documentation. Automated journal entries are subject to exception reporting and review. Monthly reconciliation of all balance sheet accounts with variance analysis. Journal entry approval workflow includes automated routing and escalation. Supporting documentation must be attached to all journal entries. Quarterly review of journal entry patterns for unusual activity. All journal entries are subject to random audit sampling with detailed testing procedures.",
      severity: "medium",
      lastVerified: "2025-09-01T09:00:00Z"
    }
  ]);

  const [accountingPolicies, setAccountingPolicies] = useState<AccountingPolicy[]>([
    { 
      id: "AP-001", 
      title: "Revenue recognition",
      policy: "Accrual basis. Marketplace commission and returns are deducted at settlement date. Revenue recognized on shipment confirmation for marketplace orders; on payment confirmation for D2C prepaids. For marketplace transactions, revenue is recognized net of platform fees, payment processing charges, and estimated returns based on historical return rates. D2C revenue is recognized when goods are shipped and title transfers to customer, with appropriate provisions for returns and exchanges. Subscription revenue is recognized ratably over the subscription period. Revenue from gift cards is deferred until redemption or expiration. All revenue recognition follows ASC 606 standards with proper identification of performance obligations, transaction price allocation, and satisfaction of performance obligations.",
      effectiveDate: "2025-04-01"
    },
    { 
      id: "AP-002", 
      title: "Capitalization",
      policy: "Capitalize fixed assets > ₹100,000. Useful life: computers 3 years (straight-line), furniture 5 years. All fixed assets are capitalized at cost including purchase price, import duties, taxes, and directly attributable costs. Depreciation is calculated using straight-line method over estimated useful lives. Assets under construction are capitalized separately and transferred to appropriate asset categories upon completion. Impairment testing is performed annually or when indicators of impairment exist. Disposal of assets requires proper authorization and any gains/losses are recorded in the period of disposal. Leasehold improvements are amortized over the shorter of lease term or useful life.",
      effectiveDate: "2024-04-01"
    },
    { 
      id: "AP-003", 
      title: "Prepaid expenses",
      policy: "Prepaids to be amortized monthly based on benefit period; prepaid marketing recognized over campaign period. All prepaid expenses are initially recorded at cost and systematically amortized over the period of benefit. Prepaid insurance is amortized over the policy period. Prepaid rent is amortized over the lease term. Prepaid marketing expenses are amortized based on the expected benefit period of the campaign, typically 3-6 months. Prepaid software licenses are amortized over the license period. Any prepaid amounts that expire without benefit are written off immediately. Prepaid expenses are reviewed quarterly for potential impairment.",
      effectiveDate: "2025-01-01"
    },
    { 
      id: "AP-004", 
      title: "Foreign currency",
      policy: "Functional currency = INR for India entity; use month-end spot rate for translation. FX gains/losses booked to other income. All foreign currency transactions are initially recorded at the exchange rate prevailing on the transaction date. Monetary assets and liabilities denominated in foreign currencies are translated at the closing rate at each balance sheet date. Non-monetary items are carried at historical cost. Exchange differences arising on translation are recognized in profit and loss account. For subsidiaries, assets and liabilities are translated at closing rates, income and expenses at average rates, and resulting exchange differences are accumulated in foreign currency translation reserve. Hedge accounting is applied where appropriate for qualifying hedging relationships.",
      effectiveDate: "2024-07-01"
    },
    { 
      id: "AP-005", 
      title: "Tax treatment",
      policy: "GST applied at point of supply. Marketplace TCS and reverse-charge treatments flagged for accounting review. All tax provisions are calculated based on applicable tax rates and regulations. Current tax is measured at the amount expected to be paid to tax authorities. Deferred tax is recognized for temporary differences between carrying amounts and tax bases. Tax credits and incentives are recognized when there is reasonable certainty of utilization. Transfer pricing documentation is maintained for related party transactions. Tax returns are filed within prescribed due dates and any assessments are reviewed and contested where appropriate. Tax positions are evaluated for uncertain tax treatments and provisions are made where necessary.",
      effectiveDate: "2025-04-01"
    }
  ]);

  const [suggestions] = useState<Suggestion[]>([
    {
      id: "S-001",
      type: "Best practice",
      text: "Tighten corporate card review: require controller approval for transactions > ₹25k (peers). Expected benefit: 15% faster clearing of cards.",
      confidence: 0.76
    },
    {
      id: "S-002",
      type: "Policy gap",
      text: "Define clear policy for marketplace chargebacks & reimbursements to improve reconciliations across Amazon/Shopify.",
      confidence: 0.81
    },
    {
      id: "S-003",
      type: "Automation",
      text: "Auto-ingest Stripe settlement reports into reconciliation workflow to reduce manual CSV uploads (saves ~3 hrs/week).",
      confidence: 0.89
    },
    {
      id: "S-004",
      type: "Control",
      text: "Add automated slack nudge for expense approvers after 48 hours to reduce suspense items piling up.",
      confidence: 0.65
    }
  ]);

  const [changeHistory] = useState<ChangeHistory[]>([
    {
      timestamp: "2025-09-24T00:18:00Z",
      actor: "Michael Chen",
      action: "Changed corporate card approval threshold",
      details: "Updated corporate card auto-approve threshold from ₹50,000 to ₹25,000",
      actorRole: "Founder"
    },
    {
      timestamp: "2025-09-23T23:55:00Z",
      actor: "Sarah Johnson",
      action: "Controller approved UAE geo config",
      details: "Approved QuickBooks mapping and bank account connections for UAE entity",
      actorRole: "Controller"
    },
    {
      timestamp: "2025-09-23T23:40:00Z",
      actor: "Aqqrue",
      action: "Aqqrue inferred revenue recognition",
      details: "Inferred D2C prepaids recognized on payment; marketplace recognized on shipment confirmation",
      actorRole: "Aqqrue Agent"
    },
    {
      timestamp: "2025-09-23T23:00:00Z",
      actor: "Onboarding Bot",
      action: "Generated draft SOP",
      details: "Auto-generated draft SOP: 'Order-to-Cash (India) v0.1' saved to /onboarding/sops/OrderToCash_v0.1.docx",
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
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Business Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] hover:shadow-md transition-all duration-200">
            {/* Meta strip */}
            <div className="bg-[var(--primary-weak)] px-6 py-3 rounded-t-xl border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[12px] text-[var(--primary)] font-medium">📄 Inferred from:</span>
                    <span className="text-[12px] text-[var(--text)]">Onboarding call (Sept 18)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[12px] text-[var(--primary)] font-medium">Confidence:</span>
                    <span className="text-[12px] text-[var(--text)]">87%</span>
                  </div>
                </div>
                <button className="text-[11px] text-[var(--primary)] hover:underline">View highlights</button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-[16px] leading-6 font-semibold text-[var(--text)]">Business Overview</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-[12px] text-[var(--muted)]">Entity:</span>
                    <select className="px-2 py-1 text-[12px] border border-[var(--border)] rounded bg-white hover:border-[var(--primary)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors">
                      <option value="india">India</option>
                      <option value="uae">UAE</option>
                      <option value="singapore">Singapore</option>
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
                  Aqqrue Retail Pvt Ltd is a fast-growing e-commerce brand specializing in fashion and essentials, operating across India, UAE, and Singapore. The company leverages multiple sales channels including Shopify, Amazon Seller Central, Flipkart, and proprietary D2C platforms to reach diverse customer segments. With a multi-geographic presence, Aqqrue manages complex operations through region-specific ERP systems (Tally, QuickBooks, Xero) and payment processors (Razorpay, Stripe) while maintaining standardized expense management through Pleo corporate cards...
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
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 hover:shadow-md transition-all duration-200">
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
                    <th className="text-left py-4">OMS</th>
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
                      <td className="py-4">{tool.oms}</td>
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
          <div className="bg-gradient-to-br from-red-25 to-orange-25 rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-all duration-200">
            {/* Meta strip */}
            <div className="bg-red-50 px-6 py-3 rounded-t-xl border-b border-red-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[12px] text-red-700 font-medium">🔒 Controls & Compliance</span>
                    <span className="text-[12px] text-red-600">High-risk items flagged</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[12px] text-red-700 font-medium">Last verified:</span>
                    <span className="text-[12px] text-red-600">Sept 23, 2025</span>
                  </div>
                </div>
                <button className="text-[11px] text-red-700 hover:underline">View audit trail</button>
              </div>
            </div>
            
            <div className="p-6">
              
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
                                <img src="/mobius-logo.png" alt="Aqqrue" className="w-3 h-3" />
                                <span className="text-[9px] text-red-600">Inferred from QBO</span>
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
          <div className="bg-gradient-to-br from-blue-25 to-indigo-25 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-all duration-200">
            {/* Meta strip */}
            <div className="bg-blue-50 px-6 py-3 rounded-t-xl border-b border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[12px] text-blue-700 font-medium">Accounting Standards</span>
                    <span className="text-[12px] text-blue-600">GAAP compliant policies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[12px] text-blue-700 font-medium">Auditor:</span>
                    <span className="text-[12px] text-blue-600">PwC India</span>
                  </div>
                </div>
                <button className="text-[11px] text-blue-700 hover:underline">View policy docs</button>
              </div>
            </div>
            
            <div className="p-6">
              
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
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Change History */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl shadow-sm border border-gray-200">
            {/* Meta strip */}
            <div className="bg-gray-100 px-6 py-3 rounded-t-xl border-b border-gray-200">
              <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-[12px] text-gray-700 font-medium">Activity Timeline</span>
                      <span className="text-[12px] text-gray-600">Real-time updates</span>
                    </div>
                  </div>
              </div>
            </div>
            
            <div className="p-6">
              
              {/* Change History */}
              <div className="space-y-3">
                {changeHistory.map((change, index) => (
                  <div key={index} className="relative">
                    {index > 0 && (
                      <div className="absolute left-0 top-0 w-px h-6 bg-gray-200 -ml-2"></div>
                    )}
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-[var(--primary)] rounded-full mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-[13px] font-medium text-[var(--text)]">{change.actor}</span>
                          <span className="text-[11px] text-[var(--muted)]">{getRelativeTime(change.timestamp)}</span>
                        </div>
                        <div className="text-[12px] text-[var(--text)] mb-1">{change.action}</div>
                        <div className="text-[11px] text-[var(--muted)]">{change.details}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Smart Suggestions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header */}
            <div className="bg-green-50 px-6 py-3 rounded-t-xl border-b border-green-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[12px] text-gray-700 font-medium">Smart Suggestions</span>
                    <span className="text-[12px] text-gray-600">AI-powered insights</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              {/* Suggestions List */}
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={suggestion.id} className="group">
                    {/* Suggestion Card */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                      <div className="flex items-start justify-between gap-3">
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Type Badge */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              suggestion.type === 'Best practice' ? 'bg-blue-100 text-blue-700' :
                              suggestion.type === 'Policy gap' ? 'bg-orange-100 text-orange-700' :
                              suggestion.type === 'Automation' ? 'bg-purple-100 text-purple-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {suggestion.type}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              <span>{Math.round(suggestion.confidence * 100)}% confidence</span>
                            </div>
                          </div>
                          
                          {/* Suggestion Text */}
                          <p className="text-xs text-gray-900 leading-relaxed mb-2">
                            {suggestion.text}
                          </p>
                          
                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <img src="/mobius-logo.png" alt="Aqqrue" className="w-3 h-3" />
                              <span>Aqqrue</span>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1 text-green-600 hover:bg-green-50 rounded-md transition-colors">
                                <Check className="w-3 h-3" />
                              </button>
                              <button className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
