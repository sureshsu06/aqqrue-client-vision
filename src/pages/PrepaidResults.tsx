import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { RefreshCw, CheckCircle, AlertCircle, XCircle, FileText, Paperclip, Bot } from "lucide-react";

interface Order {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  processor: string;
  reason: string;
  status: 'matched' | 'pending' | 'exception';
}

interface OrderDetail {
  orderId: string;
  customer: string;
  amount: number;
  status: 'matched' | 'pending' | 'exception';
  linkedRecords: {
    shopifyOrder: string;
    uniwareDispatch: string;
    stripeTxn: string;
  };
  supportingDocs: {
    name: string;
    missing: boolean;
  }[];
  suggestedAction: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderId: "#12983",
    customer: "Ankit Jain",
    amount: 4200,
    processor: "Razorpay",
    reason: "Payment initiated, not settled",
    status: "pending"
  },
  {
    id: "2",
    orderId: "#12990",
    customer: "Blitz Pvt",
    amount: 12800,
    processor: "Stripe",
    reason: "Return recorded, refund not processed",
    status: "exception"
  },
  {
    id: "3",
    orderId: "#12995",
    customer: "MoEngage",
    amount: 6500,
    processor: "Razorpay",
    reason: "Cancellation mismatch",
    status: "pending"
  },
  {
    id: "4",
    orderId: "#13001",
    customer: "Elire Ltd",
    amount: 9750,
    processor: "Stripe",
    reason: "Payment mismatch ₹250",
    status: "exception"
  }
];

const mockOrderDetails: Record<string, OrderDetail> = {
  "1": {
    orderId: "#12983",
    customer: "Ankit Jain",
    amount: 4200,
    status: "pending",
    linkedRecords: {
      shopifyOrder: "#12983",
      uniwareDispatch: "#D-45698",
      stripeTxn: "#TXN-98228"
    },
    supportingDocs: [
      { name: "payment_confirmation.pdf", missing: false },
      { name: "order_receipt.pdf", missing: false }
    ],
    suggestedAction: "Wait for payment settlement"
  },
  "2": {
    orderId: "#12990",
    customer: "Blitz Pvt",
    amount: 12800,
    status: "exception",
    linkedRecords: {
      shopifyOrder: "#12990",
      uniwareDispatch: "#D-45700",
      stripeTxn: "#TXN-98231"
    },
    supportingDocs: [
      { name: "refund_receipt.pdf", missing: true }
    ],
    suggestedAction: "Escalate to Controller"
  },
  "3": {
    orderId: "#12995",
    customer: "MoEngage",
    amount: 6500,
    status: "pending",
    linkedRecords: {
      shopifyOrder: "#12995",
      uniwareDispatch: "#D-45699",
      stripeTxn: "#TXN-98229"
    },
    supportingDocs: [
      { name: "cancellation_request.pdf", missing: false }
    ],
    suggestedAction: "Verify cancellation with customer service"
  },
  "4": {
    orderId: "#13001",
    customer: "Elire Ltd",
    amount: 9750,
    status: "exception",
    linkedRecords: {
      shopifyOrder: "#13001",
      uniwareDispatch: "#D-45701",
      stripeTxn: "#TXN-98232"
    },
    supportingDocs: [
      { name: "payment_discrepancy_report.pdf", missing: false }
    ],
    suggestedAction: "Reconcile payment difference"
  }
};

