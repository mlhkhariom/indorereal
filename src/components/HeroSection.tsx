import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOCATIONS, PROPERTY_TYPES, BUDGET_RANGES } from "@/types/property";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (type) params.set("type", type);
    if (budget) params.set("budget", budget);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/90" />

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 animate-fade-in-up">
          Find Your Dream Property
          <span className="block text-secondary mt-2">in Indore</span>
        </h1>
        <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Discover verified properties at the best prices with Indore's most trusted real estate platform.
        </p>

        {/* Search bar */}
        <div className="bg-card/95 backdrop-blur-md rounded-xl p-4 md:p-6 max-w-4xl mx-auto shadow-2xl animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12 rounded-lg border border-border bg-background px-4 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">All Locations</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-12 rounded-lg border border-border bg-background px-4 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">Property Type</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="h-12 rounded-lg border border-border bg-background px-4 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">Budget</option>
              {BUDGET_RANGES.map((b) => (
                <option key={b.label} value={b.label}>{b.label}</option>
              ))}
            </select>

            <Button
              onClick={handleSearch}
              className="h-12 bg-secondary text-secondary-foreground hover:bg-gold-light font-heading font-semibold text-base"
            >
              <Search className="h-5 w-5 mr-2" /> Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
