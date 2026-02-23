export interface Property {
  id: string;
  slug: string;
  title: string;
  price: number;
  location: string;
  type: "Flat" | "Plot" | "House" | "Villa";
  bedrooms: number;
  area: number;
  areaUnit: string;
  description: string;
  amenities: string[];
  images: string[];
  featured: boolean;
  status: "Sale" | "Rent";
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  propertyId: string;
  date: string;
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
