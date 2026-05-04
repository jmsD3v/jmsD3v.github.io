# jms-folio — CLAUDE.md

## Project

Portfolio multi-perfil (Dev + Hacker) con animaciones de scroll intensas y proyectos auto-actualizados desde GitHub API.

**Stack:** Next.js 15 App Router · TypeScript (strict) · Tailwind v4 · Framer Motion 12.38.0 · GSAP 3.15.0 + @gsap/react · Lenis 1.3.23 · tsParticles slim

## GSD Workflow

This project uses the GSD planning system. Before making changes:

```bash
cat .planning/STATE.md      # current phase and status
cat .planning/ROADMAP.md    # full phase plan
```

Run phases with: `/gsd-plan-phase N` → `/gsd-execute-phase N`

## Architecture — Non-Negotiable Rules

| Rule | Details |
|------|---------|
| GSAP hook | `useGSAP()` only — never `useEffect` for GSAP |
| Server-only | `lib/github.ts` has `import 'server-only'` — never import from client components |
| Animation isolation | Framer Motion and GSAP never on the same DOM element |
| Scroll foundation | `SmoothScrollProvider` (Lenis) must mount before any ScrollTrigger runs |
| Mobile | GSAP pin/scrub disabled on touch (`ScrollTrigger.isTouch === 1`) |
| Reduced motion | `gsap.matchMedia()` gates all GSAP — always include reduced-motion variant |

## Animation Ownership Split

- **Framer Motion** → `whileInView`, `AnimatePresence`, hover states, component entry/exit
- **GSAP ScrollTrigger** → pinned Dev→Hacker morph, scrubbed parallax, scroll timelines

## Key Patterns

```ts
// GitHub fetch — server-only, ISR
// lib/github.ts
import 'server-only'
fetch(url, { next: { revalidate: 3600, tags: ['github-repos'] } })

// GSAP — always useGSAP, always with scope
const containerRef = useRef(null)
useGSAP(() => {
  gsap.to('.element', { ... })
}, { scope: containerRef })

// Framer Motion — LazyMotion + m components
import { LazyMotion, domAnimation, m } from 'framer-motion'
// Use m.div instead of motion.div
```

## File Structure

```
src/
  app/
    layout.tsx          # SmoothScrollProvider + AnimationProvider
    page.tsx            # Server Component — GitHub fetch + section assembly
    globals.css         # @theme palette + glitch @keyframes
  lib/
    github.ts           # server-only — fetch + categorize repos
    types.ts            # GitHubRepo interface (serializable only)
  components/
    animations/
      variants.ts       # Framer Motion variants (fadeInFrom*, staggerContainer)
    providers/
      AnimationProvider.tsx   # LazyMotion + useReducedMotion
      SmoothScrollProvider.tsx # Lenis + GSAP ticker sync
    sections/
      HeroSection.tsx
      DevSection.tsx
      HackerSection.tsx
      ProjectsSection.tsx
      ContactSection.tsx
    ui/
      ProjectCard.tsx
      SectionDotNav.tsx
      GlitchText.tsx
      TerminalText.tsx
      ParticleField.tsx
```

## Anti-Features — Do NOT Build

- Three.js / WebGL hero
- Skill percentage bars
- Tab-based profile switcher
- Contact form with backend
- Splash/preloader screen
- Cursor follower with physics
- Framer Motion + GSAP on same element
