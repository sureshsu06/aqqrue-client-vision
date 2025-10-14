import { Transaction } from "@/types/Transaction";

export const getUnmatchedInvoices = (vendor: string) => {
  // Get all unmatched invoices from the same vendor based on actual expense transactions
  const allExpenseInvoices = [
    {
      id: "ASO-I_109_25-26Sign_Elire Global",
      amount: 94400,
      date: "2025-05-26",
      description: "Professional Fees - May 2025",
      vendor: "JCSS & Associates LLP"
    },
    {
      id: "ASO-I_117_25-26_Elire Global",
      amount: 70800,
      date: "2025-05-26",
      description: "Professional Fees - N-STP Condonation",
      vendor: "JCSS & Associates LLP"
    },
    {
      id: "EGS001",
      amount: 11800,
      date: "2025-05-31",
      description: "Equity AMC",
      vendor: "NSDL Database Management Limited"
    },
    {
      id: "Hys-1117",
      amount: 5310,
      date: "2025-05-22",
      description: "Freight Charges",
      vendor: "Sogo Computers"
    },
    {
      id: "Hys-1121",
      amount: 5310,
      date: "2025-05-22",
      description: "Freight Charges",
      vendor: "Sogo Computers"
    },
    {
      id: "INV-25260258",
      amount: 93960,
      date: "2025-05-22",
      description: "Rent",
      vendor: "Clayworks Spaces Pvt Ltd"
    },
    {
      id: "INV-25260376",
      amount: 4806,
      date: "2025-05-08",
      description: "Parking Charges-April 2025",
      vendor: "Clayworks Spaces Pvt Ltd"
    },
    {
      id: "PCD-143",
      amount: 480850,
      date: "2025-05-19",
      description: "Laptop Purchase",
      vendor: "Sogo Computers"
    },
    {
      id: "PCD-159",
      amount: 96170,
      date: "2025-05-22",
      description: "Laptop Purchase",
      vendor: "Sogo Computers"
    },
    {
      id: "PCD-160",
      amount: 96170,
      date: "2025-05-22",
      description: "Laptop Purchase",
      vendor: "Sogo Computers"
    },
    {
      id: "725-MAHAT LABS (1)",
      amount: 16900,
      date: "2025-05-10",
      description: "Monitor LG",
      vendor: "Ozone Computer Services"
    },
    {
      id: "Mahat Labs Pvt Ltd_Invoice_309_29.05.2025",
      amount: 8174,
      date: "2025-05-29",
      description: "Office Supplies",
      vendor: "MGEcoduties"
    },
    {
      id: "BU/MAR/080/21-22",
      amount: 37760,
      date: "2022-03-28",
      description: "Data Services - Database",
      vendor: "Billions United"
    },
    {
      id: "007/23-24",
      amount: 2478000,
      date: "2023-10-06",
      description: "Property Commission - Sy.no.214, BBMP khata no.379",
      vendor: "SEVENRAJ'S ESTATE AGENCY"
    },
    {
      id: "01176",
      amount: 985300,
      date: "2024-03-01",
      description: "Digital Advertising Boosting - March 2024",
      vendor: "SN AY (Something New Around You)"
    },
    {
      id: "220525I049900411",
      amount: 15000,
      date: "2025-05-25",
      description: "Invoice",
      vendor: "Unknown Vendor"
    }
  ];
  
  // Filter invoices by vendor (case-insensitive)
  return allExpenseInvoices.filter(invoice => 
    invoice.vendor.toLowerCase().includes(vendor.toLowerCase()) ||
    vendor.toLowerCase().includes(invoice.vendor.toLowerCase())
  );
};

export const getMatchedJournalEntry = (transaction: Transaction) => {
  const transactionType = (transaction as any).transactionType;
  const amount = Math.abs(transaction.amount);
  const vendor = transaction.vendor.toLowerCase();
  const description = transaction.description.toLowerCase();
  
  // For Suspense transactions (Other type), return null as no match is available
  if (transactionType === "Other") {
    return null;
  }
  
  // For Payroll Payment transactions, return null as they need manual reference creation
  if (transactionType === "Payroll Payment") {
    return null;
  }
  
  // Match based on vendor and description from actual expense transactions
  if (vendor.includes('clayworks') || description.includes('rent')) {
    // Clayworks Spaces - Rent payment
    const baseAmount = amount * 0.9; // 90% base rent
    const taxAmount = amount * 0.1; // 10% tax
    const cgst = taxAmount / 2;
    const sgst = taxAmount / 2;
    const tdsAmount = baseAmount * 0.1; // 10% TDS on rent
    
    return [
      { account: "Rent (1011)", debit: baseAmount, credit: 0 },
      { account: "Input CGST (1015)", debit: cgst, credit: 0 },
      { account: "Input SGST (1016)", debit: sgst, credit: 0 },
      { account: `Clayworks Spaces Technologies Pvt Ltd (2003) - ${(transaction as any).invoiceNumber || 'INV-25260258'}`, debit: 0, credit: amount },
      { account: "TDS on Rent (1019)", debit: 0, credit: tdsAmount }
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
      { account: `${transaction.vendor} (2001)`, debit: 0, credit: amount }
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
        { account: "TDS Payable", debit: amount, credit: 0 },
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
  
  
  if (transactionType === "Vendor Advance") {
    return [
      { account: "Vendor Advances (1020)", debit: amount, credit: 0 },
      { account: "Bank (1001)", debit: 0, credit: amount }
    ];
  }
  
  if (vendor.includes('epfo') || description.includes('epfo')) {
    // EPFO contribution
    return [
      { account: "PF Payable", debit: amount, credit: 0 },
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

export const getSuggestedMatch = (transaction: Transaction) => {
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

export const getAssignedVendor = (transaction: Transaction, vendorAssignments: {[key: string]: string}) => {
  // Check if this transaction is in the Suspense section
  const transactionType = (transaction as any).transactionType;
  if (transactionType === "Other") {
    return vendorAssignments[transaction.id] || "Suspense";
  }
  
  // Map vendor names to account names
  const vendorMapping: { [key: string]: string } = {
    "EPFO": "PF Payable",
    "CBDT": "TDS Payable"
  };
  
  const assignedVendor = vendorAssignments[transaction.id] || transaction.vendor;
  return vendorMapping[assignedVendor] || assignedVendor;
};

export const groupTransactionsByType = (transactions: Transaction[]) => {
  const groups = {
    "Suspense": transactions.filter(t => (t as any).transactionType === "Other"),
    "Invoice Payment": transactions.filter(t => (t as any).transactionType === "Invoice Payment"),
    "Tax Payment": transactions.filter(t => (t as any).transactionType === "Tax Payment"),
    "Payroll Payment": transactions.filter(t => (t as any).transactionType === "Payroll Payment"),
    "Vendor Advance": transactions.filter(t => (t as any).transactionType === "Vendor Advance"),
  };
  return groups;
};
