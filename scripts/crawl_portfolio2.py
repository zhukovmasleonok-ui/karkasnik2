#!/usr/bin/env python3
"""Портфолио из текстового дампа: объекты + авторы + отзывы + фото из HTML."""
import re, json, html

lines = [l.strip() for l in open('/tmp/oldsite/txt/portfolio.txt', encoding='utf-8') if l.strip()]

# HTML для картинок (по заголовку объекта)
raw = open('/tmp/oldsite/portfolio.html', encoding='utf-8', errors='ignore').read()

items = []
i = 0
while i < len(lines):
    ln = lines[i]
    if ln.startswith('[H2] ') and ln != '[H2] Портфолио':
        title = ln[5:].strip()
        author, review = '', ''
        j = i + 1
        buf = []
        while j < len(lines):
            s = lines[j]
            if s == 'Отзыв заказчика:':
                author = lines[j + 1] if j + 1 < len(lines) else ''
                j += 2
                continue
            if s.startswith('Читать отзыв'):
                j += 1
                break
            if s.startswith('[H2] ') or s.startswith('Строим «под'):
                break
            buf.append(s)
            j += 1
        review = ' '.join(buf).strip()
        # убираем мусор форм
        if 'Нажимая кнопку' in review:
            review = review.split('Нажимая кнопку')[0].strip()
        items.append({'title': title, 'author': author, 'review': review})
        i = j
    else:
        i += 1

# картинки по каждому объекту: ищем в HTML последовательность uploads между заголовками
parts = re.split(r'<h2[^>]*>', raw)
for it in items:
    key = re.sub(r'\s+', ' ', it['title'][:40].replace('&#171;', '"').replace('&#187;', '"'))
    imgs = []
    for p in parts[1:]:
        head = html.unescape(re.sub(r'<[^>]+>', ' ', p[:300]))
        head = re.sub(r'\s+', ' ', head).strip()
        if head[:40] == key[:40]:
            seg = p[:15000]
            raw_imgs = re.findall(r'src="(https?://[^"]+uploads/(?:2026|2025)/[^"]+\.(?:jpg|jpeg|png|webp))"', seg, re.I)
            for ri in raw_imgs:
                ri = re.sub(r'-\d+x\d+(?=\.(?:jpg|jpeg|png|webp)$)', '', ri)
                if 'logo' not in ri.lower() and ri not in imgs:
                    imgs.append(ri)
            break
    it['images'] = imgs[:4]

# дедуп
out = []
seen_t = set()
for it in items:
    t = it['title']
    if t in seen_t:
        continue
    seen_t.add(t)
    if len(t) > 15 and 'меню' not in t.lower():
        out.append(it)

json.dump(out, open('/tmp/oldsite/portfolio.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for it in out:
    print(f"• {it['title'][:80]}")
    print(f"  автор: {it['author'] or '—'} | отзыв: {len(it['review'])} зн. | фото: {len(it['images'])}")
