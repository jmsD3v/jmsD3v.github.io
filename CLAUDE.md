# jms-folio — CLAUDE.md

## Project

Portfolio multi-perfil (Dev + Hacker) con animaciones de scroll intensas y proyectos auto-actualizados desde GitHub API.

**Stack:** Next.js 16 App Router · TypeScript 6 (strict) · Tailwind v4 · Framer Motion 14 · GSAP 3.15 + @gsap/react · Lenis 1.3 (versiones exactas en `package.json`)

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
    layout.tsx          # SmoothScrollProvider + AnimationProvider + JSON-LD
    page.tsx            # Arma las secciones
    robots.ts · sitemap.ts
    casos/<slug>/       # Casos de estudio (ver ADR-001)
    globals.css         # @theme palette + @keyframes
  lib/
    github.ts           # server-only — fetch + categorize repos
  types/                # Todos los tipos compartidos (carousel, credentials, github, ...)
  components/
    animations/variants.ts        # Framer Motion variants
    providers/
      AnimationProvider.tsx       # LazyMotion + MotionConfig reducedMotion="user"
      SmoothScrollProvider.tsx    # Lenis + GSAP ticker sync
      FontsReady.tsx              # ScrollTrigger.refresh() al cargar fuentes
    sections/                     # Hero, About, Dev, DevShowcase, Projects, ModeTransition, Hacker, Contact
    ui/                           # PixelBg, carruseles, CredlyBadges, DiplomaHighlight, ProjectCard, SectionDotNav, TerminalText, SiteFooter
```

## Motion — reglas de rendimiento y accesibilidad

- Todo loop (`requestAnimationFrame`, `setInterval`) se pausa cuando su sección sale de pantalla o la pestaña se oculta.
- Todo respeta `prefers-reduced-motion`: Lenis no se monta, los canvas quedan quietos, el título del hero no se mezcla.
- Decisiones documentadas en `docs/ARCHITECTURE.md` (ADRs).

## Anti-Features — Do NOT Build

- Three.js / WebGL hero
- Skill percentage bars
- Tab-based profile switcher
- Contact form with backend
- Splash/preloader screen
- Cursor follower with physics
- Framer Motion + GSAP on same element
