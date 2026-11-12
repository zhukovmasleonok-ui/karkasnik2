"""Контактный лист: все изображения public/images в одной картинке с подписями."""
from PIL import Image, ImageDraw, ImageFont
import os

SRC = '/home/z/my-project/public/images'
files = sorted(f for f in os.listdir(SRC) if f.lower().endswith(('.jpg', '.png', '.jpeg')))
COLS, TH = 5, 200
PAD = 26
CW = 300
rows = (len(files) + COLS - 1) // COLS
sheet = Image.new('RGB', (COLS * CW, rows * (TH + PAD)), '#222')
draw = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/chinese/NotoSansSC-Regular.ttf', 16)
except Exception:
    font = ImageFont.load_default()
for i, f in enumerate(files):
    x, y = (i % COLS) * CW, (i // COLS) * (TH + PAD)
    try:
        im = Image.open(os.path.join(SRC, f)).convert('RGB')
        im.thumbnail((CW - 8, TH - 8))
        sheet.paste(im, (x + 4, y + 4))
        draw.text((x + 6, y + TH), f, fill='#fff', font=font)
    except Exception as e:
        draw.text((x + 6, y + 20), f'{f}: ERR', fill='#f66', font=font)
sheet.save('/tmp/render/contact_sheet.jpg', quality=80)
print('saved', sheet.size, len(files), 'files')
