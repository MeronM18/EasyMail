import { BenefitsSection } from "@/components/marketing/benefits-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { FinalCta } from "@/components/marketing/final-cta";
import { Footer } from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { MarketingNavbar } from "@/components/marketing/navbar";
import { ProblemSection } from "@/components/marketing/problem-section";
import { SecuritySection } from "@/components/marketing/security-section";
import { TrustedBy } from "@/components/marketing/trusted-by";

// ProductPreview, FeatureShowcase, IntegrationsSection, and TrustSection are
// intentionally not rendered here — each substantially repeated a concept
// already covered elsewhere (recap/triage story, provider list, or the
// correction narrative now folded into FeatureGrid's third card and
// SecuritySection's fifth point). Components are left intact, not deleted.

export default function HomePage() {
  return (
    <main className="marketing-theme min-h-screen bg-background">
      <div className="flex min-h-[100svh] flex-col">
        <MarketingNavbar />
        <Hero />
      </div>
      <TrustedBy />
      <ProblemSection />
      <BenefitsSection />
      <FeatureGrid />
      <HowItWorks />
      <SecuritySection />
      <FaqSection />
      <FinalCta />
      <Footer />
    </main>
  );
}
