import './meido-movil.css';
import data from './meido-frames.json';
import { interpretar, horaFecha } from './offline.js';
import { pick } from '../i18n.js';

const T = pick({
  en: {
    sugerencias: ['What time is it?', 'Set a timer for 5 minutes', 'Alarm at 7:30 am', 'Turn on the flashlight', 'Volume up', 'Tell me a joke'],
    telefono: 'Simulated phone', sinInternet: 'No Internet connection', sinRed: 'Offline',
    placeholder: 'Type a command…', ordenAria: 'Command for Meido', enviar: 'Send',
    viendo: 'What you’re seeing',
    explicacion: 'Without Internet there’s no brain (OpenRouter), but the phone basics don’t need it: the app understands common commands with simple rules and turns them into the same tool the model would have asked for.',
    ultima: 'Last tool',
    espera: 'Whatever it doesn’t understand is put on hold: «It will be answered when the connection is back».',
    horaLocal: 'hora_fecha (local answer, no model)',
    sinCerebro: 'That needs the brain and there’s no connection right now.',
    volvera: 'It will be answered when the connection is back',
    necesita: 'null → needs the model',
    estados: { reposo: 'idle', pensando: 'thinking', hablando: 'speaking', hecho: 'done' },
    saludo: 'Offline. I can handle the phone basics: time, alarms, timers, flashlight, music, volume and opening apps.',
  },
  es: {
    sugerencias: ['¿Qué hora es?', 'Pon un temporizador de 5 minutos', 'Alarma a las 7 y media de la mañana', 'Enciende la linterna', 'Sube el volumen', 'Cuéntame un chiste'],
    telefono: 'Teléfono simulado', sinInternet: 'Sin conexión a Internet', sinRed: 'Sin red',
    placeholder: 'Escribe una orden…', ordenAria: 'Orden para Meido', enviar: 'Enviar',
    viendo: 'Qué estás viendo',
    explicacion: 'Sin Internet no hay cerebro (OpenRouter), pero lo básico del teléfono no lo necesita: la app entiende las órdenes comunes con reglas simples y las convierte en la misma herramienta que habría pedido el modelo.',
    ultima: 'Última herramienta',
    espera: 'Lo que no entiende queda en espera: «Se contestará al volver la red».',
    horaLocal: 'hora_fecha (respuesta local, sin modelo)',
    sinCerebro: 'Eso necesita el cerebro y ahora no hay red.',
    volvera: 'Se contestará al volver la red',
    necesita: 'null → necesita el modelo',
    estados: {},
    saludo: 'Sin conexión. Puedo con lo básico del teléfono: hora, alarmas, temporizadores, linterna, música, volumen y abrir apps.',
  },
});

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function mount(root) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.innerHTML = `
    <div class="mmdemo">
      <div class="mm-phone" aria-label="${T.telefono}">
        <div class="mm-top">
          <div class="mm-avatar" aria-hidden="true"></div>
          <div><p class="mm-name">M.E.I.D.O</p><p class="mm-estado">${T.estados.reposo ?? 'reposo'}</p></div>
          <span class="mm-red" title="${T.sinInternet}">${T.sinRed}</span>
        </div>
        <div class="mm-chat" role="log" aria-live="polite"></div>
        <div class="mm-chips"></div>
        <form class="mm-input">
          <input type="text" placeholder="${T.placeholder}" aria-label="${T.ordenAria}" maxlength="120" autocomplete="off">
          <button type="submit" aria-label="${T.enviar}">↑</button>
        </form>
      </div>
      <aside class="mm-side">
        <p class="label">${T.viendo}</p>
        <p class="small">${T.explicacion}</p>
        <p class="label">${T.ultima}</p>
        <pre class="mm-tool">—</pre>
        <p class="small muted">${T.espera}</p>
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
    estadoEl.textContent = T.estados[e] ?? e;
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
        tool.textContent = T.horaLocal;
        setEstado('hablando');
      } else if (orden) {
        burbuja(orden.respuesta, 'meido', `<code>${esc(orden.herramienta)}(${esc(JSON.stringify(orden.args))})</code>`);
        tool.textContent = `${orden.herramienta}(${JSON.stringify(orden.args, null, 1)})`;
        setEstado('hecho');
      } else {
        burbuja(T.sinCerebro, 'meido', `<span class="mm-wait">${T.volvera}</span>`);
        tool.textContent = T.necesita;
        setEstado('reposo');
      }
      timers.push(setTimeout(() => setEstado('reposo'), 1800));
    }, reduced ? 0 : 650));
  }

  chips.innerHTML = T.sugerencias.map((s) => `<button type="button">${esc(s)}</button>`).join('');
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) enviar(b.textContent);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    enviar(input.value);
    input.value = '';
  });

  burbuja(T.saludo, 'meido');
  setEstado('reposo');

  return () => {
    clearInterval(anim);
    timers.forEach(clearTimeout);
  };
}
