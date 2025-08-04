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
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction } from "./InboxList";
import { useState, useEffect } from "react";

interface AnalysisPaneProps {
  transaction: Transaction;
  onApprove: () => void;
  onEdit: () => void;
  onSeeHow: () => void;
}

export function AnalysisPane({ transaction, onApprove, onEdit, onSeeHow }: AnalysisPaneProps) {
  const confidence = transaction.confidence || 95;
  const [isEditMode, setIsEditMode] = useState(false); // Default to view mode
  const [editedJournalEntry, setEditedJournalEntry] = useState<any>(null);
  const [journalEntry, setJournalEntry] = useState<any>(null);
  const [isFormulaMode, setIsFormulaMode] = useState(false); // Formula mode toggle
  const [isWorkingsExpanded, setIsWorkingsExpanded] = useState(false); // New state for workings expansion
  const [activeTab, setActiveTab] = useState<'summary' | 'ledger'>('summary'); // New state for tab management
  const [isScheduleEditMode, setIsScheduleEditMode] = useState(false); // New state for schedule edit mode
  const [editedSchedule, setEditedSchedule] = useState<any[]>([]); // New state for edited schedule

  // Initialize journal entry data safely
  useEffect(() => {
    try {
      const entry = getJournalEntryForTransaction(transaction);
      setJournalEntry(entry);
      
      // Initialize edited journal entry when in edit mode
      if (isEditMode && !editedJournalEntry) {
        setEditedJournalEntry(JSON.parse(JSON.stringify(entry)));
      }
    } catch (error) {
      console.error('Error initializing journal entry:', error);
      // Set a fallback journal entry
      setJournalEntry({
        client: "Elire",
        invoiceNumber: "INV-2025-001",
        totalAmount: transaction.amount,
        entryType: "General Expense",
        narration: `Being the expense payable to ${transaction.vendor}`,
        entries: [
          { account: "General Expense", debit: transaction.amount * 0.85, credit: 0, confidence: 95 },
          { account: transaction.vendor, debit: 0, credit: transaction.amount, confidence: 100 }
        ]
      });
    }
  }, [transaction, isEditMode, editedJournalEntry]);

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
        result: `Extracted ₹${transaction.amount.toLocaleString()} from ${transaction.vendor} invoice with 100% accuracy`
    },
    {
      step: 2,
        title: "Capex/Opex",
        status: "complete" as const,
        confidence: 95,
        result: getCapexOpexResult(transaction)
    },
    {
      step: 3,
        title: "GST Applicability",
        status: "complete" as const,
        confidence: 100,
        result: getGSTResult(transaction)
    },
    {
      step: 4,
        title: "TDS",
        status: "complete" as const,
        confidence: 100,
        result: getTDSResult(transaction)
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
    
    // Always show month-wise recognition for proper deferred revenue tracking
    let totalMonths = 12; // Default to 12 months
    
    if (billingCycle === 'annual') {
      // For annual contracts, calculate total months from contract term
      const termYears = parseInt(transaction.contractTerm.split(' ')[0]);
      totalMonths = termYears * 12;
    } else {
      // For monthly contracts, use the term months
      totalMonths = parseInt(transaction.contractTerm.split(' ')[0]);
    }
    
    const monthlyRevenue = totalValue / totalMonths;
    const schedule = [];
    
    for (let i = 1; i <= Math.min(totalMonths, 12); i++) { // Show max 12 months
      const recognized = monthlyRevenue;
      const remainingDeferred = totalValue - (recognized * i);
      
      schedule.push({
        period: `Month ${i}`,
        monthlyRevenue: Math.round(monthlyRevenue),
        deferredRevenue: Math.round(Math.max(0, remainingDeferred)),
        recognized: Math.round(recognized)
      });
    }
    
    return schedule;
  };

  const analysisSteps = getAnalysisSteps(transaction);

  return (
    <div className="bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-mobius-gray-100 flex-shrink-0">
        {/* Client Pill */}
        <div className="mb-3">
          <Badge variant="outline" className="bg-mobius-blue/10 text-mobius-blue border-mobius-blue/20 text-sm font-medium">
            {transaction.client}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{transaction.vendor}</h3>
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
        </div>

        {transaction.isDuplicate && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-sm">
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

        <p className="text-sm text-mobius-gray-500">
          {transaction.type === 'contract' ? '$' : '₹'}{transaction.amount.toLocaleString()} • {new Date(transaction.date).toLocaleDateString()}
        </p>
      </div>

      {/* Loading state */}
      {!journalEntry && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-mobius-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mobius-blue mx-auto mb-2"></div>
            <p>Loading journal entry...</p>
          </div>
        </div>
      )}

      {/* Content - only render if journalEntry exists */}
      {journalEntry && (
        <>
      {/* Tab Navigation - Above the fold */}
      <div className="px-4 py-3 bg-white">
        <div className="bg-mobius-gray-50 rounded-lg p-1">
          <div className="flex">
            <button
              onClick={() => setActiveTab('summary')}
              className={cn(
                "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors",
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
                "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors",
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
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="p-4">
            <div className="space-y-4">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-mobius-gray-500">Client:</p>
                  <p className="font-medium">{journalEntry.client}</p>
                </div>
                <div>
                  <p className="text-mobius-gray-500">Invoice #:</p>
                  <p className="font-medium">{journalEntry.invoiceNumber} 
                    {journalEntry.isBillable && (
                      <Badge variant="outline" className="ml-2 text-xs">Billable ✓</Badge>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-mobius-gray-500">Currency:</p>
                  <p className="font-medium">{transaction.type === 'contract' ? 'US Dollar ($)' : 'Indian Rupee (₹)'}</p>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'summary' ? (
                <div className="space-y-4">
                  {transaction.type === 'contract' ? (
                    // SaaS Contract Details for Revenue
                    <div className="space-y-6">
                      {/* Contract Details */}
                      <div className="bg-mobius-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-mobius-gray-900 mb-3">Contract Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-mobius-gray-500">Contract Value:</p>
                            <p className="font-medium">${transaction.contractValue?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-mobius-gray-500">Currency:</p>
                            <p className="font-medium">{transaction.currency || 'USD'}</p>
                          </div>
                          <div>
                            <p className="text-mobius-gray-500">Contract Term:</p>
                            <p className="font-medium">{transaction.contractTerm}</p>
                          </div>
                          <div>
                            <p className="text-mobius-gray-500">Billing Cycle:</p>
                            <p className="font-medium">{transaction.billingCycle}</p>
                          </div>
                          <div>
                            <p className="text-mobius-gray-500">Start Date:</p>
                            <p className="font-medium">{transaction.contractStartDate}</p>
                          </div>
                          <div>
                            <p className="text-mobius-gray-500">End Date:</p>
                            <p className="font-medium">{transaction.contractEndDate}</p>
                          </div>
                        </div>
                      </div>

                      {/* Deferred Revenue Schedule */}
                      <div className="p-4">
                        <h4 className="text-sm font-medium text-mobius-gray-900 mb-3">Deferred Revenue Schedule</h4>
                        <div className="space-y-3">
                          <div className="grid grid-cols-4 gap-2 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide">
                            <div>Period</div>
                            <div className="text-right">Monthly Revenue</div>
                            <div className="text-right">Deferred Revenue</div>
                            <div className="text-right">Recognized</div>
                          </div>
                          
                          {(() => {
                            const schedule = isScheduleEditMode ? editedSchedule : generateDeferredRevenueSchedule(transaction);
                            console.log("Rendering schedule:", schedule, "Edit mode:", isScheduleEditMode);
                            return schedule.map((period, index) => (
                              <div key={index} className="grid grid-cols-4 gap-2 text-sm border-b border-mobius-gray-200 pb-2">
                                <div className="font-medium">{period.period}</div>
                                <div className="text-right">
                                  {isScheduleEditMode ? (
                                    <Input
                                      type="number"
                                      value={period.monthlyRevenue}
                                      onChange={(e) => updateScheduleEntry(index, 'monthlyRevenue', parseFloat(e.target.value) || 0)}
                                      className="h-6 text-sm text-right border-mobius-gray-200 w-20"
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
                                      className="h-6 text-sm text-right border-mobius-gray-200 w-20"
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
                                      className="h-6 text-sm text-right border-mobius-gray-200 w-20"
                                    />
                                  ) : (
                                    `$${period.recognized.toLocaleString()}`
                                  )}
                                </div>
                              </div>
                            ));
                          })()}
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

                      {/* Editable Journal Entry Table for Contracts */}
                      <div className="p-4">
                        <div className="flex justify-between mb-4">
                          <h4 className="text-sm font-medium text-mobius-gray-900">Journal Entries</h4>
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
                              <div key={index} className="grid grid-cols-12 gap-2 text-sm items-center group">
                                <div className="col-span-5 font-medium text-sm">
                                  {isEditMode ? (
                                    <Select 
                                      value={entry.account} 
                                      onValueChange={(value) => updateJournalEntry(index, 'account', value)}
                                    >
                                      <SelectTrigger className="h-8 text-sm border-mobius-gray-200 text-left justify-start">
                                        <SelectValue className="text-sm text-left" />
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
                                    entry.debit ? `$${entry.debit.toFixed(2)}` : "—"
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
                                    entry.credit ? `$${entry.credit.toFixed(2)}` : "—"
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
                          <div className="grid grid-cols-12 gap-2 text-sm font-medium">
                            <div className="col-span-5">Totals</div>
                            <div className="col-span-3 text-right">{getTotalDebit(journalEntry, transaction)}</div>
                            <div className="col-span-3 text-right">{getTotalCredit(journalEntry, transaction)}</div>
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
                    </div>
                  ) : (
                    // Regular Analysis for Bills/Expenses
                    <>
                      {/* Undo Button */}
                      <div className="flex justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-mobius-gray-900">Proposed Entries</h4>
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
                            <div key={index} className="grid grid-cols-12 gap-2 text-sm items-center group">
                              <div className="col-span-5 font-medium text-sm">
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
                                  entry.debit ? `$${entry.debit.toFixed(2)}` : "—"
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
                                  entry.credit ? `$${entry.credit.toFixed(2)}` : "—"
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
                        <div className="grid grid-cols-12 gap-2 text-sm font-medium">
                          <div className="col-span-5">Totals</div>
                          <div className="col-span-3 text-right">{getTotalDebit(journalEntry, transaction)}</div>
                          <div className="col-span-3 text-right">{getTotalCredit(journalEntry, transaction)}</div>
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

                  {/* Comment Box */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-mobius-gray-700">Comments</label>
                    <textarea
                      className="w-full h-20 p-2 text-sm border border-mobius-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-mobius-blue focus:border-transparent"
                      placeholder="Add context or notes for this transaction..."
                    />
                  </div>

                  {/* Workings Section - Expandable */}
                  <Separator />
                  <div className="space-y-3">
                    <button
                      onClick={() => setIsWorkingsExpanded(!isWorkingsExpanded)}
                      className="flex items-center justify-between w-full text-left hover:bg-mobius-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-mobius-gray-900">Analysis Workings</h4>
                        <Badge variant="outline" className="bg-status-done/10 text-status-done border-status-done/20 text-xs">
                          {confidence}%
                        </Badge>
                      </div>
                      {isWorkingsExpanded ? (
                        <ChevronDown className="w-4 h-4 text-mobius-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-mobius-gray-500" />
                      )}
                    </button>
                    
                    {isWorkingsExpanded && (
                      <div className="space-y-3 pl-4">
                        {analysisSteps.map((step) => (
                          <Card key={step.step} className="p-3">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                  <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mt-0.5",
                                    step.status === "complete" 
                                      ? "bg-status-done text-white"
                                      : step.status === "skip"
                                      ? "bg-mobius-gray-300 text-mobius-gray-600"
                                      : "bg-status-pending text-white"
                                  )}>
                                    {step.status === "complete" ? "✓" : step.step}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm mb-1">{step.title}</h4>
                                    <p className="text-xs text-mobius-gray-600 leading-relaxed">{step.result}</p>
                                  </div>
                                </div>
                                {step.status === "complete" && (
                                  <Badge variant="outline" className="bg-status-done/10 text-status-done border-status-done/20 text-xs ml-2">
                                    {step.confidence}%
                                  </Badge>
                                )}
                              </div>
                              
                              {/* Comment and Retry Section */}
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Input
                                    placeholder="Add a comment or correction for this analysis step..."
                                    className="h-8 text-xs border-mobius-gray-200 flex-1"
                                  />
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => console.log(`Retry ${step.title} for transaction ${transaction.id}`)}
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Ledger Tab Content */
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-mobius-gray-900">Vendor Ledger</h4>
                    <Badge variant="outline" className="text-xs">
                      {transaction.vendor}
                    </Badge>
                  </div>
                  
                  {/* Current Balance */}
                  <div className="bg-mobius-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-mobius-gray-600">Current Balance</span>
                      <span className="text-lg font-semibold text-mobius-gray-900">
                        ₹{getVendorBalance(transaction.vendor).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Past Journal Entries */}
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-mobius-gray-700">Past Journal Entries</h5>
                    <div className="space-y-2">
                      {getPastJournalEntries(transaction.vendor).map((entry, index) => (
                        <div key={index} className="border border-mobius-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-sm font-medium text-mobius-gray-900">{entry.invoiceNumber}</p>
                              <p className="text-xs text-mobius-gray-500">{new Date(entry.date).toLocaleDateString()}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {entry.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-mobius-gray-500">Amount:</span>
                              <span className="ml-2 font-medium">₹{entry.amount.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-mobius-gray-500">Type:</span>
                              <span className="ml-2 font-medium">{entry.type}</span>
                            </div>
                          </div>
                        </div>
                      ))}
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
    </div>
  );
}

// Function to generate transaction-specific journal entries
function getJournalEntryForTransaction(transaction: any) {
  const baseEntry = {
    vendor: transaction.vendor,
    amount: transaction.amount,
    date: transaction.date,
    client: transaction.client, // Use the actual transaction client
    isRecurring: transaction.isRecurring,
    isBillable: true,
    costCenter: "US Operations",
    location: "San Francisco HQ"
  };

  // Transaction-specific journal entries
  switch (transaction.id) {
    case "1": // JCSS & Associates LLP - ASO-I/109/25-26
      return {
        ...baseEntry,
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
        ...baseEntry,
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
        ...baseEntry,
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
        ...baseEntry,
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
        ...baseEntry,
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
        ...baseEntry,
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
        ...baseEntry,
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
        ...baseEntry,
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
        ...baseEntry,
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
        ...baseEntry,
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

    case "13": // Bishop Wisecarver - RhythmsAI OKR Platform
      return {
        ...baseEntry,
        invoiceNumber: "RHYTHMS-BW-001",
        totalAmount: 7020,
        entryType: "SaaS Revenue",
        narration: "Being the SaaS revenue from Bishop Wisecarver for RhythmsAI OKR Platform subscription",
        entries: [
          { account: "Cash/Accounts Receivable", debit: 7020, credit: 0, confidence: 100 },
          { account: "Deferred Revenue", debit: 0, credit: 7020, confidence: 100 }
        ]
      };

    case "14": // MARKETview Technology - RhythmsAI OKR Platform
      return {
        ...baseEntry,
        invoiceNumber: "RHYTHMS-MV-001",
        totalAmount: 10000,
        entryType: "SaaS Revenue",
        narration: "Being the SaaS revenue from MARKETview Technology for RhythmsAI OKR Platform subscription",
        entries: [
          { account: "Cash/Accounts Receivable", debit: 10000, credit: 0, confidence: 100 },
          { account: "Deferred Revenue", debit: 0, credit: 10000, confidence: 100 }
        ]
      };

    case "15": // Sera - SaaS Cloud Services
      return {
        ...baseEntry,
        invoiceNumber: "RHYTHMS-SERA-001",
        totalAmount: 95000,
        entryType: "SaaS Revenue",
        narration: "Being the SaaS revenue from Sera for cloud services subscription",
        entries: [
          { account: "Cash/Accounts Receivable", debit: 95000, credit: 0, confidence: 100 },
          { account: "Deferred Revenue", debit: 0, credit: 95000, confidence: 100 }
        ]
      };

    case "16": // Valpak - SaaS Cloud Services
      return {
        ...baseEntry,
        invoiceNumber: "RHYTHMS-VALPAK-001",
        totalAmount: 75000,
        entryType: "SaaS Revenue",
        narration: "Being the SaaS revenue from Valpak for cloud services subscription",
        entries: [
          { account: "Cash/Accounts Receivable", debit: 75000, credit: 0, confidence: 100 },
          { account: "Deferred Revenue", debit: 0, credit: 75000, confidence: 100 }
        ]
      };

    case "17": // Networkology - SaaS Cloud Services
      return {
        ...baseEntry,
        invoiceNumber: "RHYTHMS-NET-001",
        totalAmount: 110000,
        entryType: "SaaS Revenue",
        narration: "Being the SaaS revenue from Networkology for cloud services subscription",
        entries: [
          { account: "Cash/Accounts Receivable", debit: 110000, credit: 0, confidence: 100 },
          { account: "Deferred Revenue", debit: 0, credit: 110000, confidence: 100 }
        ]
      };

    case "18": // AlineOps - SaaS Cloud Services
      return {
        ...baseEntry,
        invoiceNumber: "RHYTHMS-ALINE-001",
        totalAmount: 135000,
        entryType: "SaaS Revenue",
        narration: "Being the SaaS revenue from AlineOps for cloud services subscription",
        entries: [
          { account: "Cash/Accounts Receivable", debit: 135000, credit: 0, confidence: 100 },
          { account: "Deferred Revenue", debit: 0, credit: 135000, confidence: 100 }
        ]
      };

    default:
      // Fallback for any other transactions
      return {
        ...baseEntry,
        invoiceNumber: "INV-2025-001",
        totalAmount: transaction.amount,
        entryType: "General Expense",
        narration: `Being the expense payable to ${transaction.vendor}`,
        entries: [
          { account: "General Expense", debit: transaction.amount * 0.85, credit: 0, confidence: 95 },
          { account: "Input CGST", debit: transaction.amount * 0.075, credit: 0, confidence: 100 },
          { account: "Input SGST", debit: transaction.amount * 0.075, credit: 0, confidence: 100 },
          { account: transaction.vendor, debit: 0, credit: transaction.amount, confidence: 100 }
        ]
      };
  }
}

// Helper function to get GL account code
function getGLAccountCode(accountName: string) {
  switch (accountName) {
    case "Cash/Accounts Receivable":
      return "1001";
    case "Deferred Revenue":
      return "2001";
    case "SaaS Revenue":
      return "4001";
    case "Professional Fees":
      return "1010";
    case "Rent":
      return "1011";
    case "Computers":
      return "1012";
    case "Freight and Postage":
      return "1013";
    case "Rates & Taxes":
      return "1014";
    case "Input CGST":
      return "1015";
    case "Input SGST":
      return "1016";
    case "Input IGST":
      return "1017";
    case "TDS on Professional Charges":
      return "1018";
    case "TDS on Rent":
      return "1019";
    case "JCSS & Associates LLP":
      return "1020";
    case "Sogo Computers Pvt Ltd":
      return "1021";
    case "Clayworks Spaces Technologies Pvt Ltd":
      return "1022";
    case "NSDL Database Management Ltd":
      return "1023";
    default:
      return "";
  }
}

// Helper function to get total debit
function getTotalDebit(journalEntry: any, transaction?: any) {
  const amount = journalEntry.entries.reduce((sum: number, entry: any) => sum + (entry.debit || 0), 0);
  const currency = transaction?.type === 'contract' ? '$' : '₹';
  return `${currency}${amount.toFixed(2)}`;
}

// Helper function to get total credit
function getTotalCredit(journalEntry: any, transaction?: any) {
  const amount = journalEntry.entries.reduce((sum: number, entry: any) => sum + (entry.credit || 0), 0);
  const currency = transaction?.type === 'contract' ? '$' : '₹';
  return `${currency}${amount.toFixed(2)}`;
}

// Helper function to check if journal entry is balanced
function isBalanced(journalEntry: any) {
  const totalDebit = journalEntry.entries.reduce((sum: number, entry: any) => sum + (entry.debit || 0), 0);
  const totalCredit = journalEntry.entries.reduce((sum: number, entry: any) => sum + (entry.credit || 0), 0);
  return Math.abs(totalDebit - totalCredit) < 0.01; // Allow for floating point inaccuracies
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
  
  // Mock data - in real app this would come from the backend
  const pastEntries: { [key: string]: any[] } = {
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
    "Sogo Computers": [
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
    "Sogo": [
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
    "Clayworks Spaces Technologies": [
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
    "Clayworks Spaces Pvt Ltd": [
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
    "Clayworks Spaces": [
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
    "Clayworks": [
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
    "NSDL Database Management": [
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
    "NSDL": [
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
    "Mahat Labs": [
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
    "Mahat": [
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
    ]
  };
  
  // Try exact match first
  let entries = pastEntries[vendorName];
  
  // If no exact match, try partial matching
  if (!entries) {
    const vendorKeys = Object.keys(pastEntries);
    for (const key of vendorKeys) {
      if (vendorName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(vendorName.toLowerCase())) {
        entries = pastEntries[key];
        console.log('Found partial match for entries:', key, 'for vendor:', vendorName);
        break;
      }
    }
  }
  
  entries = entries || [];
  console.log('Entries found:', entries.length);
  return entries;
}