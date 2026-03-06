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
  const finalOgTitle = ogTitle || settings.og_title || finalTitle;
  const finalOgDescription = ogDescription || settings.og_description || finalDescription;
  const finalCanonical = canonical || settings.canonical_url || "https://indorerealty.in";

  const defaultSchema = {
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
    image: "https://indorerealty.in/logo.png",
    sameAs: [],
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
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />

      {/* Google Verification */}
      {settings.google_site_verification && (
        <meta name="google-site-verification" content={settings.google_site_verification} />
      )}

      {/* Schema.org */}
      <script type="application/ld+json">{JSON.stringify(schema || defaultSchema)}</script>
    </Helmet>
  );
};

export default SEOHead;
