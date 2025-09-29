import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { InboxHeader } from "./inbox/InboxHeader";
import { InboxList } from "./inbox/InboxList";
import { Transaction } from "@/types/Transaction";
import { DocumentPane } from "./inbox/DocumentPane";
import { AnalysisPane } from "./inbox/AnalysisPane";
import { useToast } from "@/hooks/use-toast";
import { usePanelSizes } from "@/hooks/use-panel-sizes";
import { useClientContext } from "./Layout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Check, 
  Mail, 
  CreditCard, 
  FileText,
  Clock,
  ArrowUpDown,
  ChevronDown,
  Undo2,
  Filter,
  Upload,
  GripVertical,
  Plus
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Panel, 
  PanelGroup, 
  PanelResizeHandle 
} from "react-resizable-panels";
import { ManualEntryModal } from "./ManualEntryModal";

const mockTransactions: Transaction[] = [
  // Bills from /public/documents/bills
  {
    id: "1",
    vendor: "JCSS & Associates LLP",
    amount: 94400,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2025-05-26",
    description: "Professional Fees - May 2025",
    client: "Elire",
    isRecurring: true,
    pdfFile: "bills/ASO-I_109_25-26Sign_Elire Global.pdf",
    documentUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=1000&fit=crop"
  },
  {
    id: "2",
    vendor: "JCSS & Associates LLP",
    amount: 70800,
    source: "email",
    type: "bill",
    status: "review",
    date: "2025-05-26",
    description: "Professional Fees - N-STP Condonation",
    client: "Elire",
    confidence: 95,
    pdfFile: "bills/ASO-I_117_25-26_Elire Global.pdf",
    documentUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=1000&fit=crop"
  },
  {
    id: "3",
    vendor: "NSDL Database Management Limited",
    amount: 11800,
    source: "drive",
    type: "bill",
    status: "done",
    date: "2025-05-31",
    description: "Equity AMC",
    client: "Elire",
    confidence: 98,
    pdfFile: "bills/EGS001.pdf",
    documentUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1000&fit=crop"
  },
  {
    id: "4",
    vendor: "Sogo Computers",
    amount: 5310,
    source: "brex",
    type: "bill",
    status: "review",
    date: "2025-05-22",
    description: "Freight Charges",
    client: "Elire",
    confidence: 88,
    pdfFile: "bills/Hys-1117.pdf",
    documentUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=1000&fit=crop"
  },
  {
    id: "5",
    vendor: "Sogo Computers",
    amount: 5310,
    source: "ramp",
    type: "bill",
    status: "done",
    date: "2025-05-22",
    description: "Freight Charges",
    client: "Elire",
    confidence: 100,
    isRecurring: true,
    pdfFile: "bills/Hys-1121.pdf",
    documentUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=1000&fit=crop"
  },
  {
    id: "6",
    vendor: "Clayworks Spaces Pvt Ltd",
    amount: 102660,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2025-05-22",
    description: "Rent",
    client: "Elire",
    confidence: 92,
    isRecurring: true,
    pdfFile: "bills/INV-25260258.pdf",
    documentUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=1000&fit=crop"
  },
  {
    id: "7",
    vendor: "Clayworks Spaces Pvt Ltd",
    amount: 5251,
    source: "email",
    type: "bill",
    status: "review",
    date: "2025-05-08",
    description: "Parking Charges-April 2025",
    client: "Elire",
    confidence: 87,
    isRecurring: true,
    pdfFile: "bills/INV-25260376.pdf",
    documentUrl: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&h=1000&fit=crop"
  },
  {
    id: "8",
    vendor: "Sogo Computers",
    amount: 480850,
    source: "email",
    type: "fixed-asset",
    status: "done",
    date: "2025-05-19",
    description: "Laptop Purchase",
    client: "Elire",
    confidence: 96,
    isRecurring: true,
    pdfFile: "bills/PCD-143.pdf",
    documentUrl: "https://images.unsplash.com/photo-1633114127408-af671c774b39?w=800&h=1000&fit=crop"
  },
  {
    id: "9",
    vendor: "Sogo Computers",
    amount: 96170,
    source: "email",
    type: "fixed-asset",
    status: "unread",
    date: "2025-05-22",
    description: "Laptop Purchase",
    client: "Elire",
    confidence: 94,
    isRecurring: true,
    pdfFile: "bills/PCD-159.pdf",
    documentUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=1000&fit=crop"
  },
  {
    id: "10",
    vendor: "Sogo Computers",
    amount: 96170,
    source: "email",
    type: "fixed-asset",
    status: "review",
    date: "2025-05-22",
    description: "Laptop Purchase",
    client: "Elire",
    confidence: 91,
    isRecurring: true,
    pdfFile: "bills/PCD-160.pdf",
    documentUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=1000&fit=crop"
  },
  {
    id: "11",
    vendor: "Ozone Computer Services",
    amount: 16900,
    source: "email",
    type: "fixed-asset",
    status: "done",
    date: "2025-05-10",
    description: "Monitor LG",
    client: "Mahat",
    confidence: 99,
    pdfFile: "bills/725-MAHAT LABS (1).pdf",
    documentUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=1000&fit=crop"
  },
  {
    id: "12",
    vendor: "MGEcoduties",
    amount: 8174,
    source: "email",
    type: "bill",
    status: "done",
    date: "2025-05-29",
    description: "Office Supplies",
    client: "Mahat",
    confidence: 97,
    pdfFile: "bills/Mahat Labs Pvt Ltd_Invoice_309_29.05.2025.pdf",
    documentUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1000&fit=crop"
  },
  {
    id: "13",
    vendor: "Billions United",
    amount: 37760,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2022-03-28",
    description: "Data Services - Database",
    client: "TVS",
    confidence: 98,
    pdfFile: "bills/Copy of 2A2-647.pdf",
    documentUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=1000&fit=crop",
    invoiceNumber: "BU/MAR/080/21-22"
  },
  {
    id: "14",
    vendor: "SEVENRAJ'S ESTATE AGENCY",
    amount: 2478000,
    source: "email",
    type: "bill",
    status: "review",
    date: "2023-10-06",
    description: "Property Commission - Sy.no.214, BBMP khata no.379",
    client: "TVS",
    confidence: 95,
    pdfFile: "bills/Copy of SEVENRAJ'S ESTATES.pdf",
    documentUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=1000&fit=crop",
    invoiceNumber: "007/23-24"
  },
  {
    id: "15",
    vendor: "SN AY (Something New Around You)",
    amount: 985300,
    source: "email",
    type: "bill",
    status: "done",
    date: "2024-03-01",
    description: "Digital Advertising Boosting - March 2024",
    client: "TVS",
    confidence: 97,
    pdfFile: "bills/Copy of SOMETHING NEW AROUND YOU-1.pdf",
    documentUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1000&fit=crop",
    invoiceNumber: "01176"
  },
  {
    id: "16",
    vendor: "Unknown Vendor",
    amount: 15000,
    source: "email",
    type: "bill",
    status: "unread",
    date: "2025-05-25",
    description: "Invoice",
    client: "Unknown",
    confidence: 85,
    pdfFile: "bills/220525I049900411.pdf",
    documentUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=1000&fit=crop"
  },
  // Credit Card transactions from /public/documents/creditcard
  {
    id: "17",
    vendor: "HubSpot Inc",
    amount: 2324.11,
    currency: "USD",
    source: "brex",
    type: "bill",
    status: "unread",
    date: "2025-04-30",
    description: "Marketing Hub Starter & Sales Hub Professional - Quarterly Subscription",
    client: "Rhythms",
    confidence: 95,
    pdfFile: "creditcard/Copy of HubSpot-INVOICE-614657704.0-1.pdf",
    documentUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=1000&fit=crop",
    isRecurring: true,
    isPrepaid: true,
    prepaidPeriod: "quarterly",
    prepaidAmount: 2324.11
  },
  {
    id: "19",
    vendor: "AgentHub Canada Inc",
    amount: 97.00,
    currency: "USD",
    source: "brex",
    type: "credit-card",
    status: "unread",
    date: "2025-05-19",
    description: "Gumloop Starter Plan - Monthly Subscription",
    client: "Rhythms",
    confidence: 90,
    pdfFile: "creditcard/Copy of Invoice-6D330809-0003.pdf",
    documentUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1000&fit=crop",
    isRecurring: true
  },
  {
    id: "20",
    vendor: "Twitter Global LLC",
    amount: 716.30,
    currency: "USD",
    source: "brex",
    type: "credit-card",
    status: "review",
    date: "2025-05-30",
    description: "X Premium Subscription - Monthly",
    client: "Rhythms",
    confidence: 88,
    pdfFile: "creditcard/Copy of Invoice-7D7DB7C2-0007.pdf",
    documentUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=1000&fit=crop",
    isRecurring: true
  },
  {
    id: "21",
    vendor: "Pitch Software GmbH",
    amount: 43.75,
    currency: "USD",
    source: "brex",
    type: "credit-card",
    status: "done",
    date: "2024-08-13",
    description: "Pitch Pro - Monthly Subscription (3 seats)",
    client: "Rhythms",
    confidence: 96,
    pdfFile: "creditcard/Copy of Invoice-9A31BB6E-0001.pdf",
    documentUrl: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&h=1000&fit=crop",
    isRecurring: true
  },
  {
    id: "22",
    vendor: "Calendly LLC",
    amount: 22.04,
    currency: "USD",
    source: "brex",
    type: "credit-card",
    status: "done",
    date: "2025-05-14",
    description: "Teams Monthly Subscription",
    client: "Rhythms",
    confidence: 98,
    pdfFile: "creditcard/Copy of invoice_13904471-1.pdf",
    documentUrl: "https://images.unsplash.com/photo-1633114127408-af671c774b39?w=800&h=1000&fit=crop",
    isRecurring: true
  },
  {
    id: "23",
    vendor: "Typeform US LLC",
    amount: 109.10,
    currency: "USD",
    source: "brex",
    type: "credit-card",
    status: "done",
    date: "2025-05-16",
    description: "Typeform Business - Monthly Subscription",
    client: "Rhythms",
    confidence: 97,
    pdfFile: "creditcard/Copy of invoice_USIN-2025-0114021.pdf",
    documentUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=1000&fit=crop",
    isRecurring: true
  },
  // Credit Card transactions WITHOUT invoices (these go to Exceptions tab)
  {
    id: "18",
    vendor: "HubSpot Inc",
    amount: 2324.11,
    currency: "USD",
    source: "brex",
    type: "credit-card",
    status: "unread",
    date: "2025-04-30",
    description: "Marketing Hub Starter & Sales Hub Professional - Quarterly Subscription (Duplicate)",
    client: "Rhythms",
    confidence: 90,
    // No pdfFile - this transaction goes to Exceptions tab
    documentUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=1000&fit=crop",
    isRecurring: true,
    isDuplicate: true
  },
  {
    id: "24",
    vendor: "AWS",
    amount: 156.78,
    currency: "USD",
    source: "brex",
    type: "credit-card",
    status: "unread",
    date: "2025-05-30",
    description: "Cloud Infrastructure - Monthly Charges",
    client: "Rhythms",
    confidence: 92,
    // No pdfFile - this transaction goes to Exceptions tab
    documentUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=1000&fit=crop",
    isRecurring: true
  },
  {
    id: "25",
    vendor: "Stripe Inc",
    amount: 299.00,
    currency: "USD",
    source: "brex",
    type: "credit-card",
    status: "unread",
    date: "2025-05-29",
    description: "Payment Processing Fees - Monthly",
    client: "Rhythms",
    confidence: 85,
    // No pdfFile - this transaction goes to Exceptions tab
    documentUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=1000&fit=crop",
    isRecurring: true
  },
  {
    id: "26",
    vendor: "Google Cloud",
    amount: 89.45,
    currency: "USD",
    source: "brex",
    type: "credit-card",
    status: "review",
    date: "2025-05-28",
    description: "Compute Services - Monthly Charges",
    client: "Rhythms",
    confidence: 88,
    // No pdfFile - this transaction goes to Exceptions tab
    documentUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1000&fit=crop",
    isRecurring: true
  },
  // Revenue Contracts from /public/documents/contracts
  {
    id: "27",
    vendor: "Bishop Wisecarver",
    amount: 7020,
    currency: "USD",
    source: "email",
    type: "contract",
    status: "unread",
    date: "2025-10-01",
    description: "RhythmsAI OKR Platform - 65 Owner Users",
    client: "Rhythms",
    confidence: 85,
    pdfFile: "contracts/Bishop Wisecarver_Complete_with_Docusign_Rhythms_-_Cloud_Servi (2).pdf",
    documentUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=1000&fit=crop",
    contractStartDate: "2025-10-01",
    contractEndDate: "2026-07-31",
    billingCycle: "Annual",
    contractValue: 7020,
    contractTerm: "10 months"
  },
  {
    id: "28",
    vendor: "MARKETview Technology, LLC",
    amount: 10000,
    currency: "USD",
    source: "drive",
    type: "contract",
    status: "review",
    date: "2025-09-01",
    description: "RhythmsAI OKR Platform - 100 Permitted Users",
    client: "Rhythms",
    confidence: 92,
    pdfFile: "contracts/MARKETview_Complete_with_Docusign_Rhythms_-_Cloud_Servi (1).pdf",
    documentUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=1000&fit=crop",
    contractStartDate: "2025-07-01",
    contractEndDate: "2028-08-31",
    billingCycle: "Annual",
    contractValue: 30000,
    contractTerm: "38 months"
  },
  {
    id: "29",
    vendor: "Sera",
    amount: 95000,
    currency: "USD",
    source: "email",
    type: "contract",
    status: "done",
    date: "2025-05-15",
    description: "SaaS Cloud Services Agreement",
    client: "Rhythms",
    confidence: 98,
    pdfFile: "contracts/Sera_Complete_with_Docusign_Rhythms_-_Cloud_Servi (2).pdf",
    documentUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
    contractStartDate: "2025-06-01",
    contractEndDate: "2026-05-31",
    billingCycle: "Annual",
    contractValue: 95000,
    contractTerm: "12 months"
  },
  {
    id: "30",
    vendor: "Clipper Media Acquisition I, LLC",
    amount: 7999,
    currency: "USD",
    source: "email",
    type: "contract",
    status: "unread",
    date: "2025-06-12",
    description: "RhythmsAI OKR Platform - SaaS Subscription",
    client: "Rhythms",
    confidence: 88,
    pdfFile: "contracts/050825 Rhythms Valpak Cloud Services Agreement - signed - signed.pdf",
    documentUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=1000&fit=crop",
    contractStartDate: "2025-06-13",
    contractEndDate: "2026-05-12",
    billingCycle: "Annual",
    contractValue: 7999,
    contractTerm: "11 months"
  },
  {
    id: "31",
    vendor: "Networkology",
    amount: 110000,
    currency: "USD",
    source: "drive",
    type: "contract",
    status: "review",
    date: "2025-05-05",
    description: "SaaS Cloud Services Agreement",
    client: "Rhythms",
    confidence: 94,
    pdfFile: "contracts/Rhythms - Cloud Services Agreement - Networkology.doc.pdf",
    documentUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1000&fit=crop",
    contractStartDate: "2025-06-01",
    contractEndDate: "2026-05-31",
    billingCycle: "Annual",
    contractValue: 110000,
    contractTerm: "12 months"
  },
  {
    id: "32",
    vendor: "AlineOps",
    amount: 135000,
    currency: "USD",
    source: "email",
    type: "contract",
    status: "done",
    date: "2025-05-01",
    description: "SaaS Cloud Services Agreement",
    client: "Rhythms",
    confidence: 96,
    pdfFile: "contracts/Rhythms - Cloud Services Agreement - AlineOps.docx.pdf",
    documentUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=1000&fit=crop",
    contractStartDate: "2025-05-01",
    contractEndDate: "2026-05-31",
    billingCycle: "Annual",
    contractValue: 135000,
    contractTerm: "12 months"
  },
  // Payment transactions
  {
    id: "33",
    vendor: "CLAYWORKS SPACES T PVT LTD",
    amount: -6156,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-07",
    description: "Payment for Clayworks Invoice 5016",
    client: "Elire",
    confidence: 95,
    pdfFile: "payments/payment_clayworks_inv_5016.pdf",
    documentUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=1000&fit=crop",
    invoiceNumber: "INV-5016"
  },
  {
    id: "34",
    vendor: "CLAYWORKS SPACES T PVT LTD",
    amount: -93960,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-07",
    description: "Payment for Clayworks Invoice 25 26 0078",
    client: "Elire",
    confidence: 95,
    pdfFile: "payments/payment_clayworks_inv_0078.pdf",
    documentUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=1000&fit=crop",
    invoiceNumber: "INV-25-26-0078"
  },
  {
    id: "35",
    vendor: "EPFO",
    amount: -177278,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-10",
    description: "EPFO Contribution",
    client: "Elire",
    confidence: 95,
    pdfFile: "payments/payment_epfo_contribution.pdf",
    documentUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1000&fit=crop",
    invoiceNumber: "EPFO-APR-2025"
  },
  {
    id: "36",
    vendor: "CBDT",
    amount: -9765,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-21",
    description: "TDS on Rent",
    client: "Elire",
    confidence: 98,
    pdfFile: "payments/payment_cbdt_tds_rent.pdf",
    documentUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=1000&fit=crop",
    invoiceNumber: "CBDT-RENT-APR-2025"
  },
  {
    id: "37",
    vendor: "CBDT",
    amount: -10500,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-21",
    description: "TDS on Professional Charges",
    client: "Elire",
    confidence: 98,
    pdfFile: "payments/payment_cbdt_tds_professional.pdf",
    documentUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=1000&fit=crop",
    invoiceNumber: "CBDT-PROF-APR-2025"
  },
  {
    id: "38",
    vendor: "CBDT",
    amount: -152160,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-21",
    description: "TDS on Salary",
    client: "Elire",
    confidence: 98,
    pdfFile: "payments/payment_cbdt_tds_salary.pdf",
    documentUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=1000&fit=crop",
    invoiceNumber: "CBDT-SALARY-APR-2025"
  },
  {
    id: "39",
    vendor: "Incoming Wire Transfer",
    amount: 1635925.2,
    currency: "INR",
    source: "bank",
    type: "receipt",
    status: "done",
    date: "2025-04-25",
    description: "Incoming Wire Transfer (USD 19201.0 @ 85.2)",
    client: "Elire",
    confidence: 99,
    pdfFile: "receipts/receipt_wire_transfer_usd.pdf",
    documentUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1000&fit=crop",
    invoiceNumber: "WIRE-USD-APR-2025"
  },
  {
    id: "40",
    vendor: "CGST",
    amount: -552.23,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-25",
    description: "CGST Payment",
    client: "Elire",
    confidence: 95,
    pdfFile: "payments/payment_cgst.pdf",
    documentUrl: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&h=1000&fit=crop",
    invoiceNumber: "CGST-APR-2025"
  },
  {
    id: "41",
    vendor: "SGST",
    amount: -552.23,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-25",
    description: "SGST Payment",
    client: "Elire",
    confidence: 95,
    pdfFile: "payments/payment_sgst.pdf",
    documentUrl: "https://images.unsplash.com/photo-1633114127408-af671c774b39?w=800&h=1000&fit=crop",
    invoiceNumber: "SGST-APR-2025"
  },
  {
    id: "42",
    vendor: "BHARAT R",
    amount: -386799,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-30",
    description: "Salary Payment - April 2025 (Bharat R)",
    client: "Elire",
    confidence: 97,
    pdfFile: "payments/payment_salary_bharat.pdf",
    documentUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=1000&fit=crop",
    invoiceNumber: "SALARY-BHARAT-APR-2025"
  },
  {
    id: "43",
    vendor: "AMIT KUMAR MISHRA",
    amount: -253950,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-30",
    description: "RTGS Payment to Amit Kumar Mishra",
    client: "Elire",
    confidence: 97,
    pdfFile: "payments/payment_rtgs_amit.pdf",
    documentUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&h=1000&fit=crop",
    invoiceNumber: "RTGS-AMIT-APR-2025"
  },
  {
    id: "44",
    vendor: "DEVASANKAR SATHANI",
    amount: -219422,
    currency: "INR",
    source: "bank",
    type: "payment",
    status: "done",
    date: "2025-04-30",
    description: "RTGS Payment to Devasankar Sathani",
    client: "Elire",
    confidence: 97,
    pdfFile: "payments/payment_rtgs_devasankar.pdf",
    documentUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1000&fit=crop",
    invoiceNumber: "RTGS-DEVASANKAR-APR-2025"
  }
];

