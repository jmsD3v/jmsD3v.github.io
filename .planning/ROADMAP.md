# ROADMAP — jms-folio

**Project:** Portfolio Multi-Perfil con Animaciones
**Version:** v1
**Date:** 2026-05-04
**Granularity:** Fine
**Total Requirements:** 30 (FOUND: 10, HERO: 6, DEV: 5, HACK: 6, TRANS: 5, PROJ: 6, CONTACT: 4, PERF: 5)

---

## Phases

- [ ] **Phase 1: Foundation** — Project skeleton, animation infrastructure, GitHub data layer, design tokens
- [ ] **Phase 2: Hero Section** — Above-fold identity reveal with dual Dev/Hacker narrative and particle background
- [ ] **Phase 3: Profile Sections + Scroll Transition** — Dev and Hacker sections with GSAP-driven scroll morph between them
- [ ] **Phase 4: GitHub Projects Section** — Auto-populated project cards from GitHub API with filter UI
- [ ] **Phase 5: Contact + Polish + QA** — Contact section, nav dots, Lighthouse targets, accessibility audit

---

## Phase Details

### Phase 1: Foundation
**Goal**: The project scaffold is fully operational — every animation system, data layer, and design primitive is in place and correctly wired before any UI is built.
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06, FOUND-07, FOUND-08, FOUND-09, FOUND-10

**Success Criteria** (what must be TRUE):
  1. Running `npm run dev` starts the app on localhost with no errors; TypeScript and Tailwind v4 compile cleanly
  2. Scrolling the blank page produces Lenis smooth scroll behavior — no jank, GSAP ticker synced (`gsap.ticker.lagSmoothing(0)`)
  3. A test import of `lib/github.ts` in a Server Component returns typed `GitHubRepo[]` data; importing it from a Client Component throws a build-time error (server-only guard works)
  4. The terminal-green palette and glitch `@keyframes` are visible in the browser via a temporary dev swatch/utility
  5. `gsap.matchMedia()` reduced-motion gate is present and functional — animations are suppressed when the OS `prefers-reduced-motion` flag is set

**Key Tasks**:
  - Scaffold Next.js 15 App Router project with TypeScript strict mode and Tailwind v4 (`@theme` CSS block)
  - Install and configure Lenis (`@studio-freight/lenis`) — wrap `<body>` in `SmoothScrollProvider`, sync with `gsap.ticker`
  - Install and configure Framer Motion `LazyMotion` + `domAnimation` features — create `AnimationProvider` with `useReducedMotion` detection
  - Author `lib/github.ts` with `import 'server-only'`, `GITHUB_TOKEN`/`GITHUB_USERNAME` env vars, 3600s ISR revalidation, and `GitHubRepo` interface (serializable fields only)
  - Create `components/animations/variants.ts` with all six named Framer Motion variants: `fadeInFromLeft`, `fadeInFromRight`, `fadeInFromTop`, `fadeInFromBottom`, `staggerContainer`, `glitchReveal`
  - Establish `gsap.matchMedia()` utility wrapper that gates all GSAP animations — define reduced-motion fallback (opacity only, no movement)
  - Set up `.env.local` + `.env.example`, `.gitignore`, and initialize Git repo

**Plans**: 3 plans — 01-scaffold (DONE), 02-design-tokens, 03-animation-infra

---

### Phase 2: Hero Section
**Goal**: A visitor landing on the page instantly experiences the dual Dev/Hacker identity through an impactful entrance animation, terminal typing effect, and a particle background — all above the fold.
**Depends on**: Phase 1
**Requirements**: HERO-01, HERO-02, HERO-03, HERO-04, HERO-05, HERO-06
**UI hint**: yes

**Success Criteria** (what must be TRUE):
  1. The hero section fills the viewport on load with a visible particle/matrix network background (tsParticles, loaded client-only with `ssr: false`)
  2. The hero title exhibits a CSS-only glitch effect using `clip-path` + `transform` `@keyframes` — no third-party glitch library in the bundle
  3. The terminal typing line cycles visibly: "Full Stack Dev" types out, pauses, glitches, then "& Hacker" appears — readable to a first-time visitor
  4. On page load, the name enters from the top, the title/role enters from the left, and the bio enters from the right — all driven by Framer Motion (not GSAP)
  5. Both CTA buttons ("Ver proyectos" and "Contacto") are above the fold on mobile and desktop, and clicking each scrolls to the correct anchor (`#projects`, `#contact`)
  6. On a mobile viewport (≤768px) particles are either disabled or reduced to ≤30 particles — no visible frame drops

