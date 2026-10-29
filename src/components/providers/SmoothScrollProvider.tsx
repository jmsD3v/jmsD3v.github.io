'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // anchors: sin esto Lenis anula los links a #id (índice del caso de estudio).
    // Lenis respeta el scroll-margin-top de cada sección (scroll-mt-16), que deja
    // lugar a la barra de índice sticky.
    const lenis = new Lenis({ anchors: true })
    lenisRef.current = lenis

    gsap.ticker.lagSmoothing(0)
    gsap.ticker.add((time) => lenis.raf(time * 1000))

    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
