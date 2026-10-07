import './autum.css';

// Tiempos acelerados para la demo (en el bot real: revisión cada 60 s, recordatorio cada 2 min)
const REVISION_MS = 3000;
const RECORDATORIO_MS = 10000;
const ESCALA_MIN = 2 / (RECORDATORIO_MS / 1000); // minutos "reales" por segundo de demo
const REMINDER_MIN = 2;

const ASUNTOS = [
  'No puedo acceder al correo',
  'Impresora del piso 2 sin conexión',
  'Solicitud de acceso a VPN',
  'Equipo lento al iniciar sesión',
  'Restablecer contraseña de SAP',
  'Monitor sin señal',
  'Alta de usuario nuevo',
];
const GRUPOS = ['Soporte N1', 'Redes', 'Aplicaciones'];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function mount(root) {
  root.innerHTML = `
    <div class="audemo">
      <section class="au-sdp" aria-label="Bandeja de ServiceDesk Plus (simulada)">
        <div class="au-sdp-head">
          <div><p class="label">ServiceDesk Plus · Bandeja de solicitudes</p><p class="au-scan">Playwright revisando…</p></div>
          <button class="au-nuevo" type="button">+ Llega un ticket</button>
        </div>
        <table class="au-tabla">
          <thead><tr><th>ID</th><th>Asunto</th><th>Group</th><th></th></tr></thead>
          <tbody></tbody>
        </table>
      </section>
      <section class="au-tg" aria-label="Chat con el bot de Telegram (simulado)">
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
    { id: '48207', asunto: 'Cambio de equipo', grupo: 'Soporte N1' },
    { id: '48211', asunto: 'Error al imprimir PDF', grupo: 'Aplicaciones' },
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
    el.innerHTML = `<p>${esc(texto).replace(/\n/g, '<br>')}</p>${boton ? `<button type="button" class="au-ack" data-ack="${boton}">✅ Enterado</button>` : ''}`;
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
        <td>${t.grupo === '-' ? `<button type="button" data-asignar="${t.id}">Asignar grupo</button>` : ''}</td></tr>`)
      .join('');
  }

  // ---------- monitor ----------
  function revisar() {
    scan.textContent = `Última revisión: ${new Date().toLocaleTimeString('es-MX')}`;
    const sinGrupo = bandeja.filter((t) => t.grupo === '-').map((t) => t.id);
    for (const id of sinGrupo) {
      if (seen.has(id)) continue;
      const msgId = enviar(`🎫 Ticket nuevo sin grupo: #${id}\n(enlace a la bandeja)\n\nTe lo recordaré cada ${REMINDER_MIN} min hasta que confirmes.`, id);
      seen.add(id);
      pending[id] = { desde: Date.now(), ultimoAviso: Date.now(), avisos: 1, msgId, msgRec: null };
    }
    for (const id of Object.keys(pending)) {
      const t = bandeja.find((x) => x.id === id);
      if (t && t.grupo !== '-') confirmar(id, `✅ Ticket #${id}: ya tiene grupo asignado, dejo de recordarlo.`);
    }
    recordatorios();
  }
  function recordatorios() {
    const ahora = Date.now();
    for (const id of Object.keys(pending)) {
      const p = pending[id];
      if (ahora - p.ultimoAviso < RECORDATORIO_MS) continue;
      const mins = Math.round(((ahora - p.desde) / 1000) * ESCALA_MIN);
      const nuevo = enviar(`🔔 Recordatorio #${p.avisos}: el ticket #${id} sigue sin grupo y sin confirmar (hace ${mins} min).\n(enlace a la bandeja)`, id);
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
    const ok = confirmar(id, `✅ Ticket #${id}: enterado.`);
    avisoEmergente(ok ? 'Enterado ✅' : 'Ya estaba confirmado');
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
      for (const id of ids) confirmar(id, `✅ Ticket #${id}: enterado.`);
      enviar(ids.length ? `✅ Confirmados: ${ids.map((i) => '#' + i).join(', ')}` : 'No hay tickets pendientes.');
    } else {
      enviar(ids.length ? `⏳ Pendientes: ${ids.map((i) => '#' + i).join(', ')}` : 'No hay tickets pendientes.');
    }
  });

  renderBandeja();
  enviar('✅ Autum iniciado');
  // primer ticket automático para que se vea el flujo sin tocar nada
  timers.push(setTimeout(() => $('.au-nuevo').click(), 1200));
  const loop = setInterval(revisar, REVISION_MS);
  return () => {
    clearInterval(loop);
    timers.forEach(clearTimeout);
  };
}
