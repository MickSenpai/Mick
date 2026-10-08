import './meido.css';
import data from './meido-frames.json';
import { pick, lang } from '../i18n.js';

// Qué significa cada estado dentro de M.E.I.D.O: [id, nombre, descripción, texto de la isla]
const T = pick({
  en: {
    estados: [
      ['reposo', 'Idle', 'Ready. Waiting for the wake word.', 'Ready'],
      ['escuchando', 'Listening', 'Heard «Meido»: transcribes your voice locally with Faster‑Whisper.', 'Listening…'],
      ['pensando', 'Thinking', 'The LLM decides what to answer or which tool to use.', 'Thinking…'],
      ['buscando', 'Searching', 'Searches the web or its long‑term memory.', 'Searching memory…'],
      ['trabajando', 'Working', 'Runs a tool: editing code, commands, email…', 'Editing main.py'],
      ['permiso', 'Asks permission', 'Before a sensitive action it asks for your approval.', 'Run sudo pacman -Syu?'],
      ['hablando', 'Speaking', 'Answers out loud; the bars follow the volume.', 'Answering…'],
      ['hecho', 'Done', 'Finished the task.', 'Done'],
    ],
    // Guion de «Simular una petición»: cada paso dura n ms (permiso espera tu respuesta)
    guion: [
      ['escuchando', 1800, 'User: «Meido, update the system»'],
      ['pensando', 1600, 'Picks the tool: ejecutar_comando'],
      ['permiso', 0, 'Command with sudo: needs your approval'],
      ['trabajando', 2200, 'Running sudo pacman -Syu'],
      ['hablando', 2400, '«System updated, Sir. 14 packages.»'],
      ['hecho', 1600, 'Task finished'],
      ['reposo', 0, ''],
    ],
    quiere: 'wants to run', permitir: 'Allow', denegar: 'Deny', simular: 'Simulate a request', estadosLabel: 'States',
    denegada: 'Action denied', denegado: 'Denied: nothing was run.',
  },
  es: {
    estados: [
      ['reposo', 'En reposo', 'Lista. Espera la palabra de activación.', 'Lista'],
      ['escuchando', 'Escuchando', 'Oyó «Meido»: transcribe tu voz en local con Faster‑Whisper.', 'Te escucho…'],
      ['pensando', 'Pensando', 'El LLM decide qué responder o qué herramienta usar.', 'Pensando…'],
      ['buscando', 'Buscando', 'Consulta la web o su memoria a largo plazo.', 'Buscando en la memoria…'],
      ['trabajando', 'Trabajando', 'Ejecuta una herramienta: editar código, comandos, correo…', 'Editando main.py'],
      ['permiso', 'Pide permiso', 'Antes de una acción delicada pide tu aprobación.', '¿Ejecutar sudo pacman -Syu?'],
      ['hablando', 'Hablando', 'Responde con voz; las barras siguen el volumen.', 'Respondiendo…'],
      ['hecho', 'Hecho', 'Terminó la tarea.', 'Listo'],
    ],
    guion: [
      ['escuchando', 1800, 'Usuario: «Meido, actualiza el sistema»'],
      ['pensando', 1600, 'Elige la herramienta: ejecutar_comando'],
      ['permiso', 0, 'Comando con sudo: necesita tu aprobación'],
      ['trabajando', 2200, 'Ejecutando sudo pacman -Syu'],
      ['hablando', 2400, '«Sistema actualizado, Señor. 14 paquetes.»'],
      ['hecho', 1600, 'Tarea terminada'],
      ['reposo', 0, ''],
    ],
    quiere: 'quiere ejecutar', permitir: 'Permitir', denegar: 'Denegar', simular: 'Simular una petición', estadosLabel: 'Estados',
    denegada: 'Acción denegada', denegado: 'Denegado: no se ejecutó nada.',
  },
});
const ESTADOS = T.estados;
const GUION = T.guion;

export function mount(root) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.innerHTML = `
    <div class="mdemo">
      <div class="mdemo-stage">
        <div class="mdemo-avatar" aria-hidden="true"></div>
        <div class="mdemo-isla" role="status" aria-live="polite">
          <span class="mdemo-isla-estado"></span><span class="mdemo-isla-texto"></span>
        </div>
        <div class="mdemo-permiso" hidden>
          <p><strong>M.E.I.D.O</strong> ${T.quiere}</p>
          <code>sudo pacman -Syu</code>
          <div><button type="button" data-r="si">${T.permitir}</button><button type="button" data-r="no">${T.denegar}</button></div>
        </div>
      </div>
      <div class="mdemo-side">
        <button class="mdemo-run" type="button">${T.simular}</button>
        <p class="mdemo-log" aria-live="polite"></p>
        <p class="label">${T.estadosLabel}</p>
        <ul class="mdemo-list"></ul>
      </div>
    </div>`;

  const avatar = root.querySelector('.mdemo-avatar');
  const islaEstado = root.querySelector('.mdemo-isla-estado');
  const islaTexto = root.querySelector('.mdemo-isla-texto');
  const permiso = root.querySelector('.mdemo-permiso');
  const log = root.querySelector('.mdemo-log');
  const list = root.querySelector('.mdemo-list');
  const run = root.querySelector('.mdemo-run');

  list.innerHTML = ESTADOS.map(
    ([id, label, desc]) => `<li><button type="button" data-estado="${id}" aria-pressed="false">
      <span class="dot" style="background:${data[id].color}"></span><span><b>${label}</b><small>${desc}</small></span></button></li>`,
  ).join('');

  let estado = 'reposo';
  let frame = 0;
  let timer = 0;
  let stepTimer = 0;
  let paso = -1;

  function pintar() {
    const st = data[estado];
    avatar.innerHTML = st.frames[reduced ? 0 : frame % st.frames.length];
    frame++;
  }

  function setEstado(id, texto) {
    estado = id;
    frame = 0;
    const def = ESTADOS.find((e) => e[0] === id);
    // en la isla real el estado se ve con su nombre interno (en español)
    islaEstado.textContent = lang === 'es' ? id : def[1].toLowerCase();
    islaEstado.style.color = data[id].color;
    islaTexto.textContent = texto ?? def[3];
    list.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.estado === id)));
    permiso.hidden = id !== 'permiso';
    pintar();
  }

  function siguiente() {
    paso++;
    if (paso >= GUION.length) return terminar();
    const [id, ms, texto] = GUION[paso];
    setEstado(id);
    log.textContent = texto;
    if (ms > 0) stepTimer = setTimeout(siguiente, ms);
    else if (id === 'reposo') terminar();
  }
  function terminar() {
    paso = -1;
    run.disabled = false;
    clearTimeout(stepTimer);
  }

  run.addEventListener('click', () => {
    clearTimeout(stepTimer);
    run.disabled = true;
    paso = -1;
    siguiente();
  });
  permiso.addEventListener('click', (e) => {
    const r = e.target.closest('button')?.dataset.r;
    if (!r || estado !== 'permiso') return;
    if (r === 'si') siguiente();
    else {
      setEstado('reposo', T.denegada);
      log.textContent = T.denegado;
      terminar();
    }
  });
  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-estado]');
    if (!b) return;
    clearTimeout(stepTimer);
    terminar();
    log.textContent = '';
    setEstado(b.dataset.estado);
  });

  setEstado('reposo');
  if (!reduced) timer = setInterval(pintar, 1000 / data.reposo.fps);

  return () => {
    clearInterval(timer);
    clearTimeout(stepTimer);
  };
}
