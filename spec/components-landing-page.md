# uiUniverse -- Landing Page Components

Focused subset for building landing pages. Read `spec/uiuniverse-core.md` for the full token reference.

## Key Components for Landing Pages

### HeroSection
Full hero with named slots: `heading`, `subheading`, `cta`, `visual`.
- `align="center"` (default) -- vertically stacked
- `align="left"` -- split layout, visual on right
- Pair with a background component for atmosphere

### FeatureGrid
Responsive card grid with auto-staggered entrance animations.
- `columns={2|3|4}` -- desktop column count
- `stagger="normal"` -- token name or ms number
- Children auto-wrapped in FadeUp

### Text Animations
- **TypeWriter** -- `text`, `speed`, `cursor`, `loop` props
- **GradientText** -- wrap text in animated gradient
- **Counter** -- animate from 0 to `value` with `duration`

### Backgrounds
All use `absolute inset-0` inside a `relative` parent:
- **Aurora** -- flowing light effect, best on dark bg, `colors`/`speed`/`blur` props
- **GradientMesh** -- organic gradient blobs, `colors`/`speed`/`blur` props
- **DotGrid** -- dot matrix pattern
- **Particles** -- canvas particles with optional line connections

---

## Composition Recipes

### Recipe 1: Aurora Hero with TypeWriter Heading

```tsx
import { HeroSection } from "@ui-universe/ui/sections";
import { Aurora } from "@ui-universe/ui/backgrounds";
import { TypeWriter } from "@ui-universe/ui/text";
import { FadeUp } from "@ui-universe/ui/animations";
import { ShimmerButton } from "@ui-universe/ui/animations";

export function AuroraHero() {
  return (
    <div className="relative min-h-screen bg-black">
      <Aurora
        colors={["#8b5cf640", "#06b6d440", "#ee502c40"]}
        speed={8}
        blur={120}
      />
      <HeroSection
        heading={
          <h1 className="text-6xl font-bold tracking-tight text-white">
            <TypeWriter text="Ship interfaces that move" speed={60} />
          </h1>
        }
        subheading={
          <FadeUp delay={1800}>
            <p className="mx-auto max-w-2xl text-lg text-neutral-400">
              A motion-first component library built for the AI era.
              Every component is machine-readable, every animation is tokenized.
            </p>
          </FadeUp>
        }
        cta={
          <FadeUp delay={2200}>
            <div className="flex gap-4 justify-center">
              <ShimmerButton>Get Started</ShimmerButton>
              <button className="rounded-full border border-neutral-700 px-8 py-3 text-white hover:bg-neutral-900">
                View Docs
              </button>
            </div>
          </FadeUp>
        }
      />
    </div>
  );
}
```

### Recipe 2: GradientMesh Hero with Split Layout

```tsx
import { HeroSection } from "@ui-universe/ui/sections";
import { GradientMesh } from "@ui-universe/ui/backgrounds";
import { GradientText } from "@ui-universe/ui/text";
import { FadeUp, ScaleIn, ShimmerButton } from "@ui-universe/ui/animations";

export function SplitHero() {
  return (
    <div className="relative min-h-screen bg-neutral-950">
      <GradientMesh
        colors={["#3b82f6", "#8b5cf6", "#ec4899"]}
        speed={12}
        blur={100}
        className="opacity-40"
      />
      <HeroSection
        align="left"
        heading={
          <FadeUp>
            <h1 className="text-5xl font-bold text-white">
              Design meets <GradientText>motion</GradientText>
            </h1>
          </FadeUp>
        }
        subheading={
          <FadeUp delay={200}>
            <p className="text-lg text-neutral-400">
              Tokenized animations, machine-readable descriptors,
              and pre-composed sections for modern landing pages.
            </p>
          </FadeUp>
        }
        cta={
          <FadeUp delay={400}>
            <ShimmerButton>Start Building</ShimmerButton>
          </FadeUp>
        }
        visual={
          <ScaleIn delay={300}>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 backdrop-blur">
              <pre className="text-sm text-neutral-300">
                {`import { FadeUp } from "@ui-universe/ui";

<FadeUp preset="fadeUp">
  <Card title="Hello" />
</FadeUp>`}
              </pre>
            </div>
          </ScaleIn>
        }
      />
    </div>
  );
}
```

### Recipe 3: Full Landing Page Skeleton (Hero + Features + CTA)

```tsx
import { HeroSection, FeatureGrid, CTASection } from "@ui-universe/ui/sections";
import { Aurora, DotGrid } from "@ui-universe/ui/backgrounds";
import { FadeUp, GlowCard, ShimmerButton } from "@ui-universe/ui/animations";
import { Counter, GradientText } from "@ui-universe/ui/text";

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <div className="relative min-h-screen bg-black">
        <Aurora />
        <HeroSection
          heading={
            <h1 className="text-6xl font-bold text-white">
              Build with <GradientText>uiUniverse</GradientText>
            </h1>
          }
          subheading={
            <FadeUp delay={300}>
              <p className="text-lg text-neutral-400">
                Motion-first components your AI tools already understand.
              </p>
            </FadeUp>
          }
          cta={
            <FadeUp delay={500}>
              <ShimmerButton>Get Started</ShimmerButton>
            </FadeUp>
          }
        />
      </div>

      {/* Features */}
      <section className="relative bg-neutral-950 py-24">
        <DotGrid className="absolute inset-0 opacity-20" />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <FadeUp>
            <h2 className="mb-12 text-center text-4xl font-bold text-white">
              Why uiUniverse?
            </h2>
          </FadeUp>
          <FeatureGrid columns={3} stagger="normal">
            <GlowCard>
              <h3 className="text-xl font-semibold text-white">Tokenized Motion</h3>
              <p className="text-neutral-400">Named tokens for easing, duration, distance. Zero magic numbers.</p>
            </GlowCard>
            <GlowCard>
              <h3 className="text-xl font-semibold text-white">AI-Readable</h3>
              <p className="text-neutral-400">Every component ships with a JSON descriptor AI agents can consume.</p>
            </GlowCard>
            <GlowCard>
              <h3 className="text-xl font-semibold text-white">Composable Sections</h3>
              <p className="text-neutral-400">Pre-built hero, feature grid, stats, CTA. Slot-based API.</p>
            </GlowCard>
          </FeatureGrid>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-24">
        <FadeUp>
          <CTASection
            heading="Ready to ship?"
            cta={<ShimmerButton>Get Started Free</ShimmerButton>}
          />
        </FadeUp>
      </section>
    </main>
  );
}
```

## Composition Rules
1. Background components go inside a `relative` parent, content siblings need `relative z-10`
2. HeroSection already handles z-indexing internally -- just wrap in a `relative` parent with the background
3. Use `FadeUp` with `delay` to sequence elements within a hero (heading first, subheading second, CTA third)
4. FeatureGrid auto-staggers its children -- no need to manually add FadeUp wrappers inside it
5. Keep Aurora/GradientMesh `opacity` low (0.3-0.5) on non-black backgrounds to avoid washing out text
