/* eslint-disable react/jsx-no-comment-textnodes */
'use client';

import { m } from 'framer-motion';
import { TerminalText } from '@/components/ui/TerminalText';
import { PixelBg } from '@/components/ui/PixelBg';
import { PIXEL_PALETTES } from '@/lib/pixel-palettes';
import { VerticalCarousel } from '@/components/ui/VerticalCarousel';
import { HorizontalCertCarousel } from '@/components/ui/HorizontalCertCarousel';
import { DevShowcase } from './DevShowcase';
import type { CarouselItem } from '@/types/carousel';

const DEV_CERTS: CarouselItem[] = [
  {
    id: 'ch-fullstack',
    title: 'Full Stack Developer',
    issuer: 'Coderhouse',
    period: 'ene. 2024',
    status: 'Completado',
    imageSrc: '/certs/full-stack-dev-coderhouse.png',
  },
  {
    id: 'dc-python-dev',
    title: 'Python Developer',
    issuer: 'DataCamp',
    period: '2025',
    status: 'Completado',
    imageSrc: '/certs/python-dev-datacamp.png',
  },
  {
    id: 'il-plc',
    title: 'Diplomado Industria 4.0 - Programación PLC',
    issuer: 'IngeLearn',
    period: 'jun. 2025',
    status: 'En proceso',
  },
  {
    id: 'dc-ai-engineer',
    title: 'AI Engineer for Data Scientists',
    issuer: 'DataCamp',
    period: 'nov. 2025',
    status: 'Completado',
    imageSrc: '/certs/ai-engineer-datacamp.png',
  },
];

const DEV_EXTRA_CERTS: CarouselItem[] = [
  // ── FRONTEND / WEB DEVELOPMENT ──
  {
    id: 'midudev-tailwind',
    title: 'Curso de Tailwind CSS desde cero',
    issuer: 'midudev',
    period: 'jun 2025',
    status: 'Completado',
    description:
      'Desarrollo web con Tailwind CSS, incluyendo diseño responsivo, personalización de estilos y optimización de rendimiento.',
    imageSrc: '/certs/tailwind-midudev.png',
  },
  {
    id: 'midudev-GSAP',
    title: 'Curso de GSAP desde cero',
    issuer: 'midudev',
    period: 'jun 2025',
    status: 'Completado',
    description:
      'Animaciones web con GSAP, incluyendo animación de elementos, scroll-triggered animations y optimización de rendimiento para experiencias interactivas.',
    imageSrc: '/certs/gsap-midudev.png',
  },
  {
    id: 'midudev-mcp',
    title: 'Curso Intensivo de Model Context Protocol',
    issuer: 'midudev',
    period: 'ago 2025',
    status: 'Completado',
    description:
      'Protocolo de contexto para modelos de lenguaje, incluyendo integración con herramientas de ciberseguridad y generación de prompts avanzados para tareas ofensivas y defensivas.',
    imageSrc: '/certs/mcp-midudev.png',
  },
  {
    id: 'IA WORKFLOWS',
    title: 'AI Workflows de BIG school',
    issuer: 'BIG school',
    period: 'sep 2026',
    status: 'Completado',
    description:
      'Diseño e implementación de flujos de trabajo de IA, incluyendo integración de modelos de lenguaje con herramientas externas, automatización de tareas y optimización de prompts para casos de uso específicos.',
    imageSrc: '/certs/ia-workflows-bigschool.png',
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
    id: 'dc-ai-engineer',
    title: 'AI Engineer for Data Scientists',
    issuer: 'DataCamp',
    period: 'nov. 2025',
    status: 'Completado',
  },
  {
    id: 'il-plc',
    title: 'Diplomado Industria 4.0 - Programación PLC',
    issuer: 'IngeLearn',
    period: 'jun. 2025',
    status: 'En proceso',
  },
];

export function DevSection() {
  return (
    <section id='dev' className='relative bg-bg'>
      <PixelBg colors={PIXEL_PALETTES.dev} />
      <div className='relative z-10'>
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
            className='grid grid-cols-1 gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-start'
          >
            <div className='w-full md:w-[640px]'>
              <VerticalCarousel items={DEV_CERTS} cardHeight={420} />
            </div>

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
        {/* Otras certificaciones */}
        <div className='container mx-auto max-w-7xl px-6 pb-20'>
          <p className='font-mono text-xs text-text-muted tracking-widest uppercase mb-6'>
            // Otras certificaciones
          </p>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <HorizontalCertCarousel
              items={DEV_EXTRA_CERTS}
              accentColor='#60a5fa'
            />
          </m.div>
        </div>
      </div>
      {/* end z-10 */}
    </section>
  );
}
