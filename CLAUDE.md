# Proyecto: Barracas — Edificio de Alta Complejidad (Cerri 998)

## Fuente de verdad del contenido
El contenido, la paleta y los criterios de diseño están en **`CLAUDE (2).txt`** (el usuario los
edita y renombra a mano — buscar el archivo `.txt` con el número más alto si hay varios). Ese
archivo manda sobre cualquier resumen de acá. Leerlo entero antes de tocar el sitio.

## Estado del sitio (docs/)
Sitio estático (HTML/CSS/JS, sin build step) en `docs/`, publicado con **GitHub Pages** desde esa
carpeta: https://bagliani.github.io/Edificio-alta-complejidad/
Repo: https://github.com/Bagliani/Edificio-alta-complejidad

### Estructura de secciones (10, en este orden — ver CLAUDE (2).txt §4)
1. Portada (hero, sin logo — no hay archivo de logo todavía)
2. Concepto (+ recuadro "Intención del equipo")
3. Historia (mosaico 2×2 de fotos de archivo en blanco y negro)
4. Implantación
5. La plaza
6. Programa por niveles (barras de ancho/color proporcional + leyenda + stepper 01-04)
7. De noche (fondo `#10184F`, carrusel vertical con tarjetas placeholder — sin renders nocturnos
   todavía, NO inventar fotos para esto)
8. Renders · "Recorrer el proyecto" (carrusel horizontal de 2 filas, orden curado específico)
9. Documentación (plantas/cortes/axonometría, PDFs descargables)
10. Equipo

### Paleta (hex exactos — ver tabla completa en CLAUDE (2).txt §3)
Azul `#1656A6` · Azul tinta (texto) `#1D3A7A` · Azul trabajo `#7E9FD3` · Celeste vivienda `#CFDCF0`
· Azul grisáceo `#9DB3DA` · Verde `#9CCB8E` · Crema `#FFFAF2` · Arena `#E9E2D3` · Blanco `#FFFFFF`
· Azul noche (sección 7) `#10184F` · Azul profundo, tarjetas sección 7 `#162070`.
Tipografía: **Poppins** en todo. Títulos en mayúsculas/bold/azul con línea fina debajo (`h2::after`).

### Detalles de implementación no obvios
- Rutas **relativas sin `../`**: `docs/index.html` referencia `Renders-web/...`,
  `fotos-historicas/...`, `documentacion/...` — todo vive DENTRO de `docs/` a propósito, porque
  GitHub Pages (fuente = rama `main`, carpeta `/docs`) solo sirve lo que está en esa carpeta.
- Nav fijo con fondo sólido translúcido + blur (NO `mix-blend-mode`: se probó y quedaba ilegible
  sobre fotos).
- Carrusel de renders (`#galeria`): scroll nativo (`overflow-x:auto` + `scroll-snap`) para que
  funcione el swipe táctil gratis, más JS en `script.js` que agrega auto-scroll lento y arrastre
  con mouse. Respeta `prefers-reduced-motion` (si está activo, no hay auto-scroll — esto es
  intencional, no un bug).
- Carrusel vertical de "De noche": animación CSS pura (`@keyframes marquee-up`), también respeta
  `prefers-reduced-motion`.
- Lightbox (`script.js`): delega clicks en cualquier `<img class="lightbox-img">` del documento, no
  hace falta registrar imágenes nuevas en JS.
- `serve.ps1`: servidor local para preview. Usa un **socket TCP crudo** (no `HttpListener`) porque
  Windows exige admin para bindear a IPs que no sean localhost. Tiene timeouts de 8s en el socket —
  sin eso, un solo request que se cuelga (pasó con los PDFs de Documentación) bloquea el servidor
  entero porque el loop es sincrónico. Si vuelve a trabarse, lo primero a revisar es eso.
- `optimize-images.ps1`: recomprime `Renders/*.png` a `docs/Renders-web/*.jpg` (no hay Node/Python
  en esta máquina, se usa `System.Drawing` vía PowerShell).
- `docs/documentacion/`: copias de los PDF de `Plantas/`, `Cortes/`, `Axo/` con nombres limpios
  (sin espacios/mayúsculas raras). Si se agregan planos nuevos, copiarlos ahí también y linkearlos
  en la sección Documentación.
- Material que el `.txt` menciona pero **todavía no existe en el proyecto** (no inventar, preguntar
  si hace falta): foto de Aldo Sessa (1991, botes bajo el puente) para Historia, logo en SVG/PNG,
  renders nocturnos para "De noche".
- `.gitignore` excluye el material pesado original (`Renders/`, `Portfolio/`, `Láminas/`,
  `Plantas/`, `Cortes/`, `Axo/`, `Fotos Historicas/`) — no hace falta publicarlo, ya está
  optimizado dentro de `docs/`.
