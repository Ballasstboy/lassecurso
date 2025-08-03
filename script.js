// Germany Interactive Map Application
class GermanyMap {
    constructor() {
        this.map = null;
        this.pins = [];
        this.currentEditingPin = null;
        
        // Default settings
        this.defaultRadius = 5; // km
        this.defaultColor = '#3388ff';
        
        this.initializeMap();
        this.setupEventListeners();
    }

    initializeMap() {
        // Initialize the map centered on Germany
        this.map = L.map('map').setView([51.1657, 10.4515], 6);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
            minZoom: 5
        }).addTo(this.map);

        // Set map bounds to roughly Germany's borders
        const germanyBounds = [
            [47.2701, 5.8663], // Southwest corner
            [55.0996, 15.0419] // Northeast corner
        ];
        this.map.setMaxBounds(germanyBounds);

        // Add click event listener for placing pins
        this.map.on('click', (e) => {
            this.addPin(e.latlng);
        });
    }

    setupEventListeners() {
        // Default radius input
        document.getElementById('radius-input').addEventListener('change', (e) => {
            this.defaultRadius = parseFloat(e.target.value);
        });

        // Default color input
        document.getElementById('color-input').addEventListener('change', (e) => {
            this.defaultColor = e.target.value;
        });

        // Clear all pins button
        document.getElementById('clear-all').addEventListener('click', () => {
            this.clearAllPins();
        });

        // Modal event listeners
        this.setupModalEventListeners();
    }

    setupModalEventListeners() {
        const modal = document.getElementById('pin-modal');
        const closeBtn = document.querySelector('.close');
        const saveBtn = document.getElementById('modal-save');
        const deleteBtn = document.getElementById('modal-delete');
        const cancelBtn = document.getElementById('modal-cancel');

        // Close modal events
        closeBtn.addEventListener('click', () => this.closeModal());
        cancelBtn.addEventListener('click', () => this.closeModal());
        
        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Save pin changes
        saveBtn.addEventListener('click', () => this.savePin());

        // Delete pin
        deleteBtn.addEventListener('click', () => this.deletePin());

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }

    addPin(latlng) {
        const pin = {
            id: Date.now() + Math.random(),
            latlng: latlng,
            radius: this.defaultRadius,
            color: this.defaultColor,
            label: ''
        };

        // Create marker
        const marker = L.marker([latlng.lat, latlng.lng], {
            draggable: true
        }).addTo(this.map);

        // Create radius circle
        const circle = L.circle([latlng.lat, latlng.lng], {
            color: pin.color,
            fillColor: pin.color,
            fillOpacity: 0.2,
            radius: pin.radius * 1000 // Convert km to meters
        }).addTo(this.map);

        // Store references
        pin.marker = marker;
        pin.circle = circle;

        // Add popup to marker
        this.updatePinPopup(pin);

        // Marker events
        marker.on('click', () => {
            this.editPin(pin);
        });

        marker.on('dragend', () => {
            const newLatLng = marker.getLatLng();
            pin.latlng = newLatLng;
            circle.setLatLng(newLatLng);
            this.updatePinPopup(pin);
        });

        // Add to pins array
        this.pins.push(pin);
        this.updatePinCounter();

        console.log(`Pin added at ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`);
    }

    updatePinPopup(pin) {
        const popupContent = `
            <div style="text-align: center; min-width: 200px;">
                <h4 style="margin: 0 0 10px 0; color: ${pin.color};">
                    ${pin.label || 'Pin'}
                </h4>
                <p style="margin: 5px 0; font-size: 13px;">
                    <strong>Coordinates:</strong><br>
                    ${pin.latlng.lat.toFixed(4)}, ${pin.latlng.lng.toFixed(4)}
                </p>
                <p style="margin: 5px 0; font-size: 13px;">
                    <strong>Radius:</strong> ${pin.radius} km
                </p>
                <div style="margin-top: 10px;">
                    <button onclick="window.mapApp.editPin(window.mapApp.getPinById('${pin.id}'))" 
                            style="background: ${pin.color}; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">
                        Edit
                    </button>
                    <button onclick="window.mapApp.removePinById('${pin.id}')" 
                            style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                        Delete
                    </button>
                </div>
            </div>
        `;
        pin.marker.bindPopup(popupContent);
    }

    editPin(pin) {
        this.currentEditingPin = pin;
        
        // Populate modal fields
        document.getElementById('modal-radius').value = pin.radius;
        document.getElementById('modal-color').value = pin.color;
        document.getElementById('modal-label').value = pin.label;
        
        // Show modal
        document.getElementById('pin-modal').style.display = 'block';
    }

    savePin() {
        if (!this.currentEditingPin) return;

        const pin = this.currentEditingPin;
        const newRadius = parseFloat(document.getElementById('modal-radius').value);
        const newColor = document.getElementById('modal-color').value;
        const newLabel = document.getElementById('modal-label').value.trim();

        // Update pin properties
        pin.radius = newRadius;
        pin.color = newColor;
        pin.label = newLabel;

        // Update circle
        pin.circle.setStyle({
            color: newColor,
            fillColor: newColor
        });
        pin.circle.setRadius(newRadius * 1000); // Convert km to meters

        // Update popup
        this.updatePinPopup(pin);

        this.closeModal();
        console.log(`Pin updated: radius=${newRadius}km, color=${newColor}`);
    }

    deletePin() {
        if (!this.currentEditingPin) return;
        
        this.removePin(this.currentEditingPin);
        this.closeModal();
    }

    removePin(pin) {
        // Remove from map
        this.map.removeLayer(pin.marker);
        this.map.removeLayer(pin.circle);

        // Remove from array
        const index = this.pins.indexOf(pin);
        if (index > -1) {
            this.pins.splice(index, 1);
        }

        this.updatePinCounter();
        console.log('Pin removed');
    }

    removePinById(pinId) {
        const pin = this.pins.find(p => p.id == pinId);
        if (pin) {
            this.removePin(pin);
        }
    }

    getPinById(pinId) {
        return this.pins.find(p => p.id == pinId);
    }

    clearAllPins() {
        if (this.pins.length === 0) {
            alert('No pins to clear!');
            return;
        }

        if (confirm(`Are you sure you want to remove all ${this.pins.length} pins?`)) {
            // Remove all pins from map
            this.pins.forEach(pin => {
                this.map.removeLayer(pin.marker);
                this.map.removeLayer(pin.circle);
            });

            // Clear array
            this.pins = [];
            this.updatePinCounter();
            console.log('All pins cleared');
        }
    }

    closeModal() {
        document.getElementById('pin-modal').style.display = 'none';
        this.currentEditingPin = null;
    }

    updatePinCounter() {
        document.getElementById('pin-counter').textContent = this.pins.length;
    }

    // Utility methods for external access
    exportPins() {
        return this.pins.map(pin => ({
            id: pin.id,
            lat: pin.latlng.lat,
            lng: pin.latlng.lng,
            radius: pin.radius,
            color: pin.color,
            label: pin.label
        }));
    }

    importPins(pinsData) {
        pinsData.forEach(pinData => {
            this.addPin({
                lat: pinData.lat,
                lng: pinData.lng
            });
            
            // Update the last added pin with imported data
            const lastPin = this.pins[this.pins.length - 1];
            lastPin.radius = pinData.radius;
            lastPin.color = pinData.color;
            lastPin.label = pinData.label || '';
            
            // Update visual elements
            lastPin.circle.setStyle({
                color: pinData.color,
                fillColor: pinData.color
            });
            lastPin.circle.setRadius(pinData.radius * 1000);
            this.updatePinPopup(lastPin);
        });
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🇩🇪 Germany Interactive Map - Loading...');
    
    // Create global instance for popup button access
    window.mapApp = new GermanyMap();
    
    console.log('✅ Map initialized successfully!');
    console.log('📍 Click anywhere on the map to place a pin');
    
    // Add some helpful console commands
    console.log('💡 Available console commands:');
    console.log('   mapApp.exportPins() - Export all pins as JSON');
    console.log('   mapApp.importPins(data) - Import pins from JSON data');
    console.log('   mapApp.clearAllPins() - Remove all pins');
});

// Handle page visibility changes to optimize performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('🔄 Map paused (tab hidden)');
    } else {
        console.log('▶️ Map resumed (tab visible)');
        // Refresh map size in case of layout changes
        if (window.mapApp && window.mapApp.map) {
            setTimeout(() => {
                window.mapApp.map.invalidateSize();
            }, 100);
        }
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Shift + C to clear all pins
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        if (window.mapApp) {
            window.mapApp.clearAllPins();
        }
    }
    
    // Ctrl/Cmd + Shift + E to export pins
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        if (window.mapApp) {
            const pins = window.mapApp.exportPins();
            console.log('📤 Exported pins:', pins);
            // Copy to clipboard if possible
            if (navigator.clipboard) {
                navigator.clipboard.writeText(JSON.stringify(pins, null, 2));
                console.log('📋 Pins copied to clipboard!');
            }
        }
    }
});