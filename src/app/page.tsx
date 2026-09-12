import { Hero } from "@/components/marketing/hero";
import { MarketingNavbar } from "@/components/marketing/navbar";
import { ProductPreview } from "@/components/marketing/product-preview";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <MarketingNavbar />
      <Hero />
      <ProductPreview />
    </main>
  );
}
