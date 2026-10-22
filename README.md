# Guía rápida de japonés

Chuleta de japonés en una sola página HTML, pensada para el móvil. Acompaña al
curso de **Genki**: no lo resume, recoge lo que se olvida.

**Publicada en:** https://carcaret.github.io/japanese-quick-guide/

Cada palabra japonesa subrayada se toca y muestra su romaji; se vuelve a tocar
y se esconde. La transliteración se calcula en el momento, en Hepburn: palabra
a palabra (にほんごの せんせい → *nihongo no sensei*), con macrón en las vocales
largas (がっこう → *gakkō*, コーヒー → *kōhī*, pero せんせい → *sensei* y
おにいさん → *oniisan*), っ, ん + apóstrofo y las partículas は・へ・を leídas
*wa*, *e*, *o*.

Contenido actual (Genki L1–3 y L4 hasta el punto 2): pestaña *Guía* (orden de las palabras, sonidos, partículas, tiempo y に,
こそあど, interrogativos, negación de です, hay: ある・いる y posición, expresiones), *Verbos* (los tres grupos, el
presente ます／ません, invitar con 〜ませんか y proponer con 〜はどうですか), *Palabras* (frecuencia y ubicación), *Números* y *Contadores*.

## Cómo está montado

- `index.html` — la guía entera: HTML, CSS y JS en un único fichero, sin
  dependencias ni build. Se puede abrir directamente desde el disco.
- `manifest.webmanifest`, `sw.js`, `icons/` — lo que la convierte en PWA:
  se instala en el móvil, se abre a pantalla completa y funciona sin conexión.
- `tools/make-icons.py` — genera los iconos (un 日 blanco sobre azul) sin
  dependencias ni fuentes instaladas: `python3 tools/make-icons.py`.
- `tools/check.js` — las pruebas: ejecuta el `<script>` de `index.html` contra
  casos conocidos (ver *Cómo comprobar antes de subir*).
- `.github/workflows/pages.yml` — publica el repo tal cual en GitHub Pages en
  cada `push` a `master`.
- `examenes/` — aparte de la guía: exámenes de repaso en PDF para imprimir, la
  skill que los genera y sus scripts (ver `examenes/README.md`).

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
conjugaciones, no por lo que significan. La otra excepción son las **familias
cerradas** que se aprenden en bloque, donde lo útil es verlas juntas: la escala
de frecuencia (el orden y qué pide negativo) y las palabras de ubicación (por
parejas de opuestos). Van en la pestaña *Palabras*, como listas de consulta;
no es un cajón para vocabulario suelto.

**Cómo se ordena.** Por temas, no por lecciones: Genki ya va por lecciones, y
la gracia de esta página es ver todas las partículas juntas aunque vengan de
cuatro sitios. Sí conviene poder rastrear de dónde sale cada cosa.

**Móvil primero.** Nada de tablas anchas ni scroll lateral: para datos de
consulta, un `<select>` y la respuesta en vertical (así está *Contadores*).
Todo lo largo, dentro de `<details class="more">`.

**Pestañas: leer frente a consultar.** *Guía* se lee de corrido; *Palabras*,
*Números* y *Contadores* se consultan. Si una lista tiene una regla detrás (el
patrón Y の 前, に o で), la regla se queda en *Guía* y enlaza a la lista. Por eso están separadas. *Verbos* va la segunda, justo
detrás de *Guía*: primero lo que se lee, luego lo que se consulta. Tiene pestaña
propia y no sección dentro de *Guía* porque es lo que más va a crecer (forma-te en
L6, pasado en L9…). La siguiente natural es *Adjetivos* (L5), pero con cinco
pestañas ya no cabe una sexta a 375 px: habrá que decidir dónde va.

**Un solo fichero.** Aunque llegue a las 23 lecciones son ~150 KB: sigue
funcionando sin conexión, se despliega de una pieza y buscar dentro de una
página gana a navegar entre varias.

