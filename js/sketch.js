/**
 * Sketch Principal — Relevo Generacional (Fórum UPB × Future Leaders Forum)
 * Ecosistema visual narrativo continuo en p5.js (Iteración 2):
 * - Pool único continuo de 1,800 partículas vivas que evolucionan a lo largo de los 13 slides.
 * - Escultura generativa como protagonista visual permanente.
 * - Titular editorial con composición espacial adaptativa y Zona de Calma.
 * - Capa institucional superior blindada con logos oficiales.
 * - Navegación fluida por teclado, controles HUD y gestos táctiles.
 */

let particleSystem;
let currentSlideIndex = 0;
let currentLang = CONFIG.defaultLanguage || 'pt';

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  frameRate(CONFIG.canvas.targetFPS || 60);
  pixelDensity(CONFIG.canvas.pixelDensity || 1);

  // Inicializar pool continuo de 1,800 partículas
  particleSystem = new ParticleSystem(CONFIG.particles.count || 1800);

  // Inicializar listeners de teclado y controles HUD
  initKeyboardAndUIListeners();

  // Aplicar estado inicial
  applyState(true);
}

function draw() {
  background(CONFIG.colors.bg);

  // Medir dinámicamente el área del titular editorial para la Zona de Calma
  updateTextBounds();

  // Actualizar física continua y renderizar escultura
  particleSystem.update();
  particleSystem.display();
}

/**
 * Calcula el bounding box del titular en pantalla para repeler sutilmente
 * las partículas y atenuar las líneas de conexión que cruzan sobre las letras.
 */
function updateTextBounds() {
  let titleEl = document.getElementById('slide-title');
  if (titleEl && particleSystem) {
    let rect = titleEl.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      particleSystem.setTextBounds({
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      });
    } else {
      particleSystem.setTextBounds(null);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  applyState(false);
}

/**
 * Aplica el estado del slide activo, actualizando los elementos DOM,
 * composición espacial, fotografía documental y geometría continua.
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

  // 2. Composición espacial del titular editorial
  let mainContent = document.getElementById('main-content');
  if (mainContent) {
    let layoutClass = slide.layout || 'layout-center';
    mainContent.className = `main-content ${layoutClass}`;
  }

  let titleEl = document.getElementById('slide-title');
  if (titleEl) {
    let headline = slide.title[currentLang] || slide.title['pt'];
    if (isSlideChange) {
      titleEl.style.opacity = '0';
      titleEl.style.transform = 'translateY(8px)';
      setTimeout(() => {
        titleEl.textContent = headline;
        titleEl.style.opacity = '1';
        titleEl.style.transform = 'translateY(0)';
      }, 150);
    } else {
      titleEl.textContent = headline;
      titleEl.style.opacity = '1';
      titleEl.style.transform = 'translateY(0)';
    }
  }

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

  // 5. Cálculo y asignación de la geometría escultórica continua
  let sType = slide.sculptureType || 'nucleo';
  let generator = SCULPTURES[sType] || SCULPTURES['nucleo'];

  let opts = {};
  if (slide.edgeProgress !== undefined) {
    opts.edgeProgress = slide.edgeProgress;
  }

  let targets = generator(CONFIG.particles.count, width, height, opts);
  particleSystem.assignSculpture(targets, slide.act, slide.hasPhoto, sType);
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
  let fullBtn = document.getElementById('btn-fullscreen');

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
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
