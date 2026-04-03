import { AIIntegration } from "../components/landing/ai-integration";
import { CodeShowcase } from "../components/landing/code-showcase";
import { ComponentGrid } from "../components/landing/component-grid";
import { CTAFooter } from "../components/landing/cta-footer";
import { FeatureCards } from "../components/landing/feature-cards";
import { HeroSection } from "../components/landing/hero-section";
import { HowItWorks } from "../components/landing/how-it-works";
import { LogoMarquee } from "../components/landing/logo-marquee";
import { ScrollObserver } from "../components/landing/scroll-observer";

export default function HomePage() {
  return (
    <div className="bg-[var(--background)] text-white min-h-screen overflow-hidden">
      {/* Subtle grid background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      <ScrollObserver />
      <HeroSection />
      <LogoMarquee />
      <FeatureCards />
      <CodeShowcase />
      <HowItWorks />
      <ComponentGrid />
      <AIIntegration />
      <CTAFooter />
    </div>
  );
}
