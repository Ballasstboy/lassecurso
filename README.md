# 🇩🇪 Germany Interactive Map

An interactive web application that displays a full, scrollable and zoomable map of Germany with pin placement and radius management capabilities.

## ✨ Features

- **Full Germany Map**: Interactive map using OpenStreetMap data via Leaflet.js
- **Pin Placement**: Click anywhere on the map to place pins
- **Custom Radius**: Set radius for each pin (in kilometers)
- **Color Customization**: Choose colors for each pin and its radius area
- **Pin Labels**: Add custom text labels to identify and organize pins
- **Interactive Management**: Edit, move, and delete pins with intuitive controls
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Sidebar Controls**: Dedicated control panel for quick file operations
- **Keyboard Shortcuts**: Quick actions via keyboard commands
- **Map Download**: Export map with pins as high-quality PNG image
- **Configuration Save/Load**: Save complete map setups and reload them later

## 🚀 Getting Started

### Prerequisites

No installation required! This is a client-side web application that runs entirely in your browser.

### Running the Application

1. **Download/Clone the files**:
   - `index.html`
   - `styles.css` 
   - `script.js`

2. **Open in browser**:
   Simply open `index.html` in any modern web browser.

3. **Start using**:
   - The map will load centered on Germany
   - Click anywhere to place your first pin!

## 🎯 How to Use

### Basic Operations

1. **Place a Pin**:
   - Click anywhere on the map
   - A pin with default settings will be created

2. **Edit a Pin**:
   - Click on an existing pin marker
   - Use the edit modal to adjust radius, color, and label
   - Click "Save Changes" to apply

3. **Delete a Pin**:
   - Click on a pin to open the edit modal
   - Click "Delete Pin" button
   - Or use the delete button in the pin popup

4. **Move a Pin**:
   - Drag any pin marker to a new location
   - The radius circle will move with it

### Advanced Features

#### Default Settings
- Set default radius and color for new pins using the controls at the top
- These settings apply to all newly created pins

#### Pin Management
- **Pin Counter**: Shows total number of pins placed
- **Clear All**: Remove all pins at once (with confirmation)

#### Sidebar Controls
The application features a dedicated sidebar for quick access to file operations:

- **📷 Download Map**: Export current map view as high-quality PNG image
- **💾 Save Config**: Download complete configuration as JSON file  
- **📁 Upload JSON**: Restore previously saved map configurations
- **🗑️ Clear All**: Remove all pins with confirmation
- **Collapsible**: Click the toggle button (−/+) to expand/collapse sidebar

#### File Management (Top Controls)
- **Download Map**: Click "📷 Download Map" to save the current map view as a PNG image
- **Save Configuration**: Click "💾 Save Config" to download a JSON file with all pins and settings
- **Load Configuration**: Click "📁 Load Config" to restore a previously saved map setup

#### Keyboard Shortcuts
- `Ctrl/Cmd + S`: Save configuration to file
- `Ctrl/Cmd + Shift + D`: Download map as image
- `Ctrl/Cmd + Shift + C`: Clear all pins
- `Ctrl/Cmd + Shift + E`: Export pins to console and clipboard
- `Esc`: Close edit modal

#### Console Commands
Open browser console (F12) and use these commands:

```javascript
// Export all pins as JSON
mapApp.exportPins()

// Import pins from JSON data
mapApp.importPins(data)

// Save complete configuration to file
mapApp.saveConfiguration()

// Download map as PNG image
mapApp.downloadMapImage()

// Clear all pins programmatically
mapApp.clearAllPins()
```

## 🎨 Customization

### Pin Properties
Each pin supports:
- **Radius**: 0.1 to 100 kilometers
- **Color**: Any hex color (affects both pin popup and radius area)
- **Label**: Optional text label for identification
- **Position**: Drag to reposition

### Visual Features
- Semi-transparent radius circles show coverage area
- Color-coded pins and circles for easy identification
- Responsive popups with pin information
- Modern, gradient-based UI design

## 🗺️ Map Features

- **Base Map**: OpenStreetMap tiles showing streets and geographic details
- **Germany Focus**: Map bounds restricted to Germany's borders
- **Zoom Levels**: From country view (zoom 5) to street level (zoom 18)
- **Navigation**: Mouse wheel zoom, click-drag panning

## 📱 Responsive Design

The application adapts to different screen sizes:
- **Desktop**: Full-featured layout with side-by-side controls
- **Tablet**: Stacked layout with touch-friendly controls
- **Mobile**: Compact layout optimized for small screens

## 🔧 Technical Details

### Built With
- **Leaflet.js 1.9.4**: Open-source mapping library
- **OpenStreetMap**: Free, editable map data
- **Vanilla JavaScript**: No additional frameworks required
- **Modern CSS**: Flexbox, Grid, and CSS3 features

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### File Structure
```
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript application logic
└── README.md           # This documentation
```

## 💾 File Management

### Map Download (PNG Image)
- **Format**: High-quality PNG image
- **Content**: Complete map view with all pins and radius circles
- **Filename**: `germany-map-YYYY-MM-DD.png`
- **Use Case**: Share visual maps, presentations, documentation

### Configuration Files (JSON)
- **Format**: Structured JSON data
- **Content**: All pins, map view, settings, timestamp
- **Filename**: `germany-map-config-YYYY-MM-DD.json`
- **Use Case**: Backup, restore, share complete map setups

#### Configuration File Structure:
```json
{
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "mapCenter": { "lat": 51.1657, "lng": 10.4515 },
  "mapZoom": 6,
  "pins": [
    {
      "id": "unique-id",
      "lat": 52.5200,
      "lng": 13.4050,
      "radius": 10,
      "color": "#ff0000",
      "label": "Berlin Office"
    }
  ],
  "settings": {
    "defaultRadius": 5,
    "defaultColor": "#3388ff"
  }
}
```

## 🎯 Use Cases

- **Urban Planning**: Visualize service areas and coverage zones
- **Business Analysis**: Map customer reach and market areas
- **Event Planning**: Plan venues with radius considerations
- **Research**: Mark locations of interest with coverage areas
- **Education**: Teaching geography and spatial relationships
- **Project Collaboration**: Share map configurations between team members
- **Documentation**: Create visual reports with downloadable maps

## 🛠️ Customization Guide

### Adding New Pin Types
To add different pin types, modify the `addPin` method in `script.js`:

```javascript
// Add pin type property
pin.type = 'custom';

// Use different markers for different types
const customIcon = L.icon({
    iconUrl: 'path/to/custom-icon.png',
    iconSize: [25, 41]
});
```

### Changing Map Bounds
To use for other countries, update the bounds in `initializeMap()`:

```javascript
const countryBounds = [
    [southWestLat, southWestLng],
    [northEastLat, northEastLng]
];
map.setMaxBounds(countryBounds);
```

### Adding New Tile Layers
Replace OpenStreetMap with other providers:

```javascript
L.tileLayer('https://{s}.tile.provider.com/{z}/{x}/{y}.png', {
    attribution: '© Provider Name',
    // other options
}).addTo(map);
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📞 Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Ensure you have a stable internet connection for map tiles
3. Try refreshing the page
4. Verify your browser meets the compatibility requirements

---

**Enjoy mapping Germany! 🗺️✨**