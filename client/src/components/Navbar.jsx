import React, { useEffect, useState, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const location = useLocation();
  const userBtnRef = useRef(null);
  const adminBtnRef = useRef(null);

  // Zatvori menije kad promeniš rutu
  useEffect(() => {
    setMobileOpen(false);
    setUserOpen(false);
    setAdminOpen(false);
  }, [location.pathname]);

  // Helper za aktivnu klasu (NavLink v6)
  const navClass = ({ isActive }) => (isActive ? "nav-link active-link" : "nav-link");

  // (primer) ako imaš auth/role state iz konteksta:
  const isLoggedIn = true; // zameni realnim stanjem
  const isAdmin = true;    // zameni realnim stanjem

  // Close on click outside dropdown
  useEffect(() => {
    const onClick = (e) => {
      if (userBtnRef.current && !userBtnRef.current.parentNode.contains(e.target)) {
        setUserOpen(false);
      }
      if (adminBtnRef.current && !adminBtnRef.current.parentNode.contains(e.target)) {
        setAdminOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        {/* Left: Logo */}
        <div className="navbar__left">
          <Link to="/" className="navbar__logo" aria-label="ProjectD850 Home">
            ProjectD850
          </Link>
        </div>

        {/* Center: primary links */}
        <ul className={`navbar__links ${mobileOpen ? "is-open" : ""}`} role="menubar">
          <li role="none">
            <NavLink to="/" className={navClass} role="menuitem" end>
              Home
            </NavLink>
          </li>
          <li role="none">
            <NavLink to="/portfolio" className={navClass} role="menuitem">
              Portfolios
            </NavLink>
          </li>
          <li role="none">
            <NavLink to="/about" className={navClass} role="menuitem">
              About
            </NavLink>
          </li>
          <li role="none">
            <NavLink to="/contact" className={navClass} role="menuitem">
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Right: actions (Login/Signup or User/Admin) */}
        <div className="navbar__actions">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="btn btn--ghost">Login</Link>
              <Link to="/signup" className="btn btn--primary">Signup</Link>
            </>
          ) : (
            <>
              {/* User dropdown */}
              <div className="dropdown">
                <button
                  ref={userBtnRef}
                  className="dropbtn"
                  onClick={() => setUserOpen((v) => !v)}
                  aria-expanded={userOpen}
                  aria-haspopup="menu"
                >
                  User ▾
                </button>
                <div className={`dropdown__menu ${userOpen ? "open" : ""}`} role="menu">
                  <NavLink to="/dashboard" className="dropdown__item" role="menuitem">Dashboard</NavLink>
                  <NavLink to="/my-portfolio" className="dropdown__item" role="menuitem">My Portfolio</NavLink>
                  <NavLink to="/marketplace" className="dropdown__item" role="menuitem">Marketplace</NavLink>
                  <NavLink to="/community" className="dropdown__item" role="menuitem">Community</NavLink>
                  <NavLink to="/messages" className="dropdown__item" role="menuitem">Messages</NavLink>
                  <NavLink to="/orders" className="dropdown__item" role="menuitem">Orders</NavLink>
                  <NavLink to="/profile-settings" className="dropdown__item" role="menuitem">Profile Settings</NavLink>
                </div>
              </div>

              {/* Admin dropdown (samo ako je admin) */}
              {isAdmin && (
                <div className="dropdown">
                  <button
                    ref={adminBtnRef}
                    className="dropbtn"
                    onClick={() => setAdminOpen((v) => !v)}
                    aria-expanded={adminOpen}
                    aria-haspopup="menu"
                  >
                    Admin ▾
                  </button>
                  <div className={`dropdown__menu ${adminOpen ? "open" : ""}`} role="menu">
                    <NavLink to="/admin/dashboard" className="dropdown__item" role="menuitem">Admin Dashboard</NavLink>
                    <NavLink to="/admin/users" className="dropdown__item" role="menuitem">User Management</NavLink>
                    <NavLink to="/admin/content" className="dropdown__item" role="menuitem">Content Management</NavLink>
                    <NavLink to="/admin/transactions" className="dropdown__item" role="menuitem">Transactions</NavLink>
                    <NavLink to="/admin/settings" className="dropdown__item" role="menuitem">System Settings</NavLink>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Hamburger (prikazuje/skriva center links na mobilu) */}
          <button
            className={`hamburger ${mobileOpen ? "is-open" : ""}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            aria-controls="primary-navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
