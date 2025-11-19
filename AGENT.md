<!--
🧠 INSTRUCCIÓN PARA COPILOT:
Antes de sugerir cambios o responder preguntas sobre este repo, leé este archivo completo.
Usá las secciones de “Acciones inmediatas” y “Problemas detectados” como guía.
No repitas sugerencias ya listadas. Si se aplica una mejora, actualizá la sección “Cambios aplicados” con fecha y commit.
-->

# AGENT: Bitácora técnica y análisis del repositorio

Fecha: 19 de noviembre de 2025

Este archivo recoge el análisis técnico realizado por el agente (revisor técnico) sobre el repositorio `jmsD3v.github.io`. Se usará como bitácora para futuras intervenciones: antes de cualquier cambio se debe revisar este documento para ver qué ya se hizo, qué falta y las recomendaciones previas.

## Resumen ejecutivo

- Estado general: proyecto Next.js con App Router, Tailwind CSS, uso de TypeScript (`strict: true`), estructura `src/` bien organizada y utilidades básicas. Inicialmente se consideró integración con Supabase Auth y PostgreSQL para funciones dinámicas, pero la decisión actual es mantener el portfolio estático y no integrar Supabase por ahora.
- Puntos fuertes: organización `src/`, tipado básico, uso de `next/font`, utilidad `cn` (clsx + tailwind-merge), existencia de `types/` y uso de imports absolutos (`@/*`).
- Riesgos principales: imágenes sin optimizar, inconsistencias entre Server/Client Components, potencial exposición de secretos si no hay cliente supabase centralizado, falta de tests y CI, accesibilidad incompleta en componentes como modales.

## Qué está bien implementado

- **Estructura de proyecto:** `src/components`, `src/data`, `src/lib`, `src/types` — separación clara de concerns.
- **TypeScript:** `tsconfig.json` usa `strict: true`. Buen punto de partida.
- **Utilities:** `src/lib/utils.ts` contiene `cn` (clsx + tailwind-merge) — práctica común con Tailwind.
- **Tipado de dominio:** `src/types/projectType.ts` define `ProjectType` de forma razonable.
- **Fonts y performance:** uso de `next/font` para Google Fonts (mejor que cargar externamente).
- **Componentización:** componentes por responsabilidad (`AboutMe`, `Projects`, `Header`, etc.).

## Problemas detectados y áreas de mejora (priorizadas)

1. Imágenes y performance
   - Uso extensivo de `<img src="...">`. Recomendación: migrar a `next/image` para lazy loading, optimización de tamaños y mejor LCP/CLS.
2. Accesibilidad (A11y)
   - Botones sin `type`, enlaces externos sin `rel="noopener noreferrer"`, modales sin manejo robusto de focus trap y teclas de escape. Usar RadixUI o técnicas accesibles.
3. Seguridad y gestión de secretos
  - Si se integra un backend (p.ej. Supabase) en el futuro, centralizar el cliente y separar client/server. Nunca exponer service role keys en cliente. Actualmente el proyecto es estático y no necesita backend.
4. Server/Client Components
   - Uso indiscriminado de `'use client'` (por ejemplo en `page.tsx`). Mover la menor cantidad posible a cliente para reducir bundle.
5. DRY y duplicación
   - Repetición en filtros del componente `Projects` y estilos repetidos en `page.tsx`. Extraer arrays y componentes reutilizables.
6. TypeScript: tipado y nombres
   - Falta de tipado explícito en props de muchos componentes. Variable `Project` (data) puede confundirse con `ProjectType` (type). Renombrar `Project` a `projectsData`.
7. Tests y CI
   - No hay tests ni workflows CI. Añadir GitHub Actions, husky + lint-staged, y tests unitarios (Vitest) y E2E (Playwright) cuando aplique.

## Recomendaciones de refactor (concretas)

