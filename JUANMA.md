1. Perfil Profesional

Nombre: Juan Manuel Silva (preferido: Juanma)  
Ubicación: Las Breñas, Chaco, Argentina  

Roles:  
- Full Stack Developer (JS/TS + Python)  
- IA Engineer  
- Oficial Eléctrico Especializado (domiciliaria e industrial)  
- Instalador Starlink y cámaras WiFi Ezviz  
- Estudiante de Seguridad Informática (TECLAB)  
- Estudiante de Licenciatura en Ciberdefensa (UNDEF)  
- Formación en Google Cybersecurity Certificate V2  
- Industria 4.0: programación PLC con Python (Ingelearn)

Intereses actuales:  
- Ciberseguridad ofensiva, pentesting, entrevistas técnicas  
- Industria 4.0 y automatización industrial  
- Prompt engineering para documentos legales y técnicos  
- Optimización de workflow y comunicación con clientes  

Conocimientos a reforzar:  
- Python, Linux, SQL  
- NIST CSF, seguridad de red  
- SIEM (Splunk), Wireshark  
- TCP/IP y OSI  
- Método STAR, pensamiento en voz alta, fundamentos sólidos  

---

2. Stack Técnico Oficial

- Next.js (preferido) o Astro  
- TypeScript  
- Tailwind CSS  
- Supabase (Auth + PostgreSQL)  
- pnpm como package manager  
- Arquitectura modular  
- Carpeta obligatoria: /types  
- Mobile-first, PWA, escalable  
- Código limpio, moderno, mantenible  

---

3. Footer Obligatorio

Debe aparecer en todos los proyectos:

`txt
Copyright © 2025 Desarrollado desde Las Breñas con 💜 por @jmsDev All rights reserved
`

- @jmsDev → https://www.linkedin.com/in/jmsilva83

---

4. Preferencias de Comunicación

Estilo general
- Ultra directo  
- Accionable  
- Sin divagues  
- Sin explicaciones básicas  
- Contenido listo para copiar/pegar  
- Si falta info: pedir solo lo mínimo indispensable  
- No repetir preguntas ya respondidas  
- No mezclar rubros en presupuestos  

Con clientes
- Tono cálido, humano, claro  
- Sin jerga técnica innecesaria  

---

5. Principios de Ingeniería (Versión Oficial)

Principios Fundamentales
- DRY  
- KISS  
- YAGNI  
- Separation of Concerns  
- Single Responsibility Principle  
- Security by Design  
- Least Privilege  
- Fail Fast  
- Idempotencia  
- Convention Over Configuration  

Principios de Arquitectura
- High Cohesion  
- Low Coupling  
- Dependency Inversion  
- Open/Closed  
- Liskov  
- Interface Segregation  
- 12-Factor App  
- Design for Failure  
- Observability First  
- Scalability by Design  
- Eventual Consistency  
- Backpressure & Rate Limiting  

Principios de Diseño de Sistemas
- ADRs (documentar decisiones)  
- Boundaries explícitos  
- Contratos claros entre módulos  
- Arquitectura evolutiva  
- Evitar sobre-ingeniería  
- Simplicidad operativa  

---

6. Reglas de Arquitectura (Actualizadas)

1. Claude NO debe inventar arquitectura.  
   Debe analizar el proyecto real.

2. Claude NO debe imponer patrones.  
   No forzar Clean, Hexagonal, Onion, etc.

3. Modificar README existente, nunca reemplazarlo.

4. Completar /docs/ARCHITECTURE.md con:  
   - patrón detectado  
   - módulos  
   - flujos  
   - decisiones técnicas  
   - riesgos  
   - principios aplicados  

5. Aplicar siempre tus principios de ingeniería.

6. Evitar sobre-ingeniería.

7. Incluir Python cuando corresponda (Industria 4.0).

---

7. Supabase + RLS (Reglas Fijas)

Tablas base (adaptables)
- users (id, email, name)  
- posts (id, userid, title, content, createdat)  
- comments (id, postid, userid, content)

Reglas obligatorias
- Activar RLS en todas las tablas  
- Políticas separadas por operación (SELECT/INSERT/UPDATE/DELETE)  
- Usar auth.uid()  
- Nunca usar user_metadata  
- Índices en user_id  
- Incluir:
  - SQL completo listo para pegar  
  - Ejemplos de pruebas con Supabase JS SDK  

---

8. PRD — Estructura Oficial (13 puntos)

1. Resumen ejecutivo  
2. Problema y oportunidad  
3. Perfil de usuario (ICP)  
4. Objetivos del producto  
5. Alcance v1 (in/out scope)  
6. Requisitos funcionales  
7. Requisitos no funcionales  
8. Arquitectura sugerida  
9. User stories  
10. Criterios de aceptación  
11. KPIs  
12. Riesgos y supuestos  
13. Plan por fases (MVP → v1 → v2)  

Entrega:  
- En español  
- En Markdown  
- Concreto  
- Sin relleno  
- Checklist final  
- Si falta info: hacer supuestos explícitos  

---

9. Framework “Construye con Estructura”

Fase 1 — Descubrimiento
- Preguntar lo necesario  
- Cuestionar supuestos débiles  
- Separar crítico vs. futuro  
- Reducir alcance si es necesario  

Fase 2 — Planeación
- Definir exactamente v1  
- Enfoque técnico simple  
- Complejidad: baja / media / alta  
- Dependencias  
- Bosquejo funcional  

Fase 3 — Construcción
- Etapas visibles  
- Explicar qué y por qué  
- Probar antes de avanzar  
- Validar decisiones  
- Ofrecer opciones ante bloqueos  

Fase 4 — Pulido
- Estándar de producto real  
- Manejo de errores  
- UX desktop + mobile  
- Detalles finales  

Fase 5 — Entrega
- Deploy si aplica  
- Instrucciones de uso, mantenimiento y modificación  
- Documentar decisiones  
- Mejoras para v2  

Formato obligatorio de respuesta
1. Diagnóstico inicial  
2. Plan de v1  
3. Enfoque técnico  
4. Construcción por etapas  
5. Dependencias y decisiones  
6. Validación y pruebas  
7. Plan de entrega + v2