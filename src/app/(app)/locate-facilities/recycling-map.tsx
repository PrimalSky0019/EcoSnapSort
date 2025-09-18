
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Example facility data (can come from Firestore later)
const facilities = [
  {
    id: 1,
    name: "E-Waste Recycling Center",
    type: "Electronics",
    coords: [28.61, 77.23] as [number, number],
    contact: "📞 +91-9876543210"
  },
  {
    id: 2,
    name: "Textile Recycling Facility",
    type: "Cotton / Clothes",
    coords: [19.07, 72.87] as [number, number],
    contact: "📧 textiles@recycle.org"
  },
  {
    id: 3,
    name: "Greenfield Recycling Center",
    type: "Recycling Center",
    coords: [21.1458, 79.0882] as [number, number],
    contact: "📞 +91-1234567890",
  },
  {
    id: 4,
    name: "Eco Scrap Traders",
    type: "Scrap Shop",
    coords: [12.9716, 77.5946] as [number, number],
    contact: "📧 scrap@trade.com",
  },
];

export default function RecyclingMap() {
  return (
    <MapContainer
      center={[22.97, 77.59]} // Center of India
      zoom={5}
      style={{ height: "500px", width: "100%" }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {facilities.map((f) => (
        <Marker key={f.id} position={f.coords}>
          <Popup>
            <strong>{f.name}</strong> <br />
            ♻️ Type: {f.type} <br />
            {f.contact} <br />
            <a
              href={`mailto:${f.contact.replace("📧 ", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Contact Facility
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
