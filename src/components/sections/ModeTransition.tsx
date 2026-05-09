/* eslint-disable react/jsx-no-comment-textnodes */
'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ModeTransition() {
  const containerRef = useRef<HTMLDivElement>(null)
  const devRef = useRef<HTMLDivElement>(null)
  const hackerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      gsap.fromTo(
        devRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
      gsap.fromTo(
        hackerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        end: 'bottom 25%',
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    })

    tl.to(labelRef.current, { opacity: 0.3, duration: 0.15 })
      .to(devRef.current, { opacity: 0, y: -30, duration: 0.4 })
      .to(lineRef.current, { scaleX: 1, duration: 0.35 }, '-=0.15')
      .to(hackerRef.current, { opacity: 1, y: 0, duration: 0.4 }, '-=0.15')
      .to(labelRef.current, { opacity: 1, duration: 0.15 })
  }, { scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center bg-bg overflow-hidden"
      style={{ height: '40vh', minHeight: 260 }}
    >
      {/* CRT scanlines */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.025) 2px, rgba(0,255,65,0.025) 4px)',
        }}
      />

      <div className="relative z-10 text-center select-none">
        <p
          ref={labelRef}
          className="font-mono text-xs text-text-muted tracking-[0.3em] uppercase mb-8"
        >
          // switching mode
        </p>

        <div className="relative h-16 overflow-visible">
          <div
            ref={devRef}
            className="absolute inset-0 flex items-center justify-center font-mono text-4xl font-bold text-text tracking-wider sm:text-5xl md:text-6xl"
          >
            DEVELOPER
          </div>
          <div
            ref={hackerRef}
            className="absolute inset-0 flex items-center justify-center font-mono text-3xl font-bold text-accent tracking-wider sm:text-4xl md:text-5xl lg:text-6xl"
            style={{ opacity: 0, transform: 'translateY(30px)' }}
          >
            CYBERSECURITY
          </div>
        </div>

        <div
          ref={lineRef}
          className="mx-auto mt-6 h-px bg-accent origin-left"
          style={{ width: 280, transform: 'scaleX(0)' }}
        />
      </div>
    </div>
  )
}
