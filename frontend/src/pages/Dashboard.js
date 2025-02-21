import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";

const Dashboard = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            const { data: user, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user?.user) {
                console.error("❌ Error fetching user:", userError);
                setLoading(false);
                return;
            }

            const userId = user.user.id;
            const { data, error } = await supabase
                .from("class_members")
                .select("class_id, classes(id, name, instructor_id)")
                .eq("user_id", userId);

            if (error) {
                console.error("❌ Error fetching classes:", error);
                setLoading(false);
                return;
            }

            setClasses(data.map(entry => entry.classes) || []);
            setLoading(false);
        };

        fetchClasses();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/"; // Redirect to welcome page after sign out
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Welcome to Your Dashboard</h1>
            <button onClick={handleSignOut}>
                Sign Out
            </button>
            <div style={{ marginTop: "20px" }}>
                {loading ? (
                    <p>Loading classes...</p>
                ) : classes.length > 0 ? (
                    classes.map((classItem) => (
                        <div key={classItem.id} style={{ backgroundColor: "#f0f0f0", padding: "15px", marginBottom: "10px", borderRadius: "8px" }}>
                            <h2>{classItem.name}</h2>
                            <p><strong>Instructor:</strong> {classItem.instructor_id}</p>
                        </div>
                    ))
                ) : (
                    <p>No classes found.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
