import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, FileText } from 'lucide-react';

interface VarianceItem {
  description: string;
  amount: number;
}

interface VarianceBreakdownProps {
  varianceItems: VarianceItem[];
  totalVariance: number;
  onCreateAdjustment?: () => void;
}

export function VarianceBreakdown({ 
  varianceItems, 
  totalVariance, 
  onCreateAdjustment 
}: VarianceBreakdownProps) {
  if (varianceItems.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-slate-900">Variance Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {varianceItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
              <span className="text-sm text-slate-700">{item.description}</span>
              <span className="font-mono text-sm font-medium">
                ${item.amount.toLocaleString()}
              </span>
            </div>
          ))}
          
          <div className="flex items-center justify-between py-2 font-medium border-t-2 border-slate-200 mt-3">
            <span className="text-sm text-slate-900">Total Variance</span>
            <span className="font-mono text-sm font-semibold">
              ${totalVariance.toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onCreateAdjustment}
            className="h-8"
          >
            Create Adjustment JE
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
