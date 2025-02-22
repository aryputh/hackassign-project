import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import Assignment from "./pages/Assignment";
import Analytics from "./pages/Analytics";
import ManageClass from "./pages/ManageClass";
import Submission from "./pages/Submission";
import AccessDenied from "./pages/AccessDenied";
import supabase from "./supabaseClient";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };

        fetchUser();

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Prevents incorrect redirects before user data is available
    }

    return (
        <Router>
            <Routes>
                {/* Redirect to dashboard if logged in */}
                <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Welcome />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/access-denied" />} />
                <Route path="/assignment" element={user ? <Assignment /> : <Navigate to="/access-denied" />} />
                <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/access-denied" />} />
                <Route path="/manageclass" element={user ? <ManageClass /> : <Navigate to="/access-denied" />} />
                <Route path="/submission" element={user ? <Submission /> : <Navigate to="/access-denied" />} />

                {/* Access Denied Page */}
                <Route path="/access-denied" element={<AccessDenied />} />

                {/* Catch-all: Redirect unknown paths */}
                <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
            </Routes>
        </Router>
    );
}

export default App;
