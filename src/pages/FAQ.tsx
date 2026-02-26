import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Phone, MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    category: "General",
    items: [
      { q: "What is Indore Realty?", a: "Indore Realty is Indore's most trusted real estate platform. We offer verified property listings, expert guidance, and end-to-end support for buying, selling, renting, and investing in properties across Indore. We are an initiative of MLHK Infotech." },
      { q: "Is Indore Realty RERA registered?", a: "Yes, Indore Realty is fully RERA compliant. We only list RERA-registered projects and ensure complete transparency in every transaction." },
      { q: "What areas in Indore do you cover?", a: "We cover 15+ prime localities including Vijay Nagar, Super Corridor, Rau, Bypass Road, AB Road, MR-10, Nipania, Bhicholi Mardana, and more." },
      { q: "Do you charge any fees from buyers?", a: "No, our property search and consultation services are completely free for buyers. We earn our commission from the seller/developer side." },
    ],
  },
  {
    category: "Buying Property",
    items: [
      { q: "How do I buy a property through Indore Realty?", a: "Simply browse our listings, shortlist properties, and contact us. Our relationship manager will schedule free site visits, help with negotiations, and guide you through the entire documentation and registration process." },
      { q: "Are all listings verified?", a: "Yes, every property listed on Indore Realty undergoes thorough verification by our expert field team. We check ownership documents, RERA status, and physical condition before listing." },
      { q: "Do you help with home loans?", a: "Absolutely! We partner with leading banks like SBI, HDFC, ICICI, and Axis Bank to help you get the best home loan rates. We also assist with documentation and pre-approval." },
      { q: "What documents do I need to buy a property?", a: "You'll need Aadhaar Card, PAN Card, income proof, bank statements, and passport-size photographs. For home loans, additional documents like salary slips and IT returns are required." },
    ],
  },
  {
    category: "Selling & Renting",
    items: [
      { q: "How can I list my property for sale?", a: "Contact us through phone, WhatsApp, or our contact form. Our team will visit your property, conduct a valuation, and list it on our platform with professional photos and descriptions." },
      { q: "How long does it take to sell a property?", a: "The timeline varies based on location, pricing, and market conditions. On average, well-priced properties in prime locations sell within 30-90 days." },
      { q: "Do you handle rental properties?", a: "Yes, we help both landlords and tenants. We verify tenants, draft rental agreements, and ensure a smooth rental experience." },
    ],
  },
  {
    category: "Legal & Documentation",
    items: [
      { q: "Do you provide legal assistance?", a: "Yes, our in-house legal team handles title verification, RERA checks, agreement drafting, stamp duty calculation, and property registration support." },
      { q: "What is RERA and why is it important?", a: "RERA (Real Estate Regulatory Authority) is a government body that protects property buyers. RERA registration ensures the project is legally approved, timelines are followed, and your investment is secure." },
      { q: "Who bears the registration charges?", a: "Registration charges and stamp duty are typically borne by the buyer. In Madhya Pradesh, the stamp duty is usually 7.5% for males and 6% for females." },
    ],
  },
];

const FAQ = () => {
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
              <span className="text-primary-foreground">FAQ</span>
            </nav>
            <ScrollReveal>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight">
                Frequently Asked <span className="text-gold-gradient">Questions</span>
              </h1>
              <p className="text-primary-foreground/60 text-lg md:text-xl mt-4 max-w-2xl leading-relaxed">
                Find answers to common questions about buying, selling, and investing in Indore's real estate market.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="section-padding bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            {faqs.map((section, i) => (
              <ScrollReveal key={section.category} delay={i * 0.1}>
                <div className="mb-12">
                  <h2 className="font-heading font-bold text-foreground text-2xl mb-6 flex items-center gap-3">
                    <span className="h-8 w-1 rounded-full bg-secondary" />
                    {section.category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-3">
                    {section.items.map((faq, j) => (
                      <AccordionItem key={j} value={`${section.category}-${j}`} className="card-elevated px-6 border rounded-xl">
                        <AccordionTrigger className="font-heading font-semibold text-foreground text-[15px] text-left hover:no-underline py-5">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Still have questions CTA */}
        <section className="section-padding bg-muted">
          <div className="container mx-auto px-4 lg:px-8 text-center max-w-2xl">
            <ScrollReveal>
              <h2 className="section-title">Still Have Questions?</h2>
              <p className="section-subtitle">Our team is always ready to help. Reach out to us anytime.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <a href="tel:+919876543210">
                  <button className="btn-gold px-8 py-3.5 rounded-xl text-sm inline-flex items-center gap-2 w-full sm:w-auto justify-center">
                    <Phone className="h-4 w-4" /> Call Us Now
                  </button>
                </a>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                  <button className="px-8 py-3.5 rounded-xl border-2 border-primary text-primary font-heading font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all inline-flex items-center gap-2 w-full sm:w-auto justify-center">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </button>
                </a>
              </div>
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

export default FAQ;
