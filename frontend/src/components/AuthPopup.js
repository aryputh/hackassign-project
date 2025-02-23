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
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: username,  // Use 'display_name' instead of 'username'
                        role
                    }
                }
            });
    
            if (signUpError) {
                setError(signUpError.message || "Error creating account. Try again.");
                return;
            }
        } else {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
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
                <h2>{isRegistering ? "Register" : "Login"}</h2>
                {error && <p className="error-text">{error}</p>}
                <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                
                {isRegistering && (
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                    </select>
                )}

                <button className="button" onClick={handleAuth}>{isRegistering ? "Register" : "Login"}</button>
                <button className="button" onClick={closePopup}>Cancel</button>
                <p className="p-link" onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? "Have an account? Login" : "No account? Register"}
                </p>
            </div>
        </div>
    );
};

export default AuthPopup;
