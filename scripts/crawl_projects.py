#!/usr/bin/env python3
"""Краулер страниц проектов старого сайта -> структурированный JSON."""
import re, html, json, subprocess, os, time

BASE = 'https://xn--80aknigcncfkc7d8byc.xn--p1ai'
OUT_DIR = '/tmp/oldsite/projects'
os.makedirs(OUT_DIR, exist_ok=True)

# 1. Получаем список слагов из sitemap
sm = subprocess.run(['curl', '-s', '-m', '25', f'{BASE}/product-sitemap.xml'],
                    capture_output=True, text=True).stdout
slugs = re.findall(r'<loc>' + re.escape(BASE) + r'/projects/([^<]+)</loc>', sm)
slugs = [s.strip('/') for s in slugs if s.strip('/') != 'projects-original']
print(f"Слагов: {len(slugs)}")

# 2. Скачиваем страницы
for s in slugs:
    fp = f'{OUT_DIR}/{s}.html'
    if os.path.exists(fp) and os.path.getsize(fp) > 100000:
        continue
    subprocess.run(['curl', '-s', '-m', '30', f'{BASE}/projects/{s}/', '-o', fp], check=False)
    time.sleep(0.2)
print("Скачано:", len([f for f in os.listdir(OUT_DIR) if f.endswith('.html')]))

# 3. Парсим каждую страницу
def parse(fp, slug):
    raw = open(fp, encoding='utf-8', errors='ignore').read()
    d = {'slug': slug}
    m = re.search(r'<h1[^>]*>([^<]+)</h1>', raw)
    d['name'] = html.unescape(m.group(1)).strip() if m else slug
    # тип и разделы (элементы с иконками)
    m = re.search(r'posted_in">Тип[ыи]?\s+дома:\s*([\s\S]{0,400}?)(?:</span>|<br)', raw)
    d['tech'] = sorted(set(html.unescape(t).strip() for t in
                           re.findall(r'rel="tag">([^<]+)</a>', m.group(1)))) if m else []
    sect = re.findall(r'(Комфорт\s*\+|Бизнес\s*\+)', raw)
    d['sections'] = sorted(set(re.sub(r'\s+', '', s) for s in sect))
    # характеристики
    chars = re.findall(r'characteristic-item"><img[^>]*alt="([^"]*)"[^>]*/>\s*<span class="characteristic-value">([^<]+)</span>', raw)
    d['features'] = []
    seen_f = set()
    for a, v in chars:
        val = html.unescape(v).strip()
        key = val.lower()
        if key and key not in seen_f:
            d['features'].append(val)
            seen_f.add(key)
    # цены: acf-price-card
    cards = re.findall(r'acf-price-title">([^<]+)</div>\s*<div class="acf-price-value">от\s*<span[^>]*><bdi>([\d\s\u2009\u00a0]+)', raw)
    d['prices'] = []
    seen = set()
    for label, amount in cards:
        lbl = html.unescape(re.sub(r'\s+', ' ', label)).strip()
        am = re.sub(r'[\s\u2009\u00a0]', '', amount)
        if lbl.lower() not in seen and am.isdigit():
            d['prices'].append({'label': lbl, 'amount': int(am)})
            seen.add(lbl.lower())
    # описание: панель описания до секции «Похожие проекты»
    m = re.search(r'id="tab-description"[^>]*>([\s\S]{300,15000}?)(?:Похожие проекты|woocommerce-loop-product__title|<div id="tab-)', raw)
    desc = []
    if m:
        paras = re.findall(r'<p[^>]*>([\s\S]{80,3000}?)</p>', m.group(1))
        for p in paras:
            t = html.unescape(re.sub(r'<[^>]+>', ' ', p))
            t = re.sub(r'\s+', ' ', t).strip()
            if len(t) > 60 and t not in desc:
                desc.append(t)
    d['description'] = desc
    # изображения галереи
    imgs = re.findall(r'src="(https?://[^"]+uploads/[^"]+\.(?:jpg|jpeg|png|webp))"', raw, re.I)
    skip = ('logo', 'иконк', 'icon', 'placeholder', 'Площадь', 'Кухня-гостиная', 'Спальня',
            'Санузел', 'площадь', 'кухня', 'спальни', 'санузел')
    gal = []
    for i in imgs:
        base = i.split('/')[-1].split('-')[0].lower()
        if any(s.lower() in i.lower() for s in skip):
            continue
        i2 = re.sub(r'-\d+x\d+(?=\.\w{3,4}$)', '', i)  # убираем размеры -> оригинал
        if i2 not in gal:
            gal.append(i2)
    d['images'] = gal[:8]
    return d

result = []
for s in slugs:
    fp = f'{OUT_DIR}/{s}.html'
    if os.path.exists(fp) and os.path.getsize(fp) > 50000:
        try:
            result.append(parse(fp, s))
            print(f"OK {s}: prices={len(result[-1]['prices'])} imgs={len(result[-1]['images'])} desc={len(result[-1]['description'])}")
        except Exception as e:
            print(f"ERR {s}: {e}")

json.dump(result, open('/tmp/oldsite/projects.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print("TOTAL:", len(result))
