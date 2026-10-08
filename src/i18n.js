// Idioma del sitio: inglés por defecto; español con ?lang=es o el botón ES/EN.
// La elección se recuerda en este navegador (localStorage).

const SUPPORTED = ['en', 'es'];
const KEY = 'lang';

function detect() {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (SUPPORTED.includes(fromUrl)) {
    try {
      localStorage.setItem(KEY, fromUrl);
    } catch {
      /* sin almacenamiento: vale solo para esta visita */
    }
    return fromUrl;
  }
  try {
    const saved = localStorage.getItem(KEY);
    if (SUPPORTED.includes(saved)) return saved;
  } catch {
    /* sin almacenamiento */
  }
  return 'en';
}

export const lang = detect();
export const locale = lang === 'es' ? 'es-MX' : 'en-US';

/** El texto del idioma activo: pick({ en: '…', es: '…' }). */
export const pick = (byLang) => byLang[lang] ?? byLang.en;

/** Cambia de idioma: se guarda, queda en la URL (para compartirla) y se recarga. */
export function setLang(next) {
  if (!SUPPORTED.includes(next) || next === lang) return;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* sin almacenamiento: la URL lo lleva */
  }
  const url = new URL(window.location.href);
  if (next === 'en') url.searchParams.delete('lang');
  else url.searchParams.set('lang', next);
  window.location.assign(url);
}
