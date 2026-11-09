# Acuerdos del proyecto · Web de Gil Farrés

*Documento vivo. Estado a 9 de noviembre de 2026. Recoge lo que está decidido, lo que está hecho y lo que falta. La guía técnica (cómo editar, validar y publicar) está en el [README](README.md).*

## 1. El proyecto

- **Qué es:** el portfolio web de Gil Farrés Hernàndez, artista de material y exposiciones (Igualada, Barcelona). Se parte de su portfolio en PDF y de su CV. Esos PDFs no se suben al repositorio.
- **Quién:** Marc lo presenta a Gil y lo mantiene. La intención es que **Gil acabe editándolo él mismo** (ver el punto 6).
- **Dónde está hoy:** GitHub Pages, con el repositorio **público**.
  - Web: <https://marcbasas.github.io/web-gil/>
  - Repositorio: <https://github.com/MarcBasas/web-gil> (rama `main`, se publica la carpeta `docs/`).
- **Estado:** borrador para presentar. Las páginas llevan `noindex` para que Google no las indexe.

## 2. Diseño elegido: Taller (el «Taulell»)

Se presentaron tres propuestas y se eligió la versión azul. La web es esta, y es la página principal (`/`).

| Decisión | Detalle |
|---|---|
| **Idea** | Una mesa de trabajo infinita que se arrastra en todas direcciones, con inercia y dos profundidades. El nombre queda fijo al fondo. |
| **Color** | Azul cobalto `#2a44cf` (el de las cajas de Rec.0) y un acento naranja `#ff8a3d` tomado de la columna naranja de Rec.0 y de las camisetas de FARS. El texto sobre naranja va en azul marino `#0d1650`. |
| **Dónde se usa el naranja** | Subrayado activo, anillo de foco del teclado, rótulo de cada obra al pasar el ratón, enlaces del visor y de «Sobre mí», selección de texto, barra de scroll, y tres figuras de FARS teñidas en el fondo. Se usa poco a propósito. |
| **Tipografía** | **Jost** (licencia libre), muy próxima a la ITC Avant Garde Gothic Pro de su portfolio. Si Gil tiene Adobe Creative Cloud puede cargarse la original con Adobe Fonts, revisando antes la licencia web. |
| **Vistas** | **Tablero** (el lienzo) y **Lista**. Un botón abajo a la derecha alterna entre las dos. |
| **Idioma** | Botones `cat · es · en` abajo a la izquierda, frente al botón de vista. |
| **Scroll de la lista** | Barra naranja, fina, sobre fondo transparente y sin flechas. La lista tiene su propio scroll para que la página no cambie de ancho al alternar vistas y nada se mueva. |
| **Accesibilidad** | Texto alternativo en todas las fotos (también traducido), foco visible, navegación completa con teclado, enlace «saltar a la lista» y botones de idioma con el nombre completo para lectores de pantalla. |

El tablero aprobado tiene **42 fotos**. Cualquier cambio posterior se verificó comparando contra una captura exacta de ese estado: las 42 piezas en la misma posición al píxel, en los tres idiomas.

## 3. Páginas aparcadas: Paper y Sala

Las otras dos propuestas siguen en el repositorio, pero **quedan «mudas»**: nadie enlaza a ellas y no se mantienen.

| | Qué era | Dónde |
|---|---|---|
| **Paper** | Su PDF hecho scroll vertical: fondo blanco, tipografía fina, fotos grandes. | `docs/paper/` |
| **Sala** | Una exposición que se recorre en horizontal, con una sala de color por proyecto y rotulación gigante a modo de vinilo de pared. | `docs/sala/` |

- **Siguen accesibles** escribiendo la dirección (`/paper/`, `/sala/`) y llevan `noindex`, pero no hay ningún enlace desde la web.
- **No se mantienen:** no leen `docs/content/` (usan `docs/assets/js/works.js`, congelado), no tienen idiomas (solo catalán) y no reflejarán los cambios que haga Gil.
- **La página de entrada** que reunía las tres propuestas se ha eliminado, junto con sus miniaturas. Ahora `/` es Taller.
- **La dirección antigua `/taller/`** redirige a `/` y conserva `?lang=` y `#`, por si ya se compartió ese enlace.
- **Recomendación (sin decidir):** borrarlas cuando Gil empiece a usar la web en serio, para no publicar diseños que no lo representan. Es un borrado limpio: `git rm -r docs/paper docs/sala docs/assets/js/works.js`. Los demás archivos compartidos (`viewer.js`, `base.css`, `viewer.css`, el favicon) los usa Taller y se quedan.

## 4. Idiomas

