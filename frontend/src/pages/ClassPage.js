import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import "../styles/classpage.css";

const ClassPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [classInfo, setClassInfo] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInstructor, setIsInstructor] = useState(false);

    useEffect(() => {
        const fetchClassData = async () => {
            setLoading(true);
            const { data: user } = await supabase.auth.getUser();
            if (!user?.user) {
                navigate("/");
                return;
            }

            const userId = user.user.id;
            const userMetadata = user.user.user_metadata;
            setIsInstructor(userMetadata.role === "instructor");

            const { data: classData, error: classError } = await supabase
                .from("classes")
                .select("id, name, instructor_id")
                .eq("id", classId)
                .single();

            if (classError) {
                console.error("❌ Error fetching class:", classError);
                navigate("/");
                return;
            }

            setClassInfo(classData);

            const { data: membersData } = await supabase
                .from("class_members")
                .select("user_id")
                .eq("class_id", classId);

            setStudents(membersData.map(member => member.user_id));
            setLoading(false);
        };

        fetchClassData();
    }, [classId, navigate]);

    return (
        <div>
            {loading ? <p>Loading...</p> : (
                <>
                    <h1>{classInfo.name}</h1>
                    <p>Instructor: {classInfo.instructor_id}</p>

                    {isInstructor && (
                        <div>
                            <h2>Manage Students</h2>
                            <ul>
                                {students.map(student => <li key={student}>{student}</li>)}
                            </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ClassPage;
