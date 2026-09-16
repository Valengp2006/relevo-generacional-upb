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
**Actividad 02 → Escultura de palabras (Plensa) diseñada e implementada como patch; guion completo (13/13 slides) con texto real del cliente; fotos del cliente seleccionadas, en proceso de optimización para web.**

- 🌐 **GitHub Pages (en vivo):** <https://valengp2006.github.io/relevo-generacional-upb/>
- 📦 **Repositorio GitHub:** <https://github.com/Valengp2006/relevo-generacional-upb>
- Este documento describe el estado **después** de la sesión del 2026-09-16; falta que Valen aplique los patches de esta sesión sobre los archivos reales del repo y confirme que corren sin errores.

### Estado del código por archivo

| Archivo | Estado | Descripción |
|---|---|---|
| `index.html` | ✅ Listo | Shell fullscreen con HUD flotante, capa documental adaptativa y carga de scripts |
| `css/style.css` | ✅ Listo | Estilos fullscreen, paleta magenta/rojo/azul del evento, tipografía grotesca Inter |
| `lib/p5.min.js` | ✅ Listo | Binario local p5.js v1.9.4 (100% offline) |
| `js/config.js` | ✅ Listo | Tokens de color del swirl, parámetros de simulación (1.800 partículas, seek/arrive) |
| `js/data/slides.js` | ✅ **13/13 slides**, texto real del guion del cliente (ver sección abajo) | pt/en siguen siendo placeholder = mismo texto en español; pendiente traducción real |
| `js/particles/particle.js` | ✅ Listo | Clase Particle con seek, arrive, Perlin noise, especies generacionales |
| `js/particles/particle-system.js` | ✅ Listo | Pool continuo, aristas, retracción adaptativa ante fotos |
| `js/sampler/target-sampler.js` | ✅ **Patch aplicado y verificado** | Se agregó `extractPoints()` (helper compartido) y `sampleWordSculpture(sculptureType, words, count)` — usa las 8 siluetas de `SCULPTURES` como máscara (`globalCompositeOperation:'source-in'`) rellena con las palabras del propio slide con jitter |
| `js/sculptures/sculpture-definitions.js` | ✅ Sin cambios | Los 8 generadores geométricos existentes ahora hacen de **máscara de silueta**, no de posición final — no requirió tocarse |
| `js/sketch.js` | ✅ **Patch aplicado y verificado** | En `applyState()`, modo escultura genera la escultura de palabras; HUD oculta contenedores vacíos automáticamente |
| `assets/logos/forum_upb.svg` | ⚠️ Placeholder | Logosímbolo vectorial provisional. Falta archivo oficial con Belwe real |
| `assets/images/` | ✅ **Fotos reales vinculadas** | slide-2.jpg, slide-4.jpg, slide-5.jpg, slide-8.jpg, slide-12.jpeg y slide-13.jpg vinculadas en `js/data/slides.js` |

## Cambio de diseño — Escultura de palabras (Plensa)

**Concepto:** en vez de una figura abstracta geométrica pura, la "escultura" de cada slide está formada por las **palabras del propio guion de ese slide**, distribuidas dentro del contorno de la silueta narrativa del acto (estilo esculturas de letras tipo Jaume Plensa — ver referencia visual que aportó Valen). Las palabras a su vez están hechas de partículas. Refuerza la idea central del reto: la misma materia se organiza como lenguaje verbal y como forma, sin añadir ni quitar elementos.

**Implementación (mecanismo):**
1. Se dibuja la silueta actual (`SCULPTURES[slide.sculptureType]`, sin cambios) como una nube de puntos rellenos en un canvas oculto → esto es la **máscara**.
2. Se cambia `globalCompositeOperation` a `'source-in'`.
3. Se "baldosan" las palabras del slide (título + subtítulo + narrativa del idioma activo) en filas, con jitter de posición/rotación, por encima de la máscara — el compositing hace que solo sobrevivan los píxeles de texto que caen dentro de la silueta.
4. Se muestrean esos píxeles igual que ya hacía `sampleText` (helper `extractPoints` compartido entre ambos modos).

**Toggle de dos estados (sin cambios respecto a la decisión anterior):**
- Modo **texto**: título del slide, plano, sin silueta (como antes).
- Modo **escultura**: ahora es la escultura de palabras descrita arriba, en vez de la figura geométrica pura.
- Transición manual (tecla `T` / botón), nunca automática — Alma controla el ritmo en vivo.

