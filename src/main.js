import * as THREE from 'three';
import './styles.css';
import { createStage } from './three/stage.js';
import { createCube } from './three/cube.js';
import { createMeido } from './three/meido.js';
import { createNarrator } from './ui/narrator.js';
import { renderPage, chapters } from './ui/render.js';
import { meidoLines } from './content.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const flowQuery = window.matchMedia('(max-width: 900px), (max-height: 680px)');

renderPage(document.getElementById('content'), document.getElementById('chapter-nav'));

const stage = createStage(document.getElementById('bg'), document.getElementById('fg'));
const cube = createCube(stage.bgScene, { reduced });
const meido = createMeido(stage.fgScene, cube, cube.pieceSize, { reduced });
const narrator = createNarrator(document.getElementById('bubble'), { reduced });

const sections = [...document.querySelectorAll('.chapter')];
const inners = sections.map((s) => s.querySelector('.chapter-inner'));
const navLinks = [...document.querySelectorAll('#chapter-nav a')];
const header = document.querySelector('.site-header');
const bubbleEl = document.getElementById('bubble');
const LAST = chapters.length - 1;

let active = -1;
let detached = false;
const tmp = new THREE.Vector3();

// ---------- composición: dónde va el cubo y dónde va Meido ----------
function cubeLayout(i) {
  const { w, h, upp } = stage.view;
  const mobile = w <= 900;
  const flow = flowQuery.matches;
  let x, y, px, dim;
  if (mobile) {
    // inicio: cubo arriba (el texto va abajo); contacto: cubo abajo (el texto va arriba)
    const hero = i === 0 || i === LAST;
    x = w / 2;
    y = i === 0 ? h * 0.3 : i === LAST ? h * 0.72 : h * 0.42;
    px = hero ? Math.min(w * 0.42, h * 0.22) : Math.min(w * 0.62, h * 0.36);
    dim = hero ? 1 : 0.3;
  } else {
    x = w * 0.73;
    y = h * 0.53;
    px = Math.min(w * 0.24, h * 0.42);
    dim = flow ? 0.6 : 1;
  }
  stage.screenToWorld(x, y, tmp);
  return { x: tmp.x, y: tmp.y, scale: (px * upp) / cube.extent, dim, px, sx: x };
}

function meidoLayout(i) {
  const { w, h, upp } = stage.view;
  if (w <= 900) {
    // móvil: avatar pegado a la burbuja fija inferior
    const bh = bubbleEl.offsetHeight || 64;
    const sizePx = 34;
    stage.screenToWorld(16 + 30, h - 16 - bh / 2, tmp);
    return { pos: tmp.clone(), scale: (sizePx * upp) / cube.pieceSize, sizePx };
  }
  const rect = inners[i].getBoundingClientRect();
  const c = cubeLayout(i);
  const cubeLeft = c.sx - c.px * 0.75;
  const sizePx = 58;
  let x = rect.right + 72;
  if (x > cubeLeft - 48) x = (rect.right + cubeLeft) / 2;
  const y = Math.min(Math.max(rect.top + rect.height * 0.55, 220), h - 120);
  stage.screenToWorld(x, y, tmp);
  return { pos: tmp.clone(), scale: (sizePx * upp) / cube.pieceSize, sizePx };
}

// ---------- capítulos ----------
function setActive(i) {
  if (i === active) return;
  active = i;
  sections.forEach((s, idx) => s.classList.toggle('active', idx === i));
  navLinks.forEach((a, idx) => (idx === i ? a.setAttribute('aria-current', 'step') : a.removeAttribute('aria-current')));

  const ch = chapters[i];
  cube.setFormation(ch.formation, { turns: ch.turns || 0 });

  if (!detached) return; // la intro todavía no termina
  if (i === LAST) meido.dock();
  else {
    const m = meidoLayout(i);
    meido.goTo(m.pos, m.scale);
  }
  narrator.say(meidoLines[i], reduced ? 0 : 350);
}

function currentChapter() {
  const probe = window.scrollY + window.innerHeight * 0.45;
  let idx = 0;
  for (let i = 0; i < sections.length; i++) if (sections[i].offsetTop <= probe) idx = i;
  // al llegar al final de la página, el último capítulo siempre está activo
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) idx = LAST;
  return idx;
}

function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 8);
  setActive(currentChapter());
}
window.addEventListener('scroll', onScroll, { passive: true });

// navegación interna con scroll suave
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-goto]');
  if (!a) return;
  const target = document.getElementById(a.dataset.goto);
  if (!target) return;
  e.preventDefault();
  window.scrollTo({ top: target.offsetTop, behavior: reduced ? 'auto' : 'smooth' });
  history.replaceState(null, '', `#${a.dataset.goto}`);
});

// ---------- puntero ----------
window.addEventListener('pointermove', (e) => {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -((e.clientY / window.innerHeight) * 2 - 1);
  cube.setPointer(x, y);
  meido.setPointer(x, y);
}, { passive: true });

// ---------- tamaño ----------
window.addEventListener('resize', () => {
  stage.resize();
  onScroll();
});

// ---------- intro: Meido despierta y se desprende ----------
onScroll();
cube.update(0, performance.now(), cubeLayout(Math.max(active, 0)));
meido.snapToSlot();
narrator.say(meidoLines[active], reduced ? 0 : 1900);
window.setTimeout(() => {
  detached = true;
  narrator.say(meidoLines[active]);
  if (active === LAST) return; // si la visita empieza en contacto, se queda en su sitio
  const m = meidoLayout(active);
  meido.goTo(m.pos, m.scale);
}, reduced ? 0 : 1200);

// ---------- bucle ----------
let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  if (document.hidden) {
    last = now;
    return;
  }
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  const idx = Math.max(active, 0);
  cube.update(dt, now, cubeLayout(idx));
  if (detached && meido.mode !== 'docked' && !(meido.mode === 'flying' && idx === LAST)) {
    const m = meidoLayout(idx);
    meido.retarget(m.pos, m.scale);
  }
  meido.update(dt, now);
  // tamaño aparente real de Meido (girado ocupa ~1.4 veces su lado)
  const sizePx = (meido.group.scale.x * cube.pieceSize * 1.4) / stage.view.upp;
  narrator.update(dt, now, stage.worldToScreen(meido.group.position), sizePx, stage.view.w <= 900);
  stage.render();
}
requestAnimationFrame(frame);
