#!/usr/bin/env python3
"""Извлечение портфолио (реальные объекты + отзывы) со старого сайта."""
import re, html, json

raw = open('/tmp/oldsite/portfolio.html', encoding='utf-8', errors='ignore').read()

# блоки: заголовок H2 объекта ... далее возможен отзыв
# В Elementor контент идёт последовательными секциями; разбиваем по H2 заголовкам объектов
parts = re.split(r'<h2[^>]*>\s*', raw)
items = []
for p in parts[1:]:
    title = html.unescape(re.sub(r'<[^>]+>', '', p[:p.find('</h2>') if '</h2>' in p else 200])).strip()
    seg = p[:12000]
    # авторы отзывов: обычно в отдельном элементе перед текстом
    author_m = re.search(r'Отзыв заказчика:\s*</[^>]+>\s*(?:<[^>]+>\s*)*([^<]{2,60})<', seg)
    if not author_m:
        # ищем имя по паттерну цитаты
        author_m = re.search(r'(?:"|«)([^"«»]{2,60})(?:»|")[\s\S]{0,200}?Читать отзыв', seg)
    # текст отзыва: от автора до «Читать отзыв»
    review = ''
    am = re.search(r'Отзыв заказчика:', seg)
    if am:
        rseg = seg[am.end():am.end()+6000]
        # текст = крупные абзацы
        paras = re.findall(r'<p[^>]*>([\s\S]{100,4000}?)</p>', rseg)
        texts = []
        for pp in paras:
            t = html.unescape(re.sub(r'<[^>]+>', ' ', pp))
            t = re.sub(r'\s+', ' ', t).strip()
            if len(t) > 100 and 'контактн' not in t.lower() and 'соглас' not in t.lower() and 'перезвон' not in t.lower():
                texts.append(t)
        if texts:
            review = texts[0]
    # имя автора: короткая строка сразу после «Отзыв заказчика:»
    author = ''
    if am:
        after = seg[am.end():am.end() + 800]
        m = re.search(r'>([^<>]{2,60})</(?:a|p|div|span|h\d|strong)>', after)
        if m:
            cand = m.group(1).strip()
            if not cand.lower().startswith(('нажимая', 'мы ', 'ваше', 'номер')):
                author = cand
    # картинки объекта
    imgs = re.findall(r'src="(https?://[^"]+uploads/(?:2026|2025)/[^"]+)"', seg)
    imgs = [re.sub(r'-\d+x\d+(?=\.(?:jpg|jpeg|png|webp)$)', '', i) for i in imgs]
    imgs = [i for i in imgs if 'logo' not in i.lower() and not i.lower().endswith(('.svg',))][:6]
    seen = set(); uimgs = []
    for i in imgs:
        if i not in seen:
            seen.add(i); uimgs.append(i)
    if title and len(title) > 15 and 'меню' not in title.lower():
        items.append({'title': title, 'author': author, 'review': review, 'images': uimgs})

json.dump(items, open('/tmp/oldsite/portfolio.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for it in items:
    print(f"• {it['title'][:90]}")
    print(f"  автор: {it['author'] or '—'} | отзыв: {len(it['review'])} зн. | фото: {len(it['images'])}")
