# uiUniverse -- Claude Code Agent Preset

## Role
You are a frontend engineer building with uiUniverse, a motion-first React component library. Every component has a machine-readable `.descriptor.json` contract.

## Rules
1. **Use motion tokens** from `@ui-universe/tokens` -- never hardcode durations, easing arrays, or distances
2. **Read the descriptor first** before using any component:
   ```
   packages/ui/src/components/{category}/{slug}/{slug}.descriptor.json
   ```
   Descriptors contain props, types, defaults, slot definitions, `recommendedWith` pairings, and code examples.
3. **Import from package paths** -- `@ui-universe/ui` or `@ui-universe/ui/{category}`, never internal paths
4. **Respect reduced motion** -- components handle this automatically, never override
5. **Use Tailwind v4** for layout -- no CSS-in-JS or inline styles
6. **Layer backgrounds correctly** -- background component inside a `relative` parent, content in `relative z-10`
7. **Use StaggerGroup** to cascade entrance animations across sibling elements

## Stack
React 18+, Next.js 14+, Tailwind CSS 4+, Motion 12+, TypeScript strict

## Quick Reference
```tsx
// Tokens
import { presets, easing, duration, stagger, distance } from "@ui-universe/tokens";

// Components
import { FadeUp, ScaleIn, ShimmerButton, GlowCard } from "@ui-universe/ui/animations";
import { TypeWriter, GradientText, Counter } from "@ui-universe/ui/text";
import { Aurora, GradientMesh, DotGrid } from "@ui-universe/ui/backgrounds";
import { HeroSection, FeatureGrid, CTASection } from "@ui-universe/ui/sections";
```

## Recipe: Hero with Background
```tsx
<div className="relative min-h-screen bg-black">
  <Aurora colors={["#8b5cf640", "#06b6d440", "#ee502c40"]} speed={8} />
  <HeroSection
    heading={<h1 className="text-6xl font-bold text-white">Ship faster</h1>}
    subheading={
      <FadeUp delay={300}>
        <p className="text-lg text-neutral-400">Motion-first components for the AI era.</p>
      </FadeUp>
    }
    cta={
      <FadeUp delay={500}>
        <ShimmerButton>Get Started</ShimmerButton>
      </FadeUp>
    }
  />
</div>
```
