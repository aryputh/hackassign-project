import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import TestCasePopup from "../components/TestCasePopup";
import "../styles/global.css";

const AssignmentPage = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [testCases, setTestCases] = useState([]);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [selectedTestCase, setSelectedTestCase] = useState(null)
    const [isInstructor, setIsInstructor] = useState(false);

    // Fetch assignment details
    useEffect(() => {
        const fetchAssignment = async () => {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData?.user) {
                navigate("/access-denied");
                return;
            }

            const userId = userData.user.id;

            const { data: assignmentInfo, error: assignmentError } = await supabase
                .from("assignments")
                .select("*, class_id")
                .eq("assignment_id", assignmentId)
                .single();

            if (assignmentError || !assignmentInfo) {
                return;
            }

            setAssignment(assignmentInfo);

            const { data: classInfo, error: classError } = await supabase
                .from("classes")
                .select("instructor_id")
                .eq("id", assignmentInfo.class_id)
                .single();

            if (!classError && classInfo) {
                setIsInstructor(classInfo.instructor_id === userId);
            }

            fetchTestCases();
        };

        // Fetch test cases for the assignment
        const fetchTestCases = async () => {
            const { data, error } = await supabase
                .from("test_cases")
                .select("*")
                .eq("assignment_id", assignmentId);

            if (!error && data) {
                setTestCases(data);
            }
        };

        fetchAssignment();
        setLoading(false);
    }, [assignmentId, navigate]);

    // Add new test case
    const refreshTestCases = async () => {
        const { data, error } = await supabase
            .from("test_cases")
            .select("*")
            .eq("assignment_id", assignmentId);

        if (!error) {
            setTestCases(data);
        }
    };

    const openPopup = (testCase = null) => {
        setSelectedTestCase(testCase);
        setPopupOpen(true);
    };

    if (loading) return <p>Loading assignment...</p>;
    if (!assignment) return <p>Assignment not found.</p>;

    return (
        <div className="assignment-container">
            <h1>{assignment.name}</h1>
            <p>{assignment.details}</p>
            <p><strong>Due Date:</strong> {assignment.due_date}</p>
            <p><strong>Late Submissions:</strong> {assignment.allow_late ? "Allowed" : "Not Allowed"}</p>
            <button className="secondary-btn" onClick={() => navigate(`/class/${assignment.class_id}`)}>Back to Class</button>

            <h2>Test Cases</h2>
            {isInstructor && (
                <button className="primary-btn" onClick={() => openPopup(null)}>Add Test Case</button>
            )}

            <ul className="test-case-list">
                {testCases.map((testCase) => (
                    <li key={testCase.id} className="test-case-item">
                        <span><strong>Input:</strong> {testCase.input}</span>
                        <span><br></br><strong>Expected Output:</strong> {testCase.expected_output}</span>
                        {testCase.hint && <span><br></br><strong>Hint:</strong> {testCase.hint}</span>}

                        {isInstructor && (
                            <div className="button-group">
                                <button className="primary-btn" onClick={() => openPopup(testCase)}>Manage</button>
                                <button className="danger-btn" onClick={async () => {
                                    await supabase.from("test_cases").delete().eq("id", testCase.id);
                                    refreshTestCases(); // Refresh list after deletion
                                }}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <TestCasePopup 
                isOpen={isPopupOpen} 
                onClose={() => setPopupOpen(false)} 
                assignmentId={assignmentId} 
                testCase={selectedTestCase} 
                refreshTestCases={refreshTestCases}
            />
        </div>
    );
};

export default AssignmentPage;
