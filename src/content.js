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
  meido: { name: 'M.E.I.D.O', mono: 'M', year: '2025', stack: ['Python', 'PyQt6', 'FastAPI', 'Tauri', 'React', 'Convex', 'Whisper'], repo: null, formation: 'explode' },
  'meido-movil': { mono: 'MM', year: '2026', stack: ['Flutter', 'Dart', 'Convex', 'OpenRouter', 'Android'], repo: null, formation: 'phone' },
  mitpad: { name: 'Mitpad', mono: 'Mp', year: '2026', stack: ['SvelteKit', 'TypeScript', 'Convex', 'MCP', 'Render'], repo: 'https://github.com/MickSenpai/Mitpad', formation: 'sheet' },
  meshingup: { name: 'MeshingUp', mono: 'Mu', year: '2026', stack: ['Python', 'PyQt6', 'Three.js', 'Blender', 'SAM 2', 'OpenCV'], repo: 'https://github.com/MickSenpai/MeshingUp', formation: 'figure' },
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
      text: 'A local assistant for Arch Linux + Hyprland with voice, long‑term memory and the ability to act on the system. It is now also a control centre for coding agents.',
      flow: ['Voice', 'Whisper', 'LLM', 'Tools', 'Agents', 'Convex', 'Mobile'],
      features: [
        '140+ function‑calling tools, chosen dynamically per request, with human approval for system actions',
        'On‑device GPU voice: Faster‑Whisper recognition (~0.15 s per phrase) and streaming XTTS‑v2 with a cloned voice',
        'Agent control centre: delegate, follow and approve Claude Code, Codex and OpenCode sessions, with embedded terminals and isolated git worktrees',
        'New Tauri + React interface and a voxel world for the avatar; memory shared with the phone; Gmail, Calendar and Spotify; 1,400+ automated tests',
      ],
      status: 'Agent centre in active development · desktop avatar redesign paused',
      demo: 'The character and its states were generated with the real M.E.I.D.O code (isla_personaje.py). Voice and the LLM don’t run in the browser: the sequence is simulated here.',
    },
    'meido-movil': {
      name: 'Meido Mobile',
      tagline: 'The assistant, in your pocket.',
      text: 'A Flutter Android app (v1.15.3) that runs without the PC and syncs chat, vector memory and reminders with the desktop in real time via Convex.',
      flow: ['QR', 'App', 'OpenRouter', 'Convex', 'Desktop'],
      features: [
        'Works with the PC off: Gmail (read, send and schedule), reminders, snippets, Pomodoro and documents',
        'Wake word «Meido», a safe mode on the lock screen and a floating mascot over other apps',
        'Follows the desktop’s coding‑agent sessions: approvals and questions answered from the phone, protected by PIN',
        'First‑time setup with a QR code from the PC, offline mode and automatic updates',
      ],
      status: 'In active development',
      demo: 'The app’s offline mode: commands are understood with the same rules as offline.dart, ported to JavaScript. The real app answers in Spanish; here the replies are translated. Type as you would talk to it.',
    },
    mitpad: {
      tagline: 'A shared workspace for people and AI agents.',
      text: 'A web workbench for projects, tasks, notes and files that AI agents read and update through MCP. It began as an offline‑first desktop app; since November 2026 it is web‑only.',
      flow: ['SvelteKit', 'Convex', 'MCP server', 'AI agents'],
      features: [
        'Remote MCP server (Streamable HTTP) with a revocable key per agent and a full connection test',
        'Projects, tasks with drag‑and‑drop status, notes, image and document uploads, and an activity log in a private workspace per account',
        'Interactive 3D map of projects, tasks and knowledge, with typed relations between projects',
        'Convex Auth, an encrypted private‑variables vault and backend tests with convex‑test',
      ],
      status: 'In active development',
      demo: 'A simulation of the workbench: the board and the MCP calls run in memory, using the real tool names (mitpad_projects_list, mitpad_tasks_create…). Nothing is sent to a server.',
    },
    meshingup: {
      tagline: 'A body for Meido: rig a drawing or a 3D avatar.',
      text: 'A desktop editor and CLI that prepares animatable characters from 2D illustrations and GLB/VRM models, so that people and agents work on the same project. Formerly RigM.',
      flow: ['Image / GLB', 'Layers', 'Bones & weights', 'Reactive motion', 'Export'],
      features: [
        '2D pipeline: SAM 2 mask proposals, layer separation, sprite extraction with inpainting, meshes, weights and two‑bone IK',
        '3D pipeline: GLB/VRM auto‑rig with Blender (hands, fingers, hair) validated with stress poses, plus a Three.js viewer to fix bones and pivots',
        'Reactive runtime: idle, listening, thinking and speaking states with gaze, blinking and visemes',
        'A `meshingupctl` CLI edits the same versioned project as the UI. Auto‑rig results still need a visual review',
      ],
      status: 'In active development',
      demo: 'A two‑bone IK arm on a simple character, in the same planar scheme the editor uses. Drag the hand; the real app deforms textured meshes instead of shapes.',
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
      text: 'A vineyard and winery management platform for Baja California with a domain‑specific AI agent, «Vini», now extending to vine‑to‑bottle traceability.',
      flow: ['Laravel', 'Inertia', 'Vue', 'AI agent', 'pgvector + BM25'],
      features: [
        'AI agent built from scratch: custom tool‑calling loop with 15 domain tools (weather, disease risk, maturity, log, memory…)',
        'Hybrid‑search RAG: pgvector embeddings + BM25 merged with Reciprocal Rank Fusion, with cited answers',
        'Versioned working and long‑term memory, plus a proactive agent that generates decisions and notifications',
        '50+ table data model, role‑based dashboards, per‑grower data isolation and an Excel‑style readings sheet with traffic‑light thresholds and CSV export',
        'Backed by 575 Pest tests across 84 test files, plus Larastan',
      ],
      status: 'In active development',
      demo: 'Real data from the CosechIA catalog, translated from Spanish. In the app an LLM writes the answers with search over data sheets and manuals; here they are built from those same sheets.',
    },
  },
  es: {
    meido: {
      tagline: 'Asistente de IA autónomo para el escritorio.',
      text: 'Asistente local para Arch Linux + Hyprland con voz, memoria a largo plazo y capacidad de actuar sobre el sistema. Ahora también es un centro de control de agentes de programación.',
      flow: ['Voz', 'Whisper', 'LLM', 'Herramientas', 'Agentes', 'Convex', 'Móvil'],
      features: [
        '140+ herramientas (function calling) con selección dinámica por petición y confirmación humana para acciones del sistema',
        'Voz local en GPU: reconocimiento con Faster‑Whisper (~0.15 s por frase) y síntesis XTTS‑v2 en streaming con voz clonada',
        'Centro de agentes: encarga, sigue y aprueba sesiones de Claude Code, Codex y OpenCode, con terminales integradas y worktrees de git aislados',
        'Interfaz nueva con Tauri + React y un mundo de vóxeles para el avatar; memoria compartida con el móvil; Gmail, Calendar y Spotify; 1,400+ pruebas automatizadas',
      ],
      status: 'Centro de agentes en desarrollo · rediseño del avatar de escritorio en pausa',
      demo: 'El personaje y sus estados se generaron con el código real de M.E.I.D.O (isla_personaje.py). La voz y el LLM no corren en el navegador: aquí se simula la secuencia.',
    },
    'meido-movil': {
      name: 'Meido Móvil',
      tagline: 'El asistente, en el bolsillo.',
      text: 'App Android en Flutter (v1.15.3) que funciona sin el PC y sincroniza chat, memoria vectorial y recordatorios con el escritorio en tiempo real vía Convex.',
      flow: ['QR', 'App', 'OpenRouter', 'Convex', 'Escritorio'],
      features: [
        'Funciona con el PC apagado: Gmail (leer, enviar y programar), recordatorios, snippets, Pomodoro y documentos',
        'Palabra de activación «Meido», modo seguro con el teléfono bloqueado y mascota flotante sobre otras apps',
        'Sigue las sesiones de agentes de programación del escritorio: aprobaciones y preguntas desde el móvil, protegidas con PIN',
        'Configuración inicial por QR desde el PC, modo sin conexión y actualizaciones automáticas',
      ],
      status: 'En desarrollo activo',
      demo: 'Modo sin conexión de la app: las órdenes se interpretan con las mismas reglas de offline.dart, portadas a JavaScript. Escribe como le hablarías.',
    },
    mitpad: {
      tagline: 'Un espacio de trabajo compartido entre personas y agentes de IA.',
      text: 'Workbench web de proyectos, tareas, notas y archivos que los agentes de IA leen y actualizan por MCP. Nació como app de escritorio Offline‑First; desde noviembre de 2026 es solo web.',
      flow: ['SvelteKit', 'Convex', 'Servidor MCP', 'Agentes de IA'],
      features: [
        'Servidor MCP remoto (Streamable HTTP) con una clave revocable por agente y prueba completa de conexión',
        'Proyectos, tareas con estado por arrastre, notas, subida de imágenes y documentos y registro de actividad en un workspace privado por cuenta',
        'Mapa 3D interactivo de proyectos, tareas y conocimiento, con tipos de relación entre proyectos',
        'Convex Auth, bóveda cifrada de variables privadas y pruebas del backend con convex‑test',
      ],
      status: 'En desarrollo activo',
      demo: 'Simulación del workbench: el tablero y las llamadas MCP corren en memoria, con los nombres reales de las herramientas (mitpad_projects_list, mitpad_tasks_create…). No se envía nada a ningún servidor.',
    },
    meshingup: {
      tagline: 'Un cuerpo para Meido: rig de un dibujo o de un avatar 3D.',
      text: 'Editor de escritorio y CLI que prepara personajes animables a partir de ilustraciones 2D y modelos GLB/VRM, para que personas y agentes trabajen sobre el mismo proyecto. Antes se llamaba RigM.',
      flow: ['Imagen / GLB', 'Capas', 'Huesos y pesos', 'Movimiento reactivo', 'Exportar'],
      features: [
        'Flujo 2D: propuestas de máscaras con SAM 2, separación en capas, sprites con inpainting, mallas, pesos e IK de dos huesos',
        'Flujo 3D: auto‑rig de GLB/VRM con Blender (manos, dedos, pelo) validado con poses de estrés, y visor Three.js para corregir huesos y pivotes',
        'Runtime reactivo: estados de reposo, escucha, pensamiento y habla con mirada, parpadeo y visemas',
        'La CLI `meshingupctl` edita el mismo proyecto versionado que la interfaz. El auto‑rig aún requiere revisión visual',
      ],
      status: 'En desarrollo activo',
      demo: 'Un brazo con IK de dos huesos sobre un personaje sencillo, con el mismo esquema planar del editor. Arrastra la mano; la app real deforma mallas con textura, no figuras.',
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
      text: 'Plataforma de gestión vitivinícola para Baja California con un agente de IA especializado, «Vini», que ahora se extiende a la trazabilidad de la vid a la botella.',
      flow: ['Laravel', 'Inertia', 'Vue', 'Agente IA', 'pgvector + BM25'],
      features: [
        'Agente de IA desde cero: bucle propio de tool calling con 15 herramientas de dominio (clima, riesgo, madurez, bitácora, memoria…)',
        'RAG con búsqueda híbrida: embeddings en pgvector + BM25 combinados con Reciprocal Rank Fusion y respuestas con citas',
        'Memoria de trabajo y de largo plazo con versionado, y agente proactivo que genera decisiones y notificaciones',
        'Modelo de datos de 50+ tablas, paneles por rol, aislamiento por viticultor y hoja de lecturas tipo Excel con semáforo y exportación a CSV',
        'Respaldado por 575 pruebas de Pest en 84 archivos, además de Larastan',
      ],
      status: 'En desarrollo activo',
      demo: 'Datos reales del catálogo de CosechIA. En la app las respuestas las redacta un LLM con búsqueda en fichas y manuales; aquí se arman con esas mismas fichas.',
    },
  },
});

