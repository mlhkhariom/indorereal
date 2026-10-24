import { Crown, Cpu, Quote } from "lucide-react";

export const leaders = [
  {
    name: "Subhash Pawar",
    role: "Founder, CEO & Managing Director",
    initials: "SP",
    icon: Crown,
    desc: "Leads Indore Realty's vision, project partnerships and client relationships — committed to honest guidance and verified projects for every family.",
  },
  {
    name: "Hariom Vishwkarma",
    role: "Technical Admin · MLHK Infotech",
    link: "https://mlhk.in",
    initials: "HV",
    icon: Cpu,
    desc: "Manages the website, CRM and digital systems so every enquiry is tracked, answered and followed up on time.",
  },
];

const LeadershipSection = ({ dark = false }: { dark?: boolean }) => (
  <section className={`section-padding ${dark ? "navy-gradient" : "bg-muted/40"}`} aria-labelledby="leadership-heading">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Leadership</span>
        <h2 id="leadership-heading" className={`font-heading text-3xl md:text-4xl font-bold mt-3 ${dark ? "text-primary-foreground" : "text-foreground"}`}>
          The People Behind Indore Realty
        </h2>
        <div className="divider-gold" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-4xl mx-auto">
        {leaders.map((l) => (
          <article key={l.name} className={`relative rounded-2xl p-7 border ${dark ? "glass-card border-primary-foreground/10" : "bg-card border-border shadow-sm"} hover:-translate-y-1 transition-transform`}>
            <Quote className="absolute top-5 right-5 h-8 w-8 text-secondary/20" aria-hidden="true" />
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 rounded-2xl gold-gradient flex items-center justify-center font-heading font-bold text-primary text-xl shadow-lg">
                {l.initials}
              </div>
              <div className="min-w-0">
                <h3 className={`font-heading font-bold text-lg ${dark ? "text-primary-foreground" : "text-foreground"}`}>{l.name}</h3>
                <p className="text-secondary text-sm font-semibold inline-flex items-center gap-1.5">
                  <l.icon className="h-4 w-4" aria-hidden="true" /> {l.role}
                </p>
              </div>
            </div>
            <p className={`text-sm leading-relaxed mt-5 ${dark ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{l.desc}</p>
            {"link" in l && l.link && <a href={l.link} target="_blank" rel="noopener" className="inline-block mt-3 text-secondary text-sm font-semibold hover:underline">Visit MLHK Infotech — mlhk.in →</a>}
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default LeadershipSection;
