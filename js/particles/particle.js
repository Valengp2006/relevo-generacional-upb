/**
 * Clase Particle — Representación individual de un nodo generativo.
 * Implementa física de interpolación (seek/arrive), micro-movimiento orgánico
 * y diferenciación de especies generacionales con transiciones de color.
 */

class Particle {
  constructor(x, y, index) {
    this.index = index;
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.target = createVector(x, y);
    
    // Parámetros visuales
    this.baseRadius = CONFIG.particles.baseRadius + (index % 3 === 0 ? 1.0 : 0);
    this.radius = this.baseRadius;
    this.species = (index % 2 === 0) ? 'A' : 'B';
    
    // Semilla individual para fluctuación orgánica (Perlin Noise)
    this.noiseOffset = index * 0.17;
    
    // Transición de opacidad y escala
    this.alpha = 240;
    this.targetAlpha = 240;
    this.scale = 1.0;
    this.targetScale = 1.0;
    
    // Coloración dinámica
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
   * Comportamiento Arrive: se mueve rápidamente hacia el objetivo
   * y desacelera suavemente dentro del radio de frenado.
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
    // 1. Fuerza hacia el objetivo
    this.arrive(this.target);

    // 2. Micro-movimiento idle constante (vida orgánica continua)
    let nX = noise(this.pos.x * CONFIG.particles.idleNoiseScale + this.noiseOffset, frameCount * 0.008);
    let nY = noise(this.pos.y * CONFIG.particles.idleNoiseScale + this.noiseOffset + 100, frameCount * 0.008);
    let idleAngle = map(nX, 0, 1, 0, TWO_PI);
    let idleForce = p5.Vector.fromAngle(idleAngle).mult(CONFIG.particles.idleForce * map(nY, 0, 1, 0.2, 1.0));
    this.applyForce(idleForce);

    // 3. Integración de Euler
    this.vel.add(this.acc);
    this.vel.mult(CONFIG.particles.friction);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // 4. Interpolación suave de alpha y escala
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
