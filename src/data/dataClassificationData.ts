import { ClassifiedTransaction, TransactionGroup, ChartOfAccount } from '@/types/dataClassification';

export const mockChartOfAccounts: ChartOfAccount[] = [
  // Revenue Accounts
  { id: 'rev_1', name: 'Service Revenue', code: '4000', category: 'revenue', subcategory: 'Services', isActive: true },
  { id: 'rev_2', name: 'Product Sales', code: '4100', category: 'revenue', subcategory: 'Products', isActive: true },
  { id: 'rev_3', name: 'Subscription Revenue', code: '4200', category: 'revenue', subcategory: 'Subscriptions', isActive: true },
  { id: 'rev_4', name: 'Consulting Revenue', code: '4300', category: 'revenue', subcategory: 'Consulting', isActive: true },
  { id: 'rev_5', name: 'Interest Income', code: '4400', category: 'revenue', subcategory: 'Other Income', isActive: true },

  // Expense Accounts
  { id: 'exp_1', name: 'Office Rent', code: '5000', category: 'expense', subcategory: 'Facilities', isActive: true },
  { id: 'exp_2', name: 'Software Licenses', code: '5100', category: 'expense', subcategory: 'Technology', isActive: true },
  { id: 'exp_3', name: 'Marketing & Advertising', code: '5200', category: 'expense', subcategory: 'Marketing', isActive: true },
  { id: 'exp_4', name: 'Professional Services', code: '5300', category: 'expense', subcategory: 'Professional', isActive: true },
  { id: 'exp_5', name: 'Travel & Entertainment', code: '5400', category: 'expense', subcategory: 'Travel', isActive: true },
  { id: 'exp_6', name: 'Office Supplies', code: '5500', category: 'expense', subcategory: 'Supplies', isActive: true },
  { id: 'exp_7', name: 'Utilities', code: '5600', category: 'expense', subcategory: 'Facilities', isActive: true },
  { id: 'exp_8', name: 'Insurance', code: '5700', category: 'expense', subcategory: 'Insurance', isActive: true },
  { id: 'exp_9', name: 'Legal & Professional', code: '5800', category: 'expense', subcategory: 'Professional', isActive: true },
  { id: 'exp_10', name: 'Bank Fees', code: '5900', category: 'expense', subcategory: 'Banking', isActive: true },

  // Asset Accounts
  { id: 'ast_1', name: 'Cash - Operating', code: '1000', category: 'asset', subcategory: 'Current Assets', isActive: true },
  { id: 'ast_2', name: 'Accounts Receivable', code: '1100', category: 'asset', subcategory: 'Current Assets', isActive: true },
  { id: 'ast_3', name: 'Prepaid Expenses', code: '1200', category: 'asset', subcategory: 'Current Assets', isActive: true },
  { id: 'ast_4', name: 'Equipment', code: '1300', category: 'asset', subcategory: 'Fixed Assets', isActive: true },

  // Liability Accounts
  { id: 'liab_1', name: 'Accounts Payable', code: '2000', category: 'liability', subcategory: 'Current Liabilities', isActive: true },
  { id: 'liab_2', name: 'Accrued Expenses', code: '2100', category: 'liability', subcategory: 'Current Liabilities', isActive: true },

  // Equity Accounts
  { id: 'eq_1', name: 'Owner Equity', code: '3000', category: 'equity', subcategory: 'Equity', isActive: true },
  { id: 'eq_2', name: 'Retained Earnings', code: '3100', category: 'equity', subcategory: 'Equity', isActive: true },
];

