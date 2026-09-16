/**
 * Estructura de los 13 slides organizados en 4 actos narrativos.
 * Textos en Portugués (idioma principal), Español e Inglés.
 * Configuración de fotografías documentales y asignación de esculturas.
 */

const SLIDES_DATA = [
  // --- ACTO 1: ORIGEM (Slides 1 a 5) ---
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
      pt: "A vantagem competitiva que ninguém está aproveitando",
      es: "La ventaja competitiva que nadie está aprovechando",
      en: "The competitive advantage no one is taking advantage of"
    },
    narrative: {
      pt: "Centro de Eventos Fórum UPB × Future Leaders Forum 2026",
      es: "Centro de Eventos Fórum UPB × Future Leaders Forum 2026",
      en: "Fórum UPB Events Center × Future Leaders Forum 2026"
    },
    hasPhoto: false,
    photoUrl: null,
    sculptureType: "monolith_core", // Núcleo único y denso
    speciesRatio: 0.0 // 100% especie base
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
      pt: "90 anos de legado acadêmico e liderança regional",
      es: "90 años de legado académico y liderazgo regional",
      en: "90 years of academic legacy and regional leadership"
    },
    narrative: {
      pt: "Toda grande transformação nasce de uma base sólida. As instituições constroem história acumulando conhecimento.",
      es: "Toda gran transformación nace de una base sólida. Las instituciones construyen historia acumulando conocimiento.",
      en: "Every great transformation is born from a solid foundation. Institutions build history by accumulating knowledge."
    },
    hasPhoto: true,
    photoUrl: "assets/images/slide_02_origen.svg",
    photoCaption: {
      pt: "Fórum UPB — Tradição e espaço de convergência",
      es: "Fórum UPB — Tradición y espacio de convergencia",
      en: "Fórum UPB — Tradition and convergence space"
    },
    sculptureType: "concentrated_sphere",
    speciesRatio: 0.1
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
      pt: "Academia, Indústria e Cidade em ressonância",
      es: "Academia, Industria y Ciudad en resonancia",
      en: "Academia, Industry and City in resonance"
    },
    narrative: {
      pt: "O conhecimento isolado não transforma realidades. A fissão do núcleo abre caminho para três pilares essenciais.",
      es: "El conocimiento aislado no transforma realidades. La fisión del núcleo abre paso a tres pilares esenciales.",
      en: "Isolated knowledge does not transform realities. The core fission makes way for three essential pillars."
    },
    hasPhoto: false,
    photoUrl: null,
    sculptureType: "triad_nodes", // Fisión en 3 polos
    speciesRatio: 0.15
  },
  {
    id: 4,
    act: 1,
    actTitle: {
      pt: "Ato 1 — Origem",
      es: "Acto 1 — Origen",
      en: "Act 1 — Origin"
    },
    title: {
      pt: "FORÇAS EM TENSÃO",
      es: "FUERZAS EN TENSIÓN",
      en: "FORCES IN TENSION"
    },
    subtitle: {
      pt: "O dilema entre continuidade e ruptura",
      es: "El dilema entre continuidad y ruptura",
      en: "The dilemma between continuity and rupture"
    },
    narrative: {
      pt: "Onde as gerações se olham com desconfiança, perde-se energia; onde convergem, constrói-se aceleração.",
      es: "Donde las generaciones se miran con desconfianza, se pierde energía; donde convergen, se construye aceleración.",
      en: "Where generations eye each other with distrust, energy is lost; where they converge, acceleration is built."
    },
    hasPhoto: true,
    photoUrl: "assets/images/slide_04_tension.svg",
    photoCaption: {
      pt: "Diálogo intersetorial em Medellín",
      es: "Diálogo intersectorial en Medellín",
      en: "Cross-sector dialogue in Medellín"
    },
    sculptureType: "triad_tension",
    speciesRatio: 0.2
  },
  {
    id: 5,
    act: 1,
    actTitle: {
      pt: "Ato 1 — Origem",
      es: "Acto 1 — Origen",
      en: "Act 1 — Origin"
    },
    title: {
      pt: "O DIAGNÓSTICO",
      es: "EL DIAGNÓSTICO",
      en: "THE DIAGNOSIS"
    },
    subtitle: {
      pt: "Por que as transições corporativas costumam falhar?",
      es: "¿Por qué suelen fallar las transiciones corporativas?",
      en: "Why do corporate transitions often fail?"
    },
    narrative: {
      pt: "Tratar a sucessão como um evento único em vez de um processo de coexistência é o erro mais caro do mercado.",
      es: "Tratar la sucesión como un evento puntual en lugar de un proceso de convivencia es el error más costoso del mercado.",
      en: "Treating succession as a one-time event rather than a coexistence process is the most expensive mistake."
    },
    hasPhoto: true,
    photoUrl: "assets/images/slide_05_diagnostico.svg",
    photoCaption: {
      pt: "Evidência institucional e dados de retenção",
      es: "Evidencia institucional y datos de retención",
      en: "Institutional evidence and retention metrics"
    },
    sculptureType: "triad_expanded",
    speciesRatio: 0.25
  },

  // --- ACTO 2: COMUNIDADE E CONFIANÇA (Slides 6 a 9) ---
  {
    id: 6,
    act: 2,
    actTitle: {
      pt: "Ato 2 — Comunidade e Confiança",
      es: "Acto 2 — Comunidad y Confianza",
      en: "Act 2 — Community & Trust"
    },
    title: {
      pt: "CLUSTERS DE CONFIANÇA",
      es: "CLÚSTERES DE CONFIANZA",
      en: "CLUSTERS OF TRUST"
    },
    subtitle: {
      pt: "Densidade de relações que sustentam a inovação",
      es: "Densidad de relaciones que sostienen la innovación",
      en: "Density of relationships sustaining innovation"
    },
    narrative: {
      pt: "As conexões locais começam a se espessar. A confiança não é abstrata: é uma malha de compromissos mútuos.",
      es: "Las conexiones locales comienzan a engrosarse. La confianza no es abstracta: es una malla de compromisos mutuos.",
      en: "Local connections begin to thicken. Trust is not abstract: it is a mesh of mutual commitments."
    },
    hasPhoto: false,
    photoUrl: null,
    sculptureType: "organic_clusters",
    speciesRatio: 0.3
  },
  {
    id: 7,
    act: 2,
    actTitle: {
      pt: "Ato 2 — Comunidade e Confiança",
      es: "Acto 2 — Comunidad y Confianza",
      en: "Act 2 — Community & Trust"
    },
    title: {
      pt: "O VALOR DO CAPITAL SOCIAL",
      es: "EL VALOR DEL CAPITAL SOCIAL",
      en: "THE VALUE OF SOCIAL CAPITAL"
    },
    subtitle: {
      pt: "Muito além de competências técnicas individuais",
      es: "Mucho más allá de competencias técnicas individuales",
      en: "Far beyond individual technical competencies"
    },
    narrative: {
      pt: "Organizações que investem em pontes relacionais reduzem atritos de comunicação em mais de 60%.",
      es: "Las organizaciones que invierten en puentes relacionales reducen la fricción comunicativa en más del 60%.",
      en: "Organizations investing in relational bridges reduce communication friction by over 60%."
    },
    hasPhoto: false,
    photoUrl: null,
    sculptureType: "thickening_mesh",
    speciesRatio: 0.35
  },
  {
    id: 8,
    act: 2,
    actTitle: {
      pt: "Ato 2 — Comunidade e Confiança",
      es: "Acto 2 — Comunidad y Confianza",
      en: "Act 2 — Community & Trust"
    },
    title: {
      pt: "ENCONTROS QUE TRANSFORMAM",
      es: "ENCUENTROS QUE TRANSFORMAN",
      en: "TRANSFORMATIVE ENCOUNTERS"
    },
    subtitle: {
      pt: "O Fórum UPB como catalisador de liderança",
      es: "El Fórum UPB como catalizador de liderazgo",
      en: "Fórum UPB as a leadership catalyst"
    },
    narrative: {
      pt: "Quando o espaço físico propicia a conversa genuína, a distância hierárquica e etária se dissipa.",
      es: "Cuando el espacio físico propicia la conversación genuina, la distancia jerárquica y etaria se disipa.",
      en: "When physical spaces enable genuine conversation, generational and hierarchical distance dissipates."
    },
    hasPhoto: true,
    photoUrl: "assets/images/slide_08_encuentro.svg",
    photoCaption: {
      pt: "Líderes e estudantes compartilhando a mesma mesa de criação",
      es: "Líderes y estudiantes compartiendo la misma mesa de creación",
      en: "Leaders and students sharing the same creation table"
    },
    sculptureType: "thickening_mesh",
    speciesRatio: 0.4
  },
  {
    id: 9,
    act: 2,
    actTitle: {
      pt: "Ato 2 — Comunidade e Confiança",
      es: "Acto 2 — Comunidad y Confianza",
      en: "Act 2 — Community & Trust"
    },
    title: {
      pt: "A PONTE INVISÍVEL",
      es: "EL PUENTE INVISIBLE",
      en: "THE INVISIBLE BRIDGE"
    },
    subtitle: {
      pt: "Preparando o terreno para o entrelaçamento",
      es: "Preparando el terreno para el entretejido",
      en: "Preparing the ground for interweaving"
    },
    narrative: {
      pt: "Não se trata de passar o bastão e sair da pista; trata-se de correr em sincronia durante o trecho decisivo.",
      es: "No se trata de pasar el testigo y abandonar la pista; se trata de correr en sincronía durante el tramo decisivo.",
      en: "It is not about passing the baton and leaving the track; it is about running in sync during the decisive leg."
    },
    hasPhoto: false,
    photoUrl: null,
    sculptureType: "bridge_tension",
    speciesRatio: 0.45
  },

  // --- ACTO 3: RELEVO (Slides 10 a 12) ---
  {
    id: 10,
    act: 3,
    actTitle: {
      pt: "Ato 3 — Relevo",
      es: "Acto 3 — Relevo",
      en: "Act 3 — Relay"
    },
    title: {
      pt: "DUAS GERAÇÕES, UM FLUXO",
      es: "DOS GENERACIONES, UN FLUJO",
      en: "TWO GENERATIONS, ONE FLOW"
    },
    subtitle: {
      pt: "A grande migração: da divisão à complementaridade",
      es: "La gran migración: de la división a la complementariedad",
      en: "The great migration: from division to complementarity"
    },
    narrative: {
      pt: "Os mesmos nós revelam suas duas identidades: a sabedoria acumulada (magenta) e a velocidade visionária (azul).",
      es: "Los mismos nodos revelan sus dos identidades: la sabiduría acumulada (magenta) y la velocidad visionaria (azul).",
      en: "The same nodes reveal their twin identities: accumulated wisdom (magenta) and visionary velocity (blue)."
    },
    hasPhoto: false,
    photoUrl: null,
    sculptureType: "double_helix", // Doble hélice entrelazada
    speciesRatio: 0.5
  },
  {
    id: 11,
    act: 3,
    actTitle: {
      pt: "Ato 3 — Relevo",
      es: "Acto 3 — Relevo",
      en: "Act 3 — Relay"
    },
    title: {
      pt: "CO-CRIAÇÃO PERMANENTE",
      es: "CO-CREACIÓN PERMANENTE",
      en: "PERMANENT CO-CREATION"
    },
    subtitle: {
      pt: "Mentoria reversa e inteligência coletiva",
      es: "Mentoría inversa e inteligencia colectiva",
      en: "Reverse mentoring and collective intelligence"
    },
    narrative: {
      pt: "Quando o sênior aprende novas lentes tecnológicas e o júnior absorve a visão de contexto, a empresa se torna antifrágil.",
      es: "Cuando el sénior aprende nuevas lentes tecnológicas y el júnior absorbe la visión de contexto, la empresa se vuelve antifrágil.",
      en: "When seniors gain new tech lenses and juniors absorb context vision, the organization becomes antifragile."
    },
    hasPhoto: false,
    photoUrl: null,
    sculptureType: "intertwined_vortex",
    speciesRatio: 0.5
  },
  {
    id: 12,
    act: 3,
    actTitle: {
      pt: "Ato 3 — Relevo",
      es: "Acto 3 — Relevo",
      en: "Act 3 — Relay"
    },
    title: {
      pt: "A VANTAGEM REVELADA",
      es: "LA VENTAJA REVELADA",
      en: "THE REVEALED ADVANTAGE"
    },
    subtitle: {
      pt: "Resultados reais do ecossistema UPB",
      es: "Resultados reales del ecosistema UPB",
      en: "Real outcomes from the UPB ecosystem"
    },
    narrative: {
      pt: "Evidência tangível de projetos onde a fusão geracional gerou novos negócios, patentes e valor sustentável.",
      es: "Evidencia tangible de proyectos donde la fusión generacional generó nuevos negocios, patentes y valor sostenible.",
      en: "Tangible evidence of projects where generational fusion forged new ventures, patents and sustainable value."
    },
    hasPhoto: true,
    photoUrl: "assets/images/slide_12_resultados.svg",
    photoCaption: {
      pt: "Projetos de impacto liderados por equipes intergeracionais",
      es: "Proyectos de impacto liderados por equipos intergeneracionales",
      en: "Impact initiatives driven by intergenerational teams"
    },
    sculptureType: "intertwined_vortex",
    speciesRatio: 0.5
  },

  // --- ACTO 4: ABERTURA (Slide 13) ---
  {
    id: 13,
    act: 4,
    actTitle: {
      pt: "Ato 4 — Abertura",
      es: "Acto 4 — Apertura",
      en: "Act 4 — Opening"
    },
    title: {
      pt: "O PORTAL DO FUTURO",
      es: "EL PORTAL DEL FUTURO",
      en: "PORTAL TO THE FUTURE"
    },
    subtitle: {
      pt: "Conecte-se com o ecossistema Future Leaders Forum",
      es: "Conéctate con el ecosistema Future Leaders Forum",
      en: "Connect with the Future Leaders Forum ecosystem"
    },
    narrative: {
      pt: "A malha orgânica se cristaliza em um portal estruturado. Aponte sua câmera para acessar a rede e os materiais.",
      es: "La malla orgánica se cristaliza en un portal estructurado. Escanea el código para acceder a la red y materiales.",
      en: "The organic mesh crystallizes into an open portal. Scan the code to access the network and resources."
    },
    hasPhoto: true,
    photoUrl: "assets/images/slide_13_qr_portal.svg",
    photoCaption: {
      pt: "Escaneie para acessar a rede de talentos e materiais da conferência",
      es: "Escanea para acceder a la red de talentos y materiales de la conferencia",
      en: "Scan to access the talent network and conference resources"
    },
    sculptureType: "portal_grid", // Grilla ordenada que enmarca el QR
    speciesRatio: 0.5
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SLIDES_DATA;
}
