import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());


const readJSON = (fileName) => {
  try {
    const filePath = path.join(__dirname, "data", fileName);
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading file:", err.message);
    return null;
  }
};

// Fetch dashboard summary
app.get("/api/summary", async (req, res) => {
  try {
    const data = readJSON("dashboard_summary.json");
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch data for charts (fraud by category)
app.get("/api/fraud-by-category", async (req, res) => {
  try {
    const data = readJSON("fraud_by_category.json");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fraud trend over time
app.get("/api/fraud-trend", async (req, res) => {
  try {
    const data = readJSON("fraud_by_trend.json");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Fraud Hotspot Map
app.get("/api/fraud-map", async (req, res) => {
  try {
    const data = readJSON("fraud_by_map.json");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Merchant Fraud Ranking
app.get("/api/top-merchants", async (req, res) => {
  try {
    const data = readJSON("fraud_by_merchant.json");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pie Chart: Gender distribution for fraud transactions
app.get("/api/fraud-gender-distribution", async (req, res) => {
  try {
    const data = readJSON("fraud_by_gender_distribution.json");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pie Chart: Fraud vs Non-fraud distribution
app.get("/api/fraud-vs-nonfraud", async (req, res) => {
  try {
    const data = readJSON("fraud_vs_nonfraud.json");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});



