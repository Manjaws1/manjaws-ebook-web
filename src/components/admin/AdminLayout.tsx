
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
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-primary text-white flex items-center justify-between px-4 z-50">
        <Link to="/" className="flex items-center">
          <span className="text-lg font-bold">Manjaws</span>
          <span className="text-secondary ml-1">Admin</span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white hover:bg-primary-800"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
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
        w-64 bg-primary text-white fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:z-10
      `}>
        <div className="p-4 lg:p-6 border-b border-primary-800">
          <Link to="/" className="flex items-center">
            <span className="text-lg lg:text-xl font-bold">Manjaws</span>
            <span className="text-secondary ml-1 text-lg lg:text-xl">Admin</span>
          </Link>
          {profile && (
            <div className="mt-2 text-xs lg:text-sm text-gray-200 truncate">
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
                        ? "bg-primary-800 text-white"
                        : "text-gray-200 hover:text-white hover:bg-primary-700"
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
        
        <div className="p-2 lg:p-4 border-t border-primary-800 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-200 hover:text-white hover:bg-primary-700 text-sm lg:text-base p-2 lg:p-3"
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
            className="w-full justify-start text-gray-200 hover:text-white hover:bg-primary-700 text-sm lg:text-base p-2 lg:p-3"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
            <span className="truncate">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen">
        <div className="h-full max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
