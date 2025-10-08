import React, { useState } from "react";
import axios from "axios";
import FraudResult from "./FraudResult";

export default function CsvUploadForm() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const PYTHON_API_BASE = import.meta.env.VITE_PYTHON_API_BASE; 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a CSV file.");

    setLoading(true);
    setResult([]);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${PYTHON_API_BASE}/predict/csv`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Ensure result is always an array
      setResult(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto space-y-4">
      <div className="w-full flex justify-between items-center">
        <a
          href="/sample.csv" // serve a static CSV from frontend
          download
          className="text-blue-600 underline hover:text-blue-800 text-sm"
        >
          📄 Download Sample CSV
        </a>

      
      </div>

      <form
        onSubmit={handleUpload}
        className="w-full flex flex-col items-center space-y-4"
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="p-3 border-2 border-black rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          } text-white px-6 py-2 rounded-lg transition`}
        >
          {loading ? "Uploading..." : "Upload & Predict"}
        </button>
      </form>

      {Array.isArray(result) && result.length > 0 && (
        <div className="mt-6 bg-gray-50 p-4 rounded w-full text-center">
          <h2 className="text-lg font-semibold mb-4">Prediction Summary</h2>

          <p>Total Transactions: {result.length}</p>
          <p>
            Fraudulent:{" "}
            {result.filter((r) => r.is_fraud === 1).length} (
            {(
              (result.filter((r) => r.is_fraud === 1).length / result.length) *
              100
            ).toFixed(2)}
            %)
          </p>

          <div className="mt-4 max-h-60 overflow-y-auto">
            {result.slice(0, 10).map((row, idx) => (
              <div key={idx} className="border-b py-3">
                <p className="text-sm font-medium text-gray-700">
                  Merchant: <span className="text-gray-800">{row.merchant}</span>
                </p>
                <FraudResult probability={row.fraud_probability} />
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-2">Showing first 10 results only</p>
        </div>
      )}
    </div>
  );
}
