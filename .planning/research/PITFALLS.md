# Domain Pitfalls

**Domain:** Portfolio with heavy scroll animations — Next.js 15 App Router, Framer Motion, GSAP ScrollTrigger, GitHub API
**Researched:** 2026-05-04
**Confidence:** HIGH (verified against GSAP official skills docs, Framer Motion source, Next.js 16.2.4 official docs)

---

## Critical Pitfalls

Mistakes that cause rewrites, broken hydration, or unfixable runtime errors.

---

### Pitfall 1: GSAP / ScrollTrigger Running During SSR

**What goes wrong:** GSAP accesses `window`, `document`, and DOM APIs that do not exist on the server. Any top-level invocation of `gsap.*` or `ScrollTrigger.*` outside a client lifecycle hook crashes the Next.js build or produces a runtime error during server-side rendering.

**Why it happens:** In Next.js App Router, files without `'use client'` are Server Components by default. Importing GSAP there — or calling it in module-level code — executes during the server render pass where the browser environment is absent.

**Consequences:** Build failures, hydration mismatches, blank pages in production.

**Prevention:**
- Never call `gsap.*` or `ScrollTrigger.*` outside `useEffect` / `useGSAP`.
- Register plugins once at the module level inside a `'use client'` file, but never invoke animation methods there — only inside lifecycle hooks.
- Use `useGSAP` (from `@gsap/react`) which is lifecycle-aware by design.

```typescript
// gsap-provider.tsx — 'use client'
'use client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// registerPlugin is safe at module level — it does not touch the DOM
gsap.registerPlugin(ScrollTrigger, useGSAP)
```

```typescript
// Inside any animation component
const { contextSafe } = useGSAP(() => {
  gsap.from('.hero-title', { y: 50, autoAlpha: 0, duration: 0.8 })
}, { scope: containerRef })
```

**Warning signs:** Error messages mentioning `window is not defined`, `document is not defined`, or React hydration mismatch warnings on first load.

**Phase to address:** Phase 1 (project setup) — get this right before any animation code is written.

---

### Pitfall 2: Wrong `'use client'` Boundary Placement

**What goes wrong:** Adding `'use client'` too high in the component tree (e.g. on a layout or page) converts the entire subtree to client components, destroying the performance benefits of Server Components. GitHub API fetches that should run on the server get moved to the client, exposing the token.

**Why it happens:** The `'use client'` directive marks a boundary: everything imported from that file becomes part of the client bundle. Developers unfamiliar with App Router add it to parent components to silence errors from child animation libraries.

**Consequences:** GitHub token leaks to the browser bundle, massive JS bundle shipped to client, loss of streaming/SSR benefits, SEO degradation.

**Prevention:**
- Place `'use client'` on the smallest leaf components that actually need browser APIs (animation wrappers, interactive UI).
- Keep data-fetching in Server Components. Pass pre-fetched data as serializable props down to client animation wrappers.
- Use the `server-only` package on any file containing `GITHUB_TOKEN` or other secrets to get a build-time error if it ever leaks.

```typescript
// lib/github.ts — SERVER ONLY
import 'server-only'

export async function getRepos() {
  const res = await fetch('https://api.github.com/user/repos', {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    next: { revalidate: 3600 } // cache 1 hour
  })
  return res.json()
}
```

**Warning signs:** `process.env.GITHUB_TOKEN` appearing in browser DevTools network responses or JS bundle; Next.js build warnings about large client bundles.

**Phase to address:** Phase 1 (architecture) — establish the server/client boundary diagram before writing any component.

---

### Pitfall 3: ScrollTrigger Memory Leaks in React SPA Navigation

**What goes wrong:** ScrollTrigger instances created on component mount are not killed on unmount. In Next.js App Router (which does client-side navigation between routes), stale ScrollTrigger instances pile up, fire on wrong scroll positions, and eventually crash the browser tab.

**Why it happens:** GSAP operates outside React's render cycle. React unmounts the component and removes the DOM, but GSAP's internal instance registry still holds references and tries to update non-existent elements.

**Consequences:** Animations firing on wrong pages, increasingly degraded scroll performance, eventual crash.

**Prevention:**
- Always use `useGSAP` with a `scope` ref — it auto-reverts on unmount.
- If using `useEffect` instead, always return `ctx.revert()` from the cleanup function.
- Call `ScrollTrigger.refresh()` after any dynamic DOM changes (font loads, image loads, lazy content).

