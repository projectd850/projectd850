// pages/UserManagement.jsx
import React, { useMemo, useState, useEffect } from "react";
import "./UserManagement.css";

const ROLES = ["All roles", "user", "photographer", "admin"];
const STATUSES = ["All statuses", "active", "pending", "suspended", "deactivated"];

const MOCK_USERS = [
  { id: "u-2043", name: "Jan Novák",   username: "jan_n",     email: "jan.n@example.com",  role: "user",         status: "active",      joined: "2025-09-01 10:12" },
  { id: "u-2042", name: "Ana K.",      username: "anak",      email: "ana.k@example.com",   role: "photographer", status: "active",      joined: "2025-09-01 09:44" },
  { id: "u-2041", name: "Marko L.",    username: "markolens", email: "marko.l@example.com", role: "photographer", status: "pending",      joined: "2025-08-31 18:03" },
  { id: "u-2040", name: "Petra Veselá",username: "petra_v",   email: "petra.v@example.com", role: "user",         status: "active",      joined: "2025-08-31 15:21" },
  { id: "u-2039", name: "Klara H.",    username: "klarah",    email: "klara.h@example.com", role: "user",         status: "suspended",   joined: "2025-08-30 11:10" },
  { id: "u-2038", name: "Lucas Meyer", username: "lucas_m",   email: "lucas.m@example.com", role: "user",         status: "deactivated", joined: "2025-08-29 16:42" },
  { id: "u-2037", name: "Admin",       username: "root",      email: "admin@example.com",   role: "admin",        status: "active",      joined: "2025-08-29 09:30" },
];

const pageSize = 6;

