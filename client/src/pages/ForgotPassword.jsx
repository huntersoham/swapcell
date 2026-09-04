import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const data = await apiFetch("/auth/forgot-password", { method: "POST", body: { email } });
      setMessage(data.message);
      // Demo-only: since no email service is wired up, we forward straight to the reset
      // page with the token that a real deployment would instead send by email.
      if (data.demoResetToken) {
        setTimeout(() => navigate(`/reset-password?token=${data.demoResetToken}`), 1500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <p className="auth-note">Enter your account email and we'll help you reset your password.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && <p className="status success">{message}</p>}
        {error && <p className="status error">{error}</p>}
        <p className="auth-switch">
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </section>
  );
}
