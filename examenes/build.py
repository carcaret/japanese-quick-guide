#!/usr/bin/env python3
"""Convierte un examen en HTML con marcado ligero a PDF A4.

Marcado:
  {漢字|かんじ}  -> furigana (ruby)
  [[N]]          -> hueco subrayado de N em de ancho
Uso: python3 build.py examen.html salida.pdf
"""
import re
import sys
import tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

src, out = Path(sys.argv[1]), Path(sys.argv[2])
html = src.read_text(encoding="utf-8")
html = re.sub(r"\{([^|{}]+)\|([^{}]+)\}", r"<ruby>\1<rt>\2</rt></ruby>", html)
html = re.sub(r"\[\[(\d+(?:\.\d+)?)\]\]", r'<span class="b" style="width:\1em"></span>', html)
tmp = Path(tempfile.mkstemp(suffix=".html")[1])
tmp.write_text(html, encoding="utf-8")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto(tmp.resolve().as_uri())
    page.wait_for_load_state("networkidle")
    page.pdf(path=str(out), format="A4", print_background=True,
             margin={"top": "14mm", "bottom": "14mm", "left": "15mm", "right": "15mm"},
             display_header_footer=True,
             header_template="<span></span>",
             footer_template='<div style="width:100%;text-align:center;font-size:8pt;color:#888;font-family:sans-serif">'
                             '<span class="pageNumber"></span> / <span class="totalPages"></span></div>')
    browser.close()
tmp.unlink()
print("PDF:", out)
