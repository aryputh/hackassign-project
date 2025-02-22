import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

const ClassPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        const fetchClass = async () => {
            setLoading(true);
            const { data: user } = await supabase.auth.getUser();
            if (!user?.user) {
                navigate("/login"); // Redirect if not logged in
                return;
            }

            const userId = user.user.id;

            // Check if the user is part of the class
            const { data: classInfo, error } = await supabase
                .from("class_members")
                .select("classes(id, name)")
                .eq("user_id", userId)
                .eq("class_id", classId)
                .single();

            if (error || !classInfo) {
                setAccessDenied(true);
            } else {
                setClassData(classInfo.classes);
            }

            setLoading(false);
        };

        fetchClass();
    }, [classId, navigate]);

    if (loading) return <p>Loading class...</p>;
    if (accessDenied) return navigate("/access-denied"); // If they don't have permission to view page

    return (
        <div>
            <h1>{classData?.name}</h1>
            <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
        </div>
    );
};

export default ClassPage;
