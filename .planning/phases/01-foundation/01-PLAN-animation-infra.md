---
phase: 01-foundation
plan: 03
title: "Animation Infrastructure + Data Layer"
type: execute
wave: 2
depends_on:
  - 01-PLAN-scaffold.md
files_modified:
  - src/lib/types.ts
  - src/lib/github.ts
  - src/lib/gsap-utils.ts
  - src/components/animations/variants.ts
  - src/components/providers/SmoothScrollProvider.tsx
  - src/components/providers/AnimationProvider.tsx
  - src/app/layout.tsx
  - src/app/page.tsx
autonomous: true
requirements:
  - FOUND-02
  - FOUND-03
  - FOUND-04
  - FOUND-05
  - FOUND-06
  - FOUND-08

must_haves:
  truths:
    - "Scrolling produces Lenis smooth inertia — GSAP ticker is synced with `gsap.ticker.lagSmoothing(0)`"
    - "`lib/github.ts` imported from a Client Component causes a build-time error (server-only guard)"
    - "`lib/github.ts` imported from a Server Component returns typed `GitHubRepo[]`"
    - "All 6 Framer Motion variants are exported from `variants.ts` with correct hidden/visible states"
    - "`AnimationProvider` wraps children in `LazyMotion` with `domAnimation` features"
    - "`gsap.matchMedia()` reduced-motion gate is established in `gsap-utils.ts` — exported and ready for use"
    - "`GitHubRepo` interface uses only serializable fields (no Date instances, no class objects)"
    - "`SmoothScrollProvider` is the outermost wrapper in layout.tsx — before `AnimationProvider`"
  artifacts:
    - path: "src/lib/types.ts"
      provides: "GitHubRepo interface and RepoCategory type"
      contains: "interface GitHubRepo"
    - path: "src/lib/github.ts"
      provides: "Server-only GitHub API fetch with ISR caching + categorizeRepo utility"
      contains: "import 'server-only'"
    - path: "src/lib/gsap-utils.ts"
      provides: "gsap.matchMedia() wrapper with MOTION_CONDITIONS constants"
      contains: "gsap.matchMedia"
    - path: "src/components/animations/variants.ts"
      provides: "All 6 centralized Framer Motion animation variants"
      contains: "fadeInFromLeft"
    - path: "src/components/providers/SmoothScrollProvider.tsx"
      provides: "Lenis 1.3.23 smooth scroll + GSAP ticker sync"
      contains: "gsap.ticker.lagSmoothing(0)"
    - path: "src/components/providers/AnimationProvider.tsx"
      provides: "LazyMotion + domAnimation + useReducedMotion export"
      contains: "LazyMotion"
    - path: "src/app/layout.tsx"
      provides: "Root layout wrapping body: SmoothScrollProvider > AnimationProvider > children"
      contains: "SmoothScrollProvider"
  key_links:
    - from: "src/app/layout.tsx"
      to: "src/components/providers/SmoothScrollProvider.tsx"
      via: "import and JSX wrapping of children"
      pattern: "SmoothScrollProvider"
    - from: "src/app/layout.tsx"
      to: "src/components/providers/AnimationProvider.tsx"
      via: "import and JSX wrapping inside SmoothScrollProvider"
      pattern: "AnimationProvider"
    - from: "src/lib/github.ts"
      to: "server-only"
      via: "import 'server-only' — build fails if imported from client"
      pattern: "import 'server-only'"
    - from: "src/app/page.tsx"
      to: "src/lib/github.ts"
      via: "async Server Component calls getGitHubRepos()"
      pattern: "getGitHubRepos"
---

<objective>
Build the complete animation infrastructure and data layer: `SmoothScrollProvider` (Lenis + GSAP ticker sync), `AnimationProvider` (LazyMotion + reduced-motion detection), `variants.ts` (all 6 Framer Motion variants), `gsap-utils.ts` (gsap.matchMedia reduced-motion gate), and `lib/github.ts` (server-only GitHub data layer with typed `GitHubRepo` interface). Wire everything into `app/layout.tsx` and `app/page.tsx`.

Purpose: This is the wiring that all future UI sections depend on. Getting `SmoothScrollProvider` mount order wrong breaks every ScrollTrigger animation. Getting `lib/github.ts` without `server-only` is a security and architecture violation. Every Phase 2–4 component imports from these files — they must be authored with precision.

Output: All provider files, `variants.ts`, `gsap-utils.ts`, and the GitHub data layer — fully wired into `app/layout.tsx` and `app/page.tsx`. Build compiles clean.
</objective>

