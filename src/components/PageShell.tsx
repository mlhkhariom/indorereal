import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/SEOHead";

interface Props { title: string; subtitle?: string; seoTitle: string; seoDescription: string; path: string; children: ReactNode; }

/** Standard public page frame: header, navy title band with breadcrumb, footer. */
const PageShell = ({ title, subtitle, seoTitle, seoDescription, path, children }: Props) => (
  <div className="min-h-screen flex flex-col">
    <SEOHead title={seoTitle} description={seoDescription} canonical={`https://screenshot-soul-canvas-42.lovable.app${path}`} />
    <Header />
    <main id="main" className="outline-none flex-1 bg-muted/40">
      <section className="navy-gradient pt-28 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/60 mb-4">
            <Link to="/" className="hover:text-secondary flex items-center gap-1"><Home className="h-3.5 w-3.5" aria-hidden="true" /> Home</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /><span className="text-primary-foreground">{title}</span>
          </nav>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground">{title}</h1>
          {subtitle && <p className="text-primary-foreground/70 mt-3 max-w-2xl">{subtitle}</p>}
        </div>
      </section>
      <div className="container mx-auto px-4 lg:px-8 py-10">{children}</div>
    </main>
    <Footer />
    <WhatsAppButton />
    <div className="lg:hidden h-28" />
  </div>
);

export default PageShell;
