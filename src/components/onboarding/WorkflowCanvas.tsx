import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CheckCircle, AlertCircle, Play, Clock, Settings, MessageCircle, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface WorkflowNode {
  id: string;
  label: string;
  x: number; // percent (0-100)
  y: number; // percent (0-100)
  type: 'start' | 'process' | 'decision' | 'end' | 'exception';
  app?: 'shopify' | 'razorpay' | 'uniware' | 'aqqrue' | 'system' | 'exception';
  status?: 'success' | 'error' | 'running' | 'pending';
  schedule?: string;
  confidence?: number;
  lastRun?: string;
  transcriptRef?: string;
  addedBy?: string;
  config?: any;
  logs?: string[];
}

interface WorkflowCanvasProps {
  selectedWorkflow: string;
  showChat?: boolean;
  setShowChat?: (show: boolean) => void;
}

const NODE_PX = { width: 180, height: 96 }; // used for anchor offsets

const workflowData = {
  "order-to-cash-0": {
    title: "Shopify → Uniware Reconciliation",
    nodes: [
      { 
        id: "shopify-fetch", 
        label: "Fetch Order Data", 
        x: 10, y: 20, 
        type: "start" as const,
        app: "shopify" as const,
        status: "success" as const,
        schedule: "Daily at 12:00 UTC",
        lastRun: "2 hours ago",
        addedBy: "Controller",
        transcriptRef: "📄 From onboarding call (pg. 3)",
        confidence: 94
      },
      { 
        id: "uniware-fetch", 
        label: "Fetch Dispatch Data", 
        x: 30, y: 20, 
        type: "process" as const,
        app: "uniware" as const,
        status: "success" as const,
        schedule: "Daily at 12:05 UTC",
        lastRun: "2 hours ago",
        addedBy: "Controller",
        transcriptRef: "📄 Validated by Controller (Sept 18)",
        confidence: 92
      },
      { 
        id: "aqqrue-match", 
        label: "Match Orders", 
        x: 50, y: 20, 
        type: "process" as const,
        app: "aqqrue" as const,
        status: "success" as const,
        lastRun: "2 hours ago",
        addedBy: "Aqqrue Agent",
        transcriptRef: "📄 Logic: OrderID + Amount + SKU",
        confidence: 92
      },
      { 
        id: "matched-orders", 
        label: "Matched Orders", 
        x: 70, y: 20, 
        type: "process" as const,
        app: "system" as const,
        status: "success" as const,
        lastRun: "2 hours ago",
        addedBy: "System",
        transcriptRef: "📄 Pass to GL",
        confidence: 95
      },
      { 
        id: "unmatched-orders", 
        label: "Unmatched Orders", 
        x: 90, y: 20, 
        type: "process" as const,
        app: "aqqrue" as const,
        status: "success" as const,
        lastRun: "2 hours ago",
        addedBy: "Aqqrue Agent",
        transcriptRef: "📄 Aqqrue reasoning agent",
        confidence: 88
      },
      // Second row for returns
      { 
        id: "uniware-returns", 
        label: "Fetch Return Data", 
        x: 10, y: 50, 
        type: "start" as const,
        app: "uniware" as const,
        status: "success" as const,
        schedule: "Daily at 13:00 UTC",
        lastRun: "1 hour ago",
        addedBy: "Controller",
        transcriptRef: "📄 Returns processing",
        confidence: 90
      },
      { 
        id: "match-returns", 
        label: "Match Returns to Orders", 
        x: 30, y: 50, 
        type: "process" as const,
        app: "aqqrue" as const,
        status: "success" as const,
        lastRun: "1 hour ago",
        addedBy: "Aqqrue Agent",
        transcriptRef: "📄 Match to correct month orders",
        confidence: 89
      },
      { 
        id: "return-gl", 
        label: "Pass Return Entry to GL", 
        x: 50, y: 50, 
        type: "end" as const,
        app: "system" as const,
        status: "success" as const,
        lastRun: "1 hour ago",
        addedBy: "System",
        transcriptRef: "📄 Auto-generate return JEs",
        confidence: 92
      }
    ],
    connections: [
      { from: "shopify-fetch", to: "uniware-fetch" },
      { from: "uniware-fetch", to: "aqqrue-match" },
      { from: "aqqrue-match", to: "matched-orders" },
      { from: "aqqrue-match", to: "unmatched-orders" },
      { from: "uniware-returns", to: "match-returns" },
      { from: "match-returns", to: "return-gl" }
    ]
  },
  "order-to-cash-1": {
    title: "Prepaid Payment Reconciliation",
    nodes: [
      { 
        id: "start", 
        label: "Prepaid Payment Recon", 
        x: 50, y: 20, 
        type: "start" as const,
        app: "system" as const,
        status: "success" as const,
        lastRun: "1 hour ago",
        addedBy: "Controller",
        transcriptRef: "Meeting Note pg.5"
      },
      { 
        id: "fetch-bank-data", 
        label: "Fetch Bank Data", 
        x: 30, y: 40, 
        type: "process" as const,
        app: "system" as const,
        status: "success" as const,
        schedule: "Daily · 11:00 UTC",
        lastRun: "1 hour ago",
        addedBy: "Controller",
        transcriptRef: "Bank API Integration",
        config: { endpoint: "bank-api.com/transactions", frequency: "daily" },
        logs: ["✅ Fetched 2,341 bank transactions", "✅ All transactions processed"]
      },
      { 
        id: "fetch-payment-data", 
        label: "Fetch Payment Data", 
        x: 70, y: 40, 
        type: "process" as const,
        app: "razorpay" as const,
        status: "success" as const,
        schedule: "Daily · 11:05 UTC",
        lastRun: "1 hour ago",
        addedBy: "Controller",
        transcriptRef: "Razorpay API Call",
        config: { endpoint: "razorpay.com/api/payments", frequency: "daily" },
        logs: ["✅ Fetched 2,198 payment records", "✅ All payments processed"]
      },
      { 
        id: "match-payments", 
        label: "Match Payments", 
        x: 50, y: 60, 
        type: "process" as const,
        app: "aqqrue" as const,
        status: "success" as const,
        confidence: 95,
        lastRun: "1 hour ago",
        addedBy: "Aqqrue Agent",
        transcriptRef: "Logic: Amount + Date + Reference",
        config: { algorithm: "exact_matching", confidence_threshold: 90 },
        logs: ["✅ Matched 2,156 payments (98.1%)", "⚠️ 42 payments need review", "✅ Confidence: 95%"]
      },
      { 
        id: "handle-discrepancies", 
        label: "Handle Discrepancies", 
        x: 50, y: 80, 
        type: "process" as const,
        app: "aqqrue" as const,
        status: "success" as const,
        lastRun: "1 hour ago",
        addedBy: "Aqqrue Agent",
        transcriptRef: "Auto-flag discrepancies > ₹100",
        config: { threshold: 100, auto_flag: true },
        logs: ["✅ Processed 42 discrepancies", "✅ 38 auto-resolved", "⚠️ 4 flagged for manual review"]
      },
      { 
        id: "update-accounts", 
        label: "Update Accounts", 
        x: 50, y: 100, 
        type: "end" as const,
        app: "system" as const,
        status: "success" as const,
        lastRun: "1 hour ago",
        addedBy: "System",
        transcriptRef: "Auto-update prepaid balances",
        config: { auto_update: true, review_required: false },
        logs: ["✅ Updated 2,156 prepaid accounts", "✅ All balances reconciled", "✅ Ready for review"]
      }
    ],
    connections: [
      { from: "start", to: "fetch-bank-data" },
      { from: "start", to: "fetch-payment-data" },
      { from: "fetch-bank-data", to: "match-payments" },
      { from: "fetch-payment-data", to: "match-payments" },
      { from: "match-payments", to: "handle-discrepancies" },
      { from: "handle-discrepancies", to: "update-accounts" }
    ]
  },
  "order-to-cash-2": {
    title: "COD Reconciliation",
    nodes: [
      { 
        id: "start", 
        label: "COD Reconciliation", 
        x: 50, y: 20, 
        type: "start" as const,
        app: "system" as const,
        status: "success" as const,
        lastRun: "30 minutes ago",
        addedBy: "Controller",
        transcriptRef: "Meeting Note pg.7"
      },
      { 
        id: "fetch-cod-orders", 
        label: "Fetch COD Orders", 
        x: 30, y: 40, 
        type: "process" as const,
        app: "shopify" as const,
        status: "success" as const,
        schedule: "Daily · 10:30 UTC",
        lastRun: "30 minutes ago",
        addedBy: "Controller",
        transcriptRef: "Shopify COD Orders API",
        config: { endpoint: "shopify.com/api/orders", filter: "cod_only" },
        logs: ["✅ Fetched 156 COD orders", "✅ All orders processed"]
      },
      { 
        id: "fetch-cash-receipts", 
        label: "Fetch Cash Receipts", 
        x: 70, y: 40, 
        type: "process" as const,
        app: "uniware" as const,
        status: "success" as const,
        schedule: "Daily · 10:35 UTC",
        lastRun: "30 minutes ago",
        addedBy: "Controller",
        transcriptRef: "Uniware Cash Receipts",
        config: { endpoint: "uniware.com/api/receipts", type: "cash" },
        logs: ["✅ Fetched 148 cash receipts", "✅ All receipts processed"]
      },
      { 
        id: "reconcile-cod", 
        label: "Reconcile COD", 
        x: 50, y: 60, 
        type: "process" as const,
        app: "aqqrue" as const,
        status: "success" as const,
        confidence: 88,
        lastRun: "30 minutes ago",
        addedBy: "Aqqrue Agent",
        transcriptRef: "Logic: OrderID + Amount + Date",
        config: { algorithm: "fuzzy_matching", confidence_threshold: 80 },
        logs: ["✅ Matched 142 COD orders (91.0%)", "⚠️ 14 orders need review", "✅ Confidence: 88%"]
      },
      { 
        id: "post-cash-entry", 
        label: "Post Cash Entry", 
        x: 50, y: 80, 
        type: "end" as const,
        app: "system" as const,
        status: "success" as const,
        lastRun: "30 minutes ago",
        addedBy: "System",
        transcriptRef: "Auto-generate cash JEs",
        config: { auto_post: true, review_required: true },
        logs: ["✅ Posted 142 cash entries", "✅ All entries validated", "⚠️ 14 entries need manual review"]
      }
    ],
    connections: [
      { from: "start", to: "fetch-cod-orders" },
      { from: "start", to: "fetch-cash-receipts" },
      { from: "fetch-cod-orders", to: "reconcile-cod" },
      { from: "fetch-cash-receipts", to: "reconcile-cod" },
      { from: "reconcile-cod", to: "post-cash-entry" }
    ]
  },
  "procure-to-pay-0": {
    title: "Corporate Card Transactions",
    nodes: [
      { 
        id: "start", 
        label: "Card Processing", 
        x: 50, y: 20, 
        type: "start" as const,
        app: "system" as const,
        status: "success" as const,
        lastRun: "45 minutes ago",
        addedBy: "Controller",
        transcriptRef: "Meeting Note pg.9"
      },
      { 
        id: "fetch-cc-transactions", 
        label: "Fetch CC Transactions", 
        x: 30, y: 40, 
        type: "process" as const,
        app: "system" as const,
        status: "success" as const,
        schedule: "Daily · 09:00 UTC",
        lastRun: "45 minutes ago",
        addedBy: "Controller",
        transcriptRef: "Bank CC API Integration",
        config: { endpoint: "bank-api.com/cc-transactions", frequency: "daily" },
        logs: ["✅ Fetched 89 CC transactions", "✅ All transactions processed"]
      },
      { 
        id: "fetch-invoices", 
        label: "Fetch Invoices", 
        x: 70, y: 40, 
        type: "process" as const,
        app: "system" as const,
        status: "success" as const,
        schedule: "Daily · 09:05 UTC",
        lastRun: "45 minutes ago",
        addedBy: "Controller",
        transcriptRef: "Vendor Invoice API",
        config: { endpoint: "vendor-api.com/invoices", frequency: "daily" },
        logs: ["✅ Fetched 67 vendor invoices", "✅ All invoices processed"]
      },
      { 
        id: "match-transactions", 
        label: "Match Transactions", 
        x: 50, y: 60, 
        type: "process" as const,
        app: "aqqrue" as const,
        status: "success" as const,
        confidence: 91,
        lastRun: "45 minutes ago",
        addedBy: "Aqqrue Agent",
        transcriptRef: "Logic: Amount + Date + Vendor",
        config: { algorithm: "fuzzy_matching", confidence_threshold: 85 },
        logs: ["✅ Matched 78 transactions (87.6%)", "⚠️ 11 transactions need review", "✅ Confidence: 91%"]
      },
      { 
        id: "approve-expenses", 
        label: "Approve Expenses", 
        x: 50, y: 80, 
        type: "process" as const,
        app: "aqqrue" as const,
        status: "success" as const,
        lastRun: "45 minutes ago",
        addedBy: "Aqqrue Agent",
        transcriptRef: "Auto-approve < ₹5k, flag > ₹10k",
        config: { auto_approve_threshold: 5000, flag_threshold: 10000 },
        logs: ["✅ Auto-approved 65 expenses", "⚠️ 13 flagged for manual review", "✅ All approvals processed"]
      },
      { 
        id: "post-to-ap", 
        label: "Post to AP", 
        x: 50, y: 100, 
        type: "end" as const,
        app: "system" as const,
        status: "success" as const,
        lastRun: "45 minutes ago",
        addedBy: "System",
        transcriptRef: "Auto-generate AP entries",
        config: { auto_post: true, review_required: true },
        logs: ["✅ Posted 78 AP entries", "✅ All entries validated", "⚠️ 11 entries need manual review"]
      }
    ],
    connections: [
      { from: "start", to: "fetch-cc-transactions" },
      { from: "start", to: "fetch-invoices" },
      { from: "fetch-cc-transactions", to: "match-transactions" },
      { from: "fetch-invoices", to: "match-transactions" },
      { from: "match-transactions", to: "approve-expenses" },
      { from: "approve-expenses", to: "post-to-ap" }
    ]
  }
};