const filters = [
  { id: "all", label: "All", count: 38, icon: Check },
  { id: "bills", label: "Bills", count: 16, icon: FileText },
  { id: "cards", label: "Credit Cards", count: 10, icon: CreditCard },
  { id: "contracts", label: "Contracts", count: 6, icon: FileText },
  { id: "payments", label: "Payments", count: 3, icon: FileText },
  { id: "receipts", label: "Receipts", count: 3, icon: FileText }
];

const statusFilters = [
  { id: "unread", label: "Unread", count: 6, icon: Mail },
  { id: "today", label: "Today", count: 2, icon: Clock },
  { id: "week", label: "This Week", count: 4, icon: Clock }
];

interface TransactionInboxProps {
  onTransactionSelect: (transaction: Transaction) => void;
}

export function TransactionInbox({ onTransactionSelect }: TransactionInboxProps) {
  const [selectedFilter, setSelectedFilter] = useState("bills");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedStatusOption, setSelectedStatusOption] = useState("All");
  const [selectedTab, setSelectedTab] = useState<"expenses" | "revenue" | "fixed-assets" | "credit-card" | "payments" | "receipts">("expenses");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const { toast } = useToast();
  const { sizes, updateSizes, resetSizes } = usePanelSizes();
  const { selectedClient, setSelectedClient } = useClientContext();

  const filteredTransactions = mockTransactions.filter(transaction => {
    // Filter by client
    if (selectedClient !== "All Clients" && transaction.client !== selectedClient) {
      return false;
    }
    
    // Filter by tab (expenses/revenue/fixed-assets/credit-card/payments/receipts) - this takes priority
    if (selectedTab === "expenses" && transaction.type !== "bill") {
      return false;
    }
    if (selectedTab === "revenue" && transaction.type !== "contract") {
      return false;
    }
    if (selectedTab === "fixed-assets" && transaction.type !== "fixed-asset") {
      return false;
    }
    if (selectedTab === "credit-card" && transaction.type !== "credit-card") {
      return false;
    }
    if (selectedTab === "payments" && transaction.type !== "payment") {
      return false;
    }
    if (selectedTab === "receipts" && transaction.type !== "receipt") {
      return false;
    }
    
    // Special filtering for credit card transactions - only show those with invoices
    if (selectedTab === "credit-card") {
      // Only show credit card transactions that have invoices (pdfFile exists)
      // Credit card transactions WITHOUT invoices go to Exceptions tab
      return transaction.type === "credit-card" && transaction.pdfFile;
    }
    
    // Filter by transaction type (only applies when not using tab filtering)
    if (selectedFilter !== "all" && selectedFilter !== "bills" && selectedFilter !== "contracts") {
      if (!transaction.type.includes(selectedFilter.slice(0, -1))) {
        return false;
      }
    }
    
    // Filter by status
    if (selectedStatus === "unread" && transaction.status !== "unread") {
      return false;
    }
    
    return true;
  });

  // Auto-select first transaction when component mounts or filters change
  useEffect(() => {
    if (filteredTransactions.length > 0 && !selectedTransaction) {
      setSelectedTransaction(filteredTransactions[0]);
    }
  }, [filteredTransactions, selectedTransaction]);

  const unreadCount = mockTransactions.filter(t => t.status === "unread").length;
  const doneCount = mockTransactions.filter(t => t.status === "done").length;
  const totalCount = mockTransactions.length;

  const handleTransactionSelect = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleTransactionToggle = (transactionId: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, transactionId]);
    } else {
      setSelectedTransactions(selectedTransactions.filter(id => id !== transactionId));
    }
  };

  const handleQuickApprove = (transactionId: string) => {
    toast({
      title: "Transaction approved",
      description: "Posted to QuickBooks • JE# QB-000192"
    });
  };

  const handleQuickAssign = (transactionId: string) => {
    toast({
      title: "Transaction assigned",
      description: "Assigned to Controller for review"
    });
  };

  const handleApprove = () => {
    if (selectedTransaction) {
      toast({
        title: "Transaction approved",
        description: "Posted to QuickBooks • JE# QB-000192"
      });
      
      // Auto-advance to next transaction
      const currentIndex = filteredTransactions.findIndex(t => t.id === selectedTransaction.id);
      if (currentIndex < filteredTransactions.length - 1) {
        setSelectedTransaction(filteredTransactions[currentIndex + 1]);
      } else {
        setSelectedTransaction(null);
      }
    }
  };

  const handleEdit = () => {
    onTransactionSelect(selectedTransaction!);
  };

  const handleSeeHow = () => {
    onTransactionSelect(selectedTransaction!);
  };

  const handleSelectAllVisible = () => {
    const allVisibleSelected = filteredTransactions.length > 0 && selectedTransactions.length === filteredTransactions.length;
    
    if (allVisibleSelected) {
      // If all are selected, unselect all visible
      setSelectedTransactions([]);
    } else {
      // If not all are selected, select all visible
      setSelectedTransactions(filteredTransactions.map(t => t.id));
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      
      {/* Add the InboxHeader component */}
      <InboxHeader
        unreadCount={unreadCount}
        totalCount={totalCount}
        doneCount={doneCount}
        selectedFilter={selectedFilter}
        selectedStatus={selectedStatus}
        selectedStatusOption={selectedStatusOption}
        onFilterChange={setSelectedFilter}
        onStatusChange={setSelectedStatus}
        onStatusOptionChange={setSelectedStatusOption}
        onSelectAllVisible={handleSelectAllVisible}
        allVisibleSelected={filteredTransactions.length > 0 && selectedTransactions.length === filteredTransactions.length}
      />

      {/* Transaction Type Tabs Row */}
      <div className="flex items-center justify-between py-3 px-4 bg-[#F8FAFC] border-b border-mobius-gray-100 flex-shrink-0">
        <div className="flex items-center space-x-1">
          <Button 
            variant={selectedTab === "expenses" ? "default" : "ghost"}
            size="sm"
            className={`px-4 py-2 rounded-none border-b-2 ${
              selectedTab === "expenses" 
                ? "border-mobius-blue bg-transparent text-mobius-blue hover:bg-mobius-blue/5" 
                : "border-transparent text-mobius-gray-600 hover:text-mobius-gray-900"
            }`}
            onClick={() => setSelectedTab("expenses")}
          >
            Expenses
          </Button>
          <Button 
            variant={selectedTab === "revenue" ? "default" : "ghost"}
            size="sm"
            className={`px-4 py-2 rounded-none border-b-2 ${
              selectedTab === "revenue" 
                ? "border-mobius-blue bg-transparent text-mobius-blue hover:bg-mobius-blue/5" 
                : "border-transparent text-mobius-gray-600 hover:text-mobius-gray-900"
            }`}
            onClick={() => setSelectedTab("revenue")}
          >
            Revenue
          </Button>
          <Button 
            variant={selectedTab === "fixed-assets" ? "default" : "ghost"}
            size="sm"
            className={`px-4 py-2 rounded-none border-b-2 ${
              selectedTab === "fixed-assets" 
                ? "border-mobius-blue bg-transparent text-mobius-blue hover:bg-mobius-blue/5" 
                : "border-transparent text-mobius-gray-600 hover:text-mobius-gray-900"
            }`}
            onClick={() => setSelectedTab("fixed-assets")}
          >
            Fixed Assets
          </Button>
          <Button 
            variant={selectedTab === "credit-card" ? "default" : "ghost"}
            size="sm"
            className={`px-4 py-2 rounded-none border-b-2 ${
              selectedTab === "credit-card" 
                ? "border-mobius-blue bg-transparent text-mobius-blue hover:bg-mobius-blue/5" 
                : "border-transparent text-mobius-gray-600 hover:text-mobius-gray-900"
            }`}
            onClick={() => setSelectedTab("credit-card")}
          >
            Credit Card
          </Button>
          <Button 
            variant={selectedTab === "payments" ? "default" : "ghost"}
            size="sm"
            className={`px-4 py-2 rounded-none border-b-2 ${
              selectedTab === "payments" 
                ? "border-mobius-blue bg-transparent text-mobius-blue hover:bg-mobius-blue/5" 
                : "border-transparent text-mobius-gray-600 hover:text-mobius-gray-900"
            }`}
            onClick={() => setSelectedTab("payments")}
          >
            Payments
          </Button>
          <Button 
            variant={selectedTab === "receipts" ? "default" : "ghost"}
            size="sm"
            className={`px-4 py-2 rounded-none border-b-2 ${
              selectedTab === "receipts" 
                ? "border-mobius-blue bg-transparent text-mobius-blue hover:bg-mobius-blue/5" 
                : "border-transparent text-mobius-gray-600 hover:text-mobius-gray-900"
            }`}
            onClick={() => setSelectedTab("receipts")}
          >
            Receipts
          </Button>
        </div>

        {/* Client Filter and Undo Button - positioned to the right */}
        <div className="flex items-center space-x-3">
          {/* Add Manually Button */}
          <Button 
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-sm text-mobius-gray-600 hover:text-mobius-gray-900 hover:bg-mobius-gray-100"
            onClick={() => setShowManualEntryModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add JE Manually
          </Button>
          
          {/* Client Dropdown - Hidden */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-3 text-sm">
                {selectedClient === "All Clients" ? "All Clients" : selectedClient}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 z-50">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Setting client to: all");
                  setSelectedClient("All Clients");
                }}
                className={selectedClient === "All Clients" ? "bg-mobius-gray-100" : ""}
              >
                <span>All Clients</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Setting client to: elire");
                  setSelectedClient("Elire");
                }}
                className={selectedClient === "Elire" ? "bg-mobius-gray-100" : ""}
              >
                <span>Elire</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Setting client to: mahat");
                  setSelectedClient("Mahat");
                }}
                className={selectedClient === "Mahat" ? "bg-mobius-gray-100" : ""}
              >
                <span>Mahat</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Setting client to: tvs");
                  setSelectedClient("TVS");
                }}
                className={selectedClient === "TVS" ? "bg-mobius-gray-100" : ""}
              >
                <span>TVS</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Setting client to: rhythms");
                  setSelectedClient("Rhythms");
                }}
                className={selectedClient === "Rhythms" ? "bg-mobius-gray-100" : ""}
              >
                <span>Rhythms</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>

      {/* Inbox with Reading Pane */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <PanelGroup 
          direction="horizontal" 
          className="h-full"
          onLayout={(panelSizes) => {
            if (panelSizes.length >= 3) {
              updateSizes({
                ...sizes,
                inbox: panelSizes[0],
                document: panelSizes[1],
                creditCard: panelSizes[2]
              });
            }
          }}
        >
          {/* Inbox List - Resizable */}
          <Panel defaultSize={sizes.inbox} minSize={15} maxSize={40} className="min-h-0">
            <div className="h-full flex flex-col border-r border-mobius-gray-100">
              <div className="flex-1 overflow-y-auto">
                <InboxList
                  transactions={filteredTransactions}
                  selectedTransaction={selectedTransaction}
                  selectedTransactions={selectedTransactions}
                  onTransactionSelect={handleTransactionSelect}
                  onTransactionToggle={handleTransactionToggle}
                  onQuickApprove={handleQuickApprove}
                  onQuickAssign={handleQuickAssign}
                />
              </div>
            </div>
          </Panel>

          {selectedTransaction && (
            <>
              {/* Resize Handle */}
              <PanelResizeHandle className="w-1 bg-mobius-gray-100 hover:bg-mobius-gray-200 transition-colors group">
                <div className="flex items-center justify-center h-full">
                  <GripVertical className="w-3 h-3 text-mobius-gray-400 group-hover:text-mobius-gray-600" />
                </div>
              </PanelResizeHandle>

              {/* Document Pane - Resizable */}
              <Panel defaultSize={sizes.document} minSize={25} maxSize={60} className="min-h-0">
                <div className="h-full flex flex-col border-r border-mobius-gray-100">
                  <div className="flex-1 overflow-y-auto">
                    <DocumentPane transaction={selectedTransaction} />
                  </div>
                </div>
              </Panel>

              {/* Resize Handle */}
              <PanelResizeHandle className="w-1 bg-mobius-gray-100 hover:bg-mobius-gray-200 transition-colors group">
                <div className="flex items-center justify-center h-full">
                  <GripVertical className="w-3 h-3 text-mobius-gray-400 group-hover:text-mobius-gray-600" />
                </div>
              </PanelResizeHandle>

              {/* Analysis Pane - Resizable */}
              <Panel defaultSize={sizes.creditCard} minSize={25} maxSize={60} className="min-h-0">
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto">
                    <AnalysisPane 
                      transaction={selectedTransaction}
                      onApprove={handleApprove}
                      onEdit={handleEdit}
                      onSeeHow={handleSeeHow}
                    />
                  </div>
                </div>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>

      {/* Manual Entry Modal */}
      {showManualEntryModal && (
        <ManualEntryModal
          isOpen={showManualEntryModal}
          onClose={() => setShowManualEntryModal(false)}
          onSave={(entry) => {
            // Handle saving the manual entry
            console.log("Saving manual entry:", entry);
            toast({
              title: "Manual entry added",
              description: "Entry has been added to the system"
            });
            setShowManualEntryModal(false);
          }}
        />
      )}
    </div>
  );
}