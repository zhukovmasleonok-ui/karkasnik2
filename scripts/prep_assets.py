#!/usr/bin/env python3
"""Подготовка ассетов из upload: кропы реальных фото + скачивание шрифтов."""
import os, re, urllib.request
from PIL import Image

UP = '/home/z/my-project/upload'
OUT = '/home/z/my-project/public/images'
FONTS = '/home/z/my-project/public/fonts'
os.makedirs(OUT, exist_ok=True)
os.makedirs(FONTS, exist_ok=True)

def crop(src, box, dst, quality=88):
    im = Image.open(os.path.join(UP, src)).convert('RGB')
    im.crop(box).save(os.path.join(OUT, dst), 'JPEG', quality=quality, optimize=True)
    print(dst, im.crop(box).size)

def full(src, dst, quality=88):
    im = Image.open(os.path.join(UP, src)).convert('RGB')
    im.save(os.path.join(OUT, dst), 'JPEG', quality=quality, optimize=True)
    print(dst, im.size)

# Реальные фото (без наложенного текста)
crop('5442860210407022255_121.jpg', (0, 92, 412, 620), 'founder.jpg')          # Вячеслав Амерян
crop('5442860210407022269_121.jpg', (55, 25, 645, 660), 'family.jpg')          # семья (спецусловия)
crop('5442860210407022279_121.jpg', (74, 205, 648, 925), 'family2.jpg')        # семейный подход

# Реальные фото с «редакционными» подписями — используем как есть
full('5442860210407022259_120.jpg', 'work-frame.jpg')        # каркас, сухой строганый пиломатериал
full('5442860210407022260_120.jpg', 'work-prefab.jpg')       # монтаж модуля краном «Префаб»
full('5442860210407022261_120.jpg', 'work-platform.jpg')     # платформа пола, сертифицированные материалы
full('5442860210407022262_120.jpg', 'work-slope.jpg')        # дом на склоне
full('5442860210407022263_120.jpg', 'work-aframe.jpg')       # А-образный дом
full('5442860210407022264_120.jpg', 'work-brick.jpg')        # кирпичный дом, типовые и уникальные проекты
full('5442860210407022266_120.jpg', 'work-contract.jpg')     # договор, гарантия
full('5442860210407022267_120.jpg', 'work-turnkey.jpg')      # кухня под ключ
full('5442860210407022265_120.jpg', 'map-crimea.jpg')        # карта Крыма (свои бригады)

# Сертификаты: обрезаем шапку со слайд-заголовком, оставляем ряд дипломов
crop('5442860210407022258_121.jpg', (0, 78, 1280, 450), 'certificates.jpg', quality=90)

print('CROPS_DONE')

# ---- Шрифты: Manrope (sans) + Playfair Display (serif), кириллица+латиница ----
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
req_css = lambda fam: urllib.request.Request(fam, headers={'User-Agent': UA})

def fetch(url):
    r = urllib.request.Request(url, headers={'User-Agent': UA})
    return urllib.request.urlopen(r, timeout=30).read()

css_urls = [
    ('https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&display=swap', 'manrope'),
    ('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap', 'playfair'),
]

faces = []
for url, base in css_urls:
    css = fetch(url).decode('utf-8')
    blocks = re.findall(r'/\*\s*([a-z-]+)\s*\*/\s*@font-face\s*\{(.*?)\}', css, re.S)
    for subset, body in blocks:
        if subset not in ('cyrillic', 'latin', 'latin-ext', 'cyrillic-ext'):
            continue
        style = re.search(r'font-style:\s*(\w+)', body).group(1)
        src = re.search(r'url\((https://[^)]+)\)', body).group(1)
        ur = re.search(r'unicode-range:\s*([^;]+);', body).group(1).strip()
        fname = f"{base}-{style}-{subset}.woff2"
        with open(os.path.join(FONTS, fname), 'wb') as f:
            f.write(fetch(src))
        faces.append((base, style, subset, fname, ur))
        print('font', fname)

# Генерируем CSS c @font-face
lines = []
for base, style, subset, fname, ur in faces:
    lines.append(
        "@font-face {\n"
        f"  font-family: '{base.capitalize() if base!='playfair' else 'Playfair Display'}';\n"
        f"  font-style: {style};\n"
        "  font-weight: 400 900;\n"
        "  font-display: swap;\n"
        f"  src: url('/fonts/{fname}') format('woff2');\n"
        f"  unicode-range: {ur};\n"
        "}\n"
    )
open(os.path.join(FONTS, 'fonts.css'), 'w', encoding='utf-8').write('\n'.join(lines))
print('FONTS_DONE')
