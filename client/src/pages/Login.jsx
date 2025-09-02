import React, { useState } from "react";
import "./Login.css";
import loginImg from "../assets/login.jpg";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // brza validacija
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include", // za HTTP‑Only cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      // Backend treba da vrati JSON { message?: string }
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        navigate("/loginsuccess");
      } else {
        // pokušaj uhvatiti tipične statuse
        if (res.status === 401) setErrorMsg(data.message || "Invalid email or password.");
        else if (res.status === 429) setErrorMsg(data.message || "Too many attempts. Try again later.");
        else setErrorMsg(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login" aria-label="Login page">
      {/* Forma */}
      <section className="login__left">
        <div className="login__card fade-in">
          <h1 className="login__title">Welcome Back</h1>
          <p className="login__subtitle">Please login to your account</p>

          {/* aria-live da čitač ekrana odmah pročita grešku */}
          {errorMsg && (
            <p className="login__error" role="alert" aria-live="assertive">
              {errorMsg}
            </p>
          )}

          <form className="login__form" onSubmit={handleLogin} noValidate>
            <label className="vh" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              inputMode="email"
            />

            <div className="pwd-field">
              <label className="vh" htmlFor="password">Password</label>
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                minLength={6}
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

            <button type="submit" disabled={loading} aria-busy={loading}>
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>

          <p className="login__linkText">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </section>

      {/* Slika */}
      <section className="login__right" aria-hidden="true">
        <div className="login__imageWrap">
          <img
            src={loginImg}
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
    </main>
  );
};

export default Login;
