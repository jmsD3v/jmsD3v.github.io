# jms-folio — Portfolio Multi-Perfil con Animaciones

## What This Is

Portfolio personal de Juan Manuel Silva que presenta tres perfiles bajo un mismo sitio: **Dev (Full Stack)**, **Hacker (Ciberseguridad)** e **Instalador físico** (este último diferido para v2). El sitio funciona como una experiencia narrativa al scrollear — animaciones intensas entrada/salida desde costados, arriba y abajo, tanto al bajar como al subir. La sección de proyectos se auto-actualiza desde GitHub vía API en runtime. El portfolio no vende solo habilidades técnicas — vende una identidad dual y un perfil físico único que pocos tienen.

**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + Framer Motion + GSAP/ScrollTrigger

## Core Value

Mostrar los dos perfiles principales (Dev + Hacker) con una estética **dark hacker + dev** (negro/verde terminal, glitch effects, cyber vibes) que unifique visualmente ambas identidades — con animaciones de scroll de alta calidad que generen impacto desde el primer segundo.

## Context

- **Existente:** `jmsdev.tech` — portfolio minimalista Next.js, solo perfil full stack, proyectos hardcodeados. Se mantiene hasta que el nuevo esté listo.
- **Proyectos actuales:** pocos en GitHub, faltan proyectos backend, Python y ciberseguridad. Ya hay al menos 1 proyecto cyber hecho (no mostrado aún).
- **Problema:** portfolio actual no llama la atención, no muestra el perfil hacker, no se actualiza solo.
- **Objetivo final:** cuando el nuevo esté listo, migrar a nuevo dominio (reemplazar `jmsdev.tech` o redirigir).

## Who It's For

- Potenciales clientes y empleadores que buscan un dev full stack
- Clientes que necesitan servicios de ciberseguridad / pentesting
- Cualquier persona que llegue al perfil de Juan desde LinkedIn, GitHub, o redes sociales

## Requirements

### Validated

(Ninguno aún — primer milestone)

### Active

**Hero & Identidad**
- [ ] Hero section con identidad dual Dev/Hacker — animación de entrada impactante
- [ ] Selector o transición visual entre los dos perfiles
- [ ] Background: partículas, glitch, o efecto terminal/matrix

**Animaciones de Scroll**
- [ ] Elementos entran desde izquierda, derecha, arriba y abajo según posición
- [ ] Animaciones al bajar Y al subir (bidireccionales)
- [ ] Textos con efectos typing/reveal al entrar en viewport
- [ ] Imágenes/cards con parallax sutil
- [ ] Performance: 60fps en móvil y desktop (Framer Motion + GSAP ScrollTrigger)

**Perfiles**
- [ ] Sección "Dev" — skills full stack, stack tech, experiencia
- [ ] Sección "Hacker / Ciberseguridad" — skills, certificaciones, herramientas
- [ ] Transición dramática entre perfiles al scrollear

**Proyectos auto-actualizados**
- [ ] GitHub API (runtime fetch) — lista repos públicos automáticamente
- [ ] Filtro por perfil: Dev / Hacker / Todos
- [ ] Cards de proyectos con animación de entrada
- [ ] Badge de lenguaje, descripción, link al repo
- [ ] Lógica de categorización por topics de GitHub (`dev`, `security`, `python`, etc.)

**Contacto**
- [ ] Sección de contacto con links relevantes (email, LinkedIn, GitHub)

### Out of Scope (v1)

- Perfil Instalador físico — diferido para v2 cuando haya más proyectos de ese rubro
- CMS o panel admin — los textos se editan en código
- Blog — diferido
- Autenticación — no aplica
- Analytics — diferido (se puede agregar post-lanzamiento)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dark hacker + dev aesthetic | Unifica visualmente ambos perfiles, más impacto que split clean/dark | Pendiente |
| Framer Motion + GSAP | Framer para componentes React, GSAP ScrollTrigger para scroll complejos | Pendiente |
| GitHub API runtime fetch | Siempre al día sin rebuild, necesita `GITHUB_TOKEN` en env | Pendiente |
| Next.js App Router | Consistente con proyectos existentes del usuario | Pendiente |
| Nuevo dominio (no reemplazar jmsdev.tech aún) | Construir en paralelo, migrar cuando esté listo | Pendiente |
| YOLO mode + granularidad Fina | Max velocidad, fases muy específicas | Pendiente |
| Perfil Instalador diferido | No hay proyectos suficientes para esa sección | Diferido v2 |

## Evolution

Este documento evoluciona en cada transición de fase.

**Después de cada fase:**
1. ¿Requirements invalidados? → mover a Out of Scope con razón
2. ¿Requirements validados? → mover a Validated con referencia de fase
3. ¿Nuevos requirements? → agregar a Active
4. ¿Decisiones a loguear? → agregar a Key Decisions

---
*Last updated: 2026-05-04 — initialization*