// helper icons/status
const statusIcon = (status?: string) => {
  switch (status) {
    case 'success': return <CheckCircle className="h-3 w-3 text-green-600" />;
    case 'error': return <AlertCircle className="h-3 w-3 text-red-600" />;
    case 'running': return <Play className="h-3 w-3 text-blue-600" />;
    case 'pending': return <Clock className="h-3 w-3 text-yellow-600" />;
    default: return null;
  }
};

// re-use your getAppConfig (slightly adapted inline)
const getAppConfig = (app?: string) => {
  const configs: any = {
    shopify: { icon: "🛍️", name: "Shopify", bgColor: "bg-green-50", border: "border-green-200" },
    razorpay: { icon: "💳", name: "Razorpay", bgColor: "bg-purple-50", border: "border-purple-200" },
    uniware: { icon: "📦", name: "Uniware", bgColor: "bg-blue-50", border: "border-blue-200" },
    aqqrue: { icon: "🤖", name: "Aqqrue Agent", bgColor: "bg-orange-50", border: "border-orange-200" },
    system: { icon: "⚙️", name: "System", bgColor: "bg-gray-50", border: "border-gray-200" },
    exception: { icon: "⚠️", name: "Exception", bgColor: "bg-orange-50", border: "border-orange-200" }
  };
  return configs[app || 'system'] || configs.system;
};

