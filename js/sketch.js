/**
 * Sketch Principal — Relevo Generacional
 * Orquestador del canvas p5.js, máquina de estados, transiciones bidireccionales
 * e integración entre la capa de interfaz HUD y el sistema de partículas.
 */

let particleSystem;
let sampler;
let currentSlideIndex = 0;
let currentMode = CONFIG.modes.TEXT;
let currentLang = CONFIG.defaultLanguage;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  frameRate(CONFIG.canvas.targetFPS);
  pixelDensity(CONFIG.canvas.pixelDensity);

  // Inicializar componentes del motor generativo
  particleSystem = new ParticleSystem(CONFIG.particles.count);
  sampler = new TargetSampler();

  // Configurar listeners e interacción DOM
  initUIListeners();

  // Aplicar estado inicial
  applyState();
}

function draw() {
  background(CONFIG.colors.bg);

  // Actualizar e ilustrar el sistema de partículas continuo
  particleSystem.update();
  particleSystem.display();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Re-muestrear objetivos adaptados al nuevo tamaño de pantalla
  applyState();
}

/**
 * Aplica el estado actual del slide, actualizando la capa visual DOM
 * y calculando los nuevos objetivos para las partículas sin resetear la simulación.
 */
function applyState() {
  let slide = SLIDES_DATA[currentSlideIndex];
  if (!slide) return;

  // 1. Actualizar información de la diapositiva en el HUD
  document.getElementById('act-label').textContent = slide.actTitle[currentLang];
  document.getElementById('slide-counter').textContent = `Slide ${String(slide.id).padStart(2, '0')} / ${SLIDES_DATA.length}`;
  document.getElementById('slide-subtitle').textContent = slide.subtitle[currentLang];
  document.getElementById('slide-narrative').textContent = slide.narrative[currentLang];

  // 2. Control del botón de modo Texto / Escultura
  let toggleBtn = document.getElementById('btn-toggle-mode');
  let toggleLabel = document.getElementById('toggle-label');
  let toggleIcon = document.getElementById('toggle-icon');

  if (currentMode === CONFIG.modes.TEXT) {
    toggleBtn.classList.remove('mode-sculpture');
    toggleLabel.textContent = 'Ver Escultura';
    toggleIcon.textContent = '✦';
  } else {
    toggleBtn.classList.add('mode-sculpture');
    toggleLabel.textContent = 'Ver Texto';
    toggleIcon.textContent = '🔤';
  }

  // 3. Capa Documental: gestión de fotografía institucional
  let docLayer = document.getElementById('documentary-layer');
  let photoImg = document.getElementById('documentary-photo');
  let placeholder = document.getElementById('documentary-placeholder');
  let caption = document.getElementById('photo-caption');

  if (slide.hasPhoto) {
    docLayer.classList.add('active');
    caption.textContent = slide.photoCaption ? slide.photoCaption[currentLang] : '';

    if (slide.photoUrl) {
      // Intentar cargar imagen; si aún no existe el archivo se mantiene el placeholder elegante
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

  if (currentMode === CONFIG.modes.TEXT) {
    let headline = slide.title[currentLang];
    targets = sampler.sampleText(headline, CONFIG.particles.count);
  } else {
    let sculptureFn = SCULPTURES[slide.sculptureType] || SCULPTURES.monolith_core;
    targets = sculptureFn(CONFIG.particles.count, width, height);
  }

  // 5. Asignar los objetivos al pool continuo
  particleSystem.assignTargets(targets, slide.act, slide.hasPhoto, slide.photoPosition);
}

/**
 * Controladores de Navegación Bidireccional
 */
function nextSlide() {
  if (currentSlideIndex < SLIDES_DATA.length - 1) {
    currentSlideIndex++;
    applyState();
  }
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    applyState();
  }
}

function toggleMode() {
  currentMode = (currentMode === CONFIG.modes.TEXT) ? CONFIG.modes.SCULPTURE : CONFIG.modes.TEXT;
  applyState();
}

function setLanguage(lang) {
  if (CONFIG.languages.includes(lang)) {
    currentLang = lang;
    
    // Actualizar botones de idioma en el DOM
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    applyState();
  }
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
 * Vinculación de Eventos del DOM, Teclado y Gestos Táctiles
 */
function initUIListeners() {
  // Botones de interfaz
  document.getElementById('btn-prev').addEventListener('click', prevSlide);
  document.getElementById('btn-next').addEventListener('click', nextSlide);
  document.getElementById('btn-toggle-mode').addEventListener('click', toggleMode);
  document.getElementById('btn-fullscreen').addEventListener('click', toggleFullscreen);

  // Selector de idiomas
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      setLanguage(e.target.getAttribute('data-lang'));
    });
  });

  // Atajos de Teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 't' || e.key === 'T') {
      toggleMode();
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    } else if (e.key === 'l' || e.key === 'L') {
      // Ciclar entre idiomas
      let nextIndex = (CONFIG.languages.indexOf(currentLang) + 1) % CONFIG.languages.length;
      setLanguage(CONFIG.languages[nextIndex]);
    }
  });

  // Soporte para gestos táctiles (Swipe en tablets y móviles)
  let touchStartX = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  window.addEventListener('touchend', (e) => {
    let touchEndX = e.changedTouches[0].screenX;
    let diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }, false);
}
