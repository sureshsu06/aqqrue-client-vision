export interface ChartAccount {
  code: string;
  name: string;
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
  category: string;
  parent: string | null;
  status: "active" | "inactive";
  isHeader: boolean;
  balance?: number;
  debit?: number;
  credit?: number;
}

export const chartOfAccounts: ChartAccount[] = [
  // Assets
  {
    code: "1000",
    name: "Current Assets",
    type: "Asset",
    category: "Assets",
    parent: null,
    status: "active",
    isHeader: true
  },
  {
    code: "1100",
    name: "Cash and Cash Equivalents",
    type: "Asset",
    category: "Assets",
    parent: "1000",
    status: "active",
    isHeader: true
  },
  {
    code: "1110",
    name: "Cash - Operating Account",
    type: "Asset",
    category: "Assets",
    parent: "1100",
    status: "active",
    isHeader: false,
    balance: 1250000,
    debit: 1250000,
    credit: 0
  },
  {
    code: "1120",
    name: "Cash - Savings Account",
    type: "Asset",
    category: "Assets",
    parent: "1100",
    status: "active",
    isHeader: false,
    balance: 500000,
    debit: 500000,
    credit: 0
  },
  {
    code: "1200",
    name: "Accounts Receivable",
    type: "Asset",
    category: "Assets",
    parent: "1000",
    status: "active",
    isHeader: true
  },
  {
    code: "1210",
    name: "Trade Receivables",
    type: "Asset",
    category: "Assets",
    parent: "1200",
    status: "active",
    isHeader: false,
    balance: 450000,
    debit: 450000,
    credit: 0
  },
  {
    code: "1220",
    name: "Employee Advances",
    type: "Asset",
    category: "Assets",
    parent: "1200",
    status: "active",
    isHeader: false,
    balance: 25000,
    debit: 25000,
    credit: 0
  },
  {
    code: "1300",
    name: "Inventory",
    type: "Asset",
    category: "Assets",
    parent: "1000",
    status: "active",
    isHeader: true
  },
  {
    code: "1310",
    name: "Raw Materials",
    type: "Asset",
    category: "Assets",
    parent: "1300",
    status: "active",
    isHeader: false,
    balance: 150000,
    debit: 150000,
    credit: 0
  },
  {
    code: "1320",
    name: "Work in Progress",
    type: "Asset",
    category: "Assets",
    parent: "1300",
    status: "active",
    isHeader: false,
    balance: 75000,
    debit: 75000,
    credit: 0
  },
  {
    code: "1330",
    name: "Finished Goods",
    type: "Asset",
    category: "Assets",
    parent: "1300",
    status: "active",
    isHeader: false,
    balance: 200000,
    debit: 200000,
    credit: 0
  },
  {
    code: "1400",
    name: "Prepaid Expenses",
    type: "Asset",
    category: "Assets",
    parent: "1000",
    status: "active",
    isHeader: true
  },
  {
    code: "1410",
    name: "Prepaid Insurance",
    type: "Asset",
    category: "Assets",
    parent: "1400",
    status: "active",
    isHeader: false,
    balance: 12000,
    debit: 12000,
    credit: 0
  },
  {
    code: "1420",
    name: "Prepaid Rent",
    type: "Asset",
    category: "Assets",
    parent: "1400",
    status: "active",
    isHeader: false,
    balance: 18000,
    debit: 18000,
    credit: 0
  },
  {
    code: "1430",
    name: "Prepaid Subscriptions",
    type: "Asset",
    category: "Assets",
    parent: "1400",
    status: "active",
    isHeader: false,
    balance: 8500,
    debit: 8500,
    credit: 0
  },
  {
    code: "1500",
    name: "Fixed Assets",
    type: "Asset",
    category: "Assets",
    parent: null,
    status: "active",
    isHeader: true
  },
  {
    code: "1510",
    name: "Computer Equipment",
    type: "Asset",
    category: "Assets",
    parent: "1500",
    status: "active",
    isHeader: true
  },
  {
    code: "1511",
    name: "Laptops",
    type: "Asset",
    category: "Assets",
    parent: "1510",
    status: "active",
    isHeader: false,
    balance: 577020,
    debit: 577020,
    credit: 0
  },
  {
    code: "1512",
    name: "Monitors",
    type: "Asset",
    category: "Assets",
    parent: "1510",
    status: "active",
    isHeader: false,
    balance: 16900,
    debit: 16900,
    credit: 0
  },
  {
    code: "1520",
    name: "Office Equipment",
    type: "Asset",
    category: "Assets",
    parent: "1500",
    status: "active",
    isHeader: true
  },
  {
    code: "1521",
    name: "Furniture",
    type: "Asset",
    category: "Assets",
    parent: "1520",
    status: "active",
    isHeader: false,
    balance: 45000,
    debit: 45000,
    credit: 0
  },
  {
    code: "1522",
    name: "Office Supplies",
    type: "Asset",
    category: "Assets",
    parent: "1520",
    status: "active",
    isHeader: false,
    balance: 8500,
    debit: 8500,
    credit: 0
  },
  {
    code: "1590",
    name: "Accumulated Depreciation",
    type: "Asset",
    category: "Assets",
    parent: "1500",
    status: "active",
    isHeader: true,
    balance: -48085,
    debit: 0,
    credit: 48085
  },

  // Liabilities
  {
    code: "2000",
    name: "Current Liabilities",
    type: "Liability",
    category: "Liabilities",
    parent: null,
    status: "active",
    isHeader: true
  },
  {
    code: "2100",
    name: "Accounts Payable",
    type: "Liability",
    category: "Liabilities",
    parent: "2000",
    status: "active",
    isHeader: true
  },
  {
    code: "2110",
    name: "Trade Payables",
    type: "Liability",
    category: "Liabilities",
    parent: "2100",
    status: "active",
    isHeader: false,
    balance: -320000,
    debit: 0,
    credit: 320000
  },
  {
    code: "2120",
    name: "Professional Services",
    type: "Liability",
    category: "Liabilities",
    parent: "2100",
    status: "active",
    isHeader: false,
    balance: -45000,
    debit: 0,
    credit: 45000
  },
  {
    code: "2210",
    name: "Brex Card",
    type: "Liability",
    category: "Liabilities",
    parent: "2200",
    status: "active",
    isHeader: false,
    balance: -12500,
    debit: 0,
    credit: 12500
  },
  {
    code: "2220",
    name: "Ramp Card",
    type: "Liability",
    category: "Liabilities",
    parent: "2200",
    status: "active",
    isHeader: false,
    balance: -8500,
    debit: 0,
    credit: 8500
  },
  {
    code: "2300",
    name: "Accrued Expenses",
    type: "Liability",
    category: "Liabilities",
    parent: "2000",
    status: "active",
    isHeader: true
  },
  {
    code: "2310",
    name: "Accrued Salaries",
    type: "Liability",
    category: "Liabilities",
    parent: "2300",
    status: "active",
    isHeader: false,
    balance: -25000,
    debit: 0,
    credit: 25000
  },
  {
    code: "2320",
    name: "Accrued Taxes",
    type: "Liability",
    category: "Liabilities",
    parent: "2300",
    status: "active",
    isHeader: false,
    balance: -15000,
    debit: 0,
    credit: 15000
  },
  {
    code: "2400",
    name: "Deferred Revenue",
    type: "Liability",
    category: "Liabilities",
    parent: "2000",
    status: "active",
    isHeader: true
  },
  {
    code: "2410",
    name: "Unearned Revenue",
    type: "Liability",
    category: "Liabilities",
    parent: "2400",
    status: "active",
    isHeader: false,
    balance: -150000,
    debit: 0,
    credit: 150000
  },

  // Long Term Liabilities
  {
    code: "2500",
    name: "Long Term Liabilities",
    type: "Liability",
    category: "Liabilities",
    parent: null,
    status: "active",
    isHeader: true
  },
  {
    code: "2510",
    name: "Long Term Loans",
    type: "Liability",
    category: "Liabilities",
    parent: "2500",
    status: "active",
    isHeader: true
  },
  {
    code: "2511",
    name: "Bank Loan",
    type: "Liability",
    category: "Liabilities",
    parent: "2510",
    status: "active",
    isHeader: false,
    balance: -500000,
    debit: 0,
    credit: 500000
  },
  {
    code: "2520",
    name: "Lease Obligations",
    type: "Liability",
    category: "Liabilities",
    parent: "2500",
    status: "active",
    isHeader: true
  },
  {
    code: "2521",
    name: "Office Lease",
    type: "Liability",
    category: "Liabilities",
    parent: "2520",
    status: "active",
    isHeader: false,
    balance: -120000,
    debit: 0,
    credit: 120000
  },

  // Equity
  {
    code: "3000",
    name: "Equity",
    type: "Equity",
    category: "Equity",
    parent: null,
    status: "active",
    isHeader: true
  },
  {
    code: "3100",
    name: "Share Capital",
    type: "Equity",
    category: "Equity",
    parent: "3000",
    status: "active",
    isHeader: true
  },
  {
    code: "3110",
    name: "Common Stock",
    type: "Equity",
    category: "Equity",
    parent: "3100",
    status: "active",
    isHeader: false,
    balance: -1000000,
    debit: 0,
    credit: 1000000
  },
  {
    code: "3200",
    name: "Retained Earnings",
    type: "Equity",
    category: "Equity",
    parent: "3000",
    status: "active",
    isHeader: true
  },
  {
    code: "3210",
    name: "Current Year Earnings",
    type: "Equity",
    category: "Equity",
    parent: "3200",
    status: "active",
    isHeader: false,
    balance: -150000,
    debit: 0,
    credit: 150000
  },

  // Revenue
  {
    code: "4000",
    name: "Revenue",
    type: "Revenue",
    category: "Revenue",
    parent: null,
    status: "active",
    isHeader: true
  },
  {
    code: "4100",
    name: "Service Revenue",
    type: "Revenue",
    category: "Revenue",
    parent: "4000",
    status: "active",
    isHeader: true
  },
  {
    code: "4110",
    name: "Consulting Services",
    type: "Revenue",
    category: "Revenue",
    parent: "4100",
    status: "active",
    isHeader: false,
    balance: -500000,
    debit: 0,
    credit: 500000
  },
  {
    code: "4120",
    name: "Software Development",
    type: "Revenue",
    category: "Revenue",
    parent: "4100",
    status: "active",
    isHeader: false,
    balance: -350000,
    debit: 0,
    credit: 350000
  },
  {
    code: "4200",
    name: "Product Revenue",
    type: "Revenue",
    category: "Revenue",
    parent: "4000",
    status: "active",
    isHeader: true
  },
  {
    code: "4210",
    name: "Software Licenses",
    type: "Revenue",
    category: "Revenue",
    parent: "4200",
    status: "active",
    isHeader: false,
    balance: -85000,
    debit: 0,
    credit: 85000
  },

  // Expenses
  {
    code: "5000",
    name: "Cost of Goods Sold",
    type: "Expense",
    category: "Expenses",
    parent: null,
    status: "active",
    isHeader: false,
    balance: 0,
    debit: 0,
    credit: 0
  },
  {
    code: "5100",
    name: "Direct Labor",
    type: "Expense",
    category: "Expenses",
    parent: "5000",
    status: "active",
    isHeader: true
  },
  {
    code: "5110",
    name: "Developer Salaries",
    type: "Expense",
    category: "Expenses",
    parent: "5100",
    status: "active",
    isHeader: false,
    balance: 250000,
    debit: 250000,
    credit: 0
  },
  {
    code: "5120",
    name: "Consultant Fees",
    type: "Expense",
    category: "Expenses",
    parent: "5100",
    status: "active",
    isHeader: false,
    balance: 170000,
    debit: 170000,
    credit: 0
  },
  {
    code: "5200",
    name: "Direct Materials",
    type: "Expense",
    category: "Expenses",
    parent: "5000",
    status: "active",
    isHeader: true
  },
  {
    code: "5210",
    name: "Software Licenses",
    type: "Expense",
    category: "Expenses",
    parent: "5200",
    status: "active",
    isHeader: false,
    balance: 45000,
    debit: 45000,
    credit: 0
  },
  {
    code: "5220",
    name: "Third-party Services",
    type: "Expense",
    category: "Expenses",
    parent: "5200",
    status: "active",
    isHeader: false,
    balance: 35000,
    debit: 35000,
    credit: 0
  },

  {
    code: "6000",
    name: "Operating Expenses",
    type: "Expense",
    category: "Expenses",
    parent: null,
    status: "active",
    isHeader: true
  },
  {
    code: "6100",
    name: "Personnel Expenses",
    type: "Expense",
    category: "Expenses",
    parent: "6000",
    status: "active",
    isHeader: true
  },
  {
    code: "6110",
    name: "Salaries and Wages",
    type: "Expense",
    category: "Expenses",
    parent: "6100",
    status: "active",
    isHeader: false,
    balance: 180000,
    debit: 180000,
    credit: 0
  },
  {
    code: "6120",
    name: "Employee Benefits",
    type: "Expense",
    category: "Expenses",
    parent: "6100",
    status: "active",
    isHeader: false,
    balance: 45000,
    debit: 45000,
    credit: 0
  },
  {
    code: "6130",
    name: "Payroll Taxes",
    type: "Expense",
    category: "Expenses",
    parent: "6100",
    status: "active",
    isHeader: false,
    balance: 25000,
    debit: 25000,
    credit: 0
  },
  {
    code: "6200",
    name: "Office Expenses",
    type: "Expense",
    category: "Expenses",
    parent: "6000",
    status: "active",
    isHeader: true
  },
  {
    code: "6210",
    name: "Rent Expense",
    type: "Expense",
    category: "Expenses",
    parent: "6200",
    status: "active",
    isHeader: false,
    balance: 60000,
    debit: 60000,
    credit: 0
  },
  {
    code: "6220",
    name: "Utilities",
    type: "Expense",
    category: "Expenses",
    parent: "6200",
    status: "active",
    isHeader: false,
    balance: 15000,
    debit: 15000,
    credit: 0
  },
  {
    code: "6230",
    name: "Office Supplies",
    type: "Expense",
    category: "Expenses",
    parent: "6200",
    status: "active",
    isHeader: false,
    balance: 8500,
    debit: 8500,
    credit: 0
  },
  {
    code: "6300",
    name: "Technology Expenses",
    type: "Expense",
    category: "Expenses",
    parent: "6000",
    status: "active",
    isHeader: true
  },
  {
    code: "6310",
    name: "Software Subscriptions",
    type: "Expense",
    category: "Expenses",
    parent: "6300",
    status: "active",
    isHeader: false,
    balance: 25000,
    debit: 25000,
    credit: 0
  },
  {
    code: "6320",
    name: "Cloud Services",
    type: "Expense",
    category: "Expenses",
    parent: "6300",
    status: "active",
    isHeader: false,
    balance: 18000,
    debit: 18000,
    credit: 0
  },
  {
    code: "6330",
    name: "IT Support",
    type: "Expense",
    category: "Expenses",
    parent: "6300",
    status: "active",
    isHeader: false,
    balance: 12000,
    debit: 12000,
    credit: 0
  },
  {
    code: "6400",
    name: "Professional Services",
    type: "Expense",
    category: "Expenses",
    parent: "6000",
    status: "active",
    isHeader: true
  },
  {
    code: "6410",
    name: "Legal Fees",
    type: "Expense",
    category: "Expenses",
    parent: "6400",
    status: "active",
    isHeader: false,
    balance: 15000,
    debit: 15000,
    credit: 0
  },
  {
    code: "6420",
    name: "Accounting Fees",
    type: "Expense",
    category: "Expenses",
    parent: "6400",
    status: "active",
    isHeader: false,
    balance: 20000,
    debit: 20000,
    credit: 0
  },
  {
    code: "6430",
    name: "Consulting Fees",
    type: "Expense",
    category: "Expenses",
    parent: "6400",
    status: "active",
    isHeader: false,
    balance: 18000,
    debit: 18000,
    credit: 0
  },
  {
    code: "6500",
    name: "Marketing and Sales",
    type: "Expense",
    category: "Expenses",
    parent: "6000",
    status: "active",
    isHeader: true
  },
  {
    code: "6510",
    name: "Advertising",
    type: "Expense",
    category: "Expenses",
    parent: "6500",
    status: "active",
    isHeader: false,
    balance: 25000,
    debit: 25000,
    credit: 0
  },
  {
    code: "6520",
    name: "Travel and Entertainment",
    type: "Expense",
    category: "Expenses",
    parent: "6500",
    status: "active",
    isHeader: false,
    balance: 15000,
    debit: 15000,
    credit: 0
  },
  {
    code: "6530",
    name: "Meals and Entertainment",
    type: "Expense",
    category: "Expenses",
    parent: "6500",
    status: "active",
    isHeader: false,
    balance: 8500,
    debit: 8500,
    credit: 0
  }
];

// Helper function to get trial balance data (only non-header accounts with balances)
export const getTrialBalanceData = () => {
  return chartOfAccounts.filter(account => !account.isHeader && account.balance !== undefined);
};

// Helper function to get total debits and credits
export const getTrialBalanceTotals = () => {
  const trialBalanceData = getTrialBalanceData();
  const totalDebits = trialBalanceData.reduce((sum, account) => sum + (account.debit || 0), 0);
  const totalCredits = trialBalanceData.reduce((sum, account) => sum + (account.credit || 0), 0);
  return { totalDebits, totalCredits };
}; 