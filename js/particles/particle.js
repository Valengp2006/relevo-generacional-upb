/**
 * Clase Particle — Representación cinemática individual de un nodo generativo.
 * Implementa comportamientos de dirección autónoma (Craig Reynolds):
 * - seek(target): Fuerza proporcional hacia el objetivo a máxima velocidad.
 * - arrive(target): Desaceleración progresiva dentro de un radio de frenado.
 * - Estabilización en modo texto: se ancla con firmeza para garantizar legibilidad tipográfica.
 */

class Particle {
  constructor(x, y, index) {
    this.index = index;
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.target = createVector(x, y);

    this.baseRadius = CONFIG.particles.baseRadius + (index % 4 === 0 ? 0.8 : 0);
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

  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(CONFIG.particles.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(CONFIG.particles.maxForce);
    return steer;
  }

  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();

    if (d < 0.1) {
      this.pos.set(target.x, target.y);
      this.vel.mult(0);
      return;
    }

    let speed = CONFIG.particles.maxSpeed;
    if (d < CONFIG.particles.arriveRadius) {
      speed = map(d, 0, CONFIG.particles.arriveRadius, 0.4, CONFIG.particles.maxSpeed);
    }

    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(CONFIG.particles.maxForce);
    this.applyForce(steer);
  }

  update(isTextMode = false) {
    // 1. Fuerza de arribo suave hacia el target
    this.arrive(this.target);

    // 2. Micro-movimiento Browniano orgánico (Ruido Perlin)
    // En modo texto, cuando la partícula está en su posición, amortiguamos el ruido para mantener el texto nítido
    let d = p5.Vector.dist(this.pos, this.target);
    let idleMult = isTextMode ? (d < 14 ? 0.04 : 0.15) : (d < 10 ? 0.4 : 1.0);

    let nX = noise(this.pos.x * CONFIG.particles.idleNoiseScale + this.noiseOffset, frameCount * 0.008);
    let nY = noise(this.pos.y * CONFIG.particles.idleNoiseScale + this.noiseOffset + 100, frameCount * 0.008);
    let idleAngle = map(nX, 0, 1, 0, TWO_PI);
    let idleForce = p5.Vector.fromAngle(idleAngle).mult(CONFIG.particles.idleForce * idleMult);
    this.applyForce(idleForce);

    // 3. Integración de Euler y fricción
    this.vel.add(this.acc);
    this.vel.mult(CONFIG.particles.friction);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // 4. Suavizado de opacidad y escala
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
