/// <reference types="vite/client" />
/// <reference types="node" />
import { mockModel } from "@convex-dev/agent";
import agentTest from "@convex-dev/agent/test";
import rateLimiterTest from "@convex-dev/rate-limiter/test";
import type { LanguageModelV4 } from "@ai-sdk/provider";
import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { api, internal } from "./_generated/api";
import { FICHA_EN, FICHA_ES } from "./ficha";
import { INSTRUCCIONES } from "./meido";
import schema from "./schema";

// El modelo de cada prueba (nunca se llama a OpenRouter)
const estado = vi.hoisted(() => ({ modelo: null as unknown }));
vi.mock("@openrouter/ai-sdk-provider", () => ({
  createOpenRouter: () => ({ chat: () => estado.modelo }),
}));

const modules = import.meta.glob("./**/*.ts");

function nuevo() {
  const t = convexTest(schema, modules);
  agentTest.register(t);
  rateLimiterTest.register(t);
  return t;
}
type T = ReturnType<typeof nuevo>;

function contesta(texto: string): LanguageModelV4 {
  return mockModel({ content: [{ type: "text", text: texto }] });
}

const RECADO = {
  nombre: "Ana López, Acme",
  contacto: "ana@acme.com",
  motivo: "Una vacante de desarrollador de IA",
  urgente: true,
};

function dejaRecado(): LanguageModelV4 {
  return mockModel({
    contentSteps: [
      [{ type: "tool-call", toolCallId: "r1", toolName: "dejar_recado", input: JSON.stringify(RECADO) }],
      [{ type: "text", text: "Listo, Omar le responderá personalmente." }],
    ],
  });
}

async function empezar(t: T, idioma: "en" | "es" = "es", de = "linkedin") {
  return await t.action(api.chat.empezar, { captcha: "x", de, idioma });
}

async function escribir(t: T, clave: string, texto: string) {
  await t.mutation(api.chat.enviar, { clave, texto });
  await t.finishAllScheduledFunctions(vi.runAllTimers);
}

