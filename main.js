// GeoFence App
let map, marker, polygon, drawnPoints = [], isDrawing = false, isMonitoring = false, monitorInterval = null;
let watchId = null;
let currentLat = null, currentLng = null;

// Wait for Leaflet to load
function initApp() {
  if (typeof L === 'undefined') {
    setTimeout(initApp, 100);
    return;
  }
  
  initializeMap();
  startWatchingLocation();
  
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

function startWatchingLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation not supported by your browser');
    return;
  }

  // Use watchPosition for continuous tracking
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      currentLat = position.coords.latitude;
      currentLng = position.coords.longitude;
      const accuracy = position.coords.accuracy;

      // Update coordinates display
      document.getElementById('coords').textContent = 
        `📍 ${currentLat.toFixed(6)}, ${currentLng.toFixed(6)} (±${accuracy.toFixed(0)}m)`;

      // Update or create marker
      if (marker) {
        marker.setLatLng([currentLat, currentLng]);
      } else {
        marker = L.marker([currentLat, currentLng]).addTo(map);
        marker.bindPopup('📍 You are here').openPopup();
      }

      // Center map on your location (smooth pan)
      map.setView([currentLat, currentLng], map.getZoom(), {
        animate: true,
        duration: 1
      });

      // Check boundary if monitoring
      if (isMonitoring) {
        checkBoundary(currentLat, currentLng);
      }
    },
    (error) => {
      console.error('Location error:', error);
      let errorMsg = 'Location error: ';
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMsg += 'Permission denied. Please allow location access.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg += 'Position unavailable. Check your GPS.';
          break;
        case error.TIMEOUT:
          errorMsg += 'Request timeout. Retrying...';
          break;
        default:
          errorMsg += error.message;
      }
      document.getElementById('status').textContent = errorMsg;
    },
    { 
      enableHighAccuracy: true,  // Use GPS
      maximumAge: 0,             // Don't use cached position
      timeout: 10000             // 10 second timeout
    }
  );
}

function requestLocation() {
  // Legacy function for compatibility - now handled by watchPosition
  if (currentLat && currentLng) {
    return { lat: currentLat, lng: currentLng };
  }
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
  document.getElementById('status').textContent = '🔴 MONITORING ACTIVE - Tracking your location in real-time...';
}

function checkBoundary(lat, lng) {
  if (!polygon || !isMonitoring) return;

  const point = L.latLng(lat, lng);
  const inside = isPointInPolygon(point, drawnPoints);

  if (!inside) {
    isMonitoring = false;
    alert('⚠️ ALERT! Your device has left the boundary and will be wiped clean!');
    document.getElementById('status').textContent = '🚨 BOUNDARY BREACH DETECTED!';
    
    // Flash the polygon red
    polygon.setStyle({ color: '#ff0000', fillColor: '#ff0000', fillOpacity: 0.5 });
    
    setTimeout(() => {
      if (confirm('Device left boundary! Reset app?')) {
        resetApp();
      }
    }, 1000);
  } else {
    document.getElementById('status').textContent = 
      `✅ Inside boundary - Distance to edge: ${getDistanceToEdge(lat, lng).toFixed(0)}m`;
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

function getDistanceToEdge(lat, lng) {
  if (!drawnPoints || drawnPoints.length < 3) return 0;
  
  let minDistance = Infinity;
  const point = L.latLng(lat, lng);
  
  // Calculate distance to each edge of the polygon
  for (let i = 0; i < drawnPoints.length; i++) {
    const p1 = L.latLng(drawnPoints[i][0], drawnPoints[i][1]);
    const p2 = L.latLng(drawnPoints[(i + 1) % drawnPoints.length][0], drawnPoints[(i + 1) % drawnPoints.length][1]);
    const distance = point.distanceTo(p1);
    minDistance = Math.min(minDistance, distance);
  }
  
  return minDistance;
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
