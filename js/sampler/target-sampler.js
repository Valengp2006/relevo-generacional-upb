/**
 * Clase TargetSampler — Muestreador tipográfico y escultórico en canvas offscreen (p5.Graphics).
 * 
 * - sampleText:
 *   Renderiza titulares tipográficos de alta legibilidad, con escala adaptativa,
 *   trazos engrosados para garantizar densidad de partículas y posicionamiento
 *   vertical optimizado que respeta la barra HUD superior.
 * 
 * - sampleWordSculpture (Estilo Jaume Plensa):
 *   Genera esculturas tridimensionales donde las palabras del guion llenan
 *   siluetas humanas y arquitectónicas sólidas, conservando la legibilidad
 *   de los caracteres y definiendo con nitidez la forma escultural.
 * 
 * - extractPoints:
 *   Escaneo adaptativo con balance automático de densidad para entregar
 *   exactamente el pool de 1,800 partículas con ordenamiento espacial anti-cruces.
 */

class TargetSampler {
  constructor() {
    this.offscreen = null;
  }

  ensureGraphics(w, h) {
    if (!this.offscreen || this.offscreen.width !== w || this.offscreen.height !== h) {
      if (this.offscreen) {
        this.offscreen.remove();
      }
      this.offscreen = createGraphics(w, h);
      this.offscreen.pixelDensity(1);
    }
  }

  /**
   * Resetea y limpia el canvas oculto, liberando memoria en redimensionamiento.
   */
  reset() {
    if (this.offscreen) {
      this.offscreen.remove();
      this.offscreen = null;
    }
  }

