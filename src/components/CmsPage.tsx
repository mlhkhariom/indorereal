import { ReactNode } from "react";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";
import { useSitePage } from "@/hooks/useSitePage";

/** Renders admin-written content for a page if it exists; otherwise the built-in page. */
const CmsPage = ({ slug, children }: { slug: string; children: ReactNode }) => {
  const { data, isLoading } = useSitePage(slug);
  if (isLoading) return <div className="min-h-screen" />;
  if (!data?.content?.trim()) return <>{children}</>;
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title={data.seo_title || `${data.title} | Indore Realty`} description={data.seo_description || undefined} canonical={`https://indorerealty.in/${slug}`} />
      <Header />
      <main id="main" className="outline-none flex-1">
        <section className="navy-gradient pt-28 pb-12">
          <div className="container mx-auto px-4 lg:px-8">
            <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/60 mb-4">
              <Link to="/" className="hover:text-secondary flex items-center gap-1"><Home className="h-3.5 w-3.5" aria-hidden="true" /> Home</Link>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /><span className="text-primary-foreground">{data.title}</span>
            </nav>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground">{data.title}</h1>
          </div>
        </section>
        <section className="container mx-auto px-4 lg:px-8 py-12">
          <article className="prose prose-slate max-w-3xl mx-auto prose-headings:font-heading prose-a:text-secondary prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content) }} />
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      <div className="lg:hidden h-28" />
    </div>
  );
};

export default CmsPage;
