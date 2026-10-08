// Recados para Omar: los deja Meido con su herramienta y se le avisan a la nube privada de
// M.E.I.D.O (isla del PC y teléfono). Esta nube solo los entrega; no lee nada de allá.
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { env, internalAction, internalMutation, internalQuery } from "./_generated/server";
import { MAX_RECADOS } from "./limites";

const MAX_INTENTOS = 6;

export const guardar = internalMutation({
  args: {
    threadId: v.string(),
    nombre: v.string(),
    contacto: v.string(),
    motivo: v.string(),
    urgente: v.boolean(),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    const c = await ctx.db
      .query("conversaciones")
      .withIndex("by_threadId", (q) => q.eq("threadId", args.threadId))
      .unique();
    if (!c) return "Error: conversation not found.";
    const previos = await ctx.db
      .query("recados")
      .withIndex("by_conversacion", (q) => q.eq("conversacion", c._id))
      .take(MAX_RECADOS);
    if (previos.length >= MAX_RECADOS) {
      return `Not saved: this conversation already left ${MAX_RECADOS} messages. Suggest writing to Omar's email instead.`;
    }
    const id = await ctx.db.insert("recados", {
      conversacion: c._id,
      nombre: args.nombre.slice(0, 120),
      contacto: args.contacto.slice(0, 200),
      motivo: args.motivo.slice(0, 1000),
      urgente: args.urgente,
      de: c.de,
      idioma: c.idioma,
      intentos: 0,
    });
    await ctx.scheduler.runAfter(0, internal.recados.avisar, { recado: id });
    return "Saved. Omar will be notified and will reply personally.";
  },
});

export const leer = internalQuery({
  args: { recado: v.id("recados") },
  handler: async (ctx, args) => await ctx.db.get("recados", args.recado),
});

export const marcar = internalMutation({
  args: { recado: v.id("recados"), entregado: v.boolean() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const r = await ctx.db.get("recados", args.recado);
    if (!r) return null;
    await ctx.db.patch("recados", r._id, {
      intentos: r.intentos + 1,
      ...(args.entregado ? { entregado: Date.now() } : {}),
    });
    return null;
  },
});

/** Entrega un recado a la nube privada (POST con su propia clave, que solo sirve para esto). */
export const avisar = internalAction({
  args: { recado: v.id("recados") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const r = await ctx.runQuery(internal.recados.leer, { recado: args.recado });
    if (!r || r.entregado !== undefined) return null;
    if (!env.MEIDO_RECADOS_URL || !env.MEIDO_RECADOS_TOKEN) {
      console.warn("Recado guardado sin aviso: faltan MEIDO_RECADOS_URL / MEIDO_RECADOS_TOKEN.");
      return null;
    }
    let ok = false;
    try {
      const resp = await fetch(env.MEIDO_RECADOS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.MEIDO_RECADOS_TOKEN}`,
        },
        body: JSON.stringify({
          id: r._id,
          nombre: r.nombre,
          contacto: r.contacto,
          motivo: r.motivo,
          urgente: r.urgente,
          de: r.de,
          idioma: r.idioma,
        }),
      });
      ok = resp.ok;
      if (!ok) console.error("La nube privada rechazó el recado:", resp.status, await resp.text());
    } catch (e) {
      console.error("No se pudo avisar del recado:", e);
    }
    await ctx.runMutation(internal.recados.marcar, { recado: r._id, entregado: ok });
    return null;
  },
});

/** Reintenta los que no llegaron (lo llama el cron cada hora). */
export const reintentar = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const pendientes = await ctx.db
      .query("recados")
      .withIndex("by_entregado", (q) => q.eq("entregado", undefined))
      .take(20);
    for (const r of pendientes) {
      if (r.intentos < MAX_INTENTOS) await ctx.scheduler.runAfter(0, internal.recados.avisar, { recado: r._id });
    }
    return null;
  },
});
