<div align="center">

```
 ██╗███╗   ███╗███████╗██╗██╗    ██╗   █████╗     ██████╗ ███████╗██╗   ██╗
 ██║████╗ ████║██╔════╝██║██║    ██║  ██╔══██╗    ██╔══██╗██╔════╝██║   ██║
 ██║██╔████╔██║███████╗██║██║    ██║  ███████║    ██║  ██║█████╗  ██║   ██║
 ██║██║╚██╔╝██║╚════██║██║██║    ╚═╝  ██╔══██║    ██║  ██║██╔══╝  ╚██╗ ██╔╝
 ██║██║ ╚═╝ ██║███████║██║███████╗    ██║  ██║    ██████╔╝███████╗ ╚████╔╝ 
 ╚═╝╚═╝     ╚═╝╚══════╝╚═╝╚══════╝    ╚═╝  ╚═╝    ╚═════╝ ╚══════╝  ╚═══╝  
```

**Full Stack Developer · IA Engineer · Security Researcher**

[![Live](https://img.shields.io/badge/Live-jmsilva.dev-00ff41?style=for-the-badge&logo=vercel&logoColor=white)](https://jmsilva.dev)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-96%2F100-orange?style=for-the-badge&logo=lighthouse&logoColor=white)](#-performance)

</div>

---

## ✦ Overview

Personal portfolio of **Juan Manuel Silva** — built with a dual persona: a **dev side** (blues, full stack showcase) and a **hacker side** (reds, security research). Single-page app with smooth scroll, canvas pixel animations, and certification carousels.

> Las Breñas, Chaco · Argentina

---

## ✦ Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 strict |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 + GSAP 3 |
| Scroll | Lenis (smooth scroll) |
| Icons | Lucide React |
| Deploy | Vercel |

---

## ✦ Sections

```
/
├── Hero          — terminal glitch intro, dual-mode CTA
├── About         — bio, photo, location
├── Dev           — full stack showcase, featured certs, extra cert carousel
│   └── DevShowcase — project cards with live / repo links
├── ModeTransition — animated section separator
├── Hacker        — security research, CTF projects, cert carousel (10 certs)
├── Projects      — GitHub repo grid (fetched via API, filtered list)
└── Contact       — social links
```

---

## ✦ Notable Features

**PixelBg** — Custom canvas animation on every section. Pixels spawn from center outward, flicker, then fade. IntersectionObserver pauses rAF off-screen. 30fps cap. Adaptive gap prevents >25 000 pixels on tall sections.

**HorizontalCertCarousel** — Page-based cert carousel (3 per page). Stagger entry animation, `whileHover` lift, `AnimatePresence` slide on page change. Accent color injected per section (blue dev / red hacker).

**VerticalCarousel** — Auto-rotating featured cert showcase with dot nav and pause-on-hover.

**Dual persona** — Dev palette: blue. Hacker palette: red. Shared component tree, different `accentColor` props.

---

## ✦ Getting Started

```bash
# Install (always pnpm)
pnpm install

# Dev server
pnpm dev

# Production build + serve
pnpm exec next build
pnpm exec next start
```

> ⚠️ Always use `pnpm`. Never `npm` or `yarn`.  
> The `--turbopack` flag in `package.json` applies to `dev` only. Production builds use webpack via `next build`.

---

## ✦ Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Metadata, OG tags, canonical, Twitter card
│   ├── page.tsx          # Section composition
│   └── globals.css       # CSS custom properties, theme tokens
├── components/
│   ├── sections/         # Hero · About · Dev · Hacker · Projects · Contact
│   └── ui/               # PixelBg · VerticalCarousel · HorizontalCertCarousel · ...
├── lib/
│   ├── pixel-palettes.ts # HSL color palettes per section
│   ├── github.ts         # GitHub API fetch + server-side cache
│   └── utils.ts          # cn(), misc helpers
└── types/                # carousel.ts · projects.ts · about.ts
```

---

## ✦ Performance

Lighthouse scores — production build, cold start:

| Metric | Score |
|---|:---:|
| Performance | **96** |
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **100** |

---

## ✦ Environment Variables

```env
GITHUB_USERNAME=jmsD3v     # GitHub username (optional — falls back to default)
GITHUB_TOKEN=ghp_...       # Raises API rate limit from 60 → 5000 req/hr
```

---

## ✦ Deploy

Hosted on **Vercel** with custom domain `jmsilva.dev`.

1. Import repo in Vercel dashboard
2. Add env vars (`GITHUB_TOKEN`)
3. Assign custom domain → `jmsilva.dev`

---

<div align="center">

Made by **Juan Manuel Silva** · [jmsilva.dev](https://jmsilva.dev) · [@jmsD3v](https://github.com/jmsD3v)

</div>
