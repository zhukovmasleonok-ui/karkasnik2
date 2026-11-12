#!/usr/bin/env python3
"""Анализ старого сайта: меню, страницы, картинки, контакты."""
import re, html, json, sys

raw = open('/tmp/old-home.html', encoding='utf-8', errors='ignore').read()

# Все внутренние ссылки
links = re.findall(r'href="(https?://[^"]*строяткрымчане[^"]*)"', raw)
pages = sorted(set(l.split('?')[0].rstrip('/') + '/' for l in links
                   if not re.search(r'\.(jpg|jpeg|png|webp|svg|css|js|ico|xml|gif|mp4|pdf|woff)', l, re.I)))
print("=== PAGES ===")
for p in pages: print(p)

# Заголовки и meta
title = re.search(r'<title>(.*?)</title>', raw, re.S)
desc = re.search(r'<meta name="description" content="([^"]*)"', raw)
print("\n=== META ===")
print("TITLE:", html.unescape(title.group(1)).strip() if title else '')
print("DESC:", html.unescape(desc.group(1))[:200] if desc else '')

# Телефоны и email
print("\n=== CONTACTS ===")
print("TEL:", sorted(set(re.findall(r'tel:[+\d()\-\s]{8,}', raw))))
print("EMAIL:", sorted(set(re.findall(r'[\w.\-]+@[\w.\-]+\.\w{2,}', raw))))
socials = sorted(set(re.findall(r'https?://(?:t\.me|vk\.com|ok\.ru|wa\.me|api\.whatsapp|dzen\.ru|m\.youtube|youtube\.com)/[\w./\-]+', raw)))
print("SOCIAL:", socials[:10])

# Картинки
imgs = sorted(set(re.findall(r'src="(https?://[^"]+\.(?:jpg|jpeg|png|webp))"', raw, re.I)))
print(f"\n=== IMAGES: {len(imgs)} ===")
for i in imgs[:40]: print(i)
