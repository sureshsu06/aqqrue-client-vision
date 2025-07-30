import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Settings,
  Plug,
  RefreshCw,
  ExternalLink
} from "lucide-react";

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

const suggestions = [
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

const Integrations = () => {
  const connectedCount = integrations.filter(i => i.status === "connected").length;
  const availableCount = integrations.filter(i => i.status === "available").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-mobius-gray-900">Integrations</h1>
          <p className="text-mobius-gray-500 mt-1">
            Manage your connected systems and data sources
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-status-done/10 text-status-done">
            {connectedCount} Connected
          </Badge>
          <Badge variant="outline">
            {availableCount} Available
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync All
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-card">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-status-done/10 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-status-done" />
            </div>
            <div>
              <p className="font-semibold text-mobius-gray-900">{connectedCount} Connected</p>
              <p className="text-sm text-mobius-gray-500">Systems actively syncing</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-card">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-mobius-blue/10 rounded-full">
              <Plug className="w-6 h-6 text-mobius-blue" />
            </div>
            <div>
              <p className="font-semibold text-mobius-gray-900">95% Automation</p>
              <p className="text-sm text-mobius-gray-500">Transactions auto-processed</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-card">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-mobius-orange/10 rounded-full">
              <RefreshCw className="w-6 h-6 text-mobius-orange" />
            </div>
            <div>
              <p className="font-semibold text-mobius-gray-900">Real-time</p>
              <p className="text-sm text-mobius-gray-500">Data synchronization</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-mobius-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
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
                    <Settings className="w-4 h-4" />
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
                      <Settings className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Integrations;