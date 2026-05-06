/* eslint-disable react/jsx-no-comment-textnodes */
'use client';

import { m } from 'framer-motion';
import { TerminalText } from '@/components/ui/TerminalText';
import { PixelBg } from '@/components/ui/PixelBg';
import { PIXEL_PALETTES } from '@/lib/pixel-palettes';
import { Button } from '@/components/ui/button';
import {
  staggerContainer,
  fadeInFromBottom,
} from '@/components/animations/variants';

const EMAIL = 'juanmanuelsilva06@gmail.com';
const GMAIL_COMPOSE = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}`;
const WHATSAPP = 'https://wa.me/5493625455529';
const LINKEDIN = 'https://www.linkedin.com/in/jmsilva83';
const GITHUB = 'https://github.com/jmsD3v';
const CV_PATH = '/cv/juan-manuel-silva-cv.pdf';

const CONTACT_LINKS = [
  {
    id: 'email',
    label: 'Abrir Gmail',
    href: GMAIL_COMPOSE,
    icon: '✉',
  },
  {
    id: 'whatsapp',
    label: 'Abrir WhatsApp',
    href: WHATSAPP,
    icon: '▲',
  },
  {
    id: 'linkedin',
    label: 'Abrir LinkedIn',
    href: LINKEDIN,
    icon: 'in',
  },
  {
    id: 'github',
    label: 'Abrir GitHub',
    href: GITHUB,
    icon: '⌥',
  },
];

export function ContactSection() {
  return (
    <section id='contact' className='relative bg-bg'>
      <PixelBg colors={PIXEL_PALETTES.contact} />
      <div className='relative z-10 container mx-auto max-w-7xl px-6 pt-20 pb-4'>
        <p className='text-accent text-sm tracking-widest uppercase mb-2'>
          <TerminalText text='> whoami --contact' speed={45} delay={100} />
        </p>
        <h2 className='font-mono text-3xl font-bold text-text md:text-4xl'>
          Contacto
        </h2>
        <p className='mt-3 font-mono text-text-muted max-w-xl'>
          Disponible para proyectos freelance, auditorías de seguridad y
          oportunidades laborales.
        </p>
      </div>

      <div className='container mx-auto max-w-7xl px-6 py-12'>
        <m.div
          variants={staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, margin: '-80px' }}
          className='grid grid-cols-1 gap-4 sm:grid-cols-2'
        >
          {CONTACT_LINKS.map((link) => (
            <m.div key={link.id} variants={fadeInFromBottom}>
              <a
                href={link.href}
                target='_blank'
                rel='noopener noreferrer'
                className='group flex items-center gap-4 border border-surface rounded-md p-5 bg-surface/20 hover:border-accent/40 transition-colors duration-200'
              >
                <span className='font-mono text-lg text-accent w-6 text-center shrink-0 group-hover:scale-110 transition-transform'>
                  {link.icon}
                </span>
                <p className='font-mono text-sm text-text uppercase tracking-widest flex-1'>
                  {link.label}
                </p>
                <span className='font-mono text-xs text-text-muted group-hover:text-accent transition-colors shrink-0'>
                  ↗
                </span>
              </a>
            </m.div>
          ))}
        </m.div>

        {/* CV download */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='mt-8 flex flex-col items-center gap-4 border border-surface/60 rounded-lg p-8 bg-surface/10 text-center'
        >
          <p className='font-mono text-xs text-text-muted tracking-widest uppercase'>
            // Curriculum Vitae
          </p>
          <Button href={CV_PATH} variant='primary' size='lg'>
            Descargar CV →
          </Button>
        </m.div>
      </div>{/* end z-10 */}
    </section>
  );
}
