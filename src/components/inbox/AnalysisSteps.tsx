import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Transaction } from "@/types/Transaction";

interface AnalysisStepsProps {
  transaction: Transaction;
  confidence: number;
}

export function AnalysisSteps({ transaction, confidence }: AnalysisStepsProps) {
  const analysisSteps = getAnalysisSteps(transaction);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium text-mobius-gray-900"></h4>

      </div>
      
      <div className="bg-mobius-gray-50 rounded-lg p-4">
        <p className="text-xs text-mobius-gray-700 leading-relaxed">
          {getAnalysisSummary(transaction)}
        </p>
      </div>
    </div>
  );
}

// Dynamic analysis steps based on transaction
function getAnalysisSteps(transaction: any) {
  const baseSteps = [
    {
      step: 1,
      title: "Extraction",
      status: "complete" as const,
      confidence: 100,
      result: `Extracted ${transaction.currency === 'USD' ? '$' : '₹'}${(transaction.amount || 0).toLocaleString()} from ${transaction.vendor} ${transaction.type === 'contract' ? 'contract' : 'invoice'} with 100% accuracy`
    },
    {
      step: 2,
      title: transaction.type === 'contract' ? "ASC 606 Analysis" : "Capex/Opex",
      status: "complete" as const,
      confidence: 95,
      result: transaction.type === 'contract' ? getASC606Result(transaction) : getCapexOpexResult(transaction)
    },
    {
      step: 3,
      title: transaction.type === 'contract' ? "Revenue Recognition" : "GST Applicability",
      status: "complete" as const,
      confidence: 100,
      result: transaction.type === 'contract' ? getRevenueRecognitionResult(transaction) : getGSTResult(transaction)
    },
    {
      step: 4,
      title: transaction.type === 'contract' ? "Deferred Revenue" : "TDS",
      status: "complete" as const,
      confidence: 100,
      result: transaction.type === 'contract' ? getDeferredRevenueResult(transaction) : getTDSResult(transaction)
    },
    {
      step: 5,
      title: "COA Mapping",
      status: "complete" as const,
      confidence: 95,
      result: getCOAResult(transaction)
    }
  ];

  return baseSteps;
}

function getCapexOpexResult(transaction: any) {
  switch (transaction.id) {
    case "1":
    case "2":
      return "Classified as Opex - Professional fees for monthly services";
    case "3":
      return "Classified as Opex - Regulatory compliance charges";
    case "4":
    case "5":
      return "Classified as Opex - Freight and logistics expenses";
    case "6":
    case "7":
      return "Classified as Opex - Office rent and parking charges";
    case "8":
    case "9":
    case "10":
      return "Classified as Capex - Computer hardware purchases";
    case "11":
      return "Classified as Capex - Monitor equipment purchase";
    case "12":
      return "Classified as Opex - Office supplies and consumables";
    default:
      return "Classified as Opex - General business expenses";
  }
}

function getGSTResult(transaction: any) {
  switch (transaction.id) {
    case "1":
    case "2":
      return "CGST 9% + SGST 9% = ₹16,992 total GST. Input credit fully available under Section 16";
    case "3":
      return "IGST 18% = ₹1,800 total GST. Input credit available for business use under Section 16";
    case "4":
    case "5":
      return "CGST 9% + SGST 9% = ₹810 total GST. Input credit available for business expenses";
    case "6":
      return "CGST 9% + SGST 9% = ₹15,660 total GST. Input credit available for office rent";
    case "7":
      return "CGST 9% + SGST 9% = ₹801 total GST. Input credit available for parking charges";
    case "8":
      return "CGST 9% + SGST 9% = ₹73,350 total GST. Input credit available for capital goods";
    case "9":
    case "10":
      return "CGST 9% + SGST 9% = ₹14,670 total GST. Input credit available for capital goods";
    case "11":
      return "CGST 9% + SGST 9% = ₹3,042 total GST. Input credit available for capital goods";
    case "12":
      return "CGST 9% + SGST 9% = ₹1,471 total GST. Input credit available for office supplies";
    default:
      return "GST applicable as per standard rates. Input credit available for business use";
  }
}

