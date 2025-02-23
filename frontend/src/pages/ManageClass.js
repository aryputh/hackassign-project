import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";

function ManageClass({ classId, closePopup, refreshClassName }) {
    const [className, setClassName] = useState("");
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [newUser, setNewUser] = useState("");
    const [errorText, setErrorText] = useState("");

    useEffect(() => {
        fetchClassDetails();
        fetchCurrentUser();
        fetchStudents();
    }, [classId]);

    const fetchClassDetails = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("classes")
            .select("name, instructor_id")
            .eq("id", classId)
            .single();

        if (error) {
            setErrorText("Error fetching class details.");
            console.error("Error fetching class details:", error);
        } else {
            setClassName(data.name);
        }
        setLoading(false);
    };

    const fetchCurrentUser = async () => {
        const { data: user, error } = await supabase.auth.getUser();
        if (error) {
            console.error("Error fetching current user:", error);
            return;
        }
        setCurrentUser(user.user.id);
    };

    const fetchStudents = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("class_members")
            .select("user_id")
            .eq("class_id", classId);

        if (data) {
            const userIds = data.map(user => user.user_id);
            
            const { data: profiles, error: profileError } = await supabase
                .from("user_profiles")
                .select("user_id, display_name")
                .in("user_id", userIds);

            if (profiles) {
                setStudents(profiles);
            } else {
                console.error("Error fetching user profiles:", profileError);
                setErrorText("Error fetching user profiles.");
            }
        } else {
            console.error("Error fetching students:", error);
            setErrorText("Error fetching students.");
        }

        setLoading(false);
    };

    const handleUpdateClass = async () => {
        setErrorText("");
        const { error } = await supabase
            .from("classes")
            .update({ name: className })
            .eq("id", classId);

        if (error) {
            setErrorText("Error updating class.");
            return;
        }

        refreshClassName(className);
    };

    const handleDeleteClass = async () => {
        if (!window.confirm("Are you sure you want to delete this class?")) return;

        try {
            // Step 1: Delete all students from the class
            const { error: removeError } = await supabase
                .from("class_members")
                .delete()
                .eq("class_id", classId);

            if (removeError) {
                console.error("Error removing students:", removeError);
                alert("Error removing students before deleting the class.");
                return;
            }

            console.log("All class members removed successfully.");

            // Step 2: Delete the class
            const { error: deleteError } = await supabase
                .from("classes")
                .delete()
                .eq("id", classId);

            if (deleteError) {
                console.error("Error deleting class:", deleteError);
                alert("Error deleting class.");
                return;
            }

            console.log("Class deleted successfully!");
            alert("Class deleted successfully!");
            closePopup();
            window.location.href = "/dashboard";
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("An unexpected error occurred while deleting the class.");
        }
    };

    const handleRemoveStudent = async (studentId) => {
        if (studentId === currentUser) {
            alert("You cannot remove yourself from the class.");
            return;
        }

        const { error } = await supabase
            .from("class_members")
            .delete()
            .eq("user_id", studentId)
            .eq("class_id", classId);

        if (error) {
            console.error("Error removing student:", error);
            setErrorText("Error removing student.");
        } else {
            setStudents(students.filter(student => student.user_id !== studentId));
        }
    };

    const handleAddUser = async () => {
        setErrorText("");
        if (!newUser) {
            setErrorText("Enter a username to add.");
            return;
        }

        const email = `${newUser}@hackassign.com`;

        // Fetch user ID from user_profiles
        const { data: userProfile, error: profileError } = await supabase
            .from("user_profiles")
            .select("user_id, display_name")
            .eq("email", email)
            .single();

        if (profileError || !userProfile) {
            setErrorText("User not found.");
            return;
        }

        const userId = userProfile.user_id;
        const displayName = userProfile.display_name || newUser;

        // Attempt to insert user into class_members
        const { error: insertError } = await supabase
            .from("class_members")
            .insert([{ class_id: classId, user_id: userId }]);

        if (insertError) {
            if (insertError.code === "23505") {
                // Unique constraint violation (user already in class)
                setErrorText("User is already in the class.");
            } else {
                setErrorText("Error adding user.");
                console.error("Error adding user:", insertError);
            }
            return;
        }

        // Update state immediately instead of refetching
        setStudents(prevStudents => [...prevStudents, { id: userId, display_name: displayName }]);
        setNewUser(""); // Reset input field
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h1>Manage Class</h1>
                <label>Class Name:</label>
                <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                />
                <button onClick={handleUpdateClass}>Save Changes</button>
                <button onClick={handleDeleteClass} className="button delete">
                    Delete Class
                </button>

                <h2>Class Students</h2>
                {loading ? (
                    <p>Loading students...</p>
                ) : students.length > 0 ? (
                    <ul>
                        {students.map((student) => (
                            <li key={student.user_id}>
                                {student.display_name}
                                {student.user_id !== currentUser && (
                                    <button onClick={() => handleRemoveStudent(student.user_id)}>
                                        Remove
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No students in this class yet.</p>
                )}

                <h2>Add User</h2>
                <input
                    type="text"
                    placeholder="Enter username"
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                />
                <button onClick={handleAddUser}>Add User</button>

                {errorText && <p className="error-text">{errorText}</p>}
                <button onClick={closePopup} className="button">
                    Close
                </button>
            </div>
        </div>
    );
}

export default ManageClass;
