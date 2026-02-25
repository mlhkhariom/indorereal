import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Home, ArrowRight } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-muted">
        <div className="text-center px-4">
          <h1 className="font-heading text-8xl md:text-9xl font-extrabold text-gold-gradient">404</h1>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mt-4">Page Not Found</h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            The page you're looking for doesn't exist. Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link to="/" className="btn-gold px-8 py-3.5 rounded-xl text-sm inline-flex items-center gap-2 justify-center">
              <Home className="h-4 w-4" /> Go Home
            </Link>
            <Link to="/properties" className="px-8 py-3.5 rounded-xl border-2 border-primary text-primary font-heading font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all inline-flex items-center gap-2 justify-center">
              Browse Properties <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
