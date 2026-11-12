#!/usr/bin/env python3
"""Генерация src/content/projects.ts и src/content/portfolio.ts из JSON старого сайта."""
import json, re, os

TECH_MAP = {'Каркасный': 'prefab', 'Сип-панельный': 'sip', 'Модульный': 'modular'}
KIND_BATH = ('парная', 'паро-гармония', 'баня')
KIND_COMM = ('пвз', 'коворкинг', 'кофейня', 'мини-гостиница')

projects = json.load(open('/tmp/oldsite/projects.json', encoding='utf-8'))
portfolio = json.load(open('/tmp/oldsite/portfolio.json', encoding='utf-8'))

def ts_str(s):
    if s is None: return "''"
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'").replace('\u00a0', ' ') + "'"

# ---------- projects.ts ----------
out = ['/**',
       ' * РЕАЛЬНЫЙ КАТАЛОГ ПРОЕКТОВ со старого сайта строяткрымчане.рф (WooCommerce).',
       ' * 27 моделей: названия, площади, состав помещений, три уровня цен, описания, фото.',
       ' * Источник: /projects/* старого сайта. Сгенерировано scripts/gen_content_ts.py.',
       ' */', '',
       "export type ProjectTech = 'sip' | 'prefab' | 'modular';", '',
       'export type RealProject = {',
       '  slug: string;',
       '  name: string;',
       '  tech: ProjectTech[];',
       '  techNames: string[];',
       "  sections: ('comfort' | 'business')[];",
       "  kind: 'house' | 'bath' | 'commercial';",
       '  area: number;',
       '  prices: { label: string; amount: number }[];',
       '  minPrice: number;',
       '  features: string[];',
       '  description: string[];',
       '  images: string[];',
       '  imageAlt: string;',
       '};', '',
       'export const realProjects: RealProject[] = [']

for p in projects:
    tech = [TECH_MAP[t] for t in p['tech'] if t in TECH_MAP]
    tech_names = p['tech']
    low = p['name'].lower()
    kind = 'bath' if any(k in low for k in KIND_BATH) else ('commercial' if any(k in low for k in KIND_COMM) else 'house')
    sections = ['business' if 'Бизнес+' in p['sections'] else None, 'comfort' if 'Комфорт+' in p['sections'] else None]
    sections = [s for s in sections if s] or ['comfort']
    area = 0
    for f in p['features']:
        m = re.search(r'([\d.]+)\s*м²', f)
        if m and 'площадь' in f.lower():
            area = float(m.group(1))
            break
    if not area:
        for f in p['features']:
            m = re.search(r'([\d.]+)\s*м²', f)
            if m:
                area = float(m.group(1)); break
    prices = p['prices'] or [{'label': 'Цена "под ключ"', 'amount': 0}]
    min_price = min(x['amount'] for x in prices) if prices else 0
    imgs = [i for i in (p.get('localImages') or p.get('images')) if i]
    local = [i for i in imgs if i.startswith('/images/')]
    desc = p['description'][:4]
    feats = p['features'][:6]
    out.append('  {')
    out.append(f"    slug: {ts_str(p['slug'])},")
    out.append(f"    name: {ts_str(p['name'])},")
    out.append(f"    tech: [{', '.join(repr(t) for t in tech) or repr('prefab')}],")
    out.append(f"    techNames: [{', '.join(ts_str(t) for t in tech_names)}],")
    out.append(f"    sections: [{', '.join(repr(s) for s in sections)}],")
    out.append(f"    kind: {repr(kind)},")
    out.append(f"    area: {area},")
    out.append('    prices: [')
    for pr in prices:
        out.append(f"      {{ label: {ts_str(pr['label'])}, amount: {pr['amount']} }},")
    out.append('    ],')
    out.append(f"    minPrice: {min_price},")
    out.append('    features: [')
    for f in feats:
        out.append(f"      {ts_str(f)},")
    out.append('    ],')
    out.append('    description: [')
    for d in desc:
        out.append(f"      {ts_str(d)},")
    out.append('    ],')
    out.append(f"    images: [{', '.join(ts_str(i) for i in local)}],")
    out.append(f"    imageAlt: {ts_str(p['name'] + ' — проект дома в Крыму')},")
    out.append('  },')
out.append('];')
out.append('')
out.append('export const projectsCount = realProjects.length;')
out.append('')
open('/home/z/my-project/src/content/projects.ts', 'w', encoding='utf-8').write('\n'.join(out))
print('projects.ts:', os.path.getsize('/home/z/my-project/src/content/projects.ts'), 'bytes')

# ---------- portfolio.ts ----------
def parse_location(title):
    m = re.search(r'\((г\.[^)]+|пгт\.[^)]+|с\.[^)]+|п\.[^)]+)\)', title)
    return m.group(1).strip() if m else ''

def parse_tech(title):
    low = title.lower()
    tags = []
    if 'сип' in low: tags.append('СИП')
    if 'каркасн' in low or 'а-фрейм' in low or 'а-фрейма' in low: tags.append('Каркас')
    if 'модульн' in low: tags.append('Модуль')
    if 'префаб' in low: tags.append('«Префаб»')
    if 'надстройка' in low or 'пристройка' in low: tags.append('Надстройка/пристройка')
    return tags

out = ['/**',
       ' * РЕАЛЬНОЕ ПОРТФОЛИО: построенные объекты и отзывы заказчиков',
       ' * со старого сайта строяткрымчане.рф /portfolio/. Отзывы — дословно,',
       ' * источники: Авито и другие площадки (см. source).',
       ' */', '',
       'export type RealObject = {',
       '  title: string;',
       '  location: string;',
       '  tags: string[];',
       '  image: string | null;',
       '  image2: string | null;',
       "  review: { author: string; text: string; source: string } | null;",
       '};', '',
       'export const realObjects: RealObject[] = [']

for it in portfolio:
    title = it['title'].strip()
    loc = parse_location(title)
    tags = parse_tech(title)
    imgs = [i for i in (it.get('localImages') or []) if i]
    rev = None
    if it.get('review') and len(it['review']) > 80:
        author = (it.get('author') or '').strip()
        if author.lower() in ('оклана',): author = 'Оксана'
        rev = {'author': author, 'text': it['review'].strip(), 'source': 'Авито'}
    out.append('  {')
    out.append(f"    title: {ts_str(title)},")
    out.append(f"    location: {ts_str(loc)},")
    out.append(f"    tags: [{', '.join(ts_str(t) for t in tags)}],")
    out.append(f"    image: {ts_str(imgs[0]) if imgs else 'null'},")
    out.append(f"    image2: {ts_str(imgs[1]) if len(imgs) > 1 else 'null'},")
    if rev:
        out.append('    review: {')
        out.append(f"      author: {ts_str(rev['author'])},")
        out.append(f"      text: {ts_str(rev['text'])},")
        out.append(f"      source: {ts_str(rev['source'])},")
        out.append('    },')
    else:
        out.append('    review: null,')
    out.append('  },')
out.append('];')
out.append('')
open('/home/z/my-project/src/content/portfolio.ts', 'w', encoding='utf-8').write('\n'.join(out))
print('portfolio.ts:', os.path.getsize('/home/z/my-project/src/content/portfolio.ts'), 'bytes')
print('DONE')
