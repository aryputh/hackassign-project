import React from "react";
import { Link } from "react-router-dom";

function Submission() {
  return (
    <div>
      <h4>Submission</h4>
      <p>Submission would be here.</p>
      <Link to="/dashboard"><button>Dashboard</button></Link>
    </div>
  );
}

export default Submission;