**Key Tasks**:
  - Build `HeroSection` server component shell + `HeroClient` client component boundary
  - Integrate `tsParticles` with dynamic import (`next/dynamic`, `ssr: false`) using matrix/network preset; implement viewport-width check to reduce/disable particles on mobile
  - Implement pure CSS glitch on `<h1>` using `@keyframes` already in global CSS (from FOUND-07) — two pseudo-element layers with `clip-path` timing offset
  - Build terminal typing component: typewriter loop (type → pause → glitch transition → type "& Hacker") using `useEffect` + `useState` or CSS animation
  - Wire Framer Motion entrance animations (`m.div` with `fadeInFromTop`, `fadeInFromLeft`, `fadeInFromRight` variants from FOUND-06) — mount-triggered, not scroll-triggered
  - Add CTA buttons with smooth-scroll `onClick` handlers (Lenis `scrollTo` API) targeting `#projects` and `#contact`
  - Verify mobile layout: test at 375px, 390px, 430px breakpoints; particles conditional render

**Plans**: TBD
**UI hint**: yes

---

### Phase 3: Profile Sections + Scroll Transition
**Goal**: A visitor scrolling through the site experiences the full Dev and Hacker profiles — each with skill grids, experience, and CTAs — connected by a dramatic GSAP-driven scroll morph that changes the visual identity mid-page.
**Depends on**: Phase 2
**Requirements**: DEV-01, DEV-02, DEV-03, DEV-04, DEV-05, HACK-01, HACK-02, HACK-03, HACK-04, HACK-05, HACK-06, TRANS-01, TRANS-02, TRANS-03, TRANS-04, TRANS-05
**UI hint**: yes

**Success Criteria** (what must be TRUE):
  1. The Dev section is visible and complete — skills by category (Frontend, Backend, Tools, Cloud), experience/trajectory text, and a "Contratame" mailto CTA — and all elements animate in from the bottom in staggered sequence when scrolled into view
  2. The Hacker section is visible and complete — skills by pentest phase, certifications/badges, tools by category, HackTheBox/TryHackMe profile link, and a "Solicitar evaluación" mailto CTA — with identical bidirectional animation behavior
  3. The GSAP ScrollTrigger pinned transition zone is visible between the two sections — as the user scrolls through it, the color theme visibly shifts (CSS custom property values change) and the section heading morphs from "Developer" to "Hacker"
  4. Scrolling back up through any animated section causes elements to exit and re-enter correctly (bidirectional) — no elements stuck in animated state on scroll-up
  5. On a device with `prefers-reduced-motion: reduce` set, the pinned morph collapses to a simple crossfade with no scrubbing, and no GSAP movement animations fire
  6. On a mobile viewport (touch device), the pinned ScrollTrigger section is replaced by a simplified scroll transition with no pinning

**Key Tasks**:
  - Build `DevSection` component: skills grid grouped by category, experience text block, mailto CTA — wire `staggerContainer` + `fadeInFromBottom` Framer Motion variants on scroll enter (`whileInView`)
  - Build `HackerSection` component: pentest-phase skill groups, certifications display (honest minimal v1), tools list by category, HTB/THM profile link, pentest-specific mailto CTA
  - Implement bidirectional animation for both sections: use `whileInView` with `viewport={{ once: false }}` so elements animate out on scroll-up exit and re-animate on re-entry
  - Build GSAP ScrollTrigger transition zone between Dev and Hacker sections: pinned container with `scrub: true`, animates CSS custom properties (`--accent-color`, `--section-bg`), text morphs "Developer" → "Hacker" via GSAP `scrambleText` or opacity crossfade of two elements
  - Gate the entire ScrollTrigger scrub block inside `gsap.matchMedia()` — reduced-motion branch: simple `opacity` crossfade only, no pin, no scrub
  - Implement touch/mobile detection: use `ScrollTrigger.isTouch` or `matchMedia('(hover: none)')` to disable pinning on mobile — substitute CSS transition on scroll class toggle
  - Verify Framer Motion and GSAP are never applied to the same DOM element — ScrollTrigger targets wrapper divs, Framer Motion targets inner content elements

