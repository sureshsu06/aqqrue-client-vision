// GL Account Code constants for the accounting system

export const GL_ACCOUNT_CODES: { [key: string]: string } = {
  // Asset Accounts
  "Cash/Accounts Receivable": "1001",
  "Accounts Receivable": "1002",
  "Prepaid Software Subscriptions": "1003",
  
  // Liability Accounts
  "Deferred Revenue": "2001",
  "Sales Tax": "2002",
  
  // Revenue Accounts
  "SaaS Revenue": "4001",
  "Revenue": "4002",
  
  // Expense Accounts
  "Professional Fees": "1010",
  "Rent": "1011",
  "Computers": "1012",
  "Freight and Postage": "1013",
  "Rates & Taxes": "1014",
  "Input CGST": "1015",
  "Input SGST": "1016",
  "Input IGST": "1017",
  "TDS on Professional Charges": "1018",
  "TDS on Rent": "1019",
  "TDS on Commission": "1020",
  "Data Services": "1021",
  "Property Commission": "1022",
  "Digital Advertising": "1023",
  
  // Vendor Accounts
  "JCSS & Associates LLP": "2001",
  "Sogo Computers Pvt Ltd": "2002",
  "Clayworks Spaces Technologies Pvt Ltd": "2003",
  "NSDL Database Management Ltd": "2004",
  "Billions United": "2005",
  "SEVENRAJ'S ESTATE AGENCY": "2006",
  "SN AY (Something New Around You)": "2007",
  "HubSpot Inc": "2008",
  
  // Other Accounts
  "Software Subscriptions": "3001",
  "Brex Card": "3002",
  "Suspense Account": "3003"
};

// Helper function to get GL account code
export function getGLAccountCode(accountName: string): string {
  return GL_ACCOUNT_CODES[accountName] || "";
} 