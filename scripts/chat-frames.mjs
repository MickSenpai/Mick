// Fotogramas ligeros de Meido para el chat (de src/demos/meido-frames.json, que genera
// gen_meido_frames.py con el código real del personaje): 3 estados a 6 fps.
//   node scripts/chat-frames.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const todo = JSON.parse(readFileSync(new URL('../src/demos/meido-frames.json', import.meta.url)));
const salida = {};
for (const estado of ['reposo', 'pensando', 'hablando']) {
  const { fps, frames } = todo[estado];
  salida[estado] = { fps: fps / 2, frames: frames.filter((_, i) => i % 2 === 0) };
}
writeFileSync(new URL('../src/chat/frames.json', import.meta.url), JSON.stringify(salida));
console.log('src/chat/frames.json:', JSON.stringify(salida).length, 'bytes');
