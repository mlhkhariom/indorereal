import { Link } from "react-router-dom";
import { Building2, MapPin, IndianRupee } from "lucide-react";

const projects = [
  {
    name: "Prabhu Krishna Embrace",
    to: "/projects/prabhu-krishna-embrace",
    text: "Premium 2 & 3 BHK flats (1360–1925 sq.ft) in a G+6 tower with 48 homes, rooftop clubhouse, gym, indoor games and 20+ amenities.",
  },
  {
    name: "Rudra Palace, Pulak City",
    to: "/projects/rudra-palace-pulak-city",
    text: "Affordable 1 & 2 BHK flats (525–1120 sq.ft) near Silicon City at ₹4600/sq.ft — starting ₹24.15 Lakh, with PMAY subsidy eligibility.",
  },
];

const HomeSeoContent = () => (
  <section className="section-padding bg-background" aria-labelledby="home-seo-heading">
    <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
      <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Buy a Flat in Indore</span>
      <h2 id="home-seo-heading" className="section-title mt-3 text-left">
        New Flats &amp; Residential Projects in Indore
      </h2>
      <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
        <p>
          Looking for a <strong className="text-foreground">1 BHK, 2 BHK or 3 BHK flat in Indore</strong>? Indore Realty, led by
          Founder &amp; CEO Subhash Pawar, helps home buyers and investors choose verified new residential projects with complete
          brochures, floor plans and price lists shared upfront — no hidden surprises.
        </p>
        <p>
          Indore is one of India's cleanest and fastest-growing cities, with new homes coming up around Silicon City, Rau,
          Super Corridor and the Ring Road. Our team guides you through site visits, home loan options, EMI planning, registry and
          possession so buying your home stays simple.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-5 mt-8">
        {projects.map((p) => (
          <Link key={p.to} to={p.to} className="group rounded-2xl border border-border bg-card p-6 hover:border-secondary/50 hover:-translate-y-1 transition-all">
            <h3 className="font-heading font-bold text-lg text-foreground inline-flex items-center gap-2">
              <Building2 className="h-5 w-5 text-secondary" aria-hidden="true" /> {p.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.text}</p>
            <span className="text-secondary text-sm font-semibold mt-3 inline-block group-hover:underline">View floor plans &amp; price →</span>
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-8 text-sm">
        <Link to="/projects" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-secondary/20 transition-colors"><Building2 className="h-4 w-4" aria-hidden="true" /> All New Projects</Link>
        <Link to="/emi-calculator" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-secondary/20 transition-colors"><IndianRupee className="h-4 w-4" aria-hidden="true" /> Home Loan EMI Calculator</Link>
        <Link to="/blog" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-secondary/20 transition-colors"><MapPin className="h-4 w-4" aria-hidden="true" /> Indore Area Guides</Link>
      </div>
    </div>
  </section>
);

export default HomeSeoContent;
