/**
 * Definiciones de Esculturas Generativas — Relevo Generacional
 * Esculturas inspiradas en Jaume Plensa, cintas tipográficas 3D y siluetas humanas.
 * Cada escultura define:
 * - draw(pg, w, h): Renderiza la silueta sólida de la escultura en el canvas offscreen.
 * - drawContour(pg, w, h): Delinea aristas estructurales clave para realzar la tridimensionalidad.
 */

const SCULPTURES = {
  /**
   * SLIDE 1: Figura Sentada de Plensa (Monolito / Origen)
   * Silueta del pensador sentado abrazando rodillas, formada íntegramente por palabras.
   */
  monolith_core: {
    draw: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);

      pg.push();
      pg.noStroke();
      pg.fill(255);

      // Cabeza
      pg.ellipse(cx, cy - s * 0.22, s * 0.15, s * 0.18);
      // Cuello y hombros
      pg.quad(
        cx - s * 0.05, cy - s * 0.13,
        cx + s * 0.05, cy - s * 0.13,
        cx + s * 0.16, cy - s * 0.06,
        cx - s * 0.14, cy - s * 0.06
      );
      // Torso inclinado
      pg.beginShape();
      pg.vertex(cx - s * 0.14, cy - s * 0.06);
      pg.vertex(cx + s * 0.16, cy - s * 0.06);
      pg.vertex(cx + s * 0.18, cy + s * 0.12);
      pg.vertex(cx - s * 0.12, cy + s * 0.14);
      pg.endShape(CLOSE);

      // Rodillas recogidas hacia el pecho
      pg.ellipse(cx + s * 0.14, cy + s * 0.08, s * 0.18, s * 0.14);
      // Piernas plegadas y base sentada
      pg.ellipse(cx, cy + s * 0.18, s * 0.38, s * 0.14);
      // Brazos rodeando las rodillas
      pg.quad(
        cx - s * 0.08, cy - s * 0.02,
        cx + s * 0.12, cy + s * 0.02,
        cx + s * 0.14, cy + s * 0.09,
        cx - s * 0.06, cy + s * 0.05
      );
      pg.pop();
    },
    drawContour: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);
      pg.ellipse(cx, cy - s * 0.22, s * 0.15, s * 0.18);
      pg.ellipse(cx, cy + s * 0.18, s * 0.38, s * 0.14);
    }
  },

  /**
   * SLIDE 2: Gran Cúpula / Auditorio Volumétrico
   * El espacio de encuentro y grados, esfera concentrada con gradas concéntricas.
   */
  concentrated_sphere: {
    draw: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);

      pg.push();
      pg.noStroke();
      pg.fill(255);
      // Cúpula esférica superior
      pg.arc(cx, cy + s * 0.06, s * 0.48, s * 0.48, PI, TWO_PI);
      // Gradas y base elíptica del auditorio
      pg.ellipse(cx, cy + s * 0.06, s * 0.48, s * 0.18);
      pg.ellipse(cx, cy + s * 0.13, s * 0.42, s * 0.14);
      pg.ellipse(cx, cy + s * 0.19, s * 0.32, s * 0.10);
      pg.pop();
    },
    drawContour: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);
      pg.arc(cx, cy + s * 0.06, s * 0.48, s * 0.48, PI, TWO_PI);
      pg.ellipse(cx, cy + s * 0.19, s * 0.32, s * 0.10);
    }
  },

  /**
   * SLIDE 3: La Tríada Estratégica (Academia, Industria, Ciudad)
   * Tres figuras humanas que convergen en el centro uniendo sus manos.
   */
  triad_nodes: {
    draw: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);
      let r = s * 0.22;

      pg.push();
      pg.noStroke();
      pg.fill(255);

      // Centro de convergencia
      pg.circle(cx, cy, s * 0.12);

      // Tres figuras en 120 grados
      for (let i = 0; i < 3; i++) {
        let ang = -HALF_PI + (TWO_PI / 3) * i;
        let px = cx + cos(ang) * r;
        let py = cy + sin(ang) * r;

        // Cabeza
        pg.circle(px, py - s * 0.06, s * 0.09);
        // Torso
        pg.ellipse(px, py + s * 0.01, s * 0.11, s * 0.14);
        // Brazo conectando al centro
        pg.quad(
          px - s * 0.03, py,
          px + s * 0.03, py,
          cx + s * 0.03, cy,
          cx - s * 0.03, cy
        );
      }
      pg.pop();
    },
    drawContour: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);
      let r = s * 0.22;
      pg.circle(cx, cy, s * 0.12);
      for (let i = 0; i < 3; i++) {
        let ang = -HALF_PI + (TWO_PI / 3) * i;
        pg.circle(cx + cos(ang) * r, cy + sin(ang) * r - s * 0.06, s * 0.09);
      }
    }
  },

  /**
   * SLIDE 4: Fuerzas en Tensión
   * Dos figuras humanas inclinadas hacia atrás, sostenidas por un puente de tensión central.
   */
  triad_tension: {
    draw: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);

      pg.push();
      pg.noStroke();
      pg.fill(255);

      // Figura izquierda (Pionera)
      let lx = cx - s * 0.24;
      pg.circle(lx - s * 0.04, cy - s * 0.14, s * 0.10);
      pg.quad(
        lx - s * 0.08, cy - s * 0.08,
        lx + s * 0.02, cy - s * 0.08,
        lx + s * 0.04, cy + s * 0.18,
        lx - s * 0.06, cy + s * 0.18
      );

      // Figura derecha (Emergente)
      let rx = cx + s * 0.24;
      pg.circle(rx + s * 0.04, cy - s * 0.14, s * 0.10);
      pg.quad(
        rx - s * 0.02, cy - s * 0.08,
        rx + s * 0.08, cy - s * 0.08,
        rx + s * 0.06, cy + s * 0.18,
        rx - s * 0.04, cy + s * 0.18
      );

      // Cinta tensora central
      pg.quad(
        lx + s * 0.01, cy - s * 0.03,
        rx - s * 0.01, cy - s * 0.03,
        rx - s * 0.01, cy + s * 0.05,
        lx + s * 0.01, cy + s * 0.05
      );
      pg.pop();
    },
    drawContour: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);
      pg.line(cx - s * 0.24, cy, cx + s * 0.24, cy);
    }
  },

  /**
   * SLIDE 5: El Impacto / Diagnóstico (Tríada Expandida)
   * Nodos resonantes y anillos concéntricos que irradian energía.
   */
  triad_expanded: {
    draw: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);

      pg.push();
      pg.noStroke();
      pg.fill(255);
      pg.circle(cx, cy, s * 0.16);
      pg.arc(cx, cy, s * 0.36, s * 0.36, 0, TWO_PI);
      pg.ellipse(cx, cy, s * 0.52, s * 0.26);
      pg.pop();
    },
    drawContour: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);
      pg.circle(cx, cy, s * 0.16);
      pg.ellipse(cx, cy, s * 0.52, s * 0.26);
    }
  },

  /**
   * SLIDE 6 & 7: Clústeres de Comunidad y Confianza
   * Rueda de personas entrelazadas formando una red de confianza.
   */
  organic_clusters: {
    draw: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);
      let r = s * 0.20;

      pg.push();
      pg.noStroke();
      pg.fill(255);

      // Anillo central de comunidad
      pg.ellipse(cx, cy, s * 0.18, s * 0.18);

      // 5 figuras en círculo tomadas de las manos
      for (let i = 0; i < 5; i++) {
        let ang = (TWO_PI / 5) * i;
        let px = cx + cos(ang) * r;
        let py = cy + sin(ang) * (r * 0.85);

        pg.circle(px, py - s * 0.05, s * 0.08);
        pg.ellipse(px, py + s * 0.02, s * 0.10, s * 0.12);

        let nextAng = (TWO_PI / 5) * ((i + 1) % 5);
        let npx = cx + cos(nextAng) * r;
        let npy = cy + sin(nextAng) * (r * 0.85);

        pg.quad(
          px, py,
          px, py + s * 0.03,
          npx, npy + s * 0.03,
          npx, npy
        );
      }
      pg.pop();
    },
    drawContour: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);
      pg.circle(cx, cy, s * 0.18);
    }
  },

  /**
   * SLIDE 8: Encuentros que Transforman (La Mesa de Co-creación)
   * Siluetas sentadas alrededor de una mesa compartida.
   */
  thickening_mesh: {
    draw: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);

      pg.push();
      pg.noStroke();
      pg.fill(255);

      // Mesa elíptica en perspectiva
      pg.ellipse(cx, cy + s * 0.04, s * 0.44, s * 0.16);

      // 4 figuras sentadas alrededor
      let offsets = [
        { x: -s * 0.20, y: -s * 0.04 },
        { x: -s * 0.07, y: -s * 0.12 },
        { x: s * 0.07, y: -s * 0.12 },
        { x: s * 0.20, y: -s * 0.04 }
      ];

      for (let o of offsets) {
        pg.circle(cx + o.x, cy + o.y - s * 0.06, s * 0.08);
        pg.ellipse(cx + o.x, cy + o.y, s * 0.10, s * 0.12);
      }
      pg.pop();
    },
    drawContour: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);
      pg.ellipse(cx, cy + s * 0.04, s * 0.44, s * 0.16);
    }
  },

  /**
   * SLIDE 9: El Puente Invisible
   * Puente colgante en catenaria uniendo dos orillas generacionales.
   */
  bridge_tension: {
    draw: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);

      pg.push();
      pg.noStroke();
      pg.fill(255);

      let lx = cx - s * 0.28;
      let rx = cx + s * 0.28;
      let py = cy + s * 0.05;

      // Torre izquierda
      pg.rect(lx - s * 0.03, cy - s * 0.20, s * 0.06, s * 0.38);
      // Torre derecha
      pg.rect(rx - s * 0.03, cy - s * 0.20, s * 0.06, s * 0.38);
      // Tablero del puente
      pg.rect(cx - s * 0.38, py - s * 0.02, s * 0.76, s * 0.05);

      // Cable de suspensión en catenaria
      pg.beginShape();
      pg.vertex(lx, cy - s * 0.18);
      for (let t = 0; t <= 1.0; t += 0.05) {
        let x = lerp(lx, rx, t);
        let cat = sin(t * PI) * (s * 0.20);
        pg.vertex(x, cy - s * 0.18 + cat);
      }
      pg.vertex(rx, cy - s * 0.18);
      pg.vertex(rx, py);
      pg.vertex(lx, py);
      pg.endShape(CLOSE);
      pg.pop();
    },
    drawContour: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);
      pg.line(cx - s * 0.38, cy + s * 0.05, cx + s * 0.38, cy + s * 0.05);
    }
  },

  /**
   * SLIDE 10: Dos Generaciones, Un Flujo (Referencia 4 de la imagen de Valen)
   * Dos siluetas humanas de pie lado a lado (Mentor y Joven Líder) entrelazando sus manos.
   */
  double_helix: {
    draw: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);

      pg.push();
      pg.noStroke();
      pg.fill(255);

      // Figura A (Izquierda, generación senior / mentora)
      let ax = cx - s * 0.12;
      let ay = cy;
      pg.circle(ax, ay - s * 0.24, s * 0.11); // Cabeza
      pg.ellipse(ax, ay - s * 0.08, s * 0.14, s * 0.22); // Torso
      pg.quad(
        ax - s * 0.06, ay + s * 0.02,
        ax + s * 0.06, ay + s * 0.02,
        ax + s * 0.05, ay + s * 0.24,
        ax - s * 0.05, ay + s * 0.24
      ); // Piernas

      // Figura B (Derecha, generación joven emergente)
      let bx = cx + s * 0.12;
      let by = cy + s * 0.02;
      pg.circle(bx, by - s * 0.22, s * 0.10); // Cabeza
      pg.ellipse(bx, by - s * 0.08, s * 0.13, s * 0.20); // Torso
      pg.quad(
        bx - s * 0.05, by + s * 0.01,
        bx + s * 0.05, by + s * 0.01,
        bx + s * 0.04, by + s * 0.22,
        bx - s * 0.04, by + s * 0.22
      ); // Piernas

      // Conexión central (manos unidas / relevo de energía)
      pg.quad(
        ax + s * 0.03, ay - s * 0.06,
        bx - s * 0.03, by - s * 0.06,
        bx - s * 0.03, by + s * 0.02,
        ax + s * 0.03, ay + s * 0.02
      );
      pg.pop();
    },
    drawContour: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);
      pg.circle(cx - s * 0.12, cy - s * 0.24, s * 0.11);
      pg.circle(cx + s * 0.12, cy + s * 0.02 - s * 0.22, s * 0.10);
    }
  },

  /**
   * SLIDE 11 & 12: Vórtice Entrelazado / Lazo de Infinito
   * Doble hélice ascendente y símbolo de co-creación permanente.
   */
  intertwined_vortex: {
    draw: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);

      pg.push();
      pg.noStroke();
      pg.fill(255);

      // Dos lóbulos de infinito entrelazados
      pg.ellipse(cx - s * 0.15, cy, s * 0.28, s * 0.28);
      pg.ellipse(cx + s * 0.15, cy, s * 0.28, s * 0.28);
      // Banda central de unión
      pg.rect(cx - s * 0.18, cy - s * 0.06, s * 0.36, s * 0.12);
      pg.pop();
    },
    drawContour: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);
      pg.ellipse(cx - s * 0.15, cy, s * 0.28, s * 0.28);
      pg.ellipse(cx + s * 0.15, cy, s * 0.28, s * 0.28);
    }
  },

  /**
   * SLIDE 13: El Portal del Futuro (Apertura al QR)
   * Portal monumental con columnas y dintel que enmarcan la apertura al futuro.
   */
  portal_grid: {
    draw: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);

      pg.push();
      pg.noStroke();
      pg.fill(255);

      let pw = s * 0.46;
      let ph = s * 0.52;

      // Columna izquierda
      pg.rect(cx - pw / 2 - s * 0.06, cy - ph / 2, s * 0.08, ph);
      // Columna derecha
      pg.rect(cx + pw / 2 - s * 0.02, cy - ph / 2, s * 0.08, ph);
      // Dintel superior monumental
      pg.rect(cx - pw / 2 - s * 0.08, cy - ph / 2 - s * 0.08, pw + s * 0.16, s * 0.09);
      // Base / umbral
      pg.rect(cx - pw / 2 - s * 0.10, cy + ph / 2 - s * 0.02, pw + s * 0.20, s * 0.06);
      pg.pop();
    },
    drawContour: function(pg, w, h) {
      let cx = w / 2;
      let cy = h / 2;
      let s = min(w, h);
      let pw = s * 0.46;
      let ph = s * 0.52;
      pg.rect(cx - pw / 2 - s * 0.06, cy - ph / 2, pw + s * 0.12, ph);
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SCULPTURES;
}
