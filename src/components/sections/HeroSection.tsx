'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { Button } from '@/components/ui/button';

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
      } else if (this.frame >= item.start && item.to.trim() === '') {
        // Los espacios (y las posiciones que sobran) no se mezclan: así el texto
        // corta en los mismos lugares que la frase final y no suma un renglón.
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
  'ANALISTA EN CIBERSEGURIDAD',
  'FULL STACK & PYTHON SECURITY DEV',
  'AI ENGINEER',
  'INDUSTRIA 4.0',
  'AUTOMATIZACIONES A MEDIDA',
  'SOLUCIONES QUE ESCALAN',
  'DE LAS BREÑAS AL MUNDO',
];

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

// activeRef: true mientras el hero está en pantalla y la pestaña visible.
function ScrambledTitle({ activeRef }: { activeRef: RefObject<boolean> }) {
  const elRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = elRef.current;
    // Con "reducir movimiento" el título queda fijo en el nombre.
    if (!el || window.matchMedia(REDUCED_MOTION).matches) return;

    const scrambler = new TextScramble(el);
    let counter = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const next = () => {
      if (cancelled) return;
      // Fuera de pantalla no se anima: se vuelve a mirar en un rato.
      if (!activeRef.current) {
        timer = setTimeout(next, 600);
        return;
      }
      scrambler.setText(PHRASES[counter]).then(() => {
        if (!cancelled) timer = setTimeout(next, 2000);
      });
      counter = (counter + 1) % PHRASES.length;
    };

    next();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      cancelAnimationFrame(scrambler.frameRequest);
    };
  }, [activeRef]);

  // aria-label: los lectores de pantalla leen siempre el nombre, no los caracteres
  // intermedios. Alto fijo (3 renglones en mobile, 2 desde sm): las frases largas
  // ocupan más de un renglón y sin esto el subtítulo y los botones saltaban en
  // cada cambio.
  return (
    <h1
      ref={elRef}
      aria-label='Juan Manuel Silva'
      className='flex h-[3lh] w-full items-center justify-center px-4 text-center font-mono text-2xl font-bold tracking-wide text-white sm:h-[2lh] sm:text-4xl sm:tracking-wider md:text-5xl md:tracking-widest lg:text-6xl xl:text-7xl'
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
  const sectionRef = useRef<HTMLElement>(null);
  const activeRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
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
    const pickActive = () => {
      const next = new Set<number>();
      const c = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < c; i++) next.add(Math.floor(Math.random() * count));
      activeSet = next;
    };

    let rafId = 0;
    let activeInterval: ReturnType<typeof setInterval> | undefined;
    let running = false;

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

      if (running) rafId = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      activeInterval = setInterval(pickActive, 50);
      rafId = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
      clearInterval(activeInterval);
    };

    // La lluvia corre solo con el hero en pantalla y la pestaña visible: antes
    // seguía dibujando 60 veces por segundo aunque estuvieras en el contacto.
    // Con "reducir movimiento" se dibuja un solo cuadro, quieto.
    const reducedMotion = window.matchMedia(REDUCED_MOTION).matches;
    let onScreen = true;
    const sync = () => {
      const active = onScreen && !document.hidden;
      activeRef.current = active;
      if (reducedMotion) return;
      if (active) start();
      else stop();
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(section);
    document.addEventListener('visibilitychange', sync);

    if (reducedMotion) draw();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      ro.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
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

      <div className='relative z-20 flex flex-col items-center gap-4 w-full max-w-4xl xl:max-w-6xl px-4'>
        <ScrambledTitle activeRef={activeRef} />
        <p className='text-text-muted text-xs sm:text-sm md:text-base tracking-wide md:tracking-widest font-mono text-center'>
          Analista en Ciberseguridad · Full Stack & Python Security Dev · AI Engineer · Industria 4.0
        </p>
        <div className='flex gap-2 items-center text-accent mt-2'>
          <span className='w-2 h-2 rounded-full bg-accent animate-pulse' />
          <span className='text-xs tracking-widest'>DISPONIBLE</span>
        </div>
        <div className='mt-4 flex flex-wrap items-center justify-center gap-3'>
          <Button href='#projects' variant='primary' size='lg'>
            Ver proyectos →
          </Button>
          <Button href='#contact' variant='secondary' size='lg'>
            Contacto
          </Button>
        </div>
      </div>
    </section>
  );
}
