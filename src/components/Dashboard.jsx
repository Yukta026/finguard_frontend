import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Legend, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, ScatterChart, Scatter } from "recharts";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";


const COLORS = ["#6366F1", "#F59E0B", "#EF4444", "#10B981"];

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [fraudByCategory, setFraudByCategory] = useState([]);
  const [fraudTrend, setFraudTrend] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [topMerchants, setTopMerchants] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [fraudRatioData, setFraudRatioData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/summary").then((res) => setSummary(res.data));
    axios.get("http://localhost:5000/api/fraud-by-category").then((res) => setFraudByCategory(res.data));
    axios.get("http://localhost:5000/api/fraud-trend").then((res) => setFraudTrend(res.data));
    fetch("http://localhost:5000/api/fraud-map").then(r => r.json()).then(setMapData);
    fetch("http://localhost:5000/api/top-merchants").then(r => r.json()).then(setTopMerchants);
    fetch("http://localhost:5000/api/fraud-gender-distribution")
      .then((res) => res.json())
      .then((data) => setGenderData(data))
      .catch(console.error);

    fetch("http://localhost:5000/api/fraud-vs-nonfraud")
      .then((res) => res.json())
      .then((data) => setFraudRatioData(data))
      .catch(console.error);

  }, []);

  return (
    <div className="p-8 space-y-8">
     <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Anti-Money Laundering Dashboard
      </h2>

      <p className="text-gray-600 text-center mb-4">
        Monitor transactions, suspicious activities and customer payment patterns.
      </p>
        {/*Summary Cards*/}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-700 font-bold">Total Transactions</h3>
          <p className="text-2xl text-indigo-600 font-semibold">{summary.total_transactions}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-700 font-bold">Fraudulent Transactions</h3>
          <p className="text-2xl text-red-600 font-semibold">{summary.fraud_count}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-700 font-bold">Average Transaction ($)</h3>
          <p className="text-2xl text-green-600 font-semibold">{summary.avg_amount}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-10">
        {/* Pie Chart: Fraud Gender Distribution */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-700 font-bold mb-4">Gender Distribution (Fraud Only)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="count"
                nameKey="gender"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {genderData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Fraud vs Non-Fraud */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-700 font-bold mb-4">Fraud vs Non-Fraud Ratio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fraudRatioData}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label
              >
                {fraudRatioData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
          <div className="grid grid-cols-2 gap-6 ">
      {/* Fraud by Category */} 
   
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Fraud by Category</h3>
        <BarChart width={600} height={300} data={fraudByCategory}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#ef4444" />
        </BarChart>
      </div>

      {/* Fraud Trend Over Time */}
      <div className="bg-white w-full p-6 rounded-xl shadow mb-10">
        <h3 className="text-lg font-semibold text-gray-700">Fraud Trend Over Time</h3>
        <LineChart width={600} height={300} data={fraudTrend} >
          <XAxis
  dataKey="date"
  angle={-45}
  textAnchor="end"
  height={70}
  tickFormatter={(date) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
/>

          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#3b82f6" />
        </LineChart>
      </div>
     </div>


      {/* Fraud Hotspot Map */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold text-gray-700 mb-2">Fraud Hotspot Map</h3>
        <MapContainer center={[37.0902, -95.7129]} zoom={4} style={{ height: "400px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {mapData.map((loc, idx) => (
            <CircleMarker
              key={idx}
              center={[loc.lat, loc.long]}
              radius={4}
              color="red"
              fillOpacity={0.6}
            >
              <Popup>
                <b>{loc.city}, {loc.state}</b><br />
                ${loc.amt}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Top Fraudulent Merchants */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-bold text-gray-700 mb-2">Top Fraudulent Merchants</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topMerchants} layout="vertical" margin={{ left: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="merchant" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="fraud_count" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
    
   
    </div>
  );
};

export default Dashboard;
