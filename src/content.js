// Todo el texto del sitio vive aquí, en inglés (por defecto) y en español.
import { pick } from './i18n.js';

const base = {
  name: 'Omar Reyes',
  fullName: 'Omar Albares Reyes',
  nickname: 'Mick',
  email: 'mick967@hotmail.com',
  github: 'https://github.com/MickSenpai',
  linkedin: 'https://www.linkedin.com/in/omar-albares-reyes-471677201/',
};

export const person = {
  ...base,
  ...pick({
    en: { role: 'Cross‑platform software developer · Applied AI', location: 'Tijuana, B.C., Mexico', cv: `${import.meta.env.BASE_URL}cv/Omar_Reyes_Resume.pdf` },
    es: { role: 'Desarrollador de software multiplataforma · IA aplicada', location: 'Tijuana, B.C., México', cv: `${import.meta.env.BASE_URL}cv/Omar_Reyes_CV.pdf` },
  }),
};

export const about = pick({
  en: {
    text:
      'Cross‑platform software developer with 4+ years of IT experience, working with Python, PHP/Laravel, Rust and Flutter. ' +
      'I specialize in AI agents (tool calling, RAG, hybrid search and persistent memory), Offline‑First architectures ' +
      'and real‑time sync, with a focus on reliability, automated testing and user experience. I enjoy the kind of problems ' +
      'that, like a Rubik’s cube, are solved with method and patience.',
    interests: ['Rubik’s cube', 'Coffee', 'Music', 'Anime', 'Applied AI'],
  },
  es: {
    text:
      'Desarrollador de software multiplataforma con más de 4 años de experiencia en TI, empleando Python, PHP/Laravel, Rust y Flutter. ' +
      'Me especializo en agentes de IA (tool calling, RAG, búsqueda híbrida y memoria persistente), arquitecturas Offline‑First ' +
      'y sincronización en tiempo real, con foco en la fiabilidad, las pruebas automatizadas y la experiencia de usuario. ' +
      'Disfruto los problemas que, como un cubo de Rubik, se resuelven con método y paciencia.',
    interests: ['Cubo de Rubik', 'Café', 'Música', 'Anime', 'IA aplicada'],
  },
});

const otherStack = ['Python', 'Django', 'PostgreSQL', 'Flutter', 'Render'];

export const career = pick({
  en: {
    experience: [
      {
        role: 'AI & Full‑Stack Developer Intern',
        org: 'Enteracloud MX',
        period: 'Sep 2026 — Present',
        text: 'CosechIA: built the «Vini» AI agent from scratch, with hybrid‑search RAG and a 50+ table data model.',
      },
      {
        role: 'Service Desk Analyst',
        org: 'Antlia Systems',
        period: 'Jan 2023 — Present',
        text: 'Technical incident management, upkeep of the internal knowledge base and process improvement; built Autum so no ticket goes unattended.',
      },
    ],
    education: {
      role: 'Associate Degree (TSU) in Cross‑Platform Software Development',
      org: 'Universidad Tecnológica de Tijuana (UTT)',
      period: 'Sep 2024 — Dec 2026 (expected)',
    },
    languages: [
      ['Spanish', 'Native'],
      ['English', 'C1, Advanced'],
    ],
    other: {
      name: 'Laboratory Management System',
      text: 'Django API and web dashboard with a Flutter mobile app; refactored the codebase, optimized database queries and redesigned the web UI.',
      stack: otherStack,
    },
  },
  es: {
    experience: [
      {
        role: 'Desarrollador de IA y Full‑Stack (Estadía)',
        org: 'Enteracloud MX',
        period: 'Sep 2026 — Presente',
        text: 'CosechIA: desarrollo desde cero del agente de IA «Vini», con RAG de búsqueda híbrida y un modelo de datos de 50+ tablas.',
      },
      {
        role: 'Service Desk',
        org: 'Antlia Systems',
        period: 'Ene 2023 — Presente',
        text: 'Gestión de incidentes técnicos, mantenimiento de la base de conocimiento interna y mejora de procesos; autor de Autum para que ningún ticket quede sin atender.',
      },
    ],
    education: {
      role: 'TSU en Desarrollo de Software Multiplataforma',
      org: 'Universidad Tecnológica de Tijuana (UTT)',
      period: 'Sep 2024 — Dic 2026 (en estadías)',
    },
    languages: [
      ['Español', 'Nativo'],
      ['Inglés', 'C1 Avanzado'],
    ],
    other: {
      name: 'Sistema de Gestión de Laboratorios',
      text: 'API y panel web en Django con app móvil en Flutter; reestructuración de código, optimización de consultas y rediseño de la UI web.',
      stack: otherStack,
    },
  },
});

