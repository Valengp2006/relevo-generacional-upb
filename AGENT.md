
---
workspace:
  folders:
    - path: "/Users/valentina/Universidad/Simulacion/relevo_generacional_upb"
      name: "Relevo Generacional (p5.js)"
    - path: "/Users/valentina/Universidad/Simulacion/bitacora-clase"
      name: "Bitácora de Clase"
  working_directory: "/Users/valentina/Universidad/Simulacion/relevo_generacional_upb"
  workspace_file: "/Users/valentina/Universidad/Simulacion/simulacion.code-workspace"
---


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
**Actividad 02 — Concepto, gramática de transición y paleta definidos. Cambio de diseño confirmado: partículas que forman texto y esculturas (texto-partícula con libertad total, transición manual).**
Aún no se ha escrito código. Antes de prototipar falta definir la secuencia de esculturas por acto y conseguir materiales (fotos, archivo vectorial del logo del evento).

## Análisis de referentes (hecho)
- **Forms (Akten/Quayola):** el movimiento del cuerpo se abstrae en estructura; lo que importa no es la técnica de tracking sino que la forma revela relaciones ocultas (poder, equilibrio, tensión) entre cuerpo y entorno. Lección para el reto: el sistema debe revelar una relación, no representar un cuerpo.
- **ForumTEDTALK (profesor):** mismo guion/cliente ya resuelto por otra persona. Sirve como caso de referencia de restricciones reales (pantalla completa, navegación ES/PT, QR final), no como estética a copiar.
- **Verificación tipográfica sobre capturas del referente:** los titulares y texto corrido de los slides usan un grotesco sans-serif bold (sin serifas, trazo uniforme) — coherente con reservar Belwe solo para el logosímbolo institucional y usar un grotesco libre (Inter/Switzer) para el resto del sistema. El logo UPB/Fórum se usa como **imagen** para importar a los slides, no como fuente a replicar en código — no bloquea el prototipado.

## Concepto (validado por Valen, con un ajuste de composición)
Sistema de dos "generaciones" de nodos que empiezan separadas y terminan tejiendo una sola estructura compartida — encarnando literal y estructuralmente la idea de "relevo" (no reemplazo, sino trabajo conjunto). Arco en 4 actos mapeado a los 13 slides:
1. Origen (slides 1–5): un solo núcleo/auditorio → tríada academia+industria+ciudad
2. Comunidad y confianza (6–9): clustering orgánico, conexiones que ganan grosor/opacidad
3. Relevo (10–12): dos "especies" de nodos entrelazándose en una malla común
4. Apertura (13): la malla se abre en una grilla/portal (gancho visual hacia el QR de cierre)

**Ajuste de Valen (importante):** el sistema de partículas NO reemplaza el contenido documental. En los slides donde el guion indica foto, debe aparecer una foto real de la galería de materiales del cliente, más logo/iconos de la universidad en esa diapositiva. El sistema de partículas pasa a ser un **complemento visual continuo** — corre a lo largo de toda la presentación (fondo, marco o capa que dialoga con foto/logo/texto) representando el relevo, sin sustituir esos elementos de marca/documentales.

Implicación de composición: pensar el layout como capas, **adaptativas según el slide**:
- **Slides sin foto** (ej. 1, 3, 6, 7, 9, 10, 11): el grafo puede tomar más protagonismo — ocupa más espacio visual, el texto flota sobre él.
- **Slides con foto** (2, 4, 5, 8, 12, 13): transición fluida hacia un estado donde la foto queda visible y no tapada, pero el grafo sigue presente y activo — no desaparece, se retrae (ej. se comprime a un borde/zona, baja opacidad, o rodea el marco de la foto) sin dejar de acompañar.
- La regla general: **el grafo nunca desaparece, pero cede protagonismo espacial cuando hay foto**, y lo recupera cuando no la hay. Esa respiración (expande/retrae) es en sí misma parte de la gramática — leerla como "el relevo cede espacio a la evidencia documental, y vuelve a tomarlo".
- Logo Fórum/UPB 90 años: posición fija (esquina), siempre legible, no debe competir con el grafo.

