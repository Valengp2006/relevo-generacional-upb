/**
 * Clase Particle — Representación cinemática individual de un nodo generativo.
 * Implementa comportamientos de dirección autónoma (Craig Reynolds):
 * - seek(target): Fuerza proporcional hacia el objetivo a máxima velocidad.
 * - arrive(target): Desaceleración progresiva dentro de un radio de frenado.
 */

class Particle {
  constructor(x, y, index) {
    this.index = index;
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.target = createVector(x, y);

    this.baseRadius = CONFIG.particles.baseRadius + (index % 3 === 0 ? 1.0 : 0);
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

  /**
   * Comportamiento Seek básico (fuerza directa al objetivo a velocidad crucero)
   */
  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(CONFIG.particles.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(CONFIG.particles.maxForce);
    return steer;
  }

  /**
   * Comportamiento Arrive: acelera hacia el objetivo y desacelera suavemente
   * al ingresar en el radio de aproximación (arriveRadius = 70px).
   */
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

  update() {
    // 1. Aplicar comportamiento Arrive hacia el objetivo asignado
    this.arrive(this.target);

    // 2. Micro-movimiento Browniano orgánico continuo (Ruido Perlin)
    let nX = noise(this.pos.x * CONFIG.particles.idleNoiseScale + this.noiseOffset, frameCount * 0.008);
    let nY = noise(this.pos.y * CONFIG.particles.idleNoiseScale + this.noiseOffset + 100, frameCount * 0.008);
    let idleAngle = map(nX, 0, 1, 0, TWO_PI);
    let idleForce = p5.Vector.fromAngle(idleAngle).mult(CONFIG.particles.idleForce * map(nY, 0, 1, 0.2, 1.0));
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
