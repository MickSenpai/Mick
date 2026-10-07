import './meido-movil.css';
import data from './meido-frames.json';
import { interpretar, horaFecha } from './offline.js';

const SUGERENCIAS = [
  '¿Qué hora es?',
  'Pon un temporizador de 5 minutos',
  'Alarma a las 7 y media de la mañana',
  'Enciende la linterna',
  'Sube el volumen',
  'Cuéntame un chiste',
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function mount(root) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.innerHTML = `
    <div class="mmdemo">
      <div class="mm-phone" aria-label="Teléfono simulado">
        <div class="mm-top">
          <div class="mm-avatar" aria-hidden="true"></div>
          <div><p class="mm-name">M.E.I.D.O</p><p class="mm-estado">reposo</p></div>
          <span class="mm-red" title="Sin conexión a Internet">Sin red</span>
        </div>
        <div class="mm-chat" role="log" aria-live="polite"></div>
        <div class="mm-chips"></div>
        <form class="mm-input">
          <input type="text" placeholder="Escribe una orden…" aria-label="Orden para Meido" maxlength="120" autocomplete="off">
          <button type="submit" aria-label="Enviar">↑</button>
        </form>
      </div>
      <aside class="mm-side">
        <p class="label">Qué estás viendo</p>
        <p class="small">Sin Internet no hay cerebro (OpenRouter), pero lo básico del teléfono no lo necesita: la app entiende las órdenes comunes con reglas simples y las convierte en la misma herramienta que habría pedido el modelo.</p>
        <p class="label">Última herramienta</p>
        <pre class="mm-tool">—</pre>
        <p class="small muted">Lo que no entiende queda en espera: «Se contestará al volver la red».</p>
      </aside>
    </div>`;

  const chat = root.querySelector('.mm-chat');
  const chips = root.querySelector('.mm-chips');
  const form = root.querySelector('.mm-input');
  const input = form.querySelector('input');
  const tool = root.querySelector('.mm-tool');
  const avatar = root.querySelector('.mm-avatar');
  const estadoEl = root.querySelector('.mm-estado');

  let estado = 'reposo';
  let frame = 0;
  const timers = [];
  const pintar = () => {
    const st = data[estado];
    avatar.innerHTML = st.frames[reduced ? 0 : frame++ % st.frames.length];
  };
  const setEstado = (e) => {
    estado = e;
    frame = 0;
    estadoEl.textContent = e;
    estadoEl.style.color = data[e].color;
    pintar();
  };
  const anim = reduced ? 0 : setInterval(pintar, 1000 / 12);

  function burbuja(texto, quien, extra = '') {
    const b = document.createElement('div');
    b.className = `mm-msg ${quien}`;
    b.innerHTML = `<p>${esc(texto)}</p>${extra}`;
    chat.appendChild(b);
    chat.scrollTop = chat.scrollHeight;
  }

  function enviar(texto) {
    texto = texto.trim();
    if (!texto) return;
    burbuja(texto, 'yo');
    setEstado('pensando');
    timers.push(setTimeout(() => {
      const hora = horaFecha(texto);
      const orden = hora ? null : interpretar(texto);
      if (hora) {
        burbuja(hora, 'meido');
        tool.textContent = 'hora_fecha (respuesta local, sin modelo)';
        setEstado('hablando');
      } else if (orden) {
        burbuja(orden.respuesta, 'meido', `<code>${esc(orden.herramienta)}(${esc(JSON.stringify(orden.args))})</code>`);
        tool.textContent = `${orden.herramienta}(${JSON.stringify(orden.args, null, 1)})`;
        setEstado('hecho');
      } else {
        burbuja('Eso necesita el cerebro y ahora no hay red.', 'meido', '<span class="mm-wait">Se contestará al volver la red</span>');
        tool.textContent = 'null → necesita el modelo';
        setEstado('reposo');
      }
      timers.push(setTimeout(() => setEstado('reposo'), 1800));
    }, reduced ? 0 : 650));
  }

  chips.innerHTML = SUGERENCIAS.map((s) => `<button type="button">${esc(s)}</button>`).join('');
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) enviar(b.textContent);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    enviar(input.value);
    input.value = '';
  });

  burbuja('Sin conexión. Puedo con lo básico del teléfono: hora, alarmas, temporizadores, linterna, música, volumen y abrir apps.', 'meido');
  setEstado('reposo');

  return () => {
    clearInterval(anim);
    timers.forEach(clearTimeout);
  };
}
