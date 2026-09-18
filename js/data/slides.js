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
      pt: "<b>RELEVO GENERACIONAL:</b> LA VENTAJA QUE NADIE ESTÁ APROVECHANDO",
      es: "<b>RELEVO GENERACIONAL:</b> LA VENTAJA QUE NADIE ESTÁ APROVECHANDO",
      en: "<b>RELEVO GENERACIONAL:</b> LA VENTAJA QUE NADIE ESTÁ APROVECHANDO"
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: false, photoUrl: null,
    sculptureType: "potencial",
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
      pt: "Los eventos no llegaron a la Universidad.\n<b>La Universidad decidió encontrarse con el mundo.</b>",
      es: "Los eventos no llegaron a la Universidad.\n<b>La Universidad decidió encontrarse con el mundo.</b>",
      en: "Los eventos no llegaron a la Universidad.\n<b>La Universidad decidió encontrarse con el mundo.</b>"
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: false, photoUrl: null,
    sculptureType: "ramificacion",
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
      pt: "Los eventos nunca fueron el objetivo.\n<b>El impacto sí.</b>",
      es: "Los eventos nunca fueron el objetivo.\n<b>El impacto sí.</b>",
      en: "Los eventos nunca fueron el objetivo.\n<b>El impacto sí.</b>"
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: true, photoUrl: "assets/images/slide-5.jpg",
    sculptureType: "impacto",
    layout: "layout-left"
  },
  {
    id: 6, act: 2,
    actTitle: { pt: "Ato 2 — Comunidade", es: "Acto 2 — Comunidad", en: "Act 2 — Community" },
    title: {
      pt: "Un evento trae personas.\nUna <b>comunidad</b> trae <b>transformación.</b>",
      es: "Un evento trae personas.\nUna <b>comunidad</b> trae <b>transformación.</b>",
      en: "Un evento trae personas.\nUna <b>comunidad</b> trae <b>transformación.</b>"
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
      pt: "El talento crece a la velocidad de la <b>confianza</b>.",
      es: "El talento crece a la velocidad de la <b>confianza</b>.",
      en: "El talento crece a la velocidad de la <b>confianza</b>."
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: false, photoUrl: null,
    sculptureType: "atraccion",
    edgeProgress: 0.85,
    layout: "layout-top-center"
  },
  {
    id: 8, act: 2,
    actTitle: { pt: "Ato 2 — Comunidade", es: "Acto 2 — Comunidad", en: "Act 2 — Community" },
    title: {
      pt: "La <b>experiencia</b> construye el <b>camino</b>.\nLas nuevas generaciones descubren <b>nuevas rutas</b>.",
      es: "La <b>experiencia</b> construye el <b>camino</b>.\nLas nuevas generaciones descubren <b>nuevas rutas</b>.",
      en: "La <b>experiencia</b> construye el <b>camino</b>.\nLas nuevas generaciones descubren <b>nuevas rutas</b>."
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: true, photoUrl: "assets/images/slide-8.jpg",
    sculptureType: "exploracion",
    edgeProgress: 1.0,
    layout: "layout-left"
  },
  {
    id: 9, act: 2,
    actTitle: { pt: "Ato 2 — Comunidade", es: "Acto 2 — Comunidad", en: "Act 2 — Community" },
    title: {
      pt: "Una visión.\n<b>Dos generaciones.</b>",
      es: "Una visión.\n<b>Dos generaciones.</b>",
      en: "Una visión.\n<b>Dos generaciones.</b>"
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: false, photoUrl: null,
    sculptureType: "visiones",
    layout: "layout-tension"
  },
  {
    id: 10, act: 3,
    actTitle: { pt: "Ato 3 — Revezamento", es: "Acto 3 — Relevo", en: "Act 3 — Relay" },
    title: {
      pt: "El <b>crecimiento</b> no ocurre cuando una generación reemplaza a otra.\nOcurre cuando <b>trabajan juntas.</b>",
      es: "El <b>crecimiento</b> no ocurre cuando una generación reemplaza a otra.\nOcurre cuando <b>trabajan juntas.</b>",
      en: "El <b>crecimiento</b> no ocurre cuando una generación reemplaza a otra.\nOcurre cuando <b>trabajan juntas.</b>"
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: false, photoUrl: null,
    sculptureType: "interpenetracion",
    layout: "layout-tension"
  },
  {
    id: 11, act: 3,
    actTitle: { pt: "Ato 3 — Revezamento", es: "Acto 3 — Relevo", en: "Act 3 — Relay" },
    title: {
      pt: "Los jóvenes no son el futuro.\nSon el <b>presente</b> que muchas organizaciones aún no ven.",
      es: "Los jóvenes no son el futuro.\nSon el <b>presente</b> que muchas organizaciones aún no ven.",
      en: "Los jóvenes no son el futuro.\nSon el <b>presente</b> que muchas organizaciones aún no ven."
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: false, photoUrl: null,
    sculptureType: "periferia",
    layout: "layout-top-center"
  },
  {
    id: 12, act: 3,
    actTitle: { pt: "Ato 3 — Revezamento", es: "Acto 3 — Relevo", en: "Act 3 — Relay" },
    title: {
      pt: "El <b>futuro</b> no se hereda.\n<b>Se construye.</b>",
      es: "El <b>futuro</b> no se hereda.\n<b>Se construye.</b>",
      en: "El <b>futuro</b> no se hereda.\n<b>Se construye.</b>"
    },
    subtitle: { pt: "", es: "", en: "" },
    narrative: { pt: "", es: "", en: "" },
    hasPhoto: true, photoUrl: "assets/images/slide-12.jpeg",
    sculptureType: "construccion",
    layout: "layout-left"
  },
  {
    id: 13, act: 4,
    actTitle: { pt: "Ato 4 — Abertura", es: "Acto 4 — Apertura", en: "Act 4 — Opening" },
    title: {
      pt: "QR con memorias (pp móvil)\nQR redes",
      es: "QR con memorias (pp móvil)\nQR redes",
      en: "QR con memorias (pp móvil)\nQR redes"
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
