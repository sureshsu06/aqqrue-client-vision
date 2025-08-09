import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Settings as SettingsIcon,
  Plus,
  Edit3,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Target,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { chartOfAccounts } from "@/lib/chartOfAccounts";

const suggestions = [
  {
    type: "improvement",
    title: "Create 'Advances' accounts for vendors",
    description: "Rather than leaving vendor accounts in debit balance, create specific advance accounts for better tracking.",
    impact: "Improves balance sheet clarity",
    accounts: ["Vendor A", "Vendor B", "Vendor C"]
  },
  {
    type: "compliance",
    title: "Add sub-accounts for Software Expenses",
    description: "Break down software expenses by category (SaaS, Development Tools, etc.) for better reporting.",
    impact: "Enhanced expense tracking",
    accounts: ["6100-1 SaaS", "6100-2 Dev Tools", "6100-3 Security"]
  },
  {
    type: "automation",
    title: "Set up recurring entry templates",
    description: "Create templates for common recurring transactions to speed up processing.",
    impact: "Faster transaction processing",
    accounts: ["Rent", "Insurance", "Software subscriptions"]
  }
];

// Integrations data (moved from Integrations.tsx)
const integrations = [
  {
    name: "QuickBooks Online",
    description: "Chart of accounts and journal entries",
    status: "connected",
    lastSync: "2 minutes ago",
    icon: "💼",
    isCore: true
  },
  {
    name: "Brex",
    description: "Corporate credit card transactions",
    status: "connected", 
    lastSync: "5 minutes ago",
    icon: "💳",
    isCore: true
  },
  {
    name: "Stripe",
    description: "Payment processing and revenue",
    status: "connected",
    lastSync: "1 hour ago", 
    icon: "💰",
    isCore: true
  },
  {
    name: "Gmail",
    description: "Bills and invoices from email",
    status: "connected",
    lastSync: "3 minutes ago",
    icon: "📧",
    isCore: true
  },
  {
    name: "Google Drive",
    description: "Document storage and bills",
    status: "connected",
    lastSync: "10 minutes ago",
    icon: "📁",
    isCore: true
  },
  {
    name: "Mercury",
    description: "Banking transactions",
    status: "connected",
    lastSync: "15 minutes ago",
    icon: "🏦",
    isCore: true
  },
  {
    name: "Ramp",
    description: "Corporate spend management", 
    status: "connected",
    lastSync: "8 minutes ago",
    icon: "💳",
    isCore: true
  },
  {
    name: "Rippling",
    description: "Payroll and HR management",
    status: "connected",
    lastSync: "1 hour ago",
    icon: "👥",
    isCore: true
  },
  {
    name: "Gusto",
    description: "Payroll processing",
    status: "available",
    lastSync: null,
    icon: "💼",
    isCore: false
  },
  {
    name: "Slack",
    description: "Team communication and notifications",
    status: "connected",
    lastSync: "Real-time",
    icon: "💬",
    isCore: false
  },
  {
    name: "Bill.com",
    description: "Accounts payable automation",
    status: "available",
    lastSync: null,
    icon: "🧾",
    isCore: false
  },
  {
    name: "NetSuite",
    description: "Enterprise resource planning",
    status: "available", 
    lastSync: null,
    icon: "🏢",
    isCore: false
  }
];

const integrationSuggestions = [
  {
    title: "Enable Bill.com Integration",
    description: "Automate your AP workflow by connecting Bill.com for vendor payments",
    priority: "high",
    estimatedSavings: "4 hours/week"
  },
  {
    title: "Add NetSuite Connection", 
    description: "For clients using NetSuite, direct integration improves accuracy",
    priority: "medium",
    estimatedSavings: "2 hours/week"
  }
];

