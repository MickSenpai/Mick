// Port a JavaScript de meido_movil/lib/offline.dart (modo sin conexión de Meido Móvil).
// Mismas reglas y mismas respuestas; solo cambia el lenguaje.

const NUMEROS_HORA = ['doce', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once'];
const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre',
  'noviembre', 'diciembre'];

function minutosEnPalabras(m) {
  const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const hasta29 = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once',
    'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte',
    'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete',
    'veintiocho', 'veintinueve'];
  if (m < 30) return hasta29[m];
  const decena = { 3: 'treinta', 4: 'cuarenta', 5: 'cincuenta' }[Math.floor(m / 10)];
  return m % 10 === 0 ? decena : `${decena} y ${unidades[m % 10]}`;
}

const NUMEROS = {
  una: 1, un: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7,
  ocho: 8, nueve: 9, diez: 10, once: 11, doce: 12, quince: 15, veinte: 20,
  veinticinco: 25, treinta: 30, cuarenta: 40, cincuenta: 50,
  noventa: 90,
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20, thirty: 30,
};

const norm = (s) => s
  .toLowerCase()
  .replace(/[áà]/g, 'a')
  .replace(/[éè]/g, 'e')
  .replace(/[íì]/g, 'i')
  .replace(/[óò]/g, 'o')
  .replace(/[úù]/g, 'u')
  .replace(/^\s*meido,?\s*/, '')
  .replace(/[¿?¡!.,]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

function numero(s) {
  s = s.trim();
  return /^\d+$/.test(s) ? parseInt(s, 10) : (NUMEROS[s] ?? null);
}

const NUM = `(\\d+|${Object.keys(NUMEROS).join('|')})`;

/** "¿Qué hora es?" / "¿qué día es hoy?"; null si pregunta otra cosa. */
export function horaFecha(texto, a = new Date()) {
  const t = norm(texto);
  if (/^(oye )?(me (dices|puedes decir) )?(que hora (es|tienes)|la hora)( por favor)?$/.test(t)) {
    const h = NUMEROS_HORA[a.getHours() % 12];
    const hr = a.getHours();
    const parte = hr < 6 ? 'de la madrugada' : hr < 12 ? 'de la mañana' : hr < 20 ? 'de la tarde' : 'de la noche';
    const m = a.getMinutes();
    const minutos = m === 0 ? 'en punto' : m === 15 ? 'y cuarto' : m === 30 ? 'y media' : `y ${minutosEnPalabras(m)}`;
    return `${h === 'una' ? 'Es la' : 'Son las'} ${h} ${minutos} ${parte}, Señor.`;
  }
  if (/^(oye )?(que (dia|fecha) es( hoy)?|a que estamos( hoy)?)( por favor)?$/.test(t)) {
    const dia = DIAS[(a.getDay() + 6) % 7]; // Dart: lunes = 1
    return `Hoy es ${dia} ${a.getDate()} de ${MESES[a.getMonth()]} de ${a.getFullYear()}, Señor.`;
  }
  return null;
}

/** La orden sin red ({herramienta, args, respuesta}) o null si hace falta el cerebro. */
export function interpretar(texto) {
  const t = norm(texto);
  if (!t) return null;
  const orden = (herramienta, args, respuesta) => ({ herramienta, args, respuesta });

  // Linterna
  if (/\b(linterna|flashlight|torch)\b/.test(t)) {
    const apagar = /\b(apaga|apagar|quita|off|turn off)\b/.test(t);
    return orden('linterna', { encender: !apagar }, apagar ? 'Linterna apagada.' : 'Linterna encendida.');
  }

  // Temporizador: "temporizador de 5 minutos", "pon un timer de diez minutos"
  const temp = new RegExp(`\\b(temporizador|timer|cuenta atras)\\b.*?\\b${NUM}\\s*(segundos?|minutos?|horas?|seconds?|minutes?|hours?)\\b`).exec(t);
  if (temp) {
    const n = numero(temp[2]) ?? 0;
    const unidad = temp[3];
    const seg = unidad.startsWith('h') ? n * 3600 : unidad.startsWith('m') ? n * 60 : n;
    if (seg > 0 && seg <= 86400) {
      return orden('poner_temporizador', { segundos: seg }, `Temporizador de ${temp[2]} ${temp[3]}.`);
    }
  }

  // Alarma: "pon una alarma a las 7", "alarma a las 6 y media de la mañana", "alarm at 7:30 pm"
  const alarma = new RegExp(`\\b(alarma|despiertame|despertador|alarm|wake me)\\b.*?\\b(?:a las|para las|at|a la)\\s+${NUM}`
    + '(?::(\\d{2})|\\s+y\\s+(media|cuarto)|\\s+menos\\s+cuarto)?'
    + '(?:\\s+(de la manana|de la tarde|de la noche|am|pm|a m|p m))?').exec(t);
  if (alarma) {
    let hora = numero(alarma[2]) ?? -1;
    let minuto = parseInt(alarma[3] ?? '', 10);
    if (Number.isNaN(minuto)) minuto = 0;
    if (alarma[4] === 'media') minuto = 30;
    if (alarma[4] === 'cuarto') minuto = 15;
    if (alarma[0].includes('menos cuarto')) {
      hora -= 1;
      minuto = 45;
    }
    const parte = alarma[5] ?? '';
    if (hora === 12 && (parte.includes('noche') || parte === 'am' || parte === 'a m')) {
      hora = 0;
    } else if ((parte.includes('tarde') || parte.includes('noche') || parte.startsWith('p')) && hora < 12) {
      hora += 12;
    }
    if (hora >= 0 && hora < 24 && minuto < 60) {
      const hh = `${hora}:${String(minuto).padStart(2, '0')}`;
      return orden('poner_alarma', { hora: hh }, `Alarma puesta a las ${hh}.`);
    }
  }

  // Música
  if (/\b(siguiente|next|salta|skip)\b/.test(t) && /\b(cancion|tema|musica|song|track)\b/.test(t)) {
    return orden('controlar_musica', { accion: 'siguiente' }, 'Siguiente.');
  }
  if (/\b(anterior|previous)\b/.test(t)) return orden('controlar_musica', { accion: 'anterior' }, 'Anterior.');
  if (/^(pausa|pausar|pause|para la musica|deten la musica|stop the music|pausa la musica)\b/.test(t)) {
    return orden('controlar_musica', { accion: 'pausa' }, 'En pausa.');
  }
  if (/^(reanuda|continua|sigue|resume|play)\b.*\b(musica|cancion|music)?/.test(t) && !t.includes('pc') && !t.includes('computadora')) {
    return orden('controlar_musica', { accion: 'play' }, 'Reanudada.');
  }

  // Volumen
  if (/\b(volumen|volume)\b/.test(t) || /^(silencia|mute)\b/.test(t)) {
    const fijo = /\b(?:al|a|to)\s+(\d{1,3})\b/.exec(t);
    if (fijo) {
      const n = Math.min(100, Math.max(0, parseInt(fijo[1], 10)));
      return orden('volumen_telefono', { accion: 'fijar', nivel: n }, `Volumen al ${n}.`);
    }
    if (/\b(sube|subir|up|mas alto)\b/.test(t)) return orden('volumen_telefono', { accion: 'subir' }, 'Subido.');
    if (/\b(baja|bajar|down|mas bajo)\b/.test(t)) return orden('volumen_telefono', { accion: 'bajar' }, 'Bajado.');
    if (/\b(silencia|mute)\b/.test(t)) return orden('volumen_telefono', { accion: 'silenciar' }, 'Silenciado.');
  }

  // Abrir una app: "abre whatsapp" (no "abre la pestaña…", eso es del PC y necesita red)
  const abrir = /^(?:abre|abrir|open)\s+(?:la app de |la aplicacion de |el |la )?([a-z0-9ñ ]{2,30})$/.exec(t);
  if (abrir && !/\b(pestana|pc|computadora|archivo|carpeta)\b/.test(t)) {
    return orden('abrir_app', { nombre: abrir[1].trim() }, `Abriendo ${abrir[1].trim()}.`);
  }
  return null;
}