```typescript
// Correct cleanup pattern
const containerRef = useRef(null)

useGSAP(() => {
  gsap.from('.card', {
    y: 60,
    autoAlpha: 0,
    stagger: 0.1,
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })
}, { scope: containerRef }) // auto-reverts on unmount — no manual cleanup needed
```

**Warning signs:** Console errors about `gsap: Cannot tween a null target`; animations triggering on the wrong page after navigation.

**Phase to address:** Phase 2 (scroll animation system) — establish the pattern from the first animation component.

---

### Pitfall 4: GitHub API Rate Limiting (60 req/hr Unauthenticated)

**What goes wrong:** Without authentication, the GitHub REST API allows only 60 requests per hour per IP. A portfolio fetching repo data on every page visit will hit this limit within minutes during any moderate traffic spike, returning 403 errors and showing broken project cards.

**Why it happens:** Developers test in development (where Next.js does not cache by default) and forget to add server-side caching and authentication for production.

**Consequences:** Projects section shows errors or goes blank; hiring managers see a broken portfolio.

**Prevention:**
- Always use `GITHUB_TOKEN` (even a personal access token with read-only scope) — raises the limit to 5,000 req/hr.
- Always fetch on the server (Server Component or Route Handler), never from client components.
- Add `next: { revalidate: 3600 }` to the fetch call — caches the response for 1 hour server-side.
- Add `Cache-Control` headers if serving via a Route Handler.

```typescript
// app/api/github/repos/route.ts
import 'server-only'

export async function GET() {
  const res = await fetch(
    'https://api.github.com/users/YOUR_USERNAME/repos?per_page=100&sort=updated',
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
      next: { revalidate: 3600 }, // Next.js data cache — 1 hour
    }
  )

  if (!res.ok) {
    return Response.json({ error: 'GitHub API error' }, { status: res.status })
  }

  const repos = await res.json()
  return Response.json(repos, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' }
  })
}
```

**Warning signs:** HTTP 403 responses from `api.github.com`; `X-RateLimit-Remaining: 0` in response headers.

**Phase to address:** Phase 3 (GitHub API integration) — implement authentication and caching from day one.

---

## Moderate Pitfalls

---

### Pitfall 5: Layout Thrashing from Animating Non-Compositor Properties

**What goes wrong:** Animating CSS properties that trigger layout recalculation (`width`, `height`, `top`, `left`, `margin`, `padding`) forces the browser to recompute the layout tree on every animation frame, causing visible jank and dropping well below 60fps.

**Why it happens:** Developers animate the intuitive properties rather than transform equivalents. Common in glitch effects that animate `clip-path`, `border`, or positional layout values.

**Prevention:**
- Only animate `transform` (translate, scale, rotate, skew) and `opacity` — these run entirely on the compositor thread.
- Use GSAP's shorthand aliases: `x`, `y`, `xPercent`, `yPercent`, `scale`, `rotation`, `autoAlpha`.
- For parallax, use `yPercent` or `y` (transforms), never `top` or `marginTop`.
- Apply `will-change: transform` in CSS only on elements that are actively animating, not globally (overuse causes excessive GPU memory use).

```typescript
// Correct parallax
gsap.to('.hero-bg', {
  yPercent: -20, // transform — compositor only
  ease: 'none',
  scrollTrigger: { trigger: '.hero', scrub: 1 }
})

// Wrong parallax — causes layout thrash every frame
// gsap.to('.hero-bg', { top: '-200px', scrollTrigger: ... })
```

**Warning signs:** Chrome DevTools Performance tab showing purple "Layout" bars during scroll; FPS counter dropping below 50.

**Phase to address:** Phase 2 (scroll animations) — enforce this rule from the first animation.

---

### Pitfall 6: Framer Motion and GSAP Animating the Same Element

**What goes wrong:** Both libraries write inline `transform` and `opacity` styles directly to the DOM. If Framer Motion's `motion.div` and a GSAP tween target the same element, they race to write conflicting transform values, causing flickering, broken final states, and unpredictable animation behavior.

**Why it happens:** Developers use Framer Motion for component entry animations and then add GSAP ScrollTrigger to the same element for scroll-driven effects without realizing both are writing to the same CSS property.

**Prevention:**
- Establish a clear ownership rule: Framer Motion owns component-level state animations (hover, tap, presence); GSAP ScrollTrigger owns scroll-driven timeline animations.
- Never use both on the same element. Wrap a GSAP-animated element inside a Framer Motion wrapper if you need both, letting Framer Motion handle the outer container and GSAP handle inner elements.