export const mockClassifiedTransactions: ClassifiedTransaction[] = [
  {
    id: 'txn_1',
    date: '2025-01-15',
    amount: -2500.00,
    memo: 'OFFICE RENT - 123 MAIN ST',
    bankDescription: 'ACH TRANSFER - OFFICE RENT',
    suggestedAccount: 'Office Rent',
    confidence: 0.95,
    groupId: 'group_1',
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'txn_2',
    date: '2025-01-15',
    amount: -2500.00,
    memo: 'OFFICE RENT - 123 MAIN ST',
    bankDescription: 'ACH TRANSFER - OFFICE RENT',
    suggestedAccount: 'Office Rent',
    confidence: 0.95,
    groupId: 'group_1',
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'txn_3',
    date: '2025-01-14',
    amount: -89.99,
    memo: 'SLACK TECHNOLOGIES INC',
    bankDescription: 'CREDIT CARD - SLACK TECHNOLOGIES',
    suggestedAccount: 'Software Licenses',
    confidence: 0.88,
    groupId: 'group_2',
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'txn_4',
    date: '2025-01-14',
    amount: -89.99,
    memo: 'SLACK TECHNOLOGIES INC',
    bankDescription: 'CREDIT CARD - SLACK TECHNOLOGIES',
    suggestedAccount: 'Software Licenses',
    confidence: 0.88,
    groupId: 'group_2',
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'txn_5',
    date: '2025-01-13',
    amount: 15000.00,
    memo: 'CLIENT PAYMENT - ACME CORP',
    bankDescription: 'WIRE TRANSFER - ACME CORP',
    suggestedAccount: 'Service Revenue',
    confidence: 0.92,
    groupId: 'group_3',
    isManuallyOverridden: false,
    category: 'revenue'
  },
  {
    id: 'txn_6',
    date: '2025-01-12',
    amount: -45.00,
    memo: 'BANK SERVICE FEE',
    bankDescription: 'MONTHLY SERVICE FEE',
    suggestedAccount: 'Bank Fees',
    confidence: 0.98,
    groupId: 'group_4',
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'txn_7',
    date: '2025-01-11',
    amount: -1200.00,
    memo: 'GOOGLE CLOUD PLATFORM',
    bankDescription: 'CREDIT CARD - GOOGLE CLOUD',
    suggestedAccount: 'Software Licenses',
    confidence: 0.85,
    groupId: 'group_5',
    isManuallyOverridden: true,
    manualAccount: 'Cloud Infrastructure',
    category: 'expense'
  },
  {
    id: 'txn_8',
    date: '2025-01-10',
    amount: -350.00,
    memo: 'OFFICE SUPPLIES - STAPLES',
    bankDescription: 'CREDIT CARD - STAPLES',
    suggestedAccount: 'Office Supplies',
    confidence: 0.90,
    groupId: 'group_6',
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'txn_9',
    date: '2025-01-09',
    amount: -180.00,
    memo: 'OFFICE SUPPLIES - STAPLES',
    bankDescription: 'CREDIT CARD - STAPLES',
    suggestedAccount: 'Office Supplies',
    confidence: 0.90,
    groupId: 'group_6',
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'txn_10',
    date: '2025-01-08',
    amount: 8500.00,
    memo: 'CLIENT PAYMENT - BETA INC',
    bankDescription: 'WIRE TRANSFER - BETA INC',
    suggestedAccount: 'Service Revenue',
    confidence: 0.92,
    groupId: 'group_7',
    isManuallyOverridden: false,
    category: 'revenue'
  },
  {
    id: 'txn_11',
    date: '2025-01-07',
    amount: -37.72,
    memo: 'AMZN Mktp US*ZX7M16V Amzn.com/bill WA 01/13',
    bankDescription: 'AMAZON MARKETPLACE',
    suggestedAccount: 'Office Supplies',
    confidence: 0.75,
    groupId: 'group_8',
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'txn_12',
    date: '2025-01-06',
    amount: -6.49,
    memo: 'PRODUCE JUNCTION EGG EGG HARBOR TW NJ 07/22',
    bankDescription: 'PRODUCE JUNCTION',
    suggestedAccount: 'Meals & Entertainment',
    confidence: 0.82,
    groupId: 'group_9',
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'txn_13',
    date: '2025-01-05',
    amount: -75.00,
    memo: 'VZWRLSS*PREPAID PYMNT',
    bankDescription: 'VERIZON WIRELESS',
    suggestedAccount: 'Utilities',
    confidence: 0.90,
    groupId: 'group_10',
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'txn_14',
    date: '2025-01-04',
    amount: -15.50,
    memo: 'WAWA',
    bankDescription: 'WAWA CONVENIENCE STORE',
    suggestedAccount: 'Meals & Entertainment',
    confidence: 0.85,
    groupId: 'group_11',
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'txn_15',
    date: '2025-01-03',
    amount: -25.00,
    memo: 'INT*QuickBooks Online',
    bankDescription: 'QUICKBOOKS ONLINE',
    suggestedAccount: 'Software Licenses',
    confidence: 0.95,
    groupId: 'group_12',
    isManuallyOverridden: false,
    category: 'expense'
  }
];

