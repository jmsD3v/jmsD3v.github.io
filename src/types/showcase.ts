export interface TabMedia {
  value: string
  label: string
  src: string
  alt?: string
}

export interface ShowcaseStep {
  id: string
  title: string
  text: string
}

export interface FeatureShowcaseProps {
  eyebrow?: string
  title: string
  description?: string
  stats?: string[]
  steps?: ShowcaseStep[]
  tabs: TabMedia[]
  defaultTab?: string
  panelMinHeight?: number
  className?: string
  ctaPrimary?: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
  reversed?: boolean
}
