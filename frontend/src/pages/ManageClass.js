import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "../styles/global.css";

const ManageClass = ({ classId, closePopup, refreshClassName }) => {
    const [className, setClassName] = useState("");
    const [students, setStudents] = useState([]);
    const [newStudentUsername, setNewStudentUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [instructorId, setInstructorId] = useState(null);

    useEffect(() => {
        const fetchClassDetails = async () => {
            const { data: classData, error: classError } = await supabase
                .from("classes")
                .select("name, instructor_id")
                .eq("id", classId)
                .single();

            if (!classError && classData) {
                setClassName(classData.name);
                setInstructorId(classData.instructor_id);
            }

            const { data: studentData, error: studentError } = await supabase
                .from("class_members")
                .select("user_id")
                .eq("class_id", classId);

            if (!studentError && studentData.length > 0) {
                const userIds = studentData.map(entry => entry.user_id);
                const { data: users, error: usersError } = await supabase
                    .from("user_profiles")
                    .select("user_id, display_name, email")
                    .in("user_id", userIds);

                if (!usersError) {
                    setStudents(users);
                }
            }
        };

        fetchClassDetails();
    }, [classId]);

    const handleClassNameChange = async () => {
        const { error } = await supabase.from("classes").update({ name: className }).eq("id", classId);
        if (!error) {
            refreshClassName(className);
        }
    };

    const handleAddStudent = async () => {
        setErrorMessage("");
        const { data: user, error } = await supabase
            .from("user_profiles")
            .select("user_id, display_name, email")
            .eq("display_name", newStudentUsername)
            .single();

        if (error || !user) {
            setErrorMessage("User not found.");
            return;
        }

        const { data: existing } = await supabase
            .from("class_members")
            .select("user_id")
            .eq("class_id", classId)
            .eq("user_id", user.user_id);

        if (existing && existing.length > 0) {
            setErrorMessage("Student is already in the class.");
            return;
        }

        const { insertError } = await supabase.from("class_members").insert([{ class_id: classId, user_id: user.user_id }]);
        if (!insertError) {
            setStudents([...students, { user_id: user.user_id, display_name: user.display_name, email: user.email }]);
            setNewStudentUsername("");
        } else {
            setErrorMessage("Failed to add student.");
        }
    };

    const handleRemoveStudent = async (userId) => {
        if (userId === instructorId) {
            setErrorMessage("Instructor cannot be removed.");
            return;
        }

        const { error } = await supabase.from("class_members").delete().eq("class_id", classId).eq("user_id", userId);
        if (!error) {
            setStudents(students.filter(student => student.user_id !== userId));
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Manage Class</h2>
                <label>Class Name:</label>
                <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                />
                <button className="primary-btn" onClick={handleClassNameChange}>Save Name</button>
                <h3>Students</h3>
                <ul>
                    {students.length > 0 ? (
                        students.map((student) => (
                            <li key={student.user_id}>
                                {student.display_name} ({student.email})
                                {student.user_id !== instructorId && (
                                    <button className="danger-btn" onClick={() => handleRemoveStudent(student.user_id)}>Remove</button>
                                )}
                            </li>
                        ))
                    ) : (
                        <p>No students enrolled.</p>
                    )}
                </ul>
                <input
                    type="text"
                    placeholder="Student Username"
                    value={newStudentUsername}
                    onChange={(e) => setNewStudentUsername(e.target.value)}
                />
                <button className="primary-btn" onClick={handleAddStudent}>Add Student</button>
                {errorMessage && <p className="error-text">{errorMessage}</p>}
                <button className="secondary-btn" onClick={closePopup}>Close</button>
            </div>
        </div>
    );
};

export default ManageClass;
