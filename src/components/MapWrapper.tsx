"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Component to recenter map when active branch changes or fit bounds when showing all
function BoundsControl({ branches, activeBranchId }: { branches: any[], activeBranchId: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (activeBranchId) {
      const activeBranch = branches.find(b => b._id === activeBranchId);
      if (activeBranch && activeBranch.lat && activeBranch.lng) {
        map.setView([activeBranch.lat, activeBranch.lng], 13);
      }
    } else {
      const validBranches = branches.filter(b => b.lat && b.lng);
      if (validBranches.length > 0) {
        const bounds = L.latLngBounds(validBranches.map(b => [b.lat, b.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      } else {
        // Fallback to Riyadh if no branches have coords
        map.setView([24.7136, 46.6753], 5);
      }
    }
  }, [branches, activeBranchId, map]);
  return null;
}

export default function MapWrapper({ branches, activeBranchId }: { branches: any[], activeBranchId: string | null }) {
  const [logoUrl, setLogoUrl] = useState<string>('');
  
  // Use a default starting center (Riyadh) if we don't have bounding data yet
  const defaultCenter = { lat: 24.7136, lng: 46.6753 };

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
    <MapContainer center={[defaultCenter.lat, defaultCenter.lng]} zoom={5} style={{ height: '100%', width: '100%', borderRadius: '16px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <BoundsControl branches={branches} activeBranchId={activeBranchId} />
      
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