Ambas capas deben convivir sin que la generativa opaque la legibilidad de foto/logo/texto.

## Gramática de transición entre slides (validado)

**Principio transversal:** el sistema es una sola simulación continua de principio a fin — nunca hay reset. Cada slide define un *estado objetivo* (nº de clusters, fuerzas de atracción, grosor/opacidad de aristas, posición de retiro si hay foto) y el motor de fuerzas interpola hacia ese estado al cambiar de slide, en cualquier dirección (adelante o atrás reutiliza el mismo mecanismo, solo reapunta el objetivo). Argumento: resetear ilustraría *reemplazo* generacional; interpolar sin romper el estado ilustra *herencia y transformación*, que es el concepto central.

- **Acto 1 — Origen (1–5):** núcleo único y denso en el slide 1. La fisión en tríada (academia/industria/ciudad) ocurre en la transición 2→3. Los retiros por foto (slides 2, 4, 5) no revierten la fisión una vez ocurrida.
- **Acto 2 — Comunidad y confianza (6–9):** los clusters ya no cambian de cantidad ni agrupación; lo único que evoluciona es grosor/opacidad de las aristas dentro y —hacia el final— entre clusters. El progreso acumulado de aristas no se resetea al retraerse en el slide 8 (foto).
- **Acto 3 — Relevo (10–12):** la transición 9→10 es la más relevante — recategoriza los *mismos* nodos de 3 clusters institucionales a 2 "especies" generacionales mediante migración visible (cambio de tamaño/forma/color en vivo), no aparición de nodos nuevos, para argumentar continuidad de identidad con cambio de rol. El entretejido entre especies ya no se separa de nuevo al retraerse en el slide 12.
- **Acto 4 — Apertura (13):** única transición que cambia la lógica de fuerzas: de orgánico (atracción/repulsión libre) a posiciones fijas tipo grilla/portal, argumentando que el relevo tejido resuelve en estructura aprovechable (gancho hacia el QR).
- **Ritmo:** transiciones de 1.5–2.5s con easing; micro-movimiento idle constante incluso sin cambio de slide; navegación 100% manual (teclado/táctil), sin timing de voz que sincronizar.

## CAMBIO DE DISEÑO — partículas que forman texto y escultura (nuevo, en definición)

**Propuesta de Valen:** las partículas dejan de ser solo fondo/marco y pasan a **formar el texto del slide**; tras un tiempo, transicionan de forma llamativa hacia una **figura/escultura representativa** del tema de ese slide. Una tecla/botón permite alternar manualmente entre estado-texto y estado-figura. La escultura va cambiando slide a slide manteniendo la línea narrativa. Todas las transiciones (entre estados y entre slides) deben ser fluidas y **bidireccionales**: el sentido se conserva sin importar la dirección de navegación.

**Lectura conceptual (por qué esto fortalece el encargo):** el sistema deja de "acompañar" el discurso y pasa a *ser* el discurso — la misma materia (los mismos nodos) se organiza como lenguaje verbal y como forma. Eso es exactamente la pregunta de la unidad ("¿cómo una estructura de elementos relacionados se convierte en un lenguaje visual capaz de construir el significado de un discurso?"). El toggle texto↔figura es, además, un argumento en sí: nada se añade ni se elimina, solo cambia la relación entre los mismos elementos.

**Riesgo #1 — traducción: RESUELTO.** Para este ejercicio Valen tiene libertad de que el texto sea partículas; no es obligatorio mantenerlo traducible vía DOM/traductor del navegador. Se implementa con la opción (b) de todos modos (objeto JS con strings por idioma + selector propio), porque sigue siendo la forma más simple de tener el sistema listo para PT/ES/EN sin depender del navegador — pero ya no es una restricción del cliente, es preferencia de diseño propia.

**Riesgo #3 — timing: RESUELTO.** La transición texto→figura es **manual** (tecla/botón), no automática por temporizador. Alma controla el ritmo en vivo.

