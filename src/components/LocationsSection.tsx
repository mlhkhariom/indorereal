import { Link } from "react-router-dom";
import { MapPin, ArrowUpRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const locations = [
  { name: "Vijay Nagar", count: 25, desc: "Premium flats & commercial", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600" },
  { name: "Super Corridor", count: 18, desc: "Plots & new developments", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600" },
  { name: "Rau", count: 12, desc: "Villas & independent houses", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600" },
  { name: "Bypass Road", count: 15, desc: "Affordable housing options", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600" },
  { name: "AB Road", count: 20, desc: "Commercial & luxury", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600" },
  { name: "MR-10", count: 10, desc: "Growing residential area", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600" },
];

const LocationsSection = () => {
  return (
    <section className="section-padding bg-muted relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Prime Localities</span>
            <h2 className="section-title mt-3">
              Explore by Location
            </h2>
            <div className="divider-gold" />
            <p className="section-subtitle">
              Browse properties across Indore's most sought-after neighbourhoods
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-14">
          {locations.map((loc, i) => (
            <ScrollReveal key={loc.name} delay={i * 0.08}>
              <Link
                to={`/properties?location=${loc.name}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] block"
              >
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 via-navy-dark/40 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-primary-foreground text-lg md:text-xl flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-secondary" /> {loc.name}
                      </h3>
                      <p className="text-primary-foreground/50 text-sm mt-0.5">{loc.desc}</p>
                      <span className="inline-block mt-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-semibold border border-secondary/20">
                        {loc.count}+ listings
                      </span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0 flex-shrink-0">
                      <ArrowUpRight className="h-5 w-5 text-primary-foreground" />
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
