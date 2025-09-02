import React from "react";
import { NavLink } from "react-router-dom";
import "./About.css";
import aboutImg from "../assets/portfolio.jpg";

const About = () => {
  return (
    <main className="about" aria-label="About ProjectD850">
      {/* VARIJANTE:
         - image-right + .clip-arrow-left (default)
         - image-left  + .clip-arrow-right
         - image-right + .clip-notched
      */}
      <section className="about__hero image-right">
        {/* dekorativna slika → alt="" + aria-hidden */}
        <div className="about__media clip-arrow-left" aria-hidden="true">
          <img
            src={aboutImg}
            alt=""
            loading="lazy"
            decoding="async"
            sizes="(max-width: 980px) 100vw, 50vw"
            width="1600"
            height="1000"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://via.placeholder.com/1600x1000?text=Image+Unavailable";
            }}
          />
        </div>

        <div className="about__text">
          <h1 className="about__title">About ProjectD850</h1>
          <p className="about__lead">
            ProjectD850 je hub za fotografe i ljubitelje fotografije: javni portfoliji,
            booking, marketplace za digital/print radove i zajednica za učenje i saradnju.
          </p>

          <ul className="about__bullets">
            <li>Javni ili privatni portfoliji – izbor je tvoj.</li>
            <li>Direktan booking fotografa iz profila.</li>
            <li>Marketplace za digitalne fajlove i štampu.</li>
          </ul>

          <div className="about__cta">
            <NavLink to="/portfolio" className="btn btn--primary" aria-label="Explore portfolios">
              Explore Portfolios
            </NavLink>
            <NavLink to="/signup" className="btn btn--outline" aria-label="Create account">
              Create Account
            </NavLink>
          </div>
        </div>
      </section>

      <section className="about__values" aria-label="What we offer">
        <article className="value">
          <h3>Creator-first</h3>
          <p>Kontrolišeš vidljivost, cene i prezentaciju svog rada.</p>
        </article>
        <article className="value">
          <h3>Seamless booking</h3>
          <p>Jedan klik do upita za fotkanje – jasno i brzo.</p>
        </article>
        <article className="value">
          <h3>Learn & grow</h3>
          <p>Tutorijali, članci i zajednica – sve na jednom mestu.</p>
        </article>
      </section>
    </main>
  );
};

export default About;
