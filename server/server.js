const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { readDB, writeDB } = require("./db");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const phoneRoutes = require("./routes/phones");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve uploaded avatars / phone photos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/phones", phoneRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Landing page "Get Quote" lead form (kept from original marketing page)
app.post("/api/quote", (req, res) => {
  const { name, phone, brand, model } = req.body;
  if (!name || !phone || !brand || !model) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const db = readDB();
  const quote = {
    id: Date.now(),
    name,
    phone,
    brand,
    model,
    createdAt: new Date().toISOString(),
  };
  db.quotes.push(quote);
  writeDB(db);

  res.status(201).json({
    message: "Quote request received! Our team will contact you shortly.",
    quote,
  });
});

app.get("/api/quotes", (req, res) => {
  const db = readDB();
  res.json(db.quotes);
});

// Multer / generic error handler
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ error: err.message || "Something went wrong." });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`SwapCell API running on port ${PORT}`);
});
