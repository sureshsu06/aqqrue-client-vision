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
  HardDrive
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
  { name: "Fixed Asset Register", href: "/fixed-assets", icon: HardDrive },
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

  const handleClientClick = (client: string) => {
    setSelectedClient(client);
    // You can add additional logic here to communicate with child components
    console.log("Selected client:", client);
  };

  return (
    <div className="h-screen bg-mobius-gray-50 flex overflow-hidden">
      {/* Left Ribbon */}
      <div className="w-16 h-screen bg-white border-r border-mobius-gray-100 flex flex-col items-center sticky top-0">
        {/* Logo */}
        <div className="p-4 border-b border-mobius-gray-100">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <img 
              src="/mobius-logo.png" 
              alt="Mobius"
              className="w-6 h-6 object-contain"
            />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-2">
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-12 h-12 p-0 flex items-center justify-center",
                    location.pathname === item.href 
                      ? "bg-primary text-primary-foreground" 
                      : "text-mobius-gray-500 hover:text-mobius-gray-900 hover:bg-mobius-gray-50"
                  )}
                  title={item.name}
                >
                  <item.icon className="w-8 h-8" />
                </Button>
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-2 border-t border-mobius-gray-100">
          <div className="space-y-2">
            {bottomNavigation.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={location.pathname === item.href ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-12 h-12 p-0 flex items-center justify-center",
                    location.pathname === item.href 
                      ? "bg-primary text-primary-foreground" 
                      : "text-mobius-gray-500 hover:text-mobius-gray-900 hover:bg-mobius-gray-50"
                  )}
                  title={item.name}
                >
                  <item.icon className="w-5 h-5" />
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