- Tres idiomas: **catalán (cat), castellano (es) e inglés (en)**.
- **El catalán es el original**, tal como sale del CV y del portfolio de Gil.
- **El castellano y el inglés los ha traducido Claude. Gil debe revisarlos**, sobre todo la biografía. Detalles que conviene que mire:
  - «Taulell» se traduce como **Tablero** y **Board**.
  - «Escenografia» se traduce como **Set design** en inglés.
  - El título de la página es «Workshop» en inglés.
  - La biografía en castellano va en masculino («Graduado»), porque su original dice «Graduat».
  - Los títulos de las obras («Omplint el buit», Rec.0, FARS) se dejan en el original.
- **Qué idioma sale al entrar:** el `?lang=` de la dirección (útil para enviar un enlace en un idioma concreto), si no la última elección guardada en ese navegador, si no el idioma del navegador cuando es cat, es o en, y si no, inglés.
- **Si falta una traducción**, se muestra el catalán (nunca queda en blanco) y el validador lo avisa.

## 5. Contenido: lista y tablero

**Regla acordada:**

- **Lista:** muestra *todos* los proyectos y *todas* sus fotos. Sin límite, sin regeneración de nada: añadir contenido solo añade información.
- **Tablero:** muestra solo las fotos que Gil elija, con un **tope que fijamos nosotros** (hoy **42**, porque es el tamaño con el que se diseñó y se probó el lienzo). Lo que no se ve en el tablero **sigue existiendo** y se ve en la lista.
- **Los stickers del fondo no los edita Gil.** Son fijos y viven en su propia carpeta (`docs/assets/stickers/`), independientes de los proyectos: se pueden quitar fotos o proyectos sin que desaparezcan.

**Cómo se comporta el tablero:**

- Si hay más fotos marcadas que el tope, muestra las primeras y avisa por consola. Si no hay ninguna marcada, muestra las primeras para no quedar vacío.
- Con menos fotos se encoge para mantener la densidad, y con más crece. Con 42 queda exactamente igual que el aprobado.
- Los filtros solo ofrecen categorías que tengan alguna foto en el tablero.
- Desde el tablero, el visor ampliado recorre solo las fotos del tablero de ese proyecto. Desde la lista, todas.

**Dónde está el contenido:** ya no está escrito en el código sino en `docs/content/` (`site.json`, `projects.json`, `about.json`), con cada texto en los tres idiomas. El tope es `boardLimit` en `site.json`. **El validador** (`node tools/validate-content.mjs`) detecta errores antes de publicar: más fotos que el tope, fotos que no existen, medidas que no cuadran, texto alternativo vacío, categoría inexistente, identificadores repetidos o archivos rotos.

**Hoy:** las 42 fotos están marcadas, así que el tablero es el aprobado. Gil decidirá cuáles destacar.

## 6. Panel para que Gil edite por su cuenta

**Qué querría poder hacer Gil:**

1. Editar sus textos («Sobre mí»), añadir experiencia y futuros estudios.
2. Crear, editar, ordenar y borrar proyectos, y quitar o añadir fotos a los existentes.
3. Elegir qué fotos salen en el tablero, viendo todas en una cuadrícula con un contador («37/42»), hasta el tope.

**Estado: está planteado, no construido.** Lo que ya existe es la base de datos que necesita (el punto 5). Lo demás es un plan, y las estimaciones no están verificadas.

**Arquitectura prevista:**

- Un **panel propio y pequeño** con tres espacios: Sobre mí, Proyectos y Tablero. No se usa un CMS genérico porque ninguno ofrece bien «elegir N entre todas las fotos con contador y tope».
- **Sin servidor que mantener.** Una función serverless (por ejemplo un Cloudflare Worker) guarda un token de GitHub y publica los cambios de Gil con un commit. Gil **no necesitaría cuenta de GitHub**.
- **Acceso por código al correo** (por ejemplo con Cloudflare Access, gratis por debajo de 50 usuarios). Está por confirmar que encaje con una función serverless.
- **Las fotos se reducen en el navegador** antes de subirlas. Así los originales a máxima resolución nunca llegan al repositorio, y no hace falta un proceso de imágenes aparte.
- **Validación en dos sitios:** en el panel (para avisar a Gil) y en el servidor (porque lo que llega del navegador no es de fiar). Si algo falla, no se publica y la web sigue como estaba.

**Fases (cada una útil por sí sola):**

| Fase | Contenido | Estado |
|---|---|---|
| 1 | Taller guiado por datos con lista completa, tablero con tope y validador. | **Hecha** |
| 2 | La función serverless y el acceso. | Pendiente |
| 3 | Las tres pantallas del panel. | Pendiente |
| 4 | Validación en el servidor, «deshacer último cambio» y pruebas. | Pendiente |

Estimación aproximada para las fases 2 a 4: **tres o cuatro sesiones** de trabajo, sin haberlo construido, así que puede variar.

**Riesgos conocidos:**

