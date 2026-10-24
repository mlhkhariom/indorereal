import CmsPage from "@/components/CmsPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import SEOHead from "@/components/SEOHead";
import LeadershipSection, { leaders } from "@/components/LeadershipSection";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Target, Eye, Heart, Award, Users, Building, MapPin, Clock, ShieldCheck, Handshake } from "lucide-react";

const stats = [
  { value: "2", label: "Live Projects" },
  { value: "100+", label: "Flats on Offer" },
  { value: "8+", label: "Years Experience" },
  { value: "15+", label: "Locations Covered" },
  { value: "50+", label: "Expert Team" },
  { value: "₹0", label: "Brokerage for Buyers" },
];

const team = leaders;

const values = [
  { icon: ShieldCheck, title: "Transparency", desc: "No hidden charges, no surprises. Every detail upfront." },
  { icon: Handshake, title: "Trust", desc: "RERA registered with 100% verified listings only." },
  { icon: Heart, title: "Client First", desc: "Your dream property is our mission. Period." },
  { icon: Award, title: "Excellence", desc: "Setting the benchmark for real estate services in Indore." },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="About Indore Realty — Indore's Trusted Real Estate Partner" description="Learn about Indore Realty — Indore real estate partner led by Founder & CEO Subhash Pawar — verified new projects like Prabhu Krishna Embrace and Rudra Palace with honest pricing." keywords="about Indore Realty, real estate agency Indore, property dealer Indore, trusted real estate" canonical="https://indorerealty.in/about" />
      <Header />
      <main id="main" className="outline-none flex-1">
        {/* Hero */}
        <section className="navy-gradient pt-28 pb-16 relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-secondary/10 blur-[100px]" />
          <div className="container mx-auto px-4 lg:px-8 relative">
            <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/50 mb-6">
              <Link to="/" className="hover:text-secondary transition-colors flex items-center gap-1">
                <Home className="h-3.5 w-3.5" aria-hidden="true" /> Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="text-primary-foreground">About Us</span>
            </nav>
            <ScrollReveal>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight">
                About <span className="text-gold-gradient">Indore Realty</span>
              </h1>
              <p className="text-primary-foreground/60 text-lg md:text-xl mt-4 max-w-2xl leading-relaxed">
                Indore's most trusted real estate partner — helping families find their perfect home with transparency, expertise, and care.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Story */}
        <section className="section-padding bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] -translate-y-1/2" />
          <div className="container mx-auto px-4 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              <ScrollReveal>
                <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Our Story</span>
                <h2 className="section-title mt-3">Building Dreams,<br />One Property at a Time</h2>
                <div className="divider-gold !mx-0 !ml-0" />
                <div className="space-y-4 mt-6 text-muted-foreground leading-relaxed">
                  <p>
                    Founded by Subhash Pawar (Founder, CEO & MD), Indore Realty started with a simple vision — to bring transparency and trust to Indore's real estate market. What began as a small team of passionate real estate enthusiasts has grown into the city's most trusted property platform.
                  </p>
                  <p>
                    Today we represent carefully chosen projects such as Prabhu Krishna Embrace and Rudra Palace (Pulak City), with complete brochures, floor plans and price lists shared upfront. Our commitment to 100% verified listings, fair pricing, and end-to-end support sets us apart.
                  </p>
                  <p>
                    As an <strong className="text-foreground">MLHK Infotech</strong> initiative, we combine traditional real estate expertise with modern technology to deliver an unmatched property discovery experience.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, i) => (
                    <div key={stat.label} className="card-elevated p-6 text-center">
                      <p className="font-heading text-3xl md:text-4xl font-extrabold text-gold-gradient">{stat.value}</p>
                      <p className="text-muted-foreground text-sm mt-1 font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding bg-muted relative overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-secondary font-semibold text-sm uppercase tracking-widest">What Drives Us</span>
                <h2 className="section-title mt-3">Mission & Vision</h2>
                <div className="divider-gold" />
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14 max-w-4xl mx-auto">
              <ScrollReveal>
                <div className="card-elevated p-8 h-full">
                  <div className="h-14 w-14 rounded-2xl gold-gradient flex items-center justify-center mb-5 shadow-md">
                    <Target className="h-7 w-7 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground text-xl mb-3">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To simplify property buying, selling, and investing in Indore by offering verified listings, transparent pricing, and expert guidance — making real estate accessible to every family.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <div className="card-elevated p-8 h-full">
                  <div className="h-14 w-14 rounded-2xl gold-gradient flex items-center justify-center mb-5 shadow-md">
                    <Eye className="h-7 w-7 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground text-xl mb-3">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To become Central India's most trusted real estate platform — setting industry benchmarks in customer satisfaction, verified listings, and ethical business practices.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section-padding bg-background relative overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Our Foundation</span>
                <h2 className="section-title mt-3">Core Values</h2>
                <div className="divider-gold" />
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-14 max-w-3xl mx-auto">
              {values.map((v, i) => (
                <ScrollReveal key={v.title} delay={i * 0.08}>
                  <div className="card-elevated p-7 text-center group h-full">
                    <div className="h-14 w-14 rounded-2xl gold-gradient flex items-center justify-center mb-5 mx-auto group-hover:scale-110 transition-transform shadow-md">
                      <v.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-foreground text-lg">{v.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-2">{v.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section-padding navy-gradient relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
          <div className="absolute -top-20 right-20 w-60 h-60 bg-secondary/10 rounded-full blur-[100px]" />
          <div className="container mx-auto px-4 lg:px-8 relative">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-secondary font-semibold text-sm uppercase tracking-widest">The People Behind</span>
                <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-primary-foreground mt-3 leading-tight">
                  Meet Our Leadership
                </h2>
                <div className="divider-gold" />
                <p className="text-primary-foreground/50 text-base md:text-lg mt-3 max-w-xl mx-auto">
                  Experienced professionals dedicated to making your property journey seamless
                </p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-14 max-w-3xl mx-auto">
              {team.map((member, i) => (
                <ScrollReveal key={member.name} delay={i * 0.1}>
                  <div className="glass-card rounded-2xl p-7 text-center">
                    <div className="h-20 w-20 rounded-full gold-gradient flex items-center justify-center font-heading font-bold text-primary text-2xl mx-auto shadow-lg">
                      {member.initials}
                    </div>
                    <h3 className="font-heading font-bold text-primary-foreground text-lg mt-5">{member.name}</h3>
                    <p className="text-secondary text-sm font-semibold mt-1">{member.role}</p>
                    <p className="text-primary-foreground/50 text-sm mt-2">{member.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-background">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="section-title">Ready to Start Your Journey?</h2>
              <p className="section-subtitle">Let Indore Realty help you find the perfect property.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <Link to="/properties" className="btn-gold px-10 py-4 rounded-xl text-sm inline-flex items-center gap-2 justify-center">
                  <Building className="h-5 w-5" aria-hidden="true" /> Browse Properties
                </Link>
                <Link to="/contact" className="px-10 py-4 rounded-xl border-2 border-primary text-primary font-heading font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all inline-flex items-center gap-2 justify-center">
                  <MapPin className="h-5 w-5" aria-hidden="true" /> Contact Us
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

const AboutPage = () => <CmsPage slug="about"><About /></CmsPage>;
export default AboutPage;
