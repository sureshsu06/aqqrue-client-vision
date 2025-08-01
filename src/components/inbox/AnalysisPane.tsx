import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  UserCheck
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

  const analysisSteps = getAnalysisSteps(transaction);

  return (
    <div className="w-[500px] border-l border-mobius-gray-100 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-mobius-gray-100">
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
          ₹{transaction.amount.toLocaleString()} • {new Date(transaction.date).toLocaleDateString()}
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
      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="summary" className="h-full flex flex-col">
              <TabsList className="grid grid-cols-2 w-[calc(100%-2rem)] mx-4 mt-4 mb-2">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="analysis">Workings</TabsTrigger>
          </TabsList>

              <div className="flex-1 overflow-y-auto px-4 pb-4">
            <TabsContent value="summary" className="mt-0">
              <Card className="p-4">
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
                          <p className="font-medium">Indian Rupee (₹)</p>
                        </div>
                    </div>

                      {/* Undo Button */}
                      <div className="flex justify-between mb-0.5">
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
                        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                          <p className="font-medium mb-1">Formula Mode Active</p>
                          <p>Use Excel-like formulas: <code className="bg-blue-100 px-1 rounded">=B1*0.1</code>, <code className="bg-blue-100 px-1 rounded">=SUM(B1:B3)</code>, <code className="bg-blue-100 px-1 rounded">10%*C2</code></p>
                          <p className="text-blue-600 mt-1">B = Debit column, C = Credit column, numbers = row index (1-based)</p>
                        </div>
                      )}

                  <Separator />

                  {/* Journal Entry Table */}
                  <div>
                        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide mb-2">
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
                                  entry.debit ? `₹${entry.debit.toFixed(2)}` : "—"
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
                                  entry.credit ? `₹${entry.credit.toFixed(2)}` : "—"
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
                          <div className="col-span-3 text-right">{getTotalDebit(journalEntry)}</div>
                          <div className="col-span-3 text-right">{getTotalCredit(journalEntry)}</div>
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

                      {/* Comment Box */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-mobius-gray-700">Comments</label>
                        <textarea
                          className="w-full h-20 p-2 text-sm border border-mobius-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-mobius-blue focus:border-transparent"
                          placeholder="Add context or notes for this transaction..."
                        />
                      </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="mt-0">
              <div className="space-y-3">
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
            </TabsContent>
          </div>
        </Tabs>
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
    client: "Elire", // All transactions are for Elire
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
function getTotalDebit(journalEntry: any) {
  return `₹${journalEntry.entries.reduce((sum: number, entry: any) => sum + (entry.debit || 0), 0).toFixed(2)}`;
}

// Helper function to get total credit
function getTotalCredit(journalEntry: any) {
  return `₹${journalEntry.entries.reduce((sum: number, entry: any) => sum + (entry.credit || 0), 0).toFixed(2)}`;
}

// Helper function to check if journal entry is balanced
function isBalanced(journalEntry: any) {
  const totalDebit = journalEntry.entries.reduce((sum: number, entry: any) => sum + (entry.debit || 0), 0);
  const totalCredit = journalEntry.entries.reduce((sum: number, entry: any) => sum + (entry.credit || 0), 0);
  return Math.abs(totalDebit - totalCredit) < 0.01; // Allow for floating point inaccuracies
}