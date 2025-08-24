import React, { useState } from "react";
import "./Login.css";
import loginImg from "../assets/login.jpg";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Prosta validacija emaila
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        credentials: "include", // za HTTP Only cookie
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/loginsuccess");
      } else {
        setErrorMsg(data.message || "Login failed.");
      }
    } catch (err) {
      setErrorMsg("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-section">
      <div className="login-left">
        <div className="login-form fade-in">
          <h2>Welcome Back</h2>
          <p>Please login to your account</p>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          {errorMsg && <p className="error-msg">{errorMsg}</p>}
          <p className="login-link-text">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-image-container">
          <img src={loginImg} alt="Login Visual" />
        </div>
      </div>
    </div>
  );
};

export default Login;
