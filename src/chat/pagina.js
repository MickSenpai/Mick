// Página propia del chat: micksenpai.github.io/Mick/meido (?de=linkedin para saber de dónde llegan)
import { lang, pick, setLang } from '../i18n.js';
import { crearAvatar, montarChat } from './chat.js';
import './pagina.css';

const T = pick({
  en: {
    title: 'Talk to Meido — Omar Reyes’s AI assistant',
    volver: '← Portfolio',
    etiqueta: 'Live demo · AI',
    titulo: 'Talk to Meido',
    sub: 'Omar Reyes’s AI assistant. Ask about his work, or leave him a message — he replies personally.',
    cambiar: { label: 'ES', aria: 'Ver en español' },
  },
  es: {
    title: 'Habla con Meido — la asistente de IA de Omar Reyes',
    volver: '← Portafolio',
    etiqueta: 'Demo en vivo · IA',
    titulo: 'Habla con Meido',
    sub: 'La asistente de IA de Omar Reyes. Pregúntale por su trabajo o déjale un mensaje: él responde en persona.',
    cambiar: { label: 'EN', aria: 'View in English' },
  },
});

document.documentElement.lang = lang;
document.title = T.title;
document.querySelectorAll('[data-t]').forEach((e) => (e.textContent = T[e.dataset.t]));
const otro = lang === 'en' ? 'es' : 'en';
const cambiar = document.querySelector('[data-lang-switch]');
cambiar.textContent = T.cambiar.label;
cambiar.setAttribute('aria-label', T.cambiar.aria);
cambiar.setAttribute('lang', otro);
cambiar.addEventListener('click', () => setLang(otro));

const de = new URLSearchParams(location.search).get('de') || 'enlace';
const chat = montarChat(document.getElementById('chat'), { de, avatar: crearAvatar(document.getElementById('cara')) });
if (window.matchMedia('(pointer: fine)').matches) chat.enfocar();
