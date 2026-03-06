export interface Property {
  id: string;
  slug: string;
  title: string;
  price: number;
  location: string;
  type: "Flat" | "Plot" | "House" | "Villa";
  bedrooms: number;
  area: number;
  area_unit: string;
  description: string | null;
  amenities: string[];
  images: string[];
  featured: boolean;
  status: "Sale" | "Rent";
  created_at?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  property_id: string;
  created_at: string;
}

export const LOCATIONS = [
  "Vijay Nagar",
  "Super Corridor",
  "Rau",
  "Bypass Road",
  "AB Road",
  "MR-10",
] as const;

export const PROPERTY_TYPES = ["Flat", "Plot", "House", "Villa"] as const;

export const BUDGET_RANGES = [
  { label: "Under ₹25L", min: 0, max: 2500000 },
  { label: "₹25L - ₹50L", min: 2500000, max: 5000000 },
  { label: "₹50L - ₹1Cr", min: 5000000, max: 10000000 },
  { label: "₹1Cr - ₹2Cr", min: 10000000, max: 20000000 },
  { label: "Above ₹2Cr", min: 20000000, max: Infinity },
] as const;

export const formatPrice = (price: number, status: string) => {
  if (status === "Rent") {
    return `₹${price.toLocaleString("en-IN")}/mo`;
  }
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} L`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
};
