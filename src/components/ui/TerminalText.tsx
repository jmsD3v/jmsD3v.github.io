'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface TerminalTextProps {
  text: string
  className?: string
  speed?: number
  delay?: number
}

export function TerminalText({ text, className, speed = 40, delay = 0 }: TerminalTextProps) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const prevText = useRef('')

  useEffect(() => {
    if (prevText.current === text) return
    prevText.current = text
    setDisplayed('')
    setDone(false)

    let i = 0
    const timeout = setTimeout(() => {
      const id = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(id)
          setDone(true)
        }
      }, speed)
      return () => clearInterval(id)
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, speed, delay])

  return (
    <span className={cn('font-mono', className)}>
      {displayed}
      <span className="animate-pulse text-accent">█</span>
    </span>
  )
}