const automationSettings = [
  {
    name: "Auto-approve high confidence entries",
    description: "Automatically post entries with 95%+ confidence score",
    enabled: true,
    riskLevel: "low"
  },
  {
    name: "Auto-categorize recurring transactions",
    description: "Automatically assign categories based on historical patterns",
    enabled: true,
    riskLevel: "low"
  },
  {
    name: "Auto-create vendor advances",
    description: "Automatically create advance accounts for new vendors",
    enabled: false,
    riskLevel: "medium"
  },
  {
    name: "Auto-post prepaid expense schedules",
    description: "Automatically create monthly journal entries for prepaid expenses",
    enabled: true,
    riskLevel: "medium"
  }
];

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("accounts");
  const [autoApproveThreshold, setAutoApproveThreshold] = useState(95);
  const [selectedClient, setSelectedClient] = useState("all");
  const [reconTolerance, setReconTolerance] = useState(100);
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);
  
  const connectedCount = integrations.filter(i => i.status === "connected").length;
  const availableCount = integrations.filter(i => i.status === "available").length;

  // Mock data for clients
  const clients = [
    { id: "all", name: "All Clients" },
    { id: "elire", name: "Elire" },
    { id: "mahat", name: "Mahat Labs" },
    { id: "techcorp", name: "TechCorp" },
    { id: "tvs", name: "TVS" }
  ];

  // Mock data for rule impact
  const getRuleImpact = (ruleType: string) => {
    switch (ruleType) {
      case "recon-tolerance":
        return {
          affectedTransactions: 23,
          description: "Auto-match payments to invoices within variance",
          riskLevel: "low"
        };
      case "prepaid-threshold":
        return {
          affectedTransactions: 8,
          description: "Create prepaid assets for amounts above threshold",
          riskLevel: "medium"
        };
      default:
        return {
          affectedTransactions: 0,
          description: "No impact",
          riskLevel: "low"
        };
    }
  };

  // Group accounts by category
  const groupedAccounts = chartOfAccounts.reduce((acc, account) => {
    if (!account.parent && account.isHeader) {
      // This is a main category (Assets, Liabilities, etc.)
      const category = account.name;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(account);
    } else {
      // Find the main category for this account
      let currentAccount = account;
      let mainCategory = null;
      
      while (currentAccount.parent) {
        const parentAccount = chartOfAccounts.find(a => a.code === currentAccount.parent);
        if (parentAccount && !parentAccount.parent && parentAccount.isHeader) {
          mainCategory = parentAccount.name;
          break;
        }
        currentAccount = parentAccount;
      }
      
      if (mainCategory) {
        if (!acc[mainCategory]) {
          acc[mainCategory] = [];
        }
        acc[mainCategory].push(account);
      }
    }
    return acc;
  }, {} as Record<string, typeof chartOfAccounts>);

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const renderAccount = (account: any, indentLevel: number = 0) => {
    return (
      <div 
        key={account.code} 
        className={cn(
          "flex items-center justify-between p-3 border border-mobius-gray-100 rounded-lg hover:bg-mobius-gray-50 transition-colors",
          account.isHeader ? "bg-mobius-gray-50" : "bg-white"
        )}
        style={{ paddingLeft: `${16 + (indentLevel * 20)}px` }}
      >
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="font-mono text-xs bg-white">
            {account.code}
          </Badge>
          <div>
            <h4 className={cn(
              "font-medium text-mobius-gray-900",
              account.isHeader ? "text-sm font-semibold" : "text-sm"
            )}>
              {account.name}
            </h4>
            <p className="text-sm text-mobius-gray-500">
              {account.type}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs font-medium",
              account.isHeader 
                ? "bg-mobius-blue/10 text-mobius-blue border-mobius-blue/20"
                : "bg-status-done/10 text-status-done border-status-done/20"
            )}
          >
            {account.isHeader ? "Header" : account.status}
          </Badge>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-6 border-b border-mobius-gray-200 bg-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-mobius-gray-900">Settings</h1>
          <p className="text-mobius-gray-500 mt-1">
            Manage your chart of accounts and automation preferences
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-status-done/10 text-status-done">
            {suggestions.length} Account Suggestions
          </Badge>
          <Badge variant="outline" className="bg-mobius-blue/10 text-mobius-blue">
            {connectedCount} Integrations Connected
          </Badge>
          <Button variant="outline" size="sm">
            <SettingsIcon className="w-4 h-4 mr-2" />
            Export Settings
          </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-6">
          {/* Suggestions */}
          <Card className="p-6">
            <h3 className="font-semibold text-mobius-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Mobius Recommendations
            </h3>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 border border-mobius-gray-100 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        suggestion.type === "improvement" ? "bg-mobius-blue/10" :
                        suggestion.type === "compliance" ? "bg-status-review/10" :
                        "bg-status-done/10"
                      }`}>
                        {suggestion.type === "improvement" ? 
                          <TrendingUp className="w-4 h-4 text-mobius-blue" /> :
                          suggestion.type === "compliance" ?
                          <Shield className="w-4 h-4 text-status-review" /> :
                          <Zap className="w-4 h-4 text-status-done" />
                        }
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-mobius-gray-900">{suggestion.title}</h4>
                        <p className="text-sm text-mobius-gray-500 mt-1">{suggestion.description}</p>
                        <p className="text-xs text-status-done mt-2">{suggestion.impact}</p>
                        {suggestion.accounts && (
                          <div className="flex space-x-2 mt-2">
                            {suggestion.accounts.map((account, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {account}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Ignore</Button>
                      <Button size="sm">Apply</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Chart of Accounts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-mobius-gray-900">Chart of Accounts</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </div>

            <div className="space-y-2">
              {Object.entries(groupedAccounts).map(([category, accounts]) => (
                <div key={category} className="border border-mobius-gray-200 rounded-lg overflow-hidden">
                  {/* Category Header */}
                  <div className="bg-mobius-gray-50 p-3 border-b border-mobius-gray-200">
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-0 h-auto font-semibold text-mobius-gray-900"
                      onClick={() => toggleCategory(category)}
                    >
                      <div className="flex items-center space-x-3">
                        {collapsedCategories.includes(category) ? (
                          <ChevronRight className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                        <span className="text-sm">{category}</span>
                        <Badge variant="outline" className="ml-auto">
                          {accounts.length} accounts
                    </Badge>
                    </div>
                    </Button>
                  </div>
                  
                  {/* Category Content */}
                  {!collapsedCategories.includes(category) && (
                    <div className="divide-y divide-mobius-gray-100">
                      {accounts.map(account => renderAccount(account))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          {/* Automation Level */}
          <Card className="p-6">
            <h3 className="font-semibold text-mobius-gray-900 mb-4">Automation Level</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-mobius-gray-900">Auto-approval Threshold</h4>
                  <p className="text-sm text-mobius-gray-500">Minimum confidence score for automatic posting</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium">{autoApproveThreshold}%</span>
                  <input 
                    type="range"
                    min="80"
                    max="99"
                    value={autoApproveThreshold}
                    onChange={(e) => setAutoApproveThreshold(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>
              
              <div className="p-4 bg-mobius-gray-50 rounded-lg">
                <p className="text-sm text-mobius-gray-600">
                  Current setting: Entries with {autoApproveThreshold}%+ confidence will be automatically posted. 
                  Lower confidence entries will require manual review.
                </p>
              </div>
            </div>
          </Card>

          {/* Automation Settings */}
          <Card className="p-6">
            <h3 className="font-semibold text-mobius-gray-900 mb-4">Automation Rules</h3>
            <div className="space-y-4">
              {automationSettings.map((setting, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                      <Switch checked={setting.enabled} />
                      <div>
                        <h4 className="font-medium text-mobius-gray-900">{setting.name}</h4>
                        <p className="text-sm text-mobius-gray-500">{setting.description}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${
                        setting.riskLevel === "low" 
                          ? "bg-status-done/10 text-status-done border-status-done/20"
                          : "bg-status-review/10 text-status-review border-status-review/20"
                      }`}
                    >
                      {setting.riskLevel} risk
                    </Badge>
                  </div>
                  {index < automationSettings.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </Card>

          {/* Performance Impact */}
          <Card className="p-6">
            <h3 className="font-semibold text-mobius-gray-900 mb-4">Performance Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-mobius-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-mobius-blue">95%</p>
                <p className="text-sm text-mobius-gray-500">Automation Rate</p>
              </div>
              <div className="text-center p-4 bg-mobius-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-status-done">12hrs</p>
                <p className="text-sm text-mobius-gray-500">Weekly Time Saved</p>
              </div>
              <div className="text-center p-4 bg-mobius-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-mobius-orange">99.8%</p>
                <p className="text-sm text-mobius-gray-500">Accuracy Rate</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          {/* Integration Suggestions */}
          {integrationSuggestions.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-mobius-gray-900 mb-4">Integration Recommendations</h3>
              <div className="space-y-4">
                {integrationSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-mobius-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        suggestion.priority === "high" ? "text-mobius-orange" : "text-status-pending"
                      }`} />
                      <div>
                        <h4 className="font-medium text-mobius-gray-900">{suggestion.title}</h4>
                        <p className="text-sm text-mobius-gray-500 mt-1">{suggestion.description}</p>
                        <p className="text-xs text-status-done mt-1">
                          Estimated savings: {suggestion.estimatedSavings}
                        </p>
                      </div>
                    </div>
                    <Button size="sm">Enable</Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Core Integrations */}
          <Card className="p-6">
            <h3 className="font-semibold text-mobius-gray-900 mb-4">Core Integrations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.filter(i => i.isCore).map((integration) => (
                <div key={integration.name} className="p-4 border border-mobius-gray-100 rounded-lg hover:shadow-mobius-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <h4 className="font-medium text-mobius-gray-900">{integration.name}</h4>
                        <p className="text-xs text-mobius-gray-500">{integration.description}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={integration.status === "connected"} 
                      disabled={integration.status === "connected"}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {integration.status === "connected" ? (
                        <CheckCircle2 className="w-4 h-4 text-status-done" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-mobius-gray-300" />
                      )}
                      <span className={`text-sm ${
                        integration.status === "connected" ? "text-status-done" : "text-mobius-gray-500"
                      }`}>
                        {integration.status === "connected" ? "Connected" : "Available"}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {integration.lastSync && (
                        <span className="text-xs text-mobius-gray-500">{integration.lastSync}</span>
                      )}
                      <Button variant="ghost" size="sm">
                        <SettingsIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Available Integrations */}
          <Card className="p-6">
            <h3 className="font-semibold text-mobius-gray-900 mb-4">Available Integrations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.filter(i => !i.isCore).map((integration) => (
                <div key={integration.name} className="p-4 border border-mobius-gray-100 rounded-lg hover:shadow-mobius-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{integration.icon}</span>
                      <div>
                        <h4 className="font-medium text-mobius-gray-900">{integration.name}</h4>
                        <p className="text-xs text-mobius-gray-500">{integration.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {integration.status === "connected" ? (
                        <CheckCircle2 className="w-4 h-4 text-status-done" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-mobius-gray-300" />
                      )}
                      <span className={`text-sm ${
                        integration.status === "connected" ? "text-status-done" : "text-mobius-gray-500"
                      }`}>
                        {integration.status === "connected" ? "Connected" : "Available"}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {integration.lastSync && (
                        <span className="text-xs text-mobius-gray-500">{integration.lastSync}</span>
                      )}
                      {integration.status === "connected" ? (
                        <Button variant="ghost" size="sm">
                          <SettingsIcon className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          {/* Client Selection */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-mobius-gray-900">Accounting Policies</h3>
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-mobius-gray-500" />
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Rule Impact Preview */}
            {selectedClient !== "all" && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Rule Change Impact</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Changes to policies will affect <strong>23 pending transactions</strong> for {clients.find(c => c.id === selectedClient)?.name}.
                    </p>
                    <p className="text-xs text-blue-600 mt-2">
                      Review impact before saving changes
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Recon Tolerance Rule */}
              <div>
                <h4 className="font-medium text-mobius-gray-900 mb-2">Reconciliation Tolerance</h4>
                <p className="text-sm text-mobius-gray-500 mb-3">
                  Auto-match payments to invoices within variance tolerance
                </p>
                <div className="flex items-center space-x-3">
                  <span className="text-sm">₹</span>
                  <input 
                    type="number" 
                    value={reconTolerance}
                    onChange={(e) => setReconTolerance(Number(e.target.value))}
                    className="px-3 py-2 border border-mobius-gray-100 rounded-lg text-sm w-32"
                  />
                  <span className="text-sm text-mobius-gray-500">variance</span>
                </div>
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      This change will affect {getRuleImpact("recon-tolerance").affectedTransactions} pending transactions
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-mobius-gray-900 mb-2">Prepaid Expenses</h4>
                <p className="text-sm text-mobius-gray-500 mb-3">
                  How should prepaid expenses be handled?
                </p>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="prepaid" defaultChecked className="text-primary" />
                    <span className="text-sm">Create amortization schedule for amounts &gt; $1,000</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="prepaid" className="text-primary" />
                    <span className="text-sm">Expense immediately regardless of amount</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="prepaid" className="text-primary" />
                    <span className="text-sm">Always create prepaid asset</span>
                  </label>
                </div>
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-sm text-amber-700">
                      This change will affect {getRuleImpact("prepaid-threshold").affectedTransactions} pending transactions
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-mobius-gray-900 mb-2">Revenue Recognition</h4>
                <p className="text-sm text-mobius-gray-500 mb-3">
                  When should revenue be recognized?
                </p>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="revenue" defaultChecked className="text-primary" />
                    <span className="text-sm">When payment is received (Cash basis)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="revenue" className="text-primary" />
                    <span className="text-sm">When service is delivered (Accrual basis)</span>
                  </label>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-mobius-gray-900 mb-2">Capitalization Threshold</h4>
                <p className="text-sm text-mobius-gray-500 mb-3">
                  Minimum amount for capitalizing fixed assets
                </p>
                <div className="flex items-center space-x-3">
                  <span className="text-sm">$</span>
                  <input 
                    type="number" 
                    defaultValue="5000"
                    className="px-3 py-2 border border-mobius-gray-100 rounded-lg text-sm w-32"
                  />
                  <span className="text-sm text-mobius-gray-500">or more</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;