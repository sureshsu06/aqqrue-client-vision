import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  Download, 
  Settings,
  Calendar,
  Building,
  DollarSign,
  Eye,
  Mail,
  FileText,
  MoreHorizontal
} from "lucide-react";

// Mock bills data for AP aging
const mockBills = [
  {
    id: "1",
    vendor: "JCSS & Associates LLP",
    amount: 94400,
    date: "2025-05-26",
    description: "Professional Fees - May 2025",
    client: "Elire",
    status: "unread"
  },
  {
    id: "2",
    vendor: "JCSS & Associates LLP",
    amount: 70800,
    date: "2025-05-26",
    description: "Professional Fees - N-STP Condonation",
    client: "Elire",
    status: "review"
  },
  {
    id: "3",
    vendor: "NSDL Database Management Limited",
    amount: 11800,
    date: "2025-05-31",
    description: "Equity AMC",
    client: "Elire",
    status: "done"
  },
  {
    id: "4",
    vendor: "Sogo Computers",
    amount: 5310,
    date: "2025-05-22",
    description: "Freight Charges",
    client: "Elire",
    status: "review"
  },
  {
    id: "5",
    vendor: "Clayworks Spaces Pvt Ltd",
    amount: 102660,
    date: "2025-05-22",
    description: "Rent",
    client: "Elire",
    status: "unread"
  }
];

export default function APAging() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("All Clients");
  const [selectedCurrency, setSelectedCurrency] = useState("base");
  const [asOfDate, setAsOfDate] = useState("2025-01-31");

  // Mock data for AP aging buckets
  const getAgingBuckets = (vendor: string) => {
    const vendorBills = mockBills.filter(b => b.vendor === vendor);
    const current = vendorBills.filter(b => {
      const daysDiff = Math.floor((new Date().getTime() - new Date(b.date).getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 30;
    }).reduce((sum, b) => sum + b.amount, 0);
    
    const days30 = vendorBills.filter(b => {
      const daysDiff = Math.floor((new Date().getTime() - new Date(b.date).getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 30 && daysDiff <= 60;
    }).reduce((sum, b) => sum + b.amount, 0);
    
    const days60 = vendorBills.filter(b => {
      const daysDiff = Math.floor((new Date().getTime() - new Date(b.date).getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 60 && daysDiff <= 90;
    }).reduce((sum, b) => sum + b.amount, 0);
    
    const days90 = vendorBills.filter(b => {
      const daysDiff = Math.floor((new Date().getTime() - new Date(b.date).getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff > 90;
    }).reduce((sum, b) => sum + b.amount, 0);
    
    return { current, days30, days60, days90 };
  };

  // Get unique vendors
  const vendors = [...new Set(mockBills.map(b => b.vendor))];

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="border-b border-mobius-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">AP Aging</h1>
            <p className="text-sm text-gray-600 mt-1">Accounts Payable aging analysis</p>
          </div>
          
          {/* Header Controls */}
          <div className="flex items-center space-x-3">
            {/* As-of Date */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Entity */}
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-gray-500" />
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Clients">All Clients</option>
                <option value="Elire">Elire</option>
                <option value="Mahat">Mahat</option>
                <option value="TVS">TVS</option>
                <option value="Ripple">Ripple</option>
              </select>
            </div>

            {/* Currency */}
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="base">Base (INR)</option>
                <option value="txn">Transaction</option>
              </select>
            </div>

            {/* Progress Chip */}
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Vendors with &gt;90d: {vendors.filter(v => {
                const aging = getAgingBuckets(v);
                return aging.days90 > 0;
              }).length}
            </Badge>

            {/* Export */}
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="border-b border-mobius-gray-200 bg-white px-6 py-3">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input 
              placeholder="Search vendor name, GSTIN, PAN, invoice #..." 
              className="pl-10 w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Chips */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="cursor-pointer">Open</Badge>
            <Badge variant="outline" className="cursor-pointer">Partial</Badge>
            <Badge variant="outline" className="cursor-pointer">On-hold</Badge>
            <Badge variant="outline" className="cursor-pointer">Disputed</Badge>
          </div>

          {/* Bucket Preset */}
          <select className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Current | 1–30 | 31–60 | 61–90 | &gt;90</option>
          </select>
        </div>
      </div>

      {/* Table Placeholder */}
      <div className="flex-1 p-6 overflow-auto">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">AP Aging Table</h3>
          <p className="text-gray-600">Table implementation coming in next step...</p>
        </Card>
      </div>
    </div>
  );
} 