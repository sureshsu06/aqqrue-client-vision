import React from "react";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { Transaction } from "@/types/Transaction";
import { JournalEntryTable } from "./JournalEntryTable";
import { getAssignedVendor } from "@/lib/paymentsUtils";

interface PaymentJournalEntryProps {
  selectedTransaction: Transaction;
  isEditMode: boolean;
  editedJournalEntry: any;
  isFormulaMode: boolean;
  vendorAssignments: {[key: string]: string};
  onEditClick: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onFormulaModeToggle: () => void;
  onUpdateJournalEntry: (index: number, field: string, value: any) => void;
  onEvaluateFormulaOnBlur: (index: number, field: string) => void;
  onAddRow: () => void;
  onDeleteRow: (index: number) => void;
}

export function PaymentJournalEntry({
  selectedTransaction,
  isEditMode,
  editedJournalEntry,
  isFormulaMode,
  vendorAssignments,
  onEditClick,
  onSaveEdit,
  onCancelEdit,
  onFormulaModeToggle,
  onUpdateJournalEntry,
  onEvaluateFormulaOnBlur,
  onAddRow,
  onDeleteRow
}: PaymentJournalEntryProps) {
  // Create a simple payment journal entry for editing
  const paymentEntry = {
    client: selectedTransaction.client || "Elire",
    invoiceNumber: (selectedTransaction as any).invoiceNumber || "PAY-" + selectedTransaction.id,
    totalAmount: Math.abs(selectedTransaction.amount),
    entryType: "Payment",
    narration: `Being payment to ${selectedTransaction.vendor}`,
    entries: [
      {
        account: `${getAssignedVendor(selectedTransaction, vendorAssignments)} (2001)`,
        debit: Math.abs(selectedTransaction.amount),
        credit: 0,
        confidence: 95
      },
      {
        account: "Bank (1001)",
        debit: 0,
        credit: Math.abs(selectedTransaction.amount),
        confidence: 95
      }
    ]
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-medium text-mobius-gray-700">Payment Journal Entry</h4>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-2 text-xs text-mobius-blue-600 hover:text-mobius-blue-700"
          onClick={onEditClick}
        >
          <Edit3 className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </div>
      <div className="border border-mobius-gray-200 rounded overflow-hidden">
        <JournalEntryTable
          journalEntry={isEditMode ? editedJournalEntry : paymentEntry}
          transaction={selectedTransaction}
          isEditMode={isEditMode}
          isFormulaMode={isFormulaMode}
          onEditClick={onEditClick}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onFormulaModeToggle={onFormulaModeToggle}
          onUpdateJournalEntry={onUpdateJournalEntry}
          onEvaluateFormulaOnBlur={onEvaluateFormulaOnBlur}
          onAddRow={onAddRow}
          onDeleteRow={onDeleteRow}
          showToolbar={false}
          showEditButton={false}
          compact
        />
      </div>
    </div>
  );
}
