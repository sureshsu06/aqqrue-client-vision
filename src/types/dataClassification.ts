export interface ClassifiedTransaction {
  id: string;
  date: string;
  amount: number;
  memo: string;
  bankDescription: string;
  suggestedAccount: string;
  confidence: number;
  groupId: string;
  isManuallyOverridden: boolean;
  manualAccount?: string;
  category: 'revenue' | 'expense' | 'asset' | 'liability' | 'equity';
}

export interface TransactionGroup {
  id: string;
  memoPattern: string;
  suggestedAccount: string;
  confidence: number;
  transactionCount: number;
  totalAmount: number;
  transactions: ClassifiedTransaction[];
  isManuallyOverridden: boolean;
  manualAccount?: string;
}

export interface ChartOfAccount {
  id: string;
  name: string;
  code: string;
  category: 'revenue' | 'expense' | 'asset' | 'liability' | 'equity';
  subcategory?: string;
  parentId?: string;
  isActive: boolean;
}

export interface UploadStatus {
  isUploading: boolean;
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  message: string;
  fileName?: string;
}

export interface ClassificationFilters {
  account: string;
  category: string;
  confidence: 'all' | 'high' | 'medium' | 'low';
  groupSize: 'all' | 'single' | 'multiple';
  overrideStatus: 'all' | 'auto' | 'manual';
}

export interface BulkAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  action: (transactionIds: string[]) => void;
}
