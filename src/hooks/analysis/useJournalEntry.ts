import { useState, useEffect } from 'react';
import { Transaction, JournalEntry } from '../../types/Transaction';
import { JournalEntryGenerator } from '../../lib/journalEntryGenerator';
import { FormulaEvaluator } from '../../lib/formulaEvaluator';

export function useJournalEntry(transaction: Transaction) {
  const [journalEntry, setJournalEntry] = useState<JournalEntry | null>(null);
  const [editedJournalEntry, setEditedJournalEntry] = useState<JournalEntry | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize journal entry data
  useEffect(() => {
    try {
      console.log('Initializing journal entry for transaction:', transaction);
      setError(null);
      
      const entry = JournalEntryGenerator.generateForTransaction(transaction);
      console.log('Generated journal entry:', entry);
      setJournalEntry(entry);
      
      // Initialize edited journal entry when in edit mode
      if (isEditMode && !editedJournalEntry) {
        setEditedJournalEntry(JSON.parse(JSON.stringify(entry)));
      }
    } catch (error) {
      console.error('Error initializing journal entry:', error);
      setError(`Failed to load transaction data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [transaction, isEditMode, editedJournalEntry]);

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
    
    // Handle formula evaluation for debit/credit fields
    if (field === 'debit' || field === 'credit') {
      if (typeof value === 'string' && value.trim() !== '') {
        // Store the formula as-is for now, don't evaluate immediately
        updatedEntries[index] = { ...updatedEntries[index], [field]: value };
      } else {
        // Regular number input
        const numValue = parseFloat(value);
        updatedEntries[index] = { ...updatedEntries[index], [field]: isNaN(numValue) ? 0 : numValue };
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
      const isFormula = FormulaEvaluator.isFormula(value);
      
      if (isFormula) {
        try {
          const evaluator = new FormulaEvaluator(editedJournalEntry.entries, index);
          const result = evaluator.evaluate(value);
          
          const updatedEntries = [...editedJournalEntry.entries];
          updatedEntries[index] = { ...updatedEntries[index], [field]: result.result };
          
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
    
    const updatedEntries = editedJournalEntry.entries.filter((_, i) => i !== index);
    setEditedJournalEntry({
      ...editedJournalEntry,
      entries: updatedEntries
    });
  };

  return {
    journalEntry,
    editedJournalEntry,
    isEditMode,
    error,
    handleEditClick,
    handleSaveEdit,
    handleCancelEdit,
    updateJournalEntry,
    evaluateFormulaOnBlur,
    addRow,
    deleteRow
  };
} 