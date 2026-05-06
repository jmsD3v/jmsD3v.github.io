import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { DevSection } from '@/components/sections/DevSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ModeTransition } from '@/components/sections/ModeTransition'
import { HackerSection } from '@/components/sections/HackerSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { SectionDotNav } from '@/components/ui/SectionDotNav'
import { ProjectProvider } from '@/contexts/ProjectContext'
import { FontsReady } from '@/components/providers/FontsReady'

export default function Home() {
  return (
    <main className="bg-bg text-text font-mono">
      <SectionDotNav />
      <FontsReady />

      <HeroSection />
      <AboutSection />
      <ProjectProvider>
        <DevSection />
        <ProjectsSection />
      </ProjectProvider>
      <ModeTransition />
      <HackerSection />
      <ContactSection />

      <footer className="py-4 text-center text-text-muted text-xs border-t border-surface">
        Copyright © 2025 Desarrollado desde Las Breñas con 💜 por{' '}
        <a
          href="https://www.linkedin.com/in/jmsilva83"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline"
        >
          @jmsDev
        </a>{' '}
        · All rights reserved
      </footer>
    </main>
  )
}
