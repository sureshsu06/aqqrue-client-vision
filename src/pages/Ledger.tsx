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
  ChevronRight,
  Plus,
  Minus,
  ArrowLeft,
  FileText,
  Calendar,
  X
} from "lucide-react";
import { 
  Panel, 
  PanelGroup, 
  PanelResizeHandle 
} from "react-resizable-panels";
import { chartOfAccounts, ChartAccount } from "@/lib/chartOfAccounts";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import GLDrillDown from "@/components/GLDrillDown";
import AuditTrail from "@/components/AuditTrail";

export default function Ledger() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<ChartAccount | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);
  const [expandedSubItems, setExpandedSubItems] = useState<string[]>([]);
  const [drillDownAccount, setDrillDownAccount] = useState<ChartAccount | null>(null);
  const [showJournalEntries, setShowJournalEntries] = useState(false);
  const [activeTab, setActiveTab] = useState("ledger"); // "ledger", "glDrillDown", "auditTrail"
  const [selectedMonth, setSelectedMonth] = useState("2024-04");

  // Reset activeTab to ledger when selectedAccount changes
  useEffect(() => {
    setActiveTab("ledger");
  }, [selectedAccount]);

  // Reset activeTab to ledger when drillDownAccount changes
  useEffect(() => {
    setActiveTab("ledger");
  }, [drillDownAccount]);

  // Helper function to calculate totals for parent accounts
  const calculateAccountTotals = (account: ChartAccount) => {
    if (!account.isHeader) {
      return {
        debit: account.debit || 0,
        credit: account.credit || 0
      };
    }

    // For header accounts, calculate totals from all child accounts
    const getChildAccounts = (parentCode: string): ChartAccount[] => {
      const directChildren = chartOfAccounts.filter(acc => acc.parent === parentCode);
      let allChildren = [...directChildren];
      
      directChildren.forEach(child => {
        if (child.isHeader) {
          allChildren.push(...getChildAccounts(child.code));
        }
      });
      
      return allChildren.filter(acc => !acc.isHeader);
    };

    const childAccounts = getChildAccounts(account.code);
    const totalDebit = childAccounts.reduce((sum, child) => sum + (child.debit || 0), 0);
    const totalCredit = childAccounts.reduce((sum, child) => sum + (child.credit || 0), 0);

    return {
      debit: totalDebit,
      credit: totalCredit
    };
  };

  // Helper function to get all sub-items of an account
  const getSubItems = (account: ChartAccount): ChartAccount[] => {
    if (!account.isHeader) return [];
    
    const getChildAccounts = (parentCode: string): ChartAccount[] => {
      const directChildren = chartOfAccounts.filter(acc => acc.parent === parentCode);
      let allChildren = [...directChildren];
      
      directChildren.forEach(child => {
        if (child.isHeader) {
          allChildren.push(...getChildAccounts(child.code));
        }
      });
      
      return allChildren;
    };
    
    return getChildAccounts(account.code);
  };

  // Helper function to toggle sub-item expansion
  const toggleSubItem = (accountCode: string) => {
    setExpandedSubItems(prev => 
      prev.includes(accountCode) 
        ? prev.filter(code => code !== accountCode)
        : [...prev, accountCode]
    );
  };

  // Handle single click on sub-account - drill down
  const handleSubAccountClick = (account: ChartAccount) => {
    console.log('Sub-account clicked:', account);
    setDrillDownAccount(account);
  };

  // Handle double click on sub-account - show journal entries
  const handleSubAccountDoubleClick = (account: ChartAccount) => {
    console.log('Sub-account double-clicked:', account);
    setDrillDownAccount(account);
    setShowJournalEntries(true);
  };

  // Go back to parent account view
  const goBackToParent = () => {
    setDrillDownAccount(null);
    setShowJournalEntries(false);
    setActiveTab("summary");
  };

  // Mock data for customer-wise receivables (in real app, this would come from API)
  const getCustomerReceivables = (account: ChartAccount) => {
    if (account.code === "1210") { // Trade Receivables
      return [
        { customer: "ABC Corp", balance: 250000, overdue: 30, lastPayment: "2024-03-15" },
        { customer: "XYZ Ltd", balance: 150000, overdue: 0, lastPayment: "2024-04-01" },
        { customer: "DEF Industries", balance: 50000, overdue: 60, lastPayment: "2024-02-20" }
      ];
    }
    if (account.code === "1220") { // Employee Advances
      return [
        { employee: "John Doe", balance: 15000, advanceDate: "2024-03-01", purpose: "Travel" },
        { employee: "Jane Smith", balance: 10000, advanceDate: "2024-03-15", purpose: "Equipment" }
      ];
    }
    return [];
  };

  // Mock data for journal entries (in real app, this would come from API)
  const getJournalEntries = (account: ChartAccount, month?: string) => {
    const targetMonth = month || selectedMonth;
    
    // Generate journal entries for the specified month
    const entries = [];
    const daysInMonth = new Date(parseInt(targetMonth.split('-')[0]), parseInt(targetMonth.split('-')[1]), 0).getDate();
    
    // Generate 8-12 entries for the month
    const numEntries = Math.floor(Math.random() * 5) + 8;
    
    for (let i = 0; i < numEntries; i++) {
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      const date = `${targetMonth}-${String(day).padStart(2, '0')}`;
      const isDebit = Math.random() > 0.5;
      const amount = Math.floor(Math.random() * 100000) + 10000;
      
      let description, reference;
      if (account.code === "1210") { // Customer Receivables
        description = isDebit ? `Sales Invoice #INV-${String(i + 1).padStart(3, '0')}` : `Cash Receipt #CR-${String(i + 1).padStart(3, '0')}`;
        reference = isDebit ? `INV-${String(i + 1).padStart(3, '0')}` : `CR-${String(i + 1).padStart(3, '0')}`;
      } else if (account.code === "1220") { // Employee Advances
        description = isDebit ? `Advance Payment #ADV-${String(i + 1).padStart(3, '0')}` : `Advance Recovery #REC-${String(i + 1).padStart(3, '0')}`;
        reference = isDebit ? `ADV-${String(i + 1).padStart(3, '0')}` : `REC-${String(i + 1).padStart(3, '0')}`;
      } else {
        description = isDebit ? `Debit Entry #DE-${String(i + 1).padStart(3, '0')}` : `Credit Entry #CE-${String(i + 1).padStart(3, '0')}`;
        reference = isDebit ? `DE-${String(i + 1).padStart(3, '0')}` : `CE-${String(i + 1).padStart(3, '0')}`;
      }
      
      entries.push({
        id: `JE${String(i + 1).padStart(3, '0')}`,
        date,
        description,
        debit: isDebit ? amount : 0,
        credit: isDebit ? 0 : amount,
        reference
      });
    }
    
    // Sort by date
    return entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Group accounts by category for nested view
  const groupedAccounts = chartOfAccounts.reduce((acc, account) => {
    if (!account.parent && account.isHeader) {
      // This is a main category (Assets, Liabilities, etc.)
      const category = account.name;
      if (!acc[category]) {
        acc[category] = [];
      }
      // Don't add the main category account to the data rows
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
    const totals = calculateAccountTotals(account);

    return (
      <div 
        key={account.code} 
        className={cn(
          "grid grid-cols-11 gap-4 py-2 px-4 transition-colors cursor-pointer border-b border-gray-100",
          "bg-white",
          selectedAccount?.code === account.code ? 'bg-blue-50' : '',
          account.isHeader ? 'bg-gray-50 font-medium' : ''
        )}
        style={{ paddingLeft: `${20 + (indentLevel * 24)}px` }}
        onClick={() => setSelectedAccount(account)}
      >
        {/* GL Code */}
        <div className="text-xs text-mobius-gray-500 font-mono">
          {account.code}
        </div>
        
        {/* Description */}
        <div className={cn(
          "col-span-2 text-sm",
          account.isHeader ? "text-gray-900 font-medium" : "text-gray-900"
        )}>
          {account.name}
        </div>
        
        {/* Movement - Debits */}
        <div className="text-sm text-right">
          {totals.debit > 0 ? 
            `₹${totals.debit.toLocaleString()}` : '-'}
        </div>
        
        {/* Movement - Credits */}
        <div className="text-sm text-right">
          {totals.credit > 0 ? 
            `₹${totals.credit.toLocaleString()}` : '-'}
        </div>
        
        {/* Current Month - Debits */}
        <div className="text-sm text-right">
          {totals.debit > 0 ? 
            `₹${totals.debit.toLocaleString()}` : '-'}
        </div>
        
        {/* Current Month - Credits */}
        <div className="text-sm text-right">
          {totals.credit > 0 ? 
            `₹${totals.credit.toLocaleString()}` : '-'}
        </div>
        
        {/* Previous Month - Debits */}
        <div className="text-sm text-right">
          {totals.debit > 0 ? 
            `₹${(totals.debit * 0.95).toLocaleString()}` : '-'}
        </div>
        
        {/* Previous Month - Credits */}
        <div className="text-sm text-right">
          {totals.credit > 0 ? 
            `₹${(totals.credit * 0.95).toLocaleString()}` : '-'}
        </div>
        
        {/* Flux Analysis Variance */}
        <div className="text-sm text-center">
          {(() => {
            const currentTotal = totals.debit + totals.credit;
            const previousTotal = (totals.debit * 0.95) + (totals.credit * 0.95);
            const change = currentTotal - previousTotal;
            const changePercent = previousTotal > 0 ? ((change / previousTotal) * 100) : 0;
            
            if (Math.abs(changePercent) < 5) {
              return <span className="text-xs">0.0%</span>;
            } else if (changePercent > 0) {
              return <span className="text-xs">+{changePercent.toFixed(1)}%</span>;
            } else {
              return <span className="text-xs">{changePercent.toFixed(1)}%</span>;
            }
          })()}
        </div>
        
        {/* Flux Analysis Commentary */}
        <div className="text-sm text-center">
          {(() => {
            const currentTotal = totals.debit + totals.credit;
            const previousTotal = (totals.debit * 0.95) + (totals.credit * 0.95);
            const change = currentTotal - previousTotal;
            const changePercent = previousTotal > 0 ? ((change / previousTotal) * 100) : 0;
            
            // Generate meaningful commentary based on account type and change
            if (Math.abs(changePercent) < 5) {
              return <span className="text-xs">Stable performance</span>;
            } else if (changePercent > 0) {
              // Positive change commentary based on account type
              if (account.code === "1100") { // Cash
                return <span className="text-xs">Cash position improved</span>;
              } else if (account.code === "1210") { // Trade Receivables
                return <span className="text-xs">AR balance increased</span>;
              } else if (account.code === "1310") { // Trade Payables
                return <span className="text-xs">AP balance increased</span>;
              } else if (account.code === "1410") { // Inventory
                return <span className="text-xs">Inventory levels rose</span>;
              } else if (account.code === "1510") { // Prepaid Expenses
                return <span className="text-xs">Prepaid amounts increased</span>;
              } else if (account.code.startsWith('1')) { // Assets
                return <span className="text-xs">Asset value increased</span>;
              } else if (account.code.startsWith('2')) { // Liabilities
                return <span className="text-xs">Liability growth noted</span>;
              } else if (account.code.startsWith('3')) { // Equity
                return <span className="text-xs">Equity position strengthened</span>;
              } else if (account.code.startsWith('4')) { // Revenue
                return <span className="text-xs">Revenue growth achieved</span>;
              } else if (account.code.startsWith('5')) { // Expenses
                return <span className="text-xs">Expense increase recorded</span>;
              } else {
                return <span className="text-xs">Positive trend observed</span>;
              }
            } else {
              // Negative change commentary based on account type
              if (account.code === "1100") { // Cash
                return <span className="text-xs">Cash position declined</span>;
              } else if (account.code === "1210") { // Trade Receivables
                return <span className="text-xs">AR balance decreased</span>;
              } else if (account.code === "1310") { // Trade Payables
                return <span className="text-xs">AP balance decreased</span>;
              } else if (account.code === "1410") { // Inventory
                return <span className="text-xs">Inventory levels fell</span>;
              } else if (account.code === "1510") { // Prepaid Expenses
                return <span className="text-xs">Prepaid amounts decreased</span>;
              } else if (account.code.startsWith('1')) { // Assets
                return <span className="text-xs">Asset value decreased</span>;
              } else if (account.code.startsWith('2')) { // Liabilities
                return <span className="text-xs">Liability reduction noted</span>;
              } else if (account.code.startsWith('3')) { // Equity
                return <span className="text-xs">Equity position weakened</span>;
              } else if (account.code.startsWith('4')) { // Revenue
                return <span className="text-xs">Revenue decline observed</span>;
              } else if (account.code.startsWith('5')) { // Expenses
                return <span className="text-xs">Expense reduction achieved</span>;
              } else {
                return <span className="text-xs">Decline trend noted</span>;
              }
            }
          })()}
        </div>
      </div>
    );
  };

  const getTrialBalanceTotals = () => {
    // Calculate totals from all accounts (including parent accounts)
    const allTotals = chartOfAccounts.map(account => calculateAccountTotals(account));
    const totalDebits = allTotals.reduce((sum, totals) => sum + totals.debit, 0);
    const totalCredits = allTotals.reduce((sum, totals) => sum + totals.credit, 0);
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
            {/* Month Picker */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-mobius-gray-500" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="2024-01">January 2024</option>
                <option value="2024-02">February 2024</option>
                <option value="2024-03">March 2024</option>
                <option value="2024-04">April 2024</option>
                <option value="2024-05">May 2024</option>
                <option value="2024-06">June 2024</option>
                <option value="2024-07">July 2024</option>
                <option value="2024-08">August 2024</option>
                <option value="2024-09">September 2024</option>
                <option value="2024-10">October 2024</option>
                <option value="2024-11">November 2024</option>
                <option value="2024-12">December 2024</option>
                <option value="2025-01">January 2025</option>
                <option value="2025-02">February 2025</option>
                <option value="2025-03">March 2025</option>
                <option value="2025-04">April 2025</option>
                <option value="2025-05">May 2025</option>
              </select>
            </div>

            {/* Export */}
            <Button variant="outline" size="sm" className="h-8">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Chart of Accounts Content */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <div className="h-full flex flex-col border-r border-mobius-gray-100 w-full">
          {/* Tab Navigation */}
          <div className="bg-white border-b border-mobius-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("ledger")}
                className={cn(
                  "relative py-3 px-6 text-sm font-medium transition-colors",
                  activeTab === "ledger"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                )}
              >
                Ledger
                {activeTab === "ledger" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("glDrillDown")}
                className={cn(
                  "relative py-3 px-6 text-sm font-medium transition-colors",
                  activeTab === "glDrillDown"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                )}
              >
                GL Drill Down
                {activeTab === "glDrillDown" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("auditTrail")}
                className={cn(
                  "relative py-3 px-6 text-sm font-medium transition-colors",
                  activeTab === "auditTrail"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                )}
              >
                Audit Trail
                {activeTab === "auditTrail" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full"></div>
                )}
              </button>
            </div>
          </div>

              <div className="flex-1 overflow-y-auto">
            {/* Tab Content */}
            {activeTab === "ledger" && (
                <div className="bg-white">
                  {/* Table Header */}
                  <div className="bg-blue-50 py-3 px-4 border-b border-blue-200">
                    <div className="grid grid-cols-11 gap-4 text-sm font-medium text-blue-900">
                      <div>GL Code</div>
                      <div className="col-span-2">Description</div>
                      <div className="col-span-2">
                        <div className="text-center">Movement</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-center">Month ending Apr-25</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-center">Month ending Mar-25</div>
                      </div>
                      <div>
                        <div className="text-center">Flux Analysis</div>
                      </div>
                      <div>
                        <div className="text-center">Flux Analysis</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-11 gap-4 text-xs text-blue-600 mt-1">
                      <div></div>
                      <div className="col-span-2"></div>
                      <div className="text-right">Debits</div>
                      <div className="text-right">Credits</div>
                      <div className="text-right">Debits</div>
                      <div className="text-right">Credits</div>
                      <div className="text-right">Debits</div>
                      <div className="text-right">Credits</div>
                      <div className="text-center">Variance</div>
                      <div className="text-center">Commentary</div>
                    </div>
                  </div>
                  
                  <div>
                    {Object.entries(groupedAccounts).map(([category, accounts]) => (
                      <div key={category} className="overflow-hidden">
                        {/* Category Header */}
                        <div 
                          className="bg-white py-3 px-4 border-b border-blue-200 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <div className="grid grid-cols-11 gap-4">
                            {/* GL Code - Category name goes here */}
                            <div className="text-sm font-medium text-blue-900">
                              <Button
                                variant="ghost"
                                className="w-full justify-start p-0 h-auto font-medium text-blue-900"
                                onClick={() => toggleCategory(category)}
                              >
                                <div className="flex items-center space-x-3">
                                  {collapsedCategories.includes(category) ? (
                                    <ChevronRight className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                  <span className="text-sm font-medium text-blue-900">{category}</span>
                                  <span className="text-xs text-blue-600 ml-auto">
                                    {accounts.length} accounts
                                  </span>
                                </div>
                              </Button>
                            </div>
                            
                            {/* Description - Empty for parent accounts */}
                            <div className="col-span-2 text-sm font-medium text-blue-900">
                              {/* Parent accounts don't show description in this column */}
                            </div>
                            
                            {/* Movement - Debits */}
                            <div className="text-sm text-right font-medium text-blue-900">
                              {(() => {
                                const parentAccount = chartOfAccounts.find(a => a.name === category);
                                if (parentAccount) {
                                  const totals = calculateAccountTotals(parentAccount);
                                  return totals.debit > 0 ? `₹${totals.debit.toLocaleString()}` : '-';
                                }
                                return '-';
                              })()}
                            </div>
                            
                            {/* Movement - Credits */}
                            <div className="text-sm text-right font-medium text-blue-900">
                              {(() => {
                                const parentAccount = chartOfAccounts.find(a => a.name === category);
                                if (parentAccount) {
                                  const totals = calculateAccountTotals(parentAccount);
                                  return totals.credit > 0 ? `₹${totals.credit.toLocaleString()}` : '-';
                                }
                                return '-';
                              })()}
                            </div>
                            
                            {/* Current Month - Debits */}
                            <div className="text-sm text-right font-medium text-blue-900">
                              {(() => {
                                const parentAccount = chartOfAccounts.find(a => a.name === category);
                                if (parentAccount) {
                                  const totals = calculateAccountTotals(parentAccount);
                                  return totals.debit > 0 ? `₹${totals.debit.toLocaleString()}` : '-';
                                }
                                return '-';
                              })()}
                            </div>
                            
                            {/* Current Month - Credits */}
                            <div className="text-sm text-right font-medium text-blue-900">
                              {(() => {
                                const parentAccount = chartOfAccounts.find(a => a.name === category);
                                if (parentAccount) {
                                  const totals = calculateAccountTotals(parentAccount);
                                  return totals.credit > 0 ? `₹${totals.credit.toLocaleString()}` : '-';
                                }
                                return '-';
                              })()}
                            </div>
                            
                            {/* Previous Month - Debits */}
                            <div className="text-sm text-right font-medium text-blue-900">
                              {(() => {
                                const parentAccount = chartOfAccounts.find(a => a.name === category);
                                if (parentAccount) {
                                  const totals = calculateAccountTotals(parentAccount);
                                  return totals.debit > 0 ? `₹${(totals.debit * 0.95).toLocaleString()}` : '-';
                                }
                                return '-';
                              })()}
                            </div>
                            
                            {/* Previous Month - Credits */}
                            <div className="text-sm text-right font-medium text-blue-900">
                              {(() => {
                                const parentAccount = chartOfAccounts.find(a => a.name === category);
                                if (parentAccount) {
                                  const totals = calculateAccountTotals(parentAccount);
                                  return totals.credit > 0 ? `₹${(totals.credit * 0.95).toLocaleString()}` : '-';
                                }
                                return '-';
                              })()}
                            </div>
                            
                            {/* Flux Analysis Variance */}
                            <div className="text-sm text-center font-medium text-blue-900">
                              {(() => {
                                const parentAccount = chartOfAccounts.find(a => a.name === category);
                                if (parentAccount) {
                                  const totals = calculateAccountTotals(parentAccount);
                                  const currentTotal = totals.debit + totals.credit;
                                  const previousTotal = (totals.debit * 0.95) + (totals.credit * 0.95);
                                  const change = currentTotal - previousTotal;
                                  const changePercent = previousTotal > 0 ? ((change / previousTotal) * 100) : 0;
                                  
                                  if (Math.abs(changePercent) < 5) {
                                    return <span>0.0%</span>;
                                  } else if (changePercent > 0) {
                                    return <span>+{changePercent.toFixed(1)}%</span>;
                                  } else {
                                    return <span>{changePercent.toFixed(1)}%</span>;
                                  }
                                }
                                return '-';
                              })()}
                            </div>
                            
                            {/* Flux Analysis Commentary */}
                            <div className="text-sm text-center font-medium text-blue-900">
                              {(() => {
                                const parentAccount = chartOfAccounts.find(a => a.name === category);
                                if (parentAccount) {
                                  const totals = calculateAccountTotals(parentAccount);
                                  const currentTotal = totals.debit + totals.credit;
                                  const previousTotal = (totals.debit * 0.95) + (totals.credit * 0.95);
                                  const change = currentTotal - previousTotal;
                                  const changePercent = previousTotal > 0 ? ((change / previousTotal) * 100) : 0;
                                  
                                  if (Math.abs(changePercent) < 5) {
                                    return <span className="text-xs">Stable performance</span>;
                                  } else if (changePercent > 0) {
                                    return <span className="text-xs">Growth trend continues</span>;
                                  } else {
                                    return <span className="text-xs">Decline observed</span>;
                                  }
                                }
                                return '-';
                              })()}
                            </div>
                          </div>
                        </div>
                        
                        {/* Category Content */}
                        {!collapsedCategories.includes(category) && (
                          <div>
                            {accounts.map(account => (
                              <div 
                                key={account.code} 
                                className={cn(
                                  "grid grid-cols-11 gap-4 py-2 px-4 transition-colors cursor-pointer border-b border-gray-100",
                                  selectedAccount?.code === account.code ? 'bg-blue-50 border-blue-200' : ''
                                )}
                                onClick={() => {
                                  console.log('Main account clicked:', account);
                                  // Set the selected account first
                                  setSelectedAccount(account);
                                  // Reset drill-down and journal entries
                                  setDrillDownAccount(null);
                                  setShowJournalEntries(false);
                                  // Use setTimeout to ensure state updates are processed before tab switch
                                  setTimeout(() => {
                                    setActiveTab("glDrillDown");
                                  }, 0);
                                }}
                              >
                                {/* GL Code */}
                                <div className="text-xs text-mobius-gray-500 font-mono">
                                  {account.code}
                                </div>
                                
                                {/* Description */}
                                <div className={cn(
                                  "col-span-2 text-sm",
                                  account.isHeader ? "text-gray-900 font-medium" : "text-gray-900"
                                )}>
                                  {account.name}
                                </div>
                                
                                {/* Movement - Debits */}
                                <div className="text-sm text-right">
                                  {calculateAccountTotals(account).debit > 0 ? 
                                    `₹${calculateAccountTotals(account).debit.toLocaleString()}` : '-'}
                                </div>
                                
                                {/* Movement - Credits */}
                                <div className="text-sm text-right">
                                  {calculateAccountTotals(account).credit > 0 ? 
                                    `₹${calculateAccountTotals(account).credit.toLocaleString()}` : '-'}
                                </div>
                                
                                {/* Current Month - Debits */}
                                <div className="text-sm text-right">
                                  {calculateAccountTotals(account).debit > 0 ? 
                                    `₹${calculateAccountTotals(account).debit.toLocaleString()}` : '-'}
                                </div>
                                
                                {/* Current Month - Credits */}
                                <div className="text-sm text-right">
                                  {calculateAccountTotals(account).credit > 0 ? 
                                    `₹${calculateAccountTotals(account).credit.toLocaleString()}` : '-'}
                                </div>
                                
                                {/* Previous Month - Debits */}
                                <div className="text-sm text-right">
                                  {calculateAccountTotals(account).debit > 0 ? 
                                    `₹${(calculateAccountTotals(account).debit * 0.95).toLocaleString()}` : '-'}
                                </div>
                                
                                {/* Previous Month - Credits */}
                                <div className="text-sm text-right">
                                  {calculateAccountTotals(account).credit > 0 ? 
                                    `₹${(calculateAccountTotals(account).credit * 0.95).toLocaleString()}` : '-'}
                                </div>
                                
                                {/* Flux Analysis Variance */}
                                <div className="text-sm text-center">
                                  {(() => {
                                    const totals = calculateAccountTotals(account);
                                    const currentTotal = totals.debit + totals.credit;
                                    const previousTotal = (totals.debit * 0.95) + (totals.credit * 0.95);
                                    const change = currentTotal - previousTotal;
                                    const changePercent = previousTotal > 0 ? ((change / previousTotal) * 100) : 0;
                                    
                                    if (Math.abs(changePercent) < 5) {
                                      return <span className="text-xs">0.0%</span>;
                                    } else if (changePercent > 0) {
                                      return <span className="text-xs">+{changePercent.toFixed(1)}%</span>;
                                    } else {
                                      return <span className="text-xs">{changePercent.toFixed(1)}%</span>;
                                    }
                                  })()}
                                </div>
                                
                                {/* Flux Analysis Commentary */}
                                <div className="text-sm text-center">
                                  {(() => {
                                    const totals = calculateAccountTotals(account);
                                    const currentTotal = totals.debit + totals.credit;
                                    const previousTotal = (totals.debit * 0.95) + (totals.credit * 0.95);
                                    const change = currentTotal - previousTotal;
                                    const changePercent = previousTotal > 0 ? ((change / previousTotal) * 100) : 0;
                                    
                                    // Generate meaningful commentary based on account type and change
                                    if (Math.abs(changePercent) < 5) {
                                      return <span className="text-xs">Stable performance</span>;
                                    } else if (changePercent > 0) {
                                      // Positive change commentary based on account type
                                      if (account.code === "1100") { // Cash
                                        return <span className="text-xs">Cash position improved</span>;
                                      } else if (account.code === "1210") { // Trade Receivables
                                        return <span className="text-xs">AR balance increased</span>;
                                      } else if (account.code === "1310") { // Trade Payables
                                        return <span className="text-xs">AP balance increased</span>;
                                      } else if (account.code === "1410") { // Inventory
                                        return <span className="text-xs">Inventory levels rose</span>;
                                      } else if (account.code === "1510") { // Prepaid Expenses
                                        return <span className="text-xs">Prepaid amounts increased</span>;
                                      } else if (account.code.startsWith('1')) { // Assets
                                        return <span className="text-xs">Asset value increased</span>;
                                      } else if (account.code.startsWith('2')) { // Liabilities
                                        return <span className="text-xs">Liability growth noted</span>;
                                      } else if (account.code.startsWith('3')) { // Equity
                                        return <span className="text-xs">Equity position strengthened</span>;
                                      } else if (account.code.startsWith('4')) { // Revenue
                                        return <span className="text-xs">Revenue growth achieved</span>;
                                      } else if (account.code.startsWith('5')) { // Expenses
                                        return <span className="text-xs">Expense increase recorded</span>;
                                      } else {
                                        return <span className="text-xs">Positive trend observed</span>;
                                      }
                                    } else {
                                      // Negative change commentary based on account type
                                      if (account.code === "1100") { // Cash
                                        return <span className="text-xs">Cash position declined</span>;
                                      } else if (account.code === "1210") { // Trade Receivables
                                        return <span className="text-xs">AR balance decreased</span>;
                                      } else if (account.code === "1310") { // Trade Payables
                                        return <span className="text-xs">AP balance decreased</span>;
                                      } else if (account.code === "1410") { // Inventory
                                        return <span className="text-xs">Inventory levels fell</span>;
                                      } else if (account.code === "1510") { // Prepaid Expenses
                                        return <span className="text-xs">Prepaid amounts decreased</span>;
                                      } else if (account.code.startsWith('1')) { // Assets
                                        return <span className="text-xs">Asset value decreased</span>;
                                      } else if (account.code.startsWith('2')) { // Liabilities
                                        return <span className="text-xs">Liability reduction noted</span>;
                                      } else if (account.code.startsWith('3')) { // Equity
                                        return <span className="text-xs">Equity position weakened</span>;
                                      } else if (account.code.startsWith('4')) { // Revenue
                                        return <span className="text-xs">Revenue decline observed</span>;
                                      } else if (account.code.startsWith('5')) { // Expenses
                                        return <span className="text-xs">Expense reduction achieved</span>;
                                      } else {
                                        return <span className="text-xs">Decline trend noted</span>;
                                      }
                                    }
                                  })()}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                      </div>
                    )}

            {activeTab === "glDrillDown" && (
              <>
                {selectedAccount ? (
                  <GLDrillDown 
                    selectedAccount={selectedAccount}
                    onBack={() => setSelectedAccount(null)}
                    onDrillDown={(account) => {
                      setSelectedAccount(account);
                      setActiveTab("ledger");
                    }}
                    onTrace={(entryId) => {
                      setActiveTab("auditTrail");
                    }}
                  />
                ) : (
                  <div className="bg-white p-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-mobius-gray-900 mb-2">GL Drill Down</h3>
                      <p className="text-mobius-gray-600">Select an account from the Ledger tab to view detailed drill-down analysis</p>
                      <div className="mt-4 p-4 bg-mobius-gray-50 rounded-lg">
                        <p className="text-sm text-mobius-gray-500">This feature provides detailed drill-down capabilities for analyzing specific GL accounts, including transaction details, sub-account breakdowns, and trend analysis.</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "auditTrail" && (
              <>
                {selectedAccount ? (
                  <AuditTrail 
                    selectedAccount={selectedAccount}
                    onBack={() => setActiveTab("glDrillDown")}
                  />
                ) : (
                  <div className="bg-white p-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-mobius-gray-900 mb-2">Audit Trail</h3>
                      <p className="text-mobius-gray-600">Select an account and trace a journal entry to view its complete audit trail</p>
                      <div className="mt-4 p-4 bg-mobius-gray-50 rounded-lg">
                        <p className="text-sm text-mobius-gray-500">This feature shows the complete audit trail of all changes, modifications, and entries made to the general ledger, including user actions, timestamps, and change details.</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
                          </div>
                          </div>
      </div>
    </div>
  );
} 