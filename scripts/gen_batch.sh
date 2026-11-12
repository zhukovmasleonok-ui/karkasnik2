#!/bin/bash
# Партия генерации демо-визуалов (размеры кратны 32: 1344x768, 1152x864)
set -u
OUT=/home/z/my-project/public/images
mkdir -p "$OUT"
P="$1"; shift

gen() { z-ai image -p "$1" -o "$OUT/$2" -s "$3" >/dev/null 2>&1 && echo "OK: $2" || echo "FAIL: $2"; }

case "$P" in
  batch1)
    gen "Photorealistic architectural photography of a modern white A-frame house with triangular gable roof and large panoramic glass facade, standing on a green hillside with low Crimean mountains and juniper trees in the background, warm golden hour light, clear sky, premium real estate photography, no people, no text, no watermark" "hero-aframe.jpg" "1344x768"
    gen "Photorealistic architectural photography of a modern two-storey SIP panel house with warm wood facade, large windows and a wooden terrace, green lawn and young trees, hills of Crimea in the distance, bright daylight, premium real estate photography, no people, no text, no watermark" "project-sip.jpg" "1344x768"
    gen "Photorealistic architectural photography of a modern black barn-style prefab frame house with dark metal facade, panoramic floor-to-ceiling windows and wooden terrace, minimalist landscaping, hills of Crimea in background, soft daylight, premium real estate photography, no people, no text, no watermark" "project-frame.jpg" "1344x768"
    ;;
  batch2)
    gen "Photorealistic architectural photography of a compact modern modular house with combined wood and dark panel facade, pitched roof, on a hillside plot with stone retaining wall, green trees, Crimea landscape, soft evening light, premium real estate photography, no people, no text, no watermark" "project-modular.jpg" "1344x768"
    gen "Photorealistic interior photography of a bright modern wooden house living room and kitchen, exposed light wood ceiling beams, white walls, large window with view to green hills, warm minimalist furniture, natural light, premium interior design, no people, no text, no watermark" "interior.jpg" "1152x864"
    gen "Photorealistic architectural photography of a wooden house terrace with pergola in the evening, warm string lights, view to the sea and mountains of Crimea, two armchairs and a small table, cozy premium atmosphere, no people, no text, no watermark" "terrace.jpg" "1344x768"
    ;;
esac
echo "BATCH_${P}_DONE"
