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
  
  console.log('Map initialized');
  document.getElementById('status').textContent = 'Map loaded. Requesting GPS location...';
}

function startWatchingLocation() {
  if (!navigator.geolocation) {
    document.getElementById('coords').textContent = '❌ Geolocation not supported';
    document.getElementById('status').textContent = 'GPS not available - you can still draw on the map';
    return;
  }

  console.log('Requesting location...');
  document.getElementById('coords').textContent = '⏳ Requesting location permission...';

  // First try to get current position immediately
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log('Got initial position:', position);
      updateLocation(position);
      
      // Then start watching for continuous updates
      watchId = navigator.geolocation.watchPosition(
        updateLocation,
        handleLocationError,
        { 
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000
        }
      );
    },
    (error) => {
      console.error('Initial position error:', error);
      handleLocationError(error);
      
      // Still try to watch even if initial position fails
      watchId = navigator.geolocation.watchPosition(
        updateLocation,
        handleLocationError,
        { 
          enableHighAccuracy: true,
          maximumAge: 5000,  // Allow slightly cached position as fallback
          timeout: 15000     // Longer timeout
        }
      );
    },
    { 
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000
    }
  );
}

function updateLocation(position) {
  currentLat = position.coords.latitude;
  currentLng = position.coords.longitude;
  const accuracy = position.coords.accuracy;

  console.log('Location update:', currentLat, currentLng, 'accuracy:', accuracy);

  // Update coordinates display
  document.getElementById('coords').textContent = 
    `📍 ${currentLat.toFixed(6)}, ${currentLng.toFixed(6)} (±${accuracy.toFixed(0)}m)`;

  // Update or create marker
  if (marker) {
    marker.setLatLng([currentLat, currentLng]);
  } else {
    marker = L.marker([currentLat, currentLng]).addTo(map);
    marker.bindPopup('📍 You are here').openPopup();
    // First time getting location - center map with good zoom
    map.setView([currentLat, currentLng], 16);
  }

  // Update status
  document.getElementById('status').textContent = 'GPS tracking active. Click "Start Drawing" to create a boundary.';

  // Check boundary if monitoring
  if (isMonitoring) {
    checkBoundary(currentLat, currentLng);
  }
}

function handleLocationError(error) {
  console.error('Location error:', error);
  let errorMsg = '';
  let coordsMsg = '❌ ';
  
  switch(error.code) {
    case error.PERMISSION_DENIED:
      errorMsg = '🚫 Location permission denied. Please allow location access in your browser settings.';
      coordsMsg += 'Permission denied';
      break;
    case error.POSITION_UNAVAILABLE:
      errorMsg = '📡 GPS position unavailable. Make sure GPS is enabled on your device.';
      coordsMsg += 'Position unavailable';
      break;
    case error.TIMEOUT:
      errorMsg = '⏱️ Location request timed out. Retrying...';
      coordsMsg += 'Timeout (retrying...)';
      break;
    default:
      errorMsg = `⚠️ Location error: ${error.message}`;
      coordsMsg += error.message;
  }
  
  document.getElementById('coords').textContent = coordsMsg;
  document.getElementById('status').textContent = errorMsg + ' You can still draw manually on the map.';
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
  document.getElementById('status').textContent = 'Click on map to add boundary points (minimum 4)';
}

function finishDrawing() {
  if (drawnPoints.length < 4) {
    alert('You need at least 4 points to create a boundary!');
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
    // Device is OUTSIDE the boundary - trigger alert!
    isMonitoring = false;
    
    // Flash the polygon red to show breach
    polygon.setStyle({ color: '#ff0000', fillColor: '#ff0000', fillOpacity: 0.5 });
    
    // Show alert message
    alert('⚠️ ALERT! Your device has left the boundary and will be wiped clean!');
    document.getElementById('status').textContent = '🚨 BOUNDARY BREACH DETECTED! Device left the safe zone.';
    
    // Disable monitoring button to prevent restart
    document.getElementById('btnMonitor').disabled = true;
    
    // Ask user if they want to reset and start over
    setTimeout(() => {
      if (confirm('⚠️ BOUNDARY BREACH!\n\nYour device left the safe zone.\nMonitoring has been stopped.\n\nWould you like to reset the app and draw a new boundary?')) {
        resetApp();
      } else {
        // User chose not to reset - keep breach state visible
        document.getElementById('status').textContent = '🚨 BREACH DETECTED - Monitoring stopped. Click "Reset" button to start over.';
      }
    }, 500);
  } else {
    // Device is INSIDE the boundary - all good
    const distance = getDistanceToEdge(lat, lng).toFixed(0);
    document.getElementById('status').textContent = 
      `✅ Inside boundary - ${distance}m from edge`;
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
