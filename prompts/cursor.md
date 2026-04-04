# uiUniverse Cursor Rules

## Stack
React 18+, Next.js 14+, Tailwind CSS 4+, Motion 12+, TypeScript strict

## Imports
```tsx
import { FadeUp, ScaleIn, ShimmerButton, GlowCard } from "@ui-universe/ui/animations";
import { TypeWriter, GradientText, Counter } from "@ui-universe/ui/text";
import { Aurora, GradientMesh, DotGrid } from "@ui-universe/ui/backgrounds";
import { HeroSection, FeatureGrid, CTASection } from "@ui-universe/ui/sections";
import { presets, easing, duration, stagger, distance } from "@ui-universe/tokens";
```

## Key Patterns
- All components are `"use client"`
- Motion components accept `preset` prop (token name), `triggerOnView`, `viewThreshold`
- Background components: place inside `relative` parent, use `absolute inset-0`
- Content over backgrounds: add `relative z-10`
- Section components use named slot props: `heading`, `subheading`, `cta`, `visual`
- Wrap siblings in `StaggerGroup` for cascading entrances
- `FeatureGrid` auto-staggers children -- no manual FadeUp needed inside

## Motion Tokens (never hardcode values)
- **Easing**: smooth, snappy, dramatic, decel, spring, linear
- **Duration**: instant(100), fast(200), normal(400), slow(600), dramatic(1000)
- **Stagger**: tight(40), normal(80), relaxed(150), dramatic(250)
- **Distance**: subtle(8), normal(24), pronounced(48), dramatic(80)
- **Presets**: fadeIn, fadeUp, fadeDown, fadeLeft, fadeRight, scaleIn, popIn, blur, slideUp, slideDown

## Descriptors
Each component has a JSON descriptor at:
```
packages/ui/src/components/{category}/{slug}/{slug}.descriptor.json
```
Read it for exact props, types, defaults, `recommendedWith`, and examples.

## Rules
- Use motion tokens from `@ui-universe/tokens`, never raw numbers
- Import from `@ui-universe/ui` or `@ui-universe/ui/{category}`
- Use Tailwind v4 for layout, not CSS-in-JS
- Components auto-handle `prefers-reduced-motion`
