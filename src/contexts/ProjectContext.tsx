'use client'

import { createContext, useContext, useState } from 'react'
import type { ProjectCardData } from '@/types/projects'

interface ProjectContextValue {
  selected: ProjectCardData | null
  setSelected: (p: ProjectCardData | null) => void
}

const ProjectContext = createContext<ProjectContextValue>({
  selected: null,
  setSelected: () => {},
})

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<ProjectCardData | null>(null)
  return (
    <ProjectContext.Provider value={{ selected, setSelected }}>
      {children}
    </ProjectContext.Provider>
  )
}

export const useProject = () => useContext(ProjectContext)
