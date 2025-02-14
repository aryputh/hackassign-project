import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import Assignment from "./pages/Assignment";
import ManageClass from "./pages/ManageClass";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <Router>
        <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assignment" element={<Assignment />} />
        <Route path="/manage-class" element={<ManageClass />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;