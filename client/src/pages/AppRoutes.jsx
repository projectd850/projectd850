import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

/**
 * Code-splitting (lazy) for faster initial load.
 * All pages are split into separate bundles.
 */

/* ===== Public pages ===== */
const Home = lazy(() => import("./Home"));
const Portfolio = lazy(() => import("./Portfolio"));
const About = lazy(() => import("./About"));
const Contact = lazy(() => import("./Contact"));
const Login = lazy(() => import("./Login"));
const Signup = lazy(() => import("./Signup"));
const LoginSuccess = lazy(() => import("./LoginSuccess"));
const PortfolioDetail = lazy(() => import("./PortfolioDetail"));
const BookPhotographer = lazy(() => import("./BookPhotographer"));

/* ===== User pages ===== */
const Dashboard = lazy(() => import("./Dashboard"));
const MyPortfolio = lazy(() => import("./MyPortfolio"));
const Marketplace = lazy(() => import("./Marketplace"));
const Community = lazy(() => import("./Community"));
const Messages = lazy(() => import("./Messages"));
const Orders = lazy(() => import("./Orders"));
const ProfileSettings = lazy(() => import("./ProfileSettings"));

/* ===== Admin pages ===== */
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const UserManagement = lazy(() => import("./admin/UserManagement"));
const ContentManagement = lazy(() => import("./admin/ContentManagement"));
const Transactions = lazy(() => import("./admin/Transactions"));
const SystemSettings = lazy(() => import("./admin/SystemSettings"));

/* ===== 404 (inline minimal) ===== */
const NotFound = () => (
  <section
    className="container"
    style={{ padding: "var(--padY) var(--padX)" }}
    aria-labelledby="nf-title"
  >
    <div
      className="card"
      role="alert"
      style={{
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: "12px",
        boxShadow: "0 10px 24px rgba(0,0,0,.08)",
        padding: "1.25rem",
      }}
    >
      <h1 id="nf-title" style={{ margin: 0, fontSize: "clamp(1.3rem, 3vw, 1.6rem)" }}>
        Page not found
      </h1>
      <p style={{ marginTop: ".5rem", color: "var(--muted, #444)" }}>
        The link may have changed or no longer exists.
      </p>
      <a
        href="/"
        className="btn btn--primary"
        aria-label="Back to homepage"
        style={{
          display: "inline-block",
          marginTop: "0.75rem",
          padding: ".7rem 1rem",
          borderRadius: "12px",
          background: "var(--brand, #800020)",
          color: "#fff",
          textDecoration: "none",
          boxShadow: "var(--shadow, 0 10px 24px rgba(0,0,0,.08))",
        }}
      >
        Homepage
      </a>
    </div>
  </section>
);

/* ===== Fallback UI for lazy loading ===== */
const Loading = () => (
  <div role="status" aria-live="polite" style={{ padding: "var(--padY) var(--padX)" }}>
    Loading…
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/loginsuccess" element={<LoginSuccess />} />
        <Route path="/portfolio/:username" element={<PortfolioDetail />} />
        <Route path="/portfolio/:username/book" element={<BookPhotographer />} />

        {/* User */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-portfolio" element={<MyPortfolio />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/community" element={<Community />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/content" element={<ContentManagement />} />
        <Route path="/admin/transactions" element={<Transactions />} />
        <Route path="/admin/settings" element={<SystemSettings />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
