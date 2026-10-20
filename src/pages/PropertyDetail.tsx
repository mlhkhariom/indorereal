import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LeadForm from "@/components/LeadForm";
import ScrollReveal from "@/components/ScrollReveal";
import { useProperty } from "@/hooks/useProperties";
import { formatPrice } from "@/types/property";
import { MapPin, Bed, Maximize, Home, ChevronRight, Building, Heart, GitCompare, Share2, Eye } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyMap from "@/components/PropertyMap";
import PropertyCard from "@/components/PropertyCard";
import ScheduleVisitForm from "@/components/ScheduleVisitForm";
import SEOHead from "@/components/SEOHead";
import { useProperties } from "@/hooks/useProperties";
import { useWishlist, useCompare, COMPARE_MAX } from "@/hooks/useShortlist";
import { toast } from "@/hooks/use-toast";
import { areaSlug } from "@/lib/areas";

const PropertyDetail = () => {
  const { slug } = useParams();
  const { data: property, isLoading } = useProperty(slug || "");
  const { data: all = [] } = useProperties();
  const wish = useWishlist();
  const cmp = useCompare();

  useEffect(() => {
    if (!property?.id) return;
    const key = `viewed_${property.id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    supabase.rpc("track_property_view", { _property_id: property.id });
  }, [property?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </main>
        <Footer />
      </div>
    );
  }

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

  const similar = all
    .filter((p) => p.id !== property.id && (p.location === property.location || p.type === property.type))
    .sort((a, b) => Number(b.location === property.location) - Number(a.location === property.location))
    .slice(0, 3);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title: property.title, url }); } catch { /* cancelled */ } }
    else { await navigator.clipboard.writeText(url); toast({ title: "Link copied" }); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title={`${property.title} in ${property.location}, Indore | Indore Realty`}
        description={(property.description || `${property.type} for ${property.status} in ${property.location}, Indore.`).slice(0, 155)}
        canonical={`https://indorerealty.in/property/${property.slug}`} />
      <Header />
      <main className="flex-1 bg-muted">
        <div className="navy-gradient pt-24 pb-6">
          <div className="container mx-auto px-4 lg:px-8">
            <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/60 overflow-x-auto whitespace-nowrap">
              <Link to="/" className="hover:text-secondary transition-colors flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to="/properties" className="hover:text-secondary transition-colors">Properties</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to={`/area/${areaSlug(property.location)}`} className="hover:text-secondary transition-colors">{property.location}</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-primary-foreground truncate max-w-[160px] sm:max-w-[300px]">{property.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <ScrollReveal>
                <PropertyGallery images={property.images} title={property.title} />
                <div className="flex flex-wrap gap-2 mt-4">
                  <button onClick={() => wish.toggle(property.id)} className="h-10 px-4 rounded-xl bg-card border border-border text-sm font-medium flex items-center gap-2 hover:border-secondary">
                    <Heart className={`h-4 w-4 ${wish.has(property.id) ? "fill-destructive text-destructive" : ""}`} /> {wish.has(property.id) ? "Saved" : "Save"}
                  </button>
                  <button onClick={() => { if (!cmp.toggle(property.id)) toast({ title: `You can compare up to ${COMPARE_MAX} properties` }); }} className={`h-10 px-4 rounded-xl border text-sm font-medium flex items-center gap-2 ${cmp.has(property.id) ? "bg-secondary text-secondary-foreground border-secondary" : "bg-card border-border hover:border-secondary"}`}>
                    <GitCompare className="h-4 w-4" /> {cmp.has(property.id) ? "In compare" : "Compare"}
                  </button>
                  <button onClick={share} className="h-10 px-4 rounded-xl bg-card border border-border text-sm font-medium flex items-center gap-2 hover:border-secondary"><Share2 className="h-4 w-4" /> Share</button>
                  {(property.view_count ?? 0) > 0 && <span className="h-10 px-3 text-sm text-muted-foreground flex items-center gap-1.5 ml-auto"><Eye className="h-4 w-4" /> {property.view_count} views</span>}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="card-elevated p-5 sm:p-7 mt-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20 mb-3">For {property.status}</span>
                      <h1 className="font-heading text-2xl md:text-3xl font-bold text-card-foreground leading-tight">{property.title}</h1>
                      <p className="flex items-center gap-1.5 text-muted-foreground mt-2"><MapPin className="h-4 w-4 text-secondary" /> {property.location}, Indore, Madhya Pradesh</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-gold-gradient">{formatPrice(property.price, property.status)}</p>
                      {property.status === "Rent" && <p className="text-muted-foreground text-xs mt-1">per month</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-4 py-5 border-y border-border">
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
                      <p className="text-muted-foreground text-xs">{property.area_unit}</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <Building className="h-5 w-5 text-secondary mx-auto mb-1.5" />
                      <p className="font-heading font-bold text-foreground text-base sm:text-lg">{property.type}</p>
                      <p className="text-muted-foreground text-xs">Type</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h2 className="font-heading font-bold text-foreground text-lg mb-3">About This Property</h2>
                    <p className="text-muted-foreground leading-relaxed text-[15px] whitespace-pre-line">{property.description}</p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="card-elevated p-7 mt-6">
                  <h2 className="font-heading font-bold text-foreground text-lg mb-5">Amenities & Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities?.map((a) => (
                      <div key={a} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 text-sm text-foreground">
                        <div className="h-2.5 w-2.5 rounded-full gold-gradient flex-shrink-0 shadow-sm" />
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="card-elevated p-5 sm:p-7 mt-6">
                  <h2 className="font-heading font-bold text-foreground text-lg mb-4">Location</h2>
                  <PropertyMap location={property.location} lat={property.latitude} lng={property.longitude} />
                </div>
              </ScrollReveal>
            </div>

            <div className="w-full lg:w-[340px] flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-5">
                <ScrollReveal delay={0.1}><LeadForm propertyTitle={property.title} /></ScrollReveal>
                <ScrollReveal delay={0.12}><ScheduleVisitForm propertyId={property.id} propertyTitle={property.title} /></ScrollReveal>
                <ScrollReveal delay={0.15}>
                  <div className="card-elevated p-5">
                    <h4 className="font-heading font-semibold text-sm text-foreground mb-3">Why Trust Us</h4>
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      {["RERA Registered Agency", "100% Verified Listings", "Free Legal Consultation", "No Hidden Charges"].map((t) => (
                        <li key={t} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>

          {similar.length > 0 && (
            <section className="mt-14">
              <div className="flex items-end justify-between mb-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">Similar Properties</h2>
                <Link to={`/area/${areaSlug(property.location)}`} className="text-sm text-secondary font-medium hover:underline">More in {property.location} →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <div className="lg:hidden h-28" />
    </div>
  );
};

export default PropertyDetail;
