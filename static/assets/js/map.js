(function () {
  'use strict';

  const el = document.getElementById('map');
  if (!el || !window.L) return;

  const dataEl = document.getElementById('map-data');
  const points = dataEl ? JSON.parse(dataEl.textContent) : [];
  if (!points.length) return;

  const map = L.map(el, {
    boxZoom: false,
    doubleClickZoom: false,
    dragging: false,
    keyboard: false,
    scrollWheelZoom: false,
    touchZoom: false,
    zoomControl: false,
  });

  L.tileLayer(
    'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    {
      attribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
      minZoom: 2,
      maxZoom: 20,
    }
  ).addTo(map);

  const markers = points.map(function (p) {
    const marker = L.marker([p.lat, p.lng]).addTo(map);
    if (p.url) {
      marker.bindPopup(
        '<a href="' + p.url + '">' + p.title + '</a> — ' +
        p.count + ' dispatch' + (p.count === 1 ? '' : 'es')
      );
    }
    return marker;
  });

  if (points.length === 1) {
    map.setView([points[0].lat, points[0].lng], 12);
  } else {
    map.fitBounds(L.featureGroup(markers).getBounds().pad(0.05));
  }

  new ResizeObserver(function () { map.invalidateSize(); }).observe(el);
})();