// Lo que no cambia con el idioma. formation: forma del cubo mientras se presenta el proyecto (three/cube.js)
const projectBase = {
  meido: { name: 'M.E.I.D.O', mono: 'M', year: '2025', stack: ['Python', 'PyQt6', 'GTK', 'Convex', 'Whisper', 'XTTS-v2'], repo: 'https://github.com/MickSenpai/M.E.I.D.O', formation: 'explode' },
  'meido-movil': { mono: 'MM', year: '2026', stack: ['Flutter', 'Dart', 'Convex', 'Android'], repo: 'https://github.com/MickSenpai/meido_movil', formation: 'phone' },
  mitpad: { name: 'Mitpad', mono: 'Mp', year: '2026', stack: ['SvelteKit', 'TypeScript', 'Convex', 'MCP', 'Three.js'], repo: 'https://github.com/MickSenpai/Mitpad', formation: 'sheet' },
  rigm: { name: 'RigM', mono: 'R', year: '2026', stack: ['Python', 'PyQt6', 'Three.js', 'Blender', 'SAM 2'], repo: 'https://github.com/MickSenpai/RigM', formation: 'wall' },
  autum: {
    name: 'Autum',
    subtitle: 'Automated Ticket Utility Manager',
    logo: `${import.meta.env.BASE_URL}logos/autum.svg`,
    year: '2026',
    stack: ['Node.js', 'Playwright', 'Telegram Bot API', 'Tauri', 'Rust', 'PostgreSQL'],
    repo: 'https://github.com/MickSenpai/autum',
    formation: 'leaves',
  },
  cosechia: { name: 'CosechIA', mono: 'C', year: '2026', stack: ['PHP', 'Laravel', 'Vue', 'Inertia', 'PostgreSQL', 'pgvector', 'Tailwind', 'Pest'], repo: null, formation: 'rows' },
};

