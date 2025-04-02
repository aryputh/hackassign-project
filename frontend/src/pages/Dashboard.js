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
    const [isInstructor, setIsInstructor] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [className, setClassName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setLoading(true);

        // Fetch the currently authenticated user
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError || !user?.user) {
            console.error("Error fetching user:", userError);
            setLoading(false);
            return;
        }

        const userId = user.user.id;

        // Check if user_metadata exists
        if (user.user.user_metadata) {
            const role = user.user.user_metadata?.role;
            setIsInstructor(role === "instructor");
        } else {
            console.warn("User metadata is not available!");
        }

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

    const handleAddClass = async () => {
        // Check if the class name is empty
        if (!className.trim()) {
            setErrorMessage("Class name cannot be empty.");
            return; // Prevent adding class if empty
        }

        // Clear previous error message
        setErrorMessage("");

        // Add new class to the database
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
            console.error("Error fetching user:", userError);
            return;
        }

        const instructorId = userData.user.id;

        const { data: classData, error: insertClassError } = await supabase
            .from("classes")
            .insert([{ name: className, instructor_id: instructorId }])
            .select();

        if (insertClassError) {
            console.error("Error adding class:", insertClassError);
        } else {
            console.log("Class data returned:", classData);

            if (!classData || !classData[0]) {
                console.error("Error: No class data returned after insert.");
                return;
            }

            const classId = classData[0].id;

            const { error: insertMemberError } = await supabase
                .from("class_members")
                .insert([{ class_id: classId, user_id: instructorId }]);

            if (insertMemberError) {
                console.error("Error adding instructor to class_members:", insertMemberError);
            } else {
                setShowPopup(false);
                setClassName(""); // Reset the form
                fetchClasses(); // Refresh class list after adding a new class
            }
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <div className="dashboard-container">
            <h1>Welcome to Your Dashboard</h1>
            <button className="secondary-btn" onClick={handleSignOut}>Sign Out</button>
            <button className="secondary-btn" onClick={() => navigate("/codingpage")}>Go to Compiler</button>

            {/* Show Add Class button only if the user is an instructor */}
            {isInstructor && (
                <button className="primary-btn" onClick={() => setShowPopup(true)}>
                    Add Class
                </button>
            )}

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

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Create New Class</h2>
                        <input
                            type="text"
                            placeholder="Enter class name"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                        />
                        {errorMessage && <p className="error-text">{errorMessage}</p>} {/* Display error message */}
                        <div className="popup-buttons">
                            <button className="secondary-btn" onClick={() => setShowPopup(false)}>
                                Cancel
                            </button>
                            <button className="primary-btn" onClick={handleAddClass}>
                                Add Class
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
