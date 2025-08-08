import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { 
  Panel, 
  PanelGroup, 
  PanelResizeHandle 
} from "react-resizable-panels";
import { chartOfAccounts, ChartAccount } from "@/lib/chartOfAccounts";
import { cn } from "@/lib/utils";

export default function Ledger() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<ChartAccount | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);

  // Group accounts by category for nested view
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

  const renderAccount = (account: ChartAccount, indentLevel: number = 0) => {
    return (
      <div 
        key={account.code} 
        className={cn(
          "grid grid-cols-9 gap-4 py-2 px-4 transition-colors cursor-pointer border-b border-gray-100",
          "bg-white",
          selectedAccount?.code === account.code ? 'bg-blue-50' : ''
        )}
        style={{ paddingLeft: `${20 + (indentLevel * 24)}px` }}
        onClick={() => !account.isHeader && setSelectedAccount(account)}
      >
        {/* GL Code */}
        <div className="text-xs text-mobius-gray-500 font-mono">
          {account.code}
        </div>
        
        {/* Description */}
        <div className="col-span-2 text-sm text-gray-900">
          {account.name}
        </div>
        
        {/* Movement - Debits */}
        <div className="text-sm text-right">
          {!account.isHeader && account.debit && account.debit > 0 ? 
            `₹${account.debit.toLocaleString()}` : '-'}
        </div>
        
        {/* Movement - Credits */}
        <div className="text-sm text-right">
          {!account.isHeader && account.credit && account.credit > 0 ? 
            `₹${account.credit.toLocaleString()}` : '-'}
        </div>
        
        {/* Current Month - Debits */}
        <div className="text-sm text-right">
          {!account.isHeader && account.debit && account.debit > 0 ? 
            `₹${account.debit.toLocaleString()}` : '-'}
        </div>
        
        {/* Current Month - Credits */}
        <div className="text-sm text-right">
          {!account.isHeader && account.credit && account.credit > 0 ? 
            `₹${account.credit.toLocaleString()}` : '-'}
        </div>
        
        {/* Previous Month - Debits */}
        <div className="text-sm text-right">
          {!account.isHeader && account.debit && account.debit > 0 ? 
            `₹${(account.debit * 0.95).toLocaleString()}` : '-'}
        </div>
        
        {/* Previous Month - Credits */}
        <div className="text-sm text-right">
          {!account.isHeader && account.credit && account.credit > 0 ? 
            `₹${(account.credit * 0.95).toLocaleString()}` : '-'}
        </div>
      </div>
    );
  };

  const getTrialBalanceTotals = () => {
    const nonHeaderAccounts = chartOfAccounts.filter(account => !account.isHeader && account.balance !== undefined);
    const totalDebits = nonHeaderAccounts.reduce((sum, account) => sum + (account.debit || 0), 0);
    const totalCredits = nonHeaderAccounts.reduce((sum, account) => sum + (account.credit || 0), 0);
    return { totalDebits, totalCredits };
  };

  const { totalDebits, totalCredits } = getTrialBalanceTotals();

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      
      {/* Compact Header */}
      <div className="border-b border-mobius-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mobius-gray-500 w-4 h-4" />
              <Input 
                placeholder="Search accounts..." 
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-px h-6 bg-mobius-gray-200 mx-2" />

            {/* Filter */}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-mobius-gray-100 rounded">
              <Filter className="w-4 h-4 text-mobius-gray-600" />
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Export */}
            <Button variant="outline" size="sm" className="h-8">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            {/* Balance indicator */}
            <div className="flex items-center space-x-2 text-sm text-mobius-gray-600">
              <span>Total Debits: ₹{totalDebits.toLocaleString()}</span>
              <span>•</span>
              <span>Total Credits: ₹{totalCredits.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart of Accounts Content */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          {/* Chart of Accounts List */}
          <Panel defaultSize={60} minSize={40} className="min-h-0">
            <div className="h-full flex flex-col border-r border-mobius-gray-100">
              <div className="flex-1 overflow-y-auto">
                <div className="bg-white">
                  {/* Table Header */}
                  <div className="bg-gray-50 py-3 px-4 border-b border-gray-200">
                    <div className="grid grid-cols-9 gap-4 text-sm font-medium text-gray-700">
                      <div>GL Code</div>
                      <div className="col-span-2">Description</div>
                      <div className="text-right">Debits</div>
                      <div className="text-right">Credits</div>
                      <div className="text-right">Debits</div>
                      <div className="text-right">Credits</div>
                      <div className="text-right">Debits</div>
                      <div className="text-right">Credits</div>
                    </div>
                    <div className="grid grid-cols-9 gap-4 text-xs text-gray-500 mt-1">
                      <div></div>
                      <div className="col-span-2"></div>
                      <div className="col-span-2 text-center">Movement</div>
                      <div className="col-span-2 text-center">Month ending Apr-25</div>
                      <div className="col-span-2 text-center">Month ending Mar-25</div>
                    </div>
                  </div>
                  
                  <div>
                    {Object.entries(groupedAccounts).map(([category, accounts]) => (
                      <div key={category} className="overflow-hidden">
                        {/* Category Header */}
                        <div className="bg-gray-50 py-3 px-4 border-b border-gray-200">
                          <Button
                            variant="ghost"
                            className="w-full justify-start p-0 h-auto font-medium text-gray-900"
                            onClick={() => toggleCategory(category)}
                          >
                            <div className="flex items-center space-x-3">
                              {collapsedCategories.includes(category) ? (
                                <ChevronRight className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                              <span className="text-sm font-medium">{category}</span>
                              <span className="text-xs text-gray-500 ml-auto">
                                {accounts.length} accounts
                              </span>
                            </div>
                          </Button>
                        </div>
                        
                        {/* Category Content */}
                        {!collapsedCategories.includes(category) && (
                          <div>
                            {accounts.map(account => renderAccount(account))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          {/* Account Details Panel */}
          <PanelResizeHandle className="w-1 bg-mobius-gray-100 hover:bg-mobius-gray-200 transition-colors" />
          
          <Panel defaultSize={40} minSize={25} className="min-h-0">
            <div className="h-full flex flex-col">
              {selectedAccount ? (
                <div className="p-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-mobius-gray-900">
                        {selectedAccount.name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {selectedAccount.code}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-mobius-gray-500">Account Type</p>
                          <p className="text-sm font-medium text-mobius-gray-900 capitalize">
                            {selectedAccount.type}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-mobius-gray-500">Category</p>
                          <p className="text-sm font-medium text-mobius-gray-900">
                            {selectedAccount.category}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-mobius-gray-500">Balance</p>
                          <p className={`text-sm font-semibold ${
                            selectedAccount.balance && selectedAccount.balance >= 0 ? 'text-mobius-gray-900' : 'text-red-600'
                          }`}>
                            {selectedAccount.balance !== undefined ? (
                              <>
                                {selectedAccount.balance >= 0 ? 'Dr' : 'Cr'} ₹{Math.abs(selectedAccount.balance).toLocaleString()}
                              </>
                            ) : (
                              'No balance'
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-mobius-gray-500">Status</p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              selectedAccount.status === 'active' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            {selectedAccount.status}
                          </Badge>
                        </div>
                      </div>

                      {selectedAccount.balance !== undefined && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-mobius-gray-500">Total Debits</p>
                            <p className="text-sm font-medium text-mobius-gray-900">
                              ₹{(selectedAccount.debit || 0).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-mobius-gray-500">Total Credits</p>
                            <p className="text-sm font-medium text-mobius-gray-900">
                              ₹{(selectedAccount.credit || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="border-t border-mobius-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-mobius-gray-900 mb-3">Recent Transactions</h4>
                        <div className="space-y-2">
                          <div className="text-sm text-mobius-gray-500">
                            No recent transactions to display
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-mobius-gray-500">
                    <Eye className="w-8 h-8 mx-auto mb-2" />
                    <p>Select an account to view details</p>
                  </div>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
} 