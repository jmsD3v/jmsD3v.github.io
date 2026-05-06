# STATE — jms-folio

**Last updated:** 2026-05-06
**Session:** Portfolio completo — deployado en Vercel, repo en GitHub, animaciones, carouseles, fixes móvil.

---

## Current Position

**Estado:** ✅ COMPLETO — en producción

**URL:** https://jmsilva.dev (dominio personalizado en Vercel, configurar DNS si no está activo)
**Repo:** https://github.com/jmsD3v/jmsD3v.github.io (branch: main)

**Progress bar:**
```
Phase 1 [##########] 100% ✓
Phase 2 [##########] 100% ✓
Phase 3 [##########] 100% ✓
Phase 4 [##########] 100% ✓
Phase 5 [##########] 100% ✓
Deploy  [##########] 100% ✓
```

---

## What's Built

### Stack
- Next.js 15 App Router · TypeScript 5 strict · Tailwind v4 · Framer Motion 12 · GSAP 3 · Lenis 1.3
- Deploy: Vercel · Repo: GitHub Pages (jmsD3v.github.io forzado a Next.js)

### Estructura de archivos
```
src/
  app/
    layout.tsx        ✓ metadata completo: metadataBase jmsilva.dev, OG, Twitter card,
                        canonical, icons (hacker.ico)
    page.tsx          ✓ todas secciones + footer @jmsDev + overflow-x-hidden en main
    globals.css       ✓ @theme tokens, glitch keyframes, overflow-x hidden en body
  lib/
    github.ts         ✓ fallback sin token: /users/{username}/repos (público)
                        con token: /user/repos (privados+públicos) — try/catch → []
    pixel-palettes.ts ✓ paletas HSL para About/Dev/Projects/Contact/Hacker
    utils.ts          ✓ cn()
  types/
    hero/github/showcase/projects/carousel/about  ✓
  contexts/
    ProjectContext.tsx  ✓ selectedProject compartido DevSection ↔ ProjectsSection
  components/
    animations/variants.ts  ✓ fadeInFrom*, staggerContainer, glitchReveal
    providers/
      SmoothScrollProvider.tsx  ✓ Lenis + GSAP ticker
      AnimationProvider.tsx     ✓ LazyMotion + domAnimation
      FontsReady.tsx            ✓ ScrollTrigger.refresh()
    sections/
      HeroSection.tsx     ✓ canvas rain (80 mobile / 300 desktop) + TextScramble cycling
      AboutSection.tsx    ✓ 3-col grid, foto, BUILD/SECURE overlay, location footer
      DevSection.tsx      ✓ TerminalText + DevShowcase + VerticalCarousel(h=420) + HorizontalCertCarousel
      DevShowcase.tsx     ✓ FeatureShowcase reactivo + PROJECT_PREVIEW_TABS (tecnoinstalador)
      ProjectsSection.tsx ✓ Server Component, fetch GitHub ISR 1h, blacklist, fallback []
      ProjectsClient.tsx  ✓ filtros All/Dev/Hacker + cards + scroll-to-dev on select
      ModeTransition.tsx  ✓ GSAP pinned DEVELOPER→HACKER morph, reduced-motion compat
      HackerSection.tsx   ✓ Pentest phases + Blue/Forensics skills + VerticalCarousel +
                            HorizontalCertCarousel (10 certs extra) + CTF platforms + CTA
      ContactSection.tsx  ✓ Gmail compose + WhatsApp + LinkedIn + GitHub + CV download
    ui/
      PixelBg.tsx           ✓ canvas animation, IntersectionObserver pause off-screen,
                              opacity=0.20 + rgba(10,10,10,0.55) overlay, gap=12, 30fps
      HackerPixelBg.tsx     ✓ variante para HackerSection
      HorizontalCertCarousel.tsx ✓ 3 cards/page, AnimatePresence slide, stagger entry,
                                   whileHover lift (y:-4), accentColor prop
      VerticalCarousel.tsx  ✓ auto-rotate 4.5s, dot nav, pause-on-hover, slide animation
      SectionDotNav.tsx     ✓ hidden en mobile (hidden md:flex), 6 secciones, tooltip hover
      ProjectCard.tsx       ✓ button, selected state, lang color, topics
      TerminalText.tsx      ✓ typewriter + cursor parpadeante
      badge/button/card/tabs/accordion  ✓
    feature-showcase.tsx  ✓ 12-col grid, accordion steps, tabs image, detect mobile shot
```

