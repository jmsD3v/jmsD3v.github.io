import type { Metadata } from 'next'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { AnimationProvider } from '@/components/providers/AnimationProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Juan Manuel Silva — Full Stack Dev & IA Engineer',
  description:
    'Portfolio de Juan Manuel Silva. Full Stack Developer, IA Engineer y estudiante de Ciberseguridad desde Las Breñas, Chaco, Argentina.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <SmoothScrollProvider>
          <AnimationProvider>
            {children}
          </AnimationProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
