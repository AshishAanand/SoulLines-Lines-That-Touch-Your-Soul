"use client"

import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const isActive = (path) => pathname === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/feed", label: "Quotes" },
    { href: "/about", label: "About" },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div>
              <img src="../../public/SoulLines-Logo.png" alt="SoulLines Logo" width={32} height={32}/>
            </div>
            <span className="font-serif font-bold text-lg text-foreground hidden sm:inline">SoulLines</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${isActive(link.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Add Quote - Only for logged-in users */}
            {user && (
              <Link
                to="/add-quote"
                className={`text-sm font-medium transition-colors ${isActive("/add-quote") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Add Quote
              </Link>
            )}

          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/me"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  {user.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Add Quote for logged-in users */}
            {user && (
              <Link
                to="/add-quote"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive("/add-quote")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
              >
                Add Quote
              </Link>
            )}

            <div className="border-t border-border pt-4 mt-4 space-y-2">
              {user ? (
                <>
                  <Link
                    to="/me"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    {user.username}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
