// pages/ProfileSettings.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./ProfileSettings.css";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "cs", label: "Čeština" },
  { code: "sr", label: "Srpski" },
];

const TIMEZONES = [
  "Europe/Prague",
  "Europe/Belgrade",
  "Europe/Vienna",
  "Europe/Berlin",
  "UTC",
];

const initialData = {
  name: "David Martinović",
  username: "projectd850",
  email: "david@example.com",
  bio: "Photographer based in Prague — portraits, street & cityscapes.",
  location: "Prague, CZ",
  website: "https://projectd850.example",
  instagram: "https://instagram.com/_project.focus_",
  twitter: "",
  facebook: "",
  language: "sr",
  timezone: "Europe/Prague",
  notifMarketing: false,
  notifComments: true,
  notifMessages: true,
};

const ProfileSettings = () => {
  const [form, setForm] = useState(initialData);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  // Password fields (odvojeno)
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });

  // Avatar preview
  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  // Simple validators
  const errors = useMemo(() => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^[a-z0-9_.-]{3,}$/i.test(form.username)) e.username = "Min 3 chars, letters/numbers/._-";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (form.website && !/^https?:\/\//i.test(form.website)) e.website = "Must start with http(s)://";
    if (form.instagram && !/^https?:\/\//i.test(form.instagram)) e.instagram = "Must start with http(s)://";
    if (form.twitter && !/^https?:\/\//i.test(form.twitter)) e.twitter = "Must start with http(s)://";
    if (form.facebook && !/^https?:\/\//i.test(form.facebook)) e.facebook = "Must start with http(s)://";
    return e;
  }, [form]);

  // Password strength
  const strength = useMemo(() => {
    const s = { score: 0, label: "Weak" };
    const v = pwd.next || "";
    if (v.length >= 8) s.score++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s.score++;
    if (/\d/.test(v)) s.score++;
    if (/[^A-Za-z0-9]/.test(v)) s.score++;
    s.label = ["Very weak", "Weak", "Okay", "Good", "Strong"][s.score] || "Very weak";
    return s;
  }, [pwd.next]);

  // Save (mock)
  const onSave = async () => {
    if (Object.keys(errors).length > 0) {
      setToast({ type: "error", text: "Please fix the highlighted fields." });
      return;
    }
    setSaving(true);
    // ovde ide upload avatara i PATCH profila
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    setToast({ type: "success", text: "Profile updated." });
  };

  // Change password (mock)
  const onChangePassword = async () => {
    if (!pwd.current || !pwd.next || !pwd.confirm) {
      setToast({ type: "error", text: "Fill out all password fields." });
      return;
    }
    if (pwd.next !== pwd.confirm) {
      setToast({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (strength.score < 2) {
      setToast({ type: "error", text: "Password too weak." });
      return;
    }
    await new Promise(r => setTimeout(r, 600));
    setPwd({ current: "", next: "", confirm: "" });
    setToast({ type: "success", text: "Password changed." });
  };

  // Delete account (mock)
  const onConfirmDelete = async () => {
    setShowDelete(false);
    await new Promise(r => setTimeout(r, 600));
    setToast({ type: "success", text: "Account deletion requested." });
    // redirect or logout kasnije
  };

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  // Utility
  const bind = (key) => ({
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <main className="profile-page">
      {/* HERO */}
      <section className="profile-hero" role="banner">
        <div className="hero-inner">
          <h1 className="hero-title">Profile Settings</h1>
          <p className="hero-subtitle">Update your public profile, preferences & security.</p>
        </div>
        <div className="hero-cut" aria-hidden="true" />
      </section>

      {/* CONTENT LAYOUT */}
      <section className="profile-layout">
        {/* LEFT: PROFILE */}
        <div className="card">
          <h2 className="card-title">Profile</h2>

          <div className="avatar-row">
            <div className="avatar">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" />
              ) : (
                <span>{(form.name || "?").slice(0,1).toUpperCase()}</span>
              )}
            </div>
            <div className="avatar-actions">
              <label className="btn-outline-accent">
                Upload avatar
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  hidden
                />
              </label>
              {avatarFile && (
                <button className="btn-ghost" onClick={() => setAvatarFile(null)}>Remove</button>
              )}
            </div>
          </div>

          <div className="grid">
            <label>
              Full name
              <input type="text" {...bind("name")} aria-invalid={!!errors.name} />
              {errors.name && <small className="error">{errors.name}</small>}
            </label>

            <label>
              Username
              <input type="text" {...bind("username")} aria-invalid={!!errors.username} />
              {errors.username && <small className="error">{errors.username}</small>}
            </label>

            <label className="col-span-2">
              Email
              <input type="email" {...bind("email")} aria-invalid={!!errors.email} />
              {errors.email && <small className="error">{errors.email}</small>}
            </label>

            <label className="col-span-2">
              Bio
              <textarea rows={3} {...bind("bio")} />
            </label>

            <label>
              Location
              <input type="text" {...bind("location")} />
            </label>

            <label>
              Website
              <input type="url" {...bind("website")} aria-invalid={!!errors.website} placeholder="https://…" />
              {errors.website && <small className="error">{errors.website}</small>}
            </label>
          </div>

          <div className="actions">
            <button className="btn-primary" onClick={onSave} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>

        {/* RIGHT: SOCIAL + PREFS + PASSWORD + DANGER */}
        <div className="stack">
          <div className="card">
            <h2 className="card-title">Social</h2>
            <div className="grid">
              <label className="col-span-2">
                Instagram
                <input type="url" {...bind("instagram")} aria-invalid={!!errors.instagram} placeholder="https://instagram.com/…" />
                {errors.instagram && <small className="error">{errors.instagram}</small>}
              </label>
              <label className="col-span-2">
                Twitter/X
                <input type="url" {...bind("twitter")} aria-invalid={!!errors.twitter} placeholder="https://x.com/…" />
                {errors.twitter && <small className="error">{errors.twitter}</small>}
              </label>
              <label className="col-span-2">
                Facebook
                <input type="url" {...bind("facebook")} aria-invalid={!!errors.facebook} placeholder="https://facebook.com/…" />
                {errors.facebook && <small className="error">{errors.facebook}</small>}
              </label>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Preferences</h2>
            <div className="grid">
              <label>
                Language
                <select {...bind("language")}>
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </label>

              <label>
                Timezone
                <select {...bind("timezone")}>
                  {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              </label>

              <div className="switch col-span-2">
                <label>
                  <input
                    type="checkbox"
                    checked={form.notifMessages}
                    onChange={(e) => setForm(f => ({ ...f, notifMessages: e.target.checked }))}
                  />
                  <span className="slider"></span>
                  <span className="label">Notify on new messages</span>
                </label>
              </div>

              <div className="switch col-span-2">
                <label>
                  <input
                    type="checkbox"
                    checked={form.notifComments}
                    onChange={(e) => setForm(f => ({ ...f, notifComments: e.target.checked }))}
                  />
                  <span className="slider"></span>
                  <span className="label">Notify on new comments</span>
                </label>
              </div>

              <div className="switch col-span-2">
                <label>
                  <input
                    type="checkbox"
                    checked={form.notifMarketing}
                    onChange={(e) => setForm(f => ({ ...f, notifMarketing: e.target.checked }))}
                  />
                  <span className="slider"></span>
                  <span className="label">Product news & tips</span>
                </label>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Password</h2>
            <div className="grid">
              <label className="col-span-2">
                Current password
                <input
                  type="password"
                  value={pwd.current}
                  onChange={(e) => setPwd(p => ({ ...p, current: e.target.value }))}
                />
              </label>
              <label>
                New password
                <input
                  type="password"
                  value={pwd.next}
                  onChange={(e) => setPwd(p => ({ ...p, next: e.target.value }))}
                />
                <div className={`strength s-${strength.score}`}>
                  <span className="bar" />
                  <span className="bar" />
                  <span className="bar" />
                  <span className="bar" />
                  <small>{strength.label}</small>
                </div>
              </label>
              <label>
                Confirm new password
                <input
                  type="password"
                  value={pwd.confirm}
                  onChange={(e) => setPwd(p => ({ ...p, confirm: e.target.value }))}
                />
              </label>
            </div>
            <div className="actions">
              <button className="btn-outline-accent" onClick={onChangePassword}>Change password</button>
            </div>
          </div>

          <div className="card danger">
            <h2 className="card-title">Danger Zone</h2>
            <p className="muted">
              Deleting your account is permanent and will remove your photos, posts and orders.
            </p>
            <button className="btn-danger" onClick={() => setShowDelete(true)}>
              Delete account
            </button>
          </div>
        </div>
      </section>

      {/* TOAST */}
      {toast && (
        <div className={`toast ${toast.type}`} role="status" aria-live="polite">
          {toast.text}
        </div>
      )}

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setShowDelete(false)}>
          <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
            <h3>Delete account?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowDelete(false)}>Cancel</button>
              <button className="btn-danger" onClick={onConfirmDelete}>Yes, delete</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProfileSettings;
