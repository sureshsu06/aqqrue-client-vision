import React, { ReactNode, useState, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Settings,
  PanelLeft,
  Menu,
  Building2,
  CheckSquare,
  FileText,
  Inbox,
  MessageSquare,
  BarChart3,
  Calculator,
  AlertTriangle,
  BookOpen,
  Calendar,
  Package,
  FileBarChart,
  ClipboardList,
  Boxes
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
  { name: "Company", href: "/onboarding", icon: Building2 },
  { name: "Work Items", href: "/task-management", icon: CheckSquare },
  { name: "Entries", href: "/", icon: FileText },
  { name: "Reconciliations", href: "/reconciliations", icon: Calculator },
  { name: "CFO Daily Inbox", href: "/cfo-daily-inbox", icon: Inbox },
  { name: "Chat with Financials", href: "/chat-with-financials", icon: MessageSquare },
  { name: "Data Classification", href: "/data-classification", icon: BarChart3 },
  { name: "Plan vs Actuals", href: "/plan-vs-actuals", icon: Calculator },
  { name: "Exceptions", href: "/exceptions", icon: AlertTriangle },
  { name: "Ledger", href: "/ledger", icon: BookOpen },
  { name: "Schedules", href: "/schedules", icon: Calendar },
  { name: "Fixed Assets", href: "/fixed-assets", icon: Package },
  { name: "Reporting", href: "/reporting", icon: FileBarChart },
  { name: "Close Checklist", href: "/close-checklist", icon: ClipboardList },
  { name: "Inventory Master", href: "/inventory-master", icon: Boxes },
];

const bottomNavigation = [
  { name: "Settings", href: "/settings" },
];

const clients = [
  "All Clients",
  "Eluru", 
  "M Labs",
  "TVS",
  "Ripple",
  "Pappy",
  "Jazzwaz",
  "True Browns"
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [selectedClient, setSelectedClient] = useState("All Clients");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClientClick = (client: string) => {
    setSelectedClient(client);
    // You can add additional logic here to communicate with child components
    console.log("Selected client:", client);
  };

  const handleSidebarToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMouseEnter = () => {
    if (!isExpanded) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="h-screen app-container flex overflow-hidden">
      {/* Left Ribbon */}
      <div 
        className={cn(
          "h-screen bg-gray-50 border-r border-mobius-gray-100 flex flex-col items-center sticky top-0 transition-all duration-300",
          (isExpanded || isHovered) ? "w-36" : "w-16"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >

        {/* Toggle Button */}
        <div className="px-2 py-1 w-full border-b border-mobius-gray-100">
          <div className={cn(
            "flex",
            (isExpanded || isHovered) ? "justify-start" : "justify-center"
          )}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSidebarToggle}
              className={cn(
                "h-9 p-0 hover:bg-gray-200 transition-all duration-200",
                (isExpanded || isHovered) ? "w-full justify-start px-3" : "w-8 justify-center rounded-full"
              )}
              title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu className="w-4 h-4" />
            {(isExpanded || isHovered) && (
              <span className="ml-2 text-xs font-normal">Main Menu</span>
            )}
            </Button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-2 w-full overflow-y-auto pt-2">
          <div className={cn(
            "space-y-2",
            (isExpanded || isHovered) ? "" : "flex flex-col items-center"
          )}>
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant="ghost"
                    size="default"
                    className={cn(
                      "flex items-center transition-all duration-200 min-w-0",
                      (isExpanded || isHovered) ? "w-full h-10 px-3 justify-start space-x-3 rounded-md" : "w-8 h-8 justify-center rounded-full",
                      location.pathname === item.href 
                        ? "bg-blue-100 text-blue-600 shadow-sm font-normal" 
                        : "text-black hover:text-black hover:bg-gray-200"
                    )}
                    title={!(isExpanded || isHovered) ? item.name : undefined}
                  >
                    <IconComponent className={cn(
                      "transition-all duration-200 stroke-[1.5]",
                      (isExpanded || isHovered) ? "w-4 h-4" : "w-5 h-5"
                    )} />
                    {(isExpanded || isHovered) && (
                      <span className="font-normal text-xs truncate">{item.name}</span>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-2 border-t border-mobius-gray-100 w-full">
          <div className={cn(
            "space-y-2",
            (isExpanded || isHovered) ? "" : "flex flex-col items-center"
          )}>
            {bottomNavigation.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button
                  variant="ghost"
                  size="default"
                  className={cn(
                    "flex items-center transition-all duration-200 min-w-0",
                    (isExpanded || isHovered) ? "w-full h-10 px-3 justify-start space-x-3 rounded-md" : "w-8 h-8 justify-center rounded-full",
                    location.pathname === item.href 
                      ? "bg-blue-100 text-blue-600 shadow-sm font-normal" 
                      : "text-black hover:text-black hover:bg-gray-200"
                  )}
                  title={!(isExpanded || isHovered) ? item.name : undefined}
                >
                  {item.name === "Settings" && (
                    <Settings className={cn(
                      "transition-all duration-200 stroke-[1.5]",
                      (isExpanded || isHovered) ? "w-4 h-4" : "w-5 h-5"
                    )} />
                  )}
                  {(isExpanded || isHovered) && (
                    <span className="font-normal text-xs truncate">{item.name}</span>
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
        <main className="flex-1 overflow-auto bg-gray-50">
          <ClientContext.Provider value={{ selectedClient, setSelectedClient }}>
            {children}
          </ClientContext.Provider>
        </main>
      </div>
    </div>
  );
}