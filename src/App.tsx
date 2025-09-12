import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToasterProvider } from "@/components/system/Toaster";
import { CloseProgressProvider } from "@/close/closeProgress";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Exceptions from "./pages/Exceptions";
import Ledger from "./pages/Ledger";
import Schedules from "./pages/Schedules";
import FixedAssets from "./pages/FixedAssets";
import CloseChecklist from "./pages/CloseChecklist";
import Reports from "./pages/Reports";
import PlanVsActuals from "./pages/PlanVsActuals";
import CFODailyInbox from "./pages/CFODailyInbox";
import ChatWithFinancials from "./pages/ChatWithFinancials";
import AWSVendorDetail from "./pages/AWSVendorDetail";
import DataClassification from "./pages/DataClassification";
import NotFound from "./pages/NotFound";
import { Layout } from "@/components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ToasterProvider>
        <CloseProgressProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/settings" element={<Layout><Settings /></Layout>} />
              <Route path="/exceptions" element={<Layout><Exceptions /></Layout>} />
              <Route path="/ledger" element={<Layout><Ledger /></Layout>} />
              <Route path="/schedules" element={<Layout><Schedules /></Layout>} />
              <Route path="/fixed-assets" element={<Layout><FixedAssets /></Layout>} />
              <Route path="/close-checklist" element={<Layout><CloseChecklist /></Layout>} />
              <Route path="/reporting" element={<Layout><Reports /></Layout>} />
              <Route path="/plan-vs-actuals" element={<Layout><PlanVsActuals /></Layout>} />
              <Route path="/cfo-daily-inbox" element={<Layout><CFODailyInbox /></Layout>} />
              <Route path="/chat-with-financials" element={<Layout><ChatWithFinancials /></Layout>} />
              <Route path="/data-classification" element={<Layout><DataClassification /></Layout>} />
              <Route path="/vendors/aws/transactions" element={<AWSVendorDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CloseProgressProvider>
      </ToasterProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
