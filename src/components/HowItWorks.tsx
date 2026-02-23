import ScrollReveal from "@/components/ScrollReveal";
import { Search, Calendar, FileText, Home } from "lucide-react";

const steps = [
  { icon: Search, step: "01", title: "Search & Discover", desc: "Browse our verified listings using smart filters to find properties that match your requirements." },
  { icon: Calendar, step: "02", title: "Schedule a Visit", desc: "Book a free site visit at your convenience. Our relationship manager will guide you through every detail." },
  { icon: FileText, step: "03", title: "Documentation", desc: "Our legal team handles all paperwork — RERA verification, agreement drafting, and registration support." },
  { icon: Home, step: "04", title: "Move In", desc: "Get your keys and step into your dream property. We continue to support you even after possession." },
];

const HowItWorks = () => {
  return (
    <section className="section-padding bg-muted relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Simple Process</span>
            <h2 className="section-title mt-3">
              How It Works
            </h2>
            <div className="divider-gold" />
            <p className="section-subtitle">
              Your property journey in four simple steps
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-px bg-gradient-to-r from-border via-secondary/30 to-border" />

          {steps.map((s, i) => (
            <ScrollReveal key={s.step} delay={i * 0.12}>
              <div className="text-center relative">
                {/* Step circle */}
                <div className="relative mx-auto mb-6">
                  <div className="h-[72px] w-[72px] mx-auto rounded-2xl bg-card border-2 border-border flex items-center justify-center relative z-10 shadow-md">
                    <s.icon className="h-7 w-7 text-secondary" />
                  </div>
                  <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full gold-gradient flex items-center justify-center text-xs font-heading font-bold text-primary z-20 shadow-sm">
                    {s.step}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-foreground text-lg">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mt-2 max-w-xs mx-auto">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
