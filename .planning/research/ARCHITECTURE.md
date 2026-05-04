# Architecture Patterns

**Project:** jms-folio — Animated Multi-Profile Portfolio
**Researched:** 2026-05-04
**Confidence:** HIGH (Next.js 15 official docs + Framer Motion patterns + GSAP integration knowledge)

---

## Recommended Architecture

A single-page application using Next.js 15 App Router where `app/page.tsx` is a **Server Component orchestrator** that fetches GitHub data and renders a vertical stack of sections. Each section is a **Client Component island** responsible for its own animation. A thin context layer distributes scroll state. The GitHub data travels top-down as props — server fetches it, passes serializable data to client boundaries.

```
app/
  layout.tsx          ← Server: font, metadata, ThemeProvider wrapper
  page.tsx            ← Server: GitHub fetch, section orchestration, Suspense boundaries
  loading.tsx         ← Streaming fallback

components/
  providers/          ← Client: animation context, scroll context
  sections/           ← Client: Hero, Dev, Hacker, Projects, Contact
  ui/                 ← Shared: ProjectCard, SkillBadge, GlitchText, ParticleField
  animations/         ← Client: animation variants, hooks, ScrollTrigger wrapper

lib/
  github.ts           ← Server-only: fetch + cache logic
  types.ts            ← Shared: TypeScript interfaces
```

---

## Component Boundaries

### What MUST be 'use client'

| Component | Why |
|-----------|-----|
| All `sections/*` | Framer Motion `motion.*` requires browser APIs + React state |
| `providers/AnimationProvider` | React context is client-only |
| `providers/ScrollProvider` | `useScroll` (Framer), GSAP ScrollTrigger need window |
| `ui/GlitchText` | CSS animation triggers on mount via useEffect |
| `ui/ParticleField` | Canvas API, requestAnimationFrame |
| `ui/ProjectCard` | hover states, filter interaction |
| `components/animations/*` | All animation hooks use browser APIs |

### What stays Server Component

| Component | Why | Benefit |
|-----------|-----|---------|
| `app/page.tsx` | GitHub fetch + section assembly | Zero JS for data layer |
| `app/layout.tsx` | Metadata, fonts, static shell | Faster FCP |
| `lib/github.ts` | API token never reaches client | Security |
| Section **wrappers** in page.tsx | Just import and pass props | Reduces client bundle |

### The Key Rule

Mark `'use client'` at the **leaf boundary** — the first component that uses motion/state/browser APIs — not at the section container level if the container itself is just layout. In practice for this project, every section IS an animated component, so every `sections/*` file gets `'use client'`.

Framer Motion's `motion` import and GSAP's `ScrollTrigger` both access the DOM, making them impossible to run in a Server Component.

---

## Data Flow: GitHub API

```
GitHub REST API
      │
      ▼
lib/github.ts                    ← server-only module
  fetchRepos()                   ← fetch() with next.tags + revalidate
      │
      ▼
app/page.tsx (Server Component)  ← async, awaits fetchRepos()
  <Suspense fallback={<ProjectsSkeleton />}>
    <ProjectsSection repos={repos} />   ← props boundary (serializable data only)
  </Suspense>
      │
      ▼
components/sections/ProjectsSection.tsx  'use client'
  receives: repos: GitHubRepo[]
  owns: filter state (dev/hacker/all)
  renders: <ProjectCard /> per repo
```

### Caching Strategy

Use time-based revalidation via `next.revalidate` on the fetch call. GitHub repo data does not need to be real-time — 1 hour is appropriate. Tag the fetch for on-demand invalidation if a webhook or manual refresh is ever added.

```typescript
// lib/github.ts
import 'server-only'

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      next: {
        revalidate: 3600,          // 1 hour time-based
        tags: ['github-repos'],    // on-demand via revalidateTag('github-repos')
      },
    }
  )
  if (!res.ok) throw new Error('GitHub API failed')
  return res.json()
}
```

The `GitHubRepo` type passed across the server/client boundary must contain only JSON-serializable primitives — no Date objects, no class instances. Map API response to a clean interface before passing.

### Categorization Logic

Categorize repos server-side (in `lib/github.ts`) using GitHub topics. Never send raw API response to client — strip it down to the fields the UI needs.

