'use client'

import { useState } from 'react'
import { m } from 'framer-motion'
import { TerminalText } from '@/components/ui/TerminalText'
import { Button } from '@/components/ui/button'
import { staggerContainer, fadeInFromBottom } from '@/components/animations/variants'

const EMAIL = 'juanmanuelsilva06@gmail.com'
const WHATSAPP = 'https://wa.me/5493624XXXXXX'  // reemplazar con número real
const LINKEDIN = 'https://www.linkedin.com/in/jmsilva83'
const GITHUB = 'https://github.com/jmsD3v'
const CV_PATH = '/cv/juan-manuel-silva-cv.pdf'

const CONTACT_LINKS = [
  {
    id: 'email',
    label: 'Email',
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    icon: '✉',
    copyable: true,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: '+54 362 4XX XXXX',
    href: WHATSAPP,
    icon: '▲',
    copyable: false,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/jmsilva83',
    href: LINKEDIN,
    icon: 'in',
    copyable: false,
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'github.com/jmsD3v',
    href: GITHUB,
    icon: '⌥',
    copyable: false,
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="font-mono text-xs text-text-muted hover:text-accent transition-colors px-2 py-1 border border-surface rounded hover:border-accent/40"
    >
      {copied ? '✓ copiado' : 'copiar'}
    </button>
  )
}

export function ContactSection() {
  return (
    <section id="contact" className="bg-bg">
      <div className="container mx-auto max-w-7xl px-6 pt-20 pb-4">
        <p className="text-accent text-sm tracking-widest uppercase mb-2">
          <TerminalText text="> whoami --contact" speed={45} delay={100} />
        </p>
        <h2 className="font-mono text-3xl font-bold text-text md:text-4xl">
          Contacto
        </h2>
        <p className="mt-3 font-mono text-text-muted max-w-xl">
          Disponible para proyectos freelance, auditorías de seguridad y oportunidades laborales.
        </p>
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-12">
        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {CONTACT_LINKS.map((link) => (
            <m.div key={link.id} variants={fadeInFromBottom}>
              <a
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="group flex items-center gap-4 border border-surface rounded-md p-5 bg-surface/20 hover:border-accent/40 transition-colors duration-200"
              >
                <span className="font-mono text-lg text-accent w-6 text-center shrink-0 group-hover:scale-110 transition-transform">
                  {link.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-text-muted uppercase tracking-widest">{link.label}</p>
                  <p className="font-mono text-sm text-text mt-0.5 truncate">{link.value}</p>
                </div>
                {link.copyable && (
                  <div onClick={(e) => e.preventDefault()}>
                    <CopyButton text={link.value} />
                  </div>
                )}
                <span className="font-mono text-xs text-text-muted group-hover:text-accent transition-colors shrink-0">↗</span>
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
          className="mt-8 flex flex-col items-center gap-4 border border-surface/60 rounded-lg p-8 bg-surface/10 text-center"
        >
          <p className="font-mono text-xs text-text-muted tracking-widest uppercase">
            // Curriculum Vitae
          </p>
          <p className="font-mono text-sm text-text-muted max-w-sm">
            Juan Manuel Silva — Full Stack Developer & Security Researcher
          </p>
          <Button href={CV_PATH} variant="primary" size="lg">
            Descargar CV →
          </Button>
        </m.div>
      </div>
    </section>
  )
}
