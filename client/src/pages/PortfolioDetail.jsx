import React, { useMemo } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import sample1 from "../assets/sample1.jpg";
import sample2 from "../assets/sample2.jpg";
import sample3 from "../assets/sample3.jpg";

const PortfolioDetail = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  // Mock podaci – kasnije iz API-ja
  const mockPortfolios = [
    { id: 1, name: "David Martinović", username: "projectd850", isPublic: true,  cover: sample1, title: "Street & Portrait", location: "Prague / Beroun", tags: ["Street","Portrait","Couples"], works: [sample1, sample2, sample3], rating: 4.9 },
    { id: 2, name: "Nikola J.",        username: "nikolaphoto", isPublic: true, cover: sample2, title: "Urban Shadows",      location: "Prague",          tags: ["Urban","Moody"],           works: [sample2, sample1], rating: 4.7 },
    { id: 3, name: "Marko L.",         username: "markolens",   isPublic: false,cover: sample3, title: "Quiet Streets",      location: "Plzeň",           tags: ["Street"],                  works: [sample3], rating: 0 },
  ];

  const profile = useMemo(
    () => mockPortfolios.find(p => p.username === username),
    [username]
  );

  if (!profile || !profile.isPublic) {
    return (
      <main style={{ minHeight: "60vh", background: "#fdf6e3", padding: 32 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "#800020", color: "#fff", border: "none", borderRadius: 6, padding: "8px 12px", cursor: "pointer" }}
        >
          ← Back
        </button>
        <h1 style={{ marginTop: 16 }}>Portfolio not found</h1>
        <p>Requested profile is unavailable or private.</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#fdf6e3", padding: 32 }}>
      <button
        onClick={() => navigate(-1)}
        style={{ background: "#800020", color: "#fff", border: "none", borderRadius: 6, padding: "8px 12px", cursor: "pointer" }}
      >
        ← Back
      </button>

      <header style={{ marginTop: 16, marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>{profile.name} (@{profile.username})</h1>
        <p style={{ color: "#333", margin: "6px 0" }}>{profile.title} • {profile.location}</p>
        {profile.rating ? <p style={{ margin: 0 }}>★ {profile.rating.toFixed(1)}</p> : null}
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {profile.tags.map((t,i) => (
            <span key={i} style={{ fontSize: 12, padding: "4px 8px", borderRadius: 999, background: "#f0e6d6", color: "#333" }}>{t}</span>
          ))}
        </div>

        <NavLink
          to={`/portfolio/${profile.username}/book`}
          style={{
            display: "inline-block",
            marginTop: 16,
            background: "#800020",
            color: "#fff",
            borderRadius: 6,
            padding: "10px 14px",
            textDecoration: "none",
            fontWeight: 600
          }}
        >
          Book Photographer
        </NavLink>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16
        }}
      >
        {profile.works.map((img, i) => (
          <div key={i} style={{ position: "relative", borderRadius: 8, overflow: "hidden" }}>
            <img
              src={img}
              alt={`${profile.username}-work-${i + 1}`}
              loading="lazy"
              decoding="async"
              width="600"
              height="400"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .4s ease" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/600x400?text=Image+Error";
              }}
            />
          </div>
        ))}
      </section>
    </main>
  );
};

export default PortfolioDetail;
