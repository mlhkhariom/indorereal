import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { useState } from "react";

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", title: "Luxury Apartment — Vijay Nagar", category: "Apartments" },
  { src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800", title: "Premium Villa — Rau", category: "Villas" },
  { src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", title: "Modern Home — Super Corridor", category: "Homes" },
  { src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800", title: "Commercial Tower — AB Road", category: "Commercial" },
  { src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800", title: "Independent Villa — Rau", category: "Villas" },
  { src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", title: "Residential Society — Bypass Road", category: "Apartments" },
  { src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", title: "Interior — Modern 3BHK", category: "Interiors" },
  { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", title: "Luxury Living Room", category: "Interiors" },
  { src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", title: "Independent House — MR-10", category: "Homes" },
  { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", title: "Office Space — Vijay Nagar", category: "Commercial" },
  { src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", title: "Furnished Flat — Rent", category: "Apartments" },
  { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800", title: "Premium Plot — Super Corridor", category: "Plots" },
];

const categories = ["All", "Apartments", "Villas", "Homes", "Commercial", "Interiors", "Plots"];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? galleryImages : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
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
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight">
                Property <span className="text-gold-gradient">Gallery</span>
              </h1>
              <p className="text-primary-foreground/60 text-lg md:text-xl mt-4 max-w-2xl leading-relaxed">
                Explore stunning visuals of our premium properties across Indore.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Filter Tabs */}
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

        {/* Gallery Grid */}
        <section className="section-padding bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {filtered.map((img, i) => (
                <ScrollReveal key={`${img.src}-${activeCategory}`} delay={i * 0.05}>
                  <div className="break-inside-avoid group relative rounded-2xl overflow-hidden">
                    <img
                      src={img.src}
                      alt={img.title}
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
