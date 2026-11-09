# Plan: gestor de contenido para Gil

*Estado a 9 de noviembre de 2026: **plan, sin construir** (solo existe la fase 1 de [ACUERDOS.md](ACUERDOS.md#6-panel-para-que-gil-edite-por-su-cuenta): los datos en JSON y el validador). Escrito con el método de `/ponytail` (lo más perezoso que funcione de verdad) y con `/clean` como compuerta de calidad, adaptada a este repo (§7). Cómo usar esas dos skills aquí: §11.*

## 0. Resumen

- **Qué:** una página web pequeña donde Gil edita «Sobre mí», crea y edita proyectos y fotos, y elige las fotos del tablero hasta el tope (hoy 42), sin pasar por Marc.
- **Cómo, en una frase:** una página estática (`/admin/`) y una función del mismo sitio que valida los cambios y los publica como **un solo commit** en GitHub. El login lo hace Cloudflare Access (ninguna línea de autenticación propia) y las fotos se reducen en el navegador (ninguna librería de imágenes).
- **Condición de orden:** se construye **después** de migrar a Cloudflare, porque panel, API y login deben compartir origen (§4).
- **No se construye todavía:** primero tiene que cumplirse el disparador del §1.

## 1. ¿Hace falta? (`/ponytail`, peldaño 1)

Hoy Gil manda el contenido y Marc edita `docs/content/*.json` y pasa el validador. Funciona y cuesta cero.

**El panel merece la pena si se cumple alguno de estos disparadores:**

- Gil quiere cambiar contenido más o menos una vez al mes y no quiere esperar a Marc.
- Marc deja de ser un cuello de botella aceptable (por ejemplo, cuando Gil lo use profesionalmente).

**Alternativa aún más perezosa, que hay que descartar con conocimiento de causa:** un CMS ya hecho (Pages CMS o Sveltia) más una validación automática al publicar. Cubre más o menos el 80 %. Falla en tres cosas:

1. **El tope de fotos sin contador:** Gil descubriría que se pasó al guardar, no mientras elige.
2. **Fotos sin reducir:** los originales a máxima resolución acabarían en el repositorio.
3. **Listas anidadas con tres idiomas:** el soporte multiidioma de Decap no las gestiona bien; en los demás no está comprobado.

> **Omitido:** el panel entero, hasta el disparador. **Reconsiderar la alternativa del CMS** si la fase 1 del §6 (el spike) falla o el panel resulta demasiado caro.

## 2. Lo que el panel debe cumplir (ya acordado)

- Tres espacios: **Sobre mí**, **Proyectos** (crear, editar, ordenar, borrar, y fotos) y **Tablero** (todas las fotos en cuadrícula, clic para marcar, contador «n/42», bloqueo al llegar al tope).
- **Lista = todo, sin límite. Tablero = solo lo marcado, hasta `boardLimit`** (en `site.json`).
- **Los stickers no se editan.**
- Cada texto en cat, es y en; el catalán es obligatorio y lo que falte se ve en catalán.
- Gil **no necesita cuenta de GitHub**.
- Si algo no valida, **no se publica** y la web sigue como estaba.

## 3. Diseño perezoso, peldaño a peldaño

Orden de la escalera de `/ponytail`: ¿hace falta?, ¿ya existe en el repo?, ¿lo hace la plataforma?, ¿una dependencia que ya tenemos?, y solo entonces código mínimo.

| Necesidad | Lo más perezoso que funciona | Omitido → añadir cuando |
|---|---|---|
| **Login** | Cloudflare Access con código al correo (es configuración, no código). La función valida el JWT con el plugin oficial de Access para Pages Functions, o con ~30 líneas de WebCrypto. | Usuarios, contraseñas propias o roles → cuando haya más de un editor. |
| **Base de datos** | El propio repositorio: los tres JSON. | Una BD → nunca, con unos 6 proyectos. |
| **Backend** | Una función del mismo sitio. Sin framework ni Octokit: `fetch` a la API de GitHub. | Un framework → cuando haya más de ~6 rutas. |
| **Publicar** | Un guardado = **un commit atómico** (API Git Data: blobs → árbol → commit → rama). Deshacer pasa a ser revertir un commit. | La API Contents, archivo a archivo, es más simple pero puede dejar estados a medias (el JSON apuntando a una foto que aún no existe) y lanza varios despliegues. Solo si el atómico se complica. |
| **Fotos** | Reducirlas en el navegador con `createImageBitmap` y `<canvas>` a JPEG de unos 2000 px. Las medidas `w`/`h` salen de ahí. | `sharp` o un proceso en GitHub Actions → cuando se midan problemas de rendimiento o hagan falta AVIF y varios tamaños. |
| **Interfaz** | HTML, CSS y JS nativos, sin framework ni compilación: `<form>`, `<dialog>`, `<details>`, botones ↑↓ para ordenar. Se reutilizan `base.css`, las variables de `taller.css` y el patrón de miniaturas de la vista Lista. | Arrastrar y soltar o un framework → cuando ordenar con ↑↓ moleste a Gil. |
| **Validación** | **Una sola función pura**, extraída de `tools/validate-content.mjs`, que usan la línea de comandos, el panel y el servidor. | Esquemas JSON o Zod → no, no compensa. |
| **Conflictos** | Comparar el SHA de cada JSON que Gil cargó con el actual. Si difiere, error 409 y «recarga». | Fusión automática de cambios → cuando dos personas editen a la vez. |
| **Deshacer** | Git: Marc revierte el commit. | Botón «Deshacer último cambio» → cuando Marc tenga que revertir a mano dos veces. |
| **Vista previa** | Ninguna: guardar es publicar. | Borradores en una rama → si Gil lo pide o tras el primer susto. |
| **Idioma del panel** | Solo catalán. | es / en → si entra otro editor. |
| **Stickers** | No editables (acordado). | Nunca. |
| **Caché** | Cabecera `Cache-Control` corta para `content/*.json` en el hosting. | Nombres de archivo versionados → si la caché molesta. |

En el código, cada simplificación con un techo conocido lleva un comentario `ponytail:` con ese techo y el camino de mejora.

## 4. Dependencia de hosting: el panel se construye tras migrar

El panel, la API y el login deben estar en el **mismo origen**. Con el panel en GitHub Pages y la función en otro dominio, la cookie de Access sería de terceros y los navegadores las bloquean cada vez más (**hipótesis sin verificar**). Por eso:

1. **Primero se migra a Cloudflare** (ver ACUERDOS.md §7). Según blogs, Cloudflare recomienda hoy *Workers con Static Assets* para proyectos nuevos, y Pages sigue funcionando; **hay que confirmarlo en su documentación oficial** al migrar.
2. **Después se monta el panel** en ese mismo sitio.

**Vercel complica esto:** no tiene un equivalente gratuito de Access, así que habría que escribir un login propio (enlace mágico por correo, por ejemplo). Es más código y más superficie de seguridad. Es un punto más a favor de Cloudflare, además de que el plan gratuito de Vercel es solo para uso no comercial.

**Lo que dice la documentación de Cloudflare** (comprobado en una búsqueda): una función detrás de Access **debe validar el JWT** de la cabecera `Cf-Access-Jwt-Assertion` (emisor, audiencia y caducidad). Proteger solo en el borde no basta, y conviene cerrar el acceso directo por `*.pages.dev` o `*.workers.dev`.
**Sin verificar:** cómo se acota Access a `/admin` y `/api` en un mismo dominio, y los límites del plan gratuito.

## 5. Flujo de un guardado

```
Navegador (Gil)                  Función (mismo sitio)               GitHub
  |  código al correo ──────────► Access (en el borde)
  |  GET /api/content ──────────► valida JWT ─► lee 3 JSON + SHAs ──►
  |  ◄──────────── JSON + SHAs
  |  (edita; reduce fotos con canvas)
  |  POST /api/save ────────────► valida JWT
  |    {JSON, fotos, SHAs}        valida el contenido (función pura única)
  |                               compara SHAs (409 si cambiaron)
  |                               blobs ─► árbol ─► commit ─► rama ───► main
  |  ◄──────────── 200 {commit}                                       |
  |                                           el hosting republica (1-2 min) ◄┘
```

## 6. Fases

Cada fase es útil por sí sola y tiene un criterio de «hecha» y una compuerta (§7).

**Fase 0: prerrequisitos (sin panel)**

- **Versionar la batería de pruebas.** Hoy vive fuera del repo, en una carpeta temporal. Se llevaría a `tests/`: la foto fija del tablero (la que prueba que no cambia nada), los escenarios del tablero y el tope, los idiomas y el scroll, y la redirección. Única dependencia de desarrollo: `playwright-core`, que usa el Edge o Chrome ya instalado. Sin `package.json` de producción.
- **Extraer la validación** a una función pura (sin `fs`) y dejar la línea de comandos como un envoltorio fino.
- **Migrar el hosting** (§4): decisión de Marc.
- *Hecha cuando:* un solo comando pasa todas las pruebas en local y contra la web publicada.

**Fase 1: spike de una sesión, sin interfaz**

- Una función que lee y escribe **un cambio trivial** (por ejemplo `portfolioYear`) como commit, detrás de Access.
- *Hecha cuando:* alguien entra con el código al correo, cambia un campo, se publica; el JWT se valida; y se prueba que **sin sesión se rechaza**.
- **Si falla** (por ejemplo, Access no se deja acotar a esas rutas): se replantea con la alternativa del CMS (§1).

**Fase 2: panel v1, una página con tres secciones**

- **Sobre mí:** biografía, estudios y experiencia (añadir, quitar, ↑↓), en tres idiomas.
- **Proyectos:** crear, editar, ordenar y borrar. Fotos: subir (reducidas en el navegador), quitar, ↑↓, y texto alternativo (catalán obligatorio, los otros opcionales).
- **Tablero:** cuadrícula con todas las fotos, clic para marcar, contador «n/42», bloqueo al llegar al tope, filtro por proyecto.
- **Estados** de cada pantalla: cargando, vacío, error, guardando, «publicando…», guardado y conflicto.
- *Hecha cuando:* Gil, sin ayuda, (a) añade una experiencia, (b) crea un proyecto con 3 fotos y (c) cambia 5 fotos del tablero.

**Fase 3: endurecer**

- Validación del servidor idéntica a la del panel, con mensajes claros.
- Límites de tamaño y de número de fotos por guardado.
- Pruebas de abuso: JSON manipulado a mano, más de 42 marcadas, una ruta con `..`, un archivo que dice ser JPEG y no lo es, una imagen enorme.
- Recordatorio de la caducidad del token de GitHub.
- Una guía de una página para Gil, en catalán.

**Fase 4: solo lo que se pida** (la columna «Omitido» del §3).

## 7. Compuerta `/clean`, adaptada a este repo

`/clean` está escrita para Aurea (`pnpm`, `biome`, `react-doctor`, Prisma, `next-intl`, `knip`, el escáner `scan.mjs`, reglas de React y Next). **Nada de eso aplica aquí.** Lo que sí se conserva es la pasada de «listo para producción», que en este repo es:

1. **Ponytail al máximo** sobre cada pieza nueva: ¿hace falta?, ¿ya existe aquí?, ¿lo cubre la plataforma?
2. **DRY:** una sola validación, un solo `esc`, los estilos base ya existentes. Nada paralelo.
3. **Borrar:** código y archivos huérfanos (`works.js` y Paper y Sala si se retiran), claves de interfaz sin uso, trazas de depuración, TODOs viejos.
4. **Comentarios:** sin banners ni narración; sí el porqué y los `ponytail:` con su techo. Los comentarios del código del sitio van en catalán (estilo local); los documentos, en castellano.
5. **Producción:**
   - Validar **siempre en el servidor**.
   - Secretos solo en variables de la función, nunca en el repo ni en el navegador.
   - Estados de vacío, error y carga.
   - Accesibilidad básica: etiquetas, foco y teclado.
   - Ninguna dependencia nueva sin justificarla.
6. **Verificar:**
   - El validador sin errores.
   - La batería de pruebas en verde.
   - La foto fija **idéntica**, cuando la fase no deba cambiar el tablero.
   - Una prueba en navegador real, sin errores de consola ni 404.
7. **Informe:** qué se recortó, qué se mantuvo y por qué, y qué queda para que Marc decida.

## 8. Lo que no se simplifica

Aunque todo lo demás se recorte: la validación en el servidor, la autenticación y la validación del JWT, los secretos fuera del repo, los límites de tamaño, la accesibilidad y la comprobación de versión que evita pisar cambios ajenos.

## 9. Riesgos y verificaciones pendientes

| Qué | Cómo se comprueba | Verificado |
|---|---|---|
| Access acotado a `/admin` y `/api` en el mismo dominio, y acceso directo por `workers.dev` o `pages.dev` cerrado | Spike de la fase 1 | No |
| Número de subpeticiones por invocación en el plan gratuito, frente a las fotos de un guardado (cada foto es una llamada a GitHub) | Mirar los límites oficiales y probar con 20 y con 40 fotos; si no cabe, guardar por lotes | No |
| Permisos exactos del token de GitHub (acceso a un solo repo, escritura de contenido) y su caducidad | Documentación de GitHub y prueba | No |
| Fotos de móvil en HEIC: el navegador puede no decodificarlas | Probar con el móvil de Gil | No |
| Peso final por foto (objetivo: menos de ~500 KB) y tiempo de subida con su conexión | Prueba real | No |
| Caché de los JSON tras un guardado | Medir cuánto tardan los cambios en verse | No |
| Que todo funcione igual con el repositorio **privado** | Prueba tras migrar | No |

## 10. Decisiones pendientes

- ¿Se cumple ya el disparador del §1? ¿Cuántas veces al mes querrá editar Gil?
- **Hosting:** Cloudflare (recomendado para esto) o Vercel, revisando los términos de uso comercial.
- ¿El panel solo en catalán? ¿Prefiere Gil otro idioma?
- ¿Escribirá Gil el castellano y el inglés, o solo el catalán y los revisamos nosotros?
- ¿Se borran Paper y Sala antes de empezar?
- Cómo activar `/ponytail` y `/clean` en este repo (§11).

## 11. Cómo usar `/ponytail` y `/clean` aquí

Las dos viven en el proyecto Aurea (`...\Aurea\aurea.gg\.claude\skills\`). El archivo `Web Gil\.claude\skills.lnk` apunta allí, pero Claude Code no carga un acceso directo: **no están activas en este repo.**

- **`/ponytail`** es genérica (alguna referencia a shadcn no aplica). Se puede copiar a `~/.claude/skills/ponytail`, a nivel de usuario, para usarla en cualquier proyecto.
- **`/clean`** es específica de Aurea: no conviene copiarla tal cual. La opción es escribir una versión breve para este repo a partir del §7.
- El `.gitignore` de este repo excluye `.claude/`: si se quiere versionar una skill, hay que excluirla de esa regla.
- Mientras tanto, este plan ya aplica su método y se puede seguir a mano.
