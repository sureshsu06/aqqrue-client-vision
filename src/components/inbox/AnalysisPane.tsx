import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  Edit3, 
  Eye, 
  AlertTriangle,
  Save,
  X,
  UserCheck,
  Undo2,
  ChevronDown,
  ChevronRight,
  FileText,
  BookOpen,
  BarChart3,
  Calendar,
  Clock,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types/Transaction";
import { useState, useEffect } from "react";
import { JournalEntryGenerator } from "@/lib/journalEntryGenerator";
import { useToast } from "@/hooks/use-toast";
import { evaluateFormula } from "@/lib/formulaEvaluator";
import { RevenueRecognition } from "./RevenueRecognition";
import { JournalEntryTable } from "./JournalEntryTable";
import { RevenueContractJournalEntry } from "./RevenueContractJournalEntry";
import { RevenueContractMonthlyEntries } from "./RevenueContractMonthlyEntries";
import { AnalysisSteps } from "./AnalysisSteps";
import { PrepaidExpense } from "./PrepaidExpense";
import { MonthlyScheduledEntries } from "./MonthlyScheduledEntries";

interface AnalysisPaneProps {
  transaction: Transaction;
  onApprove: () => void;
  onEdit: () => void;
  onSeeHow: () => void;
}

export function AnalysisPane({ transaction, onApprove, onEdit, onSeeHow }: AnalysisPaneProps) {
  const { toast } = useToast();
  const confidence = transaction.confidence || 95;
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedJournalEntry, setEditedJournalEntry] = useState<any>(null);
  const [journalEntry, setJournalEntry] = useState<any>(null);
  const [isFormulaMode, setIsFormulaMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    summary: false,
    analysis: false,
    journalEntry: true,
    schedules: false,
    monthlyEntries: false,
    pastTreatment: false
  });

  // Initialize journal entry data safely
  useEffect(() => {
    const initializeJournalEntry = async () => {
      try {
        console.log('Initializing AnalysisPane for transaction:', transaction);
        setError(null);
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const entry = JournalEntryGenerator.generateForTransaction(transaction);
        console.log('Generated journal entry:', entry);
        setJournalEntry(entry);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing journal entry:', error);
        setError(`Failed to load transaction data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
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
  }, [transaction.id]);

  // Initialize edited journal entry when entering edit mode
  const handleEditClick = () => {
    if (journalEntry) {
      setEditedJournalEntry(JSON.parse(JSON.stringify(journalEntry)));
      setIsEditMode(true);
    }
  };

  const handleSaveEdit = () => {
    console.log("Saving edited journal entry:", editedJournalEntry);
    setIsEditMode(false);
    setEditedJournalEntry(null);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedJournalEntry(null);
  };

  const updateJournalEntry = (index: number, field: string, value: any) => {
    if (!editedJournalEntry) return;
    
    const updatedEntries = [...editedJournalEntry.entries];
    
    if (field === 'debit' || field === 'credit') {
      if (typeof value === 'string' && value.trim() !== '') {
        const isFormula = isFormulaMode || value.startsWith('=') || /[A-Z]\d+/.test(value) || /%/.test(value);
        
        if (isFormula) {
          updatedEntries[index] = { ...updatedEntries[index], [field]: value };
        } else {
          const numValue = parseFloat(value);
          updatedEntries[index] = { ...updatedEntries[index], [field]: isNaN(numValue) ? 0 : numValue };
        }
      } else {
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

  const evaluateFormulaOnBlur = (index: number, field: string) => {
    if (!editedJournalEntry) return;
    
    const entry = editedJournalEntry.entries[index];
    const value = entry[field];
    
    if (typeof value === 'string' && value.trim() !== '') {
      const isFormula = isFormulaMode || value.startsWith('=') || /[A-Z]\d+/.test(value) || /%/.test(value);
      
      if (isFormula) {
        try {
          let formula = value;
          if (isFormulaMode && !value.startsWith('=')) {
            formula = '=' + value;
          } else if (value.startsWith('=')) {
            formula = value.substring(1);
          }
          
          const result = evaluateFormula(formula, editedJournalEntry.entries, index);
          
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

  const handleInvoiceClick = async (invoiceNumber: string, vendorName: string) => {
    toast({
      title: "Loading invoice...",
      description: `Fetching details for ${invoiceNumber}`,
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "Invoice Details",
      description: `Invoice ${invoiceNumber} from ${vendorName}`,
    });
    
    console.log(`Clicked on invoice: ${invoiceNumber} from ${vendorName}`);
  };

  const handleShowAllPreviousBills = (vendorName: string) => {
    if (transaction.pdfFile) {
      const pdfUrl = `/documents/${transaction.pdfFile}`;
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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Helper functions to generate preview information
  const getSummaryPreview = () => {
    const amount = transaction.currency === 'USD' ? '$' : '₹';
    const total = (transaction.amount || 0).toLocaleString();
    const status = transaction.type === 'bill' ? 'Pending' : 'Active';
    return `${amount}${total} • ${status}`;
  };

  const getJournalEntryPreview = () => {
    if (!journalEntry) return "Loading...";
    const accountCount = journalEntry.entries?.length || 0;
    const isBalanced = JournalEntryGenerator.isBalanced(journalEntry);
    return (
      <span>
        {accountCount} account{accountCount !== 1 ? 's' : ''} • {isBalanced ? <span className="text-green-600">✓ Balanced</span> : <span className="text-red-600">✗ Unbalanced</span>}
      </span>
    );
  };

  const getSchedulesPreview = () => {
    if (transaction.isPrepaid) {
      const period = transaction.prepaidPeriod || 'quarterly';
      return `${period} amortization • ${transaction.prepaidAmount ? `${transaction.currency === 'USD' ? '$' : '₹'}${transaction.prepaidAmount.toLocaleString()}` : 'Active'}`;
    } else if (transaction.type === 'contract') {
      const contractValue = transaction.contractValue || 0;
      const contractTerm = transaction.contractTerm || '12 months';
      return `Deferred revenue schedule • ${transaction.currency === 'USD' ? '$' : '₹'}${contractValue.toLocaleString()} over ${contractTerm}`;
    }
    return "No schedules";
  };

  const getMonthlyEntriesPreview = () => {
    if (transaction.isPrepaid) {
      return "Auto-generated monthly entries";
    } else if (transaction.type === 'contract') {
      return "Monthly revenue recognition entries";
    }
    return "No monthly entries";
  };

  const getAnalysisPreview = () => {
    const confidence = transaction.confidence || 95;
    if (confidence >= 95) return "High confidence analysis";
    if (confidence >= 85) return "Good confidence analysis";
    return `${confidence}% confidence • Review needed`;
  };

  const getPastTreatmentPreview = () => {
    const pastEntriesCount = getPastTreatmentEntries().length;
    return `${pastEntriesCount} previous entries • ${getTreatmentPattern()}`;
  };

  const getPastTreatmentEntries = () => {
    // Generate past treatment entries based on transaction type and vendor
    const entries = [];
    
    if (transaction.type === 'contract') {
      // For SaaS contracts, show past revenue recognition patterns
      entries.push(
        {
          invoiceNumber: "BW-2024-12-001",
          date: "Dec 15, 2024",
          amount: transaction.currency === 'USD' ? 8500 : 850000,
          treatment: "SaaS Revenue",
          details: "Debited to Cash/Accounts Receivable, Credited to Deferred Revenue",
          confidence: 100
        },
        {
          invoiceNumber: "BW-2024-11-002", 
          date: "Nov 8, 2024",
          amount: transaction.currency === 'USD' ? 12000 : 1200000,
          treatment: "SaaS Revenue",
          details: "Debited to Cash/Accounts Receivable, Credited to Deferred Revenue",
          confidence: 100
        },
        {
          invoiceNumber: "BW-2024-10-003",
          date: "Oct 2, 2024", 
          amount: transaction.currency === 'USD' ? 6500 : 650000,
          treatment: "SaaS Revenue",
          details: "Debited to Cash/Accounts Receivable, Credited to Deferred Revenue",
          confidence: 100
        }
      );
    } else if (transaction.isPrepaid) {
      // For prepaid expenses, show past prepaid treatment
      entries.push(
        {
          invoiceNumber: "HUBSPOT-614657704",
          date: "Dec 15, 2024",
          amount: transaction.currency === 'USD' ? 2100 : 210000,
          treatment: "Prepaid Software Subscriptions",
          details: "Debited to Prepaid Software Subscriptions, Credited to Vendor",
          confidence: 100
        },
        {
          invoiceNumber: "HUBSPOT-614657703",
          date: "Sep 15, 2024", 
          amount: transaction.currency === 'USD' ? 1800 : 180000,
          treatment: "Prepaid Software Subscriptions",
          details: "Debited to Prepaid Software Subscriptions, Credited to Vendor",
          confidence: 100
        },
        {
          invoiceNumber: "HUBSPOT-614657702",
          date: "Jun 15, 2024",
          amount: transaction.currency === 'USD' ? 1950 : 195000,
          treatment: "Prepaid Software Subscriptions", 
          details: "Debited to Prepaid Software Subscriptions, Credited to Vendor",
          confidence: 100
        }
      );
    } else {
      // For regular expenses, show past expense treatment
      const expenseType = transaction.currency === 'USD' ? 'US Operating Expenses' : 'General Expense';
      const taxAccounts = transaction.currency === 'USD' ? [] : ['Input CGST', 'Input SGST'];
      
      entries.push(
        {
          invoiceNumber: "EXP-001",
          date: "Dec 15, 2024",
          amount: transaction.currency === 'USD' ? 2150 : 215000,
          treatment: expenseType,
          details: `Debited to ${expenseType}, Credited to ${transaction.vendor}`,
          confidence: 95
        },
        {
          invoiceNumber: "EXP-002",
          date: "Nov 8, 2024",
          amount: transaction.currency === 'USD' ? 1890 : 189000,
          treatment: expenseType,
          details: `Debited to ${expenseType}, Credited to ${transaction.vendor}`,
          confidence: 95
        },
        {
          invoiceNumber: "EXP-003",
          date: "Oct 2, 2024",
          amount: transaction.currency === 'USD' ? 2450 : 245000,
          treatment: expenseType,
          details: `Debited to ${expenseType}, Credited to ${transaction.vendor}`,
          confidence: 95
        }
      );
    }
    
    return entries;
  };

  const getTreatmentPattern = () => {
    if (transaction.type === 'contract') {
      return "Revenue recognition pattern";
    } else if (transaction.isPrepaid) {
      return "Prepaid amortization pattern";
    } else {
      return "Consistent expense treatment";
    }
  };

  // Collapsible Section Component
  const CollapsibleSection = ({ 
    title, 
    sectionKey, 
    children, 
    preview,
    icon: Icon,
    defaultExpanded = false 
  }: { 
    title: string; 
    sectionKey: keyof typeof expandedSections; 
    children: React.ReactNode; 
    preview?: string | React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
    defaultExpanded?: boolean;
  }) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <div className="border border-mobius-gray-100 rounded-lg overflow-hidden hover:border-mobius-gray-200 transition-colors">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-mobius-gray-50 transition-all duration-200 border-0 focus:outline-none focus:ring-0 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-blue-700" />
              </div>
            )}
            <div className="text-left">
              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-800">
                {title}
              </h4>
              {preview && !isExpanded && (
                <p className="text-xs text-gray-700 mt-0.5">{preview}</p>
              )}
            </div>
          </div>
          <ChevronRight 
            className={cn(
              "w-4 h-4 text-mobius-gray-500 transition-transform duration-200",
              isExpanded && "rotate-90"
            )} 
          />
        </button>
        {isExpanded && (
          <div className="px-3 pb-3">
            {children}
          </div>
        )}
      </div>
    );
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          <div className="p-3">
            <div className="space-y-4">
              {/* Summary Section - Transaction Details */}
              <CollapsibleSection 
                title="Summary" 
                sectionKey="summary"
                preview={getSummaryPreview()}
                icon={FileText}
              >
                <div className="space-y-4 text-xs pt-4">
                  {/* Contract Details for revenue contracts */}
                  {transaction.type === 'contract' && (
                    <div className="bg-mobius-gray-50 rounded-lg p-3 mb-4">
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
                  )}
                  
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
              </CollapsibleSection>

              {/* Journal Entry Section */}
              <CollapsibleSection 
                title="Journal Entry" 
                sectionKey="journalEntry"
                preview={getJournalEntryPreview()}
                icon={BookOpen}
              >
                {transaction.type === 'contract' ? (
                  <RevenueContractJournalEntry 
                    transaction={transaction}
                    isFormulaMode={isFormulaMode}
                    onFormulaModeToggle={() => setIsFormulaMode(!isFormulaMode)}
                  />
                ) : (
                  <JournalEntryTable
                    journalEntry={isEditMode ? editedJournalEntry : journalEntry}
                    transaction={transaction}
                    isEditMode={isEditMode}
                    isFormulaMode={isFormulaMode}
                    onEditClick={handleEditClick}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                    onFormulaModeToggle={() => setIsFormulaMode(!isFormulaMode)}
                    onUpdateJournalEntry={updateJournalEntry}
                    onEvaluateFormulaOnBlur={evaluateFormulaOnBlur}
                    onAddRow={addRow}
                    onDeleteRow={deleteRow}
                  />
                )}
              </CollapsibleSection>

              {/* Schedules Section - Show for prepaid entries or revenue contracts */}
              {(transaction.isPrepaid || transaction.type === 'contract') && (
                <CollapsibleSection 
                  title="Schedules" 
                  sectionKey="schedules"
                  preview={getSchedulesPreview()}
                  icon={Calendar}
                >
                  {transaction.isPrepaid ? (
                    <PrepaidExpense transaction={transaction} />
                  ) : (
                    <RevenueRecognition 
                      transaction={transaction}
                      isFormulaMode={isFormulaMode}
                      onFormulaModeToggle={() => setIsFormulaMode(!isFormulaMode)}
                    />
                  )}
                </CollapsibleSection>
              )}

              {/* Monthly Entries Section - Show for prepaid entries or revenue contracts */}
              {(transaction.isPrepaid || transaction.type === 'contract') && (
                <CollapsibleSection 
                  title="Monthly Entries" 
                  sectionKey="monthlyEntries"
                  preview={getMonthlyEntriesPreview()}
                  icon={Clock}
                >
                  {transaction.isPrepaid ? (
                    <MonthlyScheduledEntries transaction={transaction} />
                  ) : (
                    <RevenueContractMonthlyEntries transaction={transaction} />
                  )}
                </CollapsibleSection>
              )}

              {/* Analysis Section */}
              <CollapsibleSection 
                title="Analysis" 
                sectionKey="analysis"
                preview={getAnalysisPreview()}
                icon={BarChart3}
              >
                <AnalysisSteps transaction={transaction} confidence={confidence} />
              </CollapsibleSection>

              {/* Past Treatment Section */}
              <CollapsibleSection 
                title="Past Treatment" 
                sectionKey="pastTreatment"
                preview={getPastTreatmentPreview()}
                icon={History}
              >
                <div className="space-y-4 text-xs pt-4">
                  <div className="space-y-3">
                    {getPastTreatmentEntries().map((entry, index) => (
                      <div key={index} className="p-3 bg-mobius-gray-50 rounded-lg border border-mobius-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">Invoice #{entry.invoiceNumber}</span>
                          <span className="text-xs text-mobius-gray-500">{entry.date}</span>
                        </div>
                        <div className="text-xs text-mobius-gray-600">
                          <p className="mb-1">
                            Amount: {transaction.currency === 'USD' ? '$' : '₹'}{entry.amount.toLocaleString()}
                          </p>
                          <p className="mb-1">
                            Treatment: <span className="font-medium text-green-600">{entry.treatment}</span>
                          </p>
                          <p className="text-mobius-gray-500">{entry.details}</p>
                          <p className="text-mobius-gray-400 mt-1">
                            Confidence: {entry.confidence}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="text-xs">
                        <p className="font-medium text-blue-900 mb-1">
                          {transaction.type === 'contract' ? 'Revenue Recognition Pattern' : 
                           transaction.isPrepaid ? 'Prepaid Amortization Pattern' : 
                           'Consistent Treatment Pattern'} Detected
                        </p>
                        <p className="text-blue-700">
                          {transaction.type === 'contract' ? 
                            `All previous SaaS contracts have been treated with deferred revenue recognition. This suggests the current contract should follow the same revenue recognition pattern.` :
                           transaction.isPrepaid ?
                            `All previous prepaid expenses from ${transaction.vendor} have been treated as prepaid assets with amortization schedules. This suggests the current transaction should follow the same prepaid treatment pattern.` :
                            `All previous entries from ${transaction.vendor} have been treated as ${transaction.currency === 'USD' ? 'US Operating Expenses' : 'General Expense'} with high confidence. This suggests the current transaction should follow the same treatment pattern.`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
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