/**
 * Clase TargetSampler — Muestreador de puntos de destino en canvas offscreen.
 * Rasteriza texto tipográfico y siluetas con densidad adaptable para abastecer
 * el pool fijo de partículas con objetivos espaciales continuos.
 */

class TargetSampler {
  constructor() {
    this.offscreen = null;
  }

  ensureGraphics(w, h) {
    if (!this.offscreen || this.offscreen.width !== w || this.offscreen.height !== h) {
      this.offscreen = createGraphics(w, h);
      this.offscreen.pixelDensity(1);
    }
  }

  /**
   * Muestra puntos a partir de un texto tipográfico
   * @param {string} textString Texto a rasterizar
   * @param {number} desiredCount Cantidad objetivo de partículas
   * @returns {Array<{x: number, y: number}>} Lista de puntos coordenados
   */
  sampleText(textString, desiredCount = 1600) {
    this.ensureGraphics(width, height);
    let pg = this.offscreen;

    pg.clear();
    pg.background(0);
    pg.fill(255);
    pg.noStroke();
    pg.textAlign(CENTER, CENTER);

    // Ajuste dinámico de tamaño de fuente según longitud del texto y pantalla
    let fontSize = width > 1200 ? 76 : (width > 800 ? 54 : 36);
    if (textString.length > 25) {
      fontSize *= 0.72;
    }

    pg.textSize(fontSize);
    pg.textStyle(BOLD);

    // Envolver texto si es necesario
    let lines = this.wrapText(pg, textString, width * 0.78);
    let totalHeight = lines.length * fontSize * 1.25;
    let startY = height / 2 - (totalHeight / 2) + (fontSize * 0.5);

    for (let i = 0; i < lines.length; i++) {
      pg.text(lines[i], width / 2, startY + i * fontSize * 1.25);
    }

    pg.loadPixels();

    // Muestreo adaptable para acercarse al desiredCount
    let sampleStep = max(3, floor(sqrt((width * height) / (desiredCount * 45))));
    let points = [];

    // Escanear píxeles
    for (let y = 0; y < height; y += sampleStep) {
      for (let x = 0; x < width; x += sampleStep) {
        let index = (x + y * width) * 4;
        let r = pg.pixels[index];
        if (r > 128) {
          // Agregar pequeña perturbación sutil para evitar alineación mecánica rígida
          points.push({
            x: x + random(-1.2, 1.2),
            y: y + random(-1.2, 1.2)
          });
        }
      }
    }

    // Ordenar espacialmente para transiciones fluidas y minimizar cruces
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