const PrepaidResults = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setIsSheetOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'matched':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'exception':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'matched':
        return (
          <Badge className={`${baseClasses} bg-green-50 text-green-600 border-green-200`}>
            {getStatusIcon(status)}
            Matched
          </Badge>
        );
      case 'pending':
        return (
          <Badge className={`${baseClasses} bg-orange-50 text-orange-600 border-orange-200`}>
            {getStatusIcon(status)}
            Pending
          </Badge>
        );
      case 'exception':
        return (
          <Badge className={`${baseClasses} bg-red-50 text-red-600 border-red-200`}>
            {getStatusIcon(status)}
            Exception
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const summaryData = {
    matched: { count: 12452, amount: 18000000, label: "Matched" },
    pending: { count: 85, amount: 1200000, label: "Pending Review" },
    exceptions: { count: 18, amount: 320000, label: "Exceptions" }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Prepaid Payment Reconciliation — O2C India
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Daily run: Sep 24, 2025 · Confidence 95%
            </p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Re-run reconciliation
          </Button>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Matched Card */}
          <Card className="rounded-lg shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {summaryData.matched.count.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">orders</p>
                  <p className="text-xs font-medium text-gray-900">
                    {formatCurrency(summaryData.matched.amount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Review Card */}
          <Card className="rounded-lg shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {summaryData.pending.count.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">orders</p>
                  <p className="text-xs font-medium text-gray-900">
                    {formatCurrency(summaryData.pending.amount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exceptions Card */}
          <Card className="rounded-lg shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {summaryData.exceptions.count.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">orders</p>
                  <p className="text-xs font-medium text-gray-900">
                    {formatCurrency(summaryData.exceptions.amount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Orders Table */}
      <div className="flex-1 px-6 pb-6">
        <Card className="rounded-lg shadow-sm border-0 bg-white">
          <CardHeader className="px-6 py-4 border-b border-gray-100">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Orders Requiring Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100">
                  <TableHead className="font-medium text-gray-600">Order ID</TableHead>
                  <TableHead className="font-medium text-gray-600">Customer</TableHead>
                  <TableHead className="font-medium text-gray-600">Amount</TableHead>
                  <TableHead className="font-medium text-gray-600">Processor</TableHead>
                  <TableHead className="font-medium text-gray-600">Reason</TableHead>
                  <TableHead className="font-medium text-gray-600">Status</TableHead>
                  <TableHead className="font-medium text-gray-600 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOrders.map((order) => (
                  <TableRow 
                    key={order.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(order)}
                  >
                    <TableCell className="font-medium text-gray-900">
                      {order.orderId}
                    </TableCell>
                    <TableCell className="text-gray-700">{order.customer}</TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {formatCurrency(order.amount)}
                    </TableCell>
                    <TableCell className="text-gray-700">{order.processor}</TableCell>
                    <TableCell className="text-gray-600 italic">{order.reason}</TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
                        <span className="hover:text-gray-700 cursor-pointer">View Linked Records</span>
                        <span className="text-gray-300">·</span>
                        <span className="hover:text-gray-700 cursor-pointer">Mark Reconciled</span>
                        <span className="text-gray-300">·</span>
                        <span className="hover:text-gray-700 cursor-pointer">Comment</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Order Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[600px] sm:max-w-[600px]">
          {selectedOrder && (
            <>
              <SheetHeader>
                <SheetTitle className="text-sm font-semibold text-gray-900">
                  {selectedOrder.orderId} — {selectedOrder.customer} — {formatCurrency(selectedOrder.amount)} — {getStatusBadge(selectedOrder.status)}
                </SheetTitle>
                <SheetDescription>
                  Order details and reconciliation information
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Linked Records */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Linked Records</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                      <span className="text-sm text-gray-600">Shopify Order:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {mockOrderDetails[selectedOrder.id]?.linkedRecords.shopifyOrder}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                      <span className="text-sm text-gray-600">Uniware Dispatch:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {mockOrderDetails[selectedOrder.id]?.linkedRecords.uniwareDispatch}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md">
                      <span className="text-sm text-gray-600">Stripe Txn:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {mockOrderDetails[selectedOrder.id]?.linkedRecords.stripeTxn}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Supporting Docs */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Supporting Documents</h3>
                  <div className="space-y-2">
                    {mockOrderDetails[selectedOrder.id]?.supportingDocs.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{doc.name}</span>
                        </div>
                        {doc.missing && (
                          <Badge variant="destructive" className="text-xs">
                            Missing
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Action */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Suggested Action</h3>
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      {mockOrderDetails[selectedOrder.id]?.suggestedAction}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1" size="sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Reconciled
                  </Button>
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach Doc
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bot className="w-4 h-4 mr-2" />
                    Teach Aqqrue
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PrepaidResults;