const projectText = pick({
  en: {
    meido: {
      tagline: 'A personal assistant across desktop and Android.',
      text: 'A voice-enabled assistant with local system tools, synchronized memory and a character interface, built around a Linux desktop and Android app.',
      flow: ['Desktop', 'Voice & tools', 'Convex', 'Android'],
      features: [
        'Desktop and Android apps share chat, vector memory, reminders and approvals through Convex',
        'Voice interaction, local system tools and integrations for files, email, calendar, music and coding agents',
        'The Android app works without the PC for phone features and supported offline commands',
        'A Linux desktop island provides status, chat, permissions and agent activity; its visual design is still being revised',
      ],
      status: 'Desktop avatar redesign paused',
      demo: 'The character and its states were generated with the real M.E.I.D.O code (isla_personaje.py). Voice and the LLM don’t run in the browser: the sequence is simulated here.',
    },
    'meido-movil': {
      name: 'Meido Mobile',
      tagline: 'The assistant, in your pocket.',
      text: 'A Flutter Android app that runs without the PC and syncs chat, vector memory and reminders with the desktop in real time via Convex.',
      flow: ['QR', 'App', 'OpenRouter', 'Convex', 'Desktop'],
      features: [
        'Shared chat, memory, reminders and desktop approvals through Convex',
        'Voice activation, offline commands, WhatsApp, email, calendar and phone controls',
        'Lock-screen safety controls, PIN approvals and in-app updates',
      ],
      status: 'In active development',
      demo: 'The app’s offline mode: commands are understood with the same rules as offline.dart, ported to JavaScript. The real app answers in Spanish; here the replies are translated. Type as you would talk to it.',
    },
    mitpad: {
      tagline: 'A shared workspace for projects, tasks, notes and agents.',
      text: 'A private web workspace that connects project work and knowledge, with a 3D map and MCP access for AI agents.',
      flow: ['Web workspace', 'Convex', 'MCP agents'],
      features: [
        'Organize projects, tasks, notes, decisions, activity and shared files in private workspaces',
        'Connect agents through a remote Streamable HTTP MCP server with individual revocable credentials',
        'Explore project, task and knowledge relationships in an interactive 3D map',
        'The current product is web-based; earlier Tauri desktop work remains archived',
      ],
      status: 'In active development',
      demo: 'This interactive sample recreates an early desktop notes prototype. Mitpad is now a web workspace; the sample does not connect to its Convex data or MCP service.',
    },
    rigm: {
      tagline: 'Build and review expressive character rigs.',
      text: 'A desktop editor for preparing animatable 2D characters from illustrations and reviewing GLB/VRM avatars in 3D.',
      flow: ['Illustration', 'Layers & rig', 'Animation', 'GLB / ZIP'],
      features: [
        'Create masks, sprites, pivots and bones; generate meshes and refine skin weights',
        'Preview clips, facial expressions and reactive states with IK and validation tools',
        'Use Blender for the recommended 3D auto-rig flow, or try the experimental Three.js auto-rig',
        'Work through both the editor and rigmctl CLI; full automation from one image remains in progress',
      ],
      status: 'Active prototype',
    },
    autum: {
      tagline: 'No ticket left unattended.',
      text: 'A monitor for unassigned tickets in ManageEngine ServiceDesk Plus Cloud. It alerts on Telegram and keeps reminding until someone acknowledges, even in the middle of the night.',
      flow: ['ServiceDesk Plus', 'Playwright', 'Telegram', 'Acknowledged'],
      roadmap: [
        { phase: 'Pre‑phase', state: 'Current', current: true, text: 'Checks the queue every minute; Telegram alert with an «Acknowledged» button that keeps insisting until it’s confirmed.' },
        { phase: 'Phase 1', state: 'In development', text: 'Desktop app with Tauri (Rust + Vue 3), automatic ticket pick‑up and replies, history in PostgreSQL and daily reports to M.E.I.D.O.' },
        { phase: 'Phase 2', state: 'Planned', text: 'AI triage to classify, summarize and prioritize; semantic memory with pgvector to suggest resolutions.' },
      ],
      status: 'Pre‑phase in daily use',
      demo: 'Same flow, button and commands as the real bot; its messages are translated from Spanish. Sped‑up timings: a check every 3 s (real: 60 s) and a reminder every 10 s (real: 2 min).',
    },
    cosechia: {
      label: 'Internship · Enteracloud MX',
      tagline: 'AI‑assisted vineyard management.',
      text: 'A vineyard and winery management platform for Baja California with a domain‑specific AI agent, «Vini».',
      flow: ['Laravel', 'Inertia', 'Vue', 'AI agent', 'pgvector + BM25'],
      features: [
        'Custom tool-calling agent with vineyard tools for weather, disease risk, maturity, records and recommendations',
        'Hybrid‑search RAG: pgvector embeddings + BM25 merged with Reciprocal Rank Fusion, with cited answers',
        'Versioned working and long‑term memory, plus a proactive agent that generates decisions and notifications',
        'Broad vineyard and winery data model, role-based dashboards and per-grower data isolation, with Pest and Larastan checks',
      ],
      status: 'In active development',
      demo: 'Real data from the CosechIA catalog, translated from Spanish. In the app an LLM writes the answers with search over data sheets and manuals; here they are built from those same sheets.',
    },
  },
  es: {
    meido: {
      tagline: 'Asistente personal para escritorio y Android.',
      text: 'Asistente por voz con herramientas del sistema, memoria sincronizada e interfaz de personaje, con un escritorio Linux y app Android.',
      flow: ['Escritorio', 'Voz y herramientas', 'Convex', 'Android'],
      features: [
        'Las apps de escritorio y Android comparten chat, memoria vectorial, recordatorios y aprobaciones mediante Convex',
        'Interacción por voz, herramientas locales e integraciones con archivos, correo, calendario, música y agentes de programación',
        'La app Android funciona sin el PC para las funciones del teléfono y los comandos sin conexión compatibles',
        'Una isla en el escritorio Linux muestra estado, chat, permisos y actividad de agentes; su diseño visual sigue en revisión',
      ],
      status: 'Rediseño del avatar de escritorio en pausa',
      demo: 'El personaje y sus estados se generaron con el código real de M.E.I.D.O (isla_personaje.py). La voz y el LLM no corren en el navegador: aquí se simula la secuencia.',
    },
    'meido-movil': {
      name: 'Meido Móvil',
      tagline: 'El asistente, en el bolsillo.',
      text: 'App Android en Flutter que funciona sin el PC y sincroniza chat, memoria vectorial y recordatorios con el escritorio en tiempo real vía Convex.',
      flow: ['QR', 'App', 'OpenRouter', 'Convex', 'Escritorio'],
      features: [
        'Chat, memoria, recordatorios y aprobaciones del escritorio compartidos mediante Convex',
        'Activación por voz, comandos sin conexión, WhatsApp, correo, calendario y controles del teléfono',
        'Controles seguros en pantalla bloqueada, aprobaciones por PIN y actualizaciones desde la app',
      ],
      status: 'En desarrollo activo',
      demo: 'Modo sin conexión de la app: las órdenes se interpretan con las mismas reglas de offline.dart, portadas a JavaScript. Escribe como le hablarías.',
    },
    mitpad: {
      tagline: 'Un workspace compartido para proyectos, tareas, notas y agentes.',
      text: 'Workspace web privado que conecta el trabajo de proyectos y el conocimiento, con un mapa 3D y acceso MCP para agentes de IA.',
      flow: ['Workspace web', 'Convex', 'Agentes MCP'],
      features: [
        'Organiza proyectos, tareas, notas, decisiones, actividad y archivos compartidos en espacios privados',
        'Conecta agentes mediante un servidor MCP remoto Streamable HTTP con credenciales individuales revocables',
        'Explora las relaciones entre proyectos, tareas y conocimiento en un mapa 3D interactivo',
        'El producto actual es web; el trabajo anterior en Tauri se conserva archivado',
      ],
      status: 'En desarrollo activo',
      demo: 'Esta muestra interactiva recrea un prototipo inicial de notas para escritorio. Mitpad ahora es un workspace web; la muestra no se conecta a sus datos Convex ni al servicio MCP.',
    },
    rigm: {
      tagline: 'Crea y revisa rigs expresivos para personajes.',
      text: 'Editor de escritorio para preparar personajes 2D animables desde ilustraciones y revisar avatares GLB/VRM en 3D.',
      flow: ['Ilustración', 'Capas y rig', 'Animación', 'GLB / ZIP'],
      features: [
        'Crea máscaras, sprites, pivotes y huesos; genera mallas y ajusta pesos de deformación',
        'Previsualiza clips, expresiones y estados reactivos con IK y herramientas de validación',
        'Usa Blender para el flujo recomendado de auto-rig 3D o prueba el auto-rig experimental de Three.js',
        'Trabaja desde el editor y la CLI rigmctl; la automatización completa desde una imagen sigue en desarrollo',
      ],
      status: 'Prototipo activo',
    },
    autum: {
      tagline: 'Ningún ticket sin atender.',
      text: 'Monitor de tickets sin asignar para ManageEngine ServiceDesk Plus Cloud. Avisa por Telegram y lo sigue recordando hasta que alguien confirma, incluso de madrugada.',
      flow: ['ServiceDesk Plus', 'Playwright', 'Telegram', 'Enterado'],
      roadmap: [
        { phase: 'Pre‑fase', state: 'Actual', current: true, text: 'Revisión de la bandeja cada minuto; aviso en Telegram con botón «Enterado» que insiste hasta la confirmación.' },
        { phase: 'Fase 1', state: 'En desarrollo', text: 'App de escritorio con Tauri (Rust + Vue 3), toma y respuesta automática de tickets, historial en PostgreSQL y reportes diarios a M.E.I.D.O.' },
        { phase: 'Fase 2', state: 'Planeada', text: 'Triage con IA para clasificar, resumir y priorizar; memoria semántica con pgvector para sugerir resoluciones.' },
      ],
      status: 'Pre‑fase en uso diario',
      demo: 'Mensajes, botón y comandos idénticos a los del bot real. Tiempos acelerados: revisión cada 3 s (real: 60 s) y recordatorio cada 10 s (real: 2 min).',
    },
    cosechia: {
      label: 'Estadía · Enteracloud MX',
      tagline: 'Gestión vinícola asistida por IA.',
      text: 'Plataforma de gestión vitivinícola para Baja California con un agente de IA especializado, «Vini».',
      flow: ['Laravel', 'Inertia', 'Vue', 'Agente IA', 'pgvector + BM25'],
      features: [
        'Agente propio con herramientas vitivinícolas para clima, riesgo de enfermedades, madurez, bitácoras y recomendaciones',
        'RAG con búsqueda híbrida: embeddings en pgvector + BM25 combinados con Reciprocal Rank Fusion y respuestas con citas',
        'Memoria de trabajo y de largo plazo con versionado, y agente proactivo que genera decisiones y notificaciones',
        'Modelo de datos amplio para viñedos y bodega, paneles por rol y aislamiento por viticultor, con validaciones de Pest y Larastan',
      ],
      status: 'En desarrollo activo',
      demo: 'Datos reales del catálogo de CosechIA. En la app las respuestas las redacta un LLM con búsqueda en fichas y manuales; aquí se arman con esas mismas fichas.',
    },
  },
});

