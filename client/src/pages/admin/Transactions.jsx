// pages/admin/Transactions.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./Transactions.css";

const TYPES = ["All types", "Payment", "Refund", "Payout", "Fee", "Chargeback"];
const STATUSES = ["All statuses", "Succeeded", "Pending", "Failed", "Refunded", "Disputed", "Resolved"];
const METHODS = ["All methods", "Card", "PayPal", "Bank"];

const MOCK = [
  {
    id: "txn_102410",
    date: "2025-09-02 11:20",
    type: "Payment",
    method: "Card",
    orderId: "ORD-10241",
    party: { name: "Jan Novák", role: "buyer" },
    grossCZK: 1590,
    feeCZK: 47,
    netCZK: 1543,
    status: "Succeeded",
    gateway: "Stripe",
    risk: "low",
    ref: "pi_3NXE…",
    timeline: [
      { t: "2025-09-02 11:20", e: "Payment succeeded" },
      { t: "2025-09-02 11:19", e: "3DS authenticated" },
      { t: "2025-09-02 11:18", e: "Payment initiated" },
    ],
  },
  {
    id: "txn_102409",
    date: "2025-09-02 10:40",
    type: "Payout",
    method: "Bank",
    orderId: null,
    party: { name: "ProjectD850 s.r.o.", role: "platform" },
    grossCZK: -52000,
    feeCZK: 0,
    netCZK: -52000,
    status: "Pending",
    gateway: "Bank transfer",
    risk: "n/a",
    ref: "pay_20250902_A",
    timeline: [{ t: "2025-09-02 10:40", e: "Payout requested" }],
  },
  {
    id: "txn_102408",
    date: "2025-09-01 16:24",
    type: "Payment",
    method: "Card",
    orderId: "ORD-10239",
    party: { name: "Klara H.", role: "buyer" },
    grossCZK: 2709,
    feeCZK: 80,
    netCZK: 2629,
    status: "Refunded",
    gateway: "Stripe",
    risk: "low",
    ref: "pi_3NXD…",
    timeline: [
      { t: "2025-09-01 18:02", e: "Refund processed" },
      { t: "2025-09-01 16:24", e: "Payment succeeded" },
    ],
  },
  {
    id: "txn_102407",
    date: "2025-09-01 12:18",
    type: "Fee",
    method: "Card",
    orderId: "ORD-10236",
    party: { name: "Platform fee", role: "platform" },
    grossCZK: 0,
    feeCZK: 120,
    netCZK: -120,
    status: "Succeeded",
    gateway: "Internal",
    risk: "n/a",
    ref: "fee_10236",
    timeline: [{ t: "2025-09-01 12:18", e: "Fee booked" }],
  },
  {
    id: "txn_102406",
    date: "2025-09-01 09:06",
    type: "Payment",
    method: "PayPal",
    orderId: "ORD-10235",
    party: { name: "Petra Veselá", role: "buyer" },
    grossCZK: 2500,
    feeCZK: 74,
    netCZK: 2426,
    status: "Pending",
    gateway: "PayPal",
    risk: "low",
    ref: "pp_8RF…",
    timeline: [{ t: "2025-09-01 09:06", e: "Payment created (pending capture)" }],
  },
  {
    id: "txn_102405",
    date: "2025-08-31 18:03",
    type: "Chargeback",
    method: "Card",
    orderId: "ORD-10234",
    party: { name: "Marek D.", role: "buyer" },
    grossCZK: -1800,
    feeCZK: 0,
    netCZK: -1800,
    status: "Disputed",
    gateway: "Stripe",
    risk: "medium",
    ref: "cb_7PE…",
    timeline: [{ t: "2025-08-31 18:03", e: "Dispute opened by issuer" }],
  },
  {
    id: "txn_102404",
    date: "2025-08-30 19:12",
    type: "Refund",
    method: "Card",
    orderId: "ORD-10237",
    party: { name: "Lucas Meyer", role: "buyer" },
    grossCZK: -2689,
    feeCZK: 0,
    netCZK: -2689,
    status: "Succeeded",
    gateway: "Stripe",
    risk: "low",
    ref: "re_2XX…",
    timeline: [{ t: "2025-08-30 19:12", e: "Refund succeeded" }],
  },
];

const pageSize = 10;
const czk = (n) => (typeof n === "number" ? n : 0).toLocaleString("cs-CZ", { style: "currency", currency: "CZK" });

