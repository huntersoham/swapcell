const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../db");
const { requireAuth, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

function sanitizeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  const db = readDB();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(),
    name,
    email,
    passwordHash,
    phone: "",
    avatar: null,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDB(db);

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user: sanitizeUser(user) });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const db = readDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: sanitizeUser(user) });
});

// Forgot password — issues a reset token.
// Demo note: in production this token would be emailed to the user, not returned in the API response.
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });

  const db = readDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  // Always respond the same way, whether or not the user exists, to avoid leaking account existence.
  if (!user) {
    return res.json({ message: "If that email is registered, a reset link has been generated." });
  }

  const token = uuidv4();
  const expiresAt = Date.now() + 1000 * 60 * 30; // 30 minutes
  db.resetTokens = db.resetTokens.filter((t) => t.userId !== user.id);
  db.resetTokens.push({ token, userId: user.id, expiresAt });
  writeDB(db);

  res.json({
    message: "If that email is registered, a reset link has been generated.",
    demoResetToken: token, // exposed only for this demo build (no email service configured)
  });
});

// Reset password using a token from /forgot-password
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required." });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  const db = readDB();
  const entry = db.resetTokens.find((t) => t.token === token);
  if (!entry || entry.expiresAt < Date.now()) {
    return res.status(400).json({ error: "Reset token is invalid or has expired." });
  }

  const user = db.users.find((u) => u.id === entry.userId);
  if (!user) return res.status(400).json({ error: "User not found." });

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  db.resetTokens = db.resetTokens.filter((t) => t.token !== token);
  writeDB(db);

  res.json({ message: "Password has been reset. You can now log in." });
});

// Current logged-in user
router.get("/me", requireAuth, (req, res) => {
  const db = readDB();
  const user = db.users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: sanitizeUser(user) });
});

module.exports = router;
