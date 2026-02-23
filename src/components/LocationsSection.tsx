import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const locations = [
  { name: "Vijay Nagar", count: 25, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400" },
  { name: "Super Corridor", count: 18, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400" },
  { name: "Rau", count: 12, image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400" },
  { name: "Bypass Road", count: 15, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400" },
];

const LocationsSection = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Explore by <span className="text-secondary">Location</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Browse properties in Indore's top localities
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {locations.map((loc) => (
            <Link
              key={loc.name}
              to={`/properties?location=${loc.name}`}
              className="group relative rounded-xl overflow-hidden aspect-[3/4] shadow-md hover:shadow-xl transition-all"
            >
              <img
                src={loc.image}
                alt={loc.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-heading font-semibold text-primary-foreground text-lg flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-secondary" /> {loc.name}
                </h3>
                <p className="text-primary-foreground/70 text-sm">{loc.count}+ properties</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
