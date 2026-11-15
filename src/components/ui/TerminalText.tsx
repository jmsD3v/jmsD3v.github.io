'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TerminalTextProps {
  text: string
  className?: string
  speed?: number
  delay?: number
}

// Escribe el texto letra por letra cuando entra en pantalla (antes arrancaba al
// cargar la página, y al llegar a la sección ya había terminado).
export function TerminalText({ text, className, speed = 40, delay = 0 }: TerminalTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reducedMotion = useReducedMotion()
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (!inView || reducedMotion) return

    let i = 0
    let interval: ReturnType<typeof setInterval> | undefined
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) clearInterval(interval)
      }, speed)
    }, delay)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [inView, reducedMotion, text, speed, delay])

  return (
    <span ref={ref} className={cn('font-mono', className)}>
      {/* Con "reducir movimiento" aparece el texto completo, sin tipeo. */}
      {reducedMotion && inView ? text : displayed}
      <span className="animate-pulse text-accent">█</span>
    </span>
  )
}
