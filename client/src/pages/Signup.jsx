import React, { useState } from "react";
import "./Signup.css";
import signupImg from "../assets/signup.jpg";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (err) {
      console.error("Signup failed:", err);
      setMessage({ type: "error", text: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-section">
      <div className="signup-left">
        <div className="signup-image-container">
          <img src={signupImg} alt="Signup Visual" />
        </div>
      </div>

      <div className="signup-right">
        <div className="signup-form fade-in">
          <h2>Create Account</h2>
          <p>Join the Project Focus community</p>

          <form onSubmit={handleSignup}>
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          {message && (
            <p className={`signup-message ${message.type}`}>
              {message.text}
            </p>
          )}

          <p className="signup-link-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
