/**
 * Sketch Principal — Relevo Generacional (Fórum UPB × Future Leaders Forum)
 * Sistema generativo interactivo dual:
 * - Modo TEXTO: 1,800 partículas vivas que inician como enjambre orgánico y
 *   se condensan en letras sólidas de alta legibilidad sin vibraciones.
 * - Modo ESCULTURA (Tecla T / Botón): Metamorfosis continua hacia las 13 esculturas
 *   paramétricas, dejando una sombra del texto perfectamente nítida y legible.
 * - Capa institucional superior blindada con logos oficiales.
 * - Navegación fluida por teclado, controles HUD y gestos táctiles.
 */

let particleSystem;
let sampler;
let currentSlideIndex = 0;
let currentMode = CONFIG.modes.TEXT;
let currentLang = CONFIG.defaultLanguage || 'pt';

// Control de opacidad para la sombra legible de las letras durante la escultura
let ghostTextAlpha = 0;
let targetGhostAlpha = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  frameRate(CONFIG.canvas.targetFPS || 60);
  pixelDensity(CONFIG.canvas.pixelDensity || 1);

  // Inicializar pool continuo de 1,800 partículas y muestreador tipográfico
  particleSystem = new ParticleSystem(CONFIG.particles.count || 1800);
  sampler = new TargetSampler();

  // Inicializar listeners de teclado y controles HUD
  initKeyboardAndUIListeners();

  // Iniciar en modo texto con enjambre vivo
  particleSystem.burstSwarm();
  applyState(true);
}

function draw() {
  background(CONFIG.colors.bg);

  // 1. Sombra legible de las letras que emerge y permanece mientras la escultura vive
  ghostTextAlpha = lerp(ghostTextAlpha, targetGhostAlpha, 0.08);
  drawGhostText();

  // 2. Actualizar partículas y conexiones
  particleSystem.update();
  particleSystem.display();
}

/**
 * Renderiza la sombra tipográfica legible de las letras en el fondo
 * cuando la escultura está activa, garantizando que el titular siga siendo
 * 100% legible con alto contraste mientras la escultura anima al frente.
 */
function drawGhostText() {
  if (ghostTextAlpha <= 1 || !sampler || !sampler.lastTextLayout) return;
  let layout = sampler.lastTextLayout;

  push();
  textSize(layout.fontSize);
  textStyle(BOLD);
  textFont('Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');

  drawingContext.save();
  // Sombra profunda de contraste para aislar el texto de las partículas de la escultura
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.95)';
  drawingContext.shadowBlur = 24;
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 4;

  // Trazo oscuro suave de protección para recortar las letras sobre la escena
  stroke(8, 11, 16, ghostTextAlpha * 0.85);
  strokeWeight(max(2.6, layout.fontSize * 0.055));

  // Relleno tipográfico nítido y luminoso
  fill(248, 250, 252, ghostTextAlpha);

  let spacing = layout.letterSpacing || 4.2;
  for (let i = 0; i < layout.lines.length; i++) {
    sampler.drawSpacedLine(window, layout.lines[i], width / 2, layout.startY + i * layout.lineHeight, spacing);
  }
  drawingContext.restore();
  pop();
}

function windowResized() {
  if (sampler) {
    sampler.reset();
  }
  resizeCanvas(windowWidth, windowHeight);
  applyState(false);
}

/**
 * Aplica el estado del slide activo, actualizando los elementos DOM,
 * fotografía documental, objetivos de partículas y layout de la sombra de texto.
 */
