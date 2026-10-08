import { person, about, career, projects, stack, ui } from '../content.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const tags = (list) => `<ul class="tags">${list.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

// Definición de capítulos: id, etiqueta de navegación y forma del cubo
export const chapters = [
  { id: 'inicio', label: ui.chapters.inicio, formation: 'assembled' },
  { id: 'guia', label: ui.chapters.guia, formation: 'assembled', turns: 2 },
  { id: 'sobre-mi', label: ui.chapters['sobre-mi'], formation: 'burst' },
  { id: 'trayectoria', label: ui.chapters.trayectoria, formation: 'stairs' },
  ...projects.map((p) => ({ id: p.id, label: p.name, formation: p.formation, project: true })),
  { id: 'stack', label: ui.chapters.stack, formation: 'wall' },
  { id: 'contacto', label: ui.chapters.contacto, formation: 'solved' },
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
    <p class="eyebrow">${esc(ui.intro.eyebrow)}</p>
    <h1 id="inicio-title" class="display">${esc(person.name)}</h1>
    <p class="lead">${esc(person.role)}</p>
    <p class="meta">${esc(person.location)}</p>
    <div class="actions">
      <a class="btn btn-solid" href="#${projects[0].id}" data-goto="${projects[0].id}">${esc(ui.intro.projects)}</a>
      <a class="btn btn-ghost" href="${person.cv}" download>${esc(ui.intro.cv)}</a>
    </div>
    <div class="scroll-hint" aria-hidden="true"><span></span></div>`, 'chapter-intro');
}

function meidoIntro() {
  return chapter(1, `
    <p class="eyebrow">${esc(ui.guide.eyebrow)}</p>
    <h2 id="guia-title" class="title">${esc(ui.guide.title)}</h2>
    <p class="body">${esc(ui.guide.text)}</p>`);
}

function aboutCh() {
  return chapter(2, `
    <p class="eyebrow">${esc(ui.about.eyebrow)}</p>
    <h2 id="sobre-mi-title" class="title">${esc(ui.about.title)}</h2>
    <p class="body">${esc(about.text)}</p>
    <p class="label">${esc(ui.about.outside)}</p>
    <p class="interests">${about.interests.map(esc).join('<span aria-hidden="true"> · </span>')}</p>`);
}

function careerCh() {
  const { experience, education: e, languages, other } = career;
  return chapter(3, `
    <p class="eyebrow">${esc(ui.career.eyebrow)}</p>
    <h2 id="trayectoria-title" class="title">${esc(ui.career.title)}</h2>
    <div class="career">
      <div class="career-item">
        <p class="label">${esc(ui.career.experience)}</p>
        ${experience.map((x) => `
        <h3>${esc(x.role)} <span class="muted">· ${esc(x.org)}</span></h3>
        <p class="period">${esc(x.period)}</p>
        <p class="small">${esc(x.text)}</p>`).join('')}
      </div>
      <div class="career-item">
        <p class="label">${esc(ui.career.education)}</p>
        <h3>${esc(e.role)}</h3>
        <p class="period">${esc(e.org)} · ${esc(e.period)}</p>
      </div>
      <div class="career-item">
        <p class="label">${esc(ui.career.languages)}</p>
        <p class="small">${languages.map(([l, lv]) => `${esc(l)} <span class="muted">(${esc(lv)})</span>`).join(' · ')}</p>
      </div>
      <div class="career-item">
        <p class="label">${esc(ui.career.other)}</p>
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
    ? `<a class="link" href="${p.repo}" target="_blank" rel="noopener noreferrer">${esc(ui.project.code)}</a>`
    : `<span class="private">${esc(ui.project.private)}</span>`;
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
      <p class="flow" aria-label="${esc(ui.project.flow)}: ${esc(p.flow.join(', '))}">${p.flow.map(esc).join('<span aria-hidden="true">→</span>')}</p>
      ${detail}
      ${tags(p.stack)}
      <footer class="project-foot">
        <span class="status">${esc(p.status)}</span>
        <span class="foot-actions">${repo}<button class="demo-btn" type="button" data-demo="${p.id}" aria-haspopup="dialog">${esc(ui.project.demo)}</button></span>
      </footer>
    </article>`, 'chapter-project');
}

function stackCh() {
  return chapter(9, `
    <p class="eyebrow">${esc(ui.stack.eyebrow)}</p>
    <h2 id="stack-title" class="title">${esc(ui.stack.title)}</h2>
    <div class="stack">
      ${stack.map(([g, items]) => `<div><p class="label">${esc(g)}</p><ul>${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>`).join('')}
    </div>`);
}

function contactCh() {
  return chapter(10, `
    <p class="eyebrow">${esc(ui.contact.eyebrow)}</p>
    <h2 id="contacto-title" class="title display-sm">${ui.contact.title}</h2>
    <ul class="contact">
      <li><a href="mailto:${person.email}">${esc(person.email)}</a></li>
      <li><a href="${person.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a></li>
      <li><a href="${person.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li>
      <li><a href="${person.cv}" download>${esc(ui.contact.cv)}</a></li>
    </ul>
    <p class="meta">© 2026 ${esc(person.name)}</p>`, 'chapter-contact');
}

export function renderPage(root, nav) {
  root.innerHTML = [intro(), meidoIntro(), aboutCh(), careerCh(), ...projects.map(projectCh), stackCh(), contactCh()].join('');
  nav.innerHTML = chapters
    .map((c, i) => `<li><a href="#${c.id}" data-goto="${c.id}" data-index="${i}"><span class="nav-label">${esc(c.label)}</span><span class="dot"></span></a></li>`)
    .join('');
}
