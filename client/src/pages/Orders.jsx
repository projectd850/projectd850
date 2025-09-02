// pages/Orders.jsx
import React, { useMemo, useState, useEffect } from "react";
import "./Orders.css";

// Demo podaci – kasnije zameniti API-jem
const MOCK = [
  {
    id: "ORD-10234",
    createdAt: "2025-08-28 14:22",
    customer: { name: "Jan Novak", email: "jan.novak@example.com", country: "CZ" },
    items: [
      { sku: "P-D850-PRINT-A3", title: "Print: Prague Skyline (A3)", qty: 1, priceCZK: 1590 },
      { sku: "P-STREET-SET",   title: "Street Mini Set (3 prints)",  qty: 1, priceCZK: 1290 },
    ],
    subtotalCZK: 2880,
    shippingCZK: 129,
    taxCZK: 0,
    totalCZK: 3009,
    status: "Paid",
    note: "",
  },
  {
    id: "ORD-10235",
    createdAt: "2025-08-29 09:05",
    customer: { name: "Petra Veselá", email: "petra.v@example.com", country: "CZ" },
    items: [{ sku: "SESSION-PORTRAIT", title: "Portrait Session (90 min)", qty: 1, priceCZK: 2500 }],
    subtotalCZK: 2500,
    shippingCZK: 0,
    taxCZK: 0,
    totalCZK: 2500,
    status: "Pending",
    note: "Traži termin posle 17h, Letná.",
  },
  {
    id: "ORD-10236",
    createdAt: "2025-08-30 12:18",
    customer: { name: "Marek Dvořák", email: "marek.d@example.com", country: "CZ" },
    items: [{ sku: "P-COUPLE-SESSION", title: "Couple Session (60 min)", qty: 1, priceCZK: 1800 }],
    subtotalCZK: 1800,
    shippingCZK: 0,
    taxCZK: 0,
    totalCZK: 1800,
    status: "Shipped",
    note: "Plaćeno unapred. Poslao RAW selekciju.",
  },
  {
    id: "ORD-10237",
    createdAt: "2025-08-30 18:41",
    customer: { name: "Lucas Meyer", email: "lucas.m@example.com", country: "DE" },
    items: [{ sku: "PRINT-A2-CITY", title: "Print: Old Town (A2)", qty: 1, priceCZK: 2490 }],
    subtotalCZK: 2490,
    shippingCZK: 199,
    taxCZK: 0,
    totalCZK: 2689,
    status: "Completed",
    note: "Dostavljeno 01.09.",
  },
  {
    id: "ORD-10238",
    createdAt: "2025-08-31 10:03",
    customer: { name: "Eva K.", email: "eva.k@example.com", country: "CZ" },
    items: [{ sku: "GIFT-CARD-1000", title: "Gift Card 1000 CZK", qty: 1, priceCZK: 1000 }],
    subtotalCZK: 1000,
    shippingCZK: 0,
    taxCZK: 0,
    totalCZK: 1000,
    status: "Canceled",
    note: "Duplicirana porudžbina.",
  },
  {
    id: "ORD-10239",
    createdAt: "2025-09-01 16:22",
    customer: { name: "Klara H.", email: "klara.h@example.com", country: "CZ" },
    items: [{ sku: "PRINT-A3-PORTRAIT", title: "Print: Portrait (A3)", qty: 2, priceCZK: 1290 }],
    subtotalCZK: 2580,
    shippingCZK: 129,
    taxCZK: 0,
    totalCZK: 2709,
    status: "Refunded",
    note: "Oštećen paket – vraćen novac.",
  },
];

const STATUS = ["All", "Pending", "Paid", "Shipped", "Completed", "Canceled", "Refunded"];

