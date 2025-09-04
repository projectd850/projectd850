import React, { useMemo, useState } from "react";
import "./Signup.css";
import signupImg from "../assets/signup.jpg";
import { Link, useNavigate } from "react-router-dom";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Signup = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // form state (controlled inputs)
  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    accept: false,      // terms checkbox
    invite: "",         // optional invite/ref code if ikad zatreba
  });

  const [showPwd, setShowPwd]   = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [loading, setLoading]   = useState(false);

  // global/top message
  const [msg, setMsg] = useState(null); // { type:'success'|'error', text:string }

  // per-field errors
  const [errors, setErrors] = useState({}); // { name?:string, email?:string, ... }

  // very-light password scoring (0–4)
  const pwdScore = useMemo(() => {
    const { password } = fields;
    let score = 0;
    if (!password) return 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  }, [fields.password]);

  const pwdLevel = ["Very weak", "Weak", "Okay", "Good", "Strong"][pwdScore];

  const updateField = (key) => (e) => {
    const value = key === "accept" ? e.target.checked : e.target.value;
    setFields((s) => ({ ...s, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined })); // clear inline error on change
    setMsg(null);
  };

  // client-side validation
  const validate = () => {
    const e = {};
    if (!fields.name.trim() || fields.name.trim().length < 2) {
      e.name = "Name must be at least 2 characters.";
    }
    if (!emailRegex.test(fields.email.trim())) {
      e.email = "Please enter a valid email address.";
    }
    if (fields.password.length < 8) {
      e.password = "Use at least 8 characters.";
    }
    if (fields.confirm !== fields.password) {
      e.confirm = "Passwords do not match.";
    }
    if (!fields.accept) {
      e.accept = "You must accept the Terms.";
    }
    return e;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg(null);

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          password: fields.password,
          // invite: fields.invite || undefined, // ako backend podržava
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMsg({ type: "success", text: data.message || "Account created successfully." });
        // kratka pauza radi UX-a pa redirect
        setTimeout(() => navigate("/login"), 1000);
      } else {
        // prikaži serversku grešku, eventualno mapiraj na polje ako backend šalje kod
        setMsg({ type: "error", text: data.message || "Signup failed. Please try again." });
      }
    } catch {
      setMsg({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup" aria-label="Signup page">
      {/* Dekorativna slika (lazy + fallback) */}
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
        <div className="signup__card fade-in" role="form" aria-labelledby="signup-title">
          <h1 id="signup-title" className="signup__title">Create Account</h1>
          <p className="signup__subtitle">Join the Project Focus community</p>

          {msg && (
            <p className={`signup__msg ${msg.type}`} role="alert" aria-live="assertive">
              {msg.text}
            </p>
          )}

          {/* Social auth (placeholder – samo UI) */}
          <div className="oauth">
            <button type="button" className="oauth__btn" disabled={loading} onClick={() => setMsg({ type: "error", text: "Google sign-in is not configured yet." })}>
              <span className="oauth__icon" aria-hidden>G</span>
              Continue with Google
            </button>
          </div>

          <div className="divider" role="separator" aria-label="or">or</div>

          <form className="signup__form" onSubmit={handleSignup} noValidate>
            {/* Name */}
            <label className="vh" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              required
              minLength={2}
              autoComplete="name"
              value={fields.name}
              onChange={updateField("name")}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-err" : undefined}
            />
            {errors.name && <small id="name-err" className="field-error">{errors.name}</small>}

            {/* Email */}
            <label className="vh" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              autoComplete="email"
              inputMode="email"
              value={fields.email}
              onChange={updateField("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-err" : undefined}
            />
            {errors.email && <small id="email-err" className="field-error">{errors.email}</small>}

            {/* Password */}
            <div className="pwd-field">
              <label className="vh" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type={showPwd ? "text" : "password"}
                placeholder="Password"
                required
                minLength={8}
                autoComplete="new-password"
                value={fields.password}
                onChange={updateField("password")}
                aria-invalid={!!errors.password}
                aria-describedby={`pwd-help ${errors.password ? "pwd-err" : ""}`.trim()}
              />
              <button
                type="button"
                className="toggle-pwd"
                aria-label={showPwd ? "Hide password" : "Show password"}
                onClick={() => setShowPwd((v) => !v)}
              >
                {showPwd ? "Hide" : "Show"}
              </button>

              {/* Password meter */}
              <div className="pwd-meter" aria-live="polite">
                <div className={`pwd-meter__bar s${pwdScore}`} />
                <span className="pwd-meter__label">{pwdLevel}</span>
              </div>

              {/* Quick rules checklist */}
              <ul id="pwd-help" className="pwd-rules">
                <li className={fields.password.length >= 8 ? "ok" : ""}>Min 8 characters</li>
                <li className={/[A-Z]/.test(fields.password) && /[a-z]/.test(fields.password) ? "ok" : ""}>Upper & lower case</li>
                <li className={/\d/.test(fields.password) ? "ok" : ""}>At least one number</li>
                <li className={/[^A-Za-z0-9]/.test(fields.password) ? "ok" : ""}>At least one symbol</li>
              </ul>
              {errors.password && <small id="pwd-err" className="field-error">{errors.password}</small>}
            </div>

            {/* Confirm */}
            <div className="pwd-field">
              <label className="vh" htmlFor="confirm">Confirm Password</label>
              <input
                id="confirm"
                name="confirm"
                type={showPwd2 ? "text" : "password"}
                placeholder="Confirm Password"
                required
                minLength={8}
                autoComplete="new-password"
                value={fields.confirm}
                onChange={updateField("confirm")}
                aria-invalid={!!errors.confirm}
                aria-describedby={errors.confirm ? "confirm-err" : undefined}
              />
              <button
                type="button"
                className="toggle-pwd"
                aria-label={showPwd2 ? "Hide password" : "Show password"}
                onClick={() => setShowPwd2((v) => !v)}
              >
                {showPwd2 ? "Hide" : "Show"}
              </button>
              {errors.confirm && <small id="confirm-err" className="field-error">{errors.confirm}</small>}
            </div>

            {/* Optional invite/ref code */}
            <label className="vh" htmlFor="invite">Invite/Ref Code (optional)</label>
            <input
              id="invite"
              name="invite"
              type="text"
              placeholder="Invite/Ref Code (optional)"
              autoComplete="one-time-code"
              value={fields.invite}
              onChange={updateField("invite")}
            />

            {/* Terms */}
            <label className="accept">
              <input
                type="checkbox"
                name="accept"
                checked={fields.accept}
                onChange={updateField("accept")}
                aria-invalid={!!errors.accept}
                aria-describedby={errors.accept ? "accept-err" : undefined}
              />
              I agree to the <Link to="/terms" className="link">Terms</Link> and <Link to="/privacy" className="link">Privacy Policy</Link>.
            </label>
            {errors.accept && <small id="accept-err" className="field-error">{errors.accept}</small>}

            {/* Submit */}
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
