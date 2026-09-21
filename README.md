# Guía rápida de japonés

Chuleta de japonés en una sola página HTML, pensada para el móvil. Acompaña al
curso de **Genki**: no lo resume, recoge lo que se olvida.

**Publicada en:** https://carcaret.github.io/japanese-quick-guide/

Cada palabra japonesa subrayada se toca y muestra su romaji; se vuelve a tocar
y se esconde. La transliteración se calcula en el momento (Hepburn literal:
せんせい → *sensei*, がっこう → *gakkou*), con っ, ん + apóstrofo, la ー del
katakana y las partículas は・へ・を separadas y leídas *wa*, *e*, *o*.

Contenido actual (Genki L1–3): pestaña *Guía* (sonidos, partículas, tiempo y に,
こそあど, interrogativos, negación de です, expresiones), *Verbos* (los tres grupos y el
presente ます／ません), *Números* y *Contadores*.

## Cómo está montado

- `index.html` — la guía entera: HTML, CSS y JS en un único fichero, sin
  dependencias ni build. Se puede abrir directamente desde el disco.
- `manifest.webmanifest`, `sw.js`, `icons/` — lo que la convierte en PWA:
  se instala en el móvil, se abre a pantalla completa y funciona sin conexión.
- `tools/make-icons.py` — genera los iconos (un 日 blanco sobre azul) sin
  dependencias ni fuentes instaladas: `python3 tools/make-icons.py`.
- `.github/workflows/pages.yml` — publica el repo tal cual en GitHub Pages en
  cada `push` a `master`.

La única dependencia externa es la tipografía Zen Kaku Gothic New de Google
Fonts; sin conexión, el navegador cae en la fuente japonesa del sistema
(en iOS, Hiragino Sans).

## Instalarla en el iPhone

Safari → **Compartir → Añadir a pantalla de inicio**. Para tenerla instalada
sin verla en ningún escritorio: dejar el icono solo en una página nueva y
ocultar esa página (mantener pulsado el fondo → los puntitos → desmarcarla).
Sigue saliendo al buscar "Japonés" en Spotlight. Un icono de web no aparece
en la Biblioteca de Apps, así que **borrarlo del escritorio es desinstalarlo**.

## Criterios (lo decidido, para no volver a discutirlo)

**Qué entra.** Lo que se olvida o se confunde, no todo lo que dice Genki. Si
ya te lo sabes, fuera: por eso no hay いち・に・さん, y de los números solo
está lo irregular. Lo básico de la lección 1 (X は Y です, か, saludos) se
descartó a propósito; si alguna vez se escapa, entonces se añade. は sigue en
*Partículas* pero es candidata a salir.

**Vocabulario, no.** El vocabulario va en Anki, no aquí. Por eso los ejemplos
son los justos: uno por regla, y solo donde la regla no se entiende sin él. La
lista de verbos del conjugador es la excepción aparente, y está por las
conjugaciones, no por lo que significan.

**Cómo se ordena.** Por temas, no por lecciones: Genki ya va por lecciones, y
la gracia de esta página es ver todas las partículas juntas aunque vengan de
cuatro sitios. Sí conviene poder rastrear de dónde sale cada cosa.

**Móvil primero.** Nada de tablas anchas ni scroll lateral: para datos de
consulta, un `<select>` y la respuesta en vertical (así está *Contadores*).
Todo lo largo, dentro de `<details class="more">`.

**Pestañas: leer frente a consultar.** *Guía* se lee de corrido; *Números* y
*Contadores* se consultan. Por eso están separadas. *Verbos* va la segunda, justo
detrás de *Guía*: primero lo que se lee, luego lo que se consulta. Tiene pestaña
propia y no sección dentro de *Guía* porque es lo que más va a crecer (forma-te en
L6, pasado en L9…). La siguiente natural es *Adjetivos* (L5).

**Un solo fichero.** Aunque llegue a las 23 lecciones son ~150 KB: sigue
funcionando sin conexión, se despliega de una pieza y buscar dentro de una
página gana a navegar entre varias.

