/* eslint-disable react/jsx-no-comment-textnodes */
'use client'

import Image from 'next/image'
import { m } from 'framer-motion'
import { PixelBg } from '@/components/ui/PixelBg'
import { PIXEL_PALETTES } from '@/lib/pixel-palettes'
import type { AboutData } from '@/types/about'

const ABOUT: AboutData = {
  mainText:
    'Desarrollador Full Stack y estudiante de ciberseguridad. Construyo soluciones digitales modernas con Next.js, TypeScript y Python, exploro la seguridad con el mismo rigor con el que escribo código.',
  imageSrc: '/about/juanma.png',
  imageAlt: 'Juan Manuel Silva',
  overlayText: { part1: 'SECURE', part2: 'BUILD' },
  location: 'Las Breñas, Chaco · Argentina',
  ctaHref: '#dev',
  ctaLabel: 'Ver proyectos →',
}

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-bg px-4 py-10 sm:px-8 sm:py-12 md:px-12"
    >
      <PixelBg colors={PIXEL_PALETTES.about} />
      {/* Main 3-col grid */}
      <div className="relative z-10 grid w-full max-w-7xl flex-1 grid-cols-1 items-center md:grid-cols-3">

        {/* Left — description */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="z-20 order-2 text-center md:order-1 md:text-left"
        >
          <p className="font-mono text-xs text-text-muted tracking-widest uppercase mb-4">
            // sobre mí
          </p>
          <p className="mx-auto max-w-xs font-mono text-sm leading-relaxed text-text-muted md:mx-0">
            {ABOUT.mainText}
          </p>
          <a
            href={ABOUT.ctaHref}
            className="mt-6 inline-block font-mono text-sm text-accent hover:text-accent-dim transition-colors"
          >
            {ABOUT.ctaLabel}
          </a>
        </m.div>

        {/* Center — image + circle, both centered by flex */}
        <div className="relative order-1 flex h-full items-center justify-center md:order-2">
          {/* Circle — absolute, centered (flex parent handles it) */}
          <m.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="absolute z-0 h-[200px] w-[200px] rounded-full border border-accent/20 bg-accent/5 sm:h-[300px] sm:w-[300px] md:h-[400px] md:w-[400px] lg:h-[460px] lg:w-[460px]"
            style={{ boxShadow: '0 0 80px rgba(0,255,65,0.07), 0 0 30px rgba(0,255,65,0.04) inset' }}
          />

          {/* Photo — tall portrait, head lands in upper circle area */}
          <m.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="relative z-10"
          >
            <Image
              src={ABOUT.imageSrc}
              alt={ABOUT.imageAlt}
              width={400}
              height={600}
              className="object-contain w-[180px] sm:w-[260px] md:w-[320px] lg:w-[400px] h-auto"
              priority
            />
          </m.div>
        </div>

        {/* Right — phrase */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="z-20 order-3 flex items-center justify-center text-center md:justify-start md:text-left"
        >
          <h2
            className="font-mono font-extrabold leading-none tracking-tight"
            style={{ fontSize: 'clamp(2rem, 10vw, 6.5rem)' }}
          >
            <span className="text-text">{ABOUT.overlayText.part1}</span>
            <br />
            <span className="text-accent">{ABOUT.overlayText.part2}</span>
          </h2>
        </m.div>
      </div>

      {/* Bottom — location */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.3 }}
        className="relative z-10 w-full max-w-7xl flex justify-end"
      >
        <p className="font-mono text-xs text-text-muted tracking-widest">
          {ABOUT.location}
        </p>
      </m.div>
    </section>
  )
}
