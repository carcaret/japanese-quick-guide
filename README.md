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
- `.github/workflows/pages.yml` — publica el repo tal cual en GitHub Pages en
  cada `push` a `main`.

La única dependencia externa es la tipografía Zen Kaku Gothic New de Google
Fonts; sin conexión, el navegador cae en la fuente japonesa del sistema.

## Actualizar la guía

Editar `index.html`, comprobarlo en el navegador y:

```sh
git add -A && git commit -m "..." && git push
```

En un par de minutos la Page queda actualizada (pestaña *Actions* del repo).

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
