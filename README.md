# SwapCell

A full stack landing/marketing page for a mobile phone reselling platform, built with **React** (frontend) and **Node.js + Express** (backend API).

## Features

- Responsive landing page — hero, supported brands, "how it works" flow, testimonials
- "Get a Free Quote" lead form connected to a live backend API
- REST API (Express) that validates and stores quote requests

## Tech Stack

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express, CORS
- **Storage:** JSON file (lightweight persistence for demo/lead data)

## Project Structure

```
swapcell/
├── client/     # React frontend (Vite)
└── server/     # Express backend API
```

## Getting Started

### Backend

```bash
cd server
npm install
node server.js   # runs on http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev       # runs on http://localhost:5173
```

The frontend dev server proxies `/api` requests to the backend on port 5000.

## API Endpoints

| Method | Endpoint       | Description                     |
|--------|----------------|----------------------------------|
| GET    | `/api/health`  | Health check                     |
| POST   | `/api/quote`   | Submit a phone quote request     |
| GET    | `/api/quotes`  | List all submitted quote requests|
