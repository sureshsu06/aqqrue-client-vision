import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReconScorecard } from '@/components/reconciliation/ReconScorecard';
import { ReconciliationTable } from '@/components/reconciliation/ReconciliationTable';
import { StripeReconciliationTable } from '@/components/reconciliation/StripeReconciliationTable';
import { DeferredRevenueReconciliationTable } from '@/components/reconciliation/DeferredRevenueReconciliationTable';
import { DeferredRevenueReconciliationEnhanced } from '@/components/reconciliation/DeferredRevenueReconciliationEnhanced';
import { AISuggestions } from '@/components/reconciliation/AISuggestions';
import { VarianceBreakdown } from '@/components/reconciliation/VarianceBreakdown';
import { 
  Banknote, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Settings,
  RefreshCw,
  Download,
  ChevronDown,
  Search,
  Filter,
  MoreHorizontal,
  FileText
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

// Mock data for reconciliations
const reconciliationData = {
  "Bank A - Chase Operating": {
    accountNumber: "****1123",
    period: "September 2025",
    lastUpdated: "2h ago",
    bankBalance: 128420,
    glBalance: 126892,
    difference: 1528,
    variancePercent: 1.2,
    status: "in_progress",
    transactions: {
      imported: 312,
      matched: 297,
      unmatched: 15
    },
    keyFindings: "1.2% variance due to pending Stripe payouts ($1,200) and unposted interest income ($328). All transactions above $500 verified and matched.",
    varianceBreakdown: [
      { description: "Pending Payouts (Stripe)", amount: 1200 },
      { description: "Unrecorded Interest Income", amount: 328 },
      { description: "Old Outstanding Checks", amount: 0 }
    ],
    bankTransactions: [
      {
        id: 1,
        date: "09/15",
        description: "Stripe payout batch #342",
        amount: 12234,
        match: "matched" as const,
        jeReference: "JE-STRP-DEC25-003",
        notes: "",
        bankDate: "09/15",
        bankDescription: "Stripe payout batch #342",
        bankAmount: 12234,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20250915_342",
        glDate: "09/17",
        glEntry: "JE-STRP-DEC25-003",
        glAccount: "Stripe Clearing → Bank",
        glAmount: 12234,
        glJeId: "JE-STRP-DEC25-003"
      },
      {
        id: 2,
        date: "09/18",
        description: "AWS charges",
        amount: 642,
        match: "suggested" as const,
        suggestedMatch: "Unbilled invoice #AWS-455",
        notes: "JNVEC!!MO",
        confidence: 87,
        bankDate: "09/18",
        bankDescription: "AWS charges",
        bankAmount: 642,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20250918_642",
        glDate: "09/20",
        glEntry: "Unbilled invoice #AWS-455",
        glAccount: "AWS Services",
        glAmount: 642,
        glJeId: "INV-AWS-455"
      },
      {
        id: 3,
        date: "09/22",
        description: "Interest income",
        amount: 328,
        match: "no_match" as const,
        notes: "Accrue interest",
        bankDate: "09/22",
        bankDescription: "Interest income",
        bankAmount: 328,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20250922_328"
      },
      {
        id: 4,
        date: "09/20",
        description: "Office rent payment",
        amount: 2500,
        match: "matched" as const,
        jeReference: "JE-RENT-SEP25-001",
        notes: "",
        bankDate: "09/20",
        bankDescription: "Office rent payment",
        bankAmount: 2500,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20250920_2500",
        glDate: "09/22",
        glEntry: "JE-RENT-SEP25-001",
        glAccount: "Rent Expense",
        glAmount: 2500,
        glJeId: "JE-RENT-SEP25-001"
      },
      {
        id: 5,
        date: "09/25",
        description: "Vendor payment - Acme Corp",
        amount: 1200,
        match: "suggested" as const,
        suggestedMatch: "Invoice #ACME-2025-001",
        notes: "Pending approval",
        confidence: 92,
        bankDate: "09/25",
        bankDescription: "Vendor payment - Acme Corp",
        bankAmount: 1200,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20250925_1200",
        glDate: "09/27",
        glEntry: "Invoice #ACME-2025-001",
        glAccount: "Accounts Payable",
        glAmount: 1200,
        glJeId: "INV-ACME-2025-001"
      },
      {
        id: 6,
        date: "09/26",
        description: "Office supplies purchase",
        amount: 89,
        match: "matched" as const,
        jeReference: "JE-SUPPLIES-SEP25-002",
        notes: "",
        bankDate: "09/26",
        bankDescription: "Office supplies purchase",
        bankAmount: 89,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20250926_89",
        glDate: "09/28",
        glEntry: "JE-SUPPLIES-SEP25-002",
        glAccount: "Office Supplies",
        glAmount: 89,
        glJeId: "JE-SUPPLIES-SEP25-002"
      },
      {
        id: 7,
        date: "09/27",
        description: "Software subscription",
        amount: 299,
        match: "suggested" as const,
        suggestedMatch: "Monthly SaaS subscription",
        notes: "Recurring charge",
        confidence: 94,
        bankDate: "09/27",
        bankDescription: "Software subscription",
        bankAmount: 299,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20250927_299",
        glDate: "09/29",
        glEntry: "Monthly SaaS subscription",
        glAccount: "Software Expenses",
        glAmount: 299,
        glJeId: "SUB-SEP25-001"
      },
      {
        id: 8,
        date: "09/28",
        description: "Client payment received",
        amount: 5500,
        match: "matched" as const,
        jeReference: "JE-CLIENT-SEP25-003",
        notes: "",
        bankDate: "09/28",
        bankDescription: "Client payment received",
        bankAmount: 5500,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20250928_5500",
        glDate: "09/30",
        glEntry: "JE-CLIENT-SEP25-003",
        glAccount: "Accounts Receivable",
        glAmount: 5500,
        glJeId: "JE-CLIENT-SEP25-003"
      },
      {
        id: 9,
        date: "09/29",
        description: "Bank fees",
        amount: 25,
        match: "no_match" as const,
        notes: "Monthly maintenance fee",
        bankDate: "09/29",
        bankDescription: "Bank fees",
        bankAmount: 25,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20250929_25"
      },
      {
        id: 10,
        date: "09/30",
        description: "Equipment purchase",
        amount: 1200,
        match: "suggested" as const,
        suggestedMatch: "Laptop purchase - IT equipment",
        notes: "Capital expenditure",
        confidence: 91,
        bankDate: "09/30",
        bankDescription: "Equipment purchase",
        bankAmount: 1200,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20250930_1200",
        glDate: "10/02",
        glEntry: "Laptop purchase - IT equipment",
        glAccount: "Fixed Assets",
        glAmount: 1200,
        glJeId: "CAP-IT-2025-001"
      },
      {
        id: 11,
        date: "10/01",
        description: "Marketing campaign",
        amount: 850,
        match: "matched" as const,
        jeReference: "JE-MARKETING-OCT25-001",
        notes: "",
        bankDate: "10/01",
        bankDescription: "Marketing campaign",
        bankAmount: 850,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20251001_850",
        glDate: "10/03",
        glEntry: "JE-MARKETING-OCT25-001",
        glAccount: "Marketing Expenses",
        glAmount: 850,
        glJeId: "JE-MARKETING-OCT25-001"
      },
      {
        id: 12,
        date: "10/02",
        description: "Insurance premium",
        amount: 450,
        match: "suggested" as const,
        suggestedMatch: "Business insurance premium",
        notes: "Quarterly payment",
        confidence: 88,
        bankDate: "10/02",
        bankDescription: "Insurance premium",
        bankAmount: 450,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20251002_450",
        glDate: "10/04",
        glEntry: "Business insurance premium",
        glAccount: "Insurance Expense",
        glAmount: 450,
        glJeId: "INS-Q4-2025"
      },
      {
        id: 13,
        date: "10/03",
        description: "Consulting fees",
        amount: 1800,
        match: "no_match" as const,
        notes: "External consultant",
        bankDate: "10/03",
        bankDescription: "Consulting fees",
        bankAmount: 1800,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20251003_1800"
      },
      {
        id: 14,
        date: "10/04",
        description: "Utilities payment",
        amount: 320,
        match: "matched" as const,
        jeReference: "JE-UTILITIES-OCT25-001",
        notes: "",
        bankDate: "10/04",
        bankDescription: "Utilities payment",
        bankAmount: 320,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20251004_320",
        glDate: "10/06",
        glEntry: "JE-UTILITIES-OCT25-001",
        glAccount: "Utilities Expense",
        glAmount: 320,
        glJeId: "JE-UTILITIES-OCT25-001"
      },
      {
        id: 15,
        date: "10/05",
        description: "Travel expenses",
        amount: 750,
        match: "suggested" as const,
        suggestedMatch: "Business travel reimbursement",
        notes: "Employee travel",
        confidence: 93,
        bankDate: "10/05",
        bankDescription: "Travel expenses",
        bankAmount: 750,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20251005_750",
        glDate: "10/07",
        glEntry: "Business travel reimbursement",
        glAccount: "Travel Expense",
        glAmount: 750,
        glJeId: "TRAVEL-OCT25-001"
      }
    ],
    aiSuggestions: [
      {
        id: "suggestion-1",
        type: "match" as const,
        description: "Match AWS charges to unbilled invoice #AWS-455",
        confidence: 87,
        amount: 642,
        suggestedAction: "Create journal entry to match bank transaction with GL",
        reasoning: "Amount and date match exactly with pending invoice. Vendor pattern consistent with previous AWS transactions."
      },
      {
        id: "suggestion-2",
        type: "accrual" as const,
        description: "Create interest income accrual for $328",
        confidence: 95,
        amount: 328,
        suggestedAction: "Post interest income accrual entry",
        reasoning: "Bank shows interest income that hasn't been recorded in GL. Standard monthly interest accrual pattern."
      },
      {
        id: "suggestion-3",
        type: "match" as const,
        description: "Match vendor payment to invoice #ACME-2025-001",
        confidence: 92,
        amount: 1200,
        suggestedAction: "Link payment to existing invoice",
        reasoning: "Payment amount matches outstanding invoice. Vendor name and amount pattern consistent."
      }
    ],
    activityLog: [
      {
        user: "Aqqrue Agent",
        action: "Matched 12 Stripe payouts",
        confidence: 96,
        timestamp: "2h ago"
      },
      {
        user: "Priya",
        action: "Confirmed interest income accrual required",
        timestamp: "4h ago"
      },
      {
        user: "Controller",
        action: "Approved recon for posting",
        timestamp: "6h ago"
      }
    ]
  },
  "Bank B - SVB Reserve": {
    accountNumber: "****4567",
    period: "September 2025",
    lastUpdated: "1h ago",
    bankBalance: 45000,
    glBalance: 45000,
    difference: 0,
    variancePercent: 0,
    status: "complete",
    transactions: {
      imported: 45,
      matched: 45,
      unmatched: 0
    },
    keyFindings: "Perfect reconciliation with no variance.",
    varianceBreakdown: [],
    bankTransactions: [],
    activityLog: []
  },
  "Stripe Payout Reconciliation": {
    accountNumber: "STRIPE-001",
    period: "September 2025",
    lastUpdated: "30m ago",
    bankBalance: 247392,
    glBalance: 241455,
    difference: 5937,
    variancePercent: 2.4,
    status: "in_progress",
    transactions: {
      imported: 247,
      matched: 241,
      unmatched: 6
    },
    keyFindings: "2.4% variance due to pending payouts ($12,234) and failed transactions ($6,200).",
    varianceBreakdown: [
      { description: "Pending Payouts (Stripe)", amount: 12234 },
      { description: "Failed Transactions", amount: 6200 }
    ],
    bankTransactions: [
      {
        id: 1,
        date: "09/15",
        description: "Stripe payout batch #342",
        amount: 12234,
        match: "matched" as const,
        jeReference: "JE-STRP-SEP25-001",
        notes: "",
        bankDate: "09/15",
        bankDescription: "Stripe payout batch #342",
        bankAmount: 12234,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20250915_12234",
        glDate: "09/17",
        glEntry: "JE-STRP-SEP25-001",
        glAccount: "Stripe Clearing → Bank",
        glAmount: 12234,
        glJeId: "JE-STRP-SEP25-001",
        stripeFees: 245,
        netAmount: 11989
      },
      {
        id: 2,
        date: "09/18",
        description: "Stripe payout batch #343",
        amount: 8567,
        match: "suggested" as const,
        suggestedMatch: "Stripe payout with fees",
        notes: "Pending fee reconciliation",
        confidence: 92,
        bankDate: "09/18",
        bankDescription: "Stripe payout batch #343",
        bankAmount: 8567,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20250918_8567",
        glDate: "09/20",
        glEntry: "Stripe payout with fees",
        glAccount: "Stripe Clearing → Bank",
        glAmount: 8567,
        glJeId: "STRP-343",
        stripeFees: 171,
        netAmount: 8396
      },
      {
        id: 3,
        date: "09/22",
        description: "Stripe payout batch #344",
        amount: 15420,
        match: "matched" as const,
        jeReference: "JE-STRP-SEP25-002",
        notes: "",
        bankDate: "09/22",
        bankDescription: "Stripe payout batch #344",
        bankAmount: 15420,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20250922_15420",
        glDate: "09/24",
        glEntry: "JE-STRP-SEP25-002",
        glAccount: "Stripe Clearing → Bank",
        glAmount: 15420,
        glJeId: "JE-STRP-SEP25-002",
        stripeFees: 308,
        netAmount: 15112
      },
      {
        id: 4,
        date: "09/25",
        description: "Stripe payout batch #345",
        amount: 9876,
        match: "no_match" as const,
        notes: "Fee discrepancy",
        bankDate: "09/25",
        bankDescription: "Stripe payout batch #345",
        bankAmount: 9876,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20250925_9876",
        stripeFees: 198,
        netAmount: 9678
      },
      {
        id: 5,
        date: "09/28",
        description: "Stripe payout batch #346",
        amount: 11234,
        match: "suggested" as const,
        suggestedMatch: "Stripe payout with fees",
        notes: "AI suggested match",
        confidence: 89,
        bankDate: "09/28",
        bankDescription: "Stripe payout batch #346",
        bankAmount: 11234,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20250928_11234",
        glDate: "09/30",
        glEntry: "Stripe payout with fees",
        glAccount: "Stripe Clearing → Bank",
        glAmount: 11234,
        glJeId: "STRP-346",
        stripeFees: 225,
        netAmount: 11009
      },
      {
        id: 6,
        date: "09/30",
        description: "Stripe payout batch #347",
        amount: 6789,
        match: "matched" as const,
        jeReference: "JE-STRP-SEP25-003",
        notes: "",
        bankDate: "09/30",
        bankDescription: "Stripe payout batch #347",
        bankAmount: 6789,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20250930_6789",
        glDate: "10/02",
        glEntry: "JE-STRP-SEP25-003",
        glAccount: "Stripe Clearing → Bank",
        glAmount: 6789,
        glJeId: "JE-STRP-SEP25-003",
        stripeFees: 136,
        netAmount: 6653
      },
      {
        id: 7,
        date: "10/02",
        description: "Stripe payout batch #348",
        amount: 14567,
        match: "suggested" as const,
        suggestedMatch: "Stripe payout with fees",
        notes: "Large payout batch",
        confidence: 95,
        bankDate: "10/02",
        bankDescription: "Stripe payout batch #348",
        bankAmount: 14567,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20251002_14567",
        glDate: "10/04",
        glEntry: "Stripe payout with fees",
        glAccount: "Stripe Clearing → Bank",
        glAmount: 14567,
        glJeId: "STRP-348",
        stripeFees: 291,
        netAmount: 14276
      },
      {
        id: 8,
        date: "10/05",
        description: "Stripe payout batch #349",
        amount: 9234,
        match: "matched" as const,
        jeReference: "JE-STRP-OCT25-001",
        notes: "",
        bankDate: "10/05",
        bankDescription: "Stripe payout batch #349",
        bankAmount: 9234,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20251005_9234",
        glDate: "10/07",
        glEntry: "JE-STRP-OCT25-001",
        glAccount: "Stripe Clearing → Bank",
        glAmount: 9234,
        glJeId: "JE-STRP-OCT25-001",
        stripeFees: 185,
        netAmount: 9049
      },
      {
        id: 9,
        date: "10/08",
        description: "Stripe payout batch #350",
        amount: 7654,
        match: "no_match" as const,
        notes: "Fee calculation error",
        bankDate: "10/08",
        bankDescription: "Stripe payout batch #350",
        bankAmount: 7654,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20251008_7654",
        stripeFees: 153,
        netAmount: 7501
      },
      {
        id: 10,
        date: "10/10",
        description: "Stripe payout batch #351",
        amount: 13456,
        match: "suggested" as const,
        suggestedMatch: "Stripe payout with fees",
        notes: "Weekend batch",
        confidence: 87,
        bankDate: "10/10",
        bankDescription: "Stripe payout batch #351",
        bankAmount: 13456,
        bankSource: "Chase feed",
        bankTxnId: "CHS_20251010_13456",
        glDate: "10/12",
        glEntry: "Stripe payout with fees",
        glAccount: "Stripe Clearing → Bank",
        glAmount: 13456,
        glJeId: "STRP-351",
        stripeFees: 269,
        netAmount: 13187
      }
    ],
    aiSuggestions: [],
    activityLog: []
  },
  "Gusto Payroll Clearing": {
    accountNumber: "GUSTO-001",
    period: "September 2025",
    lastUpdated: "1h ago",
    bankBalance: 15000,
    glBalance: 15000,
    difference: 0,
    variancePercent: 0,
    status: "complete",
    transactions: {
      imported: 45,
      matched: 45,
      unmatched: 0
    },
    keyFindings: "Perfect reconciliation with no variance.",
    varianceBreakdown: [],
    bankTransactions: [],
    aiSuggestions: [],
    activityLog: []
  },
  "Deferred Revenue": {
    accountNumber: "DEF-REV-001",
    period: "September 2025",
    lastUpdated: "3h ago",
    bankBalance: 75000,
    glBalance: 72000,
    difference: 3000,
    variancePercent: 4.0,
    status: "in_progress",
    transactions: {
      imported: 23,
      matched: 20,
      unmatched: 3
    },
    keyFindings: "4.0% variance due to unrecognized revenue from new contracts.",
    bankTransactions: [],
    aiSuggestions: [],
    activityLog: [],
    // Enhanced Deferred Revenue data following the spec
    scorecards: {
      contractRevenue: 187999,
      recognizedYTD: 125400,
      deferredGLBalance: 62599,
      reconVariance: -3000,
      percentRecognized: 66.7,
      openObligations: 5
    },
    contracts: [
      {
        id: "contract-1",
        contractId: "CON-2025-001",
        customer: "Clipper Media Acquisition I, LLC",
        product: "SaaS — Annual",
        invoiceId: "INV-2025-001",
        invoiceDate: "2025-09-01",
        invoiceAmount: 7999,
        contractValue: 7999,
        recognizedYTD: 4363,
        remainingToRecognize: 3636,
        expectedThisPeriod: 727,
        recognitionMethod: "straight-line" as const,
        confidence: 95,
        status: "matched" as const,
        schedule: [
          { period: "2025-09", amount: 727, revenueCode: "SaaS-001", confidence: 95 },
          { period: "2025-10", amount: 727, revenueCode: "SaaS-001", confidence: 95 },
          { period: "2025-11", amount: 727, revenueCode: "SaaS-001", confidence: 95 }
        ]
      },
      {
        id: "contract-2",
        contractId: "CON-2025-002",
        customer: "Bishop Wisecarver",
        product: "Manufacturing Services",
        invoiceId: "INV-2025-002",
        invoiceDate: "2025-10-01",
        invoiceAmount: 15000,
        contractValue: 15000,
        recognizedYTD: 0,
        remainingToRecognize: 15000,
        expectedThisPeriod: 1500,
        recognitionMethod: "straight-line" as const,
        confidence: 0,
        status: "unreconciled" as const,
        schedule: [
          { period: "2025-10", amount: 1500, revenueCode: "MFG-001", confidence: 0 },
          { period: "2025-11", amount: 1500, revenueCode: "MFG-001", confidence: 0 }
        ]
      },
      {
        id: "contract-3",
        contractId: "CON-2025-003",
        customer: "MARKETview Technology, LLC",
        product: "Technology Services",
        invoiceId: "INV-2025-003",
        invoiceDate: "2025-07-01",
        invoiceAmount: 95000,
        contractValue: 95000,
        recognizedYTD: 15000,
        remainingToRecognize: 80000,
        expectedThisPeriod: 2500,
        recognitionMethod: "straight-line" as const,
        confidence: 87,
        status: "suggested" as const,
        schedule: [
          { period: "2025-09", amount: 2500, revenueCode: "TECH-001", confidence: 87 },
          { period: "2025-10", amount: 2500, revenueCode: "TECH-001", confidence: 87 }
        ]
      },
      {
        id: "contract-4",
        contractId: "CON-2025-004",
        customer: "TechCorp Solutions",
        product: "Software License",
        invoiceId: "INV-2025-004",
        invoiceDate: "2025-01-01",
        invoiceAmount: 24000,
        contractValue: 24000,
        recognizedYTD: 18000,
        remainingToRecognize: 6000,
        expectedThisPeriod: 2000,
        recognitionMethod: "straight-line" as const,
        confidence: 100,
        status: "matched" as const,
        schedule: [
          { period: "2025-09", amount: 2000, revenueCode: "SW-001", confidence: 100 },
          { period: "2025-10", amount: 2000, revenueCode: "SW-001", confidence: 100 }
        ]
      },
      {
        id: "contract-5",
        contractId: "CON-2025-005",
        customer: "StartupXYZ Inc",
        product: "Consulting Services",
        invoiceId: "INV-2025-005",
        invoiceDate: "2025-03-15",
        invoiceAmount: 36000,
        contractValue: 36000,
        recognizedYTD: 18000,
        remainingToRecognize: 18000,
        expectedThisPeriod: 0,
        recognitionMethod: "straight-line" as const,
        confidence: 100,
        status: "matched" as const,
        schedule: []
      }
    ],
    glLines: [
      {
        id: "gl-1",
        account: "2300",
        accountName: "Deferred Revenue",
        jeId: "JE-DR-0925-001",
        balance: 3636,
        linkedContracts: ["CON-2025-001"],
        notes: "Clipper Media contract",
        status: "matched" as const,
        confidence: 95
      },
      {
        id: "gl-2",
        account: "2300",
        accountName: "Deferred Revenue",
        jeId: "JE-DR-0925-002",
        balance: 80000,
        linkedContracts: ["CON-2025-003"],
        notes: "MARKETview contract",
        status: "suggested" as const,
        confidence: 87
      },
      {
        id: "gl-3",
        account: "2300",
        accountName: "Deferred Revenue",
        jeId: "JE-DR-0925-003",
        balance: 6000,
        linkedContracts: ["CON-2025-004"],
        notes: "TechCorp contract",
        status: "matched" as const,
        confidence: 100
      },
      {
        id: "gl-4",
        account: "2300",
        accountName: "Deferred Revenue",
        balance: 15000,
        linkedContracts: [],
        notes: "Unapplied cash - needs investigation",
        status: "unreconciled" as const,
        cutoffRisk: true
      }
    ],
    varianceBreakdown: [
      {
        category: "Unrecognized Revenue",
        amount: 1500,
        percentage: 50.0,
        description: "Contracts with recognition scheduled this period but not posted",
        action: "Create JE"
      },
      {
        category: "Unapplied Cash",
        amount: 15000,
        percentage: 50.0,
        description: "Invoiced but not linked to contracts",
        action: "Attach Invoice"
      },
      {
        category: "Timing Differences",
        amount: 0,
        percentage: 0.0,
        description: "Cutoff adjustments",
        action: "Review Cutoff"
      },
      {
        category: "Manual Adjustments",
        amount: 0,
        percentage: 0.0,
        description: "Prior period corrections",
        action: "Review History"
      }
    ]
  }
};

const reconciliationTypes = [
  { id: "bank-a", name: "Bank A (Chase)", icon: Banknote, status: "in_progress" },
  { id: "bank-b", name: "Bank B (SVB)", icon: Banknote, status: "complete" },
  { id: "stripe", name: "Stripe Payouts", icon: CreditCard, status: "in_progress" },
  { id: "payroll", name: "Payroll Clearing", icon: DollarSign, status: "complete" },
  { id: "deferred", name: "Deferred Revenue", icon: TrendingUp, status: "pending" }
];

export default function Reconciliations() {
  const [searchParams] = useSearchParams();
  const [selectedReconciliation, setSelectedReconciliation] = useState("Bank A - Chase Operating");
  
  useEffect(() => {
    const type = (searchParams.get('type') || '').toLowerCase();
    if (type === 'stripe') {
      setSelectedReconciliation("Stripe Payout Reconciliation");
    } else if (type === 'deferred') {
      setSelectedReconciliation("Deferred Revenue");
    }
  }, [searchParams]);
  const [selectedMonth, setSelectedMonth] = useState("September 2025");
  const [selectedEntity, setSelectedEntity] = useState("US Parent");
  const [closeStatus, setCloseStatus] = useState("Open");

  const currentData = reconciliationData[selectedReconciliation as keyof typeof reconciliationData];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in_progress":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "pending":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-50 text-green-700 border-green-200";
      case "in_progress":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "pending":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Reconciliation Header with Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium text-slate-900">Reconciliations (5)</h2>
            
            <Select value={selectedReconciliation} onValueChange={setSelectedReconciliation}>
              <SelectTrigger className="w-48 h-6 text-xs">
                <SelectValue placeholder="Select reconciliation" />
              </SelectTrigger>
              <SelectContent className="max-h-32">
                <SelectItem value="Bank A - Chase Operating" className="py-0.5 text-xs">
                  <span>Chase Operating</span>
                </SelectItem>
                <SelectItem value="Bank B - SVB Reserve" className="py-0.5 text-xs">
                  <span>SVB Reserve</span>
                </SelectItem>
                <SelectItem value="Stripe Payout Reconciliation" className="py-0.5 text-xs">
                  <span>Stripe Payouts</span>
                </SelectItem>
                <SelectItem value="Gusto Payroll Clearing" className="py-0.5 text-xs">
                  <span>Payroll Clearing</span>
                </SelectItem>
                <SelectItem value="Deferred Revenue" className="py-0.5 text-xs">
                  <span>Deferred Revenue</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Full Width Reconciliation View */}
      <div className="flex-1">
          {currentData && (
            <>
              {/* Header */}
              <div className="bg-white border-b border-slate-200 px-4 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-sm font-semibold text-slate-900">
                        {selectedReconciliation}
                      </h2>
                      <div className="flex items-center space-x-1">
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-slate-600">
                      <span>Account #: {currentData.accountNumber}</span>
                      <span>•</span>
                      <span>Period: {currentData.period}</span>
                      <span>•</span>
                      <span>Updated: {currentData.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>


              {/* Main Content Area */}
              <div className="bg-white p-4">
                <div className="w-full space-y-4">

                  {/* Reconciliation Table */}
                  {selectedReconciliation === "Stripe Payout Reconciliation" ? (
                    <StripeReconciliationTable
                      transactions={currentData.bankTransactions as any}
                      summary={{
                        imported: (currentData as any).transactions?.imported || (currentData as any).bankTransactions?.length || 0,
                        matched: (currentData as any).transactions?.matched || 0,
                        unmatched: (currentData as any).transactions?.unmatched || 0,
                        bankTotal: (currentData as any).bankBalance,
                        glTotal: (currentData as any).glBalance,
                        variancePercent: (currentData as any).variancePercent,
                        varianceBreakdown: (currentData as any).varianceBreakdown?.map((v: any) => v.description) || undefined,
                      }}
                      onTransactionClick={(transaction) => {
                        console.log('Stripe transaction clicked:', transaction);
                        // Handle transaction click - could open side panel
                      }}
                    />
                  ) : selectedReconciliation === "Deferred Revenue" ? (
                    <DeferredRevenueReconciliationEnhanced
                      scorecards={(currentData as any).scorecards || {}}
                      contracts={(currentData as any).contracts || []}
                      glLines={(currentData as any).glLines || []}
                      varianceBreakdown={(currentData as any).varianceBreakdown || []}
                      onContractClick={(contract) => {
                        console.log('Contract clicked:', contract);
                        // Handle contract click - could open side panel
                      }}
                      onGLLineClick={(glLine) => {
                        console.log('GL Line clicked:', glLine);
                        // Handle GL line click - could open side panel
                      }}
                      onCreateJE={(data) => {
                        console.log('Create JE:', data);
                        // Handle JE creation
                      }}
                      onRequestReview={() => {
                        console.log('Request review');
                        // Handle review request
                      }}
                    />
                  ) : (
                    <ReconciliationTable
                      transactions={currentData.bankTransactions}
                      onTransactionClick={(transaction) => {
                        console.log('Transaction clicked:', transaction);
                        // Handle transaction click - could open side panel
                      }}
                    />
                  )}


                </div>
              </div>
            </>
          )}
        </div>
      </div>

  );
}
