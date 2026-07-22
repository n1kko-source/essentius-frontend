export type PhraseKind = "stoic" | "bible" | "spiritual" | "connection";

export type WisdomPhrase = {
  id: string;
  text: string;
  source: string;
  kind: PhraseKind;
};

export const PHRASE_KIND_LABEL: Record<PhraseKind, string> = {
  stoic: "Estoica",
  bible: "Bíblica",
  spiritual: "Espiritual",
  connection: "Conexión",
};

export const WISDOM_PHRASES: WisdomPhrase[] = [
  {
    id: "s1",
    kind: "stoic",
    text: "No es lo que te sucede, sino cómo reaccionas a ello lo que importa.",
    source: "Epicteto",
  },
  {
    id: "s2",
    kind: "stoic",
    text: "La felicidad de tu vida depende de la calidad de tus pensamientos.",
    source: "Marco Aurelio",
  },
  {
    id: "s3",
    kind: "stoic",
    text: "Empezamos a vivir cuando tenemos la vida en nuestras propias manos.",
    source: "Séneca",
  },
  {
    id: "s4",
    kind: "stoic",
    text: "Lo que está en tu poder es tu juicio; el resto, déjalo ir.",
    source: "Epicteto",
  },
  {
    id: "b1",
    kind: "bible",
    text: "El Señor es mi pastor; nada me falta.",
    source: "Salmo 23:1",
  },
  {
    id: "b2",
    kind: "bible",
    text: "Todo lo puedo en Cristo que me fortalece.",
    source: "Filipenses 4:13",
  },
  {
    id: "b3",
    kind: "bible",
    text: "Pide, y se te dará; busca, y hallarás; llama, y se te abrirá.",
    source: "Mateo 7:7",
  },
  {
    id: "b4",
    kind: "bible",
    text: "La verdad os hará libres.",
    source: "Juan 8:32",
  },
  {
    id: "sp1",
    kind: "spiritual",
    text: "En el silencio del corazón se oye la voz del alma.",
    source: "Sabiduría contemplativa",
  },
  {
    id: "sp2",
    kind: "spiritual",
    text: "Donde hay atención plena, hay presencia; donde hay presencia, hay paz.",
    source: "Tradición contemplativa",
  },
  {
    id: "sp3",
    kind: "spiritual",
    text: "No eres una gota en el océano; eres el océano entero en una gota.",
    source: "Rumi",
  },
  {
    id: "sp4",
    kind: "spiritual",
    text: "La gratitud convierte lo que tenemos en suficiente.",
    source: "Sabiduría espiritual",
  },
  {
    id: "c1",
    kind: "connection",
    text: "Aprender juntos es recordar que nadie piensa solo.",
    source: "Essentius",
  },
  {
    id: "c2",
    kind: "connection",
    text: "Una idea compartida crece; una idea aislada se apaga.",
    source: "Essentius",
  },
  {
    id: "c3",
    kind: "connection",
    text: "Conectar pensamientos es un acto de empatía con uno mismo.",
    source: "Essentius",
  },
  {
    id: "c4",
    kind: "connection",
    text: "El conocimiento se profundiza cuando se encuentra con otra mirada.",
    source: "Essentius",
  },
];
