import * as React from "react";
import { useState, useMemo } from "react";
import { Calendar, FileText, Pencil, History, ShieldCheck, ExternalLink } from "lucide-react";
import { useToast } from "@/components/system/Toaster";
import { fakeCall } from "@/lib/fakeApi";

type Props = { scheduleId: string };

export default function RightDetails({ scheduleId }: Props) {
  const d = useMemo(() => mockSchedule(scheduleId), [scheduleId]);
  const toast = useToast();
  const [status, setStatus] = useState<"active" | "paused">("active");

  async function pauseResume() {
    const prev = status;
    const next = status === "active" ? "paused" : "active";
    setStatus(next); // optimistic
    try {
      await fakeCall(() => true);
      toast(next === "paused" ? "Schedule paused" : "Schedule resumed");
    } catch {
      setStatus(prev); // revert
      toast("Failed to update schedule");
    }
  }

  return (
    <div className="py-6 pl-12 bg-white">
      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-3">
          <div className="flex flex-col">
            <span className="text-sm text-mobius-gray-400 mb-2">Contract Value</span>
            <span className="text-sm font-semibold text-mobius-gray-800">₹96,170</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-mobius-gray-400 mb-2">Monthly Recognition</span>
            <span className="text-sm font-semibold text-mobius-gray-800">₹2,671</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-mobius-gray-400 mb-2">Recognition Method</span>
            <span className="text-sm font-semibold text-mobius-gray-800">Straight-line (daily prorata)</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-mobius-gray-400 mb-2">GL Template</span>
            <span className="text-sm font-semibold text-mobius-gray-800">RevRec-01</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div className="flex flex-col">
            <span className="text-sm text-mobius-gray-400 mb-2">Start Date</span>
            <span className="text-sm font-semibold text-mobius-gray-800">22/5/2025</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-mobius-gray-400 mb-2">End Date</span>
            <span className="text-sm font-semibold text-mobius-gray-800">22/5/2025</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-mobius-gray-400 mb-2">Recognized to Date</span>
            <span className="text-sm font-semibold text-emerald-600">₹0</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-mobius-gray-400 mb-2">Remaining</span>
            <span className="text-sm font-semibold text-mobius-gray-800">₹96,170</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-4 pt-4 border-t border-mobius-gray-200">
        <div className="flex gap-6">
          <button className="flex items-center gap-2 text-mobius-gray-700 hover:text-mobius-gray-900 text-sm">
            <FileText className="h-4 w-4" />
            View Document
          </button>
          <button className="flex items-center gap-2 text-mobius-gray-700 hover:text-mobius-gray-900 text-sm">
            <ShieldCheck className="h-4 w-4" />
            View Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- mock data ---------- */
function mockSchedule(id: string) {
  const value = 95000, monthly = 7916.67, recognized = 21000, remaining = value - recognized;
  return {
    id, value, monthly, recognized, remaining,
    start: "01/10/2025", end: "31/07/2026",
    startISO: "2025-10-01", endISO: "2026-07-31",
    method: "Straight-line (daily prorata)", glTemplate: "RevRec-01",
    dimensions: "Entity: India • Dept: Sales",
    source: "Invoice INV-10023",
    version: 4
  };
}

function money(n: number) { 
  return new Intl.NumberFormat(undefined,{style:"currency",currency:"INR",maximumFractionDigits:2}).format(n); 
} 