```typescript
// Correct: separate ownership layers
<motion.section  // Framer Motion owns section entrance
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  <div ref={containerRef}>  // GSAP owns children inside
    <h2 className="section-title">...</h2>  {/* GSAP animates this */}
  </div>
</motion.section>
```

**Warning signs:** Elements flashing to wrong positions after an animation completes; `transform` value unexpectedly resetting.

**Phase to address:** Phase 2 (scroll animation system) — establish the ownership boundary in the animation architecture document before writing code.

---

### Pitfall 7: `AnimatePresence` Breaking When Wrapped in Suspense

**What goes wrong:** Framer Motion's `AnimatePresence` relies on React's render cycle to detect when children are added or removed. When a Suspense boundary is involved (e.g. streaming in the projects section from the GitHub API), `AnimatePresence` may not detect the "exit" state correctly, causing exit animations to be skipped or children to be unmounted immediately without animating.

**Why it happens:** Suspense streaming inserts content asynchronously. `AnimatePresence` watches the synchronous render tree — it can miss transitions that happen inside async boundaries.

**Prevention:**
- Do not wrap `AnimatePresence` and its animated children across a Suspense boundary.
- Fetch GitHub data in a Server Component, pass it as a prop to the client `AnimatePresence` wrapper — this way the data is present synchronously when the client component hydrates.
- If you must stream, use a skeleton that is always present (not conditionally rendered) so `AnimatePresence` only animates the inner content, not the boundary itself.

**Warning signs:** Exit animations that snap instead of animate; console warnings about unmounted components.

**Phase to address:** Phase 3 (GitHub API + project cards).

---

### Pitfall 8: Glitch Effects Causing Accessibility Failures

**What goes wrong:** CSS/JS glitch animations (rapid flicker, color flash, horizontal jitter) can trigger seizures in users with photosensitive epilepsy and trigger vestibular disorders in users sensitive to motion. WCAG 2.1 criteria 2.3.1 (Three Flashes or Below Threshold) is a Level A requirement — violating it can have legal consequences.

**Why it happens:** Glitch effects look great in design previews but are measured against strict flash frequency thresholds (no more than 3 flashes per second above the general flash threshold).

**Prevention:**
- Limit glitch effects to brief, infrequent triggers (user hover, page load only — not looping).
- Respect `prefers-reduced-motion` — disable all glitch effects when the user has enabled this OS setting.
- Use `gsap.matchMedia()` to gate glitch/heavy animations:

```typescript
const mm = gsap.matchMedia()
mm.add(
  { reduceMotion: '(prefers-reduced-motion: reduce)' },
  (context) => {
    const { reduceMotion } = context.conditions
    if (!reduceMotion) {
      // Only run glitch and heavy parallax for users who are ok with it
      initGlitchEffect()
      initHeavyParallax()
    }
  }
)
```

- For Framer Motion, check `useReducedMotion()` hook and pass `{ duration: 0 }` transitions.

**Warning signs:** WAVE or axe accessibility checker flagging motion content; user complaints about headaches or discomfort.

**Phase to address:** Phase 2 (animations) and Phase 4 (polish) — implement the `prefers-reduced-motion` gate in Phase 2, audit in Phase 4.

---

### Pitfall 9: Heavy Animations on Low-End Mobile Devices

**What goes wrong:** Multiple simultaneous scroll-triggered animations, particle backgrounds, and parallax effects consume enough GPU/CPU to cause persistent sub-30fps on mid-range Android devices (which represent a large segment of mobile visitors). The portfolio becomes unusable for the audience it is trying to impress.

**Why it happens:** Developers test on MacBook + iPhone 15 Pro. The animation feels buttery. Real users have Snapdragon 665 or older.

**Prevention:**
- Use `gsap.matchMedia()` to serve simplified animations on mobile:
  - Remove parallax entirely on `(max-width: 799px)`.
  - Reduce stagger counts and animation distances.
  - Disable continuous particle/matrix backgrounds on mobile (render a static dark gradient fallback).
- Pause animations for off-screen elements using `IntersectionObserver`.
- Use `scrub: true` (direct link) instead of `scrub: 1` (with lag) on mobile to reduce the number of intermediate frames calculated.

