(function () {
  'use strict';

  // Photographic effects (twist, grain/glare sheen, washi tape) belong to the
  // warm dispatch world only — never the cold wires or the documentation
  // register. Bail out unless this page is a dispatch (a single dispatch or the
  // home page showing one).
  const bodyClasses = document.body.classList;
  if (!(bodyClasses.contains('post-template') || bodyClasses.contains('home-template'))) return;

  /* ─── Tuning ─────────────────────────────────────────────────────────── */

  const WRAPPER_SELECTOR = '.hero';

  // Photo twist
  const TWIST           = 2;     // max ± degrees

  // Photo texture (grain + glare streak over the image area)
  const GRAIN_FREQ_IMG  = 0.65;  // lower = coarser grain on the photo surface
  const GRAIN_OPACITY   = 0.1;   // how visible the grain is
  const GLARE_OPACITY   = 0.5;   // peak opacity of the glare streak

  // Washi tape
  const W_RATIO         = 0.25;  // strip length as fraction of print width
  const H_RATIO         = 0.06;  // strip height as fraction of print width
  const TOOTH_COUNT     = 12;    // teeth per short end
  const TOOTH_D_R       = 0.3;   // tooth depth as multiple of tooth height
  const WOBBLE          = 2;     // max ± rotation wobble per piece (degrees)
  const LENGTH_VAR      = 0.10;  // ± length variation
  const W_MIN           = 125;   // minimum strip length in px (keeps tape chunky on small screens)
  const H_MIN           = 36;    // minimum strip height in px
  const GRAIN_FREQ_TAPE = 1.8;   // fine grain on the tape itself
  const GRAIN_SLOPE     = 0.10;  // tape grain opacity

  /* ─── Helpers ────────────────────────────────────────────────────────── */

  const ns   = 'http://www.w3.org/2000/svg';
  const rand = (min, max) => min + Math.random() * (max - min);

  function svgEl(tag, attrs = {}) {
    const el = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  /* ─── 1. Random twist ────────────────────────────────────────────────── */

  function applyTwist(print) {
    const twist = rand(-TWIST, TWIST);
    print.style.setProperty('--photo-twist', `${twist}deg`);
  }

  /* ─── 2. Photo texture (grain + glare streak) ────────────────────────── */
  //
  // A single SVG overlay covering the image area only (.photo-sheen div,
  // positioned by CSS). Two layers:
  //   - feTurbulence fractal noise at low opacity → photo paper/film grain
  //   - diagonal linear gradient → soft glare streak from top-left
  //
  function addTexture(print) {
    const wrap = document.createElement('div');
    wrap.className = 'photo-sheen';

    // Unique IDs so multiple prints on one page don't clash
    const uid       = Math.random().toString(36).slice(2, 7);
    const glare1Id  = `pg-glare1-${uid}`;
    const glare2Id  = `pg-glare2-${uid}`;
    const filterId  = `pg-filt-${uid}`;

    // Main streak: tight diagonal from top-left, fades to transparent by ~40%
    // Counter-highlight: very faint glow from bottom-right corner, opposite side
    wrap.innerHTML = `<svg xmlns="${ns}" width="100%" height="100%"
        preserveAspectRatio="none"
        style="position:absolute;top:0;left:0;width:100%;height:100%">
      <defs>
        <linearGradient id="${glare1Id}" x1="0" y1="0" x2="0.5" y2="0.7"
                        gradientUnits="objectBoundingBox">
          <stop offset="0%"   stop-color="#fff" stop-opacity="${GLARE_OPACITY}"/>
          <stop offset="20%"  stop-color="#fff" stop-opacity="${(GLARE_OPACITY * 0.6).toFixed(3)}"/>
          <stop offset="40%"  stop-color="#fff" stop-opacity="0"/>
          <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="${glare2Id}" x1="1" y1="1" x2="0.5" y2="0.4"
                        gradientUnits="objectBoundingBox">
          <stop offset="0%"   stop-color="#fff" stop-opacity="${(GLARE_OPACITY * 0.35).toFixed(3)}"/>
          <stop offset="35%"  stop-color="#fff" stop-opacity="${(GLARE_OPACITY * 0.1).toFixed(3)}"/>
          <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
        <filter id="${filterId}" x="0%" y="0%" width="100%" height="100%"
                color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="${GRAIN_FREQ_IMG}"
                        numOctaves="4" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="grey"/>
          <feComponentTransfer in="grey" result="faded">
            <feFuncA type="linear" slope="${GRAIN_OPACITY}"/>
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="faded" mode="multiply"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="transparent" filter="url(#${filterId})"/>
      <rect width="100%" height="100%" fill="url(#${glare1Id})"/>
      <rect width="100%" height="100%" fill="url(#${glare2Id})"/>
    </svg>`;

    // Append to <picture> so the overlay covers only the image, not the figcaption
    const picture = print.querySelector('picture');
    (picture || print).appendChild(wrap);
  }

  /* ─── 3. Washi tape ──────────────────────────────────────────────────── */

  function buildStripPath(hw, hh, toothH, toothD) {
    const toothCount = Math.floor((hh * 2) / toothH);
    const totalH     = toothCount * toothH;
    const sy         = -totalH / 2;

    let d = `M ${-hw} ${sy} L ${hw} ${sy}`;

    for (let i = 0; i < toothCount; i++) {
      const y0 = sy + i * toothH;
      const ym = y0 + toothH / 2;
      const y1 = y0 + toothH;
      d += ` L ${hw} ${y0} L ${hw - toothD} ${ym} L ${hw} ${y1}`;
    }

    d += ` L ${hw} ${sy + totalH} L ${-hw} ${sy + totalH}`;

    for (let i = toothCount - 1; i >= 0; i--) {
      const y0 = sy + i * toothH;
      const ym = y0 + toothH / 2;
      const y1 = y0 + toothH;
      d += ` L ${-hw} ${y1} L ${-hw + toothD} ${ym} L ${-hw} ${y0}`;
    }

    return d + ' Z';
  }

  let _uid = 0;

  // Shared fine-grain filter (greyscale fractal-noise, multiplied) — every
  // tape, washi or paper, gets the same surface texture.
  function appendGrainFilter(defs, id) {
    const filt = svgEl('filter', {
      id, x: '0%', y: '0%', width: '100%', height: '100%',
      'color-interpolation-filters': 'sRGB',
    });
    filt.innerHTML = `
      <feTurbulence type="fractalNoise" baseFrequency="${GRAIN_FREQ_TAPE}"
                    numOctaves="4" stitchTiles="stitch" result="noise"/>
      <feColorMatrix type="saturate" values="0" in="noise" result="grey"/>
      <feComponentTransfer in="grey" result="faded">
        <feFuncA type="linear" slope="${GRAIN_SLOPE}"/>
      </feComponentTransfer>
      <feBlend in="SourceGraphic" in2="faded" mode="multiply"/>`;
    defs.appendChild(filt);
  }

  // Draw ONE tape piece, W×H, centred at (cx,cy) and rotated `angle`: serrated
  // short ends (clipPath), grain fill and a hairline border. Shared by the
  // hero washi tape and the gallery caption paper tape.
  function drawTapePiece(defs, { cx, cy, W, H, angle, color, grainId, opacityJitter }) {
    const toothH = H / TOOTH_COUNT;
    const toothD = toothH * TOOTH_D_R;
    const hw     = W / 2;
    const hh     = H / 2;

    const clipId = `wt-clip-${++_uid}`;
    const cp     = svgEl('clipPath', { id: clipId });
    cp.appendChild(svgEl('path', { d: buildStripPath(hw, hh, toothH, toothD) }));
    defs.appendChild(cp);

    const outer = svgEl('g', { transform: `translate(${cx},${cy}) rotate(${angle})` });
    const inner = svgEl('g', {
      'clip-path': `url(#${clipId})`,
      filter:      `url(#${grainId})`,
    });

    inner.appendChild(svgEl('rect', {
      x: -hw, y: -hh, width: W, height: H,
      fill:    color,
      opacity: opacityJitter ? rand(0.94, 0.99).toFixed(2) : '0.98',
    }));

    // Hairline border to delineate the tape edge
    inner.appendChild(svgEl('rect', {
      x:              -hw,
      y:              -hh,
      width:          W,
      height:         H,
      fill:           'none',
      stroke:         'rgba(0,0,0,0.12)',
      'stroke-width': '0.5',
    }));

    outer.appendChild(inner);
    return outer;
  }

  function makeTape(defs, cx, cy, pw, angle, tapeColor, grainId) {
    const BASE_W = pw * W_RATIO;
    const H      = pw * H_RATIO;
    const W      = Math.max(W_MIN, BASE_W * (1 + rand(-LENGTH_VAR, LENGTH_VAR)));
    const H2     = Math.max(H_MIN, H);
    return drawTapePiece(defs, {
      cx, cy, W, H: H2, angle, color: tapeColor, grainId, opacityJitter: true,
    });
  }

  function attachTape(print, tapeColor) {
    const img = print.querySelector('img');
    if (!img) return;

    let svg = null;

    function build() {
      const pw = print.offsetWidth;
      const ph = print.offsetHeight;
      if (!pw || !ph) return;

      if (svg) svg.remove();

      // Tape pieces straddle the top and bottom edges of the print, so each
      // overhangs the photo box by up to half a strip height. Safari — unlike
      // Chrome and Firefox — clips content that overflows an outer <svg> once
      // the element carries a CSS transform (which reposition() applies), so we
      // grow the SVG box by a strip-height of headroom on each side and draw the
      // strips inside it rather than relying on `overflow: visible`.
      const pad = Math.max(H_MIN, pw * H_RATIO);
      const vh  = ph + pad * 2;

      svg = svgEl('svg', {
        class:               'wt-overlay',
        viewBox:             `0 0 ${pw} ${vh}`,
        preserveAspectRatio: 'none',
      });

      const defs    = svgEl('defs');
      const grainId = 'wt-grain';
      appendGrainFilter(defs, grainId);
      svg.appendChild(defs);

      [
        { cx: pw / 2, cy: pad,      angle: rand(-WOBBLE, WOBBLE) },
        { cx: pw / 2, cy: pad + ph, angle: rand(-WOBBLE, WOBBLE) },
      ].forEach(({ cx, cy, angle }) =>
        svg.appendChild(makeTape(defs, cx, cy, pw, angle, tapeColor, grainId))
      );

      print.appendChild(svg);

      svg._buildPW  = pw;
      svg._buildPH  = ph;
      svg._buildPad = pad;

      reposition();
    }

    function reposition() {
      if (!svg) return;
      const pw = print.offsetWidth;
      const ph = print.offsetHeight;
      if (!pw || !ph) return;

      const pad    = svg._buildPad;
      const scaleX = pw / svg._buildPW;
      const scaleY = ph / svg._buildPH;

      // The SVG box extends `pad` above the print's top edge; pull it back up so
      // the strip that straddles the top edge lands in the right place.
      svg.style.width           = `${svg._buildPW}px`;
      svg.style.height          = `${svg._buildPH + pad * 2}px`;
      svg.style.left            = '0';
      svg.style.top             = `-${pad * scaleY}px`;
      svg.style.transform       = `scale(${scaleX},${scaleY})`;
      svg.style.transformOrigin = '0 0';
    }

    if (img.complete && img.naturalWidth) {
      build();
    } else {
      img.addEventListener('load', build, { once: true });
    }

    let buildPW = 0, buildPH = 0;
    const ro = new ResizeObserver(() => {
      const pw = print.offsetWidth;
      const ph = print.offsetHeight;
      if (!pw || !ph) return;
      const aspectChanged = buildPW === 0 || Math.abs(pw / ph - buildPW / buildPH) > 0.05;
      if (aspectChanged) {
        buildPW = pw; buildPH = ph;
        build();
      } else {
        reposition();
      }
    });

    ro.observe(print);
  }

  /* ─── 4. Caption paper tape ──────────────────────────────────────────── */
  //
  // Lay the gallery <figcaption> on a torn piece of cream paper tape: the same
  // serrated/grained SVG as the washi tape, sized to the caption box, drawn
  // behind the (handwritten) text. Rebuilds on resize / web-font swap, since
  // either reflows the caption and changes its measured box.
  //
  function attachCaptionTape(fig, color) {
    fig.style.setProperty('--tape-twist', `${rand(-WOBBLE, WOBBLE)}deg`);
    let svg = null;

    function build() {
      const w = fig.offsetWidth;
      const h = fig.offsetHeight;
      if (!w || !h) return;
      if (svg) { svg.remove(); svg = null; }

      const grainId = `pt-grain-${++_uid}`;
      svg = svgEl('svg', {
        class:               'paper-tape',
        viewBox:             `0 0 ${w} ${h}`,
        preserveAspectRatio: 'none',
      });

      const defs = svgEl('defs');
      appendGrainFilter(defs, grainId);
      svg.appendChild(defs);
      svg.appendChild(drawTapePiece(defs, {
        cx: w / 2, cy: h / 2, W: w, H: h, angle: 0,
        color, grainId, opacityJitter: false,
      }));

      fig.insertBefore(svg, fig.firstChild);
    }

    build();
    new ResizeObserver(build).observe(fig);
  }

  function init() {
    const tapeColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-tape').trim() || 'lch(92% 8 90)';

    // Every photographic print gets a random twist and the grain/glare sheen.
    // Washi tape is reserved for the hero (WRAPPER_SELECTOR) — putting it on
    // every content image would be too much.
    document.querySelectorAll('.photo-print').forEach(print => {
      applyTwist(print);
      addTexture(print);
      if (print.closest(WRAPPER_SELECTOR)) attachTape(print, tapeColor);
    });

    // Gallery captions ride on cream paper tape.
    const paperColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-tape-paper').trim() || 'lch(93% 10 92)';
    document.querySelectorAll('.kg-gallery-card.kg-card-hascaption > figcaption')
      .forEach(fig => attachCaptionTape(fig, paperColor));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ─── Typewriter misprints ───────────────────────────────────────────────── */

(function () {
  'use strict';

  // Dispatches only — telex wires are rigidly aligned and the documentation
  // register is set clean, so neither gets typewriter misprints. Bail out unless
  // this page is a dispatch (a single dispatch or the home page showing one).
  const bodyClasses = document.body.classList;
  if (!(bodyClasses.contains('post-template') || bodyClasses.contains('home-template'))) return;

  const CONTENT_SELECTOR = '#main .article .content';

  // Tuning
  const SHIFT_COUNT = 2;  // how many characters are misaligned
  const SHIFT_MAX   = 1;  // max vertical shift in px

  const CANDIDATES = 'oinrhldcumfpgywbvkxjqz';
  const SKIP_TAGS  = new Set(['CODE', 'PRE', 'A', 'SCRIPT', 'STYLE', 'SPAN']);

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function buildShifts() {
    const shifts = new Map();
    const pool   = CANDIDATES.split('');
    for (let i = 0; i < SHIFT_COUNT; i++) {
      const idx   = Math.floor(Math.random() * pool.length);
      const char  = pool.splice(idx, 1)[0];
      const shift = rand(-SHIFT_MAX, SHIFT_MAX);
      shifts.set(char, shift);
      shifts.set(char.toUpperCase(), shift);
    }
    return shifts;
  }

  function processTextNode(node, shifts) {
    const text = node.textContent;
    if (!text.trim()) return;

    let modified = false;
    const frag   = document.createDocumentFragment();

    for (const char of text) {
      const shift = shifts.get(char);
      if (shift !== undefined) {
        const span = document.createElement('span');
        span.className = 'tp';
        span.setAttribute('style', `vertical-align:${(-shift).toFixed(2)}px;`);
        span.textContent = char;
        frag.appendChild(span);
        modified = true;
      } else {
        frag.appendChild(document.createTextNode(char));
      }
    }

    if (modified) node.parentNode.replaceChild(frag, node);
  }

  function walkNode(node, shifts) {
    if (node.nodeType === Node.TEXT_NODE) {
      processTextNode(node, shifts);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (SKIP_TAGS.has(node.tagName)) return;

    Array.from(node.childNodes).forEach(child => walkNode(child, shifts));
  }

  function init() {
    const content = document.querySelector(CONTENT_SELECTOR);
    if (!content) return;
    const shifts = buildShifts();
    walkNode(content, shifts);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();