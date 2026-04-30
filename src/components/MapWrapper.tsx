"use client";
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues in Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

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
          <Marker key={b._id} position={[b.lat, b.lng]}>
            <Popup>
              <strong>{b.nameAr}</strong><br />
              {b.descAr}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
