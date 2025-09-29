import { Transaction, JournalEntry, JournalEntryLine } from '../types/Transaction';

export class JournalEntryGenerator {
  /**
   * Generates a journal entry for a given transaction
   */
  static generateForTransaction(transaction: Transaction): JournalEntry {
    const baseEntry = {
      client: transaction.client,
      invoiceNumber: "INV-2025-001", // Default value
      totalAmount: transaction.amount,
      entryType: "General Expense", // Default value
      narration: `Being the expense payable to ${transaction.vendor}`,
      entries: [] as JournalEntryLine[], // Default empty array
      isRecurring: transaction.isRecurring,
      isBillable: true,
      costCenter: "US Operations",
      location: "San Francisco HQ"
    };

    // Use transaction-specific logic or fallback to default
    const specificEntry = this.getTransactionSpecificEntry(transaction);
    if (specificEntry) {
      return { ...baseEntry, ...specificEntry };
    }

    // Fallback for any other transactions
    return {
      ...baseEntry,
      entries: [
        { account: "General Expense", debit: transaction.amount * 0.85, credit: 0, confidence: 95 },
        { account: "Input CGST", debit: transaction.amount * 0.075, credit: 0, confidence: 100 },
        { account: "Input SGST", debit: transaction.amount * 0.075, credit: 0, confidence: 100 },
        { account: transaction.vendor, debit: 0, credit: transaction.amount, confidence: 100 }
      ]
    };
  }

