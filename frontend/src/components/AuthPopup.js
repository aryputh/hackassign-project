import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const AuthPopup = ({ setUser, closePopup }) => {
    const [isRegistering, setIsRegistering] = useState(false); // tracks if they're registering or logging in
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAuth = async () => {
        // if either field is empty
        if (!username || !password) {
            setError('Please fill in all fields.');
            return;
        }

        // if the user is registering
        if (isRegistering) {
            const { data: existingUser, error: checkError } = await supabase
                .from('users')
                .select('username')
                .eq('username', username)
                .single();

            // if something in the database goes wrong (access, etc.)
            if (checkError && checkError.code !== 'PGRST116') {
                setError('Error checking username. Please try again.');
                return;
            }

            // if the username is already taken
            if (existingUser) {
                setError('Username already taken.');
                return;
            }

            const { error: insertError } = await supabase.from('users').insert([
                { username, password, role: 'student' }
            ]);

            if (insertError) {
                setError('Error creating user. Try again.');
                return;
            }

            const newUser = { username, role: 'student' };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser)); // save signed in locally
            navigate('/dashboard'); // go to dashboard after registering
            closePopup(); // close the login/register popup
        } else {
            const { data: user, error: loginError } = await supabase
                .from('users')
                .select('*')
                .eq('username', username)
                .eq('password', password)
                .single();

            // check password and username
            if (loginError || !user) {
                setError('User not found or incorrect password.');
                return;
            }

            setUser(user);
            localStorage.setItem('user', JSON.stringify(user)); // save signed in locally
            navigate('/dashboard'); // got to dashboard after logging in
            closePopup(); // close the login/register popup
        }
    };

    return (
        <div className="auth-popup-overlay">
            <div className="auth-popup">
                <span className="close-btn" onClick={closePopup}>&times;</span>
                <h2>{isRegistering ? 'Register' : 'Login'}</h2>
                {error && <p className="error">{error}</p>}
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleAuth}>{isRegistering ? 'Register' : 'Login'}</button>
                <p onClick={() => setIsRegistering(!isRegistering)} className="switch-link">
                    {isRegistering ? 'Have an account? Login' : "No account? Register"}
                </p>
            </div>
        </div>
    );
};

export default AuthPopup;
