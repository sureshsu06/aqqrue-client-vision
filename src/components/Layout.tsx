import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Settings, 
  Plug, 
  Users, 
  BarChart3,
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
  { name: "Integrations", href: "/integrations", icon: Plug },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-mobius-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-mobius-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-mobius-gray-900">Mobius</span>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={location.pathname === item.href ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center space-x-2",
                      location.pathname === item.href 
                        ? "bg-primary text-primary-foreground" 
                        : "text-mobius-gray-500 hover:text-mobius-gray-900"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              ))}
            </nav>
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

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}