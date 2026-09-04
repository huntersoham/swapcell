import { useEffect, useState } from "react";
import { apiFetch, DEMO_MODE_MESSAGE } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, token, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [listings, setListings] = useState([]);
  const [listingsError, setListingsError] = useState("");

  useEffect(() => {
    apiFetch("/profile/listings", { token })
      .then(setListings)
      .catch(() => setListingsError(DEMO_MODE_MESSAGE));
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      const data = await apiFetch("/profile", { method: "PUT", body: form, token });
      updateUser(data.user);
      setStatus({ state: "success", message: "Profile updated." });
    } catch (err) {
      setStatus({ state: "error", message: err.message || DEMO_MODE_MESSAGE });
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    const data = new FormData();
    data.append("avatar", file);
    try {
      const res = await apiFetch("/profile/photo", { method: "POST", body: data, token, isForm: true });
      updateUser(res.user);
    } catch (err) {
      setStatus({ state: "error", message: err.message || DEMO_MODE_MESSAGE });
    } finally {
      setAvatarUploading(false);
    }
  };

  if (!user) return null;

  return (
    <section className="profile-section">
      <div className="profile-header">
        <div className="avatar-wrap">
          {user.avatar ? (
            <img src={user.avatar} alt="Profile" className="avatar-large" />
          ) : (
            <div className="avatar-placeholder">{user.name.charAt(0).toUpperCase()}</div>
          )}
          <label className="avatar-upload-btn">
            {avatarUploading ? "Uploading..." : "Change Photo"}
            <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleAvatarChange} hidden />
          </label>
        </div>
        <div>
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
        </div>
      </div>

      <div className="auth-card wide">
        <h3>Edit Details</h3>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
          <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
          <button type="submit" disabled={status.state === "loading"}>
            {status.state === "loading" ? "Saving..." : "Save Changes"}
          </button>
        </form>
        {status.state === "success" && <p className="status success">{status.message}</p>}
        {status.state === "error" && <p className="status error">{status.message}</p>}
      </div>

      <div className="profile-listings">
        <h3>Your Listings</h3>
        {listingsError && <p className="status error">{listingsError}</p>}
        {!listingsError && listings.length === 0 && <p className="muted">You haven't listed any phones yet.</p>}
        <div className="listing-grid">
          {listings.map((phone) => (
            <div className="listing-card" key={phone.id}>
              <div className="listing-photo">
                {phone.photo ? (
                  <img src={phone.photo} alt={`${phone.brand} ${phone.model}`} />
                ) : (
                  <div className="listing-photo-placeholder">📱</div>
                )}
              </div>
              <div className="listing-body">
                <h3>
                  {phone.brand} {phone.model}
                </h3>
                <p className="listing-condition">{phone.condition}</p>
                <span className="listing-price">₹{phone.price.toLocaleString("en-IN")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
