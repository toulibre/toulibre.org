#!/usr/bin/env bash
# Convert all JPG images in public/static/img/ to AVIF, WebP and PNG using ImageMagick.
# Usage: ./scripts/convert-images.sh

set -euo pipefail

IMG_DIR="$(cd "$(dirname "$0")/../public/static/img" && pwd)"

for jpg in "$IMG_DIR"/*.jpg; do
  [ -f "$jpg" ] || continue
  base="${jpg%.jpg}"
  name="$(basename "$base")"

  echo "Converting $name.jpg ..."
  magick "$jpg" "${base}.avif"
  magick "$jpg" "${base}.webp"
  magick "$jpg" "${base}.png"
done

echo "Done."
