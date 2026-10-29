import type { Metadata } from 'next'
import Link from 'next/link'
import { ArchitectureDiagram } from '@/components/case-study/ArchitectureDiagram'
import { SiteFooter } from '@/components/ui/SiteFooter'
import type { CaseCardProps, CaseSectionMeta, CaseSectionProps, RiskLevel } from '@/types/case-study'
import { CASO_NUBE as caso } from './content'

const PATH = `/casos/${caso.slug}`

export const metadata: Metadata = {
  title: caso.title,
  description: caso.description,
  alternates: { canonical: PATH },
  openGraph: {
    type: 'article',
    url: PATH,
    title: caso.title,
    description: caso.description,
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: caso.title,
    description: caso.description,
  },
}

const RISK_STYLE: Record<RiskLevel, string> = {
  alto: 'bg-offensive text-bg',
  medio: 'bg-[#f5b942] text-bg',
  bajo: 'bg-accent text-bg',
}

function section(id: string): CaseSectionMeta {
  const s = caso.sections.find((x) => x.id === id)
  if (!s) throw new Error(`Sección "${id}" no definida en el caso`)
  return s
}

function Section({ id, alt = false, children }: CaseSectionProps) {
  const s = section(id)
  return (
    <section
      id={s.id}
      aria-labelledby={`${s.id}-titulo`}
      className={`scroll-mt-16 border-b border-white/10 py-12 md:py-16 ${alt ? 'bg-surface/60' : ''}`}
    >
      <div className='mx-auto max-w-5xl px-4 sm:px-6'>
        <p className='text-xs font-bold uppercase tracking-[0.16em] text-defensive'>{s.eyebrow}</p>
        <h2 id={`${s.id}-titulo`} className='mt-1 mb-4 text-2xl font-bold text-text md:text-3xl'>
          {s.title}
        </h2>
        {children}
      </div>
    </section>
  )
}

function Intro({ children }: Pick<CaseSectionProps, 'children'>) {
  return <p className='mb-6 max-w-3xl text-sm leading-relaxed text-text-muted md:text-base'>{children}</p>
}

function Card({ card, accent = 'border-white/10' }: CaseCardProps) {
  return (
    <div className={`rounded-lg border bg-surface p-5 ${accent}`}>
      {card.label && (
        <p className='text-[11px] font-bold uppercase tracking-[0.14em] text-forensics'>{card.label}</p>
      )}
      <h3 className='mt-1 mb-2 text-sm font-bold text-text md:text-base'>{card.title}</h3>
      <p className='text-xs leading-relaxed text-text-muted md:text-sm'>{card.text}</p>
    </div>
  )
}

