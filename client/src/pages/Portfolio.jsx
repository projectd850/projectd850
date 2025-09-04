import React from "react";
import { NavLink } from "react-router-dom";
import "./Portfolio.css";
import portfolioImg from "../assets/portfolio.jpg";
import sample1 from "../assets/sample1.jpg";
import sample2 from "../assets/sample2.jpg";
import sample3 from "../assets/sample3.jpg";

const Portfolio = () => {
  const mockPortfolios = [
    { id: 1, name: "David Martinović", username: "projectd850", isPublic: true,  cover: sample1, title: "Street & Portrait" },
    { id: 2, name: "Nikola J.",        username: "nikolaphoto", isPublic: true,  cover: sample2, title: "Urban Shadows" },
    { id: 3, name: "Marko L.",         username: "markolens",   isPublic: false, cover: sample3, title: "Quiet Streets" }
  ];

  const publicPortfolios = mockPortfolios.filter(p => p.isPublic);

  return (
    <main className="portfolio-section" aria-label="Portfolio section">
      {/* HERO */}
      <section className="portfolio-left" aria-label="Hero image">
        <div className="image-container">
          <img
            src={portfolioImg}
            alt="Featured visual"
            loading="lazy"
            decoding="async"
            sizes="100vw"
            width="1600"
            height="1000" /* 16:10 to prevent CLS */
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://via.placeholder.com/1600x1000?text=Image+Unavailable";
            }}
          />
        </div>
      </section>

      {/* LIST */}
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
              aria-label={`${item.name} – ${item.title}`}
            >
              <figure>
                <img
                  src={item.cover}
                  alt={`${item.name} portfolio cover`}
                  loading="lazy"
                  decoding="async"
                  /* cards: ~100vw per column on mobile, ~33–50vw on desktop */
                  sizes="(max-width: 480px) 100vw, (max-width: 980px) 50vw, 33vw"
                  width="600"
                  height="375" /* 16:10 for consistency */
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://via.placeholder.com/600x375?text=Image+Error";
                  }}
                />
                <figcaption className="overlay">
                  {item.name} – {item.title}
                </figcaption>
              </figure>
            </NavLink>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Portfolio;
