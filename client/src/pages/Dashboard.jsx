// pages/Dashboard.jsx
import React, { useMemo, useState } from "react";
import "./Dashboard.css";

const MOCK_ORDERS = [
  { id: "ORD-10239", when: "2025-09-01 16:22", customer: "Klara H.", totalCZK: 2709, status: "Refunded" },
  { id: "ORD-10237", when: "2025-08-30 18:41", customer: "Lucas Meyer", totalCZK: 2689, status: "Completed" },
  { id: "ORD-10236", when: "2025-08-30 12:18", customer: "Marek Dvořák", totalCZK: 1800, status: "Shipped" },
  { id: "ORD-10235", when: "2025-08-29 09:05", customer: "Petra Veselá", totalCZK: 2500, status: "Pending" },
];

const MOCK_MSGS = [
  { id: "c1", user: "nikolaphoto", text: "Dogovaramo termin za subotu?", time: "10:24", unread: true },
  { id: "c2", user: "markolens", text: "Šaljem ti RAW fajlove večeras.", time: "09:13", unread: false },
  { id: "c3", user: "anak", text: "Može li nedelja oko 17h?", time: "Yesterday", unread: false },
];

const PORTFOLIO_STATS = {
  views7: [42, 60, 58, 71, 66, 90, 84],   // poslednjih 7 dana
  likes7: [5, 8, 7, 10, 9, 12, 11],
  totalViews: 12840,
  totalLikes: 1320,
};

const TASK_TEMPLATE = [
  { id: 1, text: "Odgovori na poruke (3)", done: false },
  { id: 2, text: "Potvrdi termin — Letná (nedelja 17:00)", done: false },
  { id: 3, text: "Export A3 print za Klara H.", done: true },
  { id: 4, text: "Upload 6 novih portreta na portfolio", done: false },
];

