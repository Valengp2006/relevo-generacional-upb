/**
 * Sketch Principal — Relevo Generacional (Fórum UPB × Future Leaders Forum)
 * Sistema generativo interactivo continuo:
 * - Ciclo 100% de partículas vivas:
 *   1. Al entrar a un slide, el texto nace como una Nube de partículas viva y orgánica (Fase A).
 *   2. Gradualmente las partículas se organizan hacia los trazos tipográficos (Fase B).
 *   3. El texto queda formado y consolidado con respiración sutil continua, sin vibraciones (Fase C/D).
 *   4. Al pulsar 'T' o el botón HUD: 1,440 partículas componen la escultura generativa y
 *      360 partículas forman la huella/sombra residual sobre el texto, garantizando legibilidad.
 * - Cero texto plano 2D ni sombras CSS; 100% partículas vivas en todo el ecosistema.
 * - Navegación fluida por teclado, controles HUD y gestos táctiles.
 */

let particleSystem;
let sampler;
let currentSlideIndex = 0;
let currentMode = CONFIG.modes.TEXT;
let currentLang = CONFIG.defaultLanguage || 'pt';
let slidePhaseTimer = 0.0;
let isPresentationMode = false;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  frameRate(CONFIG.canvas.targetFPS || 60);
  pixelDensity(CONFIG.canvas.pixelDensity || 1);

  // Inicializar el pool continuo de 1,800 partículas y el muestreador tipográfico
  particleSystem = new ParticleSystem(CONFIG.particles.count || 1800);
  sampler = new TargetSampler();

  // Inicializar listeners de teclado, HUD y gestos
  initKeyboardAndUIListeners();

  // Iniciar la experiencia en el primer slide
  applyState(true);
}

function draw() {
  background(CONFIG.colors.bg);

  // Evolución temporal de fases en modo TEXTO:
  // Fase A (Nube viva): 0.0s a 1.8s
  // Fase B (Organización): 1.8s a 3.5s
  // Fase C/D (Texto consolidado respirando): 3.5s en adelante
  if (currentMode === CONFIG.modes.TEXT) {
    let dt = deltaTime / 1000.0;
    slidePhaseTimer += dt;

    if (slidePhaseTimer < 1.8) {
      if (particleSystem.currentPhase !== 'TEXT_CLOUD') {
        particleSystem.setPhase('TEXT_CLOUD');
      }
    } else if (slidePhaseTimer < 3.5) {
      if (particleSystem.currentPhase !== 'TEXT_ORGANIZING') {
        particleSystem.setPhase('TEXT_ORGANIZING');
      }
    } else {
      if (particleSystem.currentPhase !== 'TEXT_FORMED') {
        particleSystem.setPhase('TEXT_FORMED');
      }
    }
  }

  // Actualizar e ilustrar el ecosistema continuo de partículas y conexiones
  particleSystem.update();
  particleSystem.display();
}

function windowResized() {
  if (sampler) {
    sampler.reset();
  }
  resizeCanvas(windowWidth, windowHeight);
  applyState(false);
}

/**
 * Aplica el estado del slide activo, sincronizando los textos DOM,
 * fotografía documental y objetivos del sistema de partículas.
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

  // 2. Subtítulo y texto narrativo inferior
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

  // 3. Capa Documental: fotografía institucional (hasPhoto)
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

  // 4. Muestreo de objetivos para las partículas (Texto, Nube y Escultura)
  let headline = slide.title[currentLang] || slide.title['pt'];
  let textTargets = sampler.sampleText(headline, CONFIG.particles.count, slide.hasPhoto);
  let cloudTargets = sampler.sampleCloud(sampler.lastTextLayout, CONFIG.particles.count);

  let sType = slide.sculptureType || 'nucleo';
  let generator = SCULPTURES[sType] || SCULPTURES['nucleo'];
  let opts = {};
  if (slide.edgeProgress !== undefined) {
    opts.edgeProgress = slide.edgeProgress;
  }
  let sculptureTargets = generator(CONFIG.particles.count, width, height, opts);

  // 5. Límites de la huella del texto para la Zona de Calma en escultura
  let textBounds = null;
  if (sampler && sampler.lastTextLayout) {
    let layout = sampler.lastTextLayout;
    let textW = layout.maxWidth || (width * 0.82);
    let cx = layout.startX || width / 2;
    textBounds = {
      left: cx - textW / 2,
      right: cx + textW / 2,
      top: layout.startY - 15,
      bottom: layout.startY + layout.totalHeight + 15,
      width: textW,
      height: layout.totalHeight + 30
    };
  }

  let targetsData = {
    textTargets: textTargets,
    cloudTargets: cloudTargets,
    sculptureTargets: sculptureTargets,
    act: slide.act,
    hasPhoto: slide.hasPhoto,
    sculptureType: sType,
    textBounds: textBounds
  };

  // 6. Aplicar la secuencia al pool continuo sin crear/destruir objetos
  if (isSlideChange) {
    currentMode = CONFIG.modes.TEXT;
    slidePhaseTimer = 0.0;
    particleSystem.startSlideSequence(targetsData);
  } else {
    particleSystem.setTargets(targetsData);
    if (currentMode === CONFIG.modes.TEXT) {
      slidePhaseTimer = 1.4; // Reorganización suave al cambiar idioma
      particleSystem.setPhase('TEXT_ORGANIZING');
    } else {
      particleSystem.setPhase('SCULPTURE_ACTIVE');
    }
  }

  updateToggleButtonUI();
}

/**
 * Actualiza el texto, icono y estilo del botón Toggle en el HUD
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
 * Alterna bidireccionalmente entre modo Texto y modo Escultura
 */
function toggleMode() {
  if (currentMode === CONFIG.modes.TEXT) {
    currentMode = CONFIG.modes.SCULPTURE;
    particleSystem.currentMode = 'sculpture';
    particleSystem.setPhase('SCULPTURE_ACTIVE');
  } else {
    currentMode = CONFIG.modes.TEXT;
    particleSystem.currentMode = 'text';
    slidePhaseTimer = 4.0; // Pasa inmediatamente al texto consolidado
    particleSystem.setPhase('TEXT_FORMED');
  }
  updateToggleButtonUI();
}

/**
 * Controladores de Navegación e Idioma
 */
function nextSlide() {
  if (currentSlideIndex < SLIDES_DATA.length - 1) {
    currentSlideIndex++;
    applyState(true);
  }
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
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
 * Alterna el Modo Apresentação: oculta todos los controles de la interfaz
 * excepto las teclas para cambiar de diapositiva.
 */
function togglePresentationMode(forceState) {
  if (forceState !== undefined) {
    isPresentationMode = forceState;
  } else {
    isPresentationMode = !isPresentationMode;
  }

  let overlay = document.getElementById('ui-overlay');
  if (overlay) {
    overlay.classList.toggle('presentation-mode', isPresentationMode);
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
    } else if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      togglePresentationMode();
    } else if (e.key === 'Escape') {
      if (isPresentationMode) {
        e.preventDefault();
        togglePresentationMode(false);
      }
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
  let presBtn = document.getElementById('btn-presentation-mode');
  let exitPresBtn = document.getElementById('btn-exit-presentation');

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (toggleBtn) toggleBtn.addEventListener('click', toggleMode);
  if (fullBtn) fullBtn.addEventListener('click', toggleFullscreen);
  if (presBtn) presBtn.addEventListener('click', () => togglePresentationMode());
  if (exitPresBtn) exitPresBtn.addEventListener('click', () => togglePresentationMode(false));

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      setLanguage(e.target.getAttribute('data-lang'));
    });
  });

  // Soporte gestual táctil
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
