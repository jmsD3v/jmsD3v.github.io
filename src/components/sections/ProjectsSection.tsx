import { getRepos, categorizeRepo } from '@/lib/github'
import { ProjectsClient } from './ProjectsClient'
import { TerminalText } from '@/components/ui/TerminalText'
import { PixelBg } from '@/components/ui/PixelBg'
import { PIXEL_PALETTES } from '@/lib/pixel-palettes'
import type { ProjectCardData } from '@/types/projects'

const EXCLUDED_REPOS = new Set([
  'escrutinio-app',
  'E-commerce-Backend-l',
  '1raPreEntregaBackend2',
  'VendingMachine.-JS',
  'HEXA-landing-Page',
  '1raPreentregaBackend3',
  'hexa-solarflow',
  'AdoptMe',
  'Landing-Diversos-JS-PF',
  'jmsD3v',
  'jmsD3v.github.io',
  'curso_node-RED',
  'tron-ares-theme',
])

export async function ProjectsSection() {
  const username = process.env.GITHUB_USERNAME ?? 'jmsD3v'

  let projects: ProjectCardData[] = []

  try {
    const repos = await getRepos()
    projects = repos
      .filter((r) => !EXCLUDED_REPOS.has(r.name))
      .map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        html_url: r.html_url,
        homepage: r.homepage,
        language: r.language,
        stargazers_count: r.stargazers_count,
        topics: r.topics,
        category: categorizeRepo(r),
      }))
      .filter((r) => r.category !== 'other')
      .sort((a, b) => {
        if (a.category !== b.category) return a.category === 'hacker' ? 1 : -1
        return 0
      })
  } catch (e) {
    console.error('GitHub fetch failed:', e)
  }

  return (
    <section id="projects" className="relative bg-bg py-20">
      <PixelBg colors={PIXEL_PALETTES.projects} />
      <div className="relative z-10 container mx-auto max-w-7xl px-6">
        <p className="text-accent text-sm tracking-widest uppercase mb-2">
          <TerminalText text="> ls ./proyectos --all" speed={40} delay={200} />
        </p>
        <h2 className="font-mono text-3xl font-bold text-text md:text-4xl mb-3">
          Proyectos
        </h2>
        <p className="font-mono text-text-muted max-w-xl mb-10">
          Repos públicos y privados — actualizados automáticamente desde GitHub.
        </p>

        <ProjectsClient
          projects={projects}
          githubUrl={`https://github.com/${username}`}
        />
      </div>{/* end z-10 */}
    </section>
  )
}
