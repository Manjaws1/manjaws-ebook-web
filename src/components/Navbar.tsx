
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, UserCircle, LogIn, MessageCircle, BookOpen } from "lucide-react";
import LoginPrompt from "./LoginPrompt";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  requiresAuth?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, onClick, requiresAuth = false }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from auth context in a real app
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (requiresAuth && !isLoggedIn) {
      e.preventDefault();
      setShowLoginPrompt(true);
      if (onClick) onClick();
      return;
    }
    if (onClick) onClick();
  };

  const handleLogin = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  return (
    <>
      <Link
        to={to}
        className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
        onClick={handleClick}
      >
        {children}
      </Link>
      <LoginPrompt 
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={handleLogin}
      />
    </>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from auth context in a real app
  const [isAdmin, setIsAdmin] = useState(false); // This would come from auth context in a real app
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleProtectedRoute = (route: string) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    navigate(route);
  };

  const handleLogin = () => {
    setShowLoginPrompt(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
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
            <NavLink to="/">Home</NavLink>
            <NavLink to="/browse">Browse eBooks</NavLink>
            <NavLink to="/blog" requiresAuth={true}>Blog</NavLink>
            <NavLink to="/upload" requiresAuth={true}>Upload eBook</NavLink>
            <NavLink to="/library" requiresAuth={true}>My Library</NavLink>
            
            {isLoggedIn ? (
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
              </>
            ) : (
              <Button asChild className="bg-primary hover:bg-primary-700">
                <Link to="/login" className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
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
        <div className="flex flex-col px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/browse" onClick={closeMenu}>Browse eBooks</NavLink>
          <NavLink to="/blog" onClick={closeMenu} requiresAuth={true}>Blog</NavLink>
          <NavLink to="/upload" onClick={closeMenu} requiresAuth={true}>Upload eBook</NavLink>
          <NavLink to="/library" onClick={closeMenu} requiresAuth={true}>My Library</NavLink>
          
          {isLoggedIn ? (
            <>
              <NavLink to="/profile" onClick={closeMenu}>Profile</NavLink>
              {isAdmin && (
                <NavLink to="/admin" onClick={closeMenu}>Admin Dashboard</NavLink>
              )}
            </>
          ) : (
            <Button asChild className="w-full mt-2 bg-primary hover:bg-primary-700">
              <Link to="/login" onClick={closeMenu} className="flex items-center justify-center gap-2">
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      <LoginPrompt 
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={handleLogin}
      />
    </nav>
  );
};

export default Navbar;
