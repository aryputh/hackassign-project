import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import "../styles/global.css";

const TestCasePopup = ({ isOpen, onClose, assignmentId, testCase, refreshTestCases }) => {
    const [input, setInput] = useState("");
    const [expectedOutput, setExpectedOutput] = useState("");
    const [hint, setHint] = useState("");
    const [error, setError] = useState("");

    // Populate form if editing a test case
    useEffect(() => {
        if (testCase) {
            setInput(testCase.input);
            setExpectedOutput(testCase.expected_output);
            setHint(testCase.hint || "");
        } else {
            setInput("");
            setExpectedOutput("");
            setHint("");
        }
        setError("");
    }, [testCase]);

    const handleSubmit = async () => {
        if (!input.trim() || !expectedOutput.trim()) {
            setError("Input and Expected Output are required.");
            return;
        }

        const testCaseData = {
            assignment_id: assignmentId,
            input,
            expected_output: expectedOutput,
            hint: hint.trim() || null,
        };

        let response;
        if (testCase) {
            response = await supabase
                .from("test_cases")
                .update(testCaseData)
                .eq("id", testCase.id);
        } else {
            response = await supabase.from("test_cases").insert([testCaseData]);
        }

        if (response.error) {
            setError("Failed to save test case. Please try again.");
        } else {
            refreshTestCases(); // Refresh the list
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>{testCase ? "Edit Test Case" : "Add Test Case"}</h2>
                
                {error && <p className="error-text">{error}</p>}

                <label>Input:</label>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} />

                <label>Expected Output:</label>
                <textarea value={expectedOutput} onChange={(e) => setExpectedOutput(e.target.value)} />

                <label>Hint (optional):</label>
                <textarea value={hint} onChange={(e) => setHint(e.target.value)} />

                <div className="button-group">
                    <button className="primary-btn" onClick={handleSubmit}>
                        {testCase ? "Update" : "Add"}
                    </button>
                    <button className="secondary-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default TestCasePopup;
