import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabaseClient";

const AnalyticsPage = () => {
    const { classId } = useParams();
    const [scores, setScores] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: assignmentData } = await supabase
                .from("assignments")
                .select("assignment_id, name")
                .eq("class_id", classId);

            setAssignments(assignmentData);

            const { data: scoreData } = await supabase
                .from("scores")
                .select("*, user_profiles(display_name, username)")
                .in("assignment_id", assignmentData.map(a => a.assignment_id));

            setScores(scoreData);

            const { data: studentData } = await supabase
                .from("class_members")
                .select("user_id, user_profiles(display_name, username)")
                .eq("class_id", classId);

            setStudents(studentData);
            setLoading(false);
        };

        fetchData();
    }, [classId]);

    if (loading) return <p>Loading analytics...</p>;

    const getStudentScores = (userId) => {
        return scores.filter(score => score.user_id === userId);
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Class Analytics</h1>
            <h2>Student Overview</h2>
            {students.map(({ user_id, user_profiles }) => {
                const studentScores = getStudentScores(user_id);
                const avg = studentScores.length > 0 ? Math.round(studentScores.reduce((acc, s) => acc + s.score, 0) / studentScores.length) : "N/A";
                return (
                    <div key={user_id} style={{ border: "1px solid #ccc", marginBottom: 10, padding: 10 }}>
                        <strong>{user_profiles.display_name} ({user_profiles.username})</strong>
                        <p>Average Score: {avg}</p>
                        <p>Assignments Completed: {studentScores.length}/{assignments.length}</p>
                        <ul>
                            {studentScores.map((s) => {
                                const assignmentName = assignments.find(a => a.assignment_id === s.assignment_id)?.name || "Unnamed";
                                return <li key={s.id}>{assignmentName}: {s.score}% ({s.attempts} attempt(s))</li>;
                            })}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

export default AnalyticsPage;