export const projects = Object.entries(projectBase).map(([id, p]) => ({ id, ...p, ...projectText[id] }));

const LANGUAGES = ['Python', 'PHP', 'Rust', 'JavaScript', 'TypeScript', 'Dart', 'Java', 'C#', 'SQL', 'HTML', 'CSS'];
const FRAMEWORKS = ['Laravel', 'Django', 'Vue', 'Inertia', 'Tauri', 'SvelteKit', 'Flutter', 'PyQt6', 'aiohttp', 'Tailwind', 'Three.js'];
const DATA = ['PostgreSQL', 'pgvector', 'SQLite', 'Convex', 'Supabase', 'Neon', 'Render'];

export const stack = pick({
  en: [
    ['Languages', LANGUAGES],
    ['Frameworks', FRAMEWORKS],
    ['AI', ['Tool‑calling agents', 'RAG', 'Embeddings', 'Hybrid search', 'LLMs (OpenRouter, Ollama)', 'Whisper', 'TTS']],
    ['Data & cloud', DATA],
    ['Tools & practices', ['Git / GitHub', 'REST / HTTP APIs', 'Offline‑First', 'Testing (Pest, pytest)', 'Playwright', 'Linux (Arch)']],
  ],
  es: [
    ['Lenguajes', LANGUAGES],
    ['Frameworks', FRAMEWORKS],
    ['IA', ['Agentes con tool calling', 'RAG', 'Embeddings', 'Búsqueda híbrida', 'LLMs (OpenRouter, Ollama)', 'Whisper', 'TTS']],
    ['BD y nube', DATA],
    ['Herramientas y prácticas', ['Git / GitHub', 'REST / HTTP APIs', 'Offline‑First', 'Pruebas (Pest, pytest)', 'Playwright', 'Linux (Arch)']],
  ],
});

