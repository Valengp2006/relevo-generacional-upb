# agent.md — Relevo Generacional (Fórum UPB × Future Leaders Forum)

## Encargo
Diseñar una presentación web generativa e interactiva (HTML/CSS/JS, pantalla completa) que interprete —sin ilustrar literalmente— el guion de 13 slides de la charla inspiracional **"Relevo generacional: la ventaja que nadie está aprovechando"**, mediante un sistema de partículas/elementos vinculados cuyas relaciones estructurales (cercanía, conexión, densidad, tensión) construyan sentido.

- Cliente: Centro de Eventos Fórum UPB Medellín (Alma López)
- Contexto de entrega: Future Leaders Forum, Fortaleza (Brasil), 30 jun–1 jul 2026
- Idioma base: portugués, con textos separados en el código para traducción
- Formato técnico: web, fullscreen, híbrido online/offline, sin PPT/PDF
- Guion: fijo, 13 slides, no se puede alterar la secuencia narrativa
- Referentes: Memo Akten "Forms" (conceptual, no estético) + ForumTEDTALK del profesor (caso real, mismo guion — no imitar)

## Etapa actual
**Iteración 2 completada e implementada → Ecosistema visual narrativo continuo (13/13 esculturas generativas continuas, logos oficiales de alta fidelidad integrados, titular editorial inmerso con Zona de Calma activa y 2s de interpolación cromática fluida).**

- 🌐 **GitHub Pages (en vivo):** <https://valengp2006.github.io/relevo-generacional-upb/>
- 📦 **Repositorio GitHub:** <https://github.com/Valengp2006/relevo-generacional-upb>

### Estado del código por archivo (Iteración 2)

| Archivo | Estado | Descripción |
|---|---|---|
| `index.html` | ✅ Listo | Header con logos institucionales vectoriales oficiales (`UPB Forum` y `90 Años UPB`), HUD central compacto y contenedor editorial `#slide-title` |
| `css/style.css` | ✅ Listo | Tipografía editorial fluida (`clamp(2.3rem, 4.4vw, 4.2rem)`), estilos de composición espacial (`.layout-center`, `.layout-top-center`, `.layout-left`, `.layout-tension`) y protección de logos oficiales |
| `lib/p5.min.js` | ✅ Listo | Binario local p5.js v1.9.4 (100% offline) |
| `js/config.js` | ✅ Listo | Tokens de diseño, paleta oficial y física de partículas continuas (1.800 nodos) |
| `js/data/slides.js` | ✅ **13/13 slides** | Secuencia escultórica continua mapeada: `nucleo` → `auditorio` → `triada` → `irradiar` → `comunidad` → `comunidad_tejida` → `vision` → `especies` → `entretejido` → `portal`. Textos y guion 100% preservados |
| `js/particles/particle.js` | ✅ Listo | Interpolación cromática numérica suave (~2s), Zona de Calma elástica y deflexión institucional activa contra esquinas y HUD |
| `js/particles/particle-system.js` | ✅ Listo | Pool continuo sin resets, asignación geométrica adaptativa ante foto documental y red de aristas con supresión selectiva bajo el texto |
| `js/sculptures/sculpture-definitions.js` | ✅ Listo | 13 generadores paramétricos continuos. Slide 12 rediseñado con cremallera/engranaje zigzag de 8 dientes entre especies A y B |
| `js/sketch.js` | ✅ Listo | Gestor del ciclo continuo, medición dinámica de `textBounds` para la Zona de Calma y navegación multicanal |
| `assets/logos/` | ✅ **Oficiales listos** | `logo_upb_forum.png` (extraído del `.ai` original) y `logo_90_upb.png` (extraído del `.pdf` oficial) |
| `assets/images/` | ✅ **Fotos reales enlazadas** | Registro documental institucional vinculado y balanceado espacialmente |

## Cinemática y Gramática Visual (Iteración 2)
1. **Ecosistema Visual Continuo:**
   La escultura generativa es el protagonista visual permanente y vivo en el canvas. No existe modo de corte ni alternancia artificial entre "solo texto" y "solo escultura": las 1,800 partículas fluyen sin interrupción a través de los 13 slides (`nucleo` → `auditorio` → `triada` → `irradiar` → `comunidad` → `comunidad-tejida` → `vision` → `especies` → `entretejido` → `portal`).
2. **Titular Inmerso y Zona de Calma Activa:**
   El titular editorial se ubica armónicamente sobre la escultura. Para garantizar legibilidad total sin encerrar el texto en cajas o halos oscuros artificiales:
   - Las partículas que entran en la caja del titular experimentan una fuerza elástica de dispersión hacia afuera y una atenuación de opacidad al 32%.
   - Las aristas de conexión que cruzan el área del titular se atenúan al 10% de opacidad, evitando telarañas que tapen las letras.
3. **Reorganización Cromática de 2 Segundos (Slide 10):**
   Al pasar de la Tríada/Comunidad (Slide 9) a las dos especies generacionales (Slide 10), las partículas interpolan sus canales RGB gradualmente durante ~2 segundos, visibilizando la metamorfosis hacia la Especie A (Magenta - Experiencia) y Especie B (Azul eléctrico - Juventud).
4. **Logos Oficiales en Esquinas Superiores:**
   Los logos oficiales extraídos directamente de los archivos fuente vectoriales presiden la experiencia en las esquinas fijas, y las partículas cuentan con una fuerza de repulsión preventiva para no invadir las marcas institucionales.
5. **Entretejido Reestructurado (Slide 12):**
   Reemplazo de esferas concéntricas por un patrón central de cremallera/engranaje de 8 dientes entrelazados en zigzag, expresando que "El futuro no se hereda, se construye" como una obra física de encaje mutuo.

## Pendiente / próximos pasos
- [x] **Completar e integrar Iteración 2** (esculturas continuas, zona de calma, logos oficiales, interpolación cromática, git push y deploy)
- [ ] Traducir pt/en reales con el cliente (actualmente mantienen copia del texto oficial para mantener consistencia)
- [ ] Presentación y prueba en pantalla del auditorio/proyector institucional en Fortaleza