**Kana o kanji.** Las palabras del vocabulario de Genki ya visto van en kanji
con furigana (`<ruby>`), igual que las escribe Genki; lo que Genki escribe en
kana (うち, だれ, いつも…) o aún no ha salido, en kana. Así uno se va
familiarizando con el kanji sin perder la lectura. Excepciones a propósito:
*Sonidos* y *Números* van en kana, porque lo que enseñan es cómo se escribe o se
lee en kana. El romaji automático lo soporta: `leer()` recorre el elemento
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
- Cada sección es un `<section id="...">` que empieza por su `<h2>`. De ahí
  salen solos los chips del `<nav>` de la pestaña: el título hasta los dos
  puntos ("Tiempo: ¿lleva に?" → *Tiempo*). No hay lista que mantener: una
  sección nueva ya tiene su chip. Una pestaña con una sola sección no muestra
  índice. `check.js` comprueba que todas tengan `id` y `<h2>`.
- Los títulos (`<h2>`, `<h3>`) se escriben normales, con mayúscula solo al
  principio; las MAYÚSCULAS las pone el CSS. Así el chip sale bien escrito y un
  lector de pantalla no los deletrea.
- Una sección se compone de `.card` con `.item` dentro (un concepto por
  `.item`); `.sub` para las líneas secundarias.
- Lo ampliable va en `<details class="more"><summary></summary><div class="body">…`
  (el botón "＋ más" lo pone el CSS; el `<summary>` va vacío a propósito).
- Tablas de dos columnas: `.rows` con pares `.k` / `.v`.
- Palabra japonesa tocable: `<span class="jp">`. Con kanji, dentro va
  `<ruby>漢<rt>かん</rt></ruby>字`; el romaji sale solo de la lectura. Si dentro
  hay más de una palabra, cada límite va marcado (ver *Romaji*).
- **Un solo margen lateral, 18 px**, para `header`, `.tabs`, el `<nav>` y
  `main`: las pestañas y las píldoras de sección tienen que arrancar justo
  encima del borde de las tarjetas.
- **`.sub` es solo para ejemplos.** La regla, el uso o la aclaración van en la
  línea principal (`<p>` del `.item`). Si hay varios usos, cada uno en su línea
  principal numerada (1), 2)…) con sus ejemplos debajo: sin número, dos líneas
  principales seguidas se leen como un solo párrafo.
- Tablas `.rows` para listas de consulta, donde el par es el contenido
  (palabra → significado, forma → uso). Los ejemplos van siempre en `.sub`,
  aunque sean varios.
- Lo que define un ítem (la partícula, la expresión: は, 何, すみません…) va al
  principio en `.head`: negrita y algo más grande, para encontrarlo de un vistazo.
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
- **Lo nuevo se marca con `data-nuevo="AAAA-MM-DD"`** en su `.item`, con la
  fecha en que entra. El script resalta la fecha más reciente de la página: el
  ítem sale con fondo morado, y su chip y su pestaña con un punto. Va por fecha
  y no por versión para que una tanda subida en varias versiones el mismo día
  salga junta. No se quita nunca a mano: la siguiente tanda trae una fecha más
  reciente y releva a la anterior; un arreglo suelto no lleva marca. Un ítem que
  solo cambia un poco se marca entero. Los verbos del conjugador llevan
  `nuevo:'AAAA-MM-DD'` en `VERBOS` (salen con «· nuevo» en el desplegable) y
  la tarjeta del conjugador, su `data-nuevo`.
- Colores siempre por variable CSS (`--ai`, `--ok`, `--ng`, …): así el modo
  oscuro sale solo.
- Nada de `id` repetidos entre pestañas: el `#hash` los usa para saber qué
  pestaña abrir.

### Romaji

- Texto japonés: `<span class="jp">…</span>`, y nada más; el romaji lo pone el
  JS al tocarlo, también en lo que se genera al vuelo (por eso los eventos van
  por delegación en `document`, no elemento a elemento).
