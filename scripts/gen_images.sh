#!/bin/bash
# Генерация демо-архитектурных визуалов (пометка: заменить на профессиональные фото объектов)
set -u
OUT=/home/z/my-project/public/images
mkdir -p "$OUT"

z-ai image -p "Photorealistic architectural photography of a modern white A-frame house with triangular gable roof and large panoramic glass facade, standing on a green hillside with low Crimean mountains and juniper trees in the background, warm golden hour light, clear sky, premium real estate photography, no people, no text, no watermark" -o "$OUT/hero-aframe.jpg" -s 1440x720 &
P1=$!
wait $P1

z-ai image -p "Photorealistic architectural photography of a modern two-storey SIP panel house with warm wood facade, large windows and a wooden terrace, green lawn and young trees, hills of Crimea in the distance, bright daylight, premium real estate photography, no people, no text, no watermark" -o "$OUT/project-sip.jpg" -s 1344x768 &
P2=$!
wait $P2

z-ai image -p "Photorealistic architectural photography of a modern black barn-style prefab frame house with dark metal facade, panoramic floor-to-ceiling windows and wooden terrace, minimalist landscaping, hills of Crimea in background, soft daylight, premium real estate photography, no people, no text, no watermark" -o "$OUT/project-frame.jpg" -s 1344x768 &
P3=$!
wait $P3

z-ai image -p "Photorealistic architectural photography of a compact modern modular house with combined wood and dark panel facade, pitched roof, on a hillside plot with stone retaining wall, green trees, Crimea landscape, soft evening light, premium real estate photography, no people, no text, no watermark" -o "$OUT/project-modular.jpg" -s 1344x768 &
P4=$!
wait $P4

z-ai image -p "Photorealistic interior photography of a bright modern wooden house living room and kitchen, exposed light wood ceiling beams, white walls, large window with view to green hills, warm minimalist furniture, natural light, premium interior design, no people, no text, no watermark" -o "$OUT/interior.jpg" -s 1152x864 &
P5=$!
wait $P5

z-ai image -p "Photorealistic architectural photography of a wooden house terrace with pergola in the evening, warm string lights, view to the sea and mountains of Crimea, two armchairs and a small table, cozy premium atmosphere, no people, no text, no watermark" -o "$OUT/terrace.jpg" -s 1344x768 &
P6=$!
wait $P6

echo "ALL_IMAGES_DONE"
