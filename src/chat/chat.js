// Chat con la Meido pública (backend en convex/). Lo usan la página /meido y la burbuja del
// portafolio. La conversación se abre con el primer mensaje (con captcha) y su clave se
// recuerda en este navegador para seguirla al volver.
import { ConvexClient } from 'convex/browser';
import { api } from '../../convex/_generated/api.js';
import { lang, pick } from '../i18n.js';
import frames from './frames.json';
import './chat.css';

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
const SITEKEY = import.meta.env.VITE_TURNSTILE_SITEKEY;
// Publicado sin captcha configurado: el backend rechazaría la conversación, así que ni se intenta
const DISPONIBLE = Boolean(CONVEX_URL) && (Boolean(SITEKEY) || !import.meta.env.PROD);
const EMAIL = 'mick967@hotmail.com';
const CLAVE = 'meido-chat-clave';
const MAX_TEXTO = 800;

export const T = pick({
  en: {
    saludo: 'Hello, I’m Meido, Omar’s AI assistant. I can tell you about his work and experience, or pass him a message. How can I help you?',
    nombre: 'Meido',
    sub: 'Omar Reyes’s AI assistant',
    placeholder: 'Write a message…',
    enviar: 'Send',
    escribiendo: 'Meido is typing…',
    nueva: 'New chat',
    aviso: 'Conversations are kept for 15 days so Omar can read them. Please don’t share sensitive information.',
    restantes: (n) => `${n} message${n === 1 ? '' : 's'} left in this chat`,
    sugerencias: ['What does Omar work on?', 'Is he open to job offers?', 'I’d like to contact him'],
    log: 'Conversation with Meido',
    errores: {
      captcha: 'I couldn’t verify that you’re human. Reload the page and try again.',
      largo: `The message is too long (${MAX_TEXTO} characters max).`,
      ocupada: 'Wait for Meido to finish replying.',
      tope: `This chat reached its message limit. You can write to Omar at ${EMAIL}.`,
      limite: 'Too many messages too quickly. Try again in a moment.',
      red: 'There was a connection problem. Try again.',
      apagado: `The chat isn’t available right now. You can write to Omar at ${EMAIL}.`,
    },
  },
  es: {
    saludo: 'Hola, soy Meido, la asistente de IA de Omar. Puedo contarle sobre su trabajo y experiencia, o hacerle llegar un mensaje. ¿En qué le puedo ayudar?',
    nombre: 'Meido',
    sub: 'Asistente de IA de Omar Reyes',
    placeholder: 'Escribe un mensaje…',
    enviar: 'Enviar',
    escribiendo: 'Meido está escribiendo…',
    nueva: 'Nuevo chat',
    aviso: 'Las conversaciones se guardan 15 días para que Omar pueda leerlas. No compartas información sensible.',
    restantes: (n) => `Te ${n === 1 ? 'queda 1 mensaje' : `quedan ${n} mensajes`} en este chat`,
    sugerencias: ['¿En qué trabaja Omar?', '¿Está buscando trabajo?', 'Quiero contactarlo'],
    log: 'Conversación con Meido',
    errores: {
      captcha: 'No pude verificar que eres humano. Recarga la página e inténtalo de nuevo.',
      largo: `El mensaje es demasiado largo (máximo ${MAX_TEXTO} caracteres).`,
      ocupada: 'Espera a que Meido termine de responder.',
      tope: `Este chat llegó a su límite de mensajes. Puedes escribirle a Omar a ${EMAIL}.`,
      limite: 'Demasiados mensajes seguidos. Inténtalo en un momento.',
      red: 'Hubo un problema de conexión. Inténtalo de nuevo.',
      apagado: `El chat no está disponible ahora. Puedes escribirle a Omar a ${EMAIL}.`,
    },
  },
});

const guardado = {
  leer: () => {
    try {
      return localStorage.getItem(CLAVE);
    } catch {
      return null;
    }
  },
  poner: (v) => {
    try {
      if (v) localStorage.setItem(CLAVE, v);
      else localStorage.removeItem(CLAVE);
    } catch {
      /* sin almacenamiento: la conversación dura lo que la pestaña */
    }
  },
};

