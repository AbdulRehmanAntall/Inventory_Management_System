import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/'); // Redirect back to login
    };

    return (
        <div className="dashboard-container">
            <h1>Welcome to Dashboard</h1>
            <p>You are successfully logged in!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;
