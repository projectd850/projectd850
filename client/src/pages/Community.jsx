// pages/Community.jsx
import React, { useMemo, useState } from "react";
import "./Community.css";

import sample1 from "../assets/sample1.jpg";
import sample2 from "../assets/sample2.jpg";
import sample3 from "../assets/sample3.jpg";

const TABS = ["All", "Discussions", "Showcase", "Buy/Sell"];

const MOCK_POSTS = [
  {
    id: 1,
    type: "Showcase",
    title: "Prague Golden Hour — Charles Bridge",
    author: { name: "David Martinović", username: "projectd850" },
    createdAt: "2h ago",
    tags: ["Prague", "Cityscapes", "Nikon D850"],
    image: sample3,
    excerpt:
      "Testirao sam novi workflow: 50mm, f/2, ISO 200. Minimalan edit, fokus na atmosferu...",
    stats: { likes: 42, comments: 7, saves: 9 },
  },
  {
    id: 2,
    type: "Discussions",
    title: "Najbolji budget tripod za night city?",
    author: { name: "Nikola J.", username: "nikolaphoto" },
    createdAt: "5h ago",
    tags: ["Gear", "Tripod", "Night"],
    excerpt:
      "Tražim stabilan ali lagan stativ do 2 000 CZK. Šta preporučujete za dugi ekspoziciju?",
    stats: { likes: 18, comments: 12, saves: 3 },
  },
  {
    id: 3,
    type: "Buy/Sell",
    title: "PRODAJA: Nikkor 50mm f/1.8G",
    author: { name: "Marko L.", username: "markolens" },
    createdAt: "yesterday",
    tags: ["Marketplace", "Nikon"],
    excerpt:
      "Odlično stanje, bez prašine, sa kutijom. Cena 2 600 CZK. Moguća proba u Pragu.",
    stats: { likes: 9, comments: 4, saves: 6 },
  },
  {
    id: 4,
    type: "Showcase",
    title: "Street portrait — Beroun",
    author: { name: "David Martinović", username: "projectd850" },
    createdAt: "2d ago",
    tags: ["Street", "Portraits", "Beroun"],
    image: sample1,
    excerpt:
      "Brzi street portret, prirodno svetlo, mali dodir clarity-ja i HSL-a u koži.",
    stats: { likes: 55, comments: 10, saves: 12 },
  },
  {
    id: 5,
    type: "Discussions",
    title: "RAW vs HEIF na iPhone-u 16 Pro Max — vaše iskustvo?",
    author: { name: "Ana K.", username: "anak" },
    createdAt: "3d ago",
    tags: ["Mobile", "RAW"],
    excerpt:
      "Primeti li neko razliku u tonovima kože kod HEIF? Zanima me u odnosu na Lightroom Mobile.",
    stats: { likes: 11, comments: 5, saves: 2 },
  },
  {
    id: 6,
    type: "Showcase",
    title: "Letná Skyline — long exposure",
    author: { name: "Nikola J.", username: "nikolaphoto" },
    createdAt: "4d ago",
    tags: ["LongExposure", "Cityscapes"],
    image: sample2,
    excerpt:
      "ND8 filter, 20s, f/8. Savet: obavezno zatvarajte tražilo kod DSLR da ne pušta svetlo.",
    stats: { likes: 23, comments: 3, saves: 5 },
  },
];

const TOP_TAGS = [
  { tag: "Prague", count: 128 },
  { tag: "Portraits", count: 97 },
  { tag: "Street", count: 83 },
  { tag: "Gear", count: 74 },
  { tag: "Nikon D850", count: 69 },
];

const TOP_USERS = [
  { name: "projectd850", posts: 42 },
  { name: "nikolaphoto", posts: 31 },
  { name: "markolens", posts: 18 },
  { name: "anak", posts: 16 },
];

