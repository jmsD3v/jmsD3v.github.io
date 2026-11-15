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
    // Con "reducir movimiento" activado no se monta Lenis: queda el scroll nativo.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ anchors: true })
    lenisRef.current = lenis

    // La misma referencia para add y remove: con una función nueva en el remove
    // el ticker nunca se quitaba y seguía llamando a un Lenis ya destruido.
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.lagSmoothing(0)
    gsap.ticker.add(raf)

    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}
