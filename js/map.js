let mapInstance = null;

function openMap() {
  hideAll();
  document.getElementById("map-section").classList.remove("hidden");

  if (mapInstance) {
    mapInstance.invalidateSize();
    return;
  }

  mapInstance = L.map('map').setView([20, 78], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 18
  }).addTo(mapInstance);

  getAllRecords(records => {
    records.forEach(r => {
      if (r.geo?.lat) {
        L.marker([r.geo.lat, r.geo.lng])
          .addTo(mapInstance)
          .bindPopup(r.craft.name);
      }
    });
  });
}
