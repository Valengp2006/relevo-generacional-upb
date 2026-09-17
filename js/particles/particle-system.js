/**
 * Clase ParticleSystem — Gestor del pool continuo de 1,800 partículas.
 * Controla:
 * - Ciclo de Enjambre Vivo (burstSwarm / swarmIntensity): dispersión orgánica al inicio de cada slide.
 * - Conexiones estructurales adaptativas según modo (texto vs escultura).
 * - Retracción fluida ante material fotográfico documental.
 */

class ParticleSystem {
  constructor(count) {
    this.count = count || CONFIG.particles.count;
    this.particles = [];
    this.currentAct = 1;
    this.isRetracted = false;
    this.currentMode = 'text';
    this.swarmIntensity = 0.0;

    // Inicializar pool continuo
    for (let i = 0; i < this.count; i++) {
      let initX = width / 2 + random(-width * 0.3, width * 0.3);
      let initY = height / 2 + random(-height * 0.3, height * 0.3);
      this.particles.push(new Particle(initX, initY, i));
    }
  }

  /**
   * Dispara el estado de 'sistema vivo': las partículas se dispersan con ímpetu
   * orgánico antes de condensarse progresivamente en las letras del nuevo slide.
   */
  burstSwarm() {
    this.swarmIntensity = 1.0;
    for (let i = 0; i < this.particles.length; i++) {
      let kick = p5.Vector.random2D().mult(random(4.0, 9.0));
      this.particles[i].vel.add(kick);
    }
  }

  /**
   * Asigna los nuevos objetivos calculados preservando la física continua sin resets.
   */
  assignTargets(targetPoints, actNumber, hasPhoto, photoPosition, currentMode = 'text') {
    this.currentAct = actNumber || 1;
    this.isRetracted = hasPhoto || false;
    this.currentMode = currentMode || 'text';

    let totalTargets = targetPoints.length;
    if (totalTargets === 0) return;

    // Adaptación espacial ante la presencia de fotografía documental
    let offsetX = 0;
    let offsetY = 0;
    let scaleFactor = 1.0;
    let targetAlpha = 240;

    if (this.isRetracted) {
      targetAlpha = 150;
      scaleFactor = 0.72;
      if (photoPosition === 'right' || !photoPosition) {
        offsetX = -width * 0.22;
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
        let baseTarget = targetPoints[i % totalTargets];
        let angle = random(TWO_PI);
        let dist = random(6, 25);
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

      // Recategorización de especies generacionales según el Acto
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

    // Decaimiento gradual del enjambre vivo (~1.5 segundos a 60fps)
    if (this.swarmIntensity > 0) {
      this.swarmIntensity = max(0, this.swarmIntensity - 0.011);
    }

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(isText, this.swarmIntensity);
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
   * - Durante enjambre vivo: red orgánica que se contrae.
   * - En modo TEXTO consolidado: conexión microscópica (máx 8px) para evitar
   *   telarañas entre letras y preservar los espacios y huecos tipográficos.
   * - En modo ESCULTURA: red espacial amplia (48px) de acero y palabras estilo Plensa.
   */
  drawConnections() {
    let isText = (this.currentMode === 'text');

    let maxDist = isText
      ? lerp(8, 38, this.swarmIntensity)
      : CONFIG.particles.connectionDistance;

    let edgeWeight = isText ? lerp(0.6, 1.2, this.swarmIntensity) : 1.4;
    let baseAlpha = isText ? lerp(0.06, 0.25, this.swarmIntensity) : CONFIG.particles.edgeOpacityBase;

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
