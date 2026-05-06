'use client';

import { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { CarouselItem } from '@/types/carousel';

export type { CarouselItem };

interface VerticalCarouselProps {
  items: CarouselItem[];
  autoInterval?: number;
  cardHeight?: number;
}

const slideVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? 56 : -56, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (dir: number) => ({ y: dir > 0 ? -56 : 56, opacity: 0 }),
};

export function VerticalCarousel({
  items,
  autoInterval = 4500,
  cardHeight = 340,
}: VerticalCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const navigate = useCallback(
    (idx: number) => {
      setDirection(idx >= current ? 1 : -1);
      setCurrent(idx);
    },
    [current],
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % items.length);
    }, autoInterval);
    return () => clearInterval(id);
  }, [paused, items.length, autoInterval]);

  const item = items[current];
  const isInProgress = /proceso|curso|cursando/i.test(item.status);

  return (
    <div
      className='flex gap-3'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Card */}
      <div
        className='relative flex-1 overflow-hidden rounded-md border border-surface bg-surface/20'
        style={{ height: cardHeight }}
      >
        <AnimatePresence custom={direction} mode='wait'>
          <m.div
            key={item.id}
            custom={direction}
            variants={slideVariants}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='absolute inset-0 flex flex-col p-3'
          >
            {/* Certificate image */}
            <div className='relative w-full h-[280px] overflow-hidden rounded border border-surface/60 bg-surface/30 mb-4'>
              {item.imageSrc ? (
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  className='object-contain'
                />
              ) : (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='font-mono text-xs text-text-muted'>
                    {isInProgress ? '[en proceso]' : '[captura pendiente]'}
                  </span>
                </div>
              )}
              {item.badgeSrc && (
                <div className='absolute bottom-2 right-2 w-12 h-12'>
                  <Image
                    src={item.badgeSrc}
                    alt='badge'
                    fill
                    className='object-contain'
                  />
                </div>
              )}
            </div>

            {/* Meta */}
            <p className='font-mono text-sm font-bold text-text leading-snug'>
              {item.title}
            </p>
            <p className='font-mono text-xs text-text-muted mt-0.5'>
              {item.issuer}
            </p>
            <div className='flex items-center justify-between mt-2'>
              {item.period && (
                <span className='font-mono text-xs text-text-muted'>
                  {item.period}
                </span>
              )}
              <span
                className={`font-mono text-xs ml-auto ${
                  item.status === 'Completado'
                    ? 'text-accent'
                    : 'text-yellow-400'
                }`}
              >
                {item.status}
              </span>
            </div>
          </m.div>
        </AnimatePresence>
      </div>

      {/* Dot navigation */}
      <div className='flex flex-col items-center justify-center gap-2 py-4'>
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => navigate(i)}
            aria-label={`Ir a certificado ${i + 1}`}
            className={`w-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? 'h-7 bg-accent'
                : 'h-1.5 bg-surface hover:bg-text-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
