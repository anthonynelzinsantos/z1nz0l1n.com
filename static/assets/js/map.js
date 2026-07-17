(function () {
  'use strict';

  const el = document.getElementById('map');
  if (!el || !window.L) return;

  const dataEl = document.getElementById('map-data');
  const points = dataEl ? JSON.parse(dataEl.textContent) : [];
  if (!points.length) return;

  const map = L.map(el, { scrollWheelZoom: false });

  L.tileLayer(
    'https://data.geopf.fr/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/png&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
    {
      attribution: '<a href="https://www.geoportail.gouv.fr/" target="_blank">Geoportail France</a>',
      minZoom: 2,
      maxZoom: 18,
    }
  ).addTo(map);

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
