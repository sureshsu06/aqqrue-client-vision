import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, X, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ManualEntry {
  date: string;
  description: string;
  client: string;
  entries: {
    account: string;
    debit: number;
    credit: number;
    narration: string;
  }[];
  documents: File[];
  reference: string;
}

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: ManualEntry) => void;
}

export function ManualEntryModal({ isOpen, onClose, onSave }: ManualEntryModalProps) {
  const [entry, setEntry] = useState<ManualEntry>({
    date: new Date().toISOString().split('T')[0],
    description: "",
    client: "Elire",
    entries: [
      { account: "", debit: 0, credit: 0, narration: "" },
      { account: "", debit: 0, credit: 0, narration: "" }
    ],
    documents: [],
    reference: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const clients = ["Elire", "Mahat", "TVS", "Ripple"]; 
  const accountOptions = [
    "Cash/Accounts Receivable",
    "Accounts Receivable", 
    "Professional Fees",
    "Rent",
    "Computers",
    "Office Supplies",
    "Software Subscriptions",
    "Input CGST",
    "Input SGST",
    "TDS on Professional Charges",
    "TDS on Rent",
    "General Expense"
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!entry.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!entry.client) {
      newErrors.client = "Client is required";
    }

    // Validate entries
    let totalDebit = 0;
    let totalCredit = 0;
    
    entry.entries.forEach((line, index) => {
      if (!line.account) {
        newErrors[`entries.${index}.account`] = "Account is required";
      }
      
      if (index === 0 && line.debit === 0) {
        newErrors[`entries.${index}.debit`] = "Debit amount is required";
      }
      if (index === 1 && line.credit === 0) {
        newErrors[`entries.${index}.credit`] = "Credit amount is required";
      }
      
      totalDebit += line.debit;
      totalCredit += line.credit;
    });

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      newErrors.balance = "Total debits must equal total credits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(entry);
    }
  };

  const addEntryLine = () => {
    setEntry(prev => ({
      ...prev,
      entries: [...prev.entries, { account: "", debit: 0, credit: 0, narration: "" }]
    }));
  };

  const removeEntryLine = (index: number) => {
    if (entry.entries.length > 1) {
      setEntry(prev => ({
        ...prev,
        entries: prev.entries.filter((_, i) => i !== index)
      }));
    }
  };

  const updateEntryLine = (index: number, field: string, value: string | number) => {
    setEntry(prev => ({
      ...prev,
      entries: prev.entries.map((line, i) => 
        i === index ? { ...line, [field]: value } : line
      )
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setEntry(prev => ({
        ...prev,
        documents: [...prev.documents, ...newFiles]
      }));
    }
  };

  const removeDocument = (index: number) => {
    setEntry(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Manual Entry</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={entry.date}
                onChange={(e) => setEntry(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="client">Client</Label>
              <Select value={entry.client} onValueChange={(value) => setEntry(prev => ({ ...prev, client: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client} value={client}>{client}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.client && <p className="text-red-500 text-sm mt-1">{errors.client}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter transaction description..."
              value={entry.description}
              onChange={(e) => setEntry(prev => ({ ...prev, description: e.target.value }))}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label htmlFor="reference">Reference Number</Label>
            <Input
              id="reference"
              placeholder="Enter reference number (optional)"
              value={entry.reference}
              onChange={(e) => setEntry(prev => ({ ...prev, reference: e.target.value }))}
            />
          </div>

          {/* Journal Entries */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-medium">Journal Entries</Label>
            </div>
            
            {/* Remove separate account selection - now inline */}
            <div className="space-y-3">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-2 font-medium text-sm text-mobius-gray-700 border-b border-mobius-gray-200 pb-2">
                <div className="col-span-6">Particulars</div>
                <div className="col-span-3 text-center">Debit</div>
                <div className="col-span-3 text-center">Credit</div>
              </div>
              
              {entry.entries.map((line, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-mobius-gray-700 w-8">
                        {index === 0 ? "Dr." : "Cr."}
                      </div>
                      <Select 
                        value={line.account} 
                        onValueChange={(value) => updateEntryLine(index, 'account', value)}
                      >
                        <SelectTrigger className="flex-grow">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountOptions.map(account => (
                            <SelectItem key={account} value={account}>{account}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {errors[`entries.${index}.account`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`entries.${index}.account`]}</p>
                    )}
                  </div>
                  
                  <div className="col-span-3">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={line.debit || ""}
                      onChange={(e) => {
                        const amount = parseFloat(e.target.value) || 0;
                        updateEntryLine(index, 'debit', amount);
                        // Auto-fill credit line with same amount
                        updateEntryLine(1, 'credit', amount);
                      }}
                      className={cn(
                        "text-center font-medium",
                        line.debit > 0 && "border-green-500 bg-green-50"
                      )}
                    />
                  </div>
                  
                  <div className="col-span-3">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={line.credit || ""}
                      onChange={(e) => {
                        const amount = parseFloat(e.target.value) || 0;
                        updateEntryLine(index, 'credit', amount);
                        // Auto-fill debit line with same amount
                        updateEntryLine(0, 'debit', amount);
                      }}
                      className={cn(
                        "text-center font-medium",
                        line.credit > 0 && "border-green-500 bg-green-50"
                      )}
                    />
                  </div>
                </div>
              ))}
              
              {/* Remove Add Line Button - we want exactly 2 lines */}
            </div>

            {errors.balance && (
              <p className="text-red-500 text-sm mt-2">{errors.balance}</p>
            )}

            {/* Balance Check */}
            <div className="mt-4 p-3 bg-mobius-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Total Debits:</span>
                <span className="font-medium">
                  ₹{entry.entries.reduce((sum, line) => sum + line.debit, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Credits:</span>
                <span className="font-medium">
                  ₹{entry.entries.reduce((sum, line) => sum + line.credit, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium border-t pt-2 mt-2">
                <span>Difference:</span>
                <span className={cn(
                  Math.abs(entry.entries.reduce((sum, line) => sum + line.debit, 0) - 
                           entry.entries.reduce((sum, line) => sum + line.credit, 0)) < 0.01 
                    ? "text-green-600" 
                    : "text-red-600"
                )}>
                  ₹{Math.abs(entry.entries.reduce((sum, line) => sum + line.debit, 0) - 
                            entry.entries.reduce((sum, line) => sum + line.credit, 0)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div>
            <Label>Supporting Documents</Label>
            <div className="mt-2">
              <div className="border-2 border-dashed border-mobius-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto text-mobius-gray-400 mb-2" />
                <p className="text-sm text-mobius-gray-600 mb-2">
                  Drag and drop files here, or click to select
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Choose Files
                </Button>
              </div>
            </div>

            {/* File List */}
            {entry.documents.length > 0 && (
              <div className="mt-3 space-y-2">
                {entry.documents.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-mobius-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <Upload className="w-4 h-4 text-mobius-gray-500" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-mobius-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-mobius-blue hover:bg-mobius-blue/90">
            Save Entry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 