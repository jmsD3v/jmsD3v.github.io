# Requirements — jms-folio

**Version:** v1
**Date:** 2026-05-04
**Status:** Active

---

## v1 Requirements

### Foundation (FOUND)

- [x] **FOUND-01**: App runs locally with Next.js 15 App Router + TypeScript + Tailwind v4
- [ ] **FOUND-02**: Lenis SmoothScrollProvider wraps the app and syncs with GSAP ticker (`gsap.ticker.lagSmoothing(0)`)
- [ ] **FOUND-03**: LazyMotion AnimationProvider wraps the app with `domAnimation` features + `useReducedMotion` detection
- [ ] **FOUND-04**: `lib/github.ts` fetches GitHub repos server-side with `import 'server-only'` guard and `next: { revalidate: 3600, tags: ['github-repos'] }`
- [ ] **FOUND-05**: `GitHubRepo` interface defined with serializable fields only (no Date instances, no class objects)
- [ ] **FOUND-06**: Centralized animation variants in `components/animations/variants.ts` (fadeInFromLeft, fadeInFromRight, fadeInFromTop, fadeInFromBottom, staggerContainer, glitchReveal)
- [ ] **FOUND-07**: Global CSS `@theme` block defines dark palette (bg black, terminal green accent, off-white text) + glitch `@keyframes`
- [ ] **FOUND-08**: `prefers-reduced-motion` gating via `gsap.matchMedia()` established in foundation — all GSAP animations have a reduced-motion variant
- [x] **FOUND-09**: `.env.local` with `GITHUB_TOKEN` and `GITHUB_USERNAME` documented in `.env.example`
- [x] **FOUND-10**: Git repo with proper `.gitignore` (`.env.local`, `node_modules`, `.next`)

### Hero Section (HERO)

- [ ] **HERO-01**: tsParticles matrix/network background renders in hero (client-only, `ssr: false`, slim bundle)
- [ ] **HERO-02**: Hero title displays glitch effect using pure CSS `@keyframes clip-path` + `transform` (no external glitch lib)
- [ ] **HERO-03**: Terminal typing animation shows dual identity: "Full Stack Dev" → types, pauses, glitches → "& Hacker" appears
- [ ] **HERO-04**: Hero entrance animation uses Framer Motion (`whileInView` / mount animation): name from top, title from left, bio from right
- [ ] **HERO-05**: CTA buttons visible above fold: primary "Ver proyectos" scrolls to #projects, secondary "Contacto" scrolls to #contact
- [ ] **HERO-06**: Hero section is mobile responsive (particles disabled or reduced on mobile viewport)

### Dev Profile Section (DEV)

- [ ] **DEV-01**: DevSection renders with full stack skills grouped by category (Frontend, Backend, Tools, Cloud)
- [ ] **DEV-02**: Tech stack grid animates in with Framer Motion staggerChildren from bottom on scroll enter
- [ ] **DEV-03**: Experience/trajectory section shows relevant dev background
- [ ] **DEV-04**: DevSection CTA: "Contratame para tu proyecto" with mailto link
- [ ] **DEV-05**: All DevSection elements re-animate bidirectionally (scroll down = enter, scroll up = exit + re-enter)

### Hacker Profile Section (HACK)

- [ ] **HACK-01**: HackerSection renders with cybersecurity skills grouped by pentest phase (Recon, Exploitation, Post-Exploitation, Reporting)
- [ ] **HACK-02**: Certifications/badges displayed (even if minimal in v1 — show what exists honestly)
- [ ] **HACK-03**: Tools section lists tools by category (OSINT, Web, Network, Forensics)
- [ ] **HACK-04**: HackTheBox / TryHackMe profile link displayed (proof over claims)
- [ ] **HACK-05**: HackerSection CTA: "Solicitar evaluación de seguridad" with mailto link (pentest-specific, not generic)
- [ ] **HACK-06**: All HackerSection elements animate bidirectionally same as DevSection

### Dev→Hacker Scroll Transition (TRANS)

- [ ] **TRANS-01**: GSAP ScrollTrigger pinned section creates scroll-driven morph between Dev and Hacker profiles
- [ ] **TRANS-02**: Color theme transitions via CSS custom properties during scroll (green → terminal-red/amber or green-cyan)
- [ ] **TRANS-03**: Section heading morphs text ("Developer" → "Hacker") during scroll scrub
- [ ] **TRANS-04**: Transition respects `prefers-reduced-motion` — simplified crossfade instead of scrubbed morph
- [ ] **TRANS-05**: Mobile version uses simplified scroll transition (no pinning — causes UX issues on touch)

### GitHub Projects Section (PROJ)

- [ ] **PROJ-01**: Projects section auto-populates from GitHub API — fetched server-side, passed as props to client component
- [ ] **PROJ-02**: Repos categorized by GitHub topic: `dev`/`fullstack` → Dev filter, `security`/`ctf`/`hacking` → Hacker filter
- [ ] **PROJ-03**: Filter buttons (All / Dev / Hacker) update displayed cards with Framer Motion `AnimatePresence` layout animation
- [ ] **PROJ-04**: Each ProjectCard shows: repo name, description, primary language badge, star count, link to GitHub repo
- [ ] **PROJ-05**: ProjectCards animate in with Framer Motion staggerChildren from bottom on first render
- [ ] **PROJ-06**: "Ver todos en GitHub" link at section bottom

### Contact Section (CONTACT)

- [ ] **CONTACT-01**: Contact section has mailto link (single click, zero friction)
- [ ] **CONTACT-02**: Copy-email-to-clipboard button available
- [ ] **CONTACT-03**: Social links: GitHub, LinkedIn (minimum)
- [ ] **CONTACT-04**: CV/Resume download button

