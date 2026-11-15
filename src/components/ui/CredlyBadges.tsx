'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import type { CredlyBadge } from '@/types/credentials'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const badgeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

interface CredlyBadgesProps {
  badges: CredlyBadge[]
  profileUrl: string
}

// Badges digitales: cada tarjeta enlaza a su verificación pública en Credly.
export function CredlyBadges({ badges, profileUrl }: CredlyBadgesProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 mb-6">
        <p className="font-mono text-xs text-text-muted tracking-widest uppercase">
          {'// Badges verificables · Credly'}
        </p>
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-accent hover:underline"
        >
          Ver perfil en Credly ↗
        </a>
      </div>

      <m.ul
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {badges.map((badge) => (
          <m.li key={badge.id} variants={badgeVariants}>
            <a
              href={badge.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Verificar en Credly: ${badge.name}, ${badge.issuer}`}
              className="group flex h-full flex-col items-center gap-3 rounded-md border border-surface bg-surface/20 px-3 py-5 text-center transition-colors duration-200 hover:border-accent/50 focus-visible:border-accent focus-visible:outline-none"
            >
              <Image
                src={badge.imageSrc}
                alt=""
                width={112}
                height={112}
                className={`h-24 w-24 object-contain transition-transform duration-200 group-hover:scale-105 sm:h-28 sm:w-28 ${badge.expired ? 'opacity-60 grayscale' : ''}`}
              />
              <div className="flex flex-1 flex-col gap-1">
                <p className="font-mono text-xs font-bold text-text leading-snug">
                  {badge.name}
                </p>
                <p className="font-mono text-[11px] text-text-muted">
                  {badge.issuer} · {badge.issued}
                </p>
              </div>
              <span
                className={`font-mono text-[10px] tracking-widest uppercase ${badge.expired ? 'text-yellow-400' : 'text-accent'}`}
              >
                {badge.expired ? `Venció ${badge.expired}` : 'Verificar ↗'}
              </span>
            </a>
          </m.li>
        ))}
      </m.ul>
    </div>
  )
}