export const projects = Object.entries(projectBase).map(([id, p]) => ({ id, ...p, ...projectText[id] }));

const LANGUAGES = ['Python', 'PHP', 'Rust', 'JavaScript', 'TypeScript', 'Dart', 'Java', 'C#', 'SQL', 'HTML', 'CSS'];
const FRAMEWORKS = ['Laravel', 'Django', 'Vue', 'Inertia', 'React', 'Tauri', 'SvelteKit', 'Flutter', 'PyQt6', 'FastAPI', 'Tailwind', 'Three.js'];
const DATA = ['PostgreSQL', 'pgvector', 'SQLite', 'Convex', 'Supabase', 'Render'];

export const stack = pick({
  en: [
    ['Languages', LANGUAGES],
    ['Frameworks', FRAMEWORKS],
    ['AI', ['Tool‑calling agents', 'RAG', 'Embeddings', 'Hybrid search', 'MCP', 'LLMs (OpenRouter, Ollama)', 'Whisper', 'TTS', 'Computer vision (SAM 2)']],
    ['Data & cloud', DATA],
    ['Tools & practices', ['Git / GitHub', 'Blender', 'REST / HTTP APIs', 'Offline‑First', 'Testing (Pest, pytest, Vitest)', 'Playwright', 'Linux (Arch)']],
  ],
  es: [
    ['Lenguajes', LANGUAGES],
    ['Frameworks', FRAMEWORKS],
    ['IA', ['Agentes con tool calling', 'RAG', 'Embeddings', 'Búsqueda híbrida', 'MCP', 'LLMs (OpenRouter, Ollama)', 'Whisper', 'TTS', 'Computer vision (SAM 2)']],
    ['BD y nube', DATA],
    ['Herramientas y prácticas', ['Git / GitHub', 'Blender', 'REST / HTTP APIs', 'Offline‑First', 'Pruebas (Pest, pytest, Vitest)', 'Playwright', 'Linux (Arch)']],
  ],
});

