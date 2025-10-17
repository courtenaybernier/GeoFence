(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&l(c)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();let i,m,d,a=[],f=!1,u=!1,s=null;document.addEventListener("DOMContentLoaded",()=>{w(),I(),b(),setInterval(b,5e3)});function w(){const e=document.createElement("style");e.textContent=`
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; height: 100vh; display: flex; flex-direction: column; }
    #header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; }
    h1 { font-size: 24px; margin-bottom: 10px; }
    #coords { font-size: 14px; opacity: 0.9; }
    #map { flex: 1; }
    #controls { padding: 15px; background: white; box-shadow: 0 -2px 8px rgba(0,0,0,0.1); display: flex; gap: 10px; flex-wrap: wrap; }
    button { flex: 1; min-width: 120px; padding: 12px 20px; font-size: 14px; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; }
    .btn-draw { background: #667eea; color: white; }
    .btn-finish { background: #4caf50; color: white; }
    .btn-monitor { background: #f44336; color: white; }
    .btn-reset { background: #9e9e9e; color: white; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    #status { width: 100%; padding: 10px; background: #e3f2fd; color: #1976d2; border-radius: 6px; font-size: 13px; text-align: center; }
  `,document.head.appendChild(e),document.getElementById("app").innerHTML=`
    <div id="header">
      <h1>🗺️ GeoFence App</h1>
      <div id="coords">Waiting for GPS location...</div>
    </div>
    <div id="map"></div>
    <div id="controls">
      <div id="status">Click "Start Drawing" to create a boundary</div>
      <button class="btn-draw" id="btnDraw">Start Drawing</button>
      <button class="btn-finish" id="btnFinish" disabled>Finish Drawing</button>
      <button class="btn-monitor" id="btnMonitor" disabled>Start Monitoring</button>
      <button class="btn-reset" id="btnReset">Reset</button>
    </div>
  `,document.getElementById("btnDraw").onclick=E,document.getElementById("btnFinish").onclick=B,document.getElementById("btnMonitor").onclick=C,document.getElementById("btnReset").onclick=h}function I(){i=L.map("map").setView([37.7749,-122.4194],13),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(i),i.on("click",v)}function b(){if(!navigator.geolocation){alert("Geolocation not supported");return}navigator.geolocation.getCurrentPosition(e=>{const t=e.coords.latitude,r=e.coords.longitude;document.getElementById("coords").textContent=`📍 Lat: ${t.toFixed(6)}, Lng: ${r.toFixed(6)}`,m?m.setLatLng([t,r]):(m=L.marker([t,r]).addTo(i),i.setView([t,r],16)),u&&M(t,r)},e=>console.error("Location error:",e),{enableHighAccuracy:!0})}function v(e){if(!f)return;const t=[e.latlng.lat,e.latlng.lng];a.push(t),L.circleMarker(e.latlng,{radius:5,fillColor:"#667eea",color:"#667eea",weight:2,fillOpacity:.8}).addTo(i),a.length>1&&L.polyline(a,{color:"#667eea",weight:2}).addTo(i),document.getElementById("status").textContent=`${a.length} point${a.length>1?"s":""} added`}function E(){f=!0,a=[],d&&(i.removeLayer(d),d=null),document.getElementById("btnDraw").disabled=!0,document.getElementById("btnFinish").disabled=!1,document.getElementById("btnMonitor").disabled=!0,document.getElementById("status").textContent="Click on map to add boundary points (minimum 3)"}function B(){if(a.length<3){alert("You need at least 3 points to create a boundary!");return}f=!1,i.eachLayer(e=>{(e instanceof L.CircleMarker||e instanceof L.Polyline)&&i.removeLayer(e)}),d=L.polygon(a,{color:"#4caf50",fillColor:"#4caf50",fillOpacity:.2,weight:2}).addTo(i),document.getElementById("btnDraw").disabled=!1,document.getElementById("btnFinish").disabled=!0,document.getElementById("btnMonitor").disabled=!1,document.getElementById("status").textContent="Boundary created! Ready to start monitoring."}function C(){if(!d){alert("Please create a boundary first!");return}u=!0,d.setStyle({color:"#f44336",fillColor:"#f44336"}),document.getElementById("btnDraw").disabled=!0,document.getElementById("btnMonitor").disabled=!0,document.getElementById("status").textContent="🔴 Monitoring active - tracking your location...",s=setInterval(b,2e3)}function M(e,t){if(!d||!u)return;const r=L.latLng(e,t);k(r,a)||(clearInterval(s),u=!1,alert("⚠️ Your device has left the boundary and will be wiped clean!"),setTimeout(h,1e3))}function k(e,t){const r=e.lat,l=e.lng;let n=!1;for(let o=0,c=t.length-1;o<t.length;c=o++){const p=t[o][0],g=t[o][1],x=t[c][0],y=t[c][1];g>l!=y>l&&r<(x-p)*(l-g)/(y-g)+p&&(n=!n)}return n}function h(){s&&(clearInterval(s),s=null),f=!1,u=!1,a=[],i.eachLayer(e=>{(e instanceof L.Polygon||e instanceof L.CircleMarker||e instanceof L.Polyline)&&i.removeLayer(e)}),d=null,document.getElementById("btnDraw").disabled=!1,document.getElementById("btnFinish").disabled=!0,document.getElementById("btnMonitor").disabled=!0,document.getElementById("status").textContent='Click "Start Drawing" to create a boundary'}