// util
const czk = (n) => n.toLocaleString("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 });

const Orders = () => {
  const [orders, setOrders] = useState(MOCK);
  const [status, setStatus] = useState("All");
  const [q, setQ] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState(new Set()); // id-ovi
  const [detail, setDetail] = useState(null); // ceo order
  const [page, setPage] = useState(1);
  const perPage = 5;

  // KPI
  const kpi = useMemo(() => {
    const paid = orders.filter(o => ["Paid", "Shipped", "Completed"].includes(o.status));
    const revenue = paid.reduce((s, o) => s + o.totalCZK, 0);
    const pending = orders.filter(o => o.status === "Pending").length;
    const completed = orders.filter(o => o.status === "Completed").length;
    return { revenue, pending, completed, count: orders.length };
  }, [orders]);

  // filter + pretraga + datum
  const filtered = useMemo(() => {
    let list = [...orders];
    if (status !== "All") list = list.filter(o => o.status === status);
    const s = q.trim().toLowerCase();
    if (s) {
      list = list.filter(o =>
        o.id.toLowerCase().includes(s) ||
        o.customer.name.toLowerCase().includes(s) ||
        o.customer.email.toLowerCase().includes(s)
      );
    }
    if (dateFrom) {
      const from = new Date(dateFrom + "T00:00:00");
      list = list.filter(o => new Date(o.createdAt) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo + "T23:59:59");
      list = list.filter(o => new Date(o.createdAt) <= to);
    }
    return list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, status, q, dateFrom, dateTo]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);
  const pageData = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  // bulk select helpers
  const toggleSelect = (id) => {
    setSelected(prev => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };
  const toggleSelectAllPage = () => {
    const ids = pageData.map(o => o.id);
    setSelected(prev => {
      const copy = new Set(prev);
      const allSelected = ids.every(id => copy.has(id));
      if (allSelected) ids.forEach(id => copy.delete(id));
      else ids.forEach(id => copy.add(id));
      return copy;
    });
  };
  const clearSelection = () => setSelected(new Set());

  // mock akcije
  const markShipped = () => {
    setOrders(prev => prev.map(o => selected.has(o.id) ? { ...o, status: "Shipped" } : o));
    clearSelection();
  };
  const cancelOrders = () => {
    setOrders(prev => prev.map(o => selected.has(o.id) ? { ...o, status: "Canceled" } : o));
    clearSelection();
  };
  const refundOrders = () => {
    setOrders(prev => prev.map(o => selected.has(o.id) ? { ...o, status: "Refunded" } : o));
    clearSelection();
  };

  return (
    <main className="orders-page">
      {/* HERO */}
      <section className="orders-hero" role="banner">
        <div className="hero-inner">
          <h1 className="hero-title">Orders</h1>
          <p className="hero-subtitle">Prodaja printova i sessiona — pregled i upravljanje narudžbinama.</p>
        </div>
        <div className="hero-cut" aria-hidden="true" />
      </section>

      {/* KPIs */}
      <section className="orders-kpi">
        <div className="kpi-card">
          <span className="kpi-label">Total revenue</span>
          <strong className="kpi-value">{czk(kpi.revenue)}</strong>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Completed</span>
          <strong className="kpi-value">{kpi.completed}</strong>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Pending</span>
          <strong className="kpi-value">{kpi.pending}</strong>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">All orders</span>
          <strong className="kpi-value">{kpi.count}</strong>
        </div>
      </section>

      {/* Tools */}
      <section className="orders-tools" aria-label="Filters and search">
        <div className="left-tools">
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
            aria-label="From date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
            aria-label="To date"
          />
        </div>

        <div className="right-tools">
          <input
            type="search"
            placeholder="Search ID, name, email…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            aria-label="Search orders"
          />
          <button
            className="btn-outline-accent"
            onClick={() => {
              // brz export CSV (mock)
              const header = ["id","createdAt","name","email","country","status","totalCZK"].join(",");
              const rows = filtered.map(o => [
                o.id, o.createdAt, o.customer.name, o.customer.email, o.customer.country, o.status, o.totalCZK
              ].map(x => `"${String(x).replace(/"/g,'""')}"`).join(","));
              const csv = [header, ...rows].join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = "orders.csv"; a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export CSV
          </button>
        </div>
      </section>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <section className="orders-bulk">
          <span>{selected.size} selected</span>
          <div className="bulk-actions">
            <button className="btn-ghost" onClick={markShipped}>Mark as Shipped</button>
            <button className="btn-ghost" onClick={refundOrders}>Refund</button>
            <button className="btn-ghost" onClick={cancelOrders}>Cancel</button>
            <button className="btn-ghost" onClick={clearSelection}>Clear</button>
          </div>
        </section>
      )}

      {/* Table */}
      <section className="orders-table" aria-label="Orders table">
        <div className="table-head">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={pageData.every(o => selected.has(o.id)) && pageData.length > 0}
              onChange={toggleSelectAllPage}
            />
            <span>Select page</span>
          </label>
          <span>ID</span>
          <span>Date</span>
          <span>Customer</span>
          <span>Status</span>
          <span>Total</span>
          <span className="cell-actions">Actions</span>
        </div>

        <div className="table-body">
          {pageData.map(o => (
            <div key={o.id} className="row">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={selected.has(o.id)}
                  onChange={() => toggleSelect(o.id)}
                />
              </label>

              <button className="link-id" onClick={() => setDetail(o)} title="Open order">
                {o.id}
              </button>

              <span className="muted">{new Date(o.createdAt).toLocaleString()}</span>

              <div className="customer">
                <strong>{o.customer.name}</strong>
                <span className="muted">{o.customer.email}</span>
              </div>

              <span className={`badge ${o.status.replace("/","-").toLowerCase()}`}>{o.status}</span>

              <strong>{czk(o.totalCZK)}</strong>

              <div className="actions">
                <button className="btn-ghost" onClick={() => setDetail(o)}>View</button>
                {o.status === "Pending" && (
                  <button className="btn-ghost" onClick={() => {
                    setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: "Paid" } : x));
                  }}>Mark Paid</button>
                )}
                {["Paid"].includes(o.status) && (
                  <button className="btn-ghost" onClick={() => {
                    setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: "Shipped" } : x));
                  }}>Ship</button>
                )}
                {["Paid","Shipped","Completed"].includes(o.status) && (
                  <button className="btn-ghost" onClick={() => {
                    setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: "Refunded" } : x));
                  }}>Refund</button>
                )}
              </div>
            </div>
          ))}

          {pageData.length === 0 && (
            <div className="empty-state">
              <p>No orders found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      <section className="orders-pagination">
        <button
          className="btn-ghost"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          ← Prev
        </button>
        <span>Page {page} / {totalPages}</span>
        <button
          className="btn-ghost"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          Next →
        </button>
      </section>

      {/* Detail drawer */}
      {detail && (
        <div className="order-drawer" role="dialog" aria-modal="true" onClick={() => setDetail(null)}>
          <div className="drawer-inner" onClick={(e) => e.stopPropagation()}>
            <header className="drawer-head">
              <h3>Order {detail.id}</h3>
              <button className="close" onClick={() => setDetail(null)}>×</button>
            </header>

            <div className="drawer-grid">
              <div className="drawer-section">
                <h4>Customer</h4>
                <p><strong>{detail.customer.name}</strong></p>
                <p className="muted">{detail.customer.email} • {detail.customer.country}</p>
                <p className="muted">Created: {new Date(detail.createdAt).toLocaleString()}</p>
                {detail.note && <p className="note">“{detail.note}”</p>}
              </div>

              <div className="drawer-section">
                <h4>Items</h4>
                <ul className="items">
                  {detail.items.map(it => (
                    <li key={it.sku}>
                      <div className="item-title">
                        <strong>{it.title}</strong>
                        <small className="muted">SKU: {it.sku}</small>
                      </div>
                      <div className="item-meta">
                        <span>x{it.qty}</span>
                        <strong>{czk(it.priceCZK * it.qty)}</strong>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="totals">
                  <div><span>Subtotal</span><strong>{czk(detail.subtotalCZK)}</strong></div>
                  <div><span>Shipping</span><strong>{czk(detail.shippingCZK)}</strong></div>
                  <div><span>Tax</span><strong>{czk(detail.taxCZK)}</strong></div>
                  <div className="grand"><span>Total</span><strong>{czk(detail.totalCZK)}</strong></div>
                </div>
              </div>

              <div className="drawer-section">
                <h4>Status</h4>
                <span className={`badge ${detail.status.replace("/","-").toLowerCase()}`}>{detail.status}</span>
                <div className="drawer-actions">
                  {detail.status === "Pending" && (
                    <button className="btn-primary" onClick={() => {
                      setOrders(prev => prev.map(o => o.id === detail.id ? { ...o, status: "Paid" } : o));
                      setDetail({ ...detail, status: "Paid" });
                    }}>Mark Paid</button>
                  )}
                  {["Paid"].includes(detail.status) && (
                    <button className="btn-primary" onClick={() => {
                      setOrders(prev => prev.map(o => o.id === detail.id ? { ...o, status: "Shipped" } : o));
                      setDetail({ ...detail, status: "Shipped" });
                    }}>Ship</button>
                  )}
                  {["Paid","Shipped","Completed"].includes(detail.status) && (
                    <button className="btn-outline-accent" onClick={() => {
                      setOrders(prev => prev.map(o => o.id === detail.id ? { ...o, status: "Refunded" } : o));
                      setDetail({ ...detail, status: "Refunded" });
                    }}>Refund</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Orders;
