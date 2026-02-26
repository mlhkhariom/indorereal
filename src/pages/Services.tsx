import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Building, FileCheck, Search, Handshake, Calculator, MapPin, Phone, ArrowRight, Shield, TrendingUp, Key, Landmark } from "lucide-react";

const services = [
  {
    icon: Search,
    title: "Property Search & Discovery",
    desc: "Access 500+ verified properties across 15+ locations in Indore. Use smart filters to find your perfect match — whether it's a flat, villa, plot, or commercial space.",
  },
  {
    icon: Building,
    title: "Property Buying Assistance",
    desc: "End-to-end support for property purchase. From shortlisting to negotiation, site visits to registration — we handle every step so you don't have to worry.",
  },
  {
    icon: Key,
    title: "Rental Services",
    desc: "Find the perfect rental property or list your property for rent. We match tenants with verified landlords for a hassle-free experience.",
  },
  {
    icon: TrendingUp,
    title: "Investment Advisory",
    desc: "Get expert investment advice backed by market data. We help you identify high-growth areas and properties that deliver the best returns.",
  },
  {
    icon: FileCheck,
    title: "Legal & Documentation",
    desc: "Our legal team handles RERA verification, title clearance, agreement drafting, stamp duty, and registration. Complete peace of mind for every transaction.",
  },
  {
    icon: Calculator,
    title: "Home Loan Assistance",
    desc: "We partner with leading banks to help you get the best home loan rates. Pre-approval, documentation support, and EMI planning included.",
  },
  {
    icon: Landmark,
    title: "Commercial Real Estate",
    desc: "Office spaces, retail shops, showrooms, and warehouses. We cater to businesses looking for commercial properties across Indore.",
  },
  {
    icon: Shield,
    title: "Property Valuation",
    desc: "Get an accurate market valuation of your property by our certified experts. Essential for buying, selling, or loan purposes.",
  },
];

const Services = () => {
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
              <span className="text-primary-foreground">Our Services</span>
            </nav>
            <ScrollReveal>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight">
                Our <span className="text-gold-gradient">Services</span>
              </h1>
              <p className="text-primary-foreground/60 text-lg md:text-xl mt-4 max-w-2xl leading-relaxed">
                Comprehensive real estate solutions designed to make your property journey seamless, transparent, and rewarding.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Services Grid */}
        <section className="section-padding bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((s, i) => (
                <ScrollReveal key={s.title} delay={i * 0.08}>
                  <div className="card-elevated p-7 group h-full">
                    <div className="h-14 w-14 rounded-2xl gold-gradient flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
                      <s.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-foreground text-lg mb-2">{s.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding bg-muted">
          <div className="container mx-auto px-4 lg:px-8">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Our Process</span>
                <h2 className="section-title mt-3">How We Work</h2>
                <div className="divider-gold" />
                <p className="section-subtitle">A transparent, step-by-step approach to ensure your satisfaction</p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
              {[
                { step: "01", title: "Consultation", desc: "We understand your requirements, budget, and preferences in a free consultation call." },
                { step: "02", title: "Shortlisting", desc: "Our team curates a list of verified properties matching your criteria." },
                { step: "03", title: "Site Visits", desc: "Schedule free site visits with our relationship manager at your convenience." },
                { step: "04", title: "Closure & Support", desc: "From negotiation to registration, we handle everything until you get your keys." },
              ].map((s, i) => (
                <ScrollReveal key={s.step} delay={i * 0.1}>
                  <div className="text-center">
                    <span className="inline-flex h-16 w-16 rounded-2xl gold-gradient items-center justify-center font-heading font-extrabold text-primary text-xl shadow-md mx-auto">
                      {s.step}
                    </span>
                    <h3 className="font-heading font-bold text-foreground text-lg mt-5">{s.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-2">{s.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <ScrollReveal>
              <div className="navy-gradient rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-60 h-60 bg-secondary/10 rounded-full blur-[80px]" />
                <div className="relative z-10">
                  <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-primary-foreground leading-tight">
                    Need a Custom Solution?
                  </h2>
                  <p className="text-primary-foreground/50 text-lg mt-4 max-w-xl mx-auto">
                    Every property journey is unique. Talk to our experts for personalized guidance.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <a href="tel:+919876543210">
                      <button className="btn-gold px-8 py-3.5 rounded-xl text-sm inline-flex items-center gap-2 w-full sm:w-auto justify-center">
                        <Phone className="h-4 w-4" /> Free Consultation
                      </button>
                    </a>
                    <Link to="/contact" className="glass-card px-8 py-3.5 rounded-xl text-sm text-primary-foreground/80 inline-flex items-center gap-2 hover:bg-primary-foreground/10 transition-all justify-center">
                      Contact Us <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      <div className="lg:hidden h-28" />
    </div>
  );
};

export default Services;
