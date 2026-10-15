# Exámenes de repaso

Exámenes en PDF para imprimir y rellenar a mano, con todo lo visto en Genki hasta el
momento. Los genera Claude con la skill `examen-japones` (copia en `SKILL.md`).

| Carpeta | Cubre |
|---|---|
| `L01-03/` | Lecciones 1–3, hasta 〜ませんか y los adverbios de frecuencia (L3 puntos 1–6) |

- `build.py`: convierte el HTML del examen en PDF A4 (`{漢字|かんじ}` = furigana, `[[N]]` = hueco).
- `anki_vistas.py`: lee una copia de la colección de Anki y saca qué palabras y kanji del
  mazo `Genki` han salido ya. De ahí salen el vocabulario permitido y dónde va el furigana.

Nada de esto lo usa la guía (`index.html`): GitHub Pages lo publica junto a ella porque
sube el repo entero.