**Plans**: TBD
**UI hint**: yes

---

### Phase 4: GitHub Projects Section
**Goal**: A visitor can browse Juan's GitHub repositories filtered by profile (Dev / Hacker / All), with live data fetched at request time — no manual updates required.
**Depends on**: Phase 1 (GitHub data layer)
**Requirements**: PROJ-01, PROJ-02, PROJ-03, PROJ-04, PROJ-05, PROJ-06
**UI hint**: yes

**Success Criteria** (what must be TRUE):
  1. The Projects section auto-populates with real GitHub repos on page load — removing a repo from GitHub causes it to disappear on next page load (within 1 hour ISR window)
  2. Clicking "Dev" filter shows only repos tagged with `dev` or `fullstack` topics; clicking "Hacker" shows only repos tagged `security`, `ctf`, or `hacking`; clicking "All" resets the view — filter transitions animate with Framer Motion `AnimatePresence`
  3. Each project card displays: repo name, description, primary language badge (color-coded), star count, and a working link to the GitHub repo
  4. On first render, project cards animate in from the bottom in a staggered sequence
  5. A "Ver todos en GitHub" link at the bottom of the section points to the GitHub profile and is visible without filtering

**Key Tasks**:
  - Author `ProjectsSection` as a Next.js Server Component — call `lib/github.ts` server-side, pass typed `GitHubRepo[]` props to `ProjectsClient`
  - Build `categorizeRepo(repo: GitHubRepo): 'dev' | 'hacker' | 'other'` utility using topic matching logic
  - Build `ProjectsClient` client component with `useState` for active filter, `AnimatePresence` wrapping the filtered card grid, and layout animation on filter change
  - Build `ProjectCard` component: repo name, description (truncated at 120 chars), language badge with GitHub language color map, star count badge, external link to repo
  - Wire `staggerContainer` + `fadeInFromBottom` Framer Motion variants for initial card render
  - Add "Ver todos en GitHub" footer link using `GITHUB_USERNAME` env var

**Plans**: TBD
**UI hint**: yes

---

### Phase 5: Contact + Polish + QA
**Goal**: The portfolio is complete, performant, and accessible — a visitor can contact Juan in one click, navigate the site via dot nav, and the site passes Lighthouse targets and WCAG checks.
**Depends on**: Phases 1–4
**Requirements**: CONTACT-01, CONTACT-02, CONTACT-03, CONTACT-04, PERF-01, PERF-02, PERF-03, PERF-04, PERF-05
**UI hint**: yes

**Success Criteria** (what must be TRUE):
  1. The contact section provides a one-click mailto link, a working copy-to-clipboard button (shows visual confirmation), social links for GitHub and LinkedIn, and a CV download button — all functional on mobile and desktop
  2. Section dot navigation is visible on the right edge of the viewport, highlights the active section on scroll, and clicking any dot smoothly scrolls to that section
  3. Lighthouse Performance score is ≥ 85 on desktop — particles lazy-load, animations are deferred, font loading does not block render
  4. Lighthouse Accessibility score is ≥ 90 — all interactive elements have `aria-label`, color contrast meets WCAG AA, glitch animations do not exceed 3 flashes per second
  5. `ScrollTrigger.refresh()` is called inside `document.fonts.ready` promise — no layout miscalculations visible after fonts load

