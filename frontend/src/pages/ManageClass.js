import React from "react";
import { Link } from "react-router-dom";

function ManageClass() {
  return (
    <div>
      <h1>Manage Class</h1>
      <p>Manage class would be here.</p>
      <Link to="/dashboard"><button>Dashboard</button></Link>
    </div>
  );
}

export default ManageClass;
