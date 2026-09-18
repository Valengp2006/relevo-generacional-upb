/**
 * Clase Particle — Representación cinemática individual de un nodo generativo.
 * Ecosistema visual narrativo continuo (Iteración 2 — Texto y Escultura de Partículas):
 * - Respiración viva continua: modulación orgánica de amplitud (Nube: alta, Transición: media, Texto: cero, Huella: eco sutil).
 * - Doble rol en escultura: 1,440 partículas en escultura + 360 partículas en la huella/sombra del texto.
 * - Interpolación cromática continua de 2s sin sobrecarga de GC.
 * - Protección de esquinas institucionales y HUD superior.
 * - AJUSTE: en TEXT_FORMED, las partículas se fijan por completo (sin respiración,
 *   sin líneas de conexión) para que los bordes de las letras se lean nítidos.
 * - AJUSTE: la evasión de la foto documental ahora clampa el TARGET antes de
 *   perseguirlo (no empuja la posición ya llegada), evitando el forcejeo que
 *   producía la superposición.
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
    this.isHuella = false; // Indica si actúa como huella/sombra residual del texto en modo escultura

    this.noiseOffset = index * 0.17;
    this.alpha = 240;
    this.targetAlpha = 240;
    this.scale = 1.0;
    this.targetScale = 1.0;

    // Modulación de respiración viva (amplitud y fase)
    this.breathPhase = (index * 0.13) % TWO_PI;
    this.breathSpeed = 0.022;
    this.currentBreathAmp = 30.0; // Inicia con amplitud alta de nube
    this.targetBreathAmp = 30.0;

    // Componentes RGB numéricos para interpolación fluida de color
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

  setIsHuella(val) {
    this.isHuella = val;
  }

  setBreathAmp(amp) {
    this.targetBreathAmp = amp;
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

  update(phaseName = 'TEXT_FORMED', textBounds = null, hasPhoto = false) {
    let isCloud = (phaseName === 'TEXT_CLOUD');
    let isOrganizing = (phaseName === 'TEXT_ORGANIZING');
    let isTextFormed = (phaseName === 'TEXT_FORMED');
    let isSculpture = (phaseName === 'SCULPTURE_ACTIVE');

    // 1. Suavizado de amplitud de respiración
    this.currentBreathAmp = lerp(this.currentBreathAmp, this.targetBreathAmp, 0.04);

    // 2. Cálculo del vector de respiración viva orgánica (expansión/contracción con Perlin y senos)
    //    AJUSTE: en TEXT_FORMED, targetBreathAmp ya llega en 0 desde ParticleSystem,
    //    así que breathOffset se apaga solo — no hace falta un caso especial aquí.
    let bTime = frameCount * this.breathSpeed + this.breathPhase;
    let nVal = noise(this.pos.x * 0.005 + this.noiseOffset, bTime * 0.45);
    let breathAngle = map(nVal, 0, 1, -PI, PI) * 1.5;
    let breathRadial = sin(bTime) * this.currentBreathAmp;
    let breathOffset = createVector(cos(breathAngle) * breathRadial, sin(breathAngle) * (breathRadial * 0.85));

    // Target efectivo combinado con la respiración
    let effectiveTarget = p5.Vector.add(this.target, this.isQR ? createVector(0,0) : breathOffset);

    // 2b. AJUSTE — Evasión de la foto documental: se clampa el TARGET, no la posición.
    //     Antes esto vivía como una fuerza reactiva post-hoc (sección 7b) que competía
    //     cada frame contra arrive() tirando hacia el target original — de ahí la
    //     superposición. Ahora la partícula simplemente persigue un punto que ya
    //     está fuera de la zona de la tarjeta.
    if (hasPhoto) {
      let cardW = min(560, width * 0.50);
      let cardH = 460;
      let cardLeft = width * 0.95 - cardW - 25;
      let cardRight = width * 0.95 + 25;
      let cardTop = height * 0.5 - cardH * 0.5 - 25;
      let cardBottom = height * 0.5 + cardH * 0.5 + 25;

      if (
        effectiveTarget.x >= cardLeft && effectiveTarget.x <= cardRight &&
        effectiveTarget.y >= cardTop && effectiveTarget.y <= cardBottom
      ) {
        effectiveTarget.x = cardLeft - 30;
      }
    }

    // 3. Modulación de fuerza de arribo según la fase
    let targetPull = 1.0;
    if (isCloud) {
      targetPull = 0.18; // Flujo libre en nube
    } else if (isOrganizing) {
      targetPull = 0.65; // Atracción progresiva
    } else if (isTextFormed) {
      targetPull = 1.15; // Fijación nítida en glifos
    } else {
      targetPull = this.isHuella ? 0.70 : 1.0;
    }

    this.arrive(effectiveTarget, targetPull);

    // 4. Dinámica de Enjambre Vivo en Fase Nube
    if (isCloud) {
      let nX = noise(this.pos.x * 0.003, this.pos.y * 0.003, frameCount * 0.012);
      let flowAngle = map(nX, 0, 1, -PI, PI) * 2.0;
      let flowForce = p5.Vector.fromAngle(flowAngle).mult(CONFIG.particles.maxForce * 1.1);
      this.applyForce(flowForce);

      // Movimiento orbital colectivo sutil alrededor del centro
      let toCenter = createVector(width / 2 - this.pos.x, height / 2 - this.pos.y);
      let tangent = createVector(-toCenter.y, toCenter.x).normalize().mult(CONFIG.particles.maxForce * 0.55);
      this.applyForce(tangent);
    }

    // 5. AJUSTE — Estabilización de forma en texto consolidado: snap total, sin residuo
    //    de velocidad ni de distancia. Antes quedaba un remanente de movimiento
    //    (vel *= 0.40, lerp 0.28) que — sumado a la respiración que antes nunca
    //    llegaba a 0 — hacía que el borde de las letras nunca terminara de fijarse.
    let d = p5.Vector.dist(this.pos, effectiveTarget);
    if (isTextFormed && d < 3.0) {
      this.vel.mult(0);
      this.pos.set(effectiveTarget.x, effectiveTarget.y);
    }

    // 6. Zona de Calma para partículas de la escultura (no afecta a las partículas de la huella)
    let insideText = false;
    if (isSculpture && !this.isHuella && textBounds && textBounds.width > 0 && textBounds.height > 0) {
      let pad = 20;
      if (
        this.pos.x >= textBounds.left - pad &&
        this.pos.x <= textBounds.right + pad &&
        this.pos.y >= textBounds.top - pad &&
        this.pos.y <= textBounds.bottom + pad
      ) {
        insideText = true;
        let cx = (textBounds.left + textBounds.right) / 2;
        let cy = (textBounds.top + textBounds.bottom) / 2;
        let dx = this.pos.x - cx;
        let dy = this.pos.y - cy;
        let distCenter = sqrt(dx * dx + dy * dy) + 0.001;
        let repelStrength = 0.50;
        this.applyForce(createVector((dx / distCenter) * repelStrength, (dy / distCenter) * repelStrength));
      }
    }

    // 7. Protección institucional fija contra logos oficiales y HUD
    if (this.pos.x < 260 && this.pos.y < 95) {
      this.applyForce(createVector(0.45, 0.5));
    }
    if (this.pos.x > width - 240 && this.pos.y < 95) {
      this.applyForce(createVector(-0.45, 0.5));
    }
    if (abs(this.pos.x - width * 0.5) < 200 && this.pos.y < 75) {
      this.applyForce(createVector(0, 0.45));
    }

    // 7b. [ELIMINADO] La protección reactiva contra la tarjeta de foto que vivía aquí
    //     quedó reemplazada por el clamp del target en el paso 2b — era la causa de
    //     la superposición, porque competía frame a frame contra arrive() tirando
    //     hacia el target original sin desplazar. insidePhoto ya no se usa para
    //     fuerza; se mantiene solo como bandera para la opacidad del paso 10.
    let insidePhoto = false;
    if (hasPhoto) {
      let cardW = min(560, width * 0.50);
      let cardH = 460;
      let cardLeft = width * 0.95 - cardW - 25;
      let cardRight = width * 0.95 + 25;
      let cardTop = height * 0.5 - cardH * 0.5 - 25;
      let cardBottom = height * 0.5 + cardH * 0.5 + 25;
      insidePhoto = (
        this.pos.x >= cardLeft && this.pos.x <= cardRight &&
        this.pos.y >= cardTop && this.pos.y <= cardBottom
      );
    }

    // 8. Integración física
    this.vel.add(this.acc);
    let maxSpd = isCloud ? (CONFIG.particles.maxSpeed * 1.25) : CONFIG.particles.maxSpeed;
    this.vel.limit(maxSpd);
    this.vel.mult(CONFIG.particles.friction);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // 9. Suave interpolación de color
    this.r = lerp(this.r, this.targetR, 0.035);
    this.g = lerp(this.g, this.targetG, 0.035);
    this.b = lerp(this.b, this.targetB, 0.035);

    // 10. Suavizado de opacidad y escala
    let effAlpha = insideText ? (this.targetAlpha * 0.32) : (insidePhoto ? (this.targetAlpha * 0.12) : this.targetAlpha);
    this.alpha = lerp(this.alpha, effAlpha, 0.08);
    this.scale = lerp(this.scale, this.targetScale, 0.08);
  }

  display(phaseName = 'TEXT_FORMED') {
    if (this.alpha <= 4) return;
    noStroke();
    fill(this.r, this.g, this.b, this.alpha);

    let r = this.radius;
    if (this.isHuella) {
      r = this.radius * 0.82;
    } else if (phaseName === 'TEXT_FORMED') {
      r = this.radius * 1.8; // puntos vecinos se funden en trazo sólido
    }
    r *= this.scale;
    ellipse(this.pos.x, this.pos.y, r * 2, r * 2);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Particle;
}
