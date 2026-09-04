const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "uploads", "avatars"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${req.userId}-${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, or WEBP images are allowed."));
    }
    cb(null, true);
  },
});

function sanitizeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// Update profile fields (name, phone)
router.put("/", requireAuth, (req, res) => {
  const { name, phone } = req.body;
  const db = readDB();
  const user = db.users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "User not found." });

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  writeDB(db);

  res.json({ user: sanitizeUser(user) });
});

// Upload / replace profile photo
router.post("/photo", requireAuth, upload.single("avatar"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded." });

  const db = readDB();
  const user = db.users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "User not found." });

  user.avatar = `/uploads/avatars/${req.file.filename}`;
  writeDB(db);

  res.json({ user: sanitizeUser(user) });
});

// This user's own phone listings
router.get("/listings", requireAuth, (req, res) => {
  const db = readDB();
  const listings = db.phones.filter((p) => p.sellerId === req.userId);
  res.json(listings);
});

module.exports = router;
