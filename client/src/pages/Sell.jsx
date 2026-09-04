import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, DEMO_MODE_MESSAGE } from "../api";
import { useAuth } from "../context/AuthContext";

const BRANDS = ["Apple", "Samsung", "OnePlus", "Xiaomi", "Realme", "Vivo", "Oppo", "Google"];
const CONDITIONS = ["Excellent", "Good", "Fair", "Needs Repair"];

export default function Sell() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    brand: "",
    model: "",
    price: "",
    condition: "",
    description: "",
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (photo) data.append("photo", photo);

    try {
      await apiFetch("/phones", { method: "POST", body: data, token, isForm: true });
      setStatus({ state: "success", message: "Your phone has been listed for sale!" });
      setTimeout(() => navigate("/buy"), 1200);
    } catch (err) {
      setStatus({ state: "error", message: err.message || DEMO_MODE_MESSAGE });
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card wide">
        <h2>List Your Phone for Sale</h2>
        <form className="auth-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <select name="brand" value={form.brand} onChange={handleChange} required>
            <option value="">Select Brand</option>
            {BRANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="model"
            placeholder="Model (e.g. iPhone 13)"
            value={form.model}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Asking price (₹)"
            value={form.price}
            onChange={handleChange}
            min="0"
            required
          />
          <select name="condition" value={form.condition} onChange={handleChange} required>
            <option value="">Select Condition</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <textarea
            name="description"
            placeholder="Describe the phone's condition, accessories included, etc."
            value={form.description}
            onChange={handleChange}
            rows={3}
          />

          <label className="file-label">
            Phone Photo
            <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handlePhotoChange} />
          </label>
          {preview && <img src={preview} alt="Preview" className="photo-preview" />}

          <button type="submit" disabled={status.state === "loading"}>
            {status.state === "loading" ? "Listing..." : "List My Phone"}
          </button>
        </form>
        {status.state === "success" && <p className="status success">{status.message}</p>}
        {status.state === "error" && <p className="status error">{status.message}</p>}
      </div>
    </section>
  );
}
