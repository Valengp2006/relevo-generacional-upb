/**
 * Clase ParticleSystem — Gestor del pool continuo de 1,800 partículas.
 * Ecosistema visual narrativo continuo (Iteración 2):
 * - Pool único continuo sin reinicios ni parpadeos entre slides.
 * - Asignación continua de objetivos geométricos con balance compositivo adaptativo ante fotografía.
 * - Interpolación cromática continua de 2 segundos (transición armónica hacia 2 especies en Slide 10).
 * - Red de conexiones estructurales optimizada con supresión de líneas dentro de la Zona de Calma.
 */

class ParticleSystem {
  constructor(count) {
    this.count = count || CONFIG.particles.count;
    this.particles = [];
    this.currentAct = 1;
    this.isRetracted = false;
    this.textBounds = null;
    this.currentSculptureType = 'nucleo';

    // Inicializar pool continuo
    for (let i = 0; i < this.count; i++) {
      let initX = width / 2 + random(-width * 0.25, width * 0.25);
      let initY = height / 2 + random(-height * 0.25, height * 0.25);
      this.particles.push(new Particle(initX, initY, i));
    }
  }

  /**
   * Actualiza los límites del titular activo para la Zona de Calma
   */
  setTextBounds(bounds) {
    this.textBounds = bounds;
  }

