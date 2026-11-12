#!/usr/bin/env python3
"""Скачивание реальных фото со старого сайта в public/images."""
import json, subprocess, os, time, re

PUB = '/home/z/my-project/public/images'
os.makedirs(f'{PUB}/objects', exist_ok=True)
os.makedirs(f'{PUB}/portfolio', exist_ok=True)
UA = '-A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"'

def dl(url, dest, size_hint=None):
    """Скачивает url в dest; сначала пробует вариант 800x600 для галерей."""
    candidates = []
    if size_hint:
        m = re.match(r'([\s\S]+)(\.\w{3,4})$', url)
        candidates.append(f'{m.group(1)}-800x600{m.group(2)}')
        candidates.append(f'{m.group(1)}-600x450{m.group(2)}')
    candidates.append(url)
    for c in candidates:
        r = subprocess.run(f'curl -s -m 30 {UA} "{c}" -o "{dest}"', shell=True, capture_output=True)
        if os.path.exists(dest) and os.path.getsize(dest) > 15000:
            return c, os.path.getsize(dest)
    return None, 0

manifest = {}
total = 0

# 1. Проекты: галереи
projects = json.load(open('/tmp/oldsite/projects.json'))
for p in projects:
    files = []
    for idx, url in enumerate(p['images'][:6]):
        dest = f"{PUB}/objects/{p['slug']}-{idx+1}.webp"
        got, size = dl(url, dest, size_hint=True)
        if got:
            ext = dest.rsplit('.', 1)[-1]
            final = f"objects/{p['slug']}-{idx+1}.{ext}"
            if dest != f"{PUB}/{final}":
                os.rename(dest, f"{PUB}/{final}")
            files.append(f"/images/{final}")
            total += size
        else:
            files.append(None)
    p['localImages'] = files
    print(f"{p['slug']}: {sum(1 for f in files if f)}/{len(files)} фото")

# 2. Портфолио
portfolio = json.load(open('/tmp/oldsite/portfolio.json'))
for idx, it in enumerate(portfolio):
    files = []
    for j, url in enumerate(it['images'][:2]):
        dest = f"{PUB}/portfolio/obj-{idx+1}-{j+1}.webp"
        got, size = dl(url, dest, size_hint=True)
        if got:
            ext = dest.rsplit('.', 1)[-1]
            final = f"portfolio/obj-{idx+1}-{j+1}.{ext}"
            if dest != f"{PUB}/{final}":
                os.rename(dest, f"{PUB}/{final}")
            files.append(f"/images/{final}")
            total += size
        else:
            files.append(None)
    it['localImages'] = files

# 3. Логотип, карта, картинки технологий на главную
extras = {
    'logo-white.png': 'https://xn--80aknigcncfkc7d8byc.xn--p1ai/wp-content/uploads/2025/10/Stroyat-Krymchane-logo-beloe.png',
    'logo-footer.png': 'https://xn--80aknigcncfkc7d8byc.xn--p1ai/wp-content/uploads/2026/08/Stroyat-Krymchane-logo-dlya-futera-2.png',
    'karta-geografiya.png': 'https://xn--80aknigcncfkc7d8byc.xn--p1ai/wp-content/uploads/2026/09/karta-Georgrafiya-stroitelstva.png',
    'cat-sip.jpg': 'https://xn--80aknigcncfkc7d8byc.xn--p1ai/wp-content/uploads/2026/05/1-СИП-панельные-дома-на-главную.jpg.webp',
    'cat-frame.jpg': 'https://xn--80aknigcncfkc7d8byc.xn--p1ai/wp-content/uploads/2026/05/2-Каркасные-дома-на-главную.jpg-1.webp',
    'cat-modular.jpg': 'https://xn--80aknigcncfkc7d8byc.xn--p1ai/wp-content/uploads/2026/05/3-Модульные-дома-на-главную.jpg.webp',
}
for name, url in extras.items():
    dest = f'{PUB}/{name}'
    got, size = dl(url, dest)
    manifest[name] = {'ok': bool(got), 'size': size, 'src': got or url}
    total += size
    print(f"{name}: {'OK' if got else 'FAIL'} {size//1024}KB")

# 4. Hero со старого сайта? Проверим главную на большие картинки
json.dump(manifest, open('/tmp/oldsite/extras.json', 'w'), ensure_ascii=False, indent=1)
json.dump(projects, open('/tmp/oldsite/projects.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(portfolio, open('/tmp/oldsite/portfolio.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f"\nИТОГО скачано: {total/1024/1024:.1f} MB")
print("ALL_DOWNLOADS_DONE")
