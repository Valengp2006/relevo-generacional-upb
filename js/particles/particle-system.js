/**
 * Clase ParticleSystem — Gestor del pool continuo de 1,800 partículas.
 * Soporta dos modos continuos bidireccionales:
 * - Modo TEXTO: Formación de letras con ciclo de enjambre vivo (burstSwarm) y máxima legibilidad sin vibración.
 * - Modo ESCULTURA: Metamorfosis hacia las 13 esculturas generativas continuas con zona de calma.
 */

class ParticleSystem {
  constructor(count) {
    this.count = count || CONFIG.particles.count;
    this.particles = [];
    this.currentAct = 1;
    this.isRetracted = false;
    this.currentMode = 'text';
    this.swarmIntensity = 0.0;
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
   * Dispara el estado de 'sistema vivo': las partículas se dispersan con ímpetu
   * orgánico antes de condensarse progresivamente en las letras del slide.
   */
  burstSwarm() {
    this.swarmIntensity = 1.0;
    for (let i = 0; i < this.particles.length; i++) {
      let kick = p5.Vector.random2D().mult(random(4.5, 9.5));
      this.particles[i].vel.add(kick);
    }
  }

  /**
   * Actualiza los límites del titular activo para la Zona de Calma
   */
  setTextBounds(bounds) {
    this.textBounds = bounds;
  }

  /**
   * Asigna los nuevos objetivos calculados preservando la física y el movimiento continuos
   */
  assignTargets(targetPoints, actNumber, hasPhoto, currentMode = 'text', sculptureType = 'nucleo') {
    this.currentAct = actNumber || 1;
    this.isRetracted = hasPhoto || false;
    this.currentMode = currentMode || 'text';
    this.currentSculptureType = sculptureType || 'nucleo';

    let totalTargets = targetPoints.length;
    if (totalTargets === 0) return;

    let isText = (this.currentMode === 'text');

    // Configuración espacial y de opacidad según el modo
    let offsetX = 0;
    let offsetY = 0;
    let scaleFactor = 1.0;
    let targetAlpha = 245;

    if (!isText && this.isRetracted) {
      targetAlpha = 215;
      scaleFactor = 0.78;
      offsetX = -width * 0.16; // Cede espacio hacia la izquierda para que la foto destaque
    }

    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      let target = targetPoints[i % totalTargets];

      let finalX, finalY;
      if (isText) {
        finalX = target.x;
        finalY = target.y;
      } else {
        finalX = (target.x - width / 2) * scaleFactor + width / 2 + offsetX;
        finalY = (target.y - height / 2) * scaleFactor + height / 2 + offsetY;
      }

      p.setTarget(finalX, finalY);
      p.setTargetAlpha(targetAlpha);
      p.setTargetScale(scaleFactor);

      if (isText) {
        // En MODO TEXTO: Asignación de colores de alto contraste sobre fondo oscuro
        p.setSpecies(i % 2 === 0 ? 'A' : 'B', 0);
        if (this.currentAct <= 2) {
          if (i % 6 === 0) {
            p.setTargetRGB(0, 180, 216);  // Acentos en azul eléctrico
          } else {
            p.setTargetRGB(224, 33, 138); // Magenta de marca principal
          }
        } else if (this.currentAct === 3) {
          if (i % 2 === 0) {
            p.setTargetRGB(224, 33, 138); // Especie A (Experiencia)
          } else {
            p.setTargetRGB(0, 180, 216);  // Especie B (Juventud)
          }
        } else {
          if (i % 5 === 0) {
            p.setTargetRGB(255, 184, 28); // Oro institucional
          } else {
            p.setTargetRGB(0, 180, 216);
          }
        }
      } else {
        // En MODO ESCULTURA: Asignación cromática continua de los 4 Actos
        let sp = target.species;
        let cid = target.clusterId;
        p.setSpecies(sp || 'A', cid || 0);

        if (this.currentAct <= 2) {
          if (sculptureType === 'nucleo') {
            let rVar = (i % 7 === 0) ? 238 : 224;
            let gVar = (i % 7 === 0) ? 45 : 33;
            let bVar = (i % 7 === 0) ? 148 : 138;
            p.setTargetRGB(rVar, gVar, bVar);
          } else if (sculptureType === 'auditorio') {
            if (i % 5 === 0) {
              p.setTargetRGB(0, 180, 216);
            } else {
              p.setTargetRGB(224, 33, 138);
            }
          } else if (sculptureType === 'triada' || sculptureType === 'irradiar') {
            if (cid === 1) {
              p.setTargetRGB(224, 33, 138); // Academia
            } else if (cid === 2) {
              p.setTargetRGB(0, 180, 216);  // Industria
            } else if (cid === 3) {
              p.setTargetRGB(42, 157, 143); // Ciudad
            } else {
              p.setTargetRGB(255, 184, 28);
            }
          } else if (sculptureType === 'comunidad' || sculptureType === 'comunidad_tejida') {
            if (cid === 1) {
              p.setTargetRGB(224, 33, 138);
            } else if (cid === 2) {
              p.setTargetRGB(0, 180, 216);
            } else if (cid === 3) {
              p.setTargetRGB(42, 157, 143);
            } else {
              p.setTargetRGB(255, 184, 28);
            }
          } else if (sculptureType === 'vision') {
            if (cid === 1) {
              p.setTargetRGB(224, 33, 138);
            } else if (cid === 2 || cid === 3) {
              p.setTargetRGB(0, 180, 216);
            } else {
              p.setTargetRGB(255, 184, 28);
            }
          }
        } else if (this.currentAct === 3) {
          // Slide 10 en adelante: transición cromática suave de 2s hacia 2 especies
          if (sp === 'A') {
            p.setTargetRGB(224, 33, 138);
          } else if (sp === 'B') {
            p.setTargetRGB(0, 180, 216);
          } else {
            p.setTargetRGB(255, 184, 28);
          }
        } else {
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
  }

  update() {
    let isText = (this.currentMode === 'text');

    // Decaimiento del enjambre vivo (~1.4 segundos a 60fps)
    if (this.swarmIntensity > 0) {
      this.swarmIntensity = max(0, this.swarmIntensity - 0.012);
    }

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(isText, this.swarmIntensity, this.textBounds);
    }
  }

  display() {
    this.drawConnections();

    let isText = (this.currentMode === 'text');
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display(isText, this.swarmIntensity);
    }
  }

  /**
   * Conexiones de red estructural continuas:
   * - En modo TEXTO consolidado: conexión microscópica (máx 7.5px) estrictamente local
   *   para evitar telarañas entre letras y preservar la legibilidad y los huecos de glifos.
   * - Durante enjambre vivo: red orgánica expansiva que se contrae hacia el texto.
   * - En modo ESCULTURA: red espacial amplia (40-48px) de acero y palabras estilo Plensa,
   *   con atenuación sobre el área de la sombra del texto.
   */
  drawConnections() {
    let isText = (this.currentMode === 'text');

    let maxDist, edgeWeight, baseAlpha;

    if (isText) {
      if (this.swarmIntensity > 0.1) {
        maxDist = lerp(7.5, 36, this.swarmIntensity);
        edgeWeight = lerp(0.7, 1.1, this.swarmIntensity);
        baseAlpha = lerp(0.06, 0.20, this.swarmIntensity);
      } else {
        maxDist = 7.5; // Estrictamente local: nunca cruza espacios entre letras
        edgeWeight = 0.7;
        baseAlpha = 0.08;
      }
    } else {
      maxDist = CONFIG.particles.connectionDistance || 42;
      edgeWeight = 1.3;
      baseAlpha = CONFIG.particles.edgeOpacityBase || 0.22;

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
    }

    let maxDistSq = maxDist * maxDist;
    strokeWeight(edgeWeight);

    let tb = this.textBounds;
    let hasTB = (!isText && tb && tb.width > 0 && tb.height > 0);
    let tbPad = 14;

    let step = isText ? 2 : ((this.particles.length > 1200) ? 2 : 1);
    let maxNeighbors = isText ? 2 : (CONFIG.particles.maxNeighbors || 3);

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

          // Zona de Calma en escultura: suprimir líneas sobre la sombra del texto
          if (hasTB) {
            let midX = (pA.pos.x + pB.pos.x) * 0.5;
            let midY = (pA.pos.y + pB.pos.y) * 0.5;
            if (
              midX >= tb.left - tbPad && midX <= tb.right + tbPad &&
              midY >= tb.top - tbPad && midY <= tb.bottom + tbPad
            ) {
              alpha *= 0.10;
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
