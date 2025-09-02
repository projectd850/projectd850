import React from "react";
import "./Home.css";
import heroImg from "../assets/hero.jpg";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="hero" aria-label="Intro section">
      <div className="hero__left">
        <h1 className="hero__title">Project D850</h1>
        <h2 className="hero__subtitle">Photography Portfolio</h2>
        <p className="hero__desc">
          Discover the world through my lens. Each photo tells a story of light, emotion, and beauty.
        </p>

        <Link to="/portfolio" className="btn btn--primary" aria-label="Open portfolio">
          View Portfolio
        </Link>
      </div>

      <div className="hero__right">
        <div className="hero__imageWrap">
          <img
            src={heroImg}
            alt="Photographer with camera"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://via.placeholder.com/1200x1600?text=Photo+Unavailable";
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