<execution_context>
@E:/Dev/Portfolios/jms-folio/CLAUDE.md
</execution_context>

<context>
@E:/Dev/Portfolios/jms-folio/.planning/ROADMAP.md
@E:/Dev/Portfolios/jms-folio/.planning/REQUIREMENTS.md

<interfaces>
<!-- Contracts this plan establishes — every Phase 2+ component imports these -->

From src/lib/types.ts (created by Task 1):
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
  updated_at: string  // ISO string — NOT a Date instance (must be serializable across RSC boundary)
}
```

From src/components/animations/variants.ts (created by Task 2):
```typescript
export const fadeInFromLeft: Variants    // x: -60, opacity: 0 → x: 0, opacity: 1
export const fadeInFromRight: Variants   // x: 60, opacity: 0  → x: 0, opacity: 1
export const fadeInFromTop: Variants     // y: -60, opacity: 0 → y: 0, opacity: 1
export const fadeInFromBottom: Variants  // y: 60, opacity: 0  → y: 0, opacity: 1
export const staggerContainer: Variants  // staggerChildren: 0.1, delayChildren: 0.2
export const glitchReveal: Variants      // skewX: 10, blur(4px) → skewX: 0, blur(0px)
```

From src/lib/gsap-utils.ts (created by Task 2):
```typescript
export function createGsapMediaMatch(): gsap.MatchMedia
export const MOTION_CONDITIONS: {
  isReduced: '(prefers-reduced-motion: reduce)',
  isFull: '(prefers-reduced-motion: no-preference)',
  isMobile: '(max-width: 768px)',
  isDesktop: '(min-width: 769px)',
  isTouchDevice: '(hover: none)',
}
```

CRITICAL rules from CLAUDE.md (non-negotiable):
  - GSAP: `useGSAP()` hook only — NEVER `useEffect` for GSAP setup
  - GSAP: `gsap.matchMedia()` gates ALL GSAP animations — always provide reduced-motion variant
  - Framer Motion: `LazyMotion` + `domAnimation` + `m` components (NOT `motion.div`)
  - Server: `lib/github.ts` has `import 'server-only'` — NEVER import from any 'use client' file
  - Scroll: `SmoothScrollProvider` (Lenis) mounts BEFORE any ScrollTrigger can register
  - Animation isolation: Framer Motion and GSAP never on the same DOM element

SmoothScrollProvider mount order in layout.tsx (outer to inner):
  SmoothScrollProvider → AnimationProvider → {children}
  Rationale: Lenis must initialize before any ScrollTrigger registers. If a section mounts
  and creates a ScrollTrigger before Lenis is up, scroll position calculations will be wrong.

GitHub fetch caching strategy (Next.js 15 — no default caching):
  next: { revalidate: 3600, tags: ['github-repos'] }
  This is REQUIRED — Next.js 15 does not cache fetch() by default. Without it,
  GitHub API is called on every page visit → rate limit exhausted within minutes.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create type definitions and server-only GitHub data layer</name>
  <files>
    src/lib/types.ts,
    src/lib/github.ts
  </files>
  <action>
    Check if src/lib/ directory exists at E:/Dev/Portfolios/jms-folio/src/lib/. Create it if it does not exist. Read any existing files before writing.

    Step 1 — Create src/lib/types.ts:

    ```typescript
    // src/lib/types.ts
    // Shared types — safe to import from both Server and Client Components.
    // All fields are JSON-serializable primitives — no Date objects, no class instances.
    // GitHubRepo crosses the server/client props boundary and MUST stay serializable.

    export type RepoCategory = 'dev' | 'hacker' | 'other'

    export interface GitHubRepo {
      id: number
      name: string
      description: string | null
      html_url: string
      /** Primary language as reported by GitHub API */
      language: string | null
      /** Array of topics set on the repo in GitHub settings */
      topics: string[]
      /** Categorized server-side — never computed on the client */
      category: RepoCategory
      stars: number
      /**
       * ISO 8601 string — NOT a Date instance.
       * Date objects are not serializable across the RSC boundary.
       * Format example: "2025-11-04T15:22:00Z"
       */
      updated_at: string
    }
    ```

    Step 2 — Create src/lib/github.ts:

    ```typescript
    // src/lib/github.ts
    // SERVER-ONLY: this file must never be imported from a Client Component ('use client').
    // The `import 'server-only'` directive causes a BUILD-TIME ERROR if a client boundary
    // ever imports this file — protecting GITHUB_TOKEN from leaking to the browser bundle.
    import 'server-only'

    import type { GitHubRepo, RepoCategory } from './types'

    // Topics that indicate cybersecurity / hacking work
    const HACKER_TOPICS = ['security', 'cybersecurity', 'hacking', 'ctf', 'pentesting', 'osint']

    // Topics that indicate software development work
    const DEV_TOPICS = [
      'dev', 'fullstack', 'frontend', 'backend',
      'javascript', 'typescript', 'nodejs', 'react',
      'python', 'cli',
    ]

    /**
     * Categorize a GitHub repo by its topics.
     *
     * Priority order (first match wins):
     * 1. Any topic in HACKER_TOPICS → 'hacker'
     * 2. Any topic in DEV_TOPICS → 'dev'
     * 3. No matching topics → 'other'
     *
     * Note: 'python' is in DEV_TOPICS. A repo with both 'python' and 'ctf' topics
     * is correctly classified as 'hacker' because HACKER_TOPICS is checked first.
     */
    export function categorizeRepo(topics: string[]): RepoCategory {
      if (topics.some((t) => HACKER_TOPICS.includes(t))) return 'hacker'
      if (topics.some((t) => DEV_TOPICS.includes(t))) return 'dev'
      return 'other'
    }

    /**
     * Fetch public GitHub repos for the configured username.
     *
     * Caching: `next: { revalidate: 3600 }` — caches for 1 hour (ISR-style).
     * REQUIRED in Next.js 15, which does NOT cache fetch() by default.
     * Without this, the GitHub API is called on every page visit.
     *
     * Tags: `tags: ['github-repos']` — allows on-demand invalidation via
     * `revalidateTag('github-repos')` if a webhook or manual refresh is ever added.
     *
     * Returns only the fields the UI needs — raw API response is stripped to the
     * GitHubRepo interface before crossing the server/client boundary.
     *
     * @throws Error if GITHUB_USERNAME env var is not set or the API call fails
     */
    export async function getGitHubRepos(): Promise<GitHubRepo[]> {
      const username = process.env.GITHUB_USERNAME
      if (!username) {
        throw new Error('GITHUB_USERNAME environment variable is not set. Add it to .env.local.')
      }

      const res = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        {
          headers: {
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            // Token is optional for public repos but REQUIRED for 5000 req/hr rate limit.
            // Without it: 60 req/hr — exhausted in minutes under any real traffic.
            ...(process.env.GITHUB_TOKEN && {
              Authorization: `token ${process.env.GITHUB_TOKEN}`,
            }),
          },
          next: {
            revalidate: 3600,           // 1 hour ISR — one API call per hour max
            tags: ['github-repos'],     // on-demand invalidation support
          },
        }
      )

      if (!res.ok) {
        // Log server-side for debugging without exposing to client
        console.error(`GitHub API error: ${res.status} ${res.statusText}`)
        throw new Error(`GitHub API returned ${res.status}`)
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw: any[] = await res.json()

      // Filter out forks — only show original repos
      const originals = raw.filter((r) => !r.fork)

      // Map to clean interface — strip unused fields before crossing server/client boundary
      return originals.map((repo): GitHubRepo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description ?? null,
        html_url: repo.html_url,
        language: repo.language ?? null,
        topics: Array.isArray(repo.topics) ? repo.topics : [],
        category: categorizeRepo(Array.isArray(repo.topics) ? repo.topics : []),
        stars: repo.stargazers_count ?? 0,
        updated_at: repo.updated_at,  // ISO string from GitHub — already serializable
      }))
    }
    ```
  </action>
  <verify>
    <automated>cd "E:/Dev/Portfolios/jms-folio" && grep -q "import 'server-only'" src/lib/github.ts && grep -q "revalidate: 3600" src/lib/github.ts && grep -q "tags: \['github-repos'\]" src/lib/github.ts && grep -q "interface GitHubRepo" src/lib/types.ts && grep -q "type RepoCategory" src/lib/types.ts && echo "DATA_LAYER_OK"</automated>
  </verify>
  <done>
    - `src/lib/types.ts` exports `GitHubRepo` interface — all fields are primitive types (no Date, no class)
    - `src/lib/types.ts` exports `RepoCategory` union type
    - `src/lib/github.ts` first import line is `import 'server-only'`
    - `src/lib/github.ts` exports `getGitHubRepos(): Promise<GitHubRepo[]>`
    - `src/lib/github.ts` exports `categorizeRepo(topics: string[]): RepoCategory`
    - Fetch call uses `next: { revalidate: 3600, tags: ['github-repos'] }`
    - `updated_at` is stored as `string` (ISO format — not converted to `Date`)
    - Forks are filtered out (`!r.fork`)
  </done>
</task>

<task type="auto">
  <name>Task 2: Create animation variants, providers, and gsap-utils</name>
  <files>
    src/components/animations/variants.ts,
    src/lib/gsap-utils.ts,
    src/components/providers/AnimationProvider.tsx,
    src/components/providers/SmoothScrollProvider.tsx
  </files>
  <action>
    Create directories src/components/animations/ and src/components/providers/ if they do not exist. Read any existing files before writing.

    Step 1 — Create src/components/animations/variants.ts:

    ```typescript
    // src/components/animations/variants.ts
    // Centralized Framer Motion animation variants.
    // ALL Phase 2+ animated components import from here — never define inline variants.
    //
    // Usage (in any 'use client' component):
    //   import { m } from 'framer-motion'    ← use m, not motion (required by LazyMotion)
    //   import { fadeInFromLeft } from '@/components/animations/variants'
    //
    //   <m.div
    //     variants={fadeInFromLeft}
    //     initial="hidden"
    //     whileInView="visible"
    //     viewport={{ once: false, amount: 0.2 }}
    //   >

    import type { Variants } from 'framer-motion'

    /** Slides in from the left. Use for: left-column content, skills lists, bio text. */
    export const fadeInFromLeft: Variants = {
      hidden: { opacity: 0, x: -60 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
      },
      exit: {
        opacity: 0,
        x: -60,
        transition: { duration: 0.4, ease: 'easeIn' },
      },
    }

    /** Slides in from the right. Use for: right-column content, CTAs, secondary content. */
    export const fadeInFromRight: Variants = {
      hidden: { opacity: 0, x: 60 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
      },
      exit: {
        opacity: 0,
        x: 60,
        transition: { duration: 0.4, ease: 'easeIn' },
      },
    }

    /** Slides in from the top. Use for: hero name/title, headings. */
    export const fadeInFromTop: Variants = {
      hidden: { opacity: 0, y: -60 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
      },
      exit: {
        opacity: 0,
        y: -60,
        transition: { duration: 0.4, ease: 'easeIn' },
      },
    }

    /** Slides in from the bottom. Use for: cards, badges, list items. Pair with staggerContainer. */
    export const fadeInFromBottom: Variants = {
      hidden: { opacity: 0, y: 60 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
      },
      exit: {
        opacity: 0,
        y: 60,
        transition: { duration: 0.3, ease: 'easeIn' },
      },
    }

    /**
     * Stagger container — apply to the parent wrapping a list of children.
     * Each child must also have a `variants` prop.
     * staggerChildren: 0.1 = 100ms delay between children.
     * delayChildren: 0.2 = 200ms pause before first child starts.
     */
    export const staggerContainer: Variants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
      exit: {
        transition: {
          staggerChildren: 0.05,
          staggerDirection: -1,
        },
      },
    }

    /**
     * Glitch reveal — for hero title and hacker section headings.
     * Uses skewX for "data corruption" feel on entrance.
     * CRITICAL: Framer Motion owns this element's transform.
     * Do NOT apply GSAP to the same element.
     */
    export const glitchReveal: Variants = {
      hidden: { opacity: 0, skewX: 10, filter: 'blur(4px)' },
      visible: {
        opacity: 1,
        skewX: 0,
        filter: 'blur(0px)',
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
      },
    }
    ```

    Step 2 — Create src/lib/gsap-utils.ts:

    ```typescript
    // src/lib/gsap-utils.ts
    // GSAP matchMedia utility for reduced-motion gating.
    // Import createGsapMediaMatch() in any 'use client' component that uses GSAP.
    //
    // RULE (from CLAUDE.md): ALL GSAP animations must be gated through gsap.matchMedia().
    // Every GSAP animation block must have a reduced-motion variant.
    //
    // Usage inside a useGSAP() callback:
    //
    //   import { useGSAP } from '@gsap/react'
    //   import { createGsapMediaMatch, MOTION_CONDITIONS } from '@/lib/gsap-utils'
    //
    //   const containerRef = useRef<HTMLDivElement>(null)
    //
    //   useGSAP(() => {
    //     const mm = createGsapMediaMatch()
    //
    //     mm.add(MOTION_CONDITIONS, (context) => {
    //       const { isReduced, isMobile } = context.conditions as {
    //         isReduced: boolean
    //         isMobile: boolean
    //       }
    //
    //       if (isReduced) {
    //         // Reduced-motion: opacity only, no translate, no scrub, no pin
    //         gsap.set('.element', { autoAlpha: 1 })
    //       } else if (isMobile) {
    //         // Mobile: simplified animation, no parallax
    //         gsap.from('.element', { autoAlpha: 0, duration: 0.4 })
    //       } else {
    //         // Desktop full animation
    //         gsap.from('.element', { y: 60, autoAlpha: 0, duration: 0.8 })
    //       }
    //
    //       return () => mm.revert()  // cleanup inside useGSAP is handled automatically
    //     })
    //   }, { scope: containerRef })
    'use client'

    import { gsap } from 'gsap'

    /**
     * Creates a gsap.matchMedia() context instance.
     * Call inside useGSAP() — the returned mm instance is automatically
     * reverted when useGSAP's scope component unmounts.
     *
     * Always pass MOTION_CONDITIONS (or a subset) as the first argument to mm.add().
     */
    export function createGsapMediaMatch() {
      return gsap.matchMedia()
    }

    /**
     * Standard media query conditions for GSAP matchMedia.
     * Pass these to mm.add() to get typed conditions in the callback.
     *
     * isReduced and isFull are mutually exclusive.
     * isMobile and isDesktop are mutually exclusive.
     */
    export const MOTION_CONDITIONS = {
      isReduced: '(prefers-reduced-motion: reduce)',
      isFull: '(prefers-reduced-motion: no-preference)',
      isMobile: '(max-width: 768px)',
      isDesktop: '(min-width: 769px)',
      isTouchDevice: '(hover: none)',
    } as const
    ```

    Step 3 — Create src/components/providers/AnimationProvider.tsx:

    ```tsx
    // src/components/providers/AnimationProvider.tsx
    // Wraps the app in Framer Motion's LazyMotion with domAnimation features.
    // LazyMotion loads animation feature code on demand instead of bundling it all upfront.
    //
    // CRITICAL: When LazyMotion is active, use `m` instead of `motion` in all components.
    //   import { m } from 'framer-motion'    ← correct
    //   import { motion } from 'framer-motion'  ← WRONG with LazyMotion strict mode
    //
    // strict={true} causes a dev-time console warning if motion.div is used instead of m.div.
    // This enforces the bundle optimization contract across the codebase.
    'use client'

    import { LazyMotion, domAnimation, useReducedMotion } from 'framer-motion'
    import type { ReactNode } from 'react'

    interface AnimationProviderProps {
      children: ReactNode
    }

    export function AnimationProvider({ children }: AnimationProviderProps) {
      return (
        <LazyMotion features={domAnimation} strict>
          {children}
        </LazyMotion>
      )
    }

    /**
     * Re-exported hook for checking reduced-motion preference.
     * Import from this module so components have a single import source.
     *
     * Usage in any animated component:
     *   const prefersReducedMotion = useMotionPreference()
     *   if (prefersReducedMotion) return <StaticVersion />
     */
    export { useReducedMotion as useMotionPreference }
    ```

    Step 4 — Create src/components/providers/SmoothScrollProvider.tsx:

    ```tsx
    // src/components/providers/SmoothScrollProvider.tsx
    // Initializes Lenis 1.3.23 smooth scroll and syncs it with the GSAP ticker.
    //
    // MOUNT ORDER IS CRITICAL: This must be the OUTERMOST client wrapper in layout.tsx.
    // If a ScrollTrigger instance registers before Lenis is initialized, scroll position
    // calculations will be based on native scroll — causing trigger misfires.
    //
    // gsap.ticker.lagSmoothing(0) is MANDATORY: without it, GSAP's lag compensation
    // actively fights Lenis on slow frames, causing visible jitter.
    //
    // Do NOT use useGSAP here — this file is infrastructure, not an animation component.
    // The useEffect here manages Lenis lifecycle, not GSAP animation setup.
    'use client'

    import { useEffect, type ReactNode } from 'react'
    import Lenis from 'lenis'
    import { gsap } from 'gsap'
    import { ScrollTrigger } from 'gsap/ScrollTrigger'

    // Register ScrollTrigger at module level — safe in 'use client' files.
    // Registration is idempotent — calling it multiple times is harmless.
    gsap.registerPlugin(ScrollTrigger)

    interface SmoothScrollProviderProps {
      children: ReactNode
    }

    export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
      useEffect(() => {
        // Lenis 1.3.23 — smooth scroll with inertia
        const lenis = new Lenis({
          lerp: 0.1,          // Smoothing: 0 = instant, 1 = never arrives. 0.1 is standard.
          smoothWheel: true,  // Smooth mousewheel events
        })

        // Keep ScrollTrigger in sync with Lenis scroll position.
        // Without this, ScrollTrigger reads the native (un-smoothed) scroll position
        // which Lenis has decoupled from the visual position — causes trigger misfires.
        lenis.on('scroll', ScrollTrigger.update)

        // Named function so we can remove it precisely on cleanup.
        // gsap.ticker provides time in seconds — Lenis.raf expects milliseconds.
        function onTick(time: number) {
          lenis.raf(time * 1000)
        }

        gsap.ticker.add(onTick)

        // MANDATORY: Prevents GSAP lag compensation from fighting Lenis on slow frames.
        // Without this, GSAP "catches up" dropped frames, causing Lenis to jitter.
        gsap.ticker.lagSmoothing(0)

        // Cleanup on unmount: stop Lenis and remove GSAP ticker callback.
        // Prevents memory leaks and stale RAF loops on route changes.
        return () => {
          lenis.destroy()
          gsap.ticker.remove(onTick)
        }
      }, [])

      return <>{children}</>
    }
    ```
  </action>
  <verify>
    <automated>cd "E:/Dev/Portfolios/jms-folio" && grep -q "gsap.ticker.lagSmoothing(0)" src/components/providers/SmoothScrollProvider.tsx && grep -q "lenis.destroy()" src/components/providers/SmoothScrollProvider.tsx && grep -q "LazyMotion" src/components/providers/AnimationProvider.tsx && grep -q "domAnimation" src/components/providers/AnimationProvider.tsx && grep -q "fadeInFromLeft" src/components/animations/variants.ts && grep -q "staggerContainer" src/components/animations/variants.ts && grep -q "glitchReveal" src/components/animations/variants.ts && grep -q "gsap.matchMedia" src/lib/gsap-utils.ts && grep -q "MOTION_CONDITIONS" src/lib/gsap-utils.ts && echo "ANIMATION_INFRA_OK"</automated>
  </verify>
  <done>
    - `variants.ts` exports all 6 named variants: `fadeInFromLeft`, `fadeInFromRight`, `fadeInFromTop`, `fadeInFromBottom`, `staggerContainer`, `glitchReveal`
    - `fadeInFromLeft` has `hidden: { opacity: 0, x: -60 }` and `visible: { opacity: 1, x: 0 }`
    - `staggerContainer` has `staggerChildren: 0.1` and `delayChildren: 0.2`
    - `glitchReveal` has `hidden: { opacity: 0, skewX: 10, filter: 'blur(4px)' }`
    - `AnimationProvider.tsx` renders `<LazyMotion features={domAnimation} strict>`
    - `AnimationProvider.tsx` re-exports `useReducedMotion` as `useMotionPreference`
    - `SmoothScrollProvider.tsx` calls `gsap.ticker.lagSmoothing(0)` inside `useEffect`
    - `SmoothScrollProvider.tsx` drives Lenis via named `onTick` function added to `gsap.ticker`
    - `SmoothScrollProvider.tsx` cleanup calls `lenis.destroy()` and `gsap.ticker.remove(onTick)`
    - `gsap-utils.ts` exports `createGsapMediaMatch()` and `MOTION_CONDITIONS`
  </done>
</task>

<task type="auto">
  <name>Task 3: Wire providers into layout.tsx and add GitHub fetch smoke test to page.tsx</name>
  <files>
    src/app/layout.tsx,
    src/app/page.tsx
  </files>
  <action>
    Read the existing E:/Dev/Portfolios/jms-folio/src/app/layout.tsx and E:/Dev/Portfolios/jms-folio/src/app/page.tsx before modifying. The create-next-app scaffold generates these — read them first to understand what to keep (metadata, font imports) versus what to replace (body JSX, page content).

    Step 1 — Rewrite src/app/layout.tsx:

    Keep any existing metadata and font configuration. Replace the body JSX to wrap children in providers. Mount order is: SmoothScrollProvider (outer) → AnimationProvider (inner) → children. This order is non-negotiable.

    ```tsx
    // src/app/layout.tsx
    // Root layout — Server Component (no 'use client' here).
    // SmoothScrollProvider MUST be the outermost client wrapper:
    //   it initializes Lenis before any ScrollTrigger can register.
    // AnimationProvider (LazyMotion) goes inside SmoothScrollProvider.
    import type { Metadata } from 'next'
    import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
    import { AnimationProvider } from '@/components/providers/AnimationProvider'
    import './globals.css'

    export const metadata: Metadata = {
      title: 'Juan Manuel Silva — Full Stack Dev & Cybersecurity',
      description: 'Portfolio de Juan Manuel Silva — Desarrollador Full Stack y especialista en ciberseguridad',
    }

    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode
    }) {
      return (
        <html lang="es" suppressHydrationWarning>
          <body>
            {/*
              Mount order: SmoothScrollProvider first, AnimationProvider second.
              SmoothScrollProvider initializes Lenis + gsap.ticker before any
              ScrollTrigger instance can register. AnimationProvider provides
              the LazyMotion context for all m.* components in the subtree.
            */}
            <SmoothScrollProvider>
              <AnimationProvider>
                {children}
              </AnimationProvider>
            </SmoothScrollProvider>
          </body>
        </html>
      )
    }
    ```

    Step 2 — Rewrite src/app/page.tsx as an async Server Component:

    ```tsx
    // src/app/page.tsx
    // Server Component — do NOT add 'use client'.
    // Fetches GitHub repos server-side and renders a Phase 1 placeholder.
    // The placeholder will be replaced by HeroSection in Phase 2.
    import { getGitHubRepos } from '@/lib/github'

    export default async function Page() {
      // Server-side fetch with 1-hour ISR cache.
      // Will log an error in dev if GITHUB_TOKEN/GITHUB_USERNAME are not in .env.local.
      // Will return 0 repos (not crash) so the page still renders.
      let repos
      try {
        repos = await getGitHubRepos()
      } catch (error) {
        console.error('GitHub fetch failed (expected if .env.local has placeholder token):', error)
        repos = []
      }

      return (
        <main className="min-h-screen bg-bg text-text">
          {/* Phase 1 placeholder — replaced in Phase 2 with HeroSection */}
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-accent mb-4">
                jms-folio
              </h1>
              <p className="text-text-muted text-sm mb-2">
                Foundation — animation infrastructure wired.
              </p>
              <p className="text-text-muted text-xs">
                GitHub repos loaded: {repos.length}
              </p>
              <p className="text-text-muted text-xs mt-1">
                (Phase 2 replaces this with HeroSection)
              </p>
            </div>
          </div>
        </main>
      )
    }
    ```

    Step 3 — Run a TypeScript compile check to confirm everything wires together:

    ```bash
    cd "E:/Dev/Portfolios/jms-folio" && npx tsc --noEmit
    ```

    If TypeScript reports errors, read the error messages and fix them before marking this task done. Common issues:
    - Missing 'use client' directive on AnimationProvider or SmoothScrollProvider
    - Import path issues with @/ alias (verify tsconfig has "@/*": ["./src/*"])
    - Lenis types not found (verify lenis@1.3.23 is installed)
  </action>
  <verify>
    <automated>cd "E:/Dev/Portfolios/jms-folio" && grep -q "SmoothScrollProvider" src/app/layout.tsx && grep -q "AnimationProvider" src/app/layout.tsx && grep -q "getGitHubRepos" src/app/page.tsx && npx tsc --noEmit 2>&1 | tail -3 && echo "LAYOUT_WIRED_OK"</automated>
  </verify>
  <done>
    - `layout.tsx` imports both `SmoothScrollProvider` and `AnimationProvider`
    - `layout.tsx` body structure is: `<SmoothScrollProvider><AnimationProvider>{children}</AnimationProvider></SmoothScrollProvider>`
    - `layout.tsx` imports `./globals.css`
    - `layout.tsx` does NOT have `'use client'` at the top (it is a Server Component)
    - `page.tsx` is an `async` function with no `'use client'` directive
    - `page.tsx` calls `getGitHubRepos()` wrapped in try/catch
    - `npx tsc --noEmit` exits with code 0 (zero TypeScript errors)
    - `npm run dev` starts without errors and `http://localhost:3000` shows dark background with terminal-green heading
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Server Component → Client Component | `lib/github.ts` data crosses here as props — must be serializable |
| `lib/github.ts` → GitHub REST API | `GITHUB_TOKEN` travels here — must never reach the client bundle |
| Client Component → browser DOM | GSAP and Lenis access `window`/`document` — must not run during SSR |
| `gsap-utils.ts` → 'use client' files only | File has `'use client'` directive — GSAP APIs are browser-only |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-03-01 | Information Disclosure | `lib/github.ts` / `GITHUB_TOKEN` | mitigate | `import 'server-only'` causes a build-time error if any `'use client'` file imports `lib/github.ts`. `GITHUB_TOKEN` has no `NEXT_PUBLIC_` prefix — Next.js never includes it in the client bundle. |
| T-03-02 | Denial of Service | GitHub API rate limiting | mitigate | `next: { revalidate: 3600 }` caches the response for 1 hour — at most 1 API call per hour per cache segment. Authenticated token provides 5,000 req/hr limit. |
| T-03-03 | Tampering | GSAP/Lenis SSR crash | mitigate | `SmoothScrollProvider` is `'use client'` — only runs in the browser. GSAP plugin registration is at module level inside a client file, not in SSR context. |
| T-03-04 | Denial of Service | Lenis memory leak on navigation | mitigate | `useEffect` cleanup in `SmoothScrollProvider` calls `lenis.destroy()` and `gsap.ticker.remove(onTick)` (named function reference) — no stale RAF loop on unmount. |
| T-03-05 | Elevation of Privilege | `'use client'` boundary too broad | mitigate | `layout.tsx` has NO `'use client'` — only the two provider files do. The layout itself is a Server Component, preventing the entire page tree from becoming client-side. |
| T-03-06 | Information Disclosure | GitHub API response exposed to client | mitigate | `getGitHubRepos()` maps raw API response to `GitHubRepo` interface — strips all fields not needed by the UI before the data crosses the server/client boundary. |
</threat_model>

