#!/usr/bin/env python3
"""Сверка цен/площадей: текстовый прайс старого сайта vs projects.ts."""
import re

lines = [l.rstrip() for l in open('/tmp/oldsite/txt/ceny-na-stroitelstvo-domov.txt', encoding='utf-8', errors='ignore')]
lines = [l for l in lines if l.strip()]

SKIP = {'Название', 'Общая площадь', 'Цена', 'Ссылка на проект', 'Посмотреть проект', 'Главная'}
old = []  # (category, name, area, price)
cat = '?'
window = []  # последние содержательные строки
for ln in lines:
    s = ln.strip()
    h = re.match(r'\[H2\]\s*(.+)', s)
    if h:
        cat = h.group(1).strip()
        window = []
        continue
    if s in SKIP or s.startswith('[') or s in ('+7 978 301 83 50',):
        continue
    if '₽' in s:
        pm = re.search(r'([\d\s]{6,})\s*₽', s)
        price = int(pm.group(1).replace(' ', '')) if pm else None
        area = None
        name = None
        for w in reversed(window):
            if area is None and 'м²' in w:
                am = re.search(r'(\d+[.,]\d+|\d+)\s*м²', w)
                if am:
                    area = float(am.group(1).replace(',', '.'))
            elif area is not None and name is None and re.search(r'[А-ЯЁA-Z«]', w):
                name = w.strip(' «»')
                break
        if name is None:
            for w in reversed(window):
                if re.search(r'[А-ЯЁA-Z«]', w) and '₽' not in w:
                    name = w.strip(' «»')
                    break
        if name:
            old.append((cat, name, area, price))
        window = []
        continue
    window.append(s)

ts = open('/home/z/my-project/src/content/projects.ts', encoding='utf-8').read()
new = {}
for m in re.finditer(r"slug: '([^']+)',\s*\n\s*name: '([^']+)',[\s\S]{0,900}?area: ([\d.]+),[\s\S]{0,1200}?minPrice: (\d+)", ts):
    new[m.group(1)] = {'name': m.group(2), 'area': float(m.group(3)), 'minPrice': int(m.group(4))}

def norm(s):
    s = re.sub(r'["«»„“”()\']', ' ', s.lower())
    for w in ('дом', 'барнхаус', 'бани', 'баня', 'мини-гостиница', 'коворкинг', 'кофейня',
              'а-фрейм', 'с террасой', 'с балконом', 'и террасой', 'с фасадом', 'flow',
              'по технологии', 'под ключ', 'пвз', 'юг'):
        s = s.replace(w, ' ')
    return re.sub(r'\s+', ' ', s).strip()

def find_old(name, area):
    key = norm(name)
    first = key.split()[0] if key.split() else key
    # 1) точное нормализованное совпадение
    for slug, p in new.items():
        if norm(p['name']) == key:
            return slug
    # 2) первое слово + близкая площадь
    best, bd = None, 99
    for slug, p in new.items():
        if norm(p['name']).split()[0] == first:
            d = abs(p['area'] - (area or p['area']))
            if d < bd:
                best, bd = slug, d
    if best and bd < 1.01:
        return best
    # 3) просто первое слово
    for slug, p in new.items():
        if norm(p['name']).split()[0] == first:
            return slug
    return None

print(f"Старых позиций: {len(old)} | Проектов: {len(new)}")
print('=' * 104)
checked, bad, nomatch = set(), [], []
for cat, name, area, price in old:
    slug = find_old(name, area)
    tag = f"[{cat[:18]:18}]"
    if not slug:
        nomatch.append((cat, name, area, price))
        print(f"????  {tag} {name[:40]:40} площадь {area} / от {price}  -> НЕТ ПАРЫ")
        continue
    p = new[slug]
    checked.add(slug)
    area_ok = area is None or abs(p['area'] - area) < 1.01
    price_ok = price is None or p['minPrice'] == price
    if area_ok and price_ok:
        print(f"OK     {tag} {name[:40]:40} {str(area):7} м² / от {price}  ==  {p['area']:7} / от {p['minPrice']}")
    else:
        bad.append((cat, name, area, price, p))
        print(f"!!!    {tag} {name[:40]:40} {str(area):7} м² / от {price}  !=  {p['area']:7} / от {p['minPrice']} ({slug})")
print('=' * 104)
print(f"Совпало проектов: {len(checked)} из {len(new)} | Расхождений: {len(bad)} | Без пары: {len(nomatch)}")
for c, n, a, pr in nomatch:
    print('  БЕЗ ПАРЫ:', c, '|', n, '|', a, '|', pr)
unused = [f"{s} {p['name']}" for s, p in new.items() if s not in checked]
for u in unused:
    print('  В КАТАЛОГЕ, НО НЕТ В ПРАЙСЕ:', u)
