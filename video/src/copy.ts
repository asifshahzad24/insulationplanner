// On-screen text for each market's promo video. There is no voiceover, so the captions carry the story.
// French uses a no-break space ( ) before "?" and ":", as French typography requires.

export type Market = "us" | "uk" | "de" | "fr";

export interface Copy {
  /** Opening question: first line in white, second in the thermal gradient. */
  hook: [string, string];
  questions: [string, string, string];
  /** One caption per demo step (see scripts/scenarios.ts). */
  steps: [string, string, string];
  result: string;
  benefits: [string, string, string];
  cta: string;
  tagline: string;
  /** Label before the step number, e.g. "Step" in "Step 1 of 3". */
  stepOf: (n: number) => string;
  /** Voiceover lines (spelled for the speech engine, e.g. the domain as words). */
  voice: Record<VoiceLine, string>;
}

export const VOICE_LINES = ["intro", "step1", "step2", "step3", "result", "benefits", "outro"] as const;
export type VoiceLine = (typeof VOICE_LINES)[number];

export const COPY: Record<Market, Copy> = {
  us: {
    hook: ["Insulating", "your attic?"],
    questions: ["How thick?", "How many bags?", "What will it cost?"],
    steps: ["Enter your attic size", "Add your ZIP code", "Pick a material"],
    result: "Depth, bags and cost. Instantly.",
    benefits: ["Free", "No sign-up", "Code-based targets for your ZIP"],
    cta: "Try it free at",
    tagline: "The free insulation calculator",
    stepOf: (n) => `Step ${n} of 3`,
    voice: {
      intro: "Insulating your attic? How thick should it be, how many bags do you need, and what will it cost?",
      step1: "Enter the size of your attic,",
      step2: "add your ZIP code,",
      step3: "and pick a material.",
      result: "You instantly see the depth to add, how many bags to buy, and the cost.",
      benefits: "It's free, there's no sign-up, and the targets come from the building code for your area.",
      outro: "Try it free at Loft Insulation Calc dot com.",
    },
  },
  uk: {
    hook: ["Insulating", "your loft?"],
    questions: ["How thick?", "How many rolls?", "What will it cost?"],
    steps: ["Enter your loft size", "Add what's already there", "Choose your target"],
    result: "Depth, rolls and cost. Instantly.",
    benefits: ["Free", "No sign-up", "Based on Building Regulations"],
    cta: "Try it free at",
    tagline: "The free loft insulation calculator",
    stepOf: (n) => `Step ${n} of 3`,
    voice: {
      intro: "Insulating your loft? How thick should it be, how many rolls do you need, and what will it cost?",
      step1: "Enter the size of your loft,",
      step2: "add what's already up there,",
      step3: "and choose your target.",
      result: "You instantly see the depth to add, how many rolls to buy, and the cost.",
      benefits: "It's free, there's no sign-up, and it's based on the Building Regulations.",
      outro: "Try it free at Loft Insulation Calc dot com.",
    },
  },
  de: {
    hook: ["Dachboden", "dämmen?"],
    questions: ["Wie dick?", "Wie viele Rollen?", "Was kostet das?"],
    steps: ["Fläche eingeben", "Vorhandene Dämmung angeben", "Ziel wählen: Pflicht oder Förderung"],
    result: "Dicke, Rollen und Kosten. Sofort.",
    benefits: ["Kostenlos", "Ohne Anmeldung", "Nach GEG und BEG-Förderung"],
    cta: "Jetzt kostenlos rechnen:",
    tagline: "Der kostenlose Dämmrechner",
    stepOf: (n) => `Schritt ${n} von 3`,
    voice: {
      intro: "Sie wollen Ihren Dachboden dämmen? Wie dick muss die Dämmung sein, wie viele Rollen brauchen Sie, und was kostet das?",
      step1: "Geben Sie die Fläche ein,",
      step2: "dann die vorhandene Dämmung,",
      step3: "und wählen Sie Ihr Ziel: gesetzliche Pflicht oder Förderung.",
      result: "Sofort sehen Sie die Dicke, die Anzahl der Rollen und die Kosten.",
      benefits: "Kostenlos, ohne Anmeldung, und nach den Vorgaben von Gebäudeenergiegesetz und Förderung.",
      outro: "Jetzt kostenlos ausprobieren.",
    },
  },
  fr: {
    hook: ["Isoler", "vos combles ?"],
    questions: ["Quelle épaisseur ?", "Combien de sacs ?", "Quel budget ?"],
    steps: ["Indiquez la surface", "Choisissez votre département", "Choisissez l'isolant"],
    result: "Épaisseur, sacs et coût. Tout de suite.",
    benefits: ["Gratuit", "Sans inscription", "Objectifs CEE et réglementaires"],
    cta: "Essayez gratuitement :",
    tagline: "Le calculateur d'isolation gratuit",
    stepOf: (n) => `Étape ${n} sur 3`,
    voice: {
      intro: "Vous voulez isoler vos combles ? Quelle épaisseur, combien de sacs, et pour quel budget ?",
      step1: "Indiquez la surface,",
      step2: "choisissez votre département,",
      step3: "puis l'isolant.",
      result: "Vous voyez tout de suite l'épaisseur à ajouter, le nombre de sacs et le coût.",
      benefits: "C'est gratuit, sans inscription, et basé sur les exigences des aides à la rénovation.",
      outro: "Essayez-le gratuitement dès maintenant.",
    },
  },
};
