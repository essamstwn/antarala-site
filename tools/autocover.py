"""Gambar cover otomatis 1200x900 untuk berita tanpa foto (sama dengan editor).
Pakai: python3 tools/autocover.py <judul> <tanggal YYYY-MM-DD> <output.jpg>"""
import sys, os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F = os.path.join(ROOT, "tools", "fonts")
BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

def tgl(d):
    y, m, dd = d.split("-")
    return f"{int(dd)} {BULAN[int(m) - 1]} {y}"

def draw(judul, tanggal, out):
    W, H = 1200, 900
    im = Image.new("RGB", (W, H), "#1e1e1e")
    x = ImageDraw.Draw(im)
    x.ellipse((W - 40 - 360, H - 20 - 360, W - 40 + 360, H - 20 + 360), fill="#2a2a2a")
    logo = Image.open(os.path.join(ROOT, "static", "assets", "img", "logo-light.png")).convert("RGBA")
    lw = 200; logo = logo.resize((lw, round(lw * logo.height / logo.width)), Image.LANCZOS)
    im.paste(logo, (80, 130), logo)
    f26 = ImageFont.truetype(os.path.join(F, "figtree-latin-600-normal.ttf"), 26)
    k = "BERITA"; kw = x.textlength(k, font=f26) + 40
    x.rounded_rectangle((80, 250, 80 + kw, 296), radius=23, fill="#f1ede4")
    x.text((100, 282), k, font=f26, fill="#1e1e1e", anchor="ls")
    x.text((100 + kw, 282), tgl(tanggal), font=f26, fill="#b4b1ab", anchor="ls")
    size = 78
    while True:
        fn = ImageFont.truetype(os.path.join(F, "newsreader-latin-500-normal.ttf"), size)
        lines, ln = [], ""
        for w in judul.split():
            tr = (ln + " " + w) if ln else w
            if x.textlength(tr, font=fn) > W - 160 and ln: lines.append(ln); ln = w
            else: ln = tr
        if ln: lines.append(ln)
        if len(lines) <= 4 or size <= 48: break
        size -= 6
    for i, l in enumerate(lines[:5]):
        x.text((80, 360 + size + i * size * 1.12), l, font=fn, fill="#f1ede4", anchor="ls")
    f24 = ImageFont.truetype(os.path.join(F, "figtree-latin-500-normal.ttf"), 24)
    x.text((80, 800), "antarala.futurinc.co.id", font=f24, fill="#9c9994", anchor="ls")
    im.save(out, quality=88)

if __name__ == "__main__":
    draw(sys.argv[1], sys.argv[2], sys.argv[3])
