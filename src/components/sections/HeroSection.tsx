'use client';

import { useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#';

class TextScramble {
  el: HTMLElement;
  queue: Array<{
    from: string;
    to: string;
    start: number;
    end: number;
    char?: string;
  }> = [];
  frame = 0;
  frameRequest = 0;
  resolve: () => void = () => {};

  constructor(el: HTMLElement) {
    this.el = el;
    this.update = this.update.bind(this);
  }

  setText(newText: string) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((res) => (this.resolve = res));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const start = Math.floor(Math.random() * 40);
      this.queue.push({
        from: oldText[i] ?? '',
        to: newText[i] ?? '',
        start,
        end: start + Math.floor(Math.random() * 40),
      });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (const item of this.queue) {
      if (this.frame >= item.end) {
        complete++;
        output += item.to;
      } else if (this.frame >= item.start) {
        if (!item.char || Math.random() < 0.28) {
          item.char =
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        output += `<span class="dud">${item.char}</span>`;
      } else {
        output += item.from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

const PHRASES = [
  'JUAN MANUEL SILVA',
  'FULL STACK & PYTHON DEV',
  'AI ENGINEER',
  'CIBERSEGURIDAD',
  'AUTOMATIZACIONES A MEDIDA',
  'SOLUCIONES QUE ESCALAN',
  'DE LAS BREÑAS AL MUNDO',
];

function ScrambledTitle() {
  const elRef = useRef<HTMLHeadingElement>(null);
  const scramblerRef = useRef<TextScramble | null>(null);

  useEffect(() => {
    if (!elRef.current) return;
    const scrambler = new TextScramble(elRef.current);
    scramblerRef.current = scrambler;

    let counter = 0;
    let cancelled = false;

    const next = () => {
      if (cancelled || !scramblerRef.current) return;
      scramblerRef.current.setText(PHRASES[counter]).then(() => {
        if (!cancelled) setTimeout(next, 2000);
      });
      counter = (counter + 1) % PHRASES.length;
    };

    next();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <h1
      ref={elRef}
      className='text-white text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-wide sm:tracking-wider md:tracking-widest font-mono text-center w-full px-4'
    >
      JUAN MANUEL SILVA
    </h1>
  );
}

/* ── Canvas rain ─────────────────────────────────────────────── */

interface RainChar {
  char: string;
  x: number;   // 0–100 percent
  y: number;   // 0–100 percent
  speed: number;
  active: boolean;
}

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 80 : 300;

    // Init chars
    const chars: RainChar[] = Array.from({ length: count }, () => ({
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: 0.06 + Math.random() * 0.18,
      active: false,
    }));

    // Resize canvas to match CSS size
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Active indices toggled every 50ms
    let activeSet = new Set<number>();
    const activeInterval = setInterval(() => {
      const next = new Set<number>();
      const c = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < c; i++) next.add(Math.floor(Math.random() * count));
      activeSet = next;
    }, 50);

    let rafId = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];

        // Move
        c.y += c.speed;
        if (c.y > 105) {
          c.y = -5;
          c.x = Math.random() * 100;
          c.char = CHARS[Math.floor(Math.random() * CHARS.length)];
        }

        const px = (c.x / 100) * w;
        const py = (c.y / 100) * h;
        const isActive = activeSet.has(i);

        if (isActive) {
          ctx.font = 'bold 22px monospace';
          ctx.fillStyle = '#00ff41';
          ctx.shadowColor = 'rgba(0,255,65,0.85)';
          ctx.shadowBlur = 10;
        } else {
          ctx.font = '400 22px monospace';
          ctx.fillStyle = 'rgba(100,116,139,0.28)';
          ctx.shadowBlur = 0;
        }
        ctx.fillText(c.char, px, py);
      }
      ctx.shadowBlur = 0;

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(activeInterval);
      ro.disconnect();
    };
  }, []);

  return (
    <section
      id="hero"
      className='relative w-full h-screen bg-bg overflow-hidden flex items-center justify-center'
    >
      {/* Canvas rain — GPU layer, zero DOM layout impact */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 w-full h-full"
        style={{ willChange: 'transform' }}
      />

      <div className='relative z-20 flex flex-col items-center gap-4 w-full max-w-4xl px-4'>
        <ScrambledTitle />
        <p className='text-text-muted text-xs sm:text-sm md:text-base tracking-wide md:tracking-widest font-mono text-center'>
          Full Stack & Python Dev · AI Engineer · Ciberseguridad
        </p>
        <div className='flex gap-2 items-center text-accent mt-2'>
          <span className='w-2 h-2 rounded-full bg-accent animate-pulse' />
          <span className='text-xs tracking-widest'>DISPONIBLE</span>
        </div>
      </div>
    </section>
  );
}
