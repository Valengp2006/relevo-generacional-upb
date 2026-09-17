/**
 * Definiciones de Esculturas Generativas — Relevo Generacional (Iteración 2)
 * Secuencia narrativa continua en 13 etapas:
 * nucleo -> auditorio -> triada -> irradiar -> comunidad -> comunidad-tejida
 * -> vision -> especies -> entretejido -> portal
 * 
 * Cada generador produce un conjunto de 1,800 coordenadas objetivo {x, y, species}
 * diseñadas como transformaciones sucesivas de una sola materia continua.
 */

const SCULPTURES = {
  /**
   * SLIDE 1: nucleo
   * Una sola esfera muy densa, casi sin espacio negativo.
   * Representa potencial latente. Movimiento mínimo, como una respiración contenida.
   */
  nucleo: function(count, w, h, opts = {}) {
    let pts = [];
    let s = min(w, h);
    // Posición desplazada sutilmente al centro-derecha para equilibrar el titular editorial
    let cx = w * 0.55;
    let cy = h * 0.50;
    let baseR = s * 0.24;

    for (let i = 0; i < count; i++) {
      let phi = acos(random(-1, 1));
      let theta = random(TWO_PI);
      // Distribución densa hacia el núcleo con caída volumétrica
      let rNorm = pow(random(1), 1.8);
      let r = baseR * (0.15 + 0.85 * rNorm);

      let x = cx + r * sin(phi) * cos(theta);
      let y = cy + r * sin(phi) * sin(theta) * 0.82;

      pts.push({
        x: x,
        y: y,
        species: 'A',
        clusterId: 0
      });
    }
    return pts;
  },

  /**
   * SLIDE 2: auditorio
   * El mismo volumen del núcleo se aplana y reorganiza en filas tipo graderío institucional.
   * Rígido, ordenado y estructurado.
   */
  auditorio: function(count, w, h, opts = {}) {
    let pts = [];
    let s = min(w, h);
    let cx = w * 0.52;
    let cy = h * 0.42;

    let numRows = 7;
    let pointsPerRow = floor(count / numRows);
    let minRadius = s * 0.16;
    let maxRadius = s * 0.46;

    let idx = 0;
    for (let r = 0; r < numRows; r++) {
      let rowRadius = map(r, 0, numRows - 1, minRadius, maxRadius);
      let rowCount = (r === numRows - 1) ? (count - idx) : pointsPerRow;
      // Arcos concéntricos descendentes tipo anfiteatro
      let startAngle = PI * 0.20;
      let endAngle = PI * 0.80;

      for (let j = 0; j < rowCount; j++) {
        let t = j / (rowCount - 1);
        let ang = lerp(startAngle, endAngle, t);
        let jitterR = (sin(j * 8) * 0.02) * rowRadius;

        let x = cx + cos(ang) * (rowRadius + jitterR);
        let y = cy + sin(ang) * (rowRadius * 0.72 + jitterR);

        pts.push({
          x: x,
          y: y,
          species: 'A',
          clusterId: 0
        });
        idx++;
      }
    }
    return pts;
  },

  /**
   * SLIDE 3 & 4: triada
   * Las filas del auditorio se rompen y redistribuyen en 3 núcleos equiláteros de igual peso visual
   * (Academia, Industria, Ciudad), sin jerarquía.
   */
  triada: function(count, w, h, opts = {}) {
    let pts = [];
    let s = min(w, h);
    let cx = w * 0.52;
    let cy = h * 0.52;
    let spread = s * 0.28;
    let clusterR = s * 0.11;

    // Tres centros en triángulo equilátero
    let centers = [
      { x: cx, y: cy - spread * 0.88, id: 1 },                  // Academia (Norte)
      { x: cx - spread * 0.86, y: cy + spread * 0.52, id: 2 },  // Industria (Suroeste)
      { x: cx + spread * 0.86, y: cy + spread * 0.52, id: 3 }   // Ciudad (Sureste)
    ];

    let perCluster = floor(count / 3);

    for (let c = 0; c < 3; c++) {
      let center = centers[c];
      let clusterCount = (c === 2) ? (count - perCluster * 2) : perCluster;

      for (let i = 0; i < clusterCount; i++) {
        let ang = random(TWO_PI);
        let r = pow(random(1), 1.5) * clusterR;
        let x = center.x + cos(ang) * r;
        let y = center.y + sin(ang) * (r * 0.88);

        pts.push({
          x: x,
          y: y,
          species: 'A',
          clusterId: center.id
        });
      }
    }
    return pts;
  },

  /**
   * SLIDE 5: irradiar
   * Mantiene los 3 clusters, pero aumenta la amplitud de movimiento y algunas partículas
   * empiezan a escapar de los bordes insinuando conexiones hacia afuera.
   */
  irradiar: function(count, w, h, opts = {}) {
    let pts = [];
    let s = min(w, h);
    let cx = w * 0.52;
    let cy = h * 0.52;
    let spread = s * 0.28;
    let clusterR = s * 0.12;

    let centers = [
      { x: cx, y: cy - spread * 0.88, id: 1 },
      { x: cx - spread * 0.86, y: cy + spread * 0.52, id: 2 },
      { x: cx + spread * 0.86, y: cy + spread * 0.52, id: 3 }
    ];

    // 80% en núcleos, 20% escapando hacia el exterior
    let coreCount = floor(count * 0.80);
    let escapeCount = count - coreCount;
    let perCore = floor(coreCount / 3);

    for (let c = 0; c < 3; c++) {
      let center = centers[c];
      let curCount = (c === 2) ? (coreCount - perCore * 2) : perCore;
      for (let i = 0; i < curCount; i++) {
        let ang = random(TWO_PI);
        let r = pow(random(1), 1.4) * clusterR;
        pts.push({
          x: center.x + cos(ang) * r,
          y: center.y + sin(ang) * r,
          species: 'A',
          clusterId: center.id
        });
      }
    }

    // Partículas que escapan hacia afuera
    for (let i = 0; i < escapeCount; i++) {
      let sourceCenter = centers[i % 3];
      let outwardAngle = atan2(sourceCenter.y - cy, sourceCenter.x - cx) + random(-0.7, 0.7);
      let distOut = clusterR * (1.1 + random(1.8));
      pts.push({
        x: sourceCenter.x + cos(outwardAngle) * distOut,
        y: sourceCenter.y + sin(outwardAngle) * distOut,
        species: 'A',
        clusterId: sourceCenter.id
      });
    }

    return pts;
  },

  /**
   * SLIDE 6 & 7: comunidad
   * 3 clusters con crecimiento físico y aristas según edgeProgress.
   * Slide 7: clusterRadius = baseRadius * (1 + 0.65 * edgeProgress) -> Crecimiento evidente.
   */
  comunidad: function(count, w, h, opts = {}) {
    let pts = [];
    let s = min(w, h);
    let cx = w * 0.52;
    let cy = h * 0.52;
    let spread = s * 0.28;

    let edgeProg = (opts.edgeProgress !== undefined) ? opts.edgeProgress : 0.40;
    // Crecimiento físico real de los clusters en función de edgeProgress
    let baseRadius = s * 0.11;
    let clusterR = baseRadius * (1.0 + 0.65 * edgeProg);

    let centers = [
      { x: cx, y: cy - spread * 0.88, id: 1 },
      { x: cx - spread * 0.86, y: cy + spread * 0.52, id: 2 },
      { x: cx + spread * 0.86, y: cy + spread * 0.52, id: 3 }
    ];

    // Distribución: 75% en núcleos expandidos, 25% tejiendo puentes
    let bridgeCount = floor(count * (0.15 + 0.15 * edgeProg));
    let coreCount = count - bridgeCount;
    let perCore = floor(coreCount / 3);

    for (let c = 0; c < 3; c++) {
      let center = centers[c];
      let curCount = (c === 2) ? (coreCount - perCore * 2) : perCore;
      for (let i = 0; i < curCount; i++) {
        let ang = random(TWO_PI);
        let r = pow(random(1), 1.3) * clusterR;
        pts.push({
          x: center.x + cos(ang) * r,
          y: center.y + sin(ang) * r,
          species: 'A',
          clusterId: center.id
        });
      }
    }

    // Puentes entre los clusters (1-2, 2-3, 3-1)
    let perBridge = floor(bridgeCount / 3);
    for (let b = 0; b < 3; b++) {
      let cA = centers[b];
      let cB = centers[(b + 1) % 3];
      let bCount = (b === 2) ? (bridgeCount - perBridge * 2) : perBridge;

      for (let i = 0; i < bCount; i++) {
        let t = random(0.1, 0.9);
        let px = lerp(cA.x, cB.x, t);
        let py = lerp(cA.y, cB.y, t);
        let perpX = -(cB.y - cA.y) * 0.10 * (1 - edgeProg);
        let perpY = (cB.x - cA.x) * 0.10 * (1 - edgeProg);
        let jitter = random(-14, 14);

        pts.push({
          x: px + perpX + jitter,
          y: py + perpY + jitter,
          species: 'A',
          clusterId: 0
        });
      }
    }

    return pts;
  },

  /**
   * SLIDE 8: comunidad_tejida (comunidad-tejida)
   * Puentes sólidos entre los 3 clusters + partículas exploradoras desplazándose hacia afuera.
   */
  comunidad_tejida: function(count, w, h, opts = {}) {
    let pts = [];
    let s = min(w, h);
    let cx = w * 0.48; // Cede espacio sutil a la foto documental
    let cy = h * 0.52;
    let spread = s * 0.28;
    let clusterR = s * 0.16; // Núcleos ya grandes y crecidos

    let centers = [
      { x: cx, y: cy - spread * 0.88, id: 1 },
      { x: cx - spread * 0.86, y: cy + spread * 0.52, id: 2 },
      { x: cx + spread * 0.86, y: cy + spread * 0.52, id: 3 }
    ];

    let explorerCount = floor(count * 0.22); // 22% exploradoras
    let bridgeCount = floor(count * 0.28);   // 28% puentes sólidos
    let coreCount = count - explorerCount - bridgeCount;
    let perCore = floor(coreCount / 3);

    // Núcleos
    for (let c = 0; c < 3; c++) {
      let center = centers[c];
      let curCount = (c === 2) ? (coreCount - perCore * 2) : perCore;
      for (let i = 0; i < curCount; i++) {
        let ang = random(TWO_PI);
        let r = pow(random(1), 1.2) * clusterR;
        pts.push({
          x: center.x + cos(ang) * r,
          y: center.y + sin(ang) * r,
          species: 'A',
          clusterId: center.id
        });
      }
    }

    // Puentes sólidos
    let perBridge = floor(bridgeCount / 3);
    for (let b = 0; b < 3; b++) {
      let cA = centers[b];
      let cB = centers[(b + 1) % 3];
      let bCount = (b === 2) ? (bridgeCount - perBridge * 2) : perBridge;
      for (let i = 0; i < bCount; i++) {
        let t = random(0.05, 0.95);
        let px = lerp(cA.x, cB.x, t);
        let py = lerp(cA.y, cB.y, t);
        let normalOffset = random(-12, 12);
        pts.push({
          x: px + normalOffset,
          y: py + normalOffset,
          species: 'A',
          clusterId: 0
        });
      }
    }

    // Exploradoras en la periferia
    for (let i = 0; i < explorerCount; i++) {
      let ang = random(TWO_PI);
      let distOut = spread * (1.1 + random(0.6));
      pts.push({
        x: cx + cos(ang) * distOut,
        y: cy + sin(ang) * (distOut * 0.85),
        species: (i % 3 === 0) ? 'B' : 'A', // Primeras trazas de especie emergente
        clusterId: 99
      });
    }

    return pts;
  },

  /**
   * SLIDE 9: vision
   * 3 clusters con tensión bipolar: dos clusters derivan hacia un polo (sureste)
   * y el tercero deriva hacia el otro polo (noroeste). Tensión entre dos direcciones.
   */
  vision: function(count, w, h, opts = {}) {
    let pts = [];
    let s = min(w, h);
    let cx = w * 0.52;
    let cy = h * 0.50;

    // Dos polos principales de tensión diagonal
    // Polo 1 (Noroeste - Generación Pionera): 1 cluster
    let pole1 = { x: cx - s * 0.28, y: cy - s * 0.18 };
    // Polo 2 (Sureste - Generación Emergente): 2 clusters adyacentes
    let pole2A = { x: cx + s * 0.24, y: cy + s * 0.10 };
    let pole2B = { x: cx + s * 0.32, y: cy + s * 0.24 };

    let clusterR = s * 0.14;
    let tensionBridgeCount = floor(count * 0.25);
    let coreCount = count - tensionBridgeCount;
    let p1Count = floor(coreCount * 0.40);
    let p2ACount = floor(coreCount * 0.30);
    let p2BCount = coreCount - p1Count - p2ACount;

    // Cluster 1 (Noroeste)
    for (let i = 0; i < p1Count; i++) {
      let ang = random(TWO_PI);
      let r = pow(random(1), 1.3) * clusterR;
      pts.push({
        x: pole1.x + cos(ang) * r,
        y: pole1.y + sin(ang) * r,
        species: 'A',
        clusterId: 1
      });
    }

    // Cluster 2A (Sureste)
    for (let i = 0; i < p2ACount; i++) {
      let ang = random(TWO_PI);
      let r = pow(random(1), 1.3) * (clusterR * 0.9);
      pts.push({
        x: pole2A.x + cos(ang) * r,
        y: pole2A.y + sin(ang) * r,
        species: (i % 2 === 0) ? 'B' : 'A',
        clusterId: 2
      });
    }

    // Cluster 2B (Sureste)
    for (let i = 0; i < p2BCount; i++) {
      let ang = random(TWO_PI);
      let r = pow(random(1), 1.3) * (clusterR * 0.9);
      pts.push({
        x: pole2B.x + cos(ang) * r,
        y: pole2B.y + sin(ang) * r,
        species: 'B',
        clusterId: 3
      });
    }

    // Banda de tensión diagonal activa entre ambos polos
    for (let i = 0; i < tensionBridgeCount; i++) {
      let t = random(0.05, 0.95);
      let targetPole = (random() > 0.5) ? pole2A : pole2B;
      let px = lerp(pole1.x, targetPole.x, t);
      let py = lerp(pole1.y, targetPole.y, t);
      let jitter = (sin(t * PI) * s * 0.08) * random(-1, 1);

      pts.push({
        x: px + jitter * 0.3,
        y: py + jitter,
        species: (t < 0.45) ? 'A' : (t > 0.55 ? 'B' : 'bridge'),
        clusterId: 0
      });
    }

    return pts;
  },

  /**
   * SLIDE 10 & 11: especies
   * Reorganización en 2 especies equivalentes y estables (Magenta vs Azul Eléctrico).
   * Slide 10: Interpolación gradual de 2 segundos.
   * Slide 11: Dos especies estables lado a lado, coexistiendo en equilibrio.
   */
  especies: function(count, w, h, opts = {}) {
    let pts = [];
    let s = min(w, h);
    let cx = w * 0.52;
    let cy = h * 0.52;
    let distApart = s * 0.26;
    let speciesR = s * 0.20;

    let centerA = { x: cx - distApart, y: cy }; // Especie A (Pionera - Magenta)
    let centerB = { x: cx + distApart, y: cy }; // Especie B (Emergente - Azul Eléctrico)

    let half = floor(count / 2);

    // Especie A (Izquierda)
    for (let i = 0; i < half; i++) {
      let ang = random(TWO_PI);
      let r = pow(random(1), 1.4) * speciesR;
      // Ondulación orgánica
      let wave = sin(ang * 3) * (speciesR * 0.12);
      pts.push({
        x: centerA.x + cos(ang) * (r + wave),
        y: centerA.y + sin(ang) * (r + wave),
        species: 'A',
        clusterId: 1
      });
    }

    // Especie B (Derecha)
    for (let i = 0; i < (count - half); i++) {
      let ang = random(TWO_PI);
      let r = pow(random(1), 1.4) * speciesR;
      let wave = cos(ang * 3) * (speciesR * 0.12);
      pts.push({
        x: centerB.x + cos(ang) * (r + wave),
        y: centerB.y + sin(ang) * (r + wave),
        species: 'B',
        clusterId: 2
      });
    }

    return pts;
  },

  /**
   * SLIDE 12: entretejido
   * REDISEÑADO: Patrón de construcción activa en cremallera / zigzag / ensamble
   * en la zona de contacto central. Las dos especies encajan como piezas que construyen.
   */
  entretejido: function(count, w, h, opts = {}) {
    let pts = [];
    let s = min(w, h);
    let cx = w * 0.48; // Ligeramente a la izquierda por la fotografía documental
    let cy = h * 0.52;

    let totalWidth = s * 0.65;
    let totalHeight = s * 0.55;

    // 40% de partículas en la zona de construcción activa en zigzag/cremallera
    let zipperCount = floor(count * 0.44);
    let flankCount = count - zipperCount;
    let flankHalf = floor(flankCount / 2);

    // Zona de Flanco Izquierdo (Especie A)
    for (let i = 0; i < flankHalf; i++) {
      let u = random(0, 0.42);
      let v = random(-0.5, 0.5);
      pts.push({
        x: cx - totalWidth * 0.5 + u * totalWidth,
        y: cy + v * totalHeight * (0.8 + 0.4 * sin(u * PI)),
        species: 'A',
        clusterId: 1
      });
    }

    // Zona de Flanco Derecho (Especie B)
    for (let i = 0; i < (flankCount - flankHalf); i++) {
      let u = random(0.58, 1.0);
      let v = random(-0.5, 0.5);
      pts.push({
        x: cx - totalWidth * 0.5 + u * totalWidth,
        y: cy + v * totalHeight * (0.8 + 0.4 * sin(u * PI)),
        species: 'B',
        clusterId: 2
      });
    }

    // ZONA DE CONTACTO / CONSTRUCCIÓN EN ZIGZAG Y DIENTES DE CREMALLERA
    let numTeeth = 8;
    let teethHeight = totalHeight / numTeeth;

    for (let i = 0; i < zipperCount; i++) {
      let toothIndex = i % numTeeth;
      let toothY = cy - totalHeight * 0.5 + (toothIndex + 0.5) * teethHeight;
      let isToothA = (toothIndex % 2 === 0);

      // Los dientes de A penetran hacia la derecha (+), los de B hacia la izquierda (-)
      let penetration = s * 0.12;
      let depth = random(0.1, 1.0) * penetration;
      let toothX = isToothA ? (cx + depth) : (cx - depth);

      let jitterY = random(-teethHeight * 0.35, teethHeight * 0.35);

      pts.push({
        x: toothX,
        y: toothY + jitterY,
        species: isToothA ? 'A' : 'B',
        clusterId: 3
      });
    }

    return pts;
  },

  /**
   * SLIDE 13: portal
   * Estructura arquitectónica ortogonal de marco / grilla.
   * Enmarca el cierre y el código QR conectando con el futuro.
   */
  portal: function(count, w, h, opts = {}) {
    let pts = [];
    let s = min(w, h);
    let cx = w * 0.48;
    let cy = h * 0.50;

    let pw = s * 0.56;
    let ph = s * 0.60;

    // Distribución en las 4 vigas del marco portal + perspectiva hacia el centro
    let perBeam = floor(count * 0.20);
    let perspectiveCount = count - perBeam * 4;

    // 1. Columna Izquierda
    for (let i = 0; i < perBeam; i++) {
      let y = map(i, 0, perBeam - 1, cy - ph / 2, cy + ph / 2);
      let thickness = random(-14, 14);
      pts.push({
        x: cx - pw / 2 + thickness,
        y: y,
        species: 'A',
        clusterId: 1
      });
    }

    // 2. Columna Derecha
    for (let i = 0; i < perBeam; i++) {
      let y = map(i, 0, perBeam - 1, cy - ph / 2, cy + ph / 2);
      let thickness = random(-14, 14);
      pts.push({
        x: cx + pw / 2 + thickness,
        y: y,
        species: 'B',
        clusterId: 2
      });
    }

    // 3. Dintel Superior
    for (let i = 0; i < perBeam; i++) {
      let x = map(i, 0, perBeam - 1, cx - pw / 2 - 15, cx + pw / 2 + 15);
      let thickness = random(-14, 14);
      pts.push({
        x: x,
        y: cy - ph / 2 + thickness,
        species: (i % 2 === 0) ? 'A' : 'B',
        clusterId: 3
      });
    }

    // 4. Umbral Inferior
    for (let i = 0; i < perBeam; i++) {
      let x = map(i, 0, perBeam - 1, cx - pw / 2 - 20, cx + pw / 2 + 20);
      let thickness = random(-14, 14);
      pts.push({
        x: x,
        y: cy + ph / 2 + thickness,
        species: (i % 2 === 0) ? 'A' : 'B',
        clusterId: 4
      });
    }

    // 5. Líneas de perspectiva en fuga hacia el centro (marco tridimensional)
    for (let i = 0; i < perspectiveCount; i++) {
      let t = random(0.15, 0.95);
      let cornerX = (random() > 0.5) ? (cx + pw / 2) : (cx - pw / 2);
      let cornerY = (random() > 0.5) ? (cy + ph / 2) : (cy - ph / 2);

      let px = lerp(cx, cornerX, t);
      let py = lerp(cy, cornerY, t);

      pts.push({
        x: px + random(-8, 8),
        y: py + random(-8, 8),
        species: (i % 2 === 0) ? 'B' : 'A',
        clusterId: 5
      });
    }

    return pts;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SCULPTURES;
}