- **Cada palabra, marcada.** El kana no separa palabras y el romaji sí
  (*nihongo no sensei*, *mō ichido*), así que donde acaba cada una lo dice el
  texto, no el código: un espacio entre bloques, como en Genki, y `<wbr>`
  dentro de un bloque: `にほんご<wbr>の せんせい`, `もう<wbr>いちど`,
  `たべます<wbr>か`. Partículas, です, ください y el する de los compuestos
  van aparte; ます y los sufijos (さん, ごろ, えん) van pegados. Adivinarlo con
  reglas no sale: separar la も de わたしも rompe *kodomo*. Los compuestos con
  する de *Verbos* se marcan solos (`enPalabras`).
- `<wbr>` va oculto dentro de `.jp`: es un punto de corte, y Chrome cortaba por
  él pese al `nowrap` (Safari no).
- El macrón se pone dentro de cada palabra: お+う / お+お → ō, う+う → ū,
  あ+あ → ā, え+え → ē, y la ー alarga cualquier vocal (ビール → *bīru*). い no
  alarga: *oniisan*, *sensei*.
- Pero no a través de un límite de morfema, y el furigana los marca: el borde
  de cada `<rt>`. La う de 思う va fuera de la lectura, es terminación y no
  alarga: `<ruby>思<rt>おも</rt></ruby>う` → *omou* (igual 拾う *hirou*, 吸う
  *suu*), y 子馬 → *kouma*. Una vocal larga de verdad va siempre dentro de una
  misma lectura (`<rt>おお</rt>きい`, `<rt>とうきょう</rt>`).
- **En kana suelto el límite se marca a mano**, con `&zwnj;` (invisible): un
  verbo en おう / うう que vaya en kana se escribe `おも&zwnj;う` → *omou*; sin
  marca saldría *omō*. Es el mismo carácter que pone el furigana, así que el
  código no distingue uno de otro.
- **Nombres propios y sufijos de trato.** Un nombre de persona o de lugar va
  en `<span class="propio">`, que abarca la palabra desde su principio, y sale
  con mayúscula; un sufijo de trato (さん,
  先生, くん, ちゃん, さま) se une con `<wbr class="sufijo">` y sale con guion:
  `<span class="propio">たなか</span><wbr class="sufijo">さん` → *Tanaka-san*,
  `<span class="propio"><ruby>京都<rt>きょうと</rt></ruby></span>` → *Kyōto*.
  Los idiomas van en minúscula, como en español: 日本 → *Nihon*, pero 日本語 →
  *nihongo*. ごろ y えん no son de trato y van pegados (*sanjigoro*).
- La puntuación 、。？！ también separa palabras: `わたし<wbr>は、` → *watashi wa,*.
- Cuando la regla no puede acertar, se fuerza con `data-romaji="…"`. Hoy solo
  los saludos こんにちは / こんばんは, que se escriben con は y se leen *wa*
  dentro de la palabra.
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

En este NAS no hay Node, así que las pruebas (`tools/check.js`) se ejecutan en
un contenedor efímero, desde la raíz del repo:

```sh
docker run --rm -v "$PWD":/t:ro node:22-alpine node /t/tools/check.js
```

El truco: el propio `index.html` es la entrada. Se extrae el `<script>` y se
ejecuta con un `document` de pega, así que lo que se prueba es el código de la
página y no una copia. **Cada regla nueva, con sus casos en `check.js`**,
también los que no deben cambiar (*oniisan*, *omou*).

**Las capturas, siempre en modo oscuro** (`colorScheme: 'dark'` en Playwright):
el móvil del usuario está en oscuro y así es como la ve. Con la barra superior
en `position:static` para que no tape el contenido en las capturas de sección.

Lo que depende del navegador (cortes de línea, `<wbr>`, lo que se ve al
tocar) se prueba con Safari y Chrome de verdad, con Playwright en otro
contenedor: `mcr.microsoft.com/playwright:v1.48.0-jammy`, `npm i
playwright@1.48.0` dentro y un script que abra `file:///t/index.html` a 393 px
con `webkit` y con `chromium`. Así salió que Chrome corta por `<wbr>` pese al
`nowrap` y Safari no. Así se comprobaron las 253 lecturas de los 23 contadores
contra la tabla del libro, el presente de los verbos, y el romaji de todas
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
