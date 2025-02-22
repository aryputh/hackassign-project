import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";

const Dashboard = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [instructorNames, setInstructorNames] = useState({}); // Store instructor usernames

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);

            // Get logged-in user
            const { data: user, error: userError } = await supabase.auth.getUser();
            if (userError || !user?.user) {
                console.error("❌ Error fetching user:", userError);
                setLoading(false);
                return;
            }

            // Fetch user's class data
            const userId = user.user.id;
            const { data: classData, error: classError } = await supabase
                .from("class_members")
                .select("class_id, classes(id, name, instructor_id)")
                .eq("user_id", userId);

            if (classError) {
                console.error("❌ Error fetching classes:", classError);
                setLoading(false);
                return;
            }

            const classList = classData.map(entry => entry.classes) || [];
            setClasses(classList);

            // Fetch instructor usernames
            const instructorIds = [...new Set(classList.map(cls => cls.instructor_id))]; // Remove duplicates
            if (instructorIds.length > 0) {
                const { data: instructorData, error: instructorError } = await supabase
                    .rpc("get_user_metadata", { user_ids: instructorIds });

                if (instructorError) {
                    console.error("❌ Error fetching instructor metadata:", instructorError);
                } else {
                    // Convert array to object { instructor_id: username }
                    const instructorMap = {};
                    instructorData.forEach(instr => {
                        instructorMap[instr.id] = instr.raw_user_meta_data.username;
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
        window.location.href = "/"; // Redirect to welcome page after sign out
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Welcome to Your Dashboard</h1>
            <button onClick={handleSignOut}>Sign Out</button>
            <div style={{ marginTop: "20px" }}>
                {loading ? (
                    <p>Loading classes...</p>
                ) : classes.length > 0 ? (
                    classes.map((classItem) => (
                        <div
                            key={classItem.id}
                            style={{
                                backgroundColor: "#f0f0f0",
                                padding: "15px",
                                marginBottom: "10px",
                                borderRadius: "8px"
                            }}
                        >
                            <h2>{classItem.name}</h2>
                            <p>
                                <strong>Instructor:</strong>{" "}
                                {instructorNames[classItem.instructor_id] || "Loading..."}
                            </p>
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
