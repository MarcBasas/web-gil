# Web de Gil Farrés

Portfolio web de Gil Farrés. La página principal es **Taller** (el «Taulell»): una mesa de trabajo infinita en azul cobalto con acento naranja. Sin build ni dependencias: HTML, CSS y JavaScript actuales, y todas las rutas son relativas.

**Qué se ha decidido, qué está hecho y qué falta: [ACUERDOS.md](ACUERDOS.md).** El plan del panel para que Gil edite solo: [PLAN-PANEL.md](PLAN-PANEL.md). Este README es la guía técnica.

| Ruta | Qué es |
|---|---|
| `/` | **Taller**: la web. |
| `/taller/` | Redirige a `/` conservando `?lang=` y `#`, por si hay enlaces antiguos. |
| `/paper/` y `/sala/` | Propuestas descartadas y **aparcadas**: siguen en su ruta pero ninguna página enlaza a ellas. Ver [ACUERDOS.md](ACUERDOS.md#3-páginas-aparcadas-paper-y-sala). |

## Verlo en local

```powershell
python -m http.server 8000 --directory docs
```

Abrir <http://localhost:8000/>. Con doble clic sobre el `.html` el navegador bloquea la carga de los datos y la tipografía (`file://`): hace falta el servidor.

## Publicar en GitHub Pages

1. Subir el repositorio (el `.gitignore` deja fuera los PDFs: el CV lleva teléfono y fecha de nacimiento).
2. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch `main`, carpeta `/docs`**.
3. A los pocos minutos estará en `https://<usuario>.github.io/<repo>/`.

`docs/.nojekyll` evita que GitHub procese la carpeta con Jekyll. Como todas las rutas son relativas, funciona igual en una subruta de repositorio que en un dominio propio. Para mover el sitio a Vercel o Cloudflare, ver [ACUERDOS.md](ACUERDOS.md#7-hosting-privacidad-y-migración).

Las páginas llevan `noindex` mientras sea un borrador para presentar. Quitarlo (`<meta name="robots">` en `docs/index.html`) al publicarla de verdad.
## Paleta de Taller

| Color | Valor | Uso |
|---|---|---|
| Azul cobalto | `#2a44cf` | Fondo |
| Azul profundo | `#1d33ad` | Visor y «Sobre mi» |
| Naranja | `#ff8a3d` | Acentos: subrayado activo, anillo de foco, rótulos de obra, figuras de FARS teñidas, selección de texto |
| Azul marino | `#0d1650` | Texto sobre naranja (contraste 7,2:1) |

El naranja tiene 3,2:1 sobre el azul (válido para líneas y anillos de foco). No se usa para texto fino sobre azul. Los colores están al inicio de `docs/assets/css/taller.css`.

## Idiomas (solo Taller)

Botones `cat · es · en` abajo a la izquierda, frente al botón Lista/Tablero. Cambian todo: interfaz, títulos, descripciones, biografía, CV, textos alternativos de las imágenes, el visor y `<html lang>`.

- **Qué idioma sale al entrar:** `?lang=es` en la dirección (útil para enviar un enlace en un idioma concreto) → la última elección guardada en ese navegador → el idioma del navegador si es cat, es o en → inglés.
- **El catalán es el original**. El castellano y el inglés los ha traducido Claude: **Gil debe revisarlos**.
- **Dónde están:** cada texto del contenido lleva sus tres idiomas dentro de `docs/content/*.json` (`{ "ca": "...", "es": "...", "en": "..." }`). Los textos de la interfaz (botones, avisos) están en `docs/assets/js/i18n.js`.
- **Si falta una traducción** se muestra el catalán (nunca queda en blanco) y el validador lo avisa.
- Los títulos de las obras («Omplint el buit», Rec.0, FARS) se dejan en el original.

## Vista en lista: scroll

La lista tiene su propio contenedor con scroll en vez de usar el de la página. Así la página no cambia de ancho al pasar de Tablero a Lista y los botones del borde no se desplazan. La barra es naranja `#ff8a3d` sobre fondo transparente y sin flechas (`::-webkit-scrollbar` en Chrome/Edge/Safari, `scrollbar-color` en Firefox). También se aplica a «Sobre mí».

## Contenido de Taller (archivos JSON)

Taller no lleva el contenido escrito en el código: lo lee de `docs/content/`. Cambiar el contenido no requiere tocar JavaScript.

| Archivo | Qué contiene |
|---|---|
| `site.json` | **`boardLimit`**: el tope de fotos del tablero (hoy 42). Y las categorías (nombre en 3 idiomas). |
| `projects.json` | Proyectos y sus fotos. Cada foto lleva **`"board": true/false`**. |
| `about.json` | Sobre mí: biografía, estudios, experiencia, contacto, retrato. |

**Dos vistas, dos reglas:**
- **Lista:** muestra *todos* los proyectos y *todas* sus fotos, sin límite.
- **Tablero:** solo las fotos con `"board": true`, hasta `boardLimit`. Las demás siguen existiendo y se ven en la lista. Si hay más marcadas que el tope se muestran las primeras (en orden de proyectos) y la consola avisa. Si no hay ninguna marcada, se muestran las primeras para que no quede vacío. Con menos fotos el tablero se encoge para mantener la densidad; con más, crece.
- Desde el tablero, el visor ampliado recorre solo las fotos del tablero de ese proyecto; desde la lista, todas.
- Los filtros del tablero solo ofrecen categorías que tengan alguna foto en él.

**Añadir una foto:** copiarla a `docs/assets/img/` y añadir en el proyecto un bloque `{ "file", "w", "h", "board", "alt": { ca, es, en } }` (`w` y `h` son los píxeles reales). `boardSize` es opcional: si no se pone, se calcula según el tamaño de la foto.

**Añadir un proyecto:** un bloque nuevo en `projects.json` con `id` (minúsculas y guiones), `category` (una de `site.json`), `year`, `place`, `title`, `text` y sus `photos`.

**Los dibujos del fondo (stickers) no son contenido editable.** Viven en `docs/assets/stickers/`, independientes de los proyectos: se pueden quitar fotos o proyectos sin que desaparezcan.

### Validar antes de publicar

```powershell
node tools/validate-content.mjs
```

No necesita instalar nada. Da **ERROR** (no publicar) si: hay más fotos marcadas que el tope, falta una imagen, `w`/`h` no coinciden con la foto real, falta un texto alternativo en catalán, la categoría no existe, un `id` está repetido, o un JSON está roto. Da **AVISO** (no bloquea) por traducciones que faltan, imágenes sin usar, archivos de más de 1,5 MB o `boardSize` fuera de rango.

> Paper y Sala **no** usan estos archivos: siguen leyendo `docs/assets/js/works.js`, congelados como estaban. Los cambios en `content/` no les afectan.

## Cómo editar el diseño

- **Diseño de Taller:** `docs/assets/css/taller.css` (colores y tamaños en las primeras líneas) y `docs/assets/js/taller.js` (el lienzo).
- **Interfaz (botones, avisos):** `docs/assets/js/i18n.js`.
- **Paper y Sala:** `docs/paper/` y `docs/sala/` (aparcadas, no se mantienen).

## Decisiones y cosas a confirmar con Gil

- **Idioma:** el original es catalán, como su CV y su portafolio. Taller también está en castellano e inglés (traducciones de Claude, por revisar).
- **Datos que no se publican:** teléfono y fecha de nacimiento. Solo aparecen el correo y `@gfars_`, que ya están en el portafolio.
- **Erratas corregidas** respecto al CV y el PDF («Disseny y producció» → «Disseny i producció», «escenografá» → «escenografia», «Instal.lacio» → «Instal·lació», «FARRÉSHERNÀNDEZ» → «Farrés Hernàndez»). Conviene que él las revise.
- **Años de formación** tal como constan en el CV (2025 y 2020). Pueden ser año de fin o de inicio: preguntar.
- **Calidad de imagen:** las fotos salen del PDF (≈1090 px de ancho las instalaciones, ≈500 px las de FARS), ya comprimido. Bien para una presentación; para la versión final conviene pedir los originales.
- **Tipografía:** su documento usa *ITC Avant Garde Gothic Pro*. Aquí se usa **Jost** (licencia libre, autoalojada en `assets/fonts/`), muy próxima. Si Gil tiene Adobe Creative Cloud puede cargar la original con Adobe Fonts (revisar la licencia web).
- **Obras sin foto:** «Hamlet» (escenografía, 2024) solo aparece en el listado del CV.
- **Fotos del tablero:** de momento las 42 están marcadas (`board: true`), así que el tablero es idéntico al aprobado. Gil decidirá cuáles destacar.
- **Traducción de «Taulell»** (el botón que vuelve del modo lista): «Tablero» en castellano y «Board» en inglés. Cambiable en `i18n.js` (`v_board`).

## Compatibilidad

Probado en Edge/Chromium (escritorio y emulación móvil) a 1920, 1440, 1280, 820 y 390 px. Las funciones recientes tienen alternativa si el navegador no las soporta:

- `animation-timeline: view()` (el gesto de Paper): sin soporte, las fotos se ven enteras sin animación.
- View Transitions (el visor de Taller y Sala): sin soporte, el visor se abre sin transición.
- `prefers-reduced-motion`: Sala apila las salas en vertical, Taller quita la inercia y la animación de entrada.

Accesibilidad: textos alternativos en todas las imágenes (también traducidos), foco visible, navegación completa con teclado (en Taller, Tab recorre las obras y hay una vista en lista), enlace «Salta a la lista d'obres», y los botones de idioma llevan el nombre completo del idioma para lectores de pantalla.
