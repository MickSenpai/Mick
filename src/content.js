// Todo el texto del sitio vive aquí.

export const person = {
  name: 'Omar Reyes',
  fullName: 'Omar Albares Reyes',
  nickname: 'Mick',
  role: 'Desarrollador de software multiplataforma · IA aplicada',
  location: 'Tijuana, B.C., México',
  email: 'mick967@hotmail.com',
  github: 'https://github.com/MickSenpai',
  linkedin: 'https://www.linkedin.com/in/omar-albares-reyes-471677201/',
  cv: `${import.meta.env.BASE_URL}cv/Omar_Reyes_CV.pdf`,
};

export const about = {
  text:
    'Desarrollador de software multiplataforma con más de 4 años de experiencia en TI. ' +
    'Me especializo en arquitecturas Offline‑First, en integrar modelos de IA locales y en ' +
    'construir sistemas fiables con una buena experiencia de usuario. Disfruto los problemas ' +
    'que, como un cubo de Rubik, se resuelven con método y paciencia.',
  interests: ['Cubo de Rubik', 'Café', 'Música', 'Anime', 'IA aplicada'],
};

export const career = {
  experience: {
    role: 'Service Desk',
    org: 'Antlia Systems',
    period: 'Ene 2023 — Presente',
    text: 'Gestión de incidentes técnicos, mantenimiento de la base de conocimiento interna y mejora de procesos.',
  },
  education: {
    role: 'Ingeniería en Tecnologías de la Información',
    org: 'Universidad Tecnológica de Tijuana',
    period: 'Sep 2024 — Presente',
  },
  languages: [
    ['Español', 'Nativo'],
    ['Inglés', 'C1'],
  ],
  other: {
    name: 'Sistema de Gestión de Laboratorios',
    text: 'API y panel web en Django, con app móvil en Flutter para la gestión de recursos.',
    stack: ['Python', 'Django', 'PostgreSQL', 'Flutter', 'Render'],
  },
};

// formation: forma que adopta el cubo mientras se presenta el proyecto (ver three/formations.js)
export const projects = [
  {
    id: 'meido',
    name: 'M.E.I.D.O',
    mono: 'M',
    year: '2025',
    tagline: 'Asistente de IA autónomo para el escritorio.',
    text: 'Asistente local para Arch Linux + Hyprland con voz, memoria a largo plazo y capacidad de actuar sobre el sistema.',
    flow: ['Voz', 'Whisper', 'LLM', 'Herramientas', 'Convex', 'Móvil'],
    features: [
      'Function calling agéntico: lee y escribe código, ejecuta comandos de forma segura',
      'Voz local en GPU (Faster‑Whisper) y síntesis de voz (XTTS‑v2 / ElevenLabs)',
      'GUI asíncrona con PyQt6 y aiohttp',
      'Memoria compartida con el móvil; Gmail, Calendar y Spotify',
    ],
    stack: ['Python', 'PyQt6', 'aiohttp', 'FastAPI', 'Convex', 'Whisper'],
    status: 'En desarrollo activo',
    repo: null,
    formation: 'explode',
  },
  {
    id: 'meido-movil',
    name: 'Meido Móvil',
    mono: 'MM',
    year: '2026',
    tagline: 'El asistente, en el bolsillo.',
    text: 'App Android que funciona de forma independiente y sincroniza chat y recordatorios con el escritorio en tiempo real.',
    flow: ['QR', 'App', 'OpenRouter', 'Convex', 'Escritorio'],
    features: [
      'Configuración inicial por QR desde el PC',
      'Activación por voz y modo sin conexión: alarmas, temporizadores, música',
      'Aprobaciones por PIN y actualizaciones automáticas',
    ],
    stack: ['Flutter', 'Dart', 'Convex', 'Android'],
    status: 'En desarrollo activo',
    repo: null,
    formation: 'phone',
  },
  {
    id: 'mitpad',
    name: 'Mitpad',
    mono: 'Mp',
    year: '2026',
    tagline: 'Notas Offline‑First con sincronización en la nube.',
    text: 'Aplicación de escritorio de notas que funciona primero sin conexión y sincroniza cuando puede, sin perder datos tras un corte.',
    flow: ['SQLite local', 'Cola de sync', 'Convex'],
    features: [
      'Cola de sincronización local con mutaciones idempotentes',
      'Visualización de relaciones entre notas con gráficos interactivos',
      'Validación de token en el backend',
    ],
    stack: ['Rust', 'Tauri', 'SvelteKit', 'TypeScript', 'SQLite', 'Convex'],
    status: 'En desarrollo activo',
    repo: null,
    formation: 'sheet',
  },
  {
    id: 'autum',
    name: 'Autum',
    subtitle: 'Automated Ticket Utility Manager',
    logo: `${import.meta.env.BASE_URL}logos/autum.svg`,
    year: '2026',
    tagline: 'Ningún ticket sin atender.',
    text: 'Monitor de tickets sin asignar para ManageEngine ServiceDesk Plus Cloud. Avisa por Telegram y lo sigue recordando hasta que alguien confirma, incluso de madrugada.',
    flow: ['ServiceDesk Plus', 'Playwright', 'Telegram', 'Enterado'],
    roadmap: [
      { phase: 'Pre‑fase', state: 'Actual', current: true, text: 'Revisión de la bandeja cada minuto; aviso en Telegram con botón «Enterado» que insiste hasta la confirmación.' },
      { phase: 'Fase 1', state: 'En desarrollo', text: 'App de escritorio con Tauri (Rust + Vue 3), toma y respuesta automática de tickets, historial en PostgreSQL y reportes diarios a M.E.I.D.O.' },
      { phase: 'Fase 2', state: 'Planeada', text: 'Triage con IA para clasificar, resumir y priorizar; memoria semántica con pgvector para sugerir resoluciones.' },
    ],
    stack: ['Node.js', 'Playwright', 'Telegram Bot API', 'Tauri', 'Rust', 'PostgreSQL'],
    status: 'Pre‑fase en uso',
    repo: 'https://github.com/MickSenpai/autum',
    formation: 'leaves',
  },
  {
    id: 'cosechia',
    name: 'CosechIA',
    mono: 'C',
    year: '2026',
    label: 'Proyecto académico · Estadías',
    tagline: 'Gestión vinícola asistida por IA.',
    text: 'Plataforma para bodegas con panel de control, ciclos fenológicos, bitácoras, clima y un agente de IA con memoria.',
    flow: ['Laravel', 'Inertia', 'Vue', 'Agente IA', 'Embeddings'],
    features: [
      'Paneles por rol: administración y viticultura',
      'Modelo de dominio completo: bodegas, lotes, vinos, ciclos y bitácoras',
      'Agente de IA con respuestas citadas mediante embeddings',
      'Pruebas con Pest y análisis estático',
    ],
    stack: ['PHP', 'Laravel', 'Vue', 'Inertia', 'Tailwind', 'SQLite'],
    status: 'En desarrollo activo',
    repo: null,
    formation: 'rows',
  },
];

