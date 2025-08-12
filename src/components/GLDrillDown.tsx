import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Download, 
  Eye,
  ChevronRight,
  ArrowLeft,
  FileText
} from "lucide-react";
import { ChartAccount } from "@/lib/chartOfAccounts";
import { cn } from "@/lib/utils";

interface GLDrillDownProps {
  selectedAccount: ChartAccount | null;
  onBack: () => void;
  onDrillDown: (account: ChartAccount) => void;
  onTrace: (entryId: string) => void;
}

interface LedgerEntry {
  id: string;
  date: string;
  vendor: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reference?: string;
}

export default function GLDrillDown({ selectedAccount, onBack, onDrillDown, onTrace }: GLDrillDownProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [drillDownAccount, setDrillDownAccount] = useState<ChartAccount | null>(null);

  // Mock data for ledger entries (in real app, this would come from API)
  const getLedgerEntries = (account: ChartAccount): LedgerEntry[] => {
    const entries: LedgerEntry[] = [];
    let runningBalance = 0;
    
    // Generate 8-12 entries for the account
    const numEntries = Math.floor(Math.random() * 5) + 8;
    
    for (let i = 0; i < numEntries; i++) {
      const entryId = `JE-${String(3412 - i).padStart(4, '0')}`;
      const date = new Date(2025, 6, 21 - i); // July 2025, counting backwards
      const isDebit = Math.random() > 0.3; // 70% chance of debit
      const amount = Math.floor(Math.random() * 100000) + 1000;
      
      let vendor, description;
      if (account.code === "1100") { // Cash
        const vendors = ["ACME Logistics", "Office Supplies Co", "Tech Solutions Inc", "Power Electric Ltd", "Internet Provider", "Cleaning Services", "Security Services", "Maintenance Co"];
        const descriptions = ["Transportation charges", "Stationery purchase", "Software license", "Electricity bill", "Internet bill", "Cleaning services", "Security services", "Equipment maintenance"];
        vendor = vendors[i % vendors.length];
        description = descriptions[i % descriptions.length];
      } else if (account.code === "1210") { // Trade Receivables
        const vendors = ["ABC Corp", "XYZ Ltd", "DEF Industries", "GHI Solutions", "JKL Enterprises", "MNO Services", "PQR Trading", "STU Manufacturing"];
        const descriptions = ["Sales invoice", "Service revenue", "Product delivery", "Consulting fees", "Project milestone", "Support services", "Training fees", "License renewal"];
        vendor = vendors[i % vendors.length];
        description = descriptions[i % descriptions.length];
      } else {
        const vendors = ["Vendor A", "Supplier B", "Service C", "Provider D", "Company E", "Business F", "Enterprise G", "Corporation H"];
        const descriptions = ["Purchase order", "Service charge", "Subscription fee", "Maintenance cost", "Utility expense", "Office expense", "Travel cost", "Training expense"];
        vendor = vendors[i % vendors.length];
        description = descriptions[i % descriptions.length];
      }
      
      if (isDebit) {
        runningBalance += amount;
        entries.push({
          id: entryId,
          date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          vendor,
          description,
          debit: amount,
          credit: 0,
          balance: runningBalance
        });
      } else {
        runningBalance -= amount;
        entries.push({
          id: entryId,
          date: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          vendor,
          description,
          debit: 0,
          credit: amount,
          balance: runningBalance
        });
      }
    }
    
    // Sort by date (newest first)
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Get sub-accounts for the selected account
  const getSubAccounts = (account: ChartAccount): ChartAccount[] => {
    // Mock sub-accounts - in real app, this would come from the chart of accounts
    if (account.code === "1100") { // Cash
      return [
        { code: "1101", name: "Petty Cash", type: "Asset", category: "Current Assets", isHeader: false, parent: "1100", debit: 5000, credit: 0, balance: 5000, status: "active" },
        { code: "1102", name: "Bank Account", type: "Asset", category: "Current Assets", isHeader: false, parent: "1100", debit: 150000, credit: 0, balance: 150000, status: "active" },
        { code: "1103", name: "Cash in Transit", type: "Asset", category: "Current Assets", isHeader: false, parent: "1100", debit: 20000, credit: 0, balance: 20000, status: "active" }
      ];
    } else if (account.code === "1210") { // Trade Receivables
      return [
        { code: "1211", name: "Domestic Receivables", type: "Asset", category: "Current Assets", isHeader: false, parent: "1210", debit: 100000, credit: 0, balance: 100000, status: "active" },
        { code: "1212", name: "Export Receivables", type: "Asset", category: "Current Assets", isHeader: false, parent: "1210", debit: 50000, credit: 0, balance: 50000, status: "active" },
        { code: "1213", name: "Intercompany Receivables", type: "Asset", category: "Current Assets", isHeader: false, parent: "1210", debit: 25000, credit: 0, balance: 25000, status: "active" }
      ];
    }
    return [];
  };

  const handleSubAccountClick = (subAccount: ChartAccount) => {
    setDrillDownAccount(subAccount);
  };

  const goBackToParent = () => {
    setDrillDownAccount(null);
  };

  const currentAccount = drillDownAccount || selectedAccount;
  const ledgerEntries = getLedgerEntries(currentAccount);
  const subAccounts = getSubAccounts(currentAccount);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-mobius-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedAccount && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="text-mobius-gray-600 hover:text-mobius-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <h1 className="text-l font-semibold text-mobius-gray-900">
                GL Entries - {currentAccount?.code} {currentAccount?.name}
              </h1>
              <p className="text-sm text-mobius-gray-500 mt-1">
                {drillDownAccount ? 'Sub-account drill down' : 'Account drill down'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mobius-gray-500 w-4 h-4" />
              <Input 
                placeholder="Search entries..." 
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Ledger Entries */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white">
            {/* Table Header */}
            <div className="bg-blue-50 py-3 px-4 border-b border-blue-200">
              <div className="grid grid-cols-7 gap-4 text-sm font-medium text-blue-900">
                <div>Entry ID</div>
                <div>Date</div>
                <div className="col-span-2">Vendor/Description</div>
                <div className="text-right">Debit</div>
                <div className="text-right">Credit</div>
                <div className="text-right">Balance</div>
              </div>
              <div className="grid grid-cols-7 gap-4 text-xs text-blue-600 mt-1">
                <div></div>
                <div></div>
                <div className="col-span-2"></div>
                <div className="text-right">Amount</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Running</div>
              </div>
            </div>
            
            <div>
              {ledgerEntries.map((entry) => (
                <div 
                  key={entry.id} 
                  className="grid grid-cols-7 gap-4 py-2 px-4 transition-colors cursor-pointer border-b border-gray-100 bg-white hover:bg-gray-50"
                  onClick={() => onTrace(entry.id)}
                >
                  {/* Entry ID */}
                  <div className="text-xs text-mobius-gray-500 font-mono">
                    {entry.id}
                  </div>
                  
                  {/* Date */}
                  <div className="text-sm text-mobius-gray-600">
                    {entry.date}
                  </div>
                  
                  {/* Vendor/Description */}
                  <div className="col-span-2">
                    <div className="text-sm font-medium text-mobius-gray-900">{entry.vendor}</div>
                    <div className="text-sm text-mobius-gray-600">{entry.description}</div>
                  </div>
                  
                  {/* Debit */}
                  <div className="text-sm text-right">
                    {entry.debit > 0 ? (
                      <span className="text-mobius-gray-900">
                        ₹{entry.debit.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-mobius-gray-500">-</span>
                    )}
                  </div>
                  
                  {/* Credit */}
                  <div className="text-sm text-right">
                    {entry.credit > 0 ? (
                      <span className="text-mobius-gray-900">
                        ₹{entry.credit.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-mobius-gray-500">-</span>
                    )}
                  </div>
                  
                  {/* Balance */}
                  <div className="text-sm text-right">
                    <span className="text-mobius-gray-900">
                      ₹{entry.balance.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sub-accounts Sidebar */}
        {subAccounts.length > 0 && (
          <div className="w-80 border-l border-mobius-gray-200 bg-white">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-mobius-gray-900 mb-4">Sub-accounts</h3>
              <div className="space-y-3">
                {subAccounts.map((subAccount) => (
                  <Card 
                    key={subAccount.code}
                    className={cn(
                      "p-3 cursor-pointer transition-all hover:shadow-md",
                      drillDownAccount?.code === subAccount.code ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-white"
                    )}
                    onClick={() => handleSubAccountClick(subAccount)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono text-mobius-gray-500">{subAccount.code}</span>
                          <ChevronRight className="w-4 h-4 text-mobius-gray-400" />
                        </div>
                        <div className="text-sm font-medium text-mobius-gray-900 mt-1">{subAccount.name}</div>
                        <div className="text-sm text-mobius-gray-600 mt-1">
                          Balance: ₹{subAccount.balance?.toLocaleString() || '0'}
                        </div>
                      </div>
                      <div className="relative group">
                        <div className="w-16 h-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                          <span className="text-xs font-semibold text-gray-700">
                            {(() => {
                              // Generate random percentage change for demo
                              const change = Math.floor(Math.random() * 20) - 10; // -10% to +10%
                              return change >= 0 ? `+${change}%` : `${change}%`;
                            })()}
                          </span>
                        </div>
                        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          M-o-M change
                          <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 