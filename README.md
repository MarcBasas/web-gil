# Web de Gil Farrés · tres propuestas

Tres maneras distintas de presentar el portafolio de Gil, listas para publicar en GitHub Pages.
Sin build ni dependencias: HTML, CSS y JavaScript actuales, y todas las rutas son relativas.

| Subruta | Propuesta | Idea |
|---|---|---|
| `/` | Hub | Página de entrada para enseñar las tres |
| `/paper/` | **Paper** | El PDF hecho scroll: blanco, tipografía fina, fotos grandes. La foto principal «llena el vacío» al entrar. |
| `/taller/` | **Taller** ✅ *elegida* | Mesa de trabajo infinita en azul cobalto (el de las cajas de Rec.0), con acento naranja `#ff8a3d` (el de la columna de Rec.0). Se arrastra en todas direcciones, con inercia y dos profundidades. |
| `/sala/` | **Sala** | Exposición que se recorre en horizontal. Cada sala tiene el color de su proyecto, rotulación gigante a lo vinilo de pared y focos de luz. |

## Verlo en local

```powershell
python -m http.server 8000 --directory docs
```

Abrir <http://localhost:8000/>. Con doble clic sobre el `.html` el contenido carga, pero el navegador bloquea la tipografía en `file://` y se vería con una fuente de sistema: para juzgar el diseño, usar el servidor.

## Publicar en GitHub Pages

1. Crear un repositorio y subir esta carpeta (el `.gitignore` ya deja fuera los PDFs, el CV lleva teléfono y fecha de nacimiento).
2. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch `main`, carpeta `/docs`**.
3. A los pocos minutos estará en `https://<usuario>.github.io/<repo>/`, con las subrutas `/paper/`, `/taller/` y `/sala/`.

`docs/.nojekyll` evita que GitHub procese la carpeta con Jekyll. Como todas las rutas son relativas, funciona igual en una subruta de repositorio que en un dominio propio.

Todas las páginas llevan `noindex` mientras sean un borrador para presentar. Quitarlo (`<meta name="robots">`) cuando se elija la definitiva.

## Paleta de Taller

| Color | Valor | Uso |
|---|---|---|
| Azul cobalto | `#2a44cf` | Fondo |
| Azul profundo | `#1d33ad` | Visor y «Sobre mi» |
| Naranja | `#ff8a3d` | Acentos: subrayado activo, anillo de foco, rótulos de obra, figuras de FARS teñidas, selección de texto |
| Azul marino | `#0d1650` | Texto sobre naranja (contraste 7,2:1) |

El naranja tiene 3,2:1 sobre el azul (válido para líneas y anillos de foco). No se usa para texto fino sobre azul. Los colores están al inicio de `docs/taller/taller.css`.

## Idiomas (solo Taller)

Botones `cat · es · en` abajo a la izquierda, frente al botón Lista/Tablero. Cambian todo: interfaz, títulos, descripciones, biografía, CV, textos alternativos de las imágenes, el visor y `<html lang>`.

- **Qué idioma sale al entrar:** `?lang=es` en la dirección (útil para enviar un enlace en un idioma concreto) → la última elección guardada en ese navegador → el idioma del navegador si es cat, es o en → inglés.
- **El catalán es el original** (`works.js`). El castellano y el inglés los ha traducido Claude: **Gil debe revisarlos**.
- **Editar traducciones:** `docs/assets/js/i18n.js`. Si se añade una obra o una imagen en `works.js`, hay que añadir su traducción allí; mientras falte, la consola avisa («sin traducción») y se muestra el catalán.
- Los títulos de las obras («Omplint el buit», Rec.0, FARS) se dejan en el original.

## Vista en lista: scroll

La lista tiene su propio contenedor con scroll en vez de usar el de la página. Así la página no cambia de ancho al pasar de Tablero a Lista y los botones del borde no se desplazan. La barra es naranja `#ff8a3d` sobre fondo transparente y sin flechas (`::-webkit-scrollbar` en Chrome/Edge/Safari, `scrollbar-color` en Firefox). También se aplica a «Sobre mí».

## Cómo editar el contenido

- **Textos, años y descripciones de las imágenes:** `docs/assets/js/works.js` (catalán, el original). Las tres propuestas leen de ahí; Taller además traduce con `i18n.js`.
- **Imágenes:** `docs/assets/img/`. Añadir una obra = copiar la foto allí y añadir una línea en `works.js`.
- **Diseño de cada propuesta:** `docs/<propuesta>/*.css` y `*.js`. Los colores y tamaños principales están en las primeras líneas de cada CSS.

## Decisiones y cosas a confirmar con Gil

- **Idioma:** el original es catalán, como su CV y su portafolio. Taller también está en castellano e inglés (traducciones de Claude, por revisar). Paper y Sala siguen solo en catalán.
- **Datos que no se publican:** teléfono y fecha de nacimiento. Solo aparecen el correo y `@gfars_`, que ya están en el portafolio.
- **Erratas corregidas** respecto al CV y el PDF («Disseny y producció» → «Disseny i producció», «escenografá» → «escenografia», «Instal.lacio» → «Instal·lació», «FARRÉSHERNÀNDEZ» → «Farrés Hernàndez»). Conviene que él las revise.
- **Años de formación** tal como constan en el CV (2025 y 2020). Pueden ser año de fin o de inicio: preguntar.
- **Calidad de imagen:** las fotos salen del PDF (≈1090 px de ancho las instalaciones, ≈500 px las de FARS), ya comprimido. Bien para una presentación; para la versión final conviene pedir los originales.
- **Tipografía:** su documento usa *ITC Avant Garde Gothic Pro*. Aquí se usa **Jost** (licencia libre, autoalojada en `assets/fonts/`), muy próxima. Si Gil tiene Adobe Creative Cloud puede cargar la original con Adobe Fonts (revisar la licencia web).
- **Obras sin foto:** «Hamlet» (escenografía, 2024) solo aparece en el listado del CV.
- **Traducción de «Taulell»** (el botón que vuelve del modo lista): «Tablero» en castellano y «Board» en inglés. Cambiable en `i18n.js` (`v_board`).

## Compatibilidad

Probado en Edge/Chromium (escritorio y emulación móvil) a 1920, 1440, 1280, 820 y 390 px. Las funciones recientes tienen alternativa si el navegador no las soporta:

- `animation-timeline: view()` (el gesto de Paper): sin soporte, las fotos se ven enteras sin animación.
- View Transitions (el visor de Taller y Sala): sin soporte, el visor se abre sin transición.
- `prefers-reduced-motion`: Sala apila las salas en vertical, Taller quita la inercia y la animación de entrada.

Accesibilidad: textos alternativos en todas las imágenes (también traducidos), foco visible, navegación completa con teclado (en Taller, Tab recorre las obras y hay una vista en lista), enlace «Salta a la lista d'obres», y los botones de idioma llevan el nombre completo del idioma para lectores de pantalla.
