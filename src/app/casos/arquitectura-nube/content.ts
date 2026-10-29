import type { CaseStudy } from '@/types/case-study'

// Contenido del caso de estudio. Fuente: el proyecto integrador de la materia
// Seguridad en la Nube y Protección de Datos (TECLAB, 2026), entregado y aprobado.
export const CASO_NUBE: CaseStudy = {
  slug: 'arquitectura-nube',
  kicker: 'Caso de estudio · Cloud Security',
  title: 'Arquitectura de datos segura en la nube para una empresa de productos digitales',
  description:
    'Diseño de punta a punta de una migración a AWS: arquitectura, seguridad de red, gestión de riesgos, auditoría, DevSecOps y privacidad de datos.',
  lead:
    'Diseñé de punta a punta la migración a AWS de una empresa con datos dispersos, sistemas aislados y demanda creciente: arquitectura, seguridad de red, gestión de riesgos, auditoría, DevSecOps y privacidad de datos.',
  chips: ['Rol: Cloud Architect', 'AWS', 'Seguridad por diseño', 'Ley 25.326 · GDPR'],
  academicNote:
    'Proyecto académico · Tecnicatura Superior en Seguridad Informática (TECLAB) · 2026',

  sections: [
    { id: 'problema', nav: 'Problema', eyebrow: '01 · Contexto', title: 'El problema' },
    { id: 'solucion', nav: 'Solución', eyebrow: '02 · Diseño', title: 'La solución' },
    { id: 'seguridad', nav: 'Seguridad', eyebrow: '03 · Riesgos', title: 'Gestión de riesgos y auditoría' },
    { id: 'devsecops', nav: 'DevSecOps', eyebrow: '04 · Automatización', title: 'Pipeline DevSecOps' },
    { id: 'privacidad', nav: 'Privacidad', eyebrow: '05 · Datos personales', title: 'Privacidad y gobierno de datos' },
    { id: 'resultados', nav: 'Resultados', eyebrow: '06 · Entregables', title: 'Resultados del diseño' },
    { id: 'stack', nav: 'Stack', eyebrow: '07 · Herramientas', title: 'Stack y conceptos aplicados' },
    { id: 'documentos', nav: 'Documentos', eyebrow: '08 · Documentación', title: 'Documentos completos' },
  ],

  problem: {
    intro:
      'La empresa (caso Tech Consulting) generaba mucha información pero no podía aprovecharla ni protegerla. El diagnóstico inicial detectó cinco problemas concretos:',
    items: [
      { label: 'P1', title: 'Excel como fuente de datos', text: 'Cada persona calculaba sus métricas con criterios propios. No existía una única versión de la verdad.' },
      { label: 'P2', title: '3 bases SQL Server aisladas', text: 'Sistemas transaccionales on-premise, sin integración ni recuperación ante desastres.' },
      { label: 'P3', title: 'Eventos en tiempo real perdidos', text: 'Los microservicios generaban datos de uso que nadie capturaba.' },
      { label: 'P4', title: 'Datos fuera de todo sistema', text: 'Listados de tiendas y categorías sin dueño ni control de versiones.' },
      { label: 'P5', title: 'Sin escalabilidad', text: 'Infraestructura fija frente a una demanda creciente de productos digitales.' },
    ],
  },

  solution: {
    intro:
      'Propuse una arquitectura en AWS organizada en capas con responsabilidades separadas, con alta disponibilidad en dos zonas y la seguridad integrada desde la primera fase.',
    diagramCaption: 'Arquitectura simplificada. La seguridad es transversal a todas las capas.',
    decisions: [
      { label: 'Decisión', title: 'PaaS gestionado antes que servidores propios', text: 'RDS, Glue, Kinesis y Fargate trasladan parches, backups y alta disponibilidad al proveedor, y el equipo se concentra en los datos.' },
      { label: 'Decisión', title: 'Replatform para SQL Server, refactor para analítica', text: 'Los 3 sistemas se migran a RDS sin reescribirlos; los datos analíticos se rediseñan como data lake por zonas.' },
      { label: 'Decisión', title: 'Red en 3 capas con grupos de seguridad encadenados', text: 'Solo el balanceador queda expuesto a Internet. Cada capa acepta tráfico únicamente de la anterior.' },
      { label: 'Decisión', title: 'Seguridad antes que datos', text: 'La fase de fundaciones (IAM, MFA, cifrado, auditoría) va antes de mover un solo registro.' },
    ],
  },

  security: {
    intro:
      'Evalué 10 riesgos con la fórmula Riesgo = Probabilidad × Impacto y definí una estrategia para cada uno. Los riesgos altos estaban todos del lado del cliente en el modelo de responsabilidad compartida.',
    risks: [
      { risk: 'Configuración incorrecta que expone datos', level: 'alto', control: 'Infraestructura como código revisada + AWS Config + Security Hub' },
      { risk: 'Credenciales comprometidas', level: 'alto', control: 'MFA, mínimo privilegio, roles temporales, GuardDuty' },
      { risk: 'Ransomware', level: 'alto', control: 'Backups inmutables en cuenta separada + pruebas de restauración' },
      { risk: 'Imagen de contenedor vulnerable', level: 'alto', control: 'Escaneo en el pipeline y en ECR' },
      { risk: 'Punto único de fallo', level: 'medio', control: 'Redundancia Multi-AZ en todas las capas' },
    ],
    audit: [
      { label: 'Auditoría', title: 'Plan de 5 tipos', text: 'Web, código fuente, redes, infraestructura y forense, con herramientas y frecuencia definidas.' },
      { label: 'Registros', title: 'Logs inmutables', text: 'CloudTrail, Flow Logs y auditoría de SQL Server en una cuenta aislada con Object Lock.' },
      { label: 'Monitoreo', title: 'Activo + pasivo', text: 'Alarmas en tiempo real y análisis periódicos para detectar amenazas internas y externas.' },
    ],
  },

  devsecops: {
    intro:
      'Diseñé un circuito de entrega continua con controles de seguridad automáticos en cada cambio, contenedores versionados e infraestructura inmutable.',
    stages: [
      { label: '1–2', title: 'Código y build', text: 'Revisión entre pares y build de la imagen Docker desde una base aprobada.' },
      { label: '3–4', title: 'Pruebas y escaneo', text: 'Tests, análisis estático, dependencias, secretos e imágenes.' },
      { label: '5–6', title: 'Staging y aprobación', text: 'Entorno idéntico a producción y aprobación humana registrada.' },
      { label: '7–8', title: 'Producción y operación', text: 'Despliegue blue/green con rollback automático y monitoreo continuo.' },
    ],
  },

  privacy: {
    items: [
      { title: 'Política de privacidad (14 cláusulas)', text: 'Alineada con la Ley 25.326 y buenas prácticas del GDPR: finalidades, derechos de los titulares, transferencias internacionales y notificación de brechas en 72 h.' },
      { title: 'Rol de DPO y matriz RACI', text: 'Funciones del Data Protection Officer y responsabilidades repartidas entre DPO, CIO, CSO, CDIO, CTO y Cloud Architect.' },
      { title: 'DLP en 3 niveles', text: 'Prevención de fuga de datos en red, almacenamiento (Amazon Macie) y estaciones de trabajo.' },
      { title: 'Amenazas insider y outsider', text: 'Escenarios de ataque interno y externo durante la migración, con controles para cada uno.' },
    ],
  },

  results: {
    stats: [
      { value: '63', label: 'páginas en el plan integrado (4 documentos técnicos)' },
      { value: '10', label: 'riesgos evaluados con matriz y plan de tratamiento' },
      { value: '5', label: 'fases de migración en un cronograma de 9 meses' },
      { value: '3 × 2', label: 'capas de red × zonas de disponibilidad' },
    ],
    learnings: [
      'Migrar a la nube no traslada la responsabilidad sobre los datos: identidades, configuración y datos siempre son del cliente.',
      'La seguridad funciona mejor como fase inicial del proyecto que como revisión final.',
      'Automatizar controles en el pipeline reduce más riesgos que cualquier revisión manual.',
      'El problema de fondo suele ser de gobierno de datos, no de tecnología.',
    ],
  },

  stack: {
    services: [
      'Amazon VPC', 'EC2 / Auto Scaling', 'ECS Fargate', 'RDS SQL Server', 'S3 Data Lake', 'AWS DMS',
      'Kinesis', 'Glue · Redshift · Athena', 'IAM · KMS', 'CloudTrail · CloudWatch',
      'GuardDuty · Config · Security Hub', 'Macie',
    ],
    concepts: [
      'Tríada CIA', 'Responsabilidad compartida', 'RBAC · MFA', 'Modelado de amenazas', 'Matriz de riesgos',
      'Well-Architected Framework', 'Docker · Kubernetes', 'CI/CD · DevSecOps', 'Infraestructura inmutable',
      'DLP', 'Ley 25.326 · GDPR',
    ],
  },

  documents: [
    {
      label: 'Plan completo',
      title: 'Proyecto integrador: plan de migración segura a la nube',
      description: 'Las cuatro partes en un único documento, con resumen ejecutivo, conclusión y referencias.',
      href: '/pdf/Proyecto_Integrador_Seguridad_Nube_Juan_Manuel_Silva.pdf',
      pages: 63,
      featured: true,
    },
    { label: 'Parte 1', title: 'Problemática y plan de migración', description: 'Diagnóstico, objetivos y arquitectura objetivo', href: '/pdf/TP1_Seguridad_Nube_Juan_Manuel_Silva.pdf', pages: 17 },
    { label: 'Parte 2', title: 'Infraestructura y monitoreo', description: 'VPC, cómputo, almacenamiento y bases de datos', href: '/pdf/TP2_Seguridad_Nube_Juan_Manuel_Silva.pdf', pages: 17 },
    { label: 'Parte 3', title: 'Riesgos, auditoría y DevOps', description: 'Matriz de riesgos, auditoría y pipeline', href: '/pdf/TP3_Seguridad_Nube_Juan_Manuel_Silva.pdf', pages: 16 },
    { label: 'Parte 4', title: 'Privacidad, DPO y ataques', description: 'Política de privacidad, DLP y cronograma', href: '/pdf/TP4_Seguridad_Nube_Juan_Manuel_Silva.pdf', pages: 17 },
  ],

  quote: 'En la nube, la seguridad es compartida, pero la responsabilidad sobre los datos personales nunca se delega.',
}
