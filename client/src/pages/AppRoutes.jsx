import React from "react";
import { Routes, Route } from "react-router-dom";

// Public pages
import Home from "./Home";
import Portfolio from "./Portfolio";
import About from "./About";
import Contact from "./Contact";
import Login from "./Login";
import Signup from "./Signup";
import LoginSuccess from "./LoginSuccess";
import PortfolioDetail from "./PortfolioDetail";
import BookPhotographer from "./BookPhotographer";

// User pages
import Dashboard from "./Dashboard";
import MyPortfolio from "./MyPortfolio";
import Marketplace from "./Marketplace";
import Community from "./Community";
import Messages from "./Messages";
import Orders from "./Orders";
import ProfileSettings from "./ProfileSettings";

// Admin pages
import AdminDashboard from "./admin/AdminDashboard";
import UserManagement from "./admin/UserManagement";
import ContentManagement from "./admin/ContentManagement";
import Transactions from "./admin/Transactions";
import SystemSettings from "./admin/SystemSettings";

const AppRoutes = () => {
  return (
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
    </Routes>
  );
};

export default AppRoutes;
