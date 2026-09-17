/**
 * Clase ParticleSystem — Gestor del pool fijo continuo de partículas,
 * cálculo de aristas/conexiones estructurales y adaptación espacial por capas.
 */

class ParticleSystem {
  constructor(count) {
    this.count = count || CONFIG.particles.count;
    this.particles = [];
    this.currentAct = 1;
    this.isRetracted = false;
    this.currentMode = 'text';

    // Inicializar pool continuo
    for (let i = 0; i < this.count; i++) {
      let initX = width / 2 + random(-width * 0.25, width * 0.25);
      let initY = height / 2 + random(-height * 0.25, height * 0.25);
      this.particles.push(new Particle(initX, initY, i));
    }
  }

  /**
   * Asigna los nuevos objetivos calculados, conservando la física continua sin resets.
   */
  assignTargets(targetPoints, actNumber, hasPhoto, photoPosition, currentMode = 'text') {
    this.currentAct = actNumber || 1;
    this.isRetracted = hasPhoto || false;
    this.currentMode = currentMode || 'text';

    let totalTargets = targetPoints.length;
    if (totalTargets === 0) return;

    // Adaptación ante la presencia de fotografía documental
    let offsetX = 0;
    let offsetY = 0;
    let scaleFactor = 1.0;
    let targetAlpha = 240;

    if (this.isRetracted) {
      targetAlpha = 150; // Atenuación suave para dar protagonismo a la evidencia
      scaleFactor = 0.72;
      if (photoPosition === 'right' || !photoPosition) {
        offsetX = -width * 0.22; // Cede espacio hacia la izquierda
      } else if (photoPosition === 'left') {
        offsetX = width * 0.22;
      }
    }

    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      let target;

      if (i < totalTargets) {
        target = targetPoints[i];
      } else {
        // Partículas sobrantes orbitan suavemente puntos clave
        let baseTarget = targetPoints[i % totalTargets];
        let angle = random(TWO_PI);
        let dist = random(10, 40);
        target = {
          x: baseTarget.x + cos(angle) * dist,
          y: baseTarget.y + sin(angle) * dist
        };
      }

      let finalX = (target.x - width / 2) * scaleFactor + width / 2 + offsetX;
      let finalY = (target.y - height / 2) * scaleFactor + height / 2 + offsetY;

      p.setTarget(finalX, finalY);
      p.setTargetAlpha(targetAlpha);
      p.setTargetScale(scaleFactor);

      // Recategorización de especies generacionales por Acto
      if (this.currentAct === 1) {
        p.setSpecies(i % 8 === 0 ? 'B' : 'A');
      } else if (this.currentAct === 2) {
        p.setSpecies(i % 4 === 0 ? 'B' : 'A');
      } else if (this.currentAct >= 3) {
        p.setSpecies(i % 2 === 0 ? 'A' : 'B');
      }
    }
  }

  update() {
    let isText = (this.currentMode === 'text');
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(isText);
    }
  }

  display() {
    this.drawConnections();

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display();
    }
  }

  /**
   * Conexiones vinculadas (aristas estructurales):
   * - En modo TEXTO: conexión microscópica (máx 14px) solo dentro del mismo trazo de la letra.
   *   Evita telas de araña entre letras y garantiza lectura impecable.
   * - En modo ESCULTURA: conexión amplia (45-55px) que genera la red tridimensional de Jaume Plensa.
   */
  drawConnections() {
    let isText = (this.currentMode === 'text');

    let maxDist = isText ? 14 : CONFIG.particles.connectionDistance;
    let edgeWeight = isText ? 0.8 : 1.4;
    let baseAlpha = isText ? 0.12 : CONFIG.particles.edgeOpacityBase;

    if (!isText) {
      if (this.currentAct === 2) {
        edgeWeight = 1.6;
        baseAlpha = 0.28;
        maxDist = 52;
      } else if (this.currentAct === 3) {
        edgeWeight = 1.4;
        baseAlpha = 0.32;
        maxDist = 48;
      } else if (this.currentAct === 4) {
        edgeWeight = 1.3;
        baseAlpha = 0.35;
        maxDist = 46;
      }
    }

    if (this.isRetracted) {
      baseAlpha *= 0.5;
    }

    strokeWeight(edgeWeight);

    let step = isText ? 2 : ((this.particles.length > 1200) ? 2 : 1);
    let maxNeighbors = isText ? 2 : CONFIG.particles.maxNeighbors;

    for (let i = 0; i < this.particles.length; i += step) {
      let pA = this.particles[i];
      if (pA.alpha < 20) continue;

      let connections = 0;

      for (let j = i + 1; j < this.particles.length; j += step) {
        let pB = this.particles[j];
        let d = dist(pA.pos.x, pA.pos.y, pB.pos.x, pB.pos.y);

        if (d < maxDist) {
          let alpha = map(d, 0, maxDist, 255 * baseAlpha, 0);

          if (pA.species === pB.species) {
            stroke(pA.species === 'A' ? 224 : 0, pA.species === 'A' ? 33 : 180, pA.species === 'A' ? 138 : 216, alpha);
          } else {
            stroke(255, 184, 28, alpha * 1.2);
          }

          line(pA.pos.x, pA.pos.y, pB.pos.x, pB.pos.y);
          connections++;
          if (connections >= maxNeighbors) break;
        }
      }
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ParticleSystem;
}
