import React from "react";
import { Link } from "react-router-dom";

function ManageClass() {
  return (
    <div>
      <h1>Manage Class</h1>
      <nav>
        <Link to="/"><button>Welcome</button></Link>
        <Link to="/dashboard"><button>Dashboard</button></Link>
        <Link to="/assignment"><button>Assignment</button></Link>
        <Link to="/manage-class"><button>Manage Class</button></Link>
        <Link to="/analytics"><button>Analytics</button></Link>
      </nav>
    </div>
  );
}

export default ManageClass;
