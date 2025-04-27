import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

const AuthPopup = ({ closePopup }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const formatEmail = (username) => `${username}@hackassign.com`;

    const handleAuth = async () => {
        if (!username || !password) {
            setError("Please fill in all fields.");
            return;
        }

        const email = formatEmail(username);

        if (isRegistering) {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username, role, display_name: username },
                },
            });

            if (signUpError) {
                console.error(signUpError);
                setError(signUpError.message);
                return;
            }
        } else {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError("Incorrect username or password.");
                return;
            }
        }

        closePopup();
        navigate("/dashboard");
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <span className="secondary-btn" onClick={closePopup}>&times;</span>
                <h2>{isRegistering ? "Register" : "Login"}</h2>
                {error && <p className="error-text">{error}</p>}
                
                
                <input class="effect-5" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                {/* <span class="focus-border"></span> */}
                <input id= "password-input" class="effect-5" type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  />
                {/* <span class="focus-border"></span> */}
                
                
                {isRegistering && (
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                    </select>
                )}

                <div className="login-items-section">
                    <button className="primary-btn" onClick={handleAuth}>{isRegistering ? "Register" : "Login"}</button>
                    <p onClick={() => setIsRegistering(!isRegistering)} className="switch-link">
                        {isRegistering ? "Have an account? Login" : "No account? Register"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPopup;

