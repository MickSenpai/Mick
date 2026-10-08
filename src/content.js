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
  meido: { name: 'M.E.I.D.O', mono: 'M', year: '2025', stack: ['Python', 'PyQt6', 'aiohttp', 'FastAPI', 'Convex', 'Whisper'], repo: null, formation: 'explode' },
  'meido-movil': { mono: 'MM', year: '2026', stack: ['Flutter', 'Dart', 'Convex', 'Android'], repo: null, formation: 'phone' },
  mitpad: { name: 'Mitpad', mono: 'Mp', year: '2026', stack: ['Rust', 'Tauri', 'SvelteKit', 'TypeScript', 'SQLite', 'Convex'], repo: null, formation: 'sheet' },
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
      tagline: 'An autonomous AI assistant for the desktop.',
      text: 'A local assistant for Arch Linux + Hyprland with voice, long‑term memory and the ability to act on the system.',
      flow: ['Voice', 'Whisper', 'LLM', 'Tools', 'Convex', 'Mobile'],
      features: [
        '~150 function‑calling tools, chosen dynamically per request, with human approval for system actions',
        'On‑device GPU voice: Faster‑Whisper recognition (~0.15 s per phrase) and streaming XTTS‑v2 with a cloned voice',
        'Asynchronous GUI with PyQt6 and aiohttp',
        'Memory shared with the phone; Gmail, Calendar and Spotify',
      ],
      status: 'In active development',
      demo: 'The character and its states were generated with the real M.E.I.D.O code (isla_personaje.py). Voice and the LLM don’t run in the browser: the sequence is simulated here.',
    },
    'meido-movil': {
      name: 'Meido Mobile',
      tagline: 'The assistant, in your pocket.',
      text: 'A Flutter Android app that runs without the PC and syncs chat, vector memory and reminders with the desktop in real time via Convex.',
      flow: ['QR', 'App', 'OpenRouter', 'Convex', 'Desktop'],
      features: [
        'First‑time setup with a QR code from the PC',
        'Voice activation and offline mode: alarms, timers, music',
        'PIN approvals and automatic updates',
      ],
      status: 'In active development',
      demo: 'The app’s offline mode: commands are understood with the same rules as offline.dart, ported to JavaScript. The real app answers in Spanish; here the replies are translated. Type as you would talk to it.',
    },
    mitpad: {
      tagline: 'Offline‑First notes with cloud sync.',
      text: 'A desktop notes app that works offline first and syncs whenever it can, without losing data after an outage.',
      flow: ['Local SQLite', 'Sync queue', 'Convex'],
      features: [
        'Local sync queue with idempotent mutations',
        'Migrated sync from Neon to Convex; interactive graphs of the relationships between notes',
        'Token validation on the backend',
      ],
      status: 'In active development',
      demo: 'The real app’s interface and messages, translated from Spanish. The local database and the cloud are simulated in memory; the Worker checks the queue every 2 s (every 5 s in the app).',
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
        'AI agent built from scratch: custom tool‑calling loop with 7 domain tools (weather, disease risk, maturity, log…)',
        'Hybrid‑search RAG: pgvector embeddings + BM25 merged with Reciprocal Rank Fusion, with cited answers',
        'Versioned working and long‑term memory, plus a proactive agent that generates decisions and notifications',
        '50+ table data model, role‑based dashboards and per‑grower data isolation, backed by 50+ Pest suites and Larastan',
      ],
      status: 'In active development',
      demo: 'Real data from the CosechIA catalog, translated from Spanish. In the app an LLM writes the answers with search over data sheets and manuals; here they are built from those same sheets.',
    },
  },
  es: {
    meido: {
      tagline: 'Asistente de IA autónomo para el escritorio.',
      text: 'Asistente local para Arch Linux + Hyprland con voz, memoria a largo plazo y capacidad de actuar sobre el sistema.',
      flow: ['Voz', 'Whisper', 'LLM', 'Herramientas', 'Convex', 'Móvil'],
      features: [
        '~150 herramientas (function calling) con selección dinámica por petición y confirmación humana para acciones del sistema',
        'Voz local en GPU: reconocimiento con Faster‑Whisper (~0.15 s por frase) y síntesis XTTS‑v2 en streaming con voz clonada',
        'GUI asíncrona con PyQt6 y aiohttp',
        'Memoria compartida con el móvil; Gmail, Calendar y Spotify',
      ],
      status: 'En desarrollo activo',
      demo: 'El personaje y sus estados se generaron con el código real de M.E.I.D.O (isla_personaje.py). La voz y el LLM no corren en el navegador: aquí se simula la secuencia.',
    },
    'meido-movil': {
      name: 'Meido Móvil',
      tagline: 'El asistente, en el bolsillo.',
      text: 'App Android en Flutter que funciona sin el PC y sincroniza chat, memoria vectorial y recordatorios con el escritorio en tiempo real vía Convex.',
      flow: ['QR', 'App', 'OpenRouter', 'Convex', 'Escritorio'],
      features: [
        'Configuración inicial por QR desde el PC',
        'Activación por voz y modo sin conexión: alarmas, temporizadores, música',
        'Aprobaciones por PIN y actualizaciones automáticas',
      ],
      status: 'En desarrollo activo',
      demo: 'Modo sin conexión de la app: las órdenes se interpretan con las mismas reglas de offline.dart, portadas a JavaScript. Escribe como le hablarías.',
    },
    mitpad: {
      tagline: 'Notas Offline‑First con sincronización en la nube.',
      text: 'Aplicación de escritorio de notas que funciona primero sin conexión y sincroniza cuando puede, sin perder datos tras un corte.',
      flow: ['SQLite local', 'Cola de sync', 'Convex'],
      features: [
        'Cola de sincronización local con mutaciones idempotentes',
        'Migración de la sincronización de Neon a Convex; relaciones entre notas con gráficos interactivos',
        'Validación de token en el backend',
      ],
      status: 'En desarrollo activo',
      demo: 'Interfaz y mensajes de la app real. La base local y la nube se simulan en memoria; el Worker revisa la cola cada 2 s (en la app, cada 5 s).',
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
        'Agente de IA desde cero: bucle propio de tool calling con 7 herramientas de dominio (clima, riesgo, madurez, bitácora…)',
        'RAG con búsqueda híbrida: embeddings en pgvector + BM25 combinados con Reciprocal Rank Fusion y respuestas con citas',
        'Memoria de trabajo y de largo plazo con versionado, y agente proactivo que genera decisiones y notificaciones',
        'Modelo de datos de 50+ tablas, paneles por rol y aislamiento por viticultor, con 50+ suites de Pest y Larastan',
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
    contact: { eyebrow: '10 — Contact', title: 'Shall we build something <em>together</em>?', cv: 'Download CV ↓' },
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
    contact: { eyebrow: '10 — Contacto', title: '¿Construimos algo <em>juntos</em>?', cv: 'Descargar CV ↓' },
    demo: { eyebrow: 'Demo interactiva · Simulación', close: 'Cerrar', closeAria: 'Cerrar demo', loading: 'Cargando…', error: 'No se pudo cargar el demo.' },
  },
});