### Assets en public/
```
public/
  about/juanma.png                         ✓
  hacker.ico                               ✓
  og-image.png                             ✓ (1200×630 para OG/Twitter)
  cv/juan-manuel-silva-cv.pdf              ✓
  certs/
    ai-engineer-datacamp.png               ✓
    aux-tec-ciberseguridad-teclab.png      ✓
    big-ciberseguridad.png                 ✓
    c-osia-compuweb.png                    ✓
    ciso-xmcyber.png                       ✓
    cpps-hack-fix.png                      ✓
    crtom-redteamleaders.png               ✓
    cybersecurity-architect-microsoft.png  ✓
    full-stack-dev-coderhouse.png          ✓
    google-cybersecurity.png               ✓
    googlecybersecurityprofessionalcertificatev2badge.png  ✓
    gsap-midudev.png                       ✓
    ia-workflows-bigschool.png             ✓
    icip-opswat.png                        ✓
    lfs101-linuxfoundation.png             ✓
    lic-ciberdefensa-fadena.png            ✓
    linux-pentester-hm.png                 ✓
    mcp-midudev.png                        ✓
    peritaje-e-informatica-forense-hm.png  ✓
    python-dev-datacamp.png                ✓
    tailwind-midudev.png                   ✓
  projects/
    tecnoinstalador-desktop.png  ✓
    tecnoinstalador-mobile.png   ✓
```

### GitHub repos excluidos de ProjectsSection
escrutinio-app, E-commerce-Backend-l, 1raPreEntregaBackend2, VendingMachine.-JS,
HEXA-landing-Page, 1raPreentregaBackend3, hexa-solarflow, AdoptMe,
Landing-Diversos-JS-PF, jmsD3v, jmsD3v.github.io, curso_node-RED, tron-ares-theme

---

## Bugs resueltos en esta sesión
- `ease: 'easeOut' as const` — Framer Motion 12 Easing type error (Vercel build fail)
- `animRef.current` capturado antes del cleanup → react-hooks/exhaustive-deps warning
- `github.ts` sin token usaba `/user/repos` (requiere auth) → 403 Vercel → fallback a `/users/{user}/repos`
- `body` faltaba `overflow-x: hidden` → franja negra a la derecha en mobile
- `SectionDotNav` oculto en mobile (`hidden md:flex`)
- TerminalText: `done` unused var → `_, setDone`

---

## Lighthouse (última medición)
| Metric | Score |
|---|:---:|
| Performance | 96 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

---

## Posibles mejoras futuras
- Agregar más fotos de proyectos en `public/projects/{repoName}.png` para el DevShowcase
- `GITHUB_TOKEN` en Vercel env vars → habilita repos privados en ProjectsSection
- Agregar certs nuevas a `DEV_EXTRA_CERTS` o `HACKER_EXTRA_CERTS` en sus respectivos Section.tsx
- `HorizontalCertCarousel visibleCount` prop: pasar `2` en mobile si se quiere 2 columnas en sm
- Internacionalización (i18n) si se quiere versión en inglés

---

## Architecture Rules (vigentes)
- `pnpm` exclusivamente — nunca npm/yarn
- Types → siempre en `src/types/`
- Interfaces inline en componentes → prohibido
- `suppressHydrationWarning` en `<html>`
- Footer @jmsDev obligatorio
- GSAP → `useGSAP()` nunca `useEffect`
- Framer Motion y GSAP nunca en el mismo elemento
- Server-only: `lib/github.ts` nunca importar desde Client Components
- ESLint: `/* eslint-disable react/jsx-no-comment-textnodes */` en secciones con texto `// terminal style`
- Build prod: `pnpm exec next build` (sin `--turbopack`) → luego `pnpm exec next start`
- `ease` en Framer Motion variants → siempre `'easeOut' as const` (no string literal crudo)

---

*Last updated: 2026-05-06*
