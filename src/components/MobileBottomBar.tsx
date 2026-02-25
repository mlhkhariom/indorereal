import { Phone, MessageCircle, Home, Building, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const MobileBottomBar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
      {/* CTA strip */}
      <div className="bg-card/95 backdrop-blur-xl border-t border-border px-3 pt-1.5 pb-2 safe-area-bottom">
        {/* Quick action buttons */}
        <div className="flex gap-2 mb-1.5">
          <a href="tel:+919876543210" className="flex-1">
            <button className="w-full h-10 rounded-xl btn-gold text-xs flex items-center justify-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> Call Now
            </button>
          </a>
          <a href="https://wa.me/919876543210?text=Hi%2C%20I%20am%20interested%20in%20a%20property%20in%20Indore" target="_blank" rel="noopener noreferrer" className="flex-1">
            <button className="w-full h-10 rounded-xl bg-[#25D366] text-primary-foreground font-heading font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md">
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </button>
          </a>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center justify-around">
          <Link to="/" className={`flex flex-col items-center gap-0.5 py-1 px-3 ${path === "/" ? "text-secondary" : "text-muted-foreground"}`}>
            <Home className="h-4 w-4" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link to="/properties" className={`flex flex-col items-center gap-0.5 py-1 px-3 ${path === "/properties" ? "text-secondary" : "text-muted-foreground"}`}>
            <Building className="h-4 w-4" />
            <span className="text-[10px] font-medium">Properties</span>
          </Link>
          <Link to="/about" className={`flex flex-col items-center gap-0.5 py-1 px-3 ${path === "/about" ? "text-secondary" : "text-muted-foreground"}`}>
            <Search className="h-4 w-4" />
            <span className="text-[10px] font-medium">About</span>
          </Link>
          <Link to="/contact" className={`flex flex-col items-center gap-0.5 py-1 px-3 ${path === "/contact" ? "text-secondary" : "text-muted-foreground"}`}>
            <Phone className="h-4 w-4" />
            <span className="text-[10px] font-medium">Contact</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomBar;
