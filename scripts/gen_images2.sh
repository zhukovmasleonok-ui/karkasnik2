#!/bin/bash
# Генерация чистых фотореалистичных изображений (без текста) для карточек и преимуществ
set -u
IMG=/home/z/my-project/public/images
gen() {
  local file="$1"; local size="$2"; shift 2
  local prompt="$*"
  if [ -s "$IMG/$file" ]; then echo "SKIP $file"; return; fi
  echo "== $file"
  z-ai image -p "$prompt. Photorealistic premium architectural photography, soft natural daylight, muted warm tones, no people, no text, no letters, no watermarks, no logos, no captions." -o "$IMG/$file" -s "$size" \
    && echo "OK $file" || echo "FAIL $file"
}

gen project-mini.jpg 1344x768 "Small compact modern A-frame cabin house about 15 square meters on a green lawn plot in Crimea, light wood facade, large triangular front window, young fruit trees, garden fence, distant low hills, bright daylight"
gen project-frame2.jpg 1344x768 "Two-storey modern scandinavian frame house with dark graphite board facade and warm wood accents, panoramic corner glazing, flat terrace, pine trees around, Crimean hills in background, golden hour light"
gen project-krym.jpg 1344x768 "Large modern two-storey family house about 100 square meters combining natural stone plinth, warm wood cladding and dark metal roof, spacious terrace with pergola, landscaped garden with lavender, Crimean mountains backdrop, clear sky"
gen work-frame-clean.jpg 1152x864 "Construction close-up: neatly stacked dry planed timber lumber boards wrapped for protection next to an assembled wooden house frame skeleton, bright workshop yard, shallow depth of field"
gen work-slope-clean.jpg 1152x864 "Modern wooden house on tall metal pile supports standing on a steep hillside slope with big height difference, pine forest around, mountain valley view, daylight"
gen work-contract-clean.jpg 1152x864 "Signing of a construction contract: close-up of documents with blueprints, pen in hand on a light wooden table, notebook and glasses nearby, soft office daylight, shallow depth of field"

echo "ALL_IMAGES_DONE"