```typescript
export type RepoCategory = 'dev' | 'hacker' | 'other'

export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  language: string | null
  topics: string[]
  category: RepoCategory
  stars: number
  updated_at: string
}

const HACKER_TOPICS = ['security', 'ctf', 'pentesting', 'cybersecurity', 'hacking', 'python']

function categorize(topics: string[]): RepoCategory {
  if (topics.some(t => HACKER_TOPICS.includes(t))) return 'hacker'
  if (topics.length > 0) return 'dev'
  return 'other'
}
```

---

## Animation Architecture

### Core Decision: Framer Motion vs GSAP per Use Case

| Use Case | Tool | Reason |
|----------|------|--------|
| Section entry animations (slide in from sides) | Framer Motion `whileInView` | Declarative, React-native, handles bidirectional via `initial` reset |
| Typing / text reveal effects | Framer Motion `staggerChildren` | Clean character-by-character sequencing |
| Hero parallax background (particle field) | GSAP + ScrollTrigger | Precise timeline control, better performance for continuous scroll-driven motion |
| Profile transition (dramatic mid-scroll swap) | GSAP ScrollTrigger + `scrub` | Pinned sections with scroll-scrubbed progress don't map cleanly to Framer |
| Card hover states | Framer Motion `whileHover` | Trivial, declarative |
| Glitch effects (CSS-based) | CSS `@keyframes` + Framer trigger | Glitch is periodic, not scroll-tied; fire on inView |

**Rule:** Framer Motion owns component-level, in-view, and hover animations. GSAP ScrollTrigger owns scroll-scrubbed, pinned, or timeline-sequenced effects that require precise progress values.

### Animation Variants Pattern

Centralize reusable animation configs in `components/animations/variants.ts`. Every animated section imports from this single file — consistency is how you get a coherent aesthetic across profiles.

```typescript
// components/animations/variants.ts
import { Variants } from 'framer-motion'

export const fadeInFromLeft: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const fadeInFromRight: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const fadeInFromBottom: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export const glitchReveal: Variants = {
  hidden: { opacity: 0, skewX: 10 },
  visible: { opacity: 1, skewX: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}
```

### Bidirectional Scroll (animate on scroll up AND down)

Framer Motion's `whileInView` with `viewport={{ once: false }}` handles bidirectionality. The key is setting `initial="hidden"` on the motion element so it resets when it leaves the viewport.

```typescript
// components/sections/DevSection.tsx
'use client'
import { motion } from 'framer-motion'
import { fadeInFromLeft } from '@/components/animations/variants'

export function DevSection() {
  return (
    <motion.section
      variants={fadeInFromLeft}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}  // re-animate every time
    >
      {/* content */}
    </motion.section>
  )
}
```

### GSAP ScrollTrigger Setup

GSAP must be initialized inside a `useEffect` inside a `'use client'` component. Never import GSAP at the module level in a file that might be used server-side.

```typescript
// components/animations/useScrollTrigger.ts
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)  // register once, at module level is fine in client files

export function useProfileTransition(containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        onEnter: () => { /* switch to hacker aesthetic */ },
        onLeaveBack: () => { /* revert to dev aesthetic */ },
      })
    }, containerRef)

    return () => ctx.revert()  // critical: cleanup on unmount
  }, [containerRef])
}
```

The `gsap.context()` + `ctx.revert()` pattern is mandatory to prevent ScrollTrigger memory leaks in React's StrictMode double-invoke.

### Intersection Observer vs GSAP ScrollTrigger

- **Framer `whileInView`** uses IntersectionObserver internally. Use it for: enter/exit animations with discrete states (hidden → visible).
- **GSAP ScrollTrigger** uses native scroll events. Use it for: continuous progress-mapped effects, pinned sections, scrubbed parallax.
- **Never mix both on the same element** — they will fight for control.

---

## Component Structure

### Section Components

Each section is a self-contained client component owning its animation, layout, and content.

