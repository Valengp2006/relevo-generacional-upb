/**
 * Diccionario Matemático de Esculturas Generativas
 * Iteración 3 — Ecosistema Continuo de Partículas (Narrativa de 13 Actos)
 */

const qrMatrix = [
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1],
  [0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0],
  [1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0],
  [1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1],
  [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0],
];

const SCULPTURES = {
  
  // SLIDE 1: Potencial Contenido (Masa compacta respirando)
  potencial: function(count, w, h, options = {}) {
    let pts = [];
    let cx = options.centerX || w * 0.5;
    let cy = options.centerY || h * 0.53;
    let scl = options.radiusScale || 1.0;
    let rBase = min(w, h) * 0.12; 

    for (let i = 0; i < count; i++) {
      let rNorm = pow(random(1), 0.5); // Distribución uniforme en círculo
      let angle = random(TWO_PI);
      let r = rBase * rNorm;
      
      // La masa parece constreñida
      if (r > rBase * 0.8) {
        r += sin(angle * 6) * (rBase * 0.15); // "Intentos" de expansión en los bordes
      }

      pts.push({
        x: cx + cos(angle) * r,
        y: cy + sin(angle) * r,
        species: 'A',
        clusterId: 1
      });
    }
    return pts;
  },

  // SLIDE 2: Auditorio (Estructura rígida)
  auditorio: function(count, w, h, options = {}) {
    let pts = [];
    let cx = options.centerX || w * 0.5;
    let cy = options.centerY || h * 0.53;
    let scl = options.radiusScale || 1.0;
    let widthArch = w * 0.35 * scl;
    let heightArch = h * 0.35 * scl;

    let totalGraderias = floor(count * 0.85);
    let totalEscenario = count - totalGraderias;

    for (let i = 0; i < totalGraderias; i++) {
      let layer = floor(random(1, 8)); // 7 niveles de gradería
      let angle = map(random(1), 0, 1, PI * 0.9, PI * 2.1); 
      let r = map(layer, 1, 7, widthArch * 0.3 * scl, widthArch);
      
      // Añadir ligero ruido para que parezcan asientos ocupados
      pts.push({
        x: cx + cos(angle) * r + random(-2, 2),
        y: cy + sin(angle) * r * 0.6 + random(-2, 2),
        species: 'A',
        clusterId: layer % 2 === 0 ? 1 : 2
      });
    }

    for (let i = 0; i < totalEscenario; i++) {
      let nx = random(-1, 1);
      let ny = random(-1, 1);
      pts.push({
        x: cx + nx * (widthArch * 0.15 * scl),
        y: cy + heightArch * 0.4 * scl + ny * (heightArch * 0.1 * scl),
        species: 'B',
        clusterId: 3
      });
    }
    return pts;
  },

  // SLIDE 3: Apertura (El auditorio se abre y expande hacia el mundo)
  apertura: function(count, w, h, options = {}) {
    let pts = [];
    let cx = options.centerX || w * 0.5;
    let cy = options.centerY || h * 0.53;
    let scl = options.radiusScale || 1.0;
    
    let coreCount = floor(count * 0.25);
    let flowCount = floor(count * 0.35);
    let regionCount = count - coreCount - flowCount;

    // 1. Núcleo Universitario (Compacto pero rompiéndose)
    let coreR = w * 0.08 * scl;
    for (let i = 0; i < coreCount; i++) {
      let r = random(coreR);
      let a = random(TWO_PI);
      pts.push({ x: cx + cos(a)*r, y: cy + sin(a)*r, species: 'A', clusterId: 1 });
    }

    // Tres direcciones
    let angles = [PI + 0.35, PI - 0.35, HALF_PI - 0.2];
    let maxDist = w * 0.22 * scl;

    // 2. Corrientes de partículas (Filamentos en expansión)
    for (let i = 0; i < flowCount; i++) {
      let branch = i % 3;
      let progress = random(1);
      // Las corrientes ondulan ligeramente
      let wave = sin(progress * 10 + branch) * (w * 0.02 * scl);
      let angle = angles[branch];
      let dist = progress * maxDist;
      
      let x = cx + cos(angle) * dist + cos(angle + HALF_PI) * wave;
      let y = cy + sin(angle) * dist + sin(angle + HALF_PI) * wave;
      pts.push({ x: x, y: y, species: 'B', clusterId: branch + 2 });
    }

    // 3. Regiones incompletas en los extremos
    for (let i = 0; i < regionCount; i++) {
      let branch = i % 3;
      let angle = angles[branch];
      let centerRX = cx + cos(angle) * maxDist;
      let centerRY = cy + sin(angle) * maxDist;
      
      let r = random(w * 0.08 * scl);
      let a = random(TWO_PI);
      
      pts.push({ 
        x: centerRX + cos(a) * r, 
        y: centerRY + sin(a) * r * 0.6, // Óvalos orgánicos
        species: 'A', 
        clusterId: branch + 2 
      });
    }

    return pts;
  },

  // SLIDE 4: Triada (Tres familias distintas)
  triada: function(count, w, h, options = {}) {
    let pts = [];
    let cx = options.centerX || w * 0.5;
    let cy = options.centerY || h * 0.53;
    let scl = options.radiusScale || 1.0;
    let spacing = w * 0.18 * scl;

    let centers = [
      { x: cx, y: cy - spacing * 0.8 },      // Academia (Arriba)
      { x: cx - spacing, y: cy + spacing * 0.4 },  // Industria (Izq)
      { x: cx + spacing, y: cy + spacing * 0.4 }   // Ciudad (Der)
    ];

    for (let i = 0; i < count; i++) {
      let cid = (i % 3);
      let center = centers[cid];
      let rNorm = pow(random(1), 0.5);
      
      let x = center.x, y = center.y;
      
      if (cid === 0) {
        // Academia: Organizada (Círculos concéntricos)
        let rings = 4;
        let ring = floor(random(rings));
        let r = map(ring, 0, rings-1, 10, spacing * 0.4);
        let ang = random(TWO_PI);
        x += cos(ang) * r;
        y += sin(ang) * r;
      } else if (cid === 1) {
        // Industria: Densa y cuadrada
        let nx = random(-1, 1);
        let ny = random(-1, 1);
        x += nx * spacing * 0.35;
        y += ny * spacing * 0.35;
      } else {
        // Ciudad: Expansiva y orgánica
        let ang = random(TWO_PI);
        let r = spacing * 0.5 * pow(random(1), 1.5); // Cola larga
        x += cos(ang) * r;
        y += sin(ang) * r;
      }

      pts.push({ x: x, y: y, species: 'A', clusterId: cid + 1 });
    }
    return pts;
  },

    // SLIDE 5: Onda de Impacto (Uno afecta a los otros)
  impacto: function(count, w, h, options = {}) {
    let pts = [];
    let cx = options.centerX || w * 0.5;
    let cy = options.centerY || h * 0.53;
    let scl = options.radiusScale || 1.0;
    let spacing = w * 0.15 * scl; // Compacto para encuadre

    let n1 = { x: cx - spacing * 0.6, y: cy };
    let n2 = { x: cx + spacing * 0.7, y: cy - spacing * 0.6 };
    let n3 = { x: cx + spacing * 0.7, y: cy + spacing * 0.6 };

    let countN1 = floor(count * 0.15);
    let countN2 = floor(count * 0.15);
    let countN3 = floor(count * 0.15);
    let countWaves = count - countN1 - countN2 - countN3;

    // Nodo 1 (Origen del impacto - Color Cyan)
    let r1 = spacing * 0.25;
    for (let i = 0; i < countN1; i++) {
      let r = pow(random(1), 0.5) * r1;
      let a = random(TWO_PI);
      pts.push({ x: n1.x + cos(a)*r, y: n1.y + sin(a)*r, species: 'A', clusterId: 2 });
    }

    // Ondas expansivas (Color Cyan) simulando el impacto viajando
    let numWaves = 6;
    let waveParticles = floor(countWaves / numWaves);
    for (let wIdx = 1; wIdx <= numWaves; wIdx++) {
      let baseR = map(wIdx, 1, numWaves, spacing * 0.4, spacing * 1.8);
      for (let i = 0; i < waveParticles; i++) {
        // Ondas que viajan hacia la derecha
        let a = random(-PI * 0.45, PI * 0.45);
        let r = baseR + random(-spacing * 0.04, spacing * 0.04);
        pts.push({ x: n1.x + cos(a)*r, y: n1.y + sin(a)*r, species: 'B', clusterId: 2 });
      }
    }

    // Nodo 2 (Arriba - Recibiendo impacto - Color Magenta)
    let r2 = spacing * 0.35;
    for (let i = 0; i < countN2; i++) {
      let r = pow(random(1), 0.5) * r2;
      let a = random(TWO_PI);
      pts.push({ x: n2.x + cos(a)*r, y: n2.y + sin(a)*r, species: 'A', clusterId: 1 });
    }

    // Nodo 3 (Abajo - Recibiendo impacto - Color Verde/Teal)
    let r3 = spacing * 0.35;
    for (let i = 0; i < countN3; i++) {
      let r = pow(random(1), 0.5) * r3;
      let a = random(TWO_PI);
      pts.push({ x: n3.x + cos(a)*r, y: n3.y + sin(a)*r, species: 'A', clusterId: 3 });
    }

    return pts;
  },

  // SLIDE 6: Comunidad (Filamentos)
  comunidad: function(count, w, h, options = {}) {
    let pts = [];
    let cx = options.centerX || w * 0.5;
    let cy = options.centerY || h * 0.53;
    let scl = options.radiusScale || 1.0;
    let r = min(w, h) * 0.35;

    for (let i = 0; i < count; i++) {
      // Red orgánica dispersa
      let x = cx + random(-r, r) * random(0.5, 1);
      let y = cy + random(-r, r) * random(0.5, 1);
      
      pts.push({ x: x, y: y, species: 'A', clusterId: (i % 3) + 1 });
    }
    return pts;
  },

  // SLIDE 7: Atracción (Talento externo)
  atraccion: function(count, w, h, options = {}) {
    let pts = [];
    let cx = options.centerX || w * 0.5;
    let cy = options.centerY || h * 0.53;
    let scl = options.radiusScale || 1.0;
    let r = min(w, h) * 0.25;

    let coreCount = floor(count * 0.7);
    let externalCount = count - coreCount;

    for (let i = 0; i < coreCount; i++) {
      let angle = random(TWO_PI);
      let dist = random(r);
      pts.push({ x: cx + cos(angle)*dist, y: cy + sin(angle)*dist, species: 'A', clusterId: 1 });
    }

    for (let i = 0; i < externalCount; i++) {
      let angle = random(TWO_PI);
      // Partículas externas siendo atraídas (espiral o estelas)
      let dist = r + random(r * 0.5, r * 1.5);
      let spiralOffset = -0.5; // ángulo de arrastre
      
      pts.push({ 
        x: cx + cos(angle + spiralOffset)*dist, 
        y: cy + sin(angle + spiralOffset)*dist, 
        species: 'B', 
        clusterId: 2 
      });
    }
    return pts;
  },

  // SLIDE 8: Exploración (Nuevas rutas)
  exploracion: function(count, w, h, options = {}) {
    let pts = [];
    let cx = options.centerX || w * 0.5;
    let cy = options.centerY || h * 0.53;
    let scl = options.radiusScale || 1.0;
    
    let coreCount = floor(count * 0.5);
    let explorerCount = count - coreCount;

    // Núcleo
    for (let i = 0; i < coreCount; i++) {
      let r = random(w * 0.15 * scl);
      let a = random(TWO_PI);
      pts.push({ x: cx + cos(a)*r, y: cy + sin(a)*r, species: 'A', clusterId: 1 });
    }

    // Rutas divergentes
    let routes = 5;
    for (let i = 0; i < explorerCount; i++) {
      let route = i % routes;
      let baseAngle = (route / routes) * TWO_PI;
      let progress = random(1);
      let length = w * 0.35 * scl;
      
      let pathWander = sin(progress * 10 + route) * 30;
      
      let x = cx + cos(baseAngle) * (progress * length) + cos(baseAngle + HALF_PI) * pathWander;
      let y = cy + sin(baseAngle) * (progress * length) + sin(baseAngle + HALF_PI) * pathWander;
      
      pts.push({ x: x, y: y, species: 'B', clusterId: 2 });
    }
    return pts;
  },

  // SLIDE 9: Dos Visiones
  visiones: function(count, w, h, options = {}) {
    let pts = [];
    let cx = options.centerX || w * 0.5;
    let cy = options.centerY || h * 0.53;
    let scl = options.radiusScale || 1.0;
    
    for (let i = 0; i < count; i++) {
      let isOld = i % 2 === 0;
      let angle = random(TWO_PI);
      
      if (isOld) {
        // Generación anterior: Anclada, densa, cerca del centro
        let r = pow(random(1), 2) * (w * 0.18 * scl);
        pts.push({ x: cx + cos(angle)*r, y: cy + sin(angle)*r, species: 'A', clusterId: 1 });
      } else {
        // Nueva generación: Fluida, explorando el perímetro externo pero orientada al centro
        let r = (w * 0.15 * scl) + random(w * 0.15 * scl);
        pts.push({ x: cx + cos(angle)*r, y: cy + sin(angle)*r, species: 'B', clusterId: 2 });
      }
    }
    return pts;
  },

  // SLIDE 10: Interpenetración (Trabajo Conjunto)
  interpenetracion: function(count, w, h, options = {}) {
    let pts = [];
    let cx = options.centerX || w * 0.5;
    let cy = options.centerY || h * 0.53;
    let scl = options.radiusScale || 1.0;
    let maxR = w * 0.22 * scl;

    for (let i = 0; i < count; i++) {
      let isOld = i % 2 === 0;
      let angle = random(TWO_PI);
      
      // Ambas ocupan el mismo volumen, pero con distribuciones matemáticas distintas
      if (isOld) {
        // Distribución gaussiana/exponencial (densa en el medio)
        let r = pow(random(1), 1.5) * maxR;
        pts.push({ x: cx + cos(angle)*r, y: cy + sin(angle)*r, species: 'A', clusterId: 1 });
      } else {
        // Distribución uniforme (ocupa todo el espacio por igual)
        let r = sqrt(random(1)) * maxR;
        pts.push({ x: cx + cos(angle)*r, y: cy + sin(angle)*r, species: 'B', clusterId: 2 });
      }
    }
    return pts;
  },

  // SLIDE 11: Periferia
  periferia: function(count, w, h, options = {}) {
    let pts = [];
    let cx = options.centerX || w * 0.5;
    let cy = options.centerY || h * 0.53;
    let scl = options.radiusScale || 1.0;
    let coreR = w * 0.15 * scl;
    let outerR = w * 0.35 * scl;

    for (let i = 0; i < count; i++) {
      let isOld = i % 2 === 0;
      let angle = random(TWO_PI);
      
      if (isOld) {
        // Centrales
        let r = sqrt(random(1)) * coreR;
        pts.push({ x: cx + cos(angle)*r, y: cy + sin(angle)*r, species: 'A', clusterId: 1 });
      } else {
        // Periféricas (Jóvenes) — no invisibles, pero en los márgenes de la red
        // Algunas infiltradas en el centro (20%) y el resto en el exterior (80%)
        let r = random(1) > 0.2 ? random(coreR, outerR) : random(coreR);
        pts.push({ x: cx + cos(angle)*r, y: cy + sin(angle)*r, species: 'B', clusterId: 2 });
      }
    }
    return pts;
  },

  // SLIDE 12: Construcción (Entrelazado)
  construccion: function(count, w, h, options = {}) {
    let pts = [];
    let cx = options.centerX || w * 0.5;
    let cy = options.centerY || h * 0.53;
    let scl = options.radiusScale || 1.0;
    
    // Una espiral de doble hélice o un tejido de grilla isométrica
    let strands = 8;
    for (let i = 0; i < count; i++) {
      let isOld = i % 2 === 0;
      let strand = i % strands;
      let progress = random(1);
      
      let baseAngle = (strand / strands) * TWO_PI;
      let radius = w * 0.25 * scl * progress;
      
      // Hélice
      let twist = isOld ? (progress * TWO_PI) : (-progress * TWO_PI);
      let finalAngle = baseAngle + twist;
      
      pts.push({ 
        x: cx + cos(finalAngle) * radius, 
        y: cy + sin(finalAngle) * radius, 
        species: isOld ? 'A' : 'B', 
        clusterId: isOld ? 1 : 2 
      });
    }
    return pts;
  },

  // SLIDE 13: Portal Unificado
  portal: function(count, w, h, options = {}) {
    let pts = [];
    let cx = options.centerX || w * 0.5;
    let cy = options.centerY || h * 0.53;
    let scl = options.radiusScale || 1.0;
    let r = min(w, h) * 0.45 * scl;

    // QR Code integration
    let qrSize = 29; // 29x29 matrix
    let pixelSize = w * 0.0075 * scl; // Tamaño de cada "pixel" del QR
    let qrTotalSize = qrSize * pixelSize;
    let startX = cx - qrTotalSize / 2;
    let startY = cy - qrTotalSize / 2;

    // Calculate how many particles we need for the QR code
    let qrOnes = 0;
    for (let row = 0; row < qrSize; row++) {
      for (let col = 0; col < qrSize; col++) {
        if (qrMatrix[row][col] === 1) qrOnes++;
      }
    }

    let particlesPerPixel = 4; // Densidad para que sea escaneable
    let qrParticleCount = qrOnes * particlesPerPixel;
    
    // Anillo exterior
    let ringCount = count - qrParticleCount;
    for (let i = 0; i < ringCount; i++) {
      let angle = random(TWO_PI);
      let ringDist = random(-r * 0.15, r * 0.15);
      let finalR = r + ringDist;
      
      pts.push({ 
        x: cx + cos(angle) * finalR, 
        y: cy + sin(angle) * finalR, 
        species: i % 2 === 0 ? 'A' : 'B', 
        clusterId: 1 
      });
    }

    // Dibujar QR Code
    for (let row = 0; row < qrSize; row++) {
      for (let col = 0; col < qrSize; col++) {
        if (qrMatrix[row][col] === 1) {
          for (let p = 0; p < particlesPerPixel; p++) {
            let px = startX + col * pixelSize + random(pixelSize);
            let py = startY + row * pixelSize + random(pixelSize);
            pts.push({
              x: px,
              y: py,
              species: 'C', // Usar una nueva especie para que no se muevan tanto
              clusterId: 2, // Color cyan brillante
              isQR: true    // Custom flag
            });
          }
        }
      }
    }
    
    return pts;
  }

};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SCULPTURES;
}
