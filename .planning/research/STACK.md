# Technology Stack: jms-folio

**Project:** jms-folio — Animated Multi-Profile Portfolio
**Researched:** 2026-05-04
**Confidence:** HIGH (all versions verified via npm registry + Context7 official docs)

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 16.2.4 (latest) | App Router, SSR, server components | Already committed; React 19 compatible, official peer deps confirm `^18.2.0 || ^19.0.0` |
| React | 19.2.5 | UI runtime | Shipped with Next.js 16; both framer-motion@12 and motion@12 explicitly support `^18.0.0 || ^19.0.0` |
| TypeScript | 6.0.3 | Type safety | Already committed; no version concerns |
| Tailwind CSS | 4.2.4 | Utility-first CSS | v4 is stable and production-ready as of 2025; use `@tailwindcss/postcss` (4.2.4) as the integration adapter |

> Note: Next.js `latest` is 16.2.4 at time of research. The project file specifies "Next.js 15" — either version works, but 16.x is current stable. Recommend pinning to whichever you initialize with.

---

### Animation Layer

#### Framer Motion (Component-Level Animations)

| Package | Version | Purpose |
|---------|---------|---------|
| `framer-motion` | 12.38.0 | `<motion.div>`, `whileInView`, `useScroll`, `useTransform`, `AnimatePresence` |

Use `framer-motion` (not the `motion` package — same latest version 12.38.0 but the `framer-motion` name is the stable production alias). Both are identical packages; `framer-motion` is the safe conventional choice for React projects.

**What Framer Motion handles in this project:**
- `whileInView` + `viewport={{ once: false }}` for bidirectional scroll animations (enters left/right/up/down, reverses on scroll up)
- `AnimatePresence` for profile section transitions (Dev ↔ Hacker)
- `useScroll` + `useTransform` for parallax on cards/images
- Stagger variants for project cards grid entrance
- `motion.div` wrapping all animated React components

**Confirmed React 19 compatibility:** peer deps = `react: '^18.0.0 || ^19.0.0'`

#### GSAP + ScrollTrigger (Scroll-Synchronized Animations)

| Package | Version | Purpose |
|---------|---------|---------|
| `gsap` | 3.15.0 | Core GSAP engine + ScrollTrigger plugin |
| `@gsap/react` | 2.1.2 | `useGSAP` hook for lifecycle-safe React integration |

**What GSAP handles in this project:**
- Pinned sections (e.g., the dramatic Dev → Hacker profile transition that holds while timeline plays)
- Scrubbed parallax on background elements (`scrub: 1`)
- Timeline-driven sequences on section entry that would be verbose in Framer Motion
- Glitch text effects driven by scroll position

**Critical integration pattern — divide responsibilities by element:**

```
Framer Motion domain:  React component state, whileInView triggers, hover/tap, AnimatePresence
GSAP domain:           ScrollTrigger pinning, scrubbed timelines, canvas animations, class-based DOM
```

Never animate the same CSS property on the same element with both libraries simultaneously — that causes jank. Pick one per element.

**The correct Next.js App Router pattern for GSAP:**

```tsx
// components/HeroSection.tsx
"use client"; // REQUIRED — GSAP is browser-only

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP); // once at module level

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-title", {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.to(".hero-bg", {
        yPercent: -15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: containerRef }
    // useGSAP auto-reverts animations + ScrollTriggers on unmount — no manual cleanup needed
  );

  return <section ref={containerRef}>...</section>;
}
```

`useGSAP` auto-calls `ctx.revert()` on unmount, killing all ScrollTrigger instances scoped to that context. This is the officially documented pattern and prevents the memory leak / duplicate-trigger bug common in React Strict Mode.

**Do NOT use `useEffect` + manual `gsap.context()` unless you have a specific dependency reason.** `useGSAP` is the correct hook.

---

### GitHub API Integration

| Approach | Details |
|----------|---------|
| **Pattern** | Async Server Component — `fetch()` directly in the RSC, no client JS shipped |
| **Caching** | `next: { revalidate: 3600 }` — stale for 1h, auto-revalidates in background (ISR-style) |
| **Auth** | `Authorization: Bearer ${process.env.GITHUB_TOKEN}` header — token stays server-side, never in client bundle |
| **No SDK needed** | Raw `fetch()` to GitHub REST API v3 is sufficient for listing repos and reading topics |

