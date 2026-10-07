import './cosechia.css';
import catalogo from './cosechia-data.json';

// Port de app/Agent/DomainGuard.php: filtro previo al LLM para peticiones fuera de dominio
const REJECTION_MESSAGE = 'Mi especialidad es la vitivinicultura y el sistema CosechIA. No puedo ayudarte con esa solicitud, pero con gusto revisamos tus bloques, el clima, la madurez de tus uvas o las labores pendientes. ¿Sobre qué bloque quieres consultar?';
const OUT_OF_SCOPE_PATTERNS = [
  /\b(python|javascript|typescript|java|c\+\+|csharp|c#|ruby|rust|golang|php|html|css|sql|bash|powershell|react|angular|django|flask|spring|nodejs|node\.js|laravel|vue\.js)\b/,
  /\b(escrib[ea]|genera|crea|dame|haz|programa|implementa|desarrolla)\b.{0,40}\b(codigo|script|programa|algoritmo|funcion|clase|endpoint|api|pagina web|sitio web|aplicacion web)\b/,
  /\b(debug|debuggea|depura|compila|compilador|repositorio|git|docker|kubernetes|npm|pip|composer)\b/,
  /\b(ignora|olvida|desobedece|omite)\b.{0,40}\b(instrucciones|reglas|prompt|restricciones|sistema|rol)\b/,
  /\b(system\s*prompt|prompt\s*del\s*sistema|jailbreak|dan\s*mode|modo\s*dan)\b/,
  /\b(actua|comportate|finge|pretende)\b.{0,40}\b(programador|hacker|asistente general|chatgpt|sin restricciones)\b/,
  /\b(receta|recetas|cocina|cocinar|prepara|preparar)\b.{0,30}\b(pastel|pizza|hamburguesa|comida|cena|almuerzo|desayuno|galletas|tarta)\b/,
  /\b(cuentame|escribe|inventa|dame)\b.{0,30}\b(chiste|chistes|cuento|poema|poesia|cancion|historia de terror)\b/,
  /\b(futbol|baloncesto|basketball|nba|nfl|mundial de futbol|liga mx|premier league|champions league)\b/,
  /\b(politica|elecciones|presidente|partido politico|votar|candidato)\b/,
  /\b(hackear|hackea|robar|roba|malware|ransomware|phishing|exploit|ddos|inyeccion sql)\b/,
];
const normalize = (t) => t.toLowerCase().replace(/[áéíóúüñ]/g, (c) => ({ á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u', ñ: 'n' })[c]);
const isOutOfScope = (msg) => OUT_OF_SCOPE_PATTERNS.some((p) => p.test(normalize(msg)));

const { variedades, plagas } = catalogo;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const fmt = (n) => Number(n).toLocaleString('es-MX', { maximumFractionDigits: 2 });

// Respuesta armada con las fichas del catálogo, citadas como lo pide el agente: [Ficha: nombre]
function responder(pregunta, vSel) {
  if (isOutOfScope(pregunta)) return { texto: REJECTION_MESSAGE, citas: [], guard: true };
  const q = normalize(pregunta);
  const plaga = plagas.find((p) => q.includes(normalize(p.nombre)));
  const variedad = variedades.find((v) => q.includes(normalize(v.nombre))) || (/(esta variedad|la variedad)/.test(q) ? vSel : null);

  if (plaga) {
    const cita = { title: `Ficha: ${plaga.nombre}`, snippet: plaga.sintomas };
    let texto;
    if (/prev/.test(q)) texto = `Para prevenir ${plaga.nombre.toLowerCase()} (${plaga.nombre_cientifico}): ${plaga.tratamiento_preventivo}.`;
    else if (/(trat|cur|control|elimin)/.test(q)) texto = `Tratamiento curativo para ${plaga.nombre.toLowerCase()}: ${plaga.tratamiento_curativo}.`;
    else texto = `${plaga.nombre} (${plaga.nombre_cientifico}). Síntomas: ${plaga.sintomas}. Prevención: ${plaga.tratamiento_preventivo}.`;
    return { texto: `${texto} [Ficha: ${plaga.nombre}]`, citas: [cita] };
  }
  if (variedad) {
    const v = variedad;
    if (/(plaga|enfermedad|vigilar|riesgo)/.test(q)) {
      const ps = v.plagas.map((n) => plagas.find((p) => p.nombre === n)).filter(Boolean);
      if (!ps.length) return { texto: `La ficha de ${v.nombre} no registra plagas comunes. [Ficha: ${v.nombre}]`, citas: [{ title: `Ficha: ${v.nombre}`, snippet: `Variedad ${v.tipo}, ciclo ${v.ciclo}.` }] };
      const lista = ps.map((p) => `${p.nombre}: ${p.sintomas.toLowerCase()}`).join('; ');
      return {
        texto: `En ${v.nombre} vigila sobre todo: ${lista}. ${ps.map((p) => `[Ficha: ${p.nombre}]`).join(' ')}`,
        citas: [{ title: `Ficha: ${v.nombre}`, snippet: `Plagas comunes: ${v.plagas.join(', ')}` }, ...ps.map((p) => ({ title: `Ficha: ${p.nombre}`, snippet: p.sintomas }))],
      };
    }
    return {
      texto: `Para ${v.nombre}, el rango óptimo de cosecha es ${fmt(v.brix_optimo_cosecha_min)}–${fmt(v.brix_optimo_cosecha_max)} °Brix, pH ${fmt(v.ph_optimo_min)}–${fmt(v.ph_optimo_max)} y acidez total ${fmt(v.at_optimo_min_g_l)}–${fmt(v.at_optimo_max_g_l)} g/L. Es una variedad ${v.tipo} de ciclo ${v.ciclo}. [Ficha: ${v.nombre}]`,
      citas: [{ title: `Ficha: ${v.nombre}`, snippet: `Brix ${v.brix_optimo_cosecha_min}–${v.brix_optimo_cosecha_max}, pH ${v.ph_optimo_min}–${v.ph_optimo_max}` }],
    };
  }
  return {
    texto: 'En CosechIA esta pregunta la respondería el agente con el LLM y la búsqueda en fichas y manuales. En este demo solo respondo con las fichas del catálogo: pregunta por una variedad (p. ej. Merlot) o una plaga (p. ej. Botrytis).',
    citas: [],
    demo: true,
  };
}

function veredicto(v, brix, ph, at) {
  const enRango = (x, a, b) => x >= a && x <= b;
  if (brix < v.brix_optimo_cosecha_min) return ['madurando', `Aún madurando: faltan ${fmt(v.brix_optimo_cosecha_min - brix)} °Brix para el mínimo.`];
  if (brix > v.brix_optimo_cosecha_max) return ['sobre', 'Sobremaduración: el azúcar ya pasó el óptimo, conviene cosechar.'];
  if (!enRango(ph, v.ph_optimo_min, v.ph_optimo_max) || !enRango(at, v.at_optimo_min_g_l, v.at_optimo_max_g_l)) {
    return ['revisar', 'Azúcar en rango, pero pH o acidez fuera del óptimo: revisa antes de cosechar.'];
  }
  return ['listo', 'En ventana de cosecha: Brix, pH y acidez dentro del óptimo.'];
}

export function mount(root) {
  root.innerHTML = `
    <div class="cdemo">
      <section class="cd-madurez" aria-label="Lectura de maduración">
        <p class="cd-eyebrow">Maduración</p>
        <label class="cd-field">Variedad
          <select>${variedades.map((v, i) => `<option value="${i}" ${v.nombre === 'Cabernet Sauvignon' ? 'selected' : ''}>${esc(v.nombre)}</option>`).join('')}</select>
        </label>
        <div class="cd-metrics"></div>
        <p class="cd-verdict" role="status" aria-live="polite"></p>
        <p class="cd-foot">Rangos óptimos tomados de la ficha de cada variedad en el catálogo de CosechIA.</p>
      </section>
      <section class="cd-agente" aria-label="Agente de CosechIA">
        <p class="cd-eyebrow">Agente</p>
        <div class="cd-chat" role="log" aria-live="polite"></div>
        <div class="cd-chips"></div>
        <form class="cd-input"><input type="text" placeholder="Pregunta sobre tu viñedo…" aria-label="Pregunta para el agente" maxlength="160" autocomplete="off"><button type="submit">Enviar</button></form>
      </section>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const select = $('select');
  const metrics = $('.cd-metrics');
  const verdict = $('.cd-verdict');
  const chat = $('.cd-chat');
  const chips = $('.cd-chips');
  const input = $('.cd-input input');

  const lectura = { brix: 22.4, ph: 3.42, at: 6.6 };
  const METRICAS = [
    ['brix', '°Brix', 16, 30, 0.1, 'brix_optimo_cosecha_min', 'brix_optimo_cosecha_max'],
    ['ph', 'pH', 2.9, 4.1, 0.01, 'ph_optimo_min', 'ph_optimo_max'],
    ['at', 'Acidez total (g/L)', 4, 10, 0.1, 'at_optimo_min_g_l', 'at_optimo_max_g_l'],
  ];
  const vSel = () => variedades[Number(select.value)];

  function renderMetricas() {
    const v = vSel();
    metrics.innerHTML = METRICAS.map(([k, label, min, max, step, a, b]) => {
      const pa = ((v[a] - min) / (max - min)) * 100;
      const pb = ((v[b] - min) / (max - min)) * 100;
      return `<div class="cd-metric">
        <div class="cd-metric-head"><span>${label}</span><output>${fmt(lectura[k])}</output></div>
        <div class="cd-track"><span class="cd-band" style="left:${pa}%;width:${pb - pa}%"></span>
          <input type="range" min="${min}" max="${max}" step="${step}" value="${lectura[k]}" data-k="${k}" aria-label="${label}"></div>
        <small>Óptimo ${fmt(v[a])}–${fmt(v[b])}</small></div>`;
    }).join('');
    actualizarVeredicto();
  }
  function actualizarVeredicto() {
    const [clase, texto] = veredicto(vSel(), lectura.brix, lectura.ph, lectura.at);
    verdict.className = `cd-verdict ${clase}`;
    verdict.textContent = texto;
  }
  metrics.addEventListener('input', (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    lectura[k] = Number(e.target.value);
    e.target.closest('.cd-metric').querySelector('output').textContent = fmt(lectura[k]);
    actualizarVeredicto();
  });

  function renderChips() {
    const v = vSel().nombre;
    const sugerencias = [`¿Cuál es el rango óptimo de cosecha del ${v}?`, `¿Qué plagas debo vigilar en ${v}?`, '¿Cómo prevengo el mildiu?', 'Escríbeme un script en Python para el viñedo'];
    chips.innerHTML = sugerencias.map((s) => `<button type="button">${esc(s)}</button>`).join('');
  }
  select.addEventListener('change', () => {
    renderMetricas();
    renderChips();
  });

  function mensaje(html, quien) {
    const el = document.createElement('div');
    el.className = `cd-msg ${quien}`;
    el.innerHTML = html;
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
  }
  function preguntar(texto) {
    texto = texto.trim();
    if (!texto) return;
    mensaje(`<p>${esc(texto)}</p>`, 'yo');
    const r = responder(texto, vSel());
    const citas = r.citas.length
      ? `<ul class="cd-citas">${r.citas.map((c) => `<li title="${esc(c.snippet)}">${esc(c.title)}</li>`).join('')}</ul>`
      : '';
    const tag = r.guard ? '<span class="cd-tag">DomainGuard</span>' : r.demo ? '<span class="cd-tag">Límite del demo</span>' : '';
    mensaje(`${tag}<p>${esc(r.texto)}</p>${citas}`, 'bot');
  }
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) preguntar(b.textContent);
  });
  $('.cd-input').addEventListener('submit', (e) => {
    e.preventDefault();
    preguntar(input.value);
    input.value = '';
  });

  renderMetricas();
  renderChips();
  mensaje('<p>Hola. Puedo consultar las fichas de variedades y plagas del catálogo. Pregúntame por una variedad o una plaga.</p>', 'bot');
}
