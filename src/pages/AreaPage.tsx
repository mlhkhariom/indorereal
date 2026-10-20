import { useParams, Link } from "react-router-dom";
import PageShell from "@/components/PageShell";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import { useProperties } from "@/hooks/useProperties";
import { useLocations } from "@/hooks/useLocations";
import { areaFromSlug, areaSlug } from "@/lib/areas";

const AreaPage = () => {
  const { slug = "" } = useParams();
  const name = areaFromSlug(slug);
  const { data: props = [], isLoading } = useProperties();
  const { data: locs = [] } = useLocations();
  const loc = locs.find((l) => l.name.toLowerCase() === name.toLowerCase());
  const display = loc?.name || name.replace(/\b\w/g, (c) => c.toUpperCase());
  const items = props.filter((p) => p.location.toLowerCase() === name.toLowerCase());
  const prices = items.filter((p) => p.status === "Sale").map((p) => p.price);

  return (
    <PageShell title={`Properties in ${display}`} subtitle={loc?.description || `Verified flats, plots, houses and villas in ${display}, Indore.`}
      seoTitle={`Property in ${display}, Indore — Flats, Plots & Houses | Indore Realty`}
      seoDescription={`Buy or rent verified property in ${display}, Indore. ${items.length} listings with prices, photos and free site visits.`} path={`/area/${slug}`}>
      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 grid grid-cols-3 gap-3">
          {[["Listings", items.length], ["Starting", prices.length ? `₹${(Math.min(...prices) / 100000).toFixed(0)}L` : "—"], ["Types", new Set(items.map((p) => p.type)).size || "—"]].map(([k, v]) => (
            <div key={k as string} className="card-elevated p-4 text-center"><p className="text-xs text-muted-foreground">{k}</p><p className="font-heading text-2xl font-bold text-foreground">{v}</p></div>
          ))}
        </div>
        <div className="card-elevated p-3"><PropertyMap location={display} /></div>
      </div>
      {isLoading ? null : items.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{items.map((p) => <PropertyCard key={p.id} property={p} />)}</div>
      ) : (
        <p className="text-center text-muted-foreground py-10">No listings here right now. <Link to="/contact" className="text-secondary underline">Tell us what you need</Link> and we'll find it.</p>
      )}
      {locs.length > 1 && (
        <div className="mt-12">
          <h2 className="font-heading text-xl font-bold mb-4">Explore other areas</h2>
          <div className="flex flex-wrap gap-2">
            {locs.filter((l) => l.name !== display).map((l) => (
              <Link key={l.id} to={`/area/${areaSlug(l.name)}`} className="px-4 py-2 rounded-full bg-card border border-border text-sm hover:border-secondary hover:text-secondary">{l.name}</Link>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
};
export default AreaPage;
