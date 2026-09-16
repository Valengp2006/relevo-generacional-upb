/**
 * Sketch Principal — Relevo Generacional (Fórum UPB × Future Leaders Forum)
 * Ciclo principal de p5.js (setup, draw), pool fijo de 1,800 partículas continuas
 * y listeners de teclado para navegación y control de estados.
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

  // Inicializar el pool continuo fijo de 1,800 partículas
  particleSystem = new ParticleSystem(CONFIG.particles.count);
  sampler = new TargetSampler();

  // Inicializar listeners de teclado y controles
  initKeyboardAndUIListeners();

  // Aplicar el estado del primer slide
  applyState();
}

function draw() {
  background(CONFIG.colors.bg);

  // Actualizar partículas (física seek & arrive hacia objetivos) y renderizar
  particleSystem.update();
  particleSystem.display();
}

function windowResized() {
  // 1. Liberar el canvas offscreen obsoleto antes de redimensionar
  //    para que el siguiente sampleText() cree uno nuevo con las dimensiones correctas.
  if (sampler) {
    sampler.reset();
  }
  // 2. Ajustar el canvas principal al nuevo tamaño de ventana
  resizeCanvas(windowWidth, windowHeight);
  // 3. Recalcular y reasignar los objetivos de las partículas
  applyState();
}

/**
 * Aplica el estado del slide activo, actualizando la capa DOM
 * y reasignando los objetivos de las partículas de forma bidireccional.
 */
function applyState() {
  let slide = SLIDES_DATA[currentSlideIndex];
  if (!slide) return;

  // 1. Actualizar textos de la interfaz HUD
  document.getElementById('act-label').textContent = slide.actTitle[currentLang];
  document.getElementById('slide-counter').textContent = `Slide ${String(slide.id).padStart(2, '0')} / ${String(SLIDES_DATA.length).padStart(2, '0')}`;
  document.getElementById('slide-subtitle').textContent = slide.subtitle[currentLang];
  document.getElementById('slide-narrative').textContent = slide.narrative[currentLang];

  // 2. Estado del botón de modo Texto / Escultura
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

  // 3. Capa Documental: presencia de fotografía institucional (hasPhoto)
  let docLayer = document.getElementById('documentary-layer');
  let photoImg = document.getElementById('documentary-photo');
  let placeholder = document.getElementById('documentary-placeholder');
  let caption = document.getElementById('photo-caption');

  if (slide.hasPhoto) {
    docLayer.classList.add('active');
    caption.textContent = slide.photoCaption ? slide.photoCaption[currentLang] : '';

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

  if (currentMode === CONFIG.modes.TEXT) {
    // Renderizado offscreen y muestreo de píxeles con opacidad > 128
    let headline = slide.title[currentLang];
    targets = sampler.sampleText(headline, CONFIG.particles.count);
  } else {
    // Generación geométrica paramétrica de esculturas
    let sculptureFn = SCULPTURES[slide.sculptureType] || SCULPTURES.monolith_core;
    targets = sculptureFn(CONFIG.particles.count, width, height);
  }

  // 5. Asignar los objetivos al pool continuo (con seek y arrive activo)
  particleSystem.assignTargets(targets, slide.act, slide.hasPhoto, slide.photoPosition);
}

/**
 * Controladores de Navegación y Modos
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
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    applyState();
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
  // Listeners de teclado solicitados:
  // - Space / ArrowRight: avanzar
  // - ArrowLeft: retroceder
  // - T / t: toggle manual (Texto <-> Escultura)
  // - L / l: cambiar de idioma (PT -> ES -> EN)
  // - F / f: pantalla completa
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