export const mockTransactionGroups: TransactionGroup[] = [
  {
    id: 'group_1',
    memoPattern: 'OFFICE RENT - 123 MAIN ST',
    suggestedAccount: 'Office Rent',
    confidence: 0.95,
    transactionCount: 2,
    totalAmount: -5000.00,
    transactions: mockClassifiedTransactions.filter(t => t.groupId === 'group_1'),
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'group_2',
    memoPattern: 'SLACK TECHNOLOGIES INC',
    suggestedAccount: 'Software Licenses',
    confidence: 0.88,
    transactionCount: 2,
    totalAmount: -179.98,
    transactions: mockClassifiedTransactions.filter(t => t.groupId === 'group_2'),
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'group_3',
    memoPattern: 'CLIENT PAYMENT - ACME CORP',
    suggestedAccount: 'Service Revenue',
    confidence: 0.92,
    transactionCount: 1,
    totalAmount: 15000.00,
    transactions: mockClassifiedTransactions.filter(t => t.groupId === 'group_3'),
    isManuallyOverridden: false,
    category: 'revenue'
  },
  {
    id: 'group_4',
    memoPattern: 'BANK SERVICE FEE',
    suggestedAccount: 'Bank Fees',
    confidence: 0.98,
    transactionCount: 1,
    totalAmount: -45.00,
    transactions: mockClassifiedTransactions.filter(t => t.groupId === 'group_4'),
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'group_5',
    memoPattern: 'GOOGLE CLOUD PLATFORM',
    suggestedAccount: 'Software Licenses',
    confidence: 0.85,
    transactionCount: 1,
    totalAmount: -1200.00,
    transactions: mockClassifiedTransactions.filter(t => t.groupId === 'group_5'),
    isManuallyOverridden: true,
    manualAccount: 'Cloud Infrastructure',
    category: 'expense'
  },
  {
    id: 'group_6',
    memoPattern: 'OFFICE SUPPLIES - STAPLES',
    suggestedAccount: 'Office Supplies',
    confidence: 0.90,
    transactionCount: 2,
    totalAmount: -530.00,
    transactions: mockClassifiedTransactions.filter(t => t.groupId === 'group_6'),
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'group_7',
    memoPattern: 'CLIENT PAYMENT - BETA INC',
    suggestedAccount: 'Service Revenue',
    confidence: 0.92,
    transactionCount: 1,
    totalAmount: 8500.00,
    transactions: mockClassifiedTransactions.filter(t => t.groupId === 'group_7'),
    isManuallyOverridden: false,
    category: 'revenue'
  },
  {
    id: 'group_8',
    memoPattern: 'AMZN Mktp US*ZX7M16V Amzn.com/bill WA 01/13',
    suggestedAccount: 'Office Supplies',
    confidence: 0.75,
    transactionCount: 1,
    totalAmount: -37.72,
    transactions: mockClassifiedTransactions.filter(t => t.groupId === 'group_8'),
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'group_9',
    memoPattern: 'PRODUCE JUNCTION EGG EGG HARBOR TW NJ 07/22',
    suggestedAccount: 'Meals & Entertainment',
    confidence: 0.82,
    transactionCount: 1,
    totalAmount: -6.49,
    transactions: mockClassifiedTransactions.filter(t => t.groupId === 'group_9'),
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'group_10',
    memoPattern: 'VZWRLSS*PREPAID PYMNT',
    suggestedAccount: 'Utilities',
    confidence: 0.90,
    transactionCount: 1,
    totalAmount: -75.00,
    transactions: mockClassifiedTransactions.filter(t => t.groupId === 'group_10'),
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'group_11',
    memoPattern: 'WAWA',
    suggestedAccount: 'Meals & Entertainment',
    confidence: 0.85,
    transactionCount: 1,
    totalAmount: -15.50,
    transactions: mockClassifiedTransactions.filter(t => t.groupId === 'group_11'),
    isManuallyOverridden: false,
    category: 'expense'
  },
  {
    id: 'group_12',
    memoPattern: 'INT*QuickBooks Online',
    suggestedAccount: 'Software Licenses',
    confidence: 0.95,
    transactionCount: 1,
    totalAmount: -25.00,
    transactions: mockClassifiedTransactions.filter(t => t.groupId === 'group_12'),
    isManuallyOverridden: false,
    category: 'expense'
  }
];
