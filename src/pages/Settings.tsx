import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Settings as SettingsIcon,
  Plus,
  Edit3,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";

const chartOfAccounts = [
  { code: "1000", name: "Cash - Operating", type: "Asset", balance: "$124,847.32", status: "active" },
  { code: "1200", name: "Accounts Receivable", type: "Asset", balance: "$42,350.00", status: "active" },
  { code: "1410", name: "Prepaid Expenses", type: "Asset", balance: "$12,450.00", status: "active" },
  { code: "2100", name: "Accounts Payable", type: "Liability", balance: "$8,932.50", status: "active" },
  { code: "2210", name: "Credit Card Payable", type: "Liability", balance: "$15,642.80", status: "active" },
  { code: "6200", name: "Rent Expense", type: "Expense", balance: "$38,250.00", status: "active" },
  { code: "6100", name: "Software Expense", type: "Expense", balance: "$24,890.00", status: "active" }
];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-mobius-gray-900">Settings</h1>
          <p className="text-mobius-gray-500 mt-1">
            Manage your chart of accounts and automation preferences
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-status-done/10 text-status-done">
            {suggestions.length} Suggestions
          </Badge>
          <Button variant="outline" size="sm">
            <SettingsIcon className="w-4 h-4 mr-2" />
            Export Settings
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
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

            <div className="space-y-3">
              {chartOfAccounts.map((account) => (
                <div key={account.code} className="flex items-center justify-between p-4 border border-mobius-gray-100 rounded-lg hover:bg-mobius-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="font-mono text-xs">
                      {account.code}
                    </Badge>
                    <div>
                      <h4 className="font-medium text-mobius-gray-900">{account.name}</h4>
                      <p className="text-sm text-mobius-gray-500">{account.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-mobius-gray-900">{account.balance}</p>
                      <p className="text-xs text-mobius-gray-500">Current balance</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="bg-status-done/10 text-status-done border-status-done/20"
                    >
                      {account.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
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

        <TabsContent value="policies" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-mobius-gray-900 mb-4">Accounting Policies</h3>
            <div className="space-y-6">
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
  );
};

export default Settings;