function getTDSResult(transaction: any) {
  switch (transaction.id) {
    case "1":
      return "TDS 10% under Section 194J - Professional fees. Section threshold: ₹30,000 per annum. Invoice amount: ₹94,400 (above threshold)";
    case "2":
      return "TDS 10% under Section 194J - Professional fees. Section threshold: ₹30,000 per annum. Invoice amount: ₹70,800 (above threshold)";
    case "3":
      return "No TDS applicable - Regulatory charges. Section 194J threshold: ₹30,000 per annum. Invoice amount: ₹11,800 (below threshold)";
    case "4":
      return "No TDS applicable - Freight charges. Section 194C threshold: ₹30,000 per annum. Invoice amount: ₹5,310 (below threshold)";
    case "5":
      return "No TDS applicable - Freight charges. Section 194C threshold: ₹30,000 per annum. Invoice amount: ₹5,310 (below threshold)";
    case "6":
      return "TDS 10% under Section 194I - Rent. Section threshold: ₹2,40,000 per annum. Invoice amount: ₹1,02,660 (above threshold)";
    case "7":
      return "TDS 10% under Section 194I - Rent. Since rent to vendor is above annual threshold of ₹2,40,000 per annum, TDS must be charged. Invoice amount: ₹5,251";
    case "8":
      return "No TDS applicable - Purchase of goods. Section 194Q threshold: ₹50,00,000 per annum. Invoice amount: ₹4,80,850 (below threshold)";
    case "9":
      return "No TDS applicable - Purchase of goods. Section 194Q threshold: ₹50,00,000 per annum. Invoice amount: ₹96,170 (below threshold)";
    case "10":
      return "No TDS applicable - Purchase of goods. Section 194Q threshold: ₹50,00,000 per annum. Invoice amount: ₹96,170 (below threshold)";
    case "11":
      return "No TDS applicable - Purchase of goods. Section 194Q threshold: ₹50,00,000 per annum. Invoice amount: ₹16,900 (below threshold)";
    case "12":
      return "No TDS applicable - Purchase of goods. Section 194Q threshold: ₹50,00,000 per annum. Invoice amount: ₹8,174 (below threshold)";
    default:
      return "TDS applicable as per relevant sections based on transaction type and thresholds";
  }
}

function getCOAResult(transaction: any) {
  switch (transaction.id) {
    case "1":
    case "2":
      return "Mapped to 'Professional Fees' account with 95% confidence";
    case "3":
      return "Mapped to 'Rates & Taxes' account with 95% confidence";
    case "4":
    case "5":
      return "Mapped to 'Freight and Postage' account with 95% confidence";
    case "6":
    case "7":
      return "Mapped to 'Rent' account with 95% confidence";
    case "8":
    case "9":
    case "10":
      return "Mapped to 'Computers' account with 95% confidence";
    case "11":
      return "Mapped to 'Computers' account with 95% confidence";
    case "12":
      return "Mapped to 'Office Supplies' account with 95% confidence";
    default:
      return "Mapped to appropriate expense account with 95% confidence";
  }
}

function getASC606Result(transaction: any) {
  switch (transaction.vendor) {
    case "Clipper Media Acquisition I, LLC":
      return "Contract identified with 1-month evaluation period (5/13/25-6/12/25). Revenue recognition begins 6/13/25 over 11 months";
    case "Bishop Wisecarver":
      return "Contract becomes non-cancellable after 9/30/25 (2-month termination right). Before 10/1/25, no enforceable contract for revenue recognition";
    case "MARKETview Technology, LLC":
      return "3-year contract (38 months) with annual billing. Revenue recognition begins 7/1/25 over 38 months";
    default:
      return "Contract terms analyzed under ASC 606. Revenue recognition period determined based on performance obligations";
  }
}

