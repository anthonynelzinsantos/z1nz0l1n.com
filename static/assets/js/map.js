// The field-office map: only present on the /from/ taxonomy page, so this
// does nothing wherever it finds no #map.
(function () {
  'use strict';

  const el = document.getElementById('map');
  if (!el || !window.L) return;

  const dataEl = document.getElementById('map-data');
  const points = dataEl ? JSON.parse(dataEl.textContent) : [];
  if (!points.length) return;

  const map = L.map(el, { scrollWheelZoom: false });

  // Stadia authenticates production requests by domain (see stadiamaps.com
  // account dashboard) rather than an API key, so the tile URL needs nothing
  // beyond the domain itself; localhost works unauthenticated too.
  L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
    attribution:
      '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> ' +
      '&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> ' +
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    maxZoom: 20,
    detectRetina: true,
  }).addTo(map);

  // The wheel keeps scrolling the page until the pointer actually rests on
  // the map, so it doesn't trap the scroll of anyone just passing through.
  el.addEventListener('mouseenter', function () { map.scrollWheelZoom.enable(); });
  el.addEventListener('mouseleave', function () { map.scrollWheelZoom.disable(); });

  const markers = points.map(function (p) {
    const marker = L.marker([p.lat, p.lng]).addTo(map);
    marker.bindPopup(
      '<a href="' + p.url + '">' + p.title + '</a> — ' +
      p.count + ' dispatch' + (p.count === 1 ? '' : 'es')
    );
    return marker;
  });

  map.fitBounds(L.featureGroup(markers).getBounds().pad(0.2));
})();