// Una línea de Meido por capítulo (mismo orden que los capítulos en ui/render.js)
export const meidoLines = pick({
  en: [
    'Hi. I’m Meido.',
    'I’m Omar’s AI assistant, and also a piece of this cube. Today I’ll show you his work.',
    'This is Omar Reyes, though he likes to be called Mick. He builds end to end: from the data to the interface.',
    'He has worked on a Service Desk since 2023, studies Cross‑Platform Software Development and is an AI developer intern. Autum was born from that day‑to‑day.',
    'This project is me. I live on his desktop: I listen, I remember, I act on the system and I coordinate his coding agents.',
    'My mobile version. I work without the PC and sync everything with the desktop in real time.',
    'Mitpad is where Omar’s projects, tasks and notes live, and where agents like me can work on them through MCP.',
    'MeshingUp is my future body: it rigs a drawing or a 3D model so I can move when I speak.',
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
    'Este proyecto soy yo. Vivo en su escritorio: escucho, recuerdo, actúo sobre el sistema y coordino a sus agentes de programación.',
    'Mi versión móvil. Funciono sin el PC y sincronizo todo con el escritorio en tiempo real.',
    'En Mitpad viven los proyectos, tareas y notas de Omar, y los agentes como yo trabajamos en ellos por MCP.',
    'MeshingUp será mi cuerpo futuro: prepara un dibujo o un modelo 3D para que yo me mueva al hablar.',
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
    stack: { eyebrow: '10 — Tools', title: 'Stack' },
    contact: { eyebrow: '11 — Contact', title: 'Shall we build something <em>together</em>?', cv: 'Download CV ↓', chat: 'Talk to Meido →' },
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
    stack: { eyebrow: '10 — Herramientas', title: 'Stack' },
    contact: { eyebrow: '11 — Contacto', title: '¿Construimos algo <em>juntos</em>?', cv: 'Descargar CV ↓', chat: 'Habla con Meido →' },
    chat: { open: 'Habla con Meido', close: 'Cerrar chat', full: 'Abrir en su propia página ↗', sub: 'Asistente de IA de Omar · en vivo' },
    demo: { eyebrow: 'Demo interactiva · Simulación', close: 'Cerrar', closeAria: 'Cerrar demo', loading: 'Cargando…', error: 'No se pudo cargar el demo.' },
  },
});
