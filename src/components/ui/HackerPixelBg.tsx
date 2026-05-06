'use client'

import { useEffect, useRef } from 'react'

/* ── Pixel class (unchanged logic from original) ─────────────── */

const rand = (min: number, max: number) => Math.random() * (max - min) + min

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
    this.size = 0
    this.sizeStep = rand(0, 0.5)
    this.minSize = 0.5
    this.maxSizeAvailable = boundSize || 2
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

/* ── Hacker palette: red / cyan / purple (matches SEC colors) ── */
const HACKER_COLORS = [
  'hsl(0   100% 60%)',   // #ff4444-ish — offensive red
  'hsl(10  100% 55%)',
  'hsl(188 100% 55%)',   // #22d3ee-ish — defensive cyan
  'hsl(195 100% 60%)',
  'hsl(280 80%  70%)',   // #c084fc-ish — forensics purple
]

/* ── Component ───────────────────────────────────────────────── */

export function HackerPixelBg() {
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
  }>({
    pixels: [], request: null, lastTime: 0,
    ticker: 0, maxTicker: 480,
    animationDirection: 1, width: 0, height: 0,
  })

  useEffect(() => {
    const canvas  = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    const getDelay = (x: number, y: number) => {
      const { width, height } = animRef.current
      const dx = x - width * 0.5
      const dy = y - height
      return Math.sqrt(dx ** 2 + dy ** 2)
    }

    const initPixels = () => {
      const { width, height } = animRef.current
      const gap     = 8                            // slightly sparser than default 6
      const step    = (width + height) * 0.005
      const speed   = rand(0.008, 0.2)
      const maxSize = Math.floor(gap * 0.5)

      animRef.current.pixels = []

      for (let x = 0; x < width; x += gap) {
        for (let y = 0; y < height; y += gap) {
          if (x + maxSize > width || y + maxSize > height) continue
          const color     = HACKER_COLORS[Math.floor(Math.random() * HACKER_COLORS.length)]
          const delay     = getDelay(x, y)
          const delayHide = getDelay(x, y)
          animRef.current.pixels.push(
            new Pixel(x, y, color, speed, delay, delayHide, step, maxSize),
          )
        }
      }
    }

    const animate = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const interval  = 1000 / 60
      const animation = animRef.current

      animation.request = requestAnimationFrame(animate)

      const now  = performance.now()
      const diff = now - (animation.lastTime || 0)
      if (diff < interval) return
      animation.lastTime = now - (diff % interval)

      ctx.clearRect(0, 0, animation.width, animation.height)

      if (animation.ticker >= animation.maxTicker)      animation.animationDirection = -1
      else if (animation.ticker <= 0)                   animation.animationDirection = 1

      let allHidden = true
      ctx.globalAlpha = 0.22          // subtle — content stays readable

      animation.pixels.forEach((pixel) => {
        if (animation.animationDirection > 0) {
          pixel.show()
        } else {
          pixel.hide()
          allHidden = allHidden && pixel.isHidden
        }
        pixel.draw(ctx)
      })

      ctx.globalAlpha = 1

      animation.ticker += animation.animationDirection
      if (animation.animationDirection < 0 && allHidden) animation.ticker = 0
    }

    const resize = () => {
      if (animRef.current.request) cancelAnimationFrame(animRef.current.request)
      const rect = wrapper.getBoundingClientRect()
      animRef.current.width  = Math.floor(rect.width)
      animRef.current.height = Math.floor(rect.height)
      canvas.width  = animRef.current.width
      canvas.height = animRef.current.height
      initPixels()
      animRef.current.ticker = 0
      animate()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(wrapper)

    const anim = animRef.current
    return () => {
      const req = anim.request
      if (req) cancelAnimationFrame(req)
      ro.disconnect()
    }
  }, [])

  return (
    <div ref={wrapperRef} className="absolute inset-0 overflow-hidden" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
