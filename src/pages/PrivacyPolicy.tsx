import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

const PrivacyPolicy = () => {
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
              <span className="text-primary-foreground">Privacy Policy</span>
            </nav>
            <ScrollReveal>
              <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-primary-foreground leading-tight">
                Privacy <span className="text-gold-gradient">Policy</span>
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
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">1. Introduction</h2>
                  <p>
                    Indore Realty ("we," "our," or "us"), a brand of MLHK Infotech, is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website <strong className="text-foreground">indorerealty.in</strong>, use our services, or interact with us through any medium including phone, WhatsApp, or email.
                  </p>
                  <p className="mt-3">
                    By accessing or using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree, please refrain from using our platform.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">2. Information We Collect</h2>
                  <p className="mb-3">We may collect the following types of information:</p>
                  <h3 className="font-heading font-semibold text-foreground text-base mb-2">2.1 Personal Information</h3>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>Full name, email address, phone number</li>
                    <li>Residential or correspondence address</li>
                    <li>Property preferences (location, budget, type)</li>
                    <li>Any information you voluntarily provide through enquiry forms, WhatsApp messages, or phone calls</li>
                  </ul>
                  <h3 className="font-heading font-semibold text-foreground text-base mt-4 mb-2">2.2 Automatically Collected Information</h3>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>IP address, browser type, operating system</li>
                    <li>Pages visited, time spent, referral source</li>
                    <li>Device information and screen resolution</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">3. How We Use Your Information</h2>
                  <p className="mb-3">We use the collected information for the following purposes:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li>To respond to your property enquiries and schedule site visits</li>
                    <li>To provide personalised property recommendations</li>
                    <li>To communicate updates about new listings, offers, and market insights</li>
                    <li>To improve our website functionality and user experience</li>
                    <li>To comply with legal obligations and RERA regulations</li>
                    <li>To prevent fraud and ensure the security of our platform</li>
                    <li>For internal analytics and business improvement</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">4. Information Sharing & Disclosure</h2>
                  <p className="mb-3">We do <strong className="text-foreground">not sell, rent, or trade</strong> your personal information. We may share it in the following circumstances:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li><strong className="text-foreground">Service Providers:</strong> Trusted third-party vendors who assist in website hosting, analytics, or communication (bound by confidentiality agreements)</li>
                    <li><strong className="text-foreground">Property Developers/Owners:</strong> To facilitate property transactions on your behalf, with your consent</li>
                    <li><strong className="text-foreground">Legal Requirements:</strong> When required by law, court order, or government authority</li>
                    <li><strong className="text-foreground">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">5. Cookies & Tracking</h2>
                  <p>
                    We use cookies and similar technologies to enhance your browsing experience, analyse website traffic, and serve relevant content. You can control cookie preferences through your browser settings. Disabling cookies may affect certain features of our website.
                  </p>
                  <p className="mt-3">We may use the following types of cookies:</p>
                  <ul className="list-disc pl-6 space-y-1.5 mt-2">
                    <li><strong className="text-foreground">Essential Cookies:</strong> Required for basic website functionality</li>
                    <li><strong className="text-foreground">Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                    <li><strong className="text-foreground">Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">6. Data Security</h2>
                  <p>
                    We implement industry-standard security measures including SSL encryption, secure servers, and access controls to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">7. Data Retention</h2>
                  <p>
                    We retain your personal information only for as long as necessary to fulfil the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Enquiry data is typically retained for up to 3 years unless you request deletion.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">8. Your Rights</h2>
                  <p className="mb-3">You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-1.5">
                    <li><strong className="text-foreground">Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong className="text-foreground">Correction:</strong> Request correction of inaccurate or incomplete data</li>
                    <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
                    <li><strong className="text-foreground">Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                    <li><strong className="text-foreground">Withdraw Consent:</strong> Withdraw consent for data processing where consent was the basis</li>
                  </ul>
                  <p className="mt-3">To exercise any of these rights, please contact us at <a href="mailto:info@indorerealty.in" className="text-secondary hover:underline">info@indorerealty.in</a>.</p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">9. Third-Party Links</h2>
                  <p>
                    Our website may contain links to third-party websites (e.g., Google Maps, social media platforms). We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before sharing any personal information.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">10. Children's Privacy</h2>
                  <p>
                    Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected such data, please contact us and we will promptly delete it.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">11. Changes to This Policy</h2>
                  <p>
                    We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically. Continued use of our services after changes constitutes acceptance of the revised policy.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading font-bold text-foreground text-xl mb-3">12. Contact Us</h2>
                  <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
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

export default PrivacyPolicy;
