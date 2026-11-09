import './mitpad.css';
import { pick } from '../i18n.js';

// Simulación del workbench: tablero y llamadas MCP en memoria, con los nombres reales de las herramientas
const T = pick({
  en: {
    board: 'Mitpad workspace (simulation)', cols: ['To do', 'In progress', 'Done'], hint: 'Click a card to advance its status.',
    agent: 'Agent · MCP client', calls: 'Calls', activity: 'Activity', empty: 'empty', log: 'Request and response',
    run: { list: 'List projects', create: 'Create task', update: 'Update a task', note: 'Create note' },
    newTask: ['Review the sync queue', 'Write the MCP onboarding', 'Check the 3D map hover', 'Rotate an agent key'],
    noTasks: 'There are no open tasks to update.',
    byAgent: 'agent', byYou: 'you', moved: (t, s) => `${t} → ${s}`, created: (t) => `created «${t}»`, noted: 'note created',
    noteTitle: 'Meeting notes', ready: 'Agent connected. Pick a tool to call it.',
  },
  es: {
    board: 'Workspace de Mitpad (simulación)', cols: ['Por hacer', 'En curso', 'Hecho'], hint: 'Haz clic en una tarjeta para avanzar su estado.',
    agent: 'Agente · cliente MCP', calls: 'Llamadas', activity: 'Actividad', empty: 'vacío', log: 'Petición y respuesta',
    run: { list: 'Listar proyectos', create: 'Crear tarea', update: 'Actualizar una tarea', note: 'Crear nota' },
    newTask: ['Revisar la cola de sync', 'Escribir el onboarding de MCP', 'Revisar el hover del mapa 3D', 'Rotar la clave de un agente'],
    noTasks: 'No hay tareas abiertas que actualizar.',
    byAgent: 'agente', byYou: 'tú', moved: (t, s) => `${t} → ${s}`, created: (t) => `creó «${t}»`, noted: 'nota creada',
    noteTitle: 'Notas de reunión', ready: 'Agente conectado. Elige una herramienta para llamarla.',
  },
});

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function mount(root) {
  const projects = [{ id: 'p1', name: 'Meido' }, { id: 'p2', name: 'CosechIA' }, { id: 'p3', name: 'MeshingUp' }];
  let seq = 3;
  const tasks = [
    { id: 't1', title: pick({ en: 'Add agent removal', es: 'Añadir baja de agentes' }), status: 2 },
    { id: 't2', title: pick({ en: 'Warm palette for the map', es: 'Paleta cálida para el mapa' }), status: 1 },
    { id: 't3', title: pick({ en: 'Keep the MCP server awake', es: 'Mantener despierto el servidor MCP' }), status: 0 },
  ];
  const notes = [];
  const activity = [];
  let nextTitle = 0;

  root.innerHTML = `
    <div class="mpdemo">
      <section class="mp-app" aria-label="${T.board}">
        <h3>Mitpad <span>${T.board}</span></h3>
        <p class="mp-hint">${T.hint}</p>
        <div class="mp-board">${T.cols.map((c, i) => `<div class="mp-col" data-col="${i}"><p class="label">${c}</p><ul></ul></div>`).join('')}</div>
        <p class="label">${T.activity}</p>
        <ul class="mp-activity" aria-live="polite"></ul>
      </section>
      <section class="mp-back" aria-label="${T.agent}">
        <p class="label">${T.agent}</p>
        <div class="mp-tools">
          <button type="button" data-run="list">mitpad_projects_list</button>
          <button type="button" data-run="create">mitpad_tasks_create</button>
          <button type="button" data-run="update">mitpad_tasks_update</button>
          <button type="button" data-run="note">mitpad_notes_create</button>
        </div>
        <p class="label">${T.log}</p>
        <pre class="mp-log" aria-live="polite"></pre>
      </section>
    </div>`;
  const $ = (s) => root.querySelector(s);
  const logEl = $('.mp-log');
  logEl.textContent = T.ready;

  function render() {
    root.querySelectorAll('.mp-col').forEach((col) => {
      const i = Number(col.dataset.col);
      const items = tasks.filter((t) => t.status === i);
      col.querySelector('ul').innerHTML = items.map((t) => `<li><button type="button" class="mp-card" data-id="${t.id}" ${i === 2 ? 'disabled' : ''}>${esc(t.title)}</button></li>`).join('') || `<li class="empty">${T.empty}</li>`;
    });
    $('.mp-activity').innerHTML = activity.slice(-4).reverse().map((a) => `<li><b>${a.who}</b> ${esc(a.text)}</li>`).join('') || `<li class="empty">${T.empty}</li>`;
  }
  const add = (who, text) => { activity.push({ who, text }); };
  const show = (call, res) => { logEl.textContent = `→ ${call}\n← ${JSON.stringify(res, null, 1)}`; };

  $('.mp-board').addEventListener('click', (e) => {
    const b = e.target.closest('.mp-card');
    if (!b) return;
    const t = tasks.find((x) => x.id === b.dataset.id);
    if (t && t.status < 2) { t.status++; add(T.byYou, T.moved(t.title, T.cols[t.status])); render(); }
  });

  const actions = {
    list: () => { show('mitpad_projects_list()', projects.map((p) => ({ id: p.id, name: p.name, status: 'active' }))); },
    create: () => {
      const title = T.newTask[nextTitle++ % T.newTask.length];
      const t = { id: `t${++seq}`, title, status: 0 };
      tasks.push(t);
      add(T.byAgent, T.created(title));
      show(`mitpad_tasks_create({ title: "${title}" })`, { id: t.id, status: 'todo' });
    },
    update: () => {
      const t = tasks.find((x) => x.status < 2);
      if (!t) { logEl.textContent = T.noTasks; return; }
      t.status++;
      add(T.byAgent, T.moved(t.title, T.cols[t.status]));
      show(`mitpad_tasks_update({ id: "${t.id}", status: "${['todo', 'doing', 'done'][t.status]}" })`, { id: t.id, ok: true });
    },
    note: () => {
      notes.push({ title: T.noteTitle });
      add(T.byAgent, T.noted);
      show(`mitpad_notes_create({ title: "${T.noteTitle}" })`, { id: `n${notes.length}`, ok: true });
    },
  };
  $('.mp-tools').addEventListener('click', (e) => {
    const b = e.target.closest('[data-run]');
    if (!b) return;
    actions[b.dataset.run]();
    render();
  });
  render();
  return () => {};
}
