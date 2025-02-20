import React from "react";
import { Link } from "react-router-dom";

function Assignment() {
  return (
    <div>
      <h1>Assignment</h1>
      <p>Assignment would be here.</p>
      <Link to="/dashboard"><button>Dashboard</button></Link>
    </div>
  );
}

export default Assignment;
