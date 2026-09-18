/**
 * Clase ParticleSystem — Gestor del pool continuo de 1,800 partículas.
 *
 * NUEVA ARQUITECTURA (fusión con DOM):
 * - Modo TEXTO: las partículas animan la formación del titular y luego se
 *   desvanecen a alpha 0 — el titular real (nítido) lo muestra un <h1> DOM
 *   que hace cross-fade justo cuando las partículas terminan de "fusionarse".
 * - Modo ESCULTURA: TODAS las 1,800 partículas (ya no 1,440) reaparecen y
 *   componen la figura — más densidad, mejor definición. La sombra/huella ya
 *   no es partículas: es un <div> DOM de texto real, claro y legible, que
 *   hace cross-fade junto con la escultura.
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

    for (let i = 0; i < this.count; i++) {
      let initX = width / 2 + random(-width * 0.25, width * 0.25);
      let initY = height / 2 + random(-height * 0.25, height * 0.25);
      this.particles.push(new Particle(initX, initY, i));
    }
  }

  setTextBounds(bounds) {
    this.textBounds = bounds;
  }

  setTargets(data) {
    if (data.textTargets) this.cachedTextTargets = data.textTargets;
    if (data.cloudTargets) this.cachedCloudTargets = data.cloudTargets;
    if (data.sculptureTargets) this.cachedSculptureTargets = data.sculptureTargets;
    if (data.act !== undefined) this.currentAct = data.act;
    if (data.hasPhoto !== undefined) this.isRetracted = data.hasPhoto;
    if (data.sculptureType) this.currentSculptureType = data.sculptureType;
    if (data.textBounds) this.textBounds = data.textBounds;
  }

  startSlideSequence(data) {
    this.setTargets(data);
    this.currentMode = 'text';
    this.setPhase('TEXT_CLOUD');
    for (let i = 0; i < this.particles.length; i++) {
      let kick = p5.Vector.random2D().mult(random(1.2, 2.8));
      this.particles[i].vel.add(kick);
    }
  }

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
        p.setBreathAmp(0);
        let tt = this.cachedTextTargets[i % totalText];
        p.setTarget(tt.x, tt.y);
        p.setTargetAlpha(245); // sketch.js baja esto a 0 cuando el DOM ya se fusionó
        p.setTargetScale(1.0);
        this.applyTextColors(p, i);
      }
    } else if (isSculpture) {
      this.enterSculpture();
    }
  }

  applyTextColors(p, i) {
    p.setSpecies(i % 2 === 0 ? 'A' : 'B', 0);
    if (this.currentAct <= 2) {
      if (i % 6 === 0) {
        p.setTargetRGB(0, 180, 216);
      } else {
        p.setTargetRGB(224, 33, 138);
      }
    } else if (this.currentAct === 3) {
      if (i % 2 === 0) {
        p.setTargetRGB(224, 33, 138);
      } else {
        p.setTargetRGB(0, 180, 216);
      }
    } else {
      if (i % 5 === 0) {
        p.setTargetRGB(255, 184, 28);
      } else {
        p.setTargetRGB(0, 180, 216);
      }
    }
  }

  /**
   * Color por partícula en modo escultura — extraído a helper para reusarlo
   * limpio desde enterSculpture() sin duplicar el bloque if/else gigante.
   */
  applySculptureColor(p, i, sp, cid) {
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
          p.setTargetRGB(224, 33, 138);
        } else if (cid === 2) {
          p.setTargetRGB(0, 180, 216);
        } else if (cid === 3) {
          p.setTargetRGB(42, 157, 143);
        } else {
          p.setTargetRGB(255, 184, 28);
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

  /**
   * Modo escultura con el POOL COMPLETO (1,800 partículas, ya no 1,440+360).
   * La sombra/huella dejó de ser partículas — ahora es DOM (huella-caption
   * en sketch.js), así que las 360 que antes se desperdiciaban ahí ahora
   * suman densidad real a la figura.
   */
  enterSculpture() {
    this.currentPhase = 'SCULPTURE_ACTIVE';
    if (!this.cachedSculptureTargets || this.cachedSculptureTargets.length === 0) return;
    let total = this.cachedSculptureTargets.length;

    let offsetX = 0;
    let scaleFactor = 1.0;
    let sculptureAlpha = 245;

    if (this.isRetracted) {
      sculptureAlpha = 215;
      scaleFactor = 0.78;
      offsetX = -width * 0.16;
    }

    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      let idx = Math.floor(i * (total / this.particles.length));
      let target = this.cachedSculptureTargets[idx % total];

      let finalX = (target.x - width / 2) * scaleFactor + width / 2 + offsetX;
      let finalY = (target.y - height / 2) * scaleFactor + height / 2;

      p.setIsHuella(false);
      p.setTarget(finalX, finalY);
      p.setTargetAlpha(sculptureAlpha);
      p.setTargetScale(scaleFactor);
      p.setBreathAmp(2.5);

      let sp = target.species || 'A';
      let cid = target.clusterId || 0;
      p.setSpecies(sp, cid);
      this.applySculptureColor(p, i, sp, cid);
    }
  }

  /**
   * Baja (o sube) el alpha objetivo de TODAS las partículas sin tocar su
   * posición — lo usa sketch.js para el fade-out cuando el DOM ya tomó el
   * relevo visual, y para el fade-in al reaparecer hacia la escultura.
   */
  setAllParticlesAlpha(alpha) {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].setTargetAlpha(alpha);
    }
  }

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

  drawConnections() {
    let isCloud = (this.currentPhase === 'TEXT_CLOUD');
    let isOrganizing = (this.currentPhase === 'TEXT_ORGANIZING');
    let isTextFormed = (this.currentPhase === 'TEXT_FORMED');

    if (isTextFormed) return; // el texto formado nunca dibuja líneas

    let maxDist, edgeWeight, baseAlpha;

    if (isCloud) {
      maxDist = 32.0;
      edgeWeight = 0.9;
      baseAlpha = 0.16;
    } else if (isOrganizing) {
      maxDist = 18.0;
      edgeWeight = 0.8;
      baseAlpha = 0.12;
    } else {
      // ESCULTURA
      maxDist = (typeof CONFIG !== 'undefined' && CONFIG.particles) ? (CONFIG.particles.connectionDistance || 42) : 42;
      edgeWeight = 1.3;
      baseAlpha = (typeof CONFIG !== 'undefined' && CONFIG.particles) ? (CONFIG.particles.edgeOpacityBase || 0.22) : 0.22;

      if (this.currentAct === 2) {
        maxDist = 48; baseAlpha = 0.26; edgeWeight = 1.4;
      } else if (this.currentAct === 3) {
        maxDist = 44; baseAlpha = 0.28; edgeWeight = 1.35;
      } else if (this.currentAct === 4) {
        maxDist = 40; baseAlpha = 0.24; edgeWeight = 1.2;
      }

      if (this.isRetracted) baseAlpha *= 0.65;
    }

    let maxDistSq = maxDist * maxDist;
    strokeWeight(edgeWeight);

    let endLimit = this.particles.length; // ya no hay reserva de huella que excluir
    let step = (endLimit > 1200 ? 2 : 1);
    let maxNeighbors = (typeof CONFIG !== 'undefined' && CONFIG.particles) ? (CONFIG.particles.maxNeighbors || 3) : 3;

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

          if (alpha > 3) {
            if (pA.species === pB.species) {
              if (pA.species === 'A') stroke(224, 33, 138, alpha);
              else if (pA.species === 'B') stroke(0, 180, 216, alpha);
              else stroke(255, 184, 28, alpha * 1.2);
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
