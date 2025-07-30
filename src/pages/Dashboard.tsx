import { useState } from "react";
import { TransactionInbox } from "@/components/TransactionInbox";
import { ReviewInterface } from "@/components/ReviewInterface";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  DollarSign,
  Users,
  Settings
} from "lucide-react";

const stats = [
  {
    title: "Pending Review",
    value: "12",
    change: "+2 from yesterday",
    trend: "up",
    icon: Clock,
    color: "text-status-pending"
  },
  {
    title: "Auto-Approved",
    value: "47",
    change: "+12 this week",
    trend: "up", 
    icon: CheckCircle2,
    color: "text-status-done"
  },
  {
    title: "Total Processed",
    value: "$124.8K",
    change: "+18% from last month",
    trend: "up",
    icon: DollarSign,
    color: "text-mobius-blue"
  },
  {
    title: "Active Clients",
    value: "8",
    change: "No change",
    trend: "neutral",
    icon: Users,
    color: "text-mobius-gray-500"
  }
];

const Dashboard = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedClient, setSelectedClient] = useState("All Clients");

  const clients = [
    "All Clients",
    "TechStartup Inc", 
    "StartupCo",
    "DesignStudio",
    "DevCorp",
    "CloudCo"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-mobius-gray-900">
            Good morning, Joy 👋
          </h1>
          <p className="text-mobius-gray-500 mt-1">
            Here's what's happening with your accounting today
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="px-3 py-2 border border-mobius-gray-100 rounded-lg bg-white text-sm"
          >
            {clients.map(client => (
              <option key={client} value={client}>{client}</option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6 bg-gradient-card border-0 shadow-mobius-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-mobius-gray-500">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-mobius-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className={`text-xs mt-1 flex items-center ${
                  stat.trend === "up" ? "text-status-done" : 
                  stat.trend === "down" ? "text-destructive" : 
                  "text-mobius-gray-500"
                }`}>
                  {stat.trend === "up" && <TrendingUp className="w-3 h-3 mr-1" />}
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-mobius-gray-50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-gradient-card border-0 shadow-mobius-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-mobius-gray-900">Quick Actions</h3>
            <p className="text-sm text-mobius-gray-500 mt-1">
              Common tasks to keep your workflow moving
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              Review High-Confidence Entries
              <Badge variant="secondary" className="ml-2">3</Badge>
            </Button>
            <Button variant="outline" size="sm">
              Handle Duplicates
              <Badge variant="destructive" className="ml-2">2</Badge>
            </Button>
            <Button size="sm">
              Bulk Approve
              <Badge variant="secondary" className="ml-2 bg-white/20">5</Badge>
            </Button>
          </div>
        </div>
      </Card>

      {/* Transaction Inbox */}
      <TransactionInbox onTransactionSelect={setSelectedTransaction} />

      {/* Review Modal */}
      {selectedTransaction && (
        <ReviewInterface 
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;