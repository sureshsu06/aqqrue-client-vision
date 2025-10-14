export interface GLAccount {
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  category: string;
}

export const GL_ACCOUNTS: Record<string, GLAccount> = {
  "Cash/Accounts Receivable": {
    code: "1001",
    name: "Cash/Accounts Receivable",
    type: "asset",
    category: "Current Assets"
  },
  "Accounts Receivable": {
    code: "1002",
    name: "Accounts Receivable",
    type: "asset",
    category: "Current Assets"
  },
  "Card Suspense Account": {
    code: "1003",
    name: "Card Suspense Account",
    type: "asset",
    category: "Current Assets"
  },
  "Deferred Revenue": {
    code: "2001",
    name: "Deferred Revenue",
    type: "liability",
    category: "Current Liabilities"
  },
  "SaaS Revenue": {
    code: "4001",
    name: "SaaS Revenue",
    type: "revenue",
    category: "Revenue"
  },
  "Professional Fees": {
    code: "1010",
    name: "Professional Fees",
    type: "expense",
    category: "Operating Expenses"
  },
  "US Operating Expenses": {
    code: "1011",
    name: "US Operating Expenses",
    type: "expense",
    category: "Operating Expenses"
  },
  "Rent": {
    code: "1012",
    name: "Rent",
    type: "expense",
    category: "Operating Expenses"
  },
  "Computers": {
    code: "1013",
    name: "Computers",
    type: "expense",
    category: "Operating Expenses"
  },
  "Freight and Postage": {
    code: "1014",
    name: "Freight and Postage",
    type: "expense",
    category: "Operating Expenses"
  },
  "Rates & Taxes": {
    code: "1015",
    name: "Rates & Taxes",
    type: "expense",
    category: "Operating Expenses"
  },
  "Input CGST": {
    code: "1016",
    name: "Input CGST",
    type: "asset",
    category: "Tax Assets"
  },
  "Input SGST": {
    code: "1017",
    name: "Input SGST",
    type: "asset",
    category: "Tax Assets"
  },
  "Input IGST": {
    code: "1018",
    name: "Input IGST",
    type: "asset",
    category: "Tax Assets"
  },
  "TDS on Professional Charges": {
    code: "1019",
    name: "TDS on Professional Charges",
    type: "asset",
    category: "Tax Assets"
  },
  "TDS on Rent": {
    code: "1020",
    name: "TDS on Rent",
    type: "asset",
    category: "Tax Assets"
  },
  "TDS on Commission": {
    code: "1021",
    name: "TDS on Commission",
    type: "asset",
    category: "Tax Assets"
  },
  "JCSS & Associates LLP": {
    code: "1022",
    name: "JCSS & Associates LLP",
    type: "liability",
    category: "Current Liabilities"
  },
  "Sogo Computers Pvt Ltd": {
    code: "1023",
    name: "Sogo Computers Pvt Ltd",
    type: "liability",
    category: "Current Liabilities"
  },
  "Clayworks Spaces Pvt Ltd": {
    code: "1024",
    name: "Clayworks Spaces Pvt Ltd",
    type: "liability",
    category: "Current Liabilities"
  },
  "NSDL Database Management Ltd": {
    code: "1025",
    name: "NSDL Database Management Ltd",
    type: "liability",
    category: "Current Liabilities"
  },
  "MGEcoduties": {
    code: "1026",
    name: "MGEcoduties",
    type: "liability",
    category: "Current Liabilities"
  },
  "Ozone Computer Services": {
    code: "1027",
    name: "Ozone Computer Services",
    type: "liability",
    category: "Current Liabilities"
  },
  "Billions United": {
    code: "1028",
    name: "Billions United",
    type: "liability",
    category: "Current Liabilities"
  },
  "SEVENRAJ'S ESTATE AGENCY": {
    code: "1029",
    name: "SEVENRAJ'S ESTATE AGENCY",
    type: "liability",
    category: "Current Liabilities"
  },
  "SN AY (Something New Around You)": {
    code: "1030",
    name: "SN AY (Something New Around You)",
    type: "liability",
    category: "Current Liabilities"
  },
  "Mahat Labs Pvt Ltd": {
    code: "1031",
    name: "Mahat Labs Pvt Ltd",
    type: "liability",
    category: "Current Liabilities"
  },
  "Brex Card": {
    code: "1032",
    name: "Brex Card",
    type: "liability",
    category: "Current Liabilities"
  }
};

export function getGLAccountCode(accountName: string): string {
  return GL_ACCOUNTS[accountName]?.code || "";
}

export function getGLAccountType(accountName: string): string {
  return GL_ACCOUNTS[accountName]?.type || "";
}

export function getGLAccountCategory(accountName: string): string {
  return GL_ACCOUNTS[accountName]?.category || "";
}

export function getAccountOptions(): { value: string; label: string }[] {
  return Object.entries(GL_ACCOUNTS).map(([name, account]) => ({
    value: name,
    label: `${name} (${account.code})`
  }));
} 