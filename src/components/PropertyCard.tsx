import { Link } from "react-router-dom";
import { MapPin, Bed, Maximize, ArrowUpRight } from "lucide-react";
import { Property } from "@/types/property";
import { formatPrice } from "@/data/properties";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link
      to={`/property/${property.slug}`}
      className="group block card-elevated overflow-hidden"
    >
      <div className="relative overflow-hidden aspect-[16/11]">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent opacity-60" />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground shadow-md">
            {property.status === "Rent" ? "For Rent" : "For Sale"}
          </span>
          {property.featured && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-md">
              ★ Featured
            </span>
          )}
        </div>

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <span className="font-heading font-bold text-xl text-primary-foreground drop-shadow-lg">
            {formatPrice(property.price, property.status)}
          </span>
        </div>

        {/* Arrow on hover */}
        <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          <ArrowUpRight className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-heading font-semibold text-card-foreground text-[15px] leading-snug line-clamp-1 group-hover:text-secondary transition-colors">
          {property.title}
        </h3>
        <p className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1.5">
          <MapPin className="h-3.5 w-3.5 text-secondary" /> {property.location}, Indore
        </p>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs text-muted-foreground font-medium">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bed className="h-3.5 w-3.5 text-navy-light" /> {property.bedrooms} BHK
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Maximize className="h-3.5 w-3.5 text-navy-light" /> {property.area} {property.areaUnit}
          </span>
          <span className="ml-auto px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-[11px] font-semibold uppercase">
            {property.type}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
