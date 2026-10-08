import { defineConfig } from 'vite';

// GitHub Pages sirve el sitio en https://micksenpai.github.io/Mick/
// Dos páginas: el portafolio y el chat con Meido (/Mick/meido/)
export default defineConfig({
  base: '/Mick/',
  build: {
    rollupOptions: {
      input: { main: 'index.html', meido: 'meido/index.html' },
    },
  },
});
