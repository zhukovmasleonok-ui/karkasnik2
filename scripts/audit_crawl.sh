#!/bin/bash
# Выкачивание всех содержательных страниц старого сайта для аудита переноса
DOM="xn--80aknigcncfkc7d8byc.xn--p1ai"
OUT=/tmp/oldsite
mkdir -p "$OUT"

# фильтр: только реальные страницы
grep -v -E '(\?wpr_|metform-form|/author/|/tag/|/category/|testovaya|shablon-|sample-page|primer-stranicy|/1/$|home1|wpr_mega)' /tmp/all-urls.txt | sort -u > /tmp/real-urls.txt

dl() {
  url="$1"
  base="${url#https://$DOM/}"
  [ -z "$base" ] && base="index"
  base="${base%/}"
  base="${base//\//_}"
  [ "$base" = "$DOM" ] && base="index"
  curl -sL --max-time 40 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" "$url" -o "$OUT/$base.html"
  echo "$base : $(wc -c < "$OUT/$base.html" 2>/dev/null)"
}
export -f dl
export DOM OUT

cat /tmp/real-urls.txt | xargs -P 6 -I{} bash -c 'dl "$@"' _ {}
echo "---- скачано файлов: $(ls $OUT/*.html | wc -l)"
