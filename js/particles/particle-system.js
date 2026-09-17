/**
 * Clase ParticleSystem — Gestor del pool continuo de 1,800 partículas.
 * Arquitectura de Ecosistema Continuo:
 * - El titular nace como una nube de partículas orgánica (Fase A).
 * - Las partículas se organizan paulatinamente hacia los glifos de las letras (Fase B).
 * - Las letras se consolidan con máxima nitidez y respiración viva continua (Fase C/D).
 * - En modo Escultura (Tecla T): 1,440 partículas forman la escultura generativa y
 *   360 partículas forman la huella/sombra residual del texto, manteniendo legibilidad.
 * - Cero texto canvas 2D plano ni sombras CSS; 100% partículas vivas en todo el ciclo.
 */

class ParticleSystem {
  constructor(count) {
    this.count = count || (typeof CONFIG !== 'undefined' && CONFIG.particles ? CONFIG.particles.count : 1800);
    this.particles = [];
    this.currentPhase = 'TEXT_CLOUD'; // 'TEXT_CLOUD' | 'TEXT_ORGANIZING' | 'TEXT_FORMED' | 'SCULPTURE_ACTIVE'
    this.currentMode = 'text';        // 'text' | 'sculpture'
    this.currentAct = 1;
    this.isRetracted = false;
    this.currentSculptureType = 'nucleo';
    this.textBounds = null;

    this.cachedTextTargets = [];
    this.cachedCloudTargets = [];
    this.cachedSculptureTargets = [];

    // Inicializar pool continuo de 1,800 partículas
    for (let i = 0; i < this.count; i++) {
      let initX = width / 2 + random(-width * 0.25, width * 0.25);
      let initY = height / 2 + random(-height * 0.25, height * 0.25);
      this.particles.push(new Particle(initX, initY, i));
    }
  }

  /**
   * Actualiza los límites del titular activo para la Zona de Calma en escultura
   */
  setTextBounds(bounds) {
    this.textBounds = bounds;
  }

  /**
   * Almacena y sincroniza los conjuntos de objetivos calculados para el slide actual
   */
  setTargets(data) {
    if (data.textTargets) this.cachedTextTargets = data.textTargets;
    if (data.cloudTargets) this.cachedCloudTargets = data.cloudTargets;
    if (data.sculptureTargets) this.cachedSculptureTargets = data.sculptureTargets;
    if (data.act !== undefined) this.currentAct = data.act;
    if (data.hasPhoto !== undefined) this.isRetracted = data.hasPhoto;
    if (data.sculptureType) this.currentSculptureType = data.sculptureType;
    if (data.textBounds) this.textBounds = data.textBounds;
  }

  /**
   * Inicia el ciclo narrativo completo en un nuevo slide:
   * Arranca como nube viva respirando con dinamismo orgánico.
   */
  startSlideSequence(data) {
    this.setTargets(data);
    this.currentMode = 'text';
    this.setPhase('TEXT_CLOUD');

    // Suave impulso cinemático orgánico para reactivar la nube viva
    for (let i = 0; i < this.particles.length; i++) {
      let kick = p5.Vector.random2D().mult(random(1.2, 2.8));
      this.particles[i].vel.add(kick);
    }
  }

  /**
   * Modula la fase activa del sistema de partículas
   * @param {string} phaseName 'TEXT_CLOUD' | 'TEXT_ORGANIZING' | 'TEXT_FORMED' | 'SCULPTURE_ACTIVE'
   */
  setPhase(phaseName) {
    this.currentPhase = phaseName;
    let isCloud = (phaseName === 'TEXT_CLOUD');
    let isOrganizing = (phaseName === 'TEXT_ORGANIZING');
    let isTextFormed = (phaseName === 'TEXT_FORMED');
    let isSculpture = (phaseName === 'SCULPTURE_ACTIVE');

    if (isCloud) {
      if (!this.cachedCloudTargets || this.cachedCloudTargets.length === 0) return;
      let totalCloud = this.cachedCloudTargets.length;
      for (let i = 0; i < this.particles.length; i++) {
        let p = this.particles[i];
        p.setIsHuella(false);
        p.setBreathAmp(32.0);
        let ct = this.cachedCloudTargets[i % totalCloud];
        p.setTarget(ct.x, ct.y);
        p.setTargetAlpha(225);
        p.setTargetScale(1.0);
        this.applyTextColors(p, i);
      }
    } else if (isOrganizing) {
      if (!this.cachedTextTargets || this.cachedTextTargets.length === 0) return;
      let totalText = this.cachedTextTargets.length;
      for (let i = 0; i < this.particles.length; i++) {
        let p = this.particles[i];
        p.setIsHuella(false);
        p.setBreathAmp(12.0);
        let tt = this.cachedTextTargets[i % totalText];
        p.setTarget(tt.x, tt.y);
        p.setTargetAlpha(240);
        p.setTargetScale(1.0);
        this.applyTextColors(p, i);
      }
    } else if (isTextFormed) {
      if (!this.cachedTextTargets || this.cachedTextTargets.length === 0) return;
      let totalText = this.cachedTextTargets.length;
      for (let i = 0; i < this.particles.length; i++) {
        let p = this.particles[i];
        p.setIsHuella(false);
        p.setBreathAmp(1.8);
        let tt = this.cachedTextTargets[i % totalText];
        p.setTarget(tt.x, tt.y);
        p.setTargetAlpha(245);
        p.setTargetScale(1.0);
        this.applyTextColors(p, i);
      }
    } else if (isSculpture) {
      this.applySculptureAndHuella();
    }
  }