// Una línea de Meido por capítulo (mismo orden que los capítulos en ui/render.js)
export const meidoLines = pick({
  en: [
    'Hi. I’m Meido.',
    'I’m Omar’s AI assistant, and also a piece of this cube. Today I’ll show you his work.',
    'This is Omar Reyes, though he likes to be called Mick. He builds end to end: from the data to the interface.',
    'He has worked on a Service Desk since 2023, studies Cross‑Platform Software Development and is an AI developer intern. Autum was born from that day‑to‑day.',
    'This project is me. I live on his desktop: I listen, I remember and I act on the system.',
    'My mobile version. I work without the PC and sync everything with the desktop in real time.',
    'Mitpad works offline first and syncs with the cloud whenever it can.',
    'Autum watches for unassigned tickets and keeps alerting until someone answers. Next up: desktop and AI.',
    'CosechIA is his internship project: vineyard management with an AI agent that cites its sources.',
    'These are the tools he works with.',
    'If you want to talk to Mick, this is where to find him. I’ll go back to my place.',
  ],
  es: [
    'Hola. Soy Meido.',
    'Soy la asistente de IA de Omar, y también una pieza de este cubo. Hoy te presento su trabajo.',
    'Él es Omar Reyes, aunque le gusta que lo llamen Mick. Construye de punta a punta: de los datos a la interfaz.',
    'Trabaja en Service Desk desde 2023, estudia Desarrollo de Software Multiplataforma y hace su estadía como desarrollador de IA. De ese día a día nació Autum.',
    'Este proyecto soy yo. Vivo en su escritorio: escucho, recuerdo y actúo sobre el sistema.',
    'Mi versión móvil. Funciono sin el PC y sincronizo todo con el escritorio en tiempo real.',
    'Mitpad funciona primero sin conexión y sincroniza con la nube cuando puede.',
    'Autum vigila los tickets sin asignar y no deja de avisar hasta que alguien responde. Lo que sigue: escritorio e IA.',
    'CosechIA es su proyecto de estadía: gestión vinícola con un agente de IA que cita sus fuentes.',
    'Estas son las herramientas con las que trabaja.',
    'Si quieres hablar con Mick, aquí lo encuentras. Yo vuelvo a mi lugar.',
  ],
});

