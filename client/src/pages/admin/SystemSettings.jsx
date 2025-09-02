// pages/admin/SystemSettings.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./SystemSettings.css";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "cs", label: "Čeština" },
  { code: "sr", label: "Srpski" },
];
const TIMEZONES = ["Europe/Prague", "Europe/Belgrade", "Europe/Vienna", "Europe/Berlin", "UTC"];
const CURRENCIES = ["CZK", "EUR", "USD"];

const SystemSettings = () => {
  // Tabs
  const [tab, setTab] = useState("general");

  // Toast
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  // GENERAL
  const [general, setGeneral] = useState({
    siteName: "ProjectD850",
    baseUrl: "https://projectd850.example",
    contactEmail: "support@projectd850.example",
    language: "sr",
    timezone: "Europe/Prague",
    currency: "CZK",
  });

  // BRANDING
  const [branding, setBranding] = useState({
    primary: "#800020",
    secondary: "#f0e6d6",
    logoFile: null,
    logoPreview: null,
    faviconFile: null,
    faviconPreview: null,
  });

  // EMAIL (SMTP)
  const [email, setEmail] = useState({
    provider: "SMTP",
    host: "smtp.mail.example",
    port: 587,
    secure: true,
    username: "apikey",
    password: "",
    fromName: "ProjectD850",
    fromAddress: "no-reply@projectd850.example",
  });

  // PAYMENTS
  const [payments, setPayments] = useState({
    mode: "Test", // Test | Live
    gateway: "Stripe", // Stripe | PayPal | Both
    stripePK: "pk_test_...",
    stripeSK: "",
    paypalClientId: "",
    paypalSecret: "",
  });

  // STORAGE / CDN
  const [storage, setStorage] = useState({
    provider: "Local", // Local | S3
    s3Bucket: "",
    s3Region: "",
    s3Key: "",
    s3Secret: "",
    cdnUrl: "",
  });

  // SECURITY
  const [security, setSecurity] = useState({
    enforce2FA: false,
    recaptchaSite: "",
    recaptchaSecret: "",
    pwMinLen: 8,
    rateLimitReqMin: 120,
  });

  // FEATURES
  const [features, setFeatures] = useState({
    community: true,
    marketplace: true,
    messages: true,
    orders: true,
    reviews: true,
  });

  // MAINTENANCE
  const [maintenance, setMaintenance] = useState({
    enabled: false,
    message: "We’re doing scheduled maintenance. Back soon.",
    startsAt: "",
    endsAt: "",
  });
  const [confirmMaint, setConfirmMaint] = useState(false);

  // ADVANCED
  const [showResetAll, setShowResetAll] = useState(false);

  // Helpers
  const set = (setter, key) => (e) => setter((s) => ({ ...s, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  // Branding: previews
  useEffect(() => {
    return () => {
      if (branding.logoPreview) URL.revokeObjectURL(branding.logoPreview);
      if (branding.faviconPreview) URL.revokeObjectURL(branding.faviconPreview);
    };
    // eslint-disable-next-line
  }, []);

  const importConfig = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const cfg = JSON.parse(reader.result);
        cfg.general && setGeneral((g) => ({ ...g, ...cfg.general }));
        cfg.branding && setBranding((b) => ({ ...b, ...cfg.branding, logoFile: null, faviconFile: null, logoPreview: null, faviconPreview: null }));
        cfg.email && setEmail((em) => ({ ...em, ...cfg.email }));
        cfg.payments && setPayments((p) => ({ ...p, ...cfg.payments }));
        cfg.storage && setStorage((st) => ({ ...st, ...cfg.storage }));
        cfg.security && setSecurity((sec) => ({ ...sec, ...cfg.security }));
        cfg.features && setFeatures((f) => ({ ...f, ...cfg.features }));
        cfg.maintenance && setMaintenance((m) => ({ ...m, ...cfg.maintenance }));
        setToast({ type: "success", text: "Config imported." });
      } catch (err) {
        setToast({ type: "error", text: "Invalid JSON config." });
      }
    };
    reader.readAsText(file);
  };

  const exportConfig = () => {
    const cfg = { general, branding: { ...branding, logoFile: undefined, faviconFile: undefined, logoPreview: undefined, faviconPreview: undefined }, email, payments, storage, security, features, maintenance };
    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "system-settings.json"; a.click();
    URL.revokeObjectURL(url);
  };

  // Simple validators
  const errors = useMemo(() => {
    const e = {};
    if (!general.siteName.trim()) e.siteName = "Required";
    if (!/^https?:\/\//i.test(general.baseUrl)) e.baseUrl = "Must start with http(s)://";
    if (!/^\S+@\S+\.\S+$/.test(general.contactEmail)) e.contactEmail = "Invalid email";
    if (email.port && isNaN(Number(email.port))) e.port = "Invalid port";
    if (email.fromAddress && !/^\S+@\S+\.\S+$/.test(email.fromAddress)) e.fromAddress = "Invalid email";
    if (storage.provider === "S3" && !storage.s3Bucket) e.s3Bucket = "Bucket required";
    if (security.pwMinLen < 6) e.pwMinLen = "Too short";
    return e;
  }, [general, email, storage, security]);

  // Save (mock)
  const saveAll = async () => {
    if (Object.keys(errors).length > 0) {
      setToast({ type: "error", text: "Please fix the highlighted fields." });
      return;
    }
    // ovde ide POST/PATCH na backend
    await new Promise((r) => setTimeout(r, 700));
    setToast({ type: "success", text: "Settings saved." });
  };

  // Test actions (mock)
  const testEmail = async () => {
    if (!email.host || !email.username || !email.fromAddress) {
      setToast({ type: "error", text: "Fill SMTP host, username and From address." });
      return;
    }
    await new Promise((r) => setTimeout(r, 600));
    setToast({ type: "success", text: "Test email queued (mock)." });
  };
  const testStripe = async () => {
    if (!payments.stripePK || !payments.stripeSK) {
      setToast({ type: "error", text: "Fill Stripe keys." });
      return;
    }
    await new Promise((r) => setTimeout(r, 600));
    setToast({ type: "success", text: "Stripe keys look valid (mock)." });
  };
  const testS3 = async () => {
    if (storage.provider !== "S3") {
      setToast({ type: "error", text: "Switch provider to S3 first." });
      return;
    }
    if (!storage.s3Bucket || !storage.s3Region || !storage.s3Key || !storage.s3Secret) {
      setToast({ type: "error", text: "Fill S3 credentials." });
      return;
    }
    await new Promise((r) => setTimeout(r, 600));
    setToast({ type: "success", text: "S3 connection OK (mock)." });
  };

  const copy = (text) => {
    navigator.clipboard?.writeText(text);
    setToast({ type: "success", text: "Copied to clipboard." });
  };

  const webhookStripe = `${general.baseUrl.replace(/\/+$/,"")}/api/webhooks/stripe`;
  const webhookPaypal = `${general.baseUrl.replace(/\/+$/,"")}/api/webhooks/paypal`;

  // Danger/maintenance mock actions
  const clearCache = async () => {
    await new Promise((r) => setTimeout(r, 500));
    setToast({ type: "success", text: "Cache cleared." });
  };
  const reindexSearch = async () => {
    await new Promise((r) => setTimeout(r, 900));
    setToast({ type: "success", text: "Search index rebuild started." });
  };
  const resetAll = async () => {
    setShowResetAll(false);
    // reset to minimal defaults
    setGeneral({ siteName: "", baseUrl: "http://localhost:5173", contactEmail: "", language: "en", timezone: "UTC", currency: "CZK" });
    setBranding({ primary: "#800020", secondary: "#f0e6d6", logoFile: null, logoPreview: null, faviconFile: null, faviconPreview: null });
    setEmail({ provider: "SMTP", host: "", port: 587, secure: true, username: "", password: "", fromName: "", fromAddress: "" });
    setPayments({ mode: "Test", gateway: "Stripe", stripePK: "", stripeSK: "", paypalClientId: "", paypalSecret: "" });
    setStorage({ provider: "Local", s3Bucket: "", s3Region: "", s3Key: "", s3Secret: "", cdnUrl: "" });
    setSecurity({ enforce2FA: false, recaptchaSite: "", recaptchaSecret: "", pwMinLen: 8, rateLimitReqMin: 120 });
    setFeatures({ community: true, marketplace: true, messages: true, orders: true, reviews: true });
    setMaintenance({ enabled: false, message: "", startsAt: "", endsAt: "" });
    setToast({ type: "success", text: "Settings reset (local state)." });
  };

  return (
    <main className="ss-page">
      {/* HERO */}
      <section className="ss-hero" role="banner">
        <div className="hero-inner">
          <h1 className="hero-title">System Settings</h1>
          <p className="hero-subtitle">Konfiguracija platforme: domen, brending, mejl, plaćanja, skladište, sigurnost i još.</p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={saveAll}>Save all</button>
            <button className="btn-outline" onClick={exportConfig}>Export config</button>
          </div>
        </div>
        <div className="hero-cut" aria-hidden="true" />
      </section>

      {/* TABS */}
      <section className="ss-tabs">
        {["general","branding","email","payments","storage","security","features","maintenance","advanced"].map(t => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </section>

      {/* CONTENT */}
      <section className="ss-content">
        {/* GENERAL */}
        {tab === "general" && (
          <div className="card">
            <h3 className="card-title">General</h3>
            <div className="grid">
              <label>
                Site name
                <input type="text" value={general.siteName} onChange={set(setGeneral, "siteName")} aria-invalid={!!errors.siteName} />
                {errors.siteName && <small className="error">{errors.siteName}</small>}
              </label>
              <label>
                Base URL
                <input type="url" value={general.baseUrl} onChange={set(setGeneral, "baseUrl")} aria-invalid={!!errors.baseUrl} placeholder="https://example.com" />
                {errors.baseUrl && <small className="error">{errors.baseUrl}</small>}
              </label>
              <label className="col-span-2">
                Contact email
                <input type="email" value={general.contactEmail} onChange={set(setGeneral, "contactEmail")} aria-invalid={!!errors.contactEmail} />
                {errors.contactEmail && <small className="error">{errors.contactEmail}</small>}
              </label>
              <label>
                Default language
                <select value={general.language} onChange={set(setGeneral, "language")}>
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </label>
              <label>
                Timezone
                <select value={general.timezone} onChange={set(setGeneral, "timezone")}>
                  {TIMEZONES.map(tz => <option key={tz}>{tz}</option>)}
                </select>
              </label>
              <label>
                Currency
                <select value={general.currency} onChange={set(setGeneral, "currency")}>
                  {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </label>
            </div>
            <div className="actions">
              <button className="btn-primary" onClick={saveAll}>Save</button>
            </div>
          </div>
        )}

        {/* BRANDING */}
        {tab === "branding" && (
          <div className="card">
            <h3 className="card-title">Branding</h3>
            <div className="grid">
              <label>
                Primary color
                <input type="color" value={branding.primary} onChange={(e) => setBranding(b => ({ ...b, primary: e.target.value }))} />
              </label>
              <label>
                Secondary color
                <input type="color" value={branding.secondary} onChange={(e) => setBranding(b => ({ ...b, secondary: e.target.value }))} />
              </label>

              <div className="brand-block col-span-2">
                <div className="media">
                  <div className="logo-preview" style={{ borderColor: branding.secondary }}>
                    {branding.logoPreview ? <img src={branding.logoPreview} alt="Logo preview" /> : <span>Logo preview</span>}
                  </div>
                  <div className="favicon-preview" style={{ borderColor: branding.secondary }}>
                    {branding.faviconPreview ? <img src={branding.faviconPreview} alt="Favicon preview" /> : <span>Favicon</span>}
                  </div>
                </div>
                <div className="uploaders">
                  <label className="btn-outline-accent">
                    Upload logo
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        const url = f ? URL.createObjectURL(f) : null;
                        setBranding(b => ({ ...b, logoFile: f, logoPreview: url }));
                      }}
                    />
                  </label>
                  <label className="btn-ghost">
                    Upload favicon
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        const url = f ? URL.createObjectURL(f) : null;
                        setBranding(b => ({ ...b, faviconFile: f, faviconPreview: url }));
                      }}
                    />
                  </label>
                  {(branding.logoFile || branding.faviconFile) && (
                    <button className="btn-ghost" onClick={() => setBranding(b => ({ ...b, logoFile: null, logoPreview: null, faviconFile: null, faviconPreview: null }))}>
                      Remove files
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="actions">
              <button className="btn-primary" onClick={saveAll}>Save</button>
            </div>
          </div>
        )}

        {/* EMAIL */}
        {tab === "email" && (
          <div className="card">
            <h3 className="card-title">Email (SMTP)</h3>
            <div className="grid">
              <label>
                Host
                <input type="text" value={email.host} onChange={set(setEmail, "host")} />
              </label>
              <label>
                Port
                <input type="number" value={email.port} onChange={set(setEmail, "port")} aria-invalid={!!errors.port} />
                {errors.port && <small className="error">{errors.port}</small>}
              </label>
              <label>
                Secure (TLS)
                <div className="switch">
                  <label>
                    <input type="checkbox" checked={email.secure} onChange={set(setEmail, "secure")} />
                    <span className="slider"></span>
                    <span className="label">Enabled</span>
                  </label>
                </div>
              </label>
              <label>
                Username
                <input type="text" value={email.username} onChange={set(setEmail, "username")} />
              </label>
              <label>
                Password
                <input type="password" value={email.password} onChange={set(setEmail, "password")} />
              </label>
              <label className="col-span-2">
                From name
                <input type="text" value={email.fromName} onChange={set(setEmail, "fromName")} />
              </label>
              <label className="col-span-2">
                From address
                <input type="email" value={email.fromAddress} onChange={set(setEmail, "fromAddress")} aria-invalid={!!errors.fromAddress} />
                {errors.fromAddress && <small className="error">{errors.fromAddress}</small>}
              </label>
            </div>
            <div className="actions">
              <button className="btn-primary" onClick={saveAll}>Save</button>
              <button className="btn-outline-accent" onClick={testEmail}>Send test email</button>
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {tab === "payments" && (
          <div className="card">
            <h3 className="card-title">Payments</h3>
            <div className="grid">
              <label>
                Mode
                <select value={payments.mode} onChange={set(setPayments, "mode")}>
                  <option>Test</option>
                  <option>Live</option>
                </select>
              </label>
              <label>
                Gateway
                <select value={payments.gateway} onChange={set(setPayments, "gateway")}>
                  <option>Stripe</option>
                  <option>PayPal</option>
                  <option>Both</option>
                </select>
              </label>

              <label className="col-span-2">
                Stripe publishable key
                <input type="text" value={payments.stripePK} onChange={set(setPayments, "stripePK")} placeholder="pk_test_…" />
              </label>
              <label className="col-span-2">
                Stripe secret key
                <input type="password" value={payments.stripeSK} onChange={set(setPayments, "stripeSK")} placeholder="sk_test_…" />
              </label>

              <label className="col-span-2">
                PayPal client ID
                <input type="text" value={payments.paypalClientId} onChange={set(setPayments, "paypalClientId")} />
              </label>
              <label className="col-span-2">
                PayPal secret
                <input type="password" value={payments.paypalSecret} onChange={set(setPayments, "paypalSecret")} />
              </label>

              <div className="col-span-2 webhook">
                <div>
                  <strong>Stripe webhook</strong>
                  <div className="webhook-row">
                    <input type="text" readOnly value={webhookStripe} />
                    <button className="btn-ghost" onClick={() => copy(webhookStripe)}>Copy</button>
                  </div>
                </div>
                <div>
                  <strong>PayPal webhook</strong>
                  <div className="webhook-row">
                    <input type="text" readOnly value={webhookPaypal} />
                    <button className="btn-ghost" onClick={() => copy(webhookPaypal)}>Copy</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="actions">
              <button className="btn-primary" onClick={saveAll}>Save</button>
              <button className="btn-outline-accent" onClick={testStripe}>Test keys</button>
            </div>
          </div>
        )}

        {/* STORAGE / CDN */}
        {tab === "storage" && (
          <div className="card">
            <h3 className="card-title">Storage & CDN</h3>
            <div className="grid">
              <label>
                Provider
                <select value={storage.provider} onChange={set(setStorage, "provider")}>
                  <option>Local</option>
                  <option>S3</option>
                </select>
              </label>
              <label className="col-span-2">
                CDN URL (optional)
                <input type="url" value={storage.cdnUrl} onChange={set(setStorage, "cdnUrl")} placeholder="https://cdn.example.com" />
              </label>

              {storage.provider === "S3" && (
                <>
                  <label>
                    S3 bucket
                    <input type="text" value={storage.s3Bucket} onChange={set(setStorage, "s3Bucket")} aria-invalid={!!errors.s3Bucket} />
                    {errors.s3Bucket && <small className="error">{errors.s3Bucket}</small>}
                  </label>
                  <label>
                    Region
                    <input type="text" value={storage.s3Region} onChange={set(setStorage, "s3Region")} placeholder="eu-central-1" />
                  </label>
                  <label>
                    Access key
                    <input type="text" value={storage.s3Key} onChange={set(setStorage, "s3Key")} />
                  </label>
                  <label>
                    Secret
                    <input type="password" value={storage.s3Secret} onChange={set(setStorage, "s3Secret")} />
                  </label>
                </>
              )}
            </div>
            <div className="actions">
              <button className="btn-primary" onClick={saveAll}>Save</button>
              <button className="btn-outline-accent" onClick={testS3}>Test connection</button>
            </div>
          </div>
        )}

        {/* SECURITY */}
        {tab === "security" && (
          <div className="card">
            <h3 className="card-title">Security</h3>
            <div className="grid">
              <div className="switch">
                <label>
                  <input type="checkbox" checked={security.enforce2FA} onChange={set(setSecurity, "enforce2FA")} />
                  <span className="slider"></span>
                  <span className="label">Enforce 2FA for admins</span>
                </label>
              </div>
              <label>
                Password min length
                <input type="number" value={security.pwMinLen} onChange={set(setSecurity, "pwMinLen")} aria-invalid={!!errors.pwMinLen} />
                {errors.pwMinLen && <small className="error">{errors.pwMinLen}</small>}
              </label>
              <label>
                Rate limit (req/min)
                <input type="number" value={security.rateLimitReqMin} onChange={set(setSecurity, "rateLimitReqMin")} />
              </label>
              <label className="col-span-2">
                reCAPTCHA site key
                <input type="text" value={security.recaptchaSite} onChange={set(setSecurity, "recaptchaSite")} />
              </label>
              <label className="col-span-2">
                reCAPTCHA secret
                <input type="password" value={security.recaptchaSecret} onChange={set(setSecurity, "recaptchaSecret")} />
              </label>
            </div>
            <div className="actions">
              <button className="btn-primary" onClick={saveAll}>Save</button>
            </div>
          </div>
        )}

        {/* FEATURES */}
        {tab === "features" && (
          <div className="card">
            <h3 className="card-title">Features</h3>
            <div className="grid">
              {Object.entries(features).map(([k, v]) => (
                <div className="switch" key={k}>
                  <label>
                    <input type="checkbox" checked={v} onChange={(e) => setFeatures(f => ({ ...f, [k]: e.target.checked }))} />
                    <span className="slider"></span>
                    <span className="label">{k[0].toUpperCase() + k.slice(1)}</span>
                  </label>
                </div>
              ))}
            </div>
            <div className="actions">
              <button className="btn-primary" onClick={saveAll}>Save</button>
            </div>
          </div>
        )}

        {/* MAINTENANCE */}
        {tab === "maintenance" && (
          <div className="card">
            <h3 className="card-title">Maintenance</h3>
            <div className="grid">
              <div className="switch">
                <label>
                  <input
                    type="checkbox"
                    checked={maintenance.enabled}
                    onChange={(e) => {
                      const val = e.target.checked;
                      if (val) setConfirmMaint(true);
                      setMaintenance(m => ({ ...m, enabled: val }));
                    }}
                  />
                  <span className="slider"></span>
                  <span className="label">Enable maintenance mode</span>
                </label>
              </div>

              <label className="col-span-2">
                Message (shown to users)
                <input type="text" value={maintenance.message} onChange={set(setMaintenance, "message")} />
              </label>

              <label>
                Starts at
                <input type="datetime-local" value={maintenance.startsAt} onChange={set(setMaintenance, "startsAt")} />
              </label>
              <label>
                Ends at
                <input type="datetime-local" value={maintenance.endsAt} onChange={set(setMaintenance, "endsAt")} />
              </label>
            </div>
            <div className="actions">
              <button className="btn-primary" onClick={saveAll}>Save</button>
            </div>
          </div>
        )}

        {/* ADVANCED */}
        {tab === "advanced" && (
          <>
            <div className="card">
              <h3 className="card-title">Advanced tools</h3>
              <div className="tools">
                <button className="btn-outline-accent" onClick={clearCache}>Clear cache</button>
                <button className="btn-ghost" onClick={reindexSearch}>Rebuild search index</button>
                <button className="btn-ghost" onClick={exportConfig}>Export config</button>
                <label className="btn-ghost">
                  Import config
                  <input type="file" accept="application/json" hidden onChange={importConfig} />
                </label>
              </div>
            </div>

            <div className="card danger">
              <h3 className="card-title">Danger Zone</h3>
              <p className="muted">Resetuje lokalnu konfiguraciju (ovaj UI). U produkciji uradi dobar backup pre bilo kakvih radikalnih izmena.</p>
              <button className="btn-danger" onClick={() => setShowResetAll(true)}>Reset all settings</button>
            </div>
          </>
        )}
      </section>

      {/* TOAST */}
      {toast && <div className={`toast ${toast.type}`}>{toast.text}</div>}

      {/* CONFIRM MAINTENANCE */}
      {confirmMaint && (
        <div className="ss-modal" role="dialog" aria-modal="true" onClick={() => setConfirmMaint(false)}>
          <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
            <h3>Enable maintenance mode?</h3>
            <p>Posetioci (koji nisu admin) će videti maintenance stranu dok je ovo aktivno.</p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setConfirmMaint(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => { setConfirmMaint(false); setToast({ type: "success", text: "Maintenance enabled (mock)." }); }}>Enable</button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM RESET */}
      {showResetAll && (
        <div className="ss-modal" role="dialog" aria-modal="true" onClick={() => setShowResetAll(false)}>
          <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
            <h3>Reset all settings?</h3>
            <p>Ovo vraća vrednosti u ovom UI-ju na podrazumevane. (Ne dira bazu jer je mock.)</p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowResetAll(false)}>Cancel</button>
              <button className="btn-danger" onClick={resetAll}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default SystemSettings;
