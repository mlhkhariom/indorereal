import { ShieldCheck, BadgeIndianRupee, Users, MapPinCheck } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Verified Properties", desc: "Every listing is verified by our expert team" },
  { icon: BadgeIndianRupee, title: "Best Price Guarantee", desc: "We ensure you get the best deal in the market" },
  { icon: Users, title: "Local Experts", desc: "Our team knows Indore inside and out" },
  { icon: MapPinCheck, title: "Free Site Visit", desc: "Schedule a free visit to any property" },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Why Choose <span className="text-secondary">Us?</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="text-center p-6 rounded-xl bg-card border border-border hover:border-secondary/50 hover:shadow-lg transition-all group"
            >
              <div className="h-14 w-14 mx-auto rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <f.icon className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
