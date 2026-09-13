import { FaqSection } from "@/components/marketing/faq-section";
import { FeatureShowcase } from "@/components/marketing/feature-showcase";
import { FinalCta } from "@/components/marketing/final-cta";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { IntegrationsSection } from "@/components/marketing/integrations-section";
import { MarketingNavbar } from "@/components/marketing/navbar";
import { ProblemSection } from "@/components/marketing/problem-section";
import { ProductPreview } from "@/components/marketing/product-preview";
import { SecuritySection } from "@/components/marketing/security-section";
import { TrustSection } from "@/components/marketing/trust-section";

export default function HomePage() {
  return (
    <main className="marketing-theme min-h-screen bg-background">
      <MarketingNavbar />
      <Hero />
      <ProductPreview />
      <ProblemSection />
      <HowItWorks />
      <FeatureShowcase />
      <IntegrationsSection />
      <TrustSection />
      <SecuritySection />
      <FaqSection />
      <FinalCta />
      <Footer />
    </main>
  );
}
