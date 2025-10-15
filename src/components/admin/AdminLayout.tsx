
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  Flag,
  BarChart,
  Settings,
  LogOut,
  PenTool,
  Shield,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navigationItems = [
    {
      href: "/admin",
      icon: BarChart,
      label: "Dashboard",
    },
    {
      href: "/admin/users",
      icon: Users,
      label: "Users",
    },
    {
      href: "/admin/ebooks",
      icon: BookOpen,
      label: "eBooks",
    },
    {
      href: "/admin/blogs",
      icon: PenTool,
      label: "Blogs",
    },
    {
      href: "/admin/flags",
      icon: Flag,
      label: "Flags",
    },
    {
      href: "/admin/actions",
      icon: Shield,
      label: "Admin Actions",
    },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-primary text-primary-foreground flex items-center justify-between px-4 z-50">
        <Link to="/" className="flex items-center">
          <span className="text-lg font-bold">Manjaws</span>
          <span className="text-secondary ml-1">Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-primary-foreground hover:bg-primary/80"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`
        w-64 bg-primary text-primary-foreground fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        <div className="p-4 lg:p-6 border-b border-primary/20">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <span className="text-lg lg:text-xl font-bold">Manjaws</span>
              <span className="text-secondary ml-1 text-lg lg:text-xl">Admin</span>
            </Link>
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>
          {profile && (
            <div className="mt-2 text-xs lg:text-sm text-primary-foreground/80 truncate">
              Welcome, {profile.full_name || profile.email}
            </div>
          )}
        </div>
        
        <nav className="flex-grow p-2 lg:p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-3 lg:px-4 py-2.5 lg:py-3 rounded-md transition-colors text-sm lg:text-base ${
                      isActive
                        ? "bg-primary-foreground/10 text-primary-foreground font-medium"
                        : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5"
                    }`}
                  >
                    <Icon className="mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-2 lg:p-4 border-t border-primary/20 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5 text-sm lg:text-base p-2 lg:p-3"
            onClick={() => {
              navigate('/profile');
              setSidebarOpen(false);
            }}
          >
            <ArrowLeft className="mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
            <span className="truncate">Back to User Dashboard</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5 text-sm lg:text-base p-2 lg:p-3"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
            <span className="truncate">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 pt-16 md:pt-0 md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
