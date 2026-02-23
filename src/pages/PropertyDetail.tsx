import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LeadForm from "@/components/LeadForm";
import { properties, formatPrice } from "@/data/properties";
import { MapPin, Bed, Maximize, Home, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PropertyDetail = () => {
  const { slug } = useParams();
  const property = properties.find((p) => p.slug === slug);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Property Not Found</h1>
            <Link to="/properties" className="text-secondary hover:underline">Browse all properties</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted">
        {/* Breadcrumb */}
        <div className="bg-primary py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-1 text-sm text-primary-foreground/60">
              <Link to="/" className="hover:text-secondary transition-colors flex items-center gap-1">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to="/properties" className="hover:text-secondary transition-colors">Properties</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-primary-foreground">{property.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: property details */}
            <div className="flex-1">
              {/* Image */}
              <div className="rounded-xl overflow-hidden aspect-video mb-6">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="bg-card rounded-xl border border-border p-6 mb-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-card-foreground">
                      {property.title}
                    </h1>
                    <p className="flex items-center gap-1 text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" /> {property.location}, Indore
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-3xl font-bold text-secondary">
                      {formatPrice(property.price, property.status)}
                    </p>
                    <Badge className="bg-secondary/10 text-secondary border-secondary/30 mt-1">
                      For {property.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 py-4 border-y border-border text-sm">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold text-foreground">{property.bedrooms} BHK</p>
                        <p className="text-muted-foreground text-xs">Bedrooms</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Maximize className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold text-foreground">{property.area} {property.areaUnit}</p>
                      <p className="text-muted-foreground text-xs">Area</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold text-foreground">{property.type}</p>
                      <p className="text-muted-foreground text-xs">Type</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="font-heading font-semibold text-lg text-foreground mb-2">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-heading font-semibold text-lg text-foreground mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-secondary flex-shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Lead form (sticky) */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-20">
                <LeadForm propertyTitle={property.title} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 flex gap-2 z-40">
        <a href="tel:+919876543210" className="flex-1">
          <button className="w-full h-11 rounded-lg bg-secondary text-secondary-foreground font-heading font-semibold text-sm">
            Call Now
          </button>
        </a>
        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1">
          <button className="w-full h-11 rounded-lg bg-[#25D366] text-primary-foreground font-heading font-semibold text-sm">
            WhatsApp
          </button>
        </a>
      </div>
    </div>
  );
};

export default PropertyDetail;
