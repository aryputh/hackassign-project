import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import ManageClass from "./ManageClass";

const ClassPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [instructorName, setInstructorName] = useState("Unknown");
    const [loading, setLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);
    const [isInstructor, setIsInstructor] = useState(false);
    const [showManageClass, setShowManageClass] = useState(false);

    useEffect(() => {
        const fetchClass = async () => {
            setLoading(true);

            // Get the current user
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (!userData?.user) {
                navigate("/access-denied");
                return;
            }

            const userId = userData.user.id;

            // Fetch class data including instructor_id
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

            // Fetch instructor name from user_profiles
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

    const refreshClassName = (newName) => {
        setClassData((prev) => ({ ...prev, name: newName }));
    };

    if (loading) return <p>Loading class...</p>;
    if (accessDenied) return navigate("/access-denied");

    return (
        <div>
            <h1>{classData?.name}</h1>
            <p><strong>Instructor:</strong> {instructorName}</p>

            {isInstructor && <button onClick={() => setShowManageClass(true)}>Manage Class</button>}
            <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>

            {showManageClass && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="button" onClick={() => setShowManageClass(false)}>✖</button>
                        <ManageClass 
                            classId={classId} 
                            closePopup={() => setShowManageClass(false)} 
                            refreshClassName={refreshClassName}  
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassPage;
