import { Link } from "react-router-dom";
import { MapPin, ArrowUpRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useLocations } from "@/hooks/useLocations";

const LocationsSection = () => {
  const { data: locations = [] } = useLocations();

  if (locations.length === 0) return null;

  return (
    <section className="section-padding bg-muted relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="container mx-auto px-4 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Prime Localities</span>
            <h2 className="section-title mt-3">Explore by Location</h2>
            <div className="divider-gold" />
            <p className="section-subtitle">Browse properties across Indore's most sought-after neighbourhoods</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-14">
          {locations.map((loc, i) => (
            <ScrollReveal key={loc.id} delay={i * 0.08}>
              <Link to={`/properties?location=${loc.name}`} className="group relative rounded-2xl overflow-hidden aspect-[4/3] block">
                <img src={loc.image_url || ""} alt={loc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 via-navy-dark/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 md:p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-primary-foreground text-sm sm:text-lg md:text-xl flex items-center gap-1.5 sm:gap-2">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary" /> {loc.name}
                      </h3>
                      <p className="text-primary-foreground/50 text-xs sm:text-sm mt-0.5 hidden sm:block">{loc.description}</p>
                      <span className="inline-block mt-1.5 sm:mt-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-secondary/20 text-secondary text-[10px] sm:text-xs font-semibold border border-secondary/20">
                        {loc.listing_count}+ listings
                      </span>
                    </div>
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0 flex-shrink-0 hidden sm:flex">
                      <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
