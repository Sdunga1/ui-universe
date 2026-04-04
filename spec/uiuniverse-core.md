# uiUniverse -- AI-Native Motion UI Components

## What is uiUniverse?
A motion-first React component library where every component ships with a machine-readable descriptor (JSON contract) that AI tools can consume. Components use a tokenized motion system -- not hardcoded animation values.

## Stack Requirements
- React >= 18 (19 recommended)
- Next.js >= 14 (15 recommended)
- Tailwind CSS >= 4
- Motion >= 12 (successor to Framer Motion)
- TypeScript (strict mode)

## Import Paths
```tsx
// Individual components
import { FadeUp, ScaleIn, StaggerGroup } from "@ui-universe/ui";
// Category-specific
import { FadeUp } from "@ui-universe/ui/animations";
import { TypeWriter } from "@ui-universe/ui/text";
import { DotGrid } from "@ui-universe/ui/backgrounds";
import { HeroSection } from "@ui-universe/ui/sections";
// Tokens
import { presets, easing, duration, stagger, distance } from "@ui-universe/tokens";
```

## Motion Token System
All animations use named tokens from `@ui-universe/tokens`. **Never hardcode duration, easing, or distance values.**

### Easing Curves
| Name | Value | Use For |
|------|-------|---------|
| smooth | [0.25, 0.1, 0.25, 1.0] | General UI transitions |
| snappy | [0.6, 0.05, 0.01, 0.9] | Quick interactions |
| dramatic | [0.16, 1, 0.3, 1] | Hero entrances |
| decel | [0.0, 0.0, 0.2, 1.0] | Content reveals |
| spring | [0.34, 1.56, 0.64, 1] | Bouncy effects |
| linear | [0, 0, 1, 1] | Constant-speed motion |

### Durations (ms)
| Name | Value | Use For |
|------|-------|---------|
| instant | 100 | Micro-interactions |
| fast | 200 | Hover states |
| normal | 400 | Standard animations |
| slow | 600 | Entrance animations |
| dramatic | 1000 | Hero reveals |

### Stagger Intervals (ms)
| Name | Value | Use For |
|------|-------|---------|
| tight | 40 | Dense lists |
| normal | 80 | Card grids |
| relaxed | 150 | Section content |
| dramatic | 250 | Hero elements |

### Distances (px)
| Name | Value | Use For |
|------|-------|---------|
| subtle | 8 | Micro-movements |
| normal | 24 | Standard slides |
| pronounced | 48 | Section entrances |
| dramatic | 80 | Full-page slides |

### Motion Presets
Each preset is a complete `{ initial, animate, transition }` object ready to spread into Motion components.

| Name | Effect | Default Duration | Easing |
|------|--------|-----------------|--------|
| fadeIn | Opacity 0->1 | 400ms | smooth |
| fadeUp | Opacity + Y 24px->0 | 400ms | decel |
| fadeDown | Opacity + Y -24px->0 | 400ms | decel |
| fadeLeft | Opacity + X 24px->0 | 400ms | dramatic |
| fadeRight | Opacity + X -24px->0 | 400ms | dramatic |
| scaleIn | Opacity + scale 0.92->1 | 400ms | smooth |
| popIn | Opacity + scale 0.8->1 | 200ms | spring |
| blur | Opacity + blur 8px->0 | 600ms | decel |
| slideUp | Opacity + Y 80px->0 | 600ms | dramatic |
| slideDown | Opacity + Y -80px->0 | 600ms | dramatic |

## Component Categories

### Animations (10 components)
Entrance effects and interactive animations.
- **FadeUp** / **FadeIn** / **ScaleIn** / **SlideIn** / **BlurReveal** -- Viewport-triggered entrance animations
- **MagneticHover** / **TiltCard** / **GlowCard** -- Mouse-following interactive effects
- **ShimmerButton** -- Sweep highlight CTA button
- **RippleClick** -- Material-style click feedback

### Text (5 components)
Animated text effects.
- **TypeWriter** -- Character-by-character reveal
- **GradientText** -- Animated gradient sweep
- **TextReveal** -- Scroll-driven word/line reveal
- **Counter** -- Animated number counting
- **SplitText** -- Per-character stagger animation

### Backgrounds (5 components)
Decorative atmospheric backgrounds.
- **DotGrid** -- Animated dot matrix pattern
- **GradientMesh** -- Multi-color gradient blobs
- **Particles** -- Canvas floating particles (optional connected lines)
- **Aurora** -- Flowing northern lights effect
- **GridPattern** -- SVG grid with fade mask

### Sections (5 components)
Pre-composed page sections (use animations/text/backgrounds internally).
- **HeroSection** -- Full hero with heading/subheading/CTA/visual slots
- **FeatureGrid** -- Responsive staggered card grid
- **LogoMarquee** -- Infinite scrolling logo strip
- **StatsBar** -- Animated counter row
- **CTASection** -- Call-to-action with emphasis

## Component Patterns

1. All components use `"use client"` -- they are client components
2. Motion components accept a `preset` prop for the motion token
3. Most accept `triggerOnView` (default true) and `viewThreshold` (default 0.2)
4. Use `StaggerGroup` to wrap multiple animated components for cascading delays
5. Background components use `absolute inset-0` positioning -- layer behind content in a `relative` parent
6. Section components accept content via named slot props (`heading`, `cta`, `visual`, etc.)
7. All components respect `prefers-reduced-motion` automatically

## Descriptor System
Every component ships with a `.descriptor.json` file located at:
```
packages/ui/src/components/{category}/{slug}/{slug}.descriptor.json
```
Descriptors contain: props (types, defaults, enums), slots, layout info, dependencies, `recommendedWith` pairings, `aiPromptHint`, and code examples.

## Rules for AI Agents
1. **Always use motion tokens** -- never hardcode `duration: 0.4` or `ease: [...]`
2. **Read the descriptor** -- each component has a `.descriptor.json` with exact props, types, and examples
3. **Use recommended compositions** -- descriptors list `recommendedWith` for suggested pairings
4. **Import from @ui-universe/ui** -- not from internal paths
5. **Respect reduced motion** -- components handle this automatically, don't override
6. **Use Tailwind v4 classes** -- not CSS-in-JS or inline styles for layout
7. **Wrap staggered items** -- use `StaggerGroup` for cascading entrance effects
8. **Layer backgrounds correctly** -- always place background components inside a `relative` parent, content in a `relative z-10` sibling