beforeEach(() => {
  vi.useFakeTimers();
  process.env.MEIDO_SIN_CAPTCHA = "1";
  delete process.env.TURNSTILE_SECRET;
  delete process.env.MEIDO_RECADOS_URL;
  delete process.env.MEIDO_RECADOS_TOKEN;
  estado.modelo = contesta("Hola.");
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("abrir una conversación", () => {
  test("sin clave de Turnstile ni modo de desarrollo, no se abre (cerrado, nunca abierto)", async () => {
    delete process.env.MEIDO_SIN_CAPTCHA;
    await expect(empezar(nuevo())).rejects.toThrow(/captcha/);
  });

  test("con Turnstile: se abre solo si Cloudflare lo valida", async () => {
    delete process.env.MEIDO_SIN_CAPTCHA;
    process.env.TURNSTILE_SECRET = "secreto";
    const t = nuevo();
    let respuesta = { success: false };
    const fetchFalso = vi.fn(async (_url: string, _init?: RequestInit) => new Response(JSON.stringify(respuesta)));
    vi.stubGlobal("fetch", fetchFalso);
    await expect(empezar(t)).rejects.toThrow(/captcha/);
    respuesta = { success: true };
    expect(await empezar(t)).toMatch(/^[0-9a-f-]{72}$/);
    expect(fetchFalso.mock.calls[0][0]).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
  });

  test("saluda en el idioma del visitante y limpia el origen", async () => {
    const t = nuevo();
    const clave = await empezar(t, "en", "linked<in>!");
    const c = await t.query(api.chat.conversacion, { clave });
    expect(c).toMatchObject({ pensando: false, restantes: 30 });
    expect(c!.mensajes).toHaveLength(1);
    expect(c!.mensajes[0]).toMatchObject({ rol: "meido" });
    expect(c!.mensajes[0].texto).toMatch(/^Hello, I’m Meido/);
    const filas = await t.run(async (ctx) => await ctx.db.query("conversaciones").collect());
    expect(filas[0].de).toBe("linkedin");
  });

  test("una clave que no existe no lee nada", async () => {
    const t = nuevo();
    expect(await t.query(api.chat.conversacion, { clave: "inventada" })).toBeNull();
    await expect(t.mutation(api.chat.enviar, { clave: "inventada", texto: "hola" })).rejects.toThrow(/conversacion/);
  });
});

describe("conversar", () => {
  test("el visitante escribe y Meido contesta", async () => {
    const t = nuevo();
    const clave = await empezar(t);
    estado.modelo = contesta("Omar trabaja con Python, Rust y Flutter.");
    await t.mutation(api.chat.enviar, { clave, texto: "¿Con qué lenguajes trabaja?" });
    expect((await t.query(api.chat.conversacion, { clave }))!.pensando).toBe(true);
    await t.finishAllScheduledFunctions(vi.runAllTimers);

    const c = (await t.query(api.chat.conversacion, { clave }))!;
    expect(c.pensando).toBe(false);
    expect(c.restantes).toBe(29);
    expect(c.mensajes.map((m) => [m.rol, m.texto])).toEqual([
      ["meido", expect.stringMatching(/^Hola, soy Meido/)],
      ["visitante", "¿Con qué lenguajes trabaja?"],
      ["meido", "Omar trabaja con Python, Rust y Flutter."],
    ]);
  });

  test("si el modelo falla, se disculpa en su idioma y da el correo", async () => {
    const t = nuevo();
    const clave = await empezar(t, "es");
    estado.modelo = mockModel({ fail: { error: "OpenRouter caído" } });
    vi.spyOn(console, "error").mockImplementation(() => {});
    await escribir(t, clave, "hola");
    const c = (await t.query(api.chat.conversacion, { clave }))!;
    expect(c.pensando).toBe(false);
    expect(c.mensajes[c.mensajes.length - 1].texto).toBe("Disculpe, ahora no puedo responder. Puede escribirle a Omar directamente a mick967@hotmail.com.");
  });

  test("rechaza mensajes vacíos, demasiado largos o mientras contesta", async () => {
    const t = nuevo();
    const clave = await empezar(t);
    await expect(t.mutation(api.chat.enviar, { clave, texto: "   " })).rejects.toThrow(/vacio/);
    await expect(t.mutation(api.chat.enviar, { clave, texto: "a".repeat(801) })).rejects.toThrow(/largo/);
    await t.mutation(api.chat.enviar, { clave, texto: "uno" });
    await expect(t.mutation(api.chat.enviar, { clave, texto: "dos" })).rejects.toThrow(/ocupada/);
  });

  test("tope de mensajes por conversación", async () => {
    const t = nuevo();
    const clave = await empezar(t);
    await t.run(async (ctx) => {
      const c = (await ctx.db.query("conversaciones").first())!;
      await ctx.db.patch("conversaciones", c._id, { mensajes: 30 });
    });
    await expect(t.mutation(api.chat.enviar, { clave, texto: "hola" })).rejects.toThrow(/tope/);
  });

  test("no deja escribir en ráfaga (límite por conversación)", async () => {
    const t = nuevo();
    const clave = await empezar(t);
    for (let i = 0; i < 3; i++) await escribir(t, clave, `mensaje ${i}`);
    await expect(t.mutation(api.chat.enviar, { clave, texto: "otro más" })).rejects.toThrow();
  });
});

describe("recados", () => {
  test("Meido guarda el recado con su herramienta; sin destino configurado queda pendiente", async () => {
    const t = nuevo();
    const clave = await empezar(t, "es", "cv");
    estado.modelo = dejaRecado();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await escribir(t, clave, "Soy Ana de Acme, ana@acme.com, por una vacante. Sí, envíelo.");

    const recados = await t.run(async (ctx) => await ctx.db.query("recados").collect());
    expect(recados).toHaveLength(1);
    expect(recados[0]).toMatchObject({ ...RECADO, de: "cv", idioma: "es" });
    expect(recados[0].entregado).toBeUndefined();
    const c = (await t.query(api.chat.conversacion, { clave }))!;
    expect(c.mensajes[c.mensajes.length - 1].texto).toBe("Listo, Omar le responderá personalmente.");
  });

  test("lo entrega a la nube privada con su clave", async () => {
    process.env.MEIDO_RECADOS_URL = "https://privada.example/recados";
    process.env.MEIDO_RECADOS_TOKEN = "clave-recados";
    const fetchFalso = vi.fn(async (_url: string, _init?: RequestInit) => new Response("ok"));
    vi.stubGlobal("fetch", fetchFalso);
    const t = nuevo();
    const clave = await empezar(t, "es", "cv");
    estado.modelo = dejaRecado();
    await escribir(t, clave, "Envíelo, por favor.");

    const llamada = fetchFalso.mock.calls.find((c) => c[0] === "https://privada.example/recados")!;
    const init = llamada[1]!;
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer clave-recados");
    expect(JSON.parse(init.body as string)).toMatchObject({ ...RECADO, de: "cv", idioma: "es" });
    const [r] = await t.run(async (ctx) => await ctx.db.query("recados").collect());
    expect(r.entregado).toBeTypeOf("number");
    expect(r.intentos).toBe(1);
  });

  test("si la nube privada falla, se reintenta y deja de intentarlo tras 6 veces", async () => {
    process.env.MEIDO_RECADOS_URL = "https://privada.example/recados";
    process.env.MEIDO_RECADOS_TOKEN = "clave-recados";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("no", { status: 500 })));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const t = nuevo();
    const clave = await empezar(t);
    estado.modelo = dejaRecado();
    await escribir(t, clave, "Envíelo.");
    for (let i = 0; i < 8; i++) {
      await t.mutation(internal.recados.reintentar, {});
      await t.finishAllScheduledFunctions(vi.runAllTimers);
    }
    const [r] = await t.run(async (ctx) => await ctx.db.query("recados").collect());
    expect(r.entregado).toBeUndefined();
    expect(r.intentos).toBe(6);
  });

  test("como mucho 3 recados por conversación", async () => {
    const t = nuevo();
    await empezar(t);
    const threadId = await t.run(async (ctx) => (await ctx.db.query("conversaciones").first())!.threadId);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const resultados = [];
    for (let i = 0; i < 4; i++) resultados.push(await t.mutation(internal.recados.guardar, { threadId, ...RECADO }));
    expect(resultados.slice(0, 3)).toEqual(Array(3).fill("Saved. Omar will be notified and will reply personally."));
    expect(resultados[3]).toMatch(/^Not saved/);
  });
});

