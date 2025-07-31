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
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction } from "./InboxList";
import { useState } from "react";

interface AnalysisPaneProps {
  transaction: Transaction;
  onApprove: () => void;
  onEdit: () => void;
  onSeeHow: () => void;
}

export function AnalysisPane({ transaction, onApprove, onEdit, onSeeHow }: AnalysisPaneProps) {
  const confidence = transaction.confidence || 95;
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedJournalEntry, setEditedJournalEntry] = useState<any>(null);
  const [formulaMode, setFormulaMode] = useState<{[key: string]: boolean}>({});

  // Mock journal entry data
  const journalEntry = getJournalEntryForTransaction(transaction);

  // Initialize edited journal entry when entering edit mode
  const handleEditClick = () => {
    setEditedJournalEntry(JSON.parse(JSON.stringify(journalEntry))); // Deep copy
    setIsEditMode(true);
    setFormulaMode({});
  };

  const handleSaveEdit = () => {
    // Here you would typically save the changes to your backend
    console.log("Saving edited journal entry:", editedJournalEntry);
    setIsEditMode(false);
    setEditedJournalEntry(null);
    setFormulaMode({});
    // You could also call a callback to update the parent component
    if (onEdit) onEdit();
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedJournalEntry(null);
    setFormulaMode({});
  };

  const updateJournalEntry = (index: number, field: string, value: any) => {
    if (!editedJournalEntry) return;
    
    const updatedEntries = [...editedJournalEntry.entries];
    
    // Handle formula evaluation
    if (field === 'debit' || field === 'credit') {
      if (typeof value === 'string' && value.startsWith('=')) {
        // Formula mode
        const formula = value.substring(1);
        try {
          const result = evaluateFormula(formula, updatedEntries, index);
          updatedEntries[index] = { ...updatedEntries[index], [field]: result };
        } catch (error) {
          // Keep the formula as string if evaluation fails
          updatedEntries[index] = { ...updatedEntries[index], [field]: value };
        }
      } else {
        // Regular number input
        updatedEntries[index] = { ...updatedEntries[index], [field]: parseFloat(value) || 0 };
      }
    } else {
      updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    }
    
    setEditedJournalEntry({
      ...editedJournalEntry,
      entries: updatedEntries
    });
  };

  const evaluateFormula = (formula: string, entries: any[], currentIndex: number) => {
    // Simple formula evaluation with cell references like A1, B2, etc.
    const cellRefs = formula.match(/[A-Z]\d+/g) || [];
    let evaluatedFormula = formula;
    
    cellRefs.forEach(ref => {
      const col = ref.charCodeAt(0) - 65; // A=0, B=1, C=2
      const row = parseInt(ref.substring(1)) - 1;
      
      if (row >= 0 && row < entries.length) {
        let cellValue = 0;
        if (col === 1) cellValue = entries[row].debit || 0; // B column = debit
        if (col === 2) cellValue = entries[row].credit || 0; // C column = credit
        
        evaluatedFormula = evaluatedFormula.replace(ref, cellValue.toString());
      }
    });
    
    // Basic math evaluation
    return eval(evaluatedFormula);
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

  const toggleFormulaMode = (index: number, field: string) => {
    const key = `${index}-${field}`;
    setFormulaMode(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
        return "TDS 10% under Section 194I - Rent. Section threshold: ₹2,40,000 per annum. Invoice amount: ₹5,251 (below threshold)";
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

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="summary" className="h-full flex flex-col">
          <TabsList className="grid grid-cols-2 w-[calc(100%-2rem)] mx-4 mt-4 mb-2">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
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
                      <p className="text-mobius-gray-500">Vendor:</p>
                      <p className="font-medium">{journalEntry.vendor}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Journal Entry Table */}
                  <div>
                    <div className="grid grid-cols-4 gap-2 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide mb-2">
                      <div className="pl-0">ACCOUNT</div>
                      <div className="text-right">DEBIT</div>
                      <div className="text-right">CREDIT</div>
                      <div className="text-center">ACTIONS</div>
                    </div>
                    
                    <div className="space-y-1">
                      {(isEditMode ? editedJournalEntry : journalEntry).entries.map((entry: any, index: number) => (
                        <div key={index} className="grid grid-cols-4 gap-2 text-sm items-center">
                          <div className="font-medium text-sm">
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
                              entry.account
                            )}
                          </div>
                          <div className="text-right">
                            {isEditMode ? (
                              <div className="flex items-center space-x-1">
                                <Input
                                  type="text"
                                  value={formulaMode[`${index}-debit`] ? (entry.debit?.toString().startsWith('=') ? entry.debit : `=${entry.debit || 0}`) : (entry.debit || '')}
                                  onChange={(e) => updateJournalEntry(index, 'debit', e.target.value)}
                                  className="h-8 text-sm text-right border-mobius-gray-200 font-variant-numeric tabular-nums flex-1"
                                  placeholder="0.00"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-6 p-0"
                                  onClick={() => toggleFormulaMode(index, 'debit')}
                                  title="Toggle formula mode"
                                >
                                  <span className="text-xs">fx</span>
                                </Button>
                              </div>
                            ) : (
                              entry.debit ? `₹${entry.debit.toFixed(2)}` : "—"
                            )}
                          </div>
                          <div className="text-right">
                            {isEditMode ? (
                              <div className="flex items-center space-x-1">
                                <Input
                                  type="text"
                                  value={formulaMode[`${index}-credit`] ? (entry.credit?.toString().startsWith('=') ? entry.credit : `=${entry.credit || 0}`) : (entry.credit || '')}
                                  onChange={(e) => updateJournalEntry(index, 'credit', e.target.value)}
                                  className="h-8 text-sm text-right border-mobius-gray-200 font-variant-numeric tabular-nums flex-1"
                                  placeholder="0.00"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-6 p-0"
                                  onClick={() => toggleFormulaMode(index, 'credit')}
                                  title="Toggle formula mode"
                                >
                                  <span className="text-xs">fx</span>
                                </Button>
                              </div>
                            ) : (
                              entry.credit ? `₹${entry.credit.toFixed(2)}` : "—"
                            )}
                          </div>
                          <div className="flex items-center justify-center space-x-1">
                            {isEditMode && (
                              <>
                                <span className="text-xs text-mobius-gray-400">
                                  B{index + 1}, C{index + 1}
                                </span>
                                {editedJournalEntry.entries.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 ml-1"
                                    onClick={() => deleteRow(index)}
                                    title="Delete row"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                )}
                              </>
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
                      </div>
                    )}
                    
                    <Separator className="my-2" />
                    
                    <div className="grid grid-cols-4 gap-2 text-sm font-medium">
                      <div>Balance</div>
                      <div className="text-right">—</div>
                      <div className="text-right text-status-done">₹0.00 ✓</div>
                      <div></div>
                    </div>
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
          </div>
        ) : (
        <div className="space-y-2">
          <Button className="bg-status-done hover:bg-status-done/90 w-full" onClick={onApprove}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1" onClick={onSeeHow}>
              <Eye className="w-4 h-4 mr-2" />
              See How
            </Button>
              <Button variant="outline" className="flex-1" onClick={handleEditClick}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
        )}
      </div>
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
        invoiceNumber: "WONDER-LAPTOP-001",
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