const Community = () => {
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [visible, setVisible] = useState(4); // Load more

  // filter + search
  const filtered = useMemo(() => {
    let list = [...MOCK_POSTS];

    if (tab !== "All") list = list.filter((p) => p.type === tab);
    if (selectedTag) list = list.filter((p) => p.tags.includes(selectedTag));

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.author.username.toLowerCase().includes(q)
      );
    }
    return list;
  }, [tab, query, selectedTag]);

  // minimalna forma za “Create post” (mock – ne šalje na backend)
  const [form, setForm] = useState({
    type: "Discussions",
    title: "",
    excerpt: "",
    tags: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    // u realnom slučaju ide POST ka API-ju
    const newPost = {
      id: Date.now(),
      type: form.type,
      title: form.title.trim(),
      author: { name: "David Martinović", username: "projectd850" },
      createdAt: "now",
      tags: form.tags
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      excerpt: form.excerpt.trim(),
      stats: { likes: 0, comments: 0, saves: 0 },
    };

    MOCK_POSTS.unshift(newPost); // mock: ubacimo na početak lokalnog niza
    setForm({ type: "Discussions", title: "", excerpt: "", tags: "" });
    setShowForm(false);
    setVisible(4);
    setTab("All");
    setQuery("");
    setSelectedTag(null);
  };

  return (
    <main className="community-page">
      {/* HERO */}
      <section className="community-hero" role="banner" aria-label="Community hero">
        <div className="hero-inner">
          <h1 className="hero-title">Community</h1>
          <p className="hero-subtitle">
            Poveži se sa fotografima — postuj radove, pitaj, prodaj/uzmi opremu.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
              {showForm ? "Close form" : "Create post"}
            </button>
            <a href="/my-portfolio" className="btn-outline">My Portfolio</a>
          </div>
        </div>
        <div className="hero-cut" aria-hidden="true" />
      </section>

      {/* TOOLS */}
      <section className="community-tools" aria-label="Filters and search">
        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="search">
          <input
            type="search"
            placeholder="Search posts, tags, users…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search community"
          />
        </div>
      </section>

      {/* LAYOUT: main + sidebar */}
      <section className="community-layout">
        <div className="community-main">
          {/* CREATE POST FORM */}
          {showForm && (
            <form className="create-post" onSubmit={onSubmit}>
              <div className="row">
                <label>
                  Type
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  >
                    <option>Discussions</option>
                    <option>Showcase</option>
                    <option>Buy/Sell</option>
                  </select>
                </label>
                <label className="grow">
                  Title
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Short, descriptive title"
                    required
                  />
                </label>
              </div>

              <label>
                Excerpt
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  placeholder="What’s your question, idea or description?"
                />
              </label>

              <label>
                Tags (comma separated)
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="e.g. Prague, Portraits, Gear"
                />
              </label>

              <div className="actions">
                <button type="submit" className="btn-primary">Publish</button>
                <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          )}

          {/* FEED */}
          <div className="feed">
            {filtered.slice(0, visible).map((p) => (
              <article key={p.id} className="post-card">
                <div className="post-head">
                  <span className={`badge ${p.type.replace("/", "-")}`}>{p.type}</span>
                  <h3 className="post-title">{p.title}</h3>
                </div>

                <div className="post-meta">
                  <span>by <strong>@{p.author.username}</strong></span>
                  <span>• {p.createdAt}</span>
                </div>

                {p.image && (
                  <div className="post-media">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                <p className="post-excerpt">{p.excerpt}</p>

                <div className="post-tags">
                  {p.tags.map((t) => (
                    <button
                      key={t}
                      className={`tag ${selectedTag === t ? "active" : ""}`}
                      onClick={() => setSelectedTag((old) => (old === t ? null : t))}
                      aria-pressed={selectedTag === t}
                    >
                      #{t}
                    </button>
                  ))}
                </div>

                <div className="post-stats">
                  <span>♥ {p.stats.likes}</span>
                  <span>💬 {p.stats.comments}</span>
                  <span>🔖 {p.stats.saves}</span>
                </div>
              </article>
            ))}

            {filtered.length > visible && (
              <div className="load-more">
                <button className="btn-outline-accent" onClick={() => setVisible((v) => v + 4)}>
                  Load more
                </button>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="empty-state">
                <p>No posts match your filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="community-side">
          <div className="side-card">
            <h4>Top Tags</h4>
            <div className="side-tags">
              {TOP_TAGS.map((t) => (
                <button
                  key={t.tag}
                  className={`tag ${selectedTag === t.tag ? "active" : ""}`}
                  onClick={() => setSelectedTag((old) => (old === t.tag ? null : t.tag))}
                >
                  #{t.tag} <span className="count">{t.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="side-card">
            <h4>Top Contributors</h4>
            <ul className="contributors">
              {TOP_USERS.map((u) => (
                <li key={u.name}>
                  <span className="avatar">{u.name[0].toUpperCase()}</span>
                  <div className="info">
                    <strong>@{u.name}</strong>
                    <small>{u.posts} posts</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="side-card cta">
            <p>Spremi se za sledeći photo-walk?</p>
            <a href="/contact" className="btn-primary">Organize meetup</a>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Community;
