// Tipos de los casos de estudio (páginas /casos/<slug>).
// El contenido de cada caso vive en src/app/casos/<slug>/content.ts.
import type { ReactNode } from 'react'

/* ── Props de componentes ── */

export interface CaseSectionProps {
  id: string
  /** Fondo alternado para separar secciones. */
  alt?: boolean
  children: ReactNode
}

export interface CaseCardProps {
  card: CaseCard
  /** Clases de borde (color/acento) de la tarjeta. */
  accent?: string
}

export interface ArchitectureDiagramProps {
  caption: string
}

export interface ArchitectureBoxProps {
  x: number
  title: string
  lines: string[]
  /** Caja rellena con el color de acento. */
  filled?: boolean
  /** Borde de acento más grueso. */
  strong?: boolean
}

/* ── Contenido ── */

export interface CaseCard {
  /** Etiqueta corta arriba del título (P1, AUDITORÍA, 1–2…). */
  label?: string
  title: string
  text: string
}

export type RiskLevel = 'alto' | 'medio' | 'bajo'

export interface CaseRisk {
  risk: string
  level: RiskLevel
  control: string
}

export interface CaseStat {
  value: string
  label: string
}

export interface CaseDocument {
  label: string
  title: string
  description: string
  /** Ruta pública del PDF, p. ej. /pdf/TP1_….pdf */
  href: string
  pages?: number
  /** Documento principal: se muestra destacado. */
  featured?: boolean
}

export interface CaseSectionMeta {
  id: string
  /** Texto del índice (nav sticky). */
  nav: string
  /** "01 · Contexto" */
  eyebrow: string
  title: string
}

export interface CaseStudy {
  slug: string
  kicker: string
  title: string
  /** Descripción para SEO y Open Graph (≤ 160 caracteres). */
  description: string
  lead: string
  chips: string[]
  /** Aclaración visible: proyecto académico, institución, año. */
  academicNote: string
  sections: CaseSectionMeta[]
  problem: { intro: string; items: CaseCard[] }
  solution: { intro: string; diagramCaption: string; decisions: CaseCard[] }
  security: { intro: string; risks: CaseRisk[]; audit: CaseCard[] }
  devsecops: { intro: string; stages: CaseCard[] }
  privacy: { items: CaseCard[] }
  results: { stats: CaseStat[]; learnings: string[] }
  stack: { services: string[]; concepts: string[] }
  documents: CaseDocument[]
  quote: string
}
