export interface Transaction {
  id: string;
  vendor: string;
  amount: number;
  date: string;
  type: 'invoice' | 'contract' | 'credit-card' | 'bill' | 'fixed-asset' | 'payment' | 'receipt';
  client: string;
  currency?: 'USD' | 'INR';
  confidence?: number;
  isDuplicate?: boolean;
  isRecurring?: boolean;
  pdfFile?: string;
  invoiceNumber?: string;
  documentUrl?: string;
  
  // Contract-specific fields
  contractValue?: number;
  contractTerm?: string;
  billingCycle?: 'monthly' | 'quarterly' | 'Annual';
  contractStartDate?: string;
  contractEndDate?: string;
  // Add missing fields for compatibility
  status?: 'unread' | 'review' | 'approved' | 'done';
  source?: 'email' | 'drive' | 'brex' | 'ramp' | 'bank';
  description?: string;
}

export interface JournalEntry {
  client: string;
  invoiceNumber: string;
  totalAmount: number;
  entryType: string;
  narration: string;
  isRecurring?: boolean;
  isBillable?: boolean;
  costCenter?: string;
  location?: string;
  entries: JournalEntryLine[];
}

export interface JournalEntryLine {
  account: string;
  debit: number;
  credit: number;
  confidence: number;
}

export interface DeferredRevenueSchedule {
  period: string;
  monthlyRevenue: number;
  deferredRevenue: number;
  recognized: number;
}

export interface AnalysisStep {
  step: number;
  title: string;
  status: 'complete' | 'pending' | 'error';
  confidence: number;
  result: string;
}

export interface VendorLedgerEntry {
  invoiceNumber: string;
  date: string;
  amount: number;
  type: string;
  status: string;
}

export interface AnalysisResult {
  steps: AnalysisStep[];
  summary: string;
  journalEntry: JournalEntry;
  deferredRevenueSchedule?: DeferredRevenueSchedule[];
  vendorBalance: number;
  pastEntries: VendorLedgerEntry[];
} 