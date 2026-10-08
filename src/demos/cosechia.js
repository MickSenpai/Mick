import './cosechia.css';
import catalogo from './cosechia-data.json';
import { lang, locale, pick } from '../i18n.js';

// Port de app/Agent/DomainGuard.php: filtro previo al LLM para peticiones fuera de dominio.
// El real filtra en español; en la versión en inglés del sitio, sus reglas van traducidas.
const GUARD = pick({
  es: {
    rejection: 'Mi especialidad es la vitivinicultura y el sistema CosechIA. No puedo ayudarte con esa solicitud, pero con gusto revisamos tus bloques, el clima, la madurez de tus uvas o las labores pendientes. ¿Sobre qué bloque quieres consultar?',
    patterns: [
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
    ],
  },
  en: {
    rejection: 'My specialty is viticulture and the CosechIA system. I can’t help you with that request, but I’d gladly look at your blocks, the weather, your grapes’ ripeness or pending tasks. Which block would you like to ask about?',
    patterns: [
      /\b(python|javascript|typescript|java|c\+\+|csharp|c#|ruby|rust|golang|php|html|css|sql|bash|powershell|react|angular|django|flask|spring|nodejs|node\.js|laravel|vue\.js)\b/,
      /\b(write|generate|create|give me|make|program|implement|develop|build)\b.{0,40}\b(code|script|program|algorithm|function|class|endpoint|api|web page|website|web app)\b/,
      /\b(debug|compile|compiler|repository|repo|git|docker|kubernetes|npm|pip|composer)\b/,
      /\b(ignore|forget|disobey|skip)\b.{0,40}\b(instructions|rules|prompt|restrictions|system|role)\b/,
      /\b(system\s*prompt|jailbreak|dan\s*mode)\b/,
      /\b(act as|behave like|pretend)\b.{0,40}\b(programmer|developer|hacker|general assistant|chatgpt|without restrictions|unrestricted)\b/,
      /\b(recipe|recipes|cook|cooking|bake|prepare)\b.{0,30}\b(cake|pizza|burger|hamburger|food|dinner|lunch|breakfast|cookies|pie)\b/,
      /\b(tell me|write|make up|give me)\b.{0,30}\b(joke|jokes|story|poem|poetry|song|horror story)\b/,
      /\b(soccer|football|basketball|nba|nfl|world cup|liga mx|premier league|champions league)\b/,
      /\b(politics|election|elections|president|political party|vote|candidate)\b/,
      /\b(hack|hacking|steal|malware|ransomware|phishing|exploit|ddos|sql injection)\b/,
    ],
  },
});
const normalize = (t) => t.toLowerCase().replace(/[áéíóúüñ]/g, (c) => ({ á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u', ñ: 'n' })[c]);
const isOutOfScope = (msg) => GUARD.patterns.some((p) => p.test(normalize(msg)));

// Fichas del catálogo traducidas para la versión en inglés (clave: el nombre en español)
const EN_PLAGAS = {
  Mildiu: { nombre: 'Downy mildew', sintomas: 'Oily spots on the upper leaf surface, white mold on the underside, defoliation', tratamiento_preventivo: 'Copper during dormancy and budbreak, drainage, wide planting spacing', tratamiento_curativo: 'Systemic fungicide (metalaxyl + copper) at the first symptom' },
  Botrytis: { nombre: 'Botrytis', sintomas: 'Gray rot on bunches, mummified berries, gray sporulation', tratamiento_preventivo: 'Leaf removal, vigor control, canopy ventilation, removal of debris', tratamiento_curativo: 'Specific fungicide (cyprodinil, fludioxonil) before bunch closure' },
  'Oídio': { nombre: 'Powdery mildew', sintomas: 'Whitish powder on leaves, shoots and bunches, deformation', tratamiento_preventivo: 'Sulfur dusting from budbreak, canopy ventilation', tratamiento_curativo: 'Systemic fungicide (quinoxyfen, metrafenone) on detection' },
  Antracnosis: { nombre: 'Anthracnose', sintomas: 'Sunken necrotic lesions on leaves, shoots and berries ("bird’s eye")', tratamiento_preventivo: 'Pruning of infected debris, copper fungicide during dormancy', tratamiento_curativo: 'Systemic fungicide (difenoconazole) at budbreak' },
  Yesca: { nombre: 'Esca', sintomas: 'Intermittent wilting of arms, chlorotic leaves with necrotic margins', tratamiento_preventivo: 'Prune in dry weather, disinfect tools, seal wounds', tratamiento_curativo: 'No cure: rebuild the arm or remove the vine' },
  Eutipiosis: { nombre: 'Eutypa dieback', sintomas: 'Dead arms, short chlorotic shoots, lesion in the pruning wood', tratamiento_preventivo: 'Prune in dry weather, protect pruning wounds with sealing paste', tratamiento_curativo: 'Rebuild the vine with new arms from the trunk' },
  Filoxera: { nombre: 'Phylloxera', sintomas: 'Galls and swellings on roots, progressive decline, chlorosis', tratamiento_preventivo: 'Use only resistant American rootstocks', tratamiento_curativo: 'No cure: remove and replant on a resistant rootstock' },
  'Chanchito blanco': { nombre: 'Vine mealybug', sintomas: 'Cottony colonies on roots, trunk and bunches, honeydew and sooty mold', tratamiento_preventivo: 'Pheromone monitoring, release of Anagyrus pseudococci', tratamiento_curativo: 'Systemic insecticide (chlorpyrifos) aimed at the trunk and bunch' },
  'Mosca del vinagre': { nombre: 'Spotted wing drosophila', sintomas: 'Punctures in berries, egg laying, secondary rot', tratamiento_preventivo: 'Bait traps, timely harvest, removal of fallen fruit', tratamiento_curativo: 'Specific insecticide (spinosad) near harvest, exclusion netting' },
  Trips: { nombre: 'Thrips', sintomas: 'Silvering on leaves, deformed shoots and berries, cosmetic damage', tratamiento_preventivo: 'Monitoring with blue sticky traps, trap crops', tratamiento_curativo: 'Selective insecticide (spinosad, abamectin) once the threshold is exceeded' },
};
const EN_TIPO = { blanca: 'white', tinta: 'red' };
const EN_CICLO = { corto: 'short', medio: 'medium', largo: 'long' };

const plagas = lang === 'es' ? catalogo.plagas : catalogo.plagas.map((p) => ({ ...p, ...EN_PLAGAS[p.nombre] }));
const variedades = lang === 'es'
  ? catalogo.variedades
  : catalogo.variedades.map((v) => ({
    ...v,
    tipo: EN_TIPO[v.tipo] ?? v.tipo,
    ciclo: EN_CICLO[v.ciclo] ?? v.ciclo,
    plagas: v.plagas.map((n) => EN_PLAGAS[n]?.nombre ?? n),
  }));

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const fmt = (n) => Number(n).toLocaleString(locale, { maximumFractionDigits: 2 });

const T = pick({
  es: {
    re: { prevenir: /prev/, tratar: /(trat|cur|control|elimin)/, plagasDe: /(plaga|enfermedad|vigilar|riesgo)/, estaVariedad: /(esta variedad|la variedad)/ },
    ficha: 'Ficha',
    prevenir: (p) => `Para prevenir ${p.nombre.toLowerCase()} (${p.nombre_cientifico}): ${p.tratamiento_preventivo}.`,
    tratar: (p) => `Tratamiento curativo para ${p.nombre.toLowerCase()}: ${p.tratamiento_curativo}.`,
    plaga: (p) => `${p.nombre} (${p.nombre_cientifico}). Síntomas: ${p.sintomas}. Prevención: ${p.tratamiento_preventivo}.`,
    sinPlagas: (v) => `La ficha de ${v.nombre} no registra plagas comunes.`,
    variedadFicha: (v) => `Variedad ${v.tipo}, ciclo ${v.ciclo}.`,
    vigila: (v, lista) => `En ${v.nombre} vigila sobre todo: ${lista}.`,
    comunes: (v) => `Plagas comunes: ${v.plagas.join(', ')}`,
    rango: (v) => `Para ${v.nombre}, el rango óptimo de cosecha es ${fmt(v.brix_optimo_cosecha_min)}–${fmt(v.brix_optimo_cosecha_max)} °Brix, pH ${fmt(v.ph_optimo_min)}–${fmt(v.ph_optimo_max)} y acidez total ${fmt(v.at_optimo_min_g_l)}–${fmt(v.at_optimo_max_g_l)} g/L. Es una variedad ${v.tipo} de ciclo ${v.ciclo}.`,
    limite: 'En CosechIA esta pregunta la respondería el agente con el LLM y la búsqueda en fichas y manuales. En este demo solo respondo con las fichas del catálogo: pregunta por una variedad (p. ej. Merlot) o una plaga (p. ej. Botrytis).',
    madurando: (falta) => `Aún madurando: faltan ${falta} °Brix para el mínimo.`,
    sobre: 'Sobremaduración: el azúcar ya pasó el óptimo, conviene cosechar.',
    revisar: 'Azúcar en rango, pero pH o acidez fuera del óptimo: revisa antes de cosechar.',
    listo: 'En ventana de cosecha: Brix, pH y acidez dentro del óptimo.',
    lectura: 'Lectura de maduración', maduracion: 'Maduración', variedad: 'Variedad',
    pie: 'Rangos óptimos tomados de la ficha de cada variedad en el catálogo de CosechIA.',
    agente: 'Agente de CosechIA', agenteEyebrow: 'Agente',
    placeholder: 'Pregunta sobre tu viñedo…', preguntaAria: 'Pregunta para el agente', enviar: 'Enviar',
    acidez: 'Acidez total (g/L)', optimo: 'Óptimo',
    sugerencias: (v) => [`¿Cuál es el rango óptimo de cosecha del ${v}?`, `¿Qué plagas debo vigilar en ${v}?`, '¿Cómo prevengo el mildiu?', 'Escríbeme un script en Python para el viñedo'],
    tagDemo: 'Límite del demo',
    saludo: 'Hola. Puedo consultar las fichas de variedades y plagas del catálogo. Pregúntame por una variedad o una plaga.',
  },
  en: {
    re: { prevenir: /prev/, tratar: /(treat|cure|control|get rid|elimin)/, plagasDe: /(pest|disease|watch|risk)/, estaVariedad: /(this variety|the variety)/ },
    ficha: 'Sheet',
    prevenir: (p) => `To prevent ${p.nombre.toLowerCase()} (${p.nombre_cientifico}): ${lowerFirst(p.tratamiento_preventivo)}.`,
    tratar: (p) => `Curative treatment for ${p.nombre.toLowerCase()}: ${lowerFirst(p.tratamiento_curativo)}.`,
    plaga: (p) => `${p.nombre} (${p.nombre_cientifico}). Symptoms: ${lowerFirst(p.sintomas)}. Prevention: ${lowerFirst(p.tratamiento_preventivo)}.`,
    sinPlagas: (v) => `The ${v.nombre} sheet lists no common pests.`,
    variedadFicha: (v) => `${v.tipo[0].toUpperCase()}${v.tipo.slice(1)} variety, ${v.ciclo} cycle.`,
    vigila: (v, lista) => `In ${v.nombre}, watch above all for: ${lista}.`,
    comunes: (v) => `Common pests: ${v.plagas.join(', ')}`,
    rango: (v) => `For ${v.nombre}, the optimal harvest range is ${fmt(v.brix_optimo_cosecha_min)}–${fmt(v.brix_optimo_cosecha_max)} °Brix, pH ${fmt(v.ph_optimo_min)}–${fmt(v.ph_optimo_max)} and total acidity ${fmt(v.at_optimo_min_g_l)}–${fmt(v.at_optimo_max_g_l)} g/L. It’s a ${v.tipo} variety with a ${v.ciclo} cycle.`,
    limite: 'In CosechIA the agent would answer this with the LLM and search over data sheets and manuals. In this demo I only answer from the catalog sheets: ask about a variety (e.g. Merlot) or a pest (e.g. Botrytis).',
    madurando: (falta) => `Still ripening: ${falta} °Brix short of the minimum.`,
    sobre: 'Overripe: sugar is already past the optimum, harvest soon.',
    revisar: 'Sugar in range, but pH or acidity outside the optimum: check before harvesting.',
    listo: 'In the harvest window: Brix, pH and acidity within the optimum.',
    lectura: 'Ripeness reading', maduracion: 'Ripeness', variedad: 'Variety',
    pie: 'Optimal ranges taken from each variety’s sheet in the CosechIA catalog.',
    agente: 'CosechIA agent', agenteEyebrow: 'Agent',
    placeholder: 'Ask about your vineyard…', preguntaAria: 'Question for the agent', enviar: 'Send',
    acidez: 'Total acidity (g/L)', optimo: 'Optimal',
    sugerencias: (v) => [`What is the optimal harvest range for ${v}?`, `Which pests should I watch for in ${v}?`, 'How do I prevent downy mildew?', 'Write me a Python script for the vineyard'],
    tagDemo: 'Demo limit',
    saludo: 'Hi. I can look up the catalog’s variety and pest sheets. Ask me about a variety or a pest.',
  },
});

// Respuesta armada con las fichas del catálogo, citadas como lo pide el agente: [Ficha: nombre]
function responder(pregunta, vSel) {
  if (isOutOfScope(pregunta)) return { texto: GUARD.rejection, citas: [], guard: true };
  const q = normalize(pregunta);
  const ficha = (nombre) => `${T.ficha}: ${nombre}`;
  const plaga = plagas.find((p) => q.includes(normalize(p.nombre)));
  const variedad = variedades.find((v) => q.includes(normalize(v.nombre))) || (T.re.estaVariedad.test(q) ? vSel : null);

  if (plaga) {
    const cita = { title: ficha(plaga.nombre), snippet: plaga.sintomas };
    let texto;
    if (T.re.prevenir.test(q)) texto = T.prevenir(plaga);
    else if (T.re.tratar.test(q)) texto = T.tratar(plaga);
    else texto = T.plaga(plaga);
    return { texto: `${texto} [${ficha(plaga.nombre)}]`, citas: [cita] };
  }
  if (variedad) {
    const v = variedad;
    if (T.re.plagasDe.test(q)) {
      const ps = v.plagas.map((n) => plagas.find((p) => p.nombre === n)).filter(Boolean);
      if (!ps.length) return { texto: `${T.sinPlagas(v)} [${ficha(v.nombre)}]`, citas: [{ title: ficha(v.nombre), snippet: T.variedadFicha(v) }] };
      const lista = ps.map((p) => `${p.nombre}: ${p.sintomas.toLowerCase()}`).join('; ');
      return {
        texto: `${T.vigila(v, lista)} ${ps.map((p) => `[${ficha(p.nombre)}]`).join(' ')}`,
        citas: [{ title: ficha(v.nombre), snippet: T.comunes(v) }, ...ps.map((p) => ({ title: ficha(p.nombre), snippet: p.sintomas }))],
      };
    }
    return {
      texto: `${T.rango(v)} [${ficha(v.nombre)}]`,
      citas: [{ title: ficha(v.nombre), snippet: `Brix ${v.brix_optimo_cosecha_min}–${v.brix_optimo_cosecha_max}, pH ${v.ph_optimo_min}–${v.ph_optimo_max}` }],
    };
  }
  return { texto: T.limite, citas: [], demo: true };
}

function veredicto(v, brix, ph, at) {
  const enRango = (x, a, b) => x >= a && x <= b;
  if (brix < v.brix_optimo_cosecha_min) return ['madurando', T.madurando(fmt(v.brix_optimo_cosecha_min - brix))];
  if (brix > v.brix_optimo_cosecha_max) return ['sobre', T.sobre];
  if (!enRango(ph, v.ph_optimo_min, v.ph_optimo_max) || !enRango(at, v.at_optimo_min_g_l, v.at_optimo_max_g_l)) {
    return ['revisar', T.revisar];
  }
  return ['listo', T.listo];
}

export function mount(root) {
  root.innerHTML = `
    <div class="cdemo">
      <section class="cd-madurez" aria-label="${T.lectura}">
        <p class="cd-eyebrow">${T.maduracion}</p>
        <label class="cd-field">${T.variedad}
          <select>${variedades.map((v, i) => `<option value="${i}" ${v.nombre === 'Cabernet Sauvignon' ? 'selected' : ''}>${esc(v.nombre)}</option>`).join('')}</select>
        </label>
        <div class="cd-metrics"></div>
        <p class="cd-verdict" role="status" aria-live="polite"></p>
        <p class="cd-foot">${T.pie}</p>
      </section>
      <section class="cd-agente" aria-label="${T.agente}">
        <p class="cd-eyebrow">${T.agenteEyebrow}</p>
        <div class="cd-chat" role="log" aria-live="polite"></div>
        <div class="cd-chips"></div>
        <form class="cd-input"><input type="text" placeholder="${T.placeholder}" aria-label="${T.preguntaAria}" maxlength="160" autocomplete="off"><button type="submit">${T.enviar}</button></form>
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
    ['at', T.acidez, 4, 10, 0.1, 'at_optimo_min_g_l', 'at_optimo_max_g_l'],
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
        <small>${T.optimo} ${fmt(v[a])}–${fmt(v[b])}</small></div>`;
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
    chips.innerHTML = T.sugerencias(vSel().nombre).map((s) => `<button type="button">${esc(s)}</button>`).join('');
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
    const tag = r.guard ? '<span class="cd-tag">DomainGuard</span>' : r.demo ? `<span class="cd-tag">${T.tagDemo}</span>` : '';
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
  mensaje(`<p>${T.saludo}</p>`, 'bot');
}
