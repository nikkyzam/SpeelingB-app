# Book Reading Assets

This directory contains assets for the Christian Book Reading feature.

## Image Assets

### Book Covers (`covers/`)
- `book-1.svg` to `book-8.svg` - Colored book covers with Christian symbols
- `placeholder.svg` - Generic book cover template

### Christian Scenes (`christian/`)
- `creation.svg` - Creation story scene
- `noahs-ark.svg` - Noah's Ark scene with rainbow
- `david-goliath.svg` - David facing Goliath
- `baby-jesus.svg` - Christmas nativity scene

## How to Replace Placeholder Assets

### 1. Book Covers
Replace SVG files with actual book cover images:
```bash
# Convert your images to optimized WebP format
#convert your-image.jpg -resize 400x500 -quality 80 covers/book-1.webp
