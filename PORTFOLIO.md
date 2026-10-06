# Portfolio — Omar Reyes (Mick)

Portfolio guiado por **Meido**: una pieza del cubo de Rubik que se desprende, presenta cada capítulo
con textos breves y, al final, vuelve a encajar en el cubo ya resuelto.

```bash
npm install
npm run dev      # desarrollo
npm run build    # genera dist/
```

## Estructura
| Archivo | Qué hace |
|---|---|
| `src/content.js` | **Todo el texto**: datos personales, proyectos, stack y frases de Meido |
| `src/ui/render.js` | Capítulos (orden y forma del cubo de cada uno) y su HTML |
| `src/three/cube.js` | Cubo con lógica de Rubik real (giros + historial) y las formas por capítulo |
| `src/three/meido.js` | Meido: vuelo, acoplamiento exacto a su hueco, ojos y parpadeo |
| `src/three/stage.js` | Dos capas WebGL con la misma cámara: cubo al fondo, Meido sobre el contenido |
| `src/ui/narrator.js` | Burbuja de texto (máquina de escribir) |
| `src/main.js` | Capítulo activo, composición en pantalla, intro y bucle de render |
| `public/cv/` · `public/logos/` | CV descargable y logo de Autum |

## Notas
- El cubo solo gira capas que no tocan la esquina de Meido, así su hueco siempre es la esquina frontal.
  Al llegar a Contacto se resuelve deshaciendo exactamente los giros hechos.
- Para cambiar una frase de Meido o un proyecto, edita solo `src/content.js`.
- Respeta `prefers-reduced-motion` (sin giros ni efecto de escritura).
