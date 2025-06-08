
import React from "react";
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
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
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
    <div className="min-h-screen flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-primary text-white fixed inset-y-0 left-0 z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-primary-800">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">Manjaws</span>
            <span className="text-secondary ml-1">Admin</span>
          </Link>
          {profile && (
            <div className="mt-2 text-sm text-gray-200">
              Welcome, {profile.full_name || profile.email}
            </div>
          )}
        </div>
        
        <nav className="flex-grow p-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive
                        ? "bg-primary-800 text-white"
                        : "text-gray-200 hover:text-white hover:bg-primary-700"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-primary-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-200 hover:text-white hover:bg-primary-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