// Textos de la interfaz (encabezado, capítulos, botones, ventana de demos)
export const ui = pick({
  en: {
    title: 'Omar Reyes — Portfolio',
    description: 'Omar Reyes (Mick): cross‑platform software developer focused on applied AI, Offline‑First architectures and connected tools.',
    ogDescription: 'Cross‑platform software developer · Applied AI. Tijuana, B.C.',
    skip: 'Skip to projects',
    navMain: 'Main',
    navChapters: 'Chapters',
    nav: { projects: 'Projects', career: 'Career', contact: 'Contact', cv: 'CV ↓' },
    switchLang: { label: 'ES', aria: 'Ver en español' },
    chapters: { inicio: 'Home', guia: 'Meido', 'sobre-mi': 'About me', trayectoria: 'Career', stack: 'Stack', contacto: 'Contact' },
    intro: { eyebrow: 'Portfolio — 2026', projects: 'See projects', cv: 'Download CV' },
    guide: { eyebrow: '01 — Guide', title: 'A piece of the cube', text: 'Meido is the AI assistant Omar built, and also one of the pieces of this cube. Today she guides this tour.' },
    about: { eyebrow: '02 — Profile', title: 'About me', outside: 'Outside of code' },
    career: { eyebrow: '03 — Career', title: 'Career', experience: 'Experience', education: 'Education', languages: 'Languages', other: 'Other projects' },
    project: { flow: 'Flow', code: 'View code ↗', private: 'Private repository', demo: 'Try demo' },
    stack: { eyebrow: '09 — Tools', title: 'Stack' },
    contact: { eyebrow: '10 — Contact', title: 'Shall we build something <em>together</em>?', cv: 'Download CV ↓', chat: 'Talk to Meido →' },
    chat: { open: 'Talk to Meido', close: 'Close chat', full: 'Open in its own page ↗', sub: 'Omar’s AI assistant · live' },
    demo: { eyebrow: 'Interactive demo · Simulation', close: 'Close', closeAria: 'Close demo', loading: 'Loading…', error: 'The demo couldn’t be loaded.' },
  },
  es: {
    title: 'Omar Reyes — Portafolio',
    description: 'Omar Reyes (Mick): desarrollador de software multiplataforma enfocado en IA aplicada, arquitecturas Offline‑First y herramientas conectadas.',
    ogDescription: 'Desarrollador de software multiplataforma · IA aplicada. Tijuana, B.C.',
    skip: 'Saltar a los proyectos',
    navMain: 'Principal',
    navChapters: 'Capítulos',
    nav: { projects: 'Proyectos', career: 'Trayectoria', contact: 'Contacto', cv: 'CV ↓' },
    switchLang: { label: 'EN', aria: 'View in English' },
    chapters: { inicio: 'Inicio', guia: 'Meido', 'sobre-mi': 'Sobre mí', trayectoria: 'Trayectoria', stack: 'Stack', contacto: 'Contacto' },
    intro: { eyebrow: 'Portafolio — 2026', projects: 'Ver proyectos', cv: 'Descargar CV' },
    guide: { eyebrow: '01 — Guía', title: 'Una pieza del cubo', text: 'Meido es la asistente de IA que Omar construyó, y también una de las piezas de este cubo. Hoy guía este recorrido.' },
    about: { eyebrow: '02 — Perfil', title: 'Sobre mí', outside: 'Fuera del código' },
    career: { eyebrow: '03 — Trayectoria', title: 'Trayectoria', experience: 'Experiencia', education: 'Educación', languages: 'Idiomas', other: 'Otros proyectos' },
    project: { flow: 'Flujo', code: 'Ver código ↗', private: 'Repositorio privado', demo: 'Probar demo' },
    stack: { eyebrow: '09 — Herramientas', title: 'Stack' },
    contact: { eyebrow: '10 — Contacto', title: '¿Construimos algo <em>juntos</em>?', cv: 'Descargar CV ↓', chat: 'Habla con Meido →' },
    chat: { open: 'Habla con Meido', close: 'Cerrar chat', full: 'Abrir en su propia página ↗', sub: 'Asistente de IA de Omar · en vivo' },
    demo: { eyebrow: 'Demo interactiva · Simulación', close: 'Cerrar', closeAria: 'Cerrar demo', loading: 'Cargando…', error: 'No se pudo cargar el demo.' },
  },
});
