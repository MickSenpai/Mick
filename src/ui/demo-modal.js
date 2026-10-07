import { projects } from '../content.js';

// Cada demo se descarga solo al abrirlo (no pesa en la carga inicial)
const loaders = {
  meido: () => import('../demos/meido.js'),
  'meido-movil': () => import('../demos/meido-movil.js'),
  mitpad: () => import('../demos/mitpad.js'),
  autum: () => import('../demos/autum.js'),
  cosechia: () => import('../demos/cosechia.js'),
};

export function createDemoModal({ onOpen, onClose } = {}) {
  const dialog = document.createElement('dialog');
  dialog.className = 'demo-dialog';
  dialog.setAttribute('aria-labelledby', 'demo-title');
  dialog.innerHTML = `
    <div class="demo-shell">
      <header class="demo-head">
        <div>
          <p class="eyebrow">Demo interactiva · Simulación</p>
          <h2 id="demo-title" class="demo-title"></h2>
          <p class="demo-note"></p>
        </div>
        <button class="demo-close" type="button" aria-label="Cerrar demo">Cerrar <span aria-hidden="true">✕</span></button>
      </header>
      <div class="demo-body"></div>
    </div>`;
  document.body.appendChild(dialog);

  const title = dialog.querySelector('.demo-title');
  const note = dialog.querySelector('.demo-note');
  const body = dialog.querySelector('.demo-body');
  let cleanup = null;
  let opener = null;

  async function open(id, trigger) {
    const p = projects.find((x) => x.id === id);
    if (!p || !loaders[id]) return;
    opener = trigger || null;
    title.textContent = p.name;
    note.textContent = p.demo;
    body.innerHTML = '<p class="demo-loading">Cargando…</p>';
    dialog.showModal();
    document.documentElement.classList.add('demo-open');
    onOpen?.();
    try {
      const mod = await loaders[id]();
      if (!dialog.open) return;
      body.innerHTML = '';
      cleanup = mod.mount(body) || null;
    } catch (err) {
      body.innerHTML = '<p class="demo-loading">No se pudo cargar el demo.</p>';
      console.error(err);
    }
  }

  function teardown() {
    cleanup?.();
    cleanup = null;
    body.innerHTML = '';
    document.documentElement.classList.remove('demo-open');
    onClose?.();
    opener?.focus();
  }

  dialog.querySelector('.demo-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', teardown);
  // clic en el fondo oscuro cierra
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-demo]');
    if (btn) open(btn.dataset.demo, btn);
  });

  return { open };
}
