#!/usr/bin/env python3
"""Извлечение чистого текста из скачанных WP-страниц (Elementor)."""
import re, html, os, glob

IN = '/tmp/oldsite'
OUT = '/tmp/oldsite/txt'
os.makedirs(OUT, exist_ok=True)

def extract(fp):
    raw = open(fp, encoding='utf-8', errors='ignore').read()
    # вырезаем head, script, style
    raw = re.sub(r'<head[\s\S]*?</head>', ' ', raw)
    raw = re.sub(r'<(script|style|noscript)[\s\S]*?</\1>', ' ', raw, flags=re.I)
    # шапка/футер/попапы Elementor часто дублируются — оставляем всё, потом отфильтруем глазами
    # размечаем структурные теги
    raw = re.sub(r'<(h[1-6])[^>]*>', lambda m: f"\n\n[{m.group(1).upper()}] ", raw)
    raw = re.sub(r'</h[1-6]>', '\n', raw)
    raw = re.sub(r'<li[^>]*>', '\n- ', raw)
    raw = re.sub(r'<(p|div|section|figure|figcaption|blockquote|tr)[^>]*>', '\n', raw)
    raw = re.sub(r'</(p|div|section|figure|blockquote|tr|ul|ol)>', '\n', raw)
    raw = re.sub(r'<img[^>]*alt="([^"]+)"[^>]*>', r' [IMG: \1] ', raw)
    raw = re.sub(r'<a[^>]*href="([^"]+)"[^>]*>\s*$', r' [LINK: \1] ', raw)
    txt = re.sub(r'<[^>]+>', ' ', raw)
    txt = html.unescape(txt)
    # чистим пробелы, но сохраняем структуру строк
    lines = []
    for ln in txt.split('\n'):
        ln = re.sub(r'[ \t\xa0]+', ' ', ln).strip()
        if ln and ln not in ('-',):
            lines.append(ln)
    # дедуп соседних повторов
    out = []
    for ln in lines:
        if not out or out[-1] != ln:
            out.append(ln)
    return '\n'.join(out)

for fp in sorted(glob.glob(IN + '/*.html')):
    name = os.path.basename(fp).replace('.html', '')
    txt = extract(fp)
    with open(f"{OUT}/{name}.txt", 'w', encoding='utf-8') as f:
        f.write(txt)
    print(f"{name}: {len(txt)} chars, {txt.count(chr(10))+1} lines")