<verification>
Run the full foundation verification suite after all three tasks complete:

```bash
cd "E:/Dev/Portfolios/jms-folio"

# TypeScript — must be clean
npx tsc --noEmit

# Verify server-only guard
grep "import 'server-only'" src/lib/github.ts

# Verify ISR caching config
grep "revalidate: 3600" src/lib/github.ts
grep "tags: \['github-repos'\]" src/lib/github.ts

# Verify all 6 variants exported
grep -E "export const (fadeInFromLeft|fadeInFromRight|fadeInFromTop|fadeInFromBottom|staggerContainer|glitchReveal)" src/components/animations/variants.ts

# Verify Lenis ticker sync (must show lagSmoothing and destroy)
grep "lagSmoothing(0)" src/components/providers/SmoothScrollProvider.tsx
grep "lenis.destroy()" src/components/providers/SmoothScrollProvider.tsx

# Verify LazyMotion in AnimationProvider
grep "LazyMotion" src/components/providers/AnimationProvider.tsx
grep "domAnimation" src/components/providers/AnimationProvider.tsx

# Verify gsap.matchMedia utility
grep "gsap.matchMedia" src/lib/gsap-utils.ts
grep "MOTION_CONDITIONS" src/lib/gsap-utils.ts

# Verify provider mount order in layout
grep -A 4 "SmoothScrollProvider" src/app/layout.tsx
```

