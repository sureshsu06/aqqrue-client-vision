import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckCircle2, 
  Edit3, 
  Eye, 
  AlertTriangle,
  RotateCcw,
  Save,
  X,
  Plus,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Undo2,
  FileText,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types/Transaction";
import { useState, useEffect } from "react";
import { JournalEntryGenerator } from "@/lib/journalEntryGenerator";
import { useToast } from "@/hooks/use-toast";
import { PAST_JOURNAL_ENTRIES } from '../../lib/constants';
import { getGLAccountCode } from '../../lib/GLaccount';

interface AnalysisPaneProps {
  transaction: Transaction;
  onApprove: () => void;
  onEdit: () => void;
  onSeeHow: () => void;
}

export function AnalysisPane({ transaction, onApprove, onEdit, onSeeHow }: AnalysisPaneProps) {
  const { toast } = useToast();
  const confidence = transaction.confidence || 95;
  const [isEditMode, setIsEditMode] = useState(false); // Default to view mode
  const [editedJournalEntry, setEditedJournalEntry] = useState<any>(null);
  const [journalEntry, setJournalEntry] = useState<any>(null);
  const [isFormulaMode, setIsFormulaMode] = useState(false); // Formula mode toggle
  const [isWorkingsExpanded, setIsWorkingsExpanded] = useState(false); // New state for workings expansion
  const [activeTab, setActiveTab] = useState<'summary' | 'ledger'>('summary'); // New state for tab management
  const [isScheduleEditMode, setIsScheduleEditMode] = useState(false); // New state for schedule edit mode
  const [editedSchedule, setEditedSchedule] = useState<any[]>([]); // New state for edited schedule
  const [error, setError] = useState<string | null>(null); // Add error state
  const [isLoading, setIsLoading] = useState(false); // Add loading state for transitions
  const [showPdfViewer, setShowPdfViewer] = useState(false); // Add state for PDF viewer
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // Add state for PDF URL

  // Initialize journal entry data safely
  useEffect(() => {
    const initializeJournalEntry = async () => {
    try {
      console.log('Initializing AnalysisPane for transaction:', transaction);
      setError(null); // Clear any previous errors
      
        // Show loading state briefly
        setIsLoading(true);
        
        // Add a small delay to show the loading state
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const entry = JournalEntryGenerator.generateForTransaction(transaction);
      console.log('Generated journal entry:', entry);
      setJournalEntry(entry);
        
        setIsLoading(false);
    } catch (error) {
      console.error('Error initializing journal entry:', error);
      setError(`Failed to load transaction data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Set a fallback journal entry
      setJournalEntry({
        client: transaction.client || "Elire",
        invoiceNumber: "INV-2025-001",
        totalAmount: transaction.amount || 0,
        entryType: transaction.type === 'contract' ? "SaaS Revenue" : "General Expense",
        narration: `Being the ${transaction.type === 'contract' ? 'revenue' : 'expense'} from ${transaction.vendor}`,
        entries: [
          { account: transaction.type === 'contract' ? "Cash/Accounts Receivable" : "General Expense", debit: transaction.amount || 0, credit: 0, confidence: 95 },
          { account: transaction.type === 'contract' ? "Deferred Revenue" : transaction.vendor, debit: 0, credit: transaction.amount || 0, confidence: 100 }
        ]
      });
        setIsLoading(false);
    }
    };

    initializeJournalEntry();
  }, [transaction.id]); // Only reload when transaction ID changes

  // Initialize edited journal entry when entering edit mode
  const handleEditClick = () => {
    if (journalEntry) {
      setEditedJournalEntry(JSON.parse(JSON.stringify(journalEntry))); // Deep copy
      setIsEditMode(true);
    }
  };

  const handleSaveEdit = () => {
    // Here you would typically save the changes to your backend
    console.log("Saving edited journal entry:", editedJournalEntry);
    setIsEditMode(false);
    setEditedJournalEntry(null);
    // Removed the onEdit callback to prevent modal from opening
    // if (onEdit) onEdit();
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedJournalEntry(null);
  };

  const updateJournalEntry = (index: number, field: string, value: any) => {
    if (!editedJournalEntry) return;
    
    const updatedEntries = [...editedJournalEntry.entries];
    
    // Handle formula evaluation for debit/credit fields
    if (field === 'debit' || field === 'credit') {
      if (typeof value === 'string' && value.trim() !== '') {
        console.log('Processing value:', value, 'for field:', field, 'formula mode:', isFormulaMode);
        
        // In formula mode, treat everything as a potential formula
        // Otherwise, check if it's a formula (starts with = or contains cell references or %)
        const isFormula = isFormulaMode || value.startsWith('=') || /[A-Z]\d+/.test(value) || /%/.test(value);
        console.log('Is formula?', isFormula);
        
        if (isFormula) {
          // Store the formula as-is for now, don't evaluate immediately
          updatedEntries[index] = { ...updatedEntries[index], [field]: value };
        } else {
          // Regular number input
          const numValue = parseFloat(value);
          updatedEntries[index] = { ...updatedEntries[index], [field]: isNaN(numValue) ? 0 : numValue };
        }
      } else {
        // Empty value
        updatedEntries[index] = { ...updatedEntries[index], [field]: 0 };
      }
    } else {
      updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    }
    
    setEditedJournalEntry({
      ...editedJournalEntry,
      entries: updatedEntries
    });
  };

  // New function to evaluate formulas when user finishes typing
  const evaluateFormulaOnBlur = (index: number, field: string) => {
    if (!editedJournalEntry) return;
    
    const entry = editedJournalEntry.entries[index];
    const value = entry[field];
    
    if (typeof value === 'string' && value.trim() !== '') {
      const isFormula = isFormulaMode || value.startsWith('=') || /[A-Z]\d+/.test(value) || /%/.test(value);
      
      if (isFormula) {
        try {
          // If in formula mode and doesn't start with =, add it
          let formula = value;
          if (isFormulaMode && !value.startsWith('=')) {
            formula = '=' + value;
          } else if (value.startsWith('=')) {
            formula = value.substring(1);
          }
          
          console.log('Evaluating formula on blur:', formula);
          const result = evaluateFormula(formula, editedJournalEntry.entries, index);
          console.log('Formula result:', result);
          
          const updatedEntries = [...editedJournalEntry.entries];
          updatedEntries[index] = { ...updatedEntries[index], [field]: result };
          
          setEditedJournalEntry({
            ...editedJournalEntry,
            entries: updatedEntries
          });
        } catch (error) {
          console.log('Formula evaluation failed:', error);
        }
      }
    }
  };

  const evaluateFormula = (formula: string, entries: any[], currentIndex: number) => {
    console.log('Evaluating formula:', formula, 'for entries:', entries);
    
    // Clean the formula and handle basic operations
    let processedFormula = formula.trim();
    
    // Handle percentage calculations (e.g., 10%*B1, 15%*C2)
    processedFormula = processedFormula.replace(/(\d+)%/g, (match, num) => {
      console.log('Converting percentage:', match, 'to', `(${num}/100)`);
      return `(${num}/100)`;
    });
    
    console.log('After percentage processing:', processedFormula);
    
    // Handle cell references like A1, B2, C3, etc.
    // A = Account column (not used for calculations)
    // B = Debit column (index 1)
    // C = Credit column (index 2)
    const cellRefs = processedFormula.match(/[A-Z]\d+/g) || [];
    console.log('Found cell references:', cellRefs);
    
    cellRefs.forEach(ref => {
      const col = ref.charCodeAt(0) - 65; // A=0, B=1, C=2
      const row = parseInt(ref.substring(1)) - 1;
      
      console.log('Processing cell ref:', ref, 'col:', col, 'row:', row);
      
      if (row >= 0 && row < entries.length) {
        let cellValue = 0;
        
        // Map columns to actual data
        if (col === 1) { // B column = debit
          cellValue = entries[row].debit || 0;
        } else if (col === 2) { // C column = credit
          cellValue = entries[row].credit || 0;
        } else if (col === 0) { // A column = account (not numeric)
          cellValue = 0; // Account names are not numeric
        }
        
        console.log('Cell value for', ref, ':', cellValue);
        // Replace all occurrences of this cell reference
        processedFormula = processedFormula.replace(new RegExp(ref, 'g'), cellValue.toString());
      } else {
        console.log('Invalid cell reference:', ref);
        // Replace invalid references with 0
        processedFormula = processedFormula.replace(new RegExp(ref, 'g'), '0');
      }
    });
    
    // Basic math evaluation with safety
    console.log('Final formula to evaluate:', processedFormula);
    
    try {
      // Replace common Excel functions with JavaScript equivalents
      processedFormula = processedFormula
        .replace(/\bSUM\s*\(/gi, '(') // SUM(A1:A3) -> (A1+A2+A3)
        .replace(/\bAVERAGE\s*\(/gi, '(') // AVERAGE(A1:A3) -> (A1+A2+A3)/3
        .replace(/\bMAX\s*\(/gi, 'Math.max(')
        .replace(/\bMIN\s*\(/gi, 'Math.min(')
        .replace(/\bABS\s*\(/gi, 'Math.abs(')
        .replace(/\bROUND\s*\(/gi, 'Math.round(');
      
      // Handle range references like A1:A3 or B1:B3
      const rangeRefs = processedFormula.match(/[A-Z]\d+:[A-Z]\d+/g) || [];
      rangeRefs.forEach(range => {
        const [start, end] = range.split(':');
        const startCol = start.charCodeAt(0) - 65;
        const startRow = parseInt(start.substring(1)) - 1;
        const endCol = end.charCodeAt(0) - 65;
        const endRow = parseInt(end.substring(1)) - 1;
        
        let rangeSum = 0;
        for (let row = startRow; row <= endRow && row < entries.length; row++) {
          if (startCol === 1) { // B column = debit
            rangeSum += entries[row].debit || 0;
          } else if (startCol === 2) { // C column = credit
            rangeSum += entries[row].credit || 0;
          }
        }
        
        processedFormula = processedFormula.replace(range, rangeSum.toString());
      });
      
      // At this point, processedFormula should only contain numbers and mathematical operators
      // No need for aggressive sanitization since cell references are already replaced
      console.log('Processed formula for evaluation:', processedFormula);
      
      // Use Function constructor for safer evaluation
      const result = new Function('return ' + processedFormula)();
      console.log('Formula result:', result);
      
      // Return 0 if result is NaN or infinite
      return isNaN(result) || !isFinite(result) ? 0 : result;
    } catch (error) {
      console.error('Formula evaluation error:', error);
      return 0;
    }
  };

  const addRow = () => {
    if (!editedJournalEntry) return;
    
    const newRow = {
      account: '',
      debit: 0,
      credit: 0,
      confidence: 95
    };
    
    setEditedJournalEntry({
      ...editedJournalEntry,
      entries: [...editedJournalEntry.entries, newRow]
    });
  };

  const deleteRow = (index: number) => {
    if (!editedJournalEntry || editedJournalEntry.entries.length <= 1) return;
    
    const updatedEntries = editedJournalEntry.entries.filter((_: any, i: number) => i !== index);
    setEditedJournalEntry({
      ...editedJournalEntry,
      entries: updatedEntries
    });
  };

  // Dynamic analysis steps based on transaction
  const getAnalysisSteps = (transaction: any) => {
    const baseSteps = [
    {
      step: 1,
        title: "Extraction",
        status: "complete" as const,
        confidence: 100,
        result: `Extracted ${transaction.currency === 'USD' ? '$' : '₹'}${(transaction.amount || 0).toLocaleString()} from ${transaction.vendor} ${transaction.type === 'contract' ? 'contract' : 'invoice'} with 100% accuracy`
    },
    {
      step: 2,
        title: transaction.type === 'contract' ? "ASC 606 Analysis" : "Capex/Opex",
        status: "complete" as const,
        confidence: 95,
        result: transaction.type === 'contract' ? getASC606Result(transaction) : getCapexOpexResult(transaction)
    },
    {
      step: 3,
        title: transaction.type === 'contract' ? "Revenue Recognition" : "GST Applicability",
        status: "complete" as const,
        confidence: 100,
        result: transaction.type === 'contract' ? getRevenueRecognitionResult(transaction) : getGSTResult(transaction)
    },
    {
      step: 4,
        title: transaction.type === 'contract' ? "Deferred Revenue" : "TDS",
        status: "complete" as const,
        confidence: 100,
        result: transaction.type === 'contract' ? getDeferredRevenueResult(transaction) : getTDSResult(transaction)
    },
    {
      step: 5,
        title: "COA Mapping",
        status: "complete" as const,
        confidence: 95,
        result: getCOAResult(transaction)
      }
    ];

    return baseSteps;
  };

  const getCapexOpexResult = (transaction: any) => {
    switch (transaction.id) {
      case "1":
      case "2":
        return "Classified as Opex - Professional fees for monthly services";
      case "3":
        return "Classified as Opex - Regulatory compliance charges";
      case "4":
      case "5":
        return "Classified as Opex - Freight and logistics expenses";
      case "6":
      case "7":
        return "Classified as Opex - Office rent and parking charges";
      case "8":
      case "9":
      case "10":
        return "Classified as Capex - Computer hardware purchases";
      case "11":
        return "Classified as Capex - Monitor equipment purchase";
      case "12":
        return "Classified as Opex - Office supplies and consumables";
      default:
        return "Classified as Opex - General business expenses";
    }
  };

  const getGSTResult = (transaction: any) => {
    switch (transaction.id) {
      case "1":
      case "2":
        return "CGST 9% + SGST 9% = ₹16,992 total GST. Input credit fully available under Section 16";
      case "3":
        return "IGST 18% = ₹1,800 total GST. Input credit available for business use under Section 16";
      case "4":
      case "5":
        return "CGST 9% + SGST 9% = ₹810 total GST. Input credit available for business expenses";
      case "6":
        return "CGST 9% + SGST 9% = ₹15,660 total GST. Input credit available for office rent";
      case "7":
        return "CGST 9% + SGST 9% = ₹801 total GST. Input credit available for parking charges";
      case "8":
        return "CGST 9% + SGST 9% = ₹73,350 total GST. Input credit available for capital goods";
      case "9":
      case "10":
        return "CGST 9% + SGST 9% = ₹14,670 total GST. Input credit available for capital goods";
      case "11":
        return "CGST 9% + SGST 9% = ₹3,042 total GST. Input credit available for capital goods";
      case "12":
        return "CGST 9% + SGST 9% = ₹1,471 total GST. Input credit available for office supplies";
      default:
        return "GST applicable as per standard rates. Input credit available for business use";
    }
  };

  const getTDSResult = (transaction: any) => {
    switch (transaction.id) {
      case "1":
        return "TDS 10% under Section 194J - Professional fees. Section threshold: ₹30,000 per annum. Invoice amount: ₹94,400 (above threshold)";
      case "2":
        return "TDS 10% under Section 194J - Professional fees. Section threshold: ₹30,000 per annum. Invoice amount: ₹70,800 (above threshold)";
      case "3":
        return "No TDS applicable - Regulatory charges. Section 194J threshold: ₹30,000 per annum. Invoice amount: ₹11,800 (below threshold)";
      case "4":
        return "No TDS applicable - Freight charges. Section 194C threshold: ₹30,000 per annum. Invoice amount: ₹5,310 (below threshold)";
      case "5":
        return "No TDS applicable - Freight charges. Section 194C threshold: ₹30,000 per annum. Invoice amount: ₹5,310 (below threshold)";
      case "6":
        return "TDS 10% under Section 194I - Rent. Section threshold: ₹2,40,000 per annum. Invoice amount: ₹1,02,660 (above threshold)";
      case "7":
        return "TDS 10% under Section 194I - Rent. Since rent to vendor is above annual threshold of ₹2,40,000 per annum, TDS must be charged. Invoice amount: ₹5,251";
      case "8":
        return "No TDS applicable - Purchase of goods. Section 194Q threshold: ₹50,00,000 per annum. Invoice amount: ₹4,80,850 (below threshold)";
      case "9":
        return "No TDS applicable - Purchase of goods. Section 194Q threshold: ₹50,00,000 per annum. Invoice amount: ₹96,170 (below threshold)";
      case "10":
        return "No TDS applicable - Purchase of goods. Section 194Q threshold: ₹50,00,000 per annum. Invoice amount: ₹96,170 (below threshold)";
      case "11":
        return "No TDS applicable - Purchase of goods. Section 194Q threshold: ₹50,00,000 per annum. Invoice amount: ₹16,900 (below threshold)";
      case "12":
        return "No TDS applicable - Purchase of goods. Section 194Q threshold: ₹50,00,000 per annum. Invoice amount: ₹8,174 (below threshold)";
      default:
        return "TDS applicable as per relevant sections based on transaction type and thresholds";
    }
  };

  const getCOAResult = (transaction: any) => {
    switch (transaction.id) {
      case "1":
      case "2":
        return "Mapped to 'Professional Fees' account with 95% confidence";
      case "3":
        return "Mapped to 'Rates & Taxes' account with 95% confidence";
      case "4":
      case "5":
        return "Mapped to 'Freight and Postage' account with 95% confidence";
      case "6":
      case "7":
        return "Mapped to 'Rent' account with 95% confidence";
      case "8":
      case "9":
      case "10":
        return "Mapped to 'Computers' account with 95% confidence";
      case "11":
        return "Mapped to 'Computers' account with 95% confidence";
      case "12":
        return "Mapped to 'Office Supplies' account with 95% confidence";
      default:
        return "Mapped to appropriate expense account with 95% confidence";
    }
  };

  const handleSeeHow = () => {
    onSeeHow();
  };

  const handleInvoiceClick = async (invoiceNumber: string, vendorName: string) => {
    // Show loading toast immediately
    toast({
      title: "Loading invoice...",
      description: `Fetching details for ${invoiceNumber}`,
    });
    
    // Simulate a small delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, this would fetch the original bill/transaction
    // For now, we'll show a toast with the invoice details
    toast({
      title: "Invoice Details",
      description: `Invoice ${invoiceNumber} from ${vendorName}`,
    });
    
    // TODO: Implement navigation to the original transaction or PDF viewer
    // This could involve:
    // 1. Fetching the transaction by invoice number
    // 2. Opening a PDF viewer if the transaction has a PDF
    // 3. Navigating to the transaction details page
    // 4. Opening a modal with transaction details
    console.log(`Clicked on invoice: ${invoiceNumber} from ${vendorName}`);
    
    // Example of what could be implemented:
    // const transaction = await fetchTransactionByInvoiceNumber(invoiceNumber);
    // if (transaction.pdfFile) {
    //   setPdfUrl(`/documents/${transaction.pdfFile}`);
    //   setShowPdfViewer(true);
    // } else {
    //   // Show transaction details in a modal
    //   setSelectedTransaction(transaction);
    //   setShowTransactionModal(true);
    // }
  };

  // Handle schedule edit mode
  const handleScheduleEditClick = () => {
    console.log("Edit schedule clicked");
    const schedule = generateDeferredRevenueSchedule(transaction);
    console.log("Generated schedule:", schedule);
    setEditedSchedule([...schedule]);
    setIsScheduleEditMode(true);
    console.log("Edit mode set to true");
  };

  const handleScheduleSave = () => {
    console.log("Saving edited schedule:", editedSchedule);
    setIsScheduleEditMode(false);
    setEditedSchedule([]);
  };

  const handleScheduleCancel = () => {
    setIsScheduleEditMode(false);
    setEditedSchedule([]);
  };

  const updateScheduleEntry = (index: number, field: string, value: any) => {
    if (!editedSchedule[index]) return;
    
    const updatedSchedule = [...editedSchedule];
    updatedSchedule[index] = { ...updatedSchedule[index], [field]: value };
    setEditedSchedule(updatedSchedule);
  };

  // Generate deferred revenue schedule for SaaS contracts
  const generateDeferredRevenueSchedule = (transaction: Transaction) => {
    if (transaction.type !== 'contract' || !transaction.contractValue || !transaction.contractTerm) {
      return [];
    }

    const totalValue = transaction.contractValue;
    const billingCycle = transaction.billingCycle || 'monthly';
    
    // Contract-specific logic based on ASC 606 analysis
    let totalMonths = 12; // Default to 12 months
    let monthlyRevenue = totalValue / totalMonths;
    let startMonth = 1;
    let startDate = new Date(transaction.contractStartDate || transaction.date);
    
    // Handle specific contracts based on vendor
    if (transaction.vendor === "Clipper Media Acquisition I, LLC") {
      // 11-month contract with 1-month evaluation period
      totalMonths = 11;
      monthlyRevenue = totalValue / totalMonths; // $7,999 ÷ 11 = $727.18
      startMonth = 1; // Revenue recognition starts from month 1
      startDate = new Date("2025-06-13"); // Contract start date
    } else if (transaction.vendor === "Bishop Wisecarver") {
      // 10-month contract with 2-month termination right
      totalMonths = 10;
      monthlyRevenue = totalValue / totalMonths; // $7,020 ÷ 10 = $702
      startMonth = 1; // Revenue recognition starts from month 1
      startDate = new Date("2025-10-01"); // Revenue recognition starts 10/1/25
    } else if (transaction.vendor === "MARKETview Technology, LLC") {
      // 38-month contract with partial revenue recognition in first year
      totalMonths = 38;
      monthlyRevenue = totalValue / totalMonths; // $30,000 ÷ 38 = $789.47
      startMonth = 1; // Revenue recognition starts from month 1
      startDate = new Date("2025-07-01"); // Contract start date
    } else {
      // Default logic for other contracts
      if (billingCycle === 'Annual') {
        const termYears = parseInt(transaction.contractTerm.split(' ')[0]);
        totalMonths = termYears * 12;
      } else {
        totalMonths = parseInt(transaction.contractTerm.split(' ')[0]);
      }
      monthlyRevenue = totalValue / totalMonths;
    }
    
    const schedule = [];
    
    for (let i = 1; i <= Math.min(totalMonths, 12); i++) { // Show max 12 months
      const recognized = monthlyRevenue;
      const remainingDeferred = totalValue - (recognized * i);
      
      // Calculate the date for this period
      const periodDate = new Date(startDate);
      periodDate.setMonth(periodDate.getMonth() + i - 1);
      const periodDateStr = periodDate.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
      
      schedule.push({
        period: periodDateStr,
        monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
        deferredRevenue: Math.round(Math.max(0, remainingDeferred) * 100) / 100,
        recognized: Math.round(recognized * 100) / 100
      });
    }
    
    return schedule;
  };

  const getASC606Result = (transaction: any) => {
    switch (transaction.vendor) {
      case "Clipper Media Acquisition I, LLC":
        return "Contract identified with 1-month evaluation period (5/13/25-6/12/25). Revenue recognition begins 6/13/25 over 11 months";
      case "Bishop Wisecarver":
        return "Contract becomes non-cancellable after 9/30/25 (2-month termination right). Before 10/1/25, no enforceable contract for revenue recognition";
      case "MARKETview Technology, LLC":
        return "3-year contract (38 months) with annual billing. Revenue recognition begins 7/1/25 over 38 months";
      default:
        return "Contract terms analyzed under ASC 606. Revenue recognition period determined based on performance obligations";
    }
  };

  const getRevenueRecognitionResult = (transaction: any) => {
    switch (transaction.vendor) {
      case "Clipper Media Acquisition I, LLC":
        return "Monthly revenue: $727.18 ($7,999 ÷ 11 months). Straight-line recognition from 6/13/25 to 5/12/26";
      case "Bishop Wisecarver":
        return "Service period: 10/1/25 - 7/31/26 (10 months). Monthly revenue: $702 ($7,020 ÷ 10 months)";
      case "MARKETview Technology, LLC":
        return "Monthly revenue: $789.47 ($30,000 ÷ 38 months). Straight-line recognition from 7/1/25 to 8/31/28";
      default:
        return "Revenue recognized over contract term using straight-line method as services are delivered continuously";
    }
  };

  const getDeferredRevenueResult = (transaction: any) => {
    switch (transaction.vendor) {
      case "Clipper Media Acquisition I, LLC":
        return "Initial deferred revenue: $7,999. Monthly reduction: $727.18. Final balance: $0 by 5/12/26";
      case "Bishop Wisecarver":
        return "On 10/1/25: Dr. Accounts Receivable $7,020, Cr. Deferred Revenue $7,020. Monthly: Dr. Deferred Revenue $702, Cr. Revenue $702";
      case "MARKETview Technology, LLC":
        return "Year 1: $7,894.74 deferred, $2,105.26 recognized. Total contract: $30,000 over 38 months";
      default:
        return "Deferred revenue liability created for unearned portion. Monthly recognition reduces liability as services are performed";
    }
  };

  // Move analysisSteps calculation here, after all helper functions are declared
  const analysisSteps = getAnalysisSteps(transaction);

  // Helper function to get currency symbol based on transaction currency
  const getCurrencySymbol = (transaction: any) => {
    return transaction.currency === 'USD' ? '$' : '₹';
  };

  // Helper function to generate analysis summary
  const getAnalysisSummary = (transaction: any) => {
    if (transaction.type === 'contract') {
      switch (transaction.vendor) {
        case "Bishop Wisecarver":
          return "This SaaS contract with Bishop Wisecarver includes a 2-month termination right that expires on 9/30/25. Under ASC 606, revenue recognition cannot begin until the contract becomes non-cancellable on 10/1/25. The total contract value of $7,020 will be recognized over 10 months from 10/1/25 to 7/31/26 at $702 per month. The initial journal entry on 10/1/25 will debit Accounts Receivable and credit Deferred Revenue for the full amount, followed by monthly entries debiting Deferred Revenue and crediting Revenue as services are delivered.";
        case "Clipper Media Acquisition I, LLC":
          return "This SaaS subscription contract includes a 1-month evaluation period from 5/13/25 to 6/12/25, during which the customer can terminate without penalty. Revenue recognition begins on 6/13/25 over the remaining 11 months of the contract. The total value of $7,999 will be recognized at $727.18 per month using the straight-line method as the service is delivered continuously over the contract term.";
        case "MARKETview Technology, LLC":
          return "This 3-year SaaS contract with MARKETview Technology spans 38 months with annual billing. The total contract value of $30,000 will be recognized over the full contract period at $789.47 per month. In the first year, $7,894.74 will remain as deferred revenue while $2,105.26 will be recognized as revenue, reflecting the partial year of service delivery.";
        default:
          return `This ${transaction.type} transaction with ${transaction.vendor} has been analyzed under ASC 606 revenue recognition standards. The contract terms have been evaluated to determine the appropriate revenue recognition period and method. The journal entries reflect the proper accounting treatment based on the performance obligations and service delivery schedule.`;
      }
    } else if (transaction.type === 'credit-card') {
      // Credit card transaction analysis
      switch (transaction.id) {
        case "28":
          return "This HubSpot subscription transaction has been classified as a software subscription expense. The quarterly billing of $2,324.11 covers Marketing Hub Starter and Sales Hub Professional services. This is a recurring operating expense that should be recognized in the period the services are consumed. The journal entry debits Software Subscriptions and credits the Suspense Account, as the invoice is available for proper expense classification.";
        case "29":
          return "This duplicate HubSpot transaction has been identified and flagged. The same quarterly subscription charge of $2,324.11 appears twice in the system. This duplicate should be removed to prevent double expense recognition. The journal entry structure remains the same but with reduced confidence due to duplication.";
        case "30":
          return "This Gumloop Starter Plan subscription transaction has been classified as a software subscription expense. The monthly charge of $97.00 covers 30,000 units of service. This is a recurring operating expense that should be recognized monthly as the service is consumed. The journal entry debits Software Subscriptions and credits the Suspense Account, as the invoice is available for proper expense classification.";
        case "31":
          return "This X Premium subscription transaction has been classified as a software subscription expense. The monthly charge of $716.30 covers premium features for social media management. This is a recurring operating expense that should be recognized monthly as the service is consumed. The journal entry debits Software Subscriptions and credits the Suspense Account, as the invoice is available for proper expense classification.";
        case "32":
          return "This Pitch Pro subscription transaction has been classified as a software subscription expense. The monthly charge of $43.75 covers 3 user seats for presentation software. This is a recurring operating expense that should be recognized monthly as the service is consumed. The journal entry debits Software Subscriptions and credits the Suspense Account, as the invoice is available for proper expense classification.";
        case "33":
          return "This Calendly Teams subscription transaction has been classified as a software subscription expense. The monthly charge of $22.04 covers team scheduling services. This is a recurring operating expense that should be recognized monthly as the service is consumed. The journal entry debits Software Subscriptions and credits the Suspense Account, as the invoice is available for proper expense classification.";
        case "34":
          return "This Typeform Business subscription transaction has been classified as a software subscription expense. The monthly charge of $109.10 covers business form creation services. This is a recurring operating expense that should be recognized monthly as the service is consumed. The journal entry debits Software Subscriptions and credits the Suspense Account, as the invoice is available for proper expense classification.";
        case "35":
          return "This Stripe payment processing transaction has been temporarily posted to the Suspense Account as the corresponding invoice is not yet available. The monthly charge of $299.00 covers payment processing fees. Once the invoice is received, this will be reclassified to the appropriate expense account. The journal entry debits Suspense Account and credits the Brex corporate card liability.";
        case "36":
          return "This AWS cloud infrastructure transaction has been temporarily posted to the Suspense Account as the corresponding invoice is not yet available. The monthly charge of $156.78 covers cloud computing services. Once the invoice is received, this will be reclassified to the appropriate expense account. The journal entry debits Suspense Account and credits the Brex corporate card liability.";
        case "37":
          return "This Google Cloud compute services transaction has been temporarily posted to the Suspense Account as the corresponding invoice is not yet available. The monthly charge of $89.45 covers cloud computing services. Once the invoice is received, this will be reclassified to the appropriate expense account. The journal entry debits Suspense Account and credits the Brex corporate card liability.";
        case "38":
          return "This Zoom Pro subscription transaction has been temporarily posted to the Suspense Account as the corresponding invoice is not yet available. The monthly charge of $149.90 covers video conferencing services. Once the invoice is received, this will be reclassified to the appropriate expense account. The journal entry debits Suspense Account and credits the Brex corporate card liability.";
        case "39":
          return "This Slack Standard subscription transaction has been temporarily posted to the Suspense Account as the corresponding invoice is not yet available. The monthly charge of $67.50 covers team collaboration services. Once the invoice is received, this will be reclassified to the appropriate expense account. The journal entry debits Suspense Account and credits the Brex corporate card liability.";
        default:
          return transaction.pdfFile 
            ? `This credit card transaction with ${transaction.vendor} has been classified as a software subscription expense. The transaction represents a recurring operating expense that should be recognized in the period the services are consumed. The journal entry debits the expense account and credits the Suspense Account, as the invoice is available for proper expense classification.`
            : `This credit card transaction with ${transaction.vendor} has been temporarily posted to the Suspense Account as the corresponding invoice is not yet available. Once the invoice is received, this will be reclassified to the appropriate expense account. The journal entry debits Suspense Account and credits the Brex corporate card liability.`;
      }
    } else {
      // For expense transactions - provide specific analysis based on transaction ID
      switch (transaction.id) {
        case "1":
        case "2":
          return `This professional fees transaction with ${transaction.vendor} has been classified as an operating expense (Opex) for monthly professional services. The transaction includes CGST and SGST at 9% each, with full input credit available under Section 16. TDS at 10% under Section 194J is applicable as the invoice amount exceeds the ₹30,000 annual threshold for professional fees. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
        case "3":
          return `This regulatory compliance transaction with ${transaction.vendor} has been classified as an operating expense (Opex) for equity AMC charges. The transaction includes IGST at 18%, with input credit available for business use under Section 16. No TDS is applicable as this is a regulatory compliance charge. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
        case "4":
        case "5":
          return `This freight and logistics transaction with ${transaction.vendor} has been classified as an operating expense (Opex) for shipping charges. The transaction includes CGST and SGST at 9% each, with input credit available for business expenses. No TDS is applicable as this is a freight service. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
        case "6":
        case "7":
          return `This office rent transaction with ${transaction.vendor} has been classified as an operating expense (Opex) for office space and parking charges. The transaction includes CGST and SGST at 9% each, with input credit available for office rent. TDS at 10% under Section 194I is applicable as the invoice amount exceeds the ₹2,40,000 annual threshold for rent payments. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
        case "8":
        case "9":
        case "10":
          return `This computer hardware transaction with ${transaction.vendor} has been classified as a capital expenditure (Capex) for laptop purchases. The transaction includes CGST and SGST at 9% each, with input credit available for capital goods. No TDS is applicable as this is a goods purchase. The journal entries ensure proper asset capitalization and compliance with Indian tax regulations.`;
        case "11":
          return `This monitor equipment transaction with ${transaction.vendor} has been classified as a capital expenditure (Capex) for monitor purchase. The transaction includes CGST and SGST at 9% each, with input credit available for capital goods. No TDS is applicable as this is a goods purchase. The journal entries ensure proper asset capitalization and compliance with Indian tax regulations.`;
        case "12":
          return `This office supplies transaction with ${transaction.vendor} has been classified as an operating expense (Opex) for office supplies and consumables. The transaction includes CGST and SGST at 9% each, with input credit available for office supplies. No TDS is applicable as this is a goods purchase below threshold. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
        case "40":
          return `This data services transaction with ${transaction.vendor} has been classified as an operating expense (Opex) for data processing and analytics services. The transaction includes CGST and SGST at 9% each, with input credit available for business services. TDS at 10% under Section 194J is applicable as this constitutes professional services for data processing. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
        case "41":
          return `This property commission transaction with ${transaction.vendor} has been classified as an operating expense (Opex) for real estate brokerage services. The transaction includes CGST and SGST at 9% each, with input credit available for business services. TDS at 5% under Section 194H is applicable as this constitutes commission or brokerage payment for property services. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
        case "42":
          return `This digital advertising transaction with ${transaction.vendor} has been classified as an operating expense (Opex) for marketing and promotional services. The transaction includes CGST and SGST at 9% each, with input credit available for business services. TDS at 10% under Section 194J is applicable as this constitutes professional services for digital marketing and advertising. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
        default:
          return `This ${transaction.type} transaction with ${transaction.vendor} has been analyzed for proper expense classification and tax treatment. The transaction has been categorized as either capital expenditure (Capex) or operating expense (Opex) based on the nature of the goods or services. GST/TDS implications have been evaluated and the appropriate input credits and withholding tax treatments have been applied. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
      }
    }
  };

  const handleShowAllPreviousBills = (vendorName: string) => {
    // For demo purposes, we'll show the current bill's PDF
    // In a real implementation, this would fetch all bills from the same vendor
    // and merge them into a single PDF in descending order
    
    if (transaction.pdfFile) {
      const pdfUrl = `/documents/${transaction.pdfFile}`;
      
      // Set the PDF URL and show the viewer inside the app
      setPdfUrl(pdfUrl);
      setShowPdfViewer(true);
    } else {
      toast({
        title: "No PDF available",
        description: `No PDF file available for this transaction from ${vendorName}`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-mobius-gray-100 flex-shrink-0">
        {/* Client Pill */}
        <div className="mb-3">
          <Badge variant="outline" className="bg-mobius-blue/10 text-mobius-blue border-mobius-blue/20 text-xs font-medium">
            {transaction.client}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-xs">{transaction.vendor}</h3>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={cn(
                "text-xs",
                confidence >= 95 
                  ? "bg-status-done/10 text-status-done border-status-done/20"
                  : confidence >= 85
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-mobius-gray-50 text-mobius-gray-600 border-mobius-gray-200"
              )}
            >
              {confidence}%
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 hover:bg-mobius-gray-100 rounded"
              title="Undo"
            >
              <Undo2 className="w-3 h-3 text-mobius-gray-600" />
            </Button>
          </div>
        </div>

        {transaction.isDuplicate && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-xs">
                <p className="text-amber-800 font-medium">Duplicate detected</p>
                <p className="text-amber-700">
                  WeWork sent this to joy@ and accounting@. Keep one copy to avoid double entry.
                </p>
                <Button variant="outline" size="sm" className="mt-2 text-amber-700 border-amber-300">
                  Remove this copy
                </Button>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-mobius-gray-500">
          {transaction.currency === 'USD' ? '$' : '₹'}{(transaction.amount || 0).toLocaleString()} • {new Date(transaction.date || new Date()).toLocaleDateString()}
        </p>
      </div>

      {/* Loading state */}
      {(!journalEntry || isLoading) && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-mobius-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mobius-blue mx-auto mb-2"></div>
            <p>{isLoading ? "Loading transaction..." : "Loading journal entry..."}</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-600 p-4">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">Error Loading Transaction</p>
            <p className="text-xs text-red-500 mt-1">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Content - only render if journalEntry exists and no error */}
      {journalEntry && !error && !isLoading && (
        <>
      {/* Tab Navigation - Above the fold */}
      <div className="px-4 py-3 bg-white">
        <div className="bg-mobius-gray-50 rounded-lg p-1">
          <div className="flex">
            <button
              onClick={() => setActiveTab('summary')}
              className={cn(
                "flex-1 py-2 px-4 text-xs font-medium rounded-md transition-colors",
                activeTab === 'summary'
                  ? "bg-white text-mobius-gray-900 shadow-sm"
                  : "text-mobius-gray-600 hover:text-mobius-gray-900"
              )}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={cn(
                "flex-1 py-2 px-4 text-xs font-medium rounded-md transition-colors",
                activeTab === 'ledger'
                  ? "bg-white text-mobius-gray-900 shadow-sm"
                  : "text-mobius-gray-600 hover:text-mobius-gray-900"
              )}
            >
              Ledger
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          <div className="p-2">
            <div className="space-y-4">
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-mobius-gray-500">Client:</p>
                    <p className="font-medium">{journalEntry.client}</p>
                  </div>
                  {transaction.type === 'bill' && (
                    <div>
                      <p className="text-mobius-gray-500">Payment Status:</p>
                      <p className="font-medium">Pending</p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-mobius-gray-500">Invoice #:</p>
                    <p className="font-medium">{journalEntry.invoiceNumber}</p>
                  </div>
                  {transaction.type === 'bill' && (
                    <div>
                      <p className="text-mobius-gray-500">Reconciled Against:</p>
                      <p className="font-medium text-mobius-gray-400">-</p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-mobius-gray-500">Currency:</p>
                    <p className="font-medium">{transaction.currency === 'USD' ? 'US Dollar ($)' : 'Indian Rupee (₹)'}</p>
                  </div>
                  {transaction.type === 'bill' && (
                    <div>

                    </div>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'summary' ? (
                <div className="space-y-4">
                  {transaction.type === 'contract' ? (
                    // SaaS Contract Details for Revenue
                    <div className="space-y-2">
                      {/* Contract Details */}
                      <div className="bg-mobius-gray-50 rounded-lg p-3">
                        <h4 className="text-xs font-medium text-mobius-gray-900 mb-3">Contract Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-mobius-gray-500">Contract Value:</p>
                            <p className="font-medium">${(transaction.contractValue || 0).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-mobius-gray-500">Currency:</p>
                            <p className="font-medium">{transaction.currency === 'USD' ? 'US Dollar ($)' : 'Indian Rupee (₹)'}</p>
                          </div>
                          <div>
                            <p className="text-mobius-gray-500">Contract Term:</p>
                            <p className="font-medium">{transaction.contractTerm || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-mobius-gray-500">Billing Cycle:</p>
                            <p className="font-medium">{transaction.billingCycle || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-mobius-gray-500">Start Date:</p>
                            <p className="font-medium">{transaction.contractStartDate || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-mobius-gray-500">End Date:</p>
                            <p className="font-medium">{transaction.contractEndDate || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Deferred Revenue Schedule */}
                      <div className="p-3">
                        <div className="flex justify-between mb-4">
                          <h4 className="text-xs font-medium text-mobius-gray-900">Deferred Revenue Schedule:</h4>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={cn("h-6 w-6 p-0", isFormulaMode ? "bg-blue-100 text-blue-600" : "")}
                              onClick={() => setIsFormulaMode(!isFormulaMode)}
                              title={isFormulaMode ? "Disable Formula Mode" : "Enable Formula Mode"}
                            >
                              <span className="text-xs font-bold">fx</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <RotateCcw className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Formula Mode Instructions */}
                        {isFormulaMode && (
                          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                            <p className="font-medium mb-1">Formula Mode Active</p>
                            <p>Use Excel-like formulas: <code className="bg-blue-100 px-1 rounded">=B1*0.1</code>, <code className="bg-blue-100 px-1 rounded">=SUM(B1:B3)</code>, <code className="bg-blue-100 px-1 rounded">10%*C2</code></p>
                            <p className="text-blue-600 mt-1">B = Monthly Revenue column, C = Deferred Revenue column, D = Recognized column, numbers = row index (1-based)</p>
                          </div>
                        )}

                        <Separator className="my-4" />

                        {/* Deferred Revenue Schedule Table */}
                        <div className="mt-4">
                          <div className="grid grid-cols-4 gap-2 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide mb-3 pt-2">
                            <div>PERIOD</div>
                            <div className="text-right">MONTHLY REVENUE</div>
                            <div className="text-right">DEFERRED REVENUE</div>
                            <div className="text-right">RECOGNIZED</div>
                          </div>
                          
                          {/* Column Headers for Formula Reference */}
                          {isFormulaMode && (
                            <div className="grid grid-cols-4 gap-2 text-xs font-medium text-blue-600 mb-1">
                              <div>A</div>
                              <div className="text-right">B</div>
                              <div className="text-right">C</div>
                              <div className="text-right">D</div>
                            </div>
                          )}
                          
                          <div className="space-y-1">
                            {(isScheduleEditMode ? editedSchedule : generateDeferredRevenueSchedule(transaction)).map((period, index) => (
                              <div key={index} className="grid grid-cols-4 gap-2 text-xs border-b border-mobius-gray-200 pb-2">
                                <div className="font-medium">{period.period}</div>
                                <div className="text-right">
                                  {isScheduleEditMode ? (
                                    <Input
                                      type="number"
                                      value={period.monthlyRevenue}
                                      onChange={(e) => updateScheduleEntry(index, 'monthlyRevenue', parseFloat(e.target.value) || 0)}
                                      className="h-6 text-xs text-right border-mobius-gray-200 w-20"
                                    />
                                  ) : (
                                    `$${period.monthlyRevenue.toLocaleString()}`
                                  )}
                                </div>
                                <div className="text-right">
                                  {isScheduleEditMode ? (
                                    <Input
                                      type="number"
                                      value={period.deferredRevenue}
                                      onChange={(e) => updateScheduleEntry(index, 'deferredRevenue', parseFloat(e.target.value) || 0)}
                                      className="h-6 text-xs text-right border-mobius-gray-200 w-20"
                                    />
                                  ) : (
                                    `$${period.deferredRevenue.toLocaleString()}`
                                  )}
                                </div>
                                <div className="text-right">
                                  {isScheduleEditMode ? (
                                    <Input
                                      type="number"
                                      value={period.recognized}
                                      onChange={(e) => updateScheduleEntry(index, 'recognized', parseFloat(e.target.value) || 0)}
                                      className="h-6 text-xs text-right border-mobius-gray-200 w-20"
                                    />
                                  ) : (
                                    `$${period.recognized.toLocaleString()}`
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Edit/Save/Cancel Buttons - below the table */}
                          <div className="flex justify-end mt-3 space-x-2">
                            {isScheduleEditMode ? (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2"
                                  onClick={handleScheduleSave}
                                  title="Save Schedule"
                                >
                                  <Save className="w-3 h-3 mr-1" />
                                  Save
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2"
                                  onClick={handleScheduleCancel}
                                  title="Cancel"
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2"
                                onClick={handleScheduleEditClick}
                                title="Edit Schedule"
                              >
                                <Edit3 className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>


                      {/* Editable Journal Entry Table for Contracts */}
                      <div className="p-3">
                        <div className="flex justify-between mb-4">
                          <h4 className="text-xs font-medium text-mobius-gray-900">Journal Entries:</h4>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={cn("h-6 w-6 p-0", isFormulaMode ? "bg-blue-100 text-blue-600" : "")}
                              onClick={() => setIsFormulaMode(!isFormulaMode)}
                              title={isFormulaMode ? "Disable Formula Mode" : "Enable Formula Mode"}
                            >
                              <span className="text-xs font-bold">fx</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <RotateCcw className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Formula Mode Instructions */}
                        {isFormulaMode && (
                          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                            <p className="font-medium mb-1">Formula Mode Active</p>
                            <p>Use Excel-like formulas: <code className="bg-blue-100 px-1 rounded">=B1*0.1</code>, <code className="bg-blue-100 px-1 rounded">=SUM(B1:B3)</code>, <code className="bg-blue-100 px-1 rounded">10%*C2</code></p>
                            <p className="text-blue-600 mt-1">B = Debit column, C = Credit column, numbers = row index (1-based)</p>
                          </div>
                        )}

                        <Separator className="my-4" />

                        {/* Journal Entry Table */}
                        <div className="mt-4">
                          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide mb-3 pt-2">
                            <div className="col-span-5 pl-0">ACCOUNT</div>
                            <div className="col-span-3 text-right">DEBIT</div>
                            <div className="col-span-3 text-right">CREDIT</div>
                            <div className="col-span-1"></div>
                          </div>
                          
                          {/* Column Headers for Formula Reference */}
                          {isFormulaMode && (
                            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-blue-600 mb-1">
                              <div className="col-span-5 pl-0">A</div>
                              <div className="col-span-3 text-right">B</div>
                              <div className="col-span-3 text-right">C</div>
                              <div className="col-span-1"></div>
                            </div>
                          )}
                          
                          <div className="space-y-1">
                            {(isEditMode ? editedJournalEntry : journalEntry).entries.map((entry: any, index: number) => (
                              <div key={index} className="grid grid-cols-12 gap-2 text-xs items-center group">
                                <div className="col-span-5 font-medium text-xs">
                                  {isEditMode ? (
                                    <Select 
                                      value={entry.account} 
                                      onValueChange={(value) => updateJournalEntry(index, 'account', value)}
                                    >
                                      <SelectTrigger className="h-8 text-xs border-mobius-gray-200 text-left justify-start">
                                        <SelectValue className="text-xs text-left" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Cash/Accounts Receivable">Cash/Accounts Receivable</SelectItem>
                                        <SelectItem value="Deferred Revenue">Deferred Revenue</SelectItem>
                                        <SelectItem value="SaaS Revenue">SaaS Revenue</SelectItem>
                                        <SelectItem value="Professional Fees">Professional Fees</SelectItem>
                                        <SelectItem value="Rent">Rent</SelectItem>
                                        <SelectItem value="Computers">Computers</SelectItem>
                                        <SelectItem value="Freight and Postage">Freight and Postage</SelectItem>
                                        <SelectItem value="Rates & Taxes">Rates & Taxes</SelectItem>
                                        <SelectItem value="Input CGST">Input CGST</SelectItem>
                                        <SelectItem value="Input SGST">Input SGST</SelectItem>
                                        <SelectItem value="Input IGST">Input IGST</SelectItem>
                                        <SelectItem value="TDS on Professional Charges">TDS on Professional Charges</SelectItem>
                                        <SelectItem value="TDS on Rent">TDS on Rent</SelectItem>
                                        <SelectItem value="JCSS & Associates LLP">JCSS & Associates LLP</SelectItem>
                                        <SelectItem value="Sogo Computers Pvt Ltd">Sogo Computers Pvt Ltd</SelectItem>
                                        <SelectItem value="Clayworks Spaces Technologies Pvt Ltd">Clayworks Spaces Technologies Pvt Ltd</SelectItem>
                                        <SelectItem value="NSDL Database Management Ltd">NSDL Database Management Ltd</SelectItem>
                                        <SelectItem value="Software Subscriptions">Software Subscriptions</SelectItem>
                                        <SelectItem value="Brex Card">Brex Card</SelectItem>
                                        <SelectItem value="Suspense Account">Suspense Account</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <div>
                                      <div className="font-medium">{entry.account} <span className="text-xs text-mobius-gray-500 font-normal">({getGLAccountCode(entry.account)})</span></div>
                                    </div>
                                  )}
                                </div>
                                <div className="col-span-3 text-right">
                                  {isEditMode ? (
                                    <Input
                                      type="text"
                                      value={entry.debit?.toString() || ''}
                                      onChange={(e) => updateJournalEntry(index, 'debit', e.target.value)}
                                      onBlur={() => evaluateFormulaOnBlur(index, 'debit')}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          evaluateFormulaOnBlur(index, 'debit');
                                          e.currentTarget.blur();
                                        }
                                      }}
                                      className={cn(
                                        "h-8 text-xs text-right border-mobius-gray-200",
                                        isFormulaMode ? "bg-blue-50 border-blue-300 font-mono" : "font-variant-numeric tabular-nums"
                                      )}
                                      placeholder={isFormulaMode ? "=B1*0.1" : "0.00"}
                                      inputMode="text"
                                      autoComplete="off"
                                      spellCheck="false"
                                      style={isFormulaMode ? { fontVariantNumeric: 'normal' } : {}}
                                    />
                                  ) : (
                                    entry.debit ? `${getCurrencySymbol(transaction)}${entry.debit.toFixed(2)}` : "—"
                                  )}
                                </div>
                                <div className="col-span-3 text-right">
                                  {isEditMode ? (
                                    <Input
                                      type="text"
                                      value={entry.credit?.toString() || ''}
                                      onChange={(e) => updateJournalEntry(index, 'credit', e.target.value)}
                                      onBlur={() => evaluateFormulaOnBlur(index, 'credit')}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          evaluateFormulaOnBlur(index, 'credit');
                                          e.currentTarget.blur();
                                        }
                                      }}
                                      className={cn(
                                        "h-8 text-xs text-right border-mobius-gray-200",
                                        isFormulaMode ? "bg-blue-50 border-blue-300 font-mono" : "font-variant-numeric tabular-nums"
                                      )}
                                      placeholder={isFormulaMode ? "=C1*0.1" : "0.00"}
                                      inputMode="text"
                                      autoComplete="off"
                                      spellCheck="false"
                                      style={isFormulaMode ? { fontVariantNumeric: 'normal' } : {}}
                                    />
                                  ) : (
                                    entry.credit ? `${getCurrencySymbol(transaction)}${entry.credit.toFixed(2)}` : "—"
                                  )}
                                </div>
                                {/* Delete button - positioned in the last column */}
                                <div className="col-span-1 flex justify-center">
                                  {isEditMode && editedJournalEntry?.entries.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => deleteRow(index)}
                                      title="Delete row"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Add Row on Hover */}
                          {isEditMode && (
                            <div 
                              className="group relative mt-2 p-1 border-2 border-dashed border-mobius-gray-200 rounded-lg hover:border-mobius-gray-300 transition-colors cursor-pointer"
                              onClick={addRow}
                            >
                              <div className="flex items-center justify-center">
                                <Plus className="w-4 h-4 text-mobius-gray-400 group-hover:text-mobius-gray-600 transition-colors" />
                              </div>
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-mobius-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                Drag to add or remove rows
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-mobius-gray-800"></div>
                              </div>
                            </div>
                          )}
                          
                          <Separator className="my-2" />
                          
                          {/* Totals Row */}
                          <div className="grid grid-cols-12 gap-2 text-xs font-medium">
                            <div className="col-span-5 text-xs">Totals</div>
                            <div className="col-span-3 text-right text-xs">{getTotalDebit(journalEntry, transaction)}</div>
                            <div className="col-span-3 text-right text-xs">{getTotalCredit(journalEntry, transaction)}</div>
                            <div className="col-span-1"></div>
                          </div>
                          
                          {/* Balance Status */}
                          <div className={cn(
                            "text-center text-xs mt-1 p-1 rounded",
                            isBalanced(isEditMode ? editedJournalEntry : journalEntry) ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                          )}>
                            {isBalanced(isEditMode ? editedJournalEntry : journalEntry) ? "✓ Balanced" : "✗ Unbalanced"}
                          </div>
                          
                          {/* Edit Button - moved to bottom right */}
                          <div className="flex justify-end mt-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2"
                              onClick={handleEditClick}
                              title="Edit"
                            >
                              <Edit3 className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Monthly Scheduled Entries for Revenue Recognition */}
                      <div className="p-3">
                        <div className="flex justify-between mb-4">
                          <h4 className="text-sm font-medium text-mobius-gray-900">Monthly Scheduled Entries:</h4>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={cn("h-6 w-6 p-0", isFormulaMode ? "bg-blue-100 text-blue-600" : "")}
                              onClick={() => setIsFormulaMode(!isFormulaMode)}
                              title={isFormulaMode ? "Disable Formula Mode" : "Enable Formula Mode"}
                            >
                              <span className="text-xs font-bold">fx</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <RotateCcw className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Formula Mode Instructions */}
                        {isFormulaMode && (
                          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                            <p className="font-medium mb-1">Formula Mode Active</p>
                            <p>Use Excel-like formulas: <code className="bg-blue-100 px-1 rounded">=B1*0.1</code>, <code className="bg-blue-100 px-1 rounded">=SUM(B1:B3)</code>, <code className="bg-blue-100 px-1 rounded">10%*C2</code></p>
                            <p className="text-blue-600 mt-1">B = Debit column, C = Credit column, numbers = row index (1-based)</p>
                          </div>
                        )}

                        <Separator className="my-4" />

                        {/* Monthly Scheduled Entries Table */}
                        <div className="mt-4">
                          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide mb-3 pt-2">
                            <div className="col-span-5 pl-0">ACCOUNT</div>
                            <div className="col-span-3 text-right">DEBIT</div>
                            <div className="col-span-3 text-right">CREDIT</div>
                            <div className="col-span-1"></div>
                          </div>
                          
                          {/* Column Headers for Formula Reference */}
                          {isFormulaMode && (
                            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-blue-600 mb-1">
                              <div className="col-span-5 pl-0">A</div>
                              <div className="col-span-3 text-right">B</div>
                              <div className="col-span-3 text-right">C</div>
                              <div className="col-span-1"></div>
                            </div>
                          )}
                          
                          <div className="space-y-1">
                            <div className="grid grid-cols-12 gap-2 text-sm items-center group">
                              <div className="col-span-5 font-medium text-xs">
                                <div>
                                  <div className="font-medium">Deferred Revenue <span className="text-xs text-mobius-gray-500 font-normal">(2001)</span></div>
                                </div>
                              </div>
                              <div className="col-span-3 text-right">
                                ${(() => {
                                  const schedule = generateDeferredRevenueSchedule(transaction);
                                  return schedule.length > 0 ? schedule[0].monthlyRevenue.toFixed(2) : "0.00";
                                })()}
                              </div>
                              <div className="col-span-3 text-right">
                                —
                              </div>
                              <div className="col-span-1"></div>
                            </div>
                            
                            <div className="grid grid-cols-12 gap-2 text-sm items-center group">
                              <div className="col-span-5 font-medium text-xs">
                                <div>
                                  <div className="font-medium">Revenue <span className="text-xs text-mobius-gray-500 font-normal">(4001)</span></div>
                                </div>
                              </div>
                              <div className="col-span-3 text-right">
                                —
                              </div>
                              <div className="col-span-3 text-right">
                                ${(() => {
                                  const schedule = generateDeferredRevenueSchedule(transaction);
                                  return schedule.length > 0 ? schedule[0].monthlyRevenue.toFixed(2) : "0.00";
                                })()}
                              </div>
                              <div className="col-span-1"></div>
                            </div>
                          </div>
                          
                          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                            <p className="text-blue-600">Monthly entry made as services are delivered over the contract term.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Regular Analysis for Bills/Expenses
                    <>
                      {/* Undo Button */}
                      <div className="flex justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-mobius-gray-900">Proposed Entries:</h4>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={cn("h-6 w-6 p-0", isFormulaMode ? "bg-blue-100 text-blue-600" : "")}
                            onClick={() => setIsFormulaMode(!isFormulaMode)}
                            title={isFormulaMode ? "Disable Formula Mode" : "Enable Formula Mode"}
                          >
                            <span className="text-xs font-bold">fx</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <RotateCcw className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Formula Mode Instructions */}
                      {isFormulaMode && (
                        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                          <p className="font-medium mb-1">Formula Mode Active</p>
                          <p>Use Excel-like formulas: <code className="bg-blue-100 px-1 rounded">=B1*0.1</code>, <code className="bg-blue-100 px-1 rounded">=SUM(B1:B3)</code>, <code className="bg-blue-100 px-1 rounded">10%*C2</code></p>
                          <p className="text-blue-600 mt-1">B = Debit column, C = Credit column, numbers = row index (1-based)</p>
                        </div>
                      )}

                      <Separator className="my-4" />

                      {/* Journal Entry Table */}
                      <div className="mt-4">
                        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide mb-3 pt-2">
                          <div className="col-span-5 pl-0">ACCOUNT</div>
                          <div className="col-span-3 text-right">DEBIT</div>
                          <div className="col-span-3 text-right">CREDIT</div>
                          <div className="col-span-1"></div>
                        </div>
                        
                        {/* Column Headers for Formula Reference */}
                        {isFormulaMode && (
                          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-blue-600 mb-1">
                            <div className="col-span-5 pl-0">A</div>
                            <div className="col-span-3 text-right">B</div>
                            <div className="col-span-3 text-right">C</div>
                            <div className="col-span-1"></div>
                          </div>
                        )}
                        
                        <div className="space-y-1">
                          {(isEditMode ? editedJournalEntry : journalEntry).entries.map((entry: any, index: number) => (
                            <div key={index} className="grid grid-cols-12 gap-2 text-xs items-center group">
                              <div className="col-span-5 font-medium text-xs">
                                {isEditMode ? (
                                  <Select 
                                    value={entry.account} 
                                    onValueChange={(value) => updateJournalEntry(index, 'account', value)}
                                  >
                                    <SelectTrigger className="h-8 text-sm border-mobius-gray-200 text-left justify-start">
                                      <SelectValue className="text-sm text-left" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Professional Fees">Professional Fees</SelectItem>
                                      <SelectItem value="Rent">Rent</SelectItem>
                                      <SelectItem value="Computers">Computers</SelectItem>
                                      <SelectItem value="Freight and Postage">Freight and Postage</SelectItem>
                                      <SelectItem value="Rates & Taxes">Rates & Taxes</SelectItem>
                                      <SelectItem value="Input CGST">Input CGST</SelectItem>
                                      <SelectItem value="Input SGST">Input SGST</SelectItem>
                                      <SelectItem value="Input IGST">Input IGST</SelectItem>
                                      <SelectItem value="TDS on Professional Charges">TDS on Professional Charges</SelectItem>
                                      <SelectItem value="TDS on Rent">TDS on Rent</SelectItem>
                                      <SelectItem value="JCSS & Associates LLP">JCSS & Associates LLP</SelectItem>
                                      <SelectItem value="Sogo Computers Pvt Ltd">Sogo Computers Pvt Ltd</SelectItem>
                                      <SelectItem value="Clayworks Spaces Technologies Pvt Ltd">Clayworks Spaces Technologies Pvt Ltd</SelectItem>
                                      <SelectItem value="NSDL Database Management Ltd">NSDL Database Management Ltd</SelectItem>
                                      <SelectItem value="Software Subscriptions">Software Subscriptions</SelectItem>
                                      <SelectItem value="Brex Card">Brex Card</SelectItem>
                                      <SelectItem value="Suspense Account">Suspense Account</SelectItem>
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <div>
                                    <div className="font-medium">{entry.account} <span className="text-xs text-mobius-gray-500 font-normal">({getGLAccountCode(entry.account)})</span></div>
                                  </div>
                                )}
                              </div>
                              <div className="col-span-3 text-right">
                                {isEditMode ? (
                                  <Input
                                    type="text"
                                    value={entry.debit?.toString() || ''}
                                    onChange={(e) => updateJournalEntry(index, 'debit', e.target.value)}
                                    onBlur={() => evaluateFormulaOnBlur(index, 'debit')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        evaluateFormulaOnBlur(index, 'debit');
                                        e.currentTarget.blur();
                                      }
                                    }}
                                    className={cn(
                                      "h-8 text-sm text-right border-mobius-gray-200",
                                      isFormulaMode ? "bg-blue-50 border-blue-300 font-mono" : "font-variant-numeric tabular-nums"
                                    )}
                                    placeholder={isFormulaMode ? "=B1*0.1" : "0.00"}
                                    inputMode="text"
                                    autoComplete="off"
                                    spellCheck="false"
                                    style={isFormulaMode ? { fontVariantNumeric: 'normal' } : {}}
                                  />
                                ) : (
                                  entry.debit ? `${getCurrencySymbol(transaction)}${entry.debit.toFixed(2)}` : "—"
                                )}
                              </div>
                              <div className="col-span-3 text-right">
                                {isEditMode ? (
                                  <Input
                                    type="text"
                                    value={entry.credit?.toString() || ''}
                                    onChange={(e) => updateJournalEntry(index, 'credit', e.target.value)}
                                    onBlur={() => evaluateFormulaOnBlur(index, 'credit')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        evaluateFormulaOnBlur(index, 'credit');
                                        e.currentTarget.blur();
                                      }
                                    }}
                                    className={cn(
                                      "h-8 text-sm text-right border-mobius-gray-200",
                                      isFormulaMode ? "bg-blue-50 border-blue-300 font-mono" : "font-variant-numeric tabular-nums"
                                    )}
                                    placeholder={isFormulaMode ? "=C1*0.1" : "0.00"}
                                    inputMode="text"
                                    autoComplete="off"
                                    spellCheck="false"
                                    style={isFormulaMode ? { fontVariantNumeric: 'normal' } : {}}
                                  />
                                ) : (
                                  entry.credit ? `${getCurrencySymbol(transaction)}${entry.credit.toFixed(2)}` : "—"
                                )}
                              </div>
                              {/* Delete button - positioned in the last column */}
                              <div className="col-span-1 flex justify-center">
                                {isEditMode && editedJournalEntry?.entries.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => deleteRow(index)}
                                    title="Delete row"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Add Row on Hover */}
                        {isEditMode && (
                          <div 
                            className="group relative mt-2 p-1 border-2 border-dashed border-mobius-gray-200 rounded-lg hover:border-mobius-gray-300 transition-colors cursor-pointer"
                            onClick={addRow}
                          >
                            <div className="flex items-center justify-center">
                              <Plus className="w-4 h-4 text-mobius-gray-400 group-hover:text-mobius-gray-600 transition-colors" />
                            </div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-mobius-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                              Drag to add or remove rows
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-mobius-gray-800"></div>
                            </div>
                          </div>
                        )}
                        
                        <Separator className="my-2" />
                        
                        {/* Totals Row */}
                        <div className="grid grid-cols-12 gap-2 text-xs font-medium">
                          <div className="col-span-5 text-xs">Totals</div>
                          <div className="col-span-3 text-right text-xs">{getTotalDebit(journalEntry, transaction)}</div>
                          <div className="col-span-3 text-right text-xs">{getTotalCredit(journalEntry, transaction)}</div>
                          <div className="col-span-1"></div>
                        </div>
                        
                        {/* Balance Status */}
                        <div className={cn(
                          "text-center text-xs mt-1 p-1 rounded",
                          isBalanced(isEditMode ? editedJournalEntry : journalEntry) ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                        )}>
                          {isBalanced(isEditMode ? editedJournalEntry : journalEntry) ? "✓ Balanced" : "✗ Unbalanced"}
                        </div>
                        
                        {/* Edit Button - moved to bottom right */}
                        <div className="flex justify-end mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2"
                            onClick={handleEditClick}
                            title="Edit"
                          >
                            <Edit3 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Prepaid Expense Analysis - for all transaction types */}
                  {transaction.isPrepaid && (
                    <div className="space-y-2">

                      {/* Prepaid Amortization Schedule */}
                      <div className="p-3">
                        <div className="flex justify-between mb-4">
                          <h4 className="text-xs font-medium text-mobius-gray-900">Prepaid Amortization Schedule:</h4>
                        </div>

                        {/* Prepaid Amortization Schedule Table */}
                        <div className="mt-4">
                          <div className="grid grid-cols-4 gap-2 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide mb-3 pt-2">
                            <div>PERIOD</div>
                            <div className="text-right">MONTHLY EXPENSE</div>
                            <div className="text-right">DEFERRED EXPENSE</div>
                            <div className="text-right">RECOGNIZED</div>
                          </div>
                          
                          <div className="space-y-1">
                            {generatePrepaidSchedule(transaction).map((period, index) => (
                              <div key={index} className="grid grid-cols-4 gap-2 text-xs border-b border-mobius-gray-200 pb-2">
                                <div className="font-medium">{period.period}</div>
                                <div className="text-right">${period.monthlyExpense.toFixed(0)}</div>
                                <div className="text-right">${period.remainingBalance.toFixed(0)}</div>
                                <div className="text-right">${period.monthlyExpense.toFixed(0)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Monthly Amortization Journal Entries */}
                      <div className="p-3">
                        <div className="flex justify-between mb-4">
                          <h4 className="text-xs font-medium text-mobius-gray-900">Monthly Scheduled Entries:</h4>
                        </div>

                        {/* Monthly Scheduled Entries Table */}
                        <div className="mt-4">
                          <div className="grid grid-cols-3 gap-2 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide mb-3 pt-2">
                            <div>ACCOUNT</div>
                            <div className="text-right">DEBIT</div>
                            <div className="text-right">CREDIT</div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="grid grid-cols-3 gap-2 text-xs border-b border-mobius-gray-200 pb-2">
                              <div className="font-medium">Marketing Expenses (5001)</div>
                              <div className="text-right">{getCurrencySymbol(transaction)}{Math.round((transaction.prepaidAmount || transaction.amount || 0) / 3)}</div>
                              <div className="text-right">—</div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs border-b border-mobius-gray-200 pb-2">
                              <div className="font-medium">Prepaid Software (1201)</div>
                              <div className="text-right">—</div>
                              <div className="text-right">{getCurrencySymbol(transaction)}{Math.round((transaction.prepaidAmount || transaction.amount || 0) / 3)}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                          Monthly entry made as services are consumed over the subscription period.
                        </div>
                      </div>

                      {/* Prepaid Expense Classification */}
                      <div className="p-3">
                        <div className="bg-blue-50 rounded-lg p-3 max-w-2xl">
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-blue-800 font-medium">Company Policy Applied:</span>
                            </div>
                            <p className="text-blue-700 ml-4">
                              Quarterly software subscriptions exceeding $500 are classified as prepaid expenses and amortized over the subscription period.
                            </p>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                             
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Analysis Summary Section */}
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-medium text-mobius-gray-900">Analysis Summary</h4>
                      <Badge variant="outline" className="bg-status-done/10 text-status-done border-status-done/20 text-xs">
                        {confidence}%
                      </Badge>
                    </div>
                    
                    <div className="bg-mobius-gray-50 rounded-lg p-4">
                      <p className="text-xs text-mobius-gray-700 leading-relaxed">
                        {getAnalysisSummary(transaction)}
                      </p>
                    </div>
                    
                   
                  </div>

                  {/* Activity Trail */}
                  <div className="p-3">
                    <h4 className="text-xs font-medium text-mobius-gray-900 mb-3">Activity Trail</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-xs text-mobius-gray-900">
                            <span className="font-medium">Transaction Posted</span> • Posted to QuickBooks • JE# QB-000192 • by Controller • 2 hours ago
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-xs text-mobius-gray-900">
                            <span className="font-medium">Journal Entry Edited</span> • Updated account classification and amounts • by joy@mobius.ai • 3 hours ago
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-xs text-mobius-gray-900">
                            <span className="font-medium">Transaction Assigned</span> • Assigned to Controller for review • by accounting@mobius.ai • 4 hours ago
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-mobius-gray-400 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-xs text-mobius-gray-900">
                            <span className="font-medium">Transaction Created</span> • Automatically processed from email • by system • 5 hours ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Ledger Tab Content */
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-medium text-mobius-gray-900">Vendor Ledger</h4>
                    <Badge variant="outline" className="text-xs">
                      {transaction.vendor}
                    </Badge>
                  </div>
                  
                  {/* Past Journal Entries Table */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-mobius-gray-700">Past Journal Entries</h5>
                    <div className="border border-mobius-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-mobius-gray-50">
                          <tr>
                            <th className="text-left p-3 text-xs font-medium text-mobius-gray-600 uppercase tracking-wide">Date</th>
                            <th className="text-left p-3 text-xs font-medium text-mobius-gray-600 uppercase tracking-wide">Reference</th>
                            <th className="text-left p-3 text-xs font-medium text-mobius-gray-600 uppercase tracking-wide">Type</th>
                            <th className="text-right p-3 text-xs font-medium text-mobius-gray-600 uppercase tracking-wide">Debit</th>
                            <th className="text-right p-3 text-xs font-medium text-mobius-gray-600 uppercase tracking-wide">Credit</th>
                            <th className="text-center p-3 text-xs font-medium text-mobius-gray-600 uppercase tracking-wide">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-mobius-gray-200">
                          {getPastJournalEntries(transaction.vendor)
                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort in ascending order
                            .map((entry, index) => (
                            <tr key={index} className="hover:bg-mobius-gray-50 hover:border-l-2 hover:border-l-mobius-blue/30 transition-all duration-200">
                              <td className="p-3 text-sm text-mobius-gray-900">
                                {new Date(entry.date).toLocaleDateString()}
                              </td>
                              <td className="p-3 text-sm font-medium text-mobius-gray-900">
                                <button
                                  onClick={() => handleInvoiceClick(entry.invoiceNumber, transaction.vendor)}
                                  className="text-mobius-gray-900 hover:text-mobius-gray-700 hover:underline transition-all duration-200 cursor-pointer font-medium px-2 py-1 rounded hover:bg-mobius-gray-100 border border-transparent hover:border-mobius-gray-200 text-left"
                                  title={`Click to view ${entry.invoiceNumber}`}
                                >
                                  {entry.invoiceNumber}
                                </button>
                              </td>
                              <td className="p-3 text-sm text-mobius-gray-700">
                                {entry.type}
                              </td>
                              <td className="p-3 text-sm text-right font-medium">
                                {entry.type === "Payment" ? `₹${Math.abs(entry.amount).toLocaleString()}` : ''}
                              </td>
                              <td className="p-3 text-sm text-right font-medium">
                                {entry.type !== "Payment" ? `₹${Math.abs(entry.amount).toLocaleString()}` : ''}
                              </td>
                              <td className="p-3 text-center">
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "text-xs",
                                    entry.status === "Approved" ? "bg-green-50 text-green-700 border-green-200" :
                                    entry.status === "Paid" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                    "bg-mobius-gray-50 text-mobius-gray-600 border-mobius-gray-200"
                                  )}
                                >
                                  {entry.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-mobius-gray-50 border-t border-mobius-gray-200">
                          <tr>
                            <td colSpan={3} className="p-3 text-sm font-medium text-mobius-gray-900">
                              Current Balance
                            </td>
                            <td className="p-3 text-sm text-right font-semibold text-mobius-gray-900">
                              {getVendorBalance(transaction.vendor) < 0 ? `₹${Math.abs(getVendorBalance(transaction.vendor)).toLocaleString()}` : ''}
                            </td>
                            <td className="p-3 text-sm text-right font-semibold text-mobius-gray-900">
                              {getVendorBalance(transaction.vendor) > 0 ? `₹${getVendorBalance(transaction.vendor).toLocaleString()}` : ''}
                            </td>
                            <td className="p-3"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-mobius-gray-100 bg-white">
            {isEditMode ? (
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Button className="bg-status-done hover:bg-status-done/90 flex-1" onClick={handleSaveEdit}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleCancelEdit}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
                <Button variant="outline" className="w-full" onClick={() => setIsEditMode(false)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Mode
                </Button>
              </div>
            ) : (
        <div className="flex justify-start space-x-2">
          <Button className="bg-status-done hover:bg-status-done/90 w-12 h-10" onClick={onApprove}>
            <CheckCircle2 className="w-4 h-4" />
          </Button>
                <Button variant="outline" className="w-12 h-10" onClick={() => console.log("Assign to Controller")}>
                  <UserCheck className="w-4 h-4" />
            </Button>
          </div>
            )}
        </div>
        </>
      )}

      {/* PDF Viewer Modal */}
      {showPdfViewer && pdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-11/12 h-5/6 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xs font-semibold">Previous Bills - {transaction.vendor}</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowPdfViewer(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 p-4">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title="Previous Bills PDF"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Journal entries are now generated using the shared JournalEntryGenerator class
// which includes all transaction types including TVS BILLS cases (40, 41, 42) with proper TDS handling

// getGLAccountCode function is now imported from src/lib/GLaccount.ts

// Helper function to get total debit
function getTotalDebit(journalEntry: any, transaction?: any) {
  const amount = journalEntry.entries.reduce((sum: number, entry: any) => sum + (entry.debit || 0), 0);
  const currency = transaction?.currency === 'USD' ? '$' : '₹';
  return `${currency}${amount.toFixed(2)}`;
}

// Helper function to get total credit
function getTotalCredit(journalEntry: any, transaction?: any) {
  const amount = journalEntry.entries.reduce((sum: number, entry: any) => sum + (entry.credit || 0), 0);
  const currency = transaction?.currency === 'USD' ? '$' : '₹';
  return `${currency}${amount.toFixed(2)}`;
}

// Helper function to generate prepaid amortization schedule
function generatePrepaidSchedule(transaction: any) {
  const prepaidAmount = transaction.prepaidAmount || transaction.amount || 0;
  const period = transaction.prepaidPeriod || 'quarterly';
  
  let months = 3; // Default to quarterly
  if (period === 'monthly') months = 1;
  else if (period === 'annual') months = 12;
  
  const monthlyExpense = prepaidAmount / months;
  const schedule = [];
  
  // For HubSpot, start from May 2025
  const startDate = new Date('2025-05-01');
  
  for (let i = 0; i < months; i++) {
    const remainingBalance = prepaidAmount - (monthlyExpense * (i + 1));
    const monthDate = new Date(startDate);
    monthDate.setMonth(startDate.getMonth() + i);
    
    schedule.push({
      period: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      monthlyExpense: monthlyExpense,
      remainingBalance: Math.max(0, remainingBalance),
      status: i === 0 ? 'Current' : 'Scheduled'
    });
  }
  
  return schedule;
}

// Helper function to check if journal entry is balanced
function isBalanced(journalEntry: any) {
  return JournalEntryGenerator.isBalanced(journalEntry);
}

// Helper function to get vendor balance
function getVendorBalance(vendorName: string) {
  console.log('Getting balance for vendor:', vendorName);
  
  // Mock data - in real app this would come from the backend
  // These balances are calculated as net outstanding amounts after all invoices and payments
  const vendorBalances: { [key: string]: number } = {
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
    "HEPL": 0 // All invoices paid (96170+96170+96170 - 96170-96170-96170 = 0)
  };
  
  // Try exact match first
  let balance = vendorBalances[vendorName];
  
  // If no exact match, try partial matching
  if (balance === undefined) {
    const vendorKeys = Object.keys(vendorBalances);
    for (const key of vendorKeys) {
      if (vendorName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(vendorName.toLowerCase())) {
        balance = vendorBalances[key];
        console.log('Found partial match:', key, 'for vendor:', vendorName);
        break;
      }
    }
  }
  
  balance = balance || 0;
  console.log('Balance found:', balance);
  return balance;
}

// Helper function to get past journal entries for a vendor
function getPastJournalEntries(vendorName: string) {
  console.log('Getting past entries for vendor:', vendorName);
  
  // Try exact match first
  let entries = PAST_JOURNAL_ENTRIES[vendorName];
  
  // If no exact match, try partial matching
  if (!entries) {
    const vendorKeys = Object.keys(PAST_JOURNAL_ENTRIES);
    for (const key of vendorKeys) {
      if (vendorName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(vendorName.toLowerCase())) {
        entries = PAST_JOURNAL_ENTRIES[key];
        console.log('Found partial match for entries:', key, 'for vendor:', vendorName);
        break;
      }
    }
  }
  
  entries = entries || [];
  console.log('Entries found:', entries.length);
  return entries;
}