**Pendiente de validar en el navegador real (no se pudo correr en esta sesión):**
- Rendimiento del muestreo (`sampleWordSculpture` dibuja ~6.000 círculos de máscara + el baldosado de palabras cada vez que cambia slide/modo — no corre en el loop de `draw()`, pero si se siente una pausa al presionar `T`, bajar ese conteo a ~2.500).
- Legibilidad de las palabras a la escala de proyección real (Riesgo #2, sigue abierto).

## Guion completo (13/13 slides) — texto real del cliente

Se reemplazó el copy editorial inventado que tenían los slides 1–3 de prueba (ej. "90 años de tradición y liderazgo académico") por el texto **literal** del guion entregado por Alma. `subtitle`/`narrative` se dejan vacíos donde el guion no trae más que el título — no se inventó contenido adicional.

| # | Acto | Texto | Foto |
|---|---|---|---|
| 1 | Origen | RELEVO GENERACIONAL: LA VENTAJA QUE NADIE ESTÁ APROVECHANDO / @centrodeeventosupb | — |
| 2 | Origen | ¿un gran auditorio solo para hacer grados? | slide-2.jpg |
| 3 | Origen | Los eventos no llegaron a la Universidad. / La Universidad decidió encontrarse con el mundo. | — |
| 4 | Origen | Academia + Industria + Ciudad | slide-4.jpg |
| 5 | Origen | Los eventos nunca fueron el objetivo. / El impacto sí. | slide-5.jpg |
| 6 | Comunidad | Un evento trae personas. / Una comunidad trae transformación. | — |
| 7 | Comunidad | El talento crece a la velocidad de la confianza. | — |
| 8 | Comunidad | La experiencia construye el camino. / Las nuevas generaciones descubren nuevas rutas. | slide-8.jpg |
| 9 | Comunidad | Una visión. / Dos generaciones. | — |
| 10 | Relevo | El crecimiento no ocurre cuando una generación reemplaza a otra. / Ocurre cuando trabajan juntas. | — |
| 11 | Relevo | Los jóvenes no son el futuro. / Son el presente que muchas organizaciones aún no ven. | — |
| 12 | Relevo | El futuro no se hereda. / Se construye. | slide-12.jpeg |
| 13 | Apertura | @centrodeeventosupb | slide-13.jpg |

No hay pie de foto en ninguna diapositiva (decisión de Valen).

## Fotos del cliente — criterio de selección
Valen ya eligió y descargó las 6 fotos de la galería del cliente:
- **slide-2** — ceremonia de grados en el auditorio (encaja con "¿un gran auditorio solo para hacer grados?")
- **slide-4** — sala de evento montada
- **slide-5** — público en auditorio viendo una presentación
- **slide-8** — grupo de personas trabajando alrededor de una mesa (encaja con "nuevas rutas")
- **slide-12** — escenario con público, formato vertical
- **slide-13** — fachada de edificio de noche (cierre neutro, no compite con el QR)

Herramienta local (`redimensionar-fotos.html`, HTML+canvas, corre en el navegador sin subir nada a ningún servidor) entregada para llevar las 3 fotos pesadas a ≤250 KB / máx. 1920px de ancho antes de subirlas a `assets/images/`.

## Análisis de referentes (hecho)
- **Forms (Akten/Quayola):** el movimiento del cuerpo se abstrae en estructura; lo que importa no es la técnica de tracking sino que la forma revela relaciones ocultas (poder, equilibrio, tensión) entre cuerpo y entorno. Lección para el reto: el sistema debe revelar una relación, no representar un cuerpo.
- **ForumTEDTALK (profesor):** mismo guion/cliente ya resuelto por otra persona. Sirve como caso de referencia de restricciones reales (pantalla completa, navegación ES/PT, QR final), no como estética a copiar.
- **Verificación tipográfica sobre capturas del referente:** los titulares y texto corrido de los slides usan un grotesco sans-serif bold — coherente con reservar Belwe solo para el logosímbolo institucional y usar un grotesco libre (Inter/Switzer) para el resto del sistema.

## Concepto de fondo (grafo estructural, sigue vigente como base del sistema)
Sistema de dos "generaciones" de nodos que empiezan separadas y terminan tejiendo una sola estructura compartida — encarnando literal y estructuralmente la idea de "relevo" (no reemplazo, sino trabajo conjunto). Arco en 4 actos mapeado a los 13 slides:
1. Origen (1–5): un solo núcleo/auditorio → tríada academia+industria+ciudad
2. Comunidad (6–9): clustering orgánico, conexiones que ganan grosor/opacidad
3. Relevo (10–12): dos "especies" de nodos entrelazándose en una malla común
4. Apertura (13): la malla se abre en una grilla/portal (gancho hacia el QR)

La capa documental (foto + logo) es adaptativa: transición fluida según si el slide tiene o no foto, dando protagonismo a las partículas como acompañantes sin taparla del todo.

## Gramática de transición entre slides (validada, sin cambios)
Principio transversal: **nunca hay reset**. Cada slide define un estado objetivo y el motor interpola hacia él en cualquier dirección — retroceder reutiliza el mismo mecanismo, solo reapunta el objetivo. Transiciones de 1.5–2.5s con easing; micro-movimiento idle constante; navegación 100% manual (teclado/táctil).

## Gramática visual — tipografía y color
**Paleta del evento (confirmada):** swirl rosa/magenta, rojo y azul del logo "IMEX Future Leaders Forum — World Cup Edition 2026", implementada como tokens de color. Rige por encima de la institucional UPB (Rojo/Oro/Negro), que queda como referencia secundaria para el lockup del logo Fórum/UPB.

**Tipografía:** Belwe (Medium/Normal) para el logosímbolo institucional cuando se consiga el archivo real — placeholder grotesco (Bevan/Rockwell) mientras tanto. Grotesco libre (Inter) para el resto del sistema.

## Pendiente / próximos pasos
- [x] **Aplicar los patches de esta sesión** en `target-sampler.js` y `sketch.js`, y probar en navegador (resuelto: sintaxis corregida, escultura de palabras activa, fotos reales enlazadas)
- [ ] **Probar rendimiento y legibilidad** de la escultura de palabras en pantalla grande — si hay pausa al presionar T, bajar de 6.000 a ~2.500 puntos de máscara
- [ ] **Redimensionar/comprimir** slide-4.jpg, slide-8.jpg y slide-13.jpg a ≤250 KB (herramienta ya entregada)
- [ ] **Confirmar `sculptureType` de cada slide** contra la escultura de palabras — validar que la silueta sigue siendo legible ahora que está hecha de texto, no de puntos sueltos
- [ ] Conseguir el archivo de marca vectorial (SVG/EPS) del logo Future Leaders Forum
- [ ] Conseguir la fuente Belwe real (o confirmar placeholder definitivo)
- [ ] Integrar el logo institucional real (Fórum UPB 90 años) en la esquina fija del HUD
- [ ] Traducir pt/en reales (hoy son copia del español)
- [ ] Autoevaluación final (4 criterios × 25 pts) una vez el sistema esté completo y explicado
