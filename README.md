# SwapCell

A full stack mobile phone reselling platform, built with **React** (frontend) and **Node.js + Express** (backend API).

## Features

- Landing page — hero, supported brands, "how it works", testimonials, quote lead form
- **Auth:** register, login, forgot password / reset password (JWT-based sessions)
- **Buy:** browse phone listings with brand filtering
- **Sell:** list your phone for sale with photo upload
- **Profile:** edit your details, upload a profile photo, view your own listings

## Tech Stack

- **Frontend:** React, React Router, Vite, CSS
- **Backend:** Node.js, Express, JWT (jsonwebtoken), bcryptjs, Multer (file uploads), CORS
- **Storage:** JSON file (lightweight persistence for demo data) + local disk for uploaded photos

## Project Structure

```
swapcell/
├── client/     # React frontend (Vite)
└── server/     # Express backend API
    ├── routes/       # auth, profile, phones
    ├── middleware/    # JWT auth guard
    └── uploads/       # uploaded avatars & phone photos
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

| Method | Endpoint                | Description                          | Auth |
|--------|--------------------------|---------------------------------------|------|
| POST   | `/api/auth/register`     | Create an account                     | —    |
| POST   | `/api/auth/login`        | Log in                                | —    |
| POST   | `/api/auth/forgot-password` | Request a password reset token     | —    |
| POST   | `/api/auth/reset-password`  | Reset password with token          | —    |
| GET    | `/api/auth/me`           | Current logged-in user                | ✅   |
| PUT    | `/api/profile`           | Update name / phone                   | ✅   |
| POST   | `/api/profile/photo`     | Upload profile photo                  | ✅   |
| GET    | `/api/profile/listings`  | Your own phone listings               | ✅   |
| GET    | `/api/phones`            | Browse listings (optional `?brand=`)  | —    |
| POST   | `/api/phones`            | Create a listing (with photo)         | ✅   |
| DELETE | `/api/phones/:id`        | Delete your own listing               | ✅   |
| POST   | `/api/quote`             | Submit a landing-page quote request   | —    |

## Notes on the GitHub Pages demo

GitHub Pages only serves static files — it cannot run the Express backend. On the
live demo, forms fall back to a "demo mode" message instead of erroring. To use
auth, buy/sell, and profile photo upload for real, run the backend locally
alongside the frontend as described above.

`forgot-password` also returns the reset token directly in the API response in
this demo build, since no email service is configured — in production this
token would be emailed to the user instead.