  /**
   * Gets transaction-specific journal entry data
   */
  private static getTransactionSpecificEntry(transaction: Transaction): Partial<JournalEntry> | null {
    // Handle US credit card transactions (no GST)
    if (transaction.currency === "USD" && transaction.type === "credit-card") {
      return {
        invoiceNumber: transaction.pdfFile ? `CC-${transaction.id}` : "PENDING",
        totalAmount: transaction.amount,
        entryType: "US Credit Card Expense",
        narration: `Being the ${transaction.description} charged to Brex card`,
        entries: [
          { account: "US Operating Expenses", debit: transaction.amount, credit: 0, confidence: 95 },
          { account: "Credit Card Suspense Account", debit: 0, credit: transaction.amount, confidence: 100 }
        ],
        costCenter: "US Operations",
        location: "San Francisco HQ"
      };
    }

    switch (transaction.id) {
      case "1": // JCSS & Associates LLP - ASO-I/109/25-26
        return {
          invoiceNumber: "ASO-I/109/25-26",
          totalAmount: 86400,
          entryType: "Professional Fees",
          narration: "Being the monthly professional charges for the month of May 2025 payable to JCSS & Associates LLP vide invoice no. ASO-I/109/25-26 dtd 26.05.2025",
          entries: [
            { account: "Professional Fees", debit: 80000, credit: 0, confidence: 95 },
            { account: "Input CGST", debit: 7200, credit: 0, confidence: 100 },
            { account: "Input SGST", debit: 7200, credit: 0, confidence: 100 },
            { account: "TDS on Professional Charges", debit: 0, credit: 8000, confidence: 100 },
            { account: "JCSS & Associates LLP", debit: 0, credit: 86400, confidence: 100 }
          ]
        };

      case "2": // JCSS & Associates LLP - ASO-I/117/25-26
        return {
          invoiceNumber: "ASO-I/117/25-26",
          totalAmount: 64800,
          entryType: "Professional Fees",
          narration: "Being the Professional fee towards N-STP condonation of invoices payable to JCSS & Associates LLP vide invoice no. ASO-I/117/25-26 dtd 26.05.2025",
          entries: [
            { account: "Professional Fees", debit: 60000, credit: 0, confidence: 95 },
            { account: "Input CGST", debit: 5400, credit: 0, confidence: 100 },
            { account: "Input SGST", debit: 5400, credit: 0, confidence: 100 },
            { account: "TDS on Professional Charges", debit: 0, credit: 6000, confidence: 100 },
            { account: "JCSS & Associates LLP", debit: 0, credit: 64800, confidence: 100 }
          ]
        };

      case "3": // NSDL Database Management Limited
        return {
          invoiceNumber: "RTA/05/2526/4104",
          totalAmount: 11800,
          entryType: "Rates & Taxes",
          narration: "Being the charges paid to NDML vide inv no. RTA/05/2526/4104 dtd 31.05.2025",
          entries: [
            { account: "Rates & Taxes", debit: 10000, credit: 0, confidence: 95 },
            { account: "Input IGST", debit: 1800, credit: 0, confidence: 100 },
            { account: "NSDL Database Management Ltd", debit: 0, credit: 11800, confidence: 100 }
          ]
        };

      case "4": // Sogo Computers - Freight for Tanvi Arora
        return {
          invoiceNumber: "SOGO-FREIGHT-001",
          totalAmount: 5310,
          entryType: "Freight and Postage",
          narration: "Being the Freight charges for shipping a laptop to Tanvi Arora",
          entries: [
            { account: "Freight and Postage", debit: 4500, credit: 0, confidence: 95 },
            { account: "Input CGST", debit: 405, credit: 0, confidence: 100 },
            { account: "Input SGST", debit: 405, credit: 0, confidence: 100 },
            { account: "Sogo Computers Pvt Ltd", debit: 0, credit: 5310, confidence: 100 }
          ]
        };

      case "5": // Sogo Computers - Freight for Kamal Chandani
        return {
          invoiceNumber: "SOGO-FREIGHT-002",
          totalAmount: 5310,
          entryType: "Freight and Postage",
          narration: "Being the Freight charges for shipping a laptop to Kamal Chandani",
          entries: [
            { account: "Freight and Postage", debit: 4500, credit: 0, confidence: 95 },
            { account: "Input CGST", debit: 405, credit: 0, confidence: 100 },
            { account: "Input SGST", debit: 405, credit: 0, confidence: 100 },
            { account: "Sogo Computers Pvt Ltd", debit: 0, credit: 5310, confidence: 100 }
          ]
        };

      case "6": // Clayworks Spaces Technologies - Office space
        return {
          invoiceNumber: "INV-25/26/0258",
          totalAmount: 102660,
          entryType: "Rent",
          narration: "Being the charges for office space for May 2025",
          entries: [
            { account: "Rent", debit: 87000, credit: 0, confidence: 95 },
            { account: "Input CGST", debit: 7830, credit: 0, confidence: 100 },
            { account: "Input SGST", debit: 7830, credit: 0, confidence: 100 },
            { account: "Clayworks Spaces Technologies Pvt Ltd", debit: 0, credit: 93960, confidence: 100 },
            { account: "TDS on Rent", debit: 0, credit: 8700, confidence: 100 }
          ]
        };

      case "7": // Clayworks Spaces Technologies - Car parking and two wheeler parking
        return {
          invoiceNumber: "INV-25/26/0376",
          totalAmount: 5251,
          entryType: "Rent",
          narration: "Being the charges for car parking and two wheeler parking for April 2025 vide invoice no. INV-25/26/0376 Dtd. 08.05.2025",
          entries: [
            { account: "Rent", debit: 4450, credit: 0, confidence: 95 },
            { account: "Input CGST", debit: 400.50, credit: 0, confidence: 100 },
            { account: "Input SGST", debit: 400.50, credit: 0, confidence: 100 },
            { account: "Clayworks Spaces Technologies Pvt Ltd", debit: 0, credit: 4806, confidence: 100 },
            { account: "TDS on Rent", debit: 0, credit: 445, confidence: 100 }
          ]
        };

      case "8": // Mahat Labs Pvt Ltd - Dell laptops (5 Nos)
        return {
          invoiceNumber: "Pcd/25-26/001143",
          totalAmount: 480850,
          entryType: "Computers",
          narration: "Being Dell laptop (5 Nos) purchased from Sogo Computers Pvt Ltd vide bill no. Pcd/25-26/001143 dated 19-05-2025 amount Rs. 4,80,850.",
          entries: [
            { account: "Computers", debit: 407500, credit: 0, confidence: 95 },
            { account: "Input CGST", debit: 36675, credit: 0, confidence: 100 },
            { account: "Input SGST", debit: 36675, credit: 0, confidence: 100 },
            { account: "Sogo Computers Pvt Ltd", debit: 0, credit: 480850, confidence: 100 }
          ]
        };

      case "9": // Wonderslate - Laptop for Tanvi Arora
        return {
          invoiceNumber: "Pcd/2526/00159",
          totalAmount: 96170,
          entryType: "Computers",
          narration: "Being the purchase of laptop 1 Nos and shipped to Tanvi Arora",
          entries: [
            { account: "Computers", debit: 81500, credit: 0, confidence: 95 },
            { account: "Input CGST", debit: 7335, credit: 0, confidence: 100 },
            { account: "Input SGST", debit: 7335, credit: 0, confidence: 100 },
            { account: "Sogo Computers Pvt Ltd", debit: 0, credit: 96170, confidence: 100 }
          ]
        };

      case "10": // HEPL - Laptop for Kamal Chandani
        return {
          invoiceNumber: "HEPL-LAPTOP-001",
          totalAmount: 96170,
          entryType: "Computers",
          narration: "Being the purchase of laptop 1 Nos and shipped to Kamal Chandani",
          entries: [
            { account: "Computers", debit: 81500, credit: 0, confidence: 95 },
            { account: "Input CGST", debit: 7335, credit: 0, confidence: 100 },
            { account: "Input SGST", debit: 7335, credit: 0, confidence: 100 },
            { account: "Sogo Computers Pvt Ltd", debit: 0, credit: 96170, confidence: 100 }
          ]
        };

      // SaaS Contract transactions
      case "27": // Bishop Wisecarver - SaaS Cloud Services
        return {
          invoiceNumber: "RHYTHMS-BISHOP-001",
          totalAmount: 7020,
          entryType: "SaaS Revenue",
          narration: "Being the SaaS revenue from Bishop Wisecarver for RhythmsAI OKR Platform - 65 Owner Users",
          entries: [
            { account: "Cash/Accounts Receivable", debit: 7020, credit: 0, confidence: 100 },
            { account: "Deferred Revenue", debit: 0, credit: 7020, confidence: 100 }
          ]
        };

      case "28": // MARKETview Technology - RhythmsAI OKR Platform
        return {
          invoiceNumber: "RHYTHMS-MV-001",
          totalAmount: 10000,
          entryType: "SaaS Revenue",
          narration: "Being the SaaS revenue from MARKETview Technology for RhythmsAI OKR Platform subscription - 38 month contract (Year 1 of 3)",
          entries: [
            { account: "Cash/Accounts Receivable", debit: 10000, credit: 0, confidence: 100 },
            { account: "Deferred Revenue", debit: 0, credit: 7894.74, confidence: 100 },
            { account: "Revenue", debit: 0, credit: 2105.26, confidence: 100 }
          ]
        };

      case "29": // Sera - SaaS Cloud Services
        return {
          invoiceNumber: "RHYTHMS-SERA-001",
          totalAmount: 95000,
          entryType: "SaaS Revenue",
          narration: "Being the SaaS revenue from Sera for cloud services subscription",
          entries: [
            { account: "Cash/Accounts Receivable", debit: 95000, credit: 0, confidence: 100 },
            { account: "Deferred Revenue", debit: 0, credit: 95000, confidence: 100 }
          ]
        };

      case "30": // Clipper Media Acquisition I, LLC - SaaS Cloud Services
        return {
          invoiceNumber: "RHYTHMS-CLIPPER-001",
          totalAmount: 7999,
          entryType: "SaaS Revenue",
          narration: "Being the SaaS revenue from Clipper Media Acquisition I, LLC for RhythmsAI OKR Platform subscription - 11 month contract",
          entries: [
            { account: "Cash/Accounts Receivable", debit: 7999, credit: 0, confidence: 100 },
            { account: "Deferred Revenue", debit: 0, credit: 7999, confidence: 100 }
          ]
        };

      case "31": // Networkology - SaaS Cloud Services
        return {
          invoiceNumber: "RHYTHMS-NET-001",
          totalAmount: 110000,
          entryType: "SaaS Revenue",
          narration: "Being the SaaS revenue from Networkology for cloud services subscription",
          entries: [
            { account: "Cash/Accounts Receivable", debit: 110000, credit: 0, confidence: 100 },
            { account: "Deferred Revenue", debit: 0, credit: 110000, confidence: 100 }
          ]
        };

      case "32": // AlineOps - SaaS Cloud Services
        return {
          invoiceNumber: "RHYTHMS-ALINE-001",
          totalAmount: 135000,
          entryType: "SaaS Revenue",
          narration: "Being the SaaS revenue from AlineOps for cloud services subscription",
          entries: [
            { account: "Cash/Accounts Receivable", debit: 135000, credit: 0, confidence: 100 },
            { account: "Deferred Revenue", debit: 0, credit: 135000, confidence: 100 }
          ]
        };

      // HubSpot Prepaid Expenses
      case "17": // HubSpot Inc - Marketing Hub Starter & Sales Hub Professional (Prepaid)
        return {
          invoiceNumber: "HUBSPOT-614657704",
          totalAmount: 2324.11,
          entryType: "Prepaid Software Subscriptions",
          narration: "Being the quarterly prepaid subscription charges for HubSpot Marketing Hub Starter & Sales Hub Professional - to be amortized over 3 months",
          entries: [
            { account: "Prepaid Software Subscriptions", debit: 2324.11, credit: 0, confidence: 95 },
            { account: "HubSpot Inc", debit: 0, credit: 2324.11, confidence: 100 }
          ],
          isPrepaid: true,
          prepaidPeriod: "quarterly",
          prepaidAmount: 2324.11
        };


      case "30": // AgentHub Canada Inc - Gumloop Starter Plan
        return {
          invoiceNumber: "AGENTHUB-6D330809-0003",
          totalAmount: 97.00,
          entryType: "Software Subscriptions",
          narration: "Being the monthly subscription charges for Gumloop Starter Plan",
          entries: [
            { account: "Software Subscriptions", debit: 97.00, credit: 0, confidence: 92 },
            { account: "Suspense Account", debit: 0, credit: 97.00, confidence: 100 }
          ]
        };

      case "31": // Twitter Global LLC - X Premium Subscription
        return {
          invoiceNumber: "TWITTER-7D7DB7C2-0007",
          totalAmount: 716.30,
          entryType: "Software Subscriptions",
          narration: "Being the monthly subscription charges for X Premium",
          entries: [
            { account: "Software Subscriptions", debit: 716.30, credit: 0, confidence: 88 },
            { account: "Suspense Account", debit: 0, credit: 716.30, confidence: 100 }
          ]
        };

      case "32": // Pitch Software GmbH - Pitch Pro
        return {
          invoiceNumber: "PITCH-9A31BB6E-0001",
          totalAmount: 43.75,
          entryType: "Software Subscriptions",
          narration: "Being the monthly subscription charges for Pitch Pro (3 seats)",
          entries: [
            { account: "Software Subscriptions", debit: 43.75, credit: 0, confidence: 96 },
            { account: "Suspense Account", debit: 0, credit: 43.75, confidence: 100 }
          ]
        };

      case "33": // Calendly LLC - Teams Monthly
        return {
          invoiceNumber: "CALENDLY-13904471-1",
          totalAmount: 22.04,
          entryType: "Software Subscriptions",
          narration: "Being the monthly subscription charges for Calendly Teams",
          entries: [
            { account: "Software Subscriptions", debit: 22.04, credit: 0, confidence: 98 },
            { account: "Suspense Account", debit: 0, credit: 22.04, confidence: 100 }
          ]
        };

      case "34": // Typeform US LLC - Typeform Business
        return {
          invoiceNumber: "TYPEFORM-USIN-2025-0114021",
          totalAmount: 109.10,
          entryType: "Software Subscriptions",
          narration: "Being the monthly subscription charges for Typeform Business",
          entries: [
            { account: "Software Subscriptions", debit: 109.10, credit: 0, confidence: 97 },
            { account: "Suspense Account", debit: 0, credit: 109.10, confidence: 100 }
          ]
        };

      // Credit Card transactions without invoices (pending)
      case "35": // Stripe Inc - Payment Processing
        return {
          invoiceNumber: "PENDING-INVOICE",
          totalAmount: 299.00,
          entryType: "Payment Processing Fees",
          narration: "Being the monthly payment processing charges from Stripe (Invoice pending)",
          entries: [
            { account: "Suspense Account", debit: 299.00, credit: 0, confidence: 85 },
            { account: "Brex Card", debit: 0, credit: 299.00, confidence: 100 }
          ]
        };

      case "36": // AWS - Cloud Infrastructure
        return {
          invoiceNumber: "PENDING-INVOICE",
          totalAmount: 156.78,
          entryType: "Cloud Infrastructure",
          narration: "Being the monthly cloud infrastructure charges from AWS (Invoice pending)",
          entries: [
            { account: "Suspense Account", debit: 156.78, credit: 0, confidence: 92 },
            { account: "Brex Card", debit: 0, credit: 156.78, confidence: 100 }
          ]
        };

      case "37": // Google Cloud - Compute Services
        return {
          invoiceNumber: "PENDING-INVOICE",
          totalAmount: 89.45,
          entryType: "Cloud Infrastructure",
          narration: "Being the monthly compute services charges from Google Cloud (Invoice pending)",
          entries: [
            { account: "Suspense Account", debit: 89.45, credit: 0, confidence: 88 },
            { account: "Brex Card", debit: 0, credit: 89.45, confidence: 100 }
          ]
        };

      case "38": // Zoom Video Communications - Pro Subscription
        return {
          invoiceNumber: "PENDING-INVOICE",
          totalAmount: 149.90,
          entryType: "Software Subscriptions",
          narration: "Being the monthly subscription charges from Zoom (Invoice pending)",
          entries: [
            { account: "Suspense Account", debit: 149.90, credit: 0, confidence: 90 },
            { account: "Brex Card", debit: 0, credit: 149.90, confidence: 100 }
          ]
        };

      case "39": // Slack Technologies - Standard Plan
        return {
          invoiceNumber: "PENDING-INVOICE",
          totalAmount: 67.50,
          entryType: "Software Subscriptions",
          narration: "Being the monthly subscription charges from Slack (Invoice pending)",
          entries: [
            { account: "Suspense Account", debit: 67.50, credit: 0, confidence: 87 },
            { account: "Brex Card", debit: 0, credit: 67.50, confidence: 100 }
          ]
        };

      // TVS Client Bills
      case "40": // Billions United - Data Services
        return {
          invoiceNumber: "BU/MAR/080/21-22",
          totalAmount: 37760,
          entryType: "Data Services",
          narration: "Being the data services charges from Billions United vide invoice no. BU/MAR/080/21-22 dtd 28.03.2022",
          entries: [
            { account: "Data Services", debit: 32000, credit: 0, confidence: 95 },
            { account: "Input CGST", debit: 2880, credit: 0, confidence: 100 },
            { account: "Input SGST", debit: 2880, credit: 0, confidence: 100 },
            { account: "TDS on Professional Charges", debit: 0, credit: 3200, confidence: 100 },
            { account: "Billions United", debit: 0, credit: 34560, confidence: 100 }
          ]
        };

      case "41": // SEVENRAJ'S ESTATE AGENCY - Property Commission
        return {
          invoiceNumber: "007/23-24",
          totalAmount: 2478000,
          entryType: "Property Commission",
          narration: "Being the property commission charges for Sy.no.214, BBMP khata no.379 from SEVENRAJ'S ESTATE AGENCY vide invoice no. 007/23-24 dtd 06.10.2023",
          entries: [
            { account: "Property Commission", debit: 2100000, credit: 0, confidence: 95 },
            { account: "Input CGST", debit: 189000, credit: 0, confidence: 100 },
            { account: "Input SGST", debit: 189000, credit: 0, confidence: 100 },
            { account: "TDS on Commission", debit: 0, credit: 105000, confidence: 100 },
            { account: "SEVENRAJ'S ESTATE AGENCY", debit: 0, credit: 2373000, confidence: 100 }
          ]
        };

      case "42": // SN AY - Digital Advertising
        return {
          invoiceNumber: "01176",
          totalAmount: 985300,
          entryType: "Digital Advertising",
          narration: "Being the digital advertising boosting charges from SN AY (Something New Around You) vide invoice no. 01176 dtd 01.03.2024",
          entries: [
            { account: "Digital Advertising", debit: 835000, credit: 0, confidence: 95 },
            { account: "Input CGST", debit: 75150, credit: 0, confidence: 100 },
            { account: "Input SGST", debit: 75150, credit: 0, confidence: 100 },
            { account: "TDS on Professional Charges", debit: 0, credit: 83500, confidence: 100 },
            { account: "SN AY (Something New Around You)", debit: 0, credit: 901800, confidence: 100 }
          ]
        };

      default:
        return null;
    }
  }

  /**
   * Validates if a journal entry is balanced
   */
  static isBalanced(journalEntry: JournalEntry): boolean {
    const totalDebit = journalEntry.entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
    const totalCredit = journalEntry.entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
    return Math.abs(totalDebit - totalCredit) < 0.01; // Allow for floating point inaccuracies
  }

  /**
   * Gets total debit amount
   */
  static getTotalDebit(journalEntry: JournalEntry): number {
    return journalEntry.entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  }

  /**
   * Gets total credit amount
   */
  static getTotalCredit(journalEntry: JournalEntry): number {
    return journalEntry.entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
  }

  /**
   * Formats currency amount with symbol
   */
  static formatCurrency(amount: number, currency: 'USD' | 'INR' = 'INR'): string {
    const symbol = currency === 'USD' ? '$' : '₹';
    return `${symbol}${amount.toFixed(2)}`;
  }
} 