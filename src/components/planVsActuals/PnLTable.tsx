import React, { useState } from 'react';
import { PnLLine } from '@/types/planVsActuals';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { getDataSourceLogoBySource } from '@/lib/dataSourceLogos';

interface PnLTableProps {
  pnlLines: PnLLine[];
}

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
};

const formatPercentage = (amount: number) => {
  return `${amount.toFixed(1)}%`;
};



const getSectionColor = (section: string) => {
  switch (section) {
    case 'Revenue':
      return 'bg-blue-100 text-blue-800';
    case 'COGS':
      return 'bg-red-100 text-red-800';
    case 'Gross Profit':
      return 'bg-green-100 text-green-800';
    case 'Operating Expenses':
      return 'bg-orange-100 text-orange-800';
    case 'Operating Income':
      return 'bg-purple-100 text-purple-800';
    case 'Other Income/Expense':
      return 'bg-gray-100 text-gray-800';
    case 'Net Income':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getSectionIcon = (section: string) => {
  switch (section) {
    case 'Revenue':
      return <div className="h-2 w-2 bg-blue-600 rounded-full" />;
    case 'COGS':
      return <div className="h-2 w-2 bg-red-600 rounded-full" />;
    case 'Gross Profit':
      return <div className="h-2 w-2 bg-green-600 rounded-full" />;
    case 'Operating Expenses':
      return <div className="h-2 w-2 bg-orange-600 rounded-full" />;
    case 'Operating Income':
      return <div className="h-2 w-2 bg-purple-600 rounded-full" />;
    case 'Other Income/Expense':
      return <div className="h-2 w-2 bg-gray-600 rounded-full" />;
    case 'Net Income':
      return <div className="h-2 w-2 bg-indigo-600 rounded-full" />;
    default:
      return <div className="h-2 w-2 bg-gray-600 rounded-full" />;
  }
};

export const PnLTable = ({ pnlLines }: PnLTableProps) => {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [collapsedSubsections, setCollapsedSubsections] = useState<Set<string>>(new Set());
  const [expandedLineItems, setExpandedLineItems] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
  const [timeframe, setTimeframe] = useState<'month' | 'quarter'>('month');

  const toggleSection = (section: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(section)) {
      newCollapsed.delete(section);
    } else {
      newCollapsed.add(section);
    }
    setCollapsedSections(newCollapsed);
  };

  const toggleSubsection = (subsectionKey: string) => {
    const newCollapsed = new Set(collapsedSubsections);
    if (newCollapsed.has(subsectionKey)) {
      newCollapsed.delete(subsectionKey);
    } else {
      newCollapsed.add(subsectionKey);
    }
    setCollapsedSubsections(newCollapsed);
  };

  const toggleLineItem = (lineKey: string) => {
    const newExpanded = new Set(expandedLineItems);
    if (newExpanded.has(lineKey)) {
      newExpanded.delete(lineKey);
    } else {
      newExpanded.add(lineKey);
    }
    setExpandedLineItems(newExpanded);
  };

  const setPage = (lineKey: string, page: number) => {
    setCurrentPage(prev => ({ ...prev, [lineKey]: page }));
  };

  const formatValue = (amount: number, unit: string) => {
    // Always format as currency for financial amounts, regardless of unit
    if (Math.abs(amount) >= 1000) {
      return formatCurrency(amount);
    } else if (unit === '%') {
      return formatPercentage(amount);
    }
    return amount.toString();
  };

  const renderSectionHeader = (section: string) => {
    const sectionLines = pnlLines.filter(line => line.section === section);
    const totals = calculateSectionTotals(sectionLines);
    
    return (
    <TableRow key={`section-${section}`} className="border-t border-gray-200">
        <TableCell className="font-medium text-gray-700 py-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleSection(section)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {collapsedSections.has(section) ? (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          {getSectionIcon(section)}
          <span>{section}</span>
        </div>
      </TableCell>
        <TableCell className="text-right font-medium text-gray-700">
          {formatValue(totals.plan, 'USD')}
        </TableCell>
        <TableCell className="text-right font-medium text-gray-700">
          {formatValue(totals.actual, 'USD')}
        </TableCell>
        <TableCell className="text-right font-medium text-gray-700">
          {totals.variance >= 0 ? '+' : ''}{formatValue(totals.variance, 'USD')}
        </TableCell>
        <TableCell className="text-right font-medium text-gray-700">
          {totals.variancePercent >= 0 ? '+' : ''}{totals.variancePercent.toFixed(1)}%
        </TableCell>
        <TableCell className="text-xs text-gray-600">
          <div className="text-left text-xs text-gray-500">
            {collapsedSections.has(section) ? 'Click to expand for details' : 'Section summary'}
          </div>
        </TableCell>
    </TableRow>
  );
  };

  const renderSubsectionHeader = (subsection: string, isFirst: boolean = false) => (
    <TableRow key={`subsection-${subsection}`} className="border-t border-gray-100">
      <TableCell colSpan={6} className="font-medium text-gray-600 py-2 pl-8">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleSubsection(subsection)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {collapsedSubsections.has(subsection) ? (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
        <span className="text-xs">{subsection}</span>
        </div>
      </TableCell>
    </TableRow>
  );

  const sections = ['Revenue', 'COGS', 'Gross Profit', 'Operating Expenses', 'Operating Income', 'Other Income/Expense', 'Net Income'];

  const getRowIndentation = (line: PnLLine) => {
    if (line.name.startsWith('    ')) return 'pl-12'; // Sub-subsection
    if (line.name.startsWith('  ')) return 'pl-8';   // Subsection
    return 'pl-4'; // Main section
  };

  const getRowStyle = (line: PnLLine) => {
    let baseStyle = "hover:bg-gray-50 border-b border-gray-100";
    
    // Add light red background for rows that need attention (negative variances > 5%)
    if (line.variancePercent < -5) {
      baseStyle += " bg-red-50";
    }
    
    return baseStyle;
  };



  const calculateSectionTotals = (sectionLines: PnLLine[]) => {
    const totals = {
      plan: 0,
      actual: 0,
      variance: 0,
      variancePercent: 0
    };

    sectionLines.forEach(line => {
      totals.plan += line.plan;
      totals.actual += line.actual;
      totals.variance += line.variance;
    });

    if (totals.plan !== 0) {
      totals.variancePercent = ((totals.variance / totals.plan) * 100);
    }

    return totals;
  };

  const getLineItemInfo = (line: PnLLine) => {
    const infoMap: Record<string, string> = {
      'Recurring Revenue': 'Monthly/Annual subscription revenue from SaaS products. Source: HubSpot CRM and billing systems.',
      'New ARR': 'New customer acquisitions and annual recurring revenue. Pipeline conversion at 25% vs 30% plan due to extended sales cycles.',
      'Expansion ARR': 'Upsell and cross-sell revenue from existing customers. Strong expansion rate of 18% driven by enterprise upgrades.',
      'Churned ARR': 'Customer churn and revenue loss. Higher than expected churn (8% vs 6% plan) due to competitive pressure in mid-market.',
      'Professional Services': 'Consulting and implementation services revenue. Billed at $150/hour based on project scope.',
      'Implementation': 'Project-based implementation services. On-time delivery but extended project timelines by 2-3 weeks.',
      'Advisory': 'Strategic consulting and advisory services. Stable utilization at 70% with strong client retention.',
      'Training': 'Customer training and certification programs. Below plan due to reduced demand and postponed sessions.',
      'Hardware Sales': 'Physical product revenue from equipment sales. Inventory tracked via NetSuite ERP system.',
      'Software Licenses': 'Perpetual software license sales. Revenue recognized upon delivery and customer acceptance.',
      'Other Revenue': 'Marketplace fees and partnership revenue. Above plan due to new strategic partnerships and increased marketplace activity.',
      'Cost of Goods Sold': 'Direct costs associated with revenue generation. Higher than plan due to infrastructure scaling and user growth.',
      'Hosting / Infrastructure': 'Cloud hosting and infrastructure costs. Above plan due to higher user growth and infrastructure scaling needs.',
      'Cloud (AWS/GCP)': 'Mobius reached out on Slack to John and found that 60% of the month\'s costs could be allocated to COGS, rest to R&D.',
      'CDN & Edge Services': 'Content delivery network and edge computing costs. Increased due to higher traffic and global expansion.',
      'Database Services': 'Database hosting and management costs. Stable but above plan due to data growth and backup requirements.',
      'Third-Party Software': 'Third-party software licenses for operations. Includes monitoring tools, security software, and development tools.',
      'Support Tools & Software': 'Customer support and operations software. Includes Zendesk, Intercom, and internal tools.',
      'Employee Salaries': 'Base compensation for full-time staff. Includes benefits and payroll taxes.',
      'Contractor Fees': 'External consultant and freelancer costs. Managed through Upwork and direct contracts.',
      'Office Rent': 'San Francisco office lease at $15/sqft. Includes utilities and maintenance.',
      'Marketing Spend': 'Digital advertising and content marketing. Allocated across Google Ads, LinkedIn, and content creation.',
      'Travel & Entertainment': 'Business travel and client entertainment. Requires VP approval for expenses over $500.',
      'Legal & Professional': 'Legal counsel and accounting services. Retainer-based relationships with key vendors.',
      'Insurance': 'General liability and professional indemnity coverage. Renewed annually with broker review.',
      'Depreciation': 'Straight-line depreciation on capital assets. 3-5 year useful life for equipment.',
      'Interest Expense': 'Bank loan interest and credit facility fees. Based on LIBOR + 2.5% margin.',
      'Tax Provision': 'Estimated income tax liability. Calculated quarterly with year-end true-up adjustments.',
      'Gross Profit': 'Revenue minus COGS. Below plan due to revenue shortfall and higher infrastructure costs.',
      'Operating Expenses': 'All operating costs excluding COGS. Includes R&D, sales, marketing, and administrative expenses.',
      'Operating Income': 'Gross profit minus operating expenses. Below plan due to revenue shortfall and cost overruns.',
      'Other Income / Expense': 'Non-operating items including interest, taxes, and one-time items.',
      'Net Income': 'Final profit after all expenses. Below plan due to revenue shortfall and higher than expected costs.',
      'Sales & Marketing': 'Customer acquisition and brand awareness costs. Includes advertising, events, and sales team expenses.',
      'Research & Development': 'Product development and engineering costs. Includes salaries, tools, and infrastructure for R&D teams.',
      'General & Administrative': 'Overhead and administrative costs. Includes legal, finance, HR, and executive team expenses.',
      'Customer Success': 'Customer onboarding and retention costs. Includes success managers, training, and support tools.',
      'Data & Analytics': 'Data processing and business intelligence costs. Includes tools, storage, and analytics team expenses.',
      'Security & Compliance': 'Security tools and compliance-related costs. Includes audits, certifications, and security software.',
      'International Expansion': 'Costs related to global market entry. Includes localization, legal, and market research expenses.'
    };

    return infoMap[line.name.trim()] || 'Standard accounting treatment applies. Source: General ledger and financial systems.';
  };

  // Mock data for revenue recognition contracts
  const getRevenueRecognitionData = (lineName: string) => {
    const mockContracts = [
      {
        id: 'CON-001',
        customer: 'TechCorp Inc.',
        contractValue: 125000,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        billingCycle: 'Monthly',
        status: 'Active',
        revenueRecognized: 31250,
        remainingValue: 93750
      },
      {
        id: 'CON-002',
        customer: 'DataFlow Systems',
        contractValue: 89000,
        startDate: '2025-01-15',
        endDate: '2025-07-14',
        billingCycle: 'Quarterly',
        status: 'Active',
        revenueRecognized: 44500,
        remainingValue: 44500
      },
      {
        id: 'CON-003',
        customer: 'CloudWorks Ltd.',
        contractValue: 210000,
        startDate: '2024-06-01',
        endDate: '2026-05-31',
        billingCycle: 'Annual',
        status: 'Active',
        revenueRecognized: 105000,
        remainingValue: 105000
      },
      {
        id: 'CON-004',
        customer: 'InnovateTech',
        contractValue: 67000,
        startDate: '2025-02-01',
        endDate: '2025-08-31',
        billingCycle: 'Monthly',
        status: 'Active',
        revenueRecognized: 16750,
        remainingValue: 50250
      },
      {
        id: 'CON-005',
        customer: 'SecureNet Solutions',
        contractValue: 156000,
        startDate: '2024-09-01',
        endDate: '2025-08-31',
        billingCycle: 'Quarterly',
        status: 'Active',
        revenueRecognized: 117000,
        remainingValue: 39000
      },
      {
        id: 'CON-006',
        customer: 'DataFlow Analytics',
        contractValue: 89000,
        startDate: '2025-01-01',
        endDate: '2025-06-30',
        billingCycle: 'Monthly',
        status: 'Active',
        revenueRecognized: 44500,
        remainingValue: 44500
      },
      {
        id: 'CON-007',
        customer: 'CloudWorks Enterprise',
        contractValue: 320000,
        startDate: '2024-12-01',
        endDate: '2026-11-30',
        billingCycle: 'Annual',
        status: 'Active',
        revenueRecognized: 80000,
        remainingValue: 240000
      },
      {
        id: 'CON-008',
        customer: 'InnovateTech Solutions',
        contractValue: 75000,
        startDate: '2025-02-01',
        endDate: '2025-07-31',
        billingCycle: 'Monthly',
        status: 'Active',
        revenueRecognized: 18750,
        remainingValue: 56250
      },
      {
        id: 'CON-009',
        customer: 'SecureNet Pro',
        contractValue: 125000,
        startDate: '2025-01-15',
        endDate: '2025-12-14',
        billingCycle: 'Quarterly',
        status: 'Active',
        revenueRecognized: 31250,
        remainingValue: 93750
      }
    ];

    return mockContracts;
  };

  // Mock data for vendor invoices
  const getVendorInvoiceData = (lineName: string) => {
    const mockInvoices = [
      {
        id: 'INV-001',
        vendor: 'AWS Cloud Services',
        invoiceNumber: 'AWS-2025-001',
        invoiceDate: '2025-01-15',
        dueDate: '2025-02-14',
        amount: 45000,
        status: 'Paid',
        category: 'Cloud Infrastructure',
        description: 'EC2, RDS, and S3 services for Q1 2025'
      },
      {
        id: 'INV-002',
        vendor: 'Google Cloud Platform',
        invoiceNumber: 'GCP-2025-001',
        invoiceDate: '2025-01-20',
        dueDate: '2025-02-19',
        amount: 32000,
        status: 'Paid',
        category: 'Cloud Infrastructure',
        description: 'Compute Engine and BigQuery services'
      },
      {
        id: 'INV-003',
        vendor: 'Microsoft Azure',
        invoiceNumber: 'AZURE-2025-001',
        invoiceDate: '2025-01-25',
        dueDate: '2025-02-24',
        amount: 28000,
        status: 'Paid',
        category: 'Cloud Infrastructure',
        description: 'Virtual machines and storage services'
      },
      {
        id: 'INV-004',
        vendor: 'Oracle Cloud',
        invoiceNumber: 'ORACLE-2025-001',
        invoiceDate: '2025-01-30',
        dueDate: '2025-03-01',
        amount: 15000,
        status: 'Pending',
        category: 'Cloud Infrastructure',
        description: 'Database and analytics services'
      },
      {
        id: 'INV-005',
        vendor: 'DigitalOcean',
        invoiceNumber: 'DO-2025-001',
        invoiceDate: '2025-01-10',
        dueDate: '2025-02-09',
        amount: 8000,
        status: 'Paid',
        category: 'Cloud Infrastructure',
        description: 'Droplet instances and managed databases'
      },
      {
        id: 'INV-006',
        vendor: 'HubSpot Inc',
        invoiceNumber: 'HUBSPOT-614657704',
        invoiceDate: '2025-01-10',
        dueDate: '2025-02-09',
        amount: 2500,
        status: 'Paid',
        category: 'Marketing',
        description: 'Marketing Hub Starter subscription'
      },
      {
        id: 'INV-007',
        vendor: 'Zendesk Inc',
        invoiceNumber: 'ZENDESK-2025-001',
        invoiceDate: '2025-01-05',
        dueDate: '2025-02-04',
        amount: 12000,
        status: 'Paid',
        category: 'Support',
        description: 'Support Suite annual license'
      },
      {
        id: 'INV-008',
        vendor: 'Brex Inc',
        invoiceNumber: 'BREX-2025-001',
        invoiceDate: '2025-01-12',
        dueDate: '2025-02-11',
        amount: 8000,
        status: 'Paid',
        category: 'Finance',
        description: 'Corporate card processing fees'
      },
      {
        id: 'INV-009',
        vendor: 'Rippling Inc',
        invoiceNumber: 'RIPPLING-2025-001',
        invoiceDate: '2025-01-08',
        dueDate: '2025-02-07',
        amount: 15000,
        status: 'Paid',
        category: 'HR',
        description: 'HRIS and payroll platform annual'
      }
    ];

    return mockInvoices;
  };

  // Determine if a line item should show expandable data
  const shouldShowExpandableData = (lineName: string) => {
    const revenueItems = ['Recurring Revenue', 'New ARR', 'Expansion ARR', 'Churned ARR', 'Professional Services', 'Hardware Sales', 'Software Licenses'];
    const expenseItems = ['Cloud (AWS/GCP)', 'Employee Salaries', 'Contractor Fees', 'Office Rent', 'Marketing Spend'];
    
    return revenueItems.includes(lineName.trim()) || expenseItems.includes(lineName.trim());
  };

  // Get the appropriate data type for a line item
  const getDataType = (lineName: string) => {
    const revenueItems = ['Recurring Revenue', 'New ARR', 'Expansion ARR', 'Churned ARR', 'Professional Services', 'Hardware Sales', 'Software Licenses'];
    return revenueItems.includes(lineName.trim()) ? 'revenue' : 'expense';
  };

  // Get the primary data source for a line item
  const getPrimaryDataSource = (line: PnLLine) => {
    // Check drilldown data sources first
    if (line.drilldownData?.sources && line.drilldownData.sources.length > 0) {
      const primarySource = line.drilldownData.sources[0];
      return primarySource.source;
    }
    
    // Map line items to available data sources
    if (line.section === 'Revenue') {
      if (line.name.includes('Subscription') || line.name.includes('ARR') || line.name.includes('Revenue')) {
        return 'hubspot'; // CRM data for subscription metrics
      }
      if (line.name.includes('Professional Services') || line.name.includes('Implementation') || line.name.includes('Advisory') || line.name.includes('Training')) {
        return 'hubspot'; // CRM data for services (customer relationships)
      }
      if (line.name.includes('Hardware') || line.name.includes('Software Licenses')) {
        return 'stripe'; // Payment processing for products
      }
      return 'hubspot'; // Default to HubSpot for revenue
    }
    
    if (line.section === 'COGS') {
      if (line.name.includes('Cloud') || line.name.includes('AWS') || line.name.includes('GCP')) {
        return 'aws'; // Cloud infrastructure costs
      }
      if (line.name.includes('Employee') || line.name.includes('Support') || line.name.includes('Payroll')) {
        return 'rippling'; // HR/Payroll data
      }
      if (line.name.includes('Travel') || line.name.includes('Expense') || line.name.includes('Card')) {
        return 'brex'; // Corporate card expenses
      }
      return 'brex'; // Default to Brex for other COGS
    }
    
    if (line.section === 'Operating Expenses') {
      if (line.name.includes('Marketing') || line.name.includes('Sales') || line.name.includes('Customer Success')) {
        return 'hubspot'; // CRM/Marketing data
      }
      if (line.name.includes('Travel') || line.name.includes('Expense')) {
        return 'brex'; // Corporate card expenses
      }
      if (line.name.includes('Research') || line.name.includes('Development') || line.name.includes('R&D')) {
        return 'hubspot'; // Product development tracking via CRM
      }
      return 'brex'; // Default to Brex for OpEx
    }
    
    return 'hubspot'; // Default fallback
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <h2 className="text-sm font-medium text-blue-900 mb-3">Executive Summary</h2>
        
        {/* Performance Overview */}
        <div className="mb-4">
          <p className="text-xs text-blue-800 leading-relaxed">
            <span className="font-medium">MTD Performance:</span> Revenue at $40.6M vs $42.2M plan, representing a $1.6M shortfall (-3.7%). 
            <span className="font-medium"> QTD Performance:</span> Revenue at $118.2M vs $125.8M plan, representing a $7.6M shortfall (-6.0%). 
            Customer churn rate at 8.0% vs 6.0% plan, indicating increased competitive pressure in the mid-market segment.
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <img
              src="/logos/data-sources/4844517.png"
              alt="HubSpot CRM"
              className="h-4 w-4"
            />
            <span className="text-xs text-blue-700">Revenue metrics powered by HubSpot CRM</span>
          </div>
        </div>
        
        {/* Key Insights */}
        <div className="mb-4">
          <h3 className="text-xs font-medium text-blue-900 mb-2">Key Insights</h3>
          <p className="text-xs text-blue-800 leading-relaxed">
            Subscription revenue below plan due to extended sales cycles and lower pipeline conversion rates (25% vs 30% target). 
            Infrastructure costs above plan due to user growth scaling, with software licensing costs increased for compliance requirements. 
            Strong expansion ARR performance at 18% vs 15% plan, driven by enterprise upgrades and feature adoption. 
            Other revenue above plan due to new strategic partnerships and increased marketplace activity.
          </p>
        </div>
        
        {/* CFO Recommendations */}
        <div>
          <h3 className="text-xs font-medium text-blue-900 mb-2">CFO Recommendations</h3>
          <div className="space-y-2">
            <p className="text-xs text-blue-800 leading-relaxed">
              <span className="font-medium">1. Immediate Action Required:</span> Review sales pipeline conversion strategies. 
              Current 25% rate vs 30% target is driving $0.5M revenue shortfall monthly.
            </p>
            <p className="text-xs text-blue-800 leading-relaxed">
              <span className="font-medium">2. Cost Management:</span> Implement infrastructure cost optimization program. 
              Current $12.50/user vs $12.00 target represents $200K monthly opportunity.
            </p>
            <p className="text-xs text-blue-800 leading-relaxed">
              <span className="font-medium">3. Strategic Opportunity:</span> Leverage successful expansion patterns. 
              18% expansion rate vs 15% plan shows $200K monthly upside potential.
            </p>
          </div>
        </div>
      </div>

      {/* P&L Table */}
      <div className="border rounded-lg overflow-hidden">
        {/* Timeframe Toggle */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex bg-white border border-gray-200 rounded-md p-1">
              <button
                onClick={() => setTimeframe('month')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  timeframe === 'month'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeframe('quarter')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  timeframe === 'quarter'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Quarter
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {timeframe === 'month' ? 'Showing monthly data' : 'Showing quarterly data'}
          </div>
        </div>
      </div>
      
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[300px] text-xs">P&L Line</TableHead>
            <TableHead className="text-right text-xs">Plan</TableHead>
            <TableHead className="text-right text-xs">Actual</TableHead>
            <TableHead className="text-right text-xs">Variance</TableHead>
            <TableHead className="text-right text-xs">% Variance</TableHead>
            <TableHead className="w-[500px] text-xs">Analysis</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.map(section => {
            const sectionLines = pnlLines.filter(line => line.section === section);
            if (sectionLines.length === 0) return null;

            // Group by subsection
            const subsections = [...new Set(sectionLines.map(line => line.subsection))];
            
            return (
              <React.Fragment key={section}>
                {renderSectionHeader(section)}
                {!collapsedSections.has(section) && (
                  <React.Fragment>
                    {subsections.map((subsection, subsectionIndex) => {
                      const subsectionLines = sectionLines.filter(line => line.subsection === subsection);
                      const isFirstSubsection = subsectionIndex === 0;
                      
                      return (
                        <React.Fragment key={subsection}>
                          {subsection && renderSubsectionHeader(subsection, isFirstSubsection)}
                          {!collapsedSubsections.has(subsection) && (
                            <>
                          {subsectionLines.map((line) => (
                                <React.Fragment key={line.key}>
                                  <TableRow className={getRowStyle(line)}>
                              <TableCell className={getRowIndentation(line)}>
                                <div className="flex items-center space-x-2">
                                        {shouldShowExpandableData(line.name.trim()) && (
                                          <button
                                            onClick={() => toggleLineItem(line.key)}
                                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                                          >
                                            {expandedLineItems.has(line.key) ? (
                                              <ChevronDown className="h-3 w-3 text-gray-500" />
                                            ) : (
                                              <ChevronRight className="h-3 w-3 text-gray-500" />
                                            )}
                                          </button>
                                        )}
                                  <span className="font-medium text-xs">
                                    {line.name.trim()}
                                  </span>
                                        <div className="group relative">
                                          <Info className="h-3 w-3 text-gray-400 hover:text-blue-600 cursor-help transition-colors" />
                                          <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-96 z-10">
                                            {getLineItemInfo(line)}
                                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                          </div>
                                        </div>
                                        
                                        {/* Data Source Logo */}
                                        {(() => {
                                          const dataSource = getPrimaryDataSource(line);
                                          const logo = getDataSourceLogoBySource(dataSource);
                                          if (logo) {
                                            const isHubSpot = dataSource === 'hubspot';
                                            return (
                                              <img
                                                src={logo.logoPath}
                                                alt={logo.altText}
                                                title={isHubSpot ? `HubSpot CRM: ${logo.description}` : `Data source: ${logo.description}`}
                                                className={`h-4 w-4 ml-1 transition-opacity cursor-help ${
                                                  isHubSpot ? 'opacity-80 hover:opacity-100' : 'opacity-60 hover:opacity-100'
                                                }`}
                                              />
                                            );
                                          }
                                          return null;
                                        })()}
                                </div>
                            {line.driver && (
                              <div className="text-xs text-gray-500 mt-1 text-xs">
                                Driver: {line.driver}
                              </div>
                            )}
                            {line.kpiMetrics && (
                              <div className="text-xs text-blue-600 mt-1 text-xs">
                                {line.kpiMetrics.arr && `ARR: ${formatCurrency(line.kpiMetrics.arr)} • `}
                                {line.kpiMetrics.arpu && `ARPU: $${line.kpiMetrics.arpu} • `}
                                {line.kpiMetrics.churnRate && `Churn: ${(line.kpiMetrics.churnRate * 100).toFixed(1)}% • `}
                                {line.kpiMetrics.customerCount && `Customers: ${line.kpiMetrics.customerCount.toLocaleString()} • `}
                                {line.kpiMetrics.utilization && `Utilization: ${(line.kpiMetrics.utilization * 100).toFixed(0)}% • `}
                                {line.kpiMetrics.headcount && `Headcount: ${line.kpiMetrics.headcount} • `}
                                {line.kpiMetrics.costPerUser && `Cost/User: $${line.kpiMetrics.costPerUser} • `}
                                {line.kpiMetrics.margin && `Margin: ${(line.kpiMetrics.margin * 100).toFixed(1)}% • `}
                                {line.kpiMetrics.contributionMargin && `Contribution: ${(line.kpiMetrics.contributionMargin * 100).toFixed(1)}% • `}
                                {line.kpiMetrics.recurringRevenueCoverage && `Coverage: ${(line.kpiMetrics.recurringRevenueCoverage * 100).toFixed(1)}% • `}
                                {line.kpiMetrics.cac && `CAC: $${line.kpiMetrics.cac} • `}
                                {line.kpiMetrics.pipelineCoverage && `Pipeline: ${line.kpiMetrics.pipelineCoverage}x`}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatValue(line.plan, line.unit)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatValue(line.actual, line.unit)}
                          </TableCell>
                                                               <TableCell className="text-right font-medium">
                                       {line.variance >= 0 ? '+' : ''}{formatValue(line.variance, line.unit)}
                                     </TableCell>
                                     <TableCell className="text-right font-medium">
                                       {line.variancePercent >= 0 ? '+' : ''}{line.variancePercent.toFixed(1)}%
                                     </TableCell>
                          <TableCell className="text-xs text-gray-600">
                            {line.drilldownData?.explanation ? (
                              <div className="text-left">
                                <div className="font-medium mb-1 text-xs">Key Drivers:</div>
                                <div className="text-xs text-gray-500 leading-relaxed">
                                  {line.drilldownData.explanation}
                                </div>
                                {line.drilldownData.assumptions && line.drilldownData.assumptions.length > 0 && (
                                  <div className="mt-2">
                                    <div className="font-medium text-xs text-gray-600 mb-1">Assumptions:</div>
                                    <div className="text-xs text-gray-500">
                                      {line.drilldownData.assumptions[0]?.description}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : line.isCalculated ? (
                              <div className="text-left text-xs text-gray-500">
                                Calculated: {line.calculation}
                              </div>
                            ) : (
                              <div className="text-left text-xs text-gray-400">
                                No variance analysis available
                              </div>
                            )}
                          </TableCell>
                                  </TableRow>

                                  {/* Expandable Detail Row */}
                                  {expandedLineItems.has(line.key) && shouldShowExpandableData(line.name.trim()) && (
                                    <TableRow>
                                      <TableCell colSpan={6} className="p-0">
                                        <div className="bg-gray-50 border-t border-gray-200">
                                          {getDataType(line.name.trim()) === 'revenue' ? (
                                            <div className="p-4">
                                              <h4 className="font-medium text-gray-900 mb-3 text-xs">Revenue Recognition Contracts</h4>
                                              <div className="overflow-x-auto">
                                                <table className="w-full text-xs">
                                                  <thead>
                                                    <tr className="border-b border-gray-200">
                                                      <th className="text-left py-2 px-2">Contract ID</th>
                                                      <th className="text-left py-2 px-2">Customer</th>
                                                      <th className="text-right py-2 px-2">Contract Value</th>
                                                      <th className="text-left py-2 px-2">Start Date</th>
                                                      <th className="text-left py-2 px-2">End Date</th>
                                                      <th className="text-left py-2 px-2">Billing Cycle</th>
                                                      <th className="text-left py-2 px-2">Status</th>
                                                      <th className="text-right py-2 px-2">Revenue Recognized</th>
                                                      <th className="text-right py-2 px-2">Remaining Value</th>
                                                      <th className="text-left py-2 px-2">Source</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {getRevenueRecognitionData(line.name.trim()).map((contract) => (
                                                      <tr key={contract.id} className="border-b border-gray-100 hover:bg-gray-100">
                                                        <td className="py-2 px-2 font-medium">{contract.id}</td>
                                                        <td className="py-2 px-2">{contract.customer}</td>
                                                        <td className="py-2 px-2 text-right">{formatCurrency(contract.contractValue)}</td>
                                                        <td className="py-2 px-2">{contract.startDate}</td>
                                                        <td className="py-2 px-2">{contract.endDate}</td>
                                                        <td className="py-2 px-2">{contract.billingCycle}</td>
                                                        <td className="py-2 px-2">
                                                          <span className={`px-2 py-1 rounded-full text-xs ${
                                                            contract.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                          }`}>
                                                            {contract.status}
                                                          </span>
                                                        </td>
                                                        <td className="py-2 px-2 text-right">{formatCurrency(contract.revenueRecognized)}</td>
                                                        <td className="py-2 px-2 text-right">{formatCurrency(contract.remainingValue)}</td>
                                                        <td className="py-2 px-2">
                                                          <img
                                                            src="/logos/data-sources/4844517.png"
                                                            alt="HubSpot"
                                                            title="Data source: HubSpot"
                                                            className="h-3 w-3 opacity-60"
                                                          />
                                                        </td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="p-2">
                                              <h4 className="font-medium text-gray-900 mb-3 text-xs">Vendor Invoices</h4>
                                              <div className="overflow-x-auto">
                                                <table className="w-full text-xs">
                                                  <thead>
                                                    <tr className="border-b border-gray-200">
                                                      <th className="text-left py-2 px-2">Invoice ID</th>
                                                      <th className="text-left py-2 px-2">Vendor</th>
                                                      <th className="text-left py-2 px-2">Invoice #</th>
                                                      <th className="text-left py-2 px-2">Invoice Date</th>
                                                      <th className="text-left py-2 px-2">Due Date</th>
                                                      <th className="text-right py-2 px-2">Amount</th>
                                                      <th className="text-left py-2 px-2">Status</th>
                                                      <th className="text-left py-2 px-2">Category</th>
                                                      <th className="text-left py-2 px-2">Description</th>
                                                      <th className="text-left py-2 px-2">Source</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {getVendorInvoiceData(line.name.trim()).map((invoice) => (
                                                      <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-100">
                                                        <td className="py-2 px-2 font-medium">{invoice.id}</td>
                                                        <td className="py-2 px-2">{invoice.vendor}</td>
                                                        <td className="py-2 px-2">{invoice.invoiceNumber}</td>
                                                        <td className="py-2 px-2">{invoice.invoiceDate}</td>
                                                        <td className="py-2 px-2">{invoice.dueDate}</td>
                                                        <td className="py-2 px-2 text-right">{formatCurrency(invoice.amount)}</td>
                                                        <td className="py-2 px-2">
                                                          <span className={`px-2 py-1 rounded-full text-xs ${
                                                            invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                          }`}>
                                                            {invoice.status}
                                                          </span>
                                                        </td>
                                                        <td className="py-2 px-2">{invoice.category}</td>
                                                        <td className="py-2 px-2">{invoice.description}</td>
                                                        <td className="py-2 px-2">
                                                          <img
                                                            src="/logos/data-sources/brex.png"
                                                            alt="Brex"
                                                            title="Data source: Brex"
                                                            className="h-3 w-3 opacity-60"
                                                          />
                                                        </td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </TableCell>
                          </TableRow>
                                  )}
                                </React.Fragment>
                        ))}
                      </>
                    )}
                        </React.Fragment>
                      );
                    })}
                    {/* Section Totals */}
                    <TableRow className="border-t-2 border-gray-300 bg-gray-50">
                      <TableCell className="font-medium text-gray-800 pl-4">
                        {section} Total
                      </TableCell>
                      <TableCell className="text-right font-medium text-gray-800">
                        {formatValue(calculateSectionTotals(sectionLines).plan, 'USD')}
                      </TableCell>
                      <TableCell className="text-right font-medium text-gray-800">
                        {formatValue(calculateSectionTotals(sectionLines).actual, 'USD')}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {calculateSectionTotals(sectionLines).variance >= 0 ? '+' : ''}{formatValue(calculateSectionTotals(sectionLines).variance, 'USD')}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {calculateSectionTotals(sectionLines).variancePercent >= 0 ? '+' : ''}{calculateSectionTotals(sectionLines).variancePercent.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-xs text-gray-600">
                        <div className="text-left text-xs text-gray-500">
                          Section aggregate
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                )}

              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
      
      {/* Data Source Legend */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <span className="font-medium">Data Sources:</span>
          <div className="flex items-center space-x-2">
            <img
              src="/logos/data-sources/4844517.png"
              alt="HubSpot"
              className="h-4 w-4"
            />
            <span>HubSpot CRM</span>
          </div>
          <div className="flex items-center space-x-2">
            <img
              src="/logos/data-sources/Stripe_Logo,_revised_2016.svg.png"
              alt="Stripe"
              className="h-4 w-4"
            />
            <span>Stripe</span>
          </div>
          <div className="flex items-center space-x-2">
            <img
              src="/logos/data-sources/brex.png"
              alt="Brex"
              className="h-4 w-4"
            />
            <span>Brex</span>
          </div>
          <div className="flex items-center space-x-2">
            <img
              src="/logos/data-sources/rippling.jpg"
              alt="Rippling"
              className="h-4 w-4"
            />
            <span>Rippling</span>
          </div>
          <div className="flex items-center space-x-2">
            <img
              src="/logos/data-sources/Amazon_Web_Services_Logo.svg.png"
              alt="AWS"
              className="h-4 w-4"
            />
            <span>AWS</span>
          </div>
        </div>
      </div>
        </div>
      </div>
  );
};

