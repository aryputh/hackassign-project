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
        <Route path="/assignment/:id" element={<Assignment />} />
        <Route path="/manage-class/:id" element={<ManageClass />} />
        <Route path="/analytics/:id" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;