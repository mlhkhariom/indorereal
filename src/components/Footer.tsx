import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center font-heading font-bold text-primary text-lg">
                IR
              </div>
              <span className="font-heading text-xl font-bold">Indore Reality</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Your trusted partner for finding the perfect property in Indore. Verified listings, best prices, and expert guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-secondary">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-secondary transition-colors">Home</Link></li>
              <li><Link to="/properties" className="hover:text-secondary transition-colors">Properties</Link></li>
              <li><Link to="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-secondary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-secondary">Popular Locations</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/properties?location=Vijay Nagar" className="hover:text-secondary transition-colors">Vijay Nagar</Link></li>
              <li><Link to="/properties?location=Super Corridor" className="hover:text-secondary transition-colors">Super Corridor</Link></li>
              <li><Link to="/properties?location=Rau" className="hover:text-secondary transition-colors">Rau</Link></li>
              <li><Link to="/properties?location=AB Road" className="hover:text-secondary transition-colors">AB Road</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-secondary">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-secondary flex-shrink-0" />
                Vijay Nagar, Indore, MP 452010
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary flex-shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-secondary flex-shrink-0" />
                info@indorereality.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
          <p>© 2025 Indore Reality. All rights reserved.</p>
          <p>Powered by <span className="text-secondary">MLHK Infotech</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