// Node Card (re-usable) - minimal adaptation from your earlier card component
const NodeCard: React.FC<{
  node: WorkflowNode;
  onClick: (n: WorkflowNode) => void;
  zoom: number;
  pan: { x: number, y: number };
}> = ({ node, onClick, zoom, pan }) => {
  const app = getAppConfig(node.app);
  const [hover, setHover] = useState(false);

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        width: NODE_PX.width,
        height: NODE_PX.height,
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) translate(-50%, -50%)`,
        zIndex: 10
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Card
        onClick={() => onClick(node)}
        className={`${app.bgColor} ${app.border} cursor-pointer shadow-sm`}
        style={{ height: "100%", boxSizing: "border-box" }}
      >
        <CardHeader className="p-3">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-2">
              <div className="text-sm">{app.icon}</div>
              <div>
                <div className="text-xs font-medium text-gray-600">{app.name}</div>
                <div className="font-semibold text-sm text-gray-900">{node.label}</div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {statusIcon(node.status)}
              {hover && <Settings className="h-4 w-4 text-gray-400" />}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 p-3">
          <div className="text-xs text-gray-500">
            {node.schedule ? <div>{node.schedule}</div> : null}
            {node.confidence ? <div>{node.confidence}% confidence</div> : null}
          </div>
          {hover && (
            <div className="mt-2 space-y-1">
              {node.lastRun && <div className="text-xs text-gray-500">Last run: {node.lastRun}</div>}
              {node.transcriptRef && (
                <div className="flex items-center space-x-2 text-xs text-blue-600">
                  <MessageCircle className="h-3 w-3" />
                  <div className="truncate">{node.transcriptRef}</div>
                </div>
              )}
              {node.addedBy && <div className="text-xs text-gray-500">Added by {node.addedBy}</div>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// The Fixed Canvas Component
export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ selectedWorkflow, showChat = false, setShowChat }) => {
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [canvasRect, setCanvasRect] = useState({ width: 1200, height: 700 });
  const panState = useRef({ dragging: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });
  
  // Chat and corp card workflow state
  const [chatMessage, setChatMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCorpCardV2, setShowCorpCardV2] = useState(false);

  // watch size
  useLayoutEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setCanvasRect({ width: Math.max(800, Math.floor(r.width)), height: Math.max(500, Math.floor(r.height)) });
    });
    ro.observe(el);
    // initial
    const r = el.getBoundingClientRect();
    setCanvasRect({ width: Math.max(800, Math.floor(r.width)), height: Math.max(500, Math.floor(r.height)) });
    return () => ro.disconnect();
  }, []);

  const workflow = workflowData[selectedWorkflow as keyof typeof workflowData];

  if (!workflow) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Select a Workflow</h3>
          <p className="text-sm text-gray-500">Choose a workflow from the sidebar to view its process flow</p>
        </div>
      </div>
    );
  }


  // handlers: zoom/pan
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.min(2, Math.max(0.5, z * delta)));
  };

  // simple drag-to-pan
  const handleMouseDown = (e: React.MouseEvent) => {
    // allow dragging from anywhere on the canvas
    panState.current.dragging = true;
    panState.current.startX = e.clientX;
    panState.current.startY = e.clientY;
    panState.current.baseX = pan.x;
    panState.current.baseY = pan.y;
    (e.target as HTMLElement).ownerDocument.body.style.cursor = "grabbing";
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!panState.current.dragging) return;
    const dx = e.clientX - panState.current.startX;
    const dy = e.clientY - panState.current.startY;
    setPan({ x: panState.current.baseX + dx, y: panState.current.baseY + dy });
  };
  const handleMouseUp = () => {
    panState.current.dragging = false;
    (document.body).style.cursor = "";
  };

  // Chat handler for corp card workflow
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim() && selectedWorkflow === "procure-to-pay-0") {
      setIsLoading(true);
      setChatMessage("");
      
      // Show loading for 5 seconds, then switch to corp card v2
      setTimeout(() => {
        setIsLoading(false);
        setShowCorpCardV2(true);
      }, 5000);
    }
  };

  // Get the correct image source based on workflow and state
  const getImageSource = () => {
    if (selectedWorkflow === "procure-to-pay-0") {
      if (showCorpCardV2) {
        return "/p2p-brex-2.gif";
      }
      return "/p2p-brex-1.jpeg";
    }
    return "/shopify-unicomm.jpeg";
  };


  // render
  return (
    <div className="h-full">
      <div className="pt-8 pb-6 px-6 flex items-center justify-between">
        <div className="-ml-6">
          <h2 className="text-[20px] font-semibold text-[var(--text)]">{workflow.title}</h2>
          <p className="text-[13px] text-[var(--muted)] mt-1">Interactive workflow visualization</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={() => setZoom((z) => Math.max(0.5, z * 0.9))}>-</Button>
          <div className="text-sm text-gray-600 min-w-[60px] text-center">{Math.round(zoom * 100)}%</div>
          <Button size="sm" variant="outline" onClick={() => setZoom((z) => Math.min(2, z * 1.1))}>+</Button>
          <Button size="sm" variant="outline" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={canvasRef}
        className="workflow-canvas relative w-full h-[calc(100vh-141px)] rounded-xl border border-[var(--border)] overflow-hidden mb-8 cursor-grab active:cursor-grabbing"
        style={{
          backgroundColor: '#f2f2f2'
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Add your image here */}
        {!isLoading ? (
          <img 
            src={getImageSource()} 
            alt="Workflow diagram"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center w-full max-w-md px-8">
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{
                    animation: 'loadingBar 5s ease-in-out forwards'
                  }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Analyzing workflow...</p>
            </div>
          </div>
        )}
        

        {/* Loading bar animation styles */}
        <style>{`
          @keyframes loadingBar {
            0% { width: 0%; }
            25% { width: 25%; }
            50% { width: 50%; }
            75% { width: 75%; }
            100% { width: 100%; }
          }
        `}</style>




        {/* Right drawer (Sheet) for node details */}
        {selectedNode && (
          <Sheet open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
            <SheetContent className="w-[420px]">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <span className="text-lg">{getAppConfig(selectedNode.app).icon}</span>
                  <span>{selectedNode.label}</span>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6 p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                    <div className="flex items-center space-x-2">
                      {selectedNode.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {selectedNode.status === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                      {selectedNode.status === 'running' && <Play className="h-4 w-4 text-blue-600" />}
                      {selectedNode.status === 'pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                      <span className="text-sm capitalize">{selectedNode.status}</span>
                    </div>
                  </div>

                  {selectedNode.lastRun && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Last Run</span>
                      <span className="text-sm text-gray-900">{selectedNode.lastRun}</span>
                    </div>
                  )}

                  {selectedNode.confidence && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Confidence</span>
                      <span className="text-sm text-gray-900">{selectedNode.confidence}%</span>
                    </div>
                  )}
                </div>

                {selectedNode.config && (
                  <div>
                    <h4 className="text-sm font-semibold">Configuration</h4>
                    <div className="bg-gray-50 rounded-lg p-3 mt-2 space-y-2">
                      {Object.entries(selectedNode.config).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm">
                          <span className="text-gray-600">{k}</span>
                          <span className="font-mono text-gray-900">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedNode.logs && selectedNode.logs.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold">Recent Logs</h4>
                    <div className="bg-gray-900 rounded-lg p-3 mt-2 max-h-40 overflow-y-auto text-xs text-green-400 font-mono">
                      {selectedNode.logs.map((l, i) => <div key={i}>{l}</div>)}
                    </div>
                  </div>
                )}

                {selectedNode.transcriptRef && (
                  <div>
                    <h4 className="text-sm font-semibold">Transcript</h4>
                    <div className="bg-blue-50 rounded-lg p-3 mt-2 text-sm text-blue-800 flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4" />
                      <div>{selectedNode.transcriptRef}</div>
                    </div>
                  </div>
                )}

                {selectedNode.addedBy && (
                  <div>
                    <h4 className="text-sm font-semibold">Provenance</h4>
                    <div className="bg-gray-50 rounded-lg p-3 mt-2 text-sm">
                      🧑 Added by <span className="font-medium">{selectedNode.addedBy}</span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" className="flex-1"><Settings className="h-4 w-4 mr-2" />Configure</Button>
                  <Button size="sm" variant="outline" className="flex-1"><MessageCircle className="h-4 w-4 mr-2" />View Logs</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Chat interface - show when chat icon is clicked */}
      {showChat && (
        <div className="mt-2 px-6 pb-6">
          <div className="relative">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask about your financial data... (e.g., 'What's our cash position?')"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={isLoading}
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit(e)}
            />
            <button
              onClick={handleChatSubmit}
              disabled={!chatMessage.trim() || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowCanvas;