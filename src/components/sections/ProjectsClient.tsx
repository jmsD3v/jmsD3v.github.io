'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { Button } from '@/components/ui/button'
import { staggerContainer, fadeInFromBottom } from '@/components/animations/variants'
import { useProject } from '@/contexts/ProjectContext'
import type { ProjectCardData, ProjectFilter } from '@/types/projects'

const FILTERS: { value: ProjectFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'dev', label: 'Dev' },
  { value: 'hacker', label: 'Cybersecurity' },
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

      {/* Cards grid */}
      <AnimatePresence mode="wait">
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
      </AnimatePresence>

      <div className="mt-10 text-center">
        <Button href={githubUrl} variant="secondary" size="lg">
          Ver todos en GitHub →
        </Button>
      </div>
    </div>
  )
}
