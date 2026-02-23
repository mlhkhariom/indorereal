import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", path: "/" },
    { label: "Properties", path: "/properties" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const isHome = location.pathname === "/";
  const headerBg = scrolled || !isHome
    ? "bg-primary/98 backdrop-blur-md shadow-lg"
    : "bg-transparent";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="container mx-auto flex items-center justify-between py-4 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl gold-gradient flex items-center justify-center font-heading font-extrabold text-primary text-lg shadow-md group-hover:scale-105 transition-transform">
            IR
          </div>
          <div>
            <span className="font-heading text-lg font-bold text-primary-foreground leading-none block">
              Indore Reality
            </span>
            <span className="text-[10px] text-primary-foreground/50 font-medium tracking-widest uppercase">
              Premium Properties
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === link.path
                  ? "text-secondary bg-secondary/10"
                  : "text-primary-foreground/75 hover:text-primary-foreground hover:bg-primary-foreground/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              variant="outline"
              className="border-primary-foreground/20 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground rounded-xl h-10 px-5"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp
            </Button>
          </a>
          <a href="tel:+919876543210">
            <Button size="sm" className="btn-gold rounded-xl h-10 px-6">
              <Phone className="h-4 w-4 mr-2" /> Call Now
            </Button>
          </a>
        </div>

        <button
          className="lg:hidden text-primary-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden navy-gradient border-t border-primary-foreground/10 px-4 pb-5 animate-fade-in">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-3.5 text-sm font-medium border-b border-primary-foreground/5 ${
                location.pathname === link.path ? "text-secondary" : "text-primary-foreground/75"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 mt-5">
            <a href="tel:+919876543210" className="flex-1">
              <Button className="w-full btn-gold rounded-xl h-11">
                <Phone className="h-4 w-4 mr-2" /> Call Now
              </Button>
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="outline" className="w-full border-primary-foreground/20 text-primary-foreground rounded-xl h-11">
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