- Guardar es publicar: no hay vista previa. Se puede añadir «deshacer» apoyado en el historial de Git, y una vista previa más adelante.
- Si Gil y Marc editan a la vez, uno podría pisar al otro: hay que construir comprobaciones de versión.
- Un cambio tarda 1 o 2 minutos en publicarse, y los visitantes pueden tardar unos minutos más por la caché del hosting. No se ha medido.
- Pedir texto alternativo en tres idiomas por cada foto es mucha carga para Gil. Propuesta: un idioma obligatorio y los otros opcionales, con aviso de lo que falta.
- No se ha confirmado qué permisos exactos necesita el token de GitHub para cada operación.

## 7. Hosting, privacidad y migración

**Hoy:** GitHub Pages con el repositorio **público**. Cualquiera con el enlace puede ver las fotos, el correo y el usuario de Instagram de Gil, y descargar el contenido del repositorio.

**Plan acordado:** cuando Gil empiece a usarlo profesionalmente, **pasar el repositorio a privado y mover el sitio a Vercel o Cloudflare**.

**Qué hay que tener en cuenta** (las fuentes que se consultaron no son siempre oficiales; hay que verificar en los términos de cada plataforma antes de elegir):

- **GitHub Pages con repositorio privado exige un plan de pago**, y aun así el sitio publicado sigue siendo público. En un plan gratuito, al pasar el repositorio a privado **la web se despublicaría**.
- **Vercel:** según su política oficial, el plan gratuito (Hobby) es **solo para uso no comercial**. El uso profesional requiere un plan de pago. Esto pesa en la decisión.
- **Cloudflare Pages:** blogs no oficiales indican que el plan gratuito permite uso comercial y repositorios privados, pero **no está confirmado en sus términos**. Además encajaría de forma natural con el panel de la fase 2, que usaría Workers de Cloudflare.

**Orden recomendado al migrar:**

1. Montar el nuevo hosting conectado al repositorio y comprobar que todo funciona.
2. Cambiar el dominio y quitar `noindex`.
3. **Solo entonces** pasar el repositorio a privado, para no dejar la web caída.
4. Hacerlo **antes de que Gil suba material nuevo**: lo que se haya publicado mientras el repositorio era público queda en su historial y puede haberse copiado.

**Qué configurar al migrar:**

- No hay compilación: la carpeta de salida es `docs/`.
- Como todas las rutas son relativas, funciona igual en un dominio propio. `docs/.nojekyll` deja de hacer falta.
- Conviene fijar la caché de `content/*.json` (en Cloudflare con un archivo `_headers`, en Vercel con `vercel.json`) para que los cambios de Gil se vean pronto.
- Se puede quitar la redirección `docs/taller/` si no hay enlaces antiguos que conservar.

## 8. Contenido y cosas a confirmar con Gil

- **Datos que no se publican:** su teléfono y su fecha de nacimiento. Solo aparecen el correo y `@gfars_`, que ya están en su portfolio.
- **Erratas corregidas** respecto al CV y al PDF («Disseny y producció» → «Disseny i producció», «escenografá» → «escenografia», «Instal.lacio» → «Instal·lació», «FARRÉSHERNÀNDEZ» → «Farrés Hernàndez»). Debería revisarlas él.
- **Años de formación:** 2025 y 2020, tal como constan en el CV. Pueden ser año de inicio o de fin: preguntar.
- **Calidad de las fotos:** salen del PDF, ya comprimidas (unos 1090 px de ancho las instalaciones y unos 500 px las de FARS). Bien para presentar; para la versión final hay que pedirle los originales.
- **«Hamlet»** (escenografía, 2024) solo aparece en el listado del CV, sin fotos.
- **Traducciones al castellano y al inglés:** pendientes de su revisión (punto 4).

## 9. Pendiente

- [ ] Que Gil revise el contenido, las erratas y las traducciones.
- [ ] Pedirle los originales de las fotos.
- [ ] Que Gil elija qué fotos destacar en el tablero (hoy están las 42).
- [ ] Decidir si se borran Paper y Sala (recomendado, cuando use la web en serio).
- [ ] Construir el panel (fases 2 a 4) y confirmar el acceso por correo, sin cuenta de GitHub.
- [ ] Elegir Vercel o Cloudflare (revisando términos de uso comercial) y planificar el paso a repositorio privado.
- [ ] Quitar `noindex` al publicar de verdad.

## 10. Mapa del repositorio

```
ACUERDOS.md             este documento
README.md               guía técnica
tools/
  validate-content.mjs  validador del contenido (sin dependencias)
docs/                   lo que se publica
  index.html            Taller (la web)
  content/              los datos: site.json, projects.json, about.json
  assets/
    css/                base.css, viewer.css, taller.css
    js/                 data.js, i18n.js, taller.js, viewer.js, works.js (solo Paper y Sala)
    img/                fotos de proyectos y retrato
    stickers/           dibujos del fondo (fijos)
    fonts/              Jost (autoalojada)
  taller/               redirección a la raíz
  paper/  sala/         propuestas aparcadas
```
