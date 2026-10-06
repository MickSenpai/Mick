// Burbuja de Meido: efecto máquina de escribir y posición junto a Meido.
export function createNarrator(el, { reduced = false } = {}) {
  const typed = el.querySelector('#bubble-typed');
  const full = el.querySelector('#bubble-full');
  let text = '';
  let shown = 0;
  let acc = 0;
  let startAt = 0;
  const CPS = 38; // caracteres por segundo
  const pos = { x: -9999, y: -9999, below: false };

  function say(next, delayMs = 0) {
    if (next === text) return;
    text = next;
    shown = 0;
    acc = 0;
    startAt = performance.now() + delayMs;
    typed.textContent = '';
    full.textContent = text; // lectores de pantalla reciben la frase completa
    el.classList.remove('done');
    el.classList.toggle('visible', delayMs === 0);
    if (reduced) {
      shown = text.length;
      typed.textContent = text;
      el.classList.add('done');
    }
  }

  // anchor: posición en pantalla de Meido; sizePx: su tamaño aparente
  function update(dt, now, anchor, sizePx, mobile) {
    if (now >= startAt && text) el.classList.add('visible');
    if (!reduced && now >= startAt && shown < text.length) {
      acc += dt * CPS;
      const n = Math.min(text.length, shown + Math.floor(acc));
      if (n !== shown) {
        acc -= n - shown;
        shown = n;
        typed.textContent = text.slice(0, shown);
        if (shown === text.length) el.classList.add('done');
      }
    }
    if (mobile) return; // en móvil la burbuja va fija abajo (CSS)

    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const vw = window.innerWidth;
    let x = anchor.x - 24;
    let y = anchor.y - sizePx / 2 - 16 - h;
    let below = false;
    if (y < 84) {
      y = anchor.y + sizePx / 2 + 16;
      below = true;
    }
    x = Math.max(16, Math.min(vw - w - 96, x)); // 96: deja libre la navegación lateral
    // suavizado para que la burbuja no tiemble mientras Meido flota
    const k = 1 - Math.exp(-14 * dt);
    pos.x = pos.x < -9000 ? x : pos.x + (x - pos.x) * k;
    pos.y = pos.y < -9000 ? y : pos.y + (y - pos.y) * k;
    if (below !== pos.below) {
      pos.below = below;
      el.classList.toggle('below', below);
    }
    el.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
  }

  return { say, update };
}
