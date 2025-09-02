// pages/AdminDashboard.jsx
import React, { useMemo, useState } from "react";
import "./AdminDashboard.css";

/** ---------- MOCK DATA ---------- */
const SALES_30 = [9,14,12,16,11,18,22,20,24,21,19,26,23,28,25,30,27,31,29,34,33,36,32,31,29,27,26,24,22,20]; // porudžbine/dan
const REVENUE_7 = [18000, 23500, 21000, 29800, 27400, 32000, 30500]; // CZK po danu

const KPI = {
  users: 1842,
  photographers: 116,
  activeToday: 247,
  mrrCZK: 128_900, // mesečni prihod (mock)
};

const RECENT_USERS = [
  { id: "u-2043", name: "Jan Novák", username: "jan_n", role: "user", joined: "2025-09-01 10:12" },
  { id: "u-2042", name: "Ana K.", username: "anak", role: "photographer", joined: "2025-09-01 09:44" },
  { id: "u-2041", name: "Marko L.", username: "markolens", role: "photographer", joined: "2025-08-31 18:03" },
  { id: "u-2040", name: "Petra Veselá", username: "petra_v", role: "user", joined: "2025-08-31 15:21" },
];

const RECENT_ORDERS = [
  { id: "ORD-10241", when: "2025-09-02 09:18", buyer: "Jan Novák", totalCZK: 1590, status: "Paid" },
  { id: "ORD-10240", when: "2025-09-01 19:12", buyer: "Eva K.", totalCZK: 1000, status: "Canceled" },
  { id: "ORD-10239", when: "2025-09-01 16:22", buyer: "Klara H.", totalCZK: 2709, status: "Refunded" },
  { id: "ORD-10237", when: "2025-08-30 18:41", buyer: "Lucas Meyer", totalCZK: 2689, status: "Completed" },
];

const REPORTS = [
  { id: "R-501", type: "Post", ref: "#3421", reason: "Spam/self-promo", created: "2025-09-01 22:11", status: "Open" },
  { id: "R-500", type: "User", ref: "@user_zzz", reason: "Harassment", created: "2025-09-01 12:37", status: "Open" },
  { id: "R-499", type: "Comment", ref: "#88102", reason: "NSFW", created: "2025-08-31 21:06", status: "Resolved" },
];

const MOD_QUEUE = [
  { id: "P-8841", kind: "Showcase", author: "new_user", created: "10m ago", flags: ["new account"] },
  { id: "P-8839", kind: "Buy/Sell", author: "nikolaphoto", created: "1h ago", flags: ["price?"] },
  { id: "P-8833", kind: "Discussion", author: "random123", created: "3h ago", flags: ["link"] },
];

const SYSTEM_HEALTH = {
  apiLatencyMs: 142,
  apiErrorRate: 0.21, // %
  dbStatus: "OK",
  storageUsedGB: 62.4,
  storageCapGB: 250,
  queueDepth: 7,
};

const LOGS = [
  { t: "2025-09-02 11:35:22", lvl: "INFO", msg: "Payment webhook processed: ORD-10241" },
  { t: "2025-09-02 11:22:08", lvl: "WARN", msg: "High request latency (>300ms) for /api/upload" },
  { t: "2025-09-02 10:59:44", lvl: "INFO", msg: "User signup: u-2043 jan_n" },
  { t: "2025-09-02 10:41:00", lvl: "ERROR", msg: "DB timeout on /api/orders (read replica)" },
];

