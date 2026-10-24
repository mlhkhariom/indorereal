import { useMenu } from "@/hooks/useMenu";
import { useLocations } from "@/hooks/useLocations";
import { areaSlug } from "@/lib/areas";
import { useContact } from "@/hooks/useContact";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";

const Footer = () => {
  const contact = useContact();
  const quickLinks = useMenu("menu_footer_quick");
  const usefulLinks = useMenu("menu_footer_useful");
  const { data: locs = [] } = useLocations();
  return (
    <footer className="navy-gradient text-primary-foreground relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Top CTA strip */}
        <div className="py-8 border-b border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-xl font-bold">Ready to find your perfect property?</h3>
            <p className="text-primary-foreground/60 text-sm mt-1">Get expert guidance from Indore's #1 real estate team</p>
          </div>
          <Link to="/properties" className="btn-gold px-8 py-3 rounded-xl text-sm inline-flex items-center gap-2">
            Explore Properties <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 py-14">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src="/logo.png" alt="Indore Realty logo" width="48" height="48" loading="lazy" className="h-12 w-12 rounded-xl bg-card p-1 object-contain shadow-md" />
              <div>
                <span className="font-heading text-lg font-bold leading-none block">Indore Realty</span>
                <span className="text-[10px] text-primary-foreground/40 font-medium tracking-widest uppercase">
                  Premium Properties
                </span>
              </div>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Indore's most trusted real estate platform. Discover verified properties with transparent pricing and expert guidance.</p>
            <p className="text-primary-foreground/50 text-xs mt-3">Founder, CEO &amp; MD: <span className="text-secondary font-semibold">Subhash Pawar</span><br />Technical Admin: <span className="text-secondary font-semibold">Hariom Vishwkarma</span> (<a href="https://mlhk.in" target="_blank" rel="noopener" className="underline hover:text-secondary">MLHK Infotech</a>)
            </p>
            <div className="flex gap-3 mt-5">
              {(["facebook", "instagram", "youtube", "linkedin"] as const).filter((s) => contact[s]).map((s) => (
                <a key={s} href={contact[s]} target="_blank" rel="noopener noreferrer" aria-label={s} className="h-9 w-9 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center text-primary-foreground/50 hover:bg-secondary/20 hover:text-secondary hover:border-secondary/30 transition-all text-xs font-bold uppercase">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-secondary mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.path} className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors inline-flex items-center gap-1.5 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden="true" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-secondary mb-5">Useful Links</h4>
            <ul className="space-y-2.5">
              {usefulLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.path} className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors inline-flex items-center gap-1.5 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden="true" />
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-3">
                <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-secondary mb-3">Top Locations</h4>
                <ul className="space-y-2.5">
                  {(locs.length ? locs.slice(0, 5).map((l) => l.name) : ["Vijay Nagar", "Super Corridor", "Rau", "AB Road"]).map((loc) => (
                    <li key={loc}>
                      <Link to={`/area/${areaSlug(loc)}`} className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors inline-flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-secondary/60" aria-hidden="true" /> {loc}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-secondary mb-5">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/60">
                <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-secondary" aria-hidden="true" />
                </div>
                <span>{contact.address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/60">
                <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-secondary" aria-hidden="true" />
                </div>
                <div>
                  <a href={contact.tel} className="hover:text-secondary transition-colors block">{contact.phone}</a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/60">
                <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-secondary" aria-hidden="true" />
                </div>
                <a href={contact.mailto} className="hover:text-secondary transition-colors">{contact.email}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* MLHK Infotech Branding Bar */}
        <div className="border-t border-primary-foreground/10 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-primary-foreground/40">© {new Date().getFullYear()} Indore Realty. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary-foreground/40">Designed & Developed by</span>
              <a href="https://mlhk.in" target="_blank" rel="noopener" title="MLHK Infotech — Website, CRM &amp; IT Solutions" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20 hover:bg-secondary/20 transition-colors">
                <span className="h-5 w-5 rounded bg-secondary flex items-center justify-center text-[8px] font-bold text-secondary-foreground">M</span>
                <span className="text-secondary font-heading font-bold text-sm">MLHK Infotech</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
