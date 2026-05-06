'use client'

import { useState, useCallback } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { CarouselItem } from '@/types/carousel'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

interface HorizontalCertCarouselProps {
  items: CarouselItem[]
  accentColor?: string   // hex, e.g. '#22d3ee'
  visibleCount?: number  // default 3
}

export function HorizontalCertCarousel({
  items,
  accentColor = 'var(--color-accent)',
  visibleCount = 3,
}: HorizontalCertCarouselProps) {
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)

  const totalPages = Math.ceil(items.length / visibleCount)

  const go = useCallback((next: number) => {
    setDir(next > page ? 1 : -1)
    setPage(next)
  }, [page])

  const prev = () => go(Math.max(0, page - 1))
  const next = () => go(Math.min(totalPages - 1, page + 1))

  const visible = items.slice(page * visibleCount, page * visibleCount + visibleCount)

  return (
    <div className="relative">
      <AnimatePresence mode="wait" custom={dir}>
        <m.div
          key={page}
          custom={dir}
          initial="hidden"
          animate="visible"
          exit={{ x: dir * -40, opacity: 0 }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {visible.map((item) => (
            <CertCard key={item.id} item={item} accentColor={accentColor} />
          ))}
        </m.div>
      </AnimatePresence>

      {/* Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          {/* Dots */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Página ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === page ? 24 : 6,
                  height: 6,
                  backgroundColor: i === page ? accentColor : 'var(--color-surface)',
                }}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={page === 0}
              aria-label="Anterior"
              className="w-8 h-8 rounded border border-surface flex items-center justify-center font-mono text-xs text-text-muted transition-colors hover:border-current disabled:opacity-30"
              style={{ ['--hover-color' as string]: accentColor }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = accentColor)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
            >
              ‹
            </button>
            <button
              onClick={next}
              disabled={page === totalPages - 1}
              aria-label="Siguiente"
              className="w-8 h-8 rounded border border-surface flex items-center justify-center font-mono text-xs text-text-muted transition-colors hover:border-current disabled:opacity-30"
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = accentColor)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Single card ─────────────────────────────────────────────── */

function CertCard({ item, accentColor }: { item: CarouselItem; accentColor: string }) {
  const done = item.status === 'Completado'

  return (
    <m.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' as const } }}
      className="border border-surface rounded-md overflow-hidden bg-surface/10 flex flex-col transition-colors duration-200 group cursor-default"
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = accentColor + '55')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
    >
      {/* Thumbnail / placeholder */}
      <div className="relative w-full aspect-[3/2] bg-surface/20 overflow-hidden">
        {item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.title}
            fill
            className="object-contain p-2"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-40">
            <span className="font-mono text-2xl" style={{ color: accentColor }}>⬡</span>
            <span className="font-mono text-[10px] text-text-muted tracking-widest uppercase">certificado</span>
          </div>
        )}

        {/* Status badge */}
        <span
          className="absolute top-2 right-2 font-mono text-[10px] px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: done ? accentColor + '22' : '#f59e0b22',
            color: done ? accentColor : '#f59e0b',
            border: `1px solid ${done ? accentColor + '44' : '#f59e0b44'}`,
          }}
        >
          {done ? '✓ Completado' : '… En curso'}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <p className="font-mono text-xs font-bold text-text leading-snug line-clamp-2">
          {item.title}
        </p>
        <p className="font-mono text-[11px]" style={{ color: accentColor }}>
          {item.issuer}
        </p>
        {item.period && (
          <p className="font-mono text-[10px] text-text-muted">{item.period}</p>
        )}
        {item.description && (
          <p className="font-mono text-[11px] text-text-muted mt-1.5 leading-relaxed line-clamp-3">
            {item.description}
          </p>
        )}
      </div>
    </m.div>
  )
}
