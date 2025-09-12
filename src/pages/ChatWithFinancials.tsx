import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { cfoQuestions, CFOQuestion } from '@/data/cfoQAData';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
  transactionLineage?: TransactionLineage[];
  confidence?: number;
  category?: string;
}

interface Source {
  system: string;
  type: string;
  id: string;
  link: string;
  lastUpdated: string;
  description?: string;
}

interface TransactionLineage {
  id: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  type: 'debit' | 'credit';
  account: string;
  reference?: string;
}



const mockResponses: Record<string, Omit<ChatMessage, 'id' | 'timestamp'>> = {
  'cash_flow': {
    type: 'assistant',
    content: 'Based on our latest financial data, here\'s your current cash position:\n\n**Current Cash Position:** $2.4M across all entities\n- US Inc: $1.8M (down from $2.1M last month)\n- APAC Inc: $480K (below $1M threshold - requires attention)\n- EU Inc: $120K\n\n**Monthly Burn Rate:** $180K\n- This represents a 15% increase from last month\n- Primary drivers: increased contractor costs (+$75K) and AWS infrastructure (+$95K)\n\n**Cash Runway:** 13.3 months at current burn rate\n\n⚠️ **Alert:** APAC entity is below minimum threshold and needs immediate attention.',
    confidence: 0.94,
    category: 'Cash Flow',
    sources: [
      {
        system: 'Treasury',
        type: 'balance_report',
        id: 'cash_position_august',
        link: 'https://treasury.company.com/cash_position_august',
        lastUpdated: '15m ago',
        description: 'Real-time cash balances across all entities'
      },
      {
        system: 'Financial Planning',
        type: 'burn_rate_analysis',
        id: 'burn_rate_august',
        link: 'https://fp.company.com/burn_rate_august',
        lastUpdated: '1h ago',
        description: 'Monthly burn rate calculation and trend analysis'
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
        account: 'Technology Infrastructure',
        reference: 'INV-AWS-0891'
      },
      {
        id: 'TXN-2025-0892',
        description: 'Contractor Payroll - Development Team',
        amount: 75000,
        currency: 'USD',
        date: '2025-08-30',
        type: 'debit',
        account: 'Contractor Services',
        reference: 'PAY-CONTRACT-0892'
      },
      {
        id: 'TXN-2025-0893',
        description: 'Customer Payment - Acme Corp',
        amount: 320000,
        currency: 'USD',
        date: '2025-08-29',
        type: 'credit',
        account: 'Accounts Receivable',
        reference: 'INV-2025-089'
      }
    ]
  },
  'revenue_trends': {
    type: 'assistant',
    content: 'Here\'s your revenue analysis for Q3 2025:\n\n**Q3 Revenue Performance:**\n- Total Revenue: $4.2M (vs $3.8M Q2)\n- Growth Rate: +10.5% quarter-over-quarter\n- ARR: $16.8M annualized run rate\n\n**Key Revenue Drivers:**\n- New customer acquisitions: +$180K\n- Expansion revenue: +$220K\n- Churn impact: -$120K (Beta Inc credit memo)\n\n**Revenue by Entity:**\n- US Inc: $3.1M (74%)\n- EU Inc: $680K (16%)\n- APAC Inc: $420K (10%)\n\n**Trend Analysis:**\n- Monthly recurring revenue growing at 3.2% MoM\n- Average deal size: $45K (up from $42K)\n- Sales cycle: 45 days (down from 52 days)',
    confidence: 0.91,
    category: 'Revenue',
    sources: [
      {
        system: 'Salesforce',
        type: 'revenue_report',
        id: 'q3_revenue_analysis',
        link: 'https://salesforce.com/q3_revenue_analysis',
        lastUpdated: '2h ago',
        description: 'Comprehensive Q3 revenue analysis and trends'
      },
      {
        system: 'Billing',
        type: 'arr_calculation',
        id: 'arr_august_2025',
        link: 'https://billing.company.com/arr_august_2025',
        lastUpdated: '30m ago',
        description: 'Monthly ARR calculation and customer metrics'
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
        reference: 'INV-2025-0885'
      },
      {
        id: 'TXN-2025-0886',
        description: 'Expansion - DataFlow Solutions',
        amount: 45000,
        currency: 'USD',
        date: '2025-08-27',
        type: 'credit',
        account: 'Revenue - Expansions',
        reference: 'INV-2025-0886'
      },
      {
        id: 'TXN-2025-0887',
        description: 'Credit Memo - Northwind Corp',
        amount: 120000,
        currency: 'USD',
        date: '2025-08-26',
        type: 'debit',
        account: 'Revenue - Adjustments',
        reference: 'CM-2025-089'
      }
    ]
  },
  'expense_analysis': {
    type: 'assistant',
    content: 'Here\'s your expense breakdown for August 2025:\n\n**Total Monthly Expenses:** $1.8M\n\n**Top Expense Categories:**\n1. **Technology Infrastructure:** $420K (+22% MoM)\n   - AWS: $95K spike (unoptimized instances)\n   - Snowflake: $85K\n   - Other cloud services: $240K\n\n2. **People Costs:** $680K (+8% MoM)\n   - Salaries: $605K\n   - Contractors: $275K (+$75K vs budget)\n   - Benefits: $120K\n\n3. **Sales & Marketing:** $320K (-5% MoM)\n   - Digital marketing: $180K\n   - Events & conferences: $140K\n\n4. **General & Administrative:** $280K (+12% MoM)\n   - Legal & compliance: $95K\n   - Office & facilities: $120K\n   - Professional services: $65K\n\n5. **Other Operating:** $100K\n\n**Key Variances:**\n- AWS costs 22% above budget\n- Contractor spend $75K over budget\n- Legal costs up due to compliance requirements',
    confidence: 0.89,
    category: 'Expenses',
    sources: [
      {
        system: 'General Ledger',
        type: 'expense_report',
        id: 'august_expenses_gl',
        link: 'https://gl.company.com/august_expenses',
        lastUpdated: '1h ago',
        description: 'Detailed expense breakdown by GL account'
      },
      {
        system: 'AWS Cost Explorer',
        type: 'cost_analysis',
        id: 'aws_august_costs',
        link: 'https://aws.amazon.com/cost_explorer_august',
        lastUpdated: '45m ago',
        description: 'AWS cost analysis and optimization recommendations'
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
        reference: 'AWS-INV-0894'
      },
      {
        id: 'TXN-2025-0895',
        description: 'Contractor Payment - Development Team',
        amount: 75000,
        currency: 'USD',
        date: '2025-08-30',
        type: 'debit',
        account: 'Contractor Services',
        reference: 'PAY-CONTRACT-0895'
      },
      {
        id: 'TXN-2025-0896',
        description: 'Legal Services - Compliance',
        amount: 25000,
        currency: 'USD',
        date: '2025-08-29',
        type: 'debit',
        account: 'Legal & Professional Services',
        reference: 'LEGAL-INV-0896'
      }
    ]
  },
  'customer_health': {
    type: 'assistant',
    content: 'Customer health analysis reveals several at-risk accounts:\n\n**High Risk Customers (Immediate Attention):**\n1. **Beta Inc** - $420K ARR\n   - Contract expires in 14 days\n   - Health score: 67/100\n   - 2 P1 support tickets open\n   - Risk: High churn probability\n\n2. **Northwind Corp** - $180K ARR\n   - Recent $120K credit memo issued\n   - Service quality issues reported\n   - Health score: 45/100\n   - Risk: Service dissatisfaction\n\n**Medium Risk Customers:**\n3. **DataFlow Solutions** - $320K ARR\n   - Usage down 15% MoM\n   - No recent expansion\n   - Health score: 72/100\n\n4. **TechCorp Inc** - $85K ARR\n   - New customer (30 days)\n   - Low engagement metrics\n   - Health score: 68/100\n\n**Recommended Actions:**\n- Schedule executive calls with Beta Inc and Northwind\n- Implement customer success outreach program\n- Review service quality metrics for at-risk accounts',
    confidence: 0.87,
    category: 'Customer',
    sources: [
      {
        system: 'Customer Success Platform',
        type: 'health_score_report',
        id: 'customer_health_august',
        link: 'https://success.company.com/health_scores',
        lastUpdated: '3h ago',
        description: 'Customer health scores and engagement metrics'
      },
      {
        system: 'Salesforce',
        type: 'renewal_risk_analysis',
        id: 'renewal_risk_q3',
        link: 'https://salesforce.com/renewal_risk_q3',
        lastUpdated: '2h ago',
        description: 'Renewal risk analysis and contract expiration tracking'
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
        reference: 'INV-BETA-0888'
      },
      {
        id: 'TXN-2025-0889',
        description: 'Northwind Corp - Credit Memo',
        amount: 120000,
        currency: 'USD',
        date: '2025-08-26',
        type: 'debit',
        account: 'Revenue - Adjustments',
        reference: 'CM-NORTHWIND-0889'
      }
    ]
  },
  'month_end': {
    type: 'assistant',
    content: 'Month-end close status for August 2025:\n\n**✅ Completed Tasks:**\n- Bank reconciliation (US Inc)\n- Revenue recognition\n- Payroll accruals\n- Fixed asset depreciation\n- Intercompany eliminations\n\n**⚠️ Pending Tasks:**\n1. **Bank reconciliation (APAC)** - OVERDUE by 2 days\n   - 3 outstanding items need resolution\n   - Assigned to: Mike@company.com\n   - Impact: High (compliance risk)\n\n2. **VAT filing (UK)** - Due in 5 days\n   - All data prepared\n   - Ready for submission\n   - Assigned to: Tax@company.com\n\n3. **Fixed asset review** - Due in 3 days\n   - New asset additions to be capitalized\n   - Assigned to: Finance@company.com\n\n**📊 Close Metrics:**\n- Days to close: 2 (target: 3)\n- Open items: 3\n- Overdue items: 1\n- Completion rate: 85%',
    confidence: 0.96,
    category: 'Close',
    sources: [
      {
        system: 'Close Management System',
        type: 'close_checklist',
        id: 'august_close_status',
        link: 'https://close.company.com/august_close',
        lastUpdated: '1h ago',
        description: 'Real-time month-end close checklist and status'
      },
      {
        system: 'Compliance Calendar',
        type: 'filing_deadlines',
        id: 'q3_filing_deadlines',
        link: 'https://compliance.company.com/q3_deadlines',
        lastUpdated: '4h ago',
        description: 'Regulatory filing deadlines and requirements'
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
        reference: 'ACC-UTIL-0897'
      },
      {
        id: 'TXN-2025-0898',
        description: 'Depreciation - Equipment',
        amount: 12500,
        currency: 'USD',
        date: '2025-08-31',
        type: 'debit',
        account: 'Depreciation Expense',
        reference: 'DEP-EQUIP-0898'
      }
    ]
  },
  'vendor_analysis': {
    type: 'assistant',
    content: 'Top vendor spend analysis for August 2025:\n\n**Top 10 Vendors by Spend:**\n1. **AWS** - $95K (+22% MoM)\n   - Infrastructure services\n   - Optimization opportunity identified\n\n2. **Snowflake** - $85K\n   - Data warehouse services\n   - Annual contract renewal due Sep 30\n\n3. **Rippling** - $45K\n   - Payroll and HR services\n   - Monthly recurring\n\n4. **HubSpot** - $38K\n   - Marketing automation\n   - Annual contract\n\n5. **Stripe** - $32K\n   - Payment processing\n   - Transaction-based pricing\n\n6. **Microsoft** - $28K\n   - Office 365 and Azure\n   - Enterprise licensing\n\n7. **Legal Firm ABC** - $25K\n   - Compliance and legal services\n   - Project-based\n\n8. **Office Space Inc** - $22K\n   - Facilities and rent\n   - Monthly recurring\n\n9. **Adobe** - $18K\n   - Creative suite licensing\n   - Annual contract\n\n10. **Slack** - $15K\n    - Communication platform\n    - Per-user pricing\n\n**Spend Trends:**\n- Total vendor spend: $403K (+8% MoM)\n- Top 5 vendors: 70% of total spend\n- New vendors added: 3\n- Contract renewals due: 2 (Snowflake, Adobe)',
    confidence: 0.92,
    category: 'Vendors',
    sources: [
      {
        system: 'Accounts Payable',
        type: 'vendor_spend_report',
        id: 'vendor_spend_august',
        link: 'https://ap.company.com/vendor_spend_august',
        lastUpdated: '2h ago',
        description: 'Detailed vendor spend analysis and trends'
      },
      {
        system: 'Procurement',
        type: 'contract_management',
        id: 'contract_renewals_q3',
        link: 'https://procurement.company.com/contracts_q3',
        lastUpdated: '1h ago',
        description: 'Contract renewal tracking and vendor management'
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
        reference: 'INV-AWS-0899'
      },
      {
        id: 'TXN-2025-0900',
        description: 'Snowflake - Data Warehouse',
        amount: 85000,
        currency: 'USD',
        date: '2025-08-30',
        type: 'debit',
        account: 'Technology Infrastructure',
        reference: 'INV-SNOWFLAKE-0900'
      },
      {
        id: 'TXN-2025-0901',
        description: 'Rippling - Payroll Services',
        amount: 45000,
        currency: 'USD',
        date: '2025-08-30',
        type: 'debit',
        account: 'Human Resources',
        reference: 'INV-RIPPLING-0901'
      }
    ]
  }
};

