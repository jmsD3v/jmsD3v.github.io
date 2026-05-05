# STATE — jms-folio

**Last updated:** 2026-05-05
**Session:** Phase 1 Plan 01 — Project Scaffold (completed)

---

## Project Reference

**Core value:** Portfolio multi-perfil (Dev + Hacker) con animaciones de scroll de alta calidad y proyectos auto-actualizados desde GitHub API.

**Stack:** Next.js 15 App Router + TypeScript + Tailwind v4 + Framer Motion + GSAP/ScrollTrigger + Lenis

**Aesthetic:** Dark hacker + dev — negro/verde terminal, glitch effects, cyber vibes

---

## Current Position

**Current phase:** 1 (Foundation — in progress)
**Current plan:** 01 complete, moving to Plan 02
**Status:** Phase 1 Plan 01 complete

**Progress bar:**
```
Phase 1 [###       ] 33%
Phase 2 [          ] 0%
Phase 3 [          ] 0%
Phase 4 [          ] 0%
Phase 5 [          ] 0%
```

**Overall:** 0/5 phases complete (Phase 1 in progress: 1/3 plans done)

---

## Phase Status

| Phase | Status | Plans Done | Started | Completed |
|-------|--------|------------|---------|-----------|
| 1. Foundation | In progress | 1/3 | 2026-05-05 | - |
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

| Plan | Phase | Duration | Tasks | Files |
|------|-------|----------|-------|-------|
| 01-scaffold | 01-foundation | 29 min | 3/3 | 16 created |

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
- **create-next-app workaround:** When project dir has existing files, scaffold in temp dir and copy. Expected behavior on Windows.

### Key File Locations

- `package.json` — all dependencies at pinned exact versions
- `tsconfig.json` — TypeScript strict mode, @/* alias
- `postcss.config.mjs` — Tailwind v4 PostCSS adapter
- `next.config.ts` — reactStrictMode: true
- `.gitignore` — protects .env.local and build artifacts
- `.env.example` — documents GITHUB_TOKEN and GITHUB_USERNAME
- `.env.local` — gitignored, contains jmsD3v username, placeholder token
- `src/app/layout.tsx` — root layout (to be updated in Plan 02)
- `src/app/page.tsx` — root page (to be updated in later plans)
- `lib/github.ts` — (to be created in Plan 03)
- `components/animations/variants.ts` — (to be created in Plan 02/03)
- `providers/SmoothScrollProvider.tsx` — (to be created in Plan 03)
- `providers/AnimationProvider.tsx` — (to be created in Plan 03)
- `app/globals.css` — (to be updated in Plan 02 with @theme and glitch @keyframes)

### Open Questions / Todos

- None

### Blockers

- None

---

## Decisions Made

1. Used temp directory workaround for create-next-app (can't scaffold into dir with existing files)
2. postcss.config.mjs uses object format `{ "@tailwindcss/postcss": {} }` — v4 syntax, no tailwind.config file
3. Package versions pinned exact (no caret) for animation libraries to prevent silent breaking upgrades
4. GITHUB_USERNAME set to jmsD3v in .env.local

---

## Session Continuity

**To resume work:**
1. Read this STATE.md for current position
2. Read `.planning/ROADMAP.md` for phase details and success criteria
3. Execute Plan 02: `01-PLAN-design-tokens.md` (or similar)

**Next action:** Execute Phase 1 Plan 02 (design tokens / CSS theme)

**Stopped at:** Completed Phase 1 Plan 01 (01-scaffold)

---

*Last updated: 2026-05-05 — Plan 01 complete*