```
components/sections/
  HeroSection.tsx       ← Particle BG + dual identity title + CTA
  DevSection.tsx        ← Full-stack skills, stack grid, experience timeline
  HackerSection.tsx     ← Cybersec skills, certs, tools — different visual language
  ProjectsSection.tsx   ← Receives repos[], owns filter state
  ContactSection.tsx    ← Links, email, social

components/ui/
  ProjectCard.tsx       ← Receives single GitHubRepo, handles hover
  SkillBadge.tsx        ← Animated tag for skills/tools
  GlitchText.tsx        ← Text with glitch CSS effect, triggered on inView
  ParticleField.tsx     ← Canvas particle background (Hero)
  SectionNav.tsx        ← Fixed dot navigation, tracks active section
  TerminalText.tsx      ← Typing animation component

components/animations/
  variants.ts           ← All Framer Motion variant configs
  useScrollTrigger.ts   ← GSAP ScrollTrigger custom hooks
  useGlitch.ts          ← Glitch effect timing hook
  AnimationProvider.tsx ← 'use client' context for global animation state

components/providers/
  AnimationProvider.tsx ← reducedMotion detection, global animation on/off
```

### Page Assembly (Server Component)

```typescript
// app/page.tsx
import { Suspense } from 'react'
import { fetchGitHubRepos } from '@/lib/github'
import { HeroSection } from '@/components/sections/HeroSection'
import { DevSection } from '@/components/sections/DevSection'
import { HackerSection } from '@/components/sections/HackerSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { ProjectsSkeleton } from '@/components/ui/ProjectsSkeleton'

export default async function Page() {
  const repos = await fetchGitHubRepos('juanmanuelsilva')   // server fetch

  return (
    <main>
      <HeroSection />
      <DevSection />
      <HackerSection />
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsSection repos={repos} />
      </Suspense>
      <ContactSection />
    </main>
  )
}
```

---

## Performance Architecture

### Lazy Loading Sections

Use dynamic imports for heavy client sections to split the JS bundle. The hero loads eagerly; below-fold sections load on demand.

```typescript
// app/page.tsx
import dynamic from 'next/dynamic'

const HackerSection = dynamic(
  () => import('@/components/sections/HackerSection'),
  { ssr: false }  // pure client animation, no SSR value
)

const ProjectsSection = dynamic(
  () => import('@/components/sections/ProjectsSection'),
  { loading: () => <ProjectsSkeleton /> }
)
```

Use `ssr: false` only for components that would error during SSR (e.g., direct `window` access outside useEffect). Framer Motion handles SSR fine — prefer `ssr: true` (default) for sections that benefit from static HTML in the initial payload.

### Suspense Boundaries

Wrap the GitHub data section in Suspense so the rest of the page streams immediately. The skeleton shows while the fetch resolves, not a blank page.

```
Page streams:
  [1] Hero (immediate — no data dependency)
  [2] DevSection (immediate)
  [3] HackerSection (immediate)
  [4] <Suspense> → ProjectsSkeleton → ProjectsSection (after fetch)
  [5] ContactSection (immediate)
```

### Image Optimization

All images go through `next/image` with explicit `width`/`height`. For the dark aesthetic, most visuals are CSS/canvas-based (particles, glitch), reducing image dependency. Where avatars or project screenshots appear, use `priority` only on the hero image.

### LazyMotion (Framer Motion Bundle Splitting)

Import `LazyMotion` from Framer Motion to load animation features on demand instead of the full library upfront. This reduces initial JS significantly.

```typescript
// app/layout.tsx or providers/AnimationProvider.tsx
'use client'
import { LazyMotion, domAnimation } from 'framer-motion'

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
```

With `LazyMotion`, use `m` instead of `motion` in components:

```typescript
import { m } from 'framer-motion'
// <m.div> instead of <motion.div>
```

This change drops ~30KB from the initial bundle.

### 60fps Strategy

- GSAP animations: use `will-change: transform` via CSS on scroll-animated elements. GSAP applies this automatically when `force3D: true` (its default).
- Framer Motion: keep animated properties to `transform` and `opacity` only — never animate `width`, `height`, or `margin` (causes layout recalculation).
- Particle field: use `requestAnimationFrame` with a canvas element, not DOM manipulation. Cap to 60fps with a delta-time check.
- `prefers-reduced-motion`: wrap all animation providers with a check. Users with this system preference should get instant transitions.

---

## Scalability Considerations

