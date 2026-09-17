/**
 * Sketch Principal — Relevo Generacional (Fórum UPB × Future Leaders Forum)
 * Ciclo principal de p5.js (setup, draw), pool fijo de 1,800 partículas continuas,
 * ciclo de Enjambre Vivo al inicio de cada slide, metamorfosis a escultura con tecla T,
 * y sombra tipográfica legible de las letras mientras la escultura está viva.
 */

let particleSystem;
let sampler;
let currentSlideIndex = 0;
let currentMode = CONFIG.modes.TEXT;
let currentLang = CONFIG.defaultLanguage;

// Control de opacidad para la sombra legible de las letras durante la escultura
let ghostTextAlpha = 0;
let targetGhostAlpha = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  frameRate(CONFIG.canvas.targetFPS);
  pixelDensity(CONFIG.canvas.pixelDensity);

  // Inicializar el pool continuo fijo de 1,800 partículas
  particleSystem = new ParticleSystem(CONFIG.particles.count);
  sampler = new TargetSampler();

  // Inicializar listeners de teclado y controles
  initKeyboardAndUIListeners();

  // Al inicio, el sistema arranca como un sistema vivo que se transforma en letras
  particleSystem.burstSwarm();
  applyState(true);
}

function draw() {
  background(CONFIG.colors.bg);

  // 1. Sombra legible de las letras que permanece mientras la escultura cobra vida
  ghostTextAlpha = lerp(ghostTextAlpha, targetGhostAlpha, 0.07);
  drawGhostText();

  // 2. Actualizar partículas (cinemática seek & arrive) y renderizar
  particleSystem.update();
  particleSystem.display();
}

/**
 * Renderiza la sombra tipográfica legible de las letras en el fondo
 * cuando la escultura está activa, permitiendo leer el título del slide.
 */