**Kana o kanji.** Los ejemplos de la *Guía* van en kana. En *Verbos* van en
kanji con furigana (`<ruby>`), que es la forma de irse familiarizando con él sin
perder la lectura. El romaji automático lo soporta: `leer()` recorre el elemento
y dentro de un `<ruby>` se queda con el `<rt>` en lugar del kanji, así que
`<ruby>食<rt>た</rt></ruby>べる` se transcribe *taberu* y no *食taberu*. No hace falta
`data-romaji` (el atributo sigue existiendo por si algún caso se resiste).

**Los datos se calculan, no se copian.** Las lecturas de los contadores, el
presente de los verbos y el romaji salen de reglas, no de listas escritas a
mano. Añadir algo es una línea y no puede quedar incoherente con el resto. Cada
verbo se guarda una sola vez, con la lectura del kanji entre corchetes
(`食[た]べる`), y de ahí salen el furigana que se pinta y el kana que lee el
romaji.

## Actualizar la guía

Editar `index.html`, comprobarlo en el navegador y:

```sh
git add -A && git commit -m "..." && git push
```

En un par de minutos la Page queda actualizada (pestaña *Actions* del repo).
La copia instalada en el móvil se actualiza sola al abrirla con conexión: el
service worker pide siempre la versión de la red y solo tira de la copia
guardada si no hay.

**Subir la versión en cada entrega**, en el `<span class="ver">` del
encabezado: `v1` → `v2`. Es un contador a secas, sin puntos, y sirve para dos
cosas: mirar el móvil y saber si tienes lo último, y descartar la caché vieja
del service worker. No hay un segundo número que mantener: `index.html` se lo
pasa al SW en la URL de registro (`sw.js?v1`) y `sw.js` lo lee de
`self.location.search`. Cambiar esa URL basta además para que el navegador se
baje el `sw.js` nuevo, que antes era la razón de tocarlo al mover los iconos.

### Convenciones del HTML

- La página tiene **pestañas**: cada una es un `<div class="panel" id="...">`
  dentro de `<main>`, con su `<button data-panel="...">` en `.tabs`. Se navega
  por `#hash` (vale tanto `#numeros` como `#kosoado`, que abre su pestaña y
  baja a la sección), así que el botón atrás funciona.
- El `<nav>` de secciones es solo de la pestaña *Guía*; se oculta en las demás.
- Cada sección es un `<section id="...">` con su enlace en el `<nav>`.
- Una sección se compone de `.card` con `.item` dentro (un concepto por
  `.item`); `.sub` para las líneas secundarias.
- Lo ampliable va en `<details class="more"><summary></summary><div class="body">…`
  (el botón "＋ más" lo pone el CSS; el `<summary>` va vacío a propósito).
- Tablas de dos columnas: `.rows` con pares `.k` / `.v`.
- Palabra japonesa tocable: `<span class="jp">`. Con kanji, dentro va
  `<ruby>漢<rt>かん</rt></ruby>字`; el romaji sale solo de la lectura.
- **Un solo margen lateral, 18 px**, para `header`, `.tabs`, el `<nav>` y
  `main`: las pestañas y las píldoras de sección tienen que arrancar justo
  encima del borde de las tarjetas.
- **`.sub` es solo para ejemplos.** La regla, el uso o la aclaración van en la
  línea principal (`<p>` del `.item`). Si hay varios usos, cada uno en su línea
  principal numerada (1), 2)…) con sus ejemplos debajo: sin número, dos líneas
  principales seguidas se leen como un solo párrafo.
- Tablas `.rows` cuando hay tres o más pares paralelos (palabra → significado,
  forma → uso); ejemplos sueltos, en `.sub`.
- Las `.sub` se distinguen por un **filete vertical**, no solo por la sangría.
  Con la sangría sola no se sabe si una línea es la continuación de la de
  arriba o una línea secundaria nueva, y en el móvil casi todo da la vuelta.
  Probado antes con sangría francesa en los `<p>` del `.item`: arregla la
  continuación pero la deja idéntica a la `.sub` de debajo.
- `.jp` lleva `white-space:nowrap`: el japonés se corta entre kana sin avisar y
  partía las palabras (y su subrayado) por la mitad. Los cortes quedan entre
  spans, en los `、` y los `・`. Para texto japonés suelto fuera de `.jp`, `.nb`.
  **No usar `word-break:keep-all`**: en Chrome hace lo esperado, pero Safari
  suprime además el corte en `・`, y una lista como
  `いっぷん・さんぷん・…・なんぷん` se vuelve indivisible y desborda la pantalla.
  Comprobar los cambios de corte con `documentElement.scrollWidth` a 393 px, no
  solo a ojo, y recordar que el móvil del usuario es Safari.
