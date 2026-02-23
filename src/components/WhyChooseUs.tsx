import { ShieldCheck, BadgeIndianRupee, Users, MapPinCheck, Headphones, FileCheck } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  { icon: ShieldCheck, title: "100% Verified", desc: "Every listing undergoes thorough verification by our expert field team before going live." },
  { icon: BadgeIndianRupee, title: "Best Price Guarantee", desc: "We negotiate on your behalf to ensure you get the most competitive deal in the market." },
  { icon: Users, title: "Local Market Experts", desc: "Our team has 8+ years of deep experience across every locality in Indore." },
  { icon: MapPinCheck, title: "Free Site Visits", desc: "Schedule unlimited free property visits with our dedicated relationship manager." },
  { icon: FileCheck, title: "Legal Assistance", desc: "Complete documentation support including RERA verification and legal due diligence." },
  { icon: Headphones, title: "Post-Sale Support", desc: "Our relationship doesn't end at possession. We provide ongoing support for all your needs." },
];

const WhyChooseUs = () => {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Why Indore Reality</span>
            <h2 className="section-title mt-3">
              Trusted by 1,200+ Families
            </h2>
            <div className="divider-gold" />
            <p className="section-subtitle">
              We go beyond just listing properties — we build lasting relationships with every client
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.08}>
              <div className="card-elevated p-7 group h-full">
                <div className="h-12 w-12 rounded-2xl gold-gradient flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-lg">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mt-2">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
