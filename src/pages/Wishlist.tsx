import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import PageShell from "@/components/PageShell";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { useWishlist } from "@/hooks/useShortlist";

const Wishlist = () => {
  const { ids } = useWishlist();
  const { data = [], isLoading } = useProperties();
  const items = data.filter((p) => ids.includes(p.id));
  return (
    <PageShell title="My Wishlist" subtitle="Properties you saved on this device." seoTitle="My Wishlist | Indore Realty" seoDescription="Your saved properties in Indore." path="/wishlist">
      {!isLoading && items.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground/40" aria-hidden="true" />
          <p className="mt-4 text-muted-foreground">No saved properties yet. Tap the heart on any property to save it.</p>
          <Link to="/properties" className="btn-gold inline-block mt-6 px-6 py-3 rounded-xl text-sm">Browse Properties</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{items.map((p) => <PropertyCard key={p.id} property={p} />)}</div>
      )}
    </PageShell>
  );
};
export default Wishlist;
