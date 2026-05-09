'use client'

import { useEffect, useRef, useState } from 'react'

interface NavSection {
  id: string
  label: string
}

const SECTIONS: NavSection[] = [
  { id: 'hero',     label: 'Inicio' },
  { id: 'about',    label: 'Sobre mí' },
  { id: 'dev',      label: 'Dev' },
  { id: 'projects', label: 'Proyectos' },
  { id: 'hacker',   label: 'Cybersecurity' },
  { id: 'contact',  label: 'Contacto' },
]

export function SectionDotNav() {
  const [active, setActive] = useState('hero')
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
      )

      observer.observe(el)
      observers.push(observer)
    })

    // Show nav only after user starts scrolling
    const handleScroll = () => {
      setVisible(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observers.forEach((o) => o.disconnect())
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      aria-label="Secciones"
      className={`hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-3 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          aria-label={label}
          title={label}
          className="group relative flex items-center justify-end"
        >
          {/* Tooltip */}
          <span className="absolute right-6 font-mono text-xs text-text bg-surface border border-surface px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
            {label}
          </span>

          {/* Dot */}
          <span
            className={`block rounded-full transition-all duration-300 ${
              active === id
                ? 'w-2.5 h-2.5 bg-accent'
                : 'w-1.5 h-1.5 bg-text-muted hover:bg-text'
            }`}
          />
        </button>
      ))}
    </nav>
  )
}
