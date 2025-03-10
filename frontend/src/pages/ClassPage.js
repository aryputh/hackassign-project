import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import ManageClass from "./ManageClass";
import "../styles/global.css";

const ClassPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [instructorName, setInstructorName] = useState("Unknown");
    const [isInstructor, setIsInstructor] = useState(false);
    const [showManageClass, setShowManageClass] = useState(false);
    const [showAddAssignment, setShowAddAssignment] = useState(false);
    const [showEditAssignment, setShowEditAssignment] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [newAssignment, setNewAssignment] = useState({
        name: "",
        details: "",
        due_date: new Date().toISOString().split("T")[0],
        allow_late: false
    });

    useEffect(() => {
        const fetchClass = async () => {
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
                return;
            }

            setClassData(classInfo);
            setIsInstructor(classInfo.instructor_id === userId);

            fetchAssignments();

            if (classInfo.instructor_id) {
                const { data: instructor} = await supabase
                    .from("user_profiles")
                    .select("display_name")
                    .eq("user_id", classInfo.instructor_id)
                    .single();

                if (instructor) {
                    setInstructorName(instructor.display_name);
                }
            }
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

    const handleEditAssignment = (assignment) => {
        setSelectedAssignment(assignment);
        setShowEditAssignment(true);
    };

    const handleSaveAssignment = async () => {
        if (!newAssignment.name || !newAssignment.due_date) {
            window.alert("Name and due date are required.");
            return;
        }

        const { error } = await supabase
            .from("assignments")
            .insert({
                name: newAssignment.name,
                details: newAssignment.details,
                due_date: newAssignment.due_date,
                allow_late: newAssignment.allow_late,
                class_id: classId
            });

        if (!error) {
            setShowAddAssignment(false);
            fetchAssignments();
        }
    };

    const handleUpdateAssignment = async () => {
        if (!selectedAssignment.name || !selectedAssignment.due_date) {
            window.alert("Name and due date are required.");
            return;
        }

        const { error } = await supabase
            .from("assignments")
            .update({
                name: selectedAssignment.name,
                details: selectedAssignment.details,
                due_date: selectedAssignment.due_date,
                allow_late: selectedAssignment.allow_late
            })
            .eq("assignment_id", selectedAssignment.assignment_id);

        if (!error) {
            setShowEditAssignment(false);
            fetchAssignments();
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        const { error } = await supabase
            .from("assignments")
            .delete()
            .eq("assignment_id", assignmentId);

        if (!error) {
            fetchAssignments();
        }
    };

    return (
        <div className="class-container">
            <h1>{classData?.name}</h1>
            <p><strong>Instructor:</strong> {instructorName}</p>
            <h2>Assignments</h2>
            <div className="assignment-grid">
                {assignments.length > 0 ? (
                    assignments.map((assignment) => (
                        <div
                            key={assignment.assignment_id}
                            className="assignment-card"
                            onClick={() => navigate(`/assignment/${assignment.assignment_id}`)}
                        >
                            <h3>{assignment.name}</h3>
                            <p><strong>Due:</strong> {assignment.due_date}</p>
                            <p><strong>Late Submissions:</strong> {assignment.allow_late ? "Allowed" : "Not Allowed"}</p>
                            {isInstructor && (
                                <>
                                    <button className="primary-btn" onClick={(e) => { e.stopPropagation(); handleEditAssignment(assignment); }}>Manage Assignment</button>
                                    <button className="danger-btn" onClick={(e) => { e.stopPropagation(); handleDeleteAssignment(assignment.assignment_id); }}>Delete Assignment</button>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No assignments yet.</p>
                )}
            </div>
            {isInstructor && (
                <>
                    <button className="primary-btn" onClick={() => setShowManageClass(true)}>Manage Class</button>
                    <button className="primary-btn" onClick={() => setShowAddAssignment(true)}>Add Assignment</button>
                </>
            )}
            <button className="secondary-btn" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>

            {showManageClass && <ManageClass classId={classId} closePopup={() => setShowManageClass(false)} refreshClassName={(name) => setClassData(prev => ({ ...prev, name }))} />}

            {showAddAssignment && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Add Assignment</h2>
                        <input type="text" placeholder="Name" value={newAssignment.name} onChange={(e) => setNewAssignment({ ...newAssignment, name: e.target.value })} />
                        <textarea placeholder="Details" value={newAssignment.details} onChange={(e) => setNewAssignment({ ...newAssignment, details: e.target.value })} />
                        <input type="date" value={newAssignment.due_date} onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })} />
                        <label>
                            <input type="checkbox" checked={newAssignment.allow_late} onChange={(e) => setNewAssignment({ ...newAssignment, allow_late: e.target.checked })} />
                            Allow Late Submissions
                        </label>
                        <button className="primary-btn" onClick={handleSaveAssignment}>Save</button>
                        <button className="secondary-btn" onClick={() => setShowAddAssignment(false)}>Close</button>
                    </div>
                </div>
            )}

            {showEditAssignment && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Edit Assignment</h2>
                        <input type="text" placeholder="Name" value={selectedAssignment.name} onChange={(e) => setSelectedAssignment({ ...selectedAssignment, name: e.target.value })} />
                        <textarea placeholder="Details" value={selectedAssignment.details} onChange={(e) => setSelectedAssignment({ ...selectedAssignment, details: e.target.value })} />
                        <input type="date" value={selectedAssignment.due_date} onChange={(e) => setSelectedAssignment({ ...selectedAssignment, due_date: e.target.value })} />
                        <label>
                            <input type="checkbox" checked={selectedAssignment.allow_late} onChange={(e) => setSelectedAssignment({ ...selectedAssignment, allow_late: e.target.checked })} />
                            Allow Late Submissions
                        </label>
                        <button className="primary-btn" onClick={handleUpdateAssignment}>Update</button>
                        <button className="secondary-btn" onClick={() => setShowEditAssignment(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassPage;
