import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PropertyCard from "@/components/PropertyCard";
import ScrollReveal from "@/components/ScrollReveal";
import { properties } from "@/data/properties";
import { LOCATIONS, PROPERTY_TYPES, BUDGET_RANGES } from "@/types/property";
import { SlidersHorizontal, X, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const location = searchParams.get("location") || "";
  const type = searchParams.get("type") || "";
  const budget = searchParams.get("budget") || "";
  const status = searchParams.get("status") || "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (location && p.location !== location) return false;
      if (type && p.type !== type) return false;
      if (status && p.status !== status) return false;
      if (budget) {
        const range = BUDGET_RANGES.find((b) => b.label === budget);
        if (range && (p.price < range.min || p.price > range.max)) return false;
      }
      return true;
    });
  }, [location, type, budget, status]);

  const hasFilters = location || type || budget || status;

  const selectClass = "w-full h-11 rounded-xl bg-muted/60 border border-border px-4 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/40 appearance-none cursor-pointer";

  const FilterControls = () => (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-heading font-semibold text-foreground mb-1.5 block uppercase tracking-wider">Location</label>
        <select value={location} onChange={(e) => updateFilter("location", e.target.value)} className={selectClass}>
          <option value="">All Locations</option>
          {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-heading font-semibold text-foreground mb-1.5 block uppercase tracking-wider">Property Type</label>
        <select value={type} onChange={(e) => updateFilter("type", e.target.value)} className={selectClass}>
          <option value="">All Types</option>
          {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-heading font-semibold text-foreground mb-1.5 block uppercase tracking-wider">Budget</label>
        <select value={budget} onChange={(e) => updateFilter("budget", e.target.value)} className={selectClass}>
          <option value="">Any Budget</option>
          {BUDGET_RANGES.map((b) => <option key={b.label} value={b.label}>{b.label}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-heading font-semibold text-foreground mb-1.5 block uppercase tracking-wider">Status</label>
        <select value={status} onChange={(e) => updateFilter("status", e.target.value)} className={selectClass}>
          <option value="">All</option>
          <option value="Sale">For Sale</option>
          <option value="Rent">For Rent</option>
        </select>
      </div>
      {hasFilters && (
        <Button variant="outline" className="w-full rounded-xl" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" /> Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted">
        {/* Header banner */}
        <div className="navy-gradient pt-28 pb-10">
          <div className="container mx-auto px-4 lg:px-8">
            <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/50 mb-4">
              <Link to="/" className="hover:text-secondary transition-colors flex items-center gap-1">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-primary-foreground">Properties</span>
              {location && (
                <>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="text-secondary">{location}</span>
                </>
              )}
            </nav>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground">
              Properties in Indore
            </h1>
            <p className="text-primary-foreground/50 text-sm mt-1">
              Browse {filtered.length} verified properties across Indore's prime locations
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-10">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-6">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full rounded-xl h-11"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            {showFilters && (
              <div className="mt-4 card-elevated p-5">
                <FilterControls />
              </div>
            )}
          </div>

          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="card-elevated p-6 sticky top-24">
                <h3 className="font-heading font-bold text-foreground text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-secondary" /> Filters
                </h3>
                <FilterControls />
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-1">
              {filtered.length === 0 ? (
                <div className="text-center py-24 card-elevated rounded-2xl">
                  <p className="text-muted-foreground text-lg font-heading">No properties found</p>
                  <p className="text-muted-foreground/60 text-sm mt-1">Try adjusting your filters</p>
                  <Button variant="outline" className="mt-5 rounded-xl" onClick={clearFilters}>Clear Filters</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((property, i) => (
                    <ScrollReveal key={property.id} delay={i * 0.05}>
                      <PropertyCard property={property} />
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      {/* Spacer for mobile bottom bar */}
      <div className="lg:hidden h-28" />
    </div>
  );
};

export default Properties;
