import { cronJobs } from "convex/server";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";
import { DIAS_GUARDADO } from "./limites";

const LOTE = 50;

/** Borra las conversaciones (con sus mensajes y recados) que llevan 15 días sin moverse. */
export const borrarViejas = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const limite = Date.now() - DIAS_GUARDADO * 24 * 60 * 60 * 1000;
    const viejas = await ctx.db
      .query("conversaciones")
      .withIndex("by_ultimo", (q) => q.lt("ultimo", limite))
      .take(LOTE);
    for (const c of viejas) {
      await ctx.runMutation(components.agent.threads.deleteAllForThreadIdAsync, { threadId: c.threadId });
      const recados = await ctx.db
        .query("recados")
        .withIndex("by_conversacion", (q) => q.eq("conversacion", c._id))
        .take(10);
      for (const r of recados) await ctx.db.delete("recados", r._id);
      await ctx.db.delete("conversaciones", c._id);
    }
    if (viejas.length === LOTE) await ctx.scheduler.runAfter(0, internal.crons.borrarViejas, {});
    return null;
  },
});

const crons = cronJobs();
crons.interval("borrar conversaciones viejas", { hours: 6 }, internal.crons.borrarViejas, {});
crons.interval("reintentar recados", { hours: 1 }, internal.recados.reintentar, {});
export default crons;