| Concern | Current (v1) | v2 (Instalador profile) |
|---------|--------------|------------------------|
| Profile sections | 2 profiles hardcoded | Add `InstaladorSection` as new section file, no architectural change |
| Project filtering | Client-side filter on ~30 repos | Client-side fine until >200 repos |
| GitHub API rate limit | 5000/hr authenticated | Single fetch per page load + 1hr cache = trivial usage |
| Animation performance | Single page, ~5 sections | Add route transitions if multi-page ever needed |

---

## Build Order

Build in this sequence. Each step is independently testable before the next begins.

**Phase 1: Foundation**
1. `app/layout.tsx` — font setup, metadata, base dark background CSS
2. `lib/github.ts` + `lib/types.ts` — data layer, test with console.log in page.tsx
3. `components/animations/variants.ts` — define all animation configs before any component uses them
4. `components/providers/AnimationProvider.tsx` — LazyMotion + reducedMotion setup

**Phase 2: Static Sections (no data dependency)**
5. `components/sections/HeroSection.tsx` — most complex visually, validate animation pipeline works
6. `components/ui/GlitchText.tsx` + `TerminalText.tsx` — reusable primitives Hero needs
7. `components/ui/ParticleField.tsx` — canvas particle background
8. `components/sections/DevSection.tsx` — skills, stack, standard scroll animations
9. `components/sections/HackerSection.tsx` — reuses animation patterns from Dev, different content

**Phase 3: Data-driven Section**
10. `components/ui/ProjectCard.tsx` — receives GitHubRepo, pure presentational
11. `components/sections/ProjectsSection.tsx` — filter state + card grid
12. Wire `app/page.tsx` with real GitHub fetch + Suspense boundary

**Phase 4: Polish**
13. `components/ui/SectionNav.tsx` — dot navigation, needs all sections to exist first
14. GSAP ScrollTrigger profile transition (depends on HackerSection + DevSection existing)
15. Mobile responsive pass
16. `prefers-reduced-motion` audit

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Animating in Server Components
**What:** Importing `motion` from Framer Motion in a file without `'use client'`
**Why bad:** Build error. `motion` uses React hooks internally.
**Instead:** All `motion.*` usage lives in files with `'use client'` at the top.

### Anti-Pattern 2: Fetching GitHub data in a Client Component
**What:** `useEffect(() => fetch('/api/github'))` pattern
**Why bad:** Exposes GITHUB_TOKEN risk, adds a client-side waterfall, no caching benefit.
**Instead:** Fetch in Server Component (`app/page.tsx`), pass data as props.

### Anti-Pattern 3: GSAP without cleanup
**What:** `useEffect(() => { ScrollTrigger.create(...) })` with no return
**Why bad:** ScrollTrigger instances accumulate on re-renders, especially in React StrictMode (double-invoke). Memory leak + duplicate triggers.
**Instead:** Always `gsap.context()` + `return () => ctx.revert()`.

### Anti-Pattern 4: Animating layout properties
**What:** Framer Motion `animate={{ width: '100%', height: 'auto' }}`
**Why bad:** Forces browser layout recalculation every frame — drops to 30fps or worse on mobile.
**Instead:** Animate only `transform` (x, y, scale, rotate) and `opacity`.

### Anti-Pattern 5: Putting all sections in one giant client component
**What:** Single `'use client'` wrapper that contains all five sections
**Why bad:** Everything below the boundary becomes client JS — loses RSC benefits, massive initial bundle.
**Instead:** Keep `app/page.tsx` as Server Component. Each section file has its own `'use client'`.

### Anti-Pattern 6: `once: true` on scroll animations
**What:** `viewport={{ once: true }}` on all Framer Motion elements
**Why bad:** The PROJECT.md requires bidirectional scroll animations. `once: true` disables re-animation on scroll-up.
**Instead:** `viewport={{ once: false, amount: 0.2 }}` as the project default.

---

## Sources

- Next.js 15 official docs — Server and Client Components composition patterns (version 16.2.4, fetched 2026-04-10): https://nextjs.org/docs/app/getting-started/server-and-client-components
- Next.js 15 official docs — Caching and Revalidating (version 16.2.4, fetched 2026-04-10): https://nextjs.org/docs/app/guides/caching-without-cache-components
- Framer Motion documentation — LazyMotion, useScroll, whileInView, viewport options (HIGH confidence from training + official docs pattern)
- GSAP documentation — ScrollTrigger React setup, gsap.context() cleanup pattern (HIGH confidence from training)
