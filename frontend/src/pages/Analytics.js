import React from "react";
import { Link } from "react-router-dom";

function Analytics() {
  return (
    <div>
      <h1>Analytics</h1>
      <p>Analytics would be here.</p>
      <Link to="/dashboard"><button>Dashboard</button></Link>
    </div>
  );
}

export default Analytics;