const UserManagement = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("All roles");
  const [status, setStatus] = useState("All statuses");
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState(new Set()); // bulk selection
  const [drawer, setDrawer] = useState(null); // selected user for detail
  const [showCreate, setShowCreate] = useState(false);

  // filter + search
  const filtered = useMemo(() => {
    let list = [...users];
    if (role !== "All roles") list = list.filter(u => u.role === role);
    if (status !== "All statuses") list = list.filter(u => u.status === status);
    const s = q.trim().toLowerCase();
    if (s) list = list.filter(u =>
      u.name.toLowerCase().includes(s) ||
      u.username.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s) ||
      u.id.toLowerCase().includes(s)
    );
    return list.sort((a,b) => new Date(b.joined) - new Date(a.joined));
  }, [users, role, status, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  // selection helpers
  const toggleSelect = (id) => {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };
  const toggleSelectPage = () => {
    const ids = pageData.map(u => u.id);
    setSelected(prev => {
      const s = new Set(prev);
      const all = ids.every(id => s.has(id));
      if (all) ids.forEach(id => s.delete(id));
      else ids.forEach(id => s.add(id));
      return s;
    });
  };
  const clearSelection = () => setSelected(new Set());

  // bulk actions (mock)
  const bulkPromote = () => {
    setUsers(prev => prev.map(u => selected.has(u.id) ? { ...u, role: u.role === "user" ? "photographer" : u.role } : u));
    clearSelection();
  };
  const bulkDemote = () => {
    setUsers(prev => prev.map(u => selected.has(u.id) ? { ...u, role: u.role === "admin" ? "photographer" : "user" } : u));
    clearSelection();
  };
  const bulkActivate = () => {
    setUsers(prev => prev.map(u => selected.has(u.id) ? { ...u, status: "active" } : u));
    clearSelection();
  };
  const bulkSuspend = () => {
    setUsers(prev => prev.map(u => selected.has(u.id) ? { ...u, status: "suspended" } : u));
    clearSelection();
  };
  const bulkDeactivate = () => {
    setUsers(prev => prev.map(u => selected.has(u.id) ? { ...u, status: "deactivated" } : u));
    clearSelection();
  };
  const bulkResetPw = () => {
    // ovde bi isao POST /admin/users/reset-password (ids: [...selected])
    alert(`Password reset link sent for: ${[...selected].join(", ")}`);
    clearSelection();
  };

  // export CSV (client-side)
  const exportCSV = () => {
    const header = ["id","name","username","email","role","status","joined"].join(",");
    const rows = filtered.map(u => [
      u.id,u.name,u.username,u.email,u.role,u.status,u.joined
    ].map(x => `"${String(x).replace(/"/g,'""')}"`).join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "users.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // create user (mock)
  const [createForm, setCreateForm] = useState({
    name: "", username: "", email: "", role: "user", status: "active"
  });
  const onCreate = (e) => {
    e.preventDefault();
    if (!createForm.name || !createForm.username || !/^\S+@\S+\.\S+$/.test(createForm.email)) return;
    const nu = {
      id: "u-" + Math.floor(Math.random()*9000 + 1000),
      joined: new Date().toISOString().slice(0,16).replace("T"," "),
      ...createForm
    };
    setUsers(prev => [nu, ...prev]);
    setShowCreate(false);
    setCreateForm({ name: "", username: "", email: "", role: "user", status: "active" });
    setPage(1);
  };

  // drawer (single user edit mock)
  const onDrawerSave = () => {
    setUsers(prev => prev.map(u => u.id === drawer.id ? drawer : u));
    setDrawer(null);
  };

  return (
    <main className="um-page">
      {/* HERO */}
      <section className="um-hero" role="banner">
        <div className="hero-inner">
          <h1 className="hero-title">User Management</h1>
          <p className="hero-subtitle">Pregled i upravljanje korisnicima, rolama i statusima.</p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => setShowCreate(true)}>Create user</button>
            <button className="btn-outline" onClick={exportCSV}>Export CSV</button>
          </div>
        </div>
        <div className="hero-cut" aria-hidden="true" />
      </section>

      {/* TOOLS */}
      <section className="um-tools">
        <div className="left">
          <input
            type="search"
            placeholder="Search name/username/email/ID…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            aria-label="Search users"
          />
          <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="right">
          <button className="btn-ghost" onClick={() => { setQ(""); setRole("All roles"); setStatus("All statuses"); setPage(1); }}>
            Reset
          </button>
        </div>
      </section>

      {/* BULK ACTIONS */}
      {selected.size > 0 && (
        <section className="um-bulk">
          <span>{selected.size} selected</span>
          <div className="actions">
            <button className="btn-ghost" onClick={bulkPromote}>Promote</button>
            <button className="btn-ghost" onClick={bulkDemote}>Demote</button>
            <button className="btn-ghost" onClick={bulkActivate}>Activate</button>
            <button className="btn-ghost" onClick={bulkSuspend}>Suspend</button>
            <button className="btn-ghost" onClick={bulkDeactivate}>Deactivate</button>
            <button className="btn-outline-accent" onClick={bulkResetPw}>Reset password</button>
            <button className="btn-ghost" onClick={clearSelection}>Clear</button>
          </div>
        </section>
      )}

      {/* TABLE */}
      <section className="um-table">
        <div className="thead">
          <label className="chk">
            <input
              type="checkbox"
              checked={pageData.length > 0 && pageData.every(u => selected.has(u.id))}
              onChange={toggleSelectPage}
            />
            <span>Select page</span>
          </label>
          <span>User</span>
          <span>Username</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Joined</span>
          <span className="hdr-actions">Actions</span>
        </div>

        <div className="tbody">
          {pageData.map(u => (
            <div className="tr" key={u.id}>
              <label className="chk">
                <input
                  type="checkbox"
                  checked={selected.has(u.id)}
                  onChange={() => toggleSelect(u.id)}
                />
              </label>

              <div className="cell-user">
                <div className="avatar">{(u.name || u.username).slice(0,1).toUpperCase()}</div>
                <div className="who">
                  <strong>{u.name}</strong>
                  <small className="muted">{u.id}</small>
                </div>
              </div>

              <span>@{u.username}</span>
              <span className="muted">{u.email}</span>
              <span className={`role ${u.role}`}>{u.role}</span>
              <span className={`badge ${u.status}`}>{u.status}</span>
              <span className="muted">{new Date(u.joined).toLocaleString()}</span>

              <div className="actions">
                <button className="btn-ghost" onClick={() => setDrawer({ ...u })}>Edit</button>
                <button className="btn-ghost" onClick={() => setSelected(s => new Set(s).add(u.id))}>Select</button>
              </div>
            </div>
          ))}

          {pageData.length === 0 && (
            <div className="empty-state">
              <p>No users found.</p>
            </div>
          )}
        </div>
      </section>

      {/* PAGINATION */}
      <section className="um-pagination">
        <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>← Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button className="btn-ghost" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next →</button>
      </section>

      {/* DRAWER: USER DETAIL */}
      {drawer && (
        <div className="um-drawer" role="dialog" aria-modal="true" onClick={() => setDrawer(null)}>
          <div className="drawer-inner" onClick={(e) => e.stopPropagation()}>
            <header className="drawer-head">
              <h3>User {drawer.id}</h3>
              <button className="close" onClick={() => setDrawer(null)}>×</button>
            </header>

            <div className="drawer-body">
              <div className="profile">
                <div className="avatar big">{(drawer.name || drawer.username).slice(0,1).toUpperCase()}</div>
                <div className="grid">
                  <label>
                    Name
                    <input type="text" value={drawer.name} onChange={(e) => setDrawer(d => ({ ...d, name: e.target.value }))} />
                  </label>
                  <label>
                    Username
                    <input type="text" value={drawer.username} onChange={(e) => setDrawer(d => ({ ...d, username: e.target.value }))} />
                  </label>
                  <label className="col-span-2">
                    Email
                    <input type="email" value={drawer.email} onChange={(e) => setDrawer(d => ({ ...d, email: e.target.value }))} />
                  </label>
                  <label>
                    Role
                    <select value={drawer.role} onChange={(e) => setDrawer(d => ({ ...d, role: e.target.value }))}>
                      <option>user</option>
                      <option>photographer</option>
                      <option>admin</option>
                    </select>
                  </label>
                  <label>
                    Status
                    <select value={drawer.status} onChange={(e) => setDrawer(d => ({ ...d, status: e.target.value }))}>
                      <option>active</option>
                      <option>pending</option>
                      <option>suspended</option>
                      <option>deactivated</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="drawer-actions">
                <button className="btn-primary" onClick={onDrawerSave}>Save</button>
                <button className="btn-outline-accent" onClick={() => alert("Password reset link sent")}>Reset password</button>
                <button className="btn-ghost" onClick={() => setDrawer(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {showCreate && (
        <div className="um-modal" role="dialog" aria-modal="true" onClick={() => setShowCreate(false)}>
          <form className="modal-inner" onClick={(e) => e.stopPropagation()} onSubmit={onCreate}>
            <h3>Create user</h3>
            <div className="grid">
              <label>
                Name
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </label>
              <label>
                Username
                <input
                  type="text"
                  value={createForm.username}
                  onChange={(e) => setCreateForm(f => ({ ...f, username: e.target.value }))}
                  required
                />
              </label>
              <label className="col-span-2">
                Email
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </label>
              <label>
                Role
                <select value={createForm.role} onChange={(e) => setCreateForm(f => ({ ...f, role: e.target.value }))}>
                  <option>user</option>
                  <option>photographer</option>
                  <option>admin</option>
                </select>
              </label>
              <label>
                Status
                <select value={createForm.status} onChange={(e) => setCreateForm(f => ({ ...f, status: e.target.value }))}>
                  <option>active</option>
                  <option>pending</option>
                  <option>suspended</option>
                  <option>deactivated</option>
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <button type="submit" className="btn-primary">Create</button>
              <button type="button" className="btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default UserManagement;
