#!/usr/bin/env python3
"""Genera los iconos PNG de la PWA: fondo azul y un 日 blanco.

Sin dependencias (zlib de la stdlib escribe el PNG). El kanji 日 es un
rectangulo redondeado hueco con una barra en medio, asi que sale de la
geometria, sin necesidad de una fuente japonesa instalada.

    python3 tools/make-icons.py
"""

import struct
import zlib
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

AZUL = (0x2A, 0x4A, 0x8A)   # --ai del tema claro
BLANCO = (0xFF, 0xFF, 0xFF)
SS = 4                       # muestras por lado (antialiasing por supermuestreo)


def _rect_redondeado(x, y, x0, y0, x1, y1, r):
    """¿Cae (x, y) dentro del rectangulo [x0,x1]x[y0,y1] con esquinas de radio r?"""
    if not (x0 <= x <= x1 and y0 <= y <= y1):
        return False
    if r <= 0:
        return True
    # Solo hay que mirar las esquinas: el centro de la esquina es (cx, cy).
    cx = x0 + r if x < x0 + r else (x1 - r if x > x1 - r else x)
    cy = y0 + r if y < y0 + r else (y1 - r if y > y1 - r else y)
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r


def _dentro_del_glifo(x, y, s, alto_rel):
    """El 日: contorno redondeado hueco + barra central."""
    gh = alto_rel * s                 # alto del kanji
    gw = gh * 0.74                    # algo mas estrecho que alto
    t = gh * 0.152                    # grosor del trazo
    r = gh * 0.10                     # radio de las esquinas
    x0, x1 = (s - gw) / 2, (s + gw) / 2
    y0, y1 = (s - gh) / 2, (s + gh) / 2

    if not _rect_redondeado(x, y, x0, y0, x1, y1, r):
        return False
    hueco = _rect_redondeado(x, y, x0 + t, y0 + t, x1 - t, y1 - t, max(r - t, 0))
    barra = abs(y - s / 2) <= t / 2
    return (not hueco) or barra


def genera(destino, s, alto_rel):
    """Dibuja el icono de s x s pixeles; alto_rel es el alto del kanji sobre el lienzo."""
    filas = bytearray()
    paso = 1.0 / SS
    for py in range(s):
        filas.append(0)  # filtro PNG "None"
        for px in range(s):
            dentro = 0
            for sy in range(SS):
                y = py + (sy + 0.5) * paso
                for sx in range(SS):
                    x = px + (sx + 0.5) * paso
                    if _dentro_del_glifo(x, y, s, alto_rel):
                        dentro += 1
            k = dentro / (SS * SS)
            filas.extend(round(AZUL[c] + (BLANCO[c] - AZUL[c]) * k) for c in range(3))

    def trozo(tipo, datos):
        cuerpo = tipo + datos
        return struct.pack(">I", len(datos)) + cuerpo + struct.pack(">I", zlib.crc32(cuerpo))

    png = (
        b"\x89PNG\r\n\x1a\n"
        + trozo(b"IHDR", struct.pack(">IIBBBBB", s, s, 8, 2, 0, 0, 0))
        + trozo(b"IDAT", zlib.compress(bytes(filas), 9))
        + trozo(b"IEND", b"")
    )
    destino.write_bytes(png)
    print(f"{destino.relative_to(RAIZ)}: {s}x{s}, {len(png)} bytes")


if __name__ == "__main__":
    iconos = RAIZ / "icons"
    iconos.mkdir(exist_ok=True)
    # Normales: el kanji ocupa buena parte del icono (iOS ya recorta las esquinas).
    for s in (180, 192, 512):
        genera(iconos / f"icon-{s}.png", s, 0.58)
    # "Maskable" de Android: el glifo se queda dentro del circulo seguro (80 %).
    genera(iconos / "icon-maskable-512.png", 512, 0.42)
