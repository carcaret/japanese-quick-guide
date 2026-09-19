# Guía rápida de japonés

Chuleta de japonés en una sola página HTML, pensada para leer en el móvil.
Cada palabra japonesa subrayada se puede tocar para oírla (voz del propio
navegador, `SpeechSynthesis`; en `ja-JP` si el sistema tiene voz japonesa).

**Publicada en:** https://carcaret.github.io/japanese-quick-guide/

Contenido actual: lecciones 1–2 (sonidos, partículas, serie こそあど,
interrogativos, negación de です y expresiones).

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

## Actualizar la guía

Editar `index.html`, comprobarlo en el navegador y:

```sh
git add -A && git commit -m "..." && git push
```

En un par de minutos la Page queda actualizada (pestaña *Actions* del repo).
La copia instalada en el móvil se actualiza sola al abrirla con conexión: el
service worker pide siempre la versión de la red y solo tira de la copia
guardada si no hay. Al tocar `sw.js` o los iconos, subir `VERSION` en `sw.js`
para que se descarte la caché vieja.

### Convenciones del HTML

- Cada sección es un `<section id="...">` con su enlace en el `<nav>`.
- Una sección se compone de `.card` con `.item` dentro (un concepto por
  `.item`); `.sub` para las líneas secundarias.
- Lo ampliable va en `<details class="more"><summary></summary><div class="body">…`
  (el botón "＋ más" lo pone el CSS; el `<summary>` va vacío a propósito).
- Texto japonés que se debe poder oír: `<span class="jp">…</span>`. Si lo escrito
  no coincide con lo que debe pronunciarse, se añade `data-say="…"`.
- Tablas de dos columnas: `.rows` con pares `.k` / `.v`.
- Colores siempre por variable CSS (`--ai`, `--ok`, `--ng`, …): así el modo
  oscuro sale solo.
