/**
 * Sketch Principal — Relevo Generacional (Fórum UPB × Future Leaders Forum)
 *
 * NUEVA ARQUITECTURA (fusión partícula → DOM):
 * - Fase A/B: nube y organización de partículas (igual que antes).
 * - Fase C: texto formado con partículas (breve, ~0.8s), luego se desvanece
 *   a la vez que aparece el <h1 class="slide-title"> real — cross-fade.
 * - Escultura: al presionar T, el titular DOM se apaga, TODAS las partículas
 *   reaparecen viajando a la figura, y la sombra aparece como texto DOM real
 *   (.huella-caption) en vez de partículas.
 * - Modo Performance (P): oculta todo excepto navegación prev/next.
 */

let particleSystem;
let sampler;
let currentSlideIndex = 0;
let currentMode = CONFIG.modes.TEXT;
let currentLang = CONFIG.defaultLanguage || 'pt';
let slidePhaseTimer = 0.0;
let isPresentationMode = false;
let domTextVisible = false;

const DISSOLVE_AT = 4.3; // segundos: cuándo el DOM toma el relevo del titular

let slideTitleEl, huellaCaptionEl;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  frameRate(CONFIG.canvas.targetFPS || 60);
  pixelDensity(CONFIG.canvas.pixelDensity || 1);

  particleSystem = new ParticleSystem(CONFIG.particles.count || 1800);
  sampler = new TargetSampler();

  slideTitleEl = document.getElementById('slide-title');
  huellaCaptionEl = document.getElementById('huella-caption');

  initKeyboardAndUIListeners();
  applyState(true);
}

function draw() {
  background(CONFIG.colors.bg);

  if (currentMode === CONFIG.modes.TEXT) {
    let dt = deltaTime / 1000.0;
    slidePhaseTimer += dt;

    if (slidePhaseTimer < 1.8) {
      if (particleSystem.currentPhase !== 'TEXT_CLOUD') particleSystem.setPhase('TEXT_CLOUD');
    } else if (slidePhaseTimer < 3.5) {
      if (particleSystem.currentPhase !== 'TEXT_ORGANIZING') particleSystem.setPhase('TEXT_ORGANIZING');
    } else if (slidePhaseTimer < DISSOLVE_AT) {
      if (particleSystem.currentPhase !== 'TEXT_FORMED') particleSystem.setPhase('TEXT_FORMED');
    } else {
      // Fusión: partículas a 0, titular DOM visible
      if (!domTextVisible) {
        particleSystem.setAllParticlesAlpha(0);
        if (slideTitleEl) slideTitleEl.classList.add('visible');
        domTextVisible = true;
      }
    }
  }

  particleSystem.update();
  particleSystem.display();
}

function windowResized() {
  if (sampler) sampler.reset();
  resizeCanvas(windowWidth, windowHeight);
  applyState(false);
}