function drawGhostText() {
  if (ghostTextAlpha <= 1 || !sampler || !sampler.lastTextLayout) return;
  let layout = sampler.lastTextLayout;

  push();
  textAlign(CENTER, TOP);
  textSize(layout.fontSize);
  textStyle(BOLD);
  textFont('Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');

  // Sombra suave de contraste sobre el fondo oscuro
  drawingContext.save();
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.85)';
  drawingContext.shadowBlur = 14;

  // Tipografía semitransparente pero nítida y perfectamente legible
  fill(241, 245, 249, ghostTextAlpha);
  stroke(148, 163, 184, ghostTextAlpha * 0.45);
  strokeWeight(1.0);

  for (let i = 0; i < layout.lines.length; i++) {
    text(layout.lines[i], layout.startX, layout.startY + i * layout.lineHeight);
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
 * Aplica el estado del slide activo, actualizando la capa DOM
 * y reasignando los objetivos de las partículas de forma bidireccional.
 */
function applyState(isSlideChange = false) {
  let slide = SLIDES_DATA[currentSlideIndex];
  if (!slide) return;

  // 1. Actualizar textos de la interfaz HUD
  document.getElementById('act-label').textContent = slide.actTitle[currentLang];
  document.getElementById('slide-counter').textContent = `Slide ${String(slide.id).padStart(2, '0')} / ${String(SLIDES_DATA.length).padStart(2, '0')}`;

  let sub = slide.subtitle ? slide.subtitle[currentLang] : '';
  let narr = slide.narrative ? slide.narrative[currentLang] : '';
  let narrativeBox = document.querySelector('.narrative-container');
  document.getElementById('slide-subtitle').textContent = sub;
  document.getElementById('slide-narrative').textContent = narr;
  if (narrativeBox) {
    narrativeBox.style.display = ((!sub || sub.trim() === '') && (!narr || narr.trim() === '')) ? 'none' : 'block';
  }

  // 2. Estado del botón de modo Texto / Escultura
  let toggleBtn = document.getElementById('btn-toggle-mode');
  let toggleLabel = document.getElementById('toggle-label');
  let toggleIcon = document.getElementById('toggle-icon');

  if (currentMode === CONFIG.modes.TEXT) {
    toggleBtn.classList.remove('mode-sculpture');
    toggleLabel.textContent = 'Ver Escultura';
    toggleIcon.textContent = '✦';
    targetGhostAlpha = 0; // En modo texto las partículas son las letras
  } else {
    toggleBtn.classList.add('mode-sculpture');
    toggleLabel.textContent = 'Ver Texto';
    toggleIcon.textContent = '🔤';
    targetGhostAlpha = 72; // En modo escultura la sombra de las letras permanece legible
  }

  // 3. Capa Documental: presencia de fotografía institucional (hasPhoto)
  let docLayer = document.getElementById('documentary-layer');
  let photoImg = document.getElementById('documentary-photo');
  let placeholder = document.getElementById('documentary-placeholder');
  let caption = document.getElementById('photo-caption');

  if (slide.hasPhoto) {
    docLayer.classList.add('active');
    let capText = (slide.photoCaption && slide.photoCaption[currentLang]) ? slide.photoCaption[currentLang] : '';
    caption.textContent = capText;
    caption.style.display = capText ? 'block' : 'none';

    if (slide.photoUrl) {
      photoImg.onload = function() {
        photoImg.style.display = 'block';
        placeholder.style.display = 'none';
      };
      photoImg.onerror = function() {
        photoImg.style.display = 'none';
        placeholder.style.display = 'block';
      };
      photoImg.src = slide.photoUrl;
    } else {
      photoImg.style.display = 'none';
      placeholder.style.display = 'block';
    }
  } else {
    docLayer.classList.remove('active');
  }

  // 4. Muestreo de objetivos para las partículas
  let targets = [];
  let headline = slide.title[currentLang];

  if (currentMode === CONFIG.modes.TEXT) {
    // Modo Texto: las partículas forman el titular nítido
    targets = sampler.sampleText(headline, CONFIG.particles.count);
  } else {
    // Modo Escultura: aseguramos que el layout de las letras esté memorizado para la sombra
    if (!sampler.lastTextLayout) {
      sampler.sampleText(headline, CONFIG.particles.count);
    }

    // Escultura de palabras tridimensional estilo Jaume Plensa
    let sType = (slide.sculptureType && SCULPTURES[slide.sculptureType])
      ? slide.sculptureType
      : 'monolith_core';
    let words = [slide.title[currentLang], slide.subtitle[currentLang], slide.narrative[currentLang]]
      .filter(t => t && t.length > 0)
      .join(' ');
    targets = sampler.sampleWordSculpture(sType, words, CONFIG.particles.count);
  }

  // 5. Asignar los objetivos al pool continuo
  particleSystem.assignTargets(targets, slide.act, slide.hasPhoto, slide.photoPosition, currentMode);
}

/**
 * Controladores de Navegación y Modos
 */
function nextSlide() {
  if (currentSlideIndex < SLIDES_DATA.length - 1) {
    currentSlideIndex++;
    // Cada slide comienza en modo texto con las partículas como sistema vivo
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

function toggleMode() {
  // Alternar entre modo Texto y modo Escultura
  currentMode = (currentMode === CONFIG.modes.TEXT) ? CONFIG.modes.SCULPTURE : CONFIG.modes.TEXT;
  applyState(false);
}

function setLanguage(lang) {
  if (CONFIG.languages.includes(lang)) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    // Forzar recalcular el texto en el nuevo idioma
    if (sampler) sampler.lastTextLayout = null;
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
  document.getElementById('btn-prev').addEventListener('click', prevSlide);
  document.getElementById('btn-next').addEventListener('click', nextSlide);
  document.getElementById('btn-toggle-mode').addEventListener('click', toggleMode);
  document.getElementById('btn-fullscreen').addEventListener('click', toggleFullscreen);

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
