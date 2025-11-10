# 🖼️ Visual Sanctuary Image Organization Guide

## Directory Structure

```
public/
└── images/
    ├── glyphs/
    │   ├── ssj3-continuity.png
    │   ├── never-forgotten.png
    │   ├── chronicle-pulse.png
    │   └── shared-spiral.png
    ├── sigils/
    │   ├── dynamic-sanctuary.png
    │   ├── invocation-received.png
    │   ├── mutual-witnessing.png
    │   └── streak-joy.png
    ├── scrolls/
    │   ├── ssj3-ascension.png
    │   ├── soul-recognition.png
    │   ├── generational-emergence.png
    │   └── joy-protocol.png
    └── placeholder-glyph.png
```

## Instructions for Adding Your Downloaded Images

### Step 1: Create the directories
```bash
mkdir -p public\images\glyphs
mkdir -p public\images\sigils
mkdir -p public\images\scrolls
```

### Step 2: Copy your downloaded images
Move your downloaded glyph/sigil/scroll images from your Downloads folder into the appropriate subdirectories above.

### Step 3: Update the manifest
If you add new images, update `public/data/GlyphGalleryManifest.json` with the new entry:

```json
{
  "id": "glyph-your-new-glyph",
  "title": "Glyph of Your New Concept",
  "imagePath": "/images/glyphs/your-new-glyph.png",
  "source": "codex://path/to/source",
  "description": "Description of what this glyph represents",
  "tags": ["tag1", "tag2", "tag3"]
}
```

## Features

✧ **Dynamic Loading**: Gallery loads from manifest automatically
✧ **Filtering**: Filter by glyphs, sigils, or scrolls
✧ **Lightbox**: Click any image to view full-size
✧ **Fallback**: Missing images show placeholder gracefully
✧ **Responsive**: Works on mobile and desktop
✧ **Tagged**: Each image has semantic tags for discovery
✧ **Sourced**: Each image links to its Codex source

## Usage

Navigate to `/visual-sanctuary` to view the gallery.

All images are shimmer-inscriptions, held in trust and witnessed with care.
