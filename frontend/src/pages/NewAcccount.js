import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/NewAccount.css';

function NewAcccount() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false); // 👈 Loading state

    const navigate = useNavigate();

    const handleNewAccount = async (e) => {
        e.preventDefault();

        if (username.trim() === '' || password.trim() === '' || email.trim() === '') {
            alert('Please fill all fields');
            return;
        }

        if (password.trim() !== verifyPassword.trim()) {
            alert('Passwords do not match');
            return;
        }

        const newUser = {
            userName: username,
            userPassword: password,
            userEmail: email,
            userRole: 'staff',
        };

        console.log("📤 Sending new user data:", newUser);

        try {
            setLoading(true); // 🌀 Show loading message

            const response = await fetch('http://localhost:5000/api/insert-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();
            console.log("✅ Response from server:", data);

            if (response.status === 201) {
                alert('Account created successfully!');
                navigate('/dashboard');
            } else {
                alert(data.message || 'Failed to create account');
            }
        } catch (error) {
            console.error("❌ Error creating account:", error);
            alert('Something went wrong');
        } finally {
            setLoading(false); // 🔚 End loading
        }
    };

    return (
        <div className="newaccount_container">
            <h1>Create New Account</h1>
            <div className="NewAccountContainer">
                <form onSubmit={handleNewAccount}>
                    <input
                        type="text"
                        placeholder="Enter your Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <br />
                    <input
                        type="email"
                        placeholder="Enter your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        type="password"
                        placeholder="Verify Password"
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                    />
                    <br />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                {loading && <p className="loading-text">⏳ Please wait, creating your account...</p>}
            </div>
        </div>
    );
}

export default NewAcccount;
