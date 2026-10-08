// El chat público: el visitante abre una conversación (con captcha), escribe y Meido contesta.
// Todo va por la `clave` de la conversación; el threadId del componente nunca sale al cliente.
import { createThread, listUIMessages, saveMessage } from "@convex-dev/agent";
import { ConvexError, v } from "convex/values";
import { components, internal } from "./_generated/api";
import {
  action,
  env,
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { limites, MAX_MENSAJES, MAX_TEXTO } from "./limites";
import { idiomaDe, ordenDeIdioma } from "./idioma";
import { crearMeido, EMAIL, INSTRUCCIONES } from "./meido";
import { vIdioma } from "./schema";

const SALUDO = {
  en: "Hello, I’m Meido, Omar’s AI assistant. I can tell you about his work and experience, or pass him a message. How can I help you?",
  es: "Hola, soy Meido, la asistente de IA de Omar. Puedo contarle sobre su trabajo y experiencia, o hacerle llegar un mensaje. ¿En qué le puedo ayudar?",
};

const FALLO = {
  en: `Sorry, I can’t reply right now. You can write to Omar directly at ${EMAIL}.`,
  es: `Disculpe, ahora no puedo responder. Puede escribirle a Omar directamente a ${EMAIL}.`,
};

async function captchaValido(token: string): Promise<boolean> {
  if (env.MEIDO_SIN_CAPTCHA === "1") return true;
  if (!env.TURNSTILE_SECRET) return false; // sin configurar: cerrado, nunca abierto
  const cuerpo = new FormData();
  cuerpo.append("secret", env.TURNSTILE_SECRET);
  cuerpo.append("response", token);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: cuerpo,
  });
  if (!r.ok) return false;
  const datos: unknown = await r.json();
  return typeof datos === "object" && datos !== null && (datos as { success?: unknown }).success === true;
}

/** Abre una conversación nueva y devuelve su clave (la guarda el navegador). */
export const empezar = action({
  args: { captcha: v.string(), de: v.string(), idioma: vIdioma },
  returns: v.string(),
  handler: async (ctx, args): Promise<string> => {
    if (!(await captchaValido(args.captcha))) throw new ConvexError("captcha");
    const clave = crypto.randomUUID() + crypto.randomUUID();
    await ctx.runMutation(internal.chat.crear, { clave, de: args.de, idioma: args.idioma });
    return clave;
  },
});

export const crear = internalMutation({
  args: { clave: v.string(), de: v.string(), idioma: vIdioma },
  returns: v.null(),
  handler: async (ctx, args) => {
    await limites.limit(ctx, "conversacionNueva", { throws: true });
    const threadId = await createThread(ctx, components.agent);
    await saveMessage(ctx, components.agent, {
      threadId,
      agentName: "Meido",
      message: { role: "assistant", content: SALUDO[args.idioma] },
    });
    // Solo letras, números y guiones, y corto: es una etiqueta, no texto libre
    const de = args.de.replace(/[^\w-]/g, "").slice(0, 32) || "portafolio";
    await ctx.db.insert("conversaciones", {
      clave: args.clave,
      threadId,
      de,
      idioma: args.idioma,
      mensajes: 0,
      pensando: false,
      ultimo: Date.now(),
    });
    return null;
  },
});

/** El visitante escribe; Meido contesta en segundo plano (llega por `conversacion`). */
export const enviar = mutation({
  args: { clave: v.string(), texto: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const c = await ctx.db
      .query("conversaciones")
      .withIndex("by_clave", (q) => q.eq("clave", args.clave))
      .unique();
    if (!c) throw new ConvexError("conversacion");
    const texto = args.texto.trim();
    if (!texto) throw new ConvexError("vacio");
    if (texto.length > MAX_TEXTO) throw new ConvexError("largo");
    if (c.pensando) throw new ConvexError("ocupada");
    if (c.mensajes >= MAX_MENSAJES) throw new ConvexError("tope");
    await limites.limit(ctx, "mensaje", { key: c._id, throws: true });
    await limites.limit(ctx, "mensajesDia", { throws: true });

    const { messageId } = await saveMessage(ctx, components.agent, {
      threadId: c.threadId,
      prompt: texto,
    });
    // Contesta en el idioma en que le escriben (no en el de la página)
    const hablando = idiomaDe(texto) ?? c.hablando ?? c.idioma;
    await ctx.db.patch("conversaciones", c._id, {
      mensajes: c.mensajes + 1,
      pensando: true,
      ultimo: Date.now(),
      hablando,
    });
    await ctx.scheduler.runAfter(0, internal.chat.responder, {
      conversacion: c._id,
      threadId: c.threadId,
      promptMessageId: messageId,
      idioma: hablando,
    });
    return null;
  },
});

export const responder = internalAction({
  args: {
    conversacion: v.id("conversaciones"),
    threadId: v.string(),
    promptMessageId: v.string(),
    idioma: vIdioma,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    try {
      await crearMeido().generateText(
        ctx,
        { threadId: args.threadId },
        { promptMessageId: args.promptMessageId, system: `${INSTRUCCIONES}\n\n${ordenDeIdioma(args.idioma)}` },
      );
    } catch (e) {
      console.error("Meido no pudo contestar:", e);
      await saveMessage(ctx, components.agent, {
        threadId: args.threadId,
        agentName: "Meido",
        message: { role: "assistant", content: FALLO[args.idioma] },
      });
    } finally {
      await ctx.runMutation(internal.chat.listo, { conversacion: args.conversacion });
    }
    return null;
  },
});

export const listo = internalMutation({
  args: { conversacion: v.id("conversaciones") },
  returns: v.null(),
  handler: async (ctx, args) => {
    if (await ctx.db.get("conversaciones", args.conversacion)) {
      await ctx.db.patch("conversaciones", args.conversacion, { pensando: false, ultimo: Date.now() });
    }
    return null;
  },
});

const vMensaje = v.object({
  key: v.string(),
  rol: v.union(v.literal("visitante"), v.literal("meido")),
  texto: v.string(),
});

/** La conversación en vivo: mensajes visibles, si está pensando y cuántos le quedan. */
export const conversacion = query({
  args: { clave: v.string() },
  returns: v.union(
    v.null(),
    v.object({ pensando: v.boolean(), restantes: v.number(), mensajes: v.array(vMensaje) }),
  ),
  handler: async (ctx, args) => {
    const c = await ctx.db
      .query("conversaciones")
      .withIndex("by_clave", (q) => q.eq("clave", args.clave))
      .unique();
    if (!c) return null;
    const pagina = await listUIMessages(ctx, components.agent, {
      threadId: c.threadId,
      paginationOpts: { cursor: null, numItems: 2 * MAX_MENSAJES + 10 },
    });
    const mensajes = [...pagina.page]
      .sort((a, b) => a.order - b.order || a.stepOrder - b.stepOrder)
      .filter((m) => (m.role === "user" || m.role === "assistant") && m.text.trim() !== "")
      .map((m) => ({
        key: m.key,
        rol: m.role === "user" ? ("visitante" as const) : ("meido" as const),
        texto: m.text,
      }));
    return { pensando: c.pensando, restantes: MAX_MENSAJES - c.mensajes, mensajes };
  },
});
