#!/usr/bin/env python3
"""Сжатие скачанных фото: максимум 1280px по ширине, JPEG/WebP q80."""
from PIL import Image
import os, glob, re

for folder in ('objects', 'portfolio'):
    files = glob.glob(f'/home/z/my-project/public/images/{folder}/*')
    total_before = total_after = 0
    for fp in files:
        before = os.path.getsize(fp)
        try:
            im = Image.open(fp).convert('RGB')
            w, h = im.size
            if w > 1280:
                im = im.resize((1280, int(h * 1280 / w)), Image.LANCZOS)
            im.save(fp, 'WEBP', quality=80, method=6)
            after = os.path.getsize(fp)
            total_before += before
            total_after += after
        except Exception as e:
            print('ERR', fp, e)
    print(f'{folder}: {len(files)} файлов, {total_before/1e6:.0f}MB -> {total_after/1e6:.0f}MB')
print('COMPRESS_DONE')
