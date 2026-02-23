import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LeadForm from "@/components/LeadForm";
import ScrollReveal from "@/components/ScrollReveal";
import { properties, formatPrice } from "@/data/properties";
import { MapPin, Bed, Maximize, Home, ChevronRight, Building, Phone, MessageCircle } from "lucide-react";

const PropertyDetail = () => {
  const { slug } = useParams();
  const property = properties.find((p) => p.slug === slug);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Property Not Found</h1>
            <Link to="/properties" className="text-secondary hover:underline font-medium">Browse all properties</Link>
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
        <div className="navy-gradient pt-24 pb-6">
          <div className="container mx-auto px-4 lg:px-8">
            <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/50">
              <Link to="/" className="hover:text-secondary transition-colors flex items-center gap-1">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to="/properties" className="hover:text-secondary transition-colors">Properties</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to={`/properties?location=${property.location}`} className="hover:text-secondary transition-colors">{property.location}</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-primary-foreground truncate max-w-[200px]">{property.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left */}
            <div className="flex-1 min-w-0">
              <ScrollReveal>
                {/* Image */}
                <div className="rounded-2xl overflow-hidden aspect-video shadow-lg">
                  <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                {/* Info card */}
                <div className="card-elevated p-7 mt-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20 mb-3">
                        For {property.status}
                      </span>
                      <h1 className="font-heading text-2xl md:text-3xl font-bold text-card-foreground leading-tight">
                        {property.title}
                      </h1>
                      <p className="flex items-center gap-1.5 text-muted-foreground mt-2">
                        <MapPin className="h-4 w-4 text-secondary" /> {property.location}, Indore, Madhya Pradesh
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-3xl md:text-4xl font-extrabold text-gold-gradient">
                        {formatPrice(property.price, property.status)}
                      </p>
                      {property.status === "Rent" && (
                        <p className="text-muted-foreground text-xs mt-1">per month</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-5 border-y border-border">
                    {property.bedrooms > 0 && (
                      <div className="text-center p-3 rounded-xl bg-muted/50">
                        <Bed className="h-5 w-5 text-secondary mx-auto mb-1.5" />
                        <p className="font-heading font-bold text-foreground text-lg">{property.bedrooms} BHK</p>
                        <p className="text-muted-foreground text-xs">Bedrooms</p>
                      </div>
                    )}
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <Maximize className="h-5 w-5 text-secondary mx-auto mb-1.5" />
                      <p className="font-heading font-bold text-foreground text-lg">{property.area}</p>
                      <p className="text-muted-foreground text-xs">{property.areaUnit}</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <Building className="h-5 w-5 text-secondary mx-auto mb-1.5" />
                      <p className="font-heading font-bold text-foreground text-lg">{property.type}</p>
                      <p className="text-muted-foreground text-xs">Type</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h2 className="font-heading font-bold text-foreground text-lg mb-3">About This Property</h2>
                    <p className="text-muted-foreground leading-relaxed text-[15px]">{property.description}</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                {/* Amenities */}
                <div className="card-elevated p-7 mt-6">
                  <h2 className="font-heading font-bold text-foreground text-lg mb-5">Amenities & Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((a) => (
                      <div key={a} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 text-sm text-foreground">
                        <div className="h-2.5 w-2.5 rounded-full gold-gradient flex-shrink-0 shadow-sm" />
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right sidebar */}
            <div className="w-full lg:w-[340px] flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-5">
                <ScrollReveal delay={0.1}>
                  <LeadForm propertyTitle={property.title} />
                </ScrollReveal>

                <ScrollReveal delay={0.15}>
                  {/* Trust box */}
                  <div className="card-elevated p-5">
                    <h4 className="font-heading font-semibold text-sm text-foreground mb-3">Why Trust Us</h4>
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      {["RERA Registered Agency", "100% Verified Listings", "Free Legal Consultation", "No Hidden Charges"].map((t) => (
                        <li key={t} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />

      {/* Mobile sticky bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border p-3 flex gap-2 z-40">
        <a href="tel:+919876543210" className="flex-1">
          <button className="w-full h-12 rounded-xl btn-gold text-sm flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" /> Call Now
          </button>
        </a>
        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1">
          <button className="w-full h-12 rounded-xl bg-[#25D366] text-primary-foreground font-heading font-semibold text-sm flex items-center justify-center gap-2 shadow-md">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </button>
        </a>
      </div>
    </div>
  );
};

export default PropertyDetail;