```typescript
mm.add(
  {
    isDesktop: '(min-width: 800px)',
    isMobile: '(max-width: 799px)',
    reduceMotion: '(prefers-reduced-motion: reduce)',
  },
  (context) => {
    const { isDesktop, reduceMotion } = context.conditions
    const parallaxDistance = isDesktop && !reduceMotion ? -20 : 0

    gsap.to('.hero-bg', {
      yPercent: parallaxDistance,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', scrub: true }
    })
  }
)
```

**Warning signs:** Chrome DevTools Mobile throttling (Slow 4G CPU 4x) showing consistent frame drops; Lighthouse performance score below 70 on mobile.

**Phase to address:** Phase 2 (scroll animations) — build the responsive/mobile variant alongside the desktop version, not as an afterthought.

---

### Pitfall 10: Next.js 15 Fetch Caching Behavior Changed

**What goes wrong:** In Next.js 15, `fetch` requests in Server Components are **not cached by default** (this changed from Next.js 13/14 where they were cached by default). Without explicit `next: { revalidate: N }` or `'use cache'` directive, the GitHub API is called on **every request**, which rapidly exhausts rate limits and degrades performance.

**Why it happens:** Developers copy patterns from Next.js 13/14 tutorials or assume the caching behavior is unchanged.

**Consequences:** GitHub rate limit hit in minutes under real traffic; slow page loads because every visit waits for a GitHub API round-trip.

**Prevention:**
- Explicitly add `next: { revalidate: 3600 }` to every GitHub API `fetch` call.
- Alternatively, use the `'use cache'` directive (Next.js 15 experimental) at the function level.
- Or use a Route Handler with an explicit `Cache-Control` response header as a stable API layer between the GitHub API and your components.

```typescript
// Explicit revalidation — required in Next.js 15
const res = await fetch(
  `https://api.github.com/users/${USERNAME}/repos`,
  {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    next: { revalidate: 3600 } // cache for 1 hour; re-fetch after expiry
  }
)
```

**Warning signs:** `X-RateLimit-Remaining` dropping to 0 within minutes of deployment; slow TTFB (Time to First Byte) every page load.

**Phase to address:** Phase 3 (GitHub API integration).

---

### Pitfall 11: `dark:` Contrast Failures on Dark Aesthetic

**What goes wrong:** Dark hacker aesthetics typically use near-black backgrounds (`#0a0a0a`) with neon green (`#00ff41`) or dim grey text. While the neon on black looks great visually, body text at lower brightness levels (skill descriptions, project details) frequently fails WCAG AA contrast ratio of 4.5:1. Screen readers and users with low vision cannot read the content.

**Why it happens:** Designers optimize for the "hero glance" — the bold headline looks great. Supporting text is afterthought-styled.

**Prevention:**
- Use a contrast checker (WebAIM contrast checker or browser DevTools accessibility panel) on every text element before finalizing colors.
- Neon green (`#00ff41`) on black passes AA for large text (18px+) but may fail for body text — use a slightly off-white (`#e2e8f0` or `#d4d4d4`) for body copy, reserving neon for accent/heading.
- Avoid grey-on-dark-grey combinations for anything other than decorative elements.
- Run Lighthouse accessibility audit at the end of every phase.

**Warning signs:** Chrome DevTools Accessibility panel showing contrast ratio below 4.5:1; Lighthouse accessibility score below 90.

**Phase to address:** Phase 4 (design system) — define the color palette with contrast ratios documented before applying it everywhere.

---

## Minor Pitfalls

---

### Pitfall 12: Overengineering the Portfolio (Conversion Killer)

**What goes wrong:** The portfolio becomes a tech demo that impresses developers but confuses hiring managers and clients. The CTA (contact me) is buried 5 scroll sections down, the interactive elements require explanation, and the first impression is "wow this is complex" rather than "I need to hire this person."

**Prevention:**
- Keep the hero section answer simple: "Who are you, what do you do, how do I contact you" — visible above the fold.
- The glitch/hacker aesthetic must not make navigation or scanning difficult. Decorative effects should be in the background, not overlapping critical text.
- Every section should have a clear next action. The contact section should be 1 click away from any section.
- Measure Largest Contentful Paint (LCP) — keep it under 2.5 seconds. Heavy animations that delay LCP directly hurt first impressions.

**Phase to address:** Phase 1 (information architecture) and Phase 5 (final QA/polish).

---

### Pitfall 13: ScrollTrigger Positions Wrong After Font/Image Load

**What goes wrong:** ScrollTrigger calculates element positions on initialization. If custom fonts or images load after ScrollTrigger initializes, the layout shifts, making all trigger positions inaccurate. Animations fire too early or too late.

