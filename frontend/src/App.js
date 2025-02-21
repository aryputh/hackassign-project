import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Assignment from './pages/Assignment';
import Analytics from './pages/Analytics';
import ManageClass from './pages/ManageClass';
import Submission from './pages/Submission';
import PrivateRoute from './components/PrivateRoute';

function App() {
    const [user, setUser] = useState(() => {
        // Get user from localStorage if it exists
        return JSON.parse(localStorage.getItem('user')) || null;
    });

    useEffect(() => {
        // Save user to localStorage whenever it changes
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Setup routes such that you must be logged in to access pages except welcome page
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Welcome user={user} setUser={setUser} />} />
                <Route path="/dashboard" element={<PrivateRoute user={user}><Dashboard user={user} /></PrivateRoute>} />
                <Route path="/assignment" element={<PrivateRoute user={user}><Assignment user={user} /></PrivateRoute>} />
                <Route path="/analytics" element={<PrivateRoute user={user}><Analytics user={user} /></PrivateRoute>} />
                <Route path="/manageclass" element={<PrivateRoute user={user}><ManageClass user={user} /></PrivateRoute>} />
                <Route path="/submission" element={<PrivateRoute user={user}><Submission user={user} /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
