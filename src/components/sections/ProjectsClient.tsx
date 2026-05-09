'use client'

import { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { Button } from '@/components/ui/button'
import { cardStack, cardStackContainer } from '@/components/animations/variants'
import { useProject } from '@/contexts/ProjectContext'
import type { ProjectCardData, ProjectFilter, SecGroup } from '@/types/projects'

const FILTERS: { value: ProjectFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'dev', label: 'Dev' },
  { value: 'hacker', label: 'Cybersecurity' },
]

const SEC_GROUPS: {
  key: SecGroup
  label: string
  accent: string
  border: string
  bg: string
}[] = [
  {
    key: 'offensive',
    label: '// Offensive',
    accent: '#ef4444',
    border: 'border-red-500/40',
    bg: 'bg-red-500/5',
  },
  {
    key: 'defensive',
    label: '// Defensive',
    accent: '#3b82f6',
    border: 'border-blue-500/40',
    bg: 'bg-blue-500/5',
  },
  {
    key: 'forensic',
    label: '// Forensics',
    accent: '#a78bfa',
    border: 'border-violet-400/40',
    bg: 'bg-violet-400/5',
  },
]

interface ProjectsClientProps {
  projects: ProjectCardData[]
  githubUrl: string
}

/** Cards grid — whileInView so the stack animation triggers on scroll entry */
function CardsGrid({
  projects,
  accentColor,
  accentBg,
  accentBorder,
}: {
  projects: ProjectCardData[]
  accentColor?: string
  accentBg?: string
  accentBorder?: string
}) {
  const { selected, setSelected } = useProject()

  const handleSelect = (project: ProjectCardData) => {
    const next = selected?.id === project.id ? null : project
    setSelected(next)
    if (next) {
      document.getElementById('dev')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <m.div
      variants={cardStackContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      style={{ perspective: 1000 }}
    >
      {projects.map((project) => (
        <m.div key={project.id} variants={cardStack}>
          <ProjectCard
            project={project}
            selected={selected?.id === project.id}
            onClick={() => handleSelect(project)}
            accentColor={accentColor}
            accentBg={accentBg}
            accentBorder={accentBorder}
          />
        </m.div>
      ))}
    </m.div>
  )
}

export function ProjectsClient({ projects, githubUrl }: ProjectsClientProps) {
  const [active, setActive] = useState<ProjectFilter>('all')

  // When filter changes the page layout shifts — refresh GSAP ScrollTrigger
  // so ModeTransition recalculates its scroll positions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('resize'))
      }
    }, 350) // after AnimatePresence exit/enter finishes
    return () => clearTimeout(timer)
  }, [active])

  const filtered = active === 'all'
    ? projects
    : projects.filter((p) => p.category === active)

  return (
    <div>
      {/* Filter buttons */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            variant={active === f.value ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActive(f.value)}
          >
            {f.label}
            <span className="ml-1.5 opacity-60 text-xs">
              {f.value === 'all'
                ? projects.length
                : projects.filter((p) => p.category === f.value).length}
            </span>
          </Button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Cybersecurity: 3 colour-coded groups ── */}
        {active === 'hacker' ? (
          <m.div
            key="hacker-grouped"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-12"
          >
            {SEC_GROUPS.map((group) => {
              const groupProjects = filtered
                .filter((p) => p.secGroup === group.key)
                .sort((a, b) => a.secOrder - b.secOrder)
              if (groupProjects.length === 0) return null
              return (
                <div key={group.key}>
                  {/* Group header */}
                  <div className={`flex items-center gap-3 mb-5 pb-3 border-b ${group.border}`}>
                    <span
                      className="font-mono text-sm font-bold tracking-widest uppercase"
                      style={{ color: group.accent }}
                    >
                      {group.label}
                    </span>
                    <span className="font-mono text-xs text-text-muted opacity-50">
                      {groupProjects.length} proyectos
                    </span>
                  </div>

                  <CardsGrid
                    projects={groupProjects}
                    accentColor={group.accent}
                    accentBg={group.bg}
                    accentBorder={group.border}
                  />
                </div>
              )
            })}

            {/* ── Other hacker repos without a secGroup (ai-agent-security-lab, etc.) ── */}
            {(() => {
              const others = filtered.filter((p) => !p.secGroup)
              if (others.length === 0) return null
              return (
                <div>
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b border-surface/60">
                    <span className="font-mono text-sm font-bold tracking-widest uppercase text-text-muted">
                      // Other
                    </span>
                    <span className="font-mono text-xs text-text-muted opacity-50">
                      {others.length} proyectos
                    </span>
                  </div>
                  <CardsGrid projects={others} />
                </div>
              )
            })()}
          </m.div>
        ) : (
          /* ── All / Dev: flat grid ── */
          <m.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardsGrid projects={filtered} />
          </m.div>
        )}
      </AnimatePresence>

      <div className="mt-10 text-center">
        <Button href={githubUrl} variant="secondary" size="lg">
          Ver todos en GitHub →
        </Button>
      </div>
    </div>
  )
}
