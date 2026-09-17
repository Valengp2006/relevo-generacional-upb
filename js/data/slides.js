/**
 * Guion completo (13/13 slides) — Relevo Generacional (Fórum UPB × Future Leaders Forum 2026)
 * Texto literal entregado por Alma López (Fórum UPB).
 * Fotografías documentales reales vinculadas a assets/images/.
 */

const SLIDES_DATA = [
  {
    id: 1, act: 1,
    actTitle: { pt: "Ato 1 — Origem", es: "Acto 1 — Origen", en: "Act 1 — Origin" },
    title: {
      pt: "RELEVO GENERACIONAL: LA VENTAJA QUE NADIE ESTÁ APROVECHANDO",
      es: "RELEVO GENERACIONAL: LA VENTAJA QUE NADIE ESTÁ APROVECHANDO",
      en: "RELEVO GENERACIONAL: LA VENTAJA QUE NADIE ESTÁ APROVECHANDO"
    },
    subtitle: { pt: "@centrodeeventosupb", es: "@centrodeeventosupb", en: "@centrodeeventosupb" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: false, photoUrl: null,
    sculptureType: "nucleo",
    layout: "layout-center"
  },
  {
    id: 2, act: 1,
    actTitle: { pt: "Ato 1 — Origem", es: "Acto 1 — Origen", en: "Act 1 — Origin" },
    title: {
      pt: "¿un gran auditorio solo para hacer grados?",
      es: "¿un gran auditorio solo para hacer grados?",
      en: "¿un gran auditorio solo para hacer grados?"
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: true, photoUrl: "assets/images/slide-2.jpg",
    sculptureType: "auditorio",
    layout: "layout-top-center"
  },
  {
    id: 3, act: 1,
    actTitle: { pt: "Ato 1 — Origem", es: "Acto 1 — Origen", en: "Act 1 — Origin" },
    title: {
      pt: "Los eventos no llegaron a la Universidad.",
      es: "Los eventos no llegaron a la Universidad.",
      en: "Los eventos no llegaron a la Universidad."
    },
    subtitle: {
      pt: "La Universidad decidió encontrarse con el mundo.",
      es: "La Universidad decidió encontrarse con el mundo.",
      en: "La Universidad decidió encontrarse con el mundo."
    },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: false, photoUrl: null,
    sculptureType: "triada",
    layout: "layout-tension"
  },
  {
    id: 4, act: 1,
    actTitle: { pt: "Ato 1 — Origem", es: "Acto 1 — Origen", en: "Act 1 — Origin" },
    title: {
      pt: "Academia + Industria + Ciudad",
      es: "Academia + Industria + Ciudad",
      en: "Academia + Industria + Ciudad"
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: true, photoUrl: "assets/images/slide-4.jpg",
    sculptureType: "triada",
    layout: "layout-left"
  },
  {
    id: 5, act: 1,
    actTitle: { pt: "Ato 1 — Origem", es: "Acto 1 — Origen", en: "Act 1 — Origin" },
    title: {
      pt: "Los eventos nunca fueron el objetivo.",
      es: "Los eventos nunca fueron el objetivo.",
      en: "Los eventos nunca fueron el objetivo."
    },
    subtitle: {
      pt: "El impacto sí.",
      es: "El impacto sí.",
      en: "El impacto sí."
    },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: true, photoUrl: "assets/images/slide-5.jpg",
    sculptureType: "irradiar",
    layout: "layout-left"
  },
  {
    id: 6, act: 2,
    actTitle: { pt: "Ato 2 — Comunidade", es: "Acto 2 — Comunidad", en: "Act 2 — Community" },
    title: {
      pt: "Un evento trae personas.",
      es: "Un evento trae personas.",
      en: "Un evento trae personas."
    },
    subtitle: {
      pt: "Una comunidad trae transformación.",
      es: "Una comunidad trae transformación.",
      en: "Una comunidad trae transformación."
    },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: false, photoUrl: null,
    sculptureType: "comunidad",
    edgeProgress: 0.35,
    layout: "layout-top-center"
  },
  {
    id: 7, act: 2,
    actTitle: { pt: "Ato 2 — Comunidade", es: "Acto 2 — Comunidad", en: "Act 2 — Community" },
    title: {
      pt: "El talento crece a la velocidad de la confianza.",
      es: "El talento crece a la velocidad de la confianza.",
      en: "El talento crece a la velocidad de la confianza."
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: false, photoUrl: null,
    sculptureType: "comunidad",
    edgeProgress: 0.85,
    layout: "layout-top-center"
  },
  {
    id: 8, act: 2,
    actTitle: { pt: "Ato 2 — Comunidade", es: "Acto 2 — Comunidad", en: "Act 2 — Community" },
    title: {
      pt: "La experiencia construye el camino.",
      es: "La experiencia construye el camino.",
      en: "La experiencia construye el camino."
    },
    subtitle: {
      pt: "Las nuevas generaciones descubren nuevas rutas.",
      es: "Las nuevas generaciones descubren nuevas rutas.",
      en: "Las nuevas generaciones descubren nuevas rutas."
    },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: true, photoUrl: "assets/images/slide-8.jpg",
    sculptureType: "comunidad_tejida",
    edgeProgress: 1.0,
    layout: "layout-left"
  },
  {
    id: 9, act: 2,
    actTitle: { pt: "Ato 2 — Comunidade", es: "Acto 2 — Comunidad", en: "Act 2 — Community" },
    title: {
      pt: "Una visión.",
      es: "Una visión.",
      en: "Una visión."
    },
    subtitle: {
      pt: "Dos generaciones.",
      es: "Dos generaciones.",
      en: "Dos generaciones."
    },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: false, photoUrl: null,
    sculptureType: "vision",
    layout: "layout-tension"
  },
  {
    id: 10, act: 3,
    actTitle: { pt: "Ato 3 — Revezamento", es: "Acto 3 — Relevo", en: "Act 3 — Relay" },
    title: {
      pt: "El crecimiento no ocurre cuando una generación reemplaza a otra.",
      es: "El crecimiento no ocurre cuando una generación reemplaza a otra.",
      en: "El crecimiento no ocurre cuando una generación reemplaza a otra."
    },
    subtitle: {
      pt: "Ocurre cuando trabajan juntas.",
      es: "Ocurre cuando trabajan juntas.",
      en: "Ocurre cuando trabajan juntas."
    },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: false, photoUrl: null,
    sculptureType: "especies",
    layout: "layout-tension"
  },
  {
    id: 11, act: 3,
    actTitle: { pt: "Ato 3 — Revezamento", es: "Acto 3 — Relevo", en: "Act 3 — Relay" },
    title: {
      pt: "Los jóvenes no son el futuro.",
      es: "Los jóvenes no son el futuro.",
      en: "Los jóvenes no son el futuro."
    },
    subtitle: {
      pt: "Son el presente que muchas organizaciones aún no ven.",
      es: "Son el presente que muchas organizaciones aún no ven.",
      en: "Son el presente que muchas organizaciones aún no ven."
    },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: false, photoUrl: null,
    sculptureType: "especies",
    layout: "layout-top-center"
  },
  {
    id: 12, act: 3,
    actTitle: { pt: "Ato 3 — Revezamento", es: "Acto 3 — Relevo", en: "Act 3 — Relay" },
    title: {
      pt: "El futuro no se hereda.",
      es: "El futuro no se hereda.",
      en: "El futuro no se hereda."
    },
    subtitle: {
      pt: "Se construye.",
      es: "Se construye.",
      en: "Se construye."
    },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: true, photoUrl: "assets/images/slide-12.jpeg",
    sculptureType: "entretejido",
    layout: "layout-left"
  },
  {
    id: 13, act: 4,
    actTitle: { pt: "Ato 4 — Abertura", es: "Acto 4 — Apertura", en: "Act 4 — Opening" },
    title: {
      pt: "@centrodeeventosupb",
      es: "@centrodeeventosupb",
      en: "@centrodeeventosupb"
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: true, photoUrl: "assets/images/slide-13.jpg",
    sculptureType: "portal",
    layout: "layout-center"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SLIDES_DATA;
}
