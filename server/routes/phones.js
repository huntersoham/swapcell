const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "uploads", "phones"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, or WEBP images are allowed."));
    }
    cb(null, true);
  },
});

// Buy page — browse all listings, newest first, with optional brand filter
router.get("/", (req, res) => {
  const db = readDB();
  let listings = [...db.phones].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (req.query.brand) {
    listings = listings.filter(
      (p) => p.brand.toLowerCase() === req.query.brand.toLowerCase()
    );
  }

  res.json(listings);
});

router.get("/:id", (req, res) => {
  const db = readDB();
  const phone = db.phones.find((p) => p.id === req.params.id);
  if (!phone) return res.status(404).json({ error: "Listing not found." });
  res.json(phone);
});

// Sell page — create a new listing (auth required)
router.post("/", requireAuth, upload.single("photo"), (req, res) => {
  const { brand, model, price, condition, description } = req.body;
  if (!brand || !model || !price || !condition) {
    return res.status(400).json({ error: "Brand, model, price, and condition are required." });
  }

  const db = readDB();
  const seller = db.users.find((u) => u.id === req.userId);

  const listing = {
    id: uuidv4(),
    brand,
    model,
    price: Number(price),
    condition,
    description: description || "",
    photo: req.file ? `/uploads/phones/${req.file.filename}` : null,
    sellerId: req.userId,
    sellerName: seller ? seller.name : "SwapCell User",
    createdAt: new Date().toISOString(),
  };

  db.phones.push(listing);
  writeDB(db);

  res.status(201).json(listing);
});

// Remove a listing — only the owner can delete it
router.delete("/:id", requireAuth, (req, res) => {
  const db = readDB();
  const listing = db.phones.find((p) => p.id === req.params.id);
  if (!listing) return res.status(404).json({ error: "Listing not found." });
  if (listing.sellerId !== req.userId) {
    return res.status(403).json({ error: "You can only delete your own listings." });
  }

  db.phones = db.phones.filter((p) => p.id !== req.params.id);
  writeDB(db);
  res.json({ message: "Listing deleted." });
});

module.exports = router;
