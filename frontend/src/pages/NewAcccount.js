import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/NewAccount.css'

function NewAcccount() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');


    const navigate = useNavigate();

    const handleNewAccout = (e) => {
        e.preventDefault();
        if (username.trim() !== '' && password.trim() === verifyPassword.trim()) {
            navigate('/dashboard');
        }
        else {
            alert('Invalid Credentials');
        }


    };
    return (

        <div className="newaccount_container">
            <h1>Create NewAccount</h1>
            <div className="NewAccountContainer">

                <form onSubmit={handleNewAccout}>
                    <input
                        type="text"
                        placeholder="Enter your UserName"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="Enter your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    <input
                        type="verifyPassword"
                        placeholder="Verify Password"
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                    />
                    <br />
                    <button type="submit" >Create Account</button>
                </form>
            </div>
        </div >
    );

}


export default NewAcccount;