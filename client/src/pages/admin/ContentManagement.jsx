// pages/ContentManagement.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./ContentManagement.css";

import sample1 from "../../assets/sample1.jpg";
import sample2 from "../../assets/sample2.jpg";
import sample3 from "../../assets/sample3.jpg";

const TYPES = ["All types", "Showcase", "Discussions", "Buy/Sell"];
const STATUSES = ["All statuses", "Pending", "Approved", "Flagged", "Removed"];

const MOCK_POSTS = [
  {
    id: "P-8841",
    type: "Showcase",
    title: "Prague Golden Hour — Charles Bridge",
    excerpt: "50mm, f/2, ISO 200 — minimalan edit, fokus na atmosferu.",
    author: { username: "projectd850" },
    createdAt: "2025-09-02 10:05",
    tags: ["Prague", "Cityscapes", "Nikon D850"],
    status: "Pending",
    flags: ["new account"],
    pinned: false,
    locked: false,
    featured: false,
    image: sample3,
    stats: { likes: 42, comments: 7, saves: 9 },
  },
  {
    id: "P-8839",
    type: "Buy/Sell",
    title: "PRODAJA: Nikkor 50mm f/1.8G",
    excerpt: "Odlično stanje, bez prašine, cena 2 600 CZK. Proba u Pragu.",
    author: { username: "nikolaphoto" },
    createdAt: "2025-09-02 08:11",
    tags: ["Marketplace", "Nikon"],
    status: "Approved",
    flags: [],
    pinned: false,
    locked: false,
    featured: false,
    image: null,
    stats: { likes: 9, comments: 4, saves: 6 },
  },
  {
    id: "P-8833",
    type: "Discussions",
    title: "Najbolji budget tripod za night city?",
    excerpt: "Stabilan ali lagan stativ do 2 000 CZK — preporuke?",
    author: { username: "random123" },
    createdAt: "2025-09-01 19:30",
    tags: ["Gear", "Tripod", "Night"],
    status: "Flagged",
    flags: ["link shortener"],
    pinned: false,
    locked: false,
    featured: false,
    image: null,
    stats: { likes: 18, comments: 12, saves: 3 },
  },
  {
    id: "P-8822",
    type: "Showcase",
    title: "Street portrait — Beroun",
    excerpt: "Prirodno svetlo, blagi HSL u koži.",
    author: { username: "projectd850" },
    createdAt: "2025-08-31 12:02",
    tags: ["Street", "Portraits", "Beroun"],
    status: "Approved",
    flags: [],
    pinned: true,
    locked: false,
    featured: true,
    image: sample1,
    stats: { likes: 55, comments: 10, saves: 12 },
  },
  {
    id: "P-8810",
    type: "Showcase",
    title: "Letná Skyline — long exposure",
    excerpt: "ND8 filter, 20s, f/8.",
    author: { username: "nikolaphoto" },
    createdAt: "2025-08-30 09:41",
    tags: ["LongExposure", "Cityscapes"],
    status: "Removed",
    flags: ["copyright"],
    pinned: false,
    locked: true,
    featured: false,
    image: sample2,
    stats: { likes: 23, comments: 3, saves: 5 },
  },
];

const pageSize = 6;

