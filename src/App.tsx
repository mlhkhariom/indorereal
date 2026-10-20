import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import { SiteSettingsProvider } from "@/hooks/useSiteSettings";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Services from "./pages/Services";
import FAQ from "./pages/FAQ";
import Gallery from "./pages/Gallery";
import Careers from "./pages/Careers";
import EMICalculator from "./pages/EMICalculator";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import NotFound from "./pages/NotFound";
import MobileBottomBar from "./components/MobileBottomBar";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminSEO from "./pages/admin/AdminSEO";
import AdminHomepage from "./pages/admin/AdminHomepage";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminLocations from "./pages/admin/AdminLocations";
import AdminCRM from "./pages/admin/AdminCRM";
import AdminSiteSettings from "./pages/admin/AdminSiteSettings";
import AdminMenus from "./pages/admin/AdminMenus";
import AdminPages from "./pages/admin/AdminPages";
import AdminVisits from "./pages/admin/AdminVisits";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import Wishlist from "./pages/Wishlist";
import Compare from "./pages/Compare";
import PostProperty from "./pages/PostProperty";
import AreaPage from "./pages/AreaPage";
import CompareBar from "./components/CompareBar";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SiteSettingsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/property/:slug" element={<PropertyDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/emi-calculator" element={<EMICalculator />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-conditions" element={<TermsConditions />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/post-property" element={<PostProperty />} />
                <Route path="/area/:slug" element={<AreaPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="properties" element={<AdminProperties />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="enquiries" element={<AdminEnquiries />} />
                  <Route path="crm" element={<AdminCRM />} />
                  <Route path="settings" element={<AdminSiteSettings />} />
                  <Route path="menus" element={<AdminMenus />} />
                  <Route path="pages" element={<AdminPages />} />
                  <Route path="visits" element={<AdminVisits />} />
                  <Route path="team" element={<AdminTeam />} />
                  <Route path="submissions" element={<AdminSubmissions />} />
                  <Route path="seo" element={<AdminSEO />} />
                  <Route path="homepage" element={<AdminHomepage />} />
                  <Route path="gallery" element={<AdminGallery />} />
                  <Route path="locations" element={<AdminLocations />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
              <MobileBottomBar />
              <CompareBar />
            </BrowserRouter>
          </SiteSettingsProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
