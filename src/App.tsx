import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import { SiteSettingsProvider } from "@/hooks/useSiteSettings";
import Index from "./pages/Index";
const Properties = lazy(() => import("./pages/Properties"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Services = lazy(() => import("./pages/Services"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Careers = lazy(() => import("./pages/Careers"));
const EMICalculator = lazy(() => import("./pages/EMICalculator"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const NotFound = lazy(() => import("./pages/NotFound"));
import MobileBottomBar from "./components/MobileBottomBar";
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
import AdminLayout from "./components/admin/AdminLayout";
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProperties = lazy(() => import("./pages/admin/AdminProperties"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminEnquiries = lazy(() => import("./pages/admin/AdminEnquiries"));
const AdminSEO = lazy(() => import("./pages/admin/AdminSEO"));
const AdminHomepage = lazy(() => import("./pages/admin/AdminHomepage"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery"));
const AdminLocations = lazy(() => import("./pages/admin/AdminLocations"));
const AdminCRM = lazy(() => import("./pages/admin/AdminCRM"));
const AdminSiteSettings = lazy(() => import("./pages/admin/AdminSiteSettings"));
const AdminMenus = lazy(() => import("./pages/admin/AdminMenus"));
const AdminPages = lazy(() => import("./pages/admin/AdminPages"));
const AdminVisits = lazy(() => import("./pages/admin/AdminVisits"));
const AdminTeam = lazy(() => import("./pages/admin/AdminTeam"));
const AdminSubmissions = lazy(() => import("./pages/admin/AdminSubmissions"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Compare = lazy(() => import("./pages/Compare"));
const PostProperty = lazy(() => import("./pages/PostProperty"));
const BuiltPage = lazy(() => import("./pages/BuiltPage"));
const Projects = lazy(() => import("./pages/Projects"));
const BuilderPreview = lazy(() => import("./pages/BuilderPreview"));
const AdminBuilderList = lazy(() => import("./pages/admin/AdminBuilderList"));
const AdminBuilderEditor = lazy(() => import("./pages/admin/AdminBuilderEditor"));
const AreaPage = lazy(() => import("./pages/AreaPage"));
import CompareBar from "./components/CompareBar";
import ScrollToTop from "./components/ScrollToTop";
import SkipLink from "./components/SkipLink";

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
              <SkipLink />
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-secondary border-t-transparent rounded-full" /></div>}>
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
                <Route path="/p/:slug" element={<BuiltPage kind="page" />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<BuiltPage kind="project" />} />
                <Route path="/builder-preview" element={<BuilderPreview />} />
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
                  <Route path="builder" element={<AdminBuilderList kind="page" />} />
                  <Route path="projects" element={<AdminBuilderList kind="project" />} />
                  <Route path="builder/:id" element={<AdminBuilderEditor />} />
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
              </Suspense>
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
