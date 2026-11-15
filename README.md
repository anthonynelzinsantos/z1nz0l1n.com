# Z1NZ0L1N

Reading, writing, walking. Not (always) at the same time. By Anthony Nelzin-Santos.

## Requirements

- Hugo Extended 0.146+

## Filesystem

```
.
├── hugo.toml                 # config
├── content/                  # all content as leaf bundles (Markdown + images)
│   ├── _index.md              #   homepage/about
│   ├── dispatches/<slug>/    #   blog posts
│   │   ├── index.md          #     front matter + Markdown body
│   │   ├── feature.jpg       #     hero image
│   │   └── *.jpg             #     inline/gallery images
│   ├── from/<slug>/_index.md #   location term pages
│   └── colophon|styleguide/index.md
├── layouts/                  # the template system
├── static/                   # copied to the site root
│   ├── .htaccess
│   ├── assets/built/screen.css
│   ├── assets/built/{glightbox.min.css,maplibre-gl.css}
│   ├── assets/js/theme.js
│   ├── assets/js/{glightbox.min.js,maplibre-gl.js,map.js}
│   └── assets/fonts/*.woff2  #   Vulf Sans, Vulf Mono, Rocksalt
└── resources/                # Hugo’s processed-image cache
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
  - "marseille-fr"
---
```

- Feature image. Drop a `feature.jpg` (or `.png`/`.webp`) in the bundle. `feature_image_alt` and `feature_image_caption` are optional.
- Inline images. Use plain Markdown: `![alt](photo.jpg)`. Add a title for a caption: `![alt](photo.jpg "A caption")`. They are rendered by the image render hook into the same framed “print” as the hero.
- Galleries. Use the `gallery` shortcode — one image filename per line, a blank line starts a new row, optional `caption` and `aside` (narrower, right-hand column):

  ```
  {{</* gallery caption="Marseille (France), 2025/02." */>}}
  wall.jpg
  stairs.jpg
  market.jpg

  turnstiles.jpg
  rocket.jpg
  {{</* /gallery */>}}
  ```
- New location. Add `content/from/<slug>/_index.md` with `title`, `lat` and `lng`, then reference the slug in a dispatch's `from` front matter. It's picked up by the map on `/from/` and on the location's own page, and by the `{{</* from */>}}` shortcode on the homepage.

## Template architecture

All templates live in `layouts/`. There is no separate Hugo theme. `baseof.html` builds the banner, the `#about`/`#colophon` asides and the "Previous dispatches" nav from `content/_index.md` and `content/colophon/`; Open Graph and schema.org markup come from Hugo's embedded `opengraph.html`/`schema.html` partials, called without a local override.

### Maps

A dispatch's `from` taxonomy term(s) carry `lat`/`lng`. `taxonomy.html` (the `/from/` index) and `term.html` (each location page) collect those into a JSON blob consumed by [`static/assets/js/map.js`](static/assets/js/map.js), which renders a non-interactive MapLibre GL map styled by `site.Params.mapStyle` (OpenFreeMap).

### Lightbox

Hero and gallery images open in a [GLightbox](https://biati-digital.github.io/glightbox/) lightbox, wired up in `baseof.html` against `.hero picture img` and `.gallery-image img`.

## Key systems

### Colour: the hue system

The single accent colour is an LCH hue set per page as `--hue` on `<html>` (and per row on archive/term lists). `partials/hue.html` computes it from the content date as a seasonal cosine wave:

```
hue = baseHue + hueAmplitude · cos( 2π · (dayOfYear − huePeakDay) / 365.25 )
```

The palette eases from magenta at midwinter to blue-violet at the summer solstice and back, continuously across the New Year. Tunable in `hugo.toml` with `baseHue` (320), `hueAmplitude` (25) and `huePeakDay` (172). Can be disabled entirely by setting `dynamicColour` to `false`.

### The “photographic print” treatment

Every image on the site — hero, inline content images, and gallery cells — shares one component: a white‑bordered print with a soft shadow, corner `marks`, a slight random wobble and a grain/glare “sheen.” It is driven by:

- CSS. The `.photo` wrapper, `.photo-print`, and the global `.marks` / `.photo-sheen` rules. Per‑context tuning via CSS variables (`--photo-pad`, `--mark-size`, `--photo-twist`).
- JS. [`theme.js`](static/assets/js/theme.js) walks every `.photo-print` on load and adds the random twist and the SVG sheen.

## Deployment

[`.github/workflows/publish.yml`](.github/workflows/publish.yml) builds with `hugo --minify` and deploys `public/` over FTPS, on every push to `main` and on a daily cron (so dated-but-future content comes online on schedule). The resource cache is keyed on the resolved Hugo version and on `assets/`, `content/**/*.jpg` and `hugo.toml`.