**Recommended pattern:**

```ts
// lib/github.ts
const GITHUB_API = "https://api.github.com";

export async function getPublicRepos(username: string) {
  const res = await fetch(
    `${GITHUB_API}/users/${username}/repos?sort=updated&per_page=100`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 3600, tags: ["github-repos"] },
    }
  );

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}
```

**Why no SDK (`@octokit/rest` v22.0.1):** For this use case (read-only public repos list), the SDK adds 150KB+ to server bundle for zero functional gain. The raw `fetch()` approach is leaner, works natively in the Edge runtime if ever needed, and the GitHub REST API is stable.

**Rate limit reality:**
- Unauthenticated: 60 req/hour — too low for production with any traffic
- Authenticated: 5,000 req/hour — fine with `revalidate: 3600` (1 req/hour per endpoint)
- Always use `GITHUB_TOKEN` in `.env.local`. Never commit the token.

**Repo categorization by topic:**

```ts
export function categorizeRepo(repo: GitHubRepo): "dev" | "security" | "other" {
  const topics = repo.topics ?? [];
  if (topics.some(t => ["security", "ctf", "pentest", "cybersecurity", "python"].includes(t))) {
    return "security";
  }
  if (topics.some(t => ["fullstack", "frontend", "backend", "nextjs", "react", "dev"].includes(t))) {
    return "dev";
  }
  return "other";
}
```

Add GitHub topics to repos via `jmsdev.tech/settings` → repository settings → Topics.

---

### Visual Effects / Hacker Aesthetic

#### Particle Background

| Package | Version | Recommendation |
|---------|---------|---------------|
| `@tsparticles/slim` | 3.9.1 | Use this bundle — not `@tsparticles/full` |
| `@tsparticles/react` | 3.0.0 | React wrapper |
| `@tsparticles/nextjs` | 4.0.0-beta.12 | **Do NOT use** — still in beta, use `@tsparticles/react` instead |

