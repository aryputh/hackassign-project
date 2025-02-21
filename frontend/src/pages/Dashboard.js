import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [loggedOut, setLoggedOut] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('user'); // Remove user session
        setUser(null); // Update state
        setLoggedOut(true); // Show logged out message
    };

    return (
        <div>
            {loggedOut ? (
                <h1>Successfully logged out.</h1> // Show logged out message
            ) : (
                <h1>Welcome, {user?.username}!</h1> // If user logged in, show welcome message
            )}

            {!loggedOut && <button onClick={handleLogout}>Sign Out</button>} // Hide sign out button if user is already logged out
        </div>
    );
};

export default Dashboard;
