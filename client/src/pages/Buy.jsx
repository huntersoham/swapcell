import { useEffect, useState } from "react";
import { apiFetch, DEMO_MODE_MESSAGE } from "../api";

const BRANDS = ["Apple", "Samsung", "OnePlus", "Xiaomi", "Realme", "Vivo", "Oppo", "Google"];

export default function Buy() {
  const [listings, setListings] = useState([]);
  const [brand, setBrand] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const query = brand ? `?brand=${encodeURIComponent(brand)}` : "";
    apiFetch(`/phones${query}`)
      .then(setListings)
      .catch(() => setError(DEMO_MODE_MESSAGE))
      .finally(() => setLoading(false));
  }, [brand]);

  return (
    <section className="listing-section">
      <h2>Buy a Refurbished Phone</h2>
      <p className="quote-sub">Verified listings from our sellers, all quality-checked.</p>

      <div className="filter-row">
        <button className={brand === "" ? "chip active" : "chip"} onClick={() => setBrand("")}>
          All
        </button>
        {BRANDS.map((b) => (
          <button
            key={b}
            className={brand === b ? "chip active" : "chip"}
            onClick={() => setBrand(b)}
          >
            {b}
          </button>
        ))}
      </div>

      {loading && <p className="status">Loading listings...</p>}
      {error && <p className="status error">{error}</p>}

      {!loading && !error && listings.length === 0 && (
        <p className="status">No listings found for this brand yet.</p>
      )}

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
              <p className="listing-desc">{phone.description}</p>
              <div className="listing-footer">
                <span className="listing-price">₹{phone.price.toLocaleString("en-IN")}</span>
                <span className="listing-seller">by {phone.sellerName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
