(function () {
  'use strict';

  const WRAPPER_SELECTOR = '.hero';

  const TWIST           = 2;

  const GRAIN_FREQ_IMG  = 0.65;
  const GRAIN_OPACITY   = 0.1;
  const GLARE_OPACITY   = 0.5;

  const W_RATIO         = 0.25;
  const H_RATIO         = 0.06;
  const TOOTH_COUNT     = 12;
  const TOOTH_D_R       = 0.3;
  const WOBBLE          = 2;
  const LENGTH_VAR      = 0.10;
  const W_MIN           = 125;
  const H_MIN           = 36;
  const GRAIN_FREQ_TAPE = 1.8;
  const GRAIN_SLOPE     = 0.10;
  const EDGE_STROKE     = 'rgba(0,0,0,0.12)';
  const EDGE_W          = 0.5;

  const ns   = 'http://www.w3.org/2000/svg';
  const rand = (min, max) => min + Math.random() * (max - min);

  function svgEl(tag, attrs = {}) {
    const el = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  function applyTwist(print) {
    const twist = rand(-TWIST, TWIST);
    print.style.setProperty('--photo-twist', `${twist}deg`);
  }

  function addTexture(print) {
    const wrap = document.createElement('div');
    wrap.className = 'photo-sheen';

    const uid       = Math.random().toString(36).slice(2, 7);
    const glare1Id  = `pg-glare1-${uid}`;
    const glare2Id  = `pg-glare2-${uid}`;
    const filterId  = `pg-filt-${uid}`;

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

    const picture = print.querySelector('picture');
    (picture || print).appendChild(wrap);
  }

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

  function drawTapePiece(defs, { cx, cy, W, H, angle, color, grainId, opacityJitter }) {
    const toothH = H / TOOTH_COUNT;
    const toothD = toothH * TOOTH_D_R;
    const hw     = W / 2;
    const hh     = H / 2;

    const d      = buildStripPath(hw, hh, toothH, toothD);

    const clipId = `wt-clip-${++_uid}`;
    const cp     = svgEl('clipPath', { id: clipId });
    cp.appendChild(svgEl('path', { d }));
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

    outer.appendChild(inner);

    outer.appendChild(svgEl('path', {
      d,
      fill:            'none',
      stroke:          EDGE_STROKE,
      'stroke-width':  EDGE_W,
      'vector-effect': 'non-scaling-stroke',
    }));

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

  function attachCaptionTape(fig, color, setTwist = true) {
    if (setTwist) fig.style.setProperty('--tape-twist', `${rand(-WOBBLE, WOBBLE)}deg`);
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

    document.querySelectorAll('.photo-print').forEach(print => {
      applyTwist(print);
      addTexture(print);
      if (print.closest(WRAPPER_SELECTOR)) attachTape(print, tapeColor);
    });

    const paperColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-tape-paper').trim() || 'lch(93% 10 92)';
    document.querySelectorAll('.gallery.has-caption > figcaption')
      .forEach(fig => attachCaptionTape(fig, paperColor));

    document.querySelectorAll('#main .article .content > .slug').forEach(el => {
      const tint = getComputedStyle(el).backgroundColor;
      el.style.setProperty('background-color', 'transparent');
      attachCaptionTape(el, tint, false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

(function () {
  const WIDE    = window.matchMedia('(min-width: 768px)');
  const content = document.querySelector('#main .article .content');
  const notes   = document.querySelector('#main .article .notes');
  if (!content) return;

  const asides = Array.from(content.querySelectorAll('.gallery--aside'));
  const items  = notes ? Array.from(notes.querySelectorAll('li')) : [];
  if (!asides.length && !items.length) return;

  const refFor = li => {
    const back = li.querySelector('.footnote-backref');
    const href = back && back.getAttribute('href');
    return href ? document.getElementById(href.slice(1)) : null;
  };

  function clamp() {
    asides.forEach(el => { el.style.removeProperty('--lift'); });

    if (!WIDE.matches) return;

    const flow  = Array.from(content.children).filter(el => !asides.includes(el));
    const box   = content.getBoundingClientRect();
    const floor = flow.length
      ? flow[flow.length - 1].getBoundingClientRect().bottom
      : box.bottom;

    asides.forEach(el => {
      const rect = el.getBoundingClientRect();
      const lift = Math.round(Math.min(rect.bottom - floor, rect.top - box.top));
      if (lift > 0) el.style.setProperty('--lift', `${lift}px`);
    });
  }

  function align() {
    clamp();

    if (!items.length) return;

    if (!WIDE.matches) {
      notes.classList.remove('aligned');
      items.forEach(li => { li.style.top = ''; });
      return;
    }

    notes.classList.add('aligned');

    const box = notes.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(notes).lineHeight) || 24;

    const blocks = asides
      .map(el => el.getBoundingClientRect())
      .map(r => ({ top: r.top - box.top, bottom: r.bottom - box.top }))
      .sort((a, b) => a.top - b.top);

    const hits = (top, h, b) => top < b.bottom + gap && top + h > b.top - gap;

    const clearDown = (top, h) => {
      blocks.forEach(b => { if (hits(top, h, b)) top = b.bottom + gap; });
      return top;
    };

    const clearUp = (top, h) => {
      for (let i = blocks.length - 1; i >= 0; i--) {
        if (hits(top, h, blocks[i])) top = blocks[i].top - gap - h;
      }
      return top;
    };

    const placed = items.map(li => {
      const ref = refFor(li);
      return {
        li,
        h: li.offsetHeight,
        want: ref ? ref.getBoundingClientRect().top - box.top : 0
      };
    });

    let floor = 0;
    placed.forEach(p => {
      p.top = clearDown(Math.max(p.want, floor), p.h);
      floor = p.top + p.h + gap;
    });

    let ceiling = box.height;
    for (let i = placed.length - 1; i >= 0; i--) {
      placed[i].top = clearUp(Math.min(placed[i].top, ceiling - placed[i].h), placed[i].h);
      ceiling = placed[i].top - gap;
    }

    placed.forEach(p => { p.li.style.top = Math.max(0, Math.round(p.top)) + 'px'; });
  }

  if (window.ResizeObserver) new ResizeObserver(align).observe(content);
  WIDE.addEventListener('change', align);
  window.addEventListener('resize', align);
  window.addEventListener('load', align);
  if (document.fonts) document.fonts.ready.then(align);
  align();
})();
