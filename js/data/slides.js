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
      pt: "RELEVO GENERACIONAL: LA VENTAJA QUE NADIE ESTÁ APROVECHANDO\n@centrodeeventosupb",
      es: "RELEVO GENERACIONAL: LA VENTAJA QUE NADIE ESTÁ APROVECHANDO\n@centrodeeventosupb",
      en: "RELEVO GENERACIONAL: LA VENTAJA QUE NADIE ESTÁ APROVECHANDO\n@centrodeeventosupb"
    },
    subtitle: { pt: "", es: "", en: "" },
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
      pt: "Los eventos no llegaron a la Universidad.\nLa Universidad decidió encontrarse con el mundo.",
      es: "Los eventos no llegaron a la Universidad.\nLa Universidad decidió encontrarse con el mundo.",
      en: "Los eventos no llegaron a la Universidad.\nLa Universidad decidió encontrarse con el mundo."
    },
    subtitle: { pt: "", es: "", en: "" },
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
      pt: "Los eventos nunca fueron el objetivo.\nEl impacto sí.",
      es: "Los eventos nunca fueron el objetivo.\nEl impacto sí.",
      en: "Los eventos nunca fueron el objetivo.\nEl impacto sí."
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: true, photoUrl: "assets/images/slide-5.jpg",
    sculptureType: "irradiar",
    layout: "layout-left"
  },
  {
    id: 6, act: 2,
    actTitle: { pt: "Ato 2 — Comunidade", es: "Acto 2 — Comunidad", en: "Act 2 — Community" },
    title: {
      pt: "Un evento trae personas.\nUna comunidad trae transformación.",
      es: "Un evento trae personas.\nUna comunidad trae transformación.",
      en: "Un evento trae personas.\nUna comunidad trae transformación."
    },
    subtitle: { pt: "", es: "", en: "" },
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
      pt: "La experiencia construye el camino.\nLas nuevas generaciones descubren nuevas rutas.",
      es: "La experiencia construye el camino.\nLas nuevas generaciones descubren nuevas rutas.",
      en: "La experiencia construye el camino.\nLas nuevas generaciones descubren nuevas rutas."
    },
    subtitle: { pt: "", es: "", en: "" },
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
      pt: "Una visión.\nDos generaciones.",
      es: "Una visión.\nDos generaciones.",
      en: "Una visión.\nDos generaciones."
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: false, photoUrl: null,
    sculptureType: "vision",
    layout: "layout-tension"
  },
  {
    id: 10, act: 3,
    actTitle: { pt: "Ato 3 — Revezamento", es: "Acto 3 — Relevo", en: "Act 3 — Relay" },
    title: {
      pt: "El crecimiento no ocurre cuando una generación reemplaza a otra.\nOcurre cuando trabajan juntas.",
      es: "El crecimiento no ocurre cuando una generación reemplaza a otra.\nOcurre cuando trabajan juntas.",
      en: "El crecimiento no ocurre cuando una generación reemplaza a otra.\nOcurre cuando trabajan juntas."
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: false, photoUrl: null,
    sculptureType: "especies",
    layout: "layout-tension"
  },
  {
    id: 11, act: 3,
    actTitle: { pt: "Ato 3 — Revezamento", es: "Acto 3 — Relevo", en: "Act 3 — Relay" },
    title: {
      pt: "Los jóvenes no son el futuro.\nSon el presente que muchas organizaciones aún no ven.",
      es: "Los jóvenes no son el futuro.\nSon el presente que muchas organizaciones aún no ven.",
      en: "Los jóvenes no son el futuro.\nSon el presente que muchas organizaciones aún no ven."
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: false, photoUrl: null,
    sculptureType: "especies",
    layout: "layout-top-center"
  },
  {
    id: 12, act: 3,
    actTitle: { pt: "Ato 3 — Revezamento", es: "Acto 3 — Relevo", en: "Act 3 — Relay" },
    title: {
      pt: "El futuro no se hereda.\nSe construye.",
      es: "El futuro no se hereda.\nSe construye.",
      en: "El futuro no se hereda.\nSe construye."
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: true, photoUrl: "assets/images/slide-12.jpeg",
    sculptureType: "entretejido",
    layout: "layout-left"
  },
  {
    id: 13, act: 4,
    actTitle: { pt: "Ato 4 — Abertura", es: "Acto 4 — Apertura", en: "Act 4 — Opening" },
    title: {
      pt: "QR con memorias (pp móvil)\nQR redes @centrodeeventosupb",
      es: "QR con memorias (pp móvil)\nQR redes @centrodeeventosupb",
      en: "QR con memorias (pp móvil)\nQR redes @centrodeeventosupb"
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
