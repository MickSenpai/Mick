// En qué idioma escribe el visitante: Meido contesta en ESE idioma, aunque la página, el saludo
// o los mensajes anteriores estén en el otro. Si un mensaje no lo deja claro ("ok", "Mick?"),
// se queda el último idioma detectado.
export type Idioma = "en" | "es";

const ES = new Set(
  ("hola que de el la los las es en por para con una un uno unos del al lo le se su sus mi mis yo tu usted " +
    "como cuando donde quien quiero quisiera puede podria gracias trabajo trabaja busca buscando esta estoy " +
    "tiene tengo hay sobre pero tambien muy mas bien bueno buenas dias tardes noches si no vacante empresa " +
    "contactar mensaje dejar nombre correo hacer proyectos experiencia").split(" "),
);
const EN = new Set(
  ("hi hello hey the is are was what does do did he his him you your yours and to of for with about " +
    "want would like could can please thanks thank yes job role work works working looking available " +
    "contact message leave name email company projects experience tell more how who where when which " +
    "i i'm im my we our it this that there have has").split(" "),
);

export function idiomaDe(texto: string): Idioma | null {
  const t = texto.toLowerCase();
  let es = (t.match(/[áéíóúñ¿¡]/g) ?? []).length * 2;
  let en = 0;
  for (const p of t.normalize("NFD").replace(/[̀-ͯ]/g, "").match(/[a-z']+/g) ?? []) {
    if (ES.has(p)) es++;
    if (EN.has(p)) en++;
  }
  if (es === en) return null;
  return es > en ? "es" : "en";
}

export function ordenDeIdioma(idioma: Idioma): string {
  return idioma === "en"
    ? "LANGUAGE: The visitor's latest message is in English. Reply in English only, even if earlier messages were in Spanish."
    : "IDIOMA: El último mensaje del visitante está en español. Responde solo en español (de usted), aunque los mensajes anteriores estuvieran en inglés.";
}
