import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom red icon for fraud points
const fraudIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484167.png",
  iconSize: [25, 25],
});

const FraudMap = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/fraud-locations").then((res) => setLocations(res.data));
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-10">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Fraud Locations Map</h3>
      <MapContainer
        center={[37.8, -96]} // Center of the US
        zoom={4}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {locations.map((loc, index) => (
          <Marker
            key={index}
            position={[loc.lat, loc.long]}
            icon={fraudIcon}
          >
            <Popup>
              <strong>{loc.merchant}</strong><br />
              {loc.city}, {loc.state}<br />
              Amount: ${loc.amt}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default FraudMap;
