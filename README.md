# GeoFence Web App 🗺️

A real-time geofencing web application that tracks your GPS location and alerts you when you leave a defined boundary.

## 🌐 Live Demo

**https://courtenaybernier.github.io/GeoFence/**

## ✨ Features

- 📍 **Real-time GPS tracking** - Shows your current location on an interactive map
- 🗺️ **Interactive map** - Powered by OpenStreetMap and Leaflet
- ✏️ **Draw custom boundaries** - Click on the map to create polygon boundaries
- 📊 **Live coordinates** - Displays latitude and longitude in real-time
- 🚨 **Boundary alerts** - Get notified when you leave the geofenced area
- 🔴 **Active monitoring** - Checks your location every 2 seconds

## 🚀 How to Use

1. **Open the app** - Visit the live demo link above
2. **Allow location access** - Grant GPS permissions when prompted
3. **Start drawing** - Click "Start Drawing" button
4. **Create boundary** - Click on the map to add points (minimum 3 points)
5. **Finish drawing** - Click "Finish Drawing" when done
6. **Start monitoring** - Click "Start Monitoring" to activate
7. **Test it** - Move outside the boundary to trigger the alert!

## ⚠️ Alert Message

When you leave the boundary, you'll see:

> **"Your device has left the boundary and will be wiped clean!"**

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🛠️ Tech Stack

- **Vite** - Fast build tool
- **Leaflet** - Interactive maps
- **Vanilla JavaScript** - No framework dependencies
- **GitHub Pages** - Free hosting

## 📱 Browser Support

Works on all modern browsers with GPS/geolocation support:
- Chrome/Edge (Desktop & Mobile)
- Safari (Desktop & Mobile)
- Firefox (Desktop & Mobile)

## 🔒 Privacy

- All location tracking happens in your browser
- No data is sent to external servers
- Location data is not stored

---

Built with ❤️ using Leaflet and Vite
