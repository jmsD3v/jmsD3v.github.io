'use client';

import { m, AnimatePresence } from 'framer-motion';
import { FeatureShowcase } from '@/components/feature-showcase';
import { useProject } from '@/contexts/ProjectContext';
import type { FeatureShowcaseProps } from '@/types/showcase';

const GITHUB_OWNER = 'jmsD3v';

// Repos con una vista previa guardada en /public/projects/<repo>.png (la tarjeta que GitHub genera para cada
// repo, descargada una vez: cargan rápido y no dependen de un servicio externo). Cualquier repo nuevo que no
// esté acá usa la tarjeta de GitHub en vivo, así nunca queda una imagen rota.
const STATIC_PREVIEWS = new Set(
  [
    'booked-easy', 'rapidito-pedidos', 'racket-rally-zone', 'stock-pro-guru', 'pocket-finances', 'argos-landing',
    'CvMaker', 'Phone-Store-Landing', 'hexa-gestion', 'PyMp3', 'HEXA-LandingPage', 'cyberpyme',
    'ai-agent-security-lab', 'pcapforge', 'malwarescope', 'dfirauto', 'honeygrid', 'threatfeed', 'soclite',
    'phishsim', 'webhunter', 'reconai',
  ].map((n) => n.toLowerCase()),
);

const JMS_FOLIO: FeatureShowcaseProps = {
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
      text: 'Lenis smooth scroll, TextScramble, lluvia de caracteres y transición Dev→Cybersecurity con GSAP.',
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

// Proyecto destacado: el cruce entre 25 años de electricista, desarrollo y seguridad. El código es privado;
// el repo público (solar-ot-lab-showcase) muestra el trabajo. Las cifras salen del proyecto real.
const SOLAR_OT_LAB: FeatureShowcaseProps = {
  eyebrow: 'OT · Infraestructura crítica',
  title: 'solar-ot-lab',
  description:
    'Mini-SCADA de laboratorio de un parque solar de 40 MW, inspirado en La Corzuela (Pinedo, Chaco): agentes de campo, gateway y dashboard en tiempo real. Los equipos son simulados; los protocolos, reales (Modbus TCP e IEC 60870-5-104).',
  stats: ['SCADA', 'Modbus TCP', 'IEC 60870-5-104', 'Python', 'FastAPI', 'React', 'Docker'],
  steps: [
    {
      id: 'scope',
      title: 'Qué simula',
      text: '150 inversores y 450 trackers en 6 bloques, estación transformadora 132/34,5 kV, controlador de planta en lazo cerrado y una estación meteorológica con días despejados, nublados y de lluvia.',
    },
    {
      id: 'scada',
      title: 'Qué hace como SCADA',
      text: 'Adquisición por agentes de campo, HMI con drill-down planta → bloque → inversor por WebSocket, alarmas ISA-18.2, historial, comandos y consignas de planta, y secuencia de eventos con la hora del equipo en milisegundos.',
    },
    {
      id: 'security',
      title: 'Seguridad por diseño',
      text: 'Redes segmentadas (OT / DMZ / IT), contenedores endurecidos, permisos por rol, token propio por agente y MQTT con TLS.',
    },
    {
      id: 'honest',
      title: 'Alcance, sin vueltas',
      text: '390 tests y 8 decisiones de diseño documentadas. No es un SCADA comercial: no se probó con inversores reales ni tiene certificaciones. El código es privado; este repo muestra el proyecto.',
    },
  ],
  tabs: [
    {
      value: 'desktop',
      label: 'Desktop',
      src: '/projects/solar-ot-lab-showcase-desktop.png',
      alt: 'solar-ot-lab: vista general del parque en escritorio',
    },
    {
      value: 'mobile',
      label: 'Mobile',
      src: '/projects/solar-ot-lab-showcase-mobile.jpg',
      alt: 'solar-ot-lab: el dashboard en el celular',
    },
  ],
  ctaPrimary: {
    label: 'Ver el proyecto',
    href: 'https://github.com/jmsD3v/solar-ot-lab-showcase',
  },
};

const DEFAULT: FeatureShowcaseProps = SOLAR_OT_LAB;

// Repos con una ficha escrita a mano (el resto se arma solo desde la API de GitHub).
const PROJECT_OVERRIDES: Record<string, FeatureShowcaseProps> = {
  'solar-ot-lab-showcase': SOLAR_OT_LAB,
  'jms-folio': JMS_FOLIO,
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

  const override = PROJECT_OVERRIDES[p.name.toLowerCase()];
  if (override) return override;

  const repoKey = p.name.toLowerCase();
  // Sin capturas propias, la vista previa es la tarjeta que GitHub genera para cada repo público (ver STATIC_PREVIEWS).
  const tabs = PROJECT_PREVIEW_TABS[repoKey] ?? [
    {
      value: 'preview',
      label: 'Preview',
      src: STATIC_PREVIEWS.has(repoKey)
        ? `/projects/${p.name}.png`
        : `https://opengraph.githubassets.com/1/${GITHUB_OWNER}/${p.name}`,
      alt: `${p.name}: vista previa del repositorio en GitHub`,
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
