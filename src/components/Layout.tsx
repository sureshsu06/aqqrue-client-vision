import React, { ReactNode, useState, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  AlertTriangle, 
  BarChart3, 
  Building, 
  ClipboardList, 
  Settings, 
  Search, 
  Bell, 
  User,
  BookOpen,
  Calendar,
  HardDrive,
  Menu
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

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
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Exceptions", href: "/exceptions", icon: AlertTriangle },
  { name: "Ledger", href: "/ledger", icon: BookOpen },
  { name: "Schedules", href: "/schedules", icon: Calendar },
  { name: "Fixed Assets", href: "/fixed-assets", icon: HardDrive },
  { name: "Reporting", href: "/reporting", icon: BarChart3 },
];

const bottomNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
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
  const [isExpanded, setIsExpanded] = useState(() => {
    // Get the expanded state from localStorage, default to false
    const saved = localStorage.getItem('sidebarExpanded');
    return saved ? JSON.parse(saved) : false;
  });

  const handleClientClick = (client: string) => {
    setSelectedClient(client);
    // You can add additional logic here to communicate with child components
    console.log("Selected client:", client);
  };

  const handleSidebarToggle = (expanded: boolean) => {
    setIsExpanded(expanded);
    // Save the expanded state to localStorage
    localStorage.setItem('sidebarExpanded', JSON.stringify(expanded));
  };

  return (
    <div className="h-screen bg-mobius-gray-50 flex overflow-hidden">
      {/* Left Ribbon */}
      <div className={cn(
        "h-screen bg-white border-r border-mobius-gray-100 flex flex-col items-center sticky top-0 transition-all duration-300",
        isExpanded ? "w-48" : "w-16"
      )}>
        {/* Hamburger Menu Button - Now at top where logo was */}
        <div className="p-4 w-full">
          <div className="flex items-center justify-start">
            <Button
              variant="ghost"
              size="sm"
              className="w-12 h-12 p-0 flex items-center justify-center"
              onClick={() => handleSidebarToggle(!isExpanded)}
              title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu className="w-8 h-8" />
            </Button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-2 w-full">
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button
                  variant="ghost"
                  size={isExpanded ? "default" : "sm"}
                  className={cn(
                    "w-full flex items-center transition-all duration-200",
                    isExpanded 
                      ? "h-12 px-4 justify-start space-x-3" 
                      : "h-12 w-12 p-0 justify-center",
                    location.pathname === item.href 
                      ? "bg-primary text-primary-foreground" 
                      : "text-mobius-gray-500 hover:text-mobius-gray-900 hover:bg-mobius-gray-50"
                  )}
                  title={!isExpanded ? item.name : undefined}
                >
                  <item.icon className={cn(
                    "transition-all duration-200",
                    isExpanded ? "w-5 h-5" : "w-8 h-8"
                  )} />
                  {isExpanded && (
                    <span className="font-medium">{item.name}</span>
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
                  variant={location.pathname === item.href ? "default" : "ghost"}
                  size={isExpanded ? "default" : "sm"}
                  className={cn(
                    "w-full flex items-center transition-all duration-200",
                    isExpanded 
                      ? "h-12 px-4 justify-start space-x-3" 
                      : "h-12 w-12 p-0 justify-center",
                    location.pathname === item.href 
                      ? "bg-primary text-primary-foreground" 
                      : "text-mobius-gray-500 hover:text-mobius-gray-900 hover:bg-mobius-gray-50"
                  )}
                  title={!isExpanded ? item.name : undefined}
                >
                  <item.icon className={cn(
                    "transition-all duration-200",
                    isExpanded ? "w-5 h-5" : "h-5 w-5"
                  )} />
                  {isExpanded && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-mobius-gray-100 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Logo and Client Pills */}
            <div className="flex items-center space-x-6">
              {/* Logo */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <img 
                    src="/mobius-logo.png" 
                    alt="Mobius"
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </div>
              
              {/* Client Pills */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-mobius-gray-500 mr-2">Clients:</span>
                <div className="flex space-x-2">
                  {clients.map((client) => (
                    <Badge 
                      key={client}
                      variant={selectedClient === client ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-colors",
                        selectedClient === client 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                          : "hover:bg-mobius-gray-50"
                      )}
                      onClick={() => handleClientClick(client)}
                    >
                      {client}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mobius-gray-500 w-4 h-4" />
                <Input 
                  placeholder="Search transactions..." 
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          <ClientContext.Provider value={{ selectedClient, setSelectedClient }}>
            {children}
          </ClientContext.Provider>
        </main>
      </div>
    </div>
  );
}