const czk = (n) =>
  n.toLocaleString("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 });

const Dashboard = () => {
  const [tasks, setTasks] = useState(TASK_TEMPLATE);

  const kpi = useMemo(() => {
    const revenue30 = 3009 + 2500 + 1800 + 2689; // zbir iz mock orders
    const pending = MOCK_ORDERS.filter(o => o.status === "Pending").length;
    const sessions = 6; // mock: potvrđene sesije ovog meseca
    const conversion = 3.4; // mock %
    return { revenue30, pending, sessions, conversion };
  }, []);

  const toggleTask = (id) =>
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));

  // male inline SVG funkcije za sparkline
  const Sparkline = ({ data, max = Math.max(...data), height = 40, strokeWidth = 2 }) => {
    const width = 120;
    const step = width / (data.length - 1);
    const points = data
      .map((v, i) => {
        const x = i * step;
        const y = height - (v / max) * height;
        return `${x},${y}`;
      })
      .join(" ");
    return (
      <svg className="spark" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
        <polyline points={points} stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
      </svg>
    );
  };

  return (
    <main className="dash-page">
      {/* HERO */}
      <section className="dash-hero" role="banner">
        <div className="hero-inner">
          <h1 className="hero-title">Dashboard</h1>
          <p className="hero-subtitle">Welcome back, David — evo tvog pregleda dana.</p>
          <div className="hero-cta">
            <a href="/my-portfolio" className="btn-outline">View Portfolio</a>
            <a href="/orders" className="btn-primary">Manage Orders</a>
          </div>
        </div>
        <div className="hero-cut" aria-hidden="true" />
      </section>

      {/* QUICK ACTIONS */}
      <section className="dash-actions">
        <a href="/community" className="qa-btn">➕  New post</a>
        <a href="/messages" className="qa-btn">💬  Open Messages</a>
        <a href="/portfolio" className="qa-btn">🖼️  Upload photos</a>
        <a href="/settings/profile" className="qa-btn">⚙️  Profile settings</a>
      </section>

      {/* KPI */}
      <section className="dash-kpis">
        <div className="kpi-card">
          <span className="kpi-label">Revenue (30d)</span>
          <strong className="kpi-value">{czk(kpi.revenue30)}</strong>
          <small className="kpi-trend up">+8% vs prev. 30d</small>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Open (Pending)</span>
          <strong className="kpi-value">{kpi.pending}</strong>
          <small className="kpi-trend">Orders awaiting action</small>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Sessions (month)</span>
          <strong className="kpi-value">{kpi.sessions}</strong>
          <small className="kpi-trend up">+1 new this week</small>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Shop conversion</span>
          <strong className="kpi-value">{kpi.conversion}%</strong>
          <small className="kpi-trend">Visitors → buyers</small>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="dash-grid">
        {/* Portfolio stats */}
        <div className="card portfolio">
          <h3 className="card-title">Portfolio Stats</h3>
          <div className="stat-row">
            <div className="stat">
              <div className="stat-top">
                <strong>{PORTFOLIO_STATS.totalViews.toLocaleString()}</strong>
                <span className="muted">Total views</span>
              </div>
              <div className="spark-wrap">
                <Sparkline data={PORTFOLIO_STATS.views7} />
                <small className="muted">7 days</small>
              </div>
            </div>
            <div className="stat">
              <div className="stat-top">
                <strong>{PORTFOLIO_STATS.totalLikes.toLocaleString()}</strong>
                <span className="muted">Total likes</span>
              </div>
              <div className="spark-wrap">
                <Sparkline data={PORTFOLIO_STATS.likes7} />
                <small className="muted">7 days</small>
              </div>
            </div>
          </div>
          <div className="actions">
            <a href="/my-portfolio" className="btn-outline-accent">Open portfolio</a>
            <a href="/portfolio" className="btn-ghost">Upload new</a>
          </div>
        </div>

        {/* Recent orders */}
        <div className="card orders">
          <h3 className="card-title">Recent Orders</h3>
          <div className="table">
            {MOCK_ORDERS.slice(0, 4).map((o) => (
              <div key={o.id} className="tr">
                <a className="id" href={`/orders?id=${o.id}`} title="Open order">{o.id}</a>
                <span className="when muted">{new Date(o.when).toLocaleString()}</span>
                <span className="customer">{o.customer}</span>
                <span className={`badge ${o.status.replace("/","-").toLowerCase()}`}>{o.status}</span>
                <strong className="total">{czk(o.totalCZK)}</strong>
              </div>
            ))}
          </div>
          <div className="actions">
            <a href="/orders" className="btn-ghost">View all</a>
          </div>
        </div>

        {/* Messages preview */}
        <div className="card messages">
          <h3 className="card-title">Messages</h3>
          <ul className="msg-list">
            {MOCK_MSGS.map((m) => (
              <li key={m.id} className={`msg ${m.unread ? "unread" : ""}`}>
                <div className="avatar">{m.user.slice(0,1).toUpperCase()}</div>
                <div className="body">
                  <div className="top">
                    <strong>@{m.user}</strong>
                    <span className="muted">{m.time}</span>
                  </div>
                  <p className="text">{m.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="actions">
            <a href="/messages" className="btn-outline-accent">Open inbox</a>
          </div>
        </div>

        {/* Mini calendar (mock) */}
        <div className="card calendar">
          <h3 className="card-title">This Week</h3>
          <ul className="week">
            <li><span className="day">Mon</span><span className="evt">Free</span></li>
            <li><span className="day">Tue</span><span className="evt pill">Edit session — 19:00</span></li>
            <li><span className="day">Wed</span><span className="evt">Free</span></li>
            <li><span className="day">Thu</span><span className="evt pill">Street walk — 18:00</span></li>
            <li><span className="day">Fri</span><span className="evt">Free</span></li>
            <li><span className="day">Sat</span><span className="evt pill">Portraits — 16:30</span></li>
            <li><span className="day">Sun</span><span className="evt pill">Couple shoot — 17:00</span></li>
          </ul>
          <div className="actions">
            <a href="/community" className="btn-ghost">Plan meetup</a>
          </div>
        </div>

        {/* Tasks */}
        <div className="card tasks">
          <h3 className="card-title">Tasks</h3>
          <ul className="task-list">
            {tasks.map(t => (
              <li key={t.id}>
                <label className="chk">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTask(t.id)}
                  />
                  <span className="box" />
                  <span className={`txt ${t.done ? "done" : ""}`}>{t.text}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="actions">
            <a href="/orders" className="btn-ghost">Go to orders</a>
            <a href="/messages" className="btn-ghost">Go to inbox</a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
