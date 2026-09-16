/**
 * Clase TargetSampler — Muestreador de texto en canvas oculto (p5.Graphics).
 * Renderiza el texto del slide activo y extrae las coordenadas de los píxeles
 * con opacidad mayor a 128.
 * 
 * Configuración de Layout:
 * - textAlign(CENTER, TOP) para evitar solapamiento con la barra superior.
 * - Desplazamiento en Y (height * 0.35) que reserva el espacio para logos e indicadores.
 * - Tamaño de texto proporcional (width * 0.048 acotado) con ajuste responsivo.
 * - Ancho máximo (width * 0.8) con salto de línea automático para evitar cortes laterales.
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
    // Posición X centrada
    let startX = width / 2;
    // Eje Y desplazado a height * 0.35 para dejar espacio libre a la barra superior
    let startY = height * 0.35;

    // Salto de línea automático mediante wrapText
    let lines = this.wrapText(pg, textString, maxTextWidth);
    let lineHeight = fontSize * 1.28;

    for (let i = 0; i < lines.length; i++) {
      pg.text(lines[i], startX, startY + i * lineHeight);
    }

    // Cargar píxeles del canvas oculto
    pg.loadPixels();

    // Muestreo adaptable para extraer coordenadas con opacidad > 128
    let sampleStep = max(2, floor(sqrt((width * height) / (desiredCount * 42))));
    let points = [];

    for (let y = 0; y < height; y += sampleStep) {
      for (let x = 0; x < width; x += sampleStep) {
        let index = (x + y * width) * 4;
        let alpha = pg.pixels[index + 3];

        if (alpha > 128) {
          points.push({
            x: x + random(-1.2, 1.2),
            y: y + random(-1.2, 1.2)
          });
        }
      }
    }

    // Ordenamiento espacial para interpolación suave y sin cruces
    points.sort((a, b) => (a.x + a.y * 0.5) - (b.x + b.y * 0.5));

    return points;
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

// --- añadir dentro de la clase TargetSampler ---

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
    let maskPts = SCULPTURES[sculptureType](6000, width, height);
    let dotR = max(3, width * 0.006);
    for (let p of maskPts) pg.circle(p.x, p.y, dotR);
    pg.pop();

    // 2) Las palabras solo sobreviven donde ya hay máscara
    pg.drawingContext.save();
    pg.drawingContext.globalCompositeOperation = 'source-in';

    pg.push();
    pg.fill(255);
    pg.noStroke();
    pg.textStyle(BOLD);
    pg.textAlign(LEFT, TOP);

    let wordList = words.split(' ').filter(w => w.length > 0);
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