- Colores siempre por variable CSS (`--ai`, `--ok`, `--ng`, …): así el modo
  oscuro sale solo.
- Nada de `id` repetidos entre pestañas: el `#hash` los usa para saber qué
  pestaña abrir.

### Romaji

- Texto japonés: `<span class="jp">…</span>`, y nada más; el romaji lo pone el
  JS al tocarlo, también en lo que se genera al vuelo (por eso los eventos van
  por delegación en `document`, no elemento a elemento).
- Cuando la regla no puede acertar, se fuerza con `data-romaji="…"`. Hoy hay
  cuatro casos: わたしも (separar も por regla rompería palabras como *kodomo*)
  y los saludos こんにちは / こんばんは, que se escriben de una pieza.
- El lector en voz alta se quitó a favor del romaji; está en el historial
  (`git log -S SpeechSynthesis`) por si vuelve.

### Contadores

No se escriben a mano: se calculan con las mismas clases del apéndice de Genki
(pp. 380-381). Añadir uno es una línea en `CONTADORES`:

```js
{g:'Cosas', lab:'〜杯', es:'tazas y vasos', kana:'はい', clase:'hpb'}
```

- `clase`: `hp`, `hpb`, `k`, `kg`, `s`, `sz`, `t`, `p` o `-` (sin cambio).
- `over`: lecturas sueltas que se salen de su clase (`{4:'よじ'}`).
- `esp`: lista completa de las 11 lecturas, para los que no siguen regla
  ninguna (〜つ, 〜日).
- `.irr` (azul) lo pinta solo lo que se desvía del patrón; no se marca a mano.

### Cómo comprobar antes de subir

En este NAS no hay Node, así que la lógica se verifica en un contenedor
efímero: se extrae el bloque de JS a un fichero bajo `/home/carcaret`
(visible desde el host) y se ejecuta contra todos los casos de la página.

```sh
docker run --rm -v /home/carcaret:/t:ro node:22-alpine node /t/check.js
```

El truco: el propio `index.html` es la entrada. Se extrae el `<script>` y se
ejecuta con un `document` de pega, así que lo que se prueba es el código de la
página y no una copia. Así se comprobaron las 253 lecturas de los 23 contadores
contra la tabla del libro, el presente de los 13 verbos, y el romaji de todas
las palabras tocables — incluido el de las que llevan furigana, que no puede
dejar ningún kanji sin leer.

### Trampas del despliegue

- La rama es **`master`**, no `main`.
- El entorno `github-pages` solo permite desplegar desde la rama que fuera la
  principal al activar Pages. Si se renombra la rama, además del
  `default_branch` hay que tocar
  `/repos/{owner}/{repo}/environments/github-pages/deployment-branch-policies`,
  o el job falla **sin pasos ni logs**.
- Activar Pages la primera vez es manual (Settings → Pages → Source: GitHub
  Actions): no lo puede hacer ni un token ni el `GITHUB_TOKEN` del workflow.
- Para relanzar un despliegue sin cambios, commit vacío: no hay permiso de
  `workflow_dispatch`.
- GitHub Pages sirve `index.html` con `Cache-Control: max-age=600`. El `fetch`
  del service worker pasa por la caché HTTP del navegador, así que "red
  primero" no bastaba: durante 10 minutos seguías viendo la página vieja aunque
  el despliegue hubiera terminado. Por eso la navegación pide
  `cache:'no-cache'`, que revalida contra el servidor. Para comprobar qué hay
  publicado de verdad, `curl` a la URL, no el móvil.

## Ideas pendientes

- **Buscador** que filtre al escribir, a través de todas las pestañas. Es lo
  que más va a hacer falta cuando haya varias lecciones más.
- **Etiqueta de lección** (L1, L2…) en cada ítem, con filtro "hasta la N", para
  repasar sin adelantarse y saber de dónde salió cada cosa.
- Pestaña de **Adjetivos** cuando llegue L5.
- Audio otra vez, como opción, si el romaji deja de bastar.
