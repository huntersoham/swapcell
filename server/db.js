const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "data", "db.json");

function defaultData() {
  return {
    users: [],
    phones: [
      {
        id: "seed-1",
        brand: "Apple",
        model: "iPhone 12",
        price: 24000,
        condition: "Good",
        description: "128GB, minor scratches on back, battery health 87%.",
        photo: null,
        sellerId: null,
        sellerName: "SwapCell",
        createdAt: new Date().toISOString(),
      },
      {
        id: "seed-2",
        brand: "Samsung",
        model: "Galaxy S21",
        price: 19500,
        condition: "Excellent",
        description: "256GB, like new, box and charger included.",
        photo: null,
        sellerId: null,
        sellerName: "SwapCell",
        createdAt: new Date().toISOString(),
      },
      {
        id: "seed-3",
        brand: "OnePlus",
        model: "OnePlus 9",
        price: 15000,
        condition: "Good",
        description: "128GB, screen protector applied since day one.",
        photo: null,
        sellerId: null,
        sellerName: "SwapCell",
        createdAt: new Date().toISOString(),
      },
    ],
    quotes: [],
    resetTokens: [],
  };
}

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    writeDB(defaultData());
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
