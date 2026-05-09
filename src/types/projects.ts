export type ProjectFilter = 'all' | 'dev' | 'hacker'

export type SecGroup = 'offensive' | 'defensive' | 'forensic'

export interface ProjectCardData {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  topics: string[]
  category: 'dev' | 'hacker' | 'other'
  secGroup?: SecGroup
  secOrder: number
}
