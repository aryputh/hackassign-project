import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthPopup from '../components/AuthPopup';

const Welcome = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div>
            <h1>Welcome to HackAssign</h1>
            <button className="primary-btn" onClick={() => setShowPopup(true)}>Continue</button>
            {showPopup && <AuthPopup setUser={setUser} closePopup={() => setShowPopup(false)} />}
        </div>
    );
};

export default Welcome;
