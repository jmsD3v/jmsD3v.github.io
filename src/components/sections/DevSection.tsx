'use client';

import { m } from 'framer-motion';
import { TerminalText } from '@/components/ui/TerminalText';
import { VerticalCarousel } from '@/components/ui/VerticalCarousel';
import { DevShowcase } from './DevShowcase';
import type { CarouselItem } from '@/types/carousel';

const DEV_CERTS: CarouselItem[] = [
  {
    id: 'ch-fullstack',
    title: 'Full Stack Developer',
    issuer: 'Coderhouse',
    period: 'ene. 2024',
    status: 'Completado',
  },
  {
    id: 'dc-python-dev',
    title: 'Python Developer',
    issuer: 'DataCamp',
    period: '2025',
    status: 'Completado',
  },
  {
    id: 'il-plc',
    title: 'Diplomado Industria 4.0 - Programación PLC',
    issuer: 'IngeLearn',
    period: 'jun. 2025',
    status: 'Cursando',
  },
  {
    id: 'dc-ai-engineer',
    title: 'AI Engineer for Data Scientists',
    issuer: 'DataCamp',
    period: 'nov. 2025',
    status: 'Completado',
  },
];

const DEV_CARRERAS = [
  {
    id: 'ch-fullstack',
    title: 'Full Stack Developer',
    issuer: 'Coderhouse',
    period: 'ene. 2024',
    status: 'Completado',
  },
  {
    id: 'dc-python-dev',
    title: 'Python Developer',
    issuer: 'DataCamp',
    period: '2025',
    status: 'Completado',
  },
  {
    id: 'il-plc',
    title: 'Diplomado Industria 4.0 - Programación PLC',
    issuer: 'IngeLearn',
    period: 'jun. 2025',
    status: 'Cursando',
  },
  {
    id: 'dc-ai-engineer',
    title: 'AI Engineer for Data Scientists',
    issuer: 'DataCamp',
    period: 'nov. 2025',
    status: 'Completado',
  },
];

export function DevSection() {
  return (
    <section id='dev' className='bg-bg'>
      {/* Header */}
      <div className='container mx-auto max-w-7xl px-6 pt-20 pb-4'>
        <p className='text-accent text-sm tracking-widest uppercase mb-2'>
          <TerminalText text='> ls ./proyectos/dev' speed={45} />
        </p>
        <h2 className='font-mono text-3xl font-bold text-text md:text-4xl'>
          Full Stack Developer
        </h2>
        <p className='mt-3 font-mono text-text-muted max-w-xl'>
          Aplicaciones web modernas, escalables y con foco en experiencia de
          usuario.
        </p>
      </div>

      <DevShowcase />

      {/* Formación destacada */}
      <div className='container mx-auto max-w-7xl px-6 pb-16'>
        <p className='font-mono text-xs text-text-muted tracking-widest uppercase mb-6'>
          // Formación destacada
        </p>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='grid grid-cols-1 gap-6 md:grid-cols-2'
        >
          <VerticalCarousel items={DEV_CERTS} cardHeight={280} />

          {/* Lista estática de carreras */}
          <div className='flex flex-col gap-3'>
            {DEV_CARRERAS.map((c) => (
              <div
                key={c.title}
                className='border border-surface rounded-md px-4 py-3 bg-surface/20 flex items-center justify-between gap-4'
              >
                <div className='min-w-0'>
                  <p className='font-mono text-xs font-bold text-text truncate'>
                    {c.title}
                  </p>
                  <p className='font-mono text-xs text-text-muted mt-0.5'>
                    {c.issuer} · {c.period}
                  </p>
                </div>
                <span
                  className={`font-mono text-xs shrink-0 ${c.status === 'Completado' ? 'text-accent' : 'text-yellow-400'}`}
                >
                  {c.status === 'Completado' ? '✓' : '…'}
                </span>
              </div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
