/* Dashboard.js */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import "../styles/global.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [instructorNames, setInstructorNames] = useState({});

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);

            const { data: user, error: userError } = await supabase.auth.getUser();
            if (userError || !user?.user) {
                console.error("Error fetching user:", userError);
                setLoading(false);
                return;
            }

            const userId = user.user.id;
            const { data: classData, error: classError } = await supabase
                .from("class_members")
                .select("class_id, classes(id, name, instructor_id)")
                .eq("user_id", userId);

            if (classError) {
                console.error("Error fetching classes:", classError);
                setLoading(false);
                return;
            }

            const classList = classData.map(entry => entry.classes) || [];
            setClasses(classList);

            const instructorIds = [...new Set(classList.map(cls => cls.instructor_id))];
            if (instructorIds.length > 0) {
                const { data: instructorData, error: instructorError } = await supabase
                    .from("user_profiles")
                    .select("user_id, display_name")
                    .in("user_id", instructorIds);

                if (instructorError) {
                    console.error("Error fetching instructor metadata:", instructorError);
                } else {
                    const instructorMap = {};
                    instructorData.forEach(instr => {
                        instructorMap[instr.user_id] = instr.display_name;
                    });
                    setInstructorNames(instructorMap);
                }
            }

            setLoading(false);
        };

        fetchClasses();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <div className="dashboard-container">
            <h1>Welcome to Your Dashboard</h1>
            <button className="secondary-btn" onClick={handleSignOut}>Sign Out</button>
            <div className="class-grid">
                {loading ? (
                    <p>Loading classes...</p>
                ) : classes.length > 0 ? (
                    classes.map((classItem) => (
                        <div
                            key={classItem.id}
                            className="class-card"
                            onClick={() => navigate(`/class/${classItem.id}`)}
                        >
                            <h2>{classItem.name}</h2>
                            <p><strong>Instructor:</strong> {instructorNames[classItem.instructor_id] || "Unknown"}</p>
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
