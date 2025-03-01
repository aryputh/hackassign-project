import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import ManageClass from "./ManageClass";

const ClassPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [instructorName, setInstructorName] = useState("Unknown");
    const [loading, setLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);
    const [isInstructor, setIsInstructor] = useState(false);
    const [showManageClass, setShowManageClass] = useState(false);
    const [showAddAssignment, setShowAddAssignment] = useState(false);
    const [newAssignment, setNewAssignment] = useState({
        name: "",
        details: "",
        due_date: new Date().toISOString().split("T")[0],
        allow_late: false
    });

    useEffect(() => {
        const fetchClass = async () => {
            setLoading(true);

            const { data: userData } = await supabase.auth.getUser();
            if (!userData?.user) {
                navigate("/access-denied");
                return;
            }

            const userId = userData.user.id;

            const { data: classInfo, error: classError } = await supabase
                .from("classes")
                .select("id, name, instructor_id")
                .eq("id", classId)
                .single();

            if (classError || !classInfo) {
                setAccessDenied(true);
                setLoading(false);
                return;
            }

            setClassData(classInfo);
            setIsInstructor(classInfo.instructor_id === userId);

            await fetchAssignments();

            if (classInfo.instructor_id) {
                const { data: instructor, error: instructorError } = await supabase
                    .from("user_profiles")
                    .select("display_name")
                    .eq("user_id", classInfo.instructor_id)
                    .single();

                if (instructor) {
                    setInstructorName(instructor.display_name);
                } else {
                    console.error("Error fetching instructor name:", instructorError);
                }
            }

            setLoading(false);
        };

        fetchClass();
    }, [classId, navigate]);

    const fetchAssignments = async () => {
        const { data, error } = await supabase
            .from("assignments")
            .select("assignment_id, name, details, due_date, allow_late")
            .eq("class_id", classId);

        if (!error) {
            setAssignments(data);
        }
    };

    const handleAddAssignment = async () => {
        if (!newAssignment.name || !newAssignment.due_date) {
            alert("All fields except details are required.");
            return;
        }

        const { data, error } = await supabase.from("assignments").insert([{ 
            assignment_id: crypto.randomUUID(),
            class_id: classId,
            name: newAssignment.name,
            details: newAssignment.details || null,
            due_date: newAssignment.due_date,
            allow_late: newAssignment.allow_late
        }]).select();

        if (!error) {
            setShowAddAssignment(false);
            setNewAssignment({ name: "", details: "", due_date: new Date().toISOString().split("T")[0], allow_late: false });
            fetchAssignments();
        } else {
            alert("Failed to add assignment. Please check your input.");
            console.error("Supabase Error:", error);
        }
    };

    const refreshClassName = (newName) => {
        setClassData((prev) => ({ ...prev, name: newName }));
    };

    if (loading) return <p>Loading class...</p>;
    if (accessDenied) {
        navigate("/access-denied");
        return null;
    }

    return (
        <div>
            <h1>{classData?.name}</h1>
            <p><strong>Instructor:</strong> {instructorName}</p>

            <h2>Assignments</h2>
            <div className="assignment-grid">
                {assignments.length > 0 ? (
                    assignments.map((assignment) => (
                        <div key={assignment.assignment_id} className="assignment-card">
                            <h3>{assignment.name}</h3>
                            <p>{assignment.details}</p>
                            <p><strong>Due:</strong> {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "No due date"}</p>
                            <p><strong>Late Submissions:</strong> {assignment.allow_late ? "Allowed" : "Not Allowed"}</p>
                        </div>
                    ))
                ) : (
                    <p>No assignments yet.</p>
                )}
            </div>

            {isInstructor && (
                <>
                    <button onClick={() => setShowManageClass(true)}>Manage Class</button>
                    <button onClick={() => setShowAddAssignment(true)}>Add Assignment</button>
                </>
            )}
            <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>

            {showManageClass && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="button" onClick={() => setShowManageClass(false)}>x</button>
                        <ManageClass
                            classId={classId}
                            closePopup={() => setShowManageClass(false)}
                            refreshClassName={refreshClassName}
                        />
                    </div>
                </div>
            )}

            {showAddAssignment && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Add Assignment</h2>
                        <input type="text" placeholder="Name" value={newAssignment.name} onChange={(e) => setNewAssignment({ ...newAssignment, name: e.target.value })} />
                        <textarea placeholder="Details (Optional)" value={newAssignment.details} onChange={(e) => setNewAssignment({ ...newAssignment, details: e.target.value })} />
                        <input type="date" value={newAssignment.due_date} onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })} />
                        <label>
                            <input type="checkbox" checked={newAssignment.allow_late} onChange={(e) => setNewAssignment({ ...newAssignment, allow_late: e.target.checked })} />
                            Allow Late Submissions
                        </label>
                        <button onClick={handleAddAssignment}>Save</button>
                        <button onClick={() => setShowAddAssignment(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassPage;
