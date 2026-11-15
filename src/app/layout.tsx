import type { Metadata } from 'next';
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

// Datos estructurados (schema.org): ayudan a buscadores a asociar el sitio con la persona.
const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Juan Manuel Silva',
  alternateName: 'jmsDev',
  url: 'https://jmsilva.dev',
  image: 'https://jmsilva.dev/og-image.png',
  jobTitle: 'Analista en Ciberseguridad · Full Stack & Python Security Developer',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Las Breñas',
    addressRegion: 'Chaco',
    addressCountry: 'AR',
  },
  knowsAbout: [
    'Ciberseguridad',
    'Pentesting',
    'Next.js',
    'TypeScript',
    'Python',
    'Industria 4.0',
    'Ciberseguridad industrial',
  ],
  sameAs: [
    'https://github.com/jmsD3v',
    'https://www.linkedin.com/in/jmsilva83',
    'https://www.credly.com/users/juan-manuel-silva.be4a3ff2',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='es' suppressHydrationWarning>
      <body>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
        <SmoothScrollProvider>
          <AnimationProvider>{children}</AnimationProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
