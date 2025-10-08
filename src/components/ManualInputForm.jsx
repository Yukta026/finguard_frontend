import React, { useState } from "react";
import axios from "axios";
import FraudResult from "./FraudResult";

export default function ManualInputForm() {
  const [formData, setFormData] = useState({
  trans_date_trans_time: "",
  cc_num: "",
  merchant: "",
  category: "",
  amt: "",
  first: "",
  last: "",
  gender: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  lat: "",
  long: "",
  city_pop: "",
  job: "",
  dob: "",
  trans_num: "",
  unix_time: "",
  merch_lat: "",
  merch_long: "",
});


  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Compute derived features before sending to backend
  const preparePayload = () => {
    const date = new Date(formData.transaction_time);
    return {
      ...formData,
      unix_time: Math.floor(date.getTime() / 1000),
      hour: date.getHours(),
      day: date.getDate(),
      month: date.getMonth() + 1,
      weekday: date.getDay(),
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSample = () => {
    setFormData({
      merchant: "Fraud_Ruecker Group",
      category: "shopping_pos",
      amt: "1050.75",
      first: "Alice",
      last: "Smith",
      gender: "F",
      street: "123 King St",
      city: "Toronto",
      state: "ON",
      zip: "M5H 2N2",
      lat: "43.6532",
      long: "-79.3832",
      city_pop: "5000000",
      job: "Data Analyst",
      dob: "1985-04-23",
      transaction_time: "2025-10-07T14:35",
      merch_lat: "43.7000",
      merch_long: "-79.4000",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const payload = preparePayload();
      const res = await axios.post("http://localhost:5001/predict/manual", payload);
      setResult(res.data);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Fraud Detection Prediction
      </h2>

      <div className="text-right mb-4">
        <button
          type="button"
          onClick={handleSample}
          className="text-sm text-indigo-600 hover:underline"
        >
          Use Example Transaction
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Section */}
        <section className="p-4 border border-gray-300 rounded-lg">
          <h3 className="font-semibold text-lg text-gray-700 mb-3">Transaction Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Amount ($)</label>
              <input
                type="number"
                name="amt"
                value={formData.amt}
                onChange={handleChange}
                placeholder="e.g. 500.75"
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. grocery_pos"
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Transaction Time</label>
              <input
                type="datetime-local"
                name="transaction_time"
                value={formData.transaction_time}
                onChange={handleChange}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
          </div>
        </section>

        {/* Customer Section */}
        <section className="p-4 border border-gray-300 rounded-lg">
          <h3 className="font-semibold text-lg text-gray-700 mb-3">Customer Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="first" value={formData.first} onChange={handleChange} placeholder="First Name" className="p-2 border rounded" />
            <input type="text" name="last" value={formData.last} onChange={handleChange} placeholder="Last Name" className="p-2 border rounded" />
            <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="M / F" className="p-2 border rounded" />
            <input type="text" name="job" value={formData.job} onChange={handleChange} placeholder="e.g. Software Engineer" className="p-2 border rounded" />
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="p-2 border rounded" />
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="p-2 border rounded" />
            <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="p-2 border rounded" />
            <input type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="ZIP Code" className="p-2 border rounded" />
            <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Street Address" className="col-span-2 p-2 border rounded" />
            <input type="number" name="city_pop" value={formData.city_pop} onChange={handleChange} placeholder="City Population" className="p-2 border rounded" />
          </div>
        </section>

        {/* Merchant Section */}
        <section className="p-4 border border-gray-300 rounded-lg">
          <h3 className="font-semibold text-lg text-gray-700 mb-3">Merchant Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="merchant" value={formData.merchant} onChange={handleChange} placeholder="Merchant Name" className="p-2 border rounded" />
            <input type="text" name="merch_lat" value={formData.merch_lat} onChange={handleChange} placeholder="Merchant Latitude" className="p-2 border rounded" />
            <input type="text" name="merch_long" value={formData.merch_long} onChange={handleChange} placeholder="Merchant Longitude" className="p-2 border rounded" />
          </div>
        </section>

        {/* Predict Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white px-8 py-2 rounded-lg transition`}
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </div>
      </form>

      {/* Result Section */}
      {result && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border text-center">
          <h2 className="text-lg font-semibold mb-4">Prediction Summary</h2>
          <FraudResult probability={result.fraud_probability} />
        </div>
      )}
    </div>
  );
}
