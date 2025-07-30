import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Settings, 
  Bell,
  User,
  Search
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
];

const bottomNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
];

const clients = [
  "All Clients",
  "TechStartup Inc", 
  "StartupCo",
  "DesignStudio",
  "DevCorp",
  "CloudCo"
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-mobius-gray-50 flex">
      {/* Left Ribbon */}
      <div className="w-16 bg-white border-r border-mobius-gray-100 flex flex-col items-center">
        {/* Logo */}
        <div className="p-4 border-b border-mobius-gray-100">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-2">
          <div className="space-y-2">
            {navigation.map((item) => (
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
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-mobius-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Client Pills */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-mobius-gray-500 mr-2">Clients:</span>
              <div className="flex space-x-2">
                {clients.map((client) => (
                  <Badge 
                    key={client}
                    variant={client === "All Clients" ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer",
                      client === "All Clients" 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "hover:bg-mobius-gray-50"
                    )}
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
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}