- Projects: extraer filtros a un array y mapearlos en lugar de repetir `li`.
- (Opcional) Centralizar cliente Supabase en `src/lib/supabaseClient.ts` con dos exports: `createBrowserClient()` (usa `NEXT_PUBLIC_...`) y `createServerClient()` o funciones server-only que usen secretos. Implementar solo si se decide añadir persistencia o panel admin.
- Migrar imágenes clave a `next/image` y añadir `width`/`height` o usar `fill` con contenedor para evitar CLS.
- Reescribir modales para usar `@radix-ui/react-dialog` (ya en dependencias) y garantizar foco, `aria-*` y escape.
- Evitar mutaciones inadvertidas como `.reverse()` sobre arrays originales: usar `slice().reverse()`.
- Tipar explícitamente props de componentes: crear interfaces `Props` y evitar `any`.

## Ideas de automatización y CI

- GitHub Actions: job `build` que corra `pnpm install`, `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm type-check`.
- Pre-commit: `husky` + `lint-staged` para `prettier --write` y `eslint --fix`.
- Dependabot: activar actualizaciones automáticas de dependencias.
- Secret scanning / SAST: configurar `gitleaks` o GitHub secret scanning en CI.

## Checklist de seguridad (Security by Design)

- [ ] No exponer claves en el cliente; usar env vars server-only para service roles.
- [ ] Validación server-side de todas las entradas (sanitización antes de persistir / generar PDF).
- [ ] Headers de seguridad y CSP en `next.config` o middleware.
- [ ] Principio de mínimo privilegio en la base de datos / roles de Supabase.
- [ ] Escaneo de dependencias y monitorización.

## TypeScript y calidad de código

- Mantener `strict: true` (ya activo).
- Considerar activar `noUncheckedIndexedAccess` y `forceConsistentCasingInFileNames` si no rompen la base.
- Si no hay JS legacy, desactivar `allowJs`.
- Añadir `scripts` a `package.json`: `type-check`, `format`, `test`.

## Acciones inmediatas recomendadas (ordenadas por prioridad)

1. Migrar imágenes principales a `next/image` y añadir `rel="noopener noreferrer"` a enlaces externos.
2. (OPCIONAL) Integración de backend: evaluar Supabase solo si se necesita persistencia, área admin o storage privado; si se mantiene estático, omitir.
3. Reescribir modales para usar RadixUI o reforzar accesibilidad.
4. Añadir ESLint + Prettier, `lint-staged` + `husky` y configurar `format` script.
5. Añadir GitHub Actions básico con `type-check` y `lint`.
6. Refactor de `Projects` para DRY (map filtros) y renombrar `Project` -> `projectsData`.
7. Implementar tests unitarios mínimos para utilidades y componentes críticos.

## Fragmentos de código útiles

- Filtro DRY (ejemplo):

```tsx
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'web', label: 'Web Applications' },
  { key: 'mobile', label: 'Mobile Applications' },
  { key: 'api', label: 'APIs / Backends' },
];

{FILTERS.map((f) => (
  <li
    key={f.key}
    onClick={() => setFilter(f.key)}
    className={`cursor-pointer ${filter === f.key ? 'text-purple-600' : ''}`}
  >
    {f.label}
  </li>
))}
```

- `supabaseClient` (esquema):

```ts
// src/lib/supabaseClient.ts (esquema)
import { createClient } from '@supabase/supabase-js';

export const createBrowserSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// Server-only client (usar SOLO en server code / API routes)
export const createServerSupabase = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
```

## Observaciones específicas del repo (basadas en archivos revisados)

- `package.json`: scripts mínimos — añadir `format`, `type-check`, `test`. Dependencias relevantes: `@radix-ui/react-dialog` (para modales accesibles), `tailwindcss` v4, `next` v15.
- `src/app/layout.tsx`: buen uso de `next/font` y metadata.
- `src/app/page.tsx`: usa `AOS` en `useEffect`; componente cliente grande. Considerar extraer AOS a wrapper cliente.
- `src/components/header.tsx`: usa `window.location.reload()` y `<img src='logo.png'/>`. Preferir `router.refresh()` o navegación controlada y `next/image`.
- `src/components/projects/projects.tsx`: usa `.reverse()` sobre resultado directo; mejor `slice().reverse()`.

