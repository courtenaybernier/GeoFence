# GeoFence Web App 🗺️

A real-time geofencing web application that tracks your GPS location and alerts you when you leave a defined boundary with a 30-second countdown to return.

## 🌐 Live Demo

**https://courtenaybernier.github.io/GeoFence/**

## ✨ Features

- 📍 **Real-time GPS tracking** - Continuous location monitoring with high accuracy
- 🗺️ **Interactive map** - Powered by OpenStreetMap and Leaflet.js
- ✏️ **Draw custom boundaries** - Click on the map to create polygon boundaries (minimum 4 points)
- 📊 **Live coordinates** - Displays latitude, longitude, and accuracy in real-time
- 🚨 **Boundary breach detection** - Instant alerts when leaving the safe zone
- ⏱️ **30-second countdown** - Grace period to return to boundary after breach
- � **Re-entry detection** - Automatic wipe cancellation when returning to safe zone
- 📏 **Distance tracking** - Shows distance to nearest boundary edge
- 🎨 **Visual feedback** - Color-coded polygon (Red = outside, Green = re-entered, Red outline = monitoring)
- 🔴 **Continuous monitoring** - Doesn't stop after breach, keeps tracking

## 🚀 How to Use

1. **Open the app** - Visit https://courtenaybernier.github.io/GeoFence/
2. **Allow location access** - Grant GPS permissions when prompted by your browser
3. **Wait for GPS lock** - Your location will appear as a blue marker on the map
4. **Start drawing** - Click the "Start Drawing" button
5. **Create boundary** - Click on the map to add points (minimum 4 points required)
6. **Finish drawing** - Click "Finish Drawing" to complete the polygon
7. **Start monitoring** - Click "Start Monitoring" to activate boundary checking
8. **Test it** - Move outside the boundary to see the alert and countdown

## ⚠️ How It Works

### When you LEAVE the boundary:
1. 🚨 **Alert popup**: "Your device has left the boundary and will be wiped clean in 30 seconds!"
2. 🔴 **Polygon turns RED** with semi-transparent fill
3. ⏱️ **30-second countdown** starts displaying in the status bar
4. 📍 **Continuous monitoring** keeps tracking your location

### If you RE-ENTER within 30 seconds:
1. ✅ **Alert popup**: "SAFE! Device has re-entered the boundary. Wipe has been cancelled!"
2. 🟢 **Polygon turns GREEN** 
3. ⏱️ **Countdown stops** immediately
4. 💾 **Wipe is cancelled** - device is safe

### If 30 seconds expire:
1. 💀 **Alert popup**: "TIME EXPIRED! Device is being wiped clean!"
2. ⚫ **Polygon turns BLACK**
3. 🛑 **Monitoring stops**

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/courtenaybernier/GeoFence.git
cd GeoFence

# Install dependencies
npm install

# Start development server (http://localhost:3000/GeoFence/)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run build
npx gh-pages -d dist
```

## 🛠️ Tech Stack

- **Vanilla JavaScript** - No framework dependencies, pure ES6+
- **Vite 5.4.20** - Lightning-fast build tool and dev server
- **Leaflet 1.9.4** - Open-source interactive mapping library
- **OpenStreetMap** - Free, community-driven map tiles
- **GitHub Pages** - Free static site hosting
- **GitHub Actions** - Automated CI/CD deployment

## 📁 Project Structure

```
GeoFence/
├── index.html          # Main HTML file with inline styles
├── main.js             # Core application logic (393 lines)
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies and scripts
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions deployment
└── dist/               # Production build output
```

## 🔑 Key Functions

- `initApp()` - Initializes map and GPS tracking
- `startWatchingLocation()` - Continuous GPS monitoring with watchPosition
- `checkBoundary()` - Ray-casting algorithm to detect boundary crossings
- `startCountdown()` - 30-second countdown timer
- `stopCountdown()` - Cancels countdown when re-entering
- `isPointInPolygon()` - Mathematical point-in-polygon detection
- `getDistanceToEdge()` - Calculates distance to nearest boundary

## 📱 Browser Support

Works on all modern browsers with GPS/geolocation support:
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile) 
- ✅ Firefox (Desktop & Mobile)

**Requirements:**
- HTTPS connection (required for GPS)
- Geolocation API support
- JavaScript enabled

## 🔒 Privacy & Security

- ✅ **Client-side only** - All processing happens in your browser
- ✅ **No data transmission** - Location data never leaves your device
- ✅ **No storage** - No cookies, no local storage, no tracking
- ✅ **No analytics** - No third-party scripts or tracking
- ✅ **Open source** - Full code transparency

## 🐛 Troubleshooting

**Map not loading?**
- Hard refresh the page (Ctrl + F5)
- Check if browser allows location access
- Ensure HTTPS connection

**GPS not updating?**
- Check device GPS is enabled
- Grant location permissions
- Move to an area with better GPS signal

**Alerts not triggering?**
- Ensure you started monitoring
- Check browser console (F12) for errors
- Make sure you drew at least 4 boundary points

## 📝 License

MIT License - Feel free to use this project for any purpose.

## 👨‍💻 Author

Built by Courtenay Bernier

## 🙏 Credits

- [Leaflet](https://leafletjs.com/) - Open-source mapping library
- [OpenStreetMap](https://www.openstreetmap.org/) - Community-driven map data
- [Vite](https://vitejs.dev/) - Next-generation frontend tooling

---

**⭐ Star this repo if you found it helpful!**
