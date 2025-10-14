import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit3,
  UserCheck,
  ArrowRight,
  MoreVertical,
  FileText,
  Download,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Transaction } from "@/types/Transaction";
import { 
  Panel, 
  PanelGroup, 
  PanelResizeHandle 
} from "react-resizable-panels";
import { usePanelSizes } from "@/hooks/use-panel-sizes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PaymentsInboxProps {
  onTransactionSelect: (transaction: Transaction) => void;
}

const mockPayments: Transaction[] = [
  {
    id: "33",
    vendor: "Clayworks Spaces Pvt Ltd",
    amount: -6156,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-07",
    description: "RTGS/NEFT Transfer to Clayworks Spaces Pvt Ltd",
    client: "Elire",
    confidence: 95,
    pdfFile: "payments/payment_clayworks_inv_5016.pdf",
    documentUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=1000&fit=crop",
    invoiceNumber: "INV-5016",
    bankId: "TXN-20250407-001",
    transactionType: "Invoice Payment",
    matchSource: "Vendor Name + Amount (exact)"
  },
  {
    id: "34",
    vendor: "Clayworks Spaces Pvt Ltd",
    amount: -93960,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-07",
    description: "RTGS/NEFT Transfer to Clayworks Spaces Pvt Ltd",
    client: "Elire",
    confidence: 95,
    pdfFile: "payments/payment_clayworks_inv_0078.pdf",
    documentUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=1000&fit=crop",
    invoiceNumber: "INV-25-26-0078",
    bankId: "TXN-20250407-002",
    transactionType: "Invoice Payment",
    matchSource: "Vendor Name + Amount (exact)"
  },
  {
    id: "35",
    vendor: "EPFO",
    amount: -177278,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-27",
    description: "EPFO Contribution - Employee Provident Fund",
    client: "Elire",
    confidence: 95,
    pdfFile: "payments/payment_epfo_contribution.pdf",
    documentUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1000&fit=crop",
    invoiceNumber: "EPFO-APR-2025",
    bankId: "TXN-20250427-001",
    transactionType: "Payroll Payment",
    matchSource: "Vendor pattern + Recurring amount"
  },
  {
    id: "36",
    vendor: "CBDT",
    amount: -9765,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-07",
    description: "TDS Payment - Tax Deducted at Source",
    client: "Elire",
    confidence: 98,
    pdfFile: "payments/payment_cbdt_tds_rent.pdf",
    documentUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=1000&fit=crop",
    invoiceNumber: "CBDT-RENT-APR-2025",
    bankId: "TXN-20250407-003",
    transactionType: "Tax Payment",
    matchSource: "Vendor + Tax pattern"
  },
  {
    id: "37",
    vendor: "CBDT",
    amount: -10500,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-10",
    description: "TDS Payment - Professional Charges",
    client: "Elire",
    confidence: 98,
    pdfFile: "payments/payment_cbdt_tds_professional.pdf",
    documentUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=1000&fit=crop",
    invoiceNumber: "CBDT-PROF-APR-2025",
    bankId: "TXN-20250410-001",
    transactionType: "Tax Payment",
    matchSource: "Vendor + Tax pattern"
  },
  {
    id: "38",
    vendor: "CBDT",
    amount: -152160,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-17",
    description: "TDS Payment - Salary",
    client: "Elire",
    confidence: 98,
    pdfFile: "payments/payment_cbdt_tds_salary.pdf",
    documentUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=1000&fit=crop",
    invoiceNumber: "CBDT-SALARY-APR-2025",
    bankId: "TXN-20250417-001",
    transactionType: "Tax Payment",
    matchSource: "Vendor + Tax pattern"
  },
  {
    id: "42",
    vendor: "BHARAT R",
    amount: -386799,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-27",
    description: "Salary Transfer - Employee Payment",
    client: "Elire",
    confidence: 97,
    pdfFile: "payments/payment_salary_bharat.pdf",
    documentUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=1000&fit=crop",
    invoiceNumber: "SALARY-BHARAT-APR-2025",
    bankId: "TXN-20250427-002",
    transactionType: "Payroll Payment",
    matchSource: "Employee pattern + Salary amount"
  },
  {
    id: "43",
    vendor: "AMIT KUMAR MISHRA",
    amount: -253950,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-30",
    description: "RTGS Transfer to AMIT KUMAR MISHRA",
    client: "Elire",
    confidence: 97,
    pdfFile: "payments/payment_rtgs_amit.pdf",
    documentUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=1000&fit=crop",
    invoiceNumber: "RTGS-AMIT-APR-2025",
    bankId: "TXN-20250430-002",
    transactionType: "Vendor Advance",
    matchSource: "Vendor name + Amount pattern"
  },
  {
    id: "44",
    vendor: "DEVASANKAR SATHANI",
    amount: -219422,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-30",
    description: "RTGS Transfer to DEVASANKAR SATHANI",
    client: "Elire",
    confidence: 97,
    pdfFile: "payments/payment_rtgs_devasankar.pdf",
    documentUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1000&fit=crop",
    invoiceNumber: "RTGS-DEVASANKAR-APR-2025",
    bankId: "TXN-20250430-003",
    transactionType: "Vendor Advance",
    matchSource: "Vendor name + Amount pattern"
  },
  {
    id: "45",
    vendor: "Bank Charges",
    amount: -2500,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-05-01",
    description: "Bank Service Charges - Monthly Fee",
    client: "Elire",
    confidence: 100,
    pdfFile: "payments/payment_bank_charges.pdf",
    documentUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=1000&fit=crop",
    invoiceNumber: "BANK-CHARGES-MAY-2025",
    bankId: "TXN-20250501-001",
    transactionType: "Other",
    matchSource: "Bank charges pattern"
  },
  {
    id: "46",
    vendor: "Insurance Premium",
    amount: -15000,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-05-03",
    description: "Insurance Premium - Office Equipment",
    client: "Elire",
    confidence: 88,
    pdfFile: "payments/payment_insurance_premium.pdf",
    documentUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=1000&fit=crop",
    invoiceNumber: "INS-MAY-2025",
    bankId: "TXN-20250503-001",
    transactionType: "Other",
    matchSource: "Insurance pattern + Recurring amount"
  },
  {
    id: "47",
    vendor: "Miscellaneous Expense",
    amount: -8500,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "review",
    date: "2025-05-05",
    description: "Miscellaneous Payment - Unknown Purpose",
    client: "Elire",
    confidence: 65,
    pdfFile: "payments/payment_misc_expense.pdf",
    documentUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=1000&fit=crop",
    invoiceNumber: "MISC-MAY-2025",
    bankId: "TXN-20250505-001",
    transactionType: "Other",
    matchSource: "No clear pattern detected"
  },
  {
    id: "48",
    vendor: "Legal Fees",
    amount: -45000,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-05-08",
    description: "Legal Consultation Fees - Contract Review",
    client: "Elire",
    confidence: 92,
    pdfFile: "payments/payment_legal_fees.pdf",
    documentUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=1000&fit=crop",
    invoiceNumber: "LEGAL-MAY-2025",
    bankId: "TXN-20250508-001",
    transactionType: "Other",
    matchSource: "Legal services pattern"
  }
];

