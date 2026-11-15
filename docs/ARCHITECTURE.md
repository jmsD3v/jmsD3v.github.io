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

## ADR-002 · Credenciales verificables (Credly y POK) como datos estáticos

**Fecha:** 2026-11-15 · **Estado:** aceptada

**Contexto.** Los certificados eran solo capturas: nadie podía comprobarlos. Había además cuatro badges en Credly y el Diplomado en Industria 4.0 (IngeLearn, credencial en POK) figuraba "en proceso" y sin temario.

**Decisión.**
- Los badges de Credly se cargan a mano en `CREDLY_BADGES` (`HackerSection.tsx`), con la imagen bajada a `public/badges/` (340 px). No se consulta la API de Credly en runtime ni en build: son cuatro badges que cambian un par de veces por año, y así el sitio no depende de un tercero ni necesita permitir otro host de imágenes.
- `CarouselItem` suma `credentialUrl` (opcional). Si está, las tarjetas de ambos carruseles muestran "Verificar ↗".
- El diplomado tiene bloque propio (`DiplomaHighlight`) con sus 11 módulos; los tipos nuevos viven en `src/types/credentials.ts`.
- La lista de "Formación destacada" de la sección Dev sale del mismo arreglo que el carrusel (`DEV_CERTS`): antes eran dos listas iguales mantenidas a mano.
- Un badge vencido se muestra en gris con su fecha de vencimiento, no se oculta.
- De paso: `robots.txt`, `sitemap.xml` y datos estructurados `Person` (JSON-LD) en el layout.

**Consecuencias.**
- Un badge nuevo en Credly no aparece solo: hay que bajar la imagen y sumar la entrada.
- Las fechas de LFS101 (oct. 2025) e ICIP (sep. 2025) se corrigieron según Credly.

**Cómo sumar un badge.**
1. Bajar la imagen desde Credly a `public/badges/<nombre>.png` (340 px).
2. Agregar la entrada al principio de `CREDLY_BADGES` con el id del badge (el de la URL pública).
3. Si el certificado ya está en un carrusel, sumarle `credentialUrl`.
