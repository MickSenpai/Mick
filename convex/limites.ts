// Límites para que nadie gaste la clave de OpenRouter (que además tiene tope mensual).
import { DAY, HOUR, MINUTE, RateLimiter } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const MAX_TEXTO = 800; // caracteres por mensaje del visitante
export const MAX_MENSAJES = 30; // mensajes del visitante por conversación
export const MAX_RECADOS = 3; // recados por conversación
export const DIAS_GUARDADO = 15; // luego se borra la conversación con sus recados

export const limites = new RateLimiter(components.rateLimiter, {
  // Conversaciones nuevas en todo el sitio
  conversacionNueva: { kind: "fixed window", rate: 40, period: HOUR },
  // Mensajes en todo el sitio, al día
  mensajesDia: { kind: "fixed window", rate: 400, period: DAY },
  // Por conversación: uno cada ~8 s, con ráfagas de 3
  mensaje: { kind: "token bucket", rate: 8, period: MINUTE, capacity: 3 },
});
