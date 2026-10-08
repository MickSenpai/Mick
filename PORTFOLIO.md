# Portfolio — Omar Reyes (Mick)

Portfolio guiado por **Meido**, en **inglés (por defecto) y español**: una pieza del cubo de Rubik que se desprende, presenta cada capítulo
con textos breves y, al final, vuelve a encajar en el cubo ya resuelto.

```bash
npm install
npm run dev      # desarrollo
npm run build    # genera dist/
```

## Estructura
| Archivo | Qué hace |
|---|---|
| `src/content.js` | **Todo el texto**, en inglés y español: datos personales, proyectos, stack, frases de Meido y textos de la interfaz |
| `src/i18n.js` | Idioma activo: inglés por defecto; `?lang=es` o el botón ES/EN (se recuerda en el navegador) |
| `src/ui/render.js` | Capítulos (orden y forma del cubo de cada uno) y su HTML |
| `src/three/cube.js` | Cubo con lógica de Rubik real (giros + historial) y las formas por capítulo |
| `src/three/meido.js` | Meido: vuelo, acoplamiento exacto a su hueco, ojos y parpadeo |
| `src/three/stage.js` | Dos capas WebGL con la misma cámara: cubo al fondo, Meido sobre el contenido |
| `src/ui/narrator.js` | Burbuja de texto (máquina de escribir) |
| `src/main.js` | Capítulo activo, composición en pantalla, intro y bucle de render |
| `src/chat/` | Chat con la Meido pública: `chat.js` (el chat), `burbuja.js` (botón y panel del portafolio), `pagina.js` (página propia) |
| `meido/index.html` | Página propia del chat: `/Mick/meido/` (`?de=linkedin`, `?de=cv`… para saber de dónde llegan) |
| `convex/` | Backend de la Meido pública (otro proyecto de Convex, aparte de la nube privada de M.E.I.D.O) |
| `public/cv/` · `public/logos/` | CV descargable (`Omar_Reyes_Resume.pdf` en inglés, `Omar_Reyes_CV.pdf` en español) y logo de Autum |

## Notas
- El cubo solo gira capas que no tocan la esquina de Meido, así su hueco siempre es la esquina frontal.
  Al llegar a Contacto se resuelve deshaciendo exactamente los giros hechos.
- Para cambiar una frase de Meido o un proyecto, edita solo `src/content.js` (las dos versiones, `en` y `es`).
- Los demos (`src/demos/`) tienen sus textos en un bloque `pick({ en, es })` al principio de cada archivo.
- Respeta `prefers-reduced-motion` (sin giros ni efecto de escritura).

## Meido pública (chat)
Una Meido aparte de la privada: formal, solo sabe lo que publica el portafolio (`convex/ficha.ts`, que se genera
de `src/content.js` con `npm run convex:ficha`) y su única herramienta es dejarle un recado a Omar. No tiene acceso
a nada de la nube privada; los recados se le entregan por `POST /recados` con una clave que solo sirve para eso.

- Límites: captcha (Cloudflare Turnstile) al abrir la conversación, 30 mensajes por conversación, ráfagas de 3,
  400 mensajes al día en todo el sitio y una clave de OpenRouter propia con tope mensual. Se borra a los 15 días.
- Desarrollo: `CONVEX_AGENT_MODE=anonymous npm run convex:dev` (backend local, sin cuenta) + `npm run dev`.
  Con `MEIDO_SIN_CAPTCHA=1` en el despliegue local no hace falta Turnstile; las claves de prueba de Cloudflare
  (`1x00000000000000000000AA` / `1x0000000000000000000000000000000AA`) también sirven.
- Pruebas: `npm test` (convex-test con un modelo simulado) y `npm run typecheck`.
- Producción: `npm run convex:deploy`. Variables del despliegue: `OPENROUTER_API_KEY`, `TURNSTILE_SECRET`,
  `MEIDO_RECADOS_URL` (`https://<nube-privada>.convex.site/recados`) y `MEIDO_RECADOS_TOKEN`. En el build de
  GitHub Pages: `VITE_CONVEX_URL` y `VITE_TURNSTILE_SITEKEY` (públicas).