export const stack = [
  ['Lenguajes', ['Python', 'Rust', 'JavaScript', 'TypeScript', 'Dart', 'Java', 'C#', 'PHP', 'SQL']],
  ['Frameworks', ['Django', 'Laravel', 'Tauri', 'Flutter', 'PyQt6', 'SvelteKit', 'Vue', 'Three.js']],
  ['Datos y nube', ['PostgreSQL', 'SQLite', 'Supabase', 'Convex', 'Neon', 'Render']],
  ['IA', ['LLMs', 'Whisper', 'Embeddings', 'OpenRouter']],
  ['Arquitectura', ['REST', 'HTTP APIs', 'Offline‑First']],
  ['Herramientas', ['Git / GitHub', 'Linux (Arch)']],
];

// Una línea de Meido por capítulo (mismo orden que los capítulos en ui/render.js)
export const meidoLines = [
  'Hola. Soy Meido.',
  'Soy la asistente de IA de Omar, y también una pieza de este cubo. Hoy te presento su trabajo.',
  'Él es Omar Reyes, aunque le gusta que lo llamen Mick. Construye de punta a punta: de los datos a la interfaz.',
  'Trabaja en Service Desk desde 2023 y estudia Ingeniería en TI. De ese día a día nació Autum.',
  'Este proyecto soy yo. Vivo en su escritorio: escucho, recuerdo y actúo sobre el sistema.',
  'Mi versión móvil. Funciono sin el PC y sincronizo todo con el escritorio en tiempo real.',
  'Mitpad funciona primero sin conexión y sincroniza con la nube cuando puede.',
  'Autum vigila los tickets sin asignar y no deja de avisar hasta que alguien responde. Lo que sigue: escritorio e IA.',
  'CosechIA nació en sus estadías: gestión vinícola con un agente de IA que cita sus fuentes.',
  'Estas son las herramientas con las que trabaja.',
  'Si quieres hablar con Mick, aquí lo encuentras. Yo vuelvo a mi lugar.',
];
