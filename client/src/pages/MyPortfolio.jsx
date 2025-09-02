// pages/MyPortfolio.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import "./MyPortfolio.css";

// Demo podaci – zamenjujes svojim (ili kasnije iz API-ja)
import sample1 from "../assets/sample1.jpg";
import sample2 from "../assets/sample2.jpg";
import sample3 from "../assets/sample3.jpg";

const ALL_IMAGES = [
  { id: 1,  src: sample1, title: "Old Town Glow",     category: "Cityscapes",  location: "Prague" },
  { id: 2,  src: sample2, title: "Quiet Street Look", category: "Portraits",   location: "Beroun" },
  { id: 3,  src: sample3, title: "Bridges at Dusk",   category: "Cityscapes",  location: "Prague" },
  { id: 4,  src: sample2, title: "Moody Alley",       category: "Street",      location: "Prague" },
  { id: 5,  src: sample1, title: "Candid Smile",      category: "Portraits",   location: "Prague" },
  { id: 6,  src: sample3, title: "Letná Skyline",     category: "Cityscapes",  location: "Prague" },
  { id: 7,  src: sample2, title: "Golden Hour",       category: "Portraits",   location: "Beroun" },
  { id: 8,  src: sample1, title: "Cobblestone Walk",  category: "Street",      location: "Prague" },
];

const CATEGORIES = ["All", "Portraits", "Cityscapes", "Street"];

const MyPortfolio = () => {
  const [activeCat, setActiveCat] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null); // za lightbox
  const [lockScroll, setLockScroll] = useState(false);

  // Filtriranje po kategoriji i pretrazi
  const filtered = useMemo(() => {
    const byCat = activeCat === "All"
      ? ALL_IMAGES
      : ALL_IMAGES.filter(i => i.category === activeCat);
    const q = query.trim().toLowerCase();
    return q
      ? byCat.filter(i =>
          i.title.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
        )
      : byCat;
  }, [activeCat, query]);

  // Lightbox: zaključavanje scroll-a pozadine
  useEffect(() => {
    if (lockScroll) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [lockScroll]);

  const openLightbox = useCallback((index) => {
    setSelectedIndex(index);
    setLockScroll(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    setLockScroll(false);
  }, []);

  const showPrev = useCallback((e) => {
    e?.stopPropagation();
    setSelectedIndex((idx) => (idx === null ? null : (idx - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  const showNext = useCallback((e) => {
    e?.stopPropagation();
    setSelectedIndex((idx) => (idx === null ? null : (idx + 1) % filtered.length));
  }, [filtered.length]);

  // Tastatura: Esc/Left/Right
  useEffect(() => {
    const onKey = (e) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, closeLightbox, showPrev, showNext]);

  return (
    <main className="my-portfolio-page">

      {/* HERO */}
      <section className="my-portfolio-hero" role="banner" aria-label="Hero">
        <div className="hero-inner">
          <h1 className="hero-title">My Portfolio</h1>
          <p className="hero-subtitle">
            ProjectD850 — portraits, street & Prague cityscapes.
          </p>

          <div className="hero-cta">
            <a href="/contact" className="btn-primary">Contact / Booking</a>
            <a href="/portfolio/projectd850" className="btn-outline">Public profile</a>
          </div>
        </div>
        <div className="hero-cut" aria-hidden="true" />
      </section>

      {/* TOOLS: filteri + search */}
      <section className="portfolio-tools" aria-label="Filters and search">
        <div className="filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`chip ${activeCat === cat ? "active" : ""}`}
              onClick={() => setActiveCat(cat)}
              aria-pressed={activeCat === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search">
          <input
            type="search"
            placeholder="Search: title / location / category"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search photos by text"
          />
        </div>
      </section>

      {/* GRID / GALLERY */}
      <section className="portfolio-grid" aria-label="Gallery">
        {filtered.length === 0 && (
          <div className="empty-state">
            <p>No results for your filter.</p>
          </div>
        )}

        {filtered.map((img, i) => (
          <figure
            key={img.id}
            className="grid-item"
            onClick={() => openLightbox(i)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") openLightbox(i);
            }}
            aria-label={`Open ${img.title} in full view`}
          >
            <img
              src={img.src}
              alt={`${img.title} — ${img.location}`}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="grid-caption">
              <span className="cap-title">{img.title}</span>
              <span className="cap-meta">{img.category} • {img.location}</span>
            </figcaption>
          </figure>
        ))}
      </section>

      {/* LIGHTBOX */}
      {selectedIndex !== null && (
        <div className="lightbox" onClick={closeLightbox} role="dialog" aria-modal="true">
          <button className="close" onClick={closeLightbox} aria-label="Close">×</button>
          <button className="nav prev" onClick={showPrev} aria-label="Previous">‹</button>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <img
              src={filtered[selectedIndex].src}
              alt={`${filtered[selectedIndex].title} — ${filtered[selectedIndex].location}`}
            />
            <div className="lb-caption">
              <strong>{filtered[selectedIndex].title}</strong>
              <span>{filtered[selectedIndex].category} • {filtered[selectedIndex].location}</span>
            </div>
          </div>
          <button className="nav next" onClick={showNext} aria-label="Next">›</button>
        </div>
      )}

      {/* ABOUT / STORY */}
      <section className="portfolio-about">
        <h2>About the work</h2>
        <p>
          I document authentic moments around Prague and Central Bohemia — a blend of
          street candids, expressive portraits, and cityscapes. Each frame is crafted
          to preserve mood and place, without heavy retouching.
        </p>
        <a href="/contact" className="btn-primary">Request a session</a>
      </section>
    </main>
  );
};

export default MyPortfolio;
