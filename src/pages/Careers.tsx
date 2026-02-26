import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { Home, ChevronRight, MapPin, Briefcase, Clock, Send, Users, TrendingUp, Award, Heart } from "lucide-react";

const openings = [
  { title: "Senior Sales Executive", location: "Indore", type: "Full-time", department: "Sales", experience: "3-5 years" },
  { title: "Digital Marketing Specialist", location: "Indore", type: "Full-time", department: "Marketing", experience: "2-4 years" },
  { title: "Property Consultant", location: "Indore", type: "Full-time", department: "Sales", experience: "1-3 years" },
  { title: "Content Writer (Real Estate)", location: "Remote / Indore", type: "Full-time", department: "Marketing", experience: "1-2 years" },
  { title: "Relationship Manager", location: "Indore", type: "Full-time", department: "Client Relations", experience: "2-4 years" },
  { title: "Web Developer (React)", location: "Indore", type: "Full-time", department: "Tech (MLHK Infotech)", experience: "2-5 years" },
];

const perks = [
  { icon: TrendingUp, title: "Growth Opportunities", desc: "Fast-track your career with real responsibility and mentorship." },
  { icon: Award, title: "Competitive Pay", desc: "Industry-best compensation with performance bonuses." },
  { icon: Users, title: "Collaborative Culture", desc: "Work with a passionate team that celebrates wins together." },
  { icon: Heart, title: "Work-Life Balance", desc: "Flexible hours, health benefits, and a supportive environment." },
];

const Careers = () => {
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
              <span className="text-primary-foreground">Careers</span>
            </nav>
            <ScrollReveal>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight">
                Join <span className="text-gold-gradient">Our Team</span>
              </h1>
              <p className="text-primary-foreground/60 text-lg md:text-xl mt-4 max-w-2xl leading-relaxed">
                Build your career with Indore's fastest-growing real estate platform. We're always looking for talented people who share our passion.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Perks */}
        <section className="section-padding bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Why Join Us</span>
                <h2 className="section-title mt-3">Perks & Benefits</h2>
                <div className="divider-gold" />
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
              {perks.map((p, i) => (
                <ScrollReveal key={p.title} delay={i * 0.08}>
                  <div className="card-elevated p-7 text-center group h-full">
                    <div className="h-14 w-14 rounded-2xl gold-gradient flex items-center justify-center mb-5 mx-auto group-hover:scale-110 transition-transform shadow-md">
                      <p.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-foreground text-lg">{p.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-2">{p.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="section-padding bg-muted">
          <div className="container mx-auto px-4 lg:px-8">
            <ScrollReveal>
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Open Positions</span>
                <h2 className="section-title mt-3">Current Openings</h2>
                <div className="divider-gold" />
              </div>
            </ScrollReveal>
            <div className="max-w-4xl mx-auto mt-14 space-y-4">
              {openings.map((job, i) => (
                <ScrollReveal key={job.title} delay={i * 0.08}>
                  <div className="card-elevated p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-heading font-bold text-foreground text-lg">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-secondary" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5 text-secondary" /> {job.type}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-secondary" /> {job.experience}</span>
                      </div>
                      <span className="inline-block mt-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
                        {job.department}
                      </span>
                    </div>
                    <a href={`mailto:careers@indorerealty.in?subject=Application for ${job.title}`}>
                      <button className="btn-gold px-6 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 whitespace-nowrap">
                        <Send className="h-4 w-4" /> Apply Now
                      </button>
                    </a>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal className="text-center mt-12">
              <p className="text-muted-foreground">
                Don't see a matching role? Send your resume to{" "}
                <a href="mailto:careers@indorerealty.in" className="text-secondary font-semibold hover:underline">
                  careers@indorerealty.in
                </a>
              </p>
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

export default Careers;
