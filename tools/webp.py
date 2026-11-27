"""Buat versi WebP 640px & 1200px dari foto cover (lebih ringan untuk HP).
Pakai: python3 tools/webp.py <folder assets/img>"""
import sys, os
from PIL import Image, ImageOps
d = sys.argv[1]; w = os.path.join(d, "w"); os.makedirs(w, exist_ok=True)
n = 0
for f in sorted(os.listdir(d)):
    if not (f.startswith("cover-") and f.lower().endswith((".jpg", ".jpeg", ".png"))): continue
    src = os.path.join(d, f); base = os.path.splitext(f)[0]
    im = None
    for width in (320, 640, 960, 1200):
        out = os.path.join(w, f"{base}-{width}.webp")
        if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(src): continue
        if im is None: im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        r = im.copy(); r.thumbnail((width, width * 2), Image.LANCZOS)
        r.save(out, "WEBP", quality=78, method=6); n += 1
print(f"webp: {n} file dibuat")
