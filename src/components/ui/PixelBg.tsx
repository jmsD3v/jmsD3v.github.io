'use client'

import { useEffect, useRef } from 'react'

/* ── Pixel class ─────────────────────────────────────────────── */

const rand = (min: number, max: number) => Math.random() * (max - min) + min

const MAX_PIXELS = 25000  // allows gap=12 even on tall sections

class Pixel {
  x: number; y: number; color: string; speed: number
  size: number; sizeStep: number; minSize: number
  maxSizeAvailable: number; maxSize: number; sizeDirection: number
  delay: number; delayHide: number; counter: number; counterHide: number
  counterStep: number; isHidden: boolean; isFlicking: boolean

  constructor(
    x: number, y: number, color: string,
    speed: number, delay: number, delayHide: number,
    step: number, boundSize: number,
  ) {
    this.x = x; this.y = y; this.color = color
    this.speed = rand(0.1, 0.9) * speed
    this.size = 0; this.sizeStep = rand(0, 0.5)
    this.minSize = 0.5; this.maxSizeAvailable = boundSize || 2
    this.maxSize = rand(this.minSize, this.maxSizeAvailable)
    this.sizeDirection = 1
    this.delay = delay; this.delayHide = delayHide
    this.counter = 0; this.counterHide = 0; this.counterStep = step
    this.isHidden = false; this.isFlicking = false
  }

  draw(ctx: CanvasRenderingContext2D) {
    const centerOffset = this.maxSizeAvailable * 0.5 - this.size * 0.5
    ctx.fillStyle = this.color
    ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size)
  }

  show() {
    this.isHidden = false; this.counterHide = 0
    if (this.counter <= this.delay) { this.counter += this.counterStep; return }
    if (this.size >= this.maxSize) this.isFlicking = true
    if (this.isFlicking) { this.flicking() } else { this.size += this.sizeStep }
  }

  hide() {
    this.counter = 0
    if (this.counterHide <= this.delayHide) {
      this.counterHide += this.counterStep
      if (this.isFlicking) this.flicking()
      return
    }
    this.isFlicking = false
    if (this.size <= 0) { this.size = 0; this.isHidden = true; return }
    this.size -= 0.05
  }

  flicking() {
    if (this.size >= this.maxSize) this.sizeDirection = -1
    else if (this.size <= this.minSize) this.sizeDirection = 1
    this.size += this.sizeDirection * this.speed
  }
}

/* ── Component ───────────────────────────────────────────────── */
// Palettes live in src/lib/pixel-palettes.ts (no 'use client' boundary)

interface PixelBgProps {
  colors: readonly string[]
  opacity?: number   // default 0.20 — reduced for readability over content
  gap?: number       // default 12 — 4× fewer pixels than 6
  duration?: number  // default 480 ticks
}

export function PixelBg({ colors, opacity = 0.20, gap = 12, duration = 480 }: PixelBgProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const animRef = useRef<{
    pixels: Pixel[]
    request: number | null
    lastTime: number
    ticker: number
    maxTicker: number
    animationDirection: number
    width: number
    height: number
    visible: boolean
  }>({
    pixels: [], request: null, lastTime: 0,
    ticker: 0, maxTicker: duration,
    animationDirection: 1, width: 0, height: 0,
    visible: false,
  })

  useEffect(() => {
    const canvas  = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    const getDelay = (x: number, y: number) => {
      const { width, height } = animRef.current
      return Math.sqrt((x - width * 0.5) ** 2 + (y - height * 0.5) ** 2)
    }

    const initPixels = () => {
      if (!colors || colors.length === 0) return
      const { width, height } = animRef.current
      if (width === 0 || height === 0) return

      // Adapt gap so total cells ≤ MAX_PIXELS — distributes evenly, no side left empty
      const rawCells  = Math.floor(width / gap) * Math.floor(height / gap)
      const actualGap = rawCells > MAX_PIXELS
        ? Math.ceil(Math.sqrt((width * height) / MAX_PIXELS))
        : gap

      const step    = (width + height) * 0.005
      const speed   = rand(0.008, 0.2)
      const maxSize = Math.floor(actualGap * 0.5)

      animRef.current.pixels = []

      for (let x = 0; x < width; x += actualGap) {
        for (let y = 0; y < height; y += actualGap) {
          if (x + maxSize > width || y + maxSize > height) continue
          const color = colors[Math.floor(Math.random() * colors.length)]
          const delay = getDelay(x, y)
          animRef.current.pixels.push(
            new Pixel(x, y, color, speed, delay, delay, step, maxSize),
          )
        }
      }
    }

    const animate = () => {
      // ── Only run when section is visible ──────────────────────
      if (!animRef.current.visible) {
        animRef.current.request = null
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const interval  = 1000 / 30  // 30fps — half the CPU of 60fps
      const animation = animRef.current

      animation.request = requestAnimationFrame(animate)

      const now  = performance.now()
      const diff = now - (animation.lastTime || 0)
      if (diff < interval) return
      animation.lastTime = now - (diff % interval)

      ctx.clearRect(0, 0, animation.width, animation.height)

      if (animation.ticker >= animation.maxTicker)    animation.animationDirection = -1
      else if (animation.ticker <= 0)                 animation.animationDirection = 1

      let allHidden = true
      ctx.globalAlpha = opacity

      for (const pixel of animation.pixels) {
        if (animation.animationDirection > 0) {
          pixel.show()
        } else {
          pixel.hide()
          allHidden = allHidden && pixel.isHidden
        }
        pixel.draw(ctx)
      }

      ctx.globalAlpha = 1
      animation.ticker += animation.animationDirection
      if (animation.animationDirection < 0 && allHidden) animation.ticker = 0
    }

    const resize = () => {
      const req = animRef.current.request
      if (req) cancelAnimationFrame(req)
      animRef.current.request = null

      // offsetWidth/Height reflect document layout dims — reliable even off-screen
      const w = wrapper.offsetWidth
      const h = wrapper.offsetHeight
      if (w === 0 || h === 0) return   // layout not ready yet, RO will retry

      animRef.current.width  = w
      animRef.current.height = h
      canvas.width  = w
      canvas.height = h
      initPixels()
      animRef.current.ticker = 0
      if (animRef.current.visible) animate()
    }

    // ── Pause rAF when section leaves viewport ─────────────────
    const io = new IntersectionObserver(
      ([entry]) => {
        animRef.current.visible = entry.isIntersecting
        if (entry.isIntersecting) {
          // Re-init if dims are wrong (e.g. section not yet laid out at mount)
          if (animRef.current.pixels.length === 0 ||
              animRef.current.width !== wrapper.offsetWidth ||
              animRef.current.height !== wrapper.offsetHeight) {
            resize()
          } else if (!animRef.current.request) {
            animate()
          }
        }
      },
      { threshold: 0 },
    )
    io.observe(wrapper)

    const ro = new ResizeObserver(resize)
    ro.observe(wrapper)

    // Fallback: measure once after first paint in case RO fires before layout settles
    const raf = requestAnimationFrame(resize)

    const anim = animRef.current
    return () => {
      const req = anim.request
      if (req) cancelAnimationFrame(req)
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [colors, opacity, gap, duration])

  return (
    <div ref={wrapperRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Readability overlay — dims pixels so text above stays legible */}
      <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.55)' }} />
    </div>
  )
}
