import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { TerminalText } from '@/components/ui/TerminalText'

export const metadata: Metadata = {
  title: 'Página no encontrada',
  description: 'La página que buscás no existe o cambió de lugar.',
  robots: { index: false, follow: true },
}

// 404 con la misma estética de terminal que el resto del sitio.
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-bg font-mono text-text">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
        {/* Scanlines, igual que en la transición Dev → Cybersecurity */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.025) 2px, rgba(0,255,65,0.025) 4px)',
          }}
        />

        <div className="relative z-10 w-full max-w-xl">
          <div className="rounded-md border border-surface bg-surface/40">
            {/* Barra de la ventana */}
            <div className="flex items-center gap-2 border-b border-surface px-4 py-2.5">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-offensive/80" />
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-accent/80" />
              <span className="ml-2 text-xs text-text-muted">visitante@jmsilva.dev: ~</span>
            </div>

            <div className="px-5 py-8 sm:px-8 sm:py-10">
              <p className="text-sm text-accent">
                <TerminalText text="> cd ./pagina-solicitada" speed={45} delay={200} />
              </p>
              <p className="mt-2 text-sm text-offensive">
                bash: cd: no existe el archivo o el directorio
              </p>

              <h1 className="mt-8">
                <span
                  className="glitch block text-7xl font-bold leading-none tracking-widest text-accent sm:text-8xl"
                  data-text="404"
                >
                  404
                </span>
                <span className="mt-4 block text-xl font-bold text-text sm:text-2xl">
                  Esta ruta no lleva a ningún lado
                </span>
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                La página que buscás no existe o cambió de lugar. Desde acá podés
                volver al inicio o ir directo a los proyectos.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/" variant="primary" size="lg">
                  ← Volver al inicio
                </Button>
                <Button href="/#projects" variant="secondary" size="lg">
                  Ver proyectos
                </Button>
              </div>

              <p className="mt-8 text-xs text-text-muted">{'// exit code: 404'}</p>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
