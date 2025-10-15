
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, UserCircle, LogIn, MessageCircle, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    closeMenu();
  };

  return (
    <nav className="bg-card shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">Manjaws</span>
              <span className="text-xl font-semibold text-secondary ml-1">E-Book</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {!user && (
              <Link to="/" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
            )}
            <Link to="/browse" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Browse eBooks
            </Link>
            <Link to="/blog" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Blog
            </Link>
            {user && (
              <>
                <Link to="/upload" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Upload eBook
                </Link>
                <Link to="/library" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  My Library
                </Link>
              </>
            )}
            
            <ThemeToggle />
            
            {user ? (
              <>
                <Button asChild variant="ghost" className="flex items-center gap-2">
                  <Link to="/profile">
                    <UserCircle className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </Button>
                {isAdmin && (
                  <Button asChild variant="outline" className="ml-2">
                    <Link to="/admin">Admin Dashboard</Link>
                  </Button>
                )}
                <Button variant="ghost" onClick={handleLogout} className="ml-2">
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild className="bg-primary hover:bg-primary/80">
                <Link to="/login" className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="flex flex-col px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card">
          {!user && (
            <Link to="/" onClick={closeMenu} className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </Link>
          )}
          <Link to="/browse" onClick={closeMenu} className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
            Browse eBooks
          </Link>
          <Link to="/blog" onClick={closeMenu} className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
            Blog
          </Link>
          {user && (
            <>
              <Link to="/upload" onClick={closeMenu} className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Upload eBook
              </Link>
              <Link to="/library" onClick={closeMenu} className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                My Library
              </Link>
              <Link to="/profile" onClick={closeMenu} className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Profile
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={closeMenu} className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Admin Dashboard
                </Link>
              )}
            </>
          )}
          
          {user ? (
            <Button variant="ghost" onClick={handleLogout} className="w-full mt-2 justify-start">
              Logout
            </Button>
          ) : (
            <Button asChild className="w-full mt-2 bg-primary hover:bg-primary/80">
              <Link to="/login" onClick={closeMenu} className="flex items-center justify-center gap-2">
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
