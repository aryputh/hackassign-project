import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import TestCasePopup from "../components/TestCasePopup";
import { runTestCase, getResult } from "../components/judgeZero";
import "../styles/global.css";

const AssignmentPage = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [testCases, setTestCases] = useState([]);
    const [scores, setScores] = useState([]);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [selectedTestCase, setSelectedTestCase] = useState(null)
    const [isInstructor, setIsInstructor] = useState(false);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState(109);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

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

            await fetchTestCases();
            if (classInfo.instructor_id === userId) await fetchScores();
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

        const fetchScores = async () => {
            const { data } = await supabase
                .from("scores")
                .select("*, user_profiles(display_name)")
                .eq("assignment_id", assignmentId);
            if (data) setScores(data);
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

    const handleRunTests = async () => {
        setIsRunning(true);
        setOutput("Running tests...");

        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;
        if (!userId) return;

        let results = [];
        let passedCount = 0;

        try {
            for (let test of testCases) {
                const token = await runTestCase(language, code, test.input, test.expected_output);
                let result = await getResult(token);
                while (result.status.id === 2) result = await getResult(token);

                const actualOutput = result.stdout?.trim() || "";
                //const passed = result.status.id === 3 && actualOutput.includes(test.expected_output.trim());
                const passed = actualOutput.includes(test.expected_output.trim());
                if (passed) passedCount++;

                const errorMessage = result.stderr || result.compile_output || result.message || "";

                let message = `Input: ${test.input}\nExpected: ${test.expected_output}\nReceived: ${actualOutput}\nResult: ${passed ? '✅ Passed' : '❌ Failed'}`;

                if (!passed) {
                    if (result.status.id !== 3 && errorMessage != "") {
                        message += `\nError: ${errorMessage}`;
                    }
                    if (test.hint) {
                        message += `\nHint: ${test.hint}`;
                    }
                }

                results.push(message);
            }

            setOutput(results.join('\n---\n'));

            const score = Math.round((passedCount / testCases.length) * 100);
            // Fetch current attempts
            const { data: existing } = await supabase
                .from("scores")
                .select("attempts")
                .eq("assignment_id", assignmentId)
                .eq("user_id", userId)
                .single();

            const attempts = existing?.attempts ? existing.attempts + 1 : 1;

            await supabase.from("scores").upsert({
                    assignment_id: assignmentId,
                    user_id: userId,
                    score,
                    last_submitted: new Date().toISOString(),
                    attempts,
                }, { onConflict: ["assignment_id", "user_id"] });
        } catch (err) {
            setOutput("❌ Compilation or Runtime Error:\n" + (err.response?.data?.message || err.message));
        }

        setIsRunning(false);
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

            {testCases.length > 0 && !isInstructor && (
                <>
                    <h2>Run Your Code</h2>
                    <select value={language} onChange={(e) => setLanguage(Number(e.target.value))}>
                        <option value={109}>Python</option>
                        <option value={91}>Java</option>
                        <option value={105}>C++</option>
                    </select>
                    <textarea
                        rows="10"
                        cols="80"
                        placeholder="Write your code here..."
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <br />
                    <button className="primary-btn" onClick={handleRunTests} disabled={isRunning}>
                        {isRunning ? "Running..." : "Run Test Cases"}
                    </button>

                    <h3>Output:</h3>
                    <pre className="output-box">{output}</pre>
                </>
            )}

{isInstructor && scores.length > 0 && (
                <>
                    <h2>Student Scores</h2>
                    <table className="score-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Score (%)</th>
                                <th>Attempts</th>
                                <th>Last Submitted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((s) => (
                                <tr key={s.user_id}>
                                    <td>{s.user_profiles?.display_name || s.user_id}</td>
                                    <td>{s.score}</td>
                                    <td>{s.attempts}</td>
                                    <td>{new Date(s.last_submitted).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

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
