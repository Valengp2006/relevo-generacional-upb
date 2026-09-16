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
