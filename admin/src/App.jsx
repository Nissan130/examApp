import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const adminName = "Admin"; // Demo admin name

  return (
    <Router>
      <Navbar adminName={adminName} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
