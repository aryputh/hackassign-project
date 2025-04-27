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


        <section className="welcome-container" data-description="Welcome Page">
            <div className="wrapper">
                <h1 className="mega montserrat bold">
                    Welcome to <span className="color-emphasis-1">HackAssign</span>
                </h1>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=keyboard_double_arrow_right" />

                <div className="login-symbol">
                <span class="material-symbols-outlined" onClick={() => setShowPopup(true)}>
                <span class="color-emphasis-1">
                keyboard_double_arrow_right

                </span>
                </span>
                </div>


                {showPopup && (
                    <AuthPopup setUser={setUser} closePopup={() => setShowPopup(false)} />
                )}
            </div>
        </section>


        /*
               <body>
            <div class="welcome-container">
            <h1 className="mega montserrat bold">Welcome to HackAssign</h1>
            <button onClick={() => setShowPopup(true)}>continue</button>
            {showPopup && <AuthPopup setUser={setUser} closePopup={() => setShowPopup(false)} />}
            </div>
                </body>
                
                <section data-description="Welcome Page">
                <div class="wrapper">
                    <h1 class="mega montserrat bold">Welcome to <span class="color-emphasis-1">HackAssign</span></h1>
        
                    <button className="primary-btn" onClick={() => setShowPopup(true)}>Continue</button>
                    {showPopup && <AuthPopup setUser={setUser} closePopup={() => setShowPopup(false)} />}
                </div>
                </section>
                */
    );
};

export default Welcome;

