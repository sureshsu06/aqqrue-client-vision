import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  FileText, 
  Settings, 
  Users, 
  DollarSign, 
  Shield, 
  BarChart3,
  Play,
  BookOpen,
  Search,
  Star,
  Menu
} from "lucide-react";
import { AboutCompanyTab } from "@/components/onboarding/AboutCompanyTab";
import { PlaygroundTab } from "@/components/onboarding/PlaygroundTab";
import { sopContent, getDefaultContent } from "@/data/sopContent";

interface NavigationItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
  content?: React.ReactNode;
}

const Onboarding = () => {
  const [selectedSection, setSelectedSection] = useState("overview");
  const [selectedSubSection, setSelectedSubSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string>("purpose");

  // Handle URL parameters for deep linking
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    const subsection = urlParams.get('subsection');
    
    if (section) {
      setSelectedSection(section);
    }
    if (subsection) {
      setSelectedSubSection(subsection);
    }
  }, []);

  // Keyboard shortcut for search (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search or ask"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll spy for active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      // Dynamically find all sections with IDs in the current content
      const allElements = document.querySelectorAll('[id]');
      const sections: string[] = [];
      
      allElements.forEach(element => {
        const id = element.id;
        // Only include sections that are likely to be content sections (not UI elements)
        if (id && !id.includes('react') && !id.includes('root') && !id.includes('app')) {
          sections.push(id);
        }
      });

      if (sections.length === 0) {
        setActiveSection('purpose');
        return;
      }

      const scrollPosition = window.scrollY + 100;
      let currentSection = sections[0]; // Default to first section

      // Find the section that's currently in view
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          const elementBottom = offsetTop + offsetHeight;
          
          // Check if we're in the middle of this section
          if (scrollPosition >= offsetTop && scrollPosition <= elementBottom) {
            currentSection = section;
            break;
          }
          
          // If we're past this section but not at the next one, this is the active section
          if (scrollPosition > elementBottom && i === sections.length - 1) {
            currentSection = section;
          }
        }
      }

      setActiveSection(currentSection);
    };

    // Add a small delay to ensure content is rendered
    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 200);

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [selectedSection, selectedSubSection]); // Re-run when content changes

  const navigationItems: NavigationItem[] = [
    {
      id: "overview",
      title: "Overview",
      icon: <BookOpen className="h-4 w-4" />,
      children: [
        { id: "purpose-scope", title: "Purpose & scope" },
        { id: "audience-access", title: "Audience & access level" },
        { id: "quick-guide", title: "How to use these SOPs" },
        { id: "version-info", title: "Last updated / version / owner" },
        { id: "quick-links", title: "Quick links" }
      ]
    },
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Play className="h-4 w-4" />,
      children: [
        { id: "quickstart-checklist", title: "Quickstart checklist" },
        { id: "access-roles", title: "Access & roles (RACI)" },
        { id: "systems-credentials", title: "Systems & credentials" },
        { id: "onboarding-training", title: "Onboarding training modules" }
      ]
    },
    {
      id: "accounting-policies",
      title: "Accounting Policies",
      icon: <BookOpen className="h-4 w-4" />,
      children: [
        { id: "recognition-measurement", title: "Recognition & measurement" },
        { id: "chart-accounts-policy", title: "Chart of Accounts policy" },
        { id: "capitalization-policy", title: "Capitalization policy" },
        { id: "fx-multicurrency", title: "FX & multi-currency policy" },
        { id: "estimation-judgement", title: "Estimation & judgement policy" }
      ]
    },
    {
      id: "chart-of-accounts",
      title: "Chart of Accounts",
      icon: <BarChart3 className="h-4 w-4" />,
      children: [
        { id: "coa-structure", title: "COA structure & examples" },
        { id: "department-mapping", title: "Department & cost center mapping" },
        { id: "integration-mapping", title: "Mapping rules for integrations" },
        { id: "coa-change-request", title: "COA change request form" }
      ]
    },
    {
      id: "month-end-close",
      title: "Month-end Close",
      icon: <Settings className="h-4 w-4" />,
      children: [
        { id: "close-calendar", title: "Close calendar & timeline" },
        { id: "accruals-provisions", title: "Accruals & Provisions" },
        { id: "role-assignments", title: "Role assignments & owner matrix" },
        { id: "close-checklist", title: "Close checklist (by sub-process)" },
        { id: "deliverables-signoffs", title: "Required deliverables and sign-offs" },
        { id: "exceptions-escalation", title: "Close exceptions & escalation flow" }
      ]
    },
    {
      id: "journals-adjustments",
      title: "Journals & Adjustments",
      icon: <FileText className="h-4 w-4" />,
      children: [
        { id: "je-policy", title: "JE policy & approval thresholds" },
        { id: "recurring-journals", title: "Recurring journal process" },
        { id: "accrual-journal-entry", title: "Accrual Journal Entry" },
        { id: "sample-entries", title: "Sample journal entries & posting guide" }
      ]
    },
    {
      id: "accounts-receivable",
      title: "Accounts Receivable",
      icon: <DollarSign className="h-4 w-4" />,
      children: [
        { id: "invoice-creation", title: "Invoice creation & delivery SOP" },
        { id: "credit-memos", title: "Credit memos & disputes" },
        { id: "collections-process", title: "Collections process & aging" },
        { id: "bad-debt-provision", title: "Bad debt provision & write-offs" },
        { id: "ar-reconciliations", title: "AR reconciliations & KPIs" }
      ]
    },
    {
      id: "accounts-payable",
      title: "Accounts Payable",
      icon: <DollarSign className="h-4 w-4" />,
      children: [
        { id: "invoice-intake", title: "Purchase invoice intake & coding" },
        { id: "three-way-match", title: "Three-way match / PO workflow" },
        { id: "payment-runs", title: "Payment runs & approval matrix" },
        { id: "vendor-master-creation", title: "Vendor Master Creation" },
        { id: "prepaid-expenses", title: "Prepaid Expenses Policy" },
        { id: "ap-reconciliations", title: "AP reconciliations & KPIs" }
      ]
    },
    {
      id: "cash-bank-management",
      title: "Cash & Bank Management",
      icon: <BarChart3 className="h-4 w-4" />,
      children: [
        { id: "bank-account-setup", title: "Bank account setup & signatories" },
        { id: "daily-cash-process", title: "Daily cash process & forecast" },
        { id: "unreconciled-items-aging", title: "Unreconciled Items Aging" },
        { id: "petty-cash", title: "Petty cash & cash advances" }
      ]
    },
    {
      id: "payroll-benefits",
      title: "Payroll & Benefits",
      icon: <Users className="h-4 w-4" />,
      children: [
        { id: "payroll-run", title: "Payroll run process & timelines" },
        { id: "taxes-withholdings", title: "Taxes, withholdings & filings" },
        { id: "payroll-reconciliations", title: "Payroll reconciliations" },
        { id: "expense-reimbursement", title: "Expense Reimbursement Process" }
      ]
    },
    {
      id: "corporate-credit-card",
      title: "Corporate Credit Card",
      icon: <DollarSign className="h-4 w-4" />,
      children: [
        { id: "program-overview", title: "Program Overview" },
        { id: "card-issuance-limits", title: "Card Issuance & Limits" },
        { id: "card-usage-policy", title: "Card Usage Policy" },
        { id: "expense-submission-review", title: "Expense Submission & Review" },
        { id: "reconciliation-accounting", title: "Reconciliation & Accounting" },
        { id: "workflows", title: "Workflows" }
      ]
    },
    {
      id: "fixed-assets",
      title: "Fixed Assets",
      icon: <Settings className="h-4 w-4" />,
      children: [
        { id: "asset-capitalization", title: "Asset capitalization & useful lives" },
        { id: "depreciation-schedules", title: "Depreciation schedules & postings" },
        { id: "asset-disposal", title: "Asset Disposal" },
        { id: "physical-inventory", title: "Physical inventory & tag process" }
      ]
    },
    {
      id: "revenue-recognition",
      title: "Revenue Recognition",
      icon: <DollarSign className="h-4 w-4" />,
      children: [
        { id: "contract-review", title: "Contract review checklist" },
        { id: "asc-ifrs-steps", title: "ASC/IFRS recognition steps" },
        { id: "deferred-revenue", title: "Deferred revenue accounting & schedules" },
        { id: "revenue-qa", title: "Monthly revenue QA checks" }
      ]
    },
    {
      id: "tax-compliance",
      title: "Tax & Compliance",
      icon: <Shield className="h-4 w-4" />,
      children: [
        { id: "tax-filing-calendar", title: "Tax filing calendar & responsibilities" },
        { id: "withholding-indirect", title: "Withholding & indirect tax processes" },
        { id: "statutory-reporting", title: "Statutory reporting requirements" },
        { id: "tax-evidence", title: "Tax evidence & document retention" }
      ]
    },
    {
      id: "internal-controls",
      title: "Internal Controls",
      icon: <Shield className="h-4 w-4" />,
      children: [
        { id: "control-matrix", title: "Control matrix (linked to SOPs)" },
        { id: "segregation-duties", title: "Segregation of duties examples" },
        { id: "manual-journal-review", title: "Review of Manual Journal Entries" },
        { id: "self-assessment", title: "Self-assessment & remediation tracking" }
      ]
    },
    {
      id: "audit",
      title: "Audit",
      icon: <BarChart3 className="h-4 w-4" />,
      children: [
        { id: "external-audit-pack", title: "External audit pack" },
        { id: "internal-audit-requests", title: "Internal audit requests & response templates" },
        { id: "audit-trails", title: "Audit trails & evidence storage" },
        { id: "past-findings", title: "Past findings & remediation status" }
      ]
    },
    {
      id: "reporting-financial-statements",
      title: "Reporting & Financial Statements",
      icon: <BarChart3 className="h-4 w-4" />,
      children: [
        { id: "management-pack", title: "Monthly management pack contents" },
        { id: "financial-statement-checklist", title: "Financial statement close checklist" },
        { id: "variance-analysis", title: "Variance analysis templates & guidance" },
        { id: "kpi-definitions", title: "KPI definitions & calculation logic" }
      ]
    },
    {
      id: "systems-integrations",
      title: "Systems & Integrations",
      icon: <Settings className="h-4 w-4" />,
      children: [
        { id: "erp-configuration", title: "ERP / subledger configuration guides" },
        { id: "data-flow-diagrams", title: "Data flow diagrams" },
        { id: "integration-mapping", title: "Integration mapping & troubleshooting" },
        { id: "backup-restore", title: "Backup / restore & data retention rules" }
      ]
    },
    {
      id: "templates-tools",
      title: "Templates & Tools",
      icon: <FileText className="h-4 w-4" />,
      children: [
        { id: "je-template", title: "Journal entry template" },
        { id: "reconciliation-template", title: "Reconciliation template" },
        { id: "approval-forms", title: "Approval form templates" },
        { id: "excel-macros", title: "Excel macros / helper scripts" }
      ]
    },
    {
      id: "training-certification",
      title: "Training & Certification",
      icon: <Users className="h-4 w-4" />,
      children: [
        { id: "role-training", title: "Role-specific training checklists" },
        { id: "video-walkthroughs", title: "Video walkthroughs & slide decks" },
        { id: "test-quiz", title: "Test / quiz and certification status" }
      ]
    },
    {
      id: "support-escalation",
      title: "Support & Escalation",
      icon: <Settings className="h-4 w-4" />,
      children: [
        { id: "contacts", title: "Contacts (owners, backup owners)" },
        { id: "policy-change-request", title: "How to request a policy change" },
        { id: "escalation-matrix", title: "Escalation matrix & SLA" }
      ]
    }
  ];

  // Filter navigation items based on search query
  const filteredNavigationItems = navigationItems.filter(item => {
    if (!searchQuery) return true;
    
    const matchesTitle = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChildren = item.children?.some(child => 
      child.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return matchesTitle || matchesChildren;
  });

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
    setSelectedSubSection(null);
  };

  const handleSubSectionClick = (subSectionId: string) => {
    setSelectedSubSection(subSectionId);
  };

  const getCurrentContent = () => {
    const section = navigationItems.find(item => item.id === selectedSection);
    if (!section) return null;

    if (selectedSubSection) {
      // Check if we have specific SOP content for this section/subsection
      const sopData = sopContent[selectedSection as keyof typeof sopContent];
      if (sopData && sopData[selectedSubSection as keyof typeof sopData]) {
        const subSectionData = sopData[selectedSubSection as keyof typeof sopData] as any;
        if (subSectionData && subSectionData.content) {
          return subSectionData.content;
        }
      }
      
      // For month-end close workflows, use PlaygroundTab
      if (selectedSection === "month-end-close") {
        return <PlaygroundTab />;
      }
      
      // For corporate credit card workflows, show workflow image with chat
      if (selectedSection === "corporate-credit-card" && selectedSubSection === "workflows") {
        return (
          <div className="w-full space-y-6">
            <div>
              {/* Section Header - smaller font */}
              <p className="text-sm font-medium text-blue-600 mb-2">
                Corporate Credit Card
              </p>
              
              {/* Sub-section Title - large and semi-bold */}
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Workflows
              </h2>
              
              {/* Sub-section Description - medium grey */}
              <p className="text-base text-gray-600 mb-6">
                Automated workflows for corporate credit card transaction processing, reconciliation, and approval processes.
              </p>

              {/* Workflow Image with Chat */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Corporate Card Transaction Processing Workflow</h3>
                </div>
                <div className="w-full">
                  <img 
                    id="workflow-image"
                    src="/p2p-brex-1.jpeg" 
                    alt="Corporate Credit Card Workflow" 
                    className="w-full h-auto rounded-lg shadow-sm"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Interactive workflow showing the end-to-end corporate credit card transaction processing from data collection to final reconciliation.
                </p>
                
                {/* Chat Interface */}
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-sm max-w-md mx-auto">
                    <div className="flex items-center p-3">
                      <input
                        type="text"
                        placeholder="Modify the workflow"
                        className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            // Switch to animated workflow when user chats
                            const img = document.getElementById('workflow-image') as HTMLImageElement;
                            if (img) {
                              img.src = '/p2p-brex-2.gif';
                            }
                            // Clear the input
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <div className="flex items-center space-x-3 ml-3">
                        <div className="text-gray-500 text-xs font-medium">⌘I</div>
                        <button 
                          className="w-8 h-8 bg-green-500 hover:bg-green-600 border border-gray-300 rounded-full flex items-center justify-center transition-colors"
                          onClick={(e) => {
                            const input = (e.target as HTMLElement).parentElement?.parentElement?.querySelector('input') as HTMLInputElement;
                            if (input && input.value.trim()) {
                              // Switch to animated workflow when user chats
                              const img = document.getElementById('workflow-image') as HTMLImageElement;
                              if (img) {
                                img.src = '/p2p-brex-2.gif';
                              }
                              // Clear the input
                              input.value = '';
                            }
                          }}
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      
      
      // For overview section, show business overview
      if (selectedSection === "overview") {
        return <AboutCompanyTab />;
      }
      
      // Default content for other sections
      return getDefaultContent(selectedSection, selectedSubSection);
    }

    // Default content when no subsection is selected
    if (selectedSection === "overview") {
      return <AboutCompanyTab />;
    }
    
    return getDefaultContent(selectedSection, "overview");
  };

  return (
    <div className="h-full flex app-container">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-[var(--border)] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)]">
          <div className="mb-3">
            <h1 className="text-sm font-semibold text-[var(--text)]">Aqqrue Docs</h1>
            <p className="text-xs text-[var(--muted)]">Accounting & Finance</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search or ask"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 text-xs border border-[var(--border)] rounded-md focus:ring-1 focus:ring-[var(--primary)] focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-[var(--muted)] hover:text-[var(--text)]"
              >
                ✕
              </button>
            )}
            {!searchQuery && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-[var(--muted)]">
                ⌘K
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-3 space-y-1">
            {filteredNavigationItems.length === 0 && searchQuery ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 bg-[var(--primary-weak)] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <p className="text-sm text-[var(--muted)] mb-1">No results found</p>
                <p className="text-xs text-[var(--muted)]">Try a different search term</p>
              </div>
            ) : (
              filteredNavigationItems.map((item) => (
              <div key={item.id}>
              <button 
                  onClick={() => handleSectionClick(item.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-md text-left transition-colors ${
                    selectedSection === item.id
                      ? 'bg-[var(--primary-weak)] text-[var(--primary)]'
                      : 'text-[var(--muted)] hover:bg-[var(--primary-weak)] hover:text-[var(--text)]'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-xs font-medium">{item.title}</span>
                  </div>
                  {item.children && (
                    <ChevronRight 
                      className={`h-3 w-3 transition-transform ${
                        selectedSection === item.id ? 'rotate-90' : ''
                      }`} 
                    />
                  )}
              </button>
                
                {/* Sub-sections */}
                {selectedSection === item.id && item.children && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children
                      .filter(child => 
                        !searchQuery || child.title.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((child) => (
              <button 
                        key={child.id}
                        onClick={() => handleSubSectionClick(child.id)}
                        className={`w-full flex items-center p-1.5 rounded-md text-left transition-colors ${
                          selectedSubSection === child.id
                    ? 'bg-[var(--primary)] text-white' 
                            : 'text-[var(--muted)] hover:bg-[var(--primary-weak)] hover:text-[var(--text)]'
                }`}
              >
                        <span className="text-xs">{child.title}</span>
              </button>
                    ))}
                  </div>
                )}
              </div>
              ))
            )}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border)]">
          <Button className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white text-xs py-1.5">
            <Star className="h-3 w-3 mr-1.5" />
            Ask AI
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex relative" style={{ backgroundColor: '#fefefe' }}>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="px-24 py-6">
              {getCurrentContent() || (
                <div className="max-w-4xl mx-auto">
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-[var(--primary-weak)] rounded-full flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="h-6 w-6 text-[var(--primary)]" />
                    </div>
                    <h3 className="text-base font-semibold text-[var(--text)] mb-2">
                      Welcome to Aqqrue Documentation
                    </h3>
                    <p className="text-sm text-[var(--muted)] mb-4">
                      Select a section from the sidebar to view detailed policies, procedures, and workflows.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-2xl mx-auto">
                      {filteredNavigationItems.slice(0, 3).map((item) => (
                        <Card 
                          key={item.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleSectionClick(item.id)}
                        >
                          <CardContent className="p-3 text-center">
                            <div className="w-6 h-6 bg-[var(--primary-weak)] rounded-md flex items-center justify-center mx-auto mb-2">
                              {item.icon}
                            </div>
                            <h4 className="text-sm font-medium text-[var(--text)]">{item.title}</h4>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Table of Contents - Hide for workflow pages */}
        {!(selectedSection === "corporate-credit-card" && selectedSubSection === "workflows") && (
          <div className="w-64 border-l border-gray-200 flex flex-col sticky top-0 h-screen" style={{ backgroundColor: '#fefefe' }}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Menu className="h-4 w-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-900">On this page</h3>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="space-y-1">
              {selectedSection === "month-end-close" && selectedSubSection === "accruals-provisions" ? (
                <>
                  {/* SOP-specific TOC for Accruals & Provisions */}
                  <div>
                    <div className="flex items-center space-x-2 py-1">
                      <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                      <a href="#purpose" className="text-sm font-medium text-green-600 hover:text-green-700">Purpose</a>
                    </div>
                  </div>
                  <div>
                    <a href="#scope" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Scope</a>
                  </div>
                  <div>
                    <a href="#roles" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Roles & Responsibilities</a>
                  </div>
                  <div>
                    <a href="#timing" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Timing</a>
                  </div>
                  <div>
                    <a href="#procedure" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Procedure</a>
                  </div>
                  <div>
                    <a href="#controls" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Controls</a>
                  </div>
                  <div>
                    <a href="#documentation" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Documentation & Record Retention</a>
                  </div>
                  <div>
                    <a href="#completion" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Completion Criteria</a>
                  </div>
                  <div>
                    <a href="#issues" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Common Issues & Mitigation</a>
                  </div>
                  <div>
                    <a href="#escalation" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Escalation Protocol</a>
                  </div>
                  <div>
                    <a href="#references" className="block text-xs text-gray-600 hover:text-gray-900 py-1">References</a>
                  </div>
                  <div>
                    <a href="#revision" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Revision History</a>
                  </div>
                  <div>
                    <a href="#automations" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Linked Automations</a>
                  </div>
                  <div>
                    <a href="#signoff" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Sign-Off</a>
                  </div>
                </>
              ) : selectedSection === "corporate-credit-card" && selectedSubSection === "workflows" ? (
                <>
                  {/* Workflows TOC for Corporate Credit Card */}
                  <div>
                    <div className="flex items-center space-x-2 py-1">
                      <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                      <a href="#workflows" className="text-sm font-medium text-green-600 hover:text-green-700">Workflows</a>
                    </div>
                  </div>
                  <div>
                    <a href="#corporate-card-posting" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Corporate Card Posting</a>
                  </div>
                  <div>
                    <a href="#vendor-invoice-approval" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Vendor Invoice Approval</a>
                  </div>
                </>
              ) : selectedSection === "accounts-payable" && selectedSubSection === "prepaid-expenses" ? (
                <>
                  {/* SOP-specific TOC for Prepaid Expenses Policy */}
                  <div>
                    <div className="flex items-center space-x-2 py-1">
                      <div className={`w-1 h-4 rounded-full ${activeSection === 'purpose' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <a href="#purpose" className={`text-sm font-medium ${activeSection === 'purpose' ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}>Purpose</a>
                    </div>
                  </div>
                  <div>
                    <a href="#scope" className={`block text-xs py-1 rounded px-2 ${activeSection === 'scope' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Scope</a>
                  </div>
                  <div>
                    <a href="#classification" className={`block text-xs py-1 rounded px-2 ${activeSection === 'classification' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Classification Criteria</a>
                  </div>
                  <div>
                    <a href="#recognition" className={`block text-xs py-1 rounded px-2 ${activeSection === 'recognition' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Recognition & Measurement</a>
                  </div>
                  <div>
                    <a href="#procedure" className={`block text-xs py-1 rounded px-2 ${activeSection === 'procedure' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Procedure</a>
                  </div>
                  <div>
                    <a href="#journal-entries" className={`block text-xs py-1 rounded px-2 ${activeSection === 'journal-entries' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Example Journal Entries</a>
                  </div>
                  <div>
                    <a href="#controls" className={`block text-xs py-1 rounded px-2 ${activeSection === 'controls' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Controls</a>
                  </div>
                  <div>
                    <a href="#documentation" className={`block text-xs py-1 rounded px-2 ${activeSection === 'documentation' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Documentation & Record Retention</a>
                  </div>
                  <div>
                    <a href="#references" className={`block text-xs py-1 rounded px-2 ${activeSection === 'references' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>References</a>
                  </div>
                  <div>
                    <a href="#revision" className={`block text-xs py-1 rounded px-2 ${activeSection === 'revision' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Revision History</a>
                  </div>
                </>
              ) : selectedSection === "corporate-credit-card" && selectedSubSection === "reconciliation-accounting" ? (
                <>
                  {/* SOP-specific TOC for Corporate Credit Card - Reconciliation & Accounting */}
                  <div>
                    <div className="flex items-center space-x-2 py-1">
                      <div className={`w-1 h-4 rounded-full ${activeSection === 'purpose' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <a href="#purpose" className={`text-sm font-medium ${activeSection === 'purpose' ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}>Purpose</a>
                    </div>
                  </div>
                  <div>
                    <a href="#scope" className={`block text-xs py-1 rounded px-2 ${activeSection === 'scope' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Scope</a>
                  </div>
                  <div>
                    <a href="#roles" className={`block text-xs py-1 rounded px-2 ${activeSection === 'roles' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Roles & Responsibilities</a>
                  </div>
                  <div>
                    <a href="#timing" className={`block text-xs py-1 rounded px-2 ${activeSection === 'timing' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Timing</a>
                  </div>
                  <div>
                    <a href="#data-sources" className={`block text-xs py-1 rounded px-2 ${activeSection === 'data-sources' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Data Sources</a>
                  </div>
                  <div>
                    <a href="#procedure" className={`block text-xs py-1 rounded px-2 ${activeSection === 'procedure' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Procedure</a>
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="#step-1" className="block text-xs text-gray-500 hover:text-gray-900 py-1 hover:bg-gray-50 rounded px-2">Step 1 – Retrieve Statement & Transaction Feed</a>
                      <a href="#step-2" className="block text-xs text-gray-500 hover:text-gray-900 py-1 hover:bg-gray-50 rounded px-2">Step 2 – Import and Validate Data</a>
                      <a href="#step-3" className="block text-xs text-gray-500 hover:text-gray-900 py-1 hover:bg-gray-50 rounded px-2">Step 3 – Verify Supporting Documentation</a>
                      <a href="#step-4" className="block text-xs text-gray-500 hover:text-gray-900 py-1 hover:bg-gray-50 rounded px-2">Step 4 – Record Accounting Entries</a>
                      <a href="#step-5" className="block text-xs text-gray-500 hover:text-gray-900 py-1 hover:bg-gray-50 rounded px-2">Step 5 – Post Monthly Payment</a>
                      <a href="#step-6" className="block text-xs text-gray-500 hover:text-gray-900 py-1 hover:bg-gray-50 rounded px-2">Step 6 – Reconcile Balances</a>
                      <a href="#step-7" className="block text-xs text-gray-500 hover:text-gray-900 py-1 hover:bg-gray-50 rounded px-2">Step 7 – Clear Suspense Account</a>
                    </div>
                  </div>
                  <div>
                    <a href="#journal-entries" className={`block text-xs py-1 rounded px-2 ${activeSection === 'journal-entries' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Example Journal Entries</a>
                  </div>
                  <div>
                    <a href="#controls" className={`block text-xs py-1 rounded px-2 ${activeSection === 'controls' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Controls</a>
                  </div>
                  <div>
                    <a href="#reporting" className={`block text-xs py-1 rounded px-2 ${activeSection === 'reporting' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Reporting & Follow-up</a>
                  </div>
                  <div>
                    <a href="#escalation" className={`block text-xs py-1 rounded px-2 ${activeSection === 'escalation' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Escalation & Exception Handling</a>
                  </div>
                  <div>
                    <a href="#references" className={`block text-xs py-1 rounded px-2 ${activeSection === 'references' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>References</a>
                  </div>
                  <div>
                    <a href="#revision" className={`block text-xs py-1 rounded px-2 ${activeSection === 'revision' ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>Revision History</a>
                  </div>
                </>
              ) : selectedSection === "overview" ? (
                <>
                  {/* TOC for Overview section - matches AboutCompanyTab content */}
                  <div>
                    <div className="flex items-center space-x-2 py-1">
                      <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                      <a href="#business-overview" className="text-sm font-medium text-green-600 hover:text-green-700">Business Overview</a>
                    </div>
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="#executive-summary" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Executive Summary</a>
                      <a href="#company-details" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Company Details</a>
                      <a href="#operational-info" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Operational Information</a>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center space-x-2 py-1">
                      <a href="#tool-stack" className="text-sm font-medium text-gray-700 hover:text-gray-900">Tool Stack (by Geo)</a>
                    </div>
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="#us-tools" className="block text-xs text-gray-600 hover:text-gray-900 py-1">US Tools</a>
                      <a href="#india-tools" className="block text-xs text-gray-600 hover:text-gray-900 py-1">India Tools</a>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center space-x-2 py-1">
                      <a href="#internal-controls" className="text-sm font-medium text-gray-700 hover:text-gray-900">Internal Controls</a>
                    </div>
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="#high-priority" className="block text-xs text-gray-600 hover:text-gray-900 py-1">High Priority</a>
                      <a href="#medium-priority" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Medium Priority</a>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center space-x-2 py-1">
                      <a href="#accounting-policies" className="text-sm font-medium text-gray-700 hover:text-gray-900">Accounting Policies</a>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Default TOC for other sections */}
                  <div>
                    <div className="flex items-center space-x-2 py-1">
                      <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">Getting started</span>
                    </div>
                    <div className="ml-4 mt-1 space-y-1">
                      <a href="#" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Install the GitHub App</a>
                      <a href="#" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Authorize your GitHub account</a>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center space-x-2 py-1">
                      <span className="text-sm font-medium text-gray-700">Editing workflows</span>
                    </div>
                    <div className="ml-4 mt-1 space-y-1">
                      <div>
                        <a href="#" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Code-based workflow</a>
                        <div className="ml-4 mt-1 space-y-1">
                          <a href="#" className="block text-xs text-gray-500 hover:text-gray-900 py-1">Install the CLI</a>
                          <a href="#" className="block text-xs text-gray-500 hover:text-gray-900 py-1">Edit the documentation</a>
                          <a href="#" className="block text-xs text-gray-500 hover:text-gray-900 py-1">Preview the changes</a>
                          <a href="#" className="block text-xs text-gray-500 hover:text-gray-900 py-1">Push the changes</a>
                        </div>
                      </div>
                      <div>
                        <a href="#" className="block text-xs text-gray-600 hover:text-gray-900 py-1">Web editor workflow</a>
                        <div className="ml-4 mt-1 space-y-1">
                          <a href="#" className="block text-xs text-gray-500 hover:text-gray-900 py-1">Access the web editor</a>
                          <a href="#" className="block text-xs text-gray-500 hover:text-gray-900 py-1">Edit the documentation</a>
                          <a href="#" className="block text-xs text-gray-500 hover:text-gray-900 py-1">Publish your changes</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-1">Adding a custom domain</a>
                    <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-1">Next steps</a>
                    <a href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-1">Troubleshooting</a>
                  </div>
                </>
              )}
            </nav>
          </div>
        </div>
        )}

        {/* Floating Input Field - Hide for workflow sections */}
        {!(selectedSection === "corporate-credit-card" && selectedSubSection === "workflows") && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-lg px-6 z-50">
            <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
              <div className="flex items-center p-3">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none text-sm"
                />
                <div className="flex items-center space-x-3 ml-3">
                  <div className="text-gray-500 text-xs font-medium">⌘I</div>
                  <button className="w-8 h-8 bg-green-500 hover:bg-green-600 border border-gray-300 rounded-full flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