const ChatWithFinancials: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<CFOQuestion | null>(cfoQuestions[0]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());
  const [expandedLineage, setExpandedLineage] = useState<boolean>(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    setInputValue('');
    setIsLoading(true);

    // Find matching question with improved logic
    const contentLower = content.toLowerCase();
    const matchingQuestion = cfoQuestions.find(q => {
      // Check for exact question match
      if (contentLower.includes(q.question.toLowerCase())) return true;
      
      // Check for category keywords
      if (contentLower.includes('cash') && q.category.includes('Cash')) return true;
      if (contentLower.includes('revenue') && q.category.includes('Revenue')) return true;
      if (contentLower.includes('expense') && q.category.includes('Expense')) return true;
      if (contentLower.includes('customer') && q.category.includes('Customer')) return true;
      if (contentLower.includes('close') && q.category.includes('Close')) return true;
      if (contentLower.includes('vendor') && q.category.includes('Vendor')) return true;
      if (contentLower.includes('receivable') && q.category.includes('Receivable')) return true;
      if (contentLower.includes('ar ') && q.category.includes('Receivable')) return true;
      if (contentLower.includes('collection') && q.category.includes('Receivable')) return true;
      if (contentLower.includes('aging') && q.category.includes('Receivable')) return true;
      
      // Check for specific keywords in question content
      if (contentLower.includes('burn rate') && q.id.includes('burn_rate')) return true;
      if (contentLower.includes('trending') && q.id.includes('trends')) return true;
      if (contentLower.includes('churn') && q.id.includes('churn')) return true;
      if (contentLower.includes('month end') && q.id.includes('month_end')) return true;
      if (contentLower.includes('spending') && q.id.includes('spend')) return true;
      if (contentLower.includes('outstanding') && q.id.includes('ar_collection')) return true;
      if (contentLower.includes('optimization') && q.id.includes('ar_collection')) return true;
      
      return false;
    }) || cfoQuestions[0]; // Default to first question if no match

    // Simulate API call
    setTimeout(() => {
      setSelectedQuestion(matchingQuestion);
      setIsLoading(false);
    }, 1000);
  };

  const handleQuestionSelect = (question: CFOQuestion) => {
    setSelectedQuestion(question);
  };

  const toggleSourceExpansion = (messageId: string) => {
    setExpandedSources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full flex flex-col bg-white">

      {/* Executive Summary Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mobius-blue mx-auto mb-4"></div>
              <p className="text-sm text-mobius-gray-600">Analyzing your financial data...</p>
            </div>
          </div>
        ) : selectedQuestion && (
          <>
            {/* Executive Summary */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h2 className="text-sm font-medium text-blue-900 mb-3">Executive Summary</h2>
              
              {/* Performance Overview */}
              <div className="mb-4">
                <p className="text-xs text-blue-800 leading-relaxed">
                  {selectedQuestion.answer.executiveSummary}
                </p>
              </div>
              
              {/* Key Insights */}
              <div className="mb-4">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <span className="font-medium">Detailed Analysis:</span> {selectedQuestion.answer.detailedAnalysis}
                </p>
              </div>
              
              {/* Aqqrue Actions */}
              <div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  <span className="font-medium">Aqqrue:</span> Automatically flagged this item based on threshold analysis and assigned to appropriate team. 
                  {selectedQuestion.priority === 'high' && ' Escalated due to high priority status.'}
                  {selectedQuestion.priority === 'medium' && ' Scheduled for review within 7 days.'}
                </p>
              </div>
            </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="bg-white border border-mobius-gray-100 rounded-lg p-4">
            <div className="prose prose-sm max-w-none">
              <div className="space-y-6">
                {/* Expanded Analysis */}
                <div>
                  <h3 className="text-sm font-semibold text-mobius-gray-900 mb-3">
                    Financial Performance Analysis
                  </h3>
                  <div className="space-y-4">
                    <p className="text-xs text-mobius-gray-700 leading-relaxed">
                      {selectedQuestion.category === 'Cash Management' && 
                        "Our current financial position requires immediate attention, particularly regarding liquidity management across our global entities. The cash position has deteriorated from the previous month, primarily driven by increased operational expenses and delayed receivables collection. The APAC entity's cash shortfall represents a critical risk that could impact our ability to meet vendor obligations and maintain operational continuity. This situation demands immediate intervention through intercompany transfers and vendor payment negotiations to prevent potential liquidity constraints that could affect our business operations."
                      }
                      {selectedQuestion.category === 'Revenue Analysis' && 
                        "Revenue performance this quarter demonstrates strong growth momentum, with significant contributions from both new customer acquisitions and existing customer expansions. The 10.5% quarter-over-quarter growth reflects our successful market penetration and customer retention strategies. However, we face critical renewal risks that could impact our revenue trajectory. The combination of new customer growth and expansion revenue is offset by customer churn, particularly the recent credit memo from Northwind Corp, which highlights the importance of maintaining service quality and customer satisfaction."
                      }
                      {selectedQuestion.category === 'Expense Management' && 
                        "Expense management has become increasingly challenging, with total monthly expenses rising 8% month-over-month. The primary driver is technology infrastructure costs, which have increased 22% due to unoptimized cloud resources and increased data processing requirements. While people costs remain within expected ranges, contractor overruns and legal compliance expenses have contributed to the overall cost increase. We have identified significant optimization opportunities that could reduce monthly expenses by approximately $90K through infrastructure rightsizing, vendor negotiations, and process improvements."
                      }
                      {selectedQuestion.category === 'Customer Success' && 
                        "Customer health analysis reveals concerning trends that require immediate executive attention. Two high-priority customers are at significant risk of churning, representing a combined $600K in annual recurring revenue. The declining health scores, particularly for Beta Inc and Northwind Corp, indicate underlying service quality issues and relationship challenges that must be addressed proactively. These customer retention risks could have substantial impact on our revenue stability and growth trajectory if not managed effectively."
                      }
                      {selectedQuestion.category === 'Financial Close' && 
                        "The month-end close process is progressing well overall, with 85% completion and remaining on track to meet our 3-day target. However, the APAC bank reconciliation delay represents a compliance risk that requires immediate resolution. The outstanding items in the APAC reconciliation need bank clarification and could impact our ability to complete the close on time. All other close activities, including revenue recognition, payroll accruals, and intercompany eliminations, have been completed successfully."
                      }
                      {selectedQuestion.category === 'Vendor Management' && 
                        "Vendor spend analysis reveals both opportunities and risks in our supplier relationships. Total vendor spend has increased 8% month-over-month, with AWS costs showing the most significant spike at 22% due to unoptimized infrastructure. Our vendor concentration is high, with the top 5 vendors representing 70% of total spend, creating potential single points of failure. However, we have identified substantial optimization opportunities, particularly in cloud infrastructure and contract renewals, that could yield significant cost savings."
                      }
                    </p>
                  </div>
                </div>

                {/* Key Metrics Table */}
                <div>
                  <h3 className="text-sm font-semibold text-mobius-gray-900 mb-3">
                    {selectedQuestion.category === 'Vendor Management' ? 'Quarter-wise Top 10 Vendor Spend' : 'Key Financial Metrics'}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-mobius-gray-200 bg-gray-50">
                          {selectedQuestion.category === 'Vendor Management' ? (
                            <>
                              <th className="text-left py-3 px-4 font-medium text-mobius-gray-700">Vendor</th>
                              <th className="text-right py-3 px-4 font-medium text-mobius-gray-700">Q3 2025</th>
                              <th className="text-right py-3 px-4 font-medium text-mobius-gray-700">Q2 2025</th>
                              <th className="text-right py-3 px-4 font-medium text-mobius-gray-700">Q1 2025</th>
                              <th className="text-right py-3 px-4 font-medium text-mobius-gray-700">Change QoQ</th>
                              <th className="text-center py-3 px-4 font-medium text-mobius-gray-700">Department</th>
                            </>
                          ) : (
                            <>
                              <th className="text-left py-3 px-4 font-medium text-mobius-gray-700">Metric</th>
                              <th className="text-right py-3 px-4 font-medium text-mobius-gray-700">Current Value</th>
                              <th className="text-right py-3 px-4 font-medium text-mobius-gray-700">Previous Period</th>
                              <th className="text-right py-3 px-4 font-medium text-mobius-gray-700">Change</th>
                              <th className="text-center py-3 px-4 font-medium text-mobius-gray-700">Trend</th>
                              <th className="text-center py-3 px-4 font-medium text-mobius-gray-700">Status</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedQuestion.category === 'Vendor Management' ? (
                          // Vendor-specific data
                          [
                            { vendor: 'AWS', q3: '$285K', q2: '$234K', q1: '$198K', change: '+21.8%', department: 'Engineering' },
                            { vendor: 'Snowflake', q3: '$255K', q2: '$255K', q1: '$255K', change: '0%', department: 'Engineering' },
                            { vendor: 'Rippling', q3: '$135K', q2: '$135K', q1: '$135K', change: '0%', department: 'G&A' },
                            { vendor: 'HubSpot', q3: '$114K', q2: '$114K', q1: '$114K', change: '0%', department: 'Sales & Marketing' },
                            { vendor: 'Stripe', q3: '$96K', q2: '$89K', q1: '$78K', change: '+7.9%', department: 'Product' },
                            { vendor: 'Microsoft', q3: '$84K', q2: '$84K', q1: '$84K', change: '0%', department: 'G&A' },
                            { vendor: 'Legal Firm ABC', q3: '$75K', q2: '$50K', q1: '$25K', change: '+50%', department: 'G&A' },
                            { vendor: 'Office Space Inc', q3: '$66K', q2: '$66K', q1: '$66K', change: '0%', department: 'G&A' },
                            { vendor: 'Adobe', q3: '$54K', q2: '$54K', q1: '$54K', change: '0%', department: 'Sales & Marketing' },
                            { vendor: 'Slack', q3: '$45K', q2: '$45K', q1: '$45K', change: '0%', department: 'G&A' }
                          ].map((vendor, index) => (
                            <tr 
                              key={index} 
                              className="border-b border-mobius-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                              onDoubleClick={() => {
                                // Navigate to vendor transactions
                                if (vendor.vendor === 'AWS') {
                                  window.open('/vendors/aws/transactions', '_blank');
                                } else {
                                  // For other vendors, show a placeholder message
                                  alert(`Vendor detail page for ${vendor.vendor} is not available yet.`);
                                }
                              }}
                            >
                              <td className="py-3 px-4 text-mobius-gray-900 font-medium">{vendor.vendor}</td>
                              <td className="py-3 px-4 text-right font-semibold text-mobius-gray-900">{vendor.q3}</td>
                              <td className="py-3 px-4 text-right text-mobius-gray-600">{vendor.q2}</td>
                              <td className="py-3 px-4 text-right text-mobius-gray-600">{vendor.q1}</td>
                              <td className="py-3 px-4 text-right text-mobius-gray-600">{vendor.change}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  vendor.department === 'Engineering' ? 'bg-blue-100 text-blue-800' :
                                  vendor.department === 'Product' ? 'bg-purple-100 text-purple-800' :
                                  vendor.department === 'Sales & Marketing' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {vendor.department}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          // Default metrics for other categories
                          selectedQuestion.answer.keyMetrics.map((metric, index) => (
                            <tr 
                              key={index} 
                              className="border-b border-mobius-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                              onDoubleClick={() => {
                                navigator.clipboard.writeText(`${metric.metric}: ${metric.value} (${metric.change})`);
                              }}
                            >
                              <td className="py-3 px-4 text-mobius-gray-900 font-medium">{metric.metric}</td>
                              <td className="py-3 px-4 text-right font-semibold text-mobius-gray-900">{metric.value}</td>
                              <td className="py-3 px-4 text-right text-mobius-gray-600">
                                {metric.metric === 'Total Cash' && '$2.6M'}
                                {metric.metric === 'Monthly Burn Rate' && '$156K'}
                                {metric.metric === 'Cash Runway' && '14.5 months'}
                                {metric.metric === 'APAC Cash' && '$520K'}
                                {metric.metric === 'Q3 Revenue' && '$3.8M'}
                                {metric.metric === 'ARR' && '$16.3M'}
                                {metric.metric === 'New Customer Revenue' && '$144K'}
                                {metric.metric === 'Expansion Revenue' && '$191K'}
                                {metric.metric === 'Churn Impact' && '$0'}
                                {metric.metric === 'Total Monthly Expenses' && '$1.67M'}
                                {metric.metric === 'Technology Infrastructure' && '$344K'}
                                {metric.metric === 'People Costs' && '$630K'}
                                {metric.metric === 'Contractor Overrun' && '$0'}
                                {metric.metric === 'Optimization Potential' && '$0'}
                                {metric.metric === 'High Risk Customers' && '1'}
                                {metric.metric === 'Total ARR at Risk' && '$420K'}
                                {metric.metric === 'Average Health Score' && '73/100'}
                                {metric.metric === 'Open P1 Tickets' && '0'}
                                {metric.metric === 'Close Progress' && '100%'}
                                {metric.metric === 'Days to Close' && '3'}
                                {metric.metric === 'Overdue Items' && '0'}
                                {metric.metric === 'Total Outstanding AR' && '$1.04M'}
                                {metric.metric === 'Current (0-30 days)' && '$780K'}
                                {metric.metric === '31-60 days' && '$180K'}
                                {metric.metric === '61-90 days' && '$60K'}
                                {metric.metric === 'Over 90 days' && '$20K'}
                                {metric.metric === 'Collection Efficiency' && '85%'}
                                {metric.metric === 'Top 3 Customer AR' && '$680K'}
                                {metric.metric === 'Open Items' && '0'}
                                {metric.metric === 'Total Vendor Spend' && '$373K'}
                                {metric.metric === 'Top 5 Vendor Share' && '68%'}
                                {metric.metric === 'AWS Cost Increase' && '0%'}
                                {metric.metric === 'Optimization Potential' && '$0'}
                              </td>
                              <td className="py-3 px-4 text-right text-mobius-gray-600">{metric.change}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  metric.trend === 'up' ? 'bg-green-100 text-green-800' :
                                  metric.trend === 'down' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  metric.metric.includes('APAC') && metric.metric.includes('Below') ? 'bg-red-100 text-red-800' :
                                  metric.trend === 'up' && metric.metric.includes('Burn') ? 'bg-yellow-100 text-yellow-800' :
                                  metric.trend === 'down' && metric.metric.includes('Revenue') ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {metric.metric.includes('APAC') && metric.metric.includes('Below') ? 'Critical' :
                                   metric.trend === 'up' && metric.metric.includes('Burn') ? 'Warning' :
                                   metric.trend === 'down' && metric.metric.includes('Revenue') ? 'Good' :
                                   'Normal'}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-mobius-gray-500 mt-2 italic">
                    {selectedQuestion.category === 'Vendor Management' 
                      ? 'Double-click any vendor to view detailed transactions and invoices'
                      : 'Double-click any row to copy metric details to clipboard'
                    }
                  </p>
                </div>

                {/* Customer AR Breakdown Table for AR questions */}
                {selectedQuestion.category === 'Accounts Receivable' && selectedQuestion.answer.customerARBreakdown && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-mobius-gray-900 mb-3">
                      Customer AR Aging Breakdown
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-mobius-gray-200 bg-mobius-gray-50">
                            <th className="py-3 px-4 text-left text-mobius-gray-700 font-medium">Customer</th>
                            <th className="py-3 px-4 text-right text-mobius-gray-700 font-medium">&lt;30 days</th>
                            <th className="py-3 px-4 text-right text-mobius-gray-700 font-medium">30-60 days</th>
                            <th className="py-3 px-4 text-right text-mobius-gray-700 font-medium">60-90 days</th>
                            <th className="py-3 px-4 text-right text-mobius-gray-700 font-medium">90+ days</th>
                            <th className="py-3 px-4 text-right text-mobius-gray-700 font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedQuestion.answer.customerARBreakdown.map((customer, index) => (
                            <tr 
                              key={index} 
                              className="border-b border-mobius-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                              onDoubleClick={() => {
                                navigator.clipboard.writeText(`${customer.customer}: $${(customer.total / 1000).toFixed(0)}K total AR`);
                              }}
                            >
                              <td className="py-3 px-4 text-mobius-gray-900 font-medium">{customer.customer}</td>
                              <td className="py-3 px-4 text-right font-semibold text-mobius-gray-900">
                                {customer.current > 0 ? `$${(customer.current / 1000).toFixed(0)}K` : '-'}
                              </td>
                              <td className="py-3 px-4 text-right font-semibold text-mobius-gray-900">
                                {customer.days30to60 > 0 ? `$${(customer.days30to60 / 1000).toFixed(0)}K` : '-'}
                              </td>
                              <td className="py-3 px-4 text-right font-semibold text-mobius-gray-900">
                                {customer.days60to90 > 0 ? `$${(customer.days60to90 / 1000).toFixed(0)}K` : '-'}
                              </td>
                              <td className="py-3 px-4 text-right font-semibold text-mobius-gray-900">
                                {customer.over90 > 0 ? `$${(customer.over90 / 1000).toFixed(0)}K` : '-'}
                              </td>
                              <td className="py-3 px-4 text-right font-semibold text-mobius-gray-900">
                                ${(customer.total / 1000).toFixed(0)}K
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-mobius-gray-500 mt-2 italic">
                      Double-click any row to copy customer AR details to clipboard
                    </p>
                  </div>
                )}

                {/* Action Items */}
                <div>
                  <h3 className="text-sm font-semibold text-mobius-gray-900 mb-3">
                    Recommended Actions
                  </h3>
                  <ul className="space-y-3 pl-0">
                    {selectedQuestion.answer.actionItems.map((item, index) => {
                      const priorityText = item.priority === 'immediate' ? 'Immediate action' :
                                         item.priority === 'this_week' ? 'This week' :
                                         item.priority === 'this_month' ? 'This month' : 'Next quarter';
                      return (
                        <li key={index} className="flex items-start">
                          <span className="text-mobius-gray-500 mr-3 mt-0.5 text-sm">•</span>
                          <div className="flex-1">
                            <p className="text-xs text-mobius-gray-700 leading-relaxed">
                              <span className="font-medium">{priorityText}:</span> {item.action} 
                              <span className="text-mobius-gray-500 ml-1">(assigned to {item.owner})</span> - {item.impact}.
                    </p>
                  </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

              </div>
              
              {/* Sources & Documents */}
              <div className="mt-6 pt-4 border-t border-mobius-gray-100">
                <h4 className="text-xs font-medium text-mobius-gray-900 mb-3">Sources & Documents</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-xs text-mobius-gray-500">Data Sources:</span>
                    {selectedQuestion.sources.map((source, index) => (
                      <React.Fragment key={index}>
                    <a
                          href={source.link}
                      className="text-xs text-mobius-blue hover:text-mobius-blue/80 underline"
                    >
                          {source.system}
                    </a>
                        {index < selectedQuestion.sources.length - 1 && (
                    <span className="text-xs text-mobius-gray-400">•</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-xs text-mobius-gray-500">Transaction Lineage:</span>
                    {selectedQuestion.transactionLineage.slice(0, 3).map((transaction, index) => (
                      <React.Fragment key={index}>
                    <a
                          href={`/transactions/${transaction.id}`}
                      className="text-xs text-mobius-blue hover:text-mobius-blue/80 underline"
                    >
                          {transaction.description}
                    </a>
                        {index < Math.min(selectedQuestion.transactionLineage.length, 3) - 1 && (
                    <span className="text-xs text-mobius-gray-400">•</span>
                        )}
                      </React.Fragment>
                    ))}
                    {selectedQuestion.transactionLineage.length > 3 && (
                      <span className="text-xs text-mobius-gray-500">
                        +{selectedQuestion.transactionLineage.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          </>
        )}
      </div>


      {/* Input Area */}
      <div className="bg-white border-t border-mobius-gray-200 p-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="Ask about your financial data... (e.g., 'What's our cash position?')"
              className="h-12 text-base"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            className="h-12 px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWithFinancials;
