#!/usr/bin/env python3
"""Повторное скачивание фото с валидацией содержимого (magic bytes)."""
import json, subprocess, os, re

PUB = '/home/z/my-project/public/images'
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
MAGIC = [(b'\xff\xd8\xff', 'jpg'), (b'\x89PNG', 'png'), (b'RIFF', 'webp')]

def sniff(fp):
    try:
        with open(fp, 'rb') as f:
            head = f.read(12)
        for m, ext in MAGIC:
            if head.startswith(m):
                return ext
    except Exception:
        pass
    return None

def candidates_for(url):
    """URL как на странице + типовые размеры WordPress."""
    out = []
    stem = url.rsplit('/', 1)[0]
    name = url.split('/')[-1]
    nm = re.match(r'([\s\S]+?)((?:-\d+x\d+)?)(\.(?:jpg|jpeg|png|webp))(\.webp)?$', name, re.I)
    if nm:
        base, ext = f"{stem}/{nm.group(1)}", (nm.group(3) + (nm.group(4) or '')).lower()
        for sz in ('-800x600', '-600x450', '-1024x768'):
            out.append(f"{base}{sz}{ext}")
    out.append(url)
    return out

def dl(url, dest_base):
    import glob as _g
    existing = _g.glob(dest_base + '.*')
    if existing and os.path.getsize(existing[0]) > 15000:
        return existing[0], os.path.getsize(existing[0])
    for c in candidates_for(url):
        r = subprocess.run(
            ['curl', '-s', '-m', '40', '-A', UA, '-w', '%{http_code}', '-o', '/tmp/dlimg.bin', c],
            capture_output=True, text=True)
        if r.stdout.strip() != '200' or not os.path.exists('/tmp/dlimg.bin'):
            continue
        ext = sniff('/tmp/dlimg.bin')
        if ext:
            dest = f"{dest_base}.{ext}"
            os.replace('/tmp/dlimg.bin', dest)
            return dest, os.path.getsize(dest)
    if os.path.exists('/tmp/dlimg.bin'):
        os.remove('/tmp/dlimg.bin')
    return None, 0

def run_group(items, folder, img_key, name_fn):
    ok = fail = total = 0
    for it in items:
        files = []
        for j, url in enumerate((it.get(img_key) or [])[:6]):
            dest = f'{PUB}/{folder}/{name_fn(it, j)}'
            got, size = dl(url, dest)
            if got:
                files.append(f"/images/{folder}/{os.path.basename(got)}")
                ok += 1; total += size
            else:
                files.append(None); fail += 1
        it['localImages'] = files
    print(f"{folder}: ok={ok} fail={fail} total={total/1e6:.1f}MB")

projects = json.load(open('/tmp/oldsite/projects.json', encoding='utf-8'))
run_group(projects, 'objects', 'images', lambda p, j: f"{p['slug']}-{j+1}")
json.dump(projects, open('/tmp/oldsite/projects.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

portfolio = json.load(open('/tmp/oldsite/portfolio.json', encoding='utf-8'))
run_group(portfolio, 'portfolio', 'images', lambda o, j: f"obj-{[x['title'] for x in portfolio].index(o['title'])+1}-{j+1}")
json.dump(portfolio, open('/tmp/oldsite/portfolio.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# Экстры: логотип, карта, категории — проверим и перекачаем при необходимости
extras = {
    'logo-white.png': 'https://xn--80aknigcncfkc7d8byc.xn--p1ai/wp-content/uploads/2025/10/Stroyat-Krymchane-logo-beloe.png',
    'logo-footer.png': 'https://xn--80aknigcncfkc7d8byc.xn--p1ai/wp-content/uploads/2026/08/Stroyat-Krymchane-logo-dlya-futera-2.png',
    'karta-geografiya.png': 'https://xn--80aknigcncfkc7d8byc.xn--p1ai/wp-content/uploads/2026/09/karta-Georgrafiya-stroitelstva.png',
    'cat-sip.jpg': 'https://xn--80aknigcncfkc7d8byc.xn--p1ai/wp-content/uploads/2026/05/1-СИП-панельные-дома-на-главную.jpg.webp',
    'cat-frame.jpg': 'https://xn--80aknigcncfkc7d8byc.xn--p1ai/wp-content/uploads/2026/05/2-Каркасные-дома-на-главную.jpg-1.webp',
    'cat-modular.jpg': 'https://xn--80aknigcncfkc7d8byc.xn--p1ai/wp-content/uploads/2026/05/3-Модульные-дома-на-главную.jpg.webp',
}
for name, url in extras.items():
    got, size = dl(url, f'{PUB}/{name.rsplit(".", 1)[0]}')
    print(f"{name}: {'OK ' + str(size//1024) + 'KB' if got else 'FAIL'}")
print('REDOWNLOAD_DONE')
