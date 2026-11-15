'use client'

import { m } from 'framer-motion'
import type { FeaturedDiploma } from '@/types/credentials'

interface DiplomaHighlightProps {
  diploma: FeaturedDiploma
}

// Bloque destacado de una formación: resumen, temario y link de verificación.
// La imagen del certificado ya se ve en el carrusel de al lado; acá no se repite.
export function DiplomaHighlight({ diploma }: DiplomaHighlightProps) {
  return (
    <m.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-md border border-accent/30 bg-surface/20 p-5 md:p-7"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase text-accent">
              Industria 4.0
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-accent">
              ✓ Completado
            </span>
          </div>
          <h3 className="mt-3 font-mono text-xl font-bold text-text md:text-2xl">
            {diploma.title}
          </h3>
          <p className="mt-1 font-mono text-xs text-text-muted">
            {diploma.issuer} · {diploma.issued}
          </p>
          <p className="mt-4 font-mono text-sm leading-relaxed text-text-muted">
            {diploma.summary}
          </p>

          <a
            href={diploma.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${diploma.credentialLabel}: ${diploma.title}`}
            className="mt-5 inline-block rounded border border-accent/40 px-3 py-2 font-mono text-xs text-accent transition-colors duration-200 hover:bg-accent/10"
          >
            {diploma.credentialLabel} ↗
          </a>
        </div>

        <div>
          <p className="mb-4 font-mono text-xs tracking-widest uppercase text-text-muted">
            {`// Temario · ${diploma.modules.length} módulos`}
          </p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {diploma.modules.map((mod, i) => (
              <li
                key={mod.name}
                className="flex items-baseline gap-3 rounded border border-surface bg-bg/40 px-3 py-2.5"
              >
                <span className="font-mono text-[10px] text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-xs font-bold leading-snug text-text">
                    {mod.name}
                  </span>
                  {mod.detail && (
                    <span className="mt-0.5 block font-mono text-[11px] text-text-muted">
                      {mod.detail}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </m.article>
  )
}
