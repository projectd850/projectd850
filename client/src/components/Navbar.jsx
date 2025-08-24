import React from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-logo">ProjectD850</div>
      <ul className="navbar-links">
        {/* Public (Guest) stranice */}
        <li>
          <NavLink exact="true" to="/" className="nav-link" activeclassname="active-link">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/portfolio" className="nav-link" activeclassname="active-link">
            Portfolios
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className="nav-link" activeclassname="active-link">
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className="nav-link" activeclassname="active-link">
            Contact
          </NavLink>
        </li>

        {/* Auth */}
        <li>
          <NavLink to="/login">
            <button className="login-btn">Login</button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/signup">
            <button className="login-btn">Signup</button>
          </NavLink>
        </li>

        {/* User dropdown */}
        <li className="dropdown right">
          <span className="dropbtn">User ▾</span>
          <div className="dropdown-content">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/my-portfolio">My Portfolio</NavLink>
            <NavLink to="/marketplace">Marketplace</NavLink>
            <NavLink to="/community">Community</NavLink>
            <NavLink to="/messages">Messages</NavLink>
            <NavLink to="/orders">Orders</NavLink>
            <NavLink to="/profile-settings">Profile Settings</NavLink>
          </div>
        </li>

        {/* Admin dropdown */}
        <li className="dropdown right">
          <span className="dropbtn">Admin ▾</span>
          <div className="dropdown-content">
            <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>
            <NavLink to="/admin/users">User Management</NavLink>
            <NavLink to="/admin/content">Content Management</NavLink>
            <NavLink to="/admin/transactions">Transactions</NavLink>
            <NavLink to="/admin/settings">System Settings</NavLink>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
