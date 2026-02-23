import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { LOCATIONS, PROPERTY_TYPES, BUDGET_RANGES } from "@/types/property";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const FilterControls = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Location</label>
        <select value={location} onChange={(e) => updateFilter("location", e.target.value)}
          className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm">
          <option value="">All Locations</option>
          {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Property Type</label>
        <select value={type} onChange={(e) => updateFilter("type", e.target.value)}
          className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm">
          <option value="">All Types</option>
          {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Budget</label>
        <select value={budget} onChange={(e) => updateFilter("budget", e.target.value)}
          className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm">
          <option value="">Any Budget</option>
          {BUDGET_RANGES.map((b) => <option key={b.label} value={b.label}>{b.label}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">Status</label>
        <select value={status} onChange={(e) => updateFilter("status", e.target.value)}
          className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm">
          <option value="">All</option>
          <option value="Sale">For Sale</option>
          <option value="Rent">For Rent</option>
        </select>
      </div>
      {hasFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" /> Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted">
        {/* Breadcrumb */}
        <div className="bg-primary py-8">
          <div className="container mx-auto px-4">
            <h1 className="font-heading text-3xl font-bold text-primary-foreground">Properties in Indore</h1>
            <p className="text-primary-foreground/60 text-sm mt-1">Home &gt; Properties{location ? ` > ${location}` : ""}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full">
              <SlidersHorizontal className="h-4 w-4 mr-2" /> {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            {showFilters && (
              <div className="mt-4 bg-card p-4 rounded-lg border border-border">
                <FilterControls />
              </div>
            )}
          </div>

          <div className="flex gap-8">
            {/* Desktop sidebar filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-card p-5 rounded-lg border border-border sticky top-20">
                <h3 className="font-heading font-semibold text-foreground mb-4">Filters</h3>
                <FilterControls />
              </div>
            </aside>

            {/* Properties grid */}
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">{filtered.length} properties found</p>
              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-lg border border-border">
                  <p className="text-muted-foreground text-lg">No properties found matching your filters.</p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Properties;
