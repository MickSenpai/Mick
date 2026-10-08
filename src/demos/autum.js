import './autum.css';
import { pick, locale } from '../i18n.js';

// Tiempos acelerados para la demo (en el bot real: revisión cada 60 s, recordatorio cada 2 min)
const REVISION_MS = 3000;
const RECORDATORIO_MS = 10000;
const ESCALA_MIN = 2 / (RECORDATORIO_MS / 1000); // minutos "reales" por segundo de demo
const REMINDER_MIN = 2;

// Mensajes del bot real (en español); en la versión en inglés, traducidos. Los comandos son los reales.
const T = pick({
  en: {
    asuntos: ['Can’t access my email', '2nd floor printer offline', 'VPN access request', 'Slow computer at login', 'Reset SAP password', 'Monitor has no signal', 'New user onboarding'],
    grupos: ['L1 Support', 'Networking', 'Applications'],
    iniciales: ['Computer replacement', 'Error printing PDF'],
    bandeja: 'ServiceDesk Plus inbox (simulated)', titulo: 'ServiceDesk Plus · Request inbox', revisando: 'Playwright checking…',
    llega: '+ A ticket arrives', asunto: 'Subject', chat: 'Chat with the Telegram bot (simulated)', asignar: 'Assign group',
    enterado: '✅ Acknowledged',
    revision: (hora) => `Last check: ${hora}`,
    nuevo: (id, min) => `🎫 New ticket with no group: #${id}\n(link to the inbox)\n\nI’ll remind you every ${min} min until you acknowledge.`,
    yaTiene: (id) => `✅ Ticket #${id}: it now has a group, I’ll stop reminding you.`,
    recordatorio: (n, id, mins) => `🔔 Reminder #${n}: ticket #${id} still has no group and hasn’t been acknowledged (${mins} min ago).\n(link to the inbox)`,
    confirmado: (id) => `✅ Ticket #${id}: acknowledged.`,
    toastOk: 'Acknowledged ✅', toastYa: 'Already acknowledged',
    confirmados: (ids) => `✅ Acknowledged: ${ids}`, pendientes: (ids) => `⏳ Pending: ${ids}`, ninguno: 'No pending tickets.',
    iniciado: '✅ Autum started',
  },
  es: {
    asuntos: ['No puedo acceder al correo', 'Impresora del piso 2 sin conexión', 'Solicitud de acceso a VPN', 'Equipo lento al iniciar sesión', 'Restablecer contraseña de SAP', 'Monitor sin señal', 'Alta de usuario nuevo'],
    grupos: ['Soporte N1', 'Redes', 'Aplicaciones'],
    iniciales: ['Cambio de equipo', 'Error al imprimir PDF'],
    bandeja: 'Bandeja de ServiceDesk Plus (simulada)', titulo: 'ServiceDesk Plus · Bandeja de solicitudes', revisando: 'Playwright revisando…',
    llega: '+ Llega un ticket', asunto: 'Asunto', chat: 'Chat con el bot de Telegram (simulado)', asignar: 'Asignar grupo',
    enterado: '✅ Enterado',
    revision: (hora) => `Última revisión: ${hora}`,
    nuevo: (id, min) => `🎫 Ticket nuevo sin grupo: #${id}\n(enlace a la bandeja)\n\nTe lo recordaré cada ${min} min hasta que confirmes.`,
    yaTiene: (id) => `✅ Ticket #${id}: ya tiene grupo asignado, dejo de recordarlo.`,
    recordatorio: (n, id, mins) => `🔔 Recordatorio #${n}: el ticket #${id} sigue sin grupo y sin confirmar (hace ${mins} min).\n(enlace a la bandeja)`,
    confirmado: (id) => `✅ Ticket #${id}: enterado.`,
    toastOk: 'Enterado ✅', toastYa: 'Ya estaba confirmado',
    confirmados: (ids) => `✅ Confirmados: ${ids}`, pendientes: (ids) => `⏳ Pendientes: ${ids}`, ninguno: 'No hay tickets pendientes.',
    iniciado: '✅ Autum iniciado',
  },
});
const ASUNTOS = T.asuntos;
const GRUPOS = T.grupos;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function mount(root) {
  root.innerHTML = `
    <div class="audemo">
      <section class="au-sdp" aria-label="${T.bandeja}">
        <div class="au-sdp-head">
          <div><p class="label">${T.titulo}</p><p class="au-scan">${T.revisando}</p></div>
          <button class="au-nuevo" type="button">${T.llega}</button>
        </div>
        <table class="au-tabla">
          <thead><tr><th>ID</th><th>${T.asunto}</th><th>Group</th><th></th></tr></thead>
          <tbody></tbody>
        </table>
      </section>
      <section class="au-tg" aria-label="${T.chat}">
        <div class="au-tg-head"><img src="${import.meta.env.BASE_URL}logos/autum.svg" alt="" width="34" height="34"><div><b>Autum</b><small>bot</small></div></div>
        <div class="au-chat" role="log" aria-live="polite"></div>
        <div class="au-toast" role="status" hidden></div>
        <div class="au-cmds"><button type="button">/pendientes</button><button type="button">/enterado</button></div>
      </section>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const tbody = $('.au-tabla tbody');
  const chat = $('.au-chat');
  const toast = $('.au-toast');
  const scan = $('.au-scan');

  let nextId = 48213;
  const bandeja = [
    { id: '48207', asunto: T.iniciales[0], grupo: GRUPOS[0] },
    { id: '48211', asunto: T.iniciales[1], grupo: GRUPOS[2] },
  ];
  const seen = new Set(bandeja.map((t) => t.id));
  const pending = {}; // id -> {desde, ultimoAviso, avisos, msgId, msgRec}
  let msgSeq = 0;
  const timers = [];

  // ---------- "Telegram" ----------
  function enviar(texto, boton = null) {
    const id = ++msgSeq;
    const el = document.createElement('div');
    el.className = 'au-msg';
    el.dataset.msg = id;
    el.innerHTML = `<p>${esc(texto).replace(/\n/g, '<br>')}</p>${boton ? `<button type="button" class="au-ack" data-ack="${boton}">${T.enterado}</button>` : ''}`;
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
    return id;
  }
  function borrar(msgId) {
    if (msgId) chat.querySelector(`[data-msg="${msgId}"]`)?.remove();
  }
  function editar(msgId, texto) {
    const el = chat.querySelector(`[data-msg="${msgId}"]`);
    if (el) el.innerHTML = `<p>${esc(texto)}</p>`;
  }
  function avisoEmergente(texto) {
    toast.textContent = texto;
    toast.hidden = false;
    timers.push(setTimeout(() => (toast.hidden = true), 1600));
  }

  function confirmar(id, textoFinal) {
    const p = pending[id];
    if (!p) return false;
    delete pending[id];
    borrar(p.msgRec);
    editar(p.msgId, textoFinal);
    return true;
  }

  // ---------- bandeja ----------
  function renderBandeja() {
    tbody.innerHTML = bandeja
      .map((t) => `<tr class="${t.grupo === '-' ? 'sin' : ''}"><td>#${t.id}</td><td>${esc(t.asunto)}</td><td>${esc(t.grupo)}</td>
        <td>${t.grupo === '-' ? `<button type="button" data-asignar="${t.id}">${T.asignar}</button>` : ''}</td></tr>`)
      .join('');
  }

  // ---------- monitor ----------
  function revisar() {
    scan.textContent = T.revision(new Date().toLocaleTimeString(locale));
    const sinGrupo = bandeja.filter((t) => t.grupo === '-').map((t) => t.id);
    for (const id of sinGrupo) {
      if (seen.has(id)) continue;
      const msgId = enviar(T.nuevo(id, REMINDER_MIN), id);
      seen.add(id);
      pending[id] = { desde: Date.now(), ultimoAviso: Date.now(), avisos: 1, msgId, msgRec: null };
    }
    for (const id of Object.keys(pending)) {
      const t = bandeja.find((x) => x.id === id);
      if (t && t.grupo !== '-') confirmar(id, T.yaTiene(id));
    }
    recordatorios();
  }
  function recordatorios() {
    const ahora = Date.now();
    for (const id of Object.keys(pending)) {
      const p = pending[id];
      if (ahora - p.ultimoAviso < RECORDATORIO_MS) continue;
      const mins = Math.round(((ahora - p.desde) / 1000) * ESCALA_MIN);
      const nuevo = enviar(T.recordatorio(p.avisos, id, mins), id);
      borrar(p.msgRec);
      p.msgRec = nuevo;
      p.ultimoAviso = ahora;
      p.avisos++;
    }
  }

  // ---------- interacción ----------
  $('.au-nuevo').addEventListener('click', () => {
    const id = String(nextId++);
    bandeja.unshift({ id, asunto: ASUNTOS[(nextId - 48214) % ASUNTOS.length], grupo: '-' });
    renderBandeja();
  });
  tbody.addEventListener('click', (e) => {
    const id = e.target.closest('[data-asignar]')?.dataset.asignar;
    if (!id) return;
    bandeja.find((t) => t.id === id).grupo = GRUPOS[Number(id) % GRUPOS.length];
    renderBandeja();
  });
  chat.addEventListener('click', (e) => {
    const id = e.target.closest('[data-ack]')?.dataset.ack;
    if (!id) return;
    const ok = confirmar(id, T.confirmado(id));
    avisoEmergente(ok ? T.toastOk : T.toastYa);
  });
  $('.au-cmds').addEventListener('click', (e) => {
    const cmd = e.target.closest('button')?.textContent;
    if (!cmd) return;
    const yo = document.createElement('div');
    yo.className = 'au-msg yo';
    yo.innerHTML = `<p>${cmd}</p>`;
    chat.appendChild(yo);
    const ids = Object.keys(pending);
    if (cmd === '/enterado') {
      for (const id of ids) confirmar(id, T.confirmado(id));
      enviar(ids.length ? T.confirmados(ids.map((i) => '#' + i).join(', ')) : T.ninguno);
    } else {
      enviar(ids.length ? T.pendientes(ids.map((i) => '#' + i).join(', ')) : T.ninguno);
    }
  });

  renderBandeja();
  enviar(T.iniciado);
  // primer ticket automático para que se vea el flujo sin tocar nada
  timers.push(setTimeout(() => $('.au-nuevo').click(), 1200));
  const loop = setInterval(revisar, REVISION_MS);
  return () => {
    clearInterval(loop);
    timers.forEach(clearTimeout);
  };
}
