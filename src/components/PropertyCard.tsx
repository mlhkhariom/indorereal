import { Link } from "react-router-dom";
import { MapPin, Bed, Maximize } from "lucide-react";
import { Property } from "@/types/property";
import { formatPrice } from "@/data/properties";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link
      to={`/property/${property.slug}`}
      className="group block bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-secondary text-secondary-foreground font-semibold text-xs">
            {property.status === "Rent" ? "For Rent" : "For Sale"}
          </Badge>
          {property.featured && (
            <Badge className="bg-primary text-primary-foreground text-xs">Featured</Badge>
          )}
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="bg-primary/90 text-primary-foreground font-heading font-bold text-lg px-3 py-1 rounded-md">
            {formatPrice(property.price, property.status)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-heading font-semibold text-card-foreground text-base line-clamp-1 group-hover:text-secondary transition-colors">
          {property.title}
        </h3>
        <p className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
          <MapPin className="h-3.5 w-3.5" /> {property.location}, Indore
        </p>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" /> {property.bedrooms} BHK
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize className="h-4 w-4" /> {property.area} {property.areaUnit}
          </span>
          <span className="capitalize">{property.type}</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