const vendorOptions = [
  "CLAYWORKS SPACES T PVT LTD",
  "EPFO",
  "CBDT", 
  "BHARAT R",
  "AMIT KUMAR MISHRA",
  "DEVASANKAR SATHANI",
  "Bank Charges",
  "Insurance Premium",
  "Miscellaneous Expense",
  "Legal Fees",
  "SALARY ACCOUNT",
  "TAX ACCOUNT",
  "UTILITY PROVIDER",
  "SUPPLIER"
];

export function PaymentsInbox({ onTransactionSelect }: PaymentsInboxProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [vendorAssignments, setVendorAssignments] = useState<{[key: string]: string}>({});
  const [collapsedGroups, setCollapsedGroups] = useState<{[key: string]: boolean}>({});
  const [isMatchedJECollapsed, setIsMatchedJECollapsed] = useState(true);
  const [selectedMatches, setSelectedMatches] = useState<{[key: string]: string}>({});
  const { sizes, updateSizes } = usePanelSizes();

  // Auto-select first transaction when component mounts
  useEffect(() => {
    if (mockPayments.length > 0 && !selectedTransaction) {
      setSelectedTransaction(mockPayments[0]);
    }
  }, [selectedTransaction]);

  const handleTransactionSelect = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleTransactionToggle = (transactionId: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, transactionId]);
    } else {
      setSelectedTransactions(selectedTransactions.filter(id => id !== transactionId));
    }
  };

  const handleVendorChange = (transactionId: string, vendor: string) => {
    setVendorAssignments(prev => ({
      ...prev,
      [transactionId]: vendor
    }));
  };

  const handleMatchChange = (transactionId: string, matchId: string) => {
    setSelectedMatches(prev => ({
      ...prev,
      [transactionId]: matchId
    }));
  };

  const getSelectedMatch = (transaction: Transaction) => {
    const selectedMatchId = selectedMatches[transaction.id];
    if (selectedMatchId) {
      const unmatchedInvoices = getUnmatchedInvoices(transaction.vendor);
      return unmatchedInvoices.find(inv => inv.id === selectedMatchId) || unmatchedInvoices[0];
    }
    return getUnmatchedInvoices(transaction.vendor)[0];
  };

  const toggleGroupCollapse = (groupType: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupType]: !prev[groupType]
    }));
  };

  const getAssignedVendor = (transaction: Transaction) => {
    return vendorAssignments[transaction.id] || transaction.vendor;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done": 
        return (
          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-green-100 border border-green-200">
            <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
          </div>
        );
      case "review": 
        return (
          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-yellow-100 border border-yellow-200">
            <Clock className="w-2.5 h-2.5 text-yellow-600" />
          </div>
        );
      default: 
        return (
          <div className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 border border-gray-200">
            <Clock className="w-2.5 h-2.5 text-gray-600" />
          </div>
        );
    }
  };

  const getSuggestedMatch = (transaction: Transaction) => {
    const transactionType = (transaction as any).transactionType;
    
    if (transactionType === "Invoice Payment" && transaction.invoiceNumber) {
      return `Invoice #${transaction.invoiceNumber}`;
    }
    
    if (transactionType === "Tax Payment") {
      // Determine specific tax type based on description
      const description = transaction.description.toLowerCase();
      if (description.includes('tds')) {
        return "TDS Payable JE";
      } else if (description.includes('gst') || description.includes('cgst') || description.includes('sgst')) {
        return "GST Payable JE";
      } else {
        return "Tax Payable JE";
      }
    }
    
    if (transactionType === "Payroll Payment") {
      return "Accrued Payroll JE";
    }
    
    if (transactionType === "Vendor Advance") {
      return "Vendor Advance";
    }
    
    if (transactionType === "Other") {
      return "No match found — Suggest Category";
    }
    
    return "No match found — Suggest Category";
  };

  const getUnmatchedInvoices = (vendor: string) => {
    // Get all unmatched invoices from the same vendor
    const unmatchedInvoices = [
      {
        id: "INV-5016",
        amount: 6156,
        date: "2025-04-01",
        description: "Rent - April 2025",
        vendor: vendor
      },
      {
        id: "INV-25-26-0078", 
        amount: 93960,
        date: "2025-04-05",
        description: "Rent - April 2025",
        vendor: vendor
      },
      {
        id: "INV-25260258",
        amount: 102660,
        date: "2025-05-22",
        description: "Rent - May 2025",
        vendor: vendor
      },
      {
        id: "INV-25260376",
        amount: 5251,
        date: "2025-05-08",
        description: "Parking Charges - April 2025",
        vendor: vendor
      }
    ];
    
    return unmatchedInvoices;
  };

  const getMatchedJournalEntry = (transaction: Transaction) => {
    const transactionType = (transaction as any).transactionType;
    const amount = Math.abs(transaction.amount);
    const vendor = transaction.vendor.toLowerCase();
    const description = transaction.description.toLowerCase();
    
    // Match based on vendor and description from actual expense transactions
    if (vendor.includes('clayworks') || description.includes('rent')) {
      // Clayworks Spaces - Rent payment
      const baseAmount = amount * 0.9; // 90% base rent
      const taxAmount = amount * 0.1; // 10% tax
      const cgst = taxAmount / 2;
      const sgst = taxAmount / 2;
      
      return [
        { account: "Rent Expense (1020)", debit: baseAmount, credit: 0 },
        { account: "Input CGST (1015)", debit: cgst, credit: 0 },
        { account: "Input SGST (1016)", debit: sgst, credit: 0 },
        { account: "TDS on Rent (1018)", debit: 0, credit: baseAmount * 0.1 },
        { account: `${transaction.vendor} (2001)`, debit: 0, credit: amount - (baseAmount * 0.1) }
      ];
    }
    
    if (vendor.includes('jcss') || description.includes('professional')) {
      // JCSS & Associates - Professional fees
      const baseAmount = amount * 0.9;
      const taxAmount = amount * 0.1;
      const cgst = taxAmount / 2;
      const sgst = taxAmount / 2;
      
      return [
        { account: "Professional Fees (1010)", debit: baseAmount, credit: 0 },
        { account: "Input CGST (1015)", debit: cgst, credit: 0 },
        { account: "Input SGST (1016)", debit: sgst, credit: 0 },
        { account: "TDS on Professional Charges (1018)", debit: 0, credit: baseAmount * 0.1 },
        { account: `${transaction.vendor} (2001)`, debit: 0, credit: amount - (baseAmount * 0.1) }
      ];
    }
    
    if (vendor.includes('sogo') || description.includes('freight') || description.includes('laptop')) {
      // Sogo Computers - Freight/Equipment
      if (description.includes('laptop') || description.includes('monitor')) {
        // Fixed asset purchase
        return [
          { account: "Computer Equipment (1500)", debit: amount * 0.9, credit: 0 },
          { account: "Input CGST (1015)", debit: amount * 0.05, credit: 0 },
          { account: "Input SGST (1016)", debit: amount * 0.05, credit: 0 },
          { account: `${transaction.vendor} (2001)`, debit: 0, credit: amount }
        ];
      } else {
        // Freight charges
        return [
          { account: "Freight & Shipping (1030)", debit: amount, credit: 0 },
          { account: `${transaction.vendor} (2001)`, debit: 0, credit: amount }
        ];
      }
    }
    
    if (vendor.includes('nsdl') || description.includes('amc')) {
      // NSDL - Equity AMC
      return [
        { account: "Investment Management Fees (1040)", debit: amount, credit: 0 },
        { account: `${transaction.vendor} (2001)`, debit: 0, credit: amount }
      ];
    }
    
    if (vendor.includes('mgecoduties') || description.includes('office supplies')) {
      // Office supplies
      return [
        { account: "Office Supplies (1035)", debit: amount, credit: 0 },
        { account: `${transaction.vendor} (2001)`, debit: 0, credit: amount }
      ];
    }
    
    if (transactionType === "Tax Payment") {
      const description = transaction.description.toLowerCase();
      if (description.includes('tds')) {
        return [
          { account: "TDS Payable (2010)", debit: amount, credit: 0 },
          { account: "Bank (1001)", debit: 0, credit: amount }
        ];
      } else if (description.includes('gst') || description.includes('cgst') || description.includes('sgst')) {
        return [
          { account: "GST Payable (2015)", debit: amount, credit: 0 },
          { account: "Bank (1001)", debit: 0, credit: amount }
        ];
      } else {
        return [
          { account: "Tax Payable (2020)", debit: amount, credit: 0 },
          { account: "Bank (1001)", debit: 0, credit: amount }
        ];
      }
    }
    
    if (transactionType === "Payroll Payment") {
      return [
        { account: "Accrued Payroll (2030)", debit: amount, credit: 0 },
        { account: "Bank (1001)", debit: 0, credit: amount }
      ];
    }
    
    if (transactionType === "Vendor Advance") {
      return [
        { account: "Vendor Advances (1020)", debit: amount, credit: 0 },
        { account: "Bank (1001)", debit: 0, credit: amount }
      ];
    }
    
    if (vendor.includes('epfo') || description.includes('epfo')) {
      // EPFO contribution
      return [
        { account: "EPF Contribution (1050)", debit: amount, credit: 0 },
        { account: "Bank (1001)", debit: 0, credit: amount }
      ];
    }
    
    if (vendor.includes('bharat') || vendor.includes('amit') || vendor.includes('devasankar') || description.includes('salary')) {
      // Salary payments
      return [
        { account: "Accrued Payroll (2030)", debit: amount, credit: 0 },
        { account: "Bank (1001)", debit: 0, credit: amount }
      ];
    }
    
    if (vendor.includes('legal') || description.includes('legal')) {
      // Legal fees
      return [
        { account: "Legal & Professional Fees (1060)", debit: amount, credit: 0 },
        { account: `${transaction.vendor} (2001)`, debit: 0, credit: amount }
      ];
    }
    
    if (vendor.includes('insurance') || description.includes('insurance')) {
      // Insurance premium
      return [
        { account: "Insurance Premium (1070)", debit: amount, credit: 0 },
        { account: `${transaction.vendor} (2001)`, debit: 0, credit: amount }
      ];
    }
    
    if (vendor.includes('bank') || description.includes('bank charges')) {
      // Bank charges
      return [
        { account: "Bank Charges (1080)", debit: amount, credit: 0 },
        { account: "Bank (1001)", debit: 0, credit: amount }
      ];
    }
    
    // Default fallback for other expenses
    return [
      { account: "Miscellaneous Expenses (1090)", debit: amount, credit: 0 },
      { account: `${transaction.vendor} (2001)`, debit: 0, credit: amount }
    ];
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return "bg-green-100 text-green-800";
    if (confidence >= 85) return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  const getRowStatusColor = (transaction: Transaction) => {
    const confidence = transaction.confidence || 95;
    if (confidence >= 95) return "border-l-green-500";
    if (confidence >= 85) return "border-l-yellow-500";
    return "border-l-red-500";
  };

  const groupTransactionsByType = (transactions: Transaction[]) => {
    const groups = {
      "Invoice Payment": transactions.filter(t => (t as any).transactionType === "Invoice Payment"),
      "Tax Payment": transactions.filter(t => (t as any).transactionType === "Tax Payment"),
      "Payroll Payment": transactions.filter(t => (t as any).transactionType === "Payroll Payment"),
      "Vendor Advance": transactions.filter(t => (t as any).transactionType === "Vendor Advance"),
      "Other": transactions.filter(t => (t as any).transactionType === "Other"),
    };
    return groups;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Review Summary Panel */}
      <div className="bg-mobius-gray-50 border-b border-mobius-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-mobius-gray-900">Today's Bank Feed (Apr 2025)</h3>
            <p className="text-xs text-mobius-gray-600">38 transactions • 27 matched automatically (≥90%) • 8 need review • 3 unlinked</p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-mobius-gray-600">Matched & Balanced</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-mobius-gray-600">Needs Review</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-mobius-gray-600">Unlinked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Panel Layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <PanelGroup 
          direction="horizontal" 
          className="h-full"
          onLayout={(panelSizes) => {
            if (panelSizes.length >= 2) {
              updateSizes({
                ...sizes,
                inbox: panelSizes[0],
                document: panelSizes[1],
              });
            }
          }}
        >
          {/* Left Panel - Payments List */}
          <Panel defaultSize={66} minSize={60} maxSize={75} className="min-h-0">
            <div className="h-full flex flex-col border-r border-mobius-gray-100">
              {/* Table Header */}
              <div className="px-4 py-2 bg-mobius-gray-50 border-b border-mobius-gray-200 flex-shrink-0">
                <div className="grid grid-cols-7 gap-4 text-xs font-medium text-mobius-gray-600 items-center" style={{gridTemplateColumns: '2fr 2fr 1.5fr 1fr 2fr 1fr 1fr'}}>
                  <div className="flex items-center">
                    <span>Transaction Reference</span>
                  </div>
                  <div className="flex items-center">Narration</div>
                  <div className="flex items-center pl-2">Vendor</div>
                  <div className="flex items-center justify-end">Amount</div>
                  <div className="flex items-center pr-2">Suggested Match</div>
                  <div className="flex items-center justify-center">Confidence</div>
                  <div className="flex items-center">Action</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-mobius-gray-100">
                  {(() => {
                    const groupedTransactions = groupTransactionsByType(mockPayments);
                    return Object.entries(groupedTransactions).map(([groupType, transactions]) => 
                      transactions.length > 0 && (
                        <React.Fragment key={groupType}>
                          {/* Group Header */}
                          <div 
                            className="px-4 py-2 bg-mobius-gray-25 border-b border-mobius-gray-100 cursor-pointer hover:bg-mobius-gray-50 transition-colors"
                            onClick={() => toggleGroupCollapse(groupType)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {collapsedGroups[groupType] ? (
                                  <ChevronRight className="w-4 h-4 text-mobius-gray-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-mobius-gray-500" />
                                )}
                                <h4 className="text-xs font-semibold text-mobius-gray-700 uppercase tracking-wide">
                                  {groupType}
                                </h4>
                              </div>
                              <span className="text-xs text-mobius-gray-500">
                                {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                          {/* Group Transactions */}
                          {!collapsedGroups[groupType] && transactions.map((transaction) => (
                            <div
                              key={transaction.id}
                              className={cn(
                                "group px-4 py-1.5 transition-colors cursor-pointer border-l-4 relative hover:bg-mobius-gray-50",
                                selectedTransaction?.id === transaction.id 
                                  ? "bg-mobius-blue/10 border-l-mobius-blue" 
                                  : getRowStatusColor(transaction)
                              )}
                              onClick={() => handleTransactionSelect(transaction)}
                            >
                              <div className="grid grid-cols-7 gap-4 items-center" style={{gridTemplateColumns: '2fr 2fr 1.5fr 1fr 2fr 1fr 1fr'}}>
                                {/* Transaction Reference */}
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    checked={selectedTransactions.includes(transaction.id)}
                                    onCheckedChange={(checked) => handleTransactionToggle(transaction.id, !!checked)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-medium text-mobius-gray-900 truncate">
                                      {transaction.bankId || transaction.id}
                                    </div>
                                    <div className="text-xs text-mobius-gray-500">
                                      {new Date(transaction.date).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>

                                {/* Narration */}
                                <div className="min-w-0">
                                  <div className="text-xs text-mobius-gray-900 truncate">
                                    {transaction.description}
                                  </div>
                                  {(transaction as any).transactionType && (
                                    <div className="mt-1">
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-mobius-gray-100 text-mobius-gray-700">
                                        {(transaction as any).transactionType}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Vendor */}
                                <div className="min-w-0">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 px-2 text-xs justify-start text-left font-normal w-full"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <span className="truncate max-w-[80px] text-xs">{getAssignedVendor(transaction)}</span>
                                        <ChevronDown className="w-3 h-3 ml-1 flex-shrink-0" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-48">
                                      {vendorOptions.map((vendor) => (
                                        <DropdownMenuItem 
                                          key={vendor}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleVendorChange(transaction.id, vendor);
                                          }}
                                          className={`text-xs ${getAssignedVendor(transaction) === vendor ? "bg-mobius-gray-100" : ""}`}
                                        >
                                          {vendor}
                                        </DropdownMenuItem>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                {/* Amount */}
                                <div className="text-right">
                                  <div className="text-xs font-semibold text-mobius-gray-900">
                                    {transaction.currency === 'USD' ? '$' : '₹'}{Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </div>
                                </div>

                                {/* Suggested Match */}
                                <div className="min-w-0">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 px-2 text-xs justify-start text-left font-normal w-full"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <span className="truncate max-w-[120px] text-mobius-blue-600">
                                          {(() => {
                                            const selectedMatch = getSelectedMatch(transaction);
                                            return selectedMatch ? `Invoice #${selectedMatch.id}` : 'Select Match';
                                          })()}
                                        </span>
                                        <ChevronDown className="w-3 h-3 ml-1 flex-shrink-0" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-56">
                                      <div className="px-2 py-1.5 text-xs font-medium text-mobius-gray-600 border-b border-mobius-gray-200">
                                        {transaction.vendor}
                                      </div>
                                      {getUnmatchedInvoices(transaction.vendor).map((invoice) => (
                                        <DropdownMenuItem 
                                          key={invoice.id}
                                          className="px-2 py-1.5 text-xs"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleMatchChange(transaction.id, invoice.id);
                                          }}
                                        >
                                          <div className="flex justify-between w-full items-center">
                                            <span className="font-medium text-mobius-gray-900 truncate">
                                              {invoice.id}
                                            </span>
                                            <span className="text-mobius-blue-600 font-medium ml-2">
                                              {transaction.currency === 'USD' ? '$' : '₹'}{invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                            </span>
                                          </div>
                                        </DropdownMenuItem>
                                      ))}
                                      <div className="px-2 py-1.5 border-t border-mobius-gray-200">
                                        <DropdownMenuItem 
                                          className="px-0 py-1.5 text-xs"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleMatchChange(transaction.id, 'no-match');
                                          }}
                                        >
                                          <span className="text-mobius-gray-500">No Match</span>
                                        </DropdownMenuItem>
                                      </div>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                {/* Confidence */}
                                <div className="text-center">
                                  <Badge 
                                    variant="outline" 
                                    className={cn("text-xs", getConfidenceColor(transaction.confidence || 95))}
                                  >
                                    {transaction.confidence || 95}%
                                  </Badge>
                                </div>

                                {/* Action */}
                                <div className="text-center">
                                  <div className="flex items-center justify-center space-x-1">
                                    {getStatusIcon(transaction.status)}
                                    <span className="text-xs text-mobius-gray-500">Approve</span>
                                    <ArrowRight className="w-3 h-3 text-mobius-gray-400" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </React.Fragment>
                      )
                    );
                  })()}
                </div>
              </div>
            </div>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-1 bg-mobius-gray-100 hover:bg-mobius-gray-200 transition-colors group">
            <div className="flex items-center justify-center h-full">
              <div className="w-1 h-8 bg-mobius-gray-300 group-hover:bg-mobius-gray-400 rounded-full"></div>
            </div>
          </PanelResizeHandle>

          {/* Right Panel - Transaction Details */}
          <Panel defaultSize={34} minSize={25} maxSize={40} className="min-h-0">
            <div className="h-full flex flex-col overflow-y-auto">
              {selectedTransaction ? (
                <>
                  {/* Transaction Summary Header */}
                  <div className="p-5 border-b border-mobius-gray-100 flex-shrink-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-mobius-gray-900">
                          {selectedTransaction.vendor}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-mobius-gray-500 bg-mobius-gray-100 px-2 py-1 rounded">
                            {(selectedTransaction as any).transactionType || 'Payment'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="font-semibold text-mobius-gray-900">
                          {selectedTransaction.currency === 'USD' ? '$' : '₹'}{Math.abs(selectedTransaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-mobius-gray-500">•</span>
                        <span className="text-mobius-gray-600">{new Date(selectedTransaction.date).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="border-t border-mobius-gray-200 pt-3">
                        <div className="flex items-center space-x-2 text-xs">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          <span className="text-mobius-gray-900">Suggested Match: {getSuggestedMatch(selectedTransaction)}</span>
                          <span className="text-mobius-gray-500">•</span>
                          <span className="text-mobius-gray-600">Confidence {selectedTransaction.confidence || 95}%</span>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        </div>
                        {(selectedTransaction as any).matchSource && (
                          <div className="text-mobius-gray-500 text-xs mt-1">
                            Matched using: {(selectedTransaction as any).matchSource}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Journal Entry Section */}
                  <div className="p-5">
                    <div className="space-y-4">
                      {/* Payment Journal Entry */}
                      <div>
                        <h4 className="text-xs font-medium text-mobius-gray-700 mb-2">Payment Journal Entry</h4>
                        <div className="border border-mobius-gray-200 rounded overflow-hidden">
                          <div className="bg-mobius-gray-50 px-3 py-1.5 border-b border-mobius-gray-200">
                            <div className="grid grid-cols-3 gap-4 text-xs font-medium text-mobius-gray-600">
                              <div>Account</div>
                              <div className="text-right">Debit</div>
                              <div className="text-right">Credit</div>
                            </div>
                          </div>
                          <div className="divide-y divide-mobius-gray-200">
                            <div className="px-3 py-2">
                              <div className="grid grid-cols-3 gap-4 items-center">
                                <div className="text-xs font-medium text-mobius-gray-900">
                                  {getAssignedVendor(selectedTransaction)} (2001)
                                </div>
                                <div className="text-xs font-medium text-green-600 text-right">
                                  {selectedTransaction.currency === 'USD' ? '$' : '₹'}{Math.abs(selectedTransaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className="text-xs text-mobius-gray-500 text-right">—</div>
                              </div>
                            </div>
                            <div className="px-3 py-2">
                              <div className="grid grid-cols-3 gap-4 items-center">
                                <div className="text-xs font-medium text-mobius-gray-900">
                                  Bank (1001)
                                </div>
                                <div className="text-xs text-mobius-gray-500 text-right">—</div>
                                <div className="text-xs font-medium text-red-600 text-right">
                                  {selectedTransaction.currency === 'USD' ? '$' : '₹'}{Math.abs(selectedTransaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                              </div>
                            </div>
                            <div className="px-3 py-2 bg-mobius-gray-50 font-semibold">
                              <div className="grid grid-cols-3 gap-4 items-center">
                                <div className="text-xs text-mobius-gray-900">Totals</div>
                                <div className="text-xs font-bold text-green-600 text-right">
                                  {selectedTransaction.currency === 'USD' ? '$' : '₹'}{Math.abs(selectedTransaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className="text-xs font-bold text-red-600 text-right">
                                  {selectedTransaction.currency === 'USD' ? '$' : '₹'}{Math.abs(selectedTransaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Matched to TDS Payable (Collapsible) */}
                      <div>
                        <div 
                          className="flex items-center space-x-2 mb-2 cursor-pointer hover:bg-mobius-gray-50 py-1 rounded"
                          onClick={() => setIsMatchedJECollapsed(!isMatchedJECollapsed)}
                        >
                          {isMatchedJECollapsed ? (
                            <ChevronRight className="w-3 h-3 text-mobius-gray-500" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-mobius-gray-500" />
                          )}
                          <h4 className="text-xs font-medium text-mobius-gray-700">Matched to TDS Payable</h4>
                          <span className="text-xs text-mobius-gray-500 bg-mobius-gray-100 px-1.5 py-0.5 rounded">Collapsed</span>
                        </div>
                        {!isMatchedJECollapsed && (
                          <div className="border border-mobius-gray-200 rounded overflow-hidden">
                            <div className="bg-mobius-gray-50 px-3 py-1.5 border-b border-mobius-gray-200">
                              <div className="grid grid-cols-3 gap-4 text-xs font-medium text-mobius-gray-600">
                                <div>TDS Section</div>
                                <div className="text-right">Amount</div>
                                <div className="text-right">Rate</div>
                              </div>
                            </div>
                            <div className="divide-y divide-mobius-gray-200">
                              {(() => {
                                const totalAmount = Math.abs(selectedTransaction.amount);
                                const salaryTDS = Math.round(totalAmount * 0.85); // 85% for salary
                                const professionalTDS = Math.round(totalAmount * 0.10); // 10% for professional
                                const rentTDS = Math.round(totalAmount * 0.05); // 5% for rent
                                
                                return (
                                  <>
                                    <div className="px-3 py-2">
                                      <div className="grid grid-cols-3 gap-4 items-center">
                                        <div className="text-xs font-medium text-mobius-gray-900">
                                          TDS on Salary (194A)
                                        </div>
                                        <div className="text-xs font-medium text-mobius-gray-900 text-right">
                                          {selectedTransaction.currency === 'USD' ? '$' : '₹'}{salaryTDS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                        <div className="text-xs text-mobius-gray-600 text-right">10%</div>
                                      </div>
                                    </div>
                                    <div className="px-3 py-2">
                                      <div className="grid grid-cols-3 gap-4 items-center">
                                        <div className="text-xs font-medium text-mobius-gray-900">
                                          TDS on Professional Charges (194J)
                                        </div>
                                        <div className="text-xs font-medium text-mobius-gray-900 text-right">
                                          {selectedTransaction.currency === 'USD' ? '$' : '₹'}{professionalTDS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                        <div className="text-xs text-mobius-gray-600 text-right">10%</div>
                                      </div>
                                    </div>
                                    <div className="px-3 py-2">
                                      <div className="grid grid-cols-3 gap-4 items-center">
                                        <div className="text-xs font-medium text-mobius-gray-900">
                                          TDS on Rent (194I)
                                        </div>
                                        <div className="text-xs font-medium text-mobius-gray-900 text-right">
                                          {selectedTransaction.currency === 'USD' ? '$' : '₹'}{rentTDS.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                        <div className="text-xs text-mobius-gray-600 text-right">10%</div>
                                      </div>
                                    </div>
                                    <div className="px-3 py-2 bg-mobius-gray-50 font-semibold">
                                      <div className="grid grid-cols-3 gap-4 items-center">
                                        <div className="text-xs text-mobius-gray-900">Total TDS Payable</div>
                                        <div className="text-xs font-bold text-mobius-gray-900 text-right">
                                          {selectedTransaction.currency === 'USD' ? '$' : '₹'}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                        <div className="text-xs text-mobius-gray-600 text-right">—</div>
                                      </div>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="px-5 pb-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <svg className="w-3 h-3 text-mobius-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h5 className="text-xs font-medium text-mobius-gray-900">
                          <span className="text-mobius-blue-600">Match</span> Info
                        </h5>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-mobius-gray-600">Vendor:</span>
                          <span className="font-medium text-mobius-gray-900">{selectedTransaction.vendor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-mobius-gray-600">Method:</span>
                          <span className="font-medium text-mobius-gray-900">
                            <span className="text-mobius-blue-600">{(selectedTransaction as any).matchSource || 'Pattern matching'}</span>
                          </span>
                        </div>
                        {(selectedTransaction as any).invoiceNumber && (
                          <div className="flex justify-between">
                            <span className="text-mobius-gray-600">Invoice:</span>
                            <span className="font-medium text-pink-600">{(selectedTransaction as any).invoiceNumber}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-mobius-gray-600">Date proximity:</span>
                          <span className="font-medium text-mobius-gray-900">
                            <span className="text-mobius-blue-600">Same day</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="p-5 border-t border-mobius-gray-100 flex-shrink-0">
                    <div className="space-y-4">
                      {/* Journal Entry Approval */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-xs text-mobius-gray-600">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          <span>Journal Entry looks correct?</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button className="bg-mobius-blue hover:bg-mobius-blue/90 text-white px-4 text-xs">
                            Approve JE
                          </Button>
                          <Button variant="outline" className="border-mobius-gray-300 px-4 text-xs">
                            Edit JE
                          </Button>
                        </div>
                      </div>

                      {/* Match Approval */}
                      <div className="space-y-3 border-t border-mobius-gray-200 pt-4">
                        <div className="flex items-center space-x-2 text-xs text-mobius-gray-600">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          <span>Match looks correct?</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button className="bg-green-600 hover:bg-green-700 text-white px-4 text-xs">
                            Approve Match
                          </Button>
                          <Button variant="outline" className="border-mobius-gray-300 px-4 text-xs">
                            Change Match
                          </Button>
                        </div>
                      </div>

                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-mobius-gray-50">
                  <div className="text-center text-mobius-gray-500">
                    <FileText className="w-10 h-10 mx-auto mb-3 text-mobius-gray-400" />
                    <h3 className="text-sm font-medium mb-1">No payment selected</h3>
                    <p className="text-xs">Select a payment from the list to view details</p>
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

