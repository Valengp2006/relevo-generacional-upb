/**
 * Clase TargetSampler — Muestreador tipográfico y escultórico en canvas offscreen (p5.Graphics).
 * 
 * - sampleText:
 *   Renderiza titulares con tipografía agrandada, separación de letras (letter-spacing / tracking)
 *   explícita para evitar solapamientos, trazo engrosado y anclaje sin ruido para contornos
 *   definidos con máxima nitidez.
 * 
 * - sampleWordSculpture (Estilo Jaume Plensa):
 *   Genera esculturas tridimensionales donde las palabras del guion llenan
 *   siluetas humanas y arquitectónicas sólidas, conservando la legibilidad.
 * 
 * - extractPoints:
 *   Muestreo de alta fidelidad que preserva aristas y contornos sin distorsión aleatoria.
 */

class TargetSampler {
  constructor() {
    this.offscreen = null;
    this.lastTextLayout = null;
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
   * Calcula el ancho total de una cadena con espaciado entre letras explícito.
   */
  measureSpacedText(pg, str, spacing) {
    if (!str) return 0;
    let chars = str.split('');
    let w = 0;
    for (let i = 0; i < chars.length; i++) {
      w += pg.textWidth(chars[i]);
    }
    w += Math.max(0, chars.length - 1) * spacing;
    return w;
  }

  /**
   * Envuelve el texto en múltiples líneas respetando el ancho máximo y el letter-spacing.
   */
  wrapTextWithSpacing(pg, text, maxWidth, spacing) {
    if (!text) return [''];
    let words = text.split(' ');
    let lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      let testLine = currentLine.length === 0 ? words[i] : currentLine + ' ' + words[i];
      let testWidth = this.measureSpacedText(pg, testLine, spacing);

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

  /**
   * Dibuja una línea de texto centrada horizontalmente con espaciado uniforme entre caracteres.
   * Funciona tanto en p5.Graphics como en el canvas principal (window).
   */
  drawSpacedLine(target, str, centerX, y, spacing) {
    if (!str) return;
    let chars = str.split('');
    let charWidths = [];
    let totalW = 0;

    for (let i = 0; i < chars.length; i++) {
      let cw = target.textWidth(chars[i]);
      charWidths.push(cw);
      totalW += cw;
    }
    totalW += Math.max(0, chars.length - 1) * spacing;

    let startX = centerX - totalW / 2;
    let curX = startX;

    target.textAlign(LEFT, TOP);
    for (let i = 0; i < chars.length; i++) {
      target.text(chars[i], curX, y);
      curX += charWidths[i] + spacing;
    }
  }

  /**
   * Renderiza el texto del titular con tipografía más grande, separación de caracteres
   * y formas bien definidas.
   * @param {string} textString Texto del titular
   * @param {number} desiredCount Cantidad objetivo de partículas (~1800)
   * @returns {Array<{x: number, y: number}>} Coordenadas extraídas
   */
  sampleText(textString, desiredCount = 1800) {
    this.ensureGraphics(width, height);
    let pg = this.offscreen;

    pg.clear();

    // 1. Tipografía más grande y jerarquizada
    let len = textString ? textString.length : 0;
    let fontSize;
    if (len <= 25) {
      fontSize = constrain(width * 0.065, 46, 78);
    } else if (len <= 52) {
      fontSize = constrain(width * 0.050, 36, 62);
    } else {
      fontSize = constrain(width * 0.040, 28, 50);
    }

    // 2. Separación explícita entre letras (letter-spacing / tracking) para evitar solapes
    let letterSpacing = max(4.2, fontSize * 0.082);

    pg.textSize(fontSize);
    pg.textStyle(BOLD);
    pg.textFont('Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');

    // 3. Trazo engrosado y definido para dar masa y nitidez a los glifos
    pg.fill(255, 255, 255, 255);
    pg.stroke(255, 255, 255, 255);
    pg.strokeWeight(max(2.6, fontSize * 0.076));

    // 4. Salto de línea adaptativo con espaciado
    let maxTextWidth = width * 0.82;
    let lines = this.wrapTextWithSpacing(pg, textString, maxTextWidth, letterSpacing);
    let lineHeight = fontSize * 1.34;
    let totalHeight = lines.length * lineHeight;

    // Centrado vertical seguro (sin invadir la barra superior ni el footer)
    let startY = max(height * 0.22, height * 0.40 - totalHeight / 2);

    for (let i = 0; i < lines.length; i++) {
      this.drawSpacedLine(pg, lines[i], width / 2, startY + i * lineHeight, letterSpacing);
    }

    // Guardar layout para renderizar la sombra de las letras mientras la escultura vive
    this.lastTextLayout = {
      lines: lines,
      fontSize: fontSize,
      letterSpacing: letterSpacing,
      lineHeight: lineHeight,
      totalHeight: totalHeight,
      startX: width / 2,
      startY: startY,
      maxWidth: maxTextWidth
    };

    return this.extractPoints(pg, desiredCount, startY - 10, startY + totalHeight + 15);
  }

  /**
   * Escultura de Palabras estilo Jaume Plensa:
   * La silueta sólida se llena con palabras legibles del propio guion.
   */
  sampleWordSculpture(sculptureType, words, desiredCount = 1800) {
    this.ensureGraphics(width, height);
    let pg = this.offscreen;
    pg.clear();

    let sc = (typeof SCULPTURES !== 'undefined' && SCULPTURES[sculptureType])
      ? SCULPTURES[sculptureType]
      : (typeof SCULPTURES !== 'undefined' && SCULPTURES.monolith_core ? SCULPTURES.monolith_core : null);

    if (!sc) {
      return this.sampleText(words || 'RELEVO GENERACIONAL', desiredCount);
    }

    // 1. Dibujar silueta sólida
    pg.push();
    sc.draw(pg, width, height);
    pg.pop();

    // 2. Máscara de composición 'source-in'
    pg.drawingContext.save();
    pg.drawingContext.globalCompositeOperation = 'source-in';

    pg.push();
    pg.fill(255);
    pg.noStroke();
    pg.textStyle(BOLD);
    pg.textFont('Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
    pg.textAlign(LEFT, TOP);

    let cleanWords = (words && words.trim().length > 0)
      ? words.toUpperCase().replace(/[^\w\sáéíóúüñ¿?¡!+@]/gi, ' ').trim()
      : 'RELEVO GENERACIONAL CO-CREACIÓN FUTURO';
    let wordList = cleanWords.split(/\s+/).filter(w => w.length > 0);
    if (wordList.length === 0) wordList = ['RELEVO', 'GENERACIONAL'];

    let wordFontSize = constrain(width * 0.023, 18, 28);
    pg.textSize(wordFontSize);
    let rowHeight = wordFontSize * 1.28;

    let wi = 0;
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
        x += pg.textWidth(w) + wordFontSize * 0.65;
      }
    }
    pg.pop();
    pg.drawingContext.restore();

    // 3. Realce de contorno estructural sutil
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
   * Extrae ~desiredCount coordenadas de píxeles activos (alpha > 128)
   * sin introducir distorsiones aleatorias que desdibujen los trazos tipográficos.
   */
  extractPoints(pg, desiredCount = 1800, minY = 0, maxY = height) {
    pg.loadPixels();
    let yStart = max(0, floor(minY));
    let yEnd = min(height, ceil(maxY));

    let activeCandidates = 0;
    let checkStep = 3;
    for (let y = yStart; y < yEnd; y += checkStep) {
      for (let x = 0; x < width; x += checkStep) {
        let idx = (x + y * width) * 4;
        if (pg.pixels[idx + 3] > 128) {
          activeCandidates++;
        }
      }
    }

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

    // Relleno de puntos hasta completar 1,800: duplicación exacta sobre trazo SIN ruido aleatorio
    // para mantener contornos tipográficos impecables
    if (points.length > 0 && points.length < desiredCount) {
      let origLen = points.length;
      let diff = desiredCount - origLen;
      for (let i = 0; i < diff; i++) {
        let p = points[i % origLen];
        points.push({
          x: p.x,
          y: p.y
        });
      }
    }

    if (points.length > desiredCount) {
      points.length = desiredCount;
    }

    // Ordenamiento espacial ordenado por flujo visual para interpolación limpia
    points.sort((a, b) => (a.x + a.y * 0.5) - (b.x + b.y * 0.5));

    return points;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TargetSampler;
}