**Riesgo #2 — legibilidad:** sigue abierto, se valida en el prototipo.

**Implicación técnica:** un único sistema de partículas con *pool fijo* de nodos y objetivos intercambiables. Texto y figura se resuelven igual: se rasteriza el contenido (texto en canvas offscreen; silueta de escultura desde SVG path) y se muestrean puntos que se asignan como targets a las partículas. Esto hace la bidireccionalidad trivial: cualquier estado es solo otro conjunto de targets, y navegar hacia atrás es reapuntar, no revertir una animación.

**Pendiente de definir:** qué escultura/figura corresponde a cada uno de los 13 slides (debe sostener la línea narrativa de los 4 actos, no ser iconos ilustrativos sueltos).

## Gramática visual — tipografía y color
**Paleta del evento (confirmada):** tomada del logo "IMEX Future Leaders Forum — World Cup Edition 2026" — un swirl en **rosa/magenta, rojo y azul**, con texto de marca en gris oscuro/negro. Esta es la paleta que rige el sistema (por encima de la institucional UPB, que queda como referencia secundaria para el lockup del logo Fórum/UPB en su esquina). Se implementa igualmente como tokens de color para poder ajustar tono/saturación exactos una vez se tenga el archivo de marca vectorial.

**Tipografía institucional UPB (confirmado en el manual de imagen corporativa):**
- Logosímbolo / identificación de la Universidad: **Belwe** (Medium para el logosímbolo, Normal mayúscula sostenida para nombres de unidad). Es una fuente de licencia (Adobe Fonts / activo propio de la Universidad) — si el material que comparta Lore incluye el archivo, se usa directamente vía @font-face; si no, placeholder visual con una slab serif de época similar (ej. Bevan/Rockwell de Google Fonts) mientras se consigue la real. El logo se usará como imagen importada en los slides, no se replica tipográficamente en el código.
- Texto corrido de unidades de servicio: **SwitzerlandLight** (clon de Helvetica) — para body copy del sistema se puede usar un grotesco equivalente y libre (ej. Inter o Switzer de Fontshare) que dialogue con ese espíritu sin depender de una fuente pagada. Confirmado contra referentes: los titulares del ForumTEDTALK usan este tipo de grotesco en peso bold.
- Regla de la UPB: nunca Light/Bold/Itálica/Subrayada sobre el logosímbolo — se respeta para el uso del logo, no aplica necesariamente al resto del sistema tipográfico.

*(Colores institucionales UPB — Rojo, Oro, Negro, con alternativas Azul/Verde/Vinotinto — quedan como referencia del manual de marca, pero no son la paleta rectora del sistema; ver paleta del evento arriba.)*

## Pendiente / próximos pasos
- [ ] **Definir la secuencia de esculturas** (1 por slide o 1 por acto) que sostenga la narrativa
- [ ] Fijar presupuesto de partículas y probar legibilidad del texto-partícula en proyección grande
- [ ] Conseguir el archivo de marca vectorial (SVG/EPS) del logo Future Leaders Forum para extraer los tonos exactos de rosa/rojo/azul
- [ ] Definir jerarquía de capas y legibilidad (texto/foto/logo siempre legibles sobre la capa generativa)
- [ ] Definir qué fotos de la galería del cliente van en qué slide (pendiente: Valen aún no tiene la carpeta de materiales — la compartirá Lore)
- [ ] Conseguir el archivo real de la fuente Belwe (o confirmar que no está disponible y queda el placeholder)
- [ ] Prototipar el sistema de partículas/grafo en HTML/CSS/JS (probablemente canvas + fuerzas tipo d3-force), ya como capa de fondo/marco, implementando la gramática de transición por actos definida arriba
- [ ] Estructurar los 13 textos como datos separados (para el toggle de idioma PT/ES/EN)
- [ ] Construir navegación fullscreen (teclado + táctil) y modo offline descargable
- [ ] Autoevaluación final (4 criterios x 25 pts) una vez el sistema esté funcionando y explicado
