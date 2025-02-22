import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

const Dashboard = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [instructorNames, setInstructorNames] = useState({});
    const [isInstructor, setIsInstructor] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [classTitle, setClassTitle] = useState("");
    const [classError, setClassError] = useState("");
    const navigate = useNavigate(); // For navigating to class pages

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            const { data: user, error: userError } = await supabase.auth.getUser();
            console.log(user.role); // Print our user role to console

            if (userError || !user?.user) {
                console.error("Error fetching user:", userError);
                setLoading(false);
                return;
            }

            const userId = user.user.id;
            const userMetadata = user.user.user_metadata;
            console.log(userMetadata); // Log user metadata
            console.log(user);
            setIsInstructor(userMetadata.role === "instructor");

            const { data: classData, error: classError } = await supabase
                .from("class_members")
                .select("class_id, classes(id, name, instructor_id)")
                .eq("user_id", userId);

            if (classError) {
                console.error("Error fetching classes:", classError);
                setLoading(false);
                return;
            }

            const classList = classData.map(entry => entry.classes).filter(cls => cls !== null);
            setClasses(classList);

            // Fetch instructor usernames
            const instructorIds = [...new Set(classList.map(cls => cls.instructor_id))];
            if (instructorIds.length > 0) {
                const { data: instructorData, error: instructorError } = await supabase
                    .rpc("get_user_metadata", { user_ids: instructorIds });

                if (instructorError) {
                    console.error("Error fetching instructor metadata:", instructorError);
                } else {
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
        window.location.href = "/";
    };

    const handleCreateClass = async () => {
        if (!classTitle.trim()) {
            setClassError("Class title cannot be empty!"); // Set error message
            return;
        }

        setClassError(""); // Clear error when valid

        setLoading(true);
        const { data: user } = await supabase.auth.getUser();
        if (!user?.user) {
            alert("User not found!");
            return;
        }

        const instructorId = user.user.id;
        console.log("Authenticated User ID:", instructorId);

        // Check what gets inserted
        console.log("Inserting into classes:", { name: classTitle, instructor_id: instructorId });

        const { data, error } = await supabase
            .from("classes")
            .insert([{ name: classTitle, instructor_id: instructorId }])
            .select();

        if (error) {
            console.error("Error creating class:", error);
            alert("Failed to create class!");
            setLoading(false);
            return;
        }

        const newClass = data[0];

        await supabase.from("class_members").insert([{ user_id: instructorId, class_id: newClass.id }]);

        setClasses([...classes, newClass]);
        setShowPopup(false);
        setClassTitle("");
        setLoading(false);
    };

    // Navigate to Class Page
    const handleClassClick = (classId) => {
        navigate(`/class/${classId}`);
    };

    return (
        <div>
            <h1>Welcome to Your Dashboard</h1>
            {isInstructor && (
                <button className="button" onClick={() => setShowPopup(true)}>
                    + Add Class
                </button>
            )}
            <button className="button" onClick={handleSignOut}>Sign Out</button>
            <div className="class-grid">
                {loading ? (
                    <p>Loading classes...</p>
                ) : classes.length > 0 ? (
                    classes.map((classItem) => (
                        <div 
                            key={classItem.id} 
                            className="class-card" 
                            onClick={() => handleClassClick(classItem.id)}
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
                        <h2>Create a New Class</h2>
                        {classError && <p className="error-text">{classError}</p>}
                        <input
                            type="text"
                            placeholder="Enter class title"
                            value={classTitle}
                            onChange={(e) => setClassTitle(e.target.value)}
                        />
                        <button className="button" onClick={handleCreateClass}>Create Class</button>
                        <button className="button" onClick={() => setShowPopup(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
