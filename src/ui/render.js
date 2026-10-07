import { person, about, career, projects, stack } from '../content.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const tags = (list) => `<ul class="tags">${list.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

// Definición de capítulos: id, etiqueta de navegación y forma del cubo
export const chapters = [
  { id: 'inicio', label: 'Inicio', formation: 'assembled' },
  { id: 'guia', label: 'Meido', formation: 'assembled', turns: 2 },
  { id: 'sobre-mi', label: 'Sobre mí', formation: 'burst' },
  { id: 'trayectoria', label: 'Trayectoria', formation: 'stairs' },
  ...projects.map((p) => ({ id: p.id, label: p.name, formation: p.formation, project: true })),
  { id: 'stack', label: 'Stack', formation: 'wall' },
  { id: 'contacto', label: 'Contacto', formation: 'solved' },
];

function chapter(i, inner, cls = '') {
  const c = chapters[i];
  return `
  <section class="chapter ${cls}" id="${c.id}" data-index="${i}" aria-labelledby="${c.id}-title">
    <div class="sticky"><div class="chapter-inner">${inner}</div></div>
  </section>`;
}

function intro() {
  return chapter(0, `
    <p class="eyebrow">Portfolio — 2026</p>
    <h1 id="inicio-title" class="display">${esc(person.name)}</h1>
    <p class="lead">${esc(person.role)}</p>
    <p class="meta">${esc(person.location)}</p>
    <div class="actions">
      <a class="btn btn-solid" href="#${projects[0].id}" data-goto="${projects[0].id}">Ver proyectos</a>
      <a class="btn btn-ghost" href="${person.cv}" download>Descargar CV</a>
    </div>
    <div class="scroll-hint" aria-hidden="true"><span></span></div>`, 'chapter-intro');
}

function meidoIntro() {
  return chapter(1, `
    <p class="eyebrow">01 — Guía</p>
    <h2 id="guia-title" class="title">Una pieza del cubo</h2>
    <p class="body">Meido es la asistente de IA que Omar construyó, y también una de las piezas de este cubo. Hoy guía este recorrido.</p>`);
}

function aboutCh() {
  return chapter(2, `
    <p class="eyebrow">02 — Perfil</p>
    <h2 id="sobre-mi-title" class="title">Sobre mí</h2>
    <p class="body">${esc(about.text)}</p>
    <p class="label">Fuera del código</p>
    <p class="interests">${about.interests.map(esc).join('<span aria-hidden="true"> · </span>')}</p>`);
}

function careerCh() {
  const { experience: x, education: e, languages, other } = career;
  return chapter(3, `
    <p class="eyebrow">03 — Trayectoria</p>
    <h2 id="trayectoria-title" class="title">Trayectoria</h2>
    <div class="career">
      <div class="career-item">
        <p class="label">Experiencia</p>
        <h3>${esc(x.role)} <span class="muted">· ${esc(x.org)}</span></h3>
        <p class="period">${esc(x.period)}</p>
        <p class="small">${esc(x.text)}</p>
      </div>
      <div class="career-item">
        <p class="label">Educación</p>
        <h3>${esc(e.role)}</h3>
        <p class="period">${esc(e.org)} · ${esc(e.period)}</p>
      </div>
      <div class="career-item">
        <p class="label">Idiomas</p>
        <p class="small">${languages.map(([l, lv]) => `${esc(l)} <span class="muted">(${esc(lv)})</span>`).join(' · ')}</p>
      </div>
      <div class="career-item">
        <p class="label">Otros proyectos</p>
        <h3>${esc(other.name)}</h3>
        <p class="small">${esc(other.text)}</p>
        ${tags(other.stack)}
      </div>
    </div>`);
}

function projectCh(p, n) {
  const mark = p.logo
    ? `<img class="logo" src="${p.logo}" alt="" width="44" height="44">`
    : `<span class="mono-mark" aria-hidden="true">${esc(p.mono)}</span>`;
  const detail = p.roadmap
    ? `<ol class="roadmap">${p.roadmap
        .map((r) => `<li class="${r.current ? 'current' : ''}"><p class="rm-head">${esc(r.phase)} <span>· ${esc(r.state)}</span></p><p class="small">${esc(r.text)}</p></li>`)
        .join('')}</ol>`
    : `<ul class="features">${p.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>`;
  const repo = p.repo
    ? `<a class="link" href="${p.repo}" target="_blank" rel="noopener noreferrer">Ver código ↗</a>`
    : `<span class="private">Repositorio privado</span>`;
  return chapter(4 + n, `
    <article class="project">
      <header class="project-head">
        ${mark}
        <div>
          <p class="eyebrow">${String(n + 1).padStart(2, '0')} — ${esc(p.year)}${p.label ? ` · ${esc(p.label)}` : ''}</p>
          <h2 id="${p.id}-title" class="title">${esc(p.name)}</h2>
          ${p.subtitle ? `<p class="subtitle">${esc(p.subtitle)}</p>` : ''}
        </div>
      </header>
      <p class="tagline">${esc(p.tagline)}</p>
      <p class="small">${esc(p.text)}</p>
      <p class="flow" aria-label="Flujo: ${esc(p.flow.join(', '))}">${p.flow.map(esc).join('<span aria-hidden="true">→</span>')}</p>
      ${detail}
      ${tags(p.stack)}
      <footer class="project-foot">
        <span class="status">${esc(p.status)}</span>
        <span class="foot-actions">${repo}<button class="demo-btn" type="button" data-demo="${p.id}" aria-haspopup="dialog">Probar demo</button></span>
      </footer>
    </article>`, 'chapter-project');
}

function stackCh() {
  return chapter(9, `
    <p class="eyebrow">09 — Herramientas</p>
    <h2 id="stack-title" class="title">Stack</h2>
    <div class="stack">
      ${stack.map(([g, items]) => `<div><p class="label">${esc(g)}</p><ul>${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>`).join('')}
    </div>`);
}

function contactCh() {
  return chapter(10, `
    <p class="eyebrow">10 — Contacto</p>
    <h2 id="contacto-title" class="title display-sm">¿Construimos algo <em>juntos</em>?</h2>
    <ul class="contact">
      <li><a href="mailto:${person.email}">${esc(person.email)}</a></li>
      <li><a href="${person.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
      <li><a href="${person.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li>
      <li><a href="${person.cv}" download>Descargar CV ↓</a></li>
    </ul>
    <p class="meta">© 2026 ${esc(person.name)}</p>`, 'chapter-contact');
}

export function renderPage(root, nav) {
  root.innerHTML = [intro(), meidoIntro(), aboutCh(), careerCh(), ...projects.map(projectCh), stackCh(), contactCh()].join('');
  nav.innerHTML = chapters
    .map((c, i) => `<li><a href="#${c.id}" data-goto="${c.id}" data-index="${i}"><span class="nav-label">${esc(c.label)}</span><span class="dot"></span></a></li>`)
    .join('');
}
