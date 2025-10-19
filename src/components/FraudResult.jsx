import React from "react";
import ReactSpeedometer from "react-d3-speedometer";
import PropTypes from 'prop-types';
export default function FraudResult({ probability }) {
  const riskLevel =
    probability >= 0.75
      ? "High Risk"
      : probability >= 0.4 ? "Probable Fraud" : "Safe";

  const color =
    probability >= 0.75
      ? "#dc2626" // red
      : probability >= 0.4 ? "#f97316" : "#16a34a"; // green

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Fraud Risk Analysis
      </h2>

      <ReactSpeedometer
        value={probability * 100}
        minValue={0}
        maxValue={100}
        segments={3}
        segmentColors={["#16a34a", "#f97316", "#dc2626"]}
        currentValueText="Fraud Probability: ${value}%"
        needleColor={color}
        textColor="#111827"
      />

      <h3
        className={`mt-4 text-lg font-bold ${
          probability >= 0.75
            ? "text-red-600"
            : probability >= 0.4 ? "text-orange-500" : "text-green-600"
        }`}
      >
        {riskLevel}
      </h3>

      <p className="text-gray-600 mt-2">
        Confidence: {(probability * 100).toFixed(2)}%
      </p>
    </div>
  );
  
}
FraudResult.propTypes = {
    probability: PropTypes.number.isRequired
,
  };