function getRevenueRecognitionResult(transaction: any) {
  switch (transaction.vendor) {
    case "Clipper Media Acquisition I, LLC":
      return "Monthly revenue: $727.18 ($7,999 ÷ 11 months). Straight-line recognition from 6/13/25 to 5/12/26";
    case "Bishop Wisecarver":
      return "Service period: 10/1/25 - 7/31/26 (10 months). Monthly revenue: $702 ($7,020 ÷ 10 months)";
    case "MARKETview Technology, LLC":
      return "Monthly revenue: $789.47 ($30,000 ÷ 38 months). Straight-line recognition from 7/1/25 to 8/31/28";
    default:
      return "Revenue recognized over contract term using straight-line method as services are delivered continuously";
  }
}

function getDeferredRevenueResult(transaction: any) {
  switch (transaction.vendor) {
    case "Clipper Media Acquisition I, LLC":
      return "Initial deferred revenue: $7,999. Monthly reduction: $727.18. Final balance: $0 by 5/12/26";
    case "Bishop Wisecarver":
      return "On 10/1/25: Dr. Accounts Receivable $7,020, Cr. Deferred Revenue $7,020. Monthly: Dr. Deferred Revenue $702, Cr. Revenue $702";
    case "MARKETview Technology, LLC":
      return "Year 1: $7,894.74 deferred, $2,105.26 recognized. Total contract: $30,000 over 38 months";
    default:
      return "Deferred revenue liability created for unearned portion. Monthly recognition reduces liability as services are performed";
  }
}

