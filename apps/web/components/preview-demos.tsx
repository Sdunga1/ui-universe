"use client";

// Animation primitives
import {
  BlurReveal,
  FadeIn,
  FadeUp,
  GlowCard,
  MagneticHover,
  RippleClick,
  ScaleIn,
  ShimmerButton,
  SlideIn,
  TiltCard,
} from "@ui-universe/ui/animations";
// Backgrounds
import { Aurora, DotGrid, GradientMesh, GridPattern, Particles } from "@ui-universe/ui/backgrounds";
// Sections
import {
  CTASection,
  FeatureGrid,
  HeroSection,
  LogoMarquee,
  StatsBar,
} from "@ui-universe/ui/sections";
// Text
import { Counter, GradientText, SplitText, TextReveal, TypeWriter } from "@ui-universe/ui/text";

interface PreviewDemosProps {
  name: string;
  category: string;
}

const DEMO_CARD = "rounded-none border border-[var(--border)] bg-[var(--card)] p-4 text-center";

// ---------------------------------------------------------------------------
// Preview components for each demo
// ---------------------------------------------------------------------------

function FadeUpDemo() {
  return (
    <div className="flex items-center justify-center p-10">
      <FadeUp>
        <div className={DEMO_CARD}>
          <p className="text-lg font-semibold">Hello, FadeUp</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            I slide up and fade in on viewport entry
          </p>
        </div>
      </FadeUp>
    </div>
  );
}

function FadeInDemo() {
  return (
    <div className="flex items-center justify-center p-10">
      <FadeIn>
        <div className={DEMO_CARD}>
          <p className="text-lg font-semibold">Hello, FadeIn</p>
          <p className="mt-1 text-sm text-[var(--muted)]">I simply fade in — no movement</p>
        </div>
      </FadeIn>
    </div>
  );
}

function ScaleInDemo() {
  return (
    <div className="flex items-center justify-center p-10">
      <ScaleIn>
        <div className={DEMO_CARD}>
          <p className="text-lg font-semibold">Hello, ScaleIn</p>
          <p className="mt-1 text-sm text-[var(--muted)]">I grow into view with a subtle scale</p>
        </div>
      </ScaleIn>
    </div>
  );
}

function SlideInDemo() {
  return (
    <div className="flex gap-4 p-10">
      <SlideIn direction="left" triggerOnView={false}>
        <div className={DEMO_CARD}>
          <p className="text-sm font-semibold">From left</p>
        </div>
      </SlideIn>
      <SlideIn direction="right" triggerOnView={false}>
        <div className={DEMO_CARD}>
          <p className="text-sm font-semibold">From right</p>
        </div>
      </SlideIn>
      <SlideIn direction="up" triggerOnView={false}>
        <div className={DEMO_CARD}>
          <p className="text-sm font-semibold">From below</p>
        </div>
      </SlideIn>
    </div>
  );
}

function BlurRevealDemo() {
  return (
    <div className="flex items-center justify-center p-10">
      <BlurReveal>
        <p className="text-3xl font-bold">Coming into focus...</p>
      </BlurReveal>
    </div>
  );
}

function MagneticHoverDemo() {
  return (
    <div className="flex items-center justify-center p-16">
      <MagneticHover strength={0.4}>
        <button
          type="button"
          className="rounded-none bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-white"
        >
          Hover me — I follow your cursor
        </button>
      </MagneticHover>
    </div>
  );
}

function TiltCardDemo() {
  return (
    <div className="flex items-center justify-center p-10">
      <TiltCard maxTilt={12} scale={1.03}>
        <div className="w-64 rounded-none border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-lg font-semibold">Tilt Card</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Hover and move your cursor to see the 3D tilt effect
          </p>
        </div>
      </TiltCard>
    </div>
  );
}

function ShimmerButtonDemo() {
  return (
    <div className="flex items-center justify-center p-10">
      <ShimmerButton>Get Started</ShimmerButton>
    </div>
  );
}

