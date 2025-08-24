import React from "react";
import "./Home.css";
import heroImg from "../assets/hero.jpg";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="hero-section" aria-label="Hero section with introduction and photo">
      <div className="hero-left">
        <h1 className="hero-title flash">Project D850</h1>
        <h2 className="hero-subtitle">Photography Portfolio</h2>
        <p className="hero-description">
          Discover the world through my lens. Each photo tells a story of light, emotion, and beauty.
        </p>
        <Link to="/portfolio" className="cta-button">View Portfolio</Link>
      </div>

      <div className="hero-right">
        <div className="image-container">
          <img
            src={heroImg}
            alt="Photographer with camera"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/600x800?text=Photo+Unavailable";
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
