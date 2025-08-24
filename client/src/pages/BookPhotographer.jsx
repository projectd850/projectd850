import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const field = {
  label: { display: "block", marginBottom: 6, fontWeight: 600, color: "#333" },
  input: {
    width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #ddd",
    outline: "none", background: "#fff"
  }
};

const BookPhotographer = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    date: "",
    time: "",
    shootType: "Portrait",
    duration: 1,
    budget: "",
    message: ""
  });

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: POST /api/bookings
    console.log("Booking request for", username, form);
    setSent(true);
  };

  if (sent) {
    return (
      <main style={{ minHeight: "60vh", background: "#fdf6e3", padding: 32 }}>
        <h1>Request sent ✅</h1>
        <p>We’ve sent your request to @{username}. Expect a reply by email.</p>
        <button
          onClick={() => navigate(`/portfolio/${username}`)}
          style={{ background: "#800020", color: "#fff", border: "none", borderRadius: 6, padding: "8px 12px", cursor: "pointer" }}
        >
          ← Back to portfolio
        </button>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#fdf6e3", padding: 32 }}>
      <button
        onClick={() => navigate(-1)}
        style={{ background: "#800020", color: "#fff", border: "none", borderRadius: 6, padding: "8px 12px", cursor: "pointer" }}
      >
        ← Back
      </button>

      <h1 style={{ marginTop: 16 }}>Book @{username}</h1>
      <p style={{ color: "#333" }}>Tell the photographer what you need. They’ll reply with details and a quote.</p>

      <form onSubmit={onSubmit} style={{ maxWidth: 720, marginTop: 16, display: "grid", gap: 16 }}>
        <div>
          <label style={field.label} htmlFor="fullName">Full name</label>
          <input style={field.input} id="fullName" name="fullName" required value={form.fullName} onChange={onChange} />
        </div>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <label style={field.label} htmlFor="email">Email</label>
            <input style={field.input} id="email" name="email" type="email" required value={form.email} onChange={onChange} />
          </div>
          <div>
            <label style={field.label} htmlFor="phone">Phone</label>
            <input style={field.input} id="phone" name="phone" type="tel" value={form.phone} onChange={onChange} />
          </div>
        </div>

        <div>
          <label style={field.label} htmlFor="location">Shoot location (city/spot)</label>
          <input style={field.input} id="location" name="location" required value={form.location} onChange={onChange} placeholder="Prague – Old Town, Vyšehrad..." />
        </div>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <label style={field.label} htmlFor="date">Preferred date</label>
            <input style={field.input} id="date" name="date" type="date" required value={form.date} onChange={onChange} />
          </div>
          <div>
            <label style={field.label} htmlFor="time">Preferred time</label>
            <input style={field.input} id="time" name="time" type="time" required value={form.time} onChange={onChange} />
          </div>
        </div>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr 1fr" }}>
          <div>
            <label style={field.label} htmlFor="shootType">Shoot type</label>
            <select style={field.input} id="shootType" name="shootType" value={form.shootType} onChange={onChange}>
              <option>Portrait</option>
              <option>Couple</option>
              <option>Family</option>
              <option>Street</option>
              <option>Event</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label style={field.label} htmlFor="duration">Duration (h)</label>
            <input style={field.input} id="duration" name="duration" type="number" min="1" max="12" value={form.duration} onChange={onChange} />
          </div>
          <div>
            <label style={field.label} htmlFor="budget">Budget (EUR/CZK)</label>
            <input style={field.input} id="budget" name="budget" type="text" value={form.budget} onChange={onChange} placeholder="e.g. 2000 CZK" />
          </div>
        </div>

        <div>
          <label style={field.label} htmlFor="message">Message</label>
          <textarea
            style={{ ...field.input, minHeight: 120, resize: "vertical" }}
            id="message"
            name="message"
            placeholder="Tell more about your idea, style, references..."
            value={form.message}
            onChange={onChange}
          />
        </div>

        <div>
          <button
            type="submit"
            style={{
              background: "#800020", color: "#fff", border: "none",
              borderRadius: 6, padding: "10px 16px", cursor: "pointer", fontWeight: 600
            }}
          >
            Send request
          </button>
        </div>
      </form>
    </main>
  );
};

export default BookPhotographer;
