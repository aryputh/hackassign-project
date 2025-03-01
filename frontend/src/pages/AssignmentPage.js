import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import "../styles/global.css";

const AssignmentPage = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignment = async () => {
            const { data, error } = await supabase
                .from("assignments")
                .select("name, details, due_date, allow_late, class_id")
                .eq("assignment_id", assignmentId)
                .single();

            if (!error && data) {
                setAssignment(data);
            }
            setLoading(false);
        };

        fetchAssignment();
    }, [assignmentId]);

    if (loading) return <p>Loading assignment...</p>;
    if (!assignment) return <p>Assignment not found.</p>;

    return (
        <div className="assignment-container">
            <h1>{assignment.name}</h1>
            <p>{assignment.details}</p>
            <p><strong>Due Date:</strong> {new Date(assignment.due_date).toLocaleDateString()}</p>
            <p><strong>Late Submissions:</strong> {assignment.allow_late ? "Allowed" : "Not Allowed"}</p>
            <button className="secondary-btn" onClick={() => navigate(`/class/${assignment.class_id}`)}>Back to Class</button>
        </div>
    );
};

export default AssignmentPage;
