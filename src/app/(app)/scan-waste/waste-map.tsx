"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import React from 'react';

type WasteMapProps = {
  centers: {
    name: string;
    lat: number;
    lng: number;
  }[];
}

function WasteMap({ centers }: WasteMapProps) {
  // Default center if no centers are provided, or use the first center's location
  const mapCenter: [number, number] = centers.length > 0 ? [centers[0].lat, centers[0].lng] : [28.61, 77.23];

  return (
    <MapContainer center={mapCenter} zoom={12} style={{ height: "400px", width: "100%" }} className="rounded-md">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {centers.map((c, idx) => (
        <Marker key={idx} position={[c.lat, c.lng]}>
          <Popup>{c.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default React.memo(WasteMap);
