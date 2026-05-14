import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { AnimationProvider } from '@/components/providers/AnimationProvider';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://jmsilva.dev'),
  title: {
    default: 'Juan Manuel Silva — Full Stack Dev & Security Researcher',
    template: '%s | jmsilva.dev',
  },
  description:
    'Portfolio de Juan Manuel Silva. Full Stack Developer, IA Engineer y estudiante de Ciberseguridad desde Las Breñas, Chaco, Argentina.',
  keywords: [
    'Full Stack Developer',
    'IA Engineer',
    'Ciberseguridad',
    'Next.js',
    'TypeScript',
    'Python',
    'Security Researcher',
    'Red Team',
    'Argentina',
  ],
  authors: [{ name: 'Juan Manuel Silva', url: 'https://jmsilva.dev' }],
  creator: 'Juan Manuel Silva',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://jmsilva.dev',
    siteName: 'jmsilva.dev',
    title: 'Juan Manuel Silva — Full Stack Dev & Security Researcher',
    description:
      'Full Stack Developer, IA Engineer y estudiante de Ciberseguridad desde Las Breñas, Chaco, Argentina.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Juan Manuel Silva — jmsilva.dev',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Juan Manuel Silva — Full Stack Dev & Security Researcher',
    description:
      'Full Stack Developer, IA Engineer y estudiante de Ciberseguridad desde Las Breñas, Chaco, Argentina.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://jmsilva.dev',
  },
  icons: {
    icon: '/hacker.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='es' suppressHydrationWarning>
      <head>
        <meta
          name='description'
          content='Portfolio de Juan Manuel Silva. Full Stack Developer, IA Engineer y estudiante de Ciberseguridad desde Las Breñas, Chaco, Argentina.'
        />
      </head>
      <body>
        <SmoothScrollProvider>
          <AnimationProvider>{children}</AnimationProvider>
        </SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  );
}
