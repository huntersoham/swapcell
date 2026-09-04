import { useState } from "react";
import "./App.css";

const BRANDS = ["Apple", "Samsung", "OnePlus", "Xiaomi", "Realme", "Vivo", "Oppo", "Google"];

const STEPS = [
  {
    title: "Tell Us About Your Phone",
    desc: "Pick your brand and model, and answer a few quick condition questions.",
  },
  {
    title: "Get an Instant Quote",
    desc: "Our pricing engine gives you a fair, transparent quote in seconds.",
  },
  {
    title: "Free Doorstep Pickup",
    desc: "Schedule a free pickup at your convenience — no shipping hassle.",
  },
  {
    title: "Get Paid Instantly",
    desc: "Once your device is verified, get paid via UPI, bank transfer, or cash.",
  },
];

const TESTIMONIALS = [
  {
    name: "Ananya R.",
    text: "Sold my old phone in under 10 minutes. Pickup was on time and payment was instant.",
  },
  {
    name: "Rohit K.",
    text: "Best quote I found compared to other resale apps. Super smooth process.",
  },
  {
    name: "Meera S.",
    text: "No haggling, no hidden charges. Exactly what they quoted is what I got.",
  },
];

export default function App() {
  const [form, setForm] = useState({ name: "", phone: "", brand: "", model: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus({ state: "success", message: data.message });
      setForm({ name: "", phone: "", brand: "", model: "" });
    } catch (err) {
      // No backend reachable (e.g. static hosting like GitHub Pages) —
      // fall back to a simulated confirmation so the demo still works.
      setStatus({
        state: "success",
        message: "Thanks! (Demo mode — no live backend on this deployment. Run the Express server locally for real submissions.)",
      });
      setForm({ name: "", phone: "", brand: "", model: "" });
    }
  };

  return (
    <div className="page">
      <header className="navbar">
        <div className="logo">SwapCell</div>
        <nav>
          <a href="#how-it-works">How It Works</a>
          <a href="#brands">Brands</a>
          <a href="#quote">Get Quote</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-text">
          <h1>Sell Your Old Phone. Get the Best Price, Instantly.</h1>
          <p>
            SwapCell gives you fair, transparent quotes for your used smartphones,
            with free doorstep pickup and instant payment.
          </p>
          <a href="#quote" className="cta-btn">
            Get My Free Quote
          </a>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="phone-mock">
            <div className="phone-screen">₹</div>
          </div>
        </div>
      </section>

      <section id="brands" className="brands">
        <h2>We Buy All Major Brands</h2>
        <div className="brand-grid">
          {BRANDS.map((b) => (
            <span key={b} className="brand-chip">
              {b}
            </span>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <h2>How SwapCell Works</h2>
        <div className="steps-grid">
          {STEPS.map((step, i) => (
            <div className="step-card" key={step.title}>
              <div className="step-number">{i + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="quote" className="quote-section">
        <h2>Get Your Free Quote</h2>
        <p className="quote-sub">Fill in your details and our team will get back to you shortly.</p>
        <form className="quote-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />
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
            placeholder="Model (e.g. iPhone 13, Galaxy S22)"
            value={form.model}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={status.state === "loading"}>
            {status.state === "loading" ? "Submitting..." : "Get My Quote"}
          </button>
        </form>
        {status.state === "success" && <p className="status success">{status.message}</p>}
        {status.state === "error" && <p className="status error">{status.message}</p>}
      </section>

      <section className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-grid">
          {TESTIMONIALS.map((t) => (
            <div className="testimonial-card" key={t.name}>
              <p>"{t.text}"</p>
              <span>— {t.name}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} SwapCell. All rights reserved.</p>
        <p className="footer-note">Built with React &amp; Node/Express.</p>
      </footer>
    </div>
  );
}