const Transactions = () => {
  const [rows, setRows] = useState(MOCK);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All types");
  const [status, setStatus] = useState("All statuses");
  const [method, setMethod] = useState("All methods");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [drawer, setDrawer] = useState(null);

  // KPI
  const kpi = useMemo(() => {
    const last30 = rows.filter((r) => (Date.now() - new Date(r.date).getTime()) / (1000 * 3600 * 24) <= 30);
    const payments = last30.filter((r) => r.type === "Payment" && r.status === "Succeeded");
    const refunds = last30.filter((r) => r.type === "Refund" || r.status === "Refunded");
    const volume = payments.reduce((s, r) => s + r.grossCZK, 0);
    const net = last30.reduce((s, r) => s + r.netCZK, 0);
    const disputeRate =
      (last30.filter((r) => r.status === "Disputed").length / Math.max(1, payments.length)) * 100;
    return { volume, net, refunds: refunds.length, disputeRate };
  }, [rows]);

  // Filter + search
  const filtered = useMemo(() => {
    let list = [...rows];
    if (type !== "All types") list = list.filter((r) => r.type === type);
    if (status !== "All statuses") list = list.filter((r) => r.status === status);
    if (method !== "All methods") list = list.filter((r) => r.method === method);
    if (dateFrom) {
      const from = new Date(dateFrom + "T00:00:00");
      list = list.filter((r) => new Date(r.date) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo + "T23:59:59");
      list = list.filter((r) => new Date(r.date) <= to);
    }
    const s = q.trim().toLowerCase();
    if (s) {
      list = list.filter(
        (r) =>
          r.id.toLowerCase().includes(s) ||
          (r.orderId || "").toLowerCase().includes(s) ||
          (r.party?.name || "").toLowerCase().includes(s) ||
          (r.ref || "").toLowerCase().includes(s)
      );
    }
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [rows, type, status, method, dateFrom, dateTo, q]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  // Selection
  const toggleSelect = (id) => {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };
  const toggleSelectPage = () => {
    const ids = pageData.map((r) => r.id);
    setSelected((prev) => {
      const s = new Set(prev);
      const all = ids.every((id) => s.has(id));
      if (all) ids.forEach((id) => s.delete(id));
      else ids.forEach((id) => s.add(id));
      return s;
    });
  };
  const clearSel = () => setSelected(new Set());

  // Bulk actions (mock)
  const bulkRefund = () => {
    setRows((prev) =>
      prev
        .map((r) =>
          selected.has(r.id) && r.type === "Payment" && r.status === "Succeeded"
            ? { ...r, status: "Refunded" }
            : r
        )
        .concat(
          prev
            .filter((r) => selected.has(r.id) && r.type === "Payment" && r.status === "Succeeded")
            .map((r) => ({
              id: "txn_ref_" + r.id,
              date: new Date().toISOString().slice(0, 16).replace("T", " "),
              type: "Refund",
              method: r.method,
              orderId: r.orderId,
              party: r.party,
              grossCZK: -r.grossCZK,
              feeCZK: 0,
              netCZK: -r.grossCZK,
              status: "Succeeded",
              gateway: r.gateway,
              risk: "n/a",
              ref: "re_" + r.ref,
              timeline: [{ t: new Date().toLocaleString(), e: "Refund created (bulk)" }],
            }))
        )
    );
    clearSel();
  };
  const bulkMarkPayoutPaid = () => {
    setRows((prev) =>
      prev.map((r) =>
        selected.has(r.id) && r.type === "Payout" && r.status === "Pending"
          ? { ...r, status: "Succeeded", date: new Date().toISOString().slice(0, 16).replace("T", " ") }
          : r
      )
    );
    clearSel();
  };
  const bulkResolveDispute = () => {
    setRows((prev) =>
      prev.map((r) => (selected.has(r.id) && r.status === "Disputed" ? { ...r, status: "Resolved" } : r))
    );
    clearSel();
  };

  // Export CSV (filtered)
  const exportCSV = () => {
    const header = [
      "id",
      "date",
      "type",
      "method",
      "orderId",
      "party",
      "status",
      "grossCZK",
      "feeCZK",
      "netCZK",
      "gateway",
      "ref",
    ].join(",");
    const rowsCsv = filtered.map((r) =>
      [
        r.id,
        r.date,
        r.type,
        r.method,
        r.orderId || "",
        r.party?.name || "",
        r.status,
        r.grossCZK,
        r.feeCZK,
        r.netCZK,
        r.gateway || "",
        r.ref || "",
      ]
        .map((x) => `"${String(x).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...rowsCsv].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Drawer save (mock inline edit of status or ref notes)
  const onDrawerSave = () => {
    setRows((prev) => prev.map((r) => (r.id === drawer.id ? drawer : r)));
    setDrawer(null);
  };

  // Sum of selected net (small helper in bulk bar)
  const selectedNet = useMemo(() => {
    return rows
      .filter((r) => selected.has(r.id))
      .reduce((s, r) => s + (typeof r.netCZK === "number" ? r.netCZK : 0), 0);
  }, [rows, selected]);

  return (
    <main className="tx-page">
      {/* HERO */}
      <section className="tx-hero" role="banner">
        <div className="hero-inner">
          <h1 className="hero-title">Transactions</h1>
          <p className="hero-subtitle">Platform ledger — payments, refunds, payouts & fees.</p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={exportCSV}>Export CSV</button>
            <a className="btn-outline" href="/admin">Back to Admin</a>
          </div>
        </div>
        <div className="hero-cut" aria-hidden="true" />
      </section>

      {/* KPI */}
      <section className="tx-kpis">
        <div className="kpi-card">
          <span className="kpi-label">Payment volume (30d)</span>
          <strong className="kpi-value">{czk(kpi.volume)}</strong>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Net (30d)</span>
          <strong className="kpi-value">{czk(kpi.net)}</strong>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Refunds (30d)</span>
          <strong className="kpi-value">{kpi.refunds}</strong>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Dispute rate</span>
          <strong className="kpi-value">{kpi.disputeRate.toFixed(2)}%</strong>
        </div>
      </section>

      {/* TOOLS */}
      <section className="tx-tools">
        <div className="left">
          <input
            type="search"
            placeholder="Search ID/order/ref/party…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            aria-label="Search transactions"
          />
          <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select value={method} onChange={(e) => { setMethod(e.target.value); setPage(1); }}>
            {METHODS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            aria-label="From date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            aria-label="To date"
          />
        </div>
        <div className="right">
          <button
            className="btn-ghost"
            onClick={() => {
              setQ("");
              setType("All types");
              setStatus("All statuses");
              setMethod("All methods");
              setDateFrom("");
              setDateTo("");
              setPage(1);
            }}
          >
            Reset
          </button>
        </div>
      </section>

      {/* BULK */}
      {selected.size > 0 && (
        <section className="tx-bulk">
          <span>
            {selected.size} selected • Net: <strong>{czk(selectedNet)}</strong>
          </span>
          <div className="actions">
            <button className="btn-ghost" onClick={bulkRefund}>Refund payments</button>
            <button className="btn-ghost" onClick={bulkMarkPayoutPaid}>Mark payout paid</button>
            <button className="btn-ghost" onClick={bulkResolveDispute}>Resolve dispute</button>
            <button className="btn-ghost" onClick={clearSel}>Clear</button>
          </div>
        </section>
      )}

      {/* TABLE */}
      <section className="tx-table" aria-label="Transactions table">
        <div className="thead">
          <label className="chk">
            <input
              type="checkbox"
              checked={pageData.length > 0 && pageData.every((r) => selected.has(r.id))}
              onChange={toggleSelectPage}
            />
            <span>Select page</span>
          </label>
          <span>ID</span>
          <span>Date</span>
          <span>Type</span>
          <span>Method</span>
          <span>Party</span>
          <span>Order</span>
          <span>Status</span>
          <span>Gross</span>
          <span>Net</span>
          <span className="hdr-actions">Actions</span>
        </div>

        <div className="tbody">
          {pageData.map((r) => (
            <div className="tr" key={r.id}>
              <label className="chk">
                <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)} />
              </label>

              <button className="link-id" onClick={() => setDrawer({ ...r })} title="Open details">
                {r.id}
              </button>

              <span className="muted">{new Date(r.date).toLocaleString()}</span>

              <span className="pill">{r.type}</span>
              <span className="pill light">{r.method}</span>

              <div className="party">
                <strong>{r.party?.name}</strong>
                <small className="muted">{r.party?.role}</small>
              </div>

              {r.orderId ? (
                <a className="order" href={`/orders?id=${r.orderId}`}>{r.orderId}</a>
              ) : (
                <span className="muted">—</span>
              )}

              <span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span>

              <strong className={`amount ${r.grossCZK < 0 ? "neg" : ""}`}>{czk(r.grossCZK)}</strong>
              <strong className={`amount ${r.netCZK < 0 ? "neg" : ""}`}>{czk(r.netCZK)}</strong>

              <div className="actions">
                <button className="btn-ghost" onClick={() => setDrawer({ ...r })}>View</button>
                {r.type === "Payment" && r.status === "Succeeded" && (
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      setDrawer({
                        ...r,
                        status: "Refunded",
                        timeline: [{ t: new Date().toLocaleString(), e: "Refunded (manual)" }, ...(r.timeline || [])],
                      });
                    }}
                  >
                    Refund
                  </button>
                )}
                {r.type === "Payout" && r.status === "Pending" && (
                  <button
                    className="btn-ghost"
                    onClick={() =>
                      setRows((prev) =>
                        prev.map((x) => (x.id === r.id ? { ...x, status: "Succeeded" } : x))
                      )
                    }
                  >
                    Mark paid
                  </button>
                )}
              </div>
            </div>
          ))}

          {pageData.length === 0 && (
            <div className="empty-state">
              <p>No transactions found.</p>
            </div>
          )}
        </div>
      </section>

      {/* PAGINATION */}
      <section className="tx-pagination">
        <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          ← Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          className="btn-ghost"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next →
        </button>
      </section>

      {/* DRAWER */}
      {drawer && (
        <div className="tx-drawer" role="dialog" aria-modal="true" onClick={() => setDrawer(null)}>
          <div className="drawer-inner" onClick={(e) => e.stopPropagation()}>
            <header className="drawer-head">
              <h3>Transaction {drawer.id}</h3>
              <button className="close" onClick={() => setDrawer(null)}>×</button>
            </header>

            <div className="drawer-body">
              <div className="grid two">
                <div className="box">
                  <h4>Details</h4>
                  <div className="kv"><span className="k">Date</span><span className="v">{new Date(drawer.date).toLocaleString()}</span></div>
                  <div className="kv"><span className="k">Type</span><span className="v">{drawer.type}</span></div>
                  <div className="kv"><span className="k">Method</span><span className="v">{drawer.method}</span></div>
                  <div className="kv"><span className="k">Gateway</span><span className="v">{drawer.gateway}</span></div>
                  <div className="kv"><span className="k">Ref</span><span className="v">{drawer.ref || "—"}</span></div>
                  <div className="kv"><span className="k">Order</span><span className="v">{drawer.orderId || "—"}</span></div>
                  <div className="kv"><span className="k">Party</span><span className="v">{drawer.party?.name}</span></div>
                  <div className="kv"><span className="k">Status</span><span className="v"><span className={`badge ${drawer.status.toLowerCase()}`}>{drawer.status}</span></span></div>
                </div>

                <div className="box">
                  <h4>Amounts</h4>
                  <div className="kv"><span className="k">Gross</span><strong className={`v ${drawer.grossCZK < 0 ? "neg" : ""}`}>{czk(drawer.grossCZK)}</strong></div>
                  <div className="kv"><span className="k">Fees</span><span className="v">{czk(drawer.feeCZK)}</span></div>
                  <div className="kv"><span className="k">Net</span><strong className={`v ${drawer.netCZK < 0 ? "neg" : ""}`}>{czk(drawer.netCZK)}</strong></div>
                </div>
              </div>

              <div className="box">
                <h4>Timeline</h4>
                <ul className="timeline">
                  {(drawer.timeline || []).map((i, idx) => (
                    <li key={idx}>
                      <span className="t">{i.t}</span>
                      <span className="e">{i.e}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="drawer-actions">
                <button className="btn-primary" onClick={onDrawerSave}>Save</button>
                {drawer.type === "Payment" && drawer.status !== "Refunded" && (
                  <button
                    className="btn-outline-accent"
                    onClick={() =>
                      setDrawer((d) => ({
                        ...d,
                        status: "Refunded",
                        timeline: [{ t: new Date().toLocaleString(), e: "Refunded (drawer)" }, ...(d.timeline || [])],
                      }))
                    }
                  >
                    Refund
                  </button>
                )}
                {drawer.status === "Disputed" && (
                  <button className="btn-ghost" onClick={() => setDrawer((d) => ({ ...d, status: "Resolved" }))}>
                    Mark resolved
                  </button>
                )}
                {drawer.type === "Payout" && drawer.status === "Pending" && (
                  <button className="btn-ghost" onClick={() => setDrawer((d) => ({ ...d, status: "Succeeded" }))}>
                    Mark paid
                  </button>
                )}
                <button className="btn-ghost" onClick={() => setDrawer(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Transactions;
