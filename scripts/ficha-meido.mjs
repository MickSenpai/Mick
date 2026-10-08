// Genera convex/ficha.ts: lo que la Meido pública sabe de Omar, sacado de src/content.js
// para que nunca se desincronice del portafolio. Solo en inglés: con la ficha también en
// español, Meido tendía a pasarse al español; traduce ella cuando le escriben en español.
//   node scripts/ficha-meido.mjs        (también corre antes de `npm run convex:deploy`)
import { writeFileSync } from 'node:fs';
import { createServer } from 'vite';

// i18n.js lee el idioma de la URL y de localStorage al cargarse
globalThis.localStorage = { getItem: () => null, setItem() {} };

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });

async function contenido(lang) {
  globalThis.window = { location: { search: `?lang=${lang}` } };
  server.moduleGraph.invalidateAll();
  return server.ssrLoadModule('/src/content.js');
}

const lista = (xs) => xs.map((x) => `  - ${x}`).join('\n');

function ficha({ person, about, career, projects, stack }) {
  const proyectos = projects.map((p) => {
    const partes = [
      `### ${p.name}${p.subtitle ? ` (${p.subtitle})` : ''} — ${p.year}`,
      p.label ? `${p.label}.` : '',
      `${p.tagline} ${p.text}`,
      p.features ? lista(p.features) : '',
      p.roadmap ? lista(p.roadmap.map((r) => `${r.phase} (${r.state}): ${r.text}`)) : '',
      `Stack: ${p.stack.join(', ')}. ${p.status}.${p.repo ? ` Code: ${p.repo}` : ''}`,
    ];
    return partes.filter(Boolean).join('\n');
  });
  return [
    `# ${person.fullName} (${person.nickname}) — ${person.role}, ${person.location}`,
    about.text,
    `Interests: ${about.interests.join(', ')}.`,
    '## Experience',
    lista(career.experience.map((e) => `${e.role} · ${e.org} · ${e.period}: ${e.text}`)),
    `## Education\n${lista([`${career.education.role} · ${career.education.org} · ${career.education.period}`])}`,
    `## Languages\n${lista(career.languages.map(([l, n]) => `${l}: ${n}`))}`,
    `## Other project\n${career.other.name}: ${career.other.text} (${career.other.stack.join(', ')})`,
    '## Projects',
    ...proyectos,
    `## Stack\n${lista(stack.map(([grupo, xs]) => `${grupo}: ${xs.join(', ')}`))}`,
    `## Links\n${lista([`GitHub: ${person.github}`, `LinkedIn: ${person.linkedin}`, 'Portfolio: https://micksenpai.github.io/Mick/'])}`,
  ].join('\n\n');
}

try {
  const en = ficha(await contenido('en'));
  const salida =
    '// GENERADO por scripts/ficha-meido.mjs desde src/content.js. No editar a mano.\n' +
    `export const FICHA_EN = ${JSON.stringify(en)};\n`;
  writeFileSync(new URL('../convex/ficha.ts', import.meta.url), salida);
  console.log(`convex/ficha.ts: ${en.length} caracteres`);
} finally {
  await server.close();
}