function applyState(isSlideChange = false) {
  let slide = SLIDES_DATA[currentSlideIndex];
  if (!slide) return;

  let actEl = document.getElementById('act-label');
  if (actEl) actEl.textContent = slide.actTitle[currentLang] || slide.actTitle['pt'];

  let counterEl = document.getElementById('slide-counter');
  if (counterEl) {
    counterEl.textContent = `Slide ${String(slide.id).padStart(2, '0')} / ${String(SLIDES_DATA.length).padStart(2, '0')}`;
  }

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

  let docLayer = document.getElementById('documentary-layer');
  let photoImg = document.getElementById('documentary-photo');
  let placeholder = document.getElementById('documentary-placeholder');
  let caption = document.getElementById('photo-caption');
  let topBar = document.querySelector('.top-bar');

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

  let headline = slide.title[currentLang] || slide.title['pt'];

  // Sombra/huella DOM real — mismo texto, arranca invisible
  if (huellaCaptionEl) {
    huellaCaptionEl.innerHTML = headline; // Usa innerHTML para renderizar los tags <b>
    huellaCaptionEl.classList.remove('visible');
    if (slide.hasPhoto) {
      huellaCaptionEl.style.left = '45%';
      huellaCaptionEl.style.maxWidth = '42vw';
    } else {
      huellaCaptionEl.style.left = '50%';
      huellaCaptionEl.style.maxWidth = '70vw';
    }
  }
  
  // Mostrar u ocultar el CTA Final (QR + Instagram)
  let ctaContainer = document.getElementById('final-cta-container');
  let qrCode = document.querySelector('.qr-code');
  if (ctaContainer && qrCode) {
    ctaContainer.style.left = slide.hasPhoto ? '45%' : '50%';
    
    if (slide.id === 1) {
      ctaContainer.style.display = 'flex';
      qrCode.style.display = 'none';
      setTimeout(() => ctaContainer.classList.add('visible'), 50);
    } else if (slide.id === 13) {
      ctaContainer.style.display = 'flex';
      qrCode.style.display = 'block';
      setTimeout(() => ctaContainer.classList.add('visible'), 50);
    } else {
      ctaContainer.classList.remove('visible');
      setTimeout(() => {
        if (![1, 13].includes(SLIDES_DATA[currentSlideIndex].id)) {
          ctaContainer.style.display = 'none';
        }
      }, 800);
    }
  }
  domTextVisible = false;

  let textTargets = sampler.sampleText(headline, CONFIG.particles.count, slide.hasPhoto);
  let cloudTargets = sampler.sampleCloud(sampler.lastTextLayout, CONFIG.particles.count);

  // Titular DOM real — posicionamiento ABSOLUTO para clonar exactamente a las partículas
  if (slideTitleEl && sampler.lastTextLayout) {
    let layout = sampler.lastTextLayout;
    // Permite multi-línea con saltos de línea exactos a los que procesó el canvas
    slideTitleEl.innerHTML = layout.lines.join('<br>');
    slideTitleEl.classList.remove('visible');
    
    // Eliminamos la interferencia de layout-center o flex
    let container = slideTitleEl.closest('.main-content');
    if (container) {
      container.style.display = 'block';
      container.style.padding = '0';
    }

    // p5.js con textAlign(LEFT, TOP) dibuja el glifo desde la coordenada y exacta.
    // CSS con line-height > font-size agrega un "half-leading" encima y debajo del glifo.
    // Para alinear perfectamente el DOM con el canvas, debemos restar ese espacio superior en CSS,
    // y además compensar la altura de las mayúsculas (fudge factor ~10-12% del fontSize).
    let halfLeading = (layout.lineHeight - layout.fontSize) / 2;
    let p5TopOffset = layout.fontSize * 0.12; 
    let finalTop = layout.startY - halfLeading - p5TopOffset;

    slideTitleEl.style.position = 'absolute';
    slideTitleEl.style.left = layout.startX + 'px';
    slideTitleEl.style.top = finalTop + 'px';
    slideTitleEl.style.transform = 'translate(-50%, 0)';
    slideTitleEl.style.width = layout.maxWidth + 'px';
    slideTitleEl.style.textAlign = 'center';
    slideTitleEl.style.fontSize = layout.fontSize + 'px';
    slideTitleEl.style.lineHeight = layout.lineHeight + 'px';
    slideTitleEl.style.letterSpacing = layout.letterSpacing + 'px';
    slideTitleEl.style.fontWeight = '700';
    slideTitleEl.style.margin = '0';
    slideTitleEl.style.padding = '0';
  }

  let sType = slide.sculptureType || 'potencial';
  let generator = SCULPTURES[sType] || SCULPTURES['potencial'];
  let opts = {};
  if (slide.edgeProgress !== undefined) opts.edgeProgress = slide.edgeProgress;
  opts.hasPhoto = slide.hasPhoto;
  opts.centerX = slide.hasPhoto ? width * 0.45 : width * 0.5;
  let defaultCy = slide.hasPhoto ? height * 0.46 : height * 0.40;
  if (headline.includes("QR con memoria")) defaultCy = height * 0.38;
  opts.centerY = defaultCy;
  opts.radiusScale = slide.hasPhoto ? 0.65 : 0.85;
  
  let sculptureTargets = generator(CONFIG.particles.count, width, height, opts);

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

  if (isSlideChange) {
    currentMode = CONFIG.modes.TEXT;
    slidePhaseTimer = 0.0;
    particleSystem.startSlideSequence(targetsData);
  } else {
    particleSystem.setTargets(targetsData);
    if (currentMode === CONFIG.modes.TEXT) {
      slidePhaseTimer = 1.4;
      particleSystem.setPhase('TEXT_ORGANIZING');
    } else {
      particleSystem.enterSculpture();
      if (huellaCaptionEl) huellaCaptionEl.classList.add('visible');
    }
  }

  updateToggleButtonUI();
}

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

function toggleMode() {
  if (currentMode === CONFIG.modes.TEXT) {
    // → ESCULTURA: apaga el titular DOM, las partículas reaparecen formando la figura
    currentMode = CONFIG.modes.SCULPTURE;
    particleSystem.currentMode = 'sculpture';
    if (slideTitleEl) slideTitleEl.classList.remove('visible');
    domTextVisible = false;
    particleSystem.enterSculpture();
    if (huellaCaptionEl) huellaCaptionEl.classList.add('visible');
  } else {
    // → TEXTO: apaga la sombra DOM, las partículas reaparecen y vuelven a fusionarse
    currentMode = CONFIG.modes.TEXT;
    particleSystem.currentMode = 'text';
    if (huellaCaptionEl) huellaCaptionEl.classList.remove('visible');
    slidePhaseTimer = 2.6; // entra directo a ORGANIZING; draw() se encarga del resto
    particleSystem.setPhase('TEXT_ORGANIZING');
  }
  updateToggleButtonUI();
}

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
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

function togglePresentationMode(forceState) {
  isPresentationMode = (forceState !== undefined) ? forceState : !isPresentationMode;
  let overlay = document.getElementById('ui-overlay');
  if (overlay) overlay.classList.toggle('presentation-mode', isPresentationMode);
}

function initKeyboardAndUIListeners() {
  window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
    else if (e.key === 't' || e.key === 'T') { e.preventDefault(); toggleMode(); }
    else if (e.key === 'p' || e.key === 'P') { e.preventDefault(); togglePresentationMode(); }
    else if (e.key === 'Escape') { if (isPresentationMode) { e.preventDefault(); togglePresentationMode(false); } }
    else if (e.key === 'l' || e.key === 'L') { e.preventDefault(); cycleLanguage(); }
    else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFullscreen(); }
  });

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
    btn.addEventListener('click', (e) => setLanguage(e.target.getAttribute('data-lang')));
  });

  let touchStartX = 0;
  window.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, false);
  window.addEventListener('touchend', (e) => {
    let diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) { if (diff < 0) nextSlide(); else prevSlide(); }
  }, false);
}
