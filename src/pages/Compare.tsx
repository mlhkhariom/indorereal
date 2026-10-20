import { Link } from "react-router-dom";
import { GitCompare, X } from "lucide-react";
import PageShell from "@/components/PageShell";
import { useProperties } from "@/hooks/useProperties";
import { useCompare } from "@/hooks/useShortlist";
import { formatPrice } from "@/types/property";

const Compare = () => {
  const { ids, toggle, clear } = useCompare();
  const { data = [], isLoading } = useProperties();
  const items = data.filter((p) => ids.includes(p.id));
  const rows: [string, (p: (typeof items)[number]) => React.ReactNode][] = [
    ["Price", (p) => <span className="font-bold text-secondary">{formatPrice(p.price, p.status)}</span>],
    ["Price / sq.ft", (p) => (p.status === "Sale" && p.area ? `₹${Math.round(p.price / p.area).toLocaleString("en-IN")}` : "—")],
    ["Location", (p) => p.location],
    ["Type", (p) => p.type],
    ["For", (p) => p.status],
    ["Bedrooms", (p) => (p.bedrooms ? `${p.bedrooms} BHK` : "—")],
    ["Area", (p) => `${p.area} ${p.area_unit}`],
    ["Amenities", (p) => <ul className="space-y-1">{p.amenities?.map((a) => <li key={a}>• {a}</li>)}</ul>],
  ];
  return (
    <PageShell title="Compare Properties" subtitle="See up to 3 properties side by side." seoTitle="Compare Properties | Indore Realty" seoDescription="Compare Indore properties side by side: price, area, amenities." path="/compare">
      {!isLoading && items.length === 0 ? (
        <div className="text-center py-16">
          <GitCompare className="h-12 w-12 mx-auto text-muted-foreground/40" aria-hidden="true" />
          <p className="mt-4 text-muted-foreground">Nothing to compare yet. Tap the compare icon on any property.</p>
          <Link to="/properties" className="btn-gold inline-block mt-6 px-6 py-3 rounded-xl text-sm">Browse Properties</Link>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-3"><button onClick={clear} className="text-sm text-muted-foreground hover:text-destructive">Clear all</button></div>
          <div className="overflow-x-auto rounded-2xl bg-card shadow-sm border border-border">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr>
                  <th className="w-36" />
                  {items.map((p) => (
                    <th key={p.id} className="p-4 align-top text-left font-normal">
                      <div className="relative">
                        <button aria-label="Remove" onClick={() => toggle(p.id)} className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-background shadow flex items-center justify-center z-10"><X className="h-4 w-4" /></button>
                        <img src={p.images?.[0]} alt={p.title} className="w-full aspect-video object-cover rounded-xl bg-muted" loading="lazy" />
                        <Link to={`/property/${p.slug}`} className="block font-heading font-semibold mt-2 hover:text-secondary">{p.title}</Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, fn]) => (
                  <tr key={label} className="border-t border-border">
                    <td className="p-4 font-semibold text-muted-foreground">{label}</td>
                    {items.map((p) => <td key={p.id} className="p-4 align-top">{fn(p)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </PageShell>
  );
};
export default Compare;
