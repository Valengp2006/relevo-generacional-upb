/**
 * Relevo Generacional — Fórum UPB × Future Leaders Forum 2026
 * Configuración global, tokens de diseño y parámetros del motor de partículas.
 */

const CONFIG = {
  // Configuración de visualización y canvas
  canvas: {
    targetFPS: 60,
    pixelDensity: 1, // Alto rendimiento asegurado
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    titleWeight: '800'
  },

  // Paleta oficial (Future Leaders Forum 2026: swirl rosa, rojo y azul)
  colors: {
    bg: '#080B10',
    bgCard: 'rgba(15, 22, 36, 0.85)',
    textLight: '#F8FAFC',
    textMuted: '#94A3B8',
    textDark: '#0F172A',
    
    // Tonos del swirl de marca
    magenta: '#E0218A',
    magentaGlow: 'rgba(224, 33, 138, 0.35)',
    red: '#E63946',
    redGlow: 'rgba(230, 57, 70, 0.35)',
    blue: '#2A9D8F',
    blueElectric: '#00B4D8',
    blueDeep: '#1D3557',
    
    // Identidad secundaria institucional UPB
    upbRed: '#BA0C2F',
    upbGold: '#FFB81C',
    
    // Especies generacionales (Acto 3 en adelante)
    speciesA: '#E0218A', // Generación Pionera / Experiencia (Magenta)
    speciesB: '#00B4D8', // Generación Emergente / Futuro (Azul eléctrico)
    bridge: '#FFB81C'    // Puntos de articulación e intercambio (Dorado)
  },

  // Parámetros físicos del sistema de partículas
  particles: {
    count: 1800,           // Pool fijo continuo
    baseRadius: 2.2,
    maxSpeed: 14,          // Rapidez de respuesta en transiciones
    maxForce: 0.65,        // Suavidad de frenado
    arriveRadius: 70,      // Radio donde comienza el frenado de arrival
    friction: 0.92,
    springStrength: 0.08,
    
    // Movimiento idle orgánico (ruido Perlin constante)
    idleNoiseScale: 0.006,
    idleForce: 0.35,

    // Conexiones de red (aristas entre nodos)
    connectionDistance: 42,
    maxNeighbors: 3,
    edgeOpacityBase: 0.18
  },

  // Modos de visualización
  modes: {
    TEXT: 'text',
    SCULPTURE: 'sculpture'
  },

  // Idiomas soportados
  languages: ['pt', 'es', 'en'],
  defaultLanguage: 'pt'
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
