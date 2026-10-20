/** Approximate map centres for Indore localities (used when a property has no exact pin). */
export const INDORE_CENTER: [number, number] = [22.7196, 75.8577];
const AREA_COORDS: Record<string, [number, number]> = {
  "vijay nagar": [22.7533, 75.8937],
  "super corridor": [22.7697, 75.8201],
  rau: [22.6412, 75.8106],
  "bypass road": [22.7421, 75.9259],
  "ab road": [22.7244, 75.8839],
  "mr-10": [22.7613, 75.8714],
  nipania: [22.7616, 75.9126],
  "bhicholi mardana": [22.7413, 75.9364],
  palasia: [22.7243, 75.8869],
  "rajendra nagar": [22.6886, 75.8312],
};
export const areaCoords = (location: string, lat?: number | null, lng?: number | null): [number, number] =>
  lat && lng ? [lat, lng] : AREA_COORDS[location.trim().toLowerCase()] || INDORE_CENTER;

export const areaSlug = (name: string) => encodeURIComponent(name.trim().toLowerCase().replace(/\s+/g, "-"));
export const areaFromSlug = (slug: string) => decodeURIComponent(slug).replace(/-/g, " ");
