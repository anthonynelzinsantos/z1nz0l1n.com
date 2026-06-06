# Z1NZ0L1N

Reading, writing, walking. Not (always) at the same time. By Anthony Nelzin-Santos.

## Requirements

- Hugo Extended 0.161+

## Filesystem

```
.
├── hugo.toml                 # config: params, permalinks, taxonomies, markup, outputs
├── content/                  # all content, as leaf bundles (Markdown + images)
│   ├── dispatches/<slug>/    #   blog posts ("dispatches")
│   │   ├── index.md          #     front matter + Markdown body
│   │   ├── feature.jpg       #     hero image (found by convention)
│   │   └── *.jpg             #     inline / gallery images
│   ├── from/<slug>/_index.md #   location term pages (emoji display titles)
│   ├── about|blogroll|legal|styleguide/index.md
│   └── archive.md            #   the “all dispatches” index (layout: archive)
├── layouts/                  # the template system (described below)
├── static/                   # copied verbatim to the site root
│   ├── .htaccess             #   Apache hardening, CSP, caching, feed redirects
│   ├── assets/built/screen.css
│   ├── assets/js/theme.js    #   the print/tape/typewriter effects
│   ├── assets/fonts/*.woff2  #   Forma, Forma Mono, Rocksalt
│   └── public/cards.min.css  #   Ghost Koenig gallery/callout CSS (vendored)
└── resources/                # Hugo's processed-image cache (generated)
```

### Authoring a dispatch

```yaml
---
title: "26W08. Safe travels"
date: "2026-02-22T11:00:00.000Z"
slug: "26w08"
feature_image_alt: "A view of the cathedral of Marseille…"
feature_image_caption: "Marseille (France), 2025-02."
from:
  - "marseille-fr"      # first entry is shown in the post's "From:" memo
---
```

- Feature image. Drop a `feature.jpg` (or `.png`/`.webp`) in the bundle. `feature_image_alt` and `feature_image_caption` are optional.
- Inline images. Use plain Markdown: `![alt](photo.jpg)`. Add a title for a caption: `![alt](photo.jpg "A caption")`. They are rendered by the image render hook into the same framed “print” as the hero.
- Galleries. Use the `gallery` shortcode — one image filename per line, a blank line starts a new row, optional `caption`:

  ```
  {{</* gallery caption="Marseille (France), 2025/02." */>}}
  wall.jpg
  stairs.jpg
  market.jpg

  turnstiles.jpg
  rocket.jpg
  {{</* /gallery */>}}
  ```

## Template architecture

All templates live in `layouts/`. There is no separate Hugo theme.

## Key systems

### Colour: the hue system

The single accent colour is an **LCH hue** set per page as `--hue` on `<html>` (and per row on archive/term lists). `partials/hue.html` computes it from the content date
as a seasonal cosine wave:

```
hue = baseHue + hueAmplitude · cos( 2π · (dayOfYear − huePeakDay) / 365.25 )
```

The palette eases from blue‑violet at midwinter to magenta at the summer solstice and back, continuously across the New Year. Tunable in `hugo.toml` with `baseHue` (298, Purple), `hueAmplitude` (40) and `huePeakDay` (172). Can be disabled entirely by setting `dynamicColour` to `false`.

### The “photographic print” treatment

Every image on the site — hero, inline content images, and gallery cells — shares one component: a white‑bordered print with a soft shadow, corner `marks`, a slight random wobble and a grain/glare “sheen.” It is driven by:

- CSS. The `.photo` wrapper, `.photo-print`, and the global  `.marks` / `.photo-sheen` rules. Per‑context tuning via CSS variables (`--photo-pad`, `--mark-size`, `--photo-twist`).
- JS. On load it walks every `.photo-print` and adds the random twist and the SVG sheen. Washi tape is added to the hero only; gallery captions ride on a torn cream paper‑tape label (same serrated/grained SVG, fixed  `--color-tape-paper`).

### Typewriter misprints

The JS also injects the typewriter‑misprint letter wobble and binds `j`/`k`/`←`/`→` keyboard navigation.