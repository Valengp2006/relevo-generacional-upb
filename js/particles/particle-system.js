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

    // Inicializar pool continuo
    for (let i = 0; i < this.count; i++) {
      let initX = width / 2 + random(-width * 0.25, width * 0.25);
      let initY = height / 2 + random(-height * 0.25, height * 0.25);
      this.particles.push(new Particle(initX, initY, i));
    }
  }

  /**
   * Actualiza los objetivos de las partículas asegurando continuidad bidireccional.
   * Si hay más partículas que objetivos, las sobrantes se distribuyen orgánicamente.
   */
  assignTargets(targetPoints, actNumber, hasPhoto, photoPosition) {
    this.currentAct = actNumber || 1;
    this.isRetracted = hasPhoto || false;

    let totalTargets = targetPoints.length;
    if (totalTargets === 0) return;

    // Ajuste por presencia de fotografía documental
    let offsetX = 0;
    let offsetY = 0;
    let scaleFactor = 1.0;
    let targetAlpha = 240;

    if (this.isRetracted) {
      targetAlpha = 140; // Baja opacidad para dar protagonismo a la evidencia
      scaleFactor = 0.75;
      if (photoPosition === 'right' || !photoPosition) {
        offsetX = -width * 0.22; // Desplaza el sistema hacia el tercio izquierdo
      } else if (photoPosition === 'left') {
        offsetX = width * 0.22;
      }
    }

    // Configuración de especies según el Acto narrativo
    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      let target;

      if (i < totalTargets) {
        target = targetPoints[i];
      } else {
        // Partículas sobrantes orbitan alrededor de puntos aleatorios del diseño
        let baseTarget = targetPoints[i % totalTargets];
        let angle = random(TWO_PI);
        let dist = random(15, 60);
        target = {
          x: baseTarget.x + cos(angle) * dist,
          y: baseTarget.y + sin(angle) * dist
        };
      }

      // Aplicar transformación de escala y desplazamiento
      let finalX = (target.x - width / 2) * scaleFactor + width / 2 + offsetX;
      let finalY = (target.y - height / 2) * scaleFactor + height / 2 + offsetY;

      p.setTarget(finalX, finalY);
      p.setTargetAlpha(targetAlpha);
      p.setTargetScale(scaleFactor);

      // Reglas de recategorización de especies por Acto
      if (this.currentAct === 1) {
        p.setSpecies(i % 10 === 0 ? 'B' : 'A');
      } else if (this.currentAct === 2) {
        p.setSpecies(i % 4 === 0 ? 'B' : 'A');
      } else if (this.currentAct >= 3) {
        // En Acto 3 y 4: 50% especie A y 50% especie B, tejiendo la red común
        p.setSpecies(i % 2 === 0 ? 'A' : 'B');
      }
    }
  }

  update() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
    }
  }

  /**
   * Renderizado de la estructura: dibuja conexiones vinculadas (aristas)
   * y los nodos individuales respetando la gramática de cada acto.
   */
  display() {
    this.drawConnections();

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display();
    }
  }

  drawConnections() {
    // Parámetros de arista según el acto narrativo
    let maxDist = CONFIG.particles.connectionDistance;
    let edgeWeight = 1.0;
    let baseAlpha = CONFIG.particles.edgeOpacityBase;

    if (this.currentAct === 2) {
      // Acto 2: conexiones ganan grosor y densidad
      edgeWeight = 1.6;
      baseAlpha = 0.28;
      maxDist = 52;
    } else if (this.currentAct === 3) {
      // Acto 3: relevo entretejido con aristas híbridas
      edgeWeight = 1.4;
      baseAlpha = 0.32;
      maxDist = 48;
    } else if (this.currentAct === 4) {
      // Acto 4: estructura nítida tipo grilla
      edgeWeight = 1.2;
      baseAlpha = 0.35;
      maxDist = 45;
    }

    if (this.isRetracted) {
      baseAlpha *= 0.5;
    }

    strokeWeight(edgeWeight);

    // Muestreo optimizado de conexiones para mantener 60 FPS estables
    let step = (this.particles.length > 1200) ? 2 : 1;
    let maxNeighbors = CONFIG.particles.maxNeighbors;

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
            // Arista intergeneracional híbrida (puente en Acto 3)
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
