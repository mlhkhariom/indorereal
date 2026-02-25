import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Building, Banknote, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { LOCATIONS, PROPERTY_TYPES, BUDGET_RANGES } from "@/types/property";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { value: "500+", label: "Properties Listed" },
  { value: "1,200+", label: "Happy Families" },
  { value: "8+", label: "Years Experience" },
  { value: "15+", label: "Locations Covered" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (type) params.set("type", type);
    if (budget) params.set("budget", budget);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark/92 via-navy-dark/80 to-navy/70" />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }} />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-secondary/10 blur-[100px]" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-primary/20 blur-[120px]" />

      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-28 pb-16">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/30 bg-secondary/10 text-secondary text-sm font-medium backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              Indore Realty — #1 Trusted Platform
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-extrabold text-primary-foreground mt-8 leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Discover Premium
            <br />
            Properties in{" "}
            <span className="text-gold-gradient">Indore</span>
          </motion.h1>

          <motion.p
            className="text-primary-foreground/60 text-lg md:text-xl mt-6 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            From luxurious flats in Vijay Nagar to prime plots on Super Corridor —
            explore verified listings with transparent pricing and expert guidance.
          </motion.p>

          {/* Quick action buttons */}
          <motion.div
            className="flex flex-wrap gap-3 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <button
              onClick={() => navigate("/properties")}
              className="btn-gold px-7 py-3.5 rounded-xl text-sm inline-flex items-center gap-2"
            >
              Explore Properties <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="tel:+919876543210"
              className="glass-card px-7 py-3.5 rounded-xl text-sm text-primary-foreground/90 inline-flex items-center gap-2 hover:bg-primary-foreground/10 transition-all"
            >
              <Play className="h-4 w-4 text-secondary" /> Schedule a Free Visit
            </a>
          </motion.div>
        </div>

        {/* Search bar */}
        <motion.div
          className="mt-14 max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-3 shadow-xl border border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-12 rounded-xl bg-muted/50 pl-10 pr-4 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border-0 appearance-none cursor-pointer"
                >
                  <option value="">All Locations</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-12 rounded-xl bg-muted/50 pl-10 pr-4 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border-0 appearance-none cursor-pointer"
                >
                  <option value="">Property Type</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Banknote className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full h-12 rounded-xl bg-muted/50 pl-10 pr-4 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50 border-0 appearance-none cursor-pointer"
                >
                  <option value="">Budget Range</option>
                  {BUDGET_RANGES.map((b) => (
                    <option key={b.label} value={b.label}>{b.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="h-12 btn-gold rounded-xl font-heading font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" /> Search Properties
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
            >
              <p className="font-heading text-3xl md:text-4xl font-extrabold text-secondary">{stat.value}</p>
              <p className="text-primary-foreground/50 text-sm mt-1 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
