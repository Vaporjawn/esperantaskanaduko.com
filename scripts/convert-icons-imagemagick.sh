#!/bin/bash

# Icon Conversion Script using ImageMagick
# Converts SVG icons to PNG format for Chrome extension
#
# Prerequisites: brew install imagemagick
# Run: chmod +x scripts/convert-icons-imagemagick.sh && npm run convert:icons:imagemagick

set -e

ICONS_DIR="public/icons"

echo "🎨 Converting SVG icons to PNG..."
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Please install it:"
    echo "   brew install imagemagick"
    exit 1
fi

# Convert icon16.svg to PNG
echo "Converting icon16.svg → icon16.png (16x16)"
convert -background none -resize 16x16 "$ICONS_DIR/icon16.svg" "$ICONS_DIR/icon16.png"

# Convert icon48.svg to PNG
echo "Converting icon48.svg → icon48.png (48x48)"
convert -background none -resize 48x48 "$ICONS_DIR/icon48.svg" "$ICONS_DIR/icon48.png"

# Convert icon128.svg to PNG
echo "Converting icon128.svg → icon128.png (128x128)"
convert -background none -resize 128x128 "$ICONS_DIR/icon128.svg" "$ICONS_DIR/icon128.png"

echo ""
echo "✅ Icon conversion complete!"
echo ""
echo "Generated PNG files:"
ls -lh "$ICONS_DIR"/*.png

echo ""
echo "🎯 Next steps:"
echo "   1. Add Google Cloud API key to .env"
echo "   2. Run: npm run build"
echo "   3. Load dist/ folder in chrome://extensions/"
