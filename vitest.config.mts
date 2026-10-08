import { defineConfig } from 'vitest/config';

// Pruebas del backend de la Meido pública (convex/*.test.ts) con convex-test
export default defineConfig({
  test: {
    environment: 'edge-runtime',
    include: ['convex/**/*.test.ts'],
    server: { deps: { inline: ['convex-test'] } },
  },
});
