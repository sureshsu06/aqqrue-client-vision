export type ScheduleType = "Revenue" | "Prepaids" | "Depreciation" | "Amortization" | "Rent";

export interface ScheduleRow {
  id: string;
  type: ScheduleType;
  name: string;              // Customer / Asset
  ref?: string;              // Contract/Asset ID
  monthly?: number;
  recognizedToDate: number;
  remaining: number;         // deferred / nbv / prepaid balance
  nextPostDate?: string;     // ISO
  status: "active" | "paused" | "ended" | "error";
  flags?: string[];          // ["gap","overlap"] etc
}

export interface PeriodRow {
  id: string;
  scheduleId: string;
  periodStart: string; // ISO
  periodEnd: string;   // ISO
  planned: number;
  posted: number;
  status: "PENDING" | "POSTED" | "HELD" | "SKIPPED";
  journalEntryId?: string;
}

export interface JournalEntryPreview {
  id: string;
  lines: Array<{ account: string; debit?: number; credit?: number; memo?: string }>;
  memo?: string;
  date: string; // ISO
} 