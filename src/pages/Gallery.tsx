import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { useGalleryImages } from "@/hooks/useGallery";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: images = [], isLoading } = useGalleryImages();

  const categories = useMemo(() => {
    const cats = new Set(images.map(img => img.category));
    return ["All", ...Array.from(cats)];
  }, [images]);

  const filtered = activeCategory === "All" ? images : images.filter((img) => img.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="Property Gallery — Indore Realty" description="Explore stunning visuals of premium properties across Indore. Apartments, villas, homes & commercial spaces." />
      <Header />
      <main className="flex-1">
        <section className="navy-gradient pt-28 pb-16 relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-secondary/10 blur-[100px]" />
          <div className="container mx-auto px-4 lg:px-8 relative">
            <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/50 mb-6">
              <Link to="/" className="hover:text-secondary transition-colors flex items-center gap-1">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-primary-foreground">Gallery</span>
            </nav>
            <ScrollReveal>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight">
                Property <span className="text-gold-gradient">Gallery</span>
              </h1>
              <p className="text-primary-foreground/60 text-base sm:text-lg md:text-xl mt-4 max-w-2xl leading-relaxed">
                Explore stunning visuals of our premium properties across Indore.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="bg-background border-b border-border sticky top-[72px] z-30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-4 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-secondary/10 hover:text-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            {isLoading ? (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse break-inside-avoid" />)}
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {filtered.map((img, i) => (
                  <ScrollReveal key={`${img.id}-${activeCategory}`} delay={i * 0.05}>
                    <div className="break-inside-avoid group relative rounded-2xl overflow-hidden">
                      <img
                        src={img.image_url}
                        alt={img.title || "Property image"}
                        className="w-full rounded-2xl group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        <p className="text-primary-foreground font-heading font-semibold text-sm">{img.title}</p>
                        <span className="text-secondary text-xs">{img.category}</span>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}
            {!isLoading && filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-16">No images in this category.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      <div className="lg:hidden h-28" />
    </div>
  );
};

export default Gallery;
