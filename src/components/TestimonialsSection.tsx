import ScrollReveal from "@/components/ScrollReveal";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Sharma",
    role: "Bought 3BHK in Vijay Nagar",
    text: "Indore Realty made our home-buying journey seamless. Their team was professional, transparent about pricing, and helped us find the perfect flat within our budget. Highly recommended!",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Invested in Super Corridor Plot",
    text: "I was looking for an investment plot and their team suggested Super Corridor at the right time. The value has already appreciated 30% in just 2 years. Excellent market knowledge!",
    rating: 5,
  },
  {
    name: "Amit Jain",
    role: "Purchased Villa in Rau",
    text: "From shortlisting to registration, they handled everything with utmost care. Their legal team ensured all documents were in order. A truly end-to-end experience that I'd recommend to anyone.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="section-padding navy-gradient relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
      <div className="absolute -top-20 right-20 w-60 h-60 bg-secondary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Client Stories</span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-primary-foreground mt-3 leading-tight">
              What Our Clients Say
            </h2>
            <div className="divider-gold" />
            <p className="text-primary-foreground/50 text-base md:text-lg mt-3 max-w-xl mx-auto">
              Real stories from real people who found their dream property with us
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.12}>
              <div className="glass-card rounded-2xl p-7 h-full flex flex-col relative">
                <Quote className="h-8 w-8 text-secondary/30 absolute top-5 right-5" />

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>

                <p className="text-primary-foreground/70 text-sm leading-relaxed flex-1 italic">
                  "{t.text}"
                </p>

                <div className="mt-6 pt-5 border-t border-primary-foreground/10 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full gold-gradient flex items-center justify-center font-heading font-bold text-primary text-sm">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-primary-foreground text-sm">{t.name}</p>
                    <p className="text-primary-foreground/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
