import { ProjectType } from '@/types/projectType';

export const Project: ProjectType[] = [
  {
    id: 1,
    name: 'MatrixCodeJS-Rain',
    image: '/mockup-matrixcodejs.png',
    type: 'web',
    project_technologies: ['HTML5', 'CSS3', 'JavaScript', 'Vite', 'React'],
    description:
      'MatrixCodeJS is a dynamic web application that recreates the iconic Matrix rain effect. Built with Vite and React, it delivers a high-performance animation using HTML Canvas, optimized for responsiveness and smooth frame rates.',
    deploy: 'https://matrix-code-js-jms83.vercel.app/',
    github: 'https://github.com/jmSilva83/MatrixCodeJS.git',
  },
  {
    id: 2,
    name: 'AdoptMe REST API',
    image: '/mockup-adoptme.png',
    type: 'api',
    project_technologies: [
      'Node.js',
      'Express',
      'MongoDB',
      'Docker',
      'Swagger',
      'Mocha',
      'Chai',
      'Supertest',
    ],
    description:
      'AdoptMe es una API REST robusta para gestionar usuarios, mascotas y adopciones. Documentada con Swagger y probada con Mocha, Chai y Supertest, esta API forma parte del backend de una plataforma de adopción de mascotas. Contiene endpoints seguros, lógica modular y fue dockerizada para despliegues eficientes.',
    deploy: 'https://adoptme-production-22e6.up.railway.app/',
    github: 'https://github.com/jmSilva83/AdoptMe.git',
  },
  {
    id: 3,
    name: 'Landing Page HEXA Servicios Integrales SAS',
    image: '/HexaLanding.png',
    type: 'web',
    project_technologies: ['Next.js', 'TailwindCSS', 'React', 'Node.js'],
    description:
      'Sitio institucional para empresa de ingeniería y proyectos. Maquetación modular, optimización de carga y presentación profesional de servicios técnicos.',
    deploy: 'https://hexaservicios.com/',
    github: null,
  },
  {
    id: 4,
    name: 'Coopagua Front',
    image: '/Coopagua.png',
    type: 'web',
    project_technologies: ['Next.js', 'React', 'Vercel', 'TailwindCSS'],
    description:
      'Interfaz web para Coopagua, con énfasis en usabilidad y accesibilidad.',
    deploy: 'https://coopagua-front.vercel.app/',
    github: null,
  },
  {
    id: 5,
    name: 'Escrutinio App',
    image: '/Escrutinio.png',
    type: 'web',
    project_technologies: ['Next.js', 'React', 'Vercel', 'TailwindCSS'],
    description:
      'Aplicación de escrutinio con presentación de resultados y visualizaciones en tiempo real.',
    deploy: 'https://escrutinio-app.vercel.app/',
    github: null,
  },
  {
    id: 6,
    name: 'Rapidito Pedidos',
    image: '/Rapidito.png',
    type: 'web',
    project_technologies: ['Next.js', 'React', 'Vercel', 'TailwindCSS'],
    description:
      'Plataforma de pedidos en línea optimizada para entregas rápidas.',
    deploy: 'https://rapidito-pedidos.vercel.app/',
    github: null,
  },
  {
    id: 7,
    name: 'Racket Rally Zone',
    image: '/Racket.png',
    type: 'web',
    project_technologies: ['Next.js', 'React', 'Vercel', 'TailwindCSS'],
    description:
      'Sitio de torneo y resultados para jugadores de raqueta, con gestión de eventos.',
    deploy: 'https://racket-rally-zone.vercel.app/',
    github: null,
  },
  {
    id: 8,
    name: 'Stock Pro Guru',
    image: '/Stock.png',
    type: 'web',
    project_technologies: ['Next.js', 'React', 'Vercel', 'TailwindCSS'],
    description:
      'Herramienta web para gestión avanzada de inventarios y reportes.',
    deploy: 'https://stock-pro-guru.vercel.app/',
    github: null,
  },
];
