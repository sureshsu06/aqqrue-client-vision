import React, { ReactNode, useState, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Settings
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

// Create context for selected client
interface ClientContextType {
  selectedClient: string;
  setSelectedClient: (client: string) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};

const navigation = [
  { name: "Company", href: "/onboarding" },
  { name: "Work Items", href: "/task-management" },
  { name: "Entries", href: "/" },
  { name: "CFO Daily Inbox", href: "/cfo-daily-inbox" },
  { name: "Chat with Financials", href: "/chat-with-financials" },
  { name: "Data Classification", href: "/data-classification" },
  { name: "Plan vs Actuals", href: "/plan-vs-actuals" },
  { name: "Reconciliations", href: "/prepaid-results" },
  { name: "Exceptions", href: "/exceptions" },
  { name: "Ledger", href: "/ledger" },
  { name: "Schedules", href: "/schedules" },
  { name: "Fixed Assets", href: "/fixed-assets" },
  { name: "Reporting", href: "/reporting" },
  { name: "Close Checklist", href: "/close-checklist" },
];

const bottomNavigation = [
  { name: "Settings", href: "/settings" },
];

const clients = [
  "All Clients",
  "Elire", 
  "Mahat",
  "TVS",
  "Rhythms"
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [selectedClient, setSelectedClient] = useState("All Clients");
  const [isExpanded] = useState(true);

  const handleClientClick = (client: string) => {
    setSelectedClient(client);
    // You can add additional logic here to communicate with child components
    console.log("Selected client:", client);
  };

  const handleSidebarToggle = (_expanded: boolean) => {};

  return (
    <div className="h-screen app-container flex overflow-hidden">
      {/* Left Ribbon */}
      <div className={cn(
        "h-screen bg-gray-100 border-r border-mobius-gray-100 flex flex-col items-center sticky top-0 transition-all duration-300 w-36"
      )}>

        {/* Main Navigation */}
        <nav className="flex-1 p-2 w-full overflow-y-auto pt-2">
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button
                  variant="ghost"
                  size="default"
                  className={cn(
                    "w-full flex items-center transition-all duration-200 min-w-0",
                    "h-10 px-3 justify-start space-x-3 rounded-md",
                    location.pathname === item.href 
                      ? "bg-[var(--primary)] text-white shadow-sm font-semibold" 
                      : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--primary-weak)]"
                  )}
                >
                  {isExpanded && (
                    <span className="font-medium text-xs truncate">{item.name}</span>
                  )}
                </Button>
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-2 border-t border-mobius-gray-100 w-full">
          <div className="space-y-2">
            {bottomNavigation.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button
                  variant="ghost"
                  size="default"
                  className={cn(
                    "w-full flex items-center transition-all duration-200 min-w-0",
                    "h-10 px-3 justify-start space-x-3 rounded-md",
                    location.pathname === item.href 
                      ? "bg-[var(--primary)] text-white shadow-sm font-semibold" 
                      : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--primary-weak)]"
                  )}
                >
                  {item.name === "Settings" && (
                    <Settings className={cn(
                      "transition-all duration-200",
                      isExpanded ? "w-5 h-5 mr-3" : "w-6 h-6"
                    )} />
                  )}
                  {isExpanded && (
                    <span className="font-medium text-xs truncate">{item.name}</span>
                  )}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-mobius-gray-100 py-2 flex-shrink-0">
          <div className="flex items-center justify-start">
            {/* Client Pills */}
            <div className="flex items-center gap-2 pl-6">
              {clients.filter(client => client !== "All Clients").map((client) => (
                <button
                  key={client}
                  onClick={() => handleClientClick(client)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                    "border cursor-pointer select-none",
                    "hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                    selectedClient === client
                      ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {client}
                    {selectedClient === client && (
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <ClientContext.Provider value={{ selectedClient, setSelectedClient }}>
            {children}
          </ClientContext.Provider>
        </main>
      </div>
    </div>
  );
}