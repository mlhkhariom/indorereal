import PropertyCard from "@/components/PropertyCard";
import ScrollReveal from "@/components/ScrollReveal";
import { properties } from "@/data/properties";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedProperties = () => {
  const featured = properties.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Subtle decorative bg */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] -translate-y-1/2" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Curated For You</span>
            <h2 className="section-title mt-3">
              Featured Properties
            </h2>
            <div className="divider-gold" />
            <p className="section-subtitle">
              Handpicked premium properties in Indore's most desirable locations, verified by our expert team
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {featured.map((property, i) => (
            <ScrollReveal key={property.id} delay={i * 0.1}>
              <PropertyCard property={property} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center mt-14">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-primary text-primary font-heading font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
          >
            View All Properties
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FeaturedProperties;
