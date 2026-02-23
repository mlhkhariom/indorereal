import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const CTABanner = () => {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <ScrollReveal>
          <div className="navy-gradient rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-60 h-60 bg-secondary/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/10 rounded-full blur-[60px]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

            <div className="relative z-10">
              <span className="text-secondary font-semibold text-sm uppercase tracking-widest">Get Started Today</span>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mt-4 leading-tight text-balance">
                Ready to Find Your <br className="hidden md:block" />
                Perfect Property?
              </h2>
              <p className="text-primary-foreground/50 text-lg mt-4 max-w-xl mx-auto">
                Connect with our experts today. Whether buying, selling, or investing — we'll guide you every step of the way.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <a href="tel:+919876543210">
                  <button className="btn-gold px-10 py-4 rounded-xl text-base inline-flex items-center gap-2 w-full sm:w-auto justify-center">
                    <Phone className="h-5 w-5" /> Call Now — Free Consultation
                  </button>
                </a>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                  <button className="glass-card px-10 py-4 rounded-xl text-base text-primary-foreground/80 inline-flex items-center gap-2 hover:bg-primary-foreground/10 transition-all w-full sm:w-auto justify-center">
                    <MessageCircle className="h-5 w-5" /> Chat on WhatsApp <ArrowRight className="h-4 w-4" />
                  </button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs text-primary-foreground/40 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> RERA Registered
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> 500+ Verified Listings
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> No Hidden Charges
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Powered by MLHK Infotech
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTABanner;