  /**
   * Aplica la paleta tipográfica según el acto activo
   */
  applyTextColors(p, i) {
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
        p.setTargetRGB(0, 180, 216);  // Azul eléctrico
      }
    }
  }

  /**
   * Distribución dual en Modo Escultura:
   * - 1,440 partículas viajan a componer la escultura generativa
   * - 360 partículas permanecen delineando la huella/sombra residual del texto
   */
  applySculptureAndHuella() {
    if (!this.cachedSculptureTargets || this.cachedSculptureTargets.length === 0) return;
    let totalSculpture = this.cachedSculptureTargets.length;
    let totalText = (this.cachedTextTargets && this.cachedTextTargets.length > 0) ? this.cachedTextTargets.length : 1;

    let sculptureCount = 1440;
    let huellaCount = this.particles.length - sculptureCount; // 360

    // 1. Partículas de la Escultura Generativa (0 a 1439)
    let offsetX = 0;
    let offsetY = 0;
    let scaleFactor = 1.0;
    let sculptureAlpha = 245;

    if (this.isRetracted) {
      sculptureAlpha = 215;
      scaleFactor = 0.78;
      offsetX = -width * 0.16; // Retracción ante fotografía documental
    }

    for (let i = 0; i < sculptureCount; i++) {
      let p = this.particles[i];
      // Muestreo uniforme a lo largo de todos los clusters de la escultura
      let scIdx = Math.floor(i * (totalSculpture / sculptureCount));
      let target = this.cachedSculptureTargets[scIdx % totalSculpture];

      let finalX = (target.x - width / 2) * scaleFactor + width / 2 + offsetX;
      let finalY = (target.y - height / 2) * scaleFactor + height / 2 + offsetY;

      p.setIsHuella(false);
      p.setTarget(finalX, finalY);
      p.setTargetAlpha(sculptureAlpha);
      p.setTargetScale(scaleFactor);
      p.setBreathAmp(2.5);

      let sp = target.species || 'A';
      let cid = target.clusterId || 0;
      p.setSpecies(sp, cid);

      // Asignación cromática continua de los 4 Actos
      if (this.currentAct <= 2) {
        if (this.currentSculptureType === 'nucleo') {
          let rVar = (i % 7 === 0) ? 238 : 224;
          let gVar = (i % 7 === 0) ? 45 : 33;
          let bVar = (i % 7 === 0) ? 148 : 138;
          p.setTargetRGB(rVar, gVar, bVar);
        } else if (this.currentSculptureType === 'auditorio') {
          if (i % 5 === 0) {
            p.setTargetRGB(0, 180, 216);
          } else {
            p.setTargetRGB(224, 33, 138);
          }
        } else if (this.currentSculptureType === 'triada' || this.currentSculptureType === 'irradiar' ||
                   this.currentSculptureType === 'comunidad' || this.currentSculptureType === 'comunidad_tejida') {
          if (cid === 1) {
            p.setTargetRGB(224, 33, 138); // Academia
          } else if (cid === 2) {
            p.setTargetRGB(0, 180, 216);  // Industria
          } else if (cid === 3) {
            p.setTargetRGB(42, 157, 143); // Ciudad
          } else {
            p.setTargetRGB(255, 184, 28); // Articulación
          }
        } else if (this.currentSculptureType === 'vision') {
          if (cid === 1) {
            p.setTargetRGB(224, 33, 138);
          } else if (cid === 2 || cid === 3) {
            p.setTargetRGB(0, 180, 216);
          } else {
            p.setTargetRGB(255, 184, 28);
          }
        } else {
          p.setTargetRGB(224, 33, 138);
        }
      } else if (this.currentAct === 3) {
        // Transición cromática suave hacia 2 especies
        if (sp === 'A') {
          p.setTargetRGB(224, 33, 138);
        } else if (sp === 'B') {
          p.setTargetRGB(0, 180, 216);
        } else {
          p.setTargetRGB(255, 184, 28);
        }
      } else {
        // Acto 4
        if (sp === 'A') {
          p.setTargetRGB(224, 33, 138);
        } else if (sp === 'B') {
          p.setTargetRGB(0, 180, 216);
        } else {
          p.setTargetRGB(255, 184, 28);
        }
      }
    }

    // 2. Partículas asignadas a la HUELLA residual del texto (1440 a 1799)
    // Distribución uniforme a lo largo del muestreo de glifos tipográficos
    for (let j = 0; j < huellaCount; j++) {
      let pIdx = sculptureCount + j;
      let p = this.particles[pIdx];

      let textIdx = Math.floor(j * (totalText / huellaCount));
      let tTarget = this.cachedTextTargets[textIdx % totalText];

      p.setIsHuella(true);
      p.setTarget(tTarget.x, tTarget.y);
      p.setTargetAlpha(78);           // Opacidad suave, etérea y legible
      p.setTargetScale(0.82);         // Escala sutil para un punteado nítido
      p.setBreathAmp(2.0);            // Respiración etérea suave
      p.setTargetRGB(215, 230, 250);  // Platino luminoso / blanco celestial
      p.setSpecies('HUELLA', 0);
    }
  }

  /**
   * Método de compatibilidad retroactiva
   */
  assignTargets(targetPoints, actNumber, hasPhoto, currentMode = 'text', sculptureType = 'nucleo') {
    this.currentAct = actNumber || 1;
    this.isRetracted = hasPhoto || false;
    this.currentSculptureType = sculptureType || 'nucleo';
    this.currentMode = currentMode || 'text';
    if (this.currentMode === 'text') {
      this.cachedTextTargets = targetPoints;
      this.setPhase('TEXT_FORMED');
    } else {
      this.cachedSculptureTargets = targetPoints;
      this.setPhase('SCULPTURE_ACTIVE');
    }
  }

  /**
   * Dispersión de enjambre vivo (compatibilidad retroactiva)
   */
  burstSwarm() {
    for (let i = 0; i < this.particles.length; i++) {
      let kick = p5.Vector.random2D().mult(random(1.5, 3.5));
      this.particles[i].vel.add(kick);
    }
  }

  update() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(this.currentPhase, this.textBounds, this.isRetracted);
    }
  }

  display() {
    this.drawConnections();
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display(this.currentPhase);
    }
  }

  /**
   * Conexiones de red continuas:
   * - En modo TEXTO consolidado: conexión ultra-local (máx 7.0px) para no crear telarañas
   *   entre caracteres y mantener los huecos tipográficos perfectos.
   * - En Fase NUBE: red expansiva orgánica.
   * - En Fase ORGANIZACIÓN: red que converge hacia las letras.
   * - En modo ESCULTURA: red espacial amplia (40-48px) de acero y palabras estilo Plensa,
   *   excluyendo las partículas de la huella del texto para no atarlas con hilos.
   */
  drawConnections() {
    let isCloud = (this.currentPhase === 'TEXT_CLOUD');
    let isOrganizing = (this.currentPhase === 'TEXT_ORGANIZING');
    let isTextFormed = (this.currentPhase === 'TEXT_FORMED');
    let isSculpture = (this.currentPhase === 'SCULPTURE_ACTIVE');

    let maxDist, edgeWeight, baseAlpha;

    if (isTextFormed) {
      maxDist = 7.0; // Estrictamente local: nunca cruza espacios entre letras
      edgeWeight = 0.7;
      baseAlpha = 0.08;
    } else if (isCloud) {
      maxDist = 32.0;
      edgeWeight = 0.9;
      baseAlpha = 0.16;
    } else if (isOrganizing) {
      maxDist = 18.0;
      edgeWeight = 0.8;
      baseAlpha = 0.12;
    } else {
      // Modo ESCULTURA
      maxDist = (typeof CONFIG !== 'undefined' && CONFIG.particles) ? (CONFIG.particles.connectionDistance || 42) : 42;
      edgeWeight = 1.3;
      baseAlpha = (typeof CONFIG !== 'undefined' && CONFIG.particles) ? (CONFIG.particles.edgeOpacityBase || 0.22) : 0.22;

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
    let hasTB = (isSculpture && tb && tb.width > 0 && tb.height > 0);
    let tbPad = 14;

    // En escultura solo conectamos partículas de la escultura (< 1440) para mantener la huella limpia
    let endLimit = isSculpture ? 1440 : this.particles.length;
    let step = isTextFormed ? 2 : (endLimit > 1200 ? 2 : 1);
    let maxNeighbors = isTextFormed ? 2 : ((typeof CONFIG !== 'undefined' && CONFIG.particles) ? (CONFIG.particles.maxNeighbors || 3) : 3);

    for (let i = 0; i < endLimit; i += step) {
      let pA = this.particles[i];
      if (pA.alpha < 25) continue;

      let connections = 0;

      for (let j = i + 1; j < endLimit; j += step) {
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

          // Zona de Calma en escultura: suprimir líneas sobre el área de la huella del texto
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
