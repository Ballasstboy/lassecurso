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

        // File management buttons
        document.getElementById('download-map').addEventListener('click', () => {
            this.downloadMapImage();
        });

        document.getElementById('save-config').addEventListener('click', () => {
            this.saveConfiguration();
        });

        document.getElementById('load-config').addEventListener('change', (e) => {
            this.loadConfiguration(e);
        });

        // Sidebar buttons
        document.getElementById('sidebar-download-map').addEventListener('click', () => {
            this.downloadMapImage();
        });

        document.getElementById('sidebar-save-config').addEventListener('click', () => {
            this.saveConfiguration();
        });

        document.getElementById('sidebar-load-config').addEventListener('change', (e) => {
            this.loadConfiguration(e);
        });

        document.getElementById('sidebar-clear-all').addEventListener('click', () => {
            this.clearAllPins();
        });

        // Sidebar toggle
        document.getElementById('sidebar-toggle').addEventListener('click', () => {
            this.toggleSidebar();
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

    clearAllPins(showConfirmation = true) {
        if (this.pins.length === 0 && showConfirmation) {
            alert('No pins to clear!');
            return;
        }

        if (!showConfirmation || confirm(`Are you sure you want to remove all ${this.pins.length} pins?`)) {
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
        const count = this.pins.length;
        document.getElementById('pin-counter').textContent = count;
        document.getElementById('sidebar-pin-counter').textContent = count;
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const toggle = document.getElementById('sidebar-toggle');
        
        sidebar.classList.toggle('collapsed');
        
        if (sidebar.classList.contains('collapsed')) {
            toggle.textContent = '+';
            console.log('📦 Sidebar collapsed');
        } else {
            toggle.textContent = '−';
            console.log('📋 Sidebar expanded');
        }
        
        // Refresh map size after sidebar toggle
        setTimeout(() => {
            if (this.map) {
                this.map.invalidateSize();
            }
        }, 300);
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

    // Download map as image
    async downloadMapImage() {
        try {
            console.log('🖼️ Preparing map download...');
            
            // Show loading indicator
            const downloadBtn = document.getElementById('download-map');
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '⏳ Preparing...';
            downloadBtn.disabled = true;

            // Wait for map tiles to load
            await this.waitForTilesToLoad();

            // Create canvas from map
            const mapContainer = document.getElementById('map');
            const canvas = await this.mapToCanvas(mapContainer);
            
            // Download the image
            const link = document.createElement('a');
            link.download = `germany-map-${new Date().toISOString().split('T')[0]}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            console.log('✅ Map image downloaded successfully!');
            
            // Reset button
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
            
        } catch (error) {
            console.error('❌ Error downloading map:', error);
            alert('Error downloading map. Please try again.');
            
            // Reset button
            const downloadBtn = document.getElementById('download-map');
            downloadBtn.innerHTML = '📷 Download Map';
            downloadBtn.disabled = false;
        }
    }

    // Convert map to canvas using html2canvas-like functionality
    async mapToCanvas(element) {
        // Use modern browser's native screenshot API if available
        if (window.html2canvas) {
            return await html2canvas(element, {
                useCORS: true,
                allowTaint: true,
                scale: 1,
                logging: false
            });
        } else {
            // Fallback: Load html2canvas dynamically
            await this.loadHtml2Canvas();
            return await html2canvas(element, {
                useCORS: true,
                allowTaint: true,
                scale: 1,
                logging: false
            });
        }
    }

    // Load html2canvas library dynamically
    loadHtml2Canvas() {
        return new Promise((resolve, reject) => {
            if (window.html2canvas) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Wait for map tiles to finish loading
    waitForTilesToLoad() {
        return new Promise((resolve) => {
            // Simple timeout-based approach
            // In production, you might want to listen to tile load events
            setTimeout(resolve, 2000);
        });
    }

    // Save current configuration to file
    saveConfiguration() {
        try {
            const config = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                mapCenter: this.map.getCenter(),
                mapZoom: this.map.getZoom(),
                pins: this.exportPins(),
                settings: {
                    defaultRadius: this.defaultRadius,
                    defaultColor: this.defaultColor
                }
            };

            const dataStr = JSON.stringify(config, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `germany-map-config-${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            console.log('💾 Configuration saved:', config);
            console.log(`📁 File: germany-map-config-${new Date().toISOString().split('T')[0]}.json`);
            
        } catch (error) {
            console.error('❌ Error saving configuration:', error);
            alert('Error saving configuration. Please try again.');
        }
    }

    // Load configuration from file
    loadConfiguration(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                
                // Validate configuration
                if (!this.validateConfiguration(config)) {
                    alert('Invalid configuration file format.');
                    return;
                }

                // Clear existing pins
                this.clearAllPins(false); // false = don't show confirmation

                // Restore map view
                if (config.mapCenter && config.mapZoom) {
                    this.map.setView([config.mapCenter.lat, config.mapCenter.lng], config.mapZoom);
                }

                // Restore settings
                if (config.settings) {
                    this.defaultRadius = config.settings.defaultRadius || 5;
                    this.defaultColor = config.settings.defaultColor || '#3388ff';
                    
                    // Update UI
                    document.getElementById('radius-input').value = this.defaultRadius;
                    document.getElementById('color-input').value = this.defaultColor;
                }

                // Restore pins
                if (config.pins && config.pins.length > 0) {
                    this.importPins(config.pins);
                }

                console.log('📁 Configuration loaded successfully:', config);
                console.log(`✅ Loaded ${config.pins ? config.pins.length : 0} pins`);
                
                // Show success message
                alert(`Configuration loaded successfully!\nPins: ${config.pins ? config.pins.length : 0}\nDate: ${new Date(config.timestamp).toLocaleDateString()}`);
                
            } catch (error) {
                console.error('❌ Error loading configuration:', error);
                alert('Error loading configuration file. Please check the file format.');
            }
        };

        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    // Validate configuration file format
    validateConfiguration(config) {
        return (
            config &&
            typeof config === 'object' &&
            config.version &&
            Array.isArray(config.pins)
        );
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
    console.log('   mapApp.saveConfiguration() - Save full configuration to file');
    console.log('   mapApp.downloadMapImage() - Download map as PNG image');
    console.log('   mapApp.clearAllPins() - Remove all pins');
    console.log('');
    console.log('🎯 Keyboard shortcuts:');
    console.log('   Ctrl/Cmd + S - Save configuration');
    console.log('   Ctrl/Cmd + Shift + D - Download map image');
    console.log('   Ctrl/Cmd + Shift + C - Clear all pins');
    console.log('   Ctrl/Cmd + Shift + E - Export pins to clipboard');
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
    
    // Ctrl/Cmd + Shift + E to export pins (legacy)
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
    
    // Ctrl/Cmd + S to save configuration
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (window.mapApp) {
            window.mapApp.saveConfiguration();
        }
    }
    
    // Ctrl/Cmd + Shift + D to download map image
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        if (window.mapApp) {
            window.mapApp.downloadMapImage();
        }
    }
});