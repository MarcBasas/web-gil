# Web de Gil Farrés · tres propuestas

Tres maneras distintas de presentar el portafolio de Gil, listas para publicar en GitHub Pages.
Sin build ni dependencias: HTML, CSS y JavaScript actuales, y todas las rutas son relativas.

| Subruta | Propuesta | Idea |
|---|---|---|
| `/` | Hub | Página de entrada para enseñar las tres |
| `/paper/` | **Paper** | El PDF hecho scroll: blanco, tipografía fina, fotos grandes. La foto principal «llena el vacío» al entrar. |
| `/taller/` | **Taller** | Mesa de trabajo infinita en azul cobalto (el de las cajas de Rec.0). Se arrastra en todas direcciones, con inercia y dos profundidades. |
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

## Cómo editar el contenido

- **Textos, años y descripciones de las imágenes:** `docs/assets/js/works.js`. Es la única fuente: las tres propuestas leen de ahí.
- **Imágenes:** `docs/assets/img/`. Añadir una obra = copiar la foto allí y añadir una línea en `works.js`.
- **Diseño de cada propuesta:** `docs/<propuesta>/*.css` y `*.js`. Los colores y tamaños principales están en las primeras líneas de cada CSS.

## Decisiones y cosas a confirmar con Gil

- **Idioma:** catalán, como su CV y su portafolio.
- **Datos que no se publican:** teléfono y fecha de nacimiento. Solo aparecen el correo y `@gfars_`, que ya están en el portafolio.
- **Erratas corregidas** respecto al CV y el PDF («Disseny y producció» → «Disseny i producció», «escenografá» → «escenografia», «Instal.lacio» → «Instal·lació», «FARRÉSHERNÀNDEZ» → «Farrés Hernàndez»). Conviene que él las revise.
- **Años de formación** tal como constan en el CV (2025 y 2020). Pueden ser año de fin o de inicio: preguntar.
- **Calidad de imagen:** las fotos salen del PDF (≈1090 px de ancho las instalaciones, ≈500 px las de FARS), ya comprimido. Bien para una presentación; para la versión final conviene pedir los originales.
- **Tipografía:** su documento usa *ITC Avant Garde Gothic Pro*. Aquí se usa **Jost** (licencia libre, autoalojada en `assets/fonts/`), muy próxima. Si Gil tiene Adobe Creative Cloud puede cargar la original con Adobe Fonts (revisar la licencia web).
- **Obras sin foto:** «Hamlet» (escenografía, 2024) solo aparece en el listado del CV.

## Compatibilidad

Probado en Edge/Chromium (escritorio y emulación móvil) a 1920, 1440, 1280, 820 y 390 px. Las funciones recientes tienen alternativa si el navegador no las soporta:

- `animation-timeline: view()` (el gesto de Paper): sin soporte, las fotos se ven enteras sin animación.
- View Transitions (el visor de Taller y Sala): sin soporte, el visor se abre sin transición.
- `prefers-reduced-motion`: Sala apila las salas en vertical, Taller quita la inercia y la animación de entrada.

Accesibilidad: textos alternativos en todas las imágenes, foco visible, navegación completa con teclado (en Taller, Tab recorre las obras y hay una vista en lista), enlace «Salta al contingut».
