'use client'

import { m } from 'framer-motion'
import { TerminalText } from '@/components/ui/TerminalText'
import { Button } from '@/components/ui/button'
import { VerticalCarousel } from '@/components/ui/VerticalCarousel'
import { staggerContainer, fadeInFromBottom } from '@/components/animations/variants'
import type { CarouselItem } from '@/types/carousel'

/* ── Section color config ─────────────────────────────────── */

const SEC = {
  offensive: { hex: '#ff4444', bg: 'rgba(255,68,68,0.05)' },
  defensive: { hex: '#22d3ee', bg: 'rgba(34,211,238,0.05)' },
  forensics: { hex: '#c084fc', bg: 'rgba(192,132,252,0.05)' },
} as const

type SecKey = keyof typeof SEC

/* ── Data ─────────────────────────────────────────────────── */

const PENTEST_PHASES = [
  { phase: '01', name: 'Reconocimiento', tools: ['Nmap', 'Shodan', 'theHarvester', 'OSINT Framework', 'Recon-ng'] },
  { phase: '02', name: 'Enumeración',    tools: ['Gobuster', 'Ffuf', 'enum4linux', 'Nikto', 'WFuzz'] },
  { phase: '03', name: 'Explotación',    tools: ['Metasploit', 'Burp Suite', 'SQLmap', 'Hydra', 'ExploitDB'] },
  { phase: '04', name: 'Post-Explot.',   tools: ['Mimikatz', 'Netcat', 'PowerShell Empire', 'LinPEAS', 'WinPEAS'] },
  { phase: '05', name: 'Reporte',        tools: ['Dradis', 'Faraday', 'CVSS Scoring', 'OWASP ZAP', 'Markdown'] },
]

const DEFENSIVE_SKILLS = [
  { area: 'SIEM & Monitoreo',  tools: ['Wazuh', 'Elastic SIEM', 'Chronicle', 'Log analysis'] },
  { area: 'Incident Response', tools: ['Contención', 'Erradicación', 'Recuperación', 'Post-incident report'] },
  { area: 'Hardening',         tools: ['Linux hardening', 'Windows security', 'Firewalls', 'IDS/IPS'] },
  { area: 'Frameworks',        tools: ['NIST CSF', 'MITRE ATT&CK', 'ISO 27001', 'CIS Controls'] },
]

const FORENSICS_SKILLS = [
  { area: 'Memoria',  tools: ['Volatility', 'Rekall', 'Process dump', 'Memory carving'] },
  { area: 'Disco',    tools: ['Autopsy', 'Sleuth Kit', 'FTK Imager', 'File carving'] },
  { area: 'Red',      tools: ['Wireshark', 'NetworkMiner', 'Tcpdump', 'PCAP analysis'] },
  { area: 'Análisis', tools: ['Timeline analysis', 'Hash verification', 'Steganography', 'Malware analysis'] },
]

const HACKER_CERTS: CarouselItem[] = [
  {
    id: 'google-cyber-v2',
    title: 'Google Cybersecurity Certificate',
    issuer: 'Google / Coursera',
    period: 'nov. 2025',
    status: 'Completado',
    imageSrc: '/certs/google-cybersecurity.png',
  },
  {
    id: 'teclab-ts-seguridad',
    title: 'Tecnicatura Superior en Seguridad Informática',
    issuer: 'Teclab',
    period: '2025 – Presente',
    status: 'En curso',
  },
  {
    id: 'fadena-licenciatura',
    title: 'Licenciatura en Ciberdefensa',
    issuer: 'UNDEF / FADENA',
    period: '2025 – Presente',
    status: 'En curso',
  },
]

const HACKER_CARRERAS = [
  { title: 'Google Cybersecurity Certificate',             issuer: 'Google / Coursera', period: 'nov. 2025',    status: 'Completado' },
  { title: 'Tecnicatura Superior en Seguridad Informática', issuer: 'Teclab',           period: '2025 – Hoy',   status: 'En curso' },
  { title: 'Licenciatura en Ciberdefensa',                 issuer: 'UNDEF / FADENA',   period: '2025 – Hoy',   status: 'En curso' },
]


/* ── Sub-components ───────────────────────────────────────── */

function SectionHeader({ label, sec }: { label: string; sec: SecKey }) {
  return (
    <div className="border-l-2 pl-4 mb-6" style={{ borderLeftColor: SEC[sec].hex }}>
      <p className="font-mono text-xs tracking-widest uppercase" style={{ color: SEC[sec].hex }}>
        {label}
      </p>
    </div>
  )
}

interface SkillCardProps { area: string; tools: string[]; sec: SecKey; delay?: number }

function SkillCard({ area, tools, sec, delay = 0 }: SkillCardProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <div
        className="border border-surface rounded-md p-4 h-full transition-colors duration-200"
        style={{ backgroundColor: SEC[sec].bg }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = SEC[sec].hex + '66' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = '' }}
      >
        <p className="font-mono text-xs mb-2" style={{ color: SEC[sec].hex }}>[{area}]</p>
        <ul className="space-y-1.5">
          {tools.map((tool) => (
            <li key={tool} className="font-mono text-xs text-text-muted flex items-center gap-2">
              <span className="shrink-0" style={{ color: SEC[sec].hex }}>▸</span>
              {tool}
            </li>
          ))}
        </ul>
      </div>
    </m.div>
  )
}