export default function CasoNubePage() {
  const featured = caso.documents.find((d) => d.featured)
  const parts = caso.documents.filter((d) => !d.featured)

  return (
    // overflow-x-clip (no hidden): hidden crea un contenedor de scroll y anula el sticky del índice.
    <main className='overflow-x-clip bg-bg font-mono text-text'>
      {/* ── Hero ── */}
      <header className='relative overflow-hidden border-b border-white/10'>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full border border-forensics/20 shadow-[0_0_0_40px_rgba(192,132,252,0.04),0_0_0_80px_rgba(192,132,252,0.025)]'
        />
        <div className='relative mx-auto max-w-5xl px-4 pt-8 pb-12 sm:px-6 md:pt-10 md:pb-16'>
          <Link href='/#hacker' className='text-xs text-text-muted underline-offset-4 hover:text-accent hover:underline'>
            ← Volver al portfolio
          </Link>
          <p className='mt-8 text-xs font-bold uppercase tracking-[0.18em] text-defensive'>{caso.kicker}</p>
          <h1 className='mt-3 mb-5 max-w-[22ch] text-3xl font-bold leading-tight text-text md:text-5xl'>
            {caso.title}
          </h1>
          <p className='max-w-3xl text-sm leading-relaxed text-text-muted md:text-lg'>{caso.lead}</p>
          <ul className='mt-6 flex flex-wrap gap-2' aria-label='Datos del proyecto'>
            {caso.chips.map((c) => (
              <li
                key={c}
                className='rounded-full border border-forensics/30 bg-forensics/10 px-3 py-1 text-xs font-semibold text-text'
              >
                {c}
              </li>
            ))}
          </ul>
          <p className='mt-5 inline-block rounded-md border border-white/10 bg-surface px-3 py-2 text-xs text-text-muted'>
            {caso.academicNote}
          </p>
          {featured && (
            <div className='mt-7'>
              <a
                href={featured.href}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 rounded-md bg-forensics px-4 py-2 text-sm font-bold text-bg transition-opacity hover:opacity-90'
              >
                Ver el plan completo (PDF, {featured.pages} págs.)
              </a>
            </div>
          )}
        </div>
      </header>

      {/* ── Índice ── */}
      <nav aria-label='Secciones del caso' className='sticky top-0 z-10 border-b border-white/10 bg-bg/90 backdrop-blur'>
        <ul className='mx-auto flex max-w-5xl gap-5 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6'>
          {caso.sections.map((s) => (
            <li key={s.id} className='shrink-0'>
              <a href={`#${s.id}`} className='text-xs font-semibold text-text-muted hover:text-forensics'>
                {s.nav}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Section id='problema'>
        <Intro>{caso.problem.intro}</Intro>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {caso.problem.items.map((c) => (
            <Card key={c.title} card={c} accent='border-white/10 border-l-4 border-l-offensive' />
          ))}
        </div>
      </Section>

      <Section id='solucion' alt>
        <Intro>{caso.solution.intro}</Intro>
        <ArchitectureDiagram caption={caso.solution.diagramCaption} />
        <div className='mt-6 grid gap-4 sm:grid-cols-2'>
          {caso.solution.decisions.map((c) => (
            <Card key={c.title} card={c} />
          ))}
        </div>
      </Section>

      <Section id='seguridad'>
        <Intro>{caso.security.intro}</Intro>
        <div className='overflow-x-auto rounded-lg border border-white/10'>
          <table className='w-full min-w-[560px] border-collapse text-left text-xs md:text-sm'>
            <caption className='sr-only'>Riesgos principales, nivel y control propuesto</caption>
            <thead className='bg-forensics/15 text-forensics'>
              <tr>
                <th scope='col' className='px-4 py-3 font-bold'>Riesgo</th>
                <th scope='col' className='px-4 py-3 font-bold'>Nivel</th>
                <th scope='col' className='px-4 py-3 font-bold'>Control principal</th>
              </tr>
            </thead>
            <tbody>
              {caso.security.risks.map((r) => (
                <tr key={r.risk} className='border-t border-white/10 bg-surface align-top'>
                  <td className='px-4 py-3 text-text'>{r.risk}</td>
                  <td className='px-4 py-3'>
                    <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${RISK_STYLE[r.level]}`}>
                      {r.level}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-text-muted'>{r.control}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='mt-6 grid gap-4 sm:grid-cols-3'>
          {caso.security.audit.map((c) => (
            <Card key={c.title} card={c} />
          ))}
        </div>
      </Section>

      <Section id='devsecops' alt>
        <Intro>{caso.devsecops.intro}</Intro>
        <ol className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {caso.devsecops.stages.map((c) => (
            <li key={c.title}>
              <Card card={c} accent='border-white/10 border-t-4 border-t-forensics' />
            </li>
          ))}
        </ol>
      </Section>

      <Section id='privacidad'>
        <div className='grid gap-4 sm:grid-cols-2'>
          {caso.privacy.items.map((c) => (
            <Card key={c.title} card={c} />
          ))}
        </div>
      </Section>

      <Section id='resultados' alt>
        <ul className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
          {caso.results.stats.map((s) => (
            <li key={s.label} className='rounded-lg border border-white/10 bg-surface p-5'>
              <p className='text-2xl font-bold text-forensics md:text-3xl'>{s.value}</p>
              <p className='mt-1 text-xs leading-snug text-text-muted'>{s.label}</p>
            </li>
          ))}
        </ul>
        <h3 className='mt-10 mb-4 text-base font-bold text-text'>Qué aprendí</h3>
        <ul className='grid gap-3'>
          {caso.results.learnings.map((l) => (
            <li key={l} className='flex gap-3 text-sm leading-relaxed text-text-muted'>
              <span aria-hidden='true' className='mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-defensive text-[11px] font-bold text-bg'>
                ✓
              </span>
              {l}
            </li>
          ))}
        </ul>
      </Section>

      <Section id='stack'>
        <h3 className='mb-3 text-sm font-bold text-text'>Servicios de AWS</h3>
        <ul className='flex flex-wrap gap-2'>
          {caso.stack.services.map((t) => (
            <li key={t} className='rounded-md border border-defensive/40 bg-surface px-3 py-1.5 text-xs font-semibold text-text'>
              {t}
            </li>
          ))}
        </ul>
        <h3 className='mt-6 mb-3 text-sm font-bold text-text'>Conceptos y marcos</h3>
        <ul className='flex flex-wrap gap-2'>
          {caso.stack.concepts.map((t) => (
            <li key={t} className='rounded-md border border-white/10 bg-surface px-3 py-1.5 text-xs font-semibold text-text-muted'>
              {t}
            </li>
          ))}
        </ul>
      </Section>

      <Section id='documentos' alt>
        {featured && (
          <a
            href={featured.href}
            target='_blank'
            rel='noopener noreferrer'
            className='mb-4 block rounded-lg border border-forensics/50 bg-forensics/10 p-5 transition-colors hover:border-forensics'
          >
            <p className='text-[11px] font-bold uppercase tracking-[0.14em] text-forensics'>
              {featured.label} · PDF · {featured.pages} páginas
            </p>
            <p className='mt-1 text-base font-bold text-text'>{featured.title}</p>
            <p className='mt-1 text-xs text-text-muted md:text-sm'>{featured.description}</p>
          </a>
        )}
        <ul className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          {parts.map((d) => (
            <li key={d.href}>
              <a
                href={d.href}
                target='_blank'
                rel='noopener noreferrer'
                className='block h-full rounded-lg border border-white/10 bg-surface p-4 transition-colors hover:border-forensics'
              >
                <p className='text-[11px] font-bold uppercase tracking-[0.12em] text-defensive'>
                  {d.label} · PDF{d.pages ? ` · ${d.pages} págs.` : ''}
                </p>
                <p className='mt-1 text-sm font-bold text-text'>{d.title}</p>
                <p className='mt-1 text-xs text-text-muted'>{d.description}</p>
              </a>
            </li>
          ))}
        </ul>
        <blockquote className='mt-8 max-w-3xl border-l-4 border-forensics pl-4 text-sm italic leading-relaxed text-text md:text-base'>
          “{caso.quote}”
        </blockquote>
      </Section>

      <SiteFooter />
    </main>
  )
}