  /**
   * Asigna la nueva geometría escultórica preservando la física y el movimiento continuos
   */
  assignSculpture(targetPoints, actNumber, hasPhoto, sculptureType) {
    this.currentAct = actNumber || 1;
    this.isRetracted = hasPhoto || false;
    this.currentSculptureType = sculptureType || 'nucleo';

    let totalTargets = targetPoints.length;
    if (totalTargets === 0) return;

    // Adaptación espacial fluida ante la presencia de fotografía documental institucional
    let offsetX = 0;
    let offsetY = 0;
    let scaleFactor = 1.0;
    let targetAlpha = 240;

    if (this.isRetracted) {
      targetAlpha = 215;
      scaleFactor = 0.78;
      // Cede espacio hacia la izquierda para que la foto destaque en la derecha
      offsetX = -width * 0.16;
    }

    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      let target = targetPoints[i % totalTargets];

      let finalX = (target.x - width / 2) * scaleFactor + width / 2 + offsetX;
      let finalY = (target.y - height / 2) * scaleFactor + height / 2 + offsetY;

      p.setTarget(finalX, finalY);
      p.setTargetAlpha(targetAlpha);
      p.setTargetScale(scaleFactor);
      p.setSpecies(target.species || 'A', target.clusterId || 0);

      // Asignación de paleta cromática según narrativa de 4 Actos
      let sp = target.species;
      let cid = target.clusterId;

      if (this.currentAct <= 2) {
        if (sculptureType === 'nucleo') {
          // Núcleo unificado de gran densidad: Magenta institucional cálido y vibrante
          let rVar = (i % 7 === 0) ? 238 : 224;
          let gVar = (i % 7 === 0) ? 45 : 33;
          let bVar = (i % 7 === 0) ? 148 : 138;
          p.setTargetRGB(rVar, gVar, bVar);
        } else if (sculptureType === 'auditorio') {
          // Graderío ordenado: filamentos de magenta con destellos azul eléctrico
          if (i % 5 === 0) {
            p.setTargetRGB(0, 180, 216); // Azul eléctrico
          } else {
            p.setTargetRGB(224, 33, 138); // Magenta
          }
        } else if (sculptureType === 'triada' || sculptureType === 'irradiar') {
          // Tríada relacional: Academia (Magenta), Industria (Azul), Ciudad (Teal/Esmeralda)
          if (cid === 1) {
            p.setTargetRGB(224, 33, 138); // Academia
          } else if (cid === 2) {
            p.setTargetRGB(0, 180, 216);  // Industria
          } else if (cid === 3) {
            p.setTargetRGB(42, 157, 143); // Ciudad
          } else {
            p.setTargetRGB(255, 184, 28); // Filamentos de enlace
          }
        } else if (sculptureType === 'comunidad' || sculptureType === 'comunidad_tejida') {
          // Comunidad: 3 núcleos que crecen y se entrelazan con puentes dorados
          if (cid === 1) {
            p.setTargetRGB(224, 33, 138);
          } else if (cid === 2) {
            p.setTargetRGB(0, 180, 216);
          } else if (cid === 3) {
            p.setTargetRGB(42, 157, 143);
          } else {
            // Puentes o exploradoras
            p.setTargetRGB(255, 184, 28);
          }
        } else if (sculptureType === 'vision') {
          // Tensión bipolar: dos polos divergentes y filamentos conectores de oro
          if (cid === 1) {
            p.setTargetRGB(224, 33, 138); // Polo noroeste
          } else if (cid === 2 || cid === 3) {
            p.setTargetRGB(0, 180, 216);  // Polo sureste
          } else {
            p.setTargetRGB(255, 184, 28); // Hilos de tensión
          }
        }
      } else if (this.currentAct === 3) {
        // ACTO 3: RELEVO Y COEXISTENCIA DE 2 ESPECIES GENERACIONALES
        // En Slide 10 los colores se interpolan suavemente a lo largo de ~2s
        if (sp === 'A') {
          p.setTargetRGB(224, 33, 138); // Especie A: Experiencia / Tradición
        } else if (sp === 'B') {
          p.setTargetRGB(0, 180, 216);  // Especie B: Juventud / Futuro
        } else {
          p.setTargetRGB(255, 184, 28); // Puntos de contacto y engranaje
        }
      } else {
        // ACTO 4: APERTURA Y PORTAL QR
        if (sp === 'A') {
          p.setTargetRGB(224, 33, 138);
        } else if (sp === 'B') {
          p.setTargetRGB(0, 180, 216);
        } else {
          p.setTargetRGB(255, 184, 28);
        }
      }
    }
  }

  update() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(this.textBounds);
    }
  }

  display() {
    this.drawConnections();

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display();
    }
  }

  /**
   * Conexiones de red estructural continuas:
   * - Filamentos orgánicos estilo Jaume Plensa que acompañan a la escultura.
   * - Supresión o atenuación profunda de líneas dentro de la Zona de Calma del texto.
   * - Bounding-box pre-check para alto rendimiento a 60 FPS.
   */
  drawConnections() {
    let maxDist = CONFIG.particles.connectionDistance || 42;
    let edgeWeight = 1.3;
    let baseAlpha = CONFIG.particles.edgeOpacityBase || 0.22;

    if (this.currentAct === 2) {
      maxDist = 48;
      baseAlpha = 0.26;
      edgeWeight = 1.4;
    } else if (this.currentAct === 3) {
      maxDist = 44;
      baseAlpha = 0.28;
      edgeWeight = 1.35;
    } else if (this.currentAct === 4) {
      maxDist = 40;
      baseAlpha = 0.24;
      edgeWeight = 1.2;
    }

    if (this.isRetracted) {
      baseAlpha *= 0.65;
    }

    let maxDistSq = maxDist * maxDist;
    strokeWeight(edgeWeight);

    let tb = this.textBounds;
    let hasTB = (tb && tb.width > 0 && tb.height > 0);
    let tbPad = 12;

    let step = (this.particles.length > 1200) ? 2 : 1;
    let maxNeighbors = CONFIG.particles.maxNeighbors || 3;

    for (let i = 0; i < this.particles.length; i += step) {
      let pA = this.particles[i];
      if (pA.alpha < 25) continue;

      let connections = 0;

      for (let j = i + 1; j < this.particles.length; j += step) {
        let pB = this.particles[j];
        if (pB.alpha < 25) continue;

        let dx = pB.pos.x - pA.pos.x;
        if (abs(dx) > maxDist) continue;
        let dy = pB.pos.y - pA.pos.y;
        if (abs(dy) > maxDist) continue;

        let dSq = dx * dx + dy * dy;
        if (dSq < maxDistSq) {
          let d = sqrt(dSq);
          let alpha = map(d, 0, maxDist, 255 * baseAlpha, 0);

          // Zona de Calma: suprimir o atenuar drásticamente líneas que cruzan el texto
          if (hasTB) {
            let midX = (pA.pos.x + pB.pos.x) * 0.5;
            let midY = (pA.pos.y + pB.pos.y) * 0.5;
            if (
              midX >= tb.left - tbPad && midX <= tb.right + tbPad &&
              midY >= tb.top - tbPad && midY <= tb.bottom + tbPad
            ) {
              alpha *= 0.10; // Atenuación casi invisible sobre las letras
            }
          }

          if (alpha > 3) {
            if (pA.species === pB.species) {
              if (pA.species === 'A') {
                stroke(224, 33, 138, alpha);
              } else if (pA.species === 'B') {
                stroke(0, 180, 216, alpha);
              } else {
                stroke(255, 184, 28, alpha * 1.2);
              }
            } else {
              // Conexión entre especies o clusters distintos: filamento dorado
              stroke(255, 184, 28, alpha * 1.25);
            }

            line(pA.pos.x, pA.pos.y, pB.pos.x, pB.pos.y);
            connections++;
            if (connections >= maxNeighbors) break;
          }
        }
      }
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ParticleSystem;
}
