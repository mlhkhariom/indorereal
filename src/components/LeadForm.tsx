import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, MessageCircle, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LeadFormProps {
  propertyTitle?: string;
}

const LeadForm = ({ propertyTitle }: LeadFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    propertyTitle ? `I'm interested in: ${propertyTitle}` : ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast({ title: "Please fill in your name and phone number", variant: "destructive" });
      return;
    }
    toast({ title: "Enquiry sent successfully!", description: "Our team will contact you within 30 minutes." });
    setName("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="card-elevated p-6 relative overflow-hidden">
      {/* Gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />

      <h3 className="font-heading font-bold text-lg text-card-foreground mb-1 mt-1">
        Interested in this property?
      </h3>
      <p className="text-muted-foreground text-sm mb-5">Fill the form & get a callback in 30 mins</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Your Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 rounded-xl"
        />
        <Input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-11 rounded-xl"
          type="tel"
        />
        <Textarea
          placeholder="Message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="rounded-xl resize-none"
        />
        <button type="submit" className="w-full h-12 btn-gold rounded-xl text-sm flex items-center justify-center gap-2">
          <Send className="h-4 w-4" /> Send Enquiry
        </button>
      </form>

      <div className="flex gap-2 mt-4">
        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1">
          <button type="button" className="w-full h-10 rounded-xl border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/5 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </button>
        </a>
        <a href="tel:+919876543210" className="flex-1">
          <button type="button" className="w-full h-10 rounded-xl border border-primary/20 text-primary hover:bg-primary/5 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors">
            <Phone className="h-4 w-4" /> Call Now
          </button>
        </a>
      </div>
    </div>
  );
};

export default LeadForm;