test("a los 15 días se borra la conversación con sus recados", async () => {
  const t = nuevo();
  const vieja = await empezar(t);
  const nueva = await empezar(t);
  await t.run(async (ctx) => {
    const c = (await ctx.db.query("conversaciones").withIndex("by_clave", (q) => q.eq("clave", vieja)).unique())!;
    await ctx.db.patch("conversaciones", c._id, { ultimo: Date.now() - 16 * 24 * 60 * 60 * 1000 });
    await ctx.db.insert("recados", { conversacion: c._id, ...RECADO, de: "cv", idioma: "es", intentos: 0 });
  });
  await t.mutation(internal.crons.borrarViejas, {});
  await t.finishAllScheduledFunctions(vi.runAllTimers);
  expect(await t.query(api.chat.conversacion, { clave: vieja })).toBeNull();
  expect(await t.query(api.chat.conversacion, { clave: nueva })).not.toBeNull();
  expect(await t.run(async (ctx) => await ctx.db.query("recados").collect())).toEqual([]);
});

test("las instrucciones llevan la ficha del portafolio y ningún teléfono", () => {
  expect(INSTRUCCIONES).toContain(FICHA_EN);
  expect(INSTRUCCIONES).toContain(FICHA_ES);
  expect(FICHA_EN).toContain("CosechIA");
  expect(FICHA_ES).toContain("Universidad Tecnológica de Tijuana");
  expect(INSTRUCCIONES).not.toMatch(/\+?\d[\d\s().-]{8,}\d/);
});
