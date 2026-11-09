import './meshingup.css';
import { pick } from '../i18n.js';

// Brazo con IK planar de dos huesos (misma idea que el editor) sobre un personaje de formas simples
const T = pick({
  en: {
    stage: 'Character preview', state: 'Reactive state', states: { idle: 'idle', listen: 'listening', think: 'thinking', speak: 'speaking' },
    skel: 'Show skeleton', angles: 'Shoulder / elbow', reach: 'Reach', ok: 'solved', far: 'out of reach · clamped', hint: 'Drag the hand.',
  },
  es: {
    stage: 'Vista previa del personaje', state: 'Estado reactivo', states: { idle: 'reposo', listen: 'escucha', think: 'pensamiento', speak: 'habla' },
    skel: 'Mostrar esqueleto', angles: 'Hombro / codo', reach: 'Alcance', ok: 'resuelto', far: 'fuera de alcance · limitado', hint: 'Arrastra la mano.',
  },
});

const W = 400, H = 500;
const L1 = 120, L2 = 110; // húmero y antebrazo
const SHOULDER = { x: 262, y: 208 };

export function mount(root) {
  root.innerHTML = `
    <div class="mudemo">
      <div class="mu-stage"><canvas width="${W}" height="${H}" role="img" aria-label="${T.stage}. ${T.hint}"></canvas></div>
      <aside class="mu-side">
        <p class="label">${T.state}</p>
        <div class="mu-states">${Object.entries(T.states).map(([k, v]) => `<button type="button" data-st="${k}" aria-pressed="${k === 'idle'}">${v}</button>`).join('')}</div>
        <button class="mu-toggle" type="button" role="switch" aria-checked="true">${T.skel}</button>
        <div class="mu-read">
          <div>${T.angles}: <output class="o-ang"></output></div>
          <div>${T.reach}: <output class="o-reach"></output></div>
        </div>
      </aside>
    </div>`;
  const canvas = root.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let state = 'idle', skeleton = true, hand = { x: 335, y: 330 }, dragging = false, raf = 0;

  function solve(t) {
    const dx = t.x - SHOULDER.x, dy = t.y - SHOULDER.y;
    let d = Math.hypot(dx, dy);
    const clamped = d > L1 + L2 - 1 || d < Math.abs(L1 - L2) + 1;
    d = Math.min(L1 + L2 - 1, Math.max(Math.abs(L1 - L2) + 1, d));
    const a = Math.atan2(dy, dx);
    const cosE = (L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2);
    const elbowInner = Math.acos(Math.max(-1, Math.min(1, cosE)));
    const cosS = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d);
    const sh = a + Math.acos(Math.max(-1, Math.min(1, cosS))); // codo hacia abajo
    const elbow = { x: SHOULDER.x + Math.cos(sh) * L1, y: SHOULDER.y + Math.sin(sh) * L1 };
    const end = { x: SHOULDER.x + Math.cos(a) * d, y: SHOULDER.y + Math.sin(a) * d };
    return { elbow, end, clamped, sh, el: Math.PI - elbowInner, d };
  }

  function bone(a, b, w, color) {
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }

  function draw(now) {
    const t = now / 1000;
    const k = reduced ? 0 : 1;
    const breathe = Math.sin(t * 1.6) * 3 * k;
    const tilt = (state === 'listen' ? 0.14 : 0) + Math.sin(t * 0.8) * 0.02 * k;
    const lookUp = state === 'think' ? -8 : 0;
    const mouth = state === 'speak' ? (reduced ? 6 : 3 + Math.abs(Math.sin(t * 9)) * 7) : 2;
    const blink = !reduced && Math.sin(t * 1.1) > 0.985;
    const s = solve(hand);
    ctx.clearRect(0, 0, W, H);

    // piernas
    bone({ x: 185, y: 330 }, { x: 175, y: 450 }, 26, '#3a3a3a');
    bone({ x: 235, y: 330 }, { x: 245, y: 450 }, 26, '#3a3a3a');
    // brazo izquierdo (fijo)
    bone({ x: 150, y: 205 + breathe }, { x: 128, y: 300 }, 20, '#8a8a8a');
    // torso
    ctx.fillStyle = '#d8d8d8';
    ctx.beginPath(); ctx.roundRect(150, 190 + breathe, 120, 150, 26); ctx.fill();
    // cabeza
    ctx.save(); ctx.translate(210, 150 + breathe); ctx.rotate(tilt);
    ctx.fillStyle = '#efefef'; ctx.beginPath(); ctx.arc(0, 0, 48, 0, 7); ctx.fill();
    ctx.fillStyle = '#0d0d0d';
    const ey = -4 + lookUp * 0.4;
    if (blink) { ctx.fillRect(-22, ey, 14, 2); ctx.fillRect(8, ey, 14, 2); } else { ctx.beginPath(); ctx.arc(-15, ey, 5, 0, 7); ctx.arc(15, ey, 5, 0, 7); ctx.fill(); }
    ctx.beginPath(); ctx.ellipse(0, 22, 9, mouth / 2 + 1, 0, 0, 7); ctx.fill();
    ctx.restore();
    // brazo con IK (encima)
    bone(SHOULDER, s.elbow, 20, '#b5b5b5');
    bone(s.elbow, s.end, 18, '#b5b5b5');
    ctx.fillStyle = '#efefef'; ctx.beginPath(); ctx.arc(s.end.x, s.end.y, 14, 0, 7); ctx.fill();

    if (skeleton) {
      ctx.strokeStyle = '#6fa8ff'; ctx.fillStyle = '#6fa8ff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(SHOULDER.x, SHOULDER.y); ctx.lineTo(s.elbow.x, s.elbow.y); ctx.lineTo(s.end.x, s.end.y); ctx.stroke();
      for (const p of [SHOULDER, s.elbow, s.end]) { ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, 7); ctx.fill(); }
      ctx.strokeStyle = s.clamped ? '#ff9a6f' : '#6fa8ff'; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.arc(hand.x, hand.y, 12, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    }
    root.querySelector('.o-ang').textContent = `${Math.round((s.sh * 180) / Math.PI)}° / ${Math.round((s.el * 180) / Math.PI)}°`;
    root.querySelector('.o-reach').textContent = `${Math.round((s.d / (L1 + L2)) * 100)}% · ${s.clamped ? T.far : T.ok}`;
    raf = requestAnimationFrame(draw);
  }

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  }
  canvas.addEventListener('pointerdown', (e) => { dragging = true; canvas.setPointerCapture(e.pointerId); hand = pos(e); });
  canvas.addEventListener('pointermove', (e) => { if (dragging) hand = pos(e); });
  canvas.addEventListener('pointerup', () => { dragging = false; });
  root.querySelector('.mu-states').addEventListener('click', (e) => {
    const b = e.target.closest('[data-st]');
    if (!b) return;
    state = b.dataset.st;
    root.querySelectorAll('.mu-states button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  });
  const sw = root.querySelector('.mu-toggle');
  sw.addEventListener('click', () => { skeleton = !skeleton; sw.setAttribute('aria-checked', String(skeleton)); });

  raf = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(raf);
}
