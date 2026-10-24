import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  type?: string;
  schema?: object;
}

const SEOHead = ({ title, description, keywords, ogTitle, ogDescription, ogImage, canonical, type = "website", schema }: SEOHeadProps) => {
  const settings = useSiteSettings();

  const finalTitle = title || settings.site_title || "Indore Realty — Premium Properties in Indore";
  const finalDescription = description || settings.site_description || "";
  const finalKeywords = keywords || settings.site_keywords || "";
  const finalOgTitle = ogTitle || (title ? finalTitle : settings.og_title || finalTitle);
  const finalOgDescription = ogDescription || (description ? finalDescription : settings.og_description || finalDescription);
  const base = (settings.canonical_url || "https://indorerealty.in").replace(/\/$/, "");
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const finalCanonical = canonical || base + (path === "/" ? "/" : path.replace(/\/$/, ""));

  const PLACEHOLDER_PHONE = "+919876543210";
  const phone = settings.schema_org_phone && settings.schema_org_phone !== PLACEHOLDER_PHONE ? settings.schema_org_phone : undefined;
  const rawAddr = settings.schema_org_address || "";
  const street = rawAddr && !/123 Business Park/i.test(rawAddr) ? rawAddr.split(",")[0] : undefined;
  const finalOgImage = ogImage || "https://indorerealty.in/og-image.jpg";
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://indorerealty.in/#website",
    name: "Indore Realty",
    url: "https://indorerealty.in/",
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://indorerealty.in/properties?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://indorerealty.in/#business",
    name: settings.schema_org_name || "Indore Realty",
    description: settings.schema_org_description || "Indore Realty — verified new residential projects and flats in Indore",
    url: finalCanonical,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: "Indore",
      addressRegion: "Madhya Pradesh",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "City",
      name: "Indore",
      "@id": "https://www.wikidata.org/wiki/Q228405",
    },
    priceRange: "₹₹-₹₹₹₹",
    image: "https://indorerealty.in/logo.png",
    logo: "https://indorerealty.in/logo.png",
    founder: { "@type": "Person", name: "Subhash Pawar", jobTitle: "Founder, CEO & Managing Director" },
    sameAs: [],
  };

  const realEstateSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: settings.schema_org_name || "Indore Realty",
    description: settings.schema_org_description || "Verified new flats and residential projects in Indore",
    url: finalCanonical,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: "Indore",
      addressRegion: "Madhya Pradesh",
      addressCountry: "IN",
    },
    areaServed: { "@type": "City", name: "Indore" },
    priceRange: "₹₹-₹₹₹₹",
    image: "https://indorerealty.in/logo.png",
    sameAs: [],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://indorerealty.in/" },
    ],
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Indore Realty",
    url: "https://indorerealty.in",
    logo: "https://indorerealty.in/logo.png",
    founder: { "@type": "Person", name: "Subhash Pawar" },
    contactPoint: phone && {
      "@type": "ContactPoint",
      telephone: phone,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["Hindi", "English"],
    },
  };

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="author" content="MLHK Infotech" />
      <link rel="canonical" href={finalCanonical} />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* OpenGraph */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:site_name" content="Indore Realty" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:secure_url" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalOgTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      <meta name="twitter:image:alt" content={finalOgTitle} />

      {/* Google Verification */}
      {settings.google_site_verification && (
        <meta name="google-site-verification" content={settings.google_site_verification} />
      )}

      {/* Schema.org - Multiple schemas */}
      {schema ? (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      ) : (
        <>
          <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
          <script type="application/ld+json">{JSON.stringify(realEstateSchema)}</script>
        </>
      )}
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      {!schema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
    </Helmet>
  );
};

export default SEOHead;
