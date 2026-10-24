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
  const finalCanonical = canonical || settings.canonical_url || "https://screenshot-soul-canvas-42.lovable.app";

  const finalOgImage = ogImage || "https://screenshot-soul-canvas-42.lovable.app/og-image.jpg";
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://screenshot-soul-canvas-42.lovable.app/#website",
    name: "Indore Realty",
    url: "https://screenshot-soul-canvas-42.lovable.app/",
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://screenshot-soul-canvas-42.lovable.app/properties?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://screenshot-soul-canvas-42.lovable.app/#business",
    name: settings.schema_org_name || "Indore Realty",
    description: settings.schema_org_description || "Indore Realty — verified new residential projects and flats in Indore",
    url: finalCanonical,
    telephone: settings.schema_org_phone || "+919876543210",
    email: "info@indorerealty.in",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.schema_org_address?.split(",")[0] || "123 Business Park, Vijay Nagar",
      addressLocality: "Indore",
      addressRegion: "Madhya Pradesh",
      postalCode: "452010",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "22.7196",
      longitude: "75.8577",
    },
    areaServed: {
      "@type": "City",
      name: "Indore",
      "@id": "https://www.wikidata.org/wiki/Q228405",
    },
    priceRange: "₹₹-₹₹₹₹",
    image: "https://screenshot-soul-canvas-42.lovable.app/logo.png",
    logo: "https://screenshot-soul-canvas-42.lovable.app/logo.png",
    founder: { "@type": "Person", name: "Subhash Pawar", jobTitle: "Founder, CEO & Managing Director" },
    sameAs: [],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
  };

  const realEstateSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: settings.schema_org_name || "Indore Realty",
    description: settings.schema_org_description || "Indore's #1 trusted real estate platform",
    url: finalCanonical,
    telephone: settings.schema_org_phone || "+919876543210",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.schema_org_address?.split(",")[0] || "123 Business Park, Vijay Nagar",
      addressLocality: "Indore",
      addressRegion: "Madhya Pradesh",
      postalCode: "452010",
      addressCountry: "IN",
    },
    areaServed: { "@type": "City", name: "Indore" },
    priceRange: "₹₹-₹₹₹₹",
    image: "https://screenshot-soul-canvas-42.lovable.app/logo.png",
    sameAs: [],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://screenshot-soul-canvas-42.lovable.app/" },
    ],
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Indore Realty",
    url: "https://screenshot-soul-canvas-42.lovable.app",
    logo: "https://screenshot-soul-canvas-42.lovable.app/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.schema_org_phone || "+919876543210",
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
