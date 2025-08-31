import { VendorLedgerEntry } from '../types/Transaction';

export interface VendorBalance {
  vendor: string;
  balance: number;
  lastUpdated: string;
}

export const VENDOR_BALANCES: Record<string, number> = {
  "JCSS & Associates LLP": 0, // All invoices paid (86400+64800+86400+64800 - 86400-64800-86400-64800 = 0)
  "JCSS & Associates": 0,
  "JCSS": 0,
  "Sogo Computers Pvt Ltd": 0, // All invoices paid (480850+96170+5310+192340+5310 - 480850-96170-5310-192340-5310 = 0)
  "Sogo Computers": 0,
  "Sogo": 0,
  "Clayworks Spaces Technologies Pvt Ltd": 0, // All invoices paid (102660+5251+102660+5251+102660 - 102660-5251-102660-5251-102660 = 0)
  "Clayworks Spaces Technologies": 0,
  "Clayworks Spaces Pvt Ltd": 0,
  "Clayworks Spaces": 0,
  "Clayworks": 0,
  "NSDL Database Management Ltd": 0, // All invoices paid (11800+11800+11800 - 11800-11800-11800 = 0)
  "NSDL Database Management": 0,
  "NSDL": 0,
  "Mahat Labs Pvt Ltd": 0, // All invoices paid (480850+240425+480850 - 480850-240425-480850 = 0)
  "Mahat Labs": 0,
  "Mahat": 0,
  "Wonderslate": 0, // All invoices paid (96170+96170+96170 - 96170-96170-96170 = 0)
  "HEPL": 0, // All invoices paid (96170+96170+96170 - 96170-96170-96170 = 0)
  // TVS Vendors
  "Billions United": 0, // All invoices paid (37760 - 37760 = 0)
  "SEVENRAJ'S ESTATE AGENCY": 0, // All invoices paid (2478000 - 2478000 = 0)
  "SN AY (Something New Around You)": 0, // All invoices paid (985300 - 985300 = 0)
  "SN AY": 0,
  "Something New Around You": 0
};

export const VENDOR_PAST_ENTRIES: Record<string, VendorLedgerEntry[]> = {
  "JCSS & Associates LLP": [
    {
      invoiceNumber: "ASO-I/108/25-26",
      date: "2025-04-26",
      amount: 86400,
      type: "Professional Fees",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-001",
      date: "2025-04-30",
      amount: -86400,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "ASO-I/107/25-26",
      date: "2025-03-26",
      amount: 64800,
      type: "Professional Fees",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-002",
      date: "2025-03-31",
      amount: -64800,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "ASO-I/106/25-26",
      date: "2025-02-26",
      amount: 86400,
      type: "Professional Fees",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-003",
      date: "2025-02-28",
      amount: -86400,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "ASO-I/105/25-26",
      date: "2025-01-26",
      amount: 64800,
      type: "Professional Fees",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-004",
      date: "2025-01-31",
      amount: -64800,
      type: "Payment",
      status: "Paid"
    }
  ],
  "Sogo Computers Pvt Ltd": [
    {
      invoiceNumber: "Pcd/25-26/001142",
      date: "2025-04-19",
      amount: 480850,
      type: "Computers",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-005",
      date: "2025-04-25",
      amount: -480850,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "Pcd/25-26/001141",
      date: "2025-03-19",
      amount: 96170,
      type: "Computers",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-006",
      date: "2025-03-25",
      amount: -96170,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "SOGO-FREIGHT-003",
      date: "2025-04-15",
      amount: 5310,
      type: "Freight and Postage",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-007",
      date: "2025-04-20",
      amount: -5310,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "Pcd/25-26/001140",
      date: "2025-02-19",
      amount: 192340,
      type: "Computers",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-008",
      date: "2025-02-25",
      amount: -192340,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "SOGO-FREIGHT-004",
      date: "2025-03-15",
      amount: 5310,
      type: "Freight and Postage",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-009",
      date: "2025-03-20",
      amount: -5310,
      type: "Payment",
      status: "Paid"
    }
  ],
  "Clayworks Spaces Technologies Pvt Ltd": [
    {
      invoiceNumber: "INV-25/26/0257",
      date: "2025-04-08",
      amount: 102660,
      type: "Rent",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-010",
      date: "2025-04-15",
      amount: -102660,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "INV-25/26/0375",
      date: "2025-03-08",
      amount: 5251,
      type: "Rent",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-011",
      date: "2025-03-15",
      amount: -5251,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "INV-25/26/0256",
      date: "2025-03-08",
      amount: 102660,
      type: "Rent",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-012",
      date: "2025-03-15",
      amount: -102660,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "INV-25/26/0374",
      date: "2025-02-08",
      amount: 5251,
      type: "Rent",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-013",
      date: "2025-02-15",
      amount: -5251,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "INV-25/26/0255",
      date: "2025-02-08",
      amount: 102660,
      type: "Rent",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-014",
      date: "2025-02-15",
      amount: -102660,
      type: "Payment",
      status: "Paid"
    }
  ],
  "NSDL Database Management Ltd": [
    {
      invoiceNumber: "RTA/04/2526/4103",
      date: "2025-04-30",
      amount: 11800,
      type: "Rates & Taxes",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-015",
      date: "2025-05-05",
      amount: -11800,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "RTA/03/2526/4102",
      date: "2025-03-31",
      amount: 11800,
      type: "Rates & Taxes",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-016",
      date: "2025-04-05",
      amount: -11800,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "RTA/02/2526/4101",
      date: "2025-02-28",
      amount: 11800,
      type: "Rates & Taxes",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-017",
      date: "2025-03-05",
      amount: -11800,
      type: "Payment",
      status: "Paid"
    }
  ],
  "Mahat Labs Pvt Ltd": [
    {
      invoiceNumber: "Pcd/25-26/001142",
      date: "2025-04-19",
      amount: 480850,
      type: "Computers",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-018",
      date: "2025-04-25",
      amount: -480850,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "Pcd/25-26/001141",
      date: "2025-03-19",
      amount: 240425,
      type: "Computers",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-019",
      date: "2025-03-25",
      amount: -240425,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "Pcd/25-26/001140",
      date: "2025-02-19",
      amount: 480850,
      type: "Computers",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-020",
      date: "2025-02-25",
      amount: -480850,
      type: "Payment",
      status: "Paid"
    }
  ],
  "Wonderslate": [
    {
      invoiceNumber: "Pcd/2526/00158",
      date: "2025-04-19",
      amount: 96170,
      type: "Computers",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-021",
      date: "2025-04-25",
      amount: -96170,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "Pcd/2526/00157",
      date: "2025-03-19",
      amount: 96170,
      type: "Computers",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-022",
      date: "2025-03-25",
      amount: -96170,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "Pcd/2526/00156",
      date: "2025-02-19",
      amount: 96170,
      type: "Computers",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-023",
      date: "2025-02-25",
      amount: -96170,
      type: "Payment",
      status: "Paid"
    }
  ],
  "HEPL": [
    {
      invoiceNumber: "HEPL-LAPTOP-002",
      date: "2025-04-19",
      amount: 96170,
      type: "Computers",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-024",
      date: "2025-04-25",
      amount: -96170,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "HEPL-LAPTOP-003",
      date: "2025-03-19",
      amount: 96170,
      type: "Computers",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-025",
      date: "2025-03-25",
      amount: -96170,
      type: "Payment",
      status: "Paid"
    },
    {
      invoiceNumber: "HEPL-LAPTOP-004",
      date: "2025-02-19",
      amount: 96170,
      type: "Computers",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-026",
      date: "2025-02-25",
      amount: -96170,
      type: "Payment",
      status: "Paid"
    }
  ],
  // TVS Vendors
  "Billions United": [
    {
      invoiceNumber: "BU/MAR/080/21-22",
      date: "2022-03-28",
      amount: 37760,
      type: "Data Services",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-TVSBU-001",
      date: "2022-04-05",
      amount: -37760,
      type: "Payment",
      status: "Paid"
    }
  ],
  "SEVENRAJ'S ESTATE AGENCY": [
    {
      invoiceNumber: "007/23-24",
      date: "2023-10-06",
      amount: 2478000,
      type: "Property Commission",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-TVSSE-001",
      date: "2023-10-13",
      amount: -2478000,
      type: "Payment",
      status: "Paid"
    }
  ],
  "SN AY (Something New Around You)": [
    {
      invoiceNumber: "01176",
      date: "2024-03-01",
      amount: 985300,
      type: "Digital Advertising",
      status: "Approved"
    },
    {
      invoiceNumber: "PAYMENT-TVSSN-001",
      date: "2024-03-08",
      amount: -985300,
      type: "Payment",
      status: "Paid"
    }
  ]
};

