import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Edit3, Save, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types/Transaction";
import { useState } from "react";

interface RevenueRecognitionProps {
  transaction: Transaction;
  isFormulaMode: boolean;
  onFormulaModeToggle: () => void;
}

export function RevenueRecognition({ transaction, isFormulaMode, onFormulaModeToggle }: RevenueRecognitionProps) {
  const [isScheduleEditMode, setIsScheduleEditMode] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState<any[]>([]);

  const handleScheduleEditClick = () => {
    const schedule = generateDeferredRevenueSchedule(transaction);
    setEditedSchedule([...schedule]);
    setIsScheduleEditMode(true);
  };

  const handleScheduleSave = () => {
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

  return (
    <div className="p-0">
      <div className="flex justify-between mb-2">
        <h4 className="text-xs font-medium text-mobius-gray-900">Deferred Revenue Schedule:</h4>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-6 w-6 p-0", isFormulaMode ? "bg-blue-100 text-blue-600" : "")}
            onClick={onFormulaModeToggle}
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
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
          <p className="font-medium mb-1">Formula Mode Active</p>
          <p>Use Excel-like formulas: <code className="bg-blue-100 px-1 rounded">=B1*0.1</code>, <code className="bg-blue-100 px-1 rounded">=SUM(B1:B3)</code>, <code className="bg-blue-100 px-1 rounded">10%*C2</code></p>
          <p className="text-blue-600 mt-1">B = Monthly Revenue column, C = Deferred Revenue column, D = Recognized column, numbers = row index (1-based)</p>
        </div>
      )}

      <Separator className="my-2" />

      {/* Deferred Revenue Schedule Table */}
      <div className="mt-2">
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wide py-3 px-4">
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
          
          {/* Table Body */}
          <div className="border border-gray-200 border-t-0 overflow-hidden">
            {(isScheduleEditMode ? editedSchedule : generateDeferredRevenueSchedule(transaction)).map((period, index) => (
              <div 
                key={index} 
                className={cn(
                  "grid grid-cols-4 gap-2 text-xs items-center py-3 px-4 border-b border-gray-100 last:border-b-0",
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                )}
              >
                <div className="font-semibold text-gray-900">{period.period}</div>
                <div className="text-right font-variant-numeric tabular-nums font-semibold text-green-700">
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
                <div className="text-right font-variant-numeric tabular-nums font-semibold text-gray-700">
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
                <div className="text-right font-variant-numeric tabular-nums font-semibold text-blue-700">
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
          
          {/* Edit/Save/Cancel Buttons */}
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
    </div>
  );
}

// Generate deferred revenue schedule for SaaS contracts
function generateDeferredRevenueSchedule(transaction: Transaction) {
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
    totalMonths = 11;
    monthlyRevenue = totalValue / totalMonths;
    startMonth = 1;
    startDate = new Date("2025-06-13");
  } else if (transaction.vendor === "Bishop Wisecarver") {
    totalMonths = 10;
    monthlyRevenue = totalValue / totalMonths;
    startMonth = 1;
    startDate = new Date("2025-10-01");
  } else if (transaction.vendor === "MARKETview Technology, LLC") {
    totalMonths = 38;
    monthlyRevenue = totalValue / totalMonths;
    startMonth = 1;
    startDate = new Date("2025-07-01");
  } else {
    if (billingCycle === 'Annual') {
      const termYears = parseInt(transaction.contractTerm.split(' ')[0]);
      totalMonths = termYears * 12;
    } else {
      totalMonths = parseInt(transaction.contractTerm.split(' ')[0]);
    }
    monthlyRevenue = totalValue / totalMonths;
  }
  
  const schedule = [];
  
  for (let i = 1; i <= Math.min(totalMonths, 12); i++) {
    const recognized = monthlyRevenue;
    const remainingDeferred = totalValue - (recognized * i);
    
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
}
