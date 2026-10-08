import { defineApp } from "convex/server";
import { v } from "convex/values";
import agent from "@convex-dev/agent/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";

// Variables del despliegue: npx convex env set NOMBRE valor
const app = defineApp({
  env: {
    // Clave de OpenRouter SOLO para la Meido pública, con límite de gasto mensual en OpenRouter
    OPENROUTER_API_KEY: v.optional(v.string()),
    MEIDO_MODELO: v.optional(v.string()), // por defecto google/gemini-3.5-flash-lite
    // Cloudflare Turnstile (captcha). Sin la clave secreta no se abre ninguna conversación,
    // salvo que MEIDO_SIN_CAPTCHA="1" (solo para el despliegue de desarrollo)
    TURNSTILE_SECRET: v.optional(v.string()),
    MEIDO_SIN_CAPTCHA: v.optional(v.string()),
    // Adónde avisar de cada recado: el endpoint de la nube privada de M.E.I.D.O y su clave
    MEIDO_RECADOS_URL: v.optional(v.string()),
    MEIDO_RECADOS_TOKEN: v.optional(v.string()),
  },
});
app.use(agent);
app.use(rateLimiter);
export default app;