// Add aliases for partial matching
export const VENDOR_ALIASES: Record<string, string> = {
  "JCSS & Associates": "JCSS & Associates LLP",
  "JCSS": "JCSS & Associates LLP",
  "Sogo Computers": "Sogo Computers Pvt Ltd",
  "Sogo": "Sogo Computers Pvt Ltd",
  "Clayworks Spaces Technologies": "Clayworks Spaces Technologies Pvt Ltd",
  "Clayworks Spaces Pvt Ltd": "Clayworks Spaces Technologies Pvt Ltd",
  "Clayworks Spaces": "Clayworks Spaces Technologies Pvt Ltd",
  "Clayworks": "Clayworks Spaces Technologies Pvt Ltd",
  "NSDL Database Management": "NSDL Database Management Ltd",
  "NSDL": "NSDL Database Management Ltd",
  "Mahat Labs": "Mahat Labs Pvt Ltd",
  "Mahat": "Mahat Labs Pvt Ltd",
  // TVS Vendor Aliases
  "SN AY": "SN AY (Something New Around You)",
  "Something New Around You": "SN AY (Something New Around You)"
};

export function getVendorBalance(vendorName: string): number {
  console.log('Getting balance for vendor:', vendorName);
  
  // Try exact match first
  let balance = VENDOR_BALANCES[vendorName];
  
  // If no exact match, try partial matching
  if (balance === undefined) {
    const vendorKeys = Object.keys(VENDOR_BALANCES);
    for (const key of vendorKeys) {
      if (vendorName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(vendorName.toLowerCase())) {
        balance = VENDOR_BALANCES[key];
        console.log('Found partial match:', key, 'for vendor:', vendorName);
        break;
      }
    }
  }
  
  balance = balance || 0;
  console.log('Balance found:', balance);
  return balance;
}

export function getPastJournalEntries(vendorName: string): VendorLedgerEntry[] {
  console.log('Getting past entries for vendor:', vendorName);
  
  // Try exact match first
  let entries = VENDOR_PAST_ENTRIES[vendorName];
  
  // If no exact match, try partial matching
  if (!entries) {
    const vendorKeys = Object.keys(VENDOR_PAST_ENTRIES);
    for (const key of vendorKeys) {
      if (vendorName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(vendorName.toLowerCase())) {
        entries = VENDOR_PAST_ENTRIES[key];
        console.log('Found partial match for entries:', key, 'for vendor:', vendorName);
        break;
      }
    }
  }
  
  entries = entries || [];
  console.log('Entries found:', entries.length);
  return entries;
} 