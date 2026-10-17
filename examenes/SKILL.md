---
name: examen-japones
description: Genera un examen de repaso de japonés imprimible (PDF A4 para rellenar a mano) con todo lo visto en Genki hasta el punto actual, usando el vocabulario y kanji que ya han salido en Anki.
---

# Examen de repaso de japonés (Genki + Anki)

Examen en PDF para imprimir y rellenar a mano. Repasa todo lo visto hasta ahora en Genki,
mezclando varios puntos en cada ejercicio para que no se alargue. Sirve también para no
olvidar lo de lecciones anteriores.

Todo lo necesario vive en el repo **carcaret/japanese-quick-guide** (rama `master`), carpeta
`examenes/`:

| Fichero | Para qué |
|---|---|
| `build.py` | HTML → PDF A4 con Playwright/Chromium. Marcado: `{漢字\|かんじ}` = furigana, `[[N]]` = hueco de N em |
| `anki_vistas.py` | Lee una copia de la colección de Anki y saca qué palabras y kanji del mazo `Genki` han salido ya |
| `L01-03/examen.html` (y siguientes) | Exámenes anteriores. El último es la plantilla de diseño y la lista de frases que no se repiten |

El token para hacer push está en las instrucciones del proyecto «Aprender Japonés». No
copiarlo a ningún fichero.

## 1. Alcance

1. Confirmar con Carlos hasta qué punto de Genki llega (lección y punto de gramática). Si la
   memoria del proyecto lo dice, proponerlo y que lo confirme.
2. Leer `mapa-genki-libro.md` del proyecto: lista de puntos de gramática por lección. Entra
   todo lo visto hasta ese punto incluido; nada posterior.
3. Reparto orientativo: ~50 % de la última lección y ~50 % de repaso de las anteriores. Cada
   ejercicio mezcla varios puntos.

## 2. Qué ha salido en Anki

Requiere el ordenador de Carlos vinculado a la sesión (Windows, app de escritorio abierta).

1. `get_device_info`; pedir acceso a `~/AppData/Roaming/Anki2` con
   `device_request_folder_access` (solo lectura).
2. Con `device_stage_files`, traer `Usuario 1/collection.anki2` y `Usuario 1/collection.anki2-wal`.
3. Copiar ambos a una carpeta de trabajo con el mismo nombre base (`c.anki2` y `c.anki2-wal`)
   y ejecutar `python3 -I examenes/anki_vistas.py c.anki2 > vistas.json`.
   **Nunca** escribir en la colección original.
4. Si no hay ordenador vinculado: decirlo y pedir que abra la conversación en la app de
   escritorio. No inventar la lista.

El mazo es propio: `Genki/Lección NN`, notetypes `Genki Vocabulario (ES)` y
`Genki Kanji (ES)`. Las lecciones 1–2 están solo en kana; el kanji empieza en la 3. Faltan
palabras que el libro sí tiene (p. ej. いっしょに, きっさてん, みせ).

## 3. Reglas de contenido

**Vocabulario**
- Solo palabras con `visto: true`.
- Si una palabra no vista es imprescindible (p. ej. いっしょに en una invitación), se deja con
  una pista en español en cursiva: `いっしょに <span class="cue">(juntos)</span>`.
- Préstamos en katakana transparentes (テレビ, コーヒー): se pueden usar aunque no hayan salido.

**Kanji y furigana**
- Una palabra va en kanji **sin furigana** solo si en `vistas.json` existe en kanji
  (`kanji: true`) y con `visto: true`.
- Palabra vista solo en kana: en kanji **con furigana**, como Genki (`{大学|だいがく}`).
- Kanji suelto o compuesto que no ha salido como palabra (時 en 7時, 年生, 半, 人): con furigana.
  Que la tarjeta del kanji suelto haya salido no basta.
- Horas, precios y cursos en cifras: `7{時|じ}`, `4,500円`, `2{年生|ねんせい}`.
- Lo que se pregunta en «lectura de kanji» no puede aparecer con furigana en otra parte del
  examen.
- Carlos no escribe kanji: las respuestas siempre en kana.

**Enunciados**
- En español mientras no haya visto 〜てください (Genki L6, punto 2). Desde ahí, en japonés
  sencillo y solo con lo visto. Nada de 〜てください antes de tiempo.
- Títulos de sección en japonés con el español al lado: `一　もじ · Escritura`.
- Etiquetas de diálogo en español si la palabra japonesa no se ha visto (no 【さそう】).

**Formato de los ejercicios**
- Escribir, no tipo test. Solo son de elegir el vocabulario (二) y la gramática A (五A).
- Sin comprensión oral.
- Huecos limpios para escribir: nada impreso dentro ni debajo de la raya. En los huecos
  numerados (partículas), el número va pequeño y delante: `わたし<sup>①</sup>＿＿`.
- Ordenar frases: 4 rayas para los números en orden, sin casilla ★ ni «★ = ＿» (la ★ del
  JLPT existe para corregir tipo test; aquí se escribe el orden entero). El solucionario da
  el orden completo y las variantes válidas.
- Frases y textos inventados. Nunca copiar del libro ni del cuaderno de Genki.
- No repetir frases de exámenes anteriores: leer los `examenes/*/examen.html` previos.

## 4. Estructura (≈45 min, 100 puntos, 5 págs. + solucionario)

Base: estructura del JLPT N5 (kanji reading, orthography, contextually-defined
expressions, sentential grammar 1 y 2, text grammar, comprehension), con respuesta
escrita y más ejercicios de producción.

| # | Sección | Contenido | Pts |
|---|---|---|---|
| 一 | もじ · Escritura | A) números, horas, precios, teléfono en hiragana. B) lectura de 6 palabras en kanji vistas. C) 3 palabras al katakana | 15 |
| 二 | ことば · Vocabulario | 8 frases, elegir a/b/c por contexto | 8 |
| 三 | どうし · Verbos | Tabla de conjugación con las formas vistas (crece: forma-te, pasado…). Incluir alguna trampa (帰る) | 10 |
| 四 | じょし · Partículas | Texto continuo con huecos y banco de partículas, con alguna que sobre. Número pequeño **delante** del hueco, nunca debajo de la raya | 12 |
| 五 | ぶんぽう · Gramática | A) elegir forma con contexto en español. B) ordenar 4 piezas escribiendo los 4 números en orden, **sin ★** | 15 |
| 六 | かいわ · Conversación | 2–3 diálogos con huecos según lo visto, más «¿qué dices si…?» | 13 |
| 七 | よみもの · Lectura | Texto de ~8–10 frases. A) ○×. B) respuestas en japonés | 11 |
| 八 | ほんやく · Traducción | 4 ES→JA y 4 JA→ES; cada frase mezcla 2–3 puntos | 16 |
| 九 | さくぶん · Redacción | 4–5 frases libres, sin solución; Carlos manda foto y se corrige | extra |

Si las secciones cambian con el avance (p. ej. adjetivos en L5), proponer el cambio antes de
hacerlo.

**Solucionario** en página aparte con línea de corte: respuestas, puntos por sección,
criterio de corrección (traducción: 2 = correcta, 1 = se entiende con un fallo, 0 = no) y
baremo. Variantes válidas indicadas.

## 5. Construir

1. Carpeta nueva `examenes/LXX-YY/` (lecciones que cubre). Copiar el `examen.html` del último
   examen como plantilla de diseño (CSS, cabecera, clases `.q`, `.keep`, `.page`, `.dlg`,
   `.passage`, `.slots`, `.key`) y reescribir el contenido. Ojo: `L01-03` aún lleva el número
   de las partículas debajo del hueco y la ★; en los siguientes, aplicar el formato de arriba.
2. `python3 examenes/build.py examenes/LXX-YY/examen.html examenes/LXX-YY/examen.pdf`.
   Requiere Playwright con Chromium y la fuente Noto Sans CJK JP.
3. Comprobar a la vista: rasterizar las páginas (`pypdfium2`) y mirarlas. Sin secciones ni
   diálogos partidos, huecos con sitio para escribir a mano, cabecera bien.
4. Comprobar el contenido: cada respuesta del solucionario contra su pregunta, puntos que
   suman 100, nada de vocabulario, kanji ni gramática fuera de lo permitido.

## 6. Entregar

- Enviar el PDF con `SendUserFile` y una línea de contexto.
- Proponer añadir `examen.html` y `examen.pdf` al repo. Commit y push **solo cuando Carlos lo
  confirme**. El repo se publica entero en GitHub Pages, así que el examen queda accesible
  en la web. `vistas.json` no se sube.
- No cambiar nada ya entregado sin preguntar antes.

## Corrección

Si Carlos manda foto del examen hecho: corregir con el solucionario, dar la nota por sección
y, en cada fallo, el punto de gramática y la página de Genki (de `mapa-genki-libro.md`).
