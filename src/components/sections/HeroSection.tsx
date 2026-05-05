'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Character } from '@/types/hero';

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
  'LAS BREÑAS AL MUNDO',
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
      className='text-white text-5xl md:text-7xl font-bold tracking-widest font-mono text-center'
    >
      JUAN MANUEL SILVA
    </h1>
  );
}

export function HeroSection() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set());

  const createCharacters = useCallback(
    () =>
      Array.from({ length: 300 }, () => ({
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.1 + Math.random() * 0.3,
      })),
    [],
  );

  useEffect(() => {
    setCharacters(createCharacters());
  }, [createCharacters]);

  useEffect(() => {
    if (characters.length === 0) return;
    const id = setInterval(() => {
      const next = new Set<number>();
      const count = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < count; i++) {
        next.add(Math.floor(Math.random() * characters.length));
      }
      setActiveIndices(next);
    }, 50);
    return () => clearInterval(id);
  }, [characters.length]);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      setCharacters((prev) =>
        prev.map((c) => ({
          ...c,
          y: c.y >= 100 ? -5 : c.y + c.speed,
          x: c.y >= 100 ? Math.random() * 100 : c.x,
          char:
            c.y >= 100
              ? CHARS[Math.floor(Math.random() * CHARS.length)]
              : c.char,
        })),
      );
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section id="hero" className='relative w-full h-screen bg-bg overflow-hidden flex items-center justify-center'>
      <div className='relative z-20 flex flex-col items-center gap-4'>
        <ScrambledTitle />
        <p className='text-text-muted text-sm md:text-base tracking-widest font-mono'>
          Full Stack & Python Dev · AI Engineer · Ciberseguridad
        </p>
        <div className='flex gap-2 items-center text-accent mt-2'>
          <span className='w-2 h-2 rounded-full bg-accent animate-pulse' />
          <span className='text-xs tracking-widest'>DISPONIBLE</span>
        </div>
      </div>

      {characters.map((char, i) => (
        <span
          key={i}
          className={`absolute select-none pointer-events-none transition-colors duration-100 ${
            activeIndices.has(i)
              ? 'text-accent font-bold z-10'
              : 'text-slate-700 font-light'
          }`}
          style={{
            left: `${char.x}%`,
            top: `${char.y}%`,
            transform: `translate(-50%, -50%) ${activeIndices.has(i) ? 'scale(1.25)' : 'scale(1)'}`,
            textShadow: activeIndices.has(i)
              ? '0 0 8px rgba(0,255,65,0.8), 0 0 16px rgba(0,255,65,0.4)'
              : 'none',
            opacity: activeIndices.has(i) ? 1 : 0.3,
            fontSize: '1.4rem',
            willChange: 'top',
          }}
        >
          {char.char}
        </span>
      ))}
    </section>
  );
}
