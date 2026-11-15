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
- Los badges se muestran todos igual, sin marca de vencimiento (decisión del 2026-11-15): el vencimiento se ve en Credly al verificar.
- De paso: `robots.txt`, `sitemap.xml` y datos estructurados `Person` (JSON-LD) en el layout.

**Consecuencias.**
- Un badge nuevo en Credly no aparece solo: hay que bajar la imagen y sumar la entrada.
- Las fechas de LFS101 (oct. 2025) e ICIP (sep. 2025) se corrigieron según Credly.

**Cómo sumar un badge.**
1. Bajar la imagen desde Credly a `public/badges/<nombre>.png` (340 px).
2. Agregar la entrada al principio de `CREDLY_BADGES` con el id del badge (el de la URL pública).
3. Si el certificado ya está en un carrusel, sumarle `credentialUrl`.

## ADR-003 · Animaciones: pausar lo que no se ve y respetar "reducir movimiento"

**Fecha:** 2026-11-15 · **Estado:** aceptada

**Contexto.** Una revisión del código de animación encontró trabajo que nadie veía: la lluvia del hero dibujaba 60 veces por segundo aunque el visitante estuviera en el contacto; el fondo de píxeles pintaba hasta 25.000 rectángulos por cuadro en secciones de varias pantallas; el tipeo de los encabezados arrancaba al cargar la página y terminaba antes de llegar a verlo; el ticker de Lenis nunca se quitaba al desmontar. Además casi nada respetaba `prefers-reduced-motion`, y el título del hero movía el subtítulo en cada cambio de frase.

**Decisión.**
- Hero: la lluvia y la mezcla del título corren solo con el hero en pantalla y la pestaña visible. El `<h1>` tiene alto fijo y `aria-label` con el nombre.
- `PixelBg`: limpia y dibuja solo la franja visible (más 200 px de margen).
- `TerminalText`: empieza a escribir cuando entra en pantalla.
- `VerticalCarousel`: no avanza solo fuera de pantalla ni con el mouse o el foco encima.
- `SmoothScrollProvider`: se quita el ticker con la misma referencia con la que se agregó.
- Movimiento reducido: no se monta Lenis, los canvas quedan quietos, el título no se mezcla, el tipeo aparece completo, el carrusel no avanza solo y Framer Motion usa `MotionConfig reducedMotion="user"`.

**Consecuencias.**
- Medido en el build local a 1440 px: en la sección Hacker el fondo pasa de ~743.000 a ~150.000 rectángulos por segundo (a 390 px, de ~642.000 a ~64.000); la lluvia del hero pasa de 18.000 a 0 textos por segundo cuando no está en pantalla.
- Regla para lo que venga: todo loop nuevo se pausa fuera de pantalla y tiene variante sin movimiento.

## ADR-004 · Content-Security-Policy sin nonces

**Fecha:** 2026-11-15 · **Estado:** aceptada

**Contexto.** El sitio mandaba las demás cabeceras de seguridad pero no CSP.

**Decisión.** CSP fija desde `next.config.ts`: todo `'self'`, sin terceros, `frame-ancestors 'none'`, `object-src 'none'`. `script-src` y `style-src` llevan `'unsafe-inline'`.

**Por qué no nonces.** Un nonce se genera por request, y eso obliga a renderizar cada página en el servidor en cada visita: se pierde el prerenderizado estático y el ISR de la home. Next inyecta scripts inline para hidratar, así que sin nonce hace falta `'unsafe-inline'`.

**Consecuencias.**
- La CSP no frena un script inline inyectado; sí frena cargar scripts, imágenes, fuentes o conexiones de otros dominios, y que el sitio se embeba en un iframe.
- Cualquier servicio externo que se sume (analítica, fuentes, embeds) hay que agregarlo a la CSP o el navegador lo bloquea.

## Otros cambios del 2026-11-15

- `/dev-swatch` eliminada (era una página de verificación temporal).
- `not-found.tsx`: página 404 propia con estética de terminal.
- `ProjectsSection`: si la API de GitHub falla en producción se relanza el error para que el ISR siga sirviendo la última página buena, en vez de cachear una grilla vacía.
- Hero con botones "Ver proyectos" y "Contacto".
- Sección Hacker: en mobile las herramientas de cada tarjeta van en fila.
