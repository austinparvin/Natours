/*eslint-disable*/
const locations = JSON.parse(document.getElementById('map').dataset.locations);

if (locations) {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYXVzdGlucGFydmluIiwiYSI6ImNsZmZjZzVxYzExeDIzdm82cGd0dXg1dW4ifQ.mydZRox54aC2_7vywt1cCg';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/austinparvin/clffcqflq000101kedbbj4cuy',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((location) => {
    const { coordinates, day, description } = location;
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(coordinates)
      .setHTML(`<p>${day}: ${description}</p>`)
      .addTo(map);

    bounds.extend(coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
}
