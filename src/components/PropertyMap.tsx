import { areaCoords } from "@/lib/areas";
import { MapPin, ExternalLink } from "lucide-react";

/** Lightweight OpenStreetMap embed (no API key, loads lazily). */
const PropertyMap = ({ location, lat, lng }: { location: string; lat?: number | null; lng?: number | null }) => {
  const [la, lo] = areaCoords(location, lat, lng);
  const d = lat && lng ? 0.006 : 0.02;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lo - d},${la - d},${lo + d},${la + d}&layer=mapnik&marker=${la},${lo}`;
  return (
    <div>
      <div className="rounded-xl overflow-hidden border border-border aspect-[16/9] bg-muted">
        <iframe title={`Map of ${location}`} src={src} loading="lazy" className="w-full h-full border-0" />
      </div>
      <a href={`https://www.google.com/maps/search/?api=1&query=${la},${lo}`} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm text-secondary font-medium mt-2 hover:underline">
        <MapPin className="h-4 w-4" aria-hidden="true" /> Open in Google Maps <ExternalLink className="h-3 w-3" aria-hidden="true" />
      </a>
    </div>
  );
};

export default PropertyMap;
