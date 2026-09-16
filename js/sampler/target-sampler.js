/**
 * Clase TargetSampler — Muestreador de texto en canvas oculto (p5.Graphics).
 * Renderiza el texto del slide activo y extrae las coordenadas de los píxeles
 * que posean una opacidad (canal alfa) mayor a 128.
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
    pg.textAlign(CENTER, CENTER);

    // Ajuste proporcional del tamaño tipográfico según ancho de pantalla
    let fontSize = width > 1200 ? 76 : (width > 800 ? 52 : 36);
    if (textString.length > 25) {
      fontSize *= 0.75;
    }

    pg.textSize(fontSize);
    pg.textStyle(BOLD);

    // Envolver texto en múltiples líneas si excede el ancho disponible
    let lines = this.wrapText(pg, textString, width * 0.75);
    let lineHeight = fontSize * 1.25;
    let totalHeight = lines.length * lineHeight;
    let startY = height / 2 - (totalHeight / 2) + (fontSize * 0.45);

    for (let i = 0; i < lines.length; i++) {
      pg.text(lines[i], width / 2, startY + i * lineHeight);
    }

    // Cargar píxeles del canvas oculto
    pg.loadPixels();

    // Determinar salto de muestreo para aproximar el desiredCount
    let sampleStep = max(2, floor(sqrt((width * height) / (desiredCount * 40))));
    let points = [];

    // Extraer coordenadas de píxeles con opacidad mayor a 128 (pg.pixels[index + 3] > 128)
    for (let y = 0; y < height; y += sampleStep) {
      for (let x = 0; x < width; x += sampleStep) {
        let index = (x + y * width) * 4;
        let alpha = pg.pixels[index + 3];

        if (alpha > 128) {
          // Agregar sutil variación aleatoria para naturalidad del conjunto
          points.push({
            x: x + random(-1.2, 1.2),
            y: y + random(-1.2, 1.2)
          });
        }
      }
    }

    // Ordenar espacialmente para minimizar cruces en la interpolación física
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
