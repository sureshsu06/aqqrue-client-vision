import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface PaymentActionsProps {
  onApprove: () => void;
}

export function PaymentActions({ onApprove }: PaymentActionsProps) {
  return (
    <div className="p-5 border-t border-mobius-gray-100 flex-shrink-0">
      <div className="space-y-4">
        {/* Single Approval */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs text-mobius-gray-600">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span>Transaction looks correct?</span>
          </div>
          <div className="flex space-x-2">
            <Button className="bg-mobius-blue hover:bg-mobius-blue/90 text-white px-4 text-xs" onClick={onApprove}>
              Approve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
