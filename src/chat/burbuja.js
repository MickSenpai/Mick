// Botón «Habla con Meido» del portafolio. El chat (y el cliente de Convex) se descarga solo
// al abrirlo, para no hacer más lento el sitio.
import { ui } from '../content.js';
import './burbuja.css';

export function crearBurbujaChat({ onOpen = () => {}, onClose = () => {} } = {}) {
  const lanzar = document.createElement('button');
  lanzar.type = 'button';
  lanzar.className = 'chat-lanzar';
  lanzar.setAttribute('aria-haspopup', 'dialog');
  lanzar.innerHTML = '<span class="chat-punto" aria-hidden="true"></span>';
  lanzar.append(ui.chat.open);
  document.body.append(lanzar);

  let panel = null;
  let abierto = false;

  // En móvil la burbuja de Meido va fija abajo: el botón se coloca encima de ella
  const narrador = document.getElementById('bubble');
  if (narrador && 'ResizeObserver' in window) {
    new ResizeObserver(() => {
      document.documentElement.style.setProperty('--narrador-h', `${narrador.offsetHeight}px`);
    }).observe(narrador);
  }

  async function construir() {
    const { crearAvatar, montarChat } = await import('./chat.js');
    const p = document.createElement('div');
    p.className = 'chat-panel';
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-label', ui.chat.open);
    p.innerHTML = `
      <div class="chat-cabeza">
        <div class="chat-cara" aria-hidden="true"></div>
        <div class="chat-quien"><strong>Meido</strong><span></span></div>
        <a class="chat-completa" href="${import.meta.env.BASE_URL}meido/?de=portafolio" target="_blank" rel="noopener"></a>
        <button type="button" class="chat-cerrar" aria-label="">×</button>
      </div>
      <div class="chat-cuerpo"></div>`;
    p.querySelector('.chat-quien span').textContent = ui.chat.sub;
    p.querySelector('.chat-completa').textContent = ui.chat.full;
    p.querySelector('.chat-cerrar').setAttribute('aria-label', ui.chat.close);
    p.querySelector('.chat-cerrar').addEventListener('click', cerrar);
    document.body.append(p);
    const avatar = crearAvatar(p.querySelector('.chat-cara'));
    const chat = montarChat(p.querySelector('.chat-cuerpo'), { de: 'portafolio', avatar });
    return { el: p, chat };
  }

  async function abrir() {
    if (abierto) return;
    abierto = true;
    lanzar.classList.add('cargando');
    try {
      panel ??= await construir();
    } catch {
      abierto = false;
      lanzar.classList.remove('cargando');
      return;
    }
    lanzar.classList.remove('cargando');
    panel.el.classList.add('abierto');
    lanzar.hidden = true;
    lanzar.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('chat-abierto');
    onOpen();
    panel.chat.enfocar();
  }

  function cerrar() {
    if (!abierto) return;
    abierto = false;
    panel?.el.classList.remove('abierto');
    lanzar.hidden = false;
    lanzar.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('chat-abierto');
    onClose();
    lanzar.focus();
  }

  lanzar.addEventListener('click', abrir);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && abierto) cerrar();
  });
  // Enlaces «Habla con Meido» del sitio: abren el panel en vez de irse a la otra página
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('[data-chat-abrir]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    abrir();
  });

  return { abrir, cerrar };
}
