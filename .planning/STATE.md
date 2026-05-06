# STATE — jms-folio

**Last updated:** 2026-05-06
**Session:** Lighthouse audit completado — todos los scores ≥85. Pendiente: cross-browser, CV PDF.

---

## Current Position

**Next action:** Cross-browser check (Chrome, Firefox, Edge). Luego CV PDF.

**Progress bar:**
```
Phase 1 [##########] 100% ✓
Phase 2 [##########] 100% ✓
Phase 3 [##########] 100% ✓
Phase 4 [##########] 100% ✓
Phase 5 [##########]  95% — Cross-browser pendiente + CV PDF
```

---

## What's Built

### Estructura de archivos
```
src/
  app/
    layout.tsx          ✓ SmoothScrollProvider + AnimationProvider + metadata
    page.tsx            ✓ todas las secciones + footer @jmsDev
    globals.css         ✓ @theme tokens, glitch keyframes, accordion anim, .dud, scrollbar
  lib/
    github.ts           ✓ server-only, /user/repos (públicos+privados), categorizeRepo inteligente
    utils.ts            ✓ cn()
  types/
    hero.ts / github.ts / showcase.ts / projects.ts / carousel.ts / about.ts  ✓
  contexts/
    ProjectContext.tsx  ✓ selectedProject estado compartido DevSection ↔ ProjectsSection
  components/
    animations/variants.ts  ✓ fadeInFrom*, staggerContainer, glitchReveal
    providers/
      SmoothScrollProvider.tsx  ✓ Lenis + GSAP ticker
      AnimationProvider.tsx     ✓ LazyMotion + domAnimation
      FontsReady.tsx            ✓ ScrollTrigger.refresh() en fonts.ready
    sections/
      HeroSection.tsx     ✓ RainingLetters (80 mobile / 300 desktop) + TextScramble cycling
                            ✓ Responsive: text-2xl→lg:text-7xl, tracking escalado, 300→80 chars mobile
      AboutSection.tsx    ✓ 3-col grid, foto centrada, BUILD/SECURE overlay, location footer
                            ✓ Responsive: min-h-screen, imagen escalada, clamp ajustado
      DevSection.tsx      ✓ TerminalText + DevShowcase + VerticalCarousel certs (h=420)
      DevShowcase.tsx     ✓ FeatureShowcase reactivo + PROJECT_PREVIEW_TABS (tecnoinstalador)
      ProjectsSection.tsx ✓ Server Component, fetch GitHub ISR, blacklist, exclusiones
      ProjectsClient.tsx  ✓ Filtros All/Dev/Hacker + cards + scroll-to-dev on select
      ModeTransition.tsx  ✓ GSAP pinned DEVELOPER→HACKER morph, mobile no-pin, reduced-motion
      HackerSection.tsx   ✓ Pentest phases, certs (h=420), tools, HTB/THM links, mailto CTA
      ContactSection.tsx  ✓ Gmail compose + WhatsApp real + LinkedIn + GitHub + CV download
    ui/
      ProjectCard.tsx      ✓ button, selected state, lang color, topics
      TerminalText.tsx     ✓ typewriter + cursor parpadeante
      SectionDotNav.tsx    ✓ 6 secciones, IntersectionObserver, tooltip, aparece al scrollear
      VerticalCarousel.tsx ✓ cert images, dot nav, animación slide, [captura pendiente] fallback
      badge / button / card / tabs / accordion  ✓
    feature-showcase.tsx  ✓ 12-col grid, accordion steps, tabs image, mobile/desktop fit inteligente
```

### Assets presentes
```
public/
  about/juanma.png          ✓
  certs/*.png               ✓ (8 archivos)
  projects/
    jms-folio-desktop.png   ✓
    jms-folio-mobile.png    ✓
    tecnoinstalador-desktop.png  ✓
    tecnoinstalador-mobile.png   ✓
  cv/                       ✓ dir existe — FALTA juan-manuel-silva-cv.pdf (usuario debe agregar)
```

### GitHub repos configurados
- 12 repos privados → topics seteados via API
- HEXA-LandingPage homepage: hexaservicios.com
- TecnoInstalador homepage: tecnoinstalador.net
- EXCLUDED: escrutinio-app, E-commerce-Backend-l, 1raPreEntregaBackend2, VendingMachine.-JS, HEXA-landing-Page, 1raPreentregaBackend3, hexa-solarflow, AdoptMe, Landing-Diversos-JS-PF, jmsD3v, jmsD3v.github.io, curso_node-RED, tron-ares-theme

---

## Pending

### Phase 5 — finales
- [x] Build limpio sin errores TypeScript/ESLint
- [x] Mobile responsive: Hero + About corregidos
- [x] **Lighthouse audit ≥85 desktop** — Perf:92 A11y:100 BP:100 SEO:100
- [ ] **Cross-browser check (Chrome, Firefox, Edge)** ← NEXT
- [ ] CV PDF: colocar `juan-manuel-silva-cv.pdf` en `public/cv/`

---

## Architecture Rules (vigentes)
- pnpm exclusivamente
- Types → siempre en `src/types/`
- Interfaces inline en componentes → prohibido
- `suppressHydrationWarning` en `<html>`
- Footer @jmsDev obligatorio
- GSAP → `useGSAP()` never `useEffect`
- Framer Motion y GSAP nunca en el mismo elemento
- Server-only: `lib/github.ts` nunca importar desde Client
- ESLint: `/* eslint-disable react/jsx-no-comment-textnodes */` en secciones con texto `// terminal style`

---

*Last updated: 2026-05-06*