/* ── Main ─────────────────────────────────────────────────── */

export function HackerSection() {
  return (
    <section id="hacker" className="bg-bg">

      {/* Header */}
      <div className="container mx-auto max-w-7xl px-6 pt-20 pb-4">
        <p className="text-accent text-sm tracking-widest uppercase mb-2">
          <TerminalText text="> ls ./proyectos/hacker" speed={45} delay={200} />
        </p>
        <h2 className="font-mono text-3xl font-bold text-text md:text-4xl">Security Researcher</h2>
        <p className="mt-3 font-mono text-text-muted max-w-xl">
          Formación activa en ciberseguridad ofensiva, defensiva y análisis forense digital.
        </p>
      </div>

      {/* ── RED TEAM ── */}
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <SectionHeader label="// Red Team — Ofensiva" sec="offensive" />
        <m.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {PENTEST_PHASES.map((phase) => (
            <m.div key={phase.phase} variants={fadeInFromBottom}>
              <div
                className="border border-surface rounded-md p-4 h-full transition-colors duration-200"
                style={{ backgroundColor: SEC.offensive.bg }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = SEC.offensive.hex + '66' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = '' }}
              >
                <span className="font-mono text-xs" style={{ color: SEC.offensive.hex }}>Phase_{phase.phase}</span>
                <h4 className="font-mono text-sm font-bold text-text mt-1 mb-3">{phase.name}</h4>
                <ul className="space-y-1.5">
                  {phase.tools.map((tool) => (
                    <li key={tool} className="font-mono text-xs text-text-muted flex items-center gap-2">
                      <span className="shrink-0" style={{ color: SEC.offensive.hex }}>▸</span>
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </m.div>
          ))}
        </m.div>
      </div>

      {/* ── BLUE TEAM ── */}
      <div className="container mx-auto max-w-7xl px-6 pb-12">
        <SectionHeader label="// Blue Team — Defensiva" sec="defensive" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DEFENSIVE_SKILLS.map((cat, i) => (
            <SkillCard key={cat.area} area={cat.area} tools={cat.tools} sec="defensive" delay={i * 0.08} />
          ))}
        </div>
      </div>

      {/* ── FORENSE ── */}
      <div className="container mx-auto max-w-7xl px-6 pb-12">
        <SectionHeader label="// Forense Digital" sec="forensics" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FORENSICS_SKILLS.map((cat, i) => (
            <SkillCard key={cat.area} area={cat.area} tools={cat.tools} sec="forensics" delay={i * 0.08} />
          ))}
        </div>
      </div>

      {/* ── CERTIFICACIONES ── */}
      <div className="container mx-auto max-w-7xl px-6 pb-12">
        <p className="font-mono text-xs text-text-muted tracking-widest uppercase mb-6">
          // Formación en ciberseguridad
        </p>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          <VerticalCarousel items={HACKER_CERTS} cardHeight={280} />

          {/* Lista estática de carreras */}
          <div className="flex flex-col gap-3">
            {HACKER_CARRERAS.map((c) => (
              <div
                key={c.title}
                className="border border-surface rounded-md px-4 py-3 bg-surface/20 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-mono text-xs font-bold text-text truncate">{c.title}</p>
                  <p className="font-mono text-xs text-text-muted mt-0.5">{c.issuer} · {c.period}</p>
                </div>
                <span className={`font-mono text-xs shrink-0 ${c.status === 'Completado' ? 'text-accent' : 'text-yellow-400'}`}>
                  {c.status === 'Completado' ? '✓' : '…'}
                </span>
              </div>
            ))}
          </div>
        </m.div>
      </div>

      {/* ── PLATAFORMAS + CTA ── */}
      <div className="container mx-auto max-w-7xl px-6 pb-20">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border border-surface/60 rounded-lg p-8 bg-surface/10 flex flex-col items-center gap-6 text-center md:flex-row md:text-left md:justify-between"
        >
          <div>
            <p className="font-mono text-xs text-text-muted tracking-widest uppercase mb-3">
              // Plataformas de práctica
            </p>
            <div className="flex gap-3 flex-wrap justify-center md:justify-start">
              <Button href="https://app.hackthebox.com" variant="secondary" size="sm">HackTheBox ↗</Button>
              <Button href="https://tryhackme.com" variant="secondary" size="sm">TryHackMe ↗</Button>
            </div>
          </div>
          <div className="w-full h-px bg-surface md:w-px md:h-12" />
          <div>
            <p className="font-mono text-xs text-text-muted tracking-widest uppercase mb-3">
              // ¿Necesitás una auditoría?
            </p>
            <Button
              href="mailto:juanmanuelsilva06@gmail.com?subject=Solicitud%20de%20Evaluación%20de%20Seguridad"
              variant="primary"
              size="md"
            >
              Solicitar evaluación →
            </Button>
          </div>
        </m.div>
      </div>

    </section>
  )
}
