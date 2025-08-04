import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Club } from '../data/clubs';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  clubs: Club[];
  onClubSelect: (club: Club) => void;
}

export const MapView: React.FC<MapViewProps> = ({ clubs, onClubSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map centered on Rostock
    const map = L.map(mapRef.current).setView([54.0887, 12.1281], 13);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tiles with dark theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create custom icon for nightclub markers
    const clubIcon = L.divIcon({
      html: `
        <div style="
          background: linear-gradient(135deg, #9945FF, #FF0080);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
          box-shadow: 0 2px 10px rgba(153, 69, 255, 0.5);
        ">🎵</div>
      `,
      className: 'custom-club-marker',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    // Add markers for each club
    clubs.forEach((club) => {
      const marker = L.marker(club.coordinates, { icon: clubIcon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(
          `
          <div style="color: #333; font-family: sans-serif; min-width: 200px;">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 24px; margin-right: 8px;">${club.logo}</span>
              <strong style="font-size: 16px; color: #9945FF;">${club.name}</strong>
            </div>
            <p style="margin: 4px 0; font-size: 13px; color: #666;">${club.description}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #888;">📍 ${club.address}</p>
            <div style="margin: 8px 0;">
              ${club.genres.map(genre => `<span style="
                background: #f0f0f0;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 10px;
                margin-right: 4px;
                color: #666;
              ">${genre}</span>`).join('')}
            </div>
            <div style="margin-top: 8px;">
              <strong style="font-size: 12px; color: #333;">Upcoming Events: ${club.events.length}</strong>
            </div>
          </div>
          `,
          {
            maxWidth: 300,
            className: 'custom-popup'
          }
        );

      marker.on('click', () => {
        onClubSelect(club);
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are any
    if (clubs.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [clubs, onClubSelect]);

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-[600px] rounded-xl border border-gray-700 overflow-hidden"
        style={{ backgroundColor: '#1a1a1a' }}
      />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3 z-[1000]">
        <h4 className="text-sm font-semibold text-gray-200 mb-2">
          🗺️ Rostock Nightlife Map
        </h4>
        <p className="text-xs text-gray-400 mb-2">
          {clubs.length} clubs shown
        </p>
        <div className="flex items-center text-xs text-gray-400">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink mr-2"></div>
          <span>Club location</span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3 z-[1000]">
        <div className="text-xs text-gray-400 space-y-1">
          <div>🎵 Click markers for details</div>
          <div>📍 Click to open schedule</div>
        </div>
      </div>
    </div>
  );
};