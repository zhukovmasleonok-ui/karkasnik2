#!/usr/bin/env python3
"""Очистка оставшихся страниц от навигационного мусора."""
import sys

JUNK_PREFIXES = ('Меню', '- ', 'ОГРНИП', 'ИНН', 'Строим «под', 'Каркасные дома', 'СИП-паненые',
                 'Модульные дома', 'Одноэтажные дома', 'Проекты «', 'А-фрейм', 'Двухэтажные дома',
                 'Бани', 'Дачные', 'Коттеджи', 'Дома-бани', 'Дома до 5', 'Индивидуальные проекты',
                 'Достройка', 'Пристройки', 'Адаптация', 'Главная /', '+7 (978', 'Ваш браузер не поддерживает')

def clean(fp, start, count=120):
    txt = open(fp, encoding='utf-8').read().split('\n')
    out, started = [], False
    for ln in txt:
        s = ln.strip()
        if not started:
            if start in ln: started = True
            continue
        if any(s.startswith(j) for j in JUNK_PREFIXES) or s in JUNK_PREFIXES:
            continue
        if s:
            out.append(s)
        if len(out) >= count:
            break
    return out

TASKS = [
    ('/tmp/oldsite/txt/komplektacii-domov-v-krymu_komplektaciya-optimum.txt', 'Оптимум'),
    ('/tmp/oldsite/txt/komplektacii-domov-v-krymu_komplektaciya-absolyut.txt', 'Абсолют'),
    ('/tmp/oldsite/txt/real-objects.txt', 'Объект'),
    ('/tmp/oldsite/txt/portfolio.txt', 'Портфолио'),
    ('/tmp/oldsite/txt/ipoteka-kreditovanie.txt', 'Ипотека'),
    ('/tmp/oldsite/txt/contact2.txt', 'Связ'),
    ('/tmp/oldsite/txt/about-me.txt', 'О компани'),
    ('/tmp/oldsite/txt/services.txt', 'Услуги'),
]
for fp, start in TASKS:
    print(f"\n{'='*20} {fp.split('/')[-1]} {'='*20}")
    lines = clean(fp, start)
    seen = set()
    for l in lines:
        if l in seen: continue
        seen.add(l)
        print(l[:220])
