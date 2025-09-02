import React, { useState } from "react";
import "./Signup.css";
import signupImg from "../assets/signup.jpg";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // { type: "success" | "error", text: string }
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const form = e.currentTarget;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirm = form.confirm.value;

    // brza client-side validacija
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name.length < 2) {
      setMsg({ type: "error", text: "Name must be at least 2 characters." });
      setLoading(false); return;
    }
    if (!emailRegex.test(email)) {
      setMsg({ type: "error", text: "Please enter a valid email address." });
      setLoading(false); return;
    }
    if (password.length < 6) {
      setMsg({ type: "error", text: "Password must be at least 6 characters." });
      setLoading(false); return;
    }
    if (password !== confirm) {
      setMsg({ type: "error", text: "Passwords do not match." });
      setLoading(false); return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMsg({ type: "success", text: data.message || "Account created successfully." });
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setMsg({ type: "error", text: data.message || "Signup failed. Please try again." });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup" aria-label="Signup page">
      {/* Slika (dekorativna) */}
      <section className="signup__left" aria-hidden="true">
        <div className="signup__imageWrap">
          <img
            src={signupImg}
            alt=""
            loading="lazy"
            decoding="async"
            sizes="(max-width: 900px) 100vw, 50vw"
            width="1200"
            height="1600"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://via.placeholder.com/1200x1600?text=Image+Unavailable";
            }}
          />
        </div>
      </section>

      {/* Forma */}
      <section className="signup__right">
        <div className="signup__card fade-in">
          <h1 className="signup__title">Create Account</h1>
          <p className="signup__subtitle">Join the Project Focus community</p>

          {msg && (
            <p
              className={`signup__msg ${msg.type}`}
              role="alert"
              aria-live="assertive"
            >
              {msg.text}
            </p>
          )}

          <form className="signup__form" onSubmit={handleSignup} noValidate>
            <label className="vh" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              required
              minLength={2}
              autoComplete="name"
            />

            <label className="vh" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              autoComplete="email"
              inputMode="email"
            />

            <div className="pwd-field">
              <label className="vh" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type={showPwd ? "text" : "password"}
                placeholder="Password"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-pwd"
                aria-label={showPwd ? "Hide password" : "Show password"}
                onClick={() => setShowPwd((v) => !v)}
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>

            <div className="pwd-field">
              <label className="vh" htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm"
                name="confirm"
                type={showPwd2 ? "text" : "password"}
                placeholder="Confirm Password"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-pwd"
                aria-label={showPwd2 ? "Hide password" : "Show password"}
                onClick={() => setShowPwd2((v) => !v)}
              >
                {showPwd2 ? "Hide" : "Show"}
              </button>
            </div>

            <button type="submit" disabled={loading} aria-busy={loading}>
              {loading ? "Creating…" : "Sign Up"}
            </button>
          </form>

          <p className="signup__linkText">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Signup;
