import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    toast({ title: "Enquiry sent!", description: "We'll get back to you shortly." });
    setName("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
      <h3 className="font-heading font-semibold text-lg text-card-foreground mb-4">
        Send Enquiry
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11"
        />
        <Input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-11"
          type="tel"
        />
        <Textarea
          placeholder="Message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
        <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-gold-light font-heading font-semibold">
          <Send className="h-4 w-4 mr-2" /> Send Enquiry
        </Button>
      </form>

      <div className="flex gap-2 mt-4">
        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="outline" className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 text-sm">
            <MessageCircle className="h-4 w-4 mr-1" /> WhatsApp
          </Button>
        </a>
        <a href="tel:+919876543210" className="flex-1">
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 text-sm">
            <Phone className="h-4 w-4 mr-1" /> Call Now
          </Button>
        </a>
      </div>
    </div>
  );
};

export default LeadForm;