The `slim` bundle includes: particles, links, move, opacity, size, interactivity — everything needed for the matrix/network hacker look without the bloat of the `full` bundle (which adds shapes, emitters, etc. you won't need).

**Must be `"use client"` — canvas APIs are browser-only:**

```tsx
"use client";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from "react";

export function HackerBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  if (!init) return null;

  return (
    <Particles
      options={{
        fullScreen: { zIndex: -1 },
        particles: {
          color: { value: "#00ff41" }, // Terminal green
          links: { enable: true, color: "#00ff41", opacity: 0.2 },
          number: { value: 60 },
          move: { enable: true, speed: 1 },
          opacity: { value: { min: 0.1, max: 0.5 } },
          size: { value: { min: 1, max: 2 } },
        },
        interactivity: {
          events: { onHover: { enable: true, mode: "repulse" } },
        },
      }}
    />
  );
}
```

#### Glitch Effects

**Do NOT install a glitch library.** Pure CSS + Tailwind custom classes handle this with zero JS overhead:

```css
/* app/globals.css */
@keyframes glitch-1 {
  0%, 100% { clip-path: inset(0 0 98% 0); transform: translate(-2px, 0); }
  20%       { clip-path: inset(40% 0 50% 0); transform: translate(2px, 0); }
  60%       { clip-path: inset(70% 0 10% 0); transform: translate(-1px, 0); }
}
@keyframes glitch-2 {
  0%, 100% { clip-path: inset(95% 0 0 0); transform: translate(2px, 0); color: #ff0055; }
  30%       { clip-path: inset(20% 0 60% 0); transform: translate(-2px, 0); }
  70%       { clip-path: inset(60% 0 25% 0); transform: translate(1px, 0); color: #00ff41; }
}

.glitch {
  position: relative;
}
.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
}
.glitch::before { animation: glitch-1 3s infinite; }
.glitch::after  { animation: glitch-2 3s infinite 0.1s; }
```

```tsx
<h1 className="glitch" data-text="JUAN MANUEL SILVA">JUAN MANUEL SILVA</h1>
```

This approach: zero bundle cost, GPU-accelerated via `transform`, pauses when tab is hidden automatically.

#### Typing / Terminal Text Effect

| Package | Version | Purpose |
|---------|---------|---------|
| `react-type-animation` | 3.2.0 | Terminal-style typing effect for the "bio" lines |

Lightweight (no dependencies), supports sequences, deletion, looping. Exactly right for:

```tsx
<TypeAnimation
  sequence={["Full Stack Developer", 2000, "Penetration Tester", 2000, "Security Researcher", 2000]}
  repeat={Infinity}
  cursor={true}
/>
```

#### Smooth Scrolling

| Package | Version | Purpose |
|---------|---------|---------|
| `lenis` | 1.3.23 | Smooth scroll inertia, required for GSAP ScrollTrigger sync |

**This is not optional if using GSAP ScrollTrigger with scrub.** Native browser scroll events are chunky on mobile; Lenis normalizes them. Lenis integrates directly with GSAP ScrollTrigger via a ticker:

```ts
// providers/SmoothScrollProvider.tsx
"use client";
import Lenis from "lenis";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0); // Critical: prevents GSAP lag compensation from fighting Lenis

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return <>{children}</>;
}
```

---

### CSS Strategy

**Tailwind CSS v4 handles:** layout, spacing, colors, typography, responsive breakpoints, dark mode, all static styles.

**Custom CSS (`app/globals.css`) handles:** `@keyframes` definitions for glitch/shimmer, CSS custom properties for the color palette, `:root` theme variables.

**Framer Motion inline styles handle:** animated `transform`, `opacity`, `filter` values driven by `useScroll`/`useTransform`.

**GSAP handles:** programmatic `transform`, `opacity`, and custom properties on elements it owns, driven by ScrollTrigger.

**Rule:** Never use Tailwind animation utilities (`animate-*`) on elements that Framer Motion or GSAP also touches. Tailwind animation is fine for static decorative elements (spinner, pulse on a badge, etc.).

**Tailwind v4 setup for Next.js (PostCSS mode):**

```js
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

No `tailwind.config.js` needed in v4 — configuration moves to CSS via `@theme`:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-terminal-green: #00ff41;
  --color-cyber-red: #ff0055;
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #111111;
  --font-mono: "JetBrains Mono", monospace;
}
```

---

### Supporting Libraries Summary

| Library | Version | Use | Notes |
|---------|---------|-----|-------|
| `framer-motion` | 12.38.0 | Component animations, whileInView, parallax | Core |
| `gsap` | 3.15.0 | ScrollTrigger, pinned sections, scrub | Core |
| `@gsap/react` | 2.1.2 | `useGSAP` hook | Required with GSAP |
| `lenis` | 1.3.23 | Smooth scroll — sync with GSAP | Required with GSAP |
| `@tsparticles/react` | 3.0.0 | Particle background | Hero section only |
| `@tsparticles/slim` | 3.9.1 | Particle engine bundle | Pair with above |
| `react-type-animation` | 3.2.0 | Terminal typing effect | Bio/hero |
| `tailwindcss` | 4.2.4 | Utility CSS | Core |
| `@tailwindcss/postcss` | 4.2.4 | PostCSS integration for v4 | Core |

---

## Alternatives Rejected

| Category | Rejected | Why Rejected | What We Use Instead |
|----------|----------|--------------|---------------------|
| Smooth scroll | `@studio-freight/lenis` (v1.0.42) | Abandoned — forked to `lenis` (Darkroom agency) | `lenis` 1.3.23 |
| GitHub client | `@octokit/rest` v22 | 150KB+ for 1 fetch call; overkill for read-only | Native `fetch()` |
| Particles | `react-particles` (v2) | Deprecated in favor of `@tsparticles/*` packages | `@tsparticles/react` |
| Particles | `@tsparticles/nextjs` (beta) | v4.0.0-beta.12 — not production stable | `@tsparticles/react` |
| Glitch lib | `react-glitch-effect`, `glitch-js` | External dep for effect achievable in 20 lines CSS | Custom CSS keyframes |
| 3D/WebGL | `three.js`, `@react-three/fiber` | Massive bundle, hard mobile perf target, overkill | tsParticles + CSS |
| Scroll | `react-scroll`, `framer-motion` scroll-only | Framer scroll lacks GSAP's pinning precision | GSAP ScrollTrigger |
| CSS-in-JS | `styled-components`, `emotion` | Runtime overhead, conflicts with Tailwind | Tailwind + global CSS |
| Tailwind v3 | `tailwindcss@3.x` | v4 is stable, v3 is maintenance-only | Tailwind 4.2.4 |

---

## Versions to Pin or Avoid

**Pin these exactly:**

```json
{
  "framer-motion": "12.38.0",
  "gsap": "3.15.0",
  "@gsap/react": "2.1.2",
  "lenis": "1.3.23"
}
```

Minor updates to `framer-motion` and `gsap` can break animation behavior in non-obvious ways mid-project.

**Avoid:**

- `framer-motion@5.x` — old API, lacks `scroll()` function and motion+ APIs
- `gsap@4.x` — does not exist yet; v3 is current stable
- `@tsparticles/nextjs@4.x` — beta, API unstable
- `@studio-freight/lenis` — abandoned repo, use `lenis` instead
- `tailwindcss@3.x` — maintenance mode; v4 is the active branch with better performance
- Any `react@18.x` pinning — React 19 is current stable and all animation libs support it

**React 19 + Next.js 16 compatibility confirmed:**
- `framer-motion@12.38.0`: peer deps `react: '^18.0.0 || ^19.0.0'` — HIGH confidence
- `gsap@3.15.0`: no React peer dep (framework-agnostic) — HIGH confidence
- `@gsap/react@2.1.2`: peer deps `react: '>=17'` — HIGH confidence
- `lenis@1.3.23`: peer deps `react: '>=17.0.0'` — HIGH confidence
- `@tsparticles/react@3.0.0`: verified Next.js App Router example in official docs — HIGH confidence

---

## Installation

```bash
# Core framework (if starting fresh)
npx create-next-app@latest jms-folio --typescript --tailwind --app --src-dir

# Animation core
npm install framer-motion@12.38.0 gsap@3.15.0 @gsap/react@2.1.2 lenis@1.3.23

# Particle effects
npm install @tsparticles/react@3.0.0 @tsparticles/slim@3.9.1

# Typing effect
npm install react-type-animation@3.2.0

# Tailwind v4 PostCSS adapter (if not auto-installed)
npm install -D @tailwindcss/postcss@4.2.4
```

---

## Performance Notes for 60fps Target

1. **GSAP ScrollTrigger with `scrub: 1`** uses `requestAnimationFrame` internally — GPU-accelerated by default on `transform` and `opacity`. Never scrub `width`, `height`, `top`, `left` — those trigger layout reflow.

2. **Framer Motion `whileInView`** uses IntersectionObserver under the hood — zero scroll listener overhead.

3. **tsParticles `slim` bundle** on mobile: cap particles at 40–60 (`number.value: 60`), disable interactivity on small screens via media query or `window.matchMedia`.

4. **Lenis + GSAP ticker sync** (`gsap.ticker.lagSmoothing(0)`) is mandatory — without it, GSAP's lag compensation fights Lenis on slow frames and causes stutter.

5. **All GSAP and particle components** must be `"use client"` — they access `window`, `document`, `requestAnimationFrame`. Wrap them in Next.js `dynamic()` with `{ ssr: false }` for any that cause hydration mismatches.

---

## Sources

- framer-motion npm registry: `npm view framer-motion` (version 12.38.0, React 19 peer deps confirmed)
- GSAP official skills (Context7 `/greensock/gsap-skills`): `useGSAP` hook, ScrollTrigger cleanup, SSR patterns
- GSAP npm registry: version 3.15.0
- @gsap/react npm registry: version 2.1.2, peer deps `react: '>=17'`
- Next.js Context7 docs (`/vercel/next.js` v15.1.8): fetch caching, `revalidate`, tag-based invalidation
- tsParticles Context7 docs (`/tsparticles/tsparticles`): Next.js App Router integration pattern
- lenis npm registry: version 1.3.23, confirmed `@studio-freight/lenis` is the deprecated fork
- Tailwind CSS npm registry: v4.2.4 stable confirmed
- react-type-animation npm registry: version 3.2.0