**Prevention:**
- Call `ScrollTrigger.refresh()` inside a `document.fonts.ready` callback.
- Use `next/font` (which preloads fonts synchronously) instead of self-hosted CSS `@font-face` to eliminate the font-swap layout shift.
- Add `height` and `width` attributes to all images to prevent layout reflow after image load.

```typescript
document.fonts.ready.then(() => {
  ScrollTrigger.refresh()
})
```

**Phase to address:** Phase 4 (polish/performance).

---

### Pitfall 14: Double-Firing Animations on React Strict Mode

**What goes wrong:** In development, React 18 Strict Mode mounts components twice. GSAP animations initialized in `useEffect` fire twice, sometimes leaving elements in incorrect visual states during development (double-stagger, double-reverse, etc.).

**Why it happens:** Strict Mode calls `useEffect` → cleanup → `useEffect` again to verify cleanup is correct.

**Prevention:**
- Use `useGSAP` instead of `useEffect` — `useGSAP` is designed to be Strict Mode compatible.
- If seeing this in development, verify the cleanup function properly calls `ctx.revert()`. The double-fire is development-only and does not affect production.

**Phase to address:** Phase 2 (animations) — use `useGSAP` from the start.

---

### Pitfall 15: `process.env` Variables Leaking to Client Bundle

**What goes wrong:** Any environment variable without the `NEXT_PUBLIC_` prefix is undefined at runtime in client components. But if a developer accidentally puts the GitHub token fetch in a `'use client'` file, Next.js replaces the value with an empty string — the fetch fails silently rather than crashing, making debugging confusing.

**Prevention:**
- `GITHUB_TOKEN` must never appear in any file with `'use client'` or be imported from one.
- Use the `server-only` package in `lib/github.ts` to get a build-time error immediately if the boundary is violated.
- Name all client-safe env vars with `NEXT_PUBLIC_` prefix — this is the only way they appear in the browser bundle.

**Phase to address:** Phase 1 (project setup).

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| Project setup & architecture | `'use client'` boundary too broad; token leaks | Define server/client boundary map; add `server-only` to `lib/github.ts` immediately |
| Scroll animation system | GSAP SSR crash; ScrollTrigger memory leak; layout thrashing | Use `useGSAP` exclusively; only animate `transform`/`opacity` |
| Scroll animation system | Framer Motion + GSAP on same element | Document ownership: FM = component state, GSAP = scroll timeline |
| Scroll animation system | Mobile jank | Build `gsap.matchMedia()` breakpoints from day one |
| GitHub API integration | Rate limiting; no caching; token on client | Server Component fetch with `next: { revalidate: 3600 }` + `server-only` |
| GitHub API integration | Next.js 15 no-cache-by-default behavior | Explicit `revalidate` on every fetch; never rely on default caching |
| GitHub API integration | Suspense + AnimatePresence conflict | Fetch server-side, pass data as prop; avoid streaming inside AnimatePresence |
| Dark aesthetic & glitch effects | WCAG contrast failures; seizure risk | Audit all text contrast; gate glitches behind `prefers-reduced-motion` |
| Polish / QA | ScrollTrigger positions wrong after font load | Call `ScrollTrigger.refresh()` in `document.fonts.ready` |
| Polish / QA | Portfolio is a tech demo, not a conversion tool | Lighthouse audit; measure LCP, CTA visibility above fold |

---

## Sources

- GSAP AI Skills official documentation — `context7.com/greensock/gsap-skills` (HIGH confidence)
- GSAP React integration skill — `github.com/greensock/gsap-skills/blob/main/skills/gsap-react/SKILL.md` (HIGH confidence)
- GSAP Performance skill — `github.com/greensock/gsap-skills/blob/main/skills/gsap-performance/SKILL.md` (HIGH confidence)
- GSAP ScrollTrigger skill — `github.com/greensock/gsap-skills/blob/main/skills/gsap-scrolltrigger/SKILL.md` (HIGH confidence)
- Framer Motion source — `context7.com/grx7/framer-motion` (HIGH confidence)
- Next.js official docs v16.2.4 — Server and Client Components, Data Fetching — `nextjs.org/docs` (HIGH confidence)
- GitHub API rate limits — 60 req/hr unauthenticated, 5,000/hr authenticated (HIGH confidence, well-established)
- WCAG 2.1 criterion 2.3.1 Three Flashes — Level A requirement (HIGH confidence)
