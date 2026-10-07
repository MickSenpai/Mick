import './mitpad.css';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = (Math.random() * 16) | 0;
  return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
}));
const corto = (id) => id.slice(0, 8);
const TICK_MS = 2000;

export function mount(root) {
  root.innerHTML = `
    <div class="mpdemo">
      <section class="mp-app" aria-label="Mitpad (interfaz de la app)">
        <div class="mp-header">
          <h3>Mitpad <span>Offline-First</span></h3>
          <button class="mp-new" type="button">+ Nueva Nota</button>
        </div>
        <div class="mp-editor">
          <div class="mp-error" hidden></div>
          <input type="text" placeholder="Título de la nota (Opcional)" aria-label="Título">
          <textarea placeholder="Escribe tu idea aquí. Meido la analizará pronto..." aria-label="Contenido"></textarea>
          <div class="mp-actions">
            <button class="mp-save" type="button">Guardar Localmente</button>
            <button class="mp-delete" type="button" hidden>Borrar</button>
          </div>
        </div>
        <div class="mp-success" hidden><p><strong></strong></p><p>Operación en <code>sync_queue</code> capturada por el Worker.</p></div>
      </section>

      <section class="mp-back" aria-label="Detrás de escena">
        <div class="mp-net">
          <span class="label">Red</span>
          <button class="mp-toggle" type="button" role="switch" aria-checked="true"><span></span>Conectada</button>
        </div>
        <div class="mp-cols">
          <div><p class="label">SQLite local · notas</p><ul class="mp-local"></ul></div>
          <div><p class="label">Convex · nube</p><ul class="mp-cloud"></ul></div>
        </div>
        <p class="label">sync_queue</p>
        <table class="mp-queue"><thead><tr><th>#</th><th>operation</th><th>note</th></tr></thead><tbody></tbody></table>
        <p class="label">Worker</p>
        <pre class="mp-log" aria-live="polite"></pre>
      </section>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const title = $('.mp-app input');
  const content = $('.mp-app textarea');
  const errEl = $('.mp-error');
  const ok = $('.mp-success');
  const saveBtn = $('.mp-save');
  const delBtn = $('.mp-delete');
  const toggle = $('.mp-toggle');

  const local = new Map(); // id -> {title, content}
  const cloud = new Map();
  const queue = []; // {qid, operation, payload}
  let qid = 0;
  let online = true;
  let activeNote = null;
  const logLines = [];

  function log(line) {
    logLines.push(line);
    if (logLines.length > 40) logLines.shift();
    const el = $('.mp-log');
    el.textContent = logLines.join('\n');
    el.scrollTop = el.scrollHeight;
  }

  function render() {
    $('.mp-local').innerHTML = [...local].map(([id, n]) => `<li class="${activeNote?.id === id ? 'on' : ''}" data-id="${id}"><b>${esc(n.title || 'Sin título')}</b><small>${corto(id)}</small></li>`).join('') || '<li class="empty">vacío</li>';
    $('.mp-cloud').innerHTML = [...cloud].map(([id, n]) => `<li><b>${esc(n.title || 'Sin título')}</b><small>${corto(id)}</small></li>`).join('') || '<li class="empty">vacío</li>';
    $('.mp-queue tbody').innerHTML = queue.map((q) => `<tr><td>${q.qid}</td><td>${q.operation}</td><td>${corto(q.payload.id)}</td></tr>`).join('') || '<tr><td colspan="3" class="empty">cola vacía</td></tr>';
    saveBtn.textContent = activeNote ? 'Actualizar Localmente' : 'Guardar Localmente';
    delBtn.hidden = !activeNote;
  }

  function encolar(operation, payload) {
    queue.push({ qid: ++qid, operation, payload });
  }
  function mostrar(msg) {
    errEl.hidden = true;
    ok.hidden = false;
    ok.querySelector('strong').textContent = msg;
  }

  saveBtn.addEventListener('click', () => {
    errEl.hidden = true;
    ok.hidden = true;
    if (!content.value.trim()) {
      errEl.textContent = 'El contenido de la nota es obligatorio.';
      errEl.hidden = false;
      return;
    }
    if (activeNote) {
      local.set(activeNote.id, { title: title.value, content: content.value });
      encolar('UPDATE', { id: activeNote.id, title: title.value, content: content.value });
      mostrar(`✅ Nota actualizada. UUID: ${activeNote.id}`);
    } else {
      const id = uuid();
      activeNote = { id };
      local.set(id, { title: title.value, content: content.value });
      encolar('INSERT', { id, title: title.value, content: content.value });
      mostrar(`✅ Nueva nota creada. UUID: ${id}`);
    }
    render();
  });

  delBtn.addEventListener('click', () => {
    if (!activeNote) return;
    const id = activeNote.id;
    local.delete(id);
    encolar('DELETE', { id });
    mostrar(`🗑️ Nota ${id} borrada localmente y encolada.`);
    activeNote = null;
    title.value = '';
    content.value = '';
    render();
  });

  $('.mp-new').addEventListener('click', () => {
    activeNote = null;
    title.value = '';
    content.value = '';
    ok.hidden = true;
    errEl.hidden = true;
    render();
  });

  // abrir una nota local para editarla
  $('.mp-local').addEventListener('click', (e) => {
    const li = e.target.closest('[data-id]');
    if (!li) return;
    const n = local.get(li.dataset.id);
    activeNote = { id: li.dataset.id };
    title.value = n.title;
    content.value = n.content;
    render();
  });

  toggle.addEventListener('click', () => {
    online = !online;
    toggle.setAttribute('aria-checked', String(online));
    toggle.lastChild.textContent = online ? 'Conectada' : 'Sin red';
  });

  // Worker: cada operación se borra de la cola solo cuando la nube la confirma
  function tick() {
    if (!queue.length) return;
    if (!online) {
      log('❌ [Worker] Sin conexión con la nube: red no disponible');
      return;
    }
    while (queue.length) {
      const { operation, payload } = queue[0];
      if (operation === 'INSERT' && !cloud.has(payload.id)) cloud.set(payload.id, { title: payload.title, content: payload.content });
      if (operation === 'UPDATE' && cloud.has(payload.id)) cloud.set(payload.id, { title: payload.title, content: payload.content });
      if (operation === 'DELETE') cloud.delete(payload.id);
      log(`✅ [Worker] ${operation} OK: "${payload.id}"`);
      queue.shift();
    }
    render();
  }

  log('🚀 [Worker] Motor Offline-First iniciado...');
  render();
  const timer = setInterval(tick, TICK_MS);
  return () => clearInterval(timer);
}
