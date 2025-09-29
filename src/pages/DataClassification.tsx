import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Users,
  DollarSign,
  TrendingUp,
  Filter,
  Search,
  X,
  Save,
  CheckCircle
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { mockTransactionGroups, mockChartOfAccounts } from "@/data/dataClassificationData";
import { ClassifiedTransaction, TransactionGroup, ClassificationFilters } from "@/types/dataClassification";
import { cn } from "@/lib/utils";
import { parseExcelFile } from "@/lib/excelParser";
import { getDataSourceLogo } from "@/lib/dataSourceLogos";

const DataClassification = () => {
  const [groups, setGroups] = useState<TransactionGroup[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedTransactions, setExpandedTransactions] = useState<Set<string>>(new Set());
  
  // Initialize expanded transactions for For Review section (transactions 100-500)
  useEffect(() => {
    if (groups.length > 0) {
      const forReviewTransactionIds = groups
        .flatMap(group => group.transactions)
        .slice(100, 500)
        .map(t => t.id);
      setExpandedTransactions(new Set(forReviewTransactionIds));
    }
  }, [groups]);
  const [bulkSelectedTransactions, setBulkSelectedTransactions] = useState<Set<string>>(new Set());
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [bulkAccount, setBulkAccount] = useState('');
  const [reviewedTransactions, setReviewedTransactions] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<ClassificationFilters>({
    account: 'all',
    category: 'all',
    confidence: 'all',
    groupSize: 'all',
    overrideStatus: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [quickbooksUploadStatus, setQuickbooksUploadStatus] = useState({
    isUploading: false,
    progress: 0,
    status: 'idle' as 'idle' | 'uploading' | 'completed',
    message: '',
    fileName: ''
  });
  const [bankFeedUploadStatus, setBankFeedUploadStatus] = useState({
    isUploading: false,
    progress: 0,
    status: 'idle' as 'idle' | 'uploading' | 'completed',
    message: '',
    fileName: ''
  });

  // Load Excel data on component mount
  useEffect(() => {
    const loadExcelData = async () => {
      try {
        setIsLoading(true);
        const excelGroups = await parseExcelFile('mockdata-bank.xlsx');
        if (excelGroups.length > 0) {
          setGroups(excelGroups);
        } else {
          // Fallback to mock data if Excel parsing fails
          setGroups(mockTransactionGroups);
        }
      } catch (error) {
        console.error('Failed to load Excel data:', error);
        setGroups(mockTransactionGroups);
      } finally {
        setIsLoading(false);
      }
    };

    loadExcelData();
  }, []);

  const handleFileUpload = useCallback(async (file: File, type: 'quickbooks' | 'bankfeed') => {
    const setStatus = type === 'quickbooks' ? setQuickbooksUploadStatus : setBankFeedUploadStatus;
    
    setStatus({
      isUploading: true,
      progress: 0,
      status: 'uploading',
      message: `Uploading ${file.name}...`,
      fileName: file.name
    });

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setStatus(prev => {
          const newProgress = Math.min(prev.progress + 10, 100);
          if (newProgress === 100) {
            clearInterval(interval);
            return {
              ...prev,
              isUploading: false,
              progress: 100,
              status: 'completed',
              message: `Successfully uploaded ${file.name}`
            };
          }
          return { ...prev, progress: newProgress };
        });
      }, 200);

      // If it's a bank feed file, process it
      if (type === 'bankfeed' && (file.name.endsWith('.xlsx') || file.name.endsWith('.csv'))) {
        // Create a temporary URL for the file
        const fileUrl = URL.createObjectURL(file);
        
        // Parse the uploaded file
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = e.target?.result;
            if (data) {
              // Process the file and update groups
              // This would need to be implemented based on your specific needs
              console.log('Processing uploaded file:', file.name);
            }
          } catch (error) {
            console.error('Error processing uploaded file:', error);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setStatus(prev => ({
        ...prev,
        isUploading: false,
        status: 'idle',
        message: 'Upload failed'
      }));
    }
  }, []);

  const handleGroupToggle = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleSectionToggle = (sectionId: 'for-action' | 'for-review') => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleGroupSelect = (groupId: string, checked: boolean) => {
    setSelectedGroups(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(groupId);
      } else {
        newSet.delete(groupId);
      }
      return newSet;
    });
  };

  const handleTransactionSelect = (transactionId: string, checked: boolean) => {
    setSelectedTransactions(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(transactionId);
      } else {
        newSet.delete(transactionId);
      }
      return newSet;
    });
  };

  const handleTransactionExpand = (transactionId: string) => {
    setExpandedTransactions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(transactionId)) {
        newSet.delete(transactionId);
      } else {
        newSet.add(transactionId);
      }
      return newSet;
    });
  };

  const handleBulkTransactionSelect = (transactionId: string, checked: boolean) => {
    setBulkSelectedTransactions(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(transactionId);
      } else {
        newSet.delete(transactionId);
      }
      return newSet;
    });
  };

  const handleBulkAccountUpdate = () => {
    if (!bulkAccount || bulkSelectedTransactions.size === 0) return;

    setGroups(prev => prev.map(group => ({
      ...group,
      transactions: group.transactions.map(transaction => 
        bulkSelectedTransactions.has(transaction.id) 
          ? { ...transaction, suggestedAccount: bulkAccount, isManuallyOverridden: true }
          : transaction
      )
    })));

    // Clear selections and close bulk edit
    setBulkSelectedTransactions(new Set());
    setShowBulkEdit(false);
    setBulkAccount('');
  };

  const handleSelectAllTransactions = (section: 'action' | 'review') => {
    const transactions = section === 'action' 
      ? filteredGroups.flatMap(group => group.transactions).slice(0, 100)
      : filteredGroups.flatMap(group => group.transactions).slice(100, 500);
    
    const allIds = new Set(transactions.map(t => t.id));
    setBulkSelectedTransactions(allIds);
  };

  const handleMarkAsReviewed = (transactionId: string) => {
    setReviewedTransactions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(transactionId)) {
        newSet.delete(transactionId);
      } else {
        newSet.add(transactionId);
      }
      return newSet;
    });
  };

  // Function to extract vendor name from memo
  const extractVendorName = (memo: string): string => {
    const memoUpper = memo.toUpperCase();
    
    // Look for common vendor patterns
    if (memoUpper.includes('PRESTON SUPER')) return 'Preston Super';
    if (memoUpper.includes('SLACK TECHNOLOGIES')) return 'Slack Technologies';
    if (memoUpper.includes('GOOGLE CLOUD')) return 'Google Cloud';
    if (memoUpper.includes('AMAZON') || memoUpper.includes('AMZN')) return 'Amazon';
    if (memoUpper.includes('VERIZON') || memoUpper.includes('VZWRLSS')) return 'Verizon';
    if (memoUpper.includes('QUICKBOOKS')) return 'QuickBooks';
    if (memoUpper.includes('STAPLES')) return 'Staples';
    if (memoUpper.includes('WAWA')) return 'Wawa';
    if (memoUpper.includes('PRODUCE JUNCTION')) return 'Produce Junction';
    if (memoUpper.includes('CLIENT PAYMENT')) return 'Client Payment';
    if (memoUpper.includes('BANK SERVICE FEE')) return 'Bank Service';
    if (memoUpper.includes('OFFICE RENT')) return 'Office Rent';
    
    // Fallback: try to extract meaningful vendor name from the end of the memo
    const words = memo.split(' ').filter(word => word.length > 2);
    if (words.length >= 2) {
      // Look for the last meaningful words that might be the vendor
      const lastTwoWords = words.slice(-2).join(' ');
      if (lastTwoWords.length > 5) {
        return lastTwoWords;
      }
    }
    
    // Final fallback: first word
    return memo.split(' ')[0];
  };

  // Mock function to get similar past transactions
  const getSimilarTransactions = (memo: string, suggestedAccount: string): ClassifiedTransaction[] => {
    const similarTransactions: ClassifiedTransaction[] = [
      {
        id: 'similar_1',
        date: '2022-12-15',
        amount: -89.99,
        memo: memo,
        bankDescription: memo,
        suggestedAccount: suggestedAccount,
        confidence: 0.88,
        groupId: 'similar_group_1',
        isManuallyOverridden: false,
        category: 'expense'
      },
      {
        id: 'similar_2',
        date: '2022-11-20',
        amount: -89.99,
        memo: memo,
        bankDescription: memo,
        suggestedAccount: suggestedAccount,
        confidence: 0.88,
        groupId: 'similar_group_2',
        isManuallyOverridden: false,
        category: 'expense'
      },
      {
        id: 'similar_3',
        date: '2022-10-18',
        amount: -89.99,
        memo: memo,
        bankDescription: memo,
        suggestedAccount: suggestedAccount,
        confidence: 0.88,
        groupId: 'similar_group_3',
        isManuallyOverridden: false,
        category: 'expense'
      }
    ];
    return similarTransactions;
  };

  const handleBulkAccountChange = (accountName: string) => {
    const selectedGroupIds = Array.from(selectedGroups);
    const selectedTransactionIds = Array.from(selectedTransactions);
    
    setGroups(prev => prev.map(group => {
      if (selectedGroupIds.includes(group.id)) {
        return {
          ...group,
          isManuallyOverridden: true,
          manualAccount: accountName,
          transactions: group.transactions.map(txn => ({
            ...txn,
            isManuallyOverridden: true,
            manualAccount: accountName
          }))
        };
      }
      return group;
    }));
  };

  const filteredGroups = groups.filter(group => {
    if (filters.account !== 'all' && group.suggestedAccount !== filters.account) return false;
    if (filters.category !== 'all' && group.transactions[0]?.category !== filters.category) return false;
    if (filters.confidence !== 'all') {
      const confidenceLevel = group.confidence >= 0.9 ? 'high' : group.confidence >= 0.7 ? 'medium' : 'low';
      if (confidenceLevel !== filters.confidence) return false;
    }
    if (filters.groupSize !== 'all') {
      const groupSize = group.transactionCount === 1 ? 'single' : 'multiple';
      if (groupSize !== filters.groupSize) return false;
    }
    if (filters.overrideStatus !== 'all') {
      const overrideStatus = group.isManuallyOverridden ? 'manual' : 'auto';
      if (overrideStatus !== filters.overrideStatus) return false;
    }
    
    // Enhanced natural language search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const memoLower = group.memoPattern.toLowerCase();
      const accountLower = group.suggestedAccount.toLowerCase();
      const categoryLower = group.transactions[0]?.category?.toLowerCase() || '';
      
      // Check for direct matches
      if (memoLower.includes(searchLower) || 
          accountLower.includes(searchLower) || 
          categoryLower.includes(searchLower)) {
        return true;
      }
      
      // Natural language patterns
      const naturalLanguagePatterns = {
        'office': ['rent', 'supplies', 'utilities', 'facilities'],
        'software': ['licenses', 'subscription', 'saas', 'cloud'],
        'revenue': ['income', 'sales', 'payment', 'client'],
        'expense': ['cost', 'fee', 'charge', 'bill'],
        'travel': ['hotel', 'flight', 'uber', 'taxi', 'meals'],
        'marketing': ['advertising', 'promotion', 'campaign', 'social'],
        'bank': ['fee', 'service', 'charge', 'interest'],
        'utilities': ['electric', 'water', 'gas', 'internet', 'phone'],
        'insurance': ['premium', 'coverage', 'policy'],
        'legal': ['attorney', 'lawyer', 'legal', 'compliance']
      };
      
      // Check if search term matches any related keywords
      for (const [category, keywords] of Object.entries(naturalLanguagePatterns)) {
        if (searchLower.includes(category)) {
          if (keywords.some(keyword => 
            memoLower.includes(keyword) || 
            accountLower.includes(keyword) ||
            categoryLower.includes(keyword)
          )) {
            return true;
          }
        }
      }
      
      // Check for amount-based searches (e.g., "over 1000", "under 50")
      const amountMatch = searchLower.match(/(over|above|more than|greater than)\s*\$?(\d+)/);
      if (amountMatch) {
        const threshold = parseFloat(amountMatch[2]);
        if (Math.abs(group.totalAmount) > threshold) return true;
      }
      
      const amountMatchUnder = searchLower.match(/(under|below|less than|smaller than)\s*\$?(\d+)/);
      if (amountMatchUnder) {
        const threshold = parseFloat(amountMatchUnder[2]);
        if (Math.abs(group.totalAmount) < threshold) return true;
      }
      
      return false;
    }
    
    return true;
  });

  const totalTransactions = filteredGroups.reduce((sum, group) => sum + group.transactionCount, 0);
  const totalAmount = filteredGroups.reduce((sum, group) => sum + group.totalAmount, 0);
  const highConfidenceCount = filteredGroups.filter(g => g.confidence >= 0.9).length;
  const manualOverrideCount = filteredGroups.filter(g => g.isManuallyOverridden).length;

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-[#F8FAFC]">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-mobius-gray-500 mx-auto mb-4" />
            <p className="text-sm text-mobius-gray-600">Loading transaction data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC]">
      {/* Upload Section */}
      <div className="bg-white border-b border-mobius-gray-100">
        <div className="px-6 py-4 space-y-4">
          {/* QuickBooks Upload Row */}
          <div className="flex items-center space-x-3">
            <div>
              <span className="text-sm font-medium text-mobius-gray-900">QuickBooks Past Data</span>
              <span className="text-xs text-mobius-gray-500 italic ml-2">- Upload historical data</span>
              {quickbooksUploadStatus.status !== 'idle' && (
                <div className="mt-1">
                  <Progress value={quickbooksUploadStatus.progress} className="h-1 w-32" />
                  <p className="text-xs text-mobius-gray-500 mt-1">{quickbooksUploadStatus.message}</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept=".csv,.xlsx,.qbo"
              className="hidden"
              id="quickbooks-upload"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload(e.target.files[0], 'quickbooks');
                }
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('quickbooks-upload')?.click()}
              className="h-8 w-8 p-0 hover:bg-mobius-gray-100"
            >
              <Upload className="w-4 h-4 text-mobius-gray-600" />
            </Button>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-t border-mobius-gray-200"></div>

        <div className="px-6 py-4">
          {/* Bank Feed Upload Row */}
          <div className="flex items-center space-x-3">
            <div>
              <span className="text-sm font-medium text-mobius-gray-900">Current Year Bank Feed</span>
              <span className="text-xs text-mobius-gray-500 italic ml-2">- Upload current year bank statements</span>
              {bankFeedUploadStatus.status !== 'idle' && (
                <div className="mt-1">
                  <Progress value={bankFeedUploadStatus.progress} className="h-1 w-32" />
                  <p className="text-xs text-mobius-gray-500 mt-1">{bankFeedUploadStatus.message}</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept=".csv,.xlsx,.pdf"
              className="hidden"
              id="bankfeed-upload"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload(e.target.files[0], 'bankfeed');
                }
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('bankfeed-upload')?.click()}
              className="h-8 w-8 p-0 hover:bg-mobius-gray-100"
            >
              <Upload className="w-4 h-4 text-mobius-gray-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white border-b border-mobius-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-mobius-gray-700">
            <span className="text-mobius-gray-600">You can post to QuickBooks once review is complete.</span> {500 - reviewedTransactions.size} transactions pending review
            <br />
            <span className="text-mobius-orange-600 font-medium">
              
            </span>
          </div>
          <Button
            disabled={reviewedTransactions.size < 500} // Disabled until all 500 transactions are reviewed
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            onClick={() => {
              // Handle posting to QuickBooks
              console.log("Posting to QuickBooks...");
            }}
          >
            <img 
              src={getDataSourceLogo('quickbooks')?.logoPath} 
              alt="QuickBooks" 
              className="w-4 h-4"
            />
            <span>Post to QuickBooks</span>
          </Button>
        </div>
      </div>

      {/* Bulk Edit Modal */}
      {showBulkEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Bulk Edit Accounts</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-mobius-gray-700">
                  Selected Transactions: {bulkSelectedTransactions.size}
                </label>
              </div>
              <div>
                <label className="text-sm font-medium text-mobius-gray-700 mb-2 block">
                  New Account
                </label>
                <Select value={bulkAccount} onValueChange={setBulkAccount}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockChartOfAccounts.map(account => (
                      <SelectItem key={account.id} value={account.name}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowBulkEdit(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBulkAccountUpdate}
                  disabled={!bulkAccount}
                >
                  Update Accounts
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Groups */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="sticky top-0 bg-white border-b border-mobius-gray-200 z-10">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide">
              <div className="col-span-1 whitespace-nowrap">
                <Checkbox
                  checked={bulkSelectedTransactions.size > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      // Select all visible transactions
                      const allVisibleIds = new Set([
                        ...filteredGroups.flatMap(group => group.transactions).slice(0, 100).map(t => t.id),
                        ...filteredGroups.flatMap(group => group.transactions).slice(100, 500).map(t => t.id)
                      ]);
                      setBulkSelectedTransactions(allVisibleIds);
                    } else {
                      setBulkSelectedTransactions(new Set());
                    }
                  }}
                />
              </div>
              <div className="col-span-2 whitespace-nowrap">Date</div>
              <div className="col-span-5 whitespace-nowrap">Memo</div>
              <div className="col-span-2 whitespace-nowrap">Account</div>
              <div className="col-span-2 text-right whitespace-nowrap">Amount</div>
            </div>
          </div>

          {/* For Action Section */}
          <div className="border-b border-mobius-gray-200">
            <div className="bg-mobius-red-50 border-b border-mobius-red-200">
              <div className="px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSectionToggle('for-action')}
                      className="p-0 h-auto hover:bg-transparent"
                    >
                      {expandedGroups.has('for-action') ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                    <span className="text-sm font-medium text-mobius-red-700">For Action</span>
                    <Badge variant="destructive" className="text-xs">
                      {Math.min(100, filteredGroups.flatMap(g => g.transactions).length)} transactions
                    </Badge>
                  </div>
                  {bulkSelectedTransactions.size > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs italic text-mobius-red-700 mr-2">
                        {bulkSelectedTransactions.size} selected
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBulkEdit(true)}
                        className="h-8 p-1"
                        title="Update Account"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Mark all selected transactions as reviewed
                          bulkSelectedTransactions.forEach(id => handleMarkAsReviewed(id));
                          setBulkSelectedTransactions(new Set());
                        }}
                        className="h-8 p-1"
                        title="Mark as Reviewed"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBulkSelectedTransactions(new Set())}
                        className="h-8 p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* For Action Transactions */}
            {expandedGroups.has('for-action') && (
              <div className="bg-white">
                {filteredGroups.flatMap(group => group.transactions).slice(0, 100).map((transaction) => (
                    <div key={transaction.id} className="group grid grid-cols-12 gap-4 px-6 py-3 hover:bg-mobius-gray-50 border-b border-mobius-gray-100">
                      <div className="col-span-1 flex items-center">
                        <Checkbox
                          checked={bulkSelectedTransactions.has(transaction.id)}
                          onCheckedChange={(checked) => handleBulkTransactionSelect(transaction.id, checked as boolean)}
                        />
                        {reviewedTransactions.has(transaction.id) ? (
                          <CheckCircle className="w-3 h-3 text-green-600 ml-1" />
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsReviewed(transaction.id)}
                            className="p-1 h-6 w-6 hover:bg-mobius-gray-200 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Mark as Reviewed"
                          >
                            <CheckCircle className="w-3 h-3 text-mobius-gray-400" />
                          </Button>
                        )}
                      </div>
                      <div className="col-span-2 text-xs text-mobius-gray-900">
                        {new Date(transaction.date).toLocaleDateString('en-US', { 
                          month: '2-digit', 
                          day: '2-digit', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="col-span-5 text-xs text-mobius-gray-900 truncate">
                        {transaction.memo}
                      </div>
                      <div className="col-span-2">
                        <Select
                          value={transaction.suggestedAccount}
                          onValueChange={(value) => {
                            setGroups(prev => prev.map(g => 
                              g.id === transaction.groupId 
                                ? {
                                    ...g,
                                    transactions: g.transactions.map(t => 
                                      t.id === transaction.id 
                                        ? { ...t, suggestedAccount: value, isManuallyOverridden: true }
                                        : t
                                    )
                                  }
                                : g
                            ));
                          }}
                        >
                          <SelectTrigger className="w-full h-6 text-xs text-left">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent 
                            side="bottom" 
                            sideOffset={4} 
                            align="start"
                            position="item-aligned"
                            avoidCollisions={false}
                            collisionPadding={0}
                          >
                            {/* Natural Language Search in Dropdown */}
                            <div className="p-2 border-b border-mobius-gray-200">
                              <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-mobius-gray-400 w-3 h-3" />
                                <Input
                                  placeholder="Search accounts..."
                                  className="pl-6 h-6 text-xs placeholder:text-xs"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                            {/* Always show current account first */}
                            <SelectItem key={transaction.suggestedAccount} value={transaction.suggestedAccount} className="text-xs font-medium">
                              {transaction.suggestedAccount}
                            </SelectItem>
                            {/* Show 6 other options */}
                            {mockChartOfAccounts
                              .filter(account => account.name !== transaction.suggestedAccount)
                              .slice(0, 6)
                              .map(account => (
                                <SelectItem key={account.id} value={account.name} className="text-xs">
                                  {account.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 text-xs text-mobius-gray-900 text-right">
                        {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* For Review Section */}
          <div className="border-b border-mobius-gray-200">
            <div className="bg-mobius-orange-50 border-b border-mobius-orange-200">
              <div className="px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSectionToggle('for-review')}
                      className="p-0 h-auto hover:bg-transparent"
                    >
                      {expandedGroups.has('for-review') ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                    <span className="text-sm font-medium text-mobius-orange-700">For Review</span>
                    <Badge variant="secondary" className="text-xs">
                      {Math.min(400, Math.max(0, filteredGroups.flatMap(g => g.transactions).length - 100))} transactions
                    </Badge>
                  </div>
                  {bulkSelectedTransactions.size > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs italic text-mobius-orange-700 mr-2">
                        {bulkSelectedTransactions.size} selected
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBulkEdit(true)}
                        className="h-8 p-1"
                        title="Update Account"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Mark all selected transactions as reviewed
                          bulkSelectedTransactions.forEach(id => handleMarkAsReviewed(id));
                          setBulkSelectedTransactions(new Set());
                        }}
                        className="h-8 p-1"
                        title="Mark as Reviewed"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBulkSelectedTransactions(new Set())}
                        className="h-8 p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* For Review Transactions */}
            {expandedGroups.has('for-review') && (
              <div className="bg-white">
                {filteredGroups.flatMap(group => group.transactions).slice(100, 500).map((transaction) => (
                  <div key={transaction.id} className="mb-4">
                    <div className="group grid grid-cols-12 gap-4 px-6 py-3 hover:bg-mobius-gray-100 border-b border-mobius-gray-100">
                      <div className="col-span-1 flex items-center">
                        <Checkbox
                          checked={bulkSelectedTransactions.has(transaction.id)}
                          onCheckedChange={(checked) => handleBulkTransactionSelect(transaction.id, checked as boolean)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTransactionExpand(transaction.id)}
                          className="p-1 h-6 w-6 hover:bg-mobius-gray-200 ml-1"
                        >
                          {expandedTransactions.has(transaction.id) ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </Button>
                        {reviewedTransactions.has(transaction.id) ? (
                          <CheckCircle className="w-3 h-3 text-green-600 ml-1" />
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsReviewed(transaction.id)}
                            className="p-1 h-6 w-6 hover:bg-mobius-gray-200 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Mark as Reviewed"
                          >
                            <CheckCircle className="w-3 h-3 text-mobius-gray-400" />
                          </Button>
                        )}
                      </div>
                      <div className="col-span-2 flex items-center">
                        <span className="text-xs text-mobius-gray-900">
                          {new Date(transaction.date).toLocaleDateString('en-US', { 
                            month: '2-digit', 
                            day: '2-digit', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="col-span-5 text-xs text-mobius-gray-900 truncate">
                        {transaction.memo}
                      </div>
                      <div className="col-span-2">
                        <Select
                          value={transaction.suggestedAccount}
                          onValueChange={(value) => {
                            setGroups(prev => prev.map(g => 
                              g.id === transaction.groupId 
                                ? {
                                    ...g,
                                    transactions: g.transactions.map(t => 
                                      t.id === transaction.id 
                                        ? { ...t, suggestedAccount: value, isManuallyOverridden: true }
                                        : t
                                    )
                                  }
                                : g
                            ));
                          }}
                        >
                          <SelectTrigger className="w-full h-6 text-xs text-left">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent 
                            side="bottom" 
                            sideOffset={4} 
                            align="start"
                            position="item-aligned"
                            avoidCollisions={false}
                            collisionPadding={0}
                          >
                            {/* Natural Language Search in Dropdown */}
                            <div className="p-2 border-b border-mobius-gray-200">
                              <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-mobius-gray-400 w-3 h-3" />
                                <Input
                                  placeholder="Search accounts..."
                                  className="pl-6 h-6 text-xs placeholder:text-xs"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                            {/* Always show current account first */}
                            <SelectItem key={transaction.suggestedAccount} value={transaction.suggestedAccount} className="text-xs font-medium">
                              {transaction.suggestedAccount}
                            </SelectItem>
                            {/* Show 6 other options */}
                            {mockChartOfAccounts
                              .filter(account => account.name !== transaction.suggestedAccount)
                              .slice(0, 6)
                              .map(account => (
                                <SelectItem key={account.id} value={account.name} className="text-xs">
                                  {account.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 text-xs text-mobius-gray-900 text-right">
                        {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                      </div>
                    </div>
                    
                    {/* Expanded Similar Transactions */}
                    {expandedTransactions.has(transaction.id) && (
                      <div className="bg-mobius-gray-50 border-b border-mobius-gray-200">
                        {getSimilarTransactions(transaction.memo, transaction.suggestedAccount).map((similarTxn, index) => (
                          <div key={similarTxn.id} className="grid grid-cols-12 gap-4 py-2 px-6 border-b border-mobius-gray-100">
                            <div className="col-span-1 flex items-center">
                              <div className="w-4 h-4"></div>
                            </div>
                            <div className="col-span-2 text-xs text-mobius-gray-500 flex items-center">
                              {new Date(similarTxn.date).toLocaleDateString('en-US', { 
                                month: '2-digit', 
                                day: '2-digit', 
                                year: 'numeric' 
                              })}
                            </div>
                            <div className="col-span-5 text-xs text-mobius-gray-500 truncate flex items-center">
                              {similarTxn.memo}
                            </div>
                            <div className="col-span-2 text-xs text-mobius-gray-500 flex items-center">
                              {similarTxn.suggestedAccount}
                            </div>
                            <div className="col-span-2 text-xs text-mobius-gray-500 text-right flex items-center justify-end">
                              {similarTxn.amount > 0 ? '+' : '-'}${Math.abs(similarTxn.amount).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataClassification;