function el(tag, clase, texto) {
  const e = document.createElement(tag);
  if (clase) e.className = clase;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

// Texto con enlaces (URLs y correos) sin usar innerHTML: lo que escribe el modelo es texto
const ENLACE = /(https?:\/\/[^\s<>"]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;
function conEnlaces(texto) {
  const f = document.createDocumentFragment();
  let i = 0;
  for (const m of texto.matchAll(ENLACE)) {
    let url = m[0];
    const sobra = url.match(/[.,;:!?)\]]+$/)?.[0] ?? '';
    url = url.slice(0, url.length - sobra.length);
    f.append(texto.slice(i, m.index));
    const a = el('a', '', url);
    a.href = url.includes('@') && !url.startsWith('http') ? `mailto:${url}` : url;
    if (a.href.startsWith('http')) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    f.append(a);
    i = m.index + url.length;
  }
  f.append(texto.slice(i));
  return f;
}

/** Meido animada (los fotogramas reales del personaje) en un elemento. */
export function crearAvatar(contenedor) {
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let estado = 'reposo';
  let frame = 0;
  let timer = 0;
  function pintar() {
    const st = frames[estado];
    contenedor.innerHTML = st.frames[reducido ? 0 : frame % st.frames.length]; // SVG propio, generado
    frame++;
  }
  function poner(nuevo) {
    if (nuevo === estado && timer) return;
    estado = nuevo;
    frame = 0;
    clearInterval(timer);
    pintar();
    if (!reducido) timer = setInterval(pintar, 1000 / frames[estado].fps);
  }
  poner('reposo');
  return { poner, parar: () => clearInterval(timer) };
}

let turnstile = null;
function cargarTurnstile() {
  turnstile ??= new Promise((ok, mal) => {
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = () => ok(window.turnstile);
    s.onerror = () => {
      turnstile = null;
      mal(new Error('turnstile'));
    };
    document.head.append(s);
  });
  return turnstile;
}

async function pasarCaptcha(contenedor) {
  if (!SITEKEY) return 'sin-captcha'; // desarrollo: el backend local lo acepta con MEIDO_SIN_CAPTCHA
  const ts = await cargarTurnstile();
  return await new Promise((ok, mal) => {
    const id = ts.render(contenedor, {
      sitekey: SITEKEY,
      appearance: 'interaction-only',
      language: lang,
      callback: (token) => {
        ok(token);
        setTimeout(() => ts.remove(id), 0);
      },
      'error-callback': () => mal(new Error('captcha')),
    });
  });
}

function motivo(error) {
  const d = error?.data;
  if (typeof d === 'string' && d in T.errores) return T.errores[d];
  if (d && typeof d === 'object' && d.kind === 'RateLimited') {
    return d.name === 'mensaje' ? T.errores.limite : T.errores.apagado;
  }
  if (error?.message === 'captcha') return T.errores.captcha;
  return T.errores.red;
}

/**
 * Monta el chat en `raiz`. opciones.de: de dónde llega el visitante ("portafolio", "linkedin"…).
 * Devuelve { enfocar, destruir }.
 */
export function montarChat(raiz, { de = 'portafolio', avatar = null } = {}) {
  raiz.classList.add('mchat');
  const log = el('div', 'mchat-log');
  log.setAttribute('role', 'log');
  log.setAttribute('aria-live', 'polite');
  log.setAttribute('aria-label', T.log);
  const sugerencias = el('div', 'mchat-sug');
  const estado = el('p', 'mchat-estado');
  estado.setAttribute('aria-live', 'polite');
  const captcha = el('div', 'mchat-captcha');
  const form = el('form', 'mchat-form');
  const campo = el('textarea', 'mchat-campo');
  campo.rows = 1;
  campo.maxLength = MAX_TEXTO;
  campo.placeholder = T.placeholder;
  campo.setAttribute('aria-label', T.placeholder);
  const boton = el('button', 'mchat-enviar', T.enviar);
  boton.type = 'submit';
  form.append(campo, boton);
  const pie = el('div', 'mchat-pie');
  const aviso = el('p', 'mchat-aviso', T.aviso);
  const nueva = el('button', 'mchat-nueva', T.nueva);
  nueva.type = 'button';
  pie.append(aviso, nueva);
  raiz.append(log, sugerencias, estado, captcha, form, pie);

  const cliente = DISPONIBLE ? new ConvexClient(CONVEX_URL) : null;
  let clave = guardado.leer();
  let datos = null; // lo último del servidor
  let pendiente = null; // lo que el visitante acaba de mandar y aún no llega del servidor
  let enviando = false;
  let parar = null;
  let ultimoMeido = '';
  let hablandoHasta = 0;

  function pintar() {
    const mensajes = datos?.mensajes ?? [{ key: 'saludo', rol: 'meido', texto: T.saludo }];
    log.replaceChildren(
      ...mensajes.map((m) => {
        const b = el('div', `mchat-msg mchat-${m.rol}`);
        b.append(conEnlaces(m.texto));
        return b;
      }),
    );
    if (pendiente) log.append(el('div', 'mchat-msg mchat-visitante mchat-pendiente', pendiente));
    const pensando = Boolean(pendiente) || Boolean(datos?.pensando);
    if (pensando) {
      const p = el('div', 'mchat-msg mchat-meido mchat-escribiendo');
      p.setAttribute('aria-label', T.escribiendo);
      p.append(el('span'), el('span'), el('span'));
      log.append(p);
    }
    log.scrollTop = log.scrollHeight;

    // Sugerencias solo al empezar
    const vacio = !datos || datos.mensajes.every((m) => m.rol === 'meido');
    sugerencias.replaceChildren(
      ...(vacio && !pendiente
        ? T.sugerencias.map((s) => {
            const b = el('button', '', s);
            b.type = 'button';
            b.addEventListener('click', () => enviar(s));
            return b;
          })
        : []),
    );
    const restantes = datos?.restantes ?? Infinity;
    if (restantes <= 5 && !estado.dataset.error) estado.textContent = T.restantes(restantes);
    boton.disabled = enviando || pensando || restantes <= 0 || !cliente;
    campo.disabled = restantes <= 0 || !cliente;
    nueva.hidden = !datos;

    // La cara de Meido sigue a la conversación
    const ultimo = [...mensajes].reverse().find((m) => m.rol === 'meido');
    if (ultimo && datos && ultimo.key !== ultimoMeido) {
      if (ultimoMeido) hablandoHasta = Date.now() + 2600;
      ultimoMeido = ultimo.key;
    }
    if (avatar) {
      if (pensando) avatar.poner('pensando');
      else if (Date.now() < hablandoHasta) {
        avatar.poner('hablando');
        setTimeout(pintar, hablandoHasta - Date.now() + 20);
      } else avatar.poner('reposo');
    }
  }

  function error(texto) {
    estado.textContent = texto;
    estado.dataset.error = texto ? '1' : '';
    estado.classList.toggle('mchat-error', Boolean(texto));
  }

  function suscribir() {
    parar?.();
    parar = cliente.onUpdate(
      api.chat.conversacion,
      { clave },
      (r) => {
        if (r === null) {
          // Se borró (15 días) o no existe: empezar de cero
          clave = null;
          guardado.poner(null);
          datos = null;
          parar?.();
          parar = null;
        } else {
          datos = r;
          if (pendiente && r.mensajes.some((m) => m.rol === 'visitante' && m.texto === pendiente)) pendiente = null;
        }
        pintar();
      },
      () => error(T.errores.red),
    );
  }

  async function enviar(texto) {
    texto = texto.trim();
    if (!texto || enviando || !cliente) return;
    error('');
    enviando = true;
    pendiente = texto;
    campo.value = '';
    ajustar();
    pintar();
    try {
      if (!clave) {
        const token = await pasarCaptcha(captcha);
        clave = await cliente.action(api.chat.empezar, { captcha: token, de, idioma: lang });
        guardado.poner(clave);
        suscribir();
      }
      await cliente.mutation(api.chat.enviar, { clave, texto });
    } catch (e) {
      pendiente = null;
      campo.value = texto;
      error(motivo(e));
    } finally {
      enviando = false;
      pintar();
    }
  }

  function ajustar() {
    campo.style.height = 'auto';
    campo.style.height = `${Math.min(campo.scrollHeight, 140)}px`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    enviar(campo.value);
  });
  campo.addEventListener('input', ajustar);
  campo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      enviar(campo.value);
    }
  });
  nueva.addEventListener('click', () => {
    parar?.();
    parar = null;
    clave = null;
    datos = null;
    ultimoMeido = '';
    guardado.poner(null);
    error('');
    pintar();
    campo.focus();
  });

  if (!cliente) error(T.errores.apagado);
  else if (clave) suscribir();
  pintar();

  return {
    enfocar: () => campo.focus(),
    destruir: () => {
      parar?.();
      cliente?.close();
      avatar?.parar();
    },
  };
}
