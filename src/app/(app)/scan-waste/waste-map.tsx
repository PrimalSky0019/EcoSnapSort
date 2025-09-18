"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function WasteMap() {
  return (
    <MapContainer
      center={[20, 77]} 
      zoom={5}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[20, 77]}>
        <Popup>Nearest Recycling Facility</Popup>
      </Marker>
    </MapContainer>
  );
}

export default React.memo(WasteMap);
