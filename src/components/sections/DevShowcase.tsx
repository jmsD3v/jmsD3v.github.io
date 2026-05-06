'use client';

import { m, AnimatePresence } from 'framer-motion';
import { FeatureShowcase } from '@/components/feature-showcase';
import { useProject } from '@/contexts/ProjectContext';
import type { FeatureShowcaseProps } from '@/types/showcase';

const DEFAULT: FeatureShowcaseProps = {
  eyebrow: 'Full Stack',
  title: 'jms-folio',
  description:
    'Portfolio multi-perfil con animaciones de scroll intensas y proyectos auto-actualizados desde GitHub API.',
  stats: ['Next.js 15', 'TypeScript', 'Tailwind v4', 'GSAP', 'Framer Motion'],
  steps: [
    {
      id: 'stack',
      title: 'Stack moderno',
      text: 'Next.js 15 App Router, Tailwind v4 con design tokens CSS, animaciones con GSAP ScrollTrigger + Framer Motion.',
    },
    {
      id: 'data',
      title: 'Datos live desde GitHub',
      text: 'Server Components + ISR: los proyectos se actualizan solos cada hora sin deploy.',
    },
    {
      id: 'anim',
      title: 'Animaciones de alta calidad',
      text: 'Lenis smooth scroll, TextScramble, lluvia de caracteres y transición Dev→Hacker con GSAP.',
    },
  ],
  tabs: [
    {
      value: 'desktop',
      label: 'Desktop',
      src: '/projects/jms-folio-desktop.png',
    },
    { value: 'mobile', label: 'Mobile', src: '/projects/jms-folio-mobile.png' },
  ],
  ctaPrimary: {
    label: 'Ver en GitHub',
    href: 'https://github.com/jmsD3v/jms-folio',
  },
};

const PROJECT_PREVIEW_TABS: Record<string, FeatureShowcaseProps['tabs']> = {
  tecnoinstalador: [
    {
      value: 'desktop',
      label: 'Desktop',
      src: '/projects/tecnoinstalador-desktop.png',
      alt: 'tecnoinstalador desktop',
    },
    {
      value: 'mobile',
      label: 'Mobile',
      src: '/projects/tecnoinstalador-mobile.png',
      alt: 'tecnoinstalador mobile',
    },
  ],
};

function repoToShowcase(
  p: ReturnType<typeof useProject>['selected'],
): FeatureShowcaseProps {
  if (!p) return DEFAULT;

  const repoKey = p.name.toLowerCase();
  const tabs = PROJECT_PREVIEW_TABS[repoKey] ?? [
    {
      value: 'preview',
      label: 'Preview',
      src: `/projects/${p.name}.png`,
      alt: p.name,
    },
  ];

  return {
    eyebrow: p.category === 'hacker' ? 'Ciberseguridad' : 'Full Stack',
    title: p.name,
    description: p.description ?? undefined,
    stats: [
      ...(p.language ? [p.language] : []),
      ...p.topics.filter(
        (t) =>
          !['dev', 'hacker', 'frontend', 'backend', 'fullstack'].includes(t),
      ),
    ],
    steps: [
      ...(p.language
        ? [
            {
              id: 'lang',
              title: `Lenguaje: ${p.language}`,
              text: `Proyecto construido principalmente en ${p.language}.`,
            },
          ]
        : []),
      ...(p.topics.length > 0
        ? [
            {
              id: 'topics',
              title: 'Tecnologías',
              text: p.topics.join(' · '),
            },
          ]
        : []),
      ...(p.stargazers_count > 0
        ? [
            {
              id: 'stars',
              title: `★ ${p.stargazers_count} stars`,
              text: 'Proyecto valorado por la comunidad en GitHub.',
            },
          ]
        : []),
    ],
    tabs,
    ctaPrimary: { label: 'Ver en GitHub', href: p.html_url },
    ...(p.homepage
      ? { ctaSecondary: { label: 'Ver live →', href: p.homepage } }
      : {}),
  };
}

export function DevShowcase() {
  const { selected } = useProject();
  const props = repoToShowcase(selected);

  return (
    <AnimatePresence mode='wait'>
      <m.div
        key={selected?.id ?? 'default'}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <FeatureShowcase {...props} />
      </m.div>
    </AnimatePresence>
  );
}
