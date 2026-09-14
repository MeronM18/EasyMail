import { FaqSection } from "@/components/marketing/faq-section";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { FeatureShowcase } from "@/components/marketing/feature-showcase";
import { FinalCta } from "@/components/marketing/final-cta";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { IntegrationsSection } from "@/components/marketing/integrations-section";
import { MarketingNavbar } from "@/components/marketing/navbar";
import { ProblemSection } from "@/components/marketing/problem-section";
import { SecuritySection } from "@/components/marketing/security-section";
import { TrustSection } from "@/components/marketing/trust-section";
import { TrustedBy } from "@/components/marketing/trusted-by";

// ProductPreview is intentionally not rendered here: FeatureShowcase (below,
// after HowItWorks) tells the same "here's the recap" story with a richer,
// scroll-linked presentation, making this earlier static mockup redundant.
// The component itself is left intact rather than deleted.

export default function HomePage() {
  return (
    <main className="marketing-theme min-h-screen bg-background">
      <div className="flex min-h-[100svh] flex-col">
        <MarketingNavbar />
        <Hero />
      </div>
      <TrustedBy />
      <ProblemSection />
      <FeatureGrid />
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
