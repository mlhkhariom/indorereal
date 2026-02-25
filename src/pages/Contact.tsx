import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Home, ChevronRight, MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Our Office",
    lines: ["123 Business Park, Vijay Nagar", "Indore, Madhya Pradesh 452010"],
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+91 98765 43210", "+91 731 234 5678"],
    links: ["tel:+919876543210", "tel:+917312345678"],
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["info@indorerealty.in", "sales@indorerealty.in"],
    links: ["mailto:info@indorerealty.in", "mailto:sales@indorerealty.in"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Mon – Sat: 9:00 AM – 7:00 PM", "Sunday: 10:00 AM – 4:00 PM"],
  },
];

const Contact = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast({ title: "Please fill name and phone number", variant: "destructive" });
      return;
    }
    toast({ title: "Message sent successfully!", description: "Our team will get back to you within 24 hours." });
    setName(""); setPhone(""); setEmail(""); setSubject(""); setMessage("");
  };

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
              <span className="text-primary-foreground">Contact Us</span>
            </nav>
            <ScrollReveal>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight">
                Get in <span className="text-gold-gradient">Touch</span>
              </h1>
              <p className="text-primary-foreground/60 text-lg md:text-xl mt-4 max-w-2xl leading-relaxed">
                Have a question or want to schedule a property visit? Reach out to us — we're just a call or message away.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="section-padding bg-background relative overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, i) => (
                <ScrollReveal key={info.title} delay={i * 0.08}>
                  <div className="card-elevated p-7 text-center h-full">
                    <div className="h-14 w-14 rounded-2xl gold-gradient flex items-center justify-center mb-5 mx-auto shadow-md">
                      <info.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-foreground text-lg mb-3">{info.title}</h3>
                    {info.lines.map((line, j) => (
                      info.links?.[j] ? (
                        <a key={j} href={info.links[j]} className="block text-muted-foreground text-sm hover:text-secondary transition-colors leading-relaxed">
                          {line}
                        </a>
                      ) : (
                        <p key={j} className="text-muted-foreground text-sm leading-relaxed">{line}</p>
                      )
                    ))}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Form + Map */}
        <section className="section-padding bg-muted relative overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Form */}
              <ScrollReveal>
                <div className="card-elevated p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />
                  <h2 className="font-heading font-bold text-foreground text-2xl mt-1">Send Us a Message</h2>
                  <p className="text-muted-foreground text-sm mt-2 mb-6">Fill the form below and our team will respond within 24 hours.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input placeholder="Your Full Name *" value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-xl" />
                      <Input placeholder="Phone Number *" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12 rounded-xl" type="tel" />
                    </div>
                    <Input placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl" type="email" />
                    <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="h-12 rounded-xl" />
                    <Textarea placeholder="Your Message..." value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="rounded-xl resize-none" />
                    <button type="submit" className="w-full h-13 py-3.5 btn-gold rounded-xl text-sm flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" /> Send Message
                    </button>
                  </form>

                  <div className="flex gap-3 mt-5">
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1">
                      <button type="button" className="w-full h-11 rounded-xl border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/5 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                      </button>
                    </a>
                    <a href="tel:+919876543210" className="flex-1">
                      <button type="button" className="w-full h-11 rounded-xl border border-primary/20 text-primary hover:bg-primary/5 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                        <Phone className="h-4 w-4" /> Call Now
                      </button>
                    </a>
                  </div>
                </div>
              </ScrollReveal>

              {/* Map */}
              <ScrollReveal delay={0.15}>
                <div className="card-elevated overflow-hidden h-full min-h-[400px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.1!2d75.8800!3d22.7500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQ1JzAwLjAiTiA3NcKwNTInNDguMCJF!5e0!3m2!1sen!2sin!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "400px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Indore Realty Office Location"
                    className="rounded-2xl"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;
