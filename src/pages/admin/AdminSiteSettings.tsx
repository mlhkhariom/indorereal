import AdminSEO, { SettingsGroup } from "./AdminSEO";
import { Phone, Share2, BarChart3 } from "lucide-react";

const groups: SettingsGroup[] = [
  {
    title: "Contact Details (used across the whole website)",
    icon: Phone,
    keys: [
      { key: "phone_number", label: "Phone Number", type: "input", help: "e.g. +91 98765 43210" },
      { key: "whatsapp_number", label: "WhatsApp Number", type: "input", help: "Country code + number, e.g. 919876543210" },
      { key: "company_email", label: "Email", type: "input" },
      { key: "company_address", label: "Office Address", type: "textarea" },
      { key: "business_hours", label: "Working Hours", type: "input", help: "e.g. Mon–Sat: 9:30 AM – 7:30 PM" },
    ],
  },
  {
    title: "Social Media Links",
    icon: Share2,
    keys: [
      { key: "social_facebook", label: "Facebook URL", type: "input" },
      { key: "social_instagram", label: "Instagram URL", type: "input" },
      { key: "social_youtube", label: "YouTube URL", type: "input" },
      { key: "social_linkedin", label: "LinkedIn URL", type: "input" },
    ],
  },
  {
    title: "Website Stats",
    icon: BarChart3,
    keys: [
      { key: "stat_properties", label: "Properties Listed", type: "input", help: "e.g. 500+" },
      { key: "stat_clients", label: "Happy Clients", type: "input", help: "e.g. 2000+" },
      { key: "stat_years", label: "Years of Experience", type: "input", help: "e.g. 12+" },
    ],
  },
];

const AdminSiteSettings = () => <AdminSEO groups={groups} heading="Site Settings" />;
export default AdminSiteSettings;
