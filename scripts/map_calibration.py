#!/usr/bin/env python3
"""Калибровка координат меток карты географии: рисует текущие позиции
из GeographyMap.tsx поверх рельефа, сохраняет контрольный снимок."""
from PIL import Image, ImageDraw

MAP = '/home/z/my-project/public/images/karta-geografiya.png'
OUT = '/tmp/render/map-calibration.png'

# (метка, x%, y%) — синхронно с mapObjects в GeographyMap.tsx
points = [
    ('1 Ялта пергола', 41.5, 79.5),
    ('2 Ялта терраса', 44.5, 82),
    ('7 Ялта балкон', 38.5, 82.5),
    ('3 Орловка', 13.5, 61),
    ('4 Громово', 12.5, 44),
    ('6 Черноморское', 6.5, 40),
    ('9 Любимовка', 18.5, 65.5),
    ('10 Севастополь', 21, 69.5),
    ('13 Севастополь', 24, 72),
    ('8 Каменское', 30, 52),
    ('5 Керчь фасад', 91.5, 55),
    ('11 Керчь этаж', 94, 59.5),
    ('12 Керчь дом', 90, 61),
]

im = Image.open(MAP).convert('RGBA')
# кремовый фон вместо прозрачности
bg = Image.new('RGBA', im.size, (242, 237, 226, 255))
bg.alpha_composite(im)
im = bg
W, H = im.size
d = ImageDraw.Draw(im)
for label, x, y in points:
    px, py = W * x / 100, H * y / 100
    d.ellipse([px - 9, py - 9, px + 9, py + 9], outline=(232, 106, 51, 255), width=4)
    d.text((px + 13, py - 6), label, fill=(31, 27, 22, 255))
im.save(OUT)
print('saved', OUT, im.size)