function applyState(isSlideChange = false) {
  let slide = SLIDES_DATA[currentSlideIndex];
  if (!slide) return;

  // 1. Actualizar textos de la interfaz HUD superior
  let actEl = document.getElementById('act-label');
  if (actEl) actEl.textContent = slide.actTitle[currentLang] || slide.actTitle['pt'];

  let counterEl = document.getElementById('slide-counter');
  if (counterEl) {
    counterEl.textContent = `Slide ${String(slide.id).padStart(2, '0')} / ${String(SLIDES_DATA.length).padStart(2, '0')}`;
  }

  // 2. Actualizar estado visual del botón Toggle en HUD
  updateToggleButtonUI();

  // 3. Subtítulo y texto narrativo inferior
  let sub = slide.subtitle ? (slide.subtitle[currentLang] || '') : '';
  let narr = slide.narrative ? (slide.narrative[currentLang] || '') : '';
  let narrativeBox = document.querySelector('.narrative-container');
  let subEl = document.getElementById('slide-subtitle');
  let narrEl = document.getElementById('slide-narrative');

  if (subEl) subEl.textContent = sub;
  if (narrEl) narrEl.textContent = narr;
  if (narrativeBox) {
    narrativeBox.style.display = ((!sub || sub.trim() === '') && (!narr || narr.trim() === '')) ? 'none' : 'block';
  }

  // 4. Capa Documental: presencia de fotografía institucional (hasPhoto)
  let docLayer = document.getElementById('documentary-layer');
  let photoImg = document.getElementById('documentary-photo');
  let placeholder = document.getElementById('documentary-placeholder');
  let caption = document.getElementById('photo-caption');

  if (docLayer) {
    if (slide.hasPhoto) {
      docLayer.classList.add('active');
      let capText = (slide.photoCaption && slide.photoCaption[currentLang]) ? slide.photoCaption[currentLang] : '';
      if (caption) {
        caption.textContent = capText;
        caption.style.display = capText ? 'block' : 'none';
      }

      if (slide.photoUrl && photoImg) {
        photoImg.onload = function() {
          photoImg.style.display = 'block';
          if (placeholder) placeholder.style.display = 'none';
        };
        photoImg.onerror = function() {
          photoImg.style.display = 'none';
          if (placeholder) placeholder.style.display = 'block';
        };
        photoImg.src = slide.photoUrl;
      } else {
        if (photoImg) photoImg.style.display = 'none';
        if (placeholder) placeholder.style.display = 'block';
      }
    } else {
      docLayer.classList.remove('active');
    }
  }

  // 5. Muestreo de objetivos para las partículas
  let headline = slide.title[currentLang] || slide.title['pt'];
  // Se calcula siempre el layout tipográfico para asegurar la sombra en modo escultura
  let textTargets = sampler.sampleText(headline, CONFIG.particles.count);

  let targets = [];
  let sType = slide.sculptureType || 'nucleo';

  if (currentMode === CONFIG.modes.TEXT) {
    targets = textTargets;
    targetGhostAlpha = 0; // En modo texto las partículas son las letras
  } else {
    // Modo Escultura
    let generator = SCULPTURES[sType] || SCULPTURES['nucleo'];
    let opts = {};
    if (slide.edgeProgress !== undefined) {
      opts.edgeProgress = slide.edgeProgress;
    }
    targets = generator(CONFIG.particles.count, width, height, opts);
    targetGhostAlpha = 210; // En modo escultura la sombra de las letras permanece nítida y legible
  }

  // 6. Actualizar Zona de Calma desde el layout del texto para cuando la escultura está activa
  if (sampler && sampler.lastTextLayout) {
    let layout = sampler.lastTextLayout;
    let textW = layout.maxWidth || (width * 0.82);
    particleSystem.setTextBounds({
      left: width / 2 - textW / 2,
      right: width / 2 + textW / 2,
      top: layout.startY - 15,
      bottom: layout.startY + layout.totalHeight + 15,
      width: textW,
      height: layout.totalHeight + 30
    });
  }

  // 7. Asignar los objetivos al pool continuo sin resets
  particleSystem.assignTargets(targets, slide.act, slide.hasPhoto, currentMode, sType);
}

/**
 * Actualiza el texto, icono y clase activa del botón Toggle en el HUD
 */
function updateToggleButtonUI() {
  let toggleBtn = document.getElementById('btn-toggle-mode');
  let toggleLabel = document.getElementById('toggle-label');
  let toggleIcon = document.getElementById('toggle-icon');

  if (!toggleBtn) return;

  if (currentMode === CONFIG.modes.TEXT) {
    toggleBtn.classList.remove('mode-sculpture');
    if (toggleLabel) toggleLabel.textContent = 'Ver Escultura';
    if (toggleIcon) toggleIcon.textContent = '✦';
  } else {
    toggleBtn.classList.add('mode-sculpture');
    if (toggleLabel) toggleLabel.textContent = 'Ver Texto';
    if (toggleIcon) toggleIcon.textContent = '🔤';
  }
}

/**
 * Alterna manualmente entre modo Texto y modo Escultura
 */
function toggleMode() {
  currentMode = (currentMode === CONFIG.modes.TEXT) ? CONFIG.modes.SCULPTURE : CONFIG.modes.TEXT;
  applyState(false);
}

/**
 * Controladores de Navegación e Idioma
 */
function nextSlide() {
  if (currentSlideIndex < SLIDES_DATA.length - 1) {
    currentSlideIndex++;
    // Cada slide nuevo arranca en modo texto con enjambre vivo que se condensa en letras
    currentMode = CONFIG.modes.TEXT;
    particleSystem.burstSwarm();
    applyState(true);
  }
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    currentMode = CONFIG.modes.TEXT;
    particleSystem.burstSwarm();
    applyState(true);
  }
}

function setLanguage(lang) {
  if (CONFIG.languages.includes(lang)) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    if (sampler) sampler.reset();
    applyState(false);
  }
}

function cycleLanguage() {
  let currentIndex = CONFIG.languages.indexOf(currentLang);
  let nextIndex = (currentIndex + 1) % CONFIG.languages.length;
  setLanguage(CONFIG.languages[nextIndex]);
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

/**
 * Configuración de Listeners de Teclado, Clic y Táctil
 */
function initKeyboardAndUIListeners() {
  window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      toggleMode();
    } else if (e.key === 'l' || e.key === 'L') {
      e.preventDefault();
      cycleLanguage();
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      toggleFullscreen();
    }
  });

  // Botones de interfaz HUD
  let prevBtn = document.getElementById('btn-prev');
  let nextBtn = document.getElementById('btn-next');
  let toggleBtn = document.getElementById('btn-toggle-mode');
  let fullBtn = document.getElementById('btn-fullscreen');

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (toggleBtn) toggleBtn.addEventListener('click', toggleMode);
  if (fullBtn) fullBtn.addEventListener('click', toggleFullscreen);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      setLanguage(e.target.getAttribute('data-lang'));
    });
  });

  // Soporte gestual táctil para dispositivos móviles y pantallas interactivas
  let touchStartX = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  window.addEventListener('touchend', (e) => {
    let diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }, false);
}
