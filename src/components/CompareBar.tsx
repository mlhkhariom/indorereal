import { Link, useLocation } from "react-router-dom";
import { GitCompare, X } from "lucide-react";
import { useCompare } from "@/hooks/useShortlist";

const CompareBar = () => {
  const { ids, clear } = useCompare();
  const { pathname } = useLocation();
  if (!ids.length || pathname.startsWith("/admin") || pathname === "/compare") return null;
  return (
    <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full bg-primary text-primary-foreground shadow-2xl pl-4 pr-1.5 py-1.5">
      <GitCompare className="h-4 w-4 text-secondary" aria-hidden="true" />
      <span className="text-sm font-medium whitespace-nowrap">{ids.length} selected</span>
      <Link to="/compare" className="btn-gold rounded-full px-4 py-1.5 text-sm">Compare</Link>
      <button aria-label="Clear compare list" onClick={clear} className="h-8 w-8 rounded-full hover:bg-primary-foreground/10 flex items-center justify-center"><X className="h-4 w-4" /></button>
    </div>
  );
};

export default CompareBar;
