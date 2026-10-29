# Arquitectura · jms-folio

Decisiones de arquitectura del portfolio (ADR). Cada una dice qué se decidió, por qué y qué implica.

## ADR-001 · Casos de estudio como páginas estáticas `/casos/<slug>`

**Fecha:** 2026-10-29 · **Estado:** aceptada

**Contexto.** El portfolio era una sola página: los proyectos salen de la API de GitHub y enlazan al repo, y los destacados (`FLAGSHIP`, `DevShowcase`) son bloques con datos en TypeScript dentro de cada componente. Un caso de estudio académico (arquitectura segura en la nube, TECLAB) no tiene repo y su contenido es largo: no entra en una tarjeta.

**Decisión.**
- Cada caso es una ruta estática del App Router: `src/app/casos/<slug>/page.tsx`.
- El contenido va en `src/app/casos/<slug>/content.ts`, tipado con `CaseStudy` (`src/types/case-study.ts`). Sin MDX ni dependencias nuevas: igual que el resto del sitio, el contenido es TypeScript.
- La imagen para redes se genera con `opengraph-image.tsx` (`next/og`, incluido en Next).
- Los PDFs del caso van en `public/pdf/` y se enlazan con `target="_blank" rel="noopener noreferrer"`.
- La entrada al caso es una tarjeta en la sección Hacker, con el mismo formato que el proyecto insignia.
- El footer es un componente compartido (`SiteFooter`) para que todas las páginas lleven el mismo.

**Consecuencias.**
- La página se prerenderiza (○ estática), con `title`, `description`, canonical y Open Graph propios.
- Para que los links `#id` del índice funcionen, Lenis se crea con `anchors: true`.
- `html` y `body` pasan de `overflow-x: hidden` a `overflow-x: clip`: con `hidden` el `body` se convertía en contenedor de scroll y ningún `position: sticky` funcionaba (el índice del caso). `clip` recorta igual el desborde horizontal en mobile.
- Se eliminó la `<meta name="description">` escrita a mano en `layout.tsx`: duplicaba la de `metadata` y pisaba la descripción propia de cada caso.

**Cómo sumar un caso nuevo.**
1. Crear `src/app/casos/<slug>/content.ts` exportando un objeto `CaseStudy`.
2. Copiar `page.tsx` y `opengraph-image.tsx` de un caso existente y apuntarlos al nuevo `content.ts` (si el caso no tiene diagrama, sacar ese bloque).
3. Subir los PDFs a `public/pdf/` y listarlos en `documents`.
4. Sumar la tarjeta de entrada en la sección que corresponda (Hacker o Dev).
5. Verificar a 360 px y en escritorio: sin scroll horizontal, tablas y diagramas dentro de su contenedor con `overflow-x-auto`.