### Performance & Quality (PERF)

- [ ] **PERF-01**: Lighthouse Performance >= 85 on desktop (animations are deferred, particles are lazy-loaded)
- [ ] **PERF-02**: Lighthouse Accessibility >= 90 (contrast ratios WCAG AA, aria labels on interactive elements)
- [ ] **PERF-03**: All glitch animations respect WCAG 2.1 Level A criterion 2.3.1 (no more than 3 flashes/second)
- [ ] **PERF-04**: `ScrollTrigger.refresh()` called in `document.fonts.ready` to prevent position miscalculation after font load
- [ ] **PERF-05**: Section dot navigation allows direct scroll-to for all major sections

---

## v2 Requirements (Deferred)

- Perfil Instalador Físico — diferido por falta de proyectos
- CTF writeups section — diferido hasta tener 3+ writeups publicados
- Contribution heatmap (GraphQL) — complejidad alta / ROI moderado
- Horizontal scroll project slider — complejidad alta
- Blog section — diferido
- Calendar booking link (Calendly / cal.com) — diferido
- Analytics (Plausible / GA) — post-lanzamiento
- `/api/revalidate` on-demand route handler — nice-to-have para refresco inmediato

---

## Out of Scope

- Contact form with backend — spam magnet, complexity sin ROI a esta escala de tráfico
- Three.js / WebGL hero — 300KB+ bundle, mata performance en mobile
- Skill percentage bars — red flag en portfolio reviews
- Tab-based profile switcher — mata la narrativa del scroll
- Splash/preloader screen — pierde visitas antes de mostrar contenido
- Cursor follower con física — laggy en low-end devices
- Audio — intrusivo
- Authentication / CMS — no aplica
- Supabase / DB — no hay datos que persistir

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1: Foundation | Complete (Plan 01) |
| FOUND-02 | Phase 1: Foundation | Pending |
| FOUND-03 | Phase 1: Foundation | Pending |
| FOUND-04 | Phase 1: Foundation | Pending |
| FOUND-05 | Phase 1: Foundation | Pending |
| FOUND-06 | Phase 1: Foundation | Pending |
| FOUND-07 | Phase 1: Foundation | Pending |
| FOUND-08 | Phase 1: Foundation | Pending |
| FOUND-09 | Phase 1: Foundation | Complete (Plan 01) |
| FOUND-10 | Phase 1: Foundation | Complete (Plan 01) |
| HERO-01 | Phase 2: Hero Section | Pending |
| HERO-02 | Phase 2: Hero Section | Pending |
| HERO-03 | Phase 2: Hero Section | Pending |
| HERO-04 | Phase 2: Hero Section | Pending |
| HERO-05 | Phase 2: Hero Section | Pending |
| HERO-06 | Phase 2: Hero Section | Pending |
| DEV-01 | Phase 3: Profile Sections + Scroll Transition | Pending |
| DEV-02 | Phase 3: Profile Sections + Scroll Transition | Pending |
| DEV-03 | Phase 3: Profile Sections + Scroll Transition | Pending |
| DEV-04 | Phase 3: Profile Sections + Scroll Transition | Pending |
| DEV-05 | Phase 3: Profile Sections + Scroll Transition | Pending |
| HACK-01 | Phase 3: Profile Sections + Scroll Transition | Pending |
| HACK-02 | Phase 3: Profile Sections + Scroll Transition | Pending |
| HACK-03 | Phase 3: Profile Sections + Scroll Transition | Pending |
| HACK-04 | Phase 3: Profile Sections + Scroll Transition | Pending |
| HACK-05 | Phase 3: Profile Sections + Scroll Transition | Pending |
| HACK-06 | Phase 3: Profile Sections + Scroll Transition | Pending |
| TRANS-01 | Phase 3: Profile Sections + Scroll Transition | Pending |
| TRANS-02 | Phase 3: Profile Sections + Scroll Transition | Pending |
| TRANS-03 | Phase 3: Profile Sections + Scroll Transition | Pending |
| TRANS-04 | Phase 3: Profile Sections + Scroll Transition | Pending |
| TRANS-05 | Phase 3: Profile Sections + Scroll Transition | Pending |
| PROJ-01 | Phase 4: GitHub Projects Section | Pending |
| PROJ-02 | Phase 4: GitHub Projects Section | Pending |
| PROJ-03 | Phase 4: GitHub Projects Section | Pending |
| PROJ-04 | Phase 4: GitHub Projects Section | Pending |
| PROJ-05 | Phase 4: GitHub Projects Section | Pending |
| PROJ-06 | Phase 4: GitHub Projects Section | Pending |
| CONTACT-01 | Phase 5: Contact + Polish + QA | Pending |
| CONTACT-02 | Phase 5: Contact + Polish + QA | Pending |
| CONTACT-03 | Phase 5: Contact + Polish + QA | Pending |
| CONTACT-04 | Phase 5: Contact + Polish + QA | Pending |
| PERF-01 | Phase 5: Contact + Polish + QA | Pending |
| PERF-02 | Phase 5: Contact + Polish + QA | Pending |
| PERF-03 | Phase 5: Contact + Polish + QA | Pending |
| PERF-04 | Phase 5: Contact + Polish + QA | Pending |
| PERF-05 | Phase 5: Contact + Polish + QA | Pending |

**Total mapped:** 47/47 — 100% coverage

---

*Last updated: 2026-05-04 — roadmap created, traceability expanded to per-requirement rows*
