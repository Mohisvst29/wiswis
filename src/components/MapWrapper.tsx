"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Component to recenter map when active branch changes
function RecenterMap({ lat, lng }: { lat: number, lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

export default function MapWrapper({ branches, activeBranchId }: { branches: any[], activeBranchId: string | null }) {
  const defaultCenter = { lat: 24.7136, lng: 46.6753 }; // Riyadh default
  const activeBranch = branches.find(b => b._id === activeBranchId) || branches[0];

  const centerLat = activeBranch?.lat || defaultCenter.lat;
  const centerLng = activeBranch?.lng || defaultCenter.lng;

  const [logoUrl, setLogoUrl] = useState<string>('');

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      if (data && data.logoUrl) setLogoUrl(data.logoUrl);
    });
  }, []);

  // Create custom icon
  const customIcon = L.icon({
    iconUrl: logoUrl || '/favicon.ico', // Fallback to favicon if logo not loaded
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    className: 'custom-map-marker bg-white p-1 rounded-full shadow-lg border-2 border-[var(--color-primary)] object-contain'
  });

  return (
    <MapContainer center={[centerLat, centerLng]} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '16px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterMap lat={centerLat} lng={centerLng} />
      
      {branches.map(b => {
        if (!b.lat || !b.lng) return null;
        return (
          <Marker 
            key={b._id} 
            position={[b.lat, b.lng]} 
            icon={customIcon}
            eventHandlers={{
              click: () => {
                if (b.mapUrl) {
                  window.open(b.mapUrl, '_blank');
                }
              },
            }}
          />
        );
      })}
    </MapContainer>
  );
}
