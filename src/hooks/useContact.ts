import { useSiteSettings } from "@/hooks/useSiteSettings";

export const DEFAULT_CONTACT = {
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "info@indorerealty.in",
  address: "Vijay Nagar, Indore, Madhya Pradesh 452010",
};

/** Contact details editable from Admin → Site Settings. */
export const useContact = () => {
  const s = useSiteSettings();
  const phone = s.phone_number || DEFAULT_CONTACT.phone;
  const whatsapp = (s.whatsapp_number || DEFAULT_CONTACT.whatsapp).replace(/\D/g, "");
  const email = s.company_email || DEFAULT_CONTACT.email;
  return {
    phone,
    tel: `tel:${phone.replace(/[^\d+]/g, "")}`,
    whatsapp,
    wa: `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi, I am interested in a property in Indore")}`,
    email,
    mailto: `mailto:${email}`,
    address: s.company_address || DEFAULT_CONTACT.address,
    facebook: s.social_facebook || "",
    instagram: s.social_instagram || "",
    youtube: s.social_youtube || "",
    linkedin: s.social_linkedin || "",
    hours: s.business_hours || "Mon–Sat: 9:30 AM – 7:30 PM",
  };
};
