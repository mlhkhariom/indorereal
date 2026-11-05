import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { initMetaPixel, setConsent, trackPageView, readConsent } from "@/lib/metaPixel";

const CookieBanner = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    initMetaPixel().then(({ showBanner }) => setOpen(showBanner));
    const reopen = () => setOpen(true);
    window.addEventListener("ir:cookie-settings", reopen);
    return () => window.removeEventListener("ir:cookie-settings", reopen);
  }, []);

  useEffect(() => { trackPageView(pathname); }, [pathname]);

  if (!open) return null;
  const current = readConsent()?.choice;
  const choose = async (c: "accepted" | "rejected") => { await setConsent(c); setOpen(false); };

  return (
    <div role="dialog" aria-label="Cookie settings" className="fixed bottom-4 inset-x-4 md:left-auto md:right-4 md:max-w-md z-[60] card-elevated p-5 bg-card text-card-foreground shadow-xl">
      <p className="text-sm leading-relaxed">
        We'd like to use advertising cookies (Meta Pixel) to measure which of our Facebook &amp; Instagram ads bring enquiries.
        This shares page visits and form-submission events with Meta. You can change this anytime from "Cookie settings" in our{" "}
        <Link to="/privacy-policy" className="underline">Privacy Policy</Link>.
      </p>
      {current && <p className="text-xs text-muted-foreground mt-2">Current choice: {current}</p>}
      <div className="flex gap-2 mt-4">
        <button onClick={() => choose("rejected")} className="flex-1 h-10 rounded-xl border border-border text-sm font-medium hover:bg-muted">Reject</button>
        <button onClick={() => choose("accepted")} className="flex-1 h-10 rounded-xl btn-gold text-sm">Accept</button>
      </div>
    </div>
  );
};

export default CookieBanner;
