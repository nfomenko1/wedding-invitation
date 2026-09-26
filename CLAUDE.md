# Wedding Invitation

A custom, highly animated, one-page interactive wedding invitation website.

## Stack

- React + Vite (JavaScript, no TypeScript)
- GSAP + ScrollTrigger for animation
- Lenis for smooth scrolling

Commands: `npm run dev`, `npm run build`, `npm run preview`.

## Project rules

- This is a **custom** wedding invitation website. Do not turn it into a generic template.
- Do not make visual/design decisions (colors, fonts, copy, layout, sections, animations) unless explicitly requested.
- Do not change the architecture without a reason.
- Prefer reusable React components.
- Keep animations performant: animate `transform` and `opacity`, avoid layout-triggering properties, clean up on unmount.
- Use GSAP / ScrollTrigger for complex animations.
- Use Lenis for smooth scrolling.
- Always consider desktop, tablet and mobile behavior.
- Respect `prefers-reduced-motion`.
- Do not install unnecessary dependencies.

## Structure

```
src/
  main.jsx                  App entry; wraps App in SmoothScrollProvider
  App.jsx                   Root component
  assets/                   Images, fonts, media imported by code
  components/               Reusable UI components (Section, SectionMarker, SectionHeading,
                            ImageFrame, Veil, Button, TextField, ChoiceGroup, Split)
  sections/                 One-page sections, in page order: Hero, Invitation, Story,
                            Schedule, Location, DressCode, Details, Rsvp, Finale
  content/
    wedding.js              All copy and data; sections only render it
  hooks/
    useGsap.js              gsap.context() scoped to a ref, auto-reverted on unmount
    useMotion.js            useGsap + gsap.matchMedia() with MEDIA conditions
    useLenis.js             Access the global Lenis instance (null when disabled)
    useScrollTo.js          Scroll to a target via Lenis (native fallback) and focus it
    usePrefersReducedMotion.js
  lib/
    gsap.js                 Registers plugins; exports gsap, ScrollTrigger, MEDIA queries
  providers/
    SmoothScrollProvider.jsx  Single Lenis instance driven by gsap.ticker
    LenisContext.js
  styles/
    index.css               Global entry (imports lenis.css, reset, base, theme)
    reset.css               CSS reset
    base.css                Structural base styles, breakpoints, reduced-motion rules
    theme.css               Neutral blueprint tokens (colors, fonts, type scale) + type classes
public/                     Static files served as-is
```

## Conventions

- Import `gsap` and `ScrollTrigger` from `src/lib/gsap.js`, never directly from `gsap`, so plugins are registered once.
- Create animations inside `useGsap()` (or a `gsap.context()`) so they are cleaned up on unmount.
- Use `gsap.matchMedia()` with `MEDIA` from `lib/gsap.js` for breakpoint-specific and reduced-motion-specific animations.
- Only one Lenis instance exists (in `SmoothScrollProvider`). Do not create others; use `useLenis()`.
- Under reduced motion Lenis is disabled (native scroll) and CSS animations/transitions are neutralised; GSAP animations must provide a reduced or static alternative.
- Breakpoints (mobile-first): mobile `< 768px`, tablet `768px to 1023px`, desktop `>= 1024px`. Keep `base.css` and `MEDIA` in sync.
