/**
 * Matriz de datos con los 3 primeros slides de prueba.
 * Estructurada para traducción (Portugués base, Español e Inglés).
 * Incluye la propiedad booleana hasPhoto (Slide 1: false, Slide 2: true, Slide 3: false).
 */

const SLIDES_DATA = [
  {
    id: 1,
    act: 1,
    actTitle: {
      pt: "Ato 1 — Origem",
      es: "Acto 1 — Origen",
      en: "Act 1 — Origin"
    },
    title: {
      pt: "RELEVO GENERACIONAL",
      es: "RELEVO GENERACIONAL",
      en: "GENERATIONAL RELAY"
    },
    subtitle: {
      pt: "A vantagem que ninguém está aproveitando",
      es: "La ventaja que nadie está aprovechando",
      en: "The advantage no one is leveraging"
    },
    narrative: {
      pt: "Centro de Eventos Fórum UPB × Future Leaders Forum Fortaleza 2026",
      es: "Centro de Eventos Fórum UPB × Future Leaders Forum Fortaleza 2026",
      en: "Fórum UPB Events Center × Future Leaders Forum Fortaleza 2026"
    },
    hasPhoto: false,
    photoUrl: null,
    sculptureType: "monolith_core"
  },
  {
    id: 2,
    act: 1,
    actTitle: {
      pt: "Ato 1 — Origem",
      es: "Acto 1 — Origen",
      en: "Act 1 — Origin"
    },
    title: {
      pt: "O PONTO DE PARTIDA",
      es: "EL PUNTO DE PARTIDA",
      en: "THE STARTING POINT"
    },
    subtitle: {
      pt: "90 anos de tradição e liderança acadêmica",
      es: "90 años de tradición y liderazgo académico",
      en: "90 years of tradition and academic leadership"
    },
    narrative: {
      pt: "Toda grande transformação nasce de uma base sólida. O Fórum UPB como catalisador.",
      es: "Toda gran transformación nace de una base sólida. El Fórum UPB como catalizador.",
      en: "Every great transformation is born from a solid foundation. Fórum UPB as catalyst."
    },
    hasPhoto: true,
    photoUrl: "assets/images/slide_02_origen.svg",
    photoCaption: {
      pt: "Fórum UPB — Evidência documental e legado institucional",
      es: "Fórum UPB — Evidencia documental y legado institucional",
      en: "Fórum UPB — Documentary evidence and institutional legacy"
    },
    sculptureType: "concentrated_sphere"
  },
  {
    id: 3,
    act: 1,
    actTitle: {
      pt: "Ato 1 — Origem",
      es: "Acto 1 — Origen",
      en: "Act 1 — Origin"
    },
    title: {
      pt: "A TRÍADE ESTRATÉGICA",
      es: "LA TRÍADA ESTRATÉGICA",
      en: "THE STRATEGIC TRIAD"
    },
    subtitle: {
      pt: "Academia, Indústria e Cidade en ressonância",
      es: "Academia, Industria y Ciudad en resonancia",
      en: "Academia, Industry and City in resonance"
    },
    narrative: {
      pt: "A fissão do núcleo unitário abre três frentes de co-criação intergeracional.",
      es: "La fisión del núcleo unitario abre tres frentes de co-creación intergeneracional.",
      en: "The unitary core fission opens three fronts of intergenerational co-creation."
    },
    hasPhoto: false,
    photoUrl: null,
    sculptureType: "triad_nodes"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SLIDES_DATA;
}
