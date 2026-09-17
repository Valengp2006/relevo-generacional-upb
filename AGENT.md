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
| `js/particles/particle.js` | ✅ Listo | Clase Particle con cinemática seek/arrive, modo enjambre vivo (burstSwarm), estabilización tipográfica |
| `js/particles/particle-system.js` | ✅ Listo | Pool continuo, ciclo de enjambre vivo (~1.5s), aristas adaptativas (14px en texto, 48px en escultura) |
| `js/sampler/target-sampler.js` | ✅ Listo | Tipografía jerarquizada con trazo engrosado; esculturas Plensa con siluetas sólidas y palabras íntegras |
| `js/sculptures/sculpture-definitions.js` | ✅ Listo | Siluetas volumétricas sólidas y contornos estructurales (Plensa pensador, tríada, puente, 2 generaciones, portal) |
| `js/sketch.js` | ✅ Listo | Ciclo de enjambre vivo al cambiar de slide, toggle a escultura con tecla T y sombra tipográfica legible de fondo |
| `assets/logos/forum_upb.svg` | ⚠️ Placeholder | Logosímbolo vectorial provisional. Falta archivo oficial con Belwe real |
| `assets/images/` | ✅ **Fotos reales vinculadas** | slide-2.jpg, slide-4.jpg, slide-5.jpg, slide-8.jpg, slide-12.jpeg y slide-13.jpg vinculadas en `js/data/slides.js` |

## Cinemática y Gramática Visual (Actualización)
1. **Inicio de cada Slide — Enjambre Vivo:**
   Al cambiar de diapositiva (o al cargar la presentación), las partículas inician dispersas como un fluido orgánico vivo en constante remolino. A lo largo de ~1.5 segundos, la fuerza de atracción hacia los píxeles del titular se intensifica de forma suave, haciendo que las palabras se condensen y cristalicen con nitidez absoluta.
2. **Metamorfosis a Escultura (Tecla `T`):**
   Al pulsar la tecla `T`, las partículas abandonan las letras y viajan en un flujo cinemático continuo para dar vida a la escultura tridimensional de palabras del slide (siluetas de Jaume Plensa, dos generaciones caminando juntas, puentes, cúpulas, etc.).
3. **Sombra Legible de las Letras (Ghost Text):**
   Al desvanecerse las partículas de las letras hacia la escultura, una sombra tipográfica suave pero perfectamente nítida y legible emerge en el fondo en la posición exacta del titular, permitiendo que la audiencia lea la idea central mientras contempla la escultura en primer plano. Al volver a pulsar `T`, la sombra se desvanece suavemente mientras las partículas regresan a formar el texto.

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
