import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: "Home", path: "/" },
    { label: "Properties", path: "/properties" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center font-heading font-bold text-primary text-lg">
            IR
          </div>
          <span className="font-heading text-xl font-bold text-primary-foreground">
            Indore Reality
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-secondary ${
                location.pathname === link.path
                  ? "text-secondary"
                  : "text-primary-foreground/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="border-secondary/40 text-secondary hover:bg-secondary hover:text-primary">
              WhatsApp
            </Button>
          </a>
          <a href="tel:+919876543210">
            <Button size="sm" className="bg-secondary text-primary hover:bg-gold-light font-semibold">
              <Phone className="h-4 w-4 mr-1" /> Call Now
            </Button>
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10 px-4 pb-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-sm font-medium border-b border-primary-foreground/10 ${
                location.pathname === link.path
                  ? "text-secondary"
                  : "text-primary-foreground/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 mt-4">
            <a href="tel:+919876543210" className="flex-1">
              <Button size="sm" className="w-full bg-secondary text-primary hover:bg-gold-light font-semibold">
                <Phone className="h-4 w-4 mr-1" /> Call Now
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