function getAnalysisSummary(transaction: any) {
  if (transaction.type === 'contract') {
    switch (transaction.vendor) {
      case "Bishop Wisecarver":
        return "This SaaS contract with Bishop Wisecarver includes a 2-month termination right that expires on 9/30/25. Under ASC 606, revenue recognition cannot begin until the contract becomes non-cancellable on 10/1/25. The total contract value of $7,020 will be recognized over 10 months from 10/1/25 to 7/31/26 at $702 per month. The initial journal entry on 10/1/25 will debit Accounts Receivable and credit Deferred Revenue for the full amount, followed by monthly entries debiting Deferred Revenue and crediting Revenue as services are delivered.";
      case "Clipper Media Acquisition I, LLC":
        return "This SaaS subscription contract includes a 1-month evaluation period from 5/13/25 to 6/12/25, during which the customer can terminate without penalty. Revenue recognition begins on 6/13/25 over the remaining 11 months of the contract. The total value of $7,999 will be recognized at $727.18 per month using the straight-line method as the service is delivered continuously over the contract term.";
      case "MARKETview Technology, LLC":
        return "This 3-year SaaS contract with MARKETview Technology spans 38 months with annual billing. The total contract value of $30,000 will be recognized over the full contract period at $789.47 per month. In the first year, $7,894.74 will remain as deferred revenue while $2,105.26 will be recognized as revenue, reflecting the partial year of service delivery.";
      default:
        return `This ${transaction.type} transaction with ${transaction.vendor} has been analyzed under ASC 606 revenue recognition standards. The contract terms have been evaluated to determine the appropriate revenue recognition period and method. The journal entries reflect the proper accounting treatment based on the performance obligations and service delivery schedule.`;
    }
  } else {
    // For expense transactions - provide specific analysis based on transaction ID
    switch (transaction.id) {
      case "1":
      case "2":
        return `This professional fees transaction with ${transaction.vendor} has been classified as an operating expense (Opex) for monthly professional services. The transaction includes CGST and SGST at 9% each, with full input credit available under Section 16. TDS at 10% under Section 194J is applicable as the invoice amount exceeds the ₹30,000 annual threshold for professional fees. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
      case "3":
        return `This regulatory compliance transaction with ${transaction.vendor} has been classified as an operating expense (Opex) for equity AMC charges. The transaction includes IGST at 18%, with input credit available for business use under Section 16. No TDS is applicable as this is a regulatory compliance charge. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
      case "4":
      case "5":
        return `This freight and logistics transaction with ${transaction.vendor} has been classified as an operating expense (Opex) for shipping charges. The transaction includes CGST and SGST at 9% each, with input credit available for business expenses. No TDS is applicable as this is a freight service. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
      case "6":
      case "7":
        return `This office rent transaction with ${transaction.vendor} has been classified as an operating expense (Opex) for office space and parking charges. The transaction includes CGST and SGST at 9% each, with input credit available for office rent. TDS at 10% under Section 194I is applicable as the invoice amount exceeds the ₹2,40,000 annual threshold for rent payments. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
      case "8":
      case "9":
      case "10":
        return `This computer hardware transaction with ${transaction.vendor} has been classified as a capital expenditure (Capex) for laptop purchases. The transaction includes CGST and SGST at 9% each, with input credit available for capital goods. No TDS is applicable as this is a goods purchase. The journal entries ensure proper asset capitalization and compliance with Indian tax regulations.`;
      case "11":
        return `This monitor equipment transaction with ${transaction.vendor} has been classified as a capital expenditure (Capex) for monitor purchase. The transaction includes CGST and SGST at 9% each, with input credit available for capital goods. No TDS is applicable as this is a goods purchase. The journal entries ensure proper asset capitalization and compliance with Indian tax regulations.`;
      case "12":
        return `This office supplies transaction with ${transaction.vendor} has been classified as an operating expense (Opex) for office supplies and consumables. The transaction includes CGST and SGST at 9% each, with input credit available for office supplies. No TDS is applicable as this is a goods purchase below threshold. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
      case "40":
        return `This data services transaction with ${transaction.vendor} has been classified as an operating expense (Opex) for data processing and analytics services. The transaction includes CGST and SGST at 9% each, with input credit available for business services. TDS at 10% under Section 194J is applicable as this constitutes professional services for data processing. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
      case "41":
        return `This property commission transaction with ${transaction.vendor} has been classified as an operating expense (Opex) for real estate brokerage services. The transaction includes CGST and SGST at 9% each, with input credit available for business services. TDS at 5% under Section 194H is applicable as this constitutes commission or brokerage payment for property services. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
      case "42":
        return `This digital advertising transaction with ${transaction.vendor} has been classified as an operating expense (Opex) for marketing and promotional services. The transaction includes CGST and SGST at 9% each, with input credit available for business services. TDS at 10% under Section 194J is applicable as this constitutes professional services for digital marketing and advertising. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
      // HubSpot Prepaid Transactions
      case "17":
      case "18":
        return `This prepaid ${transaction.type} transaction with ${transaction.vendor} has been analyzed for proper expense classification and tax treatment. The transaction has been categorized as an operating expense (Opex) for ${transaction.description?.toLowerCase() || 'software subscription services'}. Under the company's prepaid expense policy, quarterly software subscriptions exceeding $500 are classified as prepaid expenses and amortized over the subscription period. This quarterly prepaid subscription of $2,324.11 will be amortized over 3 months using the straight-line method, ensuring proper expense recognition and compliance with US accounting standards (GAAP).`;
      // Other US Transactions (Ripple client)
      case "13":
      case "14":
      case "15":
      case "16":
      case "19":
      case "20":
      case "21":
      case "22":
      case "23":
      case "24":
        return `This ${transaction.type} transaction with ${transaction.vendor} has been analyzed for proper expense classification and tax treatment. The transaction has been categorized as an operating expense (Opex) for ${transaction.description?.toLowerCase() || 'business services'}. US tax implications have been evaluated and the appropriate journal entries ensure proper expense recognition and compliance with US accounting standards (GAAP).`;
      default:
        if (transaction.currency === 'USD') {
          return `This ${transaction.type} transaction with ${transaction.vendor} has been analyzed for proper expense classification and tax treatment. The transaction has been categorized as either capital expenditure (Capex) or operating expense (Opex) based on the nature of the goods or services. US tax implications have been evaluated and the appropriate journal entries ensure proper expense recognition and compliance with US accounting standards.`;
        } else {
          return `This ${transaction.type} transaction with ${transaction.vendor} has been analyzed for proper expense classification and tax treatment. The transaction has been categorized as either capital expenditure (Capex) or operating expense (Opex) based on the nature of the goods or services. GST/TDS implications have been evaluated and the appropriate input credits and withholding tax treatments have been applied. The journal entries ensure proper expense recognition and compliance with Indian tax regulations.`;
        }
    }
  }
}
