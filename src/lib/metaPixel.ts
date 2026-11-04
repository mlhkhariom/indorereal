// Meta Pixel with regional consent: visitors in consent-required countries
// (EEA, UK, Switzerland) are tracked only after they accept the cookie banner.
const PIXEL_ID = "28309024948770702";
const CONSENT_KEY = "ir_ad_consent_v1";
export const CONSENT_NOTICE_VERSION = "2026-11-05";

const CONSENT_COUNTRIES = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL",
  "PL","PT","RO","SK","SI","ES","SE","IS","LI","NO","GB","CH",
]);

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void; queue: unknown[]; push: Fbq; loaded: boolean; version: string;
};
declare global { interface Window { fbq?: Fbq; _fbq?: Fbq } }

export type ConsentRecord = { choice: "accepted" | "rejected"; at: string; version: string; country: string };

export function readConsent(): ConsentRecord | null {
  try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || "null"); } catch { return null; }
}

let regionPromise: Promise<{ country: string; needsConsent: boolean }> | null = null;
export function getRegion() {
  if (!regionPromise) {
    regionPromise = (async () => {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 2000);
        const res = await fetch("/cdn-cgi/trace", { signal: ctrl.signal });
        clearTimeout(t);
        if (!res.ok) throw new Error();
        const txt = await res.text();
        const get = (k: string) => txt.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1]?.trim() ?? "";
        const country = get("loc").toUpperCase();
        const h = get("h");
        if (!country || country === "XX" || country === "T1" || (h && h !== location.host)) throw new Error();
        return { country, needsConsent: CONSENT_COUNTRIES.has(country) };
      } catch {
        return { country: "unknown", needsConsent: true };
      }
    })();
  }
  return regionPromise;
}

let regionAllowsWithoutBanner = false;

/** Fresh check every time an event is about to be sent. */
function allowed(): boolean {
  const c = readConsent();
  if (c?.choice === "rejected") return false;
  if (c?.choice === "accepted") return true;
  return regionAllowsWithoutBanner;
}

function fbq(...args: unknown[]) {
  const f = window.fbq;
  if (!f) return;
  if (f.callMethod) f.callMethod.apply(f, args); else f.queue.push(args);
}

let loaded = false;
function loadPixel() {
  if (loaded) { fbq("consent", "grant"); return; }
  loaded = true;
  if (!window.fbq) {
    const n = function (...args: unknown[]) {
      if (n.callMethod) n.callMethod.apply(n, args); else n.queue.push(args);
    } as Fbq;
    if (!window._fbq) window._fbq = n;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    window.fbq = n;
    const s = document.createElement("script");
    s.async = true; s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
  }
  fbq("init", PIXEL_ID, {}, { agent: "lovable" });
  fbq("track", "PageView");
}

export async function initMetaPixel(): Promise<{ showBanner: boolean }> {
  if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/builder-preview")) return { showBanner: false };
  const region = await getRegion();
  regionAllowsWithoutBanner = !region.needsConsent;
  if (allowed()) loadPixel();
  return { showBanner: region.needsConsent && !readConsent() };
}

export async function setConsent(choice: "accepted" | "rejected") {
  const region = await getRegion();
  const rec: ConsentRecord = { choice, at: new Date().toISOString(), version: CONSENT_NOTICE_VERSION, country: region.country };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(rec));
  applyConsent();
}

function applyConsent() {
  if (allowed()) loadPixel();
  else if (loaded) fbq("consent", "revoke");
}

// Keep other open tabs in sync.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => { if (e.key === CONSENT_KEY) applyConsent(); });
}

let lastPath = "";
export function trackPageView(path: string) {
  if (path === lastPath) return;
  const first = !lastPath;
  lastPath = path;
  if (!first && loaded && allowed()) fbq("track", "PageView");
}

/** Call after an enquiry / site-visit request is successfully saved. */
export function trackLead(source: string) {
  if (!loaded || !allowed()) return;
  const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  fbq("track", "Lead", { content_category: source }, { eventID: id });
}

export const openCookieSettings = () => window.dispatchEvent(new Event("ir:cookie-settings"));