## Cómo usar este archivo (workflow del agente)

1. Antes de hacer cambios en el repo, abrir `AGENT.md` y revisar la sección **Acciones inmediatas recomendadas** y **Qué está bien implementado**.
2. Al completar una recomendación, actualizar esta bitácora (añadir subsección `Cambios aplicados` con fecha y PR/commit) o avisar al agente para que actualice el archivo.
3. Mantener `AGENT.md` como la fuente de verdad para refactors, PRs y prioridades.

---

## 🛠️ Cambios aplicados

- 19/11/2025: Creación del `AGENT.md` con análisis inicial y recomendaciones. Commit: `initial-agent-md`
- 19/11/2025: Decisión: mantener el portfolio estático (NO integrar Supabase por ahora). Motivo: simplicidad operativa y menor superficie de mantenimiento/seguridad. Referencias a Supabase quedan marcadas como opcionales en el documento.
- 19/11/2025: Migración parcial a `next/image`, añadido `rel="noopener noreferrer"` y `type="button"` en enlaces/botones relevantes, y refactor de filtros en `Projects` (evitar `.reverse()` mutante). Commits: cambios aplicados localmente.
- 🔍 TAGS invisibles
<!-- TAG:SECURITY -->
<!-- TAG:PERFORMANCE -->
<!-- TAG:CI -->
<!-- TAG:ACCESSIBILITY -->
<!-- TAG:MODULARITY -->

## 📚 Referencias técnicas y principios aplicados

- **DRY (Don't Repeat Yourself):** lógica reutilizable en `lib/`, filtros mapeados, tipos centralizados en `types/`.
- **Security by Design:** separación de cliente Supabase, uso de env vars, validación server-side, checklist de seguridad.
- **KISS (Keep It Simple, Stupid):** componentes con props explícitas, sin lógica innecesaria ni dependencias superfluas.
- **YAGNI (You Aren’t Gonna Need It):** sin features anticipadas, solo lo necesario para el MVP funcional.
- **Modularidad:** estructura por responsabilidad (`components/`, `lib/`, `types/`), separación clara de concerns.

## 🧩 Auditoría modular por carpeta

- `src/components`: revisar duplicación de estilos, props sin tipar, y consistencia de nombres.
- `src/lib`: validar reutilización, separación de lógica, y evitar side effects.
- `src/types`: mantener consistencia de nombres, evitar ambigüedad con datos (`ProjectType` vs `projectsData`).
- `src/app`: revisar uso de `'use client'`, separar efectos visuales (ej. AOS), y optimizar layout.
- `public/`: revisar imágenes sin optimizar y uso de `<img>` en lugar de `next/image`.

---

Si querés, puedo ahora crear PRs automáticos para las tres mejoras pequeñas sugeridas: (1) migrar imágenes principales a `next/image`, (2) añadir `rel` a enlaces externos y `type="button"` a botones, y (3) refactor de filtros en `Projects`. Indicame si querés que empiece y cuál prefieres primero.

## 📬 Contact Form Strategy

- Se implementó un formulario con validación HTML5 y honeypot anti-spam (`company`).
- El endpoint `/api/contact` valida server-side, sanitiza el campo `message` y envía vía Resend.
- Se evita `mailto:` y servicios externos por razones de seguridad y trazabilidad.
- Se contempla fallback y logging opcional para trazabilidad (console + intento de inserción en Supabase si las credenciales están disponibles).
- Pendiente: integración con Supabase para persistencia de logs si se requiere.

### /api/contact/health

- Se añadió un endpoint de salud `GET /api/contact/health` que verifica la presencia de las variables de entorno `RESEND_API_KEY`, `RESEND_FROM` y `RESEND_TO`.
- El endpoint devuelve booleans indicando si cada variable está configurada y no expone valores secretos.

Ejemplo de respuesta:

```json
{
  "ok": true,
  "env": { "RESEND_API_KEY": true, "RESEND_FROM": true, "RESEND_TO": true },
  "timestamp": "2025-11-19T..."
}
```
