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
        name: 'To-do List',
        image: '/mockup-to-do.png',
        type: 'mobile',
        project_technologies: ['HTML5', 'CSS3', 'Javascript'],
        description:
            'A simple to-do list system where the client can add, search, filter, edit, and delete tasks. Tasks can also be marked as completed.',
        deploy: '',
        github: '',
    },
    {
        id: 3,
        name: 'Weather App',
        image: '/mockup-clima.png',
        type: 'mobile',
        project_technologies: ['HTML5', 'CSS3', 'Javascript'],
        description:
            "A system capable of providing real-time weather information for any city in the world. Simply type the city's name, and details like temperature and wind will appear.",
        deploy: '',
        github: '',
    },
    {
        id: 4,
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
        id: 5,
        name: 'Landing Page HEXA Servicios Integrales SAS',
        image: '/HexaLanding.png',
        type: 'web',
        project_technologies: ['Next.js', 'Tailwind CSS', 'React', 'Node.js'],
        description: 'Sitio institucional para empresa de ingeniería y proyectos. Maquetación modular, optimización de carga y presentación profesional de servicios técnicos.',
        deploy: 'https://hexaservicios.com/',
        github: null,
    },
];