Manual verification:
1. `npm run dev` → visit http://localhost:3000 — dark background (#0a0a0a), terminal green heading, repo count shows
2. Scroll the page — Lenis smooth inertia should be active (subtle scroll smoothing)
3. Open DevTools → Console — zero errors on page load
4. Open DevTools → Network — confirm no `GITHUB_TOKEN` string appears in any JS bundle or API response
</verification>

<success_criteria>
1. `lib/github.ts` first import is `import 'server-only'` — build errors if imported from a Client Component
2. `getGitHubRepos()` returns `GitHubRepo[]` with `updated_at` as ISO string, `category` pre-computed, forks filtered out
3. `categorizeRepo()` hacker topics win over dev topics — a repo with both 'python' and 'ctf' → 'hacker'
4. `variants.ts` exports all 6 variants with correct offset values (x: ±60 for left/right, y: ±60 for top/bottom)
5. `gsap-utils.ts` exports `createGsapMediaMatch()` and `MOTION_CONDITIONS` — provides the reduced-motion gate for all Phase 2+ GSAP animations
6. `SmoothScrollProvider.tsx` calls `gsap.ticker.lagSmoothing(0)` and drives Lenis via named `onTick` function
7. `SmoothScrollProvider.tsx` cleanup correctly calls `lenis.destroy()` and `gsap.ticker.remove(onTick)`
8. `AnimationProvider.tsx` wraps children in `<LazyMotion features={domAnimation} strict>`
9. `layout.tsx` body structure: `<SmoothScrollProvider><AnimationProvider>{children}</AnimationProvider></SmoothScrollProvider>`
10. `npx tsc --noEmit` exits with code 0
11. `npm run dev` renders http://localhost:3000 with dark background and terminal green accent
</success_criteria>

<output>
After completion, create `E:/Dev/Portfolios/jms-folio/.planning/phases/01-foundation/01-animation-infra-SUMMARY.md` with:
- All 6 variant names and their hidden state values
- Confirmation `import 'server-only'` is present in `lib/github.ts`
- Provider mount order from layout.tsx (paste the JSX tree)
- TypeScript compile result (pass/fail + any errors fixed)
- GitHub repos count returned (0 if placeholder token, actual count if real token set)
- Any issues encountered with Lenis/GSAP integration
</output>
