import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if ((username === 'abdulrehmanantall' || username === 'kainatasghar') && password === '789645') {
            navigate('/dashboard'); // Redirect to dashboard
        } else {
            alert('Invalid Credentials');
        }
    };
    const handleCreateAccount = () => {
        navigate('/newaccount');
    };
    return (
        <div className="login-container">
            <h1>Login Page</h1>
            <form className="login-form" onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="UserName"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />

                <button type="submit">Login</button>



            </form>
            <button className="newAccountButton" onClick={handleCreateAccount} >Create NewAccount</button>
        </div>
    );
}

export default Login;
