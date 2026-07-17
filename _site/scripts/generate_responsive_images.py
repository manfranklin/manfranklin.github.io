#!/usr/bin/env python3
"""
Generate resized images and WebP variants for images in the `images/` folder.
Produces files alongside originals with suffix `-<width>.<ext>` and `-<width>.webp`.
Usage: python3 scripts/generate_responsive_images.py
"""
from PIL import Image
from pathlib import Path

SRC_DIR = Path('images')
OUT_DIR = SRC_DIR  # write next to originals
WIDTHS = [400, 800, 1200, 1600]
MIN_SIZE = 20 * 1024  # only process files larger than 20KB

if not SRC_DIR.exists():
    print('images/ directory not found, exiting')
    exit(1)

for path in sorted(SRC_DIR.iterdir(), key=lambda p: p.stat().st_size, reverse=True):
    if not path.is_file():
        continue
    if path.suffix.lower() not in ('.jpg', '.jpeg', '.png'):  # process common raster formats
        continue
    if path.stat().st_size < MIN_SIZE:
        continue

    try:
        img = Image.open(path)
    except Exception as e:
        print('Skipping', path, 'open error', e)
        continue

    orig_w, orig_h = img.size
    name = path.stem
    ext = path.suffix.lower().lstrip('.')

    for w in WIDTHS:
        if w >= orig_w:
            # still create webp copy at original size
            out_w = orig_w
        else:
            out_w = w
        ratio = out_w / orig_w
        out_h = max(1, int(orig_h * ratio))
        out_name = f"{name}-{out_w}.{ext}"
        out_path = OUT_DIR / out_name
        webp_name = f"{name}-{out_w}.webp"
        webp_path = OUT_DIR / webp_name

        if not out_path.exists():
            try:
                resized = img.resize((out_w, out_h), Image.LANCZOS)
                if ext in ('jpg', 'jpeg'):
                    resized.save(out_path, quality=85, optimize=True)
                else:
                    resized.save(out_path, optimize=True)
                print('Wrote', out_path)
            except Exception as e:
                print('Failed write', out_path, e)

        if not webp_path.exists():
            try:
                # Pillow supports WebP if compiled with it
                img.save(webp_path, 'WEBP', quality=80, method=6)
                print('Wrote', webp_path)
            except Exception as e:
                # try saving resized version as webp
                try:
                    resized = img.resize((out_w, out_h), Image.LANCZOS)
                    resized.save(webp_path, 'WEBP', quality=80, method=6)
                    print('Wrote', webp_path)
                except Exception as e2:
                    print('Failed webp', webp_path, e2)

print('Done')
