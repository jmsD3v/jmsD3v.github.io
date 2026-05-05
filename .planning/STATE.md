# STATE — jms-folio

**Last updated:** 2026-05-05
**Session:** Phases 1–5 complete — pendiente: About Me + datos reales (WhatsApp, CV, cert images)

---

## Current Position

**Next action:** About Me section + datos reales (WhatsApp, CV path, cert images)

**Progress bar:**
```
Phase 1 [##########] 100% ✓
Phase 2 [##########] 100% ✓
Phase 3 [##########] 100% ✓
Phase 4 [##########] 100% ✓
Phase 5 [##########] 100% ✓
```

---

## What's Built

### Estructura de archivos
```
src/
  app/
    layout.tsx          ✓ SmoothScrollProvider + AnimationProvider + metadata
    page.tsx            ✓ HeroSection + ProjectProvider + DevSection + ProjectsSection + footer
    globals.css         ✓ @theme tokens, glitch keyframes, accordion anim, .dud, scrollbar
  lib/
    github.ts           ✓ server-only, /user/repos (públicos+privados), categorizeRepo inteligente
    utils.ts            ✓ cn()
  types/
    hero.ts             ✓ Character
    github.ts           ✓ GitHubRepo
    showcase.ts         ✓ FeatureShowcaseProps, TabMedia, ShowcaseStep
    projects.ts         ✓ ProjectCardData, ProjectFilter
  contexts/
    ProjectContext.tsx  ✓ selectedProject state compartido DevSection ↔ ProjectsSection
  components/
    animations/
      variants.ts       ✓ fadeInFrom*, staggerContainer, glitchReveal
    providers/
      SmoothScrollProvider.tsx  ✓ Lenis + GSAP ticker
      AnimationProvider.tsx     ✓ LazyMotion + domAnimation
    sections/
      HeroSection.tsx           ✓ RainingLetters + TextScramble cycling phrases
      DevSection.tsx            ✓ TerminalText header + DevShowcase
      DevShowcase.tsx           ✓ FeatureShowcase reactivo al proyecto seleccionado
      ProjectsSection.tsx       ✓ Server Component, fetch GitHub, blacklist, exclusiones
      ProjectsClient.tsx        ✓ Filtros All/Dev/Hacker + cards + scroll-to-dev on select
      ModeTransition.tsx        ✓ GSAP pinned DEVELOPER→HACKER morph, mobile no-pin, reduced-motion crossfade
      HackerSection.tsx         ✓ Pentest phases, certs, tool arsenal, HTB/THM links, mailto CTA
    ui/
      ProjectCard.tsx           ✓ button, selected state, lang color, topics
      TerminalText.tsx          ✓ typewriter + cursor parpadeante permanente
      badge.tsx / button.tsx / card.tsx / tabs.tsx / accordion.tsx  ✓
    feature-showcase.tsx        ✓ layout 12-col, accordion steps, tabs image, object-contain
  JUANMA.md                     ✓ (era loQueMeGusta.md)
```

### GitHub repos configurados
- 12 repos privados → topics seteados via API
- HEXA-LandingPage homepage: hexaservicios.com
- TecnoInstalador homepage: tecnoinstalador.net
- EXCLUDED: escrutinio-app, E-commerce-Backend-l, 1raPreEntregaBackend2, VendingMachine.-JS, HEXA-landing-Page, 1raPreentregaBackend3, hexa-solarflow, AdoptMe, Landing-Diversos-JS-PF, jmsD3v, jmsD3v.github.io, curso_node-RED, tron-ares-theme

---

## Pending

### Phase 3 — HackerSection + Scroll Transition ✓
- [x] `HackerSection.tsx` — pentest phases, certs, tools, HTB/THM links, mailto CTA
- [x] `ModeTransition.tsx` — GSAP pinned DEVELOPER→HACKER text morph with scrub
- [x] Mobile: sin pin (`max-width: 767px` check)
- [x] Reduced-motion: opacity crossfade sin scrub

### Phase 5 — Contact + Polish + QA ✓
- [x] `ContactSection.tsx` — email + clipboard copy, WhatsApp, LinkedIn, GitHub, CV download
- [x] `SectionDotNav.tsx` — fixed right, IntersectionObserver, tooltip on hover, aparece al scrollear
- [x] `FontsReady.tsx` — ScrollTrigger.refresh() en document.fonts.ready
- [x] `id="hero"` agregado a HeroSection
- [ ] Lighthouse audit ≥85 desktop (pendiente)
- [ ] Cross-browser check (pendiente)

### Pendiente datos reales
- [ ] WhatsApp number en ContactSection.tsx (WHATSAPP const)
- [ ] CV file en public/cv/juan-manuel-silva-cv.pdf
- [ ] Cert images en public/certs/*.png
- [ ] About Me section (usuario tiene diseño de 21st.dev)

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

---

*Last updated: 2026-05-05*