/** ---------- SMALL SVG CHARTS ---------- */
const Spark = ({ data, height = 42, strokeWidth = 2 }) => {
  const width = 140;
  const max = Math.max(...data);
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${height - (v / max) * height}`).join(" ");
  return (
    <svg className="spark" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts} stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
    </svg>
  );
};

const Bars = ({ data, height = 56 }) => {
  const width = 160;
  const gap = 3;
  const barW = (width - gap * (data.length - 1)) / data.length;
  const max = Math.max(...data);
  return (
    <svg className="bars" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      {data.map((v, i) => {
        const h = Math.max(2, (v / max) * (height - 2));
        const x = i * (barW + gap);
        const y = height - h;
        return <rect key={i} x={x} y={y} width={barW} height={h} fill="currentColor" rx="2" />;
      })}
    </svg>
  );
};

/** ---------- UTIL ---------- */
const czk = (n) => n.toLocaleString("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 });
const pct = (n) => `${n.toFixed(2)}%`;

/** ---------- COMPONENT ---------- */
const AdminDashboard = () => {
  const [tab, setTab] = useState("overview");

  const storagePct = useMemo(
    () => Math.min(100, (SYSTEM_HEALTH.storageUsedGB / SYSTEM_HEALTH.storageCapGB) * 100),
    []
  );

  return (
    <main className="admin-page">
      {/* HERO */}
      <section className="admin-hero" role="banner">
        <div className="hero-inner">
          <h1 className="hero-title">Admin Dashboard</h1>
          <p className="hero-subtitle">Kontrola platforme — korisnici, prodaja, moderacija, zdravlje sistema.</p>
          <div className="hero-cta">
            <a href="/dashboard" className="btn-outline">User dashboard</a>
            <a href="/orders" className="btn-primary">Manage orders</a>
          </div>
        </div>
        <div className="hero-cut" aria-hidden="true" />
      </section>

      {/* TABS */}
      <section className="admin-tabs">
        {["overview", "users", "content", "system"].map((t) => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </section>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <>
          {/* KPI */}
          <section className="admin-kpis">
            <div className="kpi">
              <span className="label">Total users</span>
              <strong className="value">{KPI.users.toLocaleString()}</strong>
              <small className="hint">+34 this week</small>
            </div>
            <div className="kpi">
              <span className="label">Photographers</span>
              <strong className="value">{KPI.photographers}</strong>
              <small className="hint">+3 new</small>
            </div>
            <div className="kpi">
              <span className="label">Active today</span>
              <strong className="value">{KPI.activeToday}</strong>
              <small className="hint">peak 11:00</small>
            </div>
            <div className="kpi">
              <span className="label">MRR</span>
              <strong className="value">{czk(KPI.mrrCZK)}</strong>
              <small className="hint">+6% MoM</small>
            </div>
          </section>

          {/* SALES / TRAFFIC */}
          <section className="admin-grid">
            <div className="card">
              <h3 className="card-title">Orders (30d)</h3>
              <div className="chart-row">
                <Spark data={SALES_30} />
                <div className="mini">
                  <span className="muted">Total</span>
                  <strong>{SALES_30.reduce((a, b) => a + b, 0)}</strong>
                </div>
              </div>
              <div className="actions">
                <a href="/orders" className="btn-outline-accent">Open orders</a>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Revenue (7d)</h3>
              <div className="chart-row">
                <Bars data={REVENUE_7} />
                <div className="mini">
                  <span className="muted">Sum</span>
                  <strong>{czk(REVENUE_7.reduce((a, b) => a + b, 0))}</strong>
                </div>
              </div>
              <div className="actions">
                <button className="btn-ghost">Export CSV</button>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Moderation queue</h3>
              <ul className="queue">
                {MOD_QUEUE.map((q) => (
                  <li key={q.id}>
                    <div className="left">
                      <span className="pill">{q.kind}</span>
                      <strong>{q.id}</strong>
                      <span className="muted">by @{q.author}</span>
                    </div>
                    <div className="right">
                      {q.flags.map((f, i) => (
                        <span key={i} className="flag">#{f}</span>
                      ))}
                      <button className="btn-ghost">Approve</button>
                      <button className="btn-ghost">Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* TABLES */}
          <section className="admin-grid">
            <div className="card">
              <h3 className="card-title">Recent orders</h3>
              <div className="table">
                {RECENT_ORDERS.map((o) => (
                  <div className="tr" key={o.id}>
                    <a className="id" href={`/orders?id=${o.id}`}>{o.id}</a>
                    <span className="muted">{new Date(o.when).toLocaleString()}</span>
                    <span>{o.buyer}</span>
                    <span className={`badge ${o.status.replace("/","-").toLowerCase()}`}>{o.status}</span>
                    <strong className="right">{czk(o.totalCZK)}</strong>
                  </div>
                ))}
              </div>
              <div className="actions">
                <a className="btn-ghost" href="/orders">View all</a>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Recent signups</h3>
              <div className="table">
                {RECENT_USERS.map((u) => (
                  <div className="tr" key={u.id}>
                    <strong>{u.name}</strong>
                    <span className="muted">@{u.username}</span>
                    <span className={`role ${u.role}`}>{u.role}</span>
                    <span className="muted">{new Date(u.joined).toLocaleString()}</span>
                    <div className="right">
                      <button className="btn-ghost">Promote</button>
                      <button className="btn-ghost">Ban</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Reports</h3>
              <div className="table">
                {REPORTS.map((r) => (
                  <div className="tr" key={r.id}>
                    <strong>{r.id}</strong>
                    <span className="pill">{r.type}</span>
                    <span className="muted">{r.ref}</span>
                    <span>{r.reason}</span>
                    <span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span>
                    <span className="muted">{new Date(r.created).toLocaleString()}</span>
                    <div className="right">
                      {r.status === "Open" ? (
                        <>
                          <button className="btn-ghost">Resolve</button>
                          <button className="btn-ghost">Dismiss</button>
                        </>
                      ) : (
                        <button className="btn-ghost">Reopen</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* USERS */}
      {tab === "users" && (
        <section className="card big">
          <h3 className="card-title">Users — management</h3>
          <div className="toolbar">
            <input type="search" placeholder="Search name/username/email…" />
            <select>
              <option>All roles</option>
              <option>user</option>
              <option>photographer</option>
              <option>admin</option>
            </select>
            <button className="btn-outline-accent">Export CSV</button>
          </div>
          <div className="table grid-head">
            <div className="th">Name</div>
            <div className="th">Username</div>
            <div className="th">Role</div>
            <div className="th">Joined</div>
            <div className="th right">Actions</div>
          </div>
          <div className="table">
            {RECENT_USERS.concat(RECENT_USERS).map((u, i) => (
              <div className="tr" key={u.id + i}>
                <strong>{u.name}</strong>
                <span className="muted">@{u.username}</span>
                <span className={`role ${u.role}`}>{u.role}</span>
                <span className="muted">{new Date(u.joined).toLocaleString()}</span>
                <div className="right">
                  <button className="btn-ghost">Promote</button>
                  <button className="btn-ghost">Reset password</button>
                  <button className="btn-ghost">Deactivate</button>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button className="btn-ghost">← Prev</button>
            <span>Page 1 / 5</span>
            <button className="btn-ghost">Next →</button>
          </div>
        </section>
      )}

      {/* CONTENT / MODERATION */}
      {tab === "content" && (
        <section className="card big">
          <h3 className="card-title">Content moderation</h3>
          <div className="toolbar">
            <select>
              <option>All types</option>
              <option>Showcase</option>
              <option>Discussions</option>
              <option>Buy/Sell</option>
            </select>
            <select>
              <option>All statuses</option>
              <option>Open</option>
              <option>Flagged</option>
              <option>Removed</option>
            </select>
            <input type="search" placeholder="Search by ID/author/tag…" />
            <button className="btn-outline-accent">Bulk approve</button>
            <button className="btn-ghost">Bulk remove</button>
          </div>
          <ul className="queue big">
            {MOD_QUEUE.concat(MOD_QUEUE).map((q, i) => (
              <li key={q.id + i}>
                <div className="left">
                  <span className="pill">{q.kind}</span>
                  <strong>{q.id}</strong>
                  <span className="muted">by @{q.author} • {q.created}</span>
                </div>
                <div className="right">
                  {q.flags.map((f, j) => (
                    <span key={j} className="flag">#{f}</span>
                  ))}
                  <button className="btn-ghost">Approve</button>
                  <button className="btn-ghost">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* SYSTEM */}
      {tab === "system" && (
        <section className="admin-grid">
          <div className="card">
            <h3 className="card-title">System health</h3>
            <div className="health">
              <div className="row">
                <span className="muted">API latency</span>
                <strong>{SYSTEM_HEALTH.apiLatencyMs} ms</strong>
              </div>
              <div className="row">
                <span className="muted">API error rate</span>
                <strong>{pct(SYSTEM_HEALTH.apiErrorRate)}</strong>
              </div>
              <div className="row">
                <span className="muted">DB</span>
                <span className={`badge ${SYSTEM_HEALTH.dbStatus === "OK" ? "paid" : "canceled"}`}>{SYSTEM_HEALTH.dbStatus}</span>
              </div>
              <div className="row">
                <span className="muted">Jobs queue</span>
                <strong>{SYSTEM_HEALTH.queueDepth}</strong>
              </div>
              <div className="row">
                <span className="muted">Storage</span>
                <div className="storage">
                  <div className="bar">
                    <div className="fill" style={{ width: `${storagePct}%` }} />
                  </div>
                  <small className="muted">
                    {SYSTEM_HEALTH.storageUsedGB} GB / {SYSTEM_HEALTH.storageCapGB} GB
                  </small>
                </div>
              </div>
              <div className="actions">
                <button className="btn-outline-accent">Purge cache</button>
                <button className="btn-ghost">Restart workers</button>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">System logs</h3>
            <ul className="logs">
              {LOGS.map((l, i) => (
                <li key={i} className={l.lvl.toLowerCase()}>
                  <span className="when">{l.t}</span>
                  <span className="lvl">{l.lvl}</span>
                  <span className="msg">{l.msg}</span>
                </li>
              ))}
            </ul>
            <div className="actions">
              <button className="btn-ghost">Refresh</button>
              <button className="btn-outline-accent">Export</button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default AdminDashboard;
