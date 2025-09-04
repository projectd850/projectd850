import React from "react";
import "./Home.css";
import heroImg from "../assets/hero.jpg";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="hero" aria-label="Intro section">
      <div className="hero__left">
        <h1 id="hero-title" className="hero__title">Project D850</h1>
        <h2 className="hero__subtitle">Photography Portfolio</h2>
        <p className="hero__desc">
          Discover the world through my lens. Each photo tells a story of light, emotion, and beauty.
        </p>

        <Link
          to="/portfolio"
          className="btn btn--primary hero__cta"
          aria-label="Open portfolio"
        >
          View Portfolio
        </Link>
      </div>

      <div className="hero__right" aria-labelledby="hero-title">
        <div className="hero__imageWrap">
          <img
            src={heroImg}
            alt="Photographer holding a camera ready to shoot"
            loading="lazy"
            decoding="async"
            width="1600"
            height="1000"
            sizes="(max-width: 980px) 100vw, 50vw"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://via.placeholder.com/1600x1000?text=Photo+Unavailable";
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default Home;
