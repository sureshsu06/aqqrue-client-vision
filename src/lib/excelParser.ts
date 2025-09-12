import * as XLSX from 'xlsx';
import { ClassifiedTransaction, TransactionGroup } from '@/types/dataClassification';

export interface ExcelTransaction {
  date: string;
  description: string;
  amount: number;
  type?: string;
  memo?: string;
  [key: string]: any;
}

export const parseExcelFile = async (filePath: string): Promise<TransactionGroup[]> => {
  try {
    // In a real app, you'd fetch this from the server
    // For now, we'll simulate reading the file
    const response = await fetch(`/${filePath}`);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Get the second worksheet (index 1)
    const sheetName = workbook.SheetNames[1];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Skip header row and process data
    const rows = jsonData.slice(1) as any[][];
    
    // Group transactions by description pattern
    const transactionMap = new Map<string, ClassifiedTransaction[]>();
    
    rows.forEach((row, index) => {
      if (!row[0] || !row[1] || !row[2]) return; // Skip empty rows
      
      const [date, description, amount, account, memo] = row;
      
      // Create a pattern for grouping (simplified description)
      const pattern = description.toString().toUpperCase().trim();
      
      const transaction: ClassifiedTransaction = {
        id: `txn_${index + 1}`,
        date: new Date(date).toISOString().split('T')[0],
        amount: parseFloat(amount.toString().replace(/[,$]/g, '')),
        memo: memo || description,
        bankDescription: description,
        suggestedAccount: account || getSuggestedAccount(description),
        confidence: getConfidenceScore(description),
        groupId: `group_${pattern.replace(/[^A-Z0-9]/g, '_')}`,
        isManuallyOverridden: false,
        category: getCategory(description)
      };
      
      if (!transactionMap.has(pattern)) {
        transactionMap.set(pattern, []);
      }
      transactionMap.get(pattern)!.push(transaction);
    });
    
    // Convert to TransactionGroup format
    const groups: TransactionGroup[] = Array.from(transactionMap.entries()).map(([pattern, transactions], index) => {
      const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
      const avgConfidence = transactions.reduce((sum, t) => sum + t.confidence, 0) / transactions.length;
      
      return {
        id: `group_${index + 1}`,
        memoPattern: pattern,
        suggestedAccount: transactions[0].suggestedAccount,
        confidence: avgConfidence,
        transactionCount: transactions.length,
        totalAmount,
        transactions,
        isManuallyOverridden: false
      };
    });
    
    return groups;
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    return [];
  }
};

// Helper functions for classification
const getSuggestedAccount = (description: string): string => {
  const desc = description.toLowerCase();
  
  if (desc.includes('rent') || desc.includes('office')) return 'Office Rent';
  if (desc.includes('slack') || desc.includes('software') || desc.includes('subscription')) return 'Software Licenses';
  if (desc.includes('client') || desc.includes('payment') || desc.includes('revenue')) return 'Service Revenue';
  if (desc.includes('bank') || desc.includes('fee') || desc.includes('service')) return 'Bank Fees';
  if (desc.includes('google') || desc.includes('cloud') || desc.includes('aws')) return 'Cloud Infrastructure';
  if (desc.includes('supplies') || desc.includes('staples') || desc.includes('office')) return 'Office Supplies';
  if (desc.includes('amazon') || desc.includes('amzn')) return 'Office Supplies';
  if (desc.includes('produce') || desc.includes('food') || desc.includes('wawa')) return 'Meals & Entertainment';
  if (desc.includes('verizon') || desc.includes('phone') || desc.includes('wireless')) return 'Utilities';
  if (desc.includes('quickbooks') || desc.includes('intuit')) return 'Software Licenses';
  
  return 'Uncategorized';
};

const getConfidenceScore = (description: string): number => {
  const desc = description.toLowerCase();
  
  // High confidence patterns
  if (desc.includes('rent') || desc.includes('office rent')) return 0.95;
  if (desc.includes('client payment') || desc.includes('revenue')) return 0.92;
  if (desc.includes('bank service fee') || desc.includes('monthly fee')) return 0.98;
  if (desc.includes('quickbooks')) return 0.95;
  if (desc.includes('verizon') || desc.includes('phone')) return 0.90;
  
  // Medium confidence patterns
  if (desc.includes('slack') || desc.includes('software')) return 0.88;
  if (desc.includes('google cloud') || desc.includes('aws')) return 0.85;
  if (desc.includes('office supplies') || desc.includes('staples')) return 0.90;
  if (desc.includes('amazon') || desc.includes('amzn')) return 0.75;
  if (desc.includes('produce') || desc.includes('food')) return 0.82;
  if (desc.includes('wawa') || desc.includes('convenience')) return 0.85;
  
  // Low confidence patterns
  return 0.65;
};

const getCategory = (description: string): 'revenue' | 'expense' | 'asset' | 'liability' | 'equity' => {
  const desc = description.toLowerCase();
  
  if (desc.includes('client') || desc.includes('payment') || desc.includes('revenue')) return 'revenue';
  if (desc.includes('rent') || desc.includes('fee') || desc.includes('supplies') || 
      desc.includes('software') || desc.includes('cloud') || desc.includes('amazon') ||
      desc.includes('produce') || desc.includes('wawa') || desc.includes('verizon')) return 'expense';
  
  return 'expense'; // Default to expense
};
