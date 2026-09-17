/**
 * Clase Particle — Representación cinemática individual de un nodo generativo.
 * Ecosistema visual narrativo continuo (Iteración 2):
 * - Color RGB con interpolación continua suave (~2s a 60fps) sin sobrecarga de GC.
 * - Zona de calma activa: deflexión elástica y reducción de opacidad bajo el titular editorial.
 * - Protección institucional: deflexión suave lejos de los logos oficiales y el HUD superior.
 * - Cinemática de dirección autónoma (arrive) y micro-movimiento browniano continuo.
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
    this.clusterId = 0;

    this.noiseOffset = index * 0.17;
    this.alpha = 240;
    this.targetAlpha = 240;
    this.scale = 1.0;
    this.targetScale = 1.0;

    // Componentes RGB numéricos para interpolación fluida de color
    // Inicializa en el tono primario de inicio (Magenta institucional)
    this.r = 224;
    this.g = 33;
    this.b = 138;
    this.targetR = 224;
    this.targetG = 33;
    this.targetB = 138;
  }

  setTargetRGB(r, g, b) {
    this.targetR = r;
    this.targetG = g;
    this.targetB = b;
  }

  setSpecies(speciesType, clusterId = 0) {
    this.species = speciesType;
    this.clusterId = clusterId;
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

  update(textBounds = null) {
    // 1. Fuerza de arribo hacia el target continuo
    this.arrive(this.target, 1.0);

    // 2. Zona de calma: interacción armónica con el titular editorial
    let insideText = false;
    if (textBounds && textBounds.width > 0 && textBounds.height > 0) {
      let pad = 24;
      if (
        this.pos.x >= textBounds.left - pad &&
        this.pos.x <= textBounds.right + pad &&
        this.pos.y >= textBounds.top - pad &&
        this.pos.y <= textBounds.bottom + pad
      ) {
        insideText = true;
        // Suave fuerza de dispersión hacia afuera del centro del texto
        let cx = (textBounds.left + textBounds.right) / 2;
        let cy = (textBounds.top + textBounds.bottom) / 2;
        let dx = this.pos.x - cx;
        let dy = this.pos.y - cy;
        let distCenter = sqrt(dx * dx + dy * dy) + 0.001;
        let repelStrength = 0.55;
        this.applyForce(createVector((dx / distCenter) * repelStrength, (dy / distCenter) * repelStrength));
      }
    }

    // 3. Protección de esquinas institucionales y HUD superior
    // Logo UPB Forum (superior izquierdo: x < 260, y < 95)
    if (this.pos.x < 260 && this.pos.y < 95) {
      this.applyForce(createVector(0.45, 0.5));
    }
    // Logo 90 Años UPB (superior derecho: x > width - 240, y < 95)
    if (this.pos.x > width - 240 && this.pos.y < 95) {
      this.applyForce(createVector(-0.45, 0.5));
    }
    // HUD central superior (x cerca de width/2, y < 75)
    if (abs(this.pos.x - width * 0.5) < 180 && this.pos.y < 75) {
      this.applyForce(createVector(0, 0.45));
    }

    // 4. Micro-movimiento Browniano con ruido Perlin (respiración continua)
    let d = p5.Vector.dist(this.pos, this.target);
    let idleMult = (d < 15) ? 0.35 : 1.0;
    if (idleMult > 0.01) {
      let nX = noise(this.pos.x * CONFIG.particles.idleNoiseScale + this.noiseOffset, frameCount * 0.008);
      let idleAngle = map(nX, 0, 1, 0, TWO_PI);
      let idleForce = p5.Vector.fromAngle(idleAngle).mult(CONFIG.particles.idleForce * idleMult);
      this.applyForce(idleForce);
    }

    // 5. Integración de Euler y amortiguamiento
    this.vel.add(this.acc);
    this.vel.limit(CONFIG.particles.maxSpeed);
    this.vel.mult(CONFIG.particles.friction);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // 6. Suave interpolación de color (~2 segundos a 60fps con factor 0.035)
    this.r = lerp(this.r, this.targetR, 0.035);
    this.g = lerp(this.g, this.targetG, 0.035);
    this.b = lerp(this.b, this.targetB, 0.035);

    // 7. Zona de calma: atenuación suave de opacidad dentro del área del titular
    let effectiveTargetAlpha = insideText ? (this.targetAlpha * 0.32) : this.targetAlpha;
    this.alpha = lerp(this.alpha, effectiveTargetAlpha, 0.08);
    this.scale = lerp(this.scale, this.targetScale, 0.08);
  }

  display() {
    if (this.alpha <= 4) return;
    noStroke();
    fill(this.r, this.g, this.b, this.alpha);
    let r = this.radius * this.scale;
    ellipse(this.pos.x, this.pos.y, r * 2, r * 2);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Particle;
}
