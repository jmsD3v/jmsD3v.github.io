'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { Button } from '@/components/ui/button'
import { staggerContainer, fadeInFromBottom } from '@/components/animations/variants'
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

export function ProjectsClient({ projects, githubUrl }: ProjectsClientProps) {
  const [active, setActive] = useState<ProjectFilter>('all')
  const { selected, setSelected } = useProject()

  const handleSelect = (project: ProjectCardData) => {
    const next = selected?.id === project.id ? null : project
    setSelected(next)
    if (next) {
      document.getElementById('dev')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const filtered = active === 'all'
    ? projects
    : projects.filter((p) => p.category === active)

  return (
    <div>
      {/* Filter buttons */}
      <div className="flex gap-2 mb-8">
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
        {/* ── Cybersecurity: grouped by offensive / defensive / forensic ── */}
        {active === 'hacker' ? (
          <m.div
            key="hacker-grouped"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-10"
          >
            {SEC_GROUPS.map((group) => {
              const groupProjects = filtered.filter((p) => p.secGroup === group.key)
              if (groupProjects.length === 0) return null
              return (
                <div key={group.key}>
                  {/* Group header */}
                  <div className={`flex items-center gap-3 mb-4 pb-3 border-b ${group.border}`}>
                    <span
                      className="font-mono text-sm font-bold tracking-widest"
                      style={{ color: group.accent }}
                    >
                      {group.label}
                    </span>
                    <span className="font-mono text-xs text-text-muted opacity-60">
                      {groupProjects.length} proyectos
                    </span>
                  </div>

                  {/* Cards */}
                  <m.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {groupProjects.map((project) => (
                      <m.div key={project.id} variants={fadeInFromBottom}>
                        <ProjectCard
                          project={project}
                          selected={selected?.id === project.id}
                          onClick={() => handleSelect(project)}
                          accentColor={group.accent}
                          accentBg={group.bg}
                          accentBorder={group.border}
                        />
                      </m.div>
                    ))}
                  </m.div>
                </div>
              )
            })}
          </m.div>
        ) : (
          /* ── All / Dev: flat grid ── */
          <m.div
            key={active}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((project) => (
              <m.div key={project.id} variants={fadeInFromBottom}>
                <ProjectCard
                  project={project}
                  selected={selected?.id === project.id}
                  onClick={() => handleSelect(project)}
                />
              </m.div>
            ))}
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
