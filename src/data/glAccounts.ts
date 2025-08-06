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
  "Rent": {
    code: "1011",
    name: "Rent",
    type: "expense",
    category: "Operating Expenses"
  },
  "Computers": {
    code: "1012",
    name: "Computers",
    type: "expense",
    category: "Operating Expenses"
  },
  "Freight and Postage": {
    code: "1013",
    name: "Freight and Postage",
    type: "expense",
    category: "Operating Expenses"
  },
  "Rates & Taxes": {
    code: "1014",
    name: "Rates & Taxes",
    type: "expense",
    category: "Operating Expenses"
  },
  "Input CGST": {
    code: "1015",
    name: "Input CGST",
    type: "asset",
    category: "Tax Assets"
  },
  "Input SGST": {
    code: "1016",
    name: "Input SGST",
    type: "asset",
    category: "Tax Assets"
  },
  "Input IGST": {
    code: "1017",
    name: "Input IGST",
    type: "asset",
    category: "Tax Assets"
  },
  "TDS on Professional Charges": {
    code: "1018",
    name: "TDS on Professional Charges",
    type: "asset",
    category: "Tax Assets"
  },
  "TDS on Rent": {
    code: "1019",
    name: "TDS on Rent",
    type: "asset",
    category: "Tax Assets"
  },
  "TDS on Commission": {
    code: "1020",
    name: "TDS on Commission",
    type: "asset",
    category: "Tax Assets"
  },
  "JCSS & Associates LLP": {
    code: "1021",
    name: "JCSS & Associates LLP",
    type: "liability",
    category: "Accounts Payable"
  },
  "Sogo Computers Pvt Ltd": {
    code: "1022",
    name: "Sogo Computers Pvt Ltd",
    type: "liability",
    category: "Accounts Payable"
  },
  "Clayworks Spaces Technologies Pvt Ltd": {
    code: "1023",
    name: "Clayworks Spaces Technologies Pvt Ltd",
    type: "liability",
    category: "Accounts Payable"
  },
  "NSDL Database Management Ltd": {
    code: "1024",
    name: "NSDL Database Management Ltd",
    type: "liability",
    category: "Accounts Payable"
  },
  "Software Subscriptions": {
    code: "1025",
    name: "Software Subscriptions",
    type: "expense",
    category: "Operating Expenses"
  },
  "Brex Card": {
    code: "1026",
    name: "Brex Card",
    type: "liability",
    category: "Current Liabilities"
  },
  "Suspense Account": {
    code: "1027",
    name: "Suspense Account",
    type: "asset",
    category: "Current Assets"
  },
  "Billions United": {
    code: "1028",
    name: "Billions United",
    type: "liability",
    category: "Accounts Payable"
  },
  "SEVENRAJ'S ESTATE AGENCY": {
    code: "1029",
    name: "SEVENRAJ'S ESTATE AGENCY",
    type: "liability",
    category: "Accounts Payable"
  },
  "SN AY (Something New Around You)": {
    code: "1030",
    name: "SN AY (Something New Around You)",
    type: "liability",
    category: "Accounts Payable"
  },
  "Data Services": {
    code: "1031",
    name: "Data Services",
    type: "expense",
    category: "Operating Expenses"
  },
  "Property Commission": {
    code: "1032",
    name: "Property Commission",
    type: "expense",
    category: "Operating Expenses"
  },
  "Digital Advertising": {
    code: "1033",
    name: "Digital Advertising",
    type: "expense",
    category: "Operating Expenses"
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