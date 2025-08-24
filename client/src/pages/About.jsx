import React from "react";
import { NavLink } from "react-router-dom";
import "./About.css";

// Ako nemaš posebnu sliku za About, koristi postojeću:
import aboutImg from "../assets/portfolio.jpg"; 

const About = () => {
  return (
    <main className="about-section" aria-label="About ProjectD850">
      {/* 
        VARIJANTE:
        - image-right + .clip-arrow-left  (default u nastavku)
        - image-left  + .clip-arrow-right
        - image-right + .clip-notched     (isečeni ćoškovi)
        Samo promeni klase ispod po želji.
      */}
      <section className="about-hero image-right">
        <div className="about-hero-media clip-arrow-left" aria-hidden="true">
          <img
            src={aboutImg}
            alt=""
            loading="lazy"
            decoding="async"
            width="1600"
            height="1000"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://via.placeholder.com/1600x1000?text=Image+Unavailable";
            }}
          />
        </div>

        <div className="about-hero-text">
          <h1 className="about-title">About ProjectD850</h1>
          <p className="about-lead">
            ProjectD850 je hub za fotografe i ljubitelje fotografije: javni portfoliji,
            booking fotografa, marketplace za digital/print radove i zajednica za učenje i saradnju.
          </p>

          <ul className="about-bullets">
            <li>Javni ili privatni portfoliji – izbor je tvoj.</li>
            <li>Direktan booking fotografa iz profila.</li>
            <li>Marketplace za digitalne fajlove i štampu.</li>
          </ul>

          <div className="about-cta">
            <NavLink to="/portfolio" className="btn-primary">Explore Portfolios</NavLink>
            <NavLink to="/signup" className="btn-outline">Create Account</NavLink>
          </div>
        </div>
      </section>

      <section className="about-values" aria-label="What we offer">
        <article className="value-card">
          <h3>Creator-first</h3>
          <p>Kontrolišeš vidljivost, cene i prezentaciju svog rada.</p>
        </article>
        <article className="value-card">
          <h3>Seamless booking</h3>
          <p>Jedan klik do upita za fotkanje – jasno i brzo.</p>
        </article>
        <article className="value-card">
          <h3>Learn & grow</h3>
          <p>Tutorijali, članci i zajednica – sve na jednom mestu.</p>
        </article>
      </section>
    </main>
  );
};

export default About;
