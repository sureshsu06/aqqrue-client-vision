import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Bot
} from "lucide-react";

interface JEDetailDrillDownProps {
  accountName: string;
  clientName: string;
  onBack: () => void;
}

// Mock journal entry data for the specific account
const mockJournalEntries = [
  {
    id: "JE-2025-001",
    date: "2025-01-15",
    description: "SaaS Subscription Revenue - Q1 2025",
    amount: 800000,
    type: "credit",
    vendor: "Elire Global",
    status: "posted",
    confidence: 95,
    sourceDoc: "Contract-EL-2025-001.pdf"
  },
  {
    id: "JE-2025-002",
    date: "2025-01-10",
    description: "Professional Services - Implementation",
    amount: 450000,
    type: "credit",
    vendor: "Elire Global",
    status: "posted",
    confidence: 92,
    sourceDoc: "Invoice-EL-PS-001.pdf"
  },
  {
    id: "JE-2025-003",
    date: "2025-01-05",
    description: "Implementation Fees - Phase 1",
    amount: 180000,
    type: "credit",
    vendor: "Elire Global",
    status: "draft",
    confidence: 88,
    sourceDoc: "SOW-EL-IMP-001.pdf"
  }
];

const mockAIInsights = [
  {
    type: "alert",
    message: "Implementation fees down 15% vs last quarter - review project pipeline",
    action: "Review Pipeline"
  },
  {
    type: "insight",
    message: "Professional services margin improved 8% - pricing strategy working",
    action: "Analyze Success"
  },
  {
    type: "opportunity",
    message: "3 pending implementations worth $2.1M - accelerate delivery",
    action: "Expedite Projects"
  }
];

export function JEDetailDrillDown({ accountName, clientName, onBack }: JEDetailDrillDownProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'ledger'>('summary');

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'credit' ? (
      <TrendingUp className="h-3 w-3 text-green-600" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-600" />
    );
  };

  const filteredEntries = mockJournalEntries.filter(entry =>
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = mockJournalEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const postedAmount = mockJournalEntries
    .filter(entry => entry.status === 'posted')
    .reduce((sum, entry) => sum + entry.amount, 0);
  const draftAmount = mockJournalEntries
    .filter(entry => entry.status === 'draft')
    .reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Top Bar - Consistent with other pages */}
      <div className="border-b border-mobius-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-medium text-gray-900">
                {accountName} - Journal Entries
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {clientName} • Detailed journal entry analysis
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Journal Entries List */}
        <div className="w-1/3 border-r border-mobius-gray-100 p-4 space-y-4 overflow-y-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9"
            />
          </div>

          {/* Summary Stats */}
          <Card className="border border-mobius-gray-100 bg-white">
            <CardContent className="p-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted:</span>
                  <span className="font-medium text-green-600">{formatCurrency(postedAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Draft:</span>
                  <span className="font-medium text-yellow-600">{formatCurrency(draftAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Entries List */}
          <div className="space-y-2">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className={`
                  p-3 border rounded-lg cursor-pointer transition-colors
                  ${selectedEntry === entry.id 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
                onClick={() => setSelectedEntry(entry.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{entry.id}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(entry.status)}`}
                  >
                    {entry.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-900 mb-1">{entry.description}</div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{entry.date}</span>
                  <div className="flex items-center space-x-1">
                    {getTypeIcon(entry.type)}
                    <span className="font-medium">{formatCurrency(entry.amount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column - Source Document Viewer */}
        <div className="w-1/3 border-r border-mobius-gray-100 p-4 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-900">Source Document</h3>
            
            {selectedEntry ? (
              <Card className="border border-mobius-gray-100 bg-white">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-sm">
                        {mockJournalEntries.find(e => e.id === selectedEntry)?.sourceDoc}
                      </span>
                    </div>
                    
                    <div className="h-64 bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">PDF Viewer</p>
                        <p className="text-xs">Document preview here</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1 h-8 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        View Full
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-64 bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Select an entry to view</p>
                  <p className="text-xs">source document</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Summary & AI Insights */}
        <div className="w-1/3 p-4 space-y-4 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'summary' | 'ledger')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="ledger">Ledger View</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4 mt-4">
              {/* Entry Details */}
              {selectedEntry && (
                <Card className="border border-mobius-gray-100 bg-white">
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Entry Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(() => {
                      const entry = mockJournalEntries.find(e => e.id === selectedEntry);
                      if (!entry) return null;
                      
                      return (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Entry ID:</span>
                            <span className="font-medium">{entry.id}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">{entry.date}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-medium">{formatCurrency(entry.amount)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Status:</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getStatusColor(entry.status)}`}
                            >
                              {entry.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Confidence:</span>
                            <span className="font-medium">{entry.confidence}%</span>
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* AI Insights */}
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-3 flex items-center">
                  <Lightbulb className="h-4 w-4 text-gray-600 mr-2" />
                  AI Insights
                </h3>
                <div className="space-y-2">
                  {mockAIInsights.map((insight, index) => (
                    <Card key={index} className="border border-mobius-gray-100 bg-white">
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 mb-2">{insight.message}</p>
                            <Button size="sm" className="w-full h-7 text-xs">
                              {insight.action}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ledger" className="space-y-4 mt-4">
              {/* Traditional DR/CR View */}
              <Card className="border border-mobius-gray-100 bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Ledger View</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide pb-2 border-b">
                      <div>ACCOUNT</div>
                      <div className="text-right">DEBIT</div>
                      <div className="text-right">CREDIT</div>
                      <div className="text-right">BALANCE</div>
                    </div>
                    
                    {selectedEntry && (() => {
                      const entry = mockJournalEntries.find(e => e.id === selectedEntry);
                      if (!entry) return null;
                      
                      return (
                        <>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div className="font-medium">{accountName}</div>
                            <div className="text-right">—</div>
                            <div className="text-right font-medium">{formatCurrency(entry.amount)}</div>
                            <div className="text-right text-gray-400">—</div>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div className="font-medium">Cash/AR</div>
                            <div className="text-right font-medium">{formatCurrency(entry.amount)}</div>
                            <div className="text-right">—</div>
                            <div className="text-right text-gray-400">—</div>
                          </div>
                        </>
                      );
                    })()}
                    
                    <div className="grid grid-cols-4 gap-4 text-sm font-medium pt-2 border-t">
                      <div className="text-gray-600">Total</div>
                      <div className="text-right text-gray-400">—</div>
                      <div className="text-right text-gray-400">—</div>
                      <div className="text-right text-green-600">$0.00 ✓</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
