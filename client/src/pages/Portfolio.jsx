import React from "react";
import { NavLink } from "react-router-dom";
import "./Portfolio.css";
import portfolioImg from "../assets/portfolio.jpg";
import sample1 from "../assets/sample1.jpg";
import sample2 from "../assets/sample2.jpg";
import sample3 from "../assets/sample3.jpg";

const Portfolio = () => {
  // Mock podaci – kasnije ovo dolazi iz API-ja.
  // Korisnici koji su isPublic = true će biti prikazani na javnoj "Portfolio" stranici.
  const mockPortfolios = [
    {
      id: 1,
      name: "David Martinović",
      username: "projectd850",
      isPublic: true,
      cover: sample1,
      title: "Street & Portrait"
    },
    {
      id: 2,
      name: "Nikola J.",
      username: "nikolaphoto",
      isPublic: true,
      cover: sample2,
      title: "Urban Shadows"
    },
    {
      id: 3,
      name: "Marko L.",
      username: "markolens",
      isPublic: false, // privatni portfolio – NE prikazuje se na javnoj listi
      cover: sample3,
      title: "Quiet Streets"
    }
  ];

  const publicPortfolios = mockPortfolios.filter(p => p.isPublic);

  return (
    <main className="portfolio-section" aria-label="Portfolio section">
      {/* HERO: puna širina, strelica seče dno */}
      <section className="portfolio-left" aria-label="Hero image">
        <div className="image-container">
          <img
            src={portfolioImg}
            alt="Featured visual"
            loading="lazy"
            decoding="async"
            width="1600"
            height="900"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/1600x900?text=Image+Unavailable";
            }}
          />
        </div>
      </section>

      {/* Lista javnih korisničkih portfolija ispod hero sekcije */}
      <section className="portfolio-right" aria-label="Public portfolios list">
        <h1 className="portfolio-title">Public Portfolios</h1>
        <p className="portfolio-description">
          Explore public portfolios from creators on ProjectD850. Users choose whether their
          portfolio is visible here; only public profiles are listed.
        </p>

        <div className="gallery-grid" role="list">
          {publicPortfolios.map((item) => (
            <NavLink
              to={`/portfolio/${item.username}`}
              className="gallery-item"
              role="listitem"
              key={item.id}
              title={`${item.name} (@${item.username})`}
            >
              <img
                src={item.cover}
                alt={`${item.name} portfolio cover`}
                loading="lazy"
                decoding="async"
                width="300"
                height="200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x200?text=Image+Error";
                }}
              />
              <div className="overlay">
                {item.name} – {item.title}
              </div>
            </NavLink>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Portfolio;
