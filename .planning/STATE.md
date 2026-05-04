# STATE — jms-folio

**Last updated:** 2026-05-04
**Session:** Initial roadmap creation

---

## Project Reference

**Core value:** Portfolio multi-perfil (Dev + Hacker) con animaciones de scroll de alta calidad y proyectos auto-actualizados desde GitHub API.

**Stack:** Next.js 15 App Router + TypeScript + Tailwind v4 + Framer Motion + GSAP/ScrollTrigger + Lenis

**Aesthetic:** Dark hacker + dev — negro/verde terminal, glitch effects, cyber vibes

---

## Current Position

**Current phase:** 0 (pre-implementation — roadmap created, no code written)
**Current plan:** None
**Status:** Ready to begin Phase 1

**Progress bar:**
```
Phase 1 [          ] 0%
Phase 2 [          ] 0%
Phase 3 [          ] 0%
Phase 4 [          ] 0%
Phase 5 [          ] 0%
```

**Overall:** 0/5 phases complete

---

## Phase Status

| Phase | Status | Plans Done | Started | Completed |
|-------|--------|------------|---------|-----------|
| 1. Foundation | Not started | 0/0 | - | - |
| 2. Hero Section | Not started | 0/0 | - | - |
| 3. Profile Sections + Scroll Transition | Not started | 0/0 | - | - |
| 4. GitHub Projects Section | Not started | 0/0 | - | - |
| 5. Contact + Polish + QA | Not started | 0/0 | - | - |

---

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Performance (desktop) | >= 85 | - |
| Lighthouse Accessibility | >= 90 | - |
| Glitch flash rate | <= 3/sec | - |
| Mobile scroll FPS | ~60fps | - |

---

## Accumulated Context

### Architecture Decisions (Locked)

- **GSAP hook:** Always `useGSAP()` from `@gsap/react` — never `useEffect` for GSAP setup. Cleanup is automatic.
- **Server-only data layer:** `lib/github.ts` uses `import 'server-only'` — build fails if imported from a Client Component.
- **Animation isolation rule:** Framer Motion and GSAP must never target the same DOM element. GSAP owns wrapper/container transforms; Framer Motion owns inner content elements.
- **Scroll foundation order:** `LenisSmoothScrollProvider` must be mounted and running before any `ScrollTrigger` animation is registered. Place Lenis at root layout level.
- **Mobile pinning policy:** `ScrollTrigger` scrub + pin is disabled on touch devices. Detect via `ScrollTrigger.isTouch === 1` or `matchMedia('(hover: none)')`. Substitute CSS class-based transition.
- **Reduced-motion gate:** Every GSAP animation is wrapped in `gsap.matchMedia()`. Reduced-motion branch provides opacity-only fallback (no translate, no scrub, no pin).
- **tsParticles loading:** Dynamic import with `next/dynamic` and `ssr: false`. Particle count reduced to ≤30 on mobile viewport.
- **GitHub data:** Fetched server-side in a Server Component, passed as serializable props to Client Components. `GitHubRepo` interface has no Date instances or class objects.
- **ISR strategy:** GitHub repos revalidate every 3600 seconds with `next: { revalidate: 3600, tags: ['github-repos'] }`.

### Key File Locations (to be created in Phase 1)

- `lib/github.ts` — server-only GitHub API fetch
- `components/animations/variants.ts` — all Framer Motion named variants
- `providers/SmoothScrollProvider.tsx` — Lenis wrapper
- `providers/AnimationProvider.tsx` — LazyMotion + useReducedMotion
- `app/globals.css` — `@theme` block, glitch `@keyframes`
- `.env.local` / `.env.example` — GITHUB_TOKEN, GITHUB_USERNAME

### Open Questions / Todos

- None at roadmap stage — requirements are finalized

### Blockers

- None

---

## Session Continuity

**To resume work:**
1. Read this STATE.md for current position
2. Read `.planning/ROADMAP.md` for phase details and success criteria
3. Run `/gsd-plan-phase {N}` where N is the next phase number

**Next action:** `/gsd-plan-phase 1` — plan Phase 1 (Foundation)

---

*Initialized: 2026-05-04 — roadmap created, 5 phases, 47 requirements*
