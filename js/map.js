function openMap() {
  hideAll();
  document.getElementById("map-section").classList.remove("hidden");

  const map = L.map('map').setView([20,78], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  getAllRecords(records => {
    records.forEach(r => {
      if (r.geo?.lat) {
        L.marker([r.geo.lat, r.geo.lng])
          .addTo(map)
          .bindPopup(r.craft.name);
      }
    });
  });
}