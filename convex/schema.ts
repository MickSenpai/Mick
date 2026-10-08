// Esquema de la Meido pública: la que atiende a los visitantes del portafolio.
// Los mensajes y los hilos los guarda el componente de agentes; aquí solo lo nuestro.
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const vIdioma = v.union(v.literal("en"), v.literal("es"));

export default defineSchema({
  // Una por visitante. `clave` es el secreto que guarda su navegador: sin ella no se lee
  // ni se escribe la conversación (el threadId nunca sale al cliente).
  conversaciones: defineTable({
    clave: v.string(),
    threadId: v.string(),
    de: v.string(), // de dónde llegó: "portafolio", "linkedin", "cv"…
    idioma: vIdioma,
    mensajes: v.number(), // cuántos ha enviado el visitante
    pensando: v.boolean(), // Meido está contestando
    ultimo: v.number(), // último movimiento (para borrarla a los 15 días)
  })
    .index("by_clave", ["clave"])
    .index("by_threadId", ["threadId"])
    .index("by_ultimo", ["ultimo"]),

  // Lo que el visitante quiere que le llegue a Omar
  recados: defineTable({
    conversacion: v.id("conversaciones"),
    nombre: v.string(),
    contacto: v.string(),
    motivo: v.string(),
    urgente: v.boolean(),
    de: v.string(),
    idioma: vIdioma,
    entregado: v.optional(v.number()), // cuándo lo recibió la nube privada de M.E.I.D.O
    intentos: v.number(),
  })
    .index("by_conversacion", ["conversacion"])
    .index("by_entregado", ["entregado"]),
});
