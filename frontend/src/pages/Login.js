import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';  // Import the custom hook to access UserContext
import '../styles/Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUserName } = useUser();  // Get setUserName from useUser hook

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, userpassword: password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                console.log("✅ Authentication successful:", data);
                setUserName(username);  // Set the username in context
                navigate('/dashboard');
            } else {
                console.warn("❌ Authentication failed:", data.message);
                alert(data.message || 'Invalid credentials');
            }
        } catch (err) {
            console.error("❌ Error during login:", err);
            alert('Something went wrong. Please try again later.');
        }

        setLoading(false);
    };

    const handleCreateAccount = () => {
        if (!loading) navigate('/newaccount');
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
                    disabled={loading}
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <button
                className="newAccountButton"
                onClick={handleCreateAccount}
                disabled={loading}
            >
                {loading ? 'Please wait...' : 'Create New Account'}
            </button>

            {loading && <p style={{ color: '#888' }}>🔄 Authenticating...</p>}
        </div>
    );
}

export default Login;
