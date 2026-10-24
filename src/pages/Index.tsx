import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import FeaturedProjects from "@/components/FeaturedProjects";
import LocationsSection from "@/components/LocationsSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTABanner from "@/components/CTABanner";
import LeadershipSection from "@/components/LeadershipSection";
import HomeSeoContent from "@/components/HomeSeoContent";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead />
      <Header />
      <main id="main" className="outline-none flex-1">
        <HeroSection />
        <FeaturedProjects />
        <FeaturedProperties />
        <LocationsSection />
        <WhyChooseUs />
        <HowItWorks />
        <LeadershipSection />
        <TestimonialsSection />
        <HomeSeoContent />
        <CTABanner />
      </main>
      <Footer />
      <WhatsAppButton />
      <div className="lg:hidden h-28" />
    </div>
  );
};

export default Index;
