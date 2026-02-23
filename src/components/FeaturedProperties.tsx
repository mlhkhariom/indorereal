import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeaturedProperties = () => {
  const featured = properties.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Featured <span className="text-secondary">Properties</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Handpicked properties in Indore's most sought-after locations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/properties">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-heading">
              View All Properties <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
