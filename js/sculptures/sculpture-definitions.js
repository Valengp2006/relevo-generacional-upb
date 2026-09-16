/**
 * Definiciones de Esculturas Generativas — Relevo Generacional
 * Mapeo geométrico de las formas narrativas en 4 actos (13 slides).
 * Cada generador devuelve un array de puntos coordenados {x, y}.
 */

const SCULPTURES = {
  /**
   * ACTO 1: Núcleo denso / Monolito (Slide 1)
   * Representa el origen unitario, concentración de masa y conocimiento.
   */
  monolith_core: function(count, w, h) {
    let pts = [];
    let cx = w / 2;
    let cy = h / 2;
    let maxR = min(w, h) * 0.22;

    for (let i = 0; i < count; i++) {
      let angle = random(TWO_PI);
      // Distribución densa hacia el centro (raíz cuadrada inversa)
      let r = pow(random(1), 2.2) * maxR;
      pts.push({
        x: cx + cos(angle) * r,
        y: cy + sin(angle) * r
      });
    }
    return pts;
  },

  /**
   * ACTO 1: Esfera concentrada (Slide 2)
   */
  concentrated_sphere: function(count, w, h) {
    let pts = [];
    let cx = w / 2;
    let cy = h / 2;
    let baseR = min(w, h) * 0.26;

    for (let i = 0; i < count; i++) {
      let phi = acos(random(-1, 1));
      let theta = random(TWO_PI);
      let r = baseR * (0.8 + random(0.4));
      // Proyección estereográfica plana
      let x = cx + r * sin(phi) * cos(theta);
      let y = cy + r * sin(phi) * sin(theta) * 0.75;
      pts.push({ x, y });
    }
    return pts;
  },

  /**
   * ACTO 1: Tríada Estratégica — Academia, Industria, Ciudad (Slides 3 a 5)
   * Fisión del núcleo en 3 centros de gravedad interconectados.
   */
  triad_nodes: function(count, w, h) {
    let pts = [];
    let cx = w / 2;
    let cy = h / 2;
    let spread = min(w, h) * 0.28;

    // Tres vértices de la tríada
    let centers = [
      { x: cx, y: cy - spread },                     // Academia (norte)
      { x: cx - spread * 0.95, y: cy + spread * 0.65 }, // Industria (suroeste)
      { x: cx + spread * 0.95, y: cy + spread * 0.65 }  // Ciudad (sureste)
    ];

    for (let i = 0; i < count; i++) {
      let targetCenter = centers[i % 3];
      // 70% de partículas dentro de los 3 polos, 30% en los puentes de tensión
      if (random(1) < 0.75) {
        let r = pow(random(1), 1.6) * (spread * 0.38);
        let angle = random(TWO_PI);
        pts.push({
          x: targetCenter.x + cos(angle) * r,
          y: targetCenter.y + sin(angle) * r
        });
      } else {
        // Enlace entre centros
        let cA = centers[i % 3];
        let cB = centers[(i + 1) % 3];
        let t = random(1);
        pts.push({
          x: lerp(cA.x, cB.x, t) + random(-15, 15),
          y: lerp(cA.y, cB.y, t) + random(-15, 15)
        });
      }
    }
    return pts;
  },

  triad_tension: function(count, w, h) {
    return SCULPTURES.triad_nodes(count, w, h);
  },

  triad_expanded: function(count, w, h) {
    return SCULPTURES.triad_nodes(count, w, h);
  },

  /**
   * ACTO 2: Clústeres Orgánicos / Micelio (Slides 6 a 8)
   * Comunidades densas que fortalecen sus lazos y ramificaciones.
   */
  organic_clusters: function(count, w, h) {
    let pts = [];
    let cx = w / 2;
    let cy = h / 2;
    let clusterCount = 5;
    let clusterCenters = [];

    for (let k = 0; k < clusterCount; k++) {
      let ang = (TWO_PI / clusterCount) * k;
      let dist = min(w, h) * random(0.18, 0.32);
      clusterCenters.push({
        x: cx + cos(ang) * dist,
        y: cy + sin(ang) * dist * 0.85
      });
    }

    for (let i = 0; i < count; i++) {
      let c = clusterCenters[i % clusterCount];
      let r = pow(random(1), 1.5) * (min(w, h) * 0.16);
      let angle = random(TWO_PI);
      pts.push({
        x: c.x + cos(angle) * r,
        y: c.y + sin(angle) * r
      });
    }
    return pts;
  },

  thickening_mesh: function(count, w, h) {
    return SCULPTURES.organic_clusters(count, w, h);
  },

  /**
   * ACTO 2: Puente en Tensión (Slide 9)
   * Estructura catenaria que une dos horizontes generacionales.
   */
  bridge_tension: function(count, w, h) {
    let pts = [];
    let leftX = w * 0.22;
    let rightX = w * 0.78;
    let baseCy = h * 0.52;

    for (let i = 0; i < count; i++) {
      let t = random(1);
      let x = lerp(leftX, rightX, t);
      // Arco catenario (curva suave hacia abajo)
      let catenary = sin(t * PI) * (h * 0.22);
      let y = baseCy + catenary + random(-18, 18);
      
      // Pilares de anclaje
      if (random(1) < 0.25) {
        y = lerp(baseCy - (h * 0.15), baseCy + (h * 0.25), random(1));
        x = (random(1) < 0.5) ? leftX + random(-20, 20) : rightX + random(-20, 20);
      }

      pts.push({ x, y });
    }
    return pts;
  },

  /**
   * ACTO 3: Doble Hélice Entrelazada (Slide 10)
   * Las dos especies (Pionera y Emergente) se trenzan en un eje común.
   */
  double_helix: function(count, w, h) {
    let pts = [];
    let cx = w / 2;
    let cy = h / 2;
    let spanX = min(w, h) * 0.7;
    let ampY = min(w, h) * 0.2;
    let turns = 3.5;

    for (let i = 0; i < count; i++) {
      let t = map(i, 0, count, -1, 1);
      let x = cx + t * (spanX * 0.5);
      
      // Dos hebras entrelazadas desfasadas en PI
      let strand = (i % 2 === 0) ? 0 : PI;
      let waveAngle = t * turns * TWO_PI + strand;
      let y = cy + sin(waveAngle) * ampY + random(-6, 6);

      // Travesaños de unión entre hebras (peldaños del relevo)
      if (i % 8 === 0) {
        let tVal = random(-1, 1);
        let xMid = cx + tVal * (spanX * 0.5);
        let y1 = cy + sin(tVal * turns * TWO_PI) * ampY;
        let y2 = cy + sin(tVal * turns * TWO_PI + PI) * ampY;
        pts.push({
          x: xMid,
          y: lerp(y1, y2, random(1))
        });
      } else {
        pts.push({ x, y });
      }
    }
    return pts;
  },

  /**
   * ACTO 3: Vórtice Entrelazado / Toroide (Slides 11 y 12)
   */
  intertwined_vortex: function(count, w, h) {
    let pts = [];
    let cx = w / 2;
    let cy = h / 2;
    let R = min(w, h) * 0.28; // Radio mayor
    let r = min(w, h) * 0.12; // Radio menor

    for (let i = 0; i < count; i++) {
      let u = random(TWO_PI);
      let v = random(TWO_PI);
      // Fusión de dos toroides concéntricos
      let x = cx + (R + r * cos(v)) * cos(u);
      let y = cy + (R + r * cos(v)) * sin(u) * 0.65;
      pts.push({ x: x + random(-4, 4), y: y + random(-4, 4) });
    }
    return pts;
  },

  /**
   * ACTO 4: Portal Geométrico / Grilla Abierta (Slide 13)
   * Marco estructurado de convergencia que guía la mirada hacia el QR.
   */
  portal_grid: function(count, w, h) {
    let pts = [];
    let cx = w / 2;
    let cy = h / 2;
    let boxW = min(w, h) * 0.58;
    let boxH = min(w, h) * 0.58;

    let halfW = boxW / 2;
    let halfH = boxH / 2;

    for (let i = 0; i < count; i++) {
      let choice = random(1);
      let x, y;

      if (choice < 0.65) {
        // Marco perimetral del portal (4 bordes)
        let edge = floor(random(4));
        let t = random(1);
        if (edge === 0) { // Arriba
          x = lerp(cx - halfW, cx + halfW, t);
          y = cy - halfH;
        } else if (edge === 1) { // Derecha
          x = cx + halfW;
          y = lerp(cy - halfH, cy + halfH, t);
        } else if (edge === 2) { // Abajo
          x = lerp(cx - halfW, cx + halfW, t);
          y = cy + halfH;
        } else { // Izquierda
          x = cx - halfW;
          y = lerp(cy - halfH, cy + halfH, t);
        }
        x += random(-12, 12);
        y += random(-12, 12);
      } else {
        // Rayos de perspectiva que convergen hacia el centro (efecto túnel/horizonte)
        let angle = random(TWO_PI);
        let dist = random(halfW * 0.4, halfW * 1.35);
        x = cx + cos(angle) * dist;
        y = cy + sin(angle) * dist;
      }

      pts.push({ x, y });
    }
    return pts;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SCULPTURES;
}
