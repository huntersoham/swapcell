import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import Profile from "./pages/Profile";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="page">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/buy" element={<Buy />} />
            <Route
              path="/sell"
              element={
                <ProtectedRoute>
                  <Sell />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
          <footer className="footer">
            <p>© {new Date().getFullYear()} SwapCell. All rights reserved.</p>
            <p className="footer-note">Built with React &amp; Node/Express.</p>
          </footer>
        </div>
      </HashRouter>
    </AuthProvider>
  );
}
