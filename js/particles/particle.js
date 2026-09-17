/**
 * Clase Particle — Representación cinemática individual de un nodo generativo.
 * Implementa comportamientos de dirección autónoma (Craig Reynolds):
 * - arrive(target, targetPull): Desaceleración progresiva con ponderación dinámica.
 * - Modo Enjambre Vivo (swarmIntensity): Flujo orgánico inicial al entrar en cada slide.
 * - Anclaje Tipográfico Definido: Fijación precisa sobre el trazo para formas nítidas.
 */

class Particle {
  constructor(x, y, index) {
    this.index = index;
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.target = createVector(x, y);

    this.baseRadius = CONFIG.particles.baseRadius + (index % 4 === 0 ? 0.9 : 0.2);
    this.radius = this.baseRadius;
    this.species = (index % 2 === 0) ? 'A' : 'B';

    this.noiseOffset = index * 0.17;
    this.alpha = 240;
    this.targetAlpha = 240;
    this.scale = 1.0;
    this.targetScale = 1.0;

    this.updateColorPalette();
  }

  updateColorPalette() {
    if (this.species === 'A') {
      this.colorHex = CONFIG.colors.magenta;
    } else if (this.species === 'B') {
      this.colorHex = CONFIG.colors.blueElectric;
    } else {
      this.colorHex = CONFIG.colors.bridge;
    }
  }

  setSpecies(speciesType) {
    this.species = speciesType;
    this.updateColorPalette();
  }

  setTarget(x, y) {
    this.target.set(x, y);
  }

  setTargetAlpha(a) {
    this.targetAlpha = a;
  }

  setTargetScale(s) {
    this.targetScale = s;
  }

  applyForce(f) {
    this.acc.add(f);
  }

  arrive(target, targetPull = 1.0) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();

    if (d < 0.2) {
      this.pos.set(target.x, target.y);
      this.vel.mult(0);
      return;
    }

    let speed = CONFIG.particles.maxSpeed * targetPull;
    if (d < CONFIG.particles.arriveRadius) {
      speed = map(d, 0, CONFIG.particles.arriveRadius, 0.2, speed);
    }

    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(CONFIG.particles.maxForce * targetPull);
    this.applyForce(steer);
  }

  update(isTextMode = false, swarmIntensity = 0) {
    // 1. Fuerza de arribo hacia el target (intensificada conforme el enjambre vivo decae)
    let targetPull = max(0.15, 1.0 - swarmIntensity * 0.85);
    this.arrive(this.target, targetPull);

    // 2. Comportamiento de Enjambre Vivo (sistema fluido al inicio del slide)
    if (swarmIntensity > 0.01) {
      let nX = noise(this.pos.x * 0.003, this.pos.y * 0.003, frameCount * 0.012);
      let flowAngle = map(nX, 0, 1, -PI, PI) * 2.0;
      let flowForce = p5.Vector.fromAngle(flowAngle).mult(CONFIG.particles.maxForce * 1.3 * swarmIntensity);
      this.applyForce(flowForce);

      // Movimiento orbital colectivo alrededor del centro
      let toCenter = createVector(width / 2 - this.pos.x, height / 2 - this.pos.y);
      let tangent = createVector(-toCenter.y, toCenter.x).normalize().mult(CONFIG.particles.maxForce * 0.7 * swarmIntensity);
      this.applyForce(tangent);
    }

    // 3. Estabilización de forma y micro-movimiento:
    // En modo texto consolidado, las partículas se bloquean con precisión en los glifos para máxima nitidez
    let d = p5.Vector.dist(this.pos, this.target);
    let idleMult;

    if (isTextMode && swarmIntensity < 0.04) {
      if (d < 6.0) {
        idleMult = 0.0; // Sin vibración en el trazo: letras nítidas, sólidas y perfectamente legibles
        this.vel.mult(0.5);
        this.pos.lerp(this.target, 0.28); // Anclaje magnético al píxel del glifo
      } else {
        idleMult = 0.06;
      }
    } else {
      idleMult = (d < 10) ? 0.35 : 1.0;
    }

    if (idleMult > 0.001) {
      let nX = noise(this.pos.x * CONFIG.particles.idleNoiseScale + this.noiseOffset, frameCount * 0.008);
      let nY = noise(this.pos.y * CONFIG.particles.idleNoiseScale + this.noiseOffset + 100, frameCount * 0.008);
      let idleAngle = map(nX, 0, 1, 0, TWO_PI);
      let idleForce = p5.Vector.fromAngle(idleAngle).mult(CONFIG.particles.idleForce * idleMult);
      this.applyForce(idleForce);
    }

    // 4. Integración de Euler y amortiguamiento
    this.vel.add(this.acc);
    let maxSpd = (swarmIntensity > 0.1) ? CONFIG.particles.maxSpeed * 1.35 : CONFIG.particles.maxSpeed;
    this.vel.limit(maxSpd);
    this.vel.mult(CONFIG.particles.friction);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // 5. Suavizado de opacidad y escala
    this.alpha = lerp(this.alpha, this.targetAlpha, 0.08);
    this.scale = lerp(this.scale, this.targetScale, 0.08);
  }

  display() {
    if (this.alpha <= 5) return;

    noStroke();
    let c = color(this.colorHex);
    c.setAlpha(this.alpha);
    fill(c);

    let r = this.radius * this.scale;
    ellipse(this.pos.x, this.pos.y, r * 2, r * 2);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Particle;
}
