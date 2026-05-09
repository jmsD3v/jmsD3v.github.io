import { cn } from '@/lib/utils'
import type { ProjectCardData } from '@/types/projects'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Go: '#00ADD8',
  Rust: '#dea584',
}

interface ProjectCardProps {
  project: ProjectCardData
  selected?: boolean
  onClick?: () => void
  className?: string
  /** Override accent color for cybersecurity group cards */
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
  const langColor = project.language ? (LANG_COLORS[project.language] ?? '#64748b') : '#64748b'

  // Border
  const borderClass = selected
    ? (accentBorder ?? 'border-accent')
    : accentBorder
      ? accentBorder
      : 'border-surface hover:border-accent/50'

  // Background
  const bgClass = selected
    ? (accentBg ?? 'bg-surface/70')
    : accentBg
      ? accentBg
      : 'bg-surface/40 hover:bg-surface/70'

  // Title color: selected → accent, cybersecurity card hover → group color, default → text/hover-accent
  const titleStyle = selected
    ? { color: accentColor ?? 'var(--color-accent)' }
    : undefined

  const titleClass = cn(
    'font-mono text-sm font-semibold transition-colors truncate',
    !selected && !accentColor && 'text-text group-hover:text-accent',
    !selected && accentColor && 'text-text',
  )

  return (
    <button
      onClick={onClick}
      className={cn(
        'group w-full text-left flex flex-col gap-3 rounded-xl border p-5 transition-colors duration-200',
        borderClass,
        bgClass,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className={titleClass} style={titleStyle}>
          {project.name}
        </h3>
        {project.stargazers_count > 0 && (
          <span className="shrink-0 font-mono text-xs text-text-muted">
            ★ {project.stargazers_count}
          </span>
        )}
      </div>

      {project.description && (
        <p className="font-mono text-xs text-text-muted line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      )}

      <div className="mt-auto flex items-center gap-3 flex-wrap">
        {project.language && (
          <span className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: langColor }} />
            {project.language}
          </span>
        )}
        {project.topics.slice(0, 2).map((t) => (
          <span
            key={t}
            className="font-mono text-xs text-text-muted border border-surface rounded px-1.5 py-0.5"
          >
            {t}
          </span>
        ))}
      </div>
    </button>
  )
}
