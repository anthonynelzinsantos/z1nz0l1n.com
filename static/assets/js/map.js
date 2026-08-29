(function () {
  'use strict';

  const el = document.getElementById('map');
  if (!el || !window.maplibregl) return;

  const dataEl = document.getElementById('map-data');
  const points = dataEl ? JSON.parse(dataEl.textContent) : [];
  if (!points.length) return;

  const map = new maplibregl.Map({
    container: el,
    style: el.dataset.basemap,
    attributionControl: { compact: false },
    interactive: false,
    minZoom: 2,
  });

  const bounds = new maplibregl.LngLatBounds();

  points.forEach(function (p) {
    const marker = new maplibregl.Marker().setLngLat([p.lng, p.lat]).addTo(map);
    if (p.url) {
      marker.setPopup(
        new maplibregl.Popup({ closeButton: false, offset: 26 }).setHTML(
          '<a href="' + p.url + '">' + p.title + '</a> — ' +
          p.count + ' dispatch' + (p.count === 1 ? '' : 'es')
        )
      );
    }
    bounds.extend([p.lng, p.lat]);
  });

  if (points.length === 1) {
    map.setCenter([points[0].lng, points[0].lat]).setZoom(12);
  } else {
    map.fitBounds(bounds, { padding: 48, animate: false });
  }

  new ResizeObserver(function () { map.resize(); }).observe(el);
})();
