'use client'

import { m } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ProjectCardData } from '@/types/projects'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python:     '#3572A5',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Go:         '#00ADD8',
  Rust:       '#dea584',
}

interface ProjectCardProps {
  project: ProjectCardData
  selected?: boolean
  onClick?: () => void
  className?: string
  accentColor?: string
  accentBg?: string
  accentBorder?: string
}

export function ProjectCard({
  project,
  selected,
  onClick,
  className,
  accentColor,
  accentBg,
  accentBorder,
}: ProjectCardProps) {
  const langColor = project.language
    ? (LANG_COLORS[project.language] ?? '#64748b')
    : '#64748b'

  const effectiveAccent = accentColor ?? 'var(--color-accent, #22d3ee)'

  // Border classes
  const borderClass = selected
    ? (accentBorder ?? 'border-accent')
    : accentBorder
      ? accentBorder
      : 'border-surface'

  // Background classes
  const bgClass = selected
    ? (accentBg ?? 'bg-surface/70')
    : accentBg
      ? accentBg
      : 'bg-surface/40'

  return (
    <m.button
      onClick={onClick}
      layout
      whileHover={{
        y: -5,
        scale: 1.015,
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      className={cn(
        'group w-full text-left flex flex-col gap-3 rounded-xl border p-5 transition-colors duration-200 cursor-pointer',
        borderClass,
        bgClass,
        className,
      )}
      style={{
        // Glow shadow on hover via CSS group-hover (applied via inline style trick)
        boxShadow: selected
          ? `0 0 0 1px ${effectiveAccent}66, 0 8px 32px ${effectiveAccent}22`
          : undefined,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.boxShadow = `0 4px 24px ${effectiveAccent}25, 0 0 0 1px ${effectiveAccent}40`
        el.style.borderColor = `${effectiveAccent}60`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.boxShadow = selected
          ? `0 0 0 1px ${effectiveAccent}66, 0 8px 32px ${effectiveAccent}22`
          : ''
        el.style.borderColor = ''
      }}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <h3
          className={cn(
            'font-mono text-sm font-semibold transition-colors truncate',
            selected ? '' : 'text-text group-hover:text-accent',
          )}
          style={selected ? { color: effectiveAccent } : undefined}
        >
          {project.name}
        </h3>
        {project.stargazers_count > 0 && (
          <span className="shrink-0 font-mono text-xs text-text-muted">
            ★ {project.stargazers_count}
          </span>
        )}
      </div>

      {/* Description */}
      {project.description && (
        <p className="font-mono text-xs text-text-muted line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      )}

      {/* Footer: language + topics */}
      <div className="mt-auto flex items-center gap-3 flex-wrap">
        {project.language && (
          <span className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: langColor }}
            />
            {project.language}
          </span>
        )}
        {project.topics.slice(0, 2).map((t) => (
          <span
            key={t}
            className="font-mono text-xs text-text-muted border border-surface rounded px-1.5 py-0.5 transition-colors duration-150 group-hover:border-accent/30"
          >
            {t}
          </span>
        ))}
      </div>
    </m.button>
  )
}
