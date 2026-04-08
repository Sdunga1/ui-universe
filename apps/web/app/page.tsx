import { AnimatedBackground } from "../components/landing/backgrounds/animated-background";
import { CodeShowcase } from "../components/landing/code-showcase";
import { ComponentGrid } from "../components/landing/component-grid";
import { CTAFooter } from "../components/landing/cta-footer";
import { EvalProof } from "../components/landing/eval-proof";
import { FeatureCards } from "../components/landing/feature-cards";
import { HeroSection } from "../components/landing/hero-section";
import { HowItWorks } from "../components/landing/how-it-works";
import { LogoMarquee } from "../components/landing/logo-marquee";
import { ScrollObserver } from "../components/landing/scroll-observer";

export default function HomePage() {
  return (
    <div className="bg-[var(--background)] text-white min-h-screen overflow-hidden">
      <AnimatedBackground />

      <ScrollObserver />
      <HeroSection />
      <LogoMarquee />
      <FeatureCards />
      <CodeShowcase />
      <EvalProof />
      <ComponentGrid />
      <HowItWorks />
      <CTAFooter />
    </div>
  );
}