const ContentManagement = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All types");
  const [status, setStatus] = useState("All statuses");
  const [tag, setTag] = useState("All tags");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [drawer, setDrawer] = useState(null);

  // Dinamički tagovi iz sadržaja
  const ALL_TAGS = useMemo(() => {
    const s = new Set();
    posts.forEach(p => (p.tags || []).forEach(t => s.add(t)));
    return ["All tags", ...Array.from(s).sort()];
  }, [posts]);

  // Filtriranje + pretraga
  const filtered = useMemo(() => {
    let list = [...posts];
    if (type !== "All types") list = list.filter(p => p.type === type);
    if (status !== "All statuses") list = list.filter(p => p.status === status);
    if (tag !== "All tags") list = list.filter(p => p.tags.includes(tag));
    const s = q.trim().toLowerCase();
    if (s) {
      list = list.filter(p =>
        p.id.toLowerCase().includes(s) ||
        p.title.toLowerCase().includes(s) ||
        p.excerpt.toLowerCase().includes(s) ||
        p.author.username.toLowerCase().includes(s) ||
        p.tags.some(t => t.toLowerCase().includes(s))
      );
    }
    return list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [posts, type, status, tag, q]);

  // Paginacija
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  // Select helpers
  const toggleSelect = (id) => {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };
  const toggleSelectPage = () => {
    const ids = pageData.map(p => p.id);
    setSelected(prev => {
      const s = new Set(prev);
      const all = ids.every(id => s.has(id));
      if (all) ids.forEach(id => s.delete(id));
      else ids.forEach(id => s.add(id));
      return s;
    });
  };
  const clearSelection = () => setSelected(new Set());

  // Bulk akcije (mock)
  const bulkApprove = () => {
    setPosts(prev => prev.map(p => selected.has(p.id) ? { ...p, status: "Approved", flags: [] } : p));
    clearSelection();
  };
  const bulkRemove = () => {
    setPosts(prev => prev.map(p => selected.has(p.id) ? { ...p, status: "Removed" } : p));
    clearSelection();
  };
  const bulkFeature = () => {
    setPosts(prev => prev.map(p => selected.has(p.id) ? { ...p, featured: true } : p));
    clearSelection();
  };
  const bulkPin = () => {
    setPosts(prev => prev.map(p => selected.has(p.id) ? { ...p, pinned: true } : p));
    clearSelection();
  };
  const bulkUnpin = () => {
    setPosts(prev => prev.map(p => selected.has(p.id) ? { ...p, pinned: false } : p));
    clearSelection();
  };
  const bulkLock = () => {
    setPosts(prev => prev.map(p => selected.has(p.id) ? { ...p, locked: true } : p));
    clearSelection();
  };
  const bulkUnlock = () => {
    setPosts(prev => prev.map(p => selected.has(p.id) ? { ...p, locked: false } : p));
    clearSelection();
  };

  // Export CSV
  const exportCSV = () => {
    const header = ["id","type","title","author","status","pinned","locked","featured","tags","createdAt"].join(",");
    const rows = filtered.map(p => [
      p.id, p.type, p.title, p.author.username, p.status,
      p.pinned, p.locked, p.featured, p.tags.join("|"), p.createdAt
    ].map(x => `"${String(x).replace(/"/g,'""')}"`).join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "content.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // Drawer — save (mock)
  const onDrawerSave = () => {
    setPosts(prev => prev.map(p => p.id === drawer.id ? drawer : p));
    setDrawer(null);
  };

  return (
    <main className="cm-page">
      {/* HERO */}
      <section className="cm-hero" role="banner">
        <div className="hero-inner">
          <h1 className="hero-title">Content Management</h1>
          <p className="hero-subtitle">Moderacija i upravljanje objavama (Showcase, Discussions, Buy/Sell).</p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={exportCSV}>Export CSV</button>
            <button
              className="btn-outline"
              onClick={() => { setQ(""); setType("All types"); setStatus("All statuses"); setTag("All tags"); setPage(1); }}
            >
              Reset filters
            </button>
          </div>
        </div>
        <div className="hero-cut" aria-hidden="true" />
      </section>

      {/* TOOLS */}
      <section className="cm-tools">
        <div className="left">
          <input
            type="search"
            placeholder="Search title/excerpt/author/tag/ID…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            aria-label="Search content"
          />
          <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={tag} onChange={(e) => { setTag(e.target.value); setPage(1); }}>
            {ALL_TAGS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="right">
          <span className="muted">{filtered.length} results</span>
        </div>
      </section>

      {/* BULK ACTIONS */}
      {selected.size > 0 && (
        <section className="cm-bulk">
          <span>{selected.size} selected</span>
          <div className="actions">
            <button className="btn-ghost" onClick={bulkApprove}>Approve</button>
            <button className="btn-ghost" onClick={bulkRemove}>Remove</button>
            <button className="btn-ghost" onClick={bulkFeature}>Feature</button>
            <button className="btn-ghost" onClick={bulkPin}>Pin</button>
            <button className="btn-ghost" onClick={bulkUnpin}>Unpin</button>
            <button className="btn-ghost" onClick={bulkLock}>Lock</button>
            <button className="btn-ghost" onClick={bulkUnlock}>Unlock</button>
            <button className="btn-ghost" onClick={clearSelection}>Clear</button>
          </div>
        </section>
      )}

      {/* TABLE */}
      <section className="cm-table" aria-label="Content table">
        <div className="thead">
          <label className="chk">
            <input
              type="checkbox"
              checked={pageData.length > 0 && pageData.every(p => selected.has(p.id))}
              onChange={toggleSelectPage}
            />
            <span>Select page</span>
          </label>
          <span>Post</span>
          <span>Type</span>
          <span>Author</span>
          <span>Status</span>
          <span>Tags</span>
          <span>Created</span>
          <span className="hdr-actions">Actions</span>
        </div>

        <div className="tbody">
          {pageData.map(p => (
            <div className="tr" key={p.id}>
              <label className="chk">
                <input
                  type="checkbox"
                  checked={selected.has(p.id)}
                  onChange={() => toggleSelect(p.id)}
                />
              </label>

              <div className="cell-post" onClick={() => setDrawer({ ...p })} title="Open details">
                <div className={`thumb ${p.image ? "" : "noimg"}`}>
                  {p.image ? <img src={p.image} alt={p.title} loading="lazy" decoding="async" /> : <span>✎</span>}
                </div>
                <div className="meta">
                  <strong className="title">{p.title}</strong>
                  <small className="muted">{p.id}</small>
                  <div className="badges">
                    {p.pinned && <span className="pill">Pinned</span>}
                    {p.locked && <span className="pill">Locked</span>}
                    {p.featured && <span className="pill">Featured</span>}
                    {p.flags.length > 0 && <span className="flag">#{p.flags[0]}</span>}
                  </div>
                </div>
              </div>

              <span className="type">{p.type}</span>
              <span className="author">@{p.author.username}</span>
              <span className={`badge ${p.status.toLowerCase()}`}>{p.status}</span>

              <div className="tags">
                {p.tags.map(t => <span key={t} className="tag">#{t}</span>)}
              </div>

              <span className="muted">{new Date(p.createdAt).toLocaleString()}</span>

              <div className="actions">
                <button className="btn-ghost" onClick={() => setDrawer({ ...p })}>Edit</button>
                {p.status !== "Approved" && (
                  <button className="btn-ghost" onClick={() => setPosts(prev => prev.map(x => x.id === p.id ? { ...x, status: "Approved", flags: [] } : x))}>Approve</button>
                )}
                {p.status !== "Removed" && (
                  <button className="btn-ghost" onClick={() => setPosts(prev => prev.map(x => x.id === p.id ? { ...x, status: "Removed" } : x))}>Remove</button>
                )}
              </div>
            </div>
          ))}

          {pageData.length === 0 && (
            <div className="empty-state">
              <p>No posts found.</p>
            </div>
          )}
        </div>
      </section>

      {/* PAGINATION */}
      <section className="cm-pagination">
        <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>← Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button className="btn-ghost" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next →</button>
      </section>

      {/* DRAWER: CONTENT DETAIL */}
      {drawer && (
        <div className="cm-drawer" role="dialog" aria-modal="true" onClick={() => setDrawer(null)}>
          <div className="drawer-inner" onClick={(e) => e.stopPropagation()}>
            <header className="drawer-head">
              <h3>Post {drawer.id}</h3>
              <button className="close" onClick={() => setDrawer(null)}>×</button>
            </header>

            <div className="drawer-body">
              <div className="media">
                <div className={`thumb big ${drawer.image ? "" : "noimg"}`}>
                  {drawer.image ? <img src={drawer.image} alt={drawer.title} /> : <span>no image</span>}
                </div>
                <div className="stats">
                  <div><span className="muted">Likes</span><strong>{drawer.stats?.likes ?? 0}</strong></div>
                  <div><span className="muted">Comments</span><strong>{drawer.stats?.comments ?? 0}</strong></div>
                  <div><span className="muted">Saves</span><strong>{drawer.stats?.saves ?? 0}</strong></div>
                </div>
              </div>

              <div className="grid">
                <label className="col-span-2">
                  Title
                  <input type="text" value={drawer.title} onChange={(e) => setDrawer(d => ({ ...d, title: e.target.value }))} />
                </label>
                <label className="col-span-2">
                  Excerpt
                  <textarea rows={3} value={drawer.excerpt} onChange={(e) => setDrawer(d => ({ ...d, excerpt: e.target.value }))} />
                </label>
                <label>
                  Type
                  <select value={drawer.type} onChange={(e) => setDrawer(d => ({ ...d, type: e.target.value }))}>
                    <option>Showcase</option>
                    <option>Discussions</option>
                    <option>Buy/Sell</option>
                  </select>
                </label>
                <label>
                  Status
                  <select value={drawer.status} onChange={(e) => setDrawer(d => ({ ...d, status: e.target.value }))}>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Flagged</option>
                    <option>Removed</option>
                  </select>
                </label>
                <label className="col-span-2">
                  Tags (comma or # separated)
                  <input
                    type="text"
                    value={drawer.tags.join(", ")}
                    onChange={(e) => {
                      const raw = e.target.value.split(/[#,]/).map(x => x.trim()).filter(Boolean);
                      setDrawer(d => ({ ...d, tags: Array.from(new Set(raw)) }));
                    }}
                  />
                </label>

                <div className="toggles col-span-2">
                  <label className="switch">
                    <input type="checkbox" checked={drawer.pinned} onChange={(e) => setDrawer(d => ({ ...d, pinned: e.target.checked }))} />
                    <span className="slider" />
                    <span className="label">Pinned</span>
                  </label>
                  <label className="switch">
                    <input type="checkbox" checked={drawer.locked} onChange={(e) => setDrawer(d => ({ ...d, locked: e.target.checked }))} />
                    <span className="slider" />
                    <span className="label">Locked</span>
                  </label>
                  <label className="switch">
                    <input type="checkbox" checked={drawer.featured} onChange={(e) => setDrawer(d => ({ ...d, featured: e.target.checked }))} />
                    <span className="slider" />
                    <span className="label">Featured</span>
                  </label>
                </div>
              </div>

              {drawer.flags?.length > 0 && (
                <div className="flags">
                  <h4>Flags</h4>
                  <div className="flag-list">
                    {drawer.flags.map((f,i) => <span key={i} className="flag">#{f}</span>)}
                  </div>
                </div>
              )}

              <div className="drawer-actions">
                <button className="btn-primary" onClick={onDrawerSave}>Save</button>
                {drawer.status !== "Approved" && (
                  <button className="btn-outline-accent" onClick={() => setDrawer(d => ({ ...d, status: "Approved", flags: [] }))}>
                    Approve
                  </button>
                )}
                {drawer.status !== "Removed" && (
                  <button className="btn-ghost" onClick={() => setDrawer(d => ({ ...d, status: "Removed" }))}>
                    Remove
                  </button>
                )}
                <button className="btn-ghost" onClick={() => setDrawer(null)}>Close</button>
              </div>

              <p className="muted small">Created: {new Date(drawer.createdAt).toLocaleString()} • by @{drawer.author.username}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ContentManagement;
