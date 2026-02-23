import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTABanner = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
          Looking to Buy or Sell Property?
        </h2>
        <p className="text-primary-foreground/70 text-lg mb-8 max-w-xl mx-auto">
          Contact us today and let our experts help you find the perfect deal in Indore.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+919876543210">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-gold-light font-heading font-semibold text-base px-8">
              <Phone className="h-5 w-5 mr-2" /> Call Now
            </Button>
          </a>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-heading text-base px-8">
              <MessageCircle className="h-5 w-5 mr-2" /> WhatsApp Us
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
