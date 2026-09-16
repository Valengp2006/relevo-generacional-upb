/**
 * Clase TargetSampler — Muestreador de texto y escultura de palabras en canvas oculto (p5.Graphics).
 * - sampleText: renderiza el titular del slide activo con márgenes superiores para no tapar el HUD.
 * - sampleWordSculpture: escultura de palabras (estilo Plensa) usando siluetas de SCULPTURES como máscara
 *   ('source-in') y baldosando las palabras del guion.
 * - extractPoints: helper compartido que extrae coordenadas {x, y} de los píxeles con opacidad > 128.
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
   * Resetea y limpia el canvas oculto, liberando memoria al redimensionar la ventana.
   */
  reset() {
    if (this.offscreen) {
      this.offscreen.remove();
      this.offscreen = null;
    }
  }

  /**
   * Renderiza el texto del slide en el p5.Graphics oculto y extrae
   * las coordenadas de píxeles con opacidad > 128.
   * @param {string} textString Texto a renderizar
   * @param {number} desiredCount Cantidad objetivo de coordenadas (~1800)
   * @returns {Array<{x: number, y: number}>} Coordenadas extraídas
   */
  sampleText(textString, desiredCount = 1800) {
    this.ensureGraphics(width, height);
    let pg = this.offscreen;

    pg.clear();
    pg.fill(255, 255, 255, 255);
    pg.noStroke();

    // Alineación superior y centrada en X para reservar el tope para la barra de navegación
    pg.textAlign(CENTER, TOP);

    // Tamaño tipográfico proporcional: windowWidth * 0.05 acotado entre 22px y 46px
    let fontSize = constrain(width * 0.05, 22, 46);
    if (textString.length > 22) {
      fontSize *= 0.80;
    }

    pg.textSize(fontSize);
    pg.textStyle(BOLD);

    // Ancho máximo del bloque de texto: 80% del ancho de ventana → sin cortes laterales
    let maxTextWidth = width * 0.8;
    let startX = width / 2;
    let startY = height * 0.35;

    // Salto de línea automático mediante wrapText
    let lines = this.wrapText(pg, textString, maxTextWidth);
    let lineHeight = fontSize * 1.28;

    for (let i = 0; i < lines.length; i++) {
      pg.text(lines[i], startX, startY + i * lineHeight);
    }

    return this.extractPoints(pg, desiredCount);
  }

  /**
   * Extrae coordenadas {x,y} de los píxeles con opacidad > 128
   * del canvas oculto actual. Compartido por sampleText y sampleWordSculpture.
   */
  extractPoints(pg, desiredCount) {
    pg.loadPixels();
    let sampleStep = max(2, floor(sqrt((width * height) / (desiredCount * 42))));
    let points = [];
    for (let y = 0; y < height; y += sampleStep) {
      for (let x = 0; x < width; x += sampleStep) {
        let index = (x + y * width) * 4;
        if (pg.pixels[index + 3] > 128) {
          points.push({ x: x + random(-1.2, 1.2), y: y + random(-1.2, 1.2) });
        }
      }
    }
    points.sort((a, b) => (a.x + a.y * 0.5) - (b.x + b.y * 0.5));
    return points;
  }

  /**
   * Escultura de palabras: usa SCULPTURES[sculptureType] como máscara de silueta
   * y la rellena con las palabras del propio guion (estilo Plensa).
   * @param {string} sculptureType clave de SCULPTURES (ej. "triad_nodes")
   * @param {string} words texto del slide (título + subtítulo, ya concatenados)
   * @param {number} desiredCount cantidad objetivo de partículas (~1800)
   */
  sampleWordSculpture(sculptureType, words, desiredCount = 1800) {
    this.ensureGraphics(width, height);
    let pg = this.offscreen;
    pg.clear();

    // 1) Máscara: la silueta geométrica existente, como puntos rellenos
    pg.push();
    pg.noStroke();
    pg.fill(255);
    let sculptureFn = (typeof SCULPTURES !== 'undefined' && SCULPTURES[sculptureType])
      ? SCULPTURES[sculptureType]
      : (typeof SCULPTURES !== 'undefined' && SCULPTURES.monolith_core ? SCULPTURES.monolith_core : null);

    if (sculptureFn) {
      // 3000 puntos para una silueta nítida sin congelar el hilo de render
      let maskPts = sculptureFn(3000, width, height);
      let dotR = max(3, width * 0.007);
      for (let p of maskPts) {
        pg.circle(p.x, p.y, dotR);
      }
    }
    pg.pop();

    // 2) Las palabras solo sobreviven donde ya hay máscara
    pg.drawingContext.save();
    pg.drawingContext.globalCompositeOperation = 'source-in';

    pg.push();
    pg.fill(255);
    pg.noStroke();
    pg.textStyle(BOLD);
    pg.textAlign(LEFT, TOP);

    let wordList = (words && words.trim().length > 0)
      ? words.split(/\s+/).filter(w => w.length > 0)
      : ['RELEVO'];
    if (wordList.length === 0) wordList = ['RELEVO'];

    let fontSize = constrain(width * 0.026, 14, 30);
    pg.textSize(fontSize);

    let wi = 0;
    // Baldosado simple en filas, con jitter de posición/rotación por palabra
    for (let y = -fontSize; y < height + fontSize; y += fontSize * 1.15) {
      let x = -width * 0.05;
      while (x < width * 1.05) {
        let w = wordList[wi % wordList.length];
        wi++;
        pg.push();
        let jx = random(-fontSize * 0.3, fontSize * 0.3);
        let jy = random(-fontSize * 0.3, fontSize * 0.3);
        pg.translate(x + jx, y + jy);
        pg.rotate(random(-0.12, 0.12));
        pg.text(w, 0, 0);
        pg.pop();
        x += pg.textWidth(w) + fontSize * 0.55;
      }
    }
    pg.pop();
    pg.drawingContext.restore();

    return this.extractPoints(pg, desiredCount);
  }

  wrapText(pg, text, maxWidth) {
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
