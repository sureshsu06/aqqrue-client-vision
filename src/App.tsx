import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Exceptions from "./pages/Exceptions";
import Ledger from "./pages/Ledger";
import Schedules from "./pages/Schedules";
import FixedAssets from "./pages/FixedAssets";
import NotFound from "./pages/NotFound";
import { Layout } from "@/components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
