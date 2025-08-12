import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, TrendingUp, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import APAgingTable from "@/components/APAgingTable";

const reportTypes = [
  {
    name: "AP Aging",
    description: "Accounts Payable aging analysis and vendor balances",
    icon: FileText,
    id: "ap-aging",
    color: "bg-blue-500"
  },
  {
    name: "AR Aging",
    description: "Accounts Receivable aging analysis and customer balances",
    icon: TrendingUp,
    id: "ar-aging",
    color: "bg-green-500"
  },
  {
    name: "Trial Balance",
    description: "General ledger trial balance and account summaries",
    icon: Calculator,
    id: "trial-balance",
    color: "bg-purple-500"
  }
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("ap-aging");

  const renderTabContent = () => {
    switch (activeTab) {
      case "ap-aging":
        return <APAgingTable />;
      case "ar-aging":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">AR Aging Report</h2>
            <p className="text-gray-600">AR Aging implementation coming in next step...</p>
          </div>
        );
      case "trial-balance":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Trial Balance Report</h2>
            <p className="text-gray-600">Trial Balance implementation coming in next step...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="border-b border-mobius-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
            <p className="text-sm text-gray-600 mt-1">Financial reports and analysis</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-mobius-gray-200">
        <div className="flex">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              onClick={() => setActiveTab(report.id)}
              className={cn(
                "relative py-3 px-6 text-sm font-medium transition-colors",
                activeTab === report.id
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-gray-900"
              )}
            >
              {report.name}
              {activeTab === report.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
} 