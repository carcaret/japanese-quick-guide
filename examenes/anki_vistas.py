#!/usr/bin/env python3
"""Saca de una COPIA de la colección de Anki lo que ya ha salido del mazo Genki.

Uso:
    python3 -I anki_vistas.py ruta/collection.anki2 > vistas.json

- Trabaja sobre una copia: si junto al .anki2 está el -wal, cópialo también
  (con el mismo nombre + "-wal") para que entren los repasos más recientes.
- Nunca escribe en la colección (se abre en modo solo lectura).

Salida (JSON):
    {
      "por_leccion": {"03": {"notas": 102, "vistas": 70}, ...},
      "leccion_max_vista": 3,
      "vocab": [ {"jp": "映画", "lectura": "えいが", "es": "película",
                  "leccion": "03", "kanji": true, "visto": true}, ... ],
      "kanji": [ {"kanji": "時", "lectura": "じ", "es": "hora, tiempo",
                  "leccion": "03", "visto": true}, ... ]
    }

"visto" = al menos una tarjeta de la nota ha salido ya (type > 0).
"kanji" (en vocab) = la palabra se escribe con kanji en la tarjeta.
"""
import json
import re
import sqlite3
import sys
from collections import defaultdict
from pathlib import Path

NT_VOCAB = "Genki Vocabulario (ES)"
NT_KANJI = "Genki Kanji (ES)"
MAZO = "Genki"

ruta = Path(sys.argv[1])
con = sqlite3.connect(f"file:{ruta}?mode=ro", uri=True)
# Anki usa una colación propia; sin ella fallan las consultas sobre decks/notetypes.
con.create_collation("unicase", lambda a, b: (a.lower() > b.lower()) - (a.lower() < b.lower()))

def plano(html):
    """<ruby>映画<rt>えいが</rt></ruby> -> 映画"""
    return re.sub(r"<rt>.*?</rt>|<[^>]+>", "", html).strip()

notetypes = {name: i for i, name in con.execute("select id, name from notetypes")}
campos = defaultdict(dict)
for ntid, ord_, name in con.execute("select ntid, ord, name from fields"):
    campos[ntid][name] = ord_
mazos = {i: n.replace("\x1f", "/") for i, n in con.execute("select id, name from decks")}

estado = defaultdict(lambda: {"visto": False, "mazo": None})
for nid, did, typ in con.execute("select nid, did, type from cards"):
    m = mazos.get(did, "")
    if not (m == MAZO or m.startswith(MAZO + "/")):
        continue
    e = estado[nid]
    e["mazo"] = m
    e["visto"] |= typ > 0

vocab, kanji = [], []
por_leccion = defaultdict(lambda: {"notas": 0, "vistas": 0})
for nid, mid, flds in con.execute("select id, mid, flds from notes"):
    if nid not in estado:
        continue
    f = flds.split("\x1f")
    e = estado[nid]
    leccion = re.search(r"(\d+)\s*$", e["mazo"])
    leccion = leccion.group(1).zfill(2) if leccion else "??"
    por_leccion[leccion]["notas"] += 1
    por_leccion[leccion]["vistas"] += e["visto"]
    if mid == notetypes.get(NT_VOCAB):
        c = campos[mid]
        jp = plano(f[c["Japonés"]])
        vocab.append({
            "jp": jp,
            "lectura": f[c["Lectura"]],
            "es": f[c["Español"]],
            "leccion": leccion,
            "kanji": bool(re.search(r"[一-鿿々]", jp)),
            "visto": e["visto"],
        })
    elif mid == notetypes.get(NT_KANJI):
        c = campos[mid]
        kanji.append({
            "kanji": f[c["Kanji"]],
            "lectura": "／".join(x for x in (f[c["On"]], f[c["Kun"]]) if x),
            "es": f[c["Significado"]],
            "leccion": leccion,
            "visto": e["visto"],
        })

vistas = [int(l) for l, v in por_leccion.items() if l.isdigit() and v["vistas"]]
json.dump({
    "por_leccion": dict(sorted(por_leccion.items())),
    "leccion_max_vista": max(vistas) if vistas else 0,
    "vocab": sorted(vocab, key=lambda x: (x["leccion"], x["lectura"])),
    "kanji": sorted(kanji, key=lambda x: (x["leccion"], x["kanji"])),
}, sys.stdout, ensure_ascii=False, indent=1)
