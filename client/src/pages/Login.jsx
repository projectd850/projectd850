import React, { useEffect, useMemo, useState } from "react";
import "./Login.css";
import loginImg from "../assets/login.jpg";
import { Link, useNavigate } from "react-router-dom";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [fields, setFields] = useState({
    email: "",
    password: "",
    remember: true, // pamti email na ovom uređaju
  });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState(null); // {type:'error'|'success', text:string}
  const [showPwd, setShowPwd] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [loading, setLoading] = useState(false);

  // učitaj zapamćen email
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pf_login_email");
      if (saved) setFields((s) => ({ ...s, email: saved, remember: true }));
    } catch {}
  }, []);

  const updateField = (key) => (e) => {
    const value = key === "remember" ? e.target.checked : e.target.value;
    setFields((s) => ({ ...s, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setMsg(null);
  };

  const validate = () => {
    const e = {};
    if (!emailRegex.test(fields.email.trim())) e.email = "Please enter a valid email address.";
    if (fields.password.length < 6) e.password = "Password must be at least 6 characters.";
    return e;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg(null);

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include", // HTTP-Only cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fields.email.trim(), password: fields.password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // zapamti email ako je čekirano
        try {
          if (fields.remember) localStorage.setItem("pf_login_email", fields.email.trim());
          else localStorage.removeItem("pf_login_email");
        } catch {}
        navigate("/loginsuccess");
      } else {
        if (res.status === 401) setMsg({ type: "error", text: data.message || "Invalid email or password." });
        else if (res.status === 429) setMsg({ type: "error", text: data.message || "Too many attempts. Try again later." });
        else setMsg({ type: "error", text: data.message || "Login failed. Please try again." });
      }
    } catch {
      setMsg({ type: "error", text: "Server error. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  const pwdHint = useMemo(() => {
    if (!fields.password) return "";
    if (fields.password.length < 6) return "Tip: use at least 6 characters.";
    return "";
  }, [fields.password]);

  return (
    <main className="login" aria-label="Login page">
      {/* Forma */}
      <section className="login__left">
        <div className="login__card fade-in" role="form" aria-labelledby="login-title">
          <h1 id="login-title" className="login__title">Welcome Back</h1>
          <p className="login__subtitle">Please login to your account</p>

          {msg && (
            <p className={`login__msg ${msg.type}`} role="alert" aria-live="assertive">
              {msg.text}
            </p>
          )}

          {/* Social auth (UI placeholder) */}
          <div className="oauth">
            <button
              type="button"
              className="oauth__btn"
              disabled={loading}
              onClick={() => setMsg({ type: "error", text: "Google sign-in is not configured yet." })}
            >
              <span className="oauth__icon" aria-hidden>G</span>
              Continue with Google
            </button>
          </div>

          <div className="divider" role="separator" aria-label="or">or</div>

          <form className="login__form" onSubmit={handleLogin} noValidate>
            {/* Email */}
            <label className="vh" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={fields.email}
              onChange={updateField("email")}
              required
              autoComplete="email"
              inputMode="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-err" : undefined}
            />
            {errors.email && <small id="email-err" className="field-error">{errors.email}</small>}

            {/* Password */}
            <div className="pwd-field">
              <label className="vh" htmlFor="password">Password</label>
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                placeholder="Password"
                value={fields.password}
                onChange={updateField("password")}
                required
                autoComplete="current-password"
                minLength={6}
                aria-invalid={!!errors.password}
                aria-describedby={`${errors.password ? "password-err " : ""}${pwdHint ? "password-hint" : ""}`.trim() || undefined}
                onKeyUp={(ev) => setCapsOn(ev.getModifierState && ev.getModifierState("CapsLock"))}
                onKeyDown={(ev) => setCapsOn(ev.getModifierState && ev.getModifierState("CapsLock"))}
              />
              <button
                type="button"
                className="toggle-pwd"
                aria-label={showPwd ? "Hide password" : "Show password"}
                onClick={() => setShowPwd((v) => !v)}
              >
                {showPwd ? "Hide" : "Show"}
              </button>

              {/* Caps Lock + hint + field error */}
              {capsOn && <small className="field-hint">Caps Lock is ON.</small>}
              {pwdHint && <small id="password-hint" className="field-hint">{pwdHint}</small>}
              {errors.password && <small id="password-err" className="field-error">{errors.password}</small>}
            </div>

            {/* Remember + Forgot */}
            <div className="login__row">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={fields.remember}
                  onChange={updateField("remember")}
                />
                Remember me
              </label>
              <Link to="/forgot" className="link">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} aria-busy={loading}>
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>

          <p className="login__linkText">
            Don&apos;t have an account? <Link to="/signup">Sign up</Link>
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
