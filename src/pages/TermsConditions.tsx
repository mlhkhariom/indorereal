import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="navy-gradient pt-28 pb-12 relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-secondary/10 blur-[100px]" />
          <div className="container mx-auto px-4 lg:px-8 relative">
            <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/50 mb-6">
              <Link to="/" className="hover:text-secondary transition-colors flex items-center gap-1">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-primary-foreground">Terms & Conditions</span>
            </nav>
            <ScrollReveal>
              <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground leading-tight">
                Terms & <span className="text-gold-gradient">Conditions</span>
              </h1>
              <p className="text-primary-foreground/60 text-lg mt-4 max-w-2xl">
                Last updated: February 25, 2026
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <ScrollReveal>
              <div className="card-elevated p-8 md:p-12 space-y-8 text-muted-foreground leading-relaxed text-[15px]">

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">1. Acceptance of Terms</h2>
                  <p>
                    Welcome to Indore Realty ("we," "our," or "us"), a real estate services platform operated by MLHK Infotech. By accessing or using our website <strong className="text-foreground">indorerealty.in</strong>, mobile application, or any associated services (collectively, the "Services"), you agree to be bound by these Terms and Conditions ("Terms").
                  </p>
                  <p className="mt-3">
                    If you do not agree to these Terms, you must not access or use our Services. These Terms constitute a legally binding agreement between you and Indore Realty.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">2. Definitions</h2>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li><strong className="text-foreground">"User"</strong> refers to any individual or entity who accesses or uses the Services</li>
                    <li><strong className="text-foreground">"Property Listing"</strong> refers to any real estate property listed on our platform</li>
                    <li><strong className="text-foreground">"Enquiry"</strong> refers to any request for information submitted by a User</li>
                    <li><strong className="text-foreground">"Content"</strong> refers to all text, images, data, and materials on our platform</li>
                    <li><strong className="text-foreground">"Transaction"</strong> refers to any property purchase, sale, or rental facilitated through our Services</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">3. Services Description</h2>
                  <p className="mb-3">Indore Realty provides the following services:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Online listing and discovery of residential and commercial properties in Indore</li>
                    <li>Property search and filtering based on location, type, budget, and other parameters</li>
                    <li>Connecting buyers/renters with property owners/developers</li>
                    <li>Scheduling site visits and property viewings</li>
                    <li>Legal documentation assistance and RERA verification support</li>
                    <li>Post-sale support and relationship management</li>
                  </ul>
                  <p className="mt-3">
                    We act as an <strong className="text-foreground">intermediary platform</strong> and do not own any of the listed properties unless explicitly stated. We facilitate connections between property seekers and property owners/developers.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">4. User Responsibilities</h2>
                  <p className="mb-3">By using our Services, you agree to:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Provide accurate, current, and complete information in all forms and communications</li>
                    <li>Not use the platform for any unlawful or fraudulent purpose</li>
                    <li>Not impersonate any person or entity</li>
                    <li>Not attempt to gain unauthorised access to any part of the platform</li>
                    <li>Not scrape, copy, or reproduce any content from the website without prior written consent</li>
                    <li>Not post or transmit any harmful, threatening, or offensive content</li>
                    <li>Conduct your own due diligence before entering into any property transaction</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">5. Property Listings & Information Accuracy</h2>
                  <p>
                    While we make every effort to ensure that property listings are accurate, verified, and up-to-date, we <strong className="text-foreground">do not guarantee</strong> the absolute accuracy, completeness, or reliability of any listing information including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-1.5 mt-3">
                    <li>Property prices, dimensions, and specifications</li>
                    <li>Photographs and visual representations</li>
                    <li>Availability status and possession dates</li>
                    <li>Amenities and facilities</li>
                    <li>Legal status and approvals</li>
                  </ul>
                  <p className="mt-3">
                    Users are strongly advised to independently verify all property details, legal documents, and approvals before making any financial commitment. Property prices and availability are subject to change without notice.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">6. RERA Compliance</h2>
                  <p>
                    Indore Realty is committed to compliance with the Real Estate (Regulation and Development) Act, 2016 (RERA). We encourage all property developers and agents listing on our platform to provide valid RERA registration numbers.
                  </p>
                  <p className="mt-3">
                    However, it is the <strong className="text-foreground">User's responsibility</strong> to verify RERA registration of any property or project directly with the relevant state RERA authority (MP-RERA: <a href="https://rera.mp.gov.in" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">rera.mp.gov.in</a>) before proceeding with any transaction.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">7. Financial Terms & Brokerage</h2>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Browsing properties and submitting enquiries on our platform is <strong className="text-foreground">free of charge</strong></li>
                    <li>Brokerage or commission charges, if applicable, will be communicated clearly before any transaction</li>
                    <li>All property prices displayed are indicative and subject to change by the property owner/developer</li>
                    <li>Any financial transaction between the User and property owner/developer is strictly between the two parties</li>
                    <li>Indore Realty is not responsible for any financial disputes arising from property transactions</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">8. Intellectual Property</h2>
                  <p>
                    All content on the Indore Realty platform — including but not limited to text, graphics, logos, images, software, and design — is the property of MLHK Infotech or its licensors and is protected by Indian and international copyright, trademark, and intellectual property laws.
                  </p>
                  <p className="mt-3">
                    You may not reproduce, distribute, modify, create derivative works, publicly display, or exploit any content from our platform without prior written permission. Unauthorised use may result in legal action.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">9. Limitation of Liability</h2>
                  <p>To the fullest extent permitted by applicable law:</p>
                  <ul className="list-disc pl-6 space-y-1.5 mt-3">
                    <li>Indore Realty shall <strong className="text-foreground">not be liable</strong> for any direct, indirect, incidental, consequential, or punitive damages arising from the use of our Services</li>
                    <li>We are not liable for any loss or damage resulting from reliance on property listing information</li>
                    <li>We do not guarantee uninterrupted, error-free, or secure access to our platform</li>
                    <li>We are not responsible for the actions, representations, or defaults of any property owner, developer, or third party</li>
                    <li>Our total liability shall not exceed the amount of brokerage or fees paid by you to us, if any</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">10. Indemnification</h2>
                  <p>
                    You agree to indemnify and hold harmless Indore Realty, MLHK Infotech, its directors, employees, and agents from any claims, liabilities, damages, losses, or expenses (including legal fees) arising from your use of our Services, violation of these Terms, or infringement of any third-party rights.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">11. Dispute Resolution</h2>
                  <p>
                    Any dispute arising from or relating to these Terms or the use of our Services shall be governed by the laws of India. The parties agree to first attempt resolution through good-faith negotiation and mediation.
                  </p>
                  <p className="mt-3">
                    If the dispute cannot be resolved amicably, it shall be subject to the <strong className="text-foreground">exclusive jurisdiction of the courts in Indore, Madhya Pradesh</strong>.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">12. Termination</h2>
                  <p>
                    We reserve the right to suspend or terminate your access to our Services at any time, without prior notice, for any reason including but not limited to violation of these Terms, fraudulent activity, or harmful behaviour. Upon termination, all provisions that by their nature should survive shall remain in effect.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">13. Force Majeure</h2>
                  <p>
                    Indore Realty shall not be liable for any failure or delay in performing our obligations due to circumstances beyond our reasonable control, including natural disasters, pandemics, government actions, strikes, power failures, or internet disruptions.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">14. Modifications to Terms</h2>
                  <p>
                    We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on this page. It is your responsibility to review these Terms periodically. Continued use of the Services after any modifications constitutes acceptance of the updated Terms.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">15. Severability</h2>
                  <p>
                    If any provision of these Terms is found to be unenforceable or invalid by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">16. Contact Information</h2>
                  <p>For any questions regarding these Terms & Conditions, please contact us:</p>
                  <div className="mt-3 p-5 rounded-xl bg-muted/60 border border-border space-y-2">
                    <p><strong className="text-foreground">Indore Realty</strong> (A brand of MLHK Infotech)</p>
                    <p>123 Business Park, Vijay Nagar, Indore, MP 452010</p>
                    <p>Phone: <a href="tel:+919876543210" className="text-secondary hover:underline">+91 98765 43210</a></p>
                    <p>Email: <a href="mailto:info@indorerealty.in" className="text-secondary hover:underline">info@indorerealty.in</a></p>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      <div className="lg:hidden h-28" />
    </div>
  );
};

export default TermsConditions;
