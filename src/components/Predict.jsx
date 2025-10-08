import React, { useState } from "react";
import ManualInputForm from "./ManualInputForm";
import CsvUploadForm from "./CsvUploadForm";

export function Predict() {
  const [mode, setMode] = useState("manual");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Fraud Detection Prediction
      </h2>

      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${mode === "manual" ? "bg-blue-600 text-white underline" : "bg-gray-200"}`}
          onClick={() => setMode("manual")}
        >
          Manual Input
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${mode === "csv" ? "bg-blue-600 text-white underline" : "bg-gray-200"}`}
          onClick={() => setMode("csv")}
        >
          CSV Upload
        </button>
      </div>

      {mode === "manual" ? <ManualInputForm /> : <CsvUploadForm />}
    </div>
  );
}
export default Predict;