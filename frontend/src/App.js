import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import ClassPage from "./pages/ClassPage";
import AssignmentPage from "./pages/AssignmentPage";
import Analytics from "./pages/Analytics";
import ManageClass from "./pages/ManageClass";
import Submission from "./pages/Submission";
import AccessDenied from "./pages/AccessDenied";
import CodingPage from "./pages/CodingPage";
import supabase from "./supabaseClient";
import "./styles/global.css";

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

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Welcome />} />
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/access-denied" />} />
                <Route path="/class/:classId" element={user ? <ClassPage /> : <Navigate to="/access-denied" />} />
                <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/access-denied" />} />
                <Route path="/manageclass/:classId" element={user ? <ManageClass /> : <Navigate to="/access-denied" />} />
                <Route path="/assignment/:assignmentId" element={user ? <AssignmentPage /> : <Navigate to="/access-denied" />} />
                <Route path="/submission" element={user ? <Submission /> : <Navigate to="/access-denied" />} />
                <Route path="/codingpage" element={user ? <CodingPage /> : <Navigate to="/access-denied" />} />
                <Route path="/access-denied" element={<AccessDenied />} />
                <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
            </Routes>
        </Router>
    );
}

export default App;