**Key Tasks**:
  - Build `ContactSection`: mailto anchor, clipboard copy button with `navigator.clipboard.writeText` + toast/tick feedback, GitHub and LinkedIn icon links, CV PDF download link (`<a href="/cv.pdf" download>`)
  - Build `SectionDotNav` client component: array of section IDs, `IntersectionObserver` to detect active section, Lenis `scrollTo` on dot click — position fixed right edge
  - Add `ScrollTrigger.refresh()` call in a `useEffect` that listens to `document.fonts.ready` (place in the root layout or a dedicated `FontReadyProvider`)
  - Audit glitch `@keyframes` frequency — confirm no more than 3 clip-path changes per second in any animation; adjust timing if needed
  - Run Lighthouse on desktop and mobile: fix any contrast failures (check terminal-green on black), add missing `aria-label` attributes, lazy-load audit for tsParticles and any heavy components
  - Test full scroll journey on real mobile device (or BrowserStack): verify no pinned scroll bugs, no layout shift after fonts, no particle frame drops
  - Final cross-browser check (Chrome, Firefox, Safari) — verify GSAP and Framer Motion coexist with no console errors

**Plans**: TBD
**UI hint**: yes

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 1/3 | In progress | - |
| 2. Hero Section | 0/0 | Not started | - |
| 3. Profile Sections + Scroll Transition | 0/0 | Not started | - |
| 4. GitHub Projects Section | 0/0 | Not started | - |
| 5. Contact + Polish + QA | 0/0 | Not started | - |

---

## Architecture Principles (Non-Negotiable)

These constraints apply across all phases. Any plan that violates them must be revised before implementation.

| Constraint | Rule |
|------------|------|
| GSAP hook | Always use `useGSAP()` hook (from `@gsap/react`) — never `useEffect` for GSAP setup |
| Server-only data | `lib/github.ts` has `import 'server-only'` — never import from a Client Component |
| Animation isolation | Framer Motion and GSAP are never applied to the same DOM element |
| Scroll foundation | `LenisSmoothScrollProvider` must be mounted before any ScrollTrigger animation runs |
| Mobile pinning | GSAP `scrub` pinning is disabled on touch devices (`ScrollTrigger.isTouch === 1`) |
| Reduced motion | `gsap.matchMedia()` gates every GSAP animation — always provide a reduced-motion variant |

---

## Coverage Validation

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Pending |
| FOUND-06 | Phase 1 | Pending |
| FOUND-07 | Phase 1 | Pending |
| FOUND-08 | Phase 1 | Pending |
| FOUND-09 | Phase 1 | Pending |
| FOUND-10 | Phase 1 | Pending |
| HERO-01 | Phase 2 | Pending |
| HERO-02 | Phase 2 | Pending |
| HERO-03 | Phase 2 | Pending |
| HERO-04 | Phase 2 | Pending |
| HERO-05 | Phase 2 | Pending |
| HERO-06 | Phase 2 | Pending |
| DEV-01 | Phase 3 | Pending |
| DEV-02 | Phase 3 | Pending |
| DEV-03 | Phase 3 | Pending |
| DEV-04 | Phase 3 | Pending |
| DEV-05 | Phase 3 | Pending |
| HACK-01 | Phase 3 | Pending |
| HACK-02 | Phase 3 | Pending |
| HACK-03 | Phase 3 | Pending |
| HACK-04 | Phase 3 | Pending |
| HACK-05 | Phase 3 | Pending |
| HACK-06 | Phase 3 | Pending |
| TRANS-01 | Phase 3 | Pending |
| TRANS-02 | Phase 3 | Pending |
| TRANS-03 | Phase 3 | Pending |
| TRANS-04 | Phase 3 | Pending |
| TRANS-05 | Phase 3 | Pending |
| PROJ-01 | Phase 4 | Pending |
| PROJ-02 | Phase 4 | Pending |
| PROJ-03 | Phase 4 | Pending |
| PROJ-04 | Phase 4 | Pending |
| PROJ-05 | Phase 4 | Pending |
| PROJ-06 | Phase 4 | Pending |
| CONTACT-01 | Phase 5 | Pending |
| CONTACT-02 | Phase 5 | Pending |
| CONTACT-03 | Phase 5 | Pending |
| CONTACT-04 | Phase 5 | Pending |
| PERF-01 | Phase 5 | Pending |
| PERF-02 | Phase 5 | Pending |
| PERF-03 | Phase 5 | Pending |
| PERF-04 | Phase 5 | Pending |
| PERF-05 | Phase 5 | Pending |

**Total:** 47/47 requirements mapped — 100% coverage

---

*Last updated: 2026-05-04 — initial roadmap*
