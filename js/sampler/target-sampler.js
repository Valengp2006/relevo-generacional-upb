/**
 * Clase TargetSampler — Muestreador tipográfico y escultórico en canvas offscreen (p5.Graphics).
 * 
 * - sampleText:
 *   Renderiza titulares con tipografía agrandada, separación de letras (letter-spacing / tracking)
 *   explícita para evitar solapamientos, trazo engrosado y anclaje sin ruido para contornos
 *   definidos con máxima nitidez.
 * 
 * - sampleTextForHuella [NUEVO]:
 *   Misma diagramación que sampleText, pero con blur aplicado al canvas oculto antes de
 *   extraer píxeles. Con solo 360 partículas (frente a las 1,800 de sampleText), intentar
 *   deletrear el mismo titular con nitidez es matemáticamente insuficiente — el resultado
 *   se lee como ruido, no como sombra. El blur convierte esos mismos puntos escasos en una
 *   masa difusa coherente, que es lo que una "huella" visual debe ser.
 * 
 * - sampleWordSculpture (Estilo Jaume Plensa):
 *   Genera esculturas tridimensionales donde las palabras del guion llenan
 *   siluetas humanas y arquitectónicas sólidas, conservando la legibilidad.
 * 
 * - extractPoints:
 *   Muestreo de alta fidelidad que preserva aristas y contornos sin distorsión aleatoria.
 *   Ahora acepta un umbral de alpha configurable (por defecto 128) para poder capturar
 *   el halo difuso de sampleTextForHuella, que tiene mucho píxel de alpha bajo/medio.
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
  
  parseHtmlChars(str) {
    let chars = [];
    let inBold = false;
    for (let i = 0; i < str.length; i++) {
      if (str.substr(i, 3) === '<b>') {
        inBold = true;
        i += 2;
      } else if (str.substr(i, 4) === '</b>') {
        inBold = false;
        i += 3;
      } else {
        chars.push({ char: str[i], isBold: inBold });
      }
    }
    return chars;
  }

  measureSpacedText(pg, str, spacing) {
    if (!str) return 0;
    let parsed = this.parseHtmlChars(str);
    let w = 0;
    for (let i = 0; i < parsed.length; i++) {
      w += pg.textWidth(parsed[i].char);
    }
    w += Math.max(0, parsed.length - 1) * spacing;
    return w;
  }

  /**
   * Envuelve el texto en múltiples líneas respetando el ancho máximo y el letter-spacing.
   */
  wrapTextWithSpacing(pg, text, maxWidth, spacing) {
    if (!text) return [''];
    let explicitLines = text.split('\n');
    let finalLines = [];

    for (let j = 0; j < explicitLines.length; j++) {
      let words = explicitLines[j].split(' ');
      let currentLine = '';

      for (let i = 0; i < words.length; i++) {
        let testLine = currentLine.length === 0 ? words[i] : currentLine + ' ' + words[i];
        let testWidth = this.measureSpacedText(pg, testLine, spacing);

        if (testWidth > maxWidth && currentLine.length > 0) {
          finalLines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine.length > 0) {
        finalLines.push(currentLine);
      }
    }
    return finalLines;
  }

  /**
   * Dibuja una línea de texto centrada horizontalmente con espaciado uniforme entre caracteres.
   * Funciona tanto en p5.Graphics como en el canvas principal (window).
   */
  drawSpacedLine(target, str, centerX, y, spacing) {
    if (!str) return;
    let parsed = this.parseHtmlChars(str);
    let charWidths = [];
    let totalW = 0;

    for (let i = 0; i < parsed.length; i++) {
      let cw = target.textWidth(parsed[i].char);
      charWidths.push(cw);
      totalW += cw;
    }
    totalW += Math.max(0, parsed.length - 1) * spacing;

    let startX = centerX - totalW / 2;
    let curX = startX;

    target.textAlign(LEFT, TOP);
    for (let i = 0; i < parsed.length; i++) {
      if (parsed[i].isBold) {
        target.fill(255, 0, 0, 255); // Red for highlighted particles
        target.stroke(255, 0, 0, 255);
      } else {
        target.fill(255, 255, 255, 255); // White for normal particles
        target.stroke(255, 255, 255, 255);
      }
      target.text(parsed[i].char, curX, y);
      curX += charWidths[i] + spacing;
    }
  }

  /**
   * Calcula la diagramación (layout) del titular sin dibujarlo — compartida por
   * sampleText y sampleTextForHuella para que ambas coincidan en posición exacta.
   */
  computeLayout(pg, textString, hasPhoto) {
    let len = textString ? textString.length : 0;
    let fontSize, maxTextWidth, centerX;

    if (hasPhoto) {
      maxTextWidth = min(width * 0.44, 620);
      centerX = width * 0.27;
      if (len <= 25) {
        fontSize = constrain(width * 0.048, 34, 54);
      } else if (len <= 52) {
        fontSize = constrain(width * 0.038, 26, 42);
      } else {
        fontSize = constrain(width * 0.030, 22, 34);
      }
    } else {
      maxTextWidth = width * 0.82;
      centerX = width / 2;
      if (len <= 25) {
        fontSize = constrain(width * 0.065, 46, 64);
      } else if (len <= 52) {
        fontSize = constrain(width * 0.050, 36, 62);
      } else {
        fontSize = constrain(width * 0.040, 28, 50);
      }
    }

    let letterSpacing = max(hasPhoto ? 3.5 : 4.2, fontSize * (hasPhoto ? 0.078 : 0.082));

    pg.textSize(fontSize);
    pg.textStyle(BOLD);
    pg.textFont('Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');

    let lines = this.wrapTextWithSpacing(pg, textString, maxTextWidth, letterSpacing);
    let lineHeight = fontSize * 1.34;
    let totalHeight = lines.length * lineHeight;

    let cy = hasPhoto ? height * 0.46 : height * 0.40;
    if (textString.includes("QR con memoria")) cy = height * 0.38;
    
    let startY = max(height * 0.15, cy - totalHeight / 2);

    return { lines, fontSize, letterSpacing, lineHeight, totalHeight, startX: centerX, startY, maxWidth: maxTextWidth, hasPhoto };
  }

  /**
   * Renderiza el texto del titular con tipografía de alto contraste, separación de caracteres
   * y diagramación adaptativa (centrado general o dos columnas cuando hay fotografía documental).
   * @param {string} textString Texto del titular
   * @param {number} desiredCount Cantidad objetivo de partículas (~1800)
   * @param {boolean} hasPhoto Indica si el slide contiene una fotografía documental a la derecha
   * @returns {Array<{x: number, y: number}>} Coordenadas extraídas
   */
  sampleText(textString, desiredCount = 1800, hasPhoto = false) {
    this.ensureGraphics(width, height);
    let pg = this.offscreen;
    pg.clear();

    let layout = this.computeLayout(pg, textString, hasPhoto);

    pg.fill(255, 255, 255, 255);
    pg.stroke(255, 255, 255, 255);
    pg.strokeWeight(max(2.2, layout.fontSize * 0.074));

    for (let i = 0; i < layout.lines.length; i++) {
      this.drawSpacedLine(pg, layout.lines[i], layout.startX, layout.startY + i * layout.lineHeight, layout.letterSpacing);
    }

    this.lastTextLayout = layout;

    return this.extractPoints(pg, desiredCount, 0, height, 128);
  }

  /**
   * [NUEVO] Versión difuminada del titular, exclusiva para alimentar la "huella"
   * residual en modo escultura (las 360 partículas que quedan marcando el texto
   * mientras el resto compone la figura). Misma posición/tamaño que sampleText
   * (usa computeLayout compartido) para que la huella caiga exactamente donde
   * estaría el texto real, pero renderizada con blur para que se lea como masa
   * difusa coherente y no como ruido disperso.
   * @param {string} textString Texto del titular
   * @param {number} desiredCount Cantidad objetivo de partículas (~360)
   * @param {boolean} hasPhoto Debe coincidir con el hasPhoto del slide, para alinear posición
   * @param {number} blurPx Radio de blur en píxeles (por defecto proporcional al tamaño de fuente)
   */
  sampleTextForHuella(textString, desiredCount = 360, hasPhoto = false, blurPx = null) {
    this.ensureGraphics(width, height);
    let pg = this.offscreen;
    pg.clear();

    let bandCenterY = height * 0.86;
    let maxTextWidth = hasPhoto ? width * 0.42 : width * 0.62;
    let centerX = hasPhoto ? width * 0.45 : width / 2;

    let fontSize = constrain(width * 0.022, 14, 22);
    pg.textSize(fontSize);
    pg.textStyle(BOLD);
    pg.textFont('Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');

    let letterSpacing = max(2.2, fontSize * 0.06);
    let lines = this.wrapTextWithSpacing(pg, textString, maxTextWidth, letterSpacing);
    if (lines.length > 2) lines = lines.slice(0, 2);

    let lineHeight = fontSize * 1.3;
    let totalHeight = lines.length * lineHeight;
    let startY = bandCenterY - totalHeight / 2;
    let blur = blurPx !== null ? blurPx : constrain(fontSize * 0.22, 4, 9);

    pg.fill(255, 255, 255, 255);
    pg.noStroke();
    pg.drawingContext.save();
    pg.drawingContext.filter = `blur(${blur}px)`;
    for (let i = 0; i < lines.length; i++) {
      this.drawSpacedLine(pg, lines[i], centerX, startY + i * lineHeight, letterSpacing);
    }
    pg.drawingContext.filter = 'none';
    pg.drawingContext.restore();

    return this.extractPoints(pg, desiredCount, 0, height, 40);
  }

  /**
   * Genera las coordenadas de la nube viva inicial (Fase A)
   * Distribución armónica y respiratoria alrededor de la zona donde nacerá el texto.
   */
  sampleCloud(layout, desiredCount = 1800) {
    let pts = [];
    let cx = (layout && layout.startX) ? layout.startX : width / 2;
    let cy = (layout && layout.startY) ? (layout.startY + layout.totalHeight * 0.5) : height * 0.40;
    let rx = (layout && layout.maxWidth) ? layout.maxWidth * 0.54 : width * 0.44;
    let ry = (layout && layout.totalHeight) ? max(120, layout.totalHeight * 1.1) : height * 0.28;

    for (let i = 0; i < desiredCount; i++) {
      let angle = random(TWO_PI);
      let rNorm = pow(random(1), 0.72);
      let x = cx + cos(angle) * (rx * rNorm) + random(-25, 25);
      let y = cy + sin(angle) * (ry * rNorm) + random(-22, 22);
      pts.push({ x: x, y: y });
    }
    return pts;
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

    pg.push();
    sc.draw(pg, width, height);
    pg.pop();

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
   * Extrae ~desiredCount coordenadas de píxeles activos (alpha > alphaThreshold)
   * sin introducir distorsiones aleatorias que desdibujen los trazos tipográficos.
   * @param {number} alphaThreshold Umbral mínimo de opacidad (128 por defecto; sampleTextForHuella usa 40)
   */
  extractPoints(pg, desiredCount = 1800, minY = 0, maxY = height, alphaThreshold = 128) {
    pg.loadPixels();
    let yStart = max(0, floor(minY));
    let yEnd = min(height, ceil(maxY));

    let activeCandidates = 0;
    let checkStep = 3;
    for (let y = yStart; y < yEnd; y += checkStep) {
      for (let x = 0; x < width; x += checkStep) {
        let idx = (x + y * width) * 4;
        if (pg.pixels[idx + 3] > alphaThreshold) {
          activeCandidates++;
        }
      }
    }

    let ratio = activeCandidates / desiredCount;
    let sampleStep = max(2, round(checkStep * sqrt(max(0.1, ratio))));
    // Permitir un paso más amplio para textos grandes, para que las partículas cubran todo el texto
    sampleStep = constrain(sampleStep, 2, 7); 

    let points = [];
    for (let y = yStart; y < yEnd; y += sampleStep) {
      for (let x = 0; x < width; x += sampleStep) {
        let idx = (x + y * width) * 4;
        if (pg.pixels[idx + 3] > alphaThreshold) {
          let r = pg.pixels[idx];
          let g = pg.pixels[idx + 1];
          let b = pg.pixels[idx + 2];
          let isHighlight = (r > 200 && g < 100 && b < 100);
          points.push({ x: x, y: y, isHighlight: isHighlight });
        }
      }
    }
    
    // Si aún así tenemos demasiados puntos, los mezclamos y cortamos
    // para que la falta de partículas se distribuya por todo el texto y no solo abajo.
    if (points.length > desiredCount) {
      // Fisher-Yates shuffle
      for (let i = points.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = points[i];
        points[i] = points[j];
        points[j] = temp;
      }
      points = points.slice(0, desiredCount);
    }

    if (points.length > 0 && points.length < desiredCount) {
      let origLen = points.length;
      let diff = desiredCount - origLen;
      for (let i = 0; i < diff; i++) {
        let p = points[i % origLen];
        points.push({ x: p.x, y: p.y });
      }
    }

    if (points.length > desiredCount) {
      points.length = desiredCount;
    }

    points.sort((a, b) => (a.x + a.y * 0.5) - (b.x + b.y * 0.5));

    return points;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TargetSampler;
}
