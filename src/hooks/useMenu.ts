import { useSiteSettings } from "@/hooks/useSiteSettings";

export interface MenuLink { label: string; path: string; }

export const DEFAULT_MENUS: Record<string, MenuLink[]> = {
  menu_header: [
    { label: "Home", path: "/" },
    { label: "Properties", path: "/properties" },
    { label: "About Us", path: "/about" },
    { label: "Our Services", path: "/services" },
    { label: "Post Property", path: "/post-property" },
    { label: "Gallery", path: "/gallery" },
    { label: "Blog", path: "/blog" },
    { label: "FAQ", path: "/faq" },
    { label: "Careers", path: "/careers" },
    { label: "EMI Calculator", path: "/emi-calculator" },
    { label: "Contact", path: "/contact" },
  ],
  menu_footer_quick: [
    { label: "Home", path: "/" },
    { label: "All Properties", path: "/properties" },
    { label: "Post Your Property", path: "/post-property" },
    { label: "Our Services", path: "/services" },
    { label: "About Us", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Gallery", path: "/gallery" },
    { label: "Contact", path: "/contact" },
  ],
  menu_footer_useful: [
    { label: "EMI Calculator", path: "/emi-calculator" },
    { label: "Compare Properties", path: "/compare" },
    { label: "My Wishlist", path: "/wishlist" },
    { label: "FAQ", path: "/faq" },
    { label: "Careers", path: "/careers" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms & Conditions", path: "/terms-conditions" },
  ],
};

export const parseMenu = (raw: string | undefined, key: string): MenuLink[] => {
  if (!raw) return DEFAULT_MENUS[key] || [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((l) => l && l.label && l.path) : DEFAULT_MENUS[key];
  } catch {
    return DEFAULT_MENUS[key] || [];
  }
};

/** Menu links editable from Admin → Menus (stored as JSON in site settings). */
export const useMenu = (key: keyof typeof DEFAULT_MENUS | string) => parseMenu(useSiteSettings()[key], key);
