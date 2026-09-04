const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const QUOTES_FILE = path.join(__dirname, "quotes.json");

app.use(cors());
app.use(express.json());

function readQuotes() {
  if (!fs.existsSync(QUOTES_FILE)) return [];
  return JSON.parse(fs.readFileSync(QUOTES_FILE, "utf-8"));
}

function writeQuotes(quotes) {
  fs.writeFileSync(QUOTES_FILE, JSON.stringify(quotes, null, 2));
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Submit a quote request from the landing page form
app.post("/api/quote", (req, res) => {
  const { name, phone, brand, model } = req.body;

  if (!name || !phone || !brand || !model) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const quote = {
    id: Date.now(),
    name,
    phone,
    brand,
    model,
    createdAt: new Date().toISOString(),
  };

  const quotes = readQuotes();
  quotes.push(quote);
  writeQuotes(quotes);

  res.status(201).json({
    message: "Quote request received! Our team will contact you shortly.",
    quote,
  });
});

// List all submitted quote requests (simple admin view)
app.get("/api/quotes", (req, res) => {
  res.json(readQuotes());
});

app.listen(PORT, () => {
  console.log(`SwapCell API running on port ${PORT}`);
});