  /**
   * Renderiza el texto del titular con máxima legibilidad y extrae coordenadas.
   * @param {string} textString Texto del titular
   * @param {number} desiredCount Cantidad objetivo de partículas (~1800)
   * @returns {Array<{x: number, y: number}>} Coordenadas extraídas
   */
  sampleText(textString, desiredCount = 1800) {
    this.ensureGraphics(width, height);
    let pg = this.offscreen;

    pg.clear();

    // 1. Tipografía proporcional y jerarquizada según longitud del texto
    let len = textString ? textString.length : 0;
    let fontSize;
    if (len <= 25) {
      fontSize = constrain(width * 0.052, 38, 64);
    } else if (len <= 52) {
      fontSize = constrain(width * 0.040, 28, 50);
    } else {
      fontSize = constrain(width * 0.034, 24, 42);
    }

    pg.textSize(fontSize);
    pg.textStyle(BOLD);
    pg.textFont('Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
    pg.textAlign(CENTER, TOP);

    // 2. Trazo engrosado sutil para asegurar que cada letra tenga masa y densidad de partículas
    pg.fill(255, 255, 255, 255);
    pg.stroke(255, 255, 255, 255);
    pg.strokeWeight(max(2.0, fontSize * 0.065));

    // 3. Salto de línea automático dentro del 84% del ancho de ventana
    let maxTextWidth = width * 0.84;
    let lines = this.wrapText(pg, textString, maxTextWidth);
    let lineHeight = fontSize * 1.30;
    let totalHeight = lines.length * lineHeight;

    // Centrado vertical en la zona visible (con margen superior seguro para el HUD)
    let startY = max(height * 0.22, height * 0.40 - totalHeight / 2);

    for (let i = 0; i < lines.length; i++) {
      pg.text(lines[i], width / 2, startY + i * lineHeight);
    }

    return this.extractPoints(pg, desiredCount, startY - 10, startY + totalHeight + 15);
  }

  /**
   * Escultura de Palabras estilo Jaume Plensa:
   * La silueta sólida del acto se llena con bandas horizontales de palabras del guion,
   * manteniendo los caracteres íntegros y legibles.
   * @param {string} sculptureType Identificador en SCULPTURES
   * @param {string} words Texto acumulado del slide
   * @param {number} desiredCount Cantidad objetivo de partículas (~1800)
   */
  sampleWordSculpture(sculptureType, words, desiredCount = 1800) {
    this.ensureGraphics(width, height);
    let pg = this.offscreen;
    pg.clear();

    // 1. Obtener la definición escultórica
    let sc = (typeof SCULPTURES !== 'undefined' && SCULPTURES[sculptureType])
      ? SCULPTURES[sculptureType]
      : (typeof SCULPTURES !== 'undefined' && SCULPTURES.monolith_core ? SCULPTURES.monolith_core : null);

    if (!sc) {
      return this.sampleText(words || 'RELEVO GENERACIONAL', desiredCount);
    }

    // 2. Dibujar silueta sólida como máscara
    pg.push();
    sc.draw(pg, width, height);
    pg.pop();

    // 3. Máscara de composición 'source-in': las palabras solo existen dentro de la silueta sólida
    pg.drawingContext.save();
    pg.drawingContext.globalCompositeOperation = 'source-in';

    pg.push();
    pg.fill(255);
    pg.noStroke();
    pg.textStyle(BOLD);
    pg.textFont('Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
    pg.textAlign(LEFT, TOP);

    // Preparar lista de palabras del guion
    let cleanWords = (words && words.trim().length > 0)
      ? words.toUpperCase().replace(/[^\w\sáéíóúüñ¿?¡!+@]/gi, ' ').trim()
      : 'RELEVO GENERACIONAL CO-CREACIÓN FUTURO';
    let wordList = cleanWords.split(/\s+/).filter(w => w.length > 0);
    if (wordList.length === 0) wordList = ['RELEVO', 'GENERACIONAL'];

    // Tamaño de fuente tipográfica dentro de la escultura (estilo bandas de Plensa)
    let wordFontSize = constrain(width * 0.022, 17, 26);
    pg.textSize(wordFontSize);
    let rowHeight = wordFontSize * 1.26;

    let wi = 0;
    // Rellenar el volumen con filas continuas de palabras
    let s = min(width, height);
    let topBound = height / 2 - s * 0.40;
    let bottomBound = height / 2 + s * 0.40;
    let leftBound = width / 2 - s * 0.45;
    let rightBound = width / 2 + s * 0.45;

    for (let y = topBound; y < bottomBound; y += rowHeight) {
      let x = leftBound;
      while (x < rightBound) {
        let w = wordList[wi % wordList.length];
        wi++;
        pg.text(w, x, y);
        x += pg.textWidth(w) + wordFontSize * 0.60;
      }
    }
    pg.pop();
    pg.drawingContext.restore();

    // 4. Realce de contorno estructural sutil (como la jaula de acero de Plensa)
    if (sc.drawContour) {
      pg.drawingContext.save();
      pg.drawingContext.globalCompositeOperation = 'source-over';
      pg.stroke(255, 255, 255, 170);
      pg.strokeWeight(1.8);
      pg.noFill();
      sc.drawContour(pg, width, height);
      pg.drawingContext.restore();
    }

    return this.extractPoints(pg, desiredCount, topBound - 15, bottomBound + 20);
  }

  /**
   * Extrae exactamente ~desiredCount coordenadas de píxeles activos (alpha > 128)
   * calculando dinámicamente el salto de muestreo óptimo y ordenando espacialmente.
   */
  extractPoints(pg, desiredCount = 1800, minY = 0, maxY = height) {
    pg.loadPixels();
    let yStart = max(0, floor(minY));
    let yEnd = min(height, ceil(maxY));

    // Conteo rápido de densidad de píxeles activos
    let activeCandidates = 0;
    let checkStep = 4;
    for (let y = yStart; y < yEnd; y += checkStep) {
      for (let x = 0; x < width; x += checkStep) {
        let idx = (x + y * width) * 4;
        if (pg.pixels[idx + 3] > 128) {
          activeCandidates++;
        }
      }
    }

    // Calcular paso de muestreo fino para alcanzar desiredCount
    let ratio = activeCandidates / desiredCount;
    let sampleStep = max(2, round(checkStep * sqrt(max(0.18, ratio))));

    let points = [];
    for (let y = yStart; y < yEnd; y += sampleStep) {
      for (let x = 0; x < width; x += sampleStep) {
        let idx = (x + y * width) * 4;
        if (pg.pixels[idx + 3] > 128) {
          points.push({ x: x, y: y });
        }
      }
    }

    // Si faltan puntos para completar el pool de 1,800, duplicar con jitter subpíxel sobre trazos
    if (points.length > 0 && points.length < desiredCount) {
      let origLen = points.length;
      let diff = desiredCount - origLen;
      for (let i = 0; i < diff; i++) {
        let p = points[i % origLen];
        points.push({
          x: p.x + random(-1.2, 1.2),
          y: p.y + random(-1.2, 1.2)
        });
      }
    }

    // Si sobran, recortar
    if (points.length > desiredCount) {
      points.length = desiredCount;
    }

    // Ordenamiento espacial para interpolación física sin cruces caóticos
    points.sort((a, b) => (a.x + a.y * 0.5) - (b.x + b.y * 0.5));

    return points;
  }

  wrapText(pg, text, maxWidth) {
    if (!text) return [''];
    let words = text.split(' ');
    let lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      let testLine = currentLine.length === 0 ? words[i] : currentLine + ' ' + words[i];
      let testWidth = pg.textWidth(testLine);

      if (testWidth > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    return lines;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TargetSampler;
}
