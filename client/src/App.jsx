import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./pages/AppRoutes";
import "./App.css";

/**
 * App wrapper:
 * - Provides Router context
 * - Global skip link for a11y
 * - Renders Navbar + routed pages
 */
function App() {
  return (
    <Router>
      {/* A11y: skip link for keyboard users */}
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <Navbar />

      {/* Main landmark for routed pages */}
      <main id="main" tabIndex="-1">
        <AppRoutes />
      </main>
    </Router>
  );
}

export default App;