function RippleClickDemo() {
  return (
    <div className="flex items-center justify-center p-10">
      <RippleClick>
        <div className="rounded-none bg-[var(--accent)] px-8 py-4 text-center text-sm font-semibold text-white">
          Click anywhere on me
        </div>
      </RippleClick>
    </div>
  );
}

function GlowCardDemo() {
  return (
    <div className="flex items-center justify-center p-10">
      <GlowCard glowColor="#ee502c" glowSize={150}>
        <div className="w-64 rounded-none border border-[var(--border)] bg-[var(--card)] p-6">
          <p className="text-lg font-semibold">Glow Card</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Move your cursor — the glow follows</p>
        </div>
      </GlowCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Text demos
// ---------------------------------------------------------------------------

function TypeWriterDemo() {
  return (
    <div className="flex items-center justify-center p-10">
      <TypeWriter
        text="Building the future of UI components..."
        speed={40}
        cursor
        className="text-xl font-semibold"
      />
    </div>
  );
}

function GradientTextDemo() {
  return (
    <div className="flex items-center justify-center p-10">
      <GradientText className="text-4xl font-bold">AI-Native Motion UI</GradientText>
    </div>
  );
}

function TextRevealDemo() {
  return (
    <div className="p-10">
      <TextReveal
        text="Scroll through this section to reveal each word progressively. The opacity of each word is driven by your scroll position."
        splitBy="word"
        className="text-xl font-medium leading-relaxed"
      />
    </div>
  );
}

function CounterDemo() {
  return (
    <div className="flex items-center justify-center gap-12 p-10">
      <div className="text-center">
        <Counter to={25} className="text-4xl font-bold text-[var(--accent)]" />
        <p className="mt-1 text-sm text-[var(--muted)]">Components</p>
      </div>
      <div className="text-center">
        <Counter to={144} className="text-4xl font-bold text-[var(--accent)]" />
        <p className="mt-1 text-sm text-[var(--muted)]">Tests passing</p>
      </div>
      <div className="text-center">
        <Counter
          to={99.9}
          decimals={1}
          suffix="%"
          className="text-4xl font-bold text-[var(--accent)]"
        />
        <p className="mt-1 text-sm text-[var(--muted)]">Uptime</p>
      </div>
    </div>
  );
}

function SplitTextDemo() {
  return (
    <div className="flex items-center justify-center p-10">
      <SplitText
        text="uiUniverse"
        preset="fadeUp"
        stagger="relaxed"
        className="text-5xl font-bold"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Background demos
// ---------------------------------------------------------------------------

function DotGridDemo() {
  return (
    <div className="relative h-[250px] w-full">
      <DotGrid dotSize={1} gap={20} fade />
      <div className="relative z-10 flex h-full items-center justify-center">
        <p className="text-lg font-semibold text-[var(--muted)]">Dot Grid Background</p>
      </div>
    </div>
  );
}

function GradientMeshDemo() {
  return (
    <div className="relative h-[250px] w-full">
      <GradientMesh colors={["#ee502c", "#f97316", "#8b5cf6", "#06b6d4"]} speed={6} blur={60} />
      <div className="relative z-10 flex h-full items-center justify-center">
        <p className="text-lg font-semibold">Gradient Mesh Background</p>
      </div>
    </div>
  );
}

function ParticlesDemo() {
  return (
    <div className="relative h-[250px] w-full">
      <Particles count={40} speed={0.5} connected maxDistance={120} />
      <div className="relative z-10 flex h-full items-center justify-center">
        <p className="text-lg font-semibold text-[var(--muted)]">Particles Background</p>
      </div>
    </div>
  );
}

function AuroraDemo() {
  return (
    <div className="relative h-[250px] w-full">
      <Aurora colors={["#ee502c90", "#8b5cf680", "#06b6d480"]} speed={4} blur={50} />
      <div className="relative z-10 flex h-full items-center justify-center">
        <p className="text-lg font-semibold">Aurora Background</p>
      </div>
    </div>
  );
}

function GridPatternDemo() {
  return (
    <div className="relative h-[250px] w-full">
      <GridPattern size={28} fade />
      <div className="relative z-10 flex h-full items-center justify-center">
        <p className="text-lg font-semibold text-[var(--muted)]">Grid Pattern Background</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section demos
// ---------------------------------------------------------------------------

function HeroSectionDemo() {
  return (
    <HeroSection
      heading={<h2 className="text-3xl font-bold">Build faster with AI</h2>}
      subheading={<p className="text-[var(--muted)]">Ship premium landing pages in minutes</p>}
      cta={
        <button
          type="button"
          className="rounded-none bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white"
        >
          Get Started
        </button>
      }
    />
  );
}

function FeatureGridDemo() {
  return (
    <FeatureGrid columns={3} stagger="normal" className="px-4 py-6">
      {["Motion Tokens", "AI Descriptors", "Copy-Paste"].map((title) => (
        <div key={title} className={DEMO_CARD}>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">Feature description here</p>
        </div>
      ))}
    </FeatureGrid>
  );
}

function LogoMarqueeDemo() {
  return (
    <div className="flex min-h-[200px] items-center">
      <LogoMarquee speed={20} pauseOnHover>
        {["React", "Next.js", "Tailwind", "Motion", "TypeScript", "Vercel"].map((name) => (
          <span key={name} className="mx-6 text-lg font-semibold text-[var(--muted)]">
            {name}
          </span>
        ))}
      </LogoMarquee>
    </div>
  );
}

function StatsBarDemo() {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <StatsBar
        stats={[
          { value: 25, label: "Components" },
          { value: 144, label: "Tests" },
          { value: 10, label: "Presets", suffix: "+" },
        ]}
      />
    </div>
  );
}

function CTASectionDemo() {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <CTASection
        heading={<h2 className="text-3xl font-bold leading-tight">Ready to ship?</h2>}
        description={
          <p className="text-base leading-relaxed text-[var(--muted)]">
            Start building with AI-native motion components today.
          </p>
        }
        primaryAction={
          <button
            type="button"
            className="rounded-none bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-white"
          >
            Get Started
          </button>
        }
        secondaryAction={
          <button
            type="button"
            className="rounded-none border border-[var(--border)] px-8 py-3 text-sm"
          >
            View Docs
          </button>
        }
        className="py-12"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Demo registry
// ---------------------------------------------------------------------------

const DEMOS: Record<string, () => React.JSX.Element> = {
  // Animations
  FadeUp: FadeUpDemo,
  FadeIn: FadeInDemo,
  ScaleIn: ScaleInDemo,
  SlideIn: SlideInDemo,
  BlurReveal: BlurRevealDemo,
  MagneticHover: MagneticHoverDemo,
  TiltCard: TiltCardDemo,
  ShimmerButton: ShimmerButtonDemo,
  RippleClick: RippleClickDemo,
  GlowCard: GlowCardDemo,
  // Text
  TypeWriter: TypeWriterDemo,
  GradientText: GradientTextDemo,
  TextReveal: TextRevealDemo,
  Counter: CounterDemo,
  SplitText: SplitTextDemo,
  // Backgrounds
  DotGrid: DotGridDemo,
  GradientMesh: GradientMeshDemo,
  Particles: ParticlesDemo,
  Aurora: AuroraDemo,
  GridPattern: GridPatternDemo,
  // Sections
  HeroSection: HeroSectionDemo,
  FeatureGrid: FeatureGridDemo,
  LogoMarquee: LogoMarqueeDemo,
  StatsBar: StatsBarDemo,
  CTASection: CTASectionDemo,
};

export default function PreviewDemos({ name }: PreviewDemosProps) {
  const Demo = DEMOS[name];

  if (!Demo) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-sm text-[var(--muted)]">
          No preview available for <code className="font-mono">{name}</code>
        </p>
      </div>
    );
  }

  return <Demo />;
}
