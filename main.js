// GeoFence App
let map, marker, polygon, drawnPoints = [], isDrawing = false, isMonitoring = false, monitorInterval = null;

// Wait for Leaflet to load
function initApp() {
  if (typeof L === 'undefined') {
    setTimeout(initApp, 100);
    return;
  }
  
  initializeMap();
  requestLocation();
  setInterval(requestLocation, 5000);
  
  document.getElementById('btnDraw').onclick = startDrawing;
  document.getElementById('btnFinish').onclick = finishDrawing;
  document.getElementById('btnMonitor').onclick = startMonitoring;
  document.getElementById('btnReset').onclick = resetApp;
}

document.addEventListener('DOMContentLoaded', initApp);

function initializeMap() {
  map = L.map('map').setView([37.7749, -122.4194], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  map.on('click', handleMapClick);
}

function requestLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation not supported');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      document.getElementById('coords').textContent = `📍 Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;

      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map);
        map.setView([lat, lng], 16);
      }

      if (isMonitoring) {
        checkBoundary(lat, lng);
      }
    },
    (error) => console.error('Location error:', error),
    { enableHighAccuracy: true }
  );
}

function handleMapClick(e) {
  if (!isDrawing) return;

  const point = [e.latlng.lat, e.latlng.lng];
  drawnPoints.push(point);

  L.circleMarker(e.latlng, {
    radius: 5,
    fillColor: '#667eea',
    color: '#667eea',
    weight: 2,
    fillOpacity: 0.8
  }).addTo(map);

  if (drawnPoints.length > 1) {
    L.polyline(drawnPoints, { color: '#667eea', weight: 2 }).addTo(map);
  }

  document.getElementById('status').textContent = `${drawnPoints.length} point${drawnPoints.length > 1 ? 's' : ''} added`;
}

function startDrawing() {
  isDrawing = true;
  drawnPoints = [];

  if (polygon) {
    map.removeLayer(polygon);
    polygon = null;
  }

  document.getElementById('btnDraw').disabled = true;
  document.getElementById('btnFinish').disabled = false;
  document.getElementById('btnMonitor').disabled = true;
  document.getElementById('status').textContent = 'Click on map to add boundary points (minimum 3)';
}

function finishDrawing() {
  if (drawnPoints.length < 3) {
    alert('You need at least 3 points to create a boundary!');
    return;
  }

  isDrawing = false;

  // Clear temporary markers
  map.eachLayer((layer) => {
    if (layer instanceof L.CircleMarker || layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });

  // Create polygon
  polygon = L.polygon(drawnPoints, {
    color: '#4caf50',
    fillColor: '#4caf50',
    fillOpacity: 0.2,
    weight: 2
  }).addTo(map);

  document.getElementById('btnDraw').disabled = false;
  document.getElementById('btnFinish').disabled = true;
  document.getElementById('btnMonitor').disabled = false;
  document.getElementById('status').textContent = 'Boundary created! Ready to start monitoring.';
}

function startMonitoring() {
  if (!polygon) {
    alert('Please create a boundary first!');
    return;
  }

  isMonitoring = true;

  polygon.setStyle({
    color: '#f44336',
    fillColor: '#f44336'
  });

  document.getElementById('btnDraw').disabled = true;
  document.getElementById('btnMonitor').disabled = true;
  document.getElementById('status').textContent = '🔴 Monitoring active - tracking your location...';

  monitorInterval = setInterval(requestLocation, 2000);
}

function checkBoundary(lat, lng) {
  if (!polygon || !isMonitoring) return;

  const point = L.latLng(lat, lng);
  const inside = isPointInPolygon(point, drawnPoints);

  if (!inside) {
    clearInterval(monitorInterval);
    isMonitoring = false;
    alert('⚠️ Your device has left the boundary and will be wiped clean!');
    setTimeout(resetApp, 1000);
  }
}

function isPointInPolygon(point, polygonPoints) {
  const x = point.lat;
  const y = point.lng;
  let inside = false;

  for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
    const xi = polygonPoints[i][0];
    const yi = polygonPoints[i][1];
    const xj = polygonPoints[j][0];
    const yj = polygonPoints[j][1];

    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

function resetApp() {
  if (monitorInterval) {
    clearInterval(monitorInterval);
    monitorInterval = null;
  }

  isDrawing = false;
  isMonitoring = false;
  drawnPoints = [];

  // Clear all layers except base map and marker
  map.eachLayer((layer) => {
    if (layer instanceof L.Polygon || layer instanceof L.CircleMarker || layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });

  polygon = null;

  document.getElementById('btnDraw').disabled = false;
  document.getElementById('btnFinish').disabled = true;
  document.getElementById('btnMonitor').disabled = true;
  document.getElementById('status').textContent = 'Click "Start Drawing" to create a boundary';
}
