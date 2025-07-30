import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Edit3, 
  Eye, 
  RotateCcw,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JournalEntryPanelProps {
  transaction: any;
  onEdit: () => void;
  onSeeHow: () => void;
}

export function JournalEntryPanel({ transaction, onEdit, onSeeHow }: JournalEntryPanelProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Mock journal entry data with proper prepaid treatment for Vanta
  const journalEntry = {
    vendor: transaction.vendor,
    amount: transaction.amount,
    date: transaction.date,
    invoiceNumber: transaction.vendor === "WeWork" ? "SEA-BVU-2024-07-1892" : 
                   transaction.vendor === "Vanta Inc" ? "VANTA-2024-0301" : "INV-2024-0789",
    debitAccount: transaction.vendor === "Vanta Inc" ? "1410 - Prepaid Expenses" :
                  transaction.vendor === "WeWork" ? "6200 - Rent Expense" : "6100 - Software Expense",
    creditAccount: transaction.source === "email" ? "2100 - Accounts Payable" : "2210 - Credit Card Payable",
    client: transaction.client,
    isRecurring: transaction.isRecurring,
    isBillable: true,
    costCenter: "US Operations",
    location: "San Francisco HQ"
  };

  const confidence = transaction.confidence || 95;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Recommended Journal Entry</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
              <Eye className="w-4 h-4 mr-1" />
              {showDetails ? "Hide" : "Show"} Details
            </Button>
          </div>
        </div>

        {/* Header Meta Information */}
        <div className="grid grid-cols-3 gap-4 text-sm p-3 bg-mobius-gray-50 rounded-lg">
          <div>
            <p className="text-mobius-gray-500">Client:</p>
            <p className="font-medium">{journalEntry.client}</p>
          </div>
          <div>
            <p className="text-mobius-gray-500">Location:</p>
            <p className="font-medium">{journalEntry.location}</p>
          </div>
          <div>
            <p className="text-mobius-gray-500">Invoice #:</p>
            <div className="flex items-center space-x-2">
              <p className="font-medium">{journalEntry.invoiceNumber}</p>
              {journalEntry.isBillable && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  Billable ✓
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Badge>
              )}
            </div>
          </div>
          {journalEntry.isRecurring && (
            <div>
              <p className="text-mobius-gray-500">Recurring:</p>
              <p className="font-medium flex items-center">
                <RotateCcw className="w-3 h-3 mr-1" />
                Monthly on 1st
              </p>
            </div>
          )}
          <div>
            <p className="text-mobius-gray-500">Cost Center:</p>
            <p className="font-medium">{journalEntry.costCenter}</p>
          </div>
        </div>

        <Separator />

        {/* Journal Entry Lines Table */}
        <div>
          <div className="grid grid-cols-4 gap-4 text-xs font-medium text-mobius-gray-500 uppercase tracking-wide mb-3 pb-2 border-b border-mobius-gray-200">
            <div>ACCOUNT</div>
            <div className="text-right">DEBIT</div>
            <div className="text-right">CREDIT</div>
            <div className="text-right">CONF.</div>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="font-medium text-mobius-gray-900">{journalEntry.debitAccount}</div>
              <div className="text-right font-variant-numeric: tabular-nums font-medium">${journalEntry.amount.toFixed(2)}</div>
              <div className="text-right text-mobius-gray-400">—</div>
              <div className="text-right">
                <Badge variant="outline" className="bg-status-done/10 text-status-done border-status-done/20 text-xs">
                  {confidence}%
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="font-medium text-mobius-gray-900">{journalEntry.creditAccount}</div>
              <div className="text-right text-mobius-gray-400">—</div>
              <div className="text-right font-variant-numeric: tabular-nums font-medium">${journalEntry.amount.toFixed(2)}</div>
              <div className="text-right">
                <Badge variant="outline" className="bg-status-done/10 text-status-done border-status-done/20 text-xs">
                  100%
                </Badge>
              </div>
            </div>
          </div>
          
          <Separator className="my-3" />
          
          <div className="grid grid-cols-4 gap-4 text-sm font-medium">
            <div className="text-mobius-gray-600">Balance</div>
            <div className="text-right text-mobius-gray-400">—</div>
            <div className="text-right text-mobius-gray-400">—</div>
            <div className="text-right text-status-done font-medium">$0.00 ✓</div>
          </div>
        </div>

        {showDetails && (
          <>
            <Separator />
            <div className="space-y-2 text-sm bg-mobius-gray-50 p-3 rounded-lg">
              <div className="flex justify-between">
                <span className="text-mobius-gray-500">Date:</span>
                <span className="font-medium">{new Date(journalEntry.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mobius-gray-500">Amount:</span>
                <span className="font-medium">${journalEntry.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mobius-gray-500">Entry Type:</span>
                <span className="font-medium">
                  {transaction.vendor === "Vanta Inc" ? "Prepaid Asset" : "Operating Expense"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}