import { lazy, Suspense, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
const Lightbox = lazy(() => import("yet-another-react-lightbox"));
import "yet-another-react-lightbox/styles.css";
import { Check, Phone, Download, MapPin, CheckCircle2, Circle, Star, Building2, Calendar, Ruler, Layers, BadgeCheck, Home, Dumbbell, Trees, BedDouble, Cctv, Zap, ShieldCheck, PhoneCall, Droplets, Flame, Car, Sun, AirVent, ArrowUpDown, Waves, Baby, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import EnquiryWidget from "@/components/EnquiryWidget";
import { useProperties } from "@/hooks/useProperties";
import { useQuery } from "@tanstack/react-query";
import { useContact } from "@/hooks/useContact";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Block, youtubeId } from "@/lib/builder";

const BG: Record<string, string> = {
  light: "bg-background text-foreground",
  muted: "bg-muted/50 text-foreground",
  dark: "navy-gradient text-primary-foreground",
  gold: "bg-secondary text-secondary-foreground",
};
const Wrap = ({ b, children, id }: { b: Block; children: React.ReactNode; id?: string }) => (
  <section id={id} className={`${BG[b.bg || "light"]} py-14 md:py-20`}><div className="container mx-auto px-4 lg:px-8">{children}</div></section>
);
const H2 = ({ children }: { children: React.ReactNode }) => children ? <h2 className="font-heading text-2xl md:text-4xl font-bold mb-8 text-center">{children}</h2> : null;
const html = (s: string) => ({ __html: DOMPurify.sanitize(s || "") });

// Icon mapping for amenities - extended regex + exact names + custom icon support
const AMENITY_ICON_MAP: Record<string, any> = {
  "gym": Dumbbell, "fitness": Dumbbell, "fitness centre": Dumbbell,
  "garden": Trees, "green": Trees, "landscaped garden": Trees, "terrace garden": Trees,
  "servant quarter": BedDouble, "driver room": BedDouble, "servant quarters": BedDouble,
  "cctv": Cctv, "camera": Cctv, "security cabin": Cctv,
  "power backup": Zap, "generator": Zap, "inverter": Zap,
  "security": ShieldCheck, "guard": ShieldCheck, "24x7 security": ShieldCheck,
  "intercom": PhoneCall, "epbx": PhoneCall, "intercom system": PhoneCall,
  "water": Droplets, "narmada": Droplets, "water supply": Droplets,
  "fire": Flame, "fire safety": Flame, "fire fighting": Flame,
  "parking": Car, "car parking": Car, "ev charging": Car, "covered parking": Car,
  "gas": Flame, "gas pipeline": Flame, "png": Flame,
  "solar": Sun, "solar panels": Sun,
  "ac": AirVent, "air conditioning": AirVent, "ac piping": AirVent,
  "lift": ArrowUpDown, "elevator": ArrowUpDown, "2 branded lifts": ArrowUpDown,
  "pool": Waves, "swimming pool": Waves, "swim": Waves,
  "club": Building2, "clubhouse": Building2, "club lounge": Building2,
  "kid": Baby, "play": Baby, "kids": Baby, "kids play area": Baby, "children play": Baby,
  "temple": Building2, "community hall": Building2, "games hall": Building2, "indoor games": Building2,
  "swimming": Waves, "jogging": Trees, "walking track": Trees,
};
const amenityIcon = (name: string) => {
  const key = (name || "").toLowerCase().trim();
  return AMENITY_ICON_MAP[key] || AMENITY_ICON_MAP[key.split(" ")[0]] || Check;
};
const Ph = ({ label }: { label: string }) => (
  <div className="aspect-[4/3] w-full rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
    {label}
  </div>
);

/** Lead form shared by the Enquiry and Brochure blocks — writes into CRM enquiries. */
const LeadCapture = ({ pageTitle, button, source, onDone, compact }: {
  pageTitle: string; button: string; source: string; onDone?: () => void; compact?: boolean;
}) => (
  <EnquiryWidget pageTitle={pageTitle} button={button} source={source} compact={compact} prefill={undefined} />
);

const BlockView = ({ b, pageTitle, kind }: { b: Block; pageTitle: string; kind: "page" | "project" }) => {
  const d = b.data;
  const { phone, tel } = useContact();
  const [lb, setLb] = useState(-1);
  const needsProperties = b.type === "properties";
  const { data: allProps } = useProperties({ enabled: needsProperties });
  const { data: projects = [] } = useQuery({
    queryKey: ["builder_projects", "similar", pageTitle],
    enabled: b.type === "similar_projects",
    queryFn: async () => {
      const { data, error } = await supabase.from("builder_pages").select("id,slug,title,meta").eq("kind", "project").eq("status", "published").neq("title", pageTitle).limit(24);
      if (error) throw error;
      return data || [];
    },
  });
  const [emi, setEmi] = useState({ amount: Number(d.amount) || 5000000, rate: 8.5, years: 20 });
  switch (b.type) {
    case "hero": {
      const h = d.height === "full" ? "min-h-[100svh]" : d.height === "medium" ? "min-h-[50vh]" : "min-h-[75vh]";
      const overlayLevel = d.overlay === "0" ? "" : d.overlay === "30" ? "bg-primary/30" : d.overlay === "50" ? "bg-primary/50" : "bg-primary/70";
      const alignClass = d.align === "left" ? "text-left" : "text-center";
      return (
        <section className={`relative ${h} flex items-center navy-gradient text-primary-foreground overflow-hidden`}>
          {d.video ? <video src={d.video} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
            : d.image ? <img src={d.image} alt={d.heading || pageTitle || ""} loading="eager" fetchPriority="high" decoding="async" className="absolute inset-0 w-full h-full object-cover" /> : null}
          <div className={`absolute inset-0 ${overlayLevel}`} />
          <div className={`relative container mx-auto px-4 lg:px-8 pt-28 pb-16 ${alignClass}`}>
            {d.eyebrow && <p className="text-secondary font-semibold tracking-widest uppercase text-xs mb-3">{d.eyebrow}</p>}
            <h1 className="font-heading text-3xl md:text-6xl font-bold max-w-3xl leading-tight">{d.heading}</h1>
            {d.subheading && <p className={`mt-4 text-lg text-primary-foreground/80 max-w-2xl ${d.align === "left" ? "" : "mx-auto"}`}>{d.subheading}</p>}
            <div className={`mt-8 flex flex-wrap gap-3 ${d.align === "center" ? "justify-center" : "justify-start"}`}>
              {d.btn1 && <Button asChild size="lg" className="btn-gold"><a href={d.btn1Link || "#"}>{d.btn1}</a></Button>}
              {d.btn2 && <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"><a href={d.btn2Link || "#"}>{d.btn2}</a></Button>}
            </div>
          </div>
        </section>
      );
    }
    case "text":
      return <Wrap b={b}><div className={`max-w-3xl mx-auto ${d.align === "center" ? "text-center" : ""}`}>{d.heading && <h2 className="font-heading text-2xl md:text-4xl font-bold mb-5">{d.heading}</h2>}
        <div className={`prose max-w-none prose-headings:font-heading ${b.bg === "dark" ? "prose-invert" : ""}`} dangerouslySetInnerHTML={html(d.html)} /></div></Wrap>;
    case "image":
      return <Wrap b={b}><figure className="max-w-5xl mx-auto">{d.src ? <img src={d.src} alt={d.alt || ""} loading="lazy" className="w-full rounded-2xl shadow-lg" /> : <Ph label="Add an image" />}
        {d.caption && <figcaption className="text-center text-sm opacity-70 mt-3">{d.caption}</figcaption>}</figure></Wrap>;
    case "gallery": {
      const imgs: string[] = d.images || [];
      return <Wrap b={b}><H2>{d.heading}</H2>
        {imgs.length ? <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{imgs.map((s, i) => (
          <button key={i} type="button" onClick={() => setLb(i)} aria-label={`Open photo ${i + 1}`} className={`overflow-hidden rounded-xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
            <img src={s} alt={`${pageTitle || "Project"} – ${d.heading || "photo"} ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover aspect-square bg-muted hover:scale-105 transition-transform" /></button>))}</div> : <Ph label="Add photos" />}
        <Suspense fallback={null}><Lightbox open={lb >= 0} index={lb} close={() => setLb(-1)} slides={imgs.map((src) => ({ src }))} /></Suspense></Wrap>;
    }
    case "split":
      return <Wrap b={b}><div className={`grid md:grid-cols-2 gap-10 items-center ${d.side === "right" ? "md:[&>*:first-child]:order-2" : ""}`}>
        {d.image ? <img src={d.image} alt={`${d.heading || ""}${pageTitle ? " – " + pageTitle : ""}`} loading="lazy" decoding="async" className="w-full rounded-2xl shadow-lg aspect-[4/3] object-cover bg-muted" /> : <Ph label="Add an image" />}
        <div><h2 className="font-heading text-2xl md:text-4xl font-bold mb-4">{d.heading}</h2>
          <div className={`prose max-w-none ${b.bg === "dark" ? "prose-invert" : ""}`} dangerouslySetInnerHTML={html(d.html)} />
          {d.btn && <Button asChild className="btn-gold mt-6"><a href={d.btnLink || "#"}>{d.btn}</a></Button>}</div></div></Wrap>;
    case "stats":
      return <Wrap b={b}><div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">{(d.items || []).map((s: any, i: number) => (
        <div key={i}><p className={`font-heading text-3xl md:text-5xl font-bold ${b.bg === "gold" ? "" : "text-secondary"}`}>{s.value}</p><p className="mt-1 text-sm opacity-80">{s.label}</p></div>))}</div></Wrap>;
    case "cta":
      return <Wrap b={{ ...b, bg: b.bg === "light" ? "dark" : b.bg }}><div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div><h2 className="font-heading text-2xl md:text-3xl font-bold">{d.heading}</h2>{d.text && <p className="opacity-80 mt-2">{d.text}</p>}</div>
        <div className="flex flex-wrap gap-3 justify-center">{d.btn && <Button asChild size="lg" className="btn-gold"><a href={d.btnLink || "#"}>{d.btn}</a></Button>}
          {d.showPhone !== "no" && <Button asChild size="lg" variant="outline" className="bg-transparent border-current"><a href={tel}><Phone className="h-4 w-4 mr-2" aria-hidden="true" />{phone}</a></Button>}</div></div></Wrap>;
    case "faq":
      return <Wrap b={b}><div className="max-w-3xl mx-auto"><H2>{d.heading}</H2><Accordion type="single" collapsible>{(d.items || []).map((f: any, i: number) => (
        <AccordionItem key={i} value={String(i)}><AccordionTrigger className="text-left">{f.q}</AccordionTrigger><AccordionContent className="opacity-80">{f.a}</AccordionContent></AccordionItem>))}</Accordion></div></Wrap>;
    case "testimonials":
      return <Wrap b={b}><H2>{d.heading}</H2><div className="grid md:grid-cols-3 gap-5">{(d.items || []).map((r: any, i: number) => (
        <figure key={i} className="rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-sm"><div className="flex gap-0.5 text-secondary mb-3" aria-label="5 stars">{[...Array(5)].map((_, k) => <Star key={k} className="h-4 w-4 fill-current" aria-hidden="true" />)}</div>
          <blockquote className="text-sm leading-relaxed">“{r.text}”</blockquote><figcaption className="mt-4 font-semibold">{r.name}<span className="block text-xs font-normal text-muted-foreground">{r.role}</span></figcaption></figure>))}</div></Wrap>;
    case "spacer": {
      const s = d.size === "small" ? "h-6" : d.size === "large" ? "h-24" : "h-12";
      return <div className={`${BG[b.bg || "light"]} ${s} flex items-center`}>{d.line === "yes" && <hr className="container mx-auto border-border" />}</div>;
    }
    case "video": {
      const id = youtubeId(d.url || "");
      const file = !id && /\.(mp4|webm|mov)(\?|$)/i.test(d.url || "") || (d.url || "").includes("/__l5e/");
      const isLovableAsset = (d.url || "").includes("/__l5e/");
      return <Wrap b={b}><H2>{d.heading}</H2><div className="max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden bg-muted shadow-xl">
        {id ? <iframe className="w-full h-full" src={`https://www.youtube-nocookie.com/embed/${id}`} title={d.heading || "Video"} loading="lazy" allow="autoplay; encrypted-media" allowFullScreen />
          : file ? <video className="w-full h-full object-contain bg-primary" src={d.url} poster={d.poster || undefined} controls preload="none" playsInline loop={d.loop === "yes"} autoPlay={d.autoplay === "yes"} muted={d.autoplay === "yes"} />
          : <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Paste a YouTube or video link</div>}</div></Wrap>;
    }
    case "facts":
      return <section className={`${BG[b.bg || "light"]} py-8`}><div className="container mx-auto px-4 lg:px-8"><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">{(d.items || []).map((f: any, i: number) => (
        <div key={i} className="rounded-2xl border border-secondary/30 bg-card text-card-foreground p-4 text-center shadow-sm"><p className="font-heading text-2xl md:text-3xl font-bold text-secondary">{f.value}</p><p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{f.label}</p></div>))}</div></div></section>;
    case "units":
      return <Wrap b={b}><H2>{d.heading}</H2>{d.text && <p className="text-center max-w-2xl mx-auto -mt-4 mb-8 opacity-80">{d.text}</p>}
        <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">{(d.items || []).map((u: any, i: number) => (
          <div key={i} className="relative rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-sm hover:shadow-xl transition-shadow overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-1 bg-secondary" aria-hidden="true" />
            <div className="flex items-center gap-3"><span className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center"><Home className="h-6 w-6" aria-hidden="true" /></span>
              <h3 className="font-heading text-2xl font-bold">{u.type}</h3></div>
            <p className="mt-4 text-sm text-muted-foreground">Super area</p>
            <p className="font-semibold text-lg flex items-center gap-2"><Ruler className="h-4 w-4 text-secondary" aria-hidden="true" />{u.sizes}</p>
            {u.note && <p className="mt-2 text-sm text-muted-foreground">{u.note}</p>}
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4">{u.price ? <span className="font-bold text-secondary text-lg">{u.price}</span> : <span className="text-sm text-muted-foreground">Price on request</span>}
              <Button asChild size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90"><a href="#enquiry">Get price</a></Button></div>
          </div>))}</div></Wrap>;
    case "enquiry":
      return <Wrap b={b} id="enquiry"><div className="max-w-xl mx-auto rounded-2xl bg-card text-card-foreground border border-border shadow-xl p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold text-center">{d.heading}</h2>{d.text && <p className="text-center text-muted-foreground text-sm mt-2 mb-5">{d.text}</p>}
        <EnquiryWidget pageTitle={pageTitle} button={d.button || "Submit"} source={kind === "project" ? "builder_project" : "builder_page"} /></div></Wrap>;
    case "overview": {
      const rows = [[Building2, "Developer", d.builder], [BadgeCheck, "RERA No.", d.rera], [Calendar, "Possession", d.possession], [Layers, "Configuration", d.config], [Ruler, "Sizes", d.area], [Home, "Total Units", d.units], [MapPin, "Land Area", d.land], [CheckCircle2, "Status", d.status]].filter((r: any) => r[2]);
      return <Wrap b={b}><H2>{d.heading}</H2><div className="flex flex-wrap justify-center gap-4">{rows.map(([I, l, v]: any, i: number) => (
        <div key={i} className="w-[calc(50%-0.5rem)] md:w-[calc(25%-0.75rem)] rounded-xl border border-border bg-card text-card-foreground p-4"><I className="h-5 w-5 text-secondary mb-2" aria-hidden="true" /><p className="text-xs text-muted-foreground">{l}</p><p className="font-semibold mt-0.5">{v}</p></div>))}</div></Wrap>;
    }
    case "prices":
      return <Wrap b={b}><H2>{d.heading}</H2><div className="max-w-3xl mx-auto overflow-x-auto rounded-xl border border-border bg-card text-card-foreground">
        <table className="w-full text-sm"><thead className="bg-primary text-primary-foreground"><tr><th className="p-3 text-left">Type</th><th className="p-3 text-left">Size</th><th className="p-3 text-left">Price</th></tr></thead>
          <tbody>{(d.items || []).map((p: any, i: number) => <tr key={i} className="border-t border-border"><td className="p-3 font-medium">{p.type}</td><td className="p-3">{p.size}</td>
            <td className="p-3">{p.price ? <span className="font-semibold text-secondary">{p.price}</span> : <a href="#enquiry" className="text-secondary underline font-medium">Get price</a>}</td></tr>)}</tbody></table></div>
        {d.note && <p className="text-xs text-center opacity-70 mt-3">{d.note}</p>}</Wrap>;
    case "floorplans": {
      const items = d.items || [];
      if (!items.length) return null;
      return <Wrap b={b}><H2>{d.heading}</H2><Tabs defaultValue="0" className="max-w-4xl mx-auto"><TabsList className="flex flex-wrap h-auto mx-auto w-fit">{items.map((p: any, i: number) => <TabsTrigger key={i} value={String(i)}>{p.name}</TabsTrigger>)}</TabsList>
        {items.map((p: any, i: number) => <TabsContent key={i} value={String(i)} className="text-center">
          {p.image ? <button type="button" onClick={() => setLb(i)} aria-label={`Enlarge ${p.name} plan`} className="w-full"><img src={p.image} alt={`${p.name} floor plan`} loading="lazy" decoding="async" className="mx-auto w-full max-h-[480px] aspect-[1332/869] object-contain rounded-xl bg-card" /></button> : <Ph label="Add a plan image" />}
          {p.size && <p className="mt-3 font-medium">{p.name} · {p.size}</p>}</TabsContent>)}</Tabs>
        <Suspense fallback={null}><Lightbox open={lb >= 0} index={lb} close={() => setLb(-1)} slides={items.filter((p: any) => p.image).map((p: any) => ({ src: p.image }))} /></Suspense></Wrap>;
    }
    case "amenities":
      return <Wrap b={b}><H2>{d.heading}</H2><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">{(d.items || []).map((a: any, i: number) => { const name = typeof a === "string" ? a : a.name || ""; const I = amenityIcon(name); return (
        <div key={i} className="group flex items-center gap-3 rounded-xl border border-border bg-card text-card-foreground p-4 hover:border-secondary transition-colors"><span className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors"><I className="h-5 w-5" aria-hidden="true" /></span><span className="text-sm font-medium">{name}</span></div>); })}</div></Wrap>;
    case "location":
      return <Wrap b={b}><H2>{d.heading}</H2><div className="grid md:grid-cols-2 gap-8 items-start">
        <PropertyMap location={d.address || "Indore"} lat={d.lat ? Number(d.lat) : null} lng={d.lng ? Number(d.lng) : null} />
        <ul className="space-y-2">{(d.items || []).map((n: any, i: number) => <li key={i} className="flex items-center justify-between rounded-lg border border-border bg-card text-card-foreground p-3">
          <span className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-secondary" aria-hidden="true" />{n.name}</span><span className="text-sm font-semibold">{n.distance}</span></li>)}</ul></div></Wrap>;
    case "brochure":
      return <Wrap b={b} id="brochure"><div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
        {d.cover ? <img src={d.cover} alt="Brochure cover" loading="lazy" decoding="async" className="rounded-2xl shadow-xl w-full max-w-sm mx-auto aspect-[4/3] object-cover bg-muted" /> : <div className="rounded-2xl bg-card border border-border aspect-[3/4] max-w-xs w-full mx-auto flex items-center justify-center"><Download className="h-12 w-12 text-secondary" aria-hidden="true" /></div>}
        <div><h2 className="font-heading text-2xl md:text-3xl font-bold">{d.heading}</h2><p className="opacity-80 mt-2 mb-5">{d.text}</p>
          {d.file ? <><LeadCapture compact pageTitle={`${pageTitle} (Brochure)`} button="Get Brochure" source="brochure" />
            <Button asChild variant="link" className="mt-2"><a href={d.file} target="_blank" rel="noreferrer"><Download className="h-4 w-4 mr-2" aria-hidden="true" />Open brochure</a></Button></>
            : <LeadCapture compact pageTitle={`${pageTitle} (Brochure)`} button="Request Brochure" source="brochure" />}</div></div></Wrap>;
    case "progress":
      return <Wrap b={b}><H2>{d.heading}</H2><ol className="max-w-2xl mx-auto relative border-l-2 border-secondary/40 ml-3 space-y-6">{(d.items || []).map((m: any, i: number) => (
        <li key={i} className="pl-6 relative"><span className="absolute -left-[11px] top-0.5 bg-background rounded-full">{m.done === "yes" ? <CheckCircle2 className="h-5 w-5 text-secondary" aria-label="Done" /> : <Circle className="h-5 w-5 text-muted-foreground" aria-label="Pending" />}</span>
          <p className="text-xs opacity-70">{m.date}</p><p className="font-semibold">{m.title}</p></li>))}</ol></Wrap>;
    case "properties": {
      const slugs = String(d.slugs || "").split(",").map((s) => s.trim()).filter(Boolean);
      let list = (allProps || []).filter((p) => slugs.length ? slugs.includes(p.slug) : (!d.location || p.location.toLowerCase().includes(String(d.location).toLowerCase())) && (!d.type || p.type.toLowerCase() === String(d.type).toLowerCase()));
      list = list.slice(0, Number(d.limit) || 6);
      return <Wrap b={b}><H2>{d.heading}</H2>{list.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{list.map((p) => <PropertyCard key={p.id} property={p} />)}</div> : <p className="text-center opacity-70">No matching properties right now.</p>}</Wrap>;
    }
    case "emi": {
      const r = emi.rate / 1200, n = emi.years * 12;
      const m = r ? (emi.amount * r * (1 + r) ** n) / ((1 + r) ** n - 1) : emi.amount / n;
      const inr = (v: number) => "₹ " + Math.round(v).toLocaleString("en-IN");
      return <Wrap b={b}><H2>{d.heading}</H2><div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8 rounded-2xl border border-border bg-card text-card-foreground p-6">
        <div className="space-y-6">{([["Loan amount", "amount", 500000, 50000000, 100000, inr(emi.amount)], ["Interest rate", "rate", 6, 15, 0.1, emi.rate.toFixed(1) + "%"], ["Years", "years", 1, 30, 1, emi.years + " yrs"]] as const).map(([l, k, mn, mx, st, v]) => (
          <div key={k}><div className="flex justify-between text-sm mb-2"><span>{l}</span><span className="font-semibold">{v}</span></div><Slider aria-label={l} min={mn} max={mx} step={st} value={[emi[k]]} onValueChange={([x]) => setEmi({ ...emi, [k]: x })} /></div>))}</div>
        <div className="rounded-xl navy-gradient text-primary-foreground p-6 flex flex-col justify-center text-center"><p className="text-sm opacity-80">Monthly EMI</p><p className="font-heading text-3xl font-bold text-secondary my-2">{inr(m)}</p>
          <p className="text-xs opacity-70">Total interest {inr(m * n - emi.amount)}</p></div></div></Wrap>;
    }
    case "developer":
      return <Wrap b={b}><div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center rounded-2xl border border-border bg-card text-card-foreground p-6 md:p-8">
        {d.logo ? <img src={d.logo} alt={d.name} loading="lazy" className="h-24 w-24 object-contain" /> : <Building2 className="h-20 w-20 text-secondary" aria-hidden="true" />}
        <div className="flex-1 text-center md:text-left"><p className="text-xs uppercase tracking-widest text-secondary font-semibold">About the developer</p><h2 className="font-heading text-2xl font-bold">{d.name}</h2><p className="text-muted-foreground mt-2 text-sm">{d.about}</p></div>
        <div className="flex gap-6 text-center">{d.years && <div><p className="font-heading text-2xl font-bold text-secondary">{d.years}</p><p className="text-xs">Years</p></div>}{d.projects && <div><p className="font-heading text-2xl font-bold text-secondary">{d.projects}</p><p className="text-xs">Projects</p></div>}</div></div></Wrap>;
    case "specifications": {
      const items = d.items || [];
      const titles = [...new Set<string>(items.map((x: any) => x.title || "Specs"))].filter(Boolean);
      return <Wrap b={b}><H2>{d.heading}</H2>{d.intro && <p className="text-center max-w-2xl mx-auto -mt-4 mb-8 opacity-80">{d.intro}</p>}
        <Tabs defaultValue={String(titles.indexOf(items[0]?.title || "Specs"))} className="max-w-4xl mx-auto">
          <TabsList className="flex flex-wrap h-auto mx-auto w-fit">{titles.map((t, i) => <TabsTrigger key={i} value={String(i)}>{t}</TabsTrigger>)}</TabsList>
          {titles.map((t, i) => <TabsContent key={i} value={String(i)}>
            <div className="grid sm:grid-cols-2 gap-4">{(items.filter((x: any) => x.title === t)).map((x: any, j: number) => (
              <div key={j} className="rounded-xl border border-border bg-card text-card-foreground p-4"><div className="flex items-center gap-2 mb-2"><Info className="h-4 w-4 text-secondary" /> <span className="font-semibold">{x.title}</span></div><p className="text-sm text-muted-foreground">{x.desc}</p></div>))}</div>
          </TabsContent>)}</Tabs></Wrap>;
    }
    case "payment_plan": {
      const items = d.items || [];
      const notes = d.notes || [];
      const planColor = d.type === "Bank Finance" ? "blue" : d.type === "Construction-Linked" ? "green" : "slate";
      return <Wrap b={b}><H2>{d.heading}</H2>{d.intro && <p className="text-center max-w-2xl mx-auto -mt-4 mb-8 opacity-80">{d.intro}</p>}
        <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6"><Badge variant={planColor === "blue" ? "default" : planColor === "green" ? "secondary" : "outline"}>{d.type}</Badge>
            <span className="text-sm text-muted-foreground">{items.length} stages</span></div>
          <ol className="relative border-l-2 border-secondary/40 ml-3 space-y-6">
            {items.map((s: any, i: number) => (
              <li key={i} className="pl-6 relative"><span className="absolute -left-[11px] top-0.5 bg-background rounded-full h-5 w-5 border-2 border-secondary flex items-center justify-center"><span className="text-xs font-bold text-secondary">{i + 1}</span></span>
                <p className="font-semibold">{s.label}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  {s.when && <span><Calendar className="h-3.5 w-3.5 mr-1" />{s.when}</span>}
                  {s.percent && <span className="font-semibold text-secondary"><span className="mr-1">₹</span>{s.percent}</span>}
                </div></li>))}
          </ol>
          {notes.length > 0 && <div className="mt-6 space-y-2"><h3 className="font-semibold text-sm">Additional notes</h3>{notes.map((n: any, i: number) => (
            <p key={i} className="text-sm opacity-80">– {n.text}</p>))}</div>}
        </div></Wrap>;
    }
    case "similar_projects": {
      const currentLocation = String(d.location || "").toLowerCase();
      const matches = projects.filter((p: any) => !currentLocation || d.by_location !== "yes" || String(p.meta?.location || "").toLowerCase().includes(currentLocation));
      return <Wrap b={b}><H2>{d.heading}</H2>{matches.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.slice(0, Math.max(1, Number(d.limit) || 4)).map((p: any) => <Link key={p.id} to={`/projects/${p.slug}`} className="group rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-shadow">
          <div className="aspect-[16/10] overflow-hidden bg-muted">{p.meta?.cover ? <img src={p.meta.cover} alt={p.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform" /> : <div className="h-full w-full navy-gradient flex items-center justify-center"><Building2 className="h-10 w-10 text-secondary" /></div>}</div>
          <div className="p-5"><h3 className="font-heading text-lg font-bold group-hover:text-secondary">{p.title}</h3><p className="mt-1 text-sm text-muted-foreground">{p.meta?.location || "Indore"} · {p.meta?.price_from || "Price on request"}</p></div>
        </Link>)}
      </div> : <p className="text-center text-muted-foreground">No similar projects available yet.</p>}</Wrap>;
    }
    case "highlights":
      return <Wrap b={b}><H2>{d.heading}</H2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {(d.items || []).map((item: any, i: number) => <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" /><p className="font-medium">{item.value || item.text}</p></div>)}
      </div></Wrap>;
    default: return null;
  }
};

const BlockRenderer = ({ blocks, pageTitle, showHidden, kind = "page" }: { blocks: Block[]; pageTitle: string; showHidden?: boolean; kind?: "page" | "project" }) => {
  const visible = useMemo(() => blocks.filter((b) => showHidden || !b.hidden), [blocks, showHidden]);
  return <>{visible.map((b) => <div key={b.id} data-block={b.id} className={b.hidden ? "opacity-40" : ""}><BlockView b={b} pageTitle={pageTitle} kind={kind} /></div>)}</>;
};

export default